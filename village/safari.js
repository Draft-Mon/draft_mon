/* ==== SOMMAIRE ====
   La Maison Safari du Campement (apparaît par chance, comme le Marchand Itinérant — voir
   SAFARI_SPAWN_RATE/safariPresent, tirage indépendant du Marchand dans village/village-core.js).
   Le joueur y reçoit 10 Safari Balls pour capturer des Pokémon sauvages un par un ; ils ne sont
   JAMAIS gardés (ni équipe ni PC) — le Professeur les récupère pour ses recherches et donne des
   Bonbons d'Affinité en échange (voir meta/affinity.js). Repères :
   - L.14-25 : SAFARI_TIERS — raretés propres au Safari (chance d'apparition/capture/bonbons)
   - L.27-fin(47): tirage d'une rencontre (safariTierOf/safariLinesByTier/rollSafariEncounter)
   - L.49-fin(60): safariFleeChance/safariCatchChance — modifiées par l'effet Caillou/Appât en cours
   - État transitoire (safariActive/safariBallsLeft/safariEncounter/safariEffect/safariOutcome/
     safariRunStats), remis à zéro à chaque nouvelle apparition du Safari (une seule visite par
     Campement — voir renderVillage dans village/village-core.js)
   - playSafariBallFx/playSafariItemFx/playSafariFleeFx : animations jouées dans #safariFxLayer
     (jet de Ball façon jeux officiels avec vacillement + capture/échec, impact du Caillou, rebond
     joyeux de l'Appât, fuite) avant que safariAction n'applique le résultat et ne ré-affiche l'écran
   - renderSafariPanel/safariAction : l'écran (intro → rencontre → issue → résumé final)
==== */
const SAFARI_SPAWN_RATE = 0.15;
// Raretés propres au Safari (différentes de celles du draft) : chance d'apparition de la rencontre,
// taux de capture de base, et Bonbons d'Affinité donnés par le Professeur en cas de capture. Vise
// ~8 bonbons en moyenne par visite, avec un vrai jackpot sur les rencontres rares.
const SAFARI_TIERS = [
  { key:'commun',     chance:0.70, catchRate:0.70, candy:1,  label:'Commun' },
  { key:'rare',       chance:0.20, catchRate:0.40, candy:3,  label:'Rare' },
  { key:'pseudo',     chance:0.07, catchRate:0.25, candy:5,  label:'Pseudo-légendaire' },
  { key:'legendaire', chance:0.03, catchRate:0.10, candy:10, label:'Légendaire' }
];
function safariTierOf(line){
  if(LEGENDARY_IDS.includes(line.id) || FABULEUX_IDS.includes(line.id)) return 'legendaire';
  if(PSEUDO_IDS.includes(line.id)) return 'pseudo';
  if(lineFinalBST(line)>=BST_RARE_THRESHOLD) return 'rare';
  return 'commun';
}
// Regroupe les lignées par catégorie de rareté du Safari, calculé une seule fois (LINES ne change jamais en cours de partie).
let SAFARI_LINES_BY_TIER = null;
function safariLinesByTier(){
  if(!SAFARI_LINES_BY_TIER){
    SAFARI_LINES_BY_TIER = { commun:[], rare:[], pseudo:[], legendaire:[] };
    LINES.forEach(l=> SAFARI_LINES_BY_TIER[safariTierOf(l)].push(l));
  }
  return SAFARI_LINES_BY_TIER;
}
// Tire une nouvelle rencontre : catégorie de rareté (SAFARI_TIERS), puis une lignée au hasard dedans,
// puis un stade/branche pondéré comme au draft (stageMultiplier — les stades précoces sortent plus souvent).
function rollSafariEncounter(){
  const r = Math.random();
  let acc = 0, tier = SAFARI_TIERS[SAFARI_TIERS.length-1];
  for(const t of SAFARI_TIERS){ acc += t.chance; if(r<acc){ tier = t; break; } }
  const pool = safariLinesByTier()[tier.key];
  const line = rand(pool.length ? pool : LINES);
  const entries = [
    ...line.stages.map((sp,i)=>({sp, stage:i, branch:null, w:stageMultiplier(i)})),
    ...(line.branches ? line.branches.filter(b=>b.draftable!==false).map((sp,bi)=>({sp, stage:null, branch:line.branches.indexOf(sp), w:stageMultiplier(line.stages.length-1)})) : [])
  ];
  const totalW = entries.reduce((a,e)=>a+e.w,0);
  let roll = Math.random()*totalW, chosen = entries[0];
  for(const e of entries){ roll -= e.w; if(roll<=0){ chosen = e; break; } }
  return { lineId:line.id, stage:chosen.stage, branch:chosen.branch, sp:chosen.sp, tier: tier.key };
}
// Chance de fuite de ce tour (≈ Vitesse de base / 4, en %), bonus pour les légendaires, modifiée par
// l'effet Caillou (×2) ou Appât (÷4) en cours.
function safariFleeChance(sp, tierKey){
  let c = (sp.base.spe/4)/100;
  if(tierKey==='legendaire') c += 0.15;
  if(safariEffect && safariEffect.type==='rock') c *= 2;
  else if(safariEffect && safariEffect.type==='bait') c /= 4;
  return Math.max(0.03, Math.min(0.75, c));
}
// Taux de capture de ce tour, modifié par l'effet Caillou (×2) ou Appât (÷2) en cours.
function safariCatchChance(tierKey){
  const tier = SAFARI_TIERS.find(t=>t.key===tierKey);
  let c = tier.catchRate;
  if(safariEffect && safariEffect.type==='rock') c *= 2;
  else if(safariEffect && safariEffect.type==='bait') c /= 2;
  return Math.max(0.02, Math.min(0.95, c));
}

