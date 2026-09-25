function bootDBDAApp(KEY,NORMS,DBDA_SOURCE_GROUPS_INPUT,DBDA_ASSETS,DBDA_SOURCE_PAGES){
  window.DBDA_ASSETS = DBDA_ASSETS;
/* ===================== DBDA-R Examiner Tool ===================== */
/* Educational/practical single-file build. All data stays in the browser. */

window.addEventListener('error', function(e){
  const app=document.getElementById('app');
  if(app && !app.dataset.dbdaError){
    app.dataset.dbdaError='1';
    app.innerHTML='<div class="wrap"><div class="notice">DBDA-R could not start: '+String(e.error?.message || e.message || e.error || e).replace(/[<>&]/g,m=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[m]))+'</div></div>';
  }
});

/* ---------- Browser persistence intentionally disabled ---------- */
/* ---------- Static item content (transcribed from the supplied questionnaire PDF) ---------- */

const VA1_ITEMS = [
 ["FAST",["old","rapid","slow","early","late"]],
 ["DECEIVE",["blunder","obtain","conceal","mislead","disclose"]],
 ["EXCESS",["waste","departure","surplus","tax","approach"]],
 ["BELIEVABLE",["admirable","real","personable","unlikely","credible"]],
 ["CONTEMPLATE",["heal","advance","meditate","rest","worry"]],
 ["AMIABLE",["friendly","humorous","healthy","convincing","polished"]],
 ["TURMOIL",["circular","turbulent","calm","spinning","air-borne"]],
 ["DECEPTIVE",["illogical","illusory","magical","visible","clear"]],
 ["WHIMSICAL",["unlike","musical","dancing","unpredictable","equatorial"]],
 ["APATHETIC",["ignorant","indifferent","pitiful","concerned","clever"]],
 ["ARDUOUS",["repulsive","loving","easy","interesting","strenuous"]],
 ["PLACATE",["cover","beautify","arouse","plasticize","appease"]],
 ["CLANDESTINE",["furtive","safe","tribal","open","healthful"]],
 ["VINDICATE",["deny","state","persecute","defend","accuse"]],
 ["INCULCATE",["grow","inquire","instill","compute","acquire"]],
];

const VA2_ITEMS = [
 ["STRIKE WHILE THE IRON IS HOT",["Take things as you find them","Hot love is soon cold","Make hay while the sun shines","First think and then speak","Look before you leap"]],
 ["IT NEVER RAINS BUT IT POURS",["cloudy mornings turn to clear evenings","misfortunes never come one at a time","easy come, easy go","the least predictable thing in life is the weather","every cloud has a silver lining"]],
 ["LET SLEEPING DOGS LIE",["as you make your bed, so you must lie on it","do not keep a dog and bark yourself","there will be sleeping enough in the grave","never look for trouble; let trouble look for you","an old dog does not bark for nothing"]],
 ["THERE IS NO VENOM LIKE THAT OF THE TONGUE",["the tongue of an idle person is never idle","talking pays no toll","few words are best","words cut more than swords","bad news travels fast"]],
 ["IT IS ALWAYS DARKEST BEFORE THE DAWN",["the longest day means the shortest night","what is done by night appears by day","he who runs in the dark may well stumble","he who gropes in the dark finds what he would not","when things are at the worst they will improve"]],
 ["ALL THAT GLITTERS IS NOT GOLD",["don't judge a book by its cover","all men can't be masters","gold dust blinds all eyes","money is the root of all evil","riches alone will not make a man happy"]],
 ["TOO MANY COOKS SPOIL THE BROTH",["too much praise is a burden","too much consulting confounds","truth needs not many words","actions speak louder than words","when needs is highest, help is nighest"]],
 ["A STITCH IN TIME SAVES NINE",["it is never too late to mend","time cures all things","prevention is better than cure","take time while time is, for time will away","it is no use crying over spilled milk"]],
 ["LITTLE STROKES FELL GREAT OAKS",["step after step the ladder is ascended","great strokes make not sweet music","tall oaks from little acorns grow","oaks may fall when reeds stand the storm","little things please little minds"]],
];

const NA_ITEMS = [
 {text:"Add: 41 + 57 + 88 + 34 =", opts:["230","218","200","220","219"]},
 {text:"Subtract: 967 \u2212 435 =", opts:["552","532","522","531","523"]},
 {text:"Multiply: 974 \u00d7 3 =", opts:["2822","2582","2922","2893","2904"]},
 {text:"Divide: 2226 \u00f7 7 =", opts:["318","316","324","326","213"]},
 {text:"Multiply: 253 \u00d7 20 =", opts:["5050","5060","4760","4750","4050"]},
 {text:"Subtract: 952 \u2212 727 =", opts:["224","234","235","225","325"]},
 {text:"Add: 9\u00b3\u2044\u2085 + 6\u00b9\u2044\u2082 =", opts:["16 1/10","16 1/5","15 4/5","15 1/10","15 9/10"]},
 {text:"Divide: 7.20 \u00f7 4.8 =", opts:["1.2","15.0","12.0","0.12","1.5"]},
 {text:"Multiply: 4.52 \u00d7 5 =", opts:["22.60","22.50","22.40","22.26","26.10"]},
 {text:"Divide: 1050 \u00f7 15 =", opts:["30","32","70","72","60"]},
 {text:"2 \u00d7 (25 \u2212 19) / 9 =", opts:["2/3","1 1/3","1 1/9","1 7/9","2 2/3"]},
 {text:"Which number could replace X in both places: 4 + X = 6 \u2212 X ?", opts:["4","3","2","1","\u22122"]},
 {text:"7/8 \u00d7 (7/10 \u2212 3/5) =", opts:["39/40","7/40","1 11/80","2 11/40","7/80"]},
 {text:"Subtract: 35\u00be \u2212 28\u2154 =", opts:["7 1/6","7 5/6","7 1/12","6 11/12","6 5/6"]},
 {text:"125% of 32 =", opts:["6","12","36","52","40"]},
 {text:"\u221a196 =", opts:["14","16","24","36","98"]},
 {text:"5/7 of 245 =", opts:["165","175","185","207","343"]},
 {text:"(1/2 \u2212 1/3) + 3/4 =", opts:["1/3","1/8","2/9","1 1/9","5/8"], flag:"Printed as '+' between the fraction terms; the official key (C) only resolves if the middle operation is read as division. Verify against the original booklet before relying on this item."},
 {text:"(1/2 + 1/3)\u00b2 =", opts:["1/8","81/256","17/64","25/64","1 1/4"], flag:"Official stencil: no option is correct on this item. No credit is given for any answer (item excluded from the raw-score denominator unless the examiner enables the credit toggle)."},
 {text:"(2/3 \u00d7 5/6) + 1/3 =", opts:["1 5/6","5/27","1 1/9","8/9","7/9"]},
];

const RA_ROWS = [
 ["DEPD","RFMR","SJUS","TVWT","GBBK"],
 ["XFGX","BLMB","KQRK","DTSD","MYZM"],
 ["FGHE","IJKH","LMNP","RSTQ","VWXU"],
 ["EDDG","IHHJ","NMMO","RQQS","TSSU"],
 ["VWVT","SVWV","VWVR","QVWV","VWPV"],
 ["CDED","LMOM","PQRQ","STUT","WXYX"],
 ["RYAA","BBRG","RPCC","DDRD","RLEE"],
 ["ORAR","PGRR","RBVR","RRUH","LRLX"],
 ["DECG","JKIL","MNLO","QRPS","UVTW"],
 ["BCFF","GHKK","KLNN","PQTT","VWZZ"],
 ["CGFJ","EIHL","GKJN","IMNR","MQPT"],
 ["HGFC","KJIG","NMLI","TSRO","YXWT"],
];

/* CL pairs: transcribed from a scanned PDF. Single-character differences are the whole point of
   this test, so OCR transcription risk is real -- every pair here is flagged for examiner
   verification against the original booklet before the CL score is treated as final. */
const CL_PAIRS = [
["1013295","1012395"],["krqpdisu","krqpdisu"],["79318453","79318435"],["KLSQAEPD","KLSQAEPD"],
["pdesqidt","pdesqidt"],["JQRASMNP","JQRASNMP"],["RMAPIQUV","RMAPIQUV"],["jnlvupdi","jnluvpdi"],
["59412675","59412765"],["jlnvoprdi","jlvnoprdi"],["3645179","3645179"],["KRINQUSR","KRINQUSR"],
["VFGARTUX","VFGARUTX"],["732837914","732387914"],["JVOPIMURA","JVOPIMURA"],["bxvinygru","bxvinygur"],
["784513962","784513926"],["ARQULEWVP","ARQULEVWP"],["mnovprydc","mnovprdyc"],["793148252","793148252"],
["XYBWUTYR","XYBWUTYR"],["zrmpfdgh","zrmpfgdh"],["825731496","825731496"],["HUMPRJEQ","HUMPREJQ"],
["derpqmljn","derpqmljn"],["592614826","592614286"],["PDLMARQUJ","PDLMARQUJ"],["iqrspdelm","iqsrpdelm"],
["JMNVUPAL","JMNUVPAL"],["913826574","913826574"],["cpdekrsqb","cpdekrsqb"],["AXPRWNBG","AXPRWNBG"],
["294733506","294733506"],["CDJLQRSKN","CDJLQSRKN"],["reqimjxap","reqlmxjap"],["ZYBMOPRQS","ZYBMOPRQS"],
["3814569","3814659"],["qmlavwn","qmlavwn"],["ERYNODFP","ERYNODFP"],["187935824","187953824"],
["NMRAPCUH","NMRAPCUH"],["fvbosdrn","fvbosrdn"],["631425719","631425719"],["TRCHLMOV","TRCHMLOV"],
["cgierduj","cgiedruj"],["DNWLRVAX","DNWLRAXV"],["hijuvmlpr","hijuvmlpr"],["GVAPORJM","GVAPORJM"],
["81423596","81243596"],["KIRJSBMO","KIRJSBMO"],["oqxjarpd","oqxjaprd"],["64937215","64937215"],
["XBAJZPOR","XBAJZPOR"],["qzbrsaqt","qzbrsaqt"],["63495712","63459712"],["PMAZRSTQE","PMAZRSTQE"],
["bcxpudcf","bcxpudcf"],["51936247","51936247"],["JXRASPUV","JXRASPVU"],["drpewye","drepwye"],
["4562908","4569208"],["MDACPURN","MDACPURN"],["lmnrdopsa","lmnrdapso"],["271659325","271695325"],
["IPRSABJM","IPRSABJM"],["brpdavul","brpdauvi"],["91352748","91352748"],["KRIMNFOJ","KRINMFOJ"],
["61825739","61825739"],["MPORSJNV","MPORSJNV"],["rbapdnuz","rbapdnuz"],["LKUVMPOZ","LKVUMPOZ"],
];

/* ---------- CA (Closure Ability): word images cropped from the booklet scan (assets/ca/) ---------- */
const CA_IMG_SCALE = 0.9; // display scale; keeps the booklet's letter proportions
const CA_ITEMS = [{"img": "ca/ca_01.png", "w": 249, "h": 95, "opts": ["rodba", "dnbra", "aibnr", "radeb", "bneas"]}, {"img": "ca/ca_02.png", "w": 275, "h": 88, "opts": ["sisleln", "nselsu", "rsipmes", "drusens", "ruseds"], "flag": "The scanned word image is too degraded to read with certainty (it looks like 'these' or 'sinless'), and the keyed option (a) 'sisleln' is not an exact anagram of either. No printed option matches 'these'. Scoring uses key.json unchanged (a). Compare with the original booklet."}, {"img": "ca/ca_03.png", "w": 317, "h": 75, "opts": ["lowilw", "rdweno", "dwowni", "nawred", "nidrem"]}, {"img": "ca/ca_04.png", "w": 236, "h": 153, "opts": ["rgaon", "gapna", "lpano", "ginaa", "garin"]}, {"img": "ca/ca_05.png", "w": 341, "h": 92, "opts": ["rygzeran", "ezcyrnai", "izonrega", "yezirdan", "nyoneiza"], "flag": "Distractor spelling was read from a low-resolution scan (e/c and rn/m look alike); compare with the booklet. The keyed option is an anagram of the target word."}, {"img": "ca/ca_06.png", "w": 335, "h": 85, "opts": ["onimr", "rrimor", "lermi", "rmuro", "ulrrc"], "flag": "Distractor spelling was read from a low-resolution scan (e/c and rn/m look alike); compare with the booklet. The keyed option is an anagram of the target word."}, {"img": "ca/ca_07.png", "w": 244, "h": 86, "opts": ["rweat", "twahc", "lovra", "twckei", "berbru"]}, {"img": "ca/ca_08.png", "w": 319, "h": 76, "opts": ["eusscsc", "aesrfcu", "dscucee", "sdsaces", "pssrepus"]}, {"img": "ca/ca_09.png", "w": 305, "h": 152, "opts": ["yldiena", "gdalein", "lnoadgi", "nlginae", "ldidaene"]}, {"img": "ca/ca_10.png", "w": 211, "h": 88, "opts": ["irouf", "rknfa", "cflka", "efrla", "alnfk"]}, {"img": "ca/ca_11.png", "w": 340, "h": 89, "opts": ["leorfma", "altnemni", "aintmlne", "letanirm", "faelrimr"], "flag": "Distractor spelling was read from a low-resolution scan (e/c and rn/m look alike); compare with the booklet. The keyed option is an anagram of the target word."}, {"img": "ca/ca_12.png", "w": 378, "h": 91, "opts": ["dernccee", "condiunce", "ndeucaei", "enoduine", "codncnie"], "flag": "Distractor spelling was read from a low-resolution scan (e/c and rn/m look alike); compare with the booklet. The keyed option is an anagram of the target word."}, {"img": "ca/ca_13.png", "w": 182, "h": 106, "opts": ["ljoyl", "glaji", "yegll", "eyjil", "lylej"]}, {"img": "ca/ca_14.png", "w": 306, "h": 102, "opts": ["hytrae", "amgienn", "meyinan", "ylnmeai", "lyehaht"], "flag": "Option e is shown as 'lyehaht' (the scan prints its 'e' like a 'c'); it is an anagram of 'healthy'. Other distractors: low-resolution scan, compare with the booklet."}, {"img": "ca/ca_15.png", "w": 331, "h": 100, "opts": ["trsepen", "tpnesaa", "patsran", "psarnet", "trnoasp"]}, {"img": "ca/ca_16.png", "w": 229, "h": 92, "opts": ["hcicn", "issgh", "nices", "hnies", "ncaih"]}, {"img": "ca/ca_17.png", "w": 380, "h": 107, "opts": ["cmlignba", "abcorlig", "grmlaigh", "mbigagnl", "lirggamn"], "flag": "Distractor spelling was read from a low-resolution scan (e/c and rn/m look alike); compare with the booklet. The keyed option is an anagram of the target word."}, {"img": "ca/ca_18.png", "w": 305, "h": 74, "opts": ["maarce", "rlnua", "rtaem", "yllauble", "nocraa"]}, {"img": "ca/ca_19.png", "w": 288, "h": 84, "opts": ["ecrtcor", "aocrtr", "acmaer", "tnoanc", "fornca"]}, {"img": "ca/ca_20.png", "w": 261, "h": 88, "opts": ["nroait", "ruatne", "gtarin", "tinono", "ntiaon"]}];
const CA_EXAMPLES = {"score": {"img": "ca/ca_ex_score.png", "w": 240, "h": 76, "opts": ["ehrsu", "recsu", "osher", "roesc", "rtose"], "correct": "d"}, "X": {"img": "ca/ca_ex_x.png", "w": 266, "h": 90, "opts": ["rldead", "trlate", "cdtroo", "urldde", "urderd"], "correct": "a"}};
/* Booklet instruction page for CA, transcribed verbatim. */
const CA_INSTR = {
  p1: 'In this test, you will see a word at the left side of the page, with parts of the letters missing. This \u201cincomplete\u201d word is followed by five \u201cjumbled\u201d words. You are first to use your imagination to figure out what the incomplete word is. Then find, among the five scrambled choices, the one that has the right letters to spell the incomplete word. Look at the following example :',
  p2: 'You would first look at the incomplete word on the left and try to figure out what the word is. When you see that the word is score, you look at the five jumbled choices on the right and see which one contains the letters of the word score. The correct answer is d. roesc. None of the other four has all the letters in the word score.',
  p3: 'Now try another example. This time mark \u2018x\u2019 your answer in box below the correct answer. Work as quickly as you can.',
  p4: 'The word on the left is ladder, and only choice a. rldead contains all the letters in the word ladder. Therefore, you should mark \u2018x\u2019 in the box below a.',
  p5a: 'The incomplete words on the next pages vary in length. ',
  p5b: 'There are no capital letters in any of the words.',
  p6: 'Work quickly to finish as many items as you can. You will have 5 minutes for this test. If you are not sure of the right answer for an incomplete word, mark the choice that is your best guess.',
  p7: 'If you finish before time is called, please STOP. Do not turn to other pages.',
  p8: 'PLEASE WAIT FOR THE INSTRUCTIONS TO START.'
};

/* Embedded source-booklet figures/pages: generated from the supplied questionnaire PDF so this file works standalone. */


/* Image URL: embedded copy if the single-file build injected one, otherwise assets/ next to this file. */
function assetUrl(p){
  if(window.DBDA_ASSETS){
    if(window.DBDA_ASSETS[p]) return window.DBDA_ASSETS[p];
    const alias=p.replace(/\.png$/i,'.jpg');
    if(window.DBDA_ASSETS[alias]) return window.DBDA_ASSETS[alias];
    const base=alias.split('/').pop();
    if(window.DBDA_ASSETS[base]) return window.DBDA_ASSETS[base];
  }
  return ('assets/' + p);
}
function caImg(it){
  const im = el('img',{class:'ca-img', src:assetUrl(it.img), alt:'Incomplete word for CA item', draggable:'false'});
  im.addEventListener('error', ()=>{ im.replaceWith(el('span',{class:'flag'},'NEEDS EXAMINER CHECK: source image missing ('+it.img+').')); });
  return im;
}

/* ---------- SA (Spatial Ability): row images cropped from the booklet scan (assets/sa/) ---------- */
/* Each row image shows the sample figure + 6 test figures (with the booklet's own printed numbers
   and S/R boxes, kept for visual cross-reference against the printed booklet). The app renders its
   own S/R answer buttons below the image -- the printed boxes in the image are not clickable. */
const SA_ROWS = [
  {img:'sa/sa_row01.png', start:1}, {img:'sa/sa_row02.png', start:7}, {img:'sa/sa_row03.png', start:13},
  {img:'sa/sa_row04.png', start:19}, {img:'sa/sa_row05.png', start:25}, {img:'sa/sa_row06.png', start:31},
  {img:'sa/sa_row07.png', start:37}, {img:'sa/sa_row08.png', start:43}, {img:'sa/sa_row09.png', start:49},
  {img:'sa/sa_row10.png', start:55}, {img:'sa/sa_row11.png', start:61}, {img:'sa/sa_row12.png', start:67},
];
/* Booklet-marked example answers (unscored practice) -- transcribed from the printed booklet. */
const SA_EXAMPLES = {
  X: {img:'sa/sa_ex_x.png', answers:['S','R','R','S','R','S']},
  Y: {img:'sa/sa_ex_y.png', answers:['R','R','S','R','S','S']},
};
const SA_INTRO_IMG = 'sa/sa_intro.png';
function saImg(path, altText){
  const im = el('img',{class:'sa-img', src:assetUrl(path), alt:altText||'Figure', draggable:'false'});
  im.addEventListener('error', ()=>{ im.replaceWith(el('span',{class:'flag'},'NEEDS EXAMINER CHECK: image missing ('+path+') \u2014 keep the assets folder next to this file, or use the single-file build.')); });
  return im;
}

