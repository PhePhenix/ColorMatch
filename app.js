
// ════════════════════════════════════════
//  AUTH STATE
// ════════════════════════════════════════
let currentUser=null;
let selectedAvatar='🎨';

const PSEUDO_SUGGESTIONS=['ColorMaster','NeonEye','PixelWitch','HueMaster','ChromaFox','RetinaPro','SpektraX','VisionAce'];

function saveUser(u){localStorage.setItem('cmp_user',JSON.stringify(u));}
function loadUser(){
  try{return JSON.parse(localStorage.getItem('cmp_user')||'null');}catch(e){return null;}
}

// ════════════════════════════════════════
//  AUTH NAVIGATION
// ════════════════════════════════════════
function showAuthScreen(id){
  ['auth-login','auth-register','auth-forgot','auth-pseudo'].forEach(s=>{
    const el=document.getElementById(s);
    el.style.display=(s===id?'flex':'none');
  });
  document.getElementById('game-root').style.display='none';
}
function showLogin(){
  document.getElementById('auth-forgot').style.display='none';
  document.getElementById('auth-register').style.display='none';
  document.getElementById('auth-login').style.display='flex';
}
function showRegister(){
  document.getElementById('auth-login').style.display='none';
  document.getElementById('auth-register').style.display='flex';
}
function showForgot(){
  document.getElementById('auth-login').style.display='none';
  document.getElementById('auth-forgot').style.display='flex';
  document.getElementById('forgot-form-view').style.display='block';
  document.getElementById('forgot-sent-view').style.display='none';
}
function showPseudo(){
  showAuthScreen('auth-pseudo');
  generateSuggestions();
}
function enterGame(){
  ['auth-login','auth-register','auth-forgot','auth-pseudo'].forEach(s=>{
    document.getElementById(s).style.display='none';
  });
  document.getElementById('game-root').style.display='block';
  document.getElementById('footer-user').textContent=currentUser.avatar+' '+currentUser.pseudo;
  initGame();
}

// ════════════════════════════════════════
//  FORM HELPERS
// ════════════════════════════════════════
function togglePw(inputId,btn){
  const inp=document.getElementById(inputId);
  if(inp.type==='password'){inp.type='text';btn.textContent='🙈';}
  else{inp.type='password';btn.textContent='👁';}
}
function validateEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}
function showFieldError(id,show){
  document.getElementById(id).style.display=show?'block':'none';
}
function setLoading(btn,on){
  if(on){btn.classList.add('loading');btn.disabled=true;}
  else{btn.classList.remove('loading');btn.disabled=false;}
}

// ════════════════════════════════════════
//  AUTH ACTIONS
// ════════════════════════════════════════
function doLogin(){
  const email=document.getElementById('login-email').value.trim();
  const pw=document.getElementById('login-pw').value;
  let ok=true;
  if(!validateEmail(email)){showFieldError('err-login-email',true);ok=false;}
  else showFieldError('err-login-email',false);
  if(pw.length<6){showFieldError('err-login-pw',true);ok=false;}
  else showFieldError('err-login-pw',false);
  if(!ok) return;

  const btn=document.getElementById('btn-login');
  setLoading(btn,true);

  // Check si compte existe
  setTimeout(()=>{
    setLoading(btn,false);
    const stored=loadUser();
    if(stored && stored.email===email){
      currentUser=stored;
      showToast('👋 Bon retour, '+currentUser.pseudo+' !','success');
      setTimeout(()=>enterGame(),500);
    } else {
      // Nouveau compte via email → pseudo
      currentUser={email,avatar:'🎨',pseudo:null};
      showToast('✅ Connexion réussie !','success');
      setTimeout(()=>showPseudo(),400);
    }
  },1200);
}

function doRegister(){
  const email=document.getElementById('reg-email').value.trim();
  const pw=document.getElementById('reg-pw').value;
  const pw2=document.getElementById('reg-pw2').value;
  let ok=true;
  if(!validateEmail(email)){showFieldError('err-reg-email',true);ok=false;}
  else showFieldError('err-reg-email',false);
  if(pw.length<6){showFieldError('err-reg-pw',true);ok=false;}
  else showFieldError('err-reg-pw',false);
  if(pw!==pw2){showFieldError('err-reg-pw2',true);ok=false;}
  else showFieldError('err-reg-pw2',false);
  if(!ok) return;

  const btn=document.getElementById('btn-register');
  setLoading(btn,true);
  setTimeout(()=>{
    setLoading(btn,false);
    currentUser={email,avatar:'🎨',pseudo:null};
    showToast('🎉 Compte créé avec succès !','success');
    setTimeout(()=>showPseudo(),400);
  },1400);
}

function socialLogin(provider){
  const names={google:'Google',facebook:'Facebook'};
  showToast(`⏳ Connexion ${names[provider]} en cours…`);
  setTimeout(()=>{
    const stored=loadUser();
    if(stored && stored.provider===provider){
      currentUser=stored;
      showToast('👋 Bon retour, '+currentUser.pseudo+' !','success');
      setTimeout(()=>enterGame(),500);
    } else {
      currentUser={provider,avatar:'🎨',pseudo:null,email:provider+'@oauth.local'};
      showToast(`✅ Connecté via ${names[provider]} !`,'success');
      setTimeout(()=>showPseudo(),400);
    }
  },1500);
}

function doForgot(){
  const email=document.getElementById('forgot-email').value.trim();
  if(!validateEmail(email)){showFieldError('err-forgot-email',true);return;}
  showFieldError('err-forgot-email',false);
  document.getElementById('forgot-email-display').textContent=email;
  showToast('📬 Envoi en cours…');
  setTimeout(()=>{
    document.getElementById('forgot-form-view').style.display='none';
    document.getElementById('forgot-sent-view').style.display='block';
    showToast('✅ E-mail envoyé !','success');
  },1200);
}

// ════════════════════════════════════════
//  PSEUDO / AVATAR
// ════════════════════════════════════════
function pickAvatar(el,emoji){
  document.querySelectorAll('.av-opt').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
  selectedAvatar=emoji;
  document.getElementById('selected-avatar').textContent=emoji;
}

