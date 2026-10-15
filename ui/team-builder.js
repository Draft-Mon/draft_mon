/* ==== SOMMAIRE ====
   Builder d'équipe (bouton "Builder d'équipe" de l'accueil) : un outil indépendant des parties de
   draft, pour construire librement jusqu'à 10 équipes de 6 Pokémon avec toute la base de données du
   jeu (espèces, formes, objets, talents, capacités), les comparer à d'autres Pokémon et repérer les
   menaces. Rien ici ne touche à la partie en cours ni aux sauvegardes de la Tour. Repères :
   - Stockage : tbLoad/tbSave (localStorage, clé TB_KEY), 10 équipes renommables
   - Espèces/sets : tbSpeciesList, tbPresets (sets de tournoi de pokemon/tournament-sets.js — les mêmes
     que les adversaires de la Tour —, set VGC, analyses Smogon de pokemon/smogon-sets.js, puis build
     automatique), tbApplySet
   - Adversaire du comparateur : tbData.foe (espèce, set appliqué, membre complet personnalisable),
     tbSetFoe, tbGetFoe ; le même éditeur sert aux deux (tbRenderEditor avec foe:true)
   - Calculs : tbCombatant (membre → combattant figé), tbDamageRange (dégâts min/max via le vrai
     computeDamage du jeu, hors combat), tbMatchup, tbThreatsFor
   - Affichage : tbRender (barre d'équipes, 6 emplacements, éditeur du membre, Comparateur/Menaces),
     tbOpenSpeciesPicker, tbOpenSummary (résumé complet de l'équipe), tbOpenImportExport
   - Showdown : tbExportTeam / tbImportTeam (noms anglais de pokemon/showdown-names.js)
==== */
const TB_KEY = 'draftArenaTeamBuilder';
const TB_TEAM_COUNT = 10;
const TB_TEAM_SIZE = 6;
const TB_STATS = ['hp','atk','def','spa','spd','spe'];
let tbData = null;
let tbSel = 0;                 // emplacement de l'équipe en cours d'édition
let tbTab = 'compare';         // 'compare' | 'threats'
let tbFoeEdit = false;         // éditeur de l'adversaire du comparateur ouvert
let tbSpeciesCache = null;
let tbThreatPool = null;

/* ---------- Stockage ---------- */
function tbEmptyData(){
  return { cur:0, teams: Array.from({length:TB_TEAM_COUNT}, (_,i)=>({ name:`Équipe ${i+1}`, members:[] })) };
}
function tbLoad(){
  let data = null;
  try { data = JSON.parse(localStorage.getItem(TB_KEY)); } catch(e){}
  if(!data || !Array.isArray(data.teams)) data = tbEmptyData();
  while(data.teams.length<TB_TEAM_COUNT) data.teams.push({ name:`Équipe ${data.teams.length+1}`, members:[] });
  data.teams.length = TB_TEAM_COUNT;
  data.teams.forEach(t=>{
    t.members = (t.members||[]).filter(m=>m && lineOf(m.lineId)).slice(0,TB_TEAM_SIZE);
    t.members.forEach(m=>{ m.nature = NATURES.find(n=>n.name===(m.nature && m.nature.name)) || NATURES[0]; });
  });
  data.cur = Math.max(0, Math.min(TB_TEAM_COUNT-1, data.cur||0));
  const foe = data.foe;
  if(foe && foe.member && lineOf(foe.member.lineId)) foe.member.nature = NATURES.find(n=>n.name===(foe.member.nature && foe.member.nature.name)) || NATURES[0];
  else data.foe = null;
  tbData = data;
}
function tbSave(){
  try { localStorage.setItem(TB_KEY, JSON.stringify(tbData)); } catch(e){}
}
function tbTeam(){ return tbData.teams[tbData.cur]; }