/* ---------- Subtest configuration ---------- */
/* implemented=true -> real HTML item administration. implemented=false -> stub: examiner enters
   a raw score directly (PAPER mode) with a mandatory NEEDS EXAMINER CHECK flag, since the figure/
   image assets for this subtest have not been built yet (phase 2 of this tool). */
const DEFAULT_ORDER = ['VA','NA','CA','SA','MA','CL','RA','PM'];
const SUBTEST_META = {
  VA: {label:"Verbal Ability (VA)", implemented:true, max:24, parts:[
        {key:'VA1', label:'VA Part I (synonyms)', seconds:240, items:VA1_ITEMS.length},
        {key:'VA2', label:'VA Part II (proverbs)', seconds:210, items:VA2_ITEMS.length}]},
  NA: {label:"Numerical Ability (NA)", implemented:true, max:20, seconds:330, items:NA_ITEMS.length},
  CA: {label:"Closure Ability (CA)", implemented:true, max:20, seconds:300, items:CA_ITEMS.length},
  SA: {label:"Spatial Ability (SA)", implemented:true, max:72, seconds:360, items:72, hiddenTimer:true},
  MA: {label:"Mechanical Ability (MA)", implemented:true, max:25, seconds:540, items:25},
  CL: {label:"Clerical Speed & Accuracy (CL)", implemented:true, max:72, seconds:180, items:CL_PAIRS.length, hiddenTimer:true},
  RA: {label:"Reasoning Ability (RA)", implemented:true, max:12, seconds:300, items:RA_ROWS.length},
  PM: {label:"Psychomotor (PM)", implemented:true, max:70, seconds:300, items:70},
};

/* ---------- One authoritative session + transport layer ----------
   Same-device mode uses BroadcastChannel.
   This project contains no backend, so REMOTE / MULTI-DEVICE mode is deliberately
   unavailable rather than falsely reported as connected. A WebSocket transport
   interface is provided for a future backend adapter.
   Candidate responses are active-memory/live-transport only; no browser persistence. */
let TRANSPORT_MODE='REMOTE';
const BC_NAME='DBDAR_EXAM_SESSION';
const SUPABASE_CDN='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
let transport=null;
let seenMessageIds=new Set();
let remoteConfig={url:'',key:''};
let resultSaveStatus='not_saved';
let resultSaveMessage='';
let resultSavePromise=null;
let remoteModeRequested=true;
let lastCandidateHeartbeat=0;
let lastExaminerHeartbeat=0;
let candidateJoinCodeDraft='';
let connectionUI={candidate:'disconnected',examiner:'disconnected',message:''};

function makeId(prefix='msg'){return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);}
function makeSessionCode(){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let out='';
  for(let i=0;i<6;i++) out+=chars[Math.floor(Math.random()*chars.length)];
  return out;
}
function freshState(){
  return {
    session:{name:'',candidateId:'',age:'',sex:'',occupation:'',email:'',mobile:'',date:new Date().toISOString().slice(0,10),
             normGroup:'School',normClass:'9th',normSex:'Combined',started:false},
    sessionId:null,sessionCode:null,resultRowId:null,attemptId:null,stateRevision:0,
    candidateConnected:false,candidateJoinPending:false,candidateLastSeen:0,sessionEnded:false,
    order:DEFAULT_ORDER.slice(),currentIndex:0,phase:'setup',part:1,
    timerStart:null,timerDuration:0,timerStatus:'idle',timerPausedAt:null,
    sectionStartedAt:null,sectionDurationSeconds:0,sectionEndsAt:null,
    duration:0,restUntil:null,attemptStatus:'new',
    responses:{VA1:{},VA2:{},NA:{},CA:{},SA:{},MA:{},CL:{},RA:{},PM:{}},
    manualRaw:{SA:null,MA:null,PM:null},examples:{},pmMode:'PAPER',na19Credit:false,
    notes:[],flags:[],tabFocusLoss:0,createdAt:Date.now()
  };
}
let STATE=freshState();

function candidatePublicSnapshot(){
  const key=currentSubtestKey();
  const responseKey=key==='VA'?(STATE.part===1?'VA1':'VA2'):key;
  return {
    sessionId:STATE.sessionId,sessionCode:STATE.sessionCode,stateRevision:STATE.stateRevision,
    phase:STATE.phase,currentIndex:STATE.currentIndex,order:STATE.order.slice(),part:STATE.part,
    timerStart:STATE.timerStart,timerDuration:STATE.timerDuration||STATE.duration||0,
    timerStatus:STATE.timerStatus,timerPausedAt:STATE.timerPausedAt,restUntil:STATE.restUntil,
    sessionStarted:!!STATE.session.started,sessionEnded:!!STATE.sessionEnded,currentSubtest:key,responseKey,
    currentResponses:structuredClone(STATE.responses[responseKey]||{})
  };
}
function examinerSnapshot(){
  return {
    session:structuredClone(STATE.session),sessionId:STATE.sessionId,sessionCode:STATE.sessionCode,
    stateRevision:STATE.stateRevision,candidateConnected:STATE.candidateConnected,
    candidateJoinPending:STATE.candidateJoinPending,candidateLastSeen:STATE.candidateLastSeen,
    order:STATE.order.slice(),currentIndex:STATE.currentIndex,phase:STATE.phase,part:STATE.part,
    timerStart:STATE.timerStart,timerDuration:STATE.timerDuration||STATE.duration||0,
    timerStatus:STATE.timerStatus,timerPausedAt:STATE.timerPausedAt,restUntil:STATE.restUntil,
    responses:structuredClone(STATE.responses),manualRaw:structuredClone(STATE.manualRaw),
    examples:structuredClone(STATE.examples),pmMode:STATE.pmMode,na19Credit:STATE.na19Credit,
    notes:structuredClone(STATE.notes),flags:structuredClone(STATE.flags),
    tabFocusLoss:STATE.tabFocusLoss,createdAt:STATE.createdAt
  };
}
class LocalBroadcastTransport{
  constructor(){
    this.channel=null;this.handler=null;
    try{this.channel=new BroadcastChannel(BC_NAME);this.channel.onmessage=e=>this.handler&&this.handler(e.data);}
    catch(e){this.channel=null;}
  }
  onMessage(fn){this.handler=fn;}
  send(message){if(!this.channel)return false;try{this.channel.postMessage(message);return true;}catch(e){console.error(e);return false;}}
  close(){try{this.channel?.close();}catch(e){}}
}
class WebSocketTransport{
  constructor(){this.connected=false;this.ws=null;this.handler=null;}
  onMessage(fn){this.handler=fn;}
  connect(){throw new Error('Generic WebSocket adapter not configured.');}
  send(){return false;}
  close(){try{this.ws?.close();}catch(e){}}
}

let supabaseClient=null;
let supabaseChannels={};
let supabaseReady=false;
let supabaseLoadPromise=null;
function loadSupabase(){
  if(window.supabase?.createClient)return Promise.resolve();
  if(supabaseLoadPromise)return supabaseLoadPromise;
  supabaseLoadPromise=new Promise((resolve,reject)=>{
    const sc=document.createElement('script'); sc.src=SUPABASE_CDN; sc.async=true;
    sc.onload=()=>window.supabase?.createClient?resolve():reject(new Error('Supabase library loaded but createClient is unavailable.'));
    sc.onerror=()=>reject(new Error('Could not load the Supabase Realtime library. Check internet access.'));
    document.head.appendChild(sc);
  });
  return supabaseLoadPromise;
}
class SupabaseRealtimeTransport{
  constructor(config){this.config=config;this.handler=null;this.client=null;this.channels={};this.ready=false;}
  onMessage(fn){this.handler=fn;}
  async init(){
    if(this.ready)return;
    if(!this.config.url||!this.config.key)throw new Error('Enter the Supabase Project URL and publishable key.');
    await loadSupabase();
    this.client=window.supabase.createClient(this.config.url,this.config.key,{auth:{persistSession:false,autoRefreshToken:true,detectSessionInUrl:false}});
    const {error}=await this.client.auth.signInAnonymously();
    if(error)throw new Error('Supabase anonymous sign-in failed. Enable Anonymous Sign-Ins in Supabase Auth, then try again.');
    this.ready=true;
  }
  topic(kind,value){return kind==='lobby'?`dbdar:lobby:${value}`:`dbdar:session:${value}`;}
  async subscribe(kind,value){
    await this.init();
    const topic=this.topic(kind,value);
    if(this.channels[topic])return true;
    const ch=this.client.channel(topic,{config:{private:true,broadcast:{self:false}}});
    ch.on('broadcast',{event:'dbdar-event'},payload=>{
      try{if(this.handler) this.handler(payload.payload||payload);}catch(e){console.error(e);}
    });
    await new Promise((resolve,reject)=>{
      let settled=false;
      const finish=(fn,arg)=>{if(settled)return;settled=true;clearTimeout(timer);fn(arg);};
      const timer=setTimeout(()=>finish(reject,new Error(`Realtime channel timed out while joining ${topic}. Check that Anonymous Sign-Ins are enabled and the Realtime authorization policies have been run.`)),12000);
      ch.subscribe((status,err)=>{
        if(status==='SUBSCRIBED') finish(resolve);
        else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED'){
          const detail=err?.message||err?.reason||status;
          finish(reject,new Error(`Realtime channel ${status} for ${topic}${detail?': '+detail:''}`));
        }
      });
    });
    this.channels[topic]=ch;
    return true;
  }
  async send(message){
    const kind=(message.sessionId?'session':'lobby');
    const value=message.sessionId||message.sessionCode;
    if(!value)throw new Error('Realtime message is missing a session id/code.');
    await this.subscribe(kind,value);
    const ch=this.channels[this.topic(kind,value)];
    const result=await ch.send({type:'broadcast',event:'dbdar-event',payload:message});
    if(result!=='ok') throw new Error(`Realtime broadcast failed on ${this.topic(kind,value)} (${String(result)}).`);
    return true;
  }
  async close(){
    try{for(const ch of Object.values(this.channels))await this.client?.removeChannel(ch);}catch(e){}
    this.channels={};this.ready=false;
  }
}
if(!isSelfTestMode()){
  transport=new SupabaseRealtimeTransport(remoteConfig);
  transport.onMessage(messageHandler);
}

async function switchToRemoteTransport(){
  remoteModeRequested=true; TRANSPORT_MODE='REMOTE';
  try{
    await loadSupabase();
    if(transport?.close)await transport.close();
    transport=new SupabaseRealtimeTransport(remoteConfig);
    transport.onMessage(messageHandler);
    return true;
  }catch(e){
    TRANSPORT_MODE='LOCAL';
    connectionUI.candidate='error'; connectionUI.message=e.message||'Remote connection could not be initialized.';
    render(); return false;
  }
}
async function ensureRemoteLobby(code){
  if(TRANSPORT_MODE!=='REMOTE'||!code)return false;
  try{await transport.subscribe('lobby',code);return true;}catch(e){connectionUI.candidate='error';connectionUI.message=e.message||'Could not connect to the session lobby.';render();return false;}
}
async function ensureRemoteSession(id){
  if(TRANSPORT_MODE!=='REMOTE'||!id)return false;
  try{await transport.subscribe('session',id);return true;}catch(e){connectionUI.candidate='error';connectionUI.message=e.message||'Could not connect to the live assessment channel.';render();return false;}
}
async function postEvent(type,payload={},options={}){
  if(isSelfTestMode()) throw new Error('Realtime is disabled in Candidate Self-Test mode.');
  if(!transport)throw new Error('No realtime transport is available.');
  const message={
    type,messageId:makeId(type.toLowerCase()),timestamp:Date.now(),
    sessionId:options.sessionId!==undefined?options.sessionId:(STATE.sessionId||null),
    sessionCode:options.sessionCode!==undefined?options.sessionCode:(STATE.sessionCode||null),
    senderRole:getRole()||'unknown',stateRevision:STATE.stateRevision,payload
  };
  return await transport.send(message);
}
function markSeen(id){
  if(!id)return true;if(seenMessageIds.has(id))return false;seenMessageIds.add(id);
  if(seenMessageIds.size>500)seenMessageIds=new Set([...seenMessageIds].slice(-250));
  return true;
}
function applyCandidateSnapshot(pub){
  if(!pub||!pub.sessionId)return;
  if(STATE.sessionId&&pub.sessionId!==STATE.sessionId)return;
  if(typeof pub.stateRevision==='number'&&pub.stateRevision<(STATE.stateRevision||0))return;
  STATE.sessionId=pub.sessionId;STATE.sessionCode=pub.sessionCode;STATE.stateRevision=pub.stateRevision||0;
  STATE.phase=pub.phase;STATE.currentIndex=pub.currentIndex;
  STATE.order=Array.isArray(pub.order)?pub.order.slice():STATE.order;STATE.part=pub.part||1;
  STATE.timerStart=pub.timerStart;STATE.timerDuration=pub.timerDuration||0;STATE.duration=STATE.timerDuration;
  STATE.timerStatus=pub.timerStatus||'idle';STATE.timerPausedAt=pub.timerPausedAt||null;STATE.restUntil=pub.restUntil||null;
  STATE.session.started=!!pub.sessionStarted;STATE.sessionEnded=!!pub.sessionEnded;
  if(pub.responseKey)STATE.responses[pub.responseKey]=Object.assign({},STATE.responses[pub.responseKey]||{},pub.currentResponses||{});
  lastExaminerHeartbeat=Date.now();connectionUI.examiner='connected';connectionUI.message='';render();
}
function broadcastAuthoritativeState(){
  if(getRole()!=='examiner'||!STATE.sessionId)return;
  STATE.stateRevision=(STATE.stateRevision||0)+1;
  postEvent('STATE_SNAPSHOT',{state:candidatePublicSnapshot()});
}
function saveState(broadcast=true){ if(broadcast&&getRole()==='examiner'&&STATE.sessionId) broadcastAuthoritativeState(); }
function mutate(fn){
  const canMutate=getRole()==='examiner' || (getRole()==='candidate' && isSelfTestMode());
  if(!canMutate)return false;
  fn(STATE);
  if(getRole()==='examiner') broadcastAuthoritativeState();
  else scheduleSelfTestSave();
  render();return true;
}
async function createSessionIfNeeded(){
  if(!STATE.sessionId)STATE.sessionId=makeId('sess');
  if(!STATE.sessionCode)STATE.sessionCode=makeSessionCode();
  if(TRANSPORT_MODE==='REMOTE'){
    try{
      const lobbyOK=await ensureRemoteLobby(STATE.sessionCode);
      if(!lobbyOK) throw new Error(connectionUI.message||'Examiner could not join the Supabase lobby channel.');
      const sessionOK=await ensureRemoteSession(STATE.sessionId);
      if(!sessionOK) throw new Error(connectionUI.message||'Examiner could not join the Supabase session channel.');
    }catch(e){
      connectionUI.examiner='error';
      connectionUI.message=e?.message||'Could not connect the examiner to Supabase Realtime.';
      render();
      return false;
    }
  }
  return true;
}
async function candidateJoin(code){
  const clean=String(code||'').trim().toUpperCase();
  if(!/^[A-HJ-NP-Z2-9]{6}$/.test(clean)){
    connectionUI.candidate='error';connectionUI.message='Enter the 6-character session code shown by the examiner.';render();return;
  }
  candidateJoinCodeDraft=clean;connectionUI.candidate='connecting';connectionUI.message='Connecting to examiner session...';render();
  try{
    if(TRANSPORT_MODE==='REMOTE') await ensureRemoteLobby(clean);
    await postEvent('CANDIDATE_JOIN_REQUEST',{sessionCode:clean},{sessionId:null,sessionCode:clean});
    connectionUI.message='Join request sent. Waiting for the examiner to accept this candidate connection.';
  }catch(e){
    console.error('Candidate join failed',e);
    connectionUI.candidate='error';
    connectionUI.message=e?.message||'Could not send the join request. Check the session code and Supabase Realtime connection.';
  }
  render();
}
function sendCandidateResponse(respKey,itemId,value){
  if(getRole()!=='candidate'||connectionUI.candidate!=='connected')return;
  postEvent('CANDIDATE_RESPONSE',{responseKey:respKey,itemId:String(itemId),response:value});
  connectionUI.message='Response recorded';render();
}
function recordResponse(responseKey,itemId,value){
  if(getRole()==='candidate'){
    if(STATE.phase!=='running') return;
    if(isSelfTestMode()){
      mutate(st=>{
        if(value===''||value==null) delete st.responses[responseKey][itemId];
        else st.responses[responseKey][itemId]=value;
      });
    } else sendCandidateResponse(responseKey,itemId,value);
    return;
  }
  if(getRole()==='examiner')mutate(st=>{
    if(value===''||value==null)delete st.responses[responseKey][itemId];else st.responses[responseKey][itemId]=value;
  });
}
function sendCandidateHeartbeat(){if(getRole()==='candidate'&&STATE.sessionId)postEvent('CANDIDATE_HEARTBEAT',{});}
function sendExaminerHeartbeat(){if(getRole()==='examiner'&&STATE.sessionId)postEvent('EXAMINER_HEARTBEAT',{});}
async function examinerAcceptCandidate(){
  if(getRole()!=='examiner'||!STATE.candidateJoinPending)return;
  try{
    if(TRANSPORT_MODE==='REMOTE') await ensureRemoteSession(STATE.sessionId);
    STATE.candidateConnected=true;STATE.candidateJoinPending=false;STATE.candidateLastSeen=Date.now();
    STATE.stateRevision=(STATE.stateRevision||0)+1;
    await postEvent('SESSION_ACCEPTED',{state:candidatePublicSnapshot()},{sessionId:null,sessionCode:STATE.sessionCode});
    await postEvent('STATE_SNAPSHOT',{state:candidatePublicSnapshot()});
    connectionUI.examiner='connected';connectionUI.message='Candidate accepted and connected.';
  }catch(e){
    console.error('Candidate acceptance failed',e);
    STATE.candidateConnected=false;
    STATE.candidateJoinPending=true;
    connectionUI.examiner='error';
    connectionUI.message=e?.message||'Could not accept the candidate connection.';
  }
  render();
}
function examinerRejectCandidate(){
  if(getRole()!=='examiner'||!STATE.candidateJoinPending)return;
  STATE.candidateJoinPending=false;postEvent('SESSION_REJECTED',{});render();
}