function generateSuggestions(){
  const wrap=document.getElementById('pseudo-suggestions');
  const suffixes=['42','Pro','X','7','HD','Elite','Master','Neo'];
  const picks=PSEUDO_SUGGESTIONS.sort(()=>Math.random()-.5).slice(0,4);
  wrap.innerHTML=picks.map(p=>{
    const s=suffixes[Math.floor(Math.random()*suffixes.length)];
    const name=p+s;
    return`<div class="sugg-tag" onclick="document.getElementById('pseudo-input').value='${name}'">${name}</div>`;
  }).join('');
}

function doPseudo(){
  const raw=document.getElementById('pseudo-input').value.trim();
  const valid=/^[a-zA-Z0-9_]{3,20}$/.test(raw);
  if(!valid){showFieldError('err-pseudo',true);return;}
  showFieldError('err-pseudo',false);

  const btn=document.getElementById('btn-pseudo');
  setLoading(btn,true);
  setTimeout(()=>{
    setLoading(btn,false);
    currentUser.pseudo=raw;
    currentUser.avatar=selectedAvatar;
    saveUser(currentUser);
    showToast('🎮 Bienvenue '+raw+' !','success');
    setTimeout(()=>enterGame(),600);
  },1000);
}

function doLogout(){
  closeOverlay('ov-logout');
  localStorage.removeItem('cmp_user');
  currentUser=null;
  showToast('👋 À bientôt !');
  setTimeout(()=>{
    document.getElementById('game-root').style.display='none';
    showAuthScreen('auth-login');
  },500);
}

// ════════════════════════════════════════
//  TOAST
// ════════════════════════════════════════
let toastTimer=null;
function showToast(msg,type='',dur=2500){
  const t=document.getElementById('toast-notif');
  t.textContent=msg;
  t.className='toast show'+(type?' '+type:'');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),dur);
}

// ════════════════════════════════════════
//  GAME CONFIG
// ════════════════════════════════════════
const LEVELS=[
  {xp:100, label:'Facile',        col:'#00ff88',locked:[],       hint:true, coins:10},
  {xp:250, label:'Normal',        col:'#ffc84a',locked:[],       hint:true, coins:15},
  {xp:450, label:'Intermédiaire', col:'#fb923c',locked:['b'],    hint:true, coins:22},
  {xp:700, label:'Difficile',     col:'#ff3d5c',locked:['b'],    hint:false,coins:30},
  {xp:1000,label:'Expert',        col:'#f472b6',locked:['g','b'],hint:false,coins:42},
  {xp:1400,label:'Maître',        col:'#a78bfa',locked:['g','b'],hint:false,coins:60},
  {xp:9999,label:'Légendaire',    col:'#ff4ecd',locked:['r','g','b'],hint:false,coins:80},
];
const SKINS=[
  {id:'classic',name:'Classique',price:0,   gradient:'linear-gradient(135deg,#1a1a3a,#0f0f20)'},
  {id:'sunset', name:'Coucher',  price:200, gradient:'linear-gradient(135deg,#ff6b35,#f7931e,#fcb045)'},
  {id:'ocean',  name:'Océan',    price:200, gradient:'linear-gradient(135deg,#0575e6,#021b79)'},
  {id:'forest', name:'Forêt',    price:350, gradient:'linear-gradient(135deg,#1a3a1a,#2d6a4f,#52b788)'},
  {id:'candy',  name:'Candy',    price:350, gradient:'linear-gradient(135deg,#fc5c7d,#6a3093)'},
  {id:'aurora', name:'Aurora',   price:500, gradient:'linear-gradient(135deg,#00c3ff,#00ff88,#ffff1c)'},
  {id:'fire',   name:'Inferno',  price:800, gradient:'linear-gradient(135deg,#ff416c,#ff4b2b)'},
  {id:'legend', name:'Légende',  price:1200,gradient:'linear-gradient(135deg,#ffd700,#ff6b35,#ff416c)'},
];
const IAP={
  coins_big:    {ico:'💰',name:'Pack Explorateur',desc:'1 000 pièces',              price:'0,99 €', action:()=>{STATE.coins+=1000;showToast('💰 +1 000 pièces !');}},
  coins_pro:    {ico:'💎',name:'Pack Pro',         desc:'3 500 pièces + XP×2 24h',  price:'2,49 €', action:()=>{STATE.coins+=3500;STATE.xpBoostUntil=Date.now()+86400000;showToast('💎 +3 500 pièces !');}},
  coins_mega:   {ico:'🏆',name:'Pack Légende',     desc:'10 000 pièces + 4 skins',  price:'5,99 €', action:()=>{STATE.coins+=10000;['sunset','ocean','forest','candy'].forEach(s=>{if(!STATE.ownedSkins.includes(s))STATE.ownedSkins.push(s)});showToast('🏆 +10 000 pièces !');}},
  lives_refill: {ico:'❤️',name:'Recharge vies',    desc:'6 vies instantanément',    price:'1,99 €', action:()=>{STATE.lives=Math.min(MAX_LIVES,STATE.lives+MAX_LIVES);renderHUD();showToast('❤️ Vies rechargées !');}},
  lives_infinite:{ico:'♾️',name:'Vies infinies',   desc:'72h sans limite',          price:'3,49 €', action:()=>{STATE.infiniteLivesUntil=Date.now()+259200000;showToast('♾️ Vies infinies 72h !');}},
  xp_boost:     {ico:'⚡',name:'Boost XP ×3',      desc:'Triple ton XP 48h',        price:'1,49 €', action:()=>{STATE.xpBoostUntil=Date.now()+172800000;STATE.xpBoostMult=3;showToast('⚡ XP ×3 actif !');}},
  no_ads:       {ico:'🚫',name:'Sans publicités',  desc:'Retire les pubs définitivement',price:'4,99 €',action:()=>{STATE.noAds=true;showToast('🚫 Pubs supprimées !');},isOneTime:true},
};
const ACHIEVEMENTS=[
  {id:'first_blood',  ico:'🎯',name:'Premier sang',    desc:'Complète ton premier round',        reward:{xp:50, coins:20},  condition:s=>s.totalRounds>=1},
  {id:'sharp_eye',    ico:'👁️',name:'Œil de lynx',     desc:'Obtiens un score de 90+',           reward:{xp:100,coins:50},  condition:s=>s.bestScore>=90},
  {id:'perfectionist',ico:'💎',name:'Perfectionniste', desc:'Obtiens un score parfait de 100',   reward:{xp:300,coins:200}, condition:s=>s.bestScore>=100},
  {id:'on_fire',      ico:'🔥',name:'En feu',          desc:'Enchaîne 5 scores de 80+',          reward:{xp:150,coins:75},  condition:s=>s.maxStreak>=5},
  {id:'veteran',      ico:'🏅',name:'Vétéran',         desc:'Joue 50 rounds',                    reward:{xp:200,coins:100}, condition:s=>s.totalRounds>=50},
  {id:'rich',         ico:'💰',name:'Millionnaire',    desc:'Accumule 1 000 pièces',              reward:{xp:150,coins:0},   condition:s=>s.totalCoinsEarned>=1000},
  {id:'legendary',    ico:'🌟',name:'Légendaire',       desc:'Atteins le niveau Légendaire',      reward:{xp:500,coins:500}, condition:s=>s.level>=6},
];
const LEADERBOARD_MOCK=[
  {name:'Maxime_R',emoji:'🦊',score:98,rounds:240,bg:'#ff6b35'},
  {name:'Léa_D',   emoji:'🐺',score:96,rounds:180,bg:'#a78bfa'},
  {name:'Jonas_V', emoji:'🦁',score:94,rounds:320,bg:'#ffc84a'},
  {name:'Chloé_M', emoji:'🐯',score:91,rounds:150,bg:'#f472b6'},
  {name:'Tom_B',   emoji:'🦅',score:89,rounds:270,bg:'#4a9fff'},
];
const MAX_LIVES=6;
const CHALLENGES=[
  {id:'exact',label:'Défi exact',objective:'Reproduis la cible le plus précisément possible.',detail:'La précision brute récompense les combos.',make:()=>randColor()},
  {id:'warm',label:'Défi chaleur',objective:'Atteins une couleur chaude (rouge dominant).',detail:'Le rouge doit rester au-dessus du bleu.',make:()=>({r:Math.floor(Math.random()*70)+170,g:Math.floor(Math.random()*100)+70,b:Math.floor(Math.random()*70)+25})},
  {id:'cool',label:'Défi fraîcheur',objective:'Atteins une couleur froide (bleu dominant).',detail:'Le bleu doit rester au-dessus du rouge.',make:()=>({r:Math.floor(Math.random()*70)+25,g:Math.floor(Math.random()*100)+80,b:Math.floor(Math.random()*70)+170})},
  {id:'pastel',label:'Défi pastel',objective:'Reproduis une teinte douce et lumineuse.',detail:'Les trois canaux restent élevés et proches.',make:()=>{const n=Math.floor(Math.random()*55)+190;return{r:Math.min(255,n+Math.floor(Math.random()*25)),g:Math.min(255,n+Math.floor(Math.random()*25)),b:Math.min(255,n+Math.floor(Math.random()*25))};}},
  {id:'contrast',label:'Défi contraste',objective:'Reproduis une couleur profonde et contrastée.',detail:'Une valeur forte, deux valeurs basses.',make:()=>{const hi=Math.floor(Math.random()*45)+205;const lo=Math.floor(Math.random()*55)+20;return[Math.random(),Math.random(),Math.random()].map((_,i)=>i===Math.floor(Math.random()*3)?hi:lo).reduce((a,v,i)=>(a[['r','g','b'][i]]=v,a),{});}}
];