/* ---------- Espèces, formes et sets prédéfinis ---------- */
function tbNorm(s){ return String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,''); }
function tbEntryKey(e){ return `${e.lineId}|${e.stage}|${e.branch==null?'':e.branch}`; }
// Toutes les espèces du jeu (chaque stade + chaque branche). `final` = forme entièrement évoluée
// (celles utilisées pour l'analyse des menaces).
function tbSpeciesList(){
  if(tbSpeciesCache) return tbSpeciesCache;
  tbSpeciesCache = [];
  LINES.forEach(line=>{
    const hasBranch = !!(line.branches && line.branches.length);
    line.stages.forEach((sp,i)=> tbSpeciesCache.push({ lineId:line.id, stage:i, branch:null, sp, final: i===line.stages.length-1 && !(hasBranch && line.branches.some(b=>b.draftable!==false)) }));
    (line.branches||[]).forEach((sp,bi)=> tbSpeciesCache.push({ lineId:line.id, stage:line.stages.length-1, branch:bi, sp, final:true }));
  });
  tbSpeciesCache.forEach(e=>{ e.key = tbEntryKey(e); });
  return tbSpeciesCache;
}
function tbEntryByKey(key){ return tbSpeciesList().find(e=>e.key===key) || null; }
function tbEntryOf(m){ return tbEntryByKey(tbEntryKey(m)); }
// Espèce réellement jouée par un membre : forme liée à l'objet tenu (speciesOf) et, contrairement
// au reste du jeu hors combat, Méga-Évolution comprise — le Builder calcule toujours "Méga activée".
function tbForm(m){
  const base = speciesOf(m);
  const megaKey = megaFormKey(m, base);
  return megaKey ? base.forms[megaKey] : base;
}
// Talents sélectionnables d'un membre : ceux de sa forme hors Méga-Évolution (le talent d'une Méga
// est imposé et remplace celui-ci une fois en combat, voir tbCombatant).
function tbAbilities(m){ return abilitiesFor(m); }
function tbFixAbility(m){
  const list = tbAbilities(m);
  if(!list.includes(m.ability)) m.ability = list[0];
}
// Applique un set (format de pokemon/smogon-sets.js) à un membre : seuls les éléments valides pour
// cette espèce sont gardés, les attaques manquantes sont complétées automatiquement.
function tbApplySet(m, set){
  m.heldItem = (set.i && ITEMS[set.i]) ? set.i : null;
  m.nature = natureFor(set.p, set.m);
  m.evs = convertRealEvs(set.e||{});
  let over = TB_STATS.reduce((a,k)=>a+m.evs[k],0) - EV_TOTAL_MAX;
  while(over>0){
    const k = TB_STATS.filter(s=>m.evs[s]>0).sort((a,b)=>m.evs[a]-m.evs[b])[0];
    m.evs[k]--; over--;
  }
  m.ivs = {hp:31,atk:31,def:31,spa:31,spd:31,spe:31};
  if(set.v) TB_STATS.forEach(k=>{ if(typeof set.v[k]==='number') m.ivs[k] = Math.max(0, Math.min(31, set.v[k])); });
  const pool = movepoolFor(m);
  const legal = (set.mv||[]).filter(id=>MOVES[id] && pool.includes(id));
  const fill = legal.length<4 ? pickSmartMoves(pool, tbForm(m), 5).filter(id=>!legal.includes(id)) : [];
  const moves = [...legal, ...fill].slice(0,4);
  m.moves = [0,1,2,3].map(i=>moves[i]||null);
  if(set.a) m.ability = set.a;
  tbFixAbility(m);
  m.teraType = set.t || tbForm(m).types[0];
}
function tbBlankMember(entry){
  const m = defaultMember(entry.lineId, entry.stage, entry.branch);
  m.unownForm = null;
  m.ability = (entry.sp.abilities || lineOf(entry.lineId).abilities)[0];
  m.teraType = entry.sp.types[0];
  return m;
}
// Nom lisible d'un set : son nom d'analyse Smogon, sinon son objet et sa nature (HTML, un morceau par
// élément pour que chacun soit traduit).
function tbSetNameHTML(s){
  if(s.n) return `<span>${tbEsc(s.n)}</span>`;
  const it = s.i && ITEMS[s.i];
  return `${it ? `${itemIconHTML(s.i,14)} <span>${it.name}</span>` : '<span>Sans objet</span>'} · <span>${natureFor(s.p, s.m).name}</span>`;
}
// Sets prédéfinis disponibles pour une espèce : ceux joués en tournoi (jusqu'à 5, ceux que tirent les
// adversaires de la Tour, plus les sets de Méga-Évolution), le set VGC (combat double) le plus joué, les
// analyses Smogon, le set curé du jeu (seulement s'il n'y a aucun set de tournoi), puis le build auto.
function tbPresets(entry){
  const list = [];
  const name = entry.sp.name;
  const fromSet = (s, source, html)=> list.push({
    label: (s.n || (s.i && ITEMS[s.i] ? ITEMS[s.i].name : 'Sans objet')) + ' — ' + s.f, source,
    html: html || `${tbSetNameHTML(s)} — <span>${s.f}</span>${s.u ? ` <span style="color:var(--text-dim);">(${s.u} %)</span>` : ''}`,
    build:()=>{ const m = tbBlankMember(entry); tbApplySet(m, s); return m; }
  });
  const tour = (typeof TOURNAMENT_SETS!=='undefined' && TOURNAMENT_SETS[name]) || [];
  tour.forEach(s=> fromSet(s, 'Tournoi'));
  ((typeof VGC_SETS!=='undefined' && VGC_SETS[name]) || []).forEach(s=> fromSet(s, 'VGC'));
  ((typeof SMOGON_SETS!=='undefined' && SMOGON_SETS[name]) || []).forEach(s=>{
    fromSet(s, 'Smogon', `<span>${tbEsc(s.n)}</span> — <span>${s.f}</span>`);
  });
  const cur = (!tour.length && typeof COMPETITIVE_SETS!=='undefined') ? COMPETITIVE_SETS[name] : null;
  if(cur){
    list.push({ label:'Set du jeu (Tour)', source:'Jeu', build:()=>{
      const m = tbBlankMember(entry);
      tbApplySet(m, { a:cur.ability, i:cur.item, p:cur.plus, m:cur.minus, e:cur.evs, mv:cur.moves });
      return m;
    }});
  }
  list.push({ label:'Build automatique', source:'Auto', build:()=>{
    const m = autoBuildMember(entry.lineId, entry.stage, entry.branch);
    m.unownForm = null;
    m.teraType = entry.sp.types[0];
    return m;
  }});
  return list;
}
function tbPresetOptions(presets){
  return presets.map((p,i)=>({value:i, label:p.label, html:`<span class="tb-src tb-src-${p.source.toLowerCase()}">${p.source}</span> ${p.html || `<span>${tbEsc(p.label)}</span>`}`}));
}
// Adversaire du comparateur : une espèce, le set prédéfini appliqué et le membre complet qui en résulte
// (modifiable ensuite comme un membre de l'équipe ; custom = modifié depuis le set).
function tbSetFoe(entry, preset){
  const presets = tbPresets(entry);
  const i = (preset>=0 && preset<presets.length) ? preset : 0;
  tbData.foe = { key:entry.key, preset:i, custom:false, member:presets[i].build() };
  tbSave();
}
function tbGetFoe(){
  if(!tbData.foe || !tbData.foe.member || !tbEntryByKey(tbData.foe.key)){
    const def = tbSpeciesList().find(e=>e.sp.name==='Carchacrok') || tbSpeciesList().find(e=>e.final);
    tbSetFoe(def, 0);
  }
  return tbData.foe;
}

/* ---------- Calculs ---------- */
// Combattant figé (PV pleins, aucun changement de stats) utilisable par computeDamage.
function tbCombatant(m){
  const form = tbForm(m);
  const stats = calcStats(form.base, m.ivs, m.evs, m.nature);
  const isMega = form!==speciesOf(m);
  return {
    name: form.name, lineId: m.lineId, stage: m.stage, branch: m.branch, types: form.types,
    stats, maxHp: stats.hp, hp: stats.hp, level: LEVEL, status: null,
    stages: {atk:0,def:0,spa:0,spd:0,spe:0,acc:0,eva:0},
    ability: isMega ? (form.abilities||[m.ability])[0] : (m.ability || tbAbilities(m)[0]),
    heldItem: m.heldItem || null,
    moveIds: m.moves.filter(Boolean)
  };
}
function tbSpeed(c){ return Math.floor(c.stats.spe * (c.heldItem==='mouchoirChoix' ? 1.5 : 1)); }
// Immunités totales données par un talent (mêmes cas que le moteur de combat, voir runStep).
function tbAbilityImmune(def, mv){
  const a = def.ability;
  if(a==='Absorbe-Eau' && mv.type==='eau') return true;
  if(a==='Absorbe-Volt' && mv.type==='electrik') return true;
  if(a==='Lévitation' && mv.type==='sol' && !mv.bypassTypeImmunity) return true;
  if((a==='Torche' || a==='Corps Cuit') && mv.type==='feu') return true;
  if(a==='Anti-Bombe' && mv.ballBomb) return true;
  return false;
}
// Fourchette de dégâts d'une capacité (en PV) calculée avec le vrai moteur du jeu, hors combat :
// pas de coup critique, variance au maximum puis ramenée au minimum, multi-coups comptés.
function tbDamageRange(att, mv, def){
  if(!mv || mv.cat==='status') return null;
  if(tbAbilityImmune(def, mv)) return { min:0, max:0, eff:0 };
  const savedState = battleState, savedRandom = Math.random;
  let res = null;
  battleState = null;
  Math.random = ()=>0.999999;
  try { res = computeDamage(att, mv, def); } catch(e){ res = null; }
  Math.random = savedRandom;
  battleState = savedState;
  if(!res) return null;
  if(res.eff===0) return { min:0, max:0, eff:0 };
  let max = res.dmg, min = (mv.fixedDamage || mv.finalGambit) ? res.dmg : Math.max(1, Math.floor(res.dmg*0.85/1.15));
  if(mv.multiHit){ min *= mv.multiHit.min; max *= mv.multiHit.max; }
  return { min, max, eff:res.eff };
}
// Verdict lisible d'une fourchette de dégâts exprimée en % des PV de la cible.
function tbVerdict(minPct, maxPct){
  if(maxPct<=0) return { text:'Aucun effet', hits:99, css:'tb-v-none' };
  if(minPct>=100) return { text:'OHKO garanti', hits:1, css:'tb-v-ko' };
  if(maxPct>=100) return { text:'OHKO possible', hits:1.5, css:'tb-v-ko' };
  const best = Math.ceil(100/maxPct), sure = Math.ceil(100/minPct);
  const css = sure<=2 ? 'tb-v-strong' : (sure<=3 ? 'tb-v-mid' : 'tb-v-weak');
  return best===sure ? { text:`${sure}HKO garanti`, hits:sure, css } : { text:`${best}HKO possible`, hits:best+0.5, css };
}
// Toutes les capacités d'un combattant contre une cible, de la plus forte à la plus faible.
function tbMoveResults(att, def){
  return att.moveIds.map(id=>{
    const mv = MOVES[id];
    const r = tbDamageRange(att, mv, def);
    if(!r) return { id, mv, status:true };
    const minPct = r.min/def.maxHp*100, maxPct = r.max/def.maxHp*100;
    return { id, mv, minPct, maxPct, eff:r.eff, verdict: tbVerdict(minPct, maxPct) };
  });
}
function tbBest(results){
  return results.filter(r=>!r.status).sort((a,b)=>b.maxPct-a.maxPct)[0] || null;
}
// Duel complet entre deux combattants : meilleures attaques de chaque côté + vitesse.
function tbMatchup(me, foe){
  const mine = tbMoveResults(me, foe), theirs = tbMoveResults(foe, me);
  const sMe = tbSpeed(me), sFoe = tbSpeed(foe);
  return { mine, theirs, myBest: tbBest(mine), theirBest: tbBest(theirs), sMe, sFoe };
}
// Réserve des adversaires testés pour l'analyse des menaces : chaque forme finale du jeu avec son
// premier set prédéfini (construite une seule fois).
function tbGetThreatPool(){
  if(tbThreatPool) return tbThreatPool;
  tbThreatPool = [];
  tbSpeciesList().filter(e=>e.final && e.sp.draftable!==false).forEach(entry=>{
    try {
      const preset = tbPresets(entry)[0];
      const comb = tbCombatant(preset.build());
      if(comb.moveIds.length) tbThreatPool.push({ entry, label:preset.label, comb });
    } catch(e){}
  });
  return tbThreatPool;
}
// Une espèce est une menace si elle met le membre K.O. en 2 coups au plus ET gagne l'échange :
// moins de coups nécessaires que lui, ou autant mais en frappant la première.
function tbThreatInfo(me, t){
  const theirBest = tbBest(tbMoveResults(t.comb, me));
  if(!theirBest || theirBest.maxPct<=0) return null;
  const theirHits = Math.ceil(100/Math.max(0.01, theirBest.minPct));
  if(theirHits>2) return null;
  const myBest = tbBest(tbMoveResults(me, t.comb));
  const myHits = (myBest && myBest.minPct>0) ? Math.ceil(100/myBest.minPct) : 99;
  const faster = tbSpeed(t.comb) > tbSpeed(me);
  if(!(theirHits<myHits || (theirHits===myHits && faster))) return null;
  const score = (3-theirHits)*100 + (Math.min(myHits,6)-theirHits)*10 + (faster?4:0) + Math.min(theirBest.maxPct,200)/100;
  return { t, theirBest, myBest, faster, score };
}
function tbThreatsFor(me){
  return tbGetThreatPool().map(t=>tbThreatInfo(me, t)).filter(Boolean).sort((a,b)=>b.score-a.score);
}