function messageHandler(message){
  if(!message||!markSeen(message.messageId))return;
  const role=getRole();
  if(message.type==='CANDIDATE_JOIN_REQUEST'&&role==='examiner'){
    if(message.sessionCode!==STATE.sessionCode||message.payload?.sessionCode!==STATE.sessionCode)return;
    STATE.candidateJoinPending=true;STATE.candidateLastSeen=Date.now();render();return;
  }
  if(message.type==='SESSION_ACCEPTED'&&role==='candidate'){
    const snap=message.payload?.state;
    if(!snap||snap.sessionCode!==candidateJoinCodeDraft)return;
    (async()=>{
      try{
        applyCandidateSnapshot(snap);
        if(TRANSPORT_MODE==='REMOTE') await ensureRemoteSession(snap.sessionId);
        await postEvent('CANDIDATE_READY',{});
        connectionUI.candidate='connected';connectionUI.message='Connected to Examiner.';
      }catch(e){
        console.error('Candidate session connection failed',e);
        connectionUI.candidate='error';connectionUI.message=e?.message||'The session was accepted, but the live assessment channel could not be connected.';
      }
      render();
    })();
    return;
  }
  if(message.type==='SESSION_REJECTED'&&role==='candidate'){
    connectionUI.candidate='error';connectionUI.message='The examiner did not accept this connection.';render();return;
  }
  if(message.type==='STATE_SNAPSHOT'&&role==='candidate'){
    const snap=message.payload?.state;if(!snap||snap.sessionId!==STATE.sessionId)return;
    applyCandidateSnapshot(snap);connectionUI.candidate='connected';return;
  }
  if(message.type==='CANDIDATE_RESPONSE'&&role==='examiner'){
    if(message.sessionId!==STATE.sessionId||!STATE.candidateConnected)return;
    const p=message.payload||{},key=String(p.responseKey||''),item=String(p.itemId||'');
    if(!Object.prototype.hasOwnProperty.call(STATE.responses,key)||!item)return;
    const expected=currentSubtestKey()==='VA'?(STATE.part===1?'VA1':'VA2'):currentSubtestKey();
    if(key!==expected||STATE.phase!=='running')return;
    if(p.response===''||p.response==null)delete STATE.responses[key][item];else STATE.responses[key][item]=p.response;
    broadcastAuthoritativeState();render();postEvent('RESPONSE_CONFIRMED',{responseKey:key,itemId:item,response:p.response});return;
  }
  if(message.type==='CANDIDATE_HEARTBEAT'&&role==='examiner'){
    if(message.sessionId!==STATE.sessionId)return;
    lastCandidateHeartbeat=Date.now();STATE.candidateLastSeen=Date.now();
    if(!STATE.candidateConnected){STATE.candidateConnected=true;broadcastAuthoritativeState();}render();return;
  }
  if(message.type==='EXAMINER_HEARTBEAT'&&role==='candidate'){
    if(message.sessionId!==STATE.sessionId)return;
    lastExaminerHeartbeat=Date.now();if(connectionUI.candidate!=='connected')connectionUI.candidate='connected';render();return;
  }
  if(message.type==='CANDIDATE_READY'&&role==='examiner'){
    if(message.sessionId!==STATE.sessionId)return;
    STATE.candidateConnected=true;STATE.candidateJoinPending=false;STATE.candidateLastSeen=Date.now();
    broadcastAuthoritativeState();render();return;
  }
  if(message.type==='CANDIDATE_DISCONNECTED'&&role==='examiner'){
    if(message.sessionId!==STATE.sessionId)return;
    STATE.candidateConnected=false;STATE.candidateJoinPending=false;render();return;
  }
  if(message.type==='RESPONSE_CONFIRMED'&&role==='candidate'){
    if(message.sessionId!==STATE.sessionId)return;connectionUI.message='Response recorded';render();return;
  }
  if(message.type==='CANDIDATE_FOCUS_LOSS'&&role==='examiner'){
    if(message.sessionId!==STATE.sessionId)return;
    STATE.tabFocusLoss=(STATE.tabFocusLoss||0)+1;render();return;
  }
  if(message.type==='SESSION_ENDED'&&role==='candidate'){
    if(message.sessionId!==STATE.sessionId)return;
    STATE.sessionEnded=true;STATE.phase='done';render();return;
  }
}
if(transport) transport.onMessage(messageHandler);

setInterval(()=>{
  const role=getRole();
  if(isSelfTestMode()) return;
  if(role==='examiner'&&STATE.sessionId){
    sendExaminerHeartbeat();
    if(STATE.candidateConnected && lastCandidateHeartbeat && Date.now()-lastCandidateHeartbeat>6500){
      STATE.candidateConnected=false;
      render();
    }
  } else if(role==='candidate'&&STATE.sessionId&&connectionUI.candidate!=='error'){
    sendCandidateHeartbeat();
    if(lastExaminerHeartbeat && Date.now()-lastExaminerHeartbeat>6500){
      connectionUI.candidate='disconnected';
      connectionUI.examiner='disconnected';
      connectionUI.message='Connection to examiner lost. Please wait…';
      render();
    }
  }
},2000);

window.addEventListener('beforeunload',()=>{
  try{
    if(!isSelfTestMode() && getRole()==='candidate'&&STATE.sessionId)postEvent('CANDIDATE_DISCONNECTED',{});
  }catch(e){}
});

/* ---------- Role handling ---------- */
let ACTIVE_ROLE=null;
try{ if(isSelfTestMode() && new URL(location.href).searchParams.get('role')!=='candidate'){ ACTIVE_ROLE='candidate'; } }catch(e){}
function getRole(){
  if(ACTIVE_ROLE==='examiner'||ACTIVE_ROLE==='candidate') return ACTIVE_ROLE;
  try{
    const url=new URL(location.href);
    const r=url.searchParams.get('role');
    if(r==='examiner'||r==='candidate'){ ACTIVE_ROLE=r; return r; }
  }catch(e){}
  return null;
}
function isSelfTestMode(){
  try{ return new URL(location.href).searchParams.get('mode')==='selftest'; }catch(e){ return false; }
}
const SELFTEST_STORAGE_KEY='DBDAR_SELFTEST_ACTIVE_V9';
const SELFTEST_TAB_KEY='DBDAR_SELFTEST_TAB_ACTIVE_V9';
let selfTestSaveTimer=null;
let selfTestSaveInFlight=null;
let selfTestSavedAttempt=null;
function readSelfTestSaved(){
  if(!isSelfTestMode()) return null;
  try{
    const raw=localStorage.getItem(SELFTEST_STORAGE_KEY);
    if(!raw) return null;
    const data=JSON.parse(raw);
    if(!data?.state?.sessionId || !data?.state?.attemptId) return null;
    if(data.state.attemptStatus==='completed' || data.state.phase==='report') return null;
    return data;
  }catch(e){ return null; }
}
function selfTestPersistLocal(){
  if(!isSelfTestMode() || getRole()!=='candidate' || !STATE.sessionId || !STATE.attemptId) return;
  try{
    localStorage.setItem(SELFTEST_STORAGE_KEY, JSON.stringify({state:STATE, savedAt:Date.now()}));
    sessionStorage.setItem(SELFTEST_TAB_KEY, STATE.attemptId);
  }catch(e){ console.warn('Local recovery save failed',e); }
}
function selfTestRestoreLocal(){
  if(!isSelfTestMode()) return false;
  const data=readSelfTestSaved();
  if(!data) return false;
  try{
    const tabAttempt=sessionStorage.getItem(SELFTEST_TAB_KEY);
    if(tabAttempt && tabAttempt===data.state.attemptId){
      STATE=Object.assign(freshState(),data.state);
      return true;
    }
  }catch(e){}
  // A stale attempt from another tab/session must never block a fresh candidate link.
  selfTestSavedAttempt=null;
  return false;
}
function selfTestClearActivePointer(){
  try{ sessionStorage.removeItem(SELFTEST_TAB_KEY); }catch(e){}
}
function selfTestStartFresh(sessionData){
  selfTestClearActivePointer();
  const clean=freshState();
  clean.session=Object.assign(clean.session, sessionData||{});
  clean.session.started=false;
  clean.sessionId=makeId('selftest');
  clean.attemptId='DBDAR-'+new Date().getFullYear()+'-'+Math.random().toString(36).slice(2,10).toUpperCase();
  clean.attemptStatus='active';
  STATE=clean;
  try{ sessionStorage.setItem(SELFTEST_TAB_KEY, STATE.attemptId); }catch(e){}
}
function scheduleSelfTestSave(){
  if(!isSelfTestMode() || getRole()!=='candidate' || !STATE.sessionId) return;
  selfTestPersistLocal();
  clearTimeout(selfTestSaveTimer);
  selfTestSaveTimer=setTimeout(()=>saveSelfTestProgress(false),1200);
}
try{ if(isSelfTestMode()) selfTestRestoreLocal(); }catch(e){}
function setRole(r){
  ACTIVE_ROLE=(r==='examiner'||r==='candidate')?r:null;
  try{
    const url=new URL(location.href);
    if(ACTIVE_ROLE) url.searchParams.set('role',ACTIVE_ROLE); else url.searchParams.delete('role');
    history.replaceState(null,'',url.toString());
  }catch(e){}
  render();
}

/* ---------- Utility ---------- */
const BOOL_ATTRS = new Set(['checked','disabled','selected','draggable','required']);
function el(tag, attrs={}, children=[]){
  const e = document.createElement(tag);
  for(const k in attrs){
    if(k==='class') e.className = attrs[k];
    else if(k==='html') e.innerHTML = attrs[k];
    else if(k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
    else if(BOOL_ATTRS.has(k)){
      if(k==='draggable'){ e.setAttribute('draggable', attrs[k]); } // draggable needs literal "true"/"false" string
      else if(attrs[k]) e.setAttribute(k, '');
      // if falsy, omit entirely (do not set the boolean attribute)
    }
    else e.setAttribute(k, attrs[k]);
  }
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(c==null || c==='') return;
    if(typeof c === 'string' || typeof c === 'number') e.appendChild(document.createTextNode(String(c)));
    else e.appendChild(c);
  });
  return e;
}
function fmtTime(sec){
  sec = Math.max(0, Math.ceil(sec));
  const m = Math.floor(sec/60), s = sec%60;
  return m + ':' + String(s).padStart(2,'0');
}
function letterFor(i){ return String.fromCharCode(97+i); } // a,b,c...

/* ---------- Scoring ---------- */
function scoreVA(){
  let raw = 0, max = 24, answered=0;
  VA1_ITEMS.forEach((_,i)=>{
    const num = i+1;
    const ans = STATE.responses.VA1[num];
    if(ans!=null){answered++;}
    if(ans && ans.toUpperCase() === (KEY.VA1[num]||'').toUpperCase()) raw++;
  });
  VA2_ITEMS.forEach((_,i)=>{
    const num = i+16;
    const ans = STATE.responses.VA2[num];
    if(ans!=null){answered++;}
    if(ans && ans.toUpperCase() === (KEY.VA2[num]||'').toUpperCase()) raw++;
  });
  return {raw, max, answered, total:24};
}
function scoreSimple(subKey, items, keyObj){
  let raw=0, answered=0;
  for(let i=1;i<=items;i++){
    const ans = STATE.responses[subKey][i];
    if(ans!=null) answered++;
    const correct = keyObj[i];
    if(correct==null) continue; // no-credit item
    if(ans && String(ans).toUpperCase() === String(correct).toUpperCase()) raw++;
  }
  return {raw, answered};
}
function scoreNA(){
  const r = scoreSimple('NA', 20, KEY.NA);
  let raw = r.raw;
  if(STATE.na19Credit) raw = Math.min(20, raw+1);
  return {raw, max:19, answered:r.answered, total:20, credited:STATE.na19Credit};
}
function scoreRA(){
  const r = scoreSimple('RA', 12, KEY.RA);
  return {raw:r.raw, max:12, answered:r.answered, total:12};
}
function scoreCA(){
  const r = scoreSimple('CA', 20, KEY.CA);
  return {raw:r.raw, max:20, answered:r.answered, total:20};
}
function scoreCL(){
  const r = scoreSimple('CL', 72, KEY.CL);
  return {raw:r.raw, max:72, answered:r.answered, total:72};
}
function scoreSA(){
  const r = scoreSimple('SA', 72, KEY.SA);
  return {raw:r.raw, max:72, answered:r.answered, total:72};
}
function scoreMA(){
  const r = scoreSimple('MA', 25, KEY.MA);
  return {raw:r.raw, max:25, answered:r.answered, total:25};
}
function scorePM(){
  let raw=0, answered=0;
  for(let i=1;i<=70;i++){ const v=STATE.responses.PM[i]; if(v!=null) answered++; if(v==='correct') raw++; }
  return {raw,max:70,answered,total:70};
}
function getRaw(ability){
  if(ability==='VA') return scoreVA().raw;
  if(ability==='NA') return scoreNA().raw;
  if(ability==='RA') return scoreRA().raw;
  if(ability==='CL') return scoreCL().raw;
  if(ability==='CA') return scoreCA().raw;
  if(ability==='SA') return scoreSA().raw;
  if(ability==='MA') return scoreMA().raw;
  if(ability==='PM') return scorePM().raw;
  return STATE.manualRaw[ability];
}

/* Sten lookup */
function normLookup(ability){
  const {normGroup, normClass, normSex} = STATE.session;
  const raw = getRaw(ability);
  if(raw==null || isNaN(raw)) return {raw:null, sten:null, note:'No raw score entered yet.'};
  const cls = normGroup==='School' ? normClass : '-';
  const rows = NORMS.filter(r=>r.group===normGroup && r.cls===cls && r.sex===normSex && r.ability===ability);
  if(rows.length===0) return {raw, sten:null, note:'NEEDS EXAMINER CHECK: no matching norm table found for this group/class/sex combination.'};
  // find exact containing row
  let hit = rows.find(r=>r.raw_min!=null && r.raw_max!=null && raw>=r.raw_min && raw<=r.raw_max);
  if(hit) return {raw, sten:hit.sten, flag:hit.flag||null};
  // above highest tabled range -> Sten 10
  const withRange = rows.filter(r=>r.raw_max!=null);
  const highest = withRange.reduce((a,b)=> (b.raw_max>a.raw_max? b:a), withRange[0]);
  if(highest && raw > highest.raw_max){
    return {raw, sten:10, note:'Raw score above the highest tabled range \u2014 capped at Sten 10 per the norm table rule.'};
  }
  const lowest = withRange.reduce((a,b)=> (b.raw_min<a.raw_min? b:a), withRange[0]);
  if(lowest && raw < lowest.raw_min){
    return {raw, sten:null, note:'NEEDS EXAMINER CHECK: raw score is below the lowest tabled range for this norm group.'};
  }
  return {raw, sten:null, note:'NEEDS EXAMINER CHECK: raw score does not fall inside any tabled range for this norm group.'};
}

function stenBand(sten){
  if(sten==null) return '';
  if(sten<=3) return 'Low ability';
  if(sten<=7) return 'Average';
  return 'High ability';
}

/* ---------- Validity checks ---------- */
function validityChecks(){
  const flags = [];
  // multiple responses can't happen via radio UI, but manual paper-entry raws are inherently unverifiable
  if(Object.keys(STATE.responses.SA||{}).length < 72) flags.push({level:'info', text:`SA: ${Object.keys(STATE.responses.SA||{}).length}/72 responses recorded.`});
  if(Object.keys(STATE.responses.MA||{}).length < 25) flags.push({level:'info', text:`MA: ${Object.keys(STATE.responses.MA||{}).length}/25 responses recorded.`});
  if(scorePM().answered < 70) flags.push({level:'info', text:`PM: ${scorePM().answered}/70 figures have been examiner-scored.`});
  // pattern check on CL and RA responses: all-one-column or strict alternation
  function patternCheck(subKey, count, label){
    const vals = [];
    for(let i=1;i<=count;i++) vals.push(STATE.responses[subKey][i]);
    const answered = vals.filter(v=>v!=null);
    if(answered.length < Math.max(6, count*0.3)) return;
    const distinct = new Set(answered);
    if(distinct.size===1){
      flags.push({level:'warn', text:`${label}: every answered item used the same option (${[...distinct][0]}) \u2014 possible response-set pattern, not genuine attempts.`});
    } else if(distinct.size===2){
      let alt = true;
      for(let i=1;i<answered.length;i++){ if(answered[i]===answered[i-1]){ alt=false; break; } }
      if(alt) flags.push({level:'warn', text:`${label}: answers strictly alternate between two options \u2014 possible response-set pattern.`});
    }
  }
  patternCheck('CL',72,'CL');
  patternCheck('CA',20,'CA');
  patternCheck('RA',12,'RA');
  patternCheck('SA',72,'SA');
  patternCheck('MA',25,'MA');
  // too few items attempted within time limit
  ['VA1','VA2','NA','CA','CL','RA'].forEach(k=>{
    const meta = k==='VA1'?{items:15}:k==='VA2'?{items:9}:{items: k==='NA'?20:k==='CA'?20:k==='CL'?72:12};
    const answered = Object.keys(STATE.responses[k]||{}).length;
    if(STATE.phase==='timeup' || STATE.phase==='done' || STATE.phase==='report'){
      if(answered < meta.items*0.25 && answered>0){
        flags.push({level:'warn', text:`${k}: only ${answered}/${meta.items} items attempted before time expired \u2014 unusually low completion.`});
      }
    }
  });
  if(STATE.tabFocusLoss>0){
    flags.push({level:'info', text:`Candidate window lost focus ${STATE.tabFocusLoss} time(s) during the session.`});
  }
  return flags.concat(STATE.flags||[]);
}

/* ---------- Self-test (spec's built-in example) ---------- */
function runSelfTest(){
  // School, 9th, Female, Table 7: VA raw 14 -> Sten 10, NA raw 9 -> Sten 8, SA raw 37 -> Sten 7
  const tmp = {normGroup:'School', normClass:'9th', normSex:'Female'};
  function lookup(ability, raw){
    const rows = NORMS.filter(r=>r.group===tmp.normGroup && r.cls===tmp.normClass && r.sex===tmp.normSex && r.ability===ability);
    const hit = rows.find(r=>r.raw_min!=null&&r.raw_max!=null&&raw>=r.raw_min&&raw<=r.raw_max);
    return hit? hit.sten : null;
  }
  const results = [
    {ability:'VA', raw:14, expected:10, got: lookup('VA',14)},
    {ability:'NA', raw:9, expected:8, got: lookup('NA',9)},
    {ability:'SA', raw:37, expected:7, got: lookup('SA',37)},
  ];
  return results.map(r=>({...r, pass: r.got===r.expected}));
}

/* ===================== RENDER ===================== */
const app = document.getElementById('app');

function snapshotUI(){
  const snap = {y: window.scrollY, fields:{}, focus:null};
  document.querySelectorAll('[data-keep]').forEach(n=>{
    const k = n.getAttribute('data-keep');
    snap.fields[k] = {value:n.value, s:n.selectionStart, e:n.selectionEnd};
    if(n===document.activeElement) snap.focus = k;
  });
  return snap;
}
function restoreUI(snap){
  document.querySelectorAll('[data-keep]').forEach(n=>{
    const k = n.getAttribute('data-keep'), f = snap.fields[k];
    if(!f) return;
    if(k.startsWith('draft-')) n.value = f.value; // unsent text must survive background re-renders
    if(snap.focus===k){ n.focus(); try{ n.setSelectionRange(f.s,f.e); }catch(e){} }
  });
  window.scrollTo(0, snap.y);
}
function render(){
  const snap = snapshotUI();
  try{ renderInner(); }
  catch(err){
    console.error(err);
    app.innerHTML = '';
    app.appendChild(el('div',{class:'wrap'},[el('div',{class:'notice'},'Display error: '+(err && err.message ? err.message : err)+' \u2014 reload the page. Your session data is saved.')]));
  }
  restoreUI(snap);
}
function renderInner(){
  const role=getRole();app.innerHTML='';
  if(!role){app.appendChild(renderRolePicker());return;}
  const selfTest=isSelfTestMode()&&role==='candidate';
  const bar=el('div',{class:'topbar'},[
    el('b',{},selfTest?'DBDA-R — Candidate Assessment':'DBDA-R — '+(role==='examiner'?'Examiner':'Candidate')+' view'),
    el('div',{class:'topbar-actions'},selfTest?[
      el('span',{class:'assessment-live-label'},'Assessment in Progress')
    ]:[
      renderConnectionStatus(role),
      role==='examiner'?el('button',{class:'no-print',onclick:()=>window.open(location.pathname+'?role=candidate','_blank')},'Open Candidate Window'):null,
      el('button',{class:'no-print',onclick:()=>setRole(null)},'Switch role')
    ].filter(Boolean))
  ]);
  app.appendChild(bar);
  const wrap=el('div',{class:'wrap'});app.appendChild(wrap);
  if(role==='examiner' && STATE.sessionId) wrap.appendChild(renderExaminerConnectionCard());
  if(role==='candidate' && connectionUI.candidate==='connected') wrap.appendChild(el('div',{class:'candidate-live-strip no-print'},[
    el('span',{},'● Connected to Examiner'),el('span',{},'Session '+STATE.sessionCode),
    connectionUI.message?el('span',{},connectionUI.message):null,
    el('span',{class:'connection-mode'},TRANSPORT_MODE)
  ].filter(Boolean)));

  const activeStatus=renderAssessmentStatus(role);if(activeStatus)wrap.appendChild(activeStatus);

  if(role==='candidate'){
    wrap.appendChild(isSelfTestMode()?renderCandidateSelfTest(): (connectionUI.candidate==='connected'?renderCandidate():renderCandidateConnection()));
  }else{
    if(STATE.phase==='setup')wrap.appendChild(renderSetup());
    else if(STATE.phase==='report')wrap.appendChild(renderReport());
    else wrap.appendChild(renderExaminer());
  }
  wrap.appendChild(el('div',{class:'footer-note no-print'},'DBDA-R (c) Psy-Com Services. For educational/practical use only. Digital administration mirrors the supplied booklet where possible; PM remains examiner-scored from the paper response. Norm conversion uses the embedded tables supplied with this tool.'));
}