// ════════════════════════════════════════
//  GAME STATE
// ════════════════════════════════════════
let STATE;
let TARGET,uR=128,uG=128,uB=128,validated=false;
let currentMode='classic';
let timerInterval=null,timerLeft=20,timerMax=20;
let pendingPurchaseId=null;
let gameInited=false;
let activeChallenge=CHALLENGES[0],roundStartedAt=0;

function getStateKey(){return'cmp_state_'+(currentUser?.email||'guest');}
function loadState(){
  try{
    const s=JSON.parse(localStorage.getItem(getStateKey())||'{}');
    return{
      coins:s.coins??0,xp:s.xp??0,level:s.level??0,
      round:s.round??1,bestScore:s.bestScore??0,
      scores:s.scores??[],history:s.history??[],lives:Math.min(MAX_LIVES,s.lives??MAX_LIVES),
      lastLifeRegen:s.lastLifeRegen??Date.now(),
      streak:s.streak??0,maxStreak:s.maxStreak??0,
      totalRounds:s.totalRounds??0,totalCoinsEarned:s.totalCoinsEarned??0,
      achievements:s.achievements??[],
      ownedSkins:s.ownedSkins??['classic'],activeSkin:s.activeSkin??'classic',
      infiniteLivesUntil:s.infiniteLivesUntil??0,
      xpBoostUntil:s.xpBoostUntil??0,xpBoostMult:s.xpBoostMult??1,
      noAds:s.noAds??false,dailyDone:s.dailyDone??null,weeklyDone:s.weeklyDone??0,
      combo:s.combo??0,perfects:s.perfects??0,theme:s.theme??'default',
      friendChallenges:s.friendChallenges??[],missions:s.missions??null,
    };
  }catch(e){
    return{coins:0,xp:0,level:0,round:1,bestScore:0,scores:[],history:[],lives:MAX_LIVES,
      lastLifeRegen:Date.now(),streak:0,maxStreak:0,totalRounds:0,
      totalCoinsEarned:0,achievements:[],ownedSkins:['classic'],activeSkin:'classic',
      infiniteLivesUntil:0,xpBoostUntil:0,xpBoostMult:1,noAds:false,dailyDone:null,weeklyDone:0,
      combo:0,perfects:0,theme:'default',friendChallenges:[],missions:null};
  }
}
function saveState(){localStorage.setItem(getStateKey(),JSON.stringify(STATE));}

