# DBDA-R — Cloudflare Pages build

Converted from the Google Apps Script version. The test UI, timer, scoring, and
all DBDA-R content are unchanged — only the plumbing changed:

| Piece | Apps Script version | This version |
|---|---|---|
| Frontend hosting | Apps Script Web App | Cloudflare Pages (`public/`) |
| Data bundle loading | `google.script.run.getDbdaBundle()` reading included `.html` files | plain `fetch()` of static `.json` files in `public/data/` |
| Submission | `google.script.run.submitCandidateSubmission()` | `POST /api/submit` (Pages Function) |
| Storage | Google Sheet | Cloudflare D1 (`dbda_responses` table) |
| Identity / auth | Forced Google sign-in via Apps Script access setting | Cloudflare Access (email one-time PIN), verified via `Cf-Access-Authenticated-User-Email` header |
| Notification email | `MailApp.sendEmail` (Gmail) | Resend API |

## File layout

```
public/
  index.html          the app shell (loads app.js + fetches data/*.json)
  app.js              all UI/timer/scoring logic (unchanged from App.html)
  data/
    key.json          scoring key       (was DBDA_Key.html)
    norms.json         norms tables      (was DBDA_Norms.html)
    groups.json        source groups     (was DBDA_SourceGroups.html)
    assets.json         (was DBDA_Assets.html)
    source-pages.json   (was DBDA_SourcePages.html)
functions/
  api/submit.js       submission endpoint (replaces Code.gs backend)
schema.sql            D1 table definition
wrangler.toml         Cloudflare project config
```

## Deploy steps

1. **Push this folder to a GitHub repo.**

2. **Create the D1 database:**
   ```
   npx wrangler d1 create dbda-db
   ```
   Copy the `database_id` it prints into `wrangler.toml`.

3. **Apply the schema:**
   ```
   npx wrangler d1 execute dbda-db --file=./schema.sql --remote
   ```

4. **Create the Pages project**, connecting it to your GitHub repo:
   Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
   Build output directory: `public`. No build command needed (static files).

5. **Bind the D1 database to the Pages project:**
   Pages project → Settings → Functions → D1 database bindings → add binding
   name `DB` pointing at `dbda-db`.

6. **Add environment variables/secrets** (Pages project → Settings → Environment variables):
   - `RESEND_API_KEY` — from resend.com (free tier)
   - `RESEND_FROM` — a verified sender address in your Resend account
   - `NOTIFY_EMAIL` — where submission alerts should go

7. **Set up Cloudflare Access** in front of the whole site:
   Zero Trust → Access → Applications → Add → Self-hosted → point at your
   Pages domain → login method: One-Time PIN → set the allowed email
   list/domain (e.g. only your organization's candidates).

8. **Redeploy** the Pages project so the bindings/env vars take effect.

9. **Test end-to-end:** open the site, complete the Access email login, run
   through a test attempt, and confirm a row appears in D1
   (`npx wrangler d1 execute dbda-db --command="SELECT * FROM dbda_responses" --remote`)
   and the notification email arrives.

## Notes

- The `data/*.json` files are the exact DBDA-R content you supplied, just
  renamed from `.html` to `.json` — no content was altered. They're served as
  static assets by Pages, so the old Apps Script size-limit workaround is no
  longer needed.
- `functions/api/submit.js` never trusts a browser-supplied email — it only
  accepts the identity Cloudflare Access verifies via the
  `Cf-Access-Authenticated-User-Email` header, matching the original design's
  intent (never use a client-claimed identity for scoring records).
- Cloudflare Access's free tier covers up to 50 authenticated users. If your
  candidate pool is larger, say so and I'll swap in a custom email
  magic-link flow backed by D1 instead.