function renderRolePicker(){
  const mode=remoteModeRequested?'REMOTE':'LOCAL';
  const candidateSelf=el('div',{class:'card',style:'text-align:center;'},[
    el('h2',{},'Candidate Assessment'),
    el('p',{},'Take the DBDA-R independently from this link. No session code or examiner acceptance is required.'),
    el('button',{class:'primary',onclick:()=>{
      const u=new URL(location.href); u.searchParams.set('role','candidate'); u.searchParams.set('mode','selftest'); location.href=u.toString();
    }},'Start Candidate Assessment')
  ]);
  const examinerCard=el('div',{class:'card',style:'text-align:center;'},[
    el('h2',{},'Examiner'),
    el('p',{},'Open the existing examiner-controlled workflow.'),
    el('button',{class:'primary',onclick:()=>setRole('examiner')},'Open Examiner')
  ]);
  const joinCard=el('div',{class:'card',style:'text-align:center;'},[
    el('h3',{},'Join an Examiner Session'),
    el('p',{class:'mini-note'},'For the existing supervised multi-device workflow.'),
    el('button',{onclick:()=>{const u=new URL(location.href);u.searchParams.set('role','candidate');u.searchParams.delete('mode');location.href=u.toString();}},'Join Examiner Session')
  ]);
  const localCard=el('div',{class:'mode-card '+(mode==='LOCAL'?'active':'')},[
    el('h3',{},'Same-device mode'),
    el('p',{},'Examiner and Candidate on the same browser/device using BroadcastChannel.')
  ]);
  const remoteCard=el('div',{class:'mode-card '+(mode==='REMOTE'?'active':'')},[
    el('h3',{},'Multi-device mode'),
    el('p',{},'Examiner laptop + Candidate phone/tablet using Supabase Realtime over WSS.')
  ]);
  localCard.onclick=()=>{remoteModeRequested=false;TRANSPORT_MODE='LOCAL';if(transport?.close)transport.close();transport=new LocalBroadcastTransport();transport.onMessage(messageHandler);render();};
  remoteCard.onclick=()=>{remoteModeRequested=true;TRANSPORT_MODE='REMOTE';if(transport?.close)transport.close();transport=new SupabaseRealtimeTransport(remoteConfig);transport.onMessage(messageHandler);render();};
  const children=[
    el('div',{class:'topbar'},[el('b',{},'DBDA-R (Revised) — Live Assessment Platform')]),
    el('div',{class:'wrap'},[
      el('div',{class:'card'},[
        el('h2',{},'DBDA-R Digital Assessment'),
        el('p',{class:'mini-note'},'Choose how this browser will be used.'),
        el('div',{class:'mode-grid'},[localCard,remoteCard])
      ]),
      candidateSelf, examinerCard, joinCard
    ])
  ];
  if(mode==='REMOTE'){
    const urlInp=el('input',{type:'url',autocomplete:'off',spellcheck:'false',placeholder:'https://YOUR-PROJECT.supabase.co',value:remoteConfig.url,
      oninput:e=>{remoteConfig.url=e.target.value.trim();}});
    const keyInp=el('input',{type:'password',autocomplete:'off',spellcheck:'false',placeholder:'sb_publishable_…',value:remoteConfig.key,
      oninput:e=>{remoteConfig.key=e.target.value.trim();}});
    const connectBtn=el('button',{class:'primary',onclick:async()=>{
      if(!remoteConfig.url||!remoteConfig.key){alert('Enter the Supabase Project URL and publishable key.');return;}
      connectionUI.message='Connecting to Supabase Realtime…';render();
      const ok=await switchToRemoteTransport();
      if(ok){connectionUI.message='Remote transport ready. Choose Examiner or Candidate.';render();}
    }},'Enable multi-device mode');
    const cfg=el('div',{class:'card remote-setup'},[
      el('h3',{},'Supabase Realtime connection'),
      el('p',{class:'mini-note'},'Use the Project URL and publishable key from your Supabase project. Do not enter a secret/service-role key. This build keeps these values only in active memory.'),
      el('div',{class:'remote-fields'},[
        el('div',{class:'field'},[el('label',{},'Supabase Project URL'),urlInp]),
        el('div',{class:'field'},[el('label',{},'Supabase publishable key'),keyInp])
      ]),
      el('div',{class:'setup-actions'},[connectBtn]),
      el('p',{class:'mini-note'},'Supabase Realtime must have Anonymous Sign-Ins enabled and the included SQL authorization policies applied. No participant response data is stored on the Candidate device.'),
      connectionUI.message?el('div',{class:'notice info'},connectionUI.message):null
    ].filter(Boolean));
    children[1].appendChild(cfg);
  } else {
    children[1].appendChild(el('div',{class:'notice info'},'Same-device mode is ready. BroadcastChannel is only for windows sharing the same browser/device origin; it does not connect a separate phone to a laptop.'));
  }
  children[1].appendChild(el('div',{class:'card'},[
    el('h3',{},'Choose role'),
    el('div',{class:'controls-row'},[
      el('button',{class:'primary role-launch',type:'button',onclick:(e)=>{e.preventDefault();e.stopPropagation();setRole('examiner');}},'Examiner'),
      el('button',{class:'primary role-launch',type:'button',onclick:(e)=>{e.preventDefault();e.stopPropagation();setRole('candidate');}},'Candidate')
    ])
  ]));
  return el('div',{},children);
}

function renderConnectionStatus(role){
  if(isSelfTestMode() && role==='candidate') return null;
  const connected=role==='examiner'?STATE.candidateConnected:connectionUI.candidate==='connected';
  const label=role==='examiner'?(connected?'Candidate connected':'Candidate disconnected'):(connected?'Connected to Examiner':'Connection lost');
  return el('div',{class:'connection-status '+(connected?'online':'offline'),title:role==='examiner'?'Candidate connection status':'Examiner connection status'},[
    el('span',{class:'connection-dot'},'●'),el('span',{},label),
    el('span',{class:'connection-mode'},TRANSPORT_MODE)
  ]);
}
function renderExaminerConnectionCard(){
  const c=el('div',{class:'card connection-card no-print'});
  c.appendChild(el('div',{class:'connection-header'},[
    el('div',{},[el('h3',{},'Live candidate connection'),el('p',{class:'mini-note'},TRANSPORT_MODE==='LOCAL'?'Same-device real-time transport · BroadcastChannel':'Multi-device real-time transport · Supabase Realtime')]),
    renderConnectionStatus('examiner')
  ]));
  if(STATE.sessionCode){
    c.appendChild(el('div',{class:'session-code-box'},[
      el('span',{class:'mini-note'},'Candidate Session Code'),
      el('strong',{},STATE.sessionCode),
      el('span',{class:'mini-note'},TRANSPORT_MODE==='REMOTE'?'Give this 6-character code to the candidate.':'Open Candidate Window on this same device and enter this code.')
    ]));
  }
  if(STATE.candidateJoinPending){
    c.appendChild(el('div',{class:'notice info'},[
      'Candidate join request received. ',
      el('button',{class:'primary',onclick:()=>examinerAcceptCandidate()},'Accept'),
      el('button',{onclick:()=>examinerRejectCandidate(),style:'margin-left:.4em;'},'Reject')
    ]));
  } else if(STATE.candidateConnected){
    c.appendChild(el('p',{class:'mini-note'},'Candidate is connected. Responses are received live and the Examiner remains the authoritative controller.'));
  } else {
    c.appendChild(el('p',{class:'mini-note'},'Waiting for candidate to join this session…'));
    if(connectionUI.examiner==='error' && connectionUI.message){
      c.appendChild(el('div',{class:'notice'},connectionUI.message));
    }
  }
  return c;
}
function renderCandidateConnection(){
  const c=el('div',{class:'card candidate-connect'});
  c.appendChild(el('div',{class:'dbda-mark'},'DBDA-R'));
  if(connectionUI.candidate==='connecting'){
    c.appendChild(el('h2',{},'Connecting to examiner session…'));
    c.appendChild(el('p',{class:'mini-note'},'Waiting for the examiner to accept this candidate connection.'));
  } else if(connectionUI.candidate==='error'){
    c.appendChild(el('h2',{},'Connection not established'));
    c.appendChild(el('p',{class:'mini-note'},connectionUI.message||'Check the session code and try again.'));
  } else {
    c.appendChild(el('h2',{},'Join Examiner Session'));
    c.appendChild(el('p',{class:'mini-note'},'Enter the 6-character session code provided by your examiner.'));
  }
  const inp=el('input',{type:'text',inputmode:'text',autocomplete:'off',spellcheck:'false',maxlength:'6',placeholder:'XXXXXX',value:candidateJoinCodeDraft,
    oninput:e=>{candidateJoinCodeDraft=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6);}});
  inp.setAttribute('aria-label','Examiner session code');
  c.appendChild(el('div',{class:'candidate-code-entry'},[inp,el('button',{class:'primary',disabled:connectionUI.candidate==='connecting',onclick:()=>candidateJoin(inp.value)},'Connect')]));
  c.appendChild(el('div',{class:'connection-status-row'},[
    renderConnectionStatus('candidate'),
    el('span',{class:'mini-note'},'No response data is stored in browser storage.')
  ]));
  return c;
}

/* ---------- Setup ---------- */
function setSess(k,v){ if(getRole()!=='examiner') return; STATE.session[k]=v; }
function renderSetup(){
  const s = STATE.session;
  const card = el('div',{class:'card'});
  card.appendChild(el('h2',{},'Session Setup'));
  const form = el('div',{class:'two-col'});
  function field(labelText, node){ return el('div',{class:'field'},[el('label',{},labelText), node]); }
  const nameInp = el('input',{type:'text','data-keep':'setup-name',value:s.name, oninput:e=>setSess('name',e.target.value)});
  const ageInp = el('input',{type:'text','data-keep':'setup-age',value:s.age, oninput:e=>setSess('age',e.target.value)});
  const sexSel = el('select',{onchange:e=>setSess('sex',e.target.value)},
    ['','M','F'].map(v=>el('option',{value:v, selected:s.sex===v}, v||'\u2014')));
  const occInp = el('input',{type:'text','data-keep':'setup-occ',value:s.occupation, oninput:e=>setSess('occupation',e.target.value)});
  const dateInp = el('input',{type:'date','data-keep':'setup-date',value:s.date, oninput:e=>setSess('date',e.target.value)});
  form.appendChild(field('Name', nameInp));
  form.appendChild(field('Age', ageInp));
  form.appendChild(field('Sex (M/F)', sexSel));
  form.appendChild(field('Class / Occupation', occInp));
  form.appendChild(field('Date', dateInp));
  card.appendChild(form);

  card.appendChild(el('h3',{},'Norm group for Sten conversion'));
  const normRow = el('div',{class:'two-col'});
  const groupSel = el('select',{onchange:e=>{setSess('normGroup',e.target.value); render();}},
    ['School','College','Adult'].map(v=>el('option',{value:v, selected:s.normGroup===v}, v)));
  normRow.appendChild(field('Group', groupSel));
  if(s.normGroup==='School'){
    const classSel = el('select',{onchange:e=>setSess('normClass',e.target.value)},
      ['9th','10th','11th','12th'].map(v=>el('option',{value:v, selected:s.normClass===v}, v)));
    normRow.appendChild(field('Class', classSel));
  }
  const sexNSel = el('select',{onchange:e=>setSess('normSex',e.target.value)},
    ['Combined','Male','Female'].map(v=>el('option',{value:v, selected:s.normSex===v}, v)));
  normRow.appendChild(field('Table (Male/Female/Combined)', sexNSel));
  card.appendChild(normRow);

  card.appendChild(el('h3',{},'Subtest order'));
  card.appendChild(el('p',{class:'mini-note'},'Fixed default order: VA, NA, CA, SA, MA, CL, RA, PM. Drag to reorder if needed.'));
  const list = el('ul',{class:'subtest-list'});
  STATE.order.forEach((k,idx)=>{
    const meta = SUBTEST_META[k];
    const li = el('li',{draggable:'true'},[
      el('span',{},'\u2630'),
      el('span',{}, meta.label),
      !meta.implemented ? el('span',{class:'badge'},'stub \u2014 manual raw entry') : el('span',{class:'badge'},'ready'),
    ]);
    li.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain', idx); });
    li.addEventListener('dragover', e=>e.preventDefault());
    li.addEventListener('drop', e=>{
      e.preventDefault();
      const from = +e.dataTransfer.getData('text/plain');
      const to = idx;
      const o = STATE.order.slice();
      const [m] = o.splice(from,1);
      o.splice(to,0,m);
      STATE.order = o;
      saveState(); render();
    });
    list.appendChild(li);
  });
  card.appendChild(list);

  card.appendChild(el('h3',{},'Options'));
  const optRow = el('div',{},[
    el('label',{},[
      el('input',{type:'checkbox', checked:STATE.na19Credit, onchange:e=>{STATE.na19Credit=e.target.checked; saveState(true);}}),
      ' Credit NA item 19 to everyone (official key: no option is correct on this item)'
    ])
  ]);
  card.appendChild(optRow);

  const startBtn = el('button',{class:'primary', onclick:async()=>{
    if(!STATE.session.name){ alert('Enter the candidate\'s name before starting.'); return; }
    startBtn.disabled=true; startBtn.textContent='Connecting…';
    const ok=await createSessionIfNeeded();
    if(ok) mutate(st=>{ st.session.started=true; st.phase='briefing'; });
    startBtn.disabled=false; startBtn.textContent='Create Session & Begin';
  }}, 'Create Session & Begin');
  card.appendChild(el('div',{class:'controls-row'},[startBtn]));

  const stCard = el('div',{class:'card'});
  stCard.appendChild(el('h3',{},'Built-in self-test'));
  const stBtn = el('button',{onclick:()=>{
    const res = runSelfTest();
    const out = el('div',{}, res.map(r=>el('div',{},[
      `${r.ability} raw ${r.raw} \u2192 Sten ${r.got} (expected ${r.expected}) `,
      el('span',{class:'flag', style: r.pass? 'background:#1f5a4a':''}, r.pass?'PASS':'FAIL')
    ])));
    stCard.querySelector('.st-out')?.remove();
    out.className='st-out';
    stCard.appendChild(out);
  }}, 'Run self-test (School / 9th / Female, Table 7)');
  stCard.appendChild(stBtn);

  const container = el('div',{},[card, stCard]);
  return container;
}

/* ---------- Authoritative section timing ---------- */
function startSectionTimer(st, seconds){
  const duration=Math.max(0,Number(seconds)||0);
  const start=Date.now();
  st.phase='running';
  st.duration=duration;
  st.timerDuration=duration;
  st.timerStatus='running';
  st.timerPausedAt=null;
  st.sectionStartedAt=start;
  st.sectionDurationSeconds=duration;
  st.sectionEndsAt=start+(duration*1000);
  // Keep timerStart for compatibility with the existing examiner/remote snapshot code.
  st.timerStart=start;
}
function clearSectionTimer(st,status='expired'){
  st.timerStatus=status;
  st.timerStart=null;
  st.sectionStartedAt=null;
  st.sectionDurationSeconds=0;
  st.sectionEndsAt=null;
}
function remainingSectionSeconds(state=STATE, fallbackDuration=0){
  const end=state.sectionEndsAt;
  if(end!=null) return Math.max(0,(end-Date.now())/1000);
  if(state.timerStart!=null){
    const duration=Number(state.sectionDurationSeconds||state.duration||fallbackDuration||0);
    return Math.max(0,duration-(Date.now()-state.timerStart)/1000);
  }
  return 0;
}
/* ---------- Timer engine (shared) ---------- */
let tickHandle=null;
function ensureTicker(){
  if(tickHandle) return;
  tickHandle=setInterval(()=>{
    if(STATE.phase==='running' && (STATE.sectionEndsAt!=null || STATE.timerStart!=null)){
      const remaining=remainingSectionSeconds();
      if(remaining<=0){ mutate(st=>{st.phase='timeup';clearSectionTimer(st,'expired');}); return; }
      updateTimerDisplays(remaining);
    } else if(STATE.phase==='rest' && STATE.restUntil!=null){
      const remaining=(STATE.restUntil-Date.now())/1000;
      if(remaining<=0){ mutate(st=>advanceAfterRest(st)); return; }
      updateRestDisplays(remaining);
    }
  },250);
}
ensureTicker();
function updateTimerDisplays(remaining){
  const shown=Math.min(Math.max(0,remaining),STATE.duration||remaining);
  document.querySelectorAll('[data-timer]').forEach(elx=>{
    elx.textContent=fmtTime(shown);
    elx.classList.toggle('low',shown<=30);
  });
  document.querySelectorAll('[data-progress]').forEach(elx=>{
    const pct=STATE.duration?Math.max(0,Math.min(100,100*(1-shown/STATE.duration))):0;
    elx.style.width=pct+'%';
  });
  document.querySelectorAll('[data-status-progress]').forEach(elx=>{
    const pct=STATE.duration?Math.max(0,Math.min(100,100*(1-shown/STATE.duration))):0;
    elx.style.width=pct+'%';
  });
}
function updateRestDisplays(remaining){document.querySelectorAll('[data-rest]').forEach(elx=>elx.textContent=Math.ceil(remaining)+'s');}
function renderAssessmentStatus(role){
  if(!['running','timeup'].includes(STATE.phase)) return null;
  const key=currentSubtestKey(), meta=SUBTEST_META[key]||{};
  const remaining=remainingSectionSeconds(STATE,STATE.duration||0);
  const bar=el('div',{class:'assessment-status','aria-label':'Active assessment status'},[
    el('div',{class:'status-title'},meta.label||key),
    el('div',{class:'status-timer '+(remaining<=30?'low':''),'data-timer':'1'},fmtTime(Math.min(STATE.duration||remaining,remaining))),
    el('div',{class:'status-meta'},role==='examiner'?'EXAMINER · ACTIVE':'ASSESSMENT IN PROGRESS'),
    el('div',{class:'status-progress'},[el('div',{'data-status-progress':'1'})])
  ]);
  return bar;
}

function currentSubtestKey(){ return STATE.order[STATE.currentIndex]; }

function advanceAfterRest(st){
  st.phase='instructions';
  st.part=1;
}