function initGame(){
  if(!gameInited){
    gameInited=true;
    // Attach slider listeners
    ['r','g','b'].forEach(ch=>{
      document.getElementById('sl-'+ch).addEventListener('input',function(){
        const v=parseInt(this.value);
        if(ch==='r')uR=v;if(ch==='g')uG=v;if(ch==='b')uB=v;
        document.getElementById('val-'+ch).textContent=v;
        updateAttempt();
      });
    });
    document.addEventListener('keydown',handleGameKeyboard);
    setInterval(()=>{regenLives();renderHUD();},5000);
  }
  STATE=loadState();
  regenLives();
  setTheme(STATE.theme||'default',true);
  ensureMissions();
  beginRound();
  uR=128;uG=128;uB=128;
  validated=false;
  currentMode='classic';
  renderAll();
  updateAttempt();
  renderShop();
  // Update profile avatar in nav
  updateProfileDisplay();
}

function updateProfileDisplay(){
  if(!currentUser) return;
  document.getElementById('p-avatar').textContent=currentUser.avatar||'🎨';
  document.getElementById('p-name').textContent=(currentUser.pseudo||'JOUEUR').toUpperCase();
  document.getElementById('footer-user').textContent=(currentUser.avatar||'🎨')+' '+(currentUser.pseudo||'');
}

// ════════════════════════════════════════
//  GAME UTILS
// ════════════════════════════════════════
function randColor(){return{r:Math.floor(Math.random()*210)+25,g:Math.floor(Math.random()*210)+25,b:Math.floor(Math.random()*210)+25};}
function rgb(c){return`rgb(${c.r},${c.g},${c.b})`;}
function toHex(c){return'#'+[c.r,c.g,c.b].map(x=>x.toString(16).padStart(2,'0')).join('');}
function calcScore(t,a){const d=Math.sqrt((t.r-a.r)**2+(t.g-a.g)**2+(t.b-a.b)**2);return Math.max(0,Math.round((1-d/Math.sqrt(3*255**2))*100));}
function todayKey(){return new Date().toISOString().slice(0,10);}
function weekKey(){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-d.getDay()+1);return d.toISOString().slice(0,10);}
function ensureMissions(){
  if(!STATE) return;
  const day=todayKey(),week=weekKey();
  if(!STATE.missions||STATE.missions.day!==day||STATE.missions.week!==week){
    STATE.missions={day,week,dayRounds:0,dayHigh:0,weekRounds:0,weekPerfects:0};
    saveState();
  }
}
function beginRound(){
  activeChallenge=CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)];
  TARGET=activeChallenge.make();
  roundStartedAt=Date.now();
  const type=document.getElementById('challenge-type');
  if(type) type.textContent=activeChallenge.label;
  const obj=document.getElementById('challenge-objective');
  if(obj) obj.textContent=activeChallenge.objective;
  const detail=document.getElementById('challenge-detail');
  if(detail) detail.textContent=activeChallenge.detail;
  const block=document.getElementById('target-block');
  if(block) block.style.background=rgb(TARGET);
}
function comboMultiplier(){
  return Math.min(3,1+(Math.max(0,STATE?.combo||0)*.1));
}
function updateComboUI(){
  const el=document.getElementById('combo-value');
  if(el) el.textContent='x'+comboMultiplier().toFixed(2);
}
function curLevel(){return LEVELS[Math.min(STATE.level,LEVELS.length-1)];}
function scoreMsg(s){
  if(s===100) return{emoji:'🏆',msg:'PARFAIT !',      sub:'Score légendaire. Tu es inarrêtable.'};
  if(s>=95)   return{emoji:'🎯',msg:'Quasi parfait !',sub:'Précision absolue. Impressionnant.'};
  if(s>=85)   return{emoji:'🔥',msg:'Excellent !',    sub:'Tu as vraiment l\'œil.'};
  if(s>=70)   return{emoji:'👍',msg:'Bien joué !',    sub:'Continue comme ça !'};
  if(s>=50)   return{emoji:'😅',msg:'Pas mal…',       sub:'Encore un effort !'};
  return             {emoji:'😬',msg:'Raté !',          sub:'Réessaie — tu vas y arriver.'};
}
function hasInfiniteLives(){return Date.now()<STATE.infiniteLivesUntil;}
function xpMult(){return Date.now()<STATE.xpBoostUntil?STATE.xpBoostMult:1;}
function isDailyDone(){return STATE.dailyDone===new Date().toDateString();}
function markDailyDone(){STATE.dailyDone=new Date().toDateString();saveState();}

const LIFE_REGEN_MS=3*60*1000;
function regenLives(){
  if(hasInfiniteLives()||STATE.lives>=MAX_LIVES) return;
  const gained=Math.floor((Date.now()-STATE.lastLifeRegen)/LIFE_REGEN_MS);
  if(gained>0){STATE.lives=Math.min(MAX_LIVES,STATE.lives+gained);STATE.lastLifeRegen+=gained*LIFE_REGEN_MS;saveState();}
}
function nextLifeIn(){
  const r=LIFE_REGEN_MS-(Date.now()-STATE.lastLifeRegen);
  return`${Math.floor(r/60000).toString().padStart(2,'0')}:${Math.floor((r%60000)/1000).toString().padStart(2,'0')}`;
}

// ════════════════════════════════════════
//  OVERLAYS
// ════════════════════════════════════════
function openOverlay(id){document.getElementById(id).classList.add('show');}
function closeOverlay(id){document.getElementById(id).classList.remove('show');}
function openNoLivesModal(){
  if(hasInfiniteLives()||STATE.lives>0) return;
  document.getElementById('lives-timer').textContent='Prochaine vie dans '+nextLifeIn();
  openOverlay('ov-nolives');
}
function buyLivesFromModal(){closeOverlay('ov-nolives');openPurchase('lives_refill');}
function showLevelUp(){
  const lv=curLevel();
  document.getElementById('toast-lvl').textContent=STATE.level+1;
  const tag=document.getElementById('toast-diff-tag');
  tag.textContent=lv.label;tag.style.color=lv.col;
  tag.style.background=lv.col+'22';tag.style.border=`1px solid ${lv.col}44`;
  openOverlay('ov-levelup');
}
function showAchievementModal(ach){
  document.getElementById('ach-ico-big').textContent=ach.ico;
  document.getElementById('ach-name-big').textContent=ach.name;
  document.getElementById('ach-desc-big').textContent=ach.desc;
  document.getElementById('ach-reward-big').innerHTML=
    `<div class="r-gain-pill">⚡ +${ach.reward.xp} XP</div>`+(ach.reward.coins?`<div class="r-gain-pill">💰 +${ach.reward.coins}</div>`:'');
  openOverlay('ov-achievement');
}

