// Cloudflare Worker entry point (new unified Workers + Static Assets model).
// Handles POST /api/submit; every other request falls through to the static
// files in public/ via the ASSETS binding.
//
// Bindings expected (set in wrangler.toml / dashboard):
//   ASSETS          - static assets binding (auto-created from [assets] config)
//   DB              - D1 database binding
//   RESEND_API_KEY  - secret, from resend.com
//   NOTIFY_EMAIL    - the address that should receive submission alerts
//   RESEND_FROM     - verified "from" address in your Resend account
//
// Identity: when Cloudflare Access protects this site, every request carries
// a verified header: Cf-Access-Authenticated-User-Email. We treat that as
// the authoritative identity, never a browser-supplied email field.

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/submit' && request.method === 'POST') {
      return handleSubmit(request, env);
    }

    // Everything else: serve the static site from public/
    return env.ASSETS.fetch(request);
  },
};

async function handleSubmit(request, env) {
  try {
    const verifiedEmail = getVerifiedEmail(request);
    if (!verifiedEmail) {
      return json({ success: false, error: 'Verified identity is unavailable. Make sure Cloudflare Access is enabled for this site.' }, 401);
    }

    let data;
    try {
      data = await request.json();
    } catch (e) {
      return json({ success: false, error: 'Invalid JSON body.' }, 400);
    }

    const result = await processSubmission(env, data, verifiedEmail);
    return json(result, result.success ? 200 : 400);
  } catch (error) {
    console.error(error);
    return json({ success: false, error: error.message || String(error) }, 500);
  }
}

function getVerifiedEmail(request) {
  const email = request.headers.get('Cf-Access-Authenticated-User-Email');
  return email ? email.trim().toLowerCase() : '';
}

function clean(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function numberOrNull(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

async function processSubmission(env, data, verifiedEmail) {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Invalid submission data.' };
  }

  const attemptId = clean(data.attempt_id);
  if (!attemptId) {
    return { success: false, error: 'Missing Attempt ID.' };
  }

  // Duplicate check — same as the Google Sheet version's findAttemptId()
  const existing = await env.DB
    .prepare('SELECT id FROM dbda_responses WHERE attempt_id = ?')
    .bind(attemptId)
    .first();

  if (existing) {
    return {
      success: true,
      duplicate: true,
      message: 'This assessment has already been submitted.',
      attemptId,
      email: verifiedEmail,
    };
  }

  const candidateName = clean(data.candidate_name);
  const candidateId = clean(data.candidate_id);
  const candidateAge = clean(data.candidate_age);
  const candidateSex = clean(data.candidate_sex);
  const candidateOccupation = clean(data.candidate_occupation);
  const candidateEmailTyped = clean(data.candidate_email);
  const mobile = clean(data.candidate_mobile);
  const examinationDate = clean(data.examination_date);
  const normGroup = clean(data.norm_group);
  const normClass = clean(data.norm_class);
  const normSex = clean(data.norm_sex);
  const status = clean(data.status || 'completed');
  const submittedAt = clean(data.submitted_at) || new Date().toISOString();
  const tabFocusLoss = numberOrNull(data.tab_focus_loss) ?? 0;
  const appVersion = clean(data.app_version);

  const scoresJson = safeStringify(data.scores);
  const responsesJson = safeStringify(data.responses);
  const manualRawJson = safeStringify(data.manual_raw);
  const validityFlagsJson = safeStringify(data.validity_flags);
  const examinerNotesJson = safeStringify(data.examiner_notes);

  await env.DB.prepare(
    `INSERT INTO dbda_responses (
      attempt_id, session_id, session_code,
      candidate_name, candidate_id, candidate_age, candidate_sex, candidate_occupation,
      candidate_email, verified_email, candidate_mobile, examination_date,
      norm_group, norm_class, norm_sex, status, submitted_at, tab_focus_loss, app_version,
      scores_json, responses_json, manual_raw_json, validity_flags_json, examiner_notes_json
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    attemptId, clean(data.session_id), clean(data.session_code),
    candidateName, candidateId, candidateAge, candidateSex, candidateOccupation,
    candidateEmailTyped, verifiedEmail, mobile, examinationDate,
    normGroup, normClass, normSex, status, submittedAt, tabFocusLoss, appVersion,
    scoresJson, responsesJson, manualRawJson, validityFlagsJson, examinerNotesJson
  ).run();

  await sendNotificationEmail(env, {
    attemptId, candidateName, candidateId, verifiedEmail, mobile,
    examinationDate, status, scores: data.scores || {},
  }).catch((e) => console.error('Email notification failed:', e));

  return {
    success: true,
    duplicate: false,
    message: 'Assessment submitted successfully.',
    attemptId,
    email: verifiedEmail,
  };
}

function safeStringify(value) {
  try {
    return JSON.stringify(value ?? null);
  } catch (e) {
    return String(value);
  }
}

async function sendNotificationEmail(env, result) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL || !env.RESEND_FROM) return;

  const scoreLines = Object.entries(result.scores || {})
    .map(([key, s]) => `${key}: raw ${s?.raw ?? '-'}, sten ${s?.sten ?? '-'}, band ${s?.band ?? '-'}`)
    .join('\n');

  const body =
    `DBDA-R Candidate Self-Test Submission\n\n` +
    `CANDIDATE DETAILS\n-----------------------------\n` +
    `Candidate Name: ${result.candidateName}\n` +
    `Candidate ID: ${result.candidateId}\n` +
    `Verified Account: ${result.verifiedEmail}\n` +
    `Mobile: ${result.mobile}\n` +
    `Examination Date: ${result.examinationDate}\n\n` +
    `ATTEMPT INFORMATION\n-----------------------------\n` +
    `Attempt ID: ${result.attemptId}\n` +
    `Status: ${result.status}\n\n` +
    `SCORES\n-----------------------------\n${scoreLines}\n\n` +
    `The complete submission has been saved to D1.`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: env.NOTIFY_EMAIL,
      subject: `DBDA-R Assessment Submitted - ${result.candidateName} - ${result.attemptId}`,
      text: body,
    }),
  });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