/* ---------- Examiner panel ---------- */
function renderExaminer(){
  const container = el('div',{class:'examiner-panel-grid'});
  const main = el('div',{});
  const side = el('div',{});

  const key = currentSubtestKey();
  const meta = SUBTEST_META[key];

  if(STATE.phase==='briefing'){
    main.appendChild(renderBriefing());
  } else if(STATE.phase==='rest'){
    main.appendChild(renderRestScreen());
  } else if(STATE.phase==='done'){
    main.appendChild(renderDoneScreen());
  } else if(!meta.implemented){
    main.appendChild(renderStubSubtest(key, meta));
  } else if(key==='VA'){
    main.appendChild(renderVAExaminer());
  } else if(key==='NA'){
    main.appendChild(renderSimpleExaminer('NA', NA_ITEMS.length, meta));
  } else if(key==='RA'){
    main.appendChild(renderSimpleExaminer('RA', RA_ROWS.length, meta));
  } else if(key==='CL'){
    main.appendChild(renderSimpleExaminer('CL', CL_PAIRS.length, meta));
  } else if(key==='CA'){
    main.appendChild(renderSimpleExaminer('CA', CA_ITEMS.length, meta));
  } else if(key==='SA'){
    main.appendChild(renderSimpleExaminer('SA', 72, meta));
  } else if(key==='MA'){
    main.appendChild(renderSimpleExaminer('MA', 25, meta));
  } else if(key==='PM'){
    main.appendChild(renderPMExaminer(meta));
  }

  side.appendChild(renderProgressSidebar());
  side.appendChild(renderSubtestNavigation());
  side.appendChild(renderNotesPanel());
  container.appendChild(main);
  container.appendChild(side);
  return container;
}

function renderBriefing(){
  const c = el('div',{class:'card'});
  c.appendChild(el('h2',{},'Before you begin'));
  c.appendChild(el('div',{class:'examiner-script'},
    '"We\u2019re going to work through a set of short tests together. Just do your best on each one \u2014 nobody is expected to get every item right. '+
    'These tests show your particular strengths, and different people are naturally stronger in different areas \u2014 that\u2019s exactly what we want to find out. '+
    'If anything is unclear, ask me before we start a section, and once we start please just keep working until I tell you to stop."'
  ));
  c.appendChild(el('button',{class:'primary', onclick:()=>mutate(st=>{st.phase='instructions'; st.part=1;})}, 'Continue to first subtest'));
  return c;
}

function gotoSubtest(index){
  if(index<0 || index>=STATE.order.length || index===STATE.currentIndex) return;
  if(STATE.phase==='running'){
    if(!confirm('This subtest is currently running. Leave it now? Recorded answers will be kept, but the timed administration will be stopped.')) return;
  }
  mutate(st=>{
    st.currentIndex=index;
    st.part=1;
    st.phase='instructions';
    st.duration=null;
    st.timerDuration=0;
    st.timerStatus='idle';
    st.timerPausedAt=null;
    st.timerStart=null;
    st.sectionStartedAt=null; st.sectionDurationSeconds=0; st.sectionEndsAt=null;
    st.restUntil=null;
  });
}

function renderSubtestNavigation(){
  const c=el('div',{class:'card subtest-nav-card'});
  const idx=STATE.currentIndex;
  const prev=idx>0, next=idx<STATE.order.length-1;
  c.appendChild(el('h3',{},'Examiner navigation'));
  c.appendChild(el('p',{class:'mini-note'},'Move between subtests without losing recorded responses. This navigation is examiner-only; the candidate view remains on the selected subtest.'));
  c.appendChild(el('div',{class:'controls-row'},[
    el('button',{disabled:!prev,onclick:()=>gotoSubtest(idx-1)},prev?'← '+SUBTEST_META[STATE.order[idx-1]].label:'← Previous'),
    el('button',{disabled:!next,onclick:()=>gotoSubtest(idx+1)},next?SUBTEST_META[STATE.order[idx+1]].label+' →':'Next →')
  ]));
  const jump=el('select',{onchange:e=>{const v=e.target.value;if(v!=='')gotoSubtest(Number(v));e.target.value='';}},[
    el('option',{value:''},'Jump to a subtest…'),
    ...STATE.order.map((k,i)=>el('option',{value:String(i)},`${i+1}. ${SUBTEST_META[k].label}${i===idx?' (current)':''}`))
  ]);
  c.appendChild(el('div',{class:'field',style:'margin-top:.6em;'},[el('label',{},'Quick jump'),jump]));
  return c;
}

function renderProgressSidebar(){
  const c = el('div',{class:'card'});
  c.appendChild(el('h3',{},'Session'));
  c.appendChild(el('p',{class:'mini-note'}, STATE.session.name + ' — ' + STATE.session.normGroup + (STATE.session.normGroup==='School'?(' '+STATE.session.normClass):'') + ' / ' + STATE.session.normSex));
  const list = el('ul',{class:'subtest-list'});
  STATE.order.forEach((k,idx)=>{
    const cls = idx<STATE.currentIndex ? 'done' : (idx===STATE.currentIndex? 'current':'');
    const li=el('li',{class:cls,style:'cursor:pointer;',title:'Open '+SUBTEST_META[k].label},[
      el('span',{},SUBTEST_META[k].label),
      idx<STATE.currentIndex?el('span',{class:'badge'},'done'):(idx===STATE.currentIndex?el('span',{class:'badge'},'current'):'')
    ]);
    li.addEventListener('click',()=>gotoSubtest(idx));
    list.appendChild(li);
  });
  c.appendChild(list);
  c.appendChild(el('div',{class:'controls-row'},[
    el('button',{onclick:()=>{if(confirm('View report now? You can still return to finish remaining subtests.'))mutate(st=>{st.prevPhase=st.phase;st.phase='report';});}},'View report / scores')
  ]));
  return c;
}

function renderNotesPanel(){
  const c = el('div',{class:'card'});
  c.appendChild(el('h3',{},'Examiner notes'));
  const ta = el('textarea',{class:'notefield','data-keep':'draft-note', placeholder:'Add a note about this session (behavior, pause reason, anomalies)...'});
  const addBtn = el('button',{onclick:()=>{
    if(!ta.value.trim()) return;
    mutate(st=>{ st.notes.push({subtest: currentSubtestKey(), text: ta.value.trim(), ts: Date.now()}); });
  }}, 'Add note');
  c.appendChild(ta);
  c.appendChild(el('div',{class:'controls-row'},[addBtn]));
  if(STATE.notes.length){
    const list = el('div',{});
    STATE.notes.slice().reverse().forEach(n=>{
      list.appendChild(el('div',{class:'mini-note', style:'margin-top:.5em;border-top:1px solid var(--line);padding-top:.4em;'}, `[${n.subtest}] ${n.text}`));
    });
    c.appendChild(list);
  }
  return c;
}

/* ---- stub subtest (CA/SA/MA/PM): manual raw entry + strong flag ---- */
function renderStubSubtest(key, meta){
  const c = el('div',{class:'card'});
  c.appendChild(el('h2',{}, [meta.label, el('span',{class:'flag'},'NEEDS EXAMINER CHECK')]));
  c.appendChild(el('div',{class:'notice'},
    `The figure/image items for ${key} have not been built into this tool yet (this is a phase-2 item \u2014 image assets need to be cropped from the source booklet). `+
    `Administer this subtest from the printed booklet as usual, then enter the candidate\u2019s raw score below so it still appears in the Sten conversion and final report.`
  ));
  const timeNote = el('p',{class:'mini-note'}, `Official time limit: ${fmtTime(meta.seconds)}` + (key==='PM'? ' (+0:30 practice on 5 figures)':'') + '. Time this manually with a stopwatch.');
  c.appendChild(timeNote);

  if(key==='PM'){
    const modeSel = el('select',{onchange:e=>{ mutate(st=>st.pmMode=e.target.value); }},
      ['PAPER','AUTO'].map(v=>el('option',{value:v, selected:STATE.pmMode===v}, v + (v==='AUTO'?' (not implemented \u2014 falls back to manual count)':''))));
    c.appendChild(el('div',{class:'field'},[el('label',{},'PM scoring mode'), modeSel]));
  }

  const raw = STATE.manualRaw[key];
  const inp = el('input',{type:'number','data-keep':'draft-raw', min:'0', max:meta.max, value: raw==null?'':raw, style:'width:8em;'});
  const saveBtn = el('button',{class:'primary', onclick:()=>{
    const v = inp.value==='' ? null : Math.max(0, Math.min(meta.max, parseInt(inp.value,10)));
    mutate(st=>{ st.manualRaw[key]=v; });
  }}, 'Save raw score');
  c.appendChild(el('div',{class:'field'},[el('label',{},`Raw score (0\u2013${meta.max})`), el('div',{class:'controls-row'},[inp, saveBtn])]));

  if(raw!=null){
    const look = normLookup(key);
    c.appendChild(el('p',{}, `Raw ${look.raw} \u2192 Sten ${look.sten ?? '\u2014'} ${look.flag? '('+look.flag+')':''}`));
    if(look.note) c.appendChild(el('p',{class:'mini-note'}, look.note));
  }

  const nav = el('div',{class:'controls-row'},[
    el('button',{onclick:()=>skipToNext()}, 'Mark complete \u2192 next subtest'),
  ]);
  c.appendChild(nav);
  return c;
}

function skipToNext(){
  mutate(st=>{
    if(st.currentIndex >= st.order.length-1){
      st.phase='done';
    } else {
      st.currentIndex++;
      st.phase='rest';
      st.restUntil = Date.now() + 25000;
    }
  });
}

/* ---- VA examiner flow (two parts) ---- */
function renderVAExaminer(){
  const part = STATE.part || 1;
  const meta = SUBTEST_META.VA.parts[part-1];
  const items = part===1 ? VA1_ITEMS : VA2_ITEMS;
  const respKey = part===1 ? 'VA1' : 'VA2';
  return renderSubtestFlow({
    title: meta.label,
    instructions: part===1 ?
      "This test is in two parts, each timed separately. In PART I, the candidate sees a word in capitals, then five words; they mark the one that means the same thing. Two examples (X, Y) are worked first and are not scored." :
      "PART II: the candidate reads a saying/proverb in capitals, then five sayings; they mark the one that means about the same thing. An example (Y) is worked first and is not scored.",
    script: part===1?
      "\"Read the instructions for this test to yourself while I read them aloud... Are there any questions before you begin?\"" :
      "\"Now Part II. When you have finished Part I you must STOP — do not go back and change any answers. Are there any questions before you begin?\"",
    seconds: meta.seconds,
    itemCount: items.length,
    respKey,
    startLabel: 'All right, turn the page and begin.',
    onDone: ()=>{
      mutate(st=>{
        if(part===1){ st.part=2; st.phase='instructions'; }
        else if(st.currentIndex >= st.order.length-1){ st.phase='done'; }
        else { st.currentIndex++; st.phase='rest'; st.restUntil=Date.now()+25000; }
      });
      if(part!==1 && STATE.phase==='done') saveCompletedResultOnce();
    },
    renderItems: (locked)=>renderVAItems(part, respKey, locked),
  });
}

function renderVAItems(part, respKey, locked){
  const items = part===1 ? VA1_ITEMS : VA2_ITEMS;
  const offset = part===1 ? 1 : 16;
  const box = el('div',{});
  items.forEach((it,i)=>{
    const num = i+offset;
    const [word, opts] = it;
    const current = STATE.responses[respKey][num];
    const block = el('div',{class:'item-block'+(locked?' locked':'')});
    block.appendChild(el('div',{}, [el('b',{}, (num)+'. '+word)]));
    const optWrap = el('div',{class:'options'});
    opts.forEach((o,oi)=>{
      const L = letterFor(oi);
      const chosen = current===L;
      const optEl = el('label',{class:'opt'+(chosen?' selected':'')},[
        el('input',{type:'radio', name:'q'+respKey+num, disabled: locked}),
        L+'. '+o
      ]);
      optEl.addEventListener('click', ()=>{
        if(locked) return;
        recordResponse(respKey,num,L);
      });
      optWrap.appendChild(optEl);
    });
    block.appendChild(optWrap);
    box.appendChild(block);
  });
  return box;
}

/* ---- simple subtests: NA / RA / CL (single timed section) ---- */
function renderSimpleExaminer(key, itemCount, meta){
  const scripts = {
    CA: caExaminerScript(),
    NA: "\"This test is made up of short number problems, five choices each. Two examples are worked first and are not scored. Work as quickly and accurately as you can... Are there any questions before you begin?\"",
    RA: "\"On this test there are 12 rows of five sets of letters. Four of the five sets in each row follow a rule; one does not. Mark the one that does not follow the rule. The rules are not based on sounds, shapes, or vowel/consonant type. Two examples are worked first... Are there any questions before you begin?\"",
    CL: "\"The next page has 72 pairs of letters or numbers, either exactly the same or different in some way. Mark S if the pair is exactly the same, D if different in any way. Work as quickly as you can without sacrificing accuracy. Four examples are worked first... Are there any questions before you begin?\"",
    SA: "\"In each row, compare the sample figure at the left with each test figure. Mark S when the test figure is the same as the sample figure but turned around; mark R when it is reversed or turned over. Work quickly and carefully... Are there any questions before you begin?\"",
    MA: "\"Answer each mechanical reasoning problem by choosing the one best answer. Work as quickly and accurately as you can... Are there any questions before you begin?\"",
  };
  const instructions = {
    CA: 'The candidate sees the incomplete word and five jumbled words, and marks the one that has the right letters to spell the word. The \u201cscore\u201d demonstration and Example X are not scored. 5 minutes.',
    NA: "Each problem is followed by five choices. Do any figuring on the rough-work pad. Mark the correct answer.",
    RA: "Four of the five sets in each row follow a rule; mark the letter of the one set that does not.",
    CL: "REMEMBER: S = Same, D = Different. Mark S only if the two are exactly identical.",
    SA: "S = same figure, only turned around. R = reversed / turned over.",
    MA: "The original booklet pages are displayed below. Select the answer letter for each numbered item.",
  };
  return renderSubtestFlow({
    title: meta.label,
    instructions: instructions[key],
    script: scripts[key],
    seconds: meta.seconds,
    itemCount,
    respKey: key,
    startLabel: 'All right, turn the page and begin.',
    hiddenTimer: meta.hiddenTimer,
    onDone: ()=>{
      mutate(st=>{
        if(st.currentIndex >= st.order.length-1){ st.phase='done'; }
        else { st.currentIndex++; st.phase='rest'; st.restUntil = Date.now()+25000; }
      });
      if(STATE.phase==='done') saveCompletedResultOnce();
    },
    renderItems: (locked)=>{
      if(key==='NA') return renderNAItems(locked);
      if(key==='RA') return renderRAItems(locked);
      if(key==='CL') return renderCLItems(locked);
      if(key==='CA') return renderCAItems(locked);
      if(key==='SA') return renderSAItems(locked);
      if(key==='MA') return renderMAItems(locked);
    },
    extraNote: key==='CA' ? caExaminerNote() : key==='NA' ? el('div',{class:'mini-note'},[
        'Known issue: item 18 is flagged \u2014 see item note.',
      ]) : (key==='CL' ? el('div',{class:'notice'}, 'CL pair text was OCR-transcribed from a scanned booklet. Verify a sample of pairs against the original before treating the CL score as final.') : null),
  });
}

function caExaminerScript(){
  const d = el('div',{});
  d.appendChild(el('p',{},'Say: \u201cRead the instructions for this test to yourself while I read them aloud.\u201d Then read the booklet text below, pausing where marked.'));
  const body = el('div',{style:'font-style:normal;'});
  [CA_INSTR.p1].forEach(t=>body.appendChild(el('p',{},t)));
  body.appendChild(el('p',{class:'mini-note'},'[PAUSE \u2014 candidate looks at the \u201cscore\u201d example]'));
  body.appendChild(el('p',{},CA_INSTR.p2));
  body.appendChild(el('p',{},CA_INSTR.p3));
  body.appendChild(el('p',{class:'mini-note'},'[PAUSE \u2014 candidate marks Example X on screen; the mark is not scored]'));
  body.appendChild(el('p',{},CA_INSTR.p4));
  body.appendChild(el('p',{},CA_INSTR.p5a + CA_INSTR.p5b));
  body.appendChild(el('p',{},CA_INSTR.p6));
  body.appendChild(el('p',{},CA_INSTR.p7));
  d.appendChild(body);
  d.appendChild(el('p',{},'Then ask: \u201cAre there any questions before you begin?\u201d Clarify only \u2014 do not give new examples.'));
  return d;
}
function caExaminerNote(){
  const mark = (STATE.examples||{}).CA_X;
  const wrap = el('div',{});
  wrap.appendChild(el('div',{class:'notice info'},'Example X (not scored): candidate has marked '+(mark? ('\u201c'+mark+'\u201d ('+(mark===CA_EXAMPLES.X.correct?'matches':'differs from')+' the booklet answer \u201c'+CA_EXAMPLES.X.correct+'\u201d)') : 'nothing yet')+'.'));
  const flagged = CA_ITEMS.map((it,i)=>it.flag? (i+1):null).filter(Boolean);
  if(flagged.length){ wrap.appendChild(el('div',{class:'notice'},[el('span',{class:'flag'},'SOURCE CHECK'),' Items '+flagged.join(', ')+ ' carry scan/transcription notes. Review those notes against the supplied booklet before finalising a score.'])); }
  return wrap;
}
function renderCAOptionRow(opts, current, onPick, locked, correctHint){
  const optWrap = el('div',{class:'options ca-opts','role':'radiogroup','aria-label':'CA answer choices'});
  opts.forEach((o,oi)=>{
    const L = letterFor(oi);
    const checked = current===L;
    const input = el('input',{type:'radio',name:'ca-choice',value:L,disabled:locked,checked:checked, 'aria-label':L+'. '+o});
    const optEl = el('label',{class:'opt ca-opt'+(checked?' selected':'')},[input, L+'. '+o]);
    if(onPick) optEl.addEventListener('click',()=>{ if(!locked) onPick(L); });
    optWrap.appendChild(optEl);
  });
  return optWrap;
}
function renderCAItems(locked){
  const box = el('div',{});
  const answered = Object.keys(STATE.responses.CA||{}).filter(k=>STATE.responses.CA[k]).length;
  box.appendChild(el('div',{class:'ca-progress'},[
    el('strong',{},'Closure Ability — 20 items'),
    el('span',{},answered+' / 20 answered')
  ]));
  box.appendChild(el('div',{class:'ca-instruction-note'},[
    el('b',{},'Choose the one scrambled option containing all the letters of the incomplete word. '),
    'Work quickly. Select one answer per item; your selections are saved as you move through the test.'
  ]));
  CA_ITEMS.forEach((it,i)=>{
    const num = i+1;
    const current = STATE.responses.CA[num];
    const block = el('div',{class:'item-block ca-item'+(locked?' locked':'')});
    block.appendChild(el('div',{class:'ca-num'},String(num)));
    block.appendChild(el('div',{class:'ca-imgwrap'},caImg(it)));
    block.appendChild(renderCAOptionRow(it.opts,current,L=>recordResponse('CA',num,L),locked));
    if(it.flag && getRole()==='examiner'){
      block.appendChild(el('div',{class:'ca-flag mini-note'},[el('span',{class:'flag warn'},'SOURCE CHECK'),' '+it.flag]));
    }
    box.appendChild(block);
  });
  return box;
}
function renderCAInstructions(){
  const c = el('div',{class:'instr-page'});
  c.appendChild(el('h2',{},'DBDA-CA \u2014 Closure Ability'));
  c.appendChild(el('p',{},CA_INSTR.p1));
  const ex1 = CA_EXAMPLES.score;
  c.appendChild(el('div',{class:'item-block ca-item ca-example'},[
    el('div',{class:'ca-num'},''), el('div',{class:'ca-imgwrap'}, caImg(ex1)), renderCAOptionRow(ex1.opts, null, null, true)
  ]));
  c.appendChild(el('p',{},CA_INSTR.p2));
  c.appendChild(el('p',{},CA_INSTR.p3));
  c.appendChild(el('p',{},el('b',{},'EXAMPLE X :')));
  const exX = CA_EXAMPLES.X;
  const cur = (STATE.examples||{}).CA_X;
  c.appendChild(el('div',{class:'item-block ca-item ca-example'},[
    el('div',{class:'ca-num'},'X.'), el('div',{class:'ca-imgwrap'}, caImg(exX)),
    renderCAOptionRow(exX.opts, cur, L=>mutate(st=>{ st.examples = st.examples||{}; st.examples.CA_X = L; }), false)
  ]));
  c.appendChild(el('p',{},CA_INSTR.p4));
  c.appendChild(el('p',{},[CA_INSTR.p5a, el('b',{},CA_INSTR.p5b)]));
  c.appendChild(el('p',{},CA_INSTR.p6));
  c.appendChild(el('p',{},CA_INSTR.p7));
  c.appendChild(el('p',{class:'wait-line'},el('b',{},CA_INSTR.p8)));
  return c;
}