/* ---------- Petits morceaux d'affichage ---------- */
function tbPct(r){ return r.maxPct<=0 ? '0%' : `${r.minPct.toFixed(0)}–${r.maxPct.toFixed(0)}%`; }
function tbSpriteBox(name, size, shiny){ return `<span style="width:${size}px;height:${size}px;display:inline-block;flex-shrink:0;">${getSpriteHTML(name, null, 'front', false, shiny)}</span>`; }
function tbMoveLineHTML(r){
  const tag = typeTagHTML(r.mv.type, {style:'font-size:8px;padding:2px 6px;flex-shrink:0;'});
  if(r.status) return `<div class="tb-move-line">${tag}<span class="tb-ml-name">${r.mv.name}</span><span class="tb-verdict tb-v-none">Statut</span></div>`;
  return `<div class="tb-move-line">${tag}<span class="tb-ml-name">${r.mv.name}</span><span class="tb-ml-pct">${tbPct(r)}</span><span class="tb-verdict ${r.verdict.css}">${r.verdict.text}</span></div>`;
}
function tbSpreadText(m){
  const evs = TB_STATS.filter(k=>m.evs[k]>0).map(k=>`${m.evs[k]} ${STAT_LABEL[k]}`).join(' / ') || 'Aucun EV';
  const nat = m.nature.plus ? `${m.nature.name} (+${STAT_LABEL[m.nature.plus]} / -${STAT_LABEL[m.nature.minus]})` : `${m.nature.name} (neutre)`;
  return { evs, nat };
}
function tbStatColor(val){
  if(val>=150) return '#6F35FC';
  if(val>=110) return '#EE8130';
  if(val>=80)  return '#7AC74C';
  if(val>=50)  return '#F7D02C';
  return '#C22E28';
}
function tbStatBarsHTML(m){
  const form = tbForm(m), stats = calcStats(form.base, m.ivs, m.evs, m.nature);
  return TB_STATS.map(k=>{
    const cls = m.nature.plus===k ? 'nature-plus' : (m.nature.minus===k ? 'nature-minus' : '');
    return `<div class="stat-bar-row ${cls}">
      <span class="stat-bar-label">${STAT_LABEL[k]}</span><span class="stat-bar-val">${stats[k]}</span>
      <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${Math.min(100,Math.round(stats[k]/255*100))}%;background:${tbStatColor(form.base[k])};"></div></div>
      <span style="width:26px;flex-shrink:0;font-size:8px;text-align:right;color:var(--text-dim);">${form.base[k]}</span>
    </div>`;
  }).join('');
}
function tbMoveOptions(pool, taken){
  const ids = pool.filter(id=>!taken.includes(id)).sort((a,b)=>(MOVES[b].power||0)-(MOVES[a].power||0));
  const html = id=>{
    const mv = MOVES[id];
    return `${typeTagHTML(mv.type, {style:'font-size:8px;padding:2px 7px;'})} ${mv.name} <span class="cat-chip cat-${mv.cat}">${mv.cat==='phys'?'Phys':mv.cat==='spec'?'Spéc':'Statut'}</span>${mv.cat!=='status'?` <span style="font-size:10px;color:var(--text-dim);">${mv.power}</span>`:''}`;
  };
  const options = [{value:'', label:'— Aucune attaque —'}];
  [['phys', phIcon('sword')+' Physiques'], ['spec', phIcon('sparkle')+' Spéciales'], ['status', phIcon('spiral')+' Statut']].forEach(([cat,title])=>{
    const list = ids.filter(id=>MOVES[id].cat===cat);
    if(!list.length) return;
    options.push({group:title});
    list.forEach(id=> options.push({value:id, label:MOVES[id].name, html:html(id)}));
  });
  return options;
}
const TB_ITEM_GROUPS = { strat:'Stratégiques', baie:'Baies', forme:'Formes & Méga-Gemmes' };
function tbItemOptions(){
  const options = [{value:'', label:'Aucun objet'}];
  const cats = [];
  Object.values(ITEMS).forEach(it=>{ if(it.kind==='held' && !cats.includes(it.category)) cats.push(it.category); });
  cats.forEach(cat=>{
    options.push({group: TB_ITEM_GROUPS[cat] || 'Autres objets'});
    Object.entries(ITEMS).filter(([k,it])=>it.kind==='held' && it.category===cat).forEach(([key,it])=>{
      options.push({value:key, label:it.name, html:`${itemIconHTML(key,16)} ${it.name}`});
    });
  });
  return options;
}