// ════════════════════════════════════════
//  SCREEN NAV (GAME)
// ════════════════════════════════════════
function showScreen(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('screen-'+name).classList.add('active');
  document.getElementById('nav-'+name)?.classList.add('active');
  if(name==='shop') renderShop();
  if(name==='profile') renderProfile();
  if(name==='play') renderAll();
  window.scrollTo(0,0);
  if(name==='shop') document.getElementById('shop-badge').style.display='none';
}

// ════════════════════════════════════════
//  SHOP
// ════════════════════════════════════════
function openPurchase(id){
  pendingPurchaseId=id;const p=IAP[id];
  document.getElementById('pp-ico').textContent=p.ico;
  document.getElementById('pp-name').textContent=p.name;
  document.getElementById('pp-desc').textContent=p.desc;
  document.getElementById('pp-price').textContent=p.price;
  document.getElementById('pp-confirm-btn').textContent='Acheter — '+p.price;
  openOverlay('ov-purchase');
}
function confirmPurchase(){
  if(!pendingPurchaseId) return;
  IAP[pendingPurchaseId].action();saveState();
  closeOverlay('ov-purchase');renderHUD();renderShop();
}
function buySkin(id){
  const skin=SKINS.find(s=>s.id===id);if(!skin) return;
  if(STATE.ownedSkins.includes(id)){STATE.activeSkin=id;saveState();renderShop();showToast('🎨 Skin activé !');return;}
  if(STATE.coins>=skin.price){STATE.coins-=skin.price;STATE.ownedSkins.push(id);STATE.activeSkin=id;saveState();renderShop();renderHUD();showToast('🎨 Skin "'+skin.name+'" activé !');}
  else showToast('💰 Pas assez de pièces !');
}
function renderShop(){
  if(!STATE) return;
  document.getElementById('shop-coins').textContent=STATE.coins;
  const grid=document.getElementById('skin-grid');
  grid.innerHTML=SKINS.map(sk=>{
    const owned=STATE.ownedSkins.includes(sk.id),active=STATE.activeSkin===sk.id;
    return`<div class="skin-card ${active?'active-skin':''}" onclick="buySkin('${sk.id}')">
      <div class="skin-preview" style="background:${sk.gradient}">
        ${active?'<div style="position:absolute;bottom:4px;right:4px;font-size:.7rem;background:rgba(0,0,0,.6);border-radius:100px;padding:1px 6px;color:var(--green)">✓</div>':''}
      </div>
      <div class="skin-name">${sk.name}</div>
      <div class="skin-lock">${owned?'<span style="color:var(--green)">✓ Possédé</span>':sk.price===0?'Gratuit':'💰 '+sk.price}</div>
    </div>`;
  }).join('');
}

// ════════════════════════════════════════
//  PROFILE
// ════════════════════════════════════════
function checkAchievements(){
  ACHIEVEMENTS.forEach(ach=>{
    if(!STATE.achievements.includes(ach.id)&&ach.condition(STATE)){
      STATE.achievements.push(ach.id);STATE.xp+=ach.reward.xp;STATE.coins+=ach.reward.coins;
      STATE.totalCoinsEarned+=ach.reward.coins;saveState();
      setTimeout(()=>showAchievementModal(ach),600);
    }
  });
}
function renderProfile(){
  if(!STATE) return;
  updateProfileDisplay();
  const lv=curLevel();
  document.getElementById('p-title').textContent=lv.label;
  document.getElementById('p-title').style.cssText=`color:${lv.col};background:${lv.col}20;border:1px solid ${lv.col}44`;
  document.getElementById('p-rounds').textContent=STATE.totalRounds;
  document.getElementById('p-best').textContent=STATE.bestScore||'—';
  const avg=STATE.scores.length?Math.round(STATE.scores.reduce((a,b)=>a+b,0)/STATE.scores.length):null;
  document.getElementById('p-avg').textContent=avg!==null?avg:'—';

  document.getElementById('achievement-list').innerHTML=ACHIEVEMENTS.map(ach=>{
    const done=STATE.achievements.includes(ach.id);
    return`<div class="ach-card ${done?'':'locked-ach'}">
      <div class="ach-ico">${ach.ico}</div>
      <div class="ach-info">
        <div class="ach-name">${ach.name}</div>
        <div class="ach-desc">${ach.desc}</div>
        <div class="ach-reward">${done?'✓ Obtenu':'💰 +'+ach.reward.coins+' · ⚡ +'+ach.reward.xp+' XP'}</div>
      </div>
    </div>`;
  }).join('');

  const me={name:currentUser?.pseudo||'Toi',emoji:currentUser?.avatar||'🎨',score:STATE.bestScore||0,rounds:STATE.totalRounds,bg:'#a78bfa',isMe:true};
  const all=[...LEADERBOARD_MOCK.map(e=>({...e,isMe:false})),me].sort((a,b)=>b.score-a.score);
  const rankCls=['gold','silver','bronze'];
  document.getElementById('lb-list').innerHTML=all.map((e,i)=>`
    <div class="lb-row ${e.isMe?'lb-me':''}">
      <div class="lb-rank ${rankCls[i]||''}">${i+1}</div>
      <div class="lb-av" style="background:${e.bg}20;border:1px solid ${e.bg}44">${e.emoji}</div>
      <div class="lb-info"><div class="lb-name">${e.name}${e.isMe?' (toi)':''}</div><div class="lb-sub">${e.rounds} rounds</div></div>
      <div class="lb-score">${e.score}</div>
    </div>`).join('');
  renderMissions();renderHistory();renderFriendChallenges();
}