function renderNAItems(locked){
  const box = el('div',{});
  NA_ITEMS.forEach((it,i)=>{
    const num=i+1;
    const current = STATE.responses.NA[num];
    const block = el('div',{class:'item-block'+(locked?' locked':'')});
    block.appendChild(el('div',{},[el('b',{},num+'. '), it.text, (it.flag && getRole()==='examiner')? el('span',{class:'flag warn'},'flag'):null].filter(Boolean)));
    if(it.flag && getRole()==='examiner') block.appendChild(el('div',{class:'mini-note'}, it.flag));
    const optWrap = el('div',{class:'options'});
    it.opts.forEach((o,oi)=>{
      const L = letterFor(oi);
      const chosen = current===L;
      const optEl = el('label',{class:'opt'+(chosen?' selected':'')},[el('input',{type:'radio',name:'qNA'+num, disabled:locked}), L+'. '+o]);
      optEl.addEventListener('click',()=>{ if(!locked) recordResponse('NA',num,L); });
      optWrap.appendChild(optEl);
    });
    block.appendChild(optWrap);
    box.appendChild(block);
  });
  return box;
}
function renderRAItems(locked){
  const box = el('div',{});
  RA_ROWS.forEach((row,i)=>{
    const num=i+1;
    const current = STATE.responses.RA[num];
    const block = el('div',{class:'item-block'+(locked?' locked':'')});
    block.appendChild(el('div',{},el('b',{}, 'Row '+num)));
    const optWrap = el('div',{class:'options'});
    row.forEach((set,oi)=>{
      const L = letterFor(oi);
      const chosen = current===L;
      const optEl = el('label',{class:'opt'+(chosen?' selected':'')},[el('input',{type:'radio',name:'qRA'+num, disabled:locked}), L+'. '+set]);
      optEl.addEventListener('click',()=>{ if(!locked) recordResponse('RA',num,L); });
      optWrap.appendChild(optEl);
    });
    block.appendChild(optWrap);
    box.appendChild(block);
  });
  return box;
}
function renderCLItems(locked){
  const box = el('div',{});
  const grid = el('div',{style:'display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.5em;'});
  CL_PAIRS.forEach((pair,i)=>{
    const num=i+1;
    const current = STATE.responses.CL[num];
    const block = el('div',{class:'item-block'+(locked?' locked':''), style:'padding:.5em .7em;'});
    block.appendChild(el('div',{style:'font-family:monospace;font-size:.95rem;'}, num+'. '+pair[0]+'   '+pair[1]));
    const optWrap = el('div',{class:'sd-opts'});
    ['S','D'].forEach(L=>{
      const chosen = current===L;
      const optEl = el('label',{class:'opt'+(chosen?' selected':'')},[el('input',{type:'radio',name:'qCL'+num, disabled:locked}), L]);
      optEl.addEventListener('click',()=>{ if(!locked) recordResponse('CL',num,L); });
      optWrap.appendChild(optEl);
    });
    block.appendChild(optWrap);
    grid.appendChild(block);
  });
  box.appendChild(grid);
  return box;
}

/* ---------- SA / MA / PM source-booklet administration ---------- */
function renderSAItems(locked){
  const box = el('div',{});
  SA_ROWS.forEach((row)=>{
    const wrap = el('div',{class:'item-block'+(locked?' locked':'')});
    wrap.appendChild(saImg(row.img,'DBDA-SA figures '+row.start+'-'+(row.start+5)));
    const grid = el('div',{style:'display:grid;grid-template-columns:repeat(6,minmax(70px,1fr));gap:.45em;margin-top:.6em;'});
    for(let j=0;j<6;j++){
      const num=row.start+j, current=STATE.responses.SA[num];
      const cell=el('div',{style:'text-align:center;font-family:Trebuchet MS,Arial,sans-serif;'},[el('div',{style:'font-weight:bold;margin-bottom:.25em;'},String(num))]);
      ['S','R'].forEach(L=>{
        const b=el('button',{class:'opt'+(current===L?' selected':''),disabled:locked,style:'margin:.12em;padding:.35em .7em;'},L);
        b.addEventListener('click',()=>{if(!locked) recordResponse('SA',num,L);}); cell.appendChild(b);
      });
      grid.appendChild(cell);
    }
    wrap.appendChild(grid); box.appendChild(wrap);
  });
  return box;
}
const MA_PAGES = [
  {img:'page_16.jpg',start:1,end:6},{img:'page_17.jpg',start:7,end:10},
  {img:'page_18.jpg',start:11,end:16},{img:'page_19.jpg',start:17,end:20},
  {img:'page_20.jpg',start:21,end:23},{img:'page_21.jpg',start:24,end:25}
];
function renderMAItems(locked){
  const box=el('div',{});
  MA_PAGES.forEach(pg=>{
    const card=el('div',{class:'item-block'+(locked?' locked':'')});
    card.appendChild(el('img',{class:'source-page',src:assetUrl('ma/'+pg.img),alt:`DBDA-MA booklet page, items ${pg.start}-${pg.end}`,draggable:'false'}));
    const grid=el('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:.45em;margin-top:.7em;'});
    for(let n=pg.start;n<=pg.end;n++){
      const cur=STATE.responses.MA[n];
      const row=el('div',{style:'border:1px solid var(--line);border-radius:6px;padding:.45em;text-align:center;background:#fff;'},[el('b',{},`Item ${n}`)]);
      const opts=el('div',{class:'options',style:'justify-content:center;gap:.25em;'});
      ['a','b','c','d','e'].forEach(L=>{
        const b=el('button',{class:'opt'+(cur===L?' selected':''),disabled:locked,style:'padding:.3em .55em;'},L.toUpperCase());
        b.addEventListener('click',()=>{if(!locked) recordResponse('MA',n,L);}); opts.appendChild(b);
      });
      row.appendChild(opts); grid.appendChild(row);
    }
    card.appendChild(grid); box.appendChild(card);
  });
  return box;
}
function renderPMCandidate(){
  const c=el('div',{});
  c.appendChild(el('div',{class:'card'},[
    el('h2',{},'DBDA-PM — Psychomotor'),
    el('p',{},'The original paper-and-pencil task requires the candidate to draw the lines freehand. Complete the task on the supplied paper booklet under examiner supervision.'),
    el('img',{class:'source-page',src:assetUrl('pm/page_27.jpg'),alt:'DBDA-PM instructions and examples',draggable:'false'}),
    el('img',{class:'source-page',src:assetUrl('pm/page_28.jpg'),alt:'DBDA-PM 70 test figures',draggable:'false'})
  ])); return c;
}
function renderPMExaminer(meta){
  const c=el('div',{class:'card'}); c.appendChild(el('h2',{},meta.label));
  if(STATE.phase==='instructions'){
    c.appendChild(el('p',{},'Administer the PM task from the supplied booklet. The candidate draws the required lines freehand; the digital tool records the examiner\'s item-by-item scoring after the 5-minute working period.'));
    c.appendChild(el('img',{class:'source-page',src:assetUrl('pm/page_27.jpg'),alt:'DBDA-PM instructions',draggable:'false'}));
    c.appendChild(el('button',{class:'primary',onclick:()=>mutate(st=>st.phase='ready')},'Continue to ready screen')); return c;
  }
  if(STATE.phase==='ready'){
    c.appendChild(el('div',{class:'examiner-script'},'“Make sure the candidate has a sharp pencil ready. You will have 5 minutes for doing this test.”'));
    c.appendChild(el('img',{class:'source-page',src:assetUrl('pm/page_27.jpg'),alt:'DBDA-PM instructions and examples',draggable:'false'}));
    c.appendChild(el('button',{class:'primary',onclick:()=>mutate(st=>startSectionTimer(st,meta.seconds))},'START')); return c;
  }
  if(STATE.phase==='running' || STATE.phase==='timeup'){
    const remaining=remainingSectionSeconds(STATE,meta.seconds);
    c.appendChild(el('div',{class:'timer','data-timer':'1'},fmtTime(remaining)));
    if(STATE.phase==='timeup') c.appendChild(el('div',{class:'notice'},'Time is up. Score each of the 70 figures from the candidate\'s paper response.'));
    c.appendChild(el('img',{class:'source-page',src:assetUrl('pm/page_28.jpg'),alt:'DBDA-PM 70 test figures',draggable:'false'}));
    const grid=el('div',{style:'display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:.45em;margin-top:.8em;'});
    for(let i=1;i<=70;i++){
      const v=STATE.responses.PM[i];
      const card=el('div',{class:'item-block',style:'padding:.45em;text-align:center;'},[el('b',{},`Figure ${i}`)]);
      const row=el('div',{class:'options',style:'justify-content:center;'});
      [['correct','Correct'],['incorrect','Incorrect']].forEach(([val,label])=>{
        const b=el('button',{class:'opt'+(v===val?' selected':''),style:'padding:.35em .55em;',disabled:STATE.phase==='running'},label);
        b.addEventListener('click',()=>{if(STATE.phase!=='running') recordResponse('PM',i,val);}); row.appendChild(b);
      });
      const clear=el('button',{style:'padding:.35em .55em;',disabled:STATE.phase==='running'},'Clear');
      clear.addEventListener('click',()=>{if(STATE.phase!=='running') recordResponse('PM',i,'');}); row.appendChild(clear);
      card.appendChild(row); grid.appendChild(card);
    }
    c.appendChild(el('p',{class:'mini-note'},`${scorePM().answered}/70 figures scored; ${scorePM().raw} marked correct.`)); c.appendChild(grid);
    if(STATE.phase==='timeup') c.appendChild(el('button',{class:'primary',onclick:()=>{if(scorePM().answered<70 && !confirm(`Only ${scorePM().answered}/70 figures have been scored. Continue anyway?`)) return; mutate(st=>{if(st.currentIndex>=st.order.length-1) st.phase='done'; else {st.currentIndex++;st.phase='rest';st.restUntil=Date.now()+25000;}});}},'Save PM score and continue →'));
    return c;
  }
  return c;
}

/* ---- generic subtest flow: instructions -> ready -> running -> timeup -> (handled by caller) ---- */
function renderSubtestFlow(cfg){
  const c = el('div',{class:'card'});
  c.appendChild(el('h2',{}, cfg.title));

  if(STATE.phase==='instructions'){
    c.appendChild(el('p',{}, cfg.instructions));
    c.appendChild(el('div',{class:'examiner-script'}, cfg.script));
    if(cfg.extraNote) c.appendChild(cfg.extraNote);
    c.appendChild(el('button',{class:'primary', onclick:()=>mutate(st=>st.phase='ready')}, 'Candidate has no questions \u2014 proceed'));
    return c;
  }
  if(STATE.phase==='ready'){
    c.appendChild(el('div',{class:'examiner-script'}, `"${cfg.startLabel}"`));
    c.appendChild(el('p',{class:'mini-note'},'Items remain locked for the candidate until you click START. The timer begins after a ~3 second page-turn delay.'));
    c.appendChild(el('button',{class:'primary', onclick:()=>{
      mutate(st=>startSectionTimer(st,cfg.seconds));
    }}, 'START'));
    return c;
  }
  if(STATE.phase==='running' || STATE.phase==='timeup'){
    if(!cfg.hiddenTimer){
      const remaining = STATE.phase==='ready' ? cfg.seconds : Math.min(cfg.seconds,remainingSectionSeconds(STATE,cfg.seconds));
      c.appendChild(el('div',{class:'timer', 'data-timer':'1'}, fmtTime(remaining)));
      c.appendChild(el('div',{class:'progress'},[el('div',{'data-progress':'1'})]));
    } else {
      c.appendChild(el('div',{class:'notice'},[
        'Timer hidden from candidate view (examiner-only, per manual). Time remaining: ',
        el('span',{'data-timer':'1'}, fmtTime(STATE.phase==='ready'?cfg.seconds:remainingSectionSeconds(STATE,cfg.seconds))),
        '. If asked, say: "Persons taking this test are not given the working time. Please continue to work until told to stop."'
      ]));
    }
    const answered = Object.keys(STATE.responses[cfg.respKey]||{}).length;
    c.appendChild(el('p',{class:'mini-note'}, `${answered}/${cfg.itemCount} items answered.`));
    if(STATE.phase==='timeup'){
      c.appendChild(el('div',{class:'notice'}, '"Stop working now. Please put your pencils down and turn the booklet immediately." Items are now locked.'));
      c.appendChild(el('button',{class:'primary', onclick:cfg.onDone}, 'Continue \u2192'));
    } else {
      c.appendChild(el('div',{class:'controls-row'},[
        el('button',{class:'danger', onclick:()=>{
          const note = prompt('Reason for pausing/aborting this subtest (required):');
          if(note==null) return;
          mutate(st=>{ st.notes.push({subtest: currentSubtestKey(), text:'PAUSED/ABORTED: '+note, ts:Date.now()}); st.phase='timeup';clearSectionTimer(st,'expired'); });
        }}, 'Pause / Abort'),
      ]));
    }
    const locked = STATE.phase!=='running';
    c.appendChild(cfg.renderItems(locked));
    c.appendChild(renderSubtestNavigation());
    return c;
  }
  return c;
}

function buildResultPayload(status='completed'){
  const abilities=['CA','CL','MA','NA','PM','RA','SA','VA'];
  const scores={};
  abilities.forEach(a=>{const x=normLookup(a);scores[a]={raw:x.raw,sten:x.sten,band:stenBand(x.sten),flag:x.flag||null,note:x.note||null};});
  return {
    session_id:STATE.sessionId, session_code:STATE.sessionCode,
    candidate_name:STATE.session.name||null,candidate_id:STATE.session.candidateId||null,candidate_age:STATE.session.age||null,candidate_sex:STATE.session.sex||null,
    candidate_occupation:STATE.session.occupation||null,candidate_email:STATE.session.email||null,candidate_mobile:STATE.session.mobile||null,examination_date:STATE.session.date||null,
    norm_group:STATE.session.normGroup||null,norm_class:STATE.session.normClass||null,norm_sex:STATE.session.normSex||null,
    responses:STATE.responses,manual_raw:STATE.manualRaw,scores,validity_flags:validityChecks(),examiner_notes:STATE.notes,
    tab_focus_loss:STATE.tabFocusLoss||0,app_version:'DBDA-R Candidate Self-Test v8.3 Google Apps Script',status,
    attempt_id:STATE.attemptId||null,submitted_at:status==='completed'?new Date().toISOString():null
  };
}

async function postCandidateSubmission(payload){
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  let result;
  try{
    result = await res.json();
  }catch(e){
    throw new Error('Server returned an unexpected response (HTTP ' + res.status + ').');
  }
  if(!res.ok || (result && result.success === false)){
    throw new Error((result && (result.error || result.message)) || 'Submission was rejected by the server.');
  }
  return result || {success:true};
}

async function saveSelfTestProgress(final=false){
  if(!isSelfTestMode() || getRole()!=='candidate' || !STATE.sessionId) return {ok:false,message:'Self-test not active.'};
  if(selfTestSaveInFlight) return selfTestSaveInFlight;
  // During the test, keep recovery locally. Only the final submission is sent to Google.
  selfTestPersistLocal();
  if(!final){ resultSaveStatus='not_saved'; resultSaveMessage='Responses saved on this device for recovery.'; return {ok:true,message:resultSaveMessage}; }
  selfTestSaveInFlight=(async()=>{
    try{
      resultSaveStatus='saving'; resultSaveMessage='Submitting assessment…'; render();
      const payload=buildResultPayload('completed');
      await postCandidateSubmission(payload);
      resultSaveStatus='saved'; resultSaveMessage='Assessment submitted successfully.';
      STATE.attemptStatus='completed';
      selfTestClearActivePointer();
      try{localStorage.removeItem(SELFTEST_STORAGE_KEY);localStorage.removeItem('DBDAR_PENDING_SUBMISSION_V1');}catch(e){}
      return {ok:true,message:resultSaveMessage};
    }catch(e){
      console.error('DBDA-R Google submission failed',e);
      try{localStorage.setItem('DBDAR_PENDING_SUBMISSION_V1',JSON.stringify({payload:buildResultPayload('completed'),savedAt:Date.now()}));}catch(_e){}
      resultSaveStatus='error';
      resultSaveMessage='Submission could not be confirmed. Your completed assessment is saved on this device and can be retried.';
      return {ok:false,message:resultSaveMessage};
    }finally{ selfTestSaveInFlight=null; render(); }
  })();
  return selfTestSaveInFlight;
}

async function retryPendingSubmission(){
  try{
    const raw=localStorage.getItem('DBDAR_PENDING_SUBMISSION_V1');
    if(!raw) return;
    const item=JSON.parse(raw);
    await postCandidateSubmission(item.payload);
    localStorage.removeItem('DBDAR_PENDING_SUBMISSION_V1');
  }catch(e){ console.warn('Pending submission retry failed',e); }
}

async function saveCompletedResult(){
  if(isSelfTestMode() && getRole()==='candidate') return saveSelfTestProgress(true);
  return {ok:false,message:'Examiner result saving is not used in the candidate one-link build.'};
}

function saveCompletedResultOnce(){
  if(resultSaveStatus==='saved') return Promise.resolve({ok:true,message:resultSaveMessage});
  return saveCompletedResult();
}

function endSession(){
  if(getRole()!=='examiner')return;
  postEvent('SESSION_ENDED',{});
  mutate(st=>{st.sessionEnded=true;st.phase='report';clearSectionTimer(st,'ended');});
}
function renderDoneScreen(){
  const c = el('div',{class:'card locked-screen'});
  c.appendChild(el('h2',{},'All subtests complete'));
  c.appendChild(el('p',{},'Every subtest in the order has been administered (or scored manually).'));
  c.appendChild(el('button',{class:'primary', onclick:async()=>{ mutate(st=>{ st.prevPhase='done'; st.phase='report'; }); await saveCompletedResultOnce(); }}, 'Go to report'));
  return c;
}

/* ---------- Rest screen ---------- */
function renderRestScreen(){
  const c = el('div',{class:'card locked-screen'});
  c.appendChild(el('h2',{},'Short rest'));
  const remaining = STATE.restUntil? (STATE.restUntil-Date.now())/1000 : 0;
  c.appendChild(el('div',{class:'rest-count','data-rest':'1'}, Math.ceil(remaining)+'s'));
  c.appendChild(el('p',{class:'mini-note'},'Next subtest instructions will begin automatically.'));
  return c;
}