/* ---------- Écran principal ---------- */
function openTeamBuilder(){
  if(!tbData) tbLoad();
  showScreen('screenTeamBuilder');
  tbRender();
}
function tbRender(){
  const root = document.getElementById('tbRoot');
  const team = tbTeam();
  if(tbSel>team.members.length) tbSel = team.members.length;
  if(tbSel>=TB_TEAM_SIZE) tbSel = TB_TEAM_SIZE-1;
  const m = team.members[tbSel] || null;
  document.getElementById('tbSub').textContent = `${team.name} · ${team.members.length}/${TB_TEAM_SIZE} Pokémon`;
  root.innerHTML = `
    <div class="tb-toolbar">
      <div id="tbTeamSelect" style="min-width:190px;flex:1;"></div>
      <button class="btn secondary tb-tool" id="tbRenameBtn">${phIcon('pencil-simple')} Renommer</button>
      <button class="btn secondary tb-tool" id="tbSummaryBtn" ${team.members.length?'':'disabled'}>${phIcon('list-checks')} Résumé</button>
      <button class="btn secondary tb-tool" id="tbIOBtn">${phIcon('swap')} Import / Export</button>
      <button class="btn secondary tb-tool" id="tbClearBtn" ${team.members.length?'':'disabled'}>${phIcon('trash')} Vider</button>
    </div>
    <div class="tb-slots" id="tbSlots"></div>
    <div class="tb-grid">
      <div class="tb-card" id="tbEditor"></div>
      <div class="tb-card" id="tbAnalysis"></div>
    </div>`;
  document.getElementById('tbTeamSelect').appendChild(createCustomSelect({
    options: tbData.teams.map((t,i)=>({value:i, label:t.name, html:`<b>${i+1}.</b> ${tbEsc(t.name)} <span style="color:var(--text-dim);">(${t.members.length}/${TB_TEAM_SIZE})</span>`})),
    value: tbData.cur, searchable:false,
    onChange: (val)=>{ tbData.cur = val; tbSel = 0; tbSave(); tbRender(); }
  }));
  document.getElementById('tbRenameBtn').onclick = ()=>{
    const name = window.prompt(I18N.t("Nom de l'équipe :"), team.name);
    if(name===null) return;
    team.name = name.trim().slice(0,30) || team.name;
    tbSave(); tbRender();
  };
  document.getElementById('tbSummaryBtn').onclick = tbOpenSummary;
  document.getElementById('tbIOBtn').onclick = tbOpenImportExport;
  document.getElementById('tbClearBtn').onclick = ()=>{
    if(!window.confirm(I18N.t(`Vider « ${team.name} » ?`))) return;
    team.members = []; tbSel = 0; tbSave(); tbRender();
  };
  const slots = document.getElementById('tbSlots');
  for(let i=0;i<TB_TEAM_SIZE;i++){
    const mem = team.members[i];
    const btn = document.createElement('button');
    btn.className = 'tb-slot' + (i===tbSel && mem ? ' active' : '');
    if(mem){
      const form = tbForm(mem);
      btn.innerHTML = `${tbSpriteBox(form.name, 44, mem.shiny)}<span class="tb-slot-name">${form.name}</span>`;
      btn.onclick = ()=>{ tbSel = i; tbRender(); };
    } else {
      btn.innerHTML = `<span style="font-size:22px;color:var(--text-dim);">+</span><span class="tb-slot-name">Ajouter</span>`;
      btn.disabled = i>team.members.length;
      btn.onclick = ()=> tbOpenSpeciesPicker(entry=>{
        team.members.push(tbPresets(entry)[0].build());
        tbSel = team.members.length-1;
        tbSave(); tbRender();
      });
    }
    slots.appendChild(btn);
  }
  if(m){ tbRenderEditor(m); tbRenderAnalysis(m); }
  else {
    document.getElementById('tbEditor').innerHTML = `<div class="tb-empty">Ajoute un Pokémon à ton équipe pour commencer : toutes les espèces du jeu sont disponibles, sans aucune restriction.</div>`;
    document.getElementById('tbAnalysis').innerHTML = `<div class="tb-empty">Le comparateur et l'analyse des menaces apparaîtront ici.</div>`;
  }
}
function tbEsc(s){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
// Tout changement du build : sauvegarde + réaffichage complet (stats, comparateur et menaces à jour).
function tbChanged(){ tbSave(); tbRender(); }

// Éditeur complet d'un Pokémon. Sert au membre sélectionné de l'équipe (dans #tbEditor) et, avec
// foe:true, à l'adversaire du comparateur (dans le panneau d'analyse, own = membre comparé).
function tbRenderEditor(m, opts){
  opts = opts || {};
  const foe = !!opts.foe;
  const el = opts.el || document.getElementById('tbEditor');
  const $ = k=> el.querySelector(`[data-tb="${k}"]`);
  // Après chaque modification : l'équipe se sauvegarde et tout se réaffiche ; l'adversaire devient un
  // set personnalisé et seul le comparateur se réaffiche.
  const changed = foe ? ()=>{ tbData.foe.custom = true; tbSave(); tbRenderAnalysis(opts.own); } : tbChanged;
  const entry = tbEntryOf(m);
  const form = tbForm(m);
  const isMega = form!==speciesOf(m);
  const abilities = tbAbilities(m);
  const megaAbility = isMega ? (form.abilities||[m.ability])[0] : null;
  const presets = tbPresets(entry);
  const evTotal = TB_STATS.reduce((a,k)=>a+(m.evs[k]||0),0);
  const lab = t=>`<label class="tb-label">${t}</label>`;
  el.innerHTML = `
    ${foe ? '' : `<div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
      ${tbSpriteBox(form.name, 64, m.shiny)}
      <div style="min-width:0;flex:1;">
        <div style="font-size:14px;color:var(--text-main);font-weight:700;">${form.name}${m.shiny?shinyBadgeHTML():''}</div>
        <div class="types-row" style="justify-content:flex-start;margin-top:4px;">${form.types.map(t=>typeTagHTML(t)).join('')}</div>
      </div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
      <button class="btn secondary tb-tool" data-tb="change">${phIcon('arrows-clockwise')} Changer</button>
      <button class="btn secondary tb-tool${m.shiny?' diff-active':''}" data-tb="shiny">${phIcon('sparkle')} Chromatique</button>
      <button class="btn secondary tb-tool" data-tb="remove">${phIcon('x')} Retirer</button>
    </div>
    ${lab('Set prédéfini (tournoi / Smogon / auto)')}<div data-tb="preset"></div>`}
    ${lab('Objet tenu')}<div data-tb="item"></div>
    ${lab('Talent')}<div data-tb="ability"></div>
    <div class="effect-desc" style="margin-top:4px;">${ABILITY_DESC[m.ability]||''}</div>
    ${isMega ? `<div class="effect-desc" style="margin-top:4px;"><b>Une fois Méga-Évolué : ${megaAbility}</b> — ${ABILITY_DESC[megaAbility]||''}</div>` : ''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <div>${lab('Nature')}<div data-tb="nature"></div></div>
      <div>${lab('Type Téracristal')}<div data-tb="tera"></div></div>
    </div>
    ${lab(`EV (0–${EV_MAX} par stat · ${EV_TOTAL_MAX} au total)`)}
    <div class="ev-grid tb-num-grid" data-tb="evs"></div>
    <div class="ev-total${evTotal>EV_TOTAL_MAX?' over':''}">${evTotal} / ${EV_TOTAL_MAX}</div>
    ${lab('IV (0–31)')}
    <div class="iv-grid tb-num-grid" data-tb="ivs"></div>
    ${lab('Attaques')}<div data-tb="moves" style="display:flex;flex-direction:column;gap:6px;"></div>
    ${lab('Stats finales (niveau 50) · base')}
    <div class="stat-bars">${tbStatBarsHTML(m)}</div>`;
  if(!foe){
    $('change').onclick = ()=> tbOpenSpeciesPicker(en=>{
      tbTeam().members[tbSel] = tbPresets(en)[0].build();
      tbChanged();
    });
    $('shiny').onclick = ()=>{ m.shiny = !m.shiny; tbChanged(); };
    $('remove').onclick = ()=>{
      tbTeam().members.splice(tbSel,1);
      tbSel = Math.max(0, Math.min(tbSel, tbTeam().members.length-1));
      tbChanged();
    };
    $('preset').appendChild(createCustomSelect({
      options: tbPresetOptions(presets),
      value: null, placeholder:'— Appliquer un set —', searchable:false,
      onChange: (val)=>{
        const built = presets[val].build();
        built.shiny = m.shiny;
        tbTeam().members[tbSel] = built;
        tbChanged();
      }
    }));
  }
  $('item').appendChild(createCustomSelect({
    options: tbItemOptions(), value: m.heldItem || '', searchable:true,
    onChange: (val)=>{ m.heldItem = val || null; tbFixAbility(m); m.moves = m.moves.map(id=> (id && movepoolFor(m).includes(id)) ? id : null); changed(); }
  }));
  $('ability').appendChild(createCustomSelect({
    options: abilities.map(a=>({value:a, label:a})),
    value: m.ability,
    onChange: (val)=>{ m.ability = val; changed(); }
  }));
  $('nature').appendChild(createCustomSelect({
    options: NATURES.map(n=>({
      value:n.name, label:n.name+(n.plus?` (+${STAT_LABEL[n.plus]}/-${STAT_LABEL[n.minus]})`:''),
      html: n.plus ? `${n.name} <span style="color:var(--good);font-weight:700;">+${STAT_LABEL[n.plus]}</span> <span style="color:var(--low);font-weight:700;">-${STAT_LABEL[n.minus]}</span>` : `${n.name} <span style="color:var(--text-dim);">(neutre)</span>`
    })),
    value: m.nature.name,
    onChange: (val)=>{ m.nature = NATURES.find(n=>n.name===val); changed(); }
  }));
  $('tera').appendChild(createCustomSelect({
    options: TERA_TYPES.map(t=>({value:t, label:typeDisplayName(t), html:`${typeIconHTML(t)} ${typeDisplayName(t)}`})),
    value: m.teraType || form.types[0], searchable:false,
    onChange: (val)=>{ m.teraType = val; changed(); }
  }));
  const numGrid = (key, obj, max)=>{
    const grid = $(key);
    TB_STATS.forEach(k=>{
      const row = document.createElement('div'); row.className = key==='evs' ? 'ev-row' : 'iv-row';
      row.innerHTML = `<label>${STAT_LABEL[k]}</label><input type="number" min="0" max="${max}" step="1" value="${obj[k]||0}">`;
      const inp = row.querySelector('input');
      inp.onchange = ()=>{ obj[k] = Math.max(0, Math.min(max, parseInt(inp.value)||0)); changed(); };
      grid.appendChild(row);
    });
  };
  numGrid('evs', m.evs, EV_MAX);
  numGrid('ivs', m.ivs, 31);
  const pool = [...new Set(movepoolFor(m))].filter(id=>MOVES[id]);
  const movesEl = $('moves');
  for(let slot=0;slot<4;slot++){
    const taken = m.moves.filter((id,i)=> i!==slot && id);
    movesEl.appendChild(createCustomSelect({
      options: tbMoveOptions(pool, taken), value: m.moves[slot] || '', searchable:true,
      onChange: (val)=>{ m.moves[slot] = val || null; changed(); }
    }));
  }
}

function tbRenderAnalysis(m){
  const el = document.getElementById('tbAnalysis');
  el.innerHTML = `
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <button class="btn secondary tb-tool${tbTab==='compare'?' diff-active':''}" id="tbTabCompare" style="flex:1;">${phIcon('scales')} Comparateur</button>
      <button class="btn secondary tb-tool${tbTab==='threats'?' diff-active':''}" id="tbTabThreats" style="flex:1;">${phIcon('warning')} Menaces</button>
    </div>
    <div id="tbAnalysisBody"></div>`;
  document.getElementById('tbTabCompare').onclick = ()=>{ tbTab = 'compare'; tbRenderAnalysis(m); };
  document.getElementById('tbTabThreats').onclick = ()=>{ tbTab = 'threats'; tbRenderAnalysis(m); };
  if(tbTab==='compare') tbRenderCompare(m); else tbRenderThreats(m);
}
function tbRenderCompare(m){
  const body = document.getElementById('tbAnalysisBody');
  const me = tbCombatant(m);
  const foeData = tbGetFoe();
  const foeEntry = tbEntryByKey(foeData.key);
  const presets = tbPresets(foeEntry);
  const foeMember = foeData.member;
  const foe = tbCombatant(foeMember);
  const mu = tbMatchup(me, foe);
  const sp = tbSpreadText(foeMember);
  const line = (best, who, target)=> best
    ? `<b>${who}</b> ${best.verdict.hits>=99 ? `ne peut pas blesser ${target}` : `→ <span class="tb-verdict ${best.verdict.css}">${best.verdict.text}</span> sur ${target} avec ${best.mv.name} (${tbPct(best)})`}`
    : `<b>${who}</b> n'a aucune attaque offensive`;
  const speedTxt = mu.sMe===mu.sFoe ? `Vitesse égale (${mu.sMe})` : (mu.sMe>mu.sFoe ? `${me.name} attaque en premier (${mu.sMe} contre ${mu.sFoe})` : `${foe.name} attaque en premier (${mu.sFoe} contre ${mu.sMe})`);
  body.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      ${tbSpriteBox(foe.name, 52)}
      <div style="flex:1;min-width:0;">
        <div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;">Adversaire</div>
        <div style="font-size:13px;color:var(--text-main);font-weight:700;">${foe.name}</div>
        <div class="types-row" style="justify-content:flex-start;margin-top:3px;">${foe.types.map(t=>typeTagHTML(t)).join('')}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <button class="btn secondary tb-tool" id="tbFoeChangeBtn">${phIcon('magnifying-glass')} Choisir</button>
        <button class="btn secondary tb-tool${tbFoeEdit?' diff-active':''}" id="tbFoeEditBtn">${phIcon('pencil-simple')} Personnaliser</button>
      </div>
    </div>
    <label class="tb-label">Set de l'adversaire</label><div id="tbFoePresetSel"></div>
    ${tbFoeEdit ? `<div class="tb-foe-editor" id="tbFoeEditor"></div>` : ''}
    <div class="tb-foe-build">
      ${foeMember.heldItem ? `${itemIconHTML(foeMember.heldItem,14)} ${ITEMS[foeMember.heldItem].name} · ` : ''}${foe.ability} · ${sp.nat}<br>${sp.evs}
      <br>PV ${foe.stats.hp} · Atq ${foe.stats.atk} · Déf ${foe.stats.def} · AtqSp ${foe.stats.spa} · DéfSp ${foe.stats.spd} · Vit ${foe.stats.spe}
    </div>
    <div class="tb-summary-box">
      <div>${line(mu.myBest, me.name, foe.name)}</div>
      <div>${line(mu.theirBest, foe.name, me.name)}</div>
      <div>${phIcon('lightning')} ${speedTxt}</div>
    </div>
    <div class="editor-section-title" style="margin-top:12px;">${me.name} attaque ${foe.name}</div>
    ${mu.mine.length ? mu.mine.map(tbMoveLineHTML).join('') : '<div class="tb-empty">Aucune attaque choisie.</div>'}
    <div class="editor-section-title" style="margin-top:12px;">${foe.name} attaque ${me.name}</div>
    ${mu.theirs.map(tbMoveLineHTML).join('')}
    <div class="tb-note">Dégâts en % des PV max, sans coup critique, météo ni changement de stats, calculés avec les règles du jeu (niveau 50). Une Méga-Gemme tenue est considérée comme activée.</div>`;
  document.getElementById('tbFoeChangeBtn').onclick = ()=> tbOpenSpeciesPicker(en=>{ tbSetFoe(en, 0); tbRenderAnalysis(m); });
  document.getElementById('tbFoeEditBtn').onclick = ()=>{ tbFoeEdit = !tbFoeEdit; tbRenderAnalysis(m); };
  // Un set modifié n'est plus le set prédéfini : le menu affiche alors « Set personnalisé ».
  document.getElementById('tbFoePresetSel').appendChild(createCustomSelect({
    options: tbPresetOptions(presets),
    value: foeData.custom ? null : foeData.preset, placeholder:'Set personnalisé', searchable:false,
    onChange: (val)=>{ tbSetFoe(foeEntry, val); tbRenderAnalysis(m); }
  }));
  if(tbFoeEdit) tbRenderEditor(foeMember, { foe:true, own:m, el:document.getElementById('tbFoeEditor') });
}
function tbThreatRowHTML(info, extra){
  const t = info.t;
  return `<button class="tb-threat" data-key="${t.entry.key}">
    ${tbSpriteBox(t.comb.name, 36)}
    <span style="flex:1;min-width:0;text-align:left;">
      <span class="tb-threat-name">${t.comb.name} ${info.faster?`<span class="tb-fast" title="Plus rapide">${phIcon('lightning')}</span>`:''}</span>
      <span class="tb-threat-sub">${extra || `${info.theirBest.mv.name} : ${tbPct(info.theirBest)} · tu lui fais ${info.myBest ? tbPct(info.myBest) : '0%'}`}</span>
    </span>
    <span class="tb-verdict ${info.theirBest.verdict.css}">${info.theirBest.verdict.text}</span>
  </button>`;
}
function tbRenderThreats(m){
  const body = document.getElementById('tbAnalysisBody');
  const me = tbCombatant(m);
  const threats = tbThreatsFor(me);
  const weak = typeMatchupGroups(me.types);
  const weakTypes = [...weak[4], ...weak[2]];
  body.innerHTML = `
    <div class="tb-summary-box">
      <div><b>${threats.length}</b> Pokémon sur ${tbGetThreatPool().length} formes finales mettent ${me.name} K.O. en 2 coups au plus tout en gagnant l'échange (moins de coups que lui, ou autant mais plus rapides).</div>
      ${weakTypes.length ? `<div style="margin-top:6px;">Faiblesses de type : <span class="types-row" style="display:inline-flex;justify-content:flex-start;vertical-align:middle;">${weakTypes.map(t=>typeTagHTML(t)).join('')}</span></div>` : ''}
    </div>
    <div id="tbThreatList" style="margin-top:8px;">${threats.slice(0,40).map(i=>tbThreatRowHTML(i)).join('') || '<div class="tb-empty">Aucune menace sérieuse trouvée avec ce build.</div>'}</div>
    <div class="tb-note">Chaque adversaire est testé avec son set le plus joué en tournoi (à défaut, son premier set prédéfini). Clique sur une menace pour l'ouvrir dans le comparateur.</div>`;
  body.querySelectorAll('.tb-threat').forEach(btn=>{
    btn.onclick = ()=>{ tbSetFoe(tbEntryByKey(btn.dataset.key), 0); tbTab = 'compare'; tbRenderAnalysis(m); };
  });
}

/* ---------- Choix d'une espèce ---------- */
function tbOpenSpeciesPicker(onPick){
  const overlay = document.createElement('div');
  overlay.className = 'patchnotes-overlay';
  overlay.innerHTML = `
    <div class="patchnotes-modal" style="max-width:460px;position:relative;">
      <button class="patchnotes-close" id="tbPickClose">${phIcon('x')}</button>
      <h2>◆ CHOISIR UN POKÉMON ◆</h2>
      <input type="text" id="tbPickSearch" class="csel-search" placeholder="Rechercher un nom ou un type..." style="margin-bottom:8px;">
      <div id="tbPickList" class="tb-pick-list"></div>
    </div>`;
  document.body.appendChild(overlay);
  const close = ()=> overlay.remove();
  document.getElementById('tbPickClose').onclick = close;
  overlay.onclick = (e)=>{ if(e.target===overlay) close(); };
  const listEl = document.getElementById('tbPickList');
  const input = document.getElementById('tbPickSearch');
  const draw = ()=>{
    const q = tbNorm(input.value);
    const all = tbSpeciesList().filter(e=> !q || tbNorm(e.sp.name).includes(q) || tbNorm(I18N.name(e.sp.name)).includes(q) || e.sp.types.some(t=>tbNorm(typeDisplayName(t)).startsWith(q) || tbNorm(I18N.name(typeDisplayName(t))).startsWith(q)));
    listEl.innerHTML = '';
    all.slice(0,60).forEach(e=>{
      const btn = document.createElement('button');
      btn.className = 'tb-pick-row';
      btn.innerHTML = `${tbSpriteBox(e.sp.name, 34)}<span class="tb-ml-name">${e.sp.name}</span><span class="types-row" style="flex-shrink:0;">${e.sp.types.map(t=>typeTagHTML(t,{style:'font-size:8px;padding:2px 6px;'})).join('')}</span>`;
      btn.onclick = ()=>{ close(); onPick(e); };
      listEl.appendChild(btn);
    });
    if(all.length>60) listEl.insertAdjacentHTML('beforeend', `<div class="tb-note" style="text-align:center;">${all.length-60} autres résultats — précise ta recherche.</div>`);
    if(!all.length) listEl.innerHTML = `<div class="tb-empty">Aucun Pokémon trouvé.</div>`;
  };
  input.oninput = draw;
  draw();
  if(!cselIsTouch()) input.focus();
}

/* ---------- Résumé de l'équipe ---------- */
function tbOpenSummary(){
  const team = tbTeam();
  const combs = team.members.map(tbCombatant);
  const cards = team.members.map((m,i)=>{
    const c = combs[i], sp = tbSpreadText(m);
    return `<div class="tb-sum-card">
      <div style="display:flex;align-items:center;gap:10px;">
        ${tbSpriteBox(c.name, 56, m.shiny)}
        <div style="min-width:0;flex:1;">
          <div style="font-size:12px;font-weight:700;color:var(--text-main);">${c.name}${m.shiny?shinyBadgeHTML():''}</div>
          <div class="types-row" style="justify-content:flex-start;margin:3px 0;">${c.types.map(t=>typeTagHTML(t,{style:'font-size:8px;padding:2px 6px;'})).join('')}</div>
          <div class="tb-sum-line">${m.heldItem ? `${itemIconHTML(m.heldItem,14)} ${ITEMS[m.heldItem].name}` : 'Aucun objet'}</div>
        </div>
      </div>
      <div class="tb-sum-line"><b>Talent :</b> ${c.ability}</div>
      <div class="tb-sum-line"><b>Nature :</b> ${sp.nat}</div>
      <div class="tb-sum-line"><b>EV :</b> ${sp.evs}</div>
      <div class="tb-sum-line"><b>Téracristal :</b> ${typeDisplayName(m.teraType || c.types[0])}</div>
      <div class="tb-sum-stats">${TB_STATS.map(k=>`<span><i>${STAT_LABEL[k]}</i>${c.stats[k]}</span>`).join('')}</div>
      <div style="margin-top:6px;">${m.moves.filter(Boolean).map(id=>`<div class="tb-move-line">${typeTagHTML(MOVES[id].type,{style:'font-size:8px;padding:2px 6px;flex-shrink:0;'})}<span class="tb-ml-name">${MOVES[id].name}</span><span class="cat-chip cat-${MOVES[id].cat}">${MOVES[id].cat==='phys'?'Phys':MOVES[id].cat==='spec'?'Spéc':'Statut'}</span></div>`).join('') || '<div class="tb-sum-line">Aucune attaque</div>'}</div>
    </div>`;
  }).join('');
  // Couverture défensive : pour chaque type offensif, combien de membres sont faibles / résistants.
  const typeRows = Object.keys(TYPE_COLOR).map(t=>{
    let weak = 0, resist = 0;
    combs.forEach(c=>{ const mult = getMult(t, c.types); if(mult>1) weak++; else if(mult<1) resist++; });
    return { t, weak, resist };
  }).sort((a,b)=>(b.weak-b.resist)-(a.weak-a.resist));
  const typeHTML = typeRows.map(r=>`<div class="tb-type-row${r.weak>=3 && r.weak>r.resist ? ' bad' : ''}">${typeTagHTML(r.t,{style:'font-size:8px;padding:2px 6px;'})}<span style="color:var(--low);">${r.weak} faible${r.weak>1?'s':''}</span><span style="color:var(--good);">${r.resist} résiste${r.resist>1?'nt':''}</span></div>`).join('');
  // Menaces pour l'équipe : adversaires qui menacent le plus de membres à la fois.
  const tally = tbGetThreatPool().map(t=>{
    const hit = combs.map(c=>tbThreatInfo(c, t)).map((info,i)=> info ? { info, name:combs[i].name } : null).filter(Boolean);
    return { t, hit };
  }).filter(x=>x.hit.length>=Math.max(1, Math.ceil(combs.length/2))).sort((a,b)=> b.hit.length-a.hit.length || b.hit[0].info.score-a.hit[0].info.score).slice(0,12);
  const teamThreats = tally.map(x=>`<div class="tb-threat" style="cursor:default;">
      ${tbSpriteBox(x.t.comb.name, 36)}
      <span style="flex:1;min-width:0;text-align:left;">
        <span class="tb-threat-name">${x.t.comb.name}</span>
        <span class="tb-threat-sub">Menace ${x.hit.map(h=>h.name).join(', ')}</span>
      </span>
      <span class="tb-verdict tb-v-ko">${x.hit.length}/${combs.length}</span>
    </div>`).join('') || '<div class="tb-empty">Aucun adversaire ne menace la moitié de l\'équipe ou plus.</div>';
  const overlay = document.createElement('div');
  overlay.className = 'patchnotes-overlay';
  overlay.innerHTML = `
    <div class="patchnotes-modal" style="max-width:860px;position:relative;">
      <button class="patchnotes-close" id="tbSumClose">${phIcon('x')}</button>
      <h2>◆ ${tbEsc(team.name).toUpperCase()} ◆</h2>
      <div class="tb-sum-grid">${cards}</div>
      <div class="tb-grid" style="margin-top:14px;">
        <div><div class="editor-section-title">Couverture défensive de l'équipe</div><div class="tb-type-grid">${typeHTML}</div></div>
        <div><div class="editor-section-title">Menaces pour l'équipe</div>${teamThreats}</div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const close = ()=> overlay.remove();
  document.getElementById('tbSumClose').onclick = close;
  overlay.onclick = (e)=>{ if(e.target===overlay) close(); };
}

/* ---------- Import / Export Showdown ---------- */
const TB_SD_STAT = { hp:'HP', atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe' };
// EV du jeu (0-32, 66 au total) → EV Showdown (0-252 par pas de 4, 510 au total).
function tbRealEvs(evs){
  const out = {};
  TB_STATS.forEach(k=>{ const v = evs[k]||0; out[k] = v>=EV_MAX ? 252 : Math.round(v*252/EV_MAX/4)*4; });
  let total = TB_STATS.reduce((a,k)=>a+out[k],0);
  while(total>510){
    const k = TB_STATS.filter(s=>out[s]>0).sort((a,b)=>out[a]-out[b])[0];
    out[k] -= 4; total -= 4;
  }
  return out;
}
function tbExportMember(m){
  const sp = speciesOf(m);
  const lines = [];
  const name = SD_SPECIES[sp.name] || sp.name;
  const item = m.heldItem ? (SD_ITEMS[m.heldItem] || null) : null;   // objets sans équivalent Showdown (appareils Motisma) : omis
  lines.push(item ? `${name} @ ${item}` : name);
  const ability = m.ability || tbAbilities(m)[0];
  lines.push(`Ability: ${SD_ABILITIES[ability] || ability}`);
  lines.push('Level: 50');
  if(m.shiny) lines.push('Shiny: Yes');
  if(m.teraType && SD_TYPES[m.teraType]) lines.push(`Tera Type: ${SD_TYPES[m.teraType]}`);
  const evs = tbRealEvs(m.evs);
  const evTxt = TB_STATS.filter(k=>evs[k]>0).map(k=>`${evs[k]} ${TB_SD_STAT[k]}`).join(' / ');
  if(evTxt) lines.push(`EVs: ${evTxt}`);
  lines.push(`${SD_NATURES[m.nature.name] || 'Hardy'} Nature`);
  const ivTxt = TB_STATS.filter(k=>m.ivs[k]!==31).map(k=>`${m.ivs[k]} ${TB_SD_STAT[k]}`).join(' / ');
  if(ivTxt) lines.push(`IVs: ${ivTxt}`);
  m.moves.filter(Boolean).forEach(id=> lines.push(`- ${SD_MOVES[id] || MOVES[id].name}`));
  return lines.join('\n');
}
function tbExportTeam(){ return tbTeam().members.map(tbExportMember).join('\n\n'); }
// Index inversés (nom Showdown normalisé → donnée du jeu), construits au premier import.
let tbSdIndex = null;
function tbGetSdIndex(){
  if(tbSdIndex) return tbSdIndex;
  const species = {};
  tbSpeciesList().forEach(entry=>{
    const add = (name, formKey)=>{
      [SD_SPECIES[name], name].filter(Boolean).forEach(n=>{ const k = tbNorm(n); if(!species[k]) species[k] = { entry, formKey }; });
    };
    add(entry.sp.name, null);
    Object.keys(entry.sp.forms||{}).forEach(fk=> add(entry.sp.forms[fk].name, fk));
  });
  const rev = (map, keep)=>{ const o = {}; Object.keys(map).forEach(k=>{ if(!keep || keep(k)){ const n = tbNorm(map[k]); if(!o[n]) o[n] = k; } }); return o; };
  const abilities = {};
  Object.keys(SD_ABILITIES).forEach(fr=>{ const n = tbNorm(SD_ABILITIES[fr]); (abilities[n] = abilities[n] || []).push(fr); });
  tbSdIndex = {
    species, abilities,
    moves: rev(SD_MOVES, k=>!!MOVES[k]),
    items: rev(SD_ITEMS, k=>ITEMS[k] && ITEMS[k].kind==='held'),
    natures: rev(SD_NATURES),
    types: rev(SD_TYPES)
  };
  return tbSdIndex;
}
function tbParseStatLine(txt){
  const out = {};
  txt.split('/').forEach(part=>{
    const mm = part.trim().match(/^(\d+)\s+(\w+)$/);
    if(!mm) return;
    const key = Object.keys(TB_SD_STAT).find(k=>TB_SD_STAT[k].toLowerCase()===mm[2].toLowerCase());
    if(key) out[key] = parseInt(mm[1]);
  });
  return out;
}
// Lit un texte d'équipe au format Showdown. Renvoie les membres reconnus + la liste de ce qui a été ignoré.
function tbImportTeam(text){
  const idx = tbGetSdIndex();
  const members = [], warnings = [];
  text.replace(/\r/g,'').split(/\n\s*\n/).map(b=>b.trim()).filter(Boolean).forEach(block=>{
    const lines = block.split('\n').map(l=>l.trim()).filter(Boolean);
    if(!lines.length || /^===/.test(lines[0])){ lines.shift(); if(!lines.length) return; }
    let [left, itemTxt] = lines[0].split(' @ ');
    left = left.replace(/\s*\((M|F)\)\s*$/,'').trim();
    const paren = left.match(/\(([^()]+)\)\s*$/);
    const speciesTxt = paren ? paren[1] : left;
    const found = idx.species[tbNorm(speciesTxt)];
    if(!found){ warnings.push(`Pokémon inconnu du jeu : ${speciesTxt}`); return; }
    const m = tbBlankMember(found.entry);
    m.evs = {hp:0,atk:0,def:0,spa:0,spd:0,spe:0};
    let abilityTxt = null;
    if(itemTxt){
      const key = idx.items[tbNorm(itemTxt)];
      if(key) m.heldItem = key; else warnings.push(`${found.entry.sp.name} : objet ignoré (${itemTxt.trim()})`);
    }
    if(found.formKey && ITEMS[found.formKey]) m.heldItem = found.formKey;
    const moveTxts = [];
    lines.slice(1).forEach(l=>{
      let mm;
      if((mm = l.match(/^Ability:\s*(.+)$/i))) abilityTxt = mm[1];
      else if((mm = l.match(/^EVs:\s*(.+)$/i))) m.evs = convertRealEvs(tbParseStatLine(mm[1]));
      else if((mm = l.match(/^IVs:\s*(.+)$/i))){ const iv = tbParseStatLine(mm[1]); Object.keys(iv).forEach(k=>{ m.ivs[k] = Math.max(0, Math.min(31, iv[k])); }); }
      else if((mm = l.match(/^(\w+)\s+Nature$/i))){ const n = idx.natures[tbNorm(mm[1])]; if(n) m.nature = NATURES.find(x=>x.name===n) || m.nature; }
      else if((mm = l.match(/^Tera Type:\s*(.+)$/i))){ const t = idx.types[tbNorm(mm[1])]; if(t) m.teraType = t; }
      else if(/^Shiny:\s*Yes/i.test(l)) m.shiny = true;
      else if((mm = l.match(/^-\s*(.+)$/))) moveTxts.push(mm[1].split(' / ')[0].trim());
    });
    let over = TB_STATS.reduce((a,k)=>a+m.evs[k],0) - EV_TOTAL_MAX;
    while(over>0){ const k = TB_STATS.filter(s=>m.evs[s]>0).sort((a,b)=>m.evs[a]-m.evs[b])[0]; m.evs[k]--; over--; }
    if(abilityTxt){
      const cands = (idx.abilities[tbNorm(abilityTxt)] || []).filter(a=>tbAbilities(m).includes(a));
      if(cands.length) m.ability = cands[0]; else warnings.push(`${found.entry.sp.name} : talent ignoré (${abilityTxt.trim()})`);
    }
    tbFixAbility(m);
    const pool = movepoolFor(m);
    const moves = [];
    moveTxts.forEach(txt=>{
      let k = tbNorm(txt);
      if(k.startsWith('hiddenpower')) k = 'hiddenpower';
      const id = idx.moves[k];
      if(id && pool.includes(id) && !moves.includes(id)) moves.push(id);
      else warnings.push(`${found.entry.sp.name} : attaque ignorée (${txt})`);
    });
    m.moves = [0,1,2,3].map(i=>moves[i]||null);
    members.push(m);
  });
  if(members.length>TB_TEAM_SIZE){ warnings.push(`Seuls les ${TB_TEAM_SIZE} premiers Pokémon ont été gardés.`); members.length = TB_TEAM_SIZE; }
  return { members, warnings };
}
function tbOpenImportExport(){
  const team = tbTeam();
  const overlay = document.createElement('div');
  overlay.className = 'patchnotes-overlay';
  overlay.innerHTML = `
    <div class="patchnotes-modal" style="max-width:520px;position:relative;">
      <button class="patchnotes-close" id="tbIOClose">${phIcon('x')}</button>
      <h2>◆ IMPORT / EXPORT SHOWDOWN ◆</h2>
      <div class="tb-note" style="margin:0 0 8px;">Le texte ci-dessous est ton équipe au format Pokémon Showdown. Pour importer, colle une équipe Showdown à la place puis clique sur « Importer » : elle remplace « ${tbEsc(team.name)} ».</div>
      <textarea id="tbIOText" class="tb-textarea" spellcheck="false"></textarea>
      <div class="dex-rate" id="tbIOMsg" style="margin-top:8px;color:var(--good);"></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
        <button class="btn secondary tb-tool" id="tbIOCopy" style="flex:1;">${phIcon('copy')} Copier</button>
        <button class="btn tb-tool" id="tbIOImport" style="flex:1;">${phIcon('download-simple')} Importer</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const close = ()=> overlay.remove();
  document.getElementById('tbIOClose').onclick = close;
  overlay.onclick = (e)=>{ if(e.target===overlay) close(); };
  const ta = document.getElementById('tbIOText');
  const msg = document.getElementById('tbIOMsg');
  ta.value = tbExportTeam();
  document.getElementById('tbIOCopy').onclick = ()=>{
    ta.select();
    const done = ()=>{ msg.innerHTML = `${phIcon('check')} Équipe copiée dans le presse-papiers.`; };
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(done, ()=>{ document.execCommand('copy'); done(); });
    else { document.execCommand('copy'); done(); }
  };
  document.getElementById('tbIOImport').onclick = ()=>{
    const { members, warnings } = tbImportTeam(ta.value);
    if(!members.length){ msg.innerHTML = `<span style="color:var(--low);">Aucun Pokémon reconnu dans ce texte.</span>${warnings.length?'<br>'+warnings.map(tbEsc).join('<br>'):''}`; return; }
    team.members = members;
    tbSel = 0;
    tbSave(); tbRender();
    msg.innerHTML = `${phIcon('check')} ${members.length} Pokémon importé${members.length>1?'s':''}.${warnings.length ? `<br><span style="color:var(--text-dim);">${warnings.map(tbEsc).join('<br>')}</span>` : ''}`;
  };
}

document.getElementById('menuTeamBuilderBtn').onclick = openTeamBuilder;
document.getElementById('tbBackBtn').onclick = ()=> showScreen('screenMenu');