// État transitoire d'une visite du Safari (remis à zéro à chaque nouvelle apparition, voir renderVillage).
let safariPresent = false;
let safariActive = false;
let safariBallsLeft = 0;
let safariEncounter = null; // rencontre en cours (rollSafariEncounter()), ou null entre deux rencontres
let safariEffect = null; // { type:'rock'|'bait', turnsLeft } en cours, ou null
let safariOutcome = null; // texte de la dernière action, affiché avant la rencontre suivante ou dans le résumé
let safariRunStats = null; // { captures, candy } de la visite en cours

// Décompte la durée de l'effet Caillou/Appât en cours d'un tour (appelé seulement si la rencontre continue).
function tickSafariEffect(){
  if(!safariEffect) return;
  safariEffect.turnsLeft--;
  if(safariEffect.turnsLeft<=0) safariEffect = null;
}
// Élément d'effet temporaire ajouté dans la zone du sprite (#safariFxLayer), retiré après sa durée (ms).
function spawnSafariFxEl(cls, ttl){
  const layer = document.getElementById('safariFxLayer');
  if(!layer) return null;
  const el = document.createElement('div');
  el.className = cls;
  layer.appendChild(el);
  setTimeout(()=> el.remove(), ttl);
  return el;
}
// Animation de lancer de Safari Ball façon jeux officiels : la Ball vole jusqu'au Pokémon, l'absorbe,
// tombe au sol et vacille — 3 fois si la capture réussit, 0 à 2 fois au hasard sinon (0 secousse = le
// Pokémon s'échappe tout de suite, davantage = on est passé près), avec un léger temps d'attente entre
// chaque secousse — puis éclate en étincelles (capture réussie) ou s'ouvre pour le laisser ressortir en
// rebondissant (échec) — `done` est appelé une fois l'animation terminée.
function playSafariBallFx(success, done){
  const sprite = document.getElementById('safariSpriteWrap');
  spawnSafariFxEl('safari-fx-ball safari-fx-ball-throw', 340);
  setTimeout(()=>{
    if(sprite) sprite.classList.add('safari-suck-in');
    const layer = document.getElementById('safariFxLayer');
    const ball = document.createElement('div');
    ball.className = 'safari-fx-ball safari-ball-land';
    if(layer) layer.appendChild(ball);
    const shakes = success ? 3 : Math.floor(Math.random()*3);
    const shakeDur = 260, shakeGap = 140;
    let i = 0;
    const nextShake = ()=>{
      if(i>=shakes){
        ball.remove();
        if(success){
          spawnSafariFxEl('safari-fx-sparkle', 650);
          setTimeout(done, 600);
        } else {
          if(sprite){
            sprite.classList.remove('safari-suck-in');
            sprite.classList.add('safari-pop-out');
            setTimeout(()=> sprite && sprite.classList.remove('safari-pop-out'), 460);
          }
          setTimeout(done, 300);
        }
        return;
      }
      ball.classList.remove('safari-ball-shake'); void ball.offsetWidth; ball.classList.add('safari-ball-shake');
      i++;
      setTimeout(nextShake, shakeDur + shakeGap);
    };
    setTimeout(nextShake, 150 + shakeGap);
  }, 320);
}
// Animation d'un Caillou (impact + agitation) ou d'un Appât (rebond joyeux + petits cœurs) lancé sur le Pokémon.
function playSafariItemFx(type, done){
  const sprite = document.getElementById('safariSpriteWrap');
  spawnSafariFxEl(type==='rock' ? 'safari-fx-rock' : 'safari-fx-berry', 340);
  setTimeout(()=>{
    if(sprite) sprite.classList.add(type==='rock' ? 'safari-shake' : 'safari-bounce-happy');
    if(type==='bait'){ for(let i=0;i<3;i++) setTimeout(()=> spawnSafariFxEl('safari-fx-heart safari-fx-heart-'+i, 700), i*90); }
    setTimeout(()=>{ if(sprite) sprite.classList.remove('safari-shake','safari-bounce-happy'); done(); }, 400);
  }, 320);
}
// Animation de fuite : le Pokémon détale sur le côté avec un petit nuage de poussière.
function playSafariFleeFx(done){
  const sprite = document.getElementById('safariSpriteWrap');
  if(sprite) sprite.classList.add('safari-flee-out');
  spawnSafariFxEl('safari-fx-dust', 500);
  setTimeout(done, 520);
}
// Résout une action du joueur face à la rencontre en cours (Ball/Caillou/Appât/Fuite) : joue d'abord
// l'animation correspondante, puis applique le résultat et ne ré-affiche l'écran qu'une fois terminée.
function safariAction(action){
  const enc = safariEncounter;
  if(!enc) return;
  if(action==='ball' && safariBallsLeft<=0) return;
  document.querySelectorAll('#villagePanelContent button').forEach(b=> b.disabled = true);
  const finish = ()=>{ saveGame(); renderSafariPanel(); };

  if(action==='flee'){
    playSafariFleeFx(()=>{
      safariOutcome = `Tu t'éloignes tranquillement de ${enc.sp.name}.`;
      safariEncounter = null; safariEffect = null;
      finish();
    });
  } else if(action==='rock' || action==='bait'){
    playSafariItemFx(action, ()=>{
      safariEffect = { type:action, turnsLeft: 1+Math.floor(Math.random()*5) };
      const reaction = action==='rock' ? `${enc.sp.name} a l'air agité !` : `${enc.sp.name} se calme...`;
      const fled = Math.random() < safariFleeChance(enc.sp, enc.tier);
      if(fled){
        playSafariFleeFx(()=>{
          safariOutcome = `Tu lances ${action==='rock'?'un Caillou':'un Appât'} ! ${reaction} ...et ${enc.sp.name} en profite pour s'enfuir !`;
          safariEncounter = null; safariEffect = null;
          finish();
        });
      } else {
        safariOutcome = `Tu lances ${action==='rock'?'un Caillou':'un Appât'} ! ${reaction}`;
        tickSafariEffect();
        finish();
      }
    });
  } else if(action==='ball'){
    safariBallsLeft--;
    const tier = SAFARI_TIERS.find(t=>t.key===enc.tier);
    const success = Math.random() < safariCatchChance(enc.tier);
    playSafariBallFx(success, ()=>{
      if(success){
        affinityCandy += tier.candy;
        saveAffinityProgress();
        refreshVillageMoney();
        safariRunStats.captures++;
        safariRunStats.candy += tier.candy;
        safariOutcome = `${phIcon('check')} ${enc.sp.name} capturé ! Confié au Professeur contre ${tier.candy} ${phIcon('cookie')} Bonbons d'Affinité.`;
        safariEncounter = null; safariEffect = null;
        finish();
      } else {
        const fled = Math.random() < safariFleeChance(enc.sp, enc.tier);
        if(fled){
          playSafariFleeFx(()=>{
            safariOutcome = `${enc.sp.name} évite la Safari Ball... et s'enfuit !`;
            safariEncounter = null; safariEffect = null;
            finish();
          });
        } else {
          safariOutcome = `${enc.sp.name} évite la Safari Ball !`;
          tickSafariEffect();
          finish();
        }
      }
    });
  }
}
// Affiche l'écran du Safari : intro (pas encore entré), rencontre active (4 actions), issue d'une
// rencontre (avant la suivante), ou résumé final une fois les 10 Balls épuisées.
function renderSafariPanel(){
  const wrap = document.getElementById('villagePanelContent');
  if(!safariActive){
    wrap.innerHTML = `
      <div style="background:var(--bg-card);border:1px solid var(--line);border-radius:4px;padding:14px;text-align:center;">
        <div style="font-size:32px;margin-bottom:8px;">${phIcon('leaf')}</div>
        <h2 style="margin:0 0 8px;">Maison Safari</h2>
        <div style="font-size:11px;color:var(--text-dim);line-height:1.6;margin-bottom:14px;">Le Professeur t'accueille : « J'étudie les Pokémon sauvages de cette zone. Capture-en pour moi avec ces Safari Balls, je te donnerai des Bonbons d'Affinité en échange — je ne peux malheureusement pas te laisser les garder, ils doivent rester ici pour mes recherches. Si tu préfères, je peux aussi t'en investir directement sur les lignées qui te tiennent à cœur. »</div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          <button class="btn" id="safariEnterBtn">▶ Entrer avec 10 Safari Balls</button>
          <button class="btn secondary" id="safariProfessorBtn">${phIcon('flask')} Voir le Professeur (${affinityCandy} ${phIcon('cookie')})</button>
        </div>
      </div>`;
    document.getElementById('safariEnterBtn').onclick = ()=>{
      safariActive = true;
      safariBallsLeft = 10;
      safariRunStats = { captures:0, candy:0 };
      safariEffect = null;
      safariOutcome = null;
      safariEncounter = rollSafariEncounter();
      saveGame();
      renderSafariPanel();
    };
    document.getElementById('safariProfessorBtn').onclick = ()=> renderProfessorPanel();
    return;
  }
  if(!safariEncounter && safariBallsLeft<=0){
    wrap.innerHTML = `
      <div style="background:var(--bg-card);border:1px solid var(--line);border-radius:4px;padding:14px;text-align:center;">
        <div style="font-size:32px;margin-bottom:8px;">${phIcon('flask')}</div>
        <h2 style="margin:0 0 8px;">Safari terminé !</h2>
        ${safariOutcome ? `<div style="font-size:11px;color:var(--text-dim);margin-bottom:10px;">${safariOutcome}</div>` : ''}
        <div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Le Professeur remercie chaleureusement les ${safariRunStats.captures} Pokémon confiés pour ses recherches.</div>
        <div style="font-size:14px;color:var(--accent);margin-bottom:14px;">+${safariRunStats.candy} ${phIcon('cookie')} Bonbons d'Affinité au total</div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          <button class="btn" id="safariProfessorBtn">${phIcon('flask')} Investir chez le Professeur</button>
          <button class="btn secondary" id="safariCloseBtn">Fermer</button>
        </div>
      </div>`;
    document.getElementById('safariProfessorBtn').onclick = ()=> renderProfessorPanel();
    document.getElementById('safariCloseBtn').onclick = ()=>{ document.getElementById('villagePanelContent').innerHTML=''; };
    return;
  }
  if(!safariEncounter){
    wrap.innerHTML = `
      <div style="background:var(--bg-card);border:1px solid var(--line);border-radius:4px;padding:14px;text-align:center;">
        <div style="font-size:32px;margin-bottom:8px;">${phIcon('leaf')}</div>
        <div style="font-size:11px;color:var(--text-dim);margin-bottom:14px;">${safariOutcome||''}</div>
        <div style="font-size:10px;color:var(--text-dim);margin-bottom:10px;">${phIcon('circle')} Safari Balls restantes : <b style="color:var(--text-main);">${safariBallsLeft}</b></div>
        <button class="btn" id="safariNextBtn">Chercher un autre Pokémon →</button>
        <button class="btn secondary" id="safariLeaveBtn" style="margin-top:8px;">Quitter le Safari</button>
      </div>`;
    document.getElementById('safariNextBtn').onclick = ()=>{
      safariEncounter = rollSafariEncounter();
      safariEffect = null; safariOutcome = null;
      saveGame();
      renderSafariPanel();
    };
    document.getElementById('safariLeaveBtn').onclick = ()=>{ document.getElementById('villagePanelContent').innerHTML=''; };
    return;
  }
  const enc = safariEncounter;
  const tier = SAFARI_TIERS.find(t=>t.key===enc.tier);
  const rarityCss = enc.tier==='legendaire' ? 'rarity-legendaire' : enc.tier==='pseudo' ? 'rarity-pseudo' : enc.tier==='rare' ? 'rarity-rare' : 'rarity-commun';
  const catchPct = Math.round(safariCatchChance(enc.tier)*100);
  const fleePct = Math.round(safariFleeChance(enc.sp, enc.tier)*100);
  wrap.innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--line);border-radius:4px;padding:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:10px;color:var(--text-dim);">
        <span>${phIcon('circle')} Safari Balls : <b style="color:var(--text-main);">${safariBallsLeft}</b></span>
        <span class="rarity-badge ${rarityCss}">${tier.label}</span>
      </div>
      <div style="text-align:center;position:relative;">
        <div id="safariFxLayer" style="position:absolute;left:50%;top:0;width:96px;height:96px;transform:translateX(-50%);pointer-events:none;overflow:visible;z-index:5;"></div>
        <div id="safariSpriteWrap" style="width:96px;height:96px;margin:0 auto;position:relative;">${getSpriteHTML(enc.sp.name, null, 'front', true)}</div>
        <div style="font-size:14px;font-weight:700;margin:6px 0 2px;">${enc.sp.name}</div>
        <div class="types-row" style="justify-content:center;">${enc.sp.types.map(t=>typeTagHTML(t)).join('')}</div>
      </div>
      ${safariEffect ? `<div style="text-align:center;font-size:10px;color:var(--accent);margin:8px 0;">${safariEffect.type==='rock'?phIcon('mountains')+' Excité par le Caillou':phIcon('gift')+" Calmé par l'Appât"} (encore ${safariEffect.turnsLeft} tour${safariEffect.turnsLeft>1?'s':''})</div>` : ''}
      <div style="font-size:9px;color:var(--text-dim);text-align:center;margin:8px 0;">Capture ≈ ${catchPct}% · Fuite ≈ ${fleePct}%</div>
      ${safariOutcome ? `<div class="dex-rate" style="text-align:center;margin-bottom:8px;">${safariOutcome}</div>` : ''}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px;">
        <button class="btn secondary" id="safariBallBtn" ${safariBallsLeft<=0?'disabled':''}>${phIcon('circle')} Safari Ball</button>
        <button class="btn secondary" id="safariRockBtn">${phIcon('mountains')} Caillou</button>
        <button class="btn secondary" id="safariBaitBtn">${phIcon('gift')} Appât</button>
        <button class="btn secondary" id="safariFleeBtn">${phIcon('person-simple-run')} Fuite</button>
      </div>
    </div>`;
  document.getElementById('safariBallBtn').onclick = ()=> safariAction('ball');
  document.getElementById('safariRockBtn').onclick = ()=> safariAction('rock');
  document.getElementById('safariBaitBtn').onclick = ()=> safariAction('bait');
  document.getElementById('safariFleeBtn').onclick = ()=> safariAction('flee');
}

/* ---- Le Professeur : investit les Bonbons d'Affinité dans la lignée de son choix (tout le Pokédex,
   avec recherche/filtre) — accessible depuis l'écran d'accueil du Safari et depuis son résumé final. ---- */
let professorFilter = { search:'', rarity:'' };
function professorRarityKey(lineId){
  if(LEGENDARY_IDS.includes(lineId) || FABULEUX_IDS.includes(lineId)) return 'legendaire';
  if(PSEUDO_IDS.includes(lineId)) return 'pseudo';
  if(lineFinalBST(lineOf(lineId))>=BST_RARE_THRESHOLD) return 'rare';
  return 'commun';
}
const PROFESSOR_RARITY_LABEL = { legendaire:'Légendaire', pseudo:'Pseudo-légendaire', rare:'Rare', commun:'Commun' };
const PROFESSOR_RARITY_CSS = { legendaire:'rarity-legendaire', pseudo:'rarity-pseudo', rare:'rarity-rare', commun:'rarity-commun' };
// Étiquette d'une lignée entière (chaîne complète + nombre de formes à embranchement, ex. Évoli).
function professorLineLabel(line){
  const chain = line.stages.map(s=>s.name).join(' → ');
  return (line.branches && line.branches.length) ? `${chain} (+${line.branches.length} forme${line.branches.length>1?'s':''})` : chain;
}
function professorRowHTML(line){
  const key = professorRarityKey(line.id);
  const cost = affinityNextCost(line.id);
  const progress = affinityProgressFor(line.id);
  const lastStage = line.stages[line.stages.length-1];
  const disabled = affinityCandy<1 || !cost;
  return `<div style="display:flex;align-items:center;gap:10px;padding:8px;background:#140F0A;border:1px solid var(--line);border-radius:3px;">
    <div style="width:36px;height:36px;flex-shrink:0;">${getSpriteHTML(lastStage.name, null)}</div>
    <div style="flex:1;min-width:0;">
      <div style="font-size:10px;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"><b>${professorLineLabel(line)}</b></div>
      <div style="display:flex;align-items:center;gap:6px;margin-top:2px;">
        <span class="rarity-badge ${PROFESSOR_RARITY_CSS[key]}" style="margin:0;">${PROFESSOR_RARITY_LABEL[key]}</span>
        ${dexAffinityPipsHTML(line.id, 10)}
      </div>
      ${cost ? `
        <div class="stat-bar-track" style="height:5px;margin-top:4px;"><div class="stat-bar-fill" style="width:${Math.min(100,Math.round(progress/cost*100))}%;background:var(--accent);"></div></div>
        <div style="font-size:8px;color:var(--text-dim);margin-top:2px;">${progress} / ${cost} ${phIcon('cookie')}</div>
      ` : `<div style="font-size:8px;color:var(--good);margin-top:4px;">${phIcon('check')} Niveau maximum</div>`}
    </div>
    ${cost ? `
      <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;">
        <button class="btn secondary professorInvestBtn" data-line="${line.id}" data-amount="1" style="width:auto;min-height:0;padding:5px 8px;font-size:9px;" ${disabled?'disabled':''}>+1 ${phIcon('cookie')}</button>
        <button class="btn secondary professorInvestBtn" data-line="${line.id}" data-amount="max" style="width:auto;min-height:0;padding:5px 8px;font-size:9px;" ${disabled?'disabled':''}>Max</button>
      </div>` : ''}
  </div>`;
}
// Affiche l'écran du Professeur : recherche/filtre par rareté, puis la liste investissable.
function renderProfessorPanel(){
  const wrap = document.getElementById('villagePanelContent');
  wrap.innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--line);border-radius:4px;padding:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <button class="btn secondary" id="professorBackBtn" style="width:auto;min-height:0;padding:6px 10px;font-size:10px;">← Retour</button>
        <div id="professorBalance" style="font-size:12px;color:var(--accent);font-weight:700;">${phIcon('cookie')} ${affinityCandy}</div>
      </div>
      <div style="font-size:10px;color:var(--text-dim);text-align:center;margin-bottom:10px;line-height:1.5;">« Investis tes Bonbons d'Affinité dans les lignées que tu apprécies : plus leur niveau monte, plus tu as de chances de les croiser au draft, au Ranch et parmi les recrues. »</div>
      <div style="display:flex;gap:6px;margin-bottom:10px;">
        <input type="text" id="professorSearch" placeholder="Rechercher une lignée..." value="${professorFilter.search}" style="flex:1;min-width:0;background:#140F0A;border:1px solid var(--line-bright);color:var(--text-main);border-radius:3px;padding:6px 10px;font-family:inherit;font-size:11px;">
        <div id="professorRarityFilter" style="width:150px;flex-shrink:0;"></div>
      </div>
      <div id="professorList" style="display:flex;flex-direction:column;gap:6px;max-height:360px;overflow-y:auto;"></div>
    </div>`;
  document.getElementById('professorBackBtn').onclick = ()=> renderSafariPanel();
  document.getElementById('professorSearch').oninput = (e)=>{ professorFilter.search = e.target.value; renderProfessorList(); };
  document.getElementById('professorRarityFilter').appendChild(createCustomSelect({
    options: [
      {value:'', label:'Toutes raretés'},
      {value:'commun', label:'Commun', css:'rarity-commun'},
      {value:'rare', label:'Rare', css:'rarity-rare'},
      {value:'pseudo', label:'Pseudo-légendaire', css:'rarity-pseudo'},
      {value:'legendaire', label:'Légendaire', css:'rarity-legendaire'}
    ].map(o=> o.value ? {...o, html: rarityOptionHTML(o.css, o.label)} : o),
    value: professorFilter.rarity,
    onChange: (val)=>{ professorFilter.rarity = val; renderProfessorList(); }
  }));
  renderProfessorList();
}
// Reconstruit seulement la liste (recherche/filtre/investissement), sans re-créer la barre de recherche.
function renderProfessorList(){
  const list = document.getElementById('professorList');
  if(!list) return;
  const q = professorFilter.search.trim().toLowerCase();
  const filtered = LINES.filter(line=>{
    if(q && !(professorLineLabel(line)+' '+line.stages.map(s=>I18N.name(s.name)).join(' ')).toLowerCase().includes(q)) return false;
    if(professorFilter.rarity && professorRarityKey(line.id)!==professorFilter.rarity) return false;
    return true;
  });
  list.innerHTML = filtered.length ? filtered.map(professorRowHTML).join('') : `<div class="dex-rate" style="text-align:center;">Aucune lignée ne correspond.</div>`;
  list.querySelectorAll('.professorInvestBtn').forEach(btn=>{
    btn.onclick = ()=>{
      const lineId = btn.dataset.line;
      const cost = affinityNextCost(lineId);
      const amount = btn.dataset.amount==='max' ? Math.max(1, cost - affinityProgressFor(lineId)) : 1;
      investAffinityCandy(lineId, amount);
      renderProfessorList();
      const balanceEl = document.getElementById('professorBalance');
      if(balanceEl) balanceEl.innerHTML = `${phIcon('cookie')} ${affinityCandy}`;
      refreshVillageMoney();
    };
  });
}

document.getElementById('villageSafariBtn').onclick = ()=>{ renderSafariPanel(); };