/* ---------- Candidate self-test mode ---------- */
function startCandidateSelfTest(){
  if(!STATE.session.name || !String(STATE.session.name).trim()){ alert("Enter the candidate's name before starting."); return; }
  if(STATE.session.email && !/^\S+@\S+\.\S+$/.test(STATE.session.email)){ alert('Enter a valid email address or leave it blank.'); return; }
  const sessionData=structuredClone(STATE.session);
  selfTestStartFresh(sessionData);
  STATE.session.started=true;
  STATE.phase='briefing';
  STATE.currentIndex=0; STATE.part=1;
  selfTestPersistLocal();
  render();
  saveSelfTestProgress(false);
}
function renderCandidateSelfTestSetup(){
  const s=STATE.session;
  const c=el('div',{class:'card'});
  c.appendChild(el('h2',{},'Candidate Information'));
  if(selfTestSavedAttempt){
    const saved=selfTestSavedAttempt.state;
    const when=selfTestSavedAttempt.savedAt?new Date(selfTestSavedAttempt.savedAt).toLocaleString():'';
    c.appendChild(el('div',{class:'notice info'},[
      el('b',{},'An unfinished assessment was found.'),
      el('br'),
      `Attempt ${saved.attemptId}${when?' · last saved '+when:''}.`,
      el('br'),
      'Choose Resume Existing to continue that attempt, or Start New Assessment to create a completely fresh attempt.'
    ]));
    c.appendChild(el('div',{class:'controls-row'},[
      el('button',{class:'primary',onclick:()=>{
        const data=selfTestSavedAttempt;
        try{ STATE=Object.assign(freshState(),data.state); sessionStorage.setItem(SELFTEST_TAB_KEY,STATE.attemptId); }catch(e){ alert('Could not restore the saved assessment.'); return; }
        selfTestSavedAttempt=null; render();
      }},'RESUME EXISTING'),
      el('button',{onclick:()=>{ selfTestSavedAttempt=null; }},'START NEW ASSESSMENT')
    ]));
  }
  c.appendChild(el('p',{class:'mini-note'},'Complete your details before starting. Your responses are saved on this device during the test and submitted securely at the end.'));
  const form=el('div',{class:'two-col'});
  const field=(label,node)=>el('div',{class:'field'},[el('label',{},label),node]);
  form.appendChild(field('Name',el('input',{type:'text','data-keep':'self-name',value:s.name,oninput:e=>{s.name=e.target.value;scheduleSelfTestSave();}})));
  form.appendChild(field('Candidate ID / Roll Number',el('input',{type:'text','data-keep':'self-id',value:s.candidateId||'',oninput:e=>{s.candidateId=e.target.value;scheduleSelfTestSave();}})));
  form.appendChild(field('Age',el('input',{type:'text','data-keep':'self-age',value:s.age,oninput:e=>{s.age=e.target.value;scheduleSelfTestSave();}})));
  form.appendChild(field('Sex',el('select',{onchange:e=>{s.sex=e.target.value;scheduleSelfTestSave();}},['','M','F'].map(v=>el('option',{value:v,selected:s.sex===v},v||'—')))));
  form.appendChild(field('Occupation / Class',el('input',{type:'text','data-keep':'self-occ',value:s.occupation,oninput:e=>{s.occupation=e.target.value;scheduleSelfTestSave();}})));
  form.appendChild(field('Email',el('input',{type:'email','data-keep':'self-email',value:s.email||'',oninput:e=>{s.email=e.target.value;scheduleSelfTestSave();}})));
  form.appendChild(field('Mobile',el('input',{type:'tel','data-keep':'self-mobile',value:s.mobile||'',oninput:e=>{s.mobile=e.target.value;scheduleSelfTestSave();}})));
  form.appendChild(field('Examination Date',el('input',{type:'date','data-keep':'self-date',value:s.date,oninput:e=>{s.date=e.target.value;scheduleSelfTestSave();}})));
  c.appendChild(form);
  c.appendChild(el('h3',{},'Norm group'));
  const nr=el('div',{class:'two-col'});
  nr.appendChild(field('Group',el('select',{onchange:e=>{s.normGroup=e.target.value;render();}},['School','College','Adult'].map(v=>el('option',{value:v,selected:s.normGroup===v},v)))));
  if(s.normGroup==='School') nr.appendChild(field('Class',el('select',{onchange:e=>{s.normClass=e.target.value;scheduleSelfTestSave();}},['9th','10th','11th','12th'].map(v=>el('option',{value:v,selected:s.normClass===v},v)))));
  nr.appendChild(field('Norm Sex',el('select',{onchange:e=>{s.normSex=e.target.value;scheduleSelfTestSave();}},['Combined','Male','Female'].map(v=>el('option',{value:v,selected:s.normSex===v},v)))));
  c.appendChild(nr);
  c.appendChild(el('div',{class:'notice info'},'You will complete the assessment independently. Follow the on-screen instructions and work until each section timer ends.'));
  c.appendChild(el('button',{class:'primary',onclick:startCandidateSelfTest},'START ASSESSMENT'));
  return c;
}
function renderSelfTestBriefing(){
  const c=el('div',{class:'card'});
  c.appendChild(el('h2',{},'Before you begin'));
  c.appendChild(el('p',{},'You will work through the DBDA-R sections in order. Read the instructions and the original questionnaire pages carefully. When a section begins, work as quickly and accurately as you can until the timer ends.'));
  c.appendChild(el('p',{class:'mini-note'},'Your responses are saved during the assessment. If your internet connection briefly drops, keep this page open; the app will retry when the connection returns.'));
  c.appendChild(el('button',{class:'primary',onclick:()=>mutate(st=>{st.phase='instructions';st.part=1;})},'Continue to first subtest'));
  return c;
}
function advanceSelfTestAfterSection(){
  mutate(st=>{
    const key=st.order[st.currentIndex];
    if(key==='VA' && st.part===1){ st.part=2; st.phase='instructions'; return; }
    if(st.currentIndex>=st.order.length-1){ st.phase='done'; st.attemptStatus='active'; clearSectionTimer(st,'ended'); return; }
    st.currentIndex++; st.part=1; st.phase='rest'; st.restUntil=Date.now()+25000;
  });
  if(STATE.phase==='done') saveCompletedResultOnce();
}
function renderCandidateSelfTest(){
  if(STATE.phase==='setup') return renderCandidateSelfTestSetup();
  if(STATE.phase==='briefing') return renderSelfTestBriefing();
  if(STATE.sessionEnded||STATE.phase==='report'||STATE.phase==='done') return renderSelfTestCompletion();
  const key=currentSubtestKey(),meta=SUBTEST_META[key];
  if(!meta) return el('div',{class:'card locked-screen'},'Assessment configuration error.');
  if(key==='PM') return renderPMCandidateSelfTest(meta);
  if(STATE.phase==='rest') return renderRestScreen();
  if(STATE.phase==='instructions') return renderSelfTestInstructions(key,meta);
  if(STATE.phase==='ready') return renderSelfTestReady(key,meta);
  return renderCandidate();
}
function renderSelfTestInstructions(key,meta){
  const c=el('div',{class:'card'});
  c.appendChild(el('h2',{},meta.label+(key==='VA'?' — Part '+STATE.part:'')));
  const src=sourceSectionFor(key); if(src)c.appendChild(src);
  c.appendChild(el('p',{},'Read the original questionnaire and the on-screen instructions. When ready, start the timed section.'));
  if(key==='CA'){ c.appendChild(el('p',{},CA_INSTR.p1)); c.appendChild(el('p',{},CA_INSTR.p2)); c.appendChild(el('p',{},CA_INSTR.p3)); c.appendChild(el('p',{},CA_INSTR.p4)); }
  c.appendChild(el('button',{class:'primary',onclick:()=>mutate(st=>st.phase='ready')},'I am ready — continue'));
  return c;
}
function renderSelfTestReady(key,meta){
  const c=el('div',{class:'card'});
  c.appendChild(el('h2',{},meta.label+(key==='VA'?' — Part '+STATE.part:'')));
  c.appendChild(el('p',{},'The timed section is ready. Click START when you are ready to begin.'));
  const src=sourceSectionFor(key); if(src)c.appendChild(src);
  c.appendChild(el('button',{class:'primary',onclick:()=>mutate(st=>startSectionTimer(st,meta.seconds||300))},'START'));
  return c;
}
function renderPMCandidateSelfTest(meta){
  const c=el('div',{class:'card'}); c.appendChild(el('h2',{},meta.label));
  const src=sourceSectionFor('PM'); if(src)c.appendChild(src);
  c.appendChild(el('p',{},'Complete the psychomotor task using the original questionnaire pages. This section remains examiner-scored; your digital self-test will record the task as pending examiner scoring.'));
  c.appendChild(el('button',{class:'primary',onclick:()=>mutate(st=>{st.manualRaw.PM=null; if(st.currentIndex>=st.order.length-1)st.phase='done';else{st.currentIndex++;st.phase='rest';st.restUntil=Date.now()+25000;}})},'Mark PM complete and continue'));
  return c;
}
function renderSelfTestCompletion(){
  const c=el('div',{class:'card locked-screen'});
  c.appendChild(el('h2',{},'Assessment completed'));
  c.appendChild(el('p',{},'Your assessment has been completed. Please keep this page open until the save confirmation appears.'));
  c.appendChild(el('p',{class:'mini-note'},STATE.attemptId?'Attempt ID: '+STATE.attemptId:''));
  c.appendChild(el('div',{class:'notice '+(resultSaveStatus==='saved'?'info':'')},resultSaveMessage || 'Saving your completed assessment…'));
  if(resultSaveStatus==='error') c.appendChild(el('button',{class:'primary',onclick:()=>saveCompletedResultOnce()},'Retry save'));
  return c;
}

/* ---------- Candidate view ---------- */
function renderCandidate(){
  const box=el('div',{class:'candidate-view'});box.style.userSelect='none';
  if(STATE.phase==='setup'){
    box.appendChild(el('div',{class:'locked-screen'},[el('h2',{},'Connected'),el('p',{},'Waiting for examiner to start the assessment.')]));
    return box;
  }
  if(STATE.phase==='briefing'){
    box.appendChild(el('div',{class:'locked-screen'},[el('h2',{},'Please wait for the examiner'),el('p',{},'The examiner is preparing the assessment.')]));
    return box;
  }
  if(STATE.sessionEnded||STATE.phase==='report'||STATE.phase==='done'){
    box.appendChild(el('div',{class:'locked-screen'},[el('h2',{},'Testing complete'),el('p',{},'Please wait for your examiner.')]));
    return box;
  }
  const key=currentSubtestKey(),meta=SUBTEST_META[key];
  if(!meta){
    box.appendChild(el('div',{class:'locked-screen'},'Waiting for the examiner…'));return box;
  }
  if(!meta.implemented){
    box.appendChild(el('div',{class:'locked-screen'},[el('h2',{},meta.label),el('p',{},'Please follow your examiner’s instructions using the supplied assessment materials.')]));
    return box;
  }
  if(STATE.phase==='instructions'&&key==='CA'){box.appendChild(renderCAInstructions());return box;}
  if(STATE.phase==='instructions'){
    box.appendChild(el('div',{class:'locked-screen'},[
      el('h2',{},meta.label+(key==='VA'?' — Part '+STATE.part:'')),
      el('p',{},'Please listen to your examiner. The assessment will begin when the examiner starts it.')
    ]));return box;
  }
  if(STATE.phase==='ready'){
    box.appendChild(el('div',{class:'locked-screen'},[el('h2',{},'Get ready…'),el('p',{},'Wait for your examiner to say begin.')]));
    return box;
  }
  if(STATE.phase==='rest'){box.appendChild(renderRestScreen());return box;}
  if(key==='PM'){
    box.appendChild(el('div',{class:'locked-screen'},[
      el('h2',{},'DBDA-PM — Psychomotor'),
      el('p',{},'Complete the paper-and-pencil task exactly as instructed by your examiner.'),
      el('p',{class:'mini-note'},'The examiner records the scoring; no examiner scoring controls are shown here.')
    ]));return box;
  }
  const locked=STATE.phase!=='running';
  const progress=el('div',{class:'progress'},[el('div',{'data-progress':'1'})]);
  const header=el('div',{},[el('h2',{},meta.label+(key==='VA'?' — Part '+STATE.part:''))]);
  box.appendChild(header);
  if(STATE.duration){
    const remaining=Math.min(STATE.duration,remainingSectionSeconds(STATE,STATE.duration));
    box.appendChild(el('div',{class:'timer','data-timer':'1'},fmtTime(remaining)));
  }
  box.appendChild(progress);
  if(STATE.phase==='timeup')box.appendChild(el('div',{class:'notice'},'Stop working now. Please put your pencils down and follow your examiner’s instruction.'));
  // Candidate must see the original questionnaire pages for visual/scanned subtests.
  // The examiner flow already rendered these pages, but the candidate running view
  // previously omitted sourceSectionFor(), leaving only the answer controls/text.
  const candidateSource=sourceSectionFor(key);
  if(candidateSource) box.appendChild(candidateSource);
  if(key==='VA')box.appendChild(renderVAItems(STATE.part,STATE.part===1?'VA1':'VA2',locked));
  else if(key==='NA')box.appendChild(renderNAItems(locked));
  else if(key==='RA')box.appendChild(renderRAItems(locked));
  else if(key==='CL')box.appendChild(renderCLItems(locked));
  else if(key==='CA')box.appendChild(renderCAItems(locked));
  else if(key==='SA')box.appendChild(renderSAItems(locked));
  else if(key==='MA')box.appendChild(renderMAItems(locked));
  if(isSelfTestMode() && STATE.phase==='timeup'){
    box.appendChild(el('div',{class:'notice'},'Time is up. Stop working and continue to the next section.'));
    box.appendChild(el('button',{class:'primary',onclick:advanceSelfTestAfterSection},'Continue to next section →'));
  }
  return box;
}

/* ---------- Report ---------- */
function renderReport(){
  const c = el('div',{});
  const header = el('div',{class:'card'});
  header.appendChild(el('h2',{},'Test Scores'));
  const s = STATE.session;
  header.appendChild(el('p',{}, `${s.name} \u2014 Age ${s.age||'\u2014'} \u2014 Sex ${s.sex||'\u2014'} \u2014 ${s.occupation||''} \u2014 ${s.date}`));
  header.appendChild(el('p',{class:'mini-note'}, `Norm group used: ${s.normGroup}${s.normGroup==='School'?(' '+s.normClass):''} / ${s.normSex}`));
  const saveNotice = el('div',{class:'notice '+(resultSaveStatus==='saved'?'info':'')}, resultSaveMessage || (resultSaveStatus==='saving'?'Saving completed results…':'Completed results will be saved to Supabase.'));
  header.appendChild(saveNotice);
  c.appendChild(header);

  const abilities = ['CA','CL','MA','NA','PM','RA','SA','VA'];
  const scoreCard = el('div',{class:'card table-scroll'});
  const table = el('table');
  table.appendChild(el('tr',{},[el('th',{},'Ability'),el('th',{},'Raw'),el('th',{},'Sten'),el('th',{},'Band'),el('th',{},'Notes')]));
  const stenMap = {};
  abilities.forEach(a=>{
    const look = normLookup(a);
    stenMap[a]=look.sten;
    table.appendChild(el('tr',{},[
      el('td',{}, a),
      el('td',{}, look.raw==null? '\u2014' : look.raw),
      el('td',{}, look.sten==null? '\u2014' : look.sten),
      el('td',{}, stenBand(look.sten)),
      el('td',{class:'mini-note'}, [look.flag, look.note].filter(Boolean).join(' \u2014 ') || ''),
    ]));
  });
  scoreCard.appendChild(table);
  c.appendChild(scoreCard);

  // Ability graph (simple SVG line chart)
  const graphCard = el('div',{class:'card'});
  graphCard.appendChild(el('h3',{},'Ability Graph'));
  graphCard.appendChild(drawGraph(abilities, stenMap));
  graphCard.appendChild(el('p',{class:'mini-note'},'Sten 1\u20133 = Low ability, 4\u20137 = Average, 8\u201310 = High ability (Sten 9\u201310 also flagged in the manual as extremely high / good predictors).'));
  c.appendChild(graphCard);

  // Validity
  const flags = validityChecks();
  const vCard = el('div',{class:'card'});
  vCard.appendChild(el('h3',{},'Validity flags'));
  if(flags.length===0){
    vCard.appendChild(el('p',{class:'mini-note'},'No validity concerns detected.'));
  } else {
    flags.forEach(f=>{
      vCard.appendChild(el('div',{class:'notice'+(f.level==='info'?' info':'')}, f.text));
    });
  }
  c.appendChild(vCard);

  // Notes
  if(STATE.notes.length){
    const nCard = el('div',{class:'card'});
    nCard.appendChild(el('h3',{},'Examiner notes'));
    STATE.notes.forEach(n=>{
      nCard.appendChild(el('p',{class:'mini-note'}, `[${n.subtest}] ${n.text}`));
    });
    c.appendChild(nCard);
  }

  const actions = el('div',{class:'card no-print'});
  actions.appendChild(el('h3',{},'Export'));
  const row = el('div',{class:'controls-row'});
  row.appendChild(el('button',{class:'primary', onclick:()=>saveCompletedResultOnce()}, resultSaveStatus==='saved'?'Saved to Supabase':'Save completed results to Supabase'));
  row.appendChild(el('button',{onclick:()=>window.print()}, 'Print / Save as PDF'));
  row.appendChild(el('button',{onclick:()=>downloadJSON()}, 'Export item-level JSON'));
  row.appendChild(el('button',{onclick:()=>downloadCSV()}, 'Export item-level CSV'));
  row.appendChild(el('button',{onclick:()=>mutate(st=>{ st.phase = (st.prevPhase && st.prevPhase!=='report' && st.prevPhase!=='setup') ? st.prevPhase : (st.currentIndex>=st.order.length-1?'done':'instructions'); })}, '\u2190 Back to testing'));
  row.appendChild(el('button',{class:'danger', onclick:()=>{
    if(confirm('Start a brand-new session? This clears all current data.')){
      postEvent('SESSION_ENDED',{}); STATE = freshState(); render();
    }
  }}, 'New session'));
  actions.appendChild(row);
  c.appendChild(actions);

  return c;
}

function drawGraph(abilities, stenMap){
  const w=760, h=340, padL=60, padR=20, padT=20, padB=40;
  const stepX = (w-padL-padR)/(abilities.length-1);
  const yFor = sten => padT + (10-sten)/9*(h-padT-padB);
  let svg = `<svg class="svg-graph" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;
  // bands
  const bandY = s=>yFor(s);
  svg += `<rect x="${padL}" y="${bandY(10)}" width="${w-padL-padR}" height="${bandY(8)-bandY(10)}" fill="#eef6ef"/>`;
  svg += `<rect x="${padL}" y="${bandY(7)}" width="${w-padL-padR}" height="${bandY(4)-bandY(7)}" fill="#fbfaf6"/>`;
  svg += `<rect x="${padL}" y="${bandY(3)}" width="${w-padL-padR}" height="${bandY(1)-bandY(3)+ (h-padB-bandY(1))}" fill="#fdeeee"/>`;
  for(let s=1;s<=10;s++){
    const y = yFor(s);
    svg += `<line x1="${padL}" y1="${y}" x2="${w-padR}" y2="${y}" stroke="#ddd" stroke-width="1"/>`;
    svg += `<text x="${padL-10}" y="${y+4}" font-size="10" text-anchor="end">${s}</text>`;
  }
  let pts = [];
  abilities.forEach((a,i)=>{
    const x = padL + i*stepX;
    const sten = stenMap[a];
    svg += `<text x="${x}" y="${h-padB+18}" font-size="11" text-anchor="middle">${a}</text>`;
    if(sten!=null){
      const y = yFor(sten);
      pts.push([x,y]);
      svg += `<circle cx="${x}" cy="${y}" r="4" fill="#8b2f2f"/>`;
    }
  });
  if(pts.length>1){
    svg += `<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#8b2f2f" stroke-width="2"/>`;
  }
  svg += `</svg>`;
  const wrap = document.createElement('div');
  wrap.innerHTML = svg;
  return wrap.firstChild;
}