function renderMissions(){
  const el=document.getElementById('mission-list');if(!el||!STATE)return;
  ensureMissions();const m=STATE.missions;
  const missions=[
    {ico:'☀️',name:'Rituel du jour',sub:'Joue 3 rounds aujourd’hui',value:m.dayRounds,max:3,reward:'💰 +60'},
    {ico:'🎯',name:'Œil du jour',sub:'Atteins 85 points aujourd’hui',value:m.dayHigh,max:85,reward:'⚡ +80 XP'},
    {ico:'📅',name:'Semaine parfaite',sub:'Joue 12 rounds cette semaine',value:m.weekRounds,max:12,reward:'💎 +250'},
    {ico:'🏆',name:'Chasseur de parfaits',sub:'Obtiens 2 scores parfaits cette semaine',value:m.weekPerfects,max:2,reward:'💰 +300'}
  ];
  el.innerHTML=missions.map(x=>{const pct=Math.min(100,Math.round(x.value/x.max*100));return`<div class="mission-row">
    <div class="mission-icon">${x.ico}</div><div class="mission-info"><div class="mission-name">${x.name}</div><div class="mission-sub">${x.sub} · ${Math.min(x.value,x.max)}/${x.max}</div><div class="mission-bar"><span style="width:${pct}%"></span></div></div><div class="mission-reward">${x.reward}</div>
  </div>`;}).join('');
}
function renderHistory(){
  const el=document.getElementById('history-list');if(!el||!STATE)return;
  const rows=(STATE.history||[]).slice().reverse();
  el.innerHTML=rows.length?rows.map(h=>`<div class="history-row"><div class="history-info"><div class="history-name">${h.challenge||'Défi couleur'}</div><div class="history-sub">${h.mode} · ${new Date(h.at).toLocaleDateString('fr-FR')} ${new Date(h.at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</div></div><div class="history-score">${h.score}</div></div>`).join(''):'<div class="section-note">Tes scores apparaîtront après le premier round.</div>';
}
function renderFriendChallenges(){
  const el=document.getElementById('friend-challenge-list');if(!el||!STATE)return;
  const rows=STATE.friendChallenges||[];
  el.innerHTML=rows.length?rows.slice(-4).reverse().map(f=>`<div class="friend-row"><div class="mission-icon">🎮</div><div class="friend-info"><div class="friend-name">${f.code} · ${f.status}</div><div class="friend-sub">Objectif ${f.target} points · ${f.score===null?'À jouer':'Ton score : '+f.score}</div></div><button class="btn-small" onclick="playFriendChallenge('${f.code}')">Jouer</button></div>`).join(''):'<div class="section-note" style="margin-top:10px">Aucun défi ami pour le moment.</div>';
}
function createFriendChallenge(){
  if(!STATE)return;
  const target=Math.max(70,Math.min(100,STATE.bestScore||85));
  const code='CM-'+Math.random().toString(36).slice(2,7).toUpperCase();
  STATE.friendChallenges=STATE.friendChallenges||[];STATE.friendChallenges.push({code,target,score:null,status:'créé',created:Date.now()});saveState();renderFriendChallenges();
  shareText(`Défi ColorMatch ${code} : bats ${target}/100 !`);
}
function joinFriendChallenge(){
  if(!STATE)return;
  const code=(prompt('Code du défi ami (ex. CM-ABCDE)')||'').trim().toUpperCase();
  if(!/^CM-[A-Z0-9]{5}$/.test(code)){showToast('Code invalide','error');return;}
  STATE.friendChallenges=STATE.friendChallenges||[];if(!STATE.friendChallenges.some(f=>f.code===code))STATE.friendChallenges.push({code,target:85,score:null,status:'reçu',created:Date.now()});saveState();renderFriendChallenges();showToast('🤝 Défi ajouté !');
}
function playFriendChallenge(code){
  const f=(STATE.friendChallenges||[]).find(x=>x.code===code);if(!f)return;
  showScreen('play');currentMode='classic';beginRound();showToast(`🎮 Défi ${code} : vise ${f.target}/100 !`);
}
function shareText(text){
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(()=>showToast('📋 Score copié, prêt à partager !','success')).catch(()=>showToast(text));
  else showToast(text);
}
function shareScore(){shareText(`🎨 ${currentUser?.pseudo||'Joueur'} a obtenu ${STATE.bestScore||0}/100 sur ColorMatch Pro !`);}
function setTheme(theme,silent){
  if(!theme)theme='default';document.body.dataset.theme=theme;
  if(STATE&&!silent){STATE.theme=theme;saveState();}
  document.querySelectorAll('.theme-btn').forEach(b=>b.classList.toggle('active',b.dataset.themeChoice===theme));
  if(!silent)showToast('🌈 Thème appliqué !','success');
}