function buildItemLevelData(){
  const out = {session: STATE.session, responses: STATE.responses, manualRaw: STATE.manualRaw, notes: STATE.notes};
  return out;
}
function downloadJSON(){
  const blob = new Blob([JSON.stringify(buildItemLevelData(),null,2)], {type:'application/json'});
  triggerDownload(blob, 'dbda_responses.json');
}
function downloadCSV(){
  const rows = [['subtest','item','response']];
  Object.keys(STATE.responses).forEach(k=>{
    Object.keys(STATE.responses[k]).forEach(item=>{
      rows.push([k,item,STATE.responses[k][item]]);
    });
  });
  Object.keys(STATE.manualRaw).forEach(k=>{
    if(STATE.manualRaw[k]!=null) rows.push([k,'raw_manual',STATE.manualRaw[k]]);
  });
  const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  triggerDownload(blob, 'dbda_responses.csv');
}
function triggerDownload(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download=filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}

/* ---------- Candidate-view protections (registered once; only act in the candidate role) ---------- */
function isCandidate(){ return getRole()==='candidate'; }
document.addEventListener('contextmenu', e=>{ if(isCandidate()) e.preventDefault(); });
['copy','cut','paste','selectstart','dragstart'].forEach(t=>document.addEventListener(t, e=>{ if(isCandidate()) e.preventDefault(); }));
window.addEventListener('blur', ()=>{
  if(!isCandidate() || STATE.phase!=='running') return;
  STATE.tabFocusLoss = (STATE.tabFocusLoss||0)+1;
  postEvent('CANDIDATE_FOCUS_LOSS',{});
});


/* ---------- Embedded original PDF source-page layer ---------- */

let __DBDA_SOURCE_GROUPS_CACHE = DBDA_SOURCE_GROUPS_INPUT;
function getDBDASourceGroups(){
  return __DBDA_SOURCE_GROUPS_CACHE;
}
const DBDA_SOURCE_GROUPS = new Proxy({}, {get(_target, prop){ return getDBDASourceGroups()[prop]; }});
function sourcePageLabel(subtest, page){
  return `DBDA-R — ${SUBTEST_META[subtest] ? SUBTEST_META[subtest].label : subtest} — Original questionnaire page ${page}`;
}
/* Prefer the packaged source-pages JPGs. The original single-file base64 copies remain as a fallback,
   but using the real files avoids browser data-URL limits and makes the ZIP deploy cleanly to HTTPS. */
function sourcePageUrl(page){
  return DBDA_SOURCE_PAGES[page]||'';
}
function sourcePageFallbackUrl(page){
  return DBDA_SOURCE_PAGES[page]||'';
}
function ensureSourceModal(){
  let modal=document.getElementById('sourceModal');
  if(modal) return modal;
  modal=el('div',{id:'sourceModal',class:'source-modal','aria-hidden':'true'});
  const panel=el('div',{class:'source-modal-panel',role:'dialog','aria-modal':'true','aria-label':'Source questionnaire page'});
  const toolbar=el('div',{class:'source-modal-toolbar'});
  const title=el('strong',{id:'sourceModalTitle'},'Source questionnaire');
  const actions=el('div',{class:'zoom-actions'},[
    el('button',{onclick:()=>sourceZoom(-0.15)},'Zoom −'),
    el('button',{onclick:()=>sourceZoom(0.15)},'Zoom +'),
    el('button',{onclick:()=>sourceZoom(0,true)},'Reset zoom'),
    el('button',{class:'danger',onclick:closeSourceModal},'Close')
  ]);
  toolbar.appendChild(title); toolbar.appendChild(actions);
  const body=el('div',{class:'source-modal-body',id:'sourceModalBody'});
  panel.appendChild(toolbar); panel.appendChild(body); modal.appendChild(panel);
  modal.addEventListener('click',e=>{if(e.target===modal)closeSourceModal();});
  document.body.appendChild(modal);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSourceModal();});
  return modal;
}
let SOURCE_MODAL_ZOOM=1;
function openSourceModal(page, label){
  const modal=ensureSourceModal();
  const body=document.getElementById('sourceModalBody');
  const title=document.getElementById('sourceModalTitle');
  body.innerHTML='';
  const img=document.createElement('img');
  img.src=sourcePageUrl(page);
  img.alt=label||`Original questionnaire page ${page}`;
  img.dataset.page=String(page);
  img.onerror=()=>{
    const fallback=sourcePageFallbackUrl(page);
    if(fallback && img.src!==fallback){img.src=fallback;return;}
    body.innerHTML='';body.appendChild(el('div',{class:'notice'},`Source page ${page} failed to load. Check that source-pages/page-${String(page).padStart(2,'0')}.jpg is present in the deployed package.`));
  };
  body.appendChild(img);
  title.textContent=label||`Original questionnaire page ${page}`;
  SOURCE_MODAL_ZOOM=1;
  img.style.width='min(100%, 1050px)';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}
function closeSourceModal(){
  const modal=document.getElementById('sourceModal');
  if(modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');}
}
function sourceZoom(delta,reset){
  const body=document.getElementById('sourceModalBody');
  const img=body && body.querySelector('img');
  if(!img) return;
  if(reset){SOURCE_MODAL_ZOOM=1;}
  else {SOURCE_MODAL_ZOOM=Math.max(.4,Math.min(3,SOURCE_MODAL_ZOOM+delta));}
  img.style.width=(1050*SOURCE_MODAL_ZOOM)+'px';
}
function renderSourcePages(subtest, options={}){
  const pages=options.pages || DBDA_SOURCE_GROUPS[subtest] || [];
  const wrap=el('section',{class:'source-stack','aria-label':`${subtest} original source pages`});
  const head=el('div',{class:'source-stack-header'},[
    el('div',{},[
      el('div',{class:'source-stack-title'},'SOURCE QUESTIONNAIRE'),
      el('div',{class:'source-stack-subtitle'},`DBDA-R — ${SUBTEST_META[subtest] ? SUBTEST_META[subtest].label : subtest} · Complete original PDF page(s)`)
    ]),
    el('span',{class:'mini-note'},`${pages.length} source page${pages.length===1?'':'s'} · embedded for offline use`)
  ]);
  wrap.appendChild(head);
  pages.forEach(page=>{
    const sheet=el('article',{class:'source-sheet'});
    sheet.appendChild(el('div',{class:'source-sheet-label'},sourcePageLabel(subtest,page)));
    const img=el('img',{
      src:sourcePageUrl(page),
      alt:`${sourcePageLabel(subtest,page)}. Complete page.`,
      draggable:'false',
      loading:'eager'
    });
    img.addEventListener('error',()=>{
      const fallback=sourcePageFallbackUrl(page);
      if(fallback && img.src!==fallback){img.src=fallback;return;}
      img.replaceWith(el('div',{class:'notice'},`Source page ${page} failed to load. Check that source-pages/page-${String(page).padStart(2,'0')}.jpg is present in the deployed package.`));
    });
    sheet.appendChild(img);
    sheet.appendChild(el('div',{class:'source-sheet-actions'},[
      el('button',{onclick:()=>openSourceModal(page,sourcePageLabel(subtest,page))},'View Full Page')
    ]));
    wrap.appendChild(sheet);
  });
  return wrap;
}
function renderAnswerSheetReference(){
  const c=el('div',{class:'card source-ref-card'});
  c.appendChild(el('h3',{},'Original answer-sheet reference'));
  c.appendChild(el('p',{class:'mini-note'},'Pages 29–31 of the supplied PDF are kept intact and embedded for examiner reference.'));
  const row=el('div',{class:'controls-row'});
  [29,30,31].forEach(p=>row.appendChild(el('button',{onclick:()=>openSourceModal(p,`DBDA-R — Original answer sheet page ${p}`)},`Answer sheet p.${p}`)));
  c.appendChild(row);
  return c;
}
function renderResponseControls(title, items, choiceFn, locked){
  const box=el('section',{class:'examiner-responses'});
  box.appendChild(el('h3',{},'EXAMINER RESPONSES'));
  if(title) box.appendChild(el('p',{class:'mini-note'},title));
  const grid=el('div',{class:'response-grid'});
  items.forEach(item=>{
    const row=el('div',{class:'response-row'});
    row.appendChild(el('div',{class:'response-num'},String(item.num).padStart(2,'0')));
    const btns=el('div',{class:'response-buttons'});
    choiceFn(item).forEach(ch=>{
      const b=el('button',{type:'button',class:ch.value===item.current?'selected':'',disabled:locked,'aria-pressed':ch.value===item.current?'true':'false'},ch.label);
      b.addEventListener('click',()=>{if(!locked) ch.onClick();});
      btns.appendChild(b);
    });
    row.appendChild(btns); grid.appendChild(row);
  });
  box.appendChild(grid);
  return box;
}

/* Source pages are the authoritative visual questionnaire. */
function sourcePagesForSubtest(key){
  if(key==='VA') return STATE.part===2 ? [4] : [2,3];
  return DBDA_SOURCE_GROUPS[key] || [];
}
function sourceSectionFor(key){
  const pages=sourcePagesForSubtest(key);
  if(!pages.length) return null;
  return renderSourcePages(key,{pages});
}

/* Examiner response controls for visual/scanned sections. */
function renderCAItems(locked){
  const items=[]; for(let i=1;i<=20;i++) items.push({num:i,current:STATE.responses.CA?.[i]||''});
  return renderResponseControls('Record the candidate response from the original CA questionnaire page.',items,item=>[
    ['a','A'],['b','B'],['c','C'],['d','D'],['e','E']
  ].map(([value,label])=>({value,label,onClick:()=>recordResponse('CA',item.num,value)})),locked);
}
function renderSAItems(locked){
  const items=[]; for(let i=1;i<=72;i++) items.push({num:i,current:STATE.responses.SA?.[i]||''});
  return renderResponseControls('S = same orientation; R = reversed/turned over.',items,item=>[
    ['S','S'],['R','R']
  ].map(([value,label])=>({value,label,onClick:()=>recordResponse('SA',item.num,value)})),locked);
}
function renderMAItems(locked){
  const items=[]; for(let i=1;i<=25;i++) items.push({num:i,current:STATE.responses.MA?.[i]||''});
  return renderResponseControls('Record the answer selected by the candidate for each mechanical reasoning item.',items,item=>[
    ['a','A'],['b','B'],['c','C'],['d','D'],['e','E']
  ].map(([value,label])=>({value,label,onClick:()=>recordResponse('MA',item.num,value)})),locked);
}

/* Generic source-first examiner flow. */
function renderSubtestFlow(cfg){
  const c=el('div',{class:'card'});
  c.appendChild(el('h2',{},cfg.title));
  const key=currentSubtestKey();
  if(STATE.phase==='instructions'){
    const src=sourceSectionFor(key); if(src) c.appendChild(src);
    c.appendChild(el('p',{},cfg.instructions));
    c.appendChild(el('div',{class:'examiner-script'},cfg.script));
    if(cfg.extraNote) c.appendChild(cfg.extraNote);
    c.appendChild(el('button',{class:'primary',onclick:()=>mutate(st=>st.phase='ready')},'Candidate has no questions — proceed'));
    return c;
  }
  if(STATE.phase==='ready'){
    const src=sourceSectionFor(key); if(src) c.appendChild(src);
    c.appendChild(el('div',{class:'examiner-script'},`"${cfg.startLabel}"`));
    c.appendChild(el('p',{class:'mini-note'},'Items remain locked for the candidate until you click START. The timer begins after a ~3 second page-turn delay.'));
    c.appendChild(el('button',{class:'primary',onclick:()=>mutate(st=>startSectionTimer(st,cfg.seconds))},'START'));
    return c;
  }
  if(STATE.phase==='running'||STATE.phase==='timeup'){
    if(!cfg.hiddenTimer){
      const remaining=STATE.phase==='ready'?cfg.seconds:Math.min(cfg.seconds,remainingSectionSeconds(STATE,cfg.seconds));
      c.appendChild(el('div',{class:'timer','data-timer':'1'},fmtTime(remaining)));
      c.appendChild(el('div',{class:'progress'},[el('div',{'data-progress':'1'})]));
    } else {
      c.appendChild(el('div',{class:'notice'},[
        'Timer hidden from candidate view (examiner-only). Time remaining: ',
        el('span',{'data-timer':'1'},fmtTime(STATE.phase==='ready'?cfg.seconds:remainingSectionSeconds(STATE,cfg.seconds)))
      ]));
    }
    const answered=Object.keys(STATE.responses[cfg.respKey]||{}).length;
    c.appendChild(el('p',{class:'mini-note'},`${answered}/${cfg.itemCount} items answered.`));
    if(STATE.phase==='timeup'){
      c.appendChild(el('div',{class:'notice'},'Stop working now. Items are locked.'));
      c.appendChild(el('button',{class:'primary',onclick:cfg.onDone},'Continue →'));
    } else {
      c.appendChild(el('div',{class:'controls-row'},[
        el('button',{class:'danger',onclick:()=>{
          const note=prompt('Reason for pausing/aborting this subtest (required):');
          if(note==null)return;
          mutate(st=>{st.notes.push({subtest:currentSubtestKey(),text:'PAUSED/ABORTED: '+note,ts:Date.now()});st.phase='timeup';clearSectionTimer(st,'expired');});
        }},'Pause / Abort')
      ]));
    }
    const locked=STATE.phase!=='running';
    const src=sourceSectionFor(key); if(src) c.appendChild(src);
    c.appendChild(cfg.renderItems(locked));
    c.appendChild(renderSubtestNavigation());
    return c;
  }
  return c;
}

/* PM source pages and examiner scoring. */
function renderPMCandidate(){
  const c=el('div',{});
  const card=el('div',{class:'card'});
  card.appendChild(el('h2',{},'DBDA-PM — Psychomotor'));
  card.appendChild(el('p',{},'Complete the paper-and-pencil task under examiner supervision using the original questionnaire pages.'));
  const src=sourceSectionFor('PM'); if(src) card.appendChild(src);
  c.appendChild(card); return c;
}
function renderPMExaminer(meta){
  const c=el('div',{class:'card'}); c.appendChild(el('h2',{},meta.label));
  const src=sourceSectionFor('PM'); if(src) c.appendChild(src);
  if(STATE.phase==='instructions'){
    c.appendChild(el('p',{},'Administer the PM task from the original booklet. The candidate completes the paper task; the digital tool records the examiner score afterward.'));
    c.appendChild(el('button',{class:'primary',onclick:()=>mutate(st=>st.phase='ready')},'Continue to ready screen')); return c;
  }
  if(STATE.phase==='ready'){
    c.appendChild(el('div',{class:'examiner-script'},'“Make sure the candidate has a sharp pencil ready. You will have 6 minutes for doing this test.”'));
    c.appendChild(el('button',{class:'primary',onclick:()=>mutate(st=>startSectionTimer(st,meta.seconds))},'START')); return c;
  }
  if(STATE.phase==='running'||STATE.phase==='timeup'){
    const remaining=remainingSectionSeconds(STATE,meta.seconds);
    c.appendChild(el('div',{class:'timer','data-timer':'1'},fmtTime(remaining)));
    if(STATE.phase==='timeup') c.appendChild(el('div',{class:'notice'},'Time is up. Score the 70 figures from the candidate’s paper response.'));
    const items=[]; for(let i=1;i<=70;i++) items.push({num:i,current:STATE.responses.PM?.[i]||''});
    c.appendChild(renderResponseControls('Correct / incorrect examiner scoring',items,item=>[
      {value:'correct',label:'Correct',onClick:()=>recordResponse('PM',item.num,'correct')},
      {value:'incorrect',label:'Incorrect',onClick:()=>recordResponse('PM',item.num,'incorrect')},
      {value:'',label:'Clear',onClick:()=>recordResponse('PM',item.num,'')}
    ],STATE.phase==='running'));
    if(STATE.phase==='timeup') c.appendChild(el('button',{class:'primary',onclick:()=>{
      if(scorePM().answered<70&&!confirm(`Only ${scorePM().answered}/70 figures have been scored. Continue anyway?`))return;
      mutate(st=>{if(st.currentIndex>=st.order.length-1)st.phase='done';else{st.currentIndex++;st.phase='rest';st.restUntil=Date.now()+25000;}});
    }},'Save PM score and continue →'));
    return c;
  }
  return c;
}

/* CA instructions: show intact original page first. */
function renderCAInstructions(){
  const c=el('div',{class:'instr-page'});
  c.appendChild(el('h2',{},'DBDA-CA — Closure Ability'));
  const src=renderSourcePages('CA',{pages:[8]}); if(src) c.appendChild(src);
  c.appendChild(el('p',{},CA_INSTR.p1));
  c.appendChild(el('p',{},CA_INSTR.p2));
  c.appendChild(el('p',{},CA_INSTR.p3));
  c.appendChild(el('p',{},CA_INSTR.p4));
  c.appendChild(el('p',{class:'wait-line'},el('b',{},CA_INSTR.p8)));
  return c;
}

/* Candidate view: source pages only, no response controls or answer key. */

/* Sticky examiner navigation and total progress. */
function answeredCountFor(k){
  const r=STATE.responses[k]||{};
  return Object.values(r).filter(v=>v!==''&&v!=null).length;
}
function renderStickyExaminerNav(){
  if(getRole()!=='examiner') return null;
  const idx=STATE.currentIndex||0;
  const answered=STATE.order.reduce((sum,k)=>sum+answeredCountFor(k),0);
  const bar=el('div',{class:'sticky-exam-nav'});
  const row=el('div',{class:'sticky-exam-nav-row'});
  STATE.order.forEach((k,i)=>row.appendChild(el('button',{class:i===idx?'current':'',onclick:()=>gotoSubtest(i)},`${k} ${answeredCountFor(k)}`)));
  bar.appendChild(row);
  bar.appendChild(el('div',{class:'sticky-exam-progress'},`Overall responses: ${answered} / 315`));
  return bar;
}
const ORIGINAL_RENDER_EXAMINER=renderExaminer;
renderExaminer=function(){
  const wrap=el('div',{});
  const nav=renderStickyExaminerNav(); if(nav)wrap.appendChild(nav);
  wrap.appendChild(ORIGINAL_RENDER_EXAMINER());
  return wrap;
};
const ORIGINAL_RENDER_REPORT=renderReport;
renderReport=function(){
  const c=ORIGINAL_RENDER_REPORT();
  const card=el('div',{class:'card'});
  const total=Object.keys(STATE.responses).reduce((sum,k)=>sum+answeredCountFor(k),0);
  card.appendChild(el('h3',{},'DBDA-R — Examiner Report'));
  card.appendChild(el('p',{},`Total test battery: ${total} / 315 responses recorded.`));
  c.insertBefore(card,c.firstChild);
  return c;
};


/* ---------- boot ---------- */
render();
setTimeout(()=>retryPendingSubmission(),800);
setInterval(()=>{ if(STATE.phase==='running') render(); }, 5000); // periodic re-render to keep item-answered counts fresh


}