// ════════════════════════════════════════
//  RENDER HUD
// ════════════════════════════════════════
function renderHUD(){
  if(!STATE) return;
  document.getElementById('hud-coins').textContent=STATE.coins;
  document.getElementById('hud-lives').textContent=hasInfiniteLives()?'∞':STATE.lives;
  document.getElementById('hud-lvl').textContent=STATE.level+1;
}
function renderAll(){
  if(!STATE) return;
  const lv=curLevel();renderHUD();
  const prevXP=STATE.level>0?LEVELS[STATE.level-1].xp:0,nextXP=lv.xp;
  const pct=Math.min(100,Math.round((STATE.xp-prevXP)/(nextXP-prevXP)*100));
  document.getElementById('xp-fill').style.width=pct+'%';
  document.getElementById('xp-label').textContent=`${STATE.xp-prevXP} / ${nextXP-prevXP} XP`;
  const tag=document.getElementById('diff-tag');
  tag.textContent=lv.label;tag.style.color=lv.col;tag.style.borderColor=lv.col+'55';tag.style.background=lv.col+'11';
  document.getElementById('round-num').textContent=STATE.round;
  document.getElementById('mode-tag').textContent={classic:'Classique',chrono:'Chrono',daily:'Quotidien',blind:'Blind'}[currentMode];
  document.getElementById('stat-rounds').textContent=STATE.totalRounds;
  document.getElementById('stat-best').textContent=STATE.bestScore||'—';
  const avg=STATE.scores.length?Math.round(STATE.scores.reduce((a,b)=>a+b,0)/STATE.scores.length):null;
  document.getElementById('stat-avg').textContent=avg!==null?avg:'—';
  document.getElementById('stat-streak').textContent=STATE.maxStreak;
  const nextLevel=LEVELS[Math.min(STATE.level+1,LEVELS.length-1)];
  document.getElementById('xp-label').title=`Niveau ${STATE.level+1} · ${lv.label} · prochain palier ${nextLevel.xp} XP`;
  const progress=document.getElementById('objective-progress');
  if(progress) progress.textContent=`Objectif ${validated?1:0}/1`;
  updateComboUI();
  if(STATE.streak>=3){document.getElementById('streak-row').style.display='flex';document.getElementById('streak-num').textContent=STATE.streak;}
  else document.getElementById('streak-row').style.display='none';
  renderSliders(lv.locked,lv.hint);
}
function renderSliders(locked,hint){
  ['r','g','b'].forEach(ch=>{
    const row=document.getElementById('row-'+ch);
    const slider=document.getElementById('sl-'+ch);
    const val=document.getElementById('val-'+ch);
    const isLocked=locked.includes(ch)||(currentMode==='blind'&&ch!=='r');
    const old=row.querySelector('.slider-locked');if(old) old.remove();
    slider.style.display='';
    if(isLocked){
      slider.style.display='none';val.textContent='?';
      const d=document.createElement('div');d.className='slider-locked';
      d.textContent=currentMode==='blind'?'🙈 MODE BLIND':'🔒 NIVEAU INSUFFISANT';row.appendChild(d);
    } else val.textContent=ch==='r'?uR:ch==='g'?uG:uB;
  });
  const isBlind=currentMode==='blind';
  if(!hint||isBlind){
    document.getElementById('score-hint').textContent=isBlind?'🙈 Aucun feedback':'🙈 Score masqué';
    document.getElementById('diff-fill').style.width='0';
    document.getElementById('live-score').textContent='?';
  }else{
    updateAttempt();
  }
}

// ════════════════════════════════════════
//  MODE
// ════════════════════════════════════════
function selectMode(m){
  if(m==='daily'&&isDailyDone()){showToast('✅ Défi déjà complété aujourd\'hui !');return;}
  currentMode=m;
  document.querySelectorAll('.mode-card').forEach(c=>c.classList.remove('selected'));
  document.getElementById('mode-'+m).classList.add('selected');
  document.getElementById('timer-wrap').style.display=m==='chrono'?'flex':'none';
  if(m!=='chrono') clearInterval(timerInterval);
  nextRound(true);
}

// ════════════════════════════════════════
//  ATTEMPT UPDATE
// ════════════════════════════════════════
function updateAttempt(){
  if(!STATE) return;
  const attempt={r:uR,g:uG,b:uB};
  document.getElementById('attempt-block').style.background=rgb(attempt);
  const lv=curLevel();const s=calcScore(TARGET,attempt);const isBlind=currentMode==='blind';
  if(lv.hint&&!isBlind){
    document.getElementById('diff-fill').style.width=s+'%';
    const el=document.getElementById('live-score');el.textContent=s;
    el.style.color=s>=90?'var(--green)':s>=70?'var(--gold)':'var(--red)';
    const dist=Math.round(Math.sqrt((TARGET.r-uR)**2+(TARGET.g-uG)**2+(TARGET.b-uB)**2));
    document.getElementById('score-hint').textContent=dist===0?'✨ Correspondance parfaite !':`Distance : ${dist} · Score : ${s}/100`;
  }
}

function applyPreset(type){
  if(validated) return;
  const presets={
    neutral:{r:128,g:128,b:128},
    warm:{r:210,g:145,b:85},
    cool:{r:75,g:145,b:210},
    random:{r:Math.floor(Math.random()*256),g:Math.floor(Math.random()*256),b:Math.floor(Math.random()*256)}
  };
  const preset=presets[type];
  if(!preset) return;
  uR=preset.r;uG=preset.g;uB=preset.b;
  ['r','g','b'].forEach(ch=>{
    const value=ch==='r'?uR:ch==='g'?uG:uB;
    const slider=document.getElementById('sl-'+ch);
    if(slider.style.display!=='none'){
      slider.value=value;
      document.getElementById('val-'+ch).textContent=value;
    }
  });
  updateAttempt();
}

function handleGameKeyboard(event){
  if(!STATE||document.getElementById('game-root').style.display==='none') return;
  const tag=document.activeElement?.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA') return;
  if(event.key==='Enter'){
    event.preventDefault();
    if(!validated) valider();
    else if(!document.getElementById('btn-next-round').disabled) nextRound();
  }else if(event.key.toLowerCase()==='n'&&validated&&!document.getElementById('btn-next-round').disabled){
    nextRound();
  }
}

// ════════════════════════════════════════
//  TIMER
// ════════════════════════════════════════
function startTimer(){
  clearInterval(timerInterval);
  timerMax=Math.max(14,20-(STATE.level*1));
  timerLeft=timerMax;
  document.getElementById('timer-fill').style.width='100%';
  document.getElementById('timer-num').textContent=timerMax;
  timerInterval=setInterval(()=>{
    timerLeft--;
    document.getElementById('timer-fill').style.width=(timerLeft/timerMax*100)+'%';
    document.getElementById('timer-num').textContent=timerLeft;
    document.getElementById('timer-num').style.color=timerLeft<=5?'var(--red)':'var(--text)';
    if(timerLeft<=0){clearInterval(timerInterval);if(!validated) valider(true);}
  },1000);
}

// ════════════════════════════════════════
//  CONFETTI
// ════════════════════════════════════════
function spawnConfetti(){
  const wrap=document.getElementById('confetti-wrap');wrap.innerHTML='';
  const colors=['#a78bfa','#f472b6','#ffc84a','#00ff88','#ff3d5c'];
  for(let i=0;i<40;i++){
    const d=document.createElement('div');d.className='conf-dot';
    d.style.left=Math.random()*100+'vw';d.style.top='-10px';
    d.style.background=colors[Math.floor(Math.random()*colors.length)];
    d.style.animationDelay=(Math.random()*.8)+'s';d.style.animationDuration=(.8+Math.random()*.8)+'s';
    wrap.appendChild(d);
  }
  setTimeout(()=>wrap.innerHTML='',2500);
}

// ════════════════════════════════════════
//  VALIDER
// ════════════════════════════════════════
function valider(){
  if(validated||!STATE) return;
  if(!hasInfiniteLives()&&STATE.lives<=0){openNoLivesModal();return;}
  validated=true;clearInterval(timerInterval);
  document.getElementById('btn-val').disabled=true;
  const lv=curLevel();
  const attempt={r:uR,g:uG,b:uB};
  const score=calcScore(TARGET,attempt);
  const streakMult=comboMultiplier();
  const modeMult=currentMode==='daily'?3:currentMode==='blind'?1.5:1;
  const mult=modeMult*streakMult;
  const xpMul=xpMult();
  const baseXP=Math.round(score*.8+(score>=80?20:0)+(score>=95?30:0));
  const xpGain=Math.round(baseXP*mult*xpMul);
  const perfectBonus=score===100?100:0;
  const coinsGain=(score>=50?Math.round(lv.coins*(score/100)*2*mult):0)+perfectBonus;

  if(score>=70){STATE.streak++;STATE.combo++;}else{STATE.streak=0;STATE.combo=0;}
  if(STATE.streak>STATE.maxStreak) STATE.maxStreak=STATE.streak;
  if(!hasInfiniteLives()) STATE.lives=Math.max(0,STATE.lives-1);
  STATE.xp+=xpGain;STATE.coins+=coinsGain;STATE.totalCoinsEarned+=coinsGain;
  STATE.scores.push(score);STATE.history.push({score,mode:currentMode,challenge:activeChallenge.label,at:Date.now()});
  STATE.history=STATE.history.slice(-30);STATE.totalRounds++;
  if(score===100) STATE.perfects++;
  ensureMissions();
  STATE.missions.dayRounds++;STATE.missions.weekRounds++;
  STATE.missions.dayHigh=Math.max(STATE.missions.dayHigh,score);
  if(score===100) STATE.missions.weekPerfects++;
  if(score>STATE.bestScore) STATE.bestScore=score;
  let leveledUp=false;
  while(STATE.level<LEVELS.length-1&&STATE.xp>=LEVELS[STATE.level].xp){STATE.level++;leveledUp=true;}
  if(currentMode==='daily') markDailyDone();
  saveState();

  const{emoji,msg,sub}=scoreMsg(score);
  document.getElementById('r-emoji').textContent=emoji;
  document.getElementById('r-score').textContent=score;
  document.getElementById('r-msg').textContent=msg;
  document.getElementById('r-sub').textContent=sub;
  document.getElementById('sw-t').style.background=rgb(TARGET);
  document.getElementById('sw-a').style.background=rgb(attempt);
  document.getElementById('sw-t-hex').textContent=toHex(TARGET);
  document.getElementById('sw-a-hex').textContent=toHex(attempt);

  let gainHTML=`<div class="r-gain-pill">⚡ +${xpGain} XP${xpMul>1?` (×${xpMul})`:''}${mult>1?` (×${mult.toFixed(2)})`:''}</div>`;
  gainHTML+=coinsGain>0?`<div class="r-gain-pill">💰 +${coinsGain}</div>`:`<div class="r-gain-pill" style="color:var(--muted2)">💰 Score insuffisant</div>`;
  if(STATE.streak>=3) gainHTML+=`<div class="r-gain-pill">🔥 Série ×${STATE.streak}</div>`;
  if(score===100) gainHTML+=`<div class="r-gain-pill" style="color:var(--gold)">🏆 Bonus parfait +100</div>`;
  document.getElementById('r-gains').innerHTML=gainHTML;

  if(currentMode==='daily'){
    document.getElementById('btn-next-round').textContent='✓ Défi terminé — à demain !';
    document.getElementById('btn-next-round').disabled=true;
    document.getElementById('btn-next-round').style.opacity='.5';
  } else {
    document.getElementById('btn-next-round').textContent='Prochain round →';
    document.getElementById('btn-next-round').disabled=false;
    document.getElementById('btn-next-round').style.opacity='1';
  }

  document.getElementById('result-card').classList.add('show');
  document.getElementById('btn-replay').textContent=score===100?'✨ Rejouer pour battre 100':'↻ Rejouer ce round';
  renderAll();
  if(score===100){spawnConfetti();showToast('🏆 Score parfait : bonus +100 pièces !','success');}
  checkAchievements();
  if(leveledUp) setTimeout(()=>showLevelUp(),700);
}

// ════════════════════════════════════════
//  NEXT ROUND
// ════════════════════════════════════════
function nextRound(modeSwitch=false){
  if(!modeSwitch&&!validated) return;
  if(!hasInfiniteLives()&&STATE.lives<=0){openNoLivesModal();return;}
  beginRound();uR=128;uG=128;uB=128;validated=false;
  if(!modeSwitch) STATE.round++;saveState();
  ['r','g','b'].forEach(ch=>document.getElementById('sl-'+ch).value=128);
  document.getElementById('target-block').style.background=rgb(TARGET);
  document.getElementById('attempt-block').style.background='rgb(128,128,128)';
  document.getElementById('result-card').classList.remove('show');
  document.getElementById('btn-val').disabled=false;
  renderAll();updateAttempt();
  if(currentMode==='chrono') startTimer();
  window.scrollTo({top:0,behavior:'smooth'});
}
function replayRound(){
  if(!STATE||!TARGET) return;
  if(!hasInfiniteLives()&&STATE.lives<=0){openNoLivesModal();return;}
  uR=128;uG=128;uB=128;validated=false;roundStartedAt=Date.now();
  ['r','g','b'].forEach(ch=>document.getElementById('sl-'+ch).value=128);
  document.getElementById('result-card').classList.remove('show');
  document.getElementById('btn-val').disabled=false;
  renderAll();updateAttempt();
  if(currentMode==='chrono') startTimer();
  showToast('↻ Round rejoué — tente ton meilleur score !');
}

// ════════════════════════════════════════
//  BOOT
// ════════════════════════════════════════
(function boot(){
  const stored=loadUser();
  if(stored&&stored.pseudo){
    currentUser=stored;
    document.getElementById('auth-login').style.display='none';
    enterGame();
  }
  // else login screen is shown by default
})();
