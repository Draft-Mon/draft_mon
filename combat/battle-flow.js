/* ==== SOMMAIRE ====
   Le moteur de combat : déroulement d'un combat du début (startBattle) à la fin d'un tour
   (endTurn), en solo ou en double. Repères (lignes approximatives) :
   - L.11-35  : resetBattleFields — remet à zéro l'état de combat d'un Pokémon (changement/K.O.)
   - L.36-57  : renderTrainerBanner — bandeau dresseur(s) en haut de l'écran de combat
   - L.59-98  : slots et helpers du combat double (qui est actif, qui est vivant, quelle boîte DOM)
   - L.100-166: startBattle — initialise un combat complet (équipes, dresseur, intros/Intimidation)
   - L.168-213: boucle de sélection des actions du joueur (1 ou 2 Pokémon selon solo/double)
   - L.215-247: playerAttack — le joueur choisit une attaque (gère Capacité Z / Dynamax)
   - L.249-284: tri et exécution de la file d'actions du tour (priorité puis vitesse)
   - L.286-310: doVoluntarySwitch — changement de Pokémon volontaire en combat
   - L.312-324: useBagPotion — utiliser une Potion sur un Pokémon en combat
   - L.326-367: checkStatusBeforeMove — le Pokémon peut-il agir ce tour (gel/sommeil/paralysie/confusion) ?
   - L.369-987: runStep — LE cœur du moteur, résout une attaque complète du début à la fin (voir
     la liste des cas gérés juste au-dessus de la fonction)
   - L.989-1130: endTurn — dégâts/soins de fin de tour + décompte de tous les effets à durée
     (écrans, entrave, Rune Protect, Provoc, Dynamax, compte à rebours, météo, terrain...)
   - L.1132-1159: handleFaintsAndAdvance — que faire après un K.O. (victoire/défaite/remplacement)
   - L.1161-1187: replaceFoeSlot — l'IA envoie son prochain Pokémon après un K.O. adverse
   - L.1189-fin : showSwitchPrompt — écran de choix du prochain Pokémon après un K.O. du joueur
==== */
const FREEZE_MAX_TURNS = 3;
function freshBattleFields(){
  return { stages:{atk:0,def:0,spa:0,spd:0,spe:0,acc:0,eva:0}, status:null, sleepCounter:0, confuseCounter:0, flinched:false, protectChain:0 };
}
// Réinitialise l'état de combat d'un Pokémon (stages, statut temporaire, entrave, Dynamax...) : appelé au changement de Pokémon ou en fin de combat.
function resetBattleFields(c){
  if(c.dynamaxed){
    revertDynamaxBoost(c);
    c.dynamaxed = false;
    c.dynamaxTurns = 0;
  }
  c.stages = {atk:0,def:0,spa:0,spd:0,spe:0,acc:0};
  c.confuseCounter = 0;
  c.flinched = false;
  c.lockedMove = null;
  c.protectChain = 0;
  c.chargingMove = null;
  c.chargingTarget = null;
  c.invulnType = null;
  c.trapped = false;
  c.infested = false;
  c.punishOnContact = false;
  c.forcedMove = null;
  c.disguiseBroken = false;
  c.schoolBroken = false;
  c.shieldsBroken = false;
  c.boosterEnergyActive = false;
  restoreStashedItem(c);
  if(c.roosted){ c.transformedTypes = c.roostTypes || null; c.roosted = false; }
  if(c.transformed){
    c.name = c.origName;
    c.unownForm = c.origUnownForm;
    c.ability = c.origAbility;
    c.stats = c.origStats;
    c[c.origMovesKey] = c.origMovesList;
    c.ppCur = c.origPpCur;
    c.transformed = false;
    c.origName = c.origUnownForm = c.origAbility = c.origStats = c.origMovesKey = c.origMovesList = c.origPpCur = null;
  }
  c.substitute = 0; c.helped = false; c.aquaRing = false; c.magnetRise = 0; c.telekinesis = 0; c.healBlock = 0; c.embargoTurns = 0;
  c.smackDown = false; c.miracleEyed = false; c.electrified = false; c.powdered = false; c.quickGuard = false; c.wideGuard = false;
  c.hitsTaken = 0; c.usedMoveNames = null; c.protectPunish = null;
  c.mustRecharge = false;
  c.contMove = null;
  c.contTurns = 0;
  c.bideStored = 0;
  c.streak = 0;
  c.streakMove = null;
  c.actedTurns = 0;
  c.hitThisTurn = false;
  c.hitPhysThisTurn = false;
  c.throatChop = 0;
  c.infatuated = false;
  c.encoreTurns = 0;
  c.tormented = false;
  c.foresighted = false;
  c.destinyBond = false;
  c.grudge = false;
  c.magicCoat = false;
  c.imprisoning = false;
  c.snatching = false;
  c.nightmare = false;
  c.freezeTurns = c.status==='gel' ? c.freezeTurns : 0;
  if(!c.teraActive) c.transformedTypes = null;
}
// Couleur "arène classique" (ambre chaud neutre) utilisée pour un dresseur normal.
const CLASSIC_ARENA_RGB = '219,163,74';
function hexToRgbString(hex){
  return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)).join(',');
}
// Thème l'arène de combat : ambre classique pour un dresseur normal, ou couleur officielle du
// type du Maître de Type affronté (pour donner plus de vie à la Tour) — utilisée telle quelle,
// sans mélange, pour que ex. un Maître Normal donne une arène neutre/grise et non colorée.
function applyArenaTheme(trainer){
  const el = document.getElementById('screenBattle');
  if(!el) return;
  if(trainer && trainer.boss && trainer.masterType && TYPE_COLOR[trainer.masterType]){
    el.style.setProperty('--arena-rgb', hexToRgbString(TYPE_COLOR[trainer.masterType]));
  } else {
    el.style.setProperty('--arena-rgb', CLASSIC_ARENA_RGB);
  }
}
// Affiche le bandeau du/des dresseur(s) adverse(s) (avatar + dialogue) en haut de l'écran de combat.
function renderTrainerBanner(trainer, trainer2){
  applyArenaTheme(trainer2 ? null : trainer);
  const bannerEl = document.getElementById('trainerBanner');
  if(trainer2){
    bannerEl.className = 'trainer-banner twin-banner';
    bannerEl.innerHTML = [trainer, trainer2].map(t => `
      <div class="trainer-info-pair">
        <div class="trainer-avatar">${getTrainerAvatarHTML(t)}</div>
        <div class="trainer-info">
          <div class="trainer-name">${t.name}</div>
          <div class="trainer-quote">"${t.dialogue}"</div>
        </div>
      </div>`).join('');
    return;
  }
  bannerEl.className = 'trainer-banner' + (trainer.boss?' boss':(trainer.miniBoss?' miniboss':''));
  bannerEl.innerHTML = `
    <div class="trainer-avatar">${getTrainerAvatarHTML(trainer)}</div>
    <div class="trainer-info">
      <div class="trainer-name">${trainer.name}</div>
      <div class="trainer-quote">"${trainer.dialogue}"</div>
    </div>`;
}

/* =================== Combat double : slots et helpers =================== */
function playerSlotIdx(slot){
  const bs = battleState;
  return slot==='B' ? bs.pActive2 : bs.pActive;
}
function alivePlayerCombatants(){
  const bs = battleState;
  const list = [];
  if(bs.pActive!=null && bs.player[bs.pActive] && bs.player[bs.pActive].hp>0) list.push(bs.player[bs.pActive]);
  if(bs.isDouble && bs.pActive2!=null && bs.player[bs.pActive2] && bs.player[bs.pActive2].hp>0) list.push(bs.player[bs.pActive2]);
  return list;
}
function aliveFoeCombatants(){
  const bs = battleState;
  const list = [];
  if(bs.fActive!=null && bs.foe[bs.fActive] && bs.foe[bs.fActive].hp>0) list.push(bs.foe[bs.fActive]);
  if(bs.isDouble && bs.fActive2!=null && bs.foe[bs.fActive2] && bs.foe[bs.fActive2].hp>0) list.push(bs.foe[bs.fActive2]);
  return list;
}
function allFainted(team){ return team.every(c=>c.hp<=0); }
function locateActiveSlot(combatant){
  const bs = battleState;
  if(!bs) return null;
  if(combatant===bs.player[bs.pActive]) return {side:'player', slot:'A'};
  if(bs.isDouble && bs.pActive2!=null && combatant===bs.player[bs.pActive2]) return {side:'player', slot:'B'};
  if(combatant===bs.foe[bs.fActive]) return {side:'foe', slot:'A'};
  if(bs.isDouble && bs.fActive2!=null && combatant===bs.foe[bs.fActive2]) return {side:'foe', slot:'B'};
  return null;
}
function setActiveSlot(side, slot, newIdx){
  const bs = battleState;
  if(side==='player'){ if(slot==='A') bs.pActive=newIdx; else bs.pActive2=newIdx; return bs.player[newIdx]; }
  if(slot==='A') bs.fActive=newIdx; else bs.fActive2=newIdx; return bs.foe[newIdx];
}
function boxIdFor(combatant){
  const loc = locateActiveSlot(combatant);
  if(!loc) return 'foeBox';
  if(loc.side==='player') return loc.slot==='A' ? 'playerBox' : 'player2Box';
  return loc.slot==='A' ? 'foeBox' : 'foe2Box';
}

// Initialise un nouveau combat : détermine l'adversaire (dresseur normal/mini-boss/boss/jumeaux,
// ou combat forcé du mode développeur), construit les deux équipes, affiche l'écran de combat et
// déclenche les effets d'entrée (Intimidation, météo/terrain auto).
function startBattle(){
  let isDouble, trainer, trainer2, enemyTeam;
  const forcedEncounter = window.DEV_HOOKS ? window.DEV_HOOKS.takeEncounter() : null;
  if(forcedEncounter){
    ({ trainer, trainer2, isDouble, enemyTeam } = forcedEncounter);
  } else if(isTwinFloor(towerFloor)){
    isDouble = true;
    const twins = generateTwinTrainers(towerFloor);
    trainer = twins[0]; trainer2 = twins[1];
    enemyTeam = [...generateEnemyTeam(towerFloor, trainer.theme, false, 3), ...generateEnemyTeam(towerFloor, trainer2.theme, false, 3)];
  } else {
    isDouble = false;
    trainer = generateTrainer(towerFloor);
    trainer2 = null;
    enemyTeam = generateEnemyTeam(towerFloor, trainer.theme, trainer.boss);
  }
  const playerRoster = team.map(m=>{
    const sp = speciesOf(m);
    const maxHp = m.computedStats.hp;
    const hardMode = difficulty==='difficile';
    const hp = m.eventBlocked ? 0 : ((hardMode && typeof m.hp==='number') ? m.hp : maxHp);
    const status = hardMode ? (m.status||null) : null;
    const sleepCounter = hardMode ? (m.sleepCounter||0) : 0;
    // Forme Méga-Évolution disponible ce combat, si le porteur tient la bonne Méga-Gemme : precalculée ici
    // (nom/types/talent/stats), déclenchée en combat via activateMegaEvolve (voir combat/megaevolution.js).
    // L'affichage hors combat reste sous la forme normale (speciesOf ignore les Méga-Gemmes, voir helpers.js).
    const megaForm = sp.forms && m.heldItem && sp.forms[m.heldItem];
    const megaFormData = megaForm ? { name: megaForm.name, types: megaForm.types, abilities: megaForm.abilities } : null;
    const megaStats = megaForm ? calcStats(megaForm.base, m.ivs, m.evs, m.nature) : null;
    return {
      lineId:m.lineId, name:sp.name, types:sp.types, unownForm:m.unownForm, shiny:!!m.shiny, moves:m.moves.map(mid=>MOVES[mid]), ppCur: m.moves.map(mid=>basePP(MOVES[mid])),
      ability: m.ability || (sp.abilities||lineOf(m.lineId).abilities)[0],
      heldItem: m.heldItem || null, itemUsed:false, teraType: m.teraType || sp.types[0],
      stats:m.computedStats, ivs:m.ivs, maxHp, hp,
      megaFormData, megaStats, megaEvolved:false,
      stages:{atk:0,def:0,spa:0,spd:0,spe:0,acc:0,eva:0}, status, sleepCounter, confuseCounter:0, flinched:false, protectChain:0
    };
  });
  team.forEach(m=>{ m.eventBlocked = false; });

  const aliveIdxs = playerRoster.map((c,i)=>c.hp>0?i:-1).filter(i=>i>=0);
  if(aliveIdxs.length===0){
    document.getElementById('screenTower').classList.add('hidden');
    gameOver();
    return;
  }

  battleState = {
    player: playerRoster, foe: enemyTeam,
    pActive: aliveIdxs[0], pActive2: (isDouble && aliveIdxs.length>1) ? aliveIdxs[1] : null,
    fActive: 0, fActive2: (isDouble && enemyTeam.length>1) ? 1 : null,
    locked:false, trainer, trainer2, isDouble: !!isDouble, weather:null, terrain:null, hazards: freshHazards(), pledgeFx: freshPledgeFx(),
    pendingActions: [], selectingSlot: 'A', zMoveUsed:false, declaringZMove:false, dynamaxUsed:false, declaringDynamax:false, teraUsed:false, declaringTera:false, megaUsed:false, declaringMega:false
  };
  battleInProgress = true;
  document.getElementById('screenTower').classList.add('hidden');
  document.getElementById('screenBattle').classList.remove('hidden');
  renderTrainerBanner(trainer, trainer2);
  clearLog();
  const bs = battleState;
  const pLead = playerRoster[bs.pActive], fLead = enemyTeam[0];
  let intimMsg = triggerIntimidate(fLead, pLead) + triggerIntimidate(pLead, fLead) + triggerSwitchInAbilities(fLead, pLead) + triggerSwitchInAbilities(pLead, fLead);
  let introName = fLead.name;
  if(bs.isDouble && bs.pActive2!=null){
    const pLead2 = playerRoster[bs.pActive2], fLead2 = enemyTeam[1];
    intimMsg += triggerIntimidate(fLead2, pLead2) + triggerIntimidate(pLead2, fLead2) + triggerSwitchInAbilities(fLead2, pLead2) + triggerSwitchInAbilities(pLead2, fLead2);
    introName = `${fLead.name} et ${enemyTeam[1].name}`;
  } else if(bs.isDouble){
    introName = `${fLead.name} et ${enemyTeam[1].name}`;
  }
  setLog(`<b>Étage ${towerFloor}</b> — l'adversaire envoie ${introName} !${intimMsg}`);
  renderBattle();
  beginPlayerTurn();
}

/* =================== Tour de jeu (solo et double, moteur unifié) =================== */
// Démarre un nouveau tour côté joueur : vide la file d'actions et lance la sélection du slot A.
function beginPlayerTurn(){
  const bs = battleState;
  bs.pendingActions = [];
  bs.locked = false;
  startSlotSelection('A');
}
// Demande son action au Pokémon du slot donné (A ou B) : passe automatiquement si K.O./coup à
// charge en cours, sinon affiche la grille de capacités.
function startSlotSelection(slot){
  const bs = battleState;
  const idx = playerSlotIdx(slot);
  if(idx==null || bs.player[idx].hp<=0){
    advanceAfterSlot(slot);
    return;
  }
  const p = bs.player[idx];
  if(p.mustRecharge){
    bs.pendingActions.push({ actor:p, move:p.moves[0], target: aliveFoeCombatants()[0] || null, isPlayer:true, slot });
    advanceAfterSlot(slot);
    return;
  }
  if(p.contMove && (p.contTurns>0 || p.contMove.bide)){
    const target = aliveFoeCombatants()[0] || null;
    bs.pendingActions.push({ actor:p, move:p.contMove, target, isPlayer:true, slot });
    advanceAfterSlot(slot);
    return;
  }
  if(p.chargingMove){
    const target = (p.chargingTarget && p.chargingTarget.hp>0) ? p.chargingTarget : aliveFoeCombatants()[0];
    bs.pendingActions.push({ actor:p, move:p.chargingMove, target, isPlayer:true, slot });
    advanceAfterSlot(slot);
    return;
  }
  bs.selectingSlot = slot;
  bs.locked = false;
  renderMoveGrid();
}
// Après le choix du slot A, passe au slot B en combat double (s'il est vivant), sinon termine le tour.
function advanceAfterSlot(slot){
  const bs = battleState;
  const bIdx = playerSlotIdx('B');
  if(slot==='A' && bs.isDouble && bIdx!=null && bs.player[bIdx].hp>0){
    startSlotSelection('B');
  } else {
    finalizeTurn();
  }
}
// Une fois les actions du joueur choisies : fait choisir l'IA adverse (chooseFoeMove) puis lance la résolution du tour complet.
function finalizeTurn(){
  const bs = battleState;
  bs.locked = true;
  const level = foeAiLevel(bs);
  // IA avancée : l'adversaire peut rappeler son Pokémon avant que le tour ne se joue (changement prioritaire).
  // Changer de Pokémon est une action complète, comme pour le joueur (voir doVoluntarySwitch) : le
  // remplaçant n'attaque pas ce tour-ci, seules les actions déjà choisies par le joueur sont résolues.
  const switchIdx = foeConsiderSwitch(level);
  if(switchIdx>=0){
    foeVoluntarySwitch(switchIdx, ()=> resolveTurn([...bs.pendingActions]));
    return;
  }
  runFoeDecisions(level);
}
// Fait choisir leur coup aux adversaires encore debout puis résout le tour complet.
function runFoeDecisions(level){
  const bs = battleState;
  const targets = alivePlayerCombatants();
  const foes = aliveFoeCombatants();
  const excellent = !!((bs.trainer && bs.trainer.boss) || (bs.trainer2 && bs.trainer2.boss));
  const foeActions = foes.map(f=>{
    const { move, target } = chooseFoeMove(f, targets, level, excellent);
    return { actor:f, move, target, isPlayer:false };
  });
  resolveTurn([...bs.pendingActions, ...foeActions]);
}
// Changement volontaire de l'adversaire (combat simple) : ton Poursuite peut le frapper au départ, les pièges d'entrée et les
// talents d'entrée s'appliquent au remplaçant, et tes attaques déjà choisies visent désormais le nouveau venu.
function foeVoluntarySwitch(newIdx, callback){
  const bs = battleState;
  const old = bs.foe[bs.fActive];
  old.chargingMove = null; old.chargingTarget = null; old.invulnType = null;
  let msg = pursuitBeforeSwitch(old);
  bs.foeSwitchCount = (bs.foeSwitchCount||0) + 1;
  bs.foeLastSwitchTurn = bs.turnNo || 0;
  if(old.hp<=0){
    // Poursuite l'a mis K.O. avant son départ : il reste sur le terrain, le remplaçant arrive via la gestion des K.O.
    renderBattle();
    setLog(`<b>${old.name}</b> allait quitter le combat...${msg}`);
    setTimeout(callback, btDelay(900));
    return;
  }
  const incoming = setActiveSlot('foe', 'A', newIdx);
  resetBattleFields(incoming);
  bs.pendingActions.forEach(a=>{ if(a.target===old) a.target = incoming; });
  alivePlayerCombatants().forEach(p=>{ if(p.chargingTarget===old) p.chargingTarget = incoming; });
  const opponent = alivePlayerCombatants()[0];
  const intimMsg = opponent ? (triggerIntimidate(incoming, opponent) + triggerSwitchInAbilities(incoming, opponent)) : '';
  renderBattle();
  pulseSprite('foe', 'switch-in-fx');
  setLog(`L'adversaire rappelle ${old.name} et envoie ${incoming.name} !${msg}${intimMsg}`);
  setTimeout(callback, btDelay(1100));
}

// Le joueur choisit une capacité (appelé par l'UI) : résout la cible, transforme le coup en
// Capacité Z ou Capacité Max si déclaré, décrémente les PP, puis empile l'action du tour.
function playerAttack(moveIdx, targetIdx){
  const bs = battleState;
  if(bs.locked) return;
  const slot = bs.selectingSlot || 'A';
  const activeIdx = playerSlotIdx(slot);
  const p = bs.player[activeIdx];
  let move = moveIdx===-1 ? STRUGGLE_MOVE : p.moves[moveIdx];
  if(bs.declaringZMove && moveIdx>=0 && eligibleZMoveIndexes(p).includes(moveIdx)){
    move = buildZMove(move);
    bs.zMoveUsed = true;
  }
  bs.declaringZMove = false;
  if(moveIdx>=0 && p.ppCur && p.ppCur[moveIdx]>0) p.ppCur[moveIdx]--;
  let target;
  if(move.target!=='self' && targetIdx!=null && bs.foe[targetIdx] && bs.foe[targetIdx].hp>0){
    target = bs.foe[targetIdx];
  } else {
    target = aliveFoeCombatants()[0] || null;
  }
  if(bs.declaringDynamax && moveIdx>=0 && canDynamax(p, bs)){
    applyDynamaxBoost(p);
    p.dynamaxed = true;
    p.dynamaxTurns = 3;
    bs.dynamaxUsed = true;
    playDynamaxFx(boxIdFor(p).replace('Box',''));
  }
  bs.declaringDynamax = false;
  if(bs.declaringTera && moveIdx>=0 && canTerastallize(p, bs)){
    activateTera(p);
    bs.teraUsed = true;
    playTeraFx(boxIdFor(p).replace('Box',''), p.teraType);
  }
  bs.declaringTera = false;
  if(bs.declaringMega && moveIdx>=0 && canMegaEvolve(p, bs)){
    activateMegaEvolve(p);
    bs.megaUsed = true;
    playMegaEvolveFx(boxIdFor(p).replace('Box',''));
  }
  bs.declaringMega = false;
  if(p.dynamaxed && (move.cat==='phys' || move.cat==='spec')){
    move = buildMaxMove(move, p, bs, target);
  }
  bs.pendingActions.push({ actor:p, move, target, isPlayer:true, slot });
  bs.locked = true;
  advanceAfterSlot(slot);
}

// Priorité effective d'un coup (talents qui la modifient, ex. Ailes Cyclone pour les capacités Vol).
function effectivePriority(actor, move){
  let p = move.priority||0;
  if(move.grassyGlide && battleState && battleState.terrain && battleState.terrain.type==='grassy') p += 1;
  if(actor.ability==='Ailes Cyclone' && move.type==='vol') p += 1;
  return p;
}
// Trie toutes les actions du tour (joueur + adversaire) par priorité puis vitesse (aléatoire en cas d'égalité), puis les exécute une par une.
function resolveTurn(actions){
  const bs = battleState;
  bs.locked = true;
  const sorted = [...actions].sort((a,b)=>{
    const pa = effectivePriority(a.actor, a.move), pb = effectivePriority(b.actor, b.move);
    if(pa!==pb) return pb-pa;
    const sa = effectiveSpeed(a.actor), sb = effectiveSpeed(b.actor);
    if(sa!==sb) return (bs.trickRoomTurns>0) ? sa-sb : sb-sa;
    return Math.random()<0.5 ? -1 : 1;
  });
  bs.turnQueue = sorted;
  runQueue(sorted, 0);
}
// Exécute la file d'actions triée une par une (runStep), en sautant les combattants K.O. et en redirigeant vers une cible de secours si la cible d'origine est tombée entre-temps.
function runQueue(queue, i){
  const bs = battleState;
  if(i>=queue.length || allFainted(bs.foe) || allFainted(bs.player)){ afterResolveTurn(); return; }
  if(queue[i].actor.hp>0) mergePledge(queue, i);
  const action = queue[i];
  bs.turnIdx = i;
  if(action.actor.hp<=0){ runQueue(queue, i+1); return; }
  let target = action.target;
  if(target && bs.redirect && action.move.target!=='self' && action.move.cat!=='status'){
    const tl = locateActiveSlot(target);
    const red = tl ? bs.redirect[tl.side] : null;
    if(red && red.hp>0 && red!==target && locateActiveSlot(red)) target = red;
  }
  if(target && target.hp<=0 && action.move.target!=='self'){
    const replacement = action.isPlayer ? aliveFoeCombatants().find(c=>c!==target) : alivePlayerCombatants().find(c=>c!==target);
    if(replacement) target = replacement;
    else { runQueue(queue, i+1); return; }
  }
  runStep(action.actor, action.move, target, action.isPlayer, ()=>{
    if(allFainted(bs.foe) || allFainted(bs.player)){ afterResolveTurn(); return; }
    runQueue(queue, i+1);
  });
}
function afterResolveTurn(){
  endTurn();
}

// Changement de Pokémon volontaire choisi par le joueur en combat (Régé-Force soigne au retrait).
function doVoluntarySwitch(i, slot){
  slot = slot || battleState.selectingSlot || 'A';
  const bs = battleState;
  const activeIdx = playerSlotIdx(slot);
  const leaving = bs.player[activeIdx];
  leaving.chargingMove = null;
  leaving.chargingTarget = null;
  leaving.invulnType = null;
  let switchMsg = pursuitBeforeSwitch(leaving);
  if(leaving.ability==='Régé-Force' && leaving.hp>0){
    const heal = Math.max(1, Math.round(leaving.maxHp/3));
    leaving.hp = Math.min(leaving.maxHp, leaving.hp+heal);
    switchMsg = ` ${leaving.name} récupère des PV grâce à Régénération !`;
  }
  if(slot==='A') bs.pActive = i; else bs.pActive2 = i;
  resetBattleFields(bs.player[i]);
  bs.locked = true;
  closeManualSwitch();
  renderBattle();
  pulseSprite(slot==='A' ? 'player' : 'player2', 'switch-in-fx');
  const incoming = bs.player[i];
  const opponent = aliveFoeCombatants()[0];
  const intimidateMsg = opponent ? (triggerIntimidate(incoming, opponent) + triggerSwitchInAbilities(incoming, opponent)) : '';
  const hazardKO = incoming.hp<=0 && alivePlayerCombatants().length===0;
  setLog(`Tu rappelles ton Pokémon et envoies ${incoming.name} !${switchMsg}${intimidateMsg}`);
  renderBattle();
  // Si les pièges mettent K.O. le seul Pokémon actif, on passe directement à la gestion des K.O. (choix d'un remplaçant).
  setTimeout(()=>{ if(hazardKO) handleFaintsAndAdvance(); else advanceAfterSlot(slot); }, btDelay(1000));
}

// Utilise une Potion du sac sur un Pokémon de l'équipe pendant le combat.
function useBagPotion(i){
  const bs = battleState;
  const slot = bs.selectingSlot || 'A';
  const c = bs.player[i];
  const heal = Math.max(1, Math.round(c.maxHp*0.5));
  c.hp = Math.min(c.maxHp, c.hp+heal);
  bag.potion--;
  closeManualSwitch();
  bs.locked = true;
  renderBattle();
  setLog(`Tu utilises une Potion sur ${c.name} ! Il récupère ${heal} PV.`);
  setTimeout(()=> advanceAfterSlot(slot), btDelay(1000));
}

// Vérifie si un Pokémon peut effectivement agir ce tour avant de résoudre son coup (recul de peur,
// gel, sommeil, paralysie, se blesse en confusion). Retourne false si l'action est bloquée.
function checkStatusBeforeMove(battler, logs, move){
  if(battler.mustRecharge){
    battler.mustRecharge = false;
    battler.contMove = null; battler.contTurns = 0;
    logs.push(`${battler.name} doit se reposer !`);
    return false;
  }
  if(battler.flinched){
    battler.flinched = false;
    logs.push(`${battler.name} recule de peur et ne peut pas attaquer !`);
    return false;
  }
  if(battler.status==='gel'){
    // 20 % de dégel par tour, mais jamais plus de FREEZE_MAX_TURNS tours perdus d'affilée (le gel ne
    // dure donc plus indéfiniment) ; certaines capacités Feu dégèlent leur lanceur d'office.
    if(move && move.thawsUser){
      battler.status = null;
      battler.freezeTurns = 0;
      logs.push(`${battler.name} dégèle grâce à la chaleur de ${move.name} !`);
    } else if(Math.random()<0.2 || (battler.freezeTurns||0) >= FREEZE_MAX_TURNS){
      battler.status = null;
      battler.freezeTurns = 0;
      logs.push(`${battler.name} n'est plus gelé !`);
    } else {
      battler.freezeTurns = (battler.freezeTurns||0) + 1;
      logs.push(`${battler.name} est gelé et ne peut pas attaquer !`);
      return false;
    }
  }
  if(battler.status==='sommeil'){
    if(move && move.selfSleepOnly){
      logs.push(`${battler.name} dort profondément...`);
    } else if(battler.sleepCounter>0){
      battler.sleepCounter--;
      logs.push(`${battler.name} dort profondément...`);
      return false;
    } else {
      battler.status = null;
      logs.push(`${battler.name} se réveille !`);
    }
  }
  if(battler.infatuated && Math.random()<0.5){
    logs.push(`${battler.name} est amoureux et ne peut pas attaquer !`);
    return false;
  }
  if(battler.status==='paralysie' && Math.random()<0.25){
    logs.push(`${battler.name} est paralysé ! Il ne peut pas attaquer.`);
    return false;
  }
  if(battler.confuseCounter>0){
    battler.confuseCounter--;
    if(Math.random()<0.33){
      const dmg = Math.max(1, Math.round(battler.stats.atk*0.5*(0.85+Math.random()*0.3)));
      battler.hp = Math.max(0, battler.hp-dmg);
      logs.push(`${battler.name} est confus et se blesse (${dmg} dégâts) !`);
      return false;
    }
  }
  return true;
}

// Lien du Destin / Rancune : si le défenseur vient d'être mis K.O. par ce coup, l'attaquant tombe avec lui
// (Lien du Destin) ou la capacité utilisée perd tous ses PP (Rancune).
function koRetaliation(actor, move, defender){
  let msg = '';
  if(defender.hp>0) return msg;
  if(defender.destinyBond && actor.hp>0){
    actor.hp = 0;
    msg += ` ${defender.name} entraîne ${actor.name} dans sa chute grâce à Lien du Destin !`;
  }
  if(defender.grudge){
    const list = actor.moveObjs || actor.moves || [];
    const idx = list.indexOf(move);
    if(idx>=0 && actor.ppCur){
      actor.ppCur[idx] = 0;
      msg += ` La rancune de ${defender.name} vide les PP de ${move.name} !`;
    }
  }
  return msg;
}
// Note qu'un Pokémon vient d'être touché ce tour (Vendetta, Mitra-Poing, Piège Coquille, Patience).
function markHit(defender, move, dmg){
  if(!(dmg>0)) return;
  defender.hitsTaken = (defender.hitsTaken||0) + 1;
  defender.hitThisTurn = true;
  if(move.cat==='phys') defender.hitPhysThisTurn = true;
  if(defender.contMove && defender.contMove.bide) defender.bideStored = (defender.bideStored||0) + dmg;
  if(defender.raging && defender.hp>0) applyStatBoost(defender, [{stat:'atk', stages:1}], []);
}
// Effets « spéciaux » d'un coup, appliqués une fois les dégâts infligés : recharge, briseurs d'écrans, vol d'objet,
// soin de statut, fin de terrain, perte de type, vol de stats, Étranglement, drain de PP, contrecoup en PV max,
// et enchaînement des capacités à durée (Mania, Colère, Danse-Fleur...).
function applyMoveExtras(actor, move, defender, dmg){
  let msg = '';
  markHit(defender, move, dmg);
  if(move.recharge && actor.hp>0) actor.mustRecharge = true;
  if(move.breaksScreens && (defender.reflectTurns>0 || defender.lightScreenTurns>0)){
    defender.reflectTurns = 0; defender.lightScreenTurns = 0;
    msg += ` Les écrans protégeant ${defender.name} sont brisés !`;
  }
  if(move.stealItem && dmg>0 && defender.heldItem && !actor.heldItem){
    actor.heldItem = defender.heldItem; actor.itemUsed = false;
    defender.heldItem = null;
    msg += ` ${actor.name} dérobe l'objet de ${defender.name} !`;
  }
  if(move.cureTargetStatus && defender.status===move.cureTargetStatus){
    defender.status = null;
    msg += ` ${defender.name} est soigné de son statut !`;
  }
  if(move.endsTerrain && battleState && battleState.terrain){
    battleState.terrain = null;
    msg += ' Le terrain de combat disparaît !';
  }
  if(move.removeTypeAfter && actor.hp>0){
    const kept = (actor.transformedTypes || actor.types).filter(t=>t!==move.removeTypeAfter);
    actor.transformedTypes = kept.length ? kept : ['normal'];
    msg += ` ${actor.name} perd son type ${typeDisplayName(move.removeTypeAfter)} !`;
  }
  if(move.stealBoosts){
    let stolen = false;
    ['atk','def','spa','spd','spe'].forEach(s=>{
      const v = defender.stages[s];
      if(v>0){ actor.stages[s] = Math.min(6, actor.stages[s]+v); defender.stages[s] = 0; stolen = true; }
    });
    if(stolen) msg += ` ${actor.name} vole les augmentations de statistiques de ${defender.name} !`;
  }
  if(move.throatChop && defender.hp>0){
    defender.throatChop = 2;
    msg += ` ${defender.name} ne peut plus utiliser de capacités sonores !`;
  }
  if(move.ppDrain && defender.hp>0){
    const list = defender.moveObjs || defender.moves || [];
    const idx = list.indexOf(defender.lastMoveUsed);
    if(idx>=0 && defender.ppCur && defender.ppCur[idx]>0){
      const lost = Math.min(move.ppDrain, defender.ppCur[idx]);
      defender.ppCur[idx] -= lost;
      msg += ` ${defender.lastMoveUsed.name} de ${defender.name} perd ${lost} PP !`;
    }
  }
  if(move.recoilMaxHp && actor.hp>0){
    const r = Math.max(1, Math.ceil(actor.maxHp*move.recoilMaxHp));
    actor.hp = Math.max(0, actor.hp-r);
    msg += ` Le contrecoup blesse ${actor.name} (${r} dégâts) !`;
  }
  actor.lastMoveFailed = false;
  if(move.rage) actor.raging = true;
  if(move.roundBoost && battleState) battleState.roundUsed = true;
  if(move.fusion && battleState) battleState.fusionUsed = move.fusion;
  if(move.plasma && battleState) battleState.ionDeluge = true;
  if(move.pledgeCombo && battleState){
    const pl = locateActiveSlot(actor);
    if(pl){
      const fxSide = move.pledgeCombo==='rainbow' ? pl.side : (pl.side==='player' ? 'foe' : 'player');
      pledgeFxOf(fxSide)[move.pledgeCombo] = 4;
      const fxText = { rainbow:'Un arc-en-ciel apparaît dans le ciel', fire:'Une mer de feu entoure le camp adverse', swamp:'Un marécage recouvre le camp adverse' };
      msg += ` ${fxText[move.pledgeCombo]} !`;
    }
  }
  if(move.payDay && battleState){
    const pl = locateActiveSlot(actor);
    if(pl && pl.side==='player'){ battleState.payDayMoney = (battleState.payDayMoney||0) + 5*LEVEL; msg += ` Des pièces s'éparpillent (${5*LEVEL} ${phIcon('coins')}) !`; }
  }
  if(move.coreEnforcer && !actor.movedFirst && defender.hp>0 && defender.ability){
    defender.ability = null;
    msg += ` Le talent de ${defender.name} est neutralisé !`;
  }
  if(move.finalGambit) actor.hp = 0;
  if(move.effect && move.effect.selfSwitch && actor.hp>0){
    const sl = [];
    applyStatusEffect(actor, defender, { name:move.name, effect:{ selfSwitch:true } }, sl);
    msg += ' ' + sl.join(' ');
  }
  if(move.secondarySelfBoosts && actor.hp>0 && Math.random()<move.secondarySelfBoosts.chance){
    const sl = [];
    applyStatBoost(actor, move.secondarySelfBoosts.boosts, sl);
    msg += ' ' + sl.join(' ');
  }
  if(move.naturalGift || move.fling){
    if(move.fling){ msg += ` ${actor.name} lance son objet !`; actor.heldItem = null; }
    else { actor.itemUsed = true; actor.heldItem = null; }
  }
  if(move.eatBerry && defender.hp>0 && defender.heldItem && ITEMS[defender.heldItem] && ITEMS[defender.heldItem].category==='baie' && !defender.itemUsed){
    const bl = [];
    const stolen = defender.heldItem;
    defender.itemUsed = true; defender.heldItem = null;
    const prev = actor.heldItem, prevUsed = actor.itemUsed;
    actor.heldItem = stolen; actor.itemUsed = false;
    eatBerryOf(actor, bl);
    actor.heldItem = prev; actor.itemUsed = prevUsed;
    msg += ' ' + bl.join(' ');
  }
  if(move.burnBerry && defender.heldItem && ITEMS[defender.heldItem] && ITEMS[defender.heldItem].category==='baie'){
    defender.heldItem = null;
    msg += ` La baie de ${defender.name} est réduite en cendres !`;
  }
  if(move.clearsStages && defender.hp>0){
    defender.stages = {atk:0,def:0,spa:0,spd:0,spe:0,acc:0,eva:0};
    msg += ` Les changements de statistiques de ${defender.name} sont annulés !`;
  }
  if(move.smackDown && defender.hp>0){
    defender.smackDown = true;
    msg += ` ${defender.name} est cloué au sol !`;
  }
  if(move.forceSwitchOnHit && defender.hp>0 && actor.hp>0){
    const fl = [];
    applyStatusEffect(actor, defender, { name:move.name, effect:{ forceSwitch:true } }, fl);
    msg += ' ' + fl.join(' ');
  }
  if(move.rampage && actor.hp>0){
    if(!actor.contMove){
      actor.contMove = move;
      actor.contTurns = 1 + Math.floor(Math.random()*2);
    } else {
      actor.contTurns--;
      if(actor.contTurns<=0){
        actor.contMove = null;
        if(!move.noConfuse){
          actor.confuseCounter = 2 + Math.floor(Math.random()*3);
          msg += ` ${actor.name} est pris de confusion à force de se déchaîner !`;
        }
      }
    }
  }
  return msg;
}
// Effets d'un coup à frappes multiples appliqués après la dernière frappe (le chemin des coups multiples
// n'exécute pas le reste de runStep) : piégeage, drain, contrecoup, statut/peur/stats secondaires. La chance
// d'un effet secondaire est celle d'au moins un déclenchement sur l'ensemble des frappes.
function multiHitAfterEffects(actor, move, defender, total, hits){
  let msg = '';
  const chance = c => 1 - Math.pow(1-serene(actor, c), Math.max(1,hits));
  if(move.trap && defender.hp>0){
    defender.trapped = true;
    if(move.trapDamage) defender.infested = true;
    msg += ` ${defender.name} est piégé !`;
  }
  if(move.drain && total>0){
    const h = Math.max(1, Math.round(total*move.drain));
    actor.hp = Math.min(actor.maxHp, actor.hp+h);
    msg += ` ${actor.name} récupère ${h} PV !`;
  }
  if(move.recoil && total>0){
    const r = Math.max(1, Math.round(total*move.recoil));
    actor.hp = Math.max(0, actor.hp-r);
    msg += ` Le contrecoup blesse ${actor.name} (${r} dégâts) !`;
  }
  msg += koRetaliation(actor, move, defender);
  msg += applyMoveExtras(actor, move, defender, total);
  if(move.secondaryStatus && defender.hp>0 && Math.random()<chance(move.secondaryStatus.chance)){
    const slogs = [];
    inflictStatus(defender, move.secondaryStatus.status, slogs);
    msg += ' ' + slogs.join(' ');
  }
  if(move.secondaryBoost && defender.hp>0 && Math.random()<chance(move.secondaryBoost.chance)){
    if(defender.ability==='Corps Sain' && move.secondaryBoost.stages<0){
      msg += ` Corps Sain empêche la baisse de statistiques de ${defender.name} !`;
    } else if(defender.mistTurns>0 && move.secondaryBoost.stages<0){
      msg += ` La Brume protège ${defender.name} de la baisse de statistiques !`;
    } else {
      const blogs = [];
      applyStatBoost(defender, [{stat:move.secondaryBoost.stat, stages:move.secondaryBoost.stages}], blogs);
      msg += ' ' + blogs.join(' ');
    }
  }
  if(move.secondarySelfBoost && Math.random()<chance(move.secondarySelfBoost.chance)){
    const blogs = [];
    applyStatBoost(actor, [{stat:move.secondarySelfBoost.stat, stages:move.secondarySelfBoost.stages}], blogs);
    msg += ' ' + blogs.join(' ');
  }
  if(move.selfBoost){
    const blogs = [];
    applyStatBoost(actor, move.selfBoost, blogs);
    msg += ' ' + blogs.join(' ');
  }
  if(move.flinch && defender.hp>0 && defender.ability!=='Attention' && Math.random()<chance(move.flinch)){
    defender.flinched = true;
    msg += ` ${defender.name} recule de peur !`;
  }
  return msg;
}
// Résout une action de combat complète, dans l'ordre : entrave/forçage (Entrave, Instruct),
// transformations du coup (Voix Aquatique, typeFromUser, categoryFromHigherStat, Protéen/Libéro),
// cas spéciaux (Métronome, Copie), verrouillage d'objet Choix/Instinct Gorille, conditions
// d'activation (requiresWeather, capacité prioritaire bloquée par Terrain Psychique), charge
// (Lance-Soleil...), précision et esquive, Protection/Riposte/Damoclès Inversé, capacités de
// statut (via applyStatusEffect), immunités totales de talent (Absorbe-Eau, Lévitation,
// Anti-Bombe, Torche), dégel, K.O. Direct, cas fixes (Frappe Atlas, Effort, Docugnon, Cadeau,
// Prescience, capacités à coups multiples), puis le calcul de dégâts principal (computeDamage) et
// TOUS les effets déclenchés par le coup (talents de survie type Fermeté, contrecoup/drain,
// statuts secondaires, changements de stats, talents de contact du défenseur, baie mangée,
// vol d'objet, Bouton Fuite...).
function runStep(actor, move, defender, actorIsPlayer, callback){
  let logs = [];
  const isProtectMove = move.effect && (move.effect.protect || move.effect.endure);
  if(!isProtectMove) actor.protectChain = 0;
  const canMove = checkStatusBeforeMove(actor, logs, move);
  renderBattle();
  if(!canMove){
    actor.contMove = null; actor.contTurns = 0;
    setLog(logs.join(' '));
    setTimeout(callback, btDelay(900));
    return;
  }
  if(actor.disabledMove && actor.disabledMove.name===move.name){
    setLog(`<b>${actor.name}</b> ne peut pas utiliser ${move.name}, c'est entravé !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(actor.tormented && actor.lastMoveUsed && actor.lastMoveUsed.name===move.name && move.name!==STRUGGLE_MOVE.name){
    setLog(`<b>${actor.name}</b> ne peut pas utiliser ${move.name} deux fois de suite, il est tourmenté !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(battleState){
    const foesOfActor = actorIsPlayer ? aliveFoeCombatants() : alivePlayerCombatants();
    const jailer = foesOfActor.find(c=>c.imprisoning && (c.moves||c.moveObjs||[]).some(mm=>mm && mm.name===move.name));
    if(jailer){
      setLog(`<b>${actor.name}</b> ne peut pas utiliser ${move.name}, ${jailer.name} l'a scellée avec Possessif !`);
      setTimeout(callback, btDelay(900));
      return;
    }
  }
  actor.destinyBond = false;
  actor.grudge = false;
  const bsx = battleState;
  const firstAction = !(actor.actedTurns>0);
  actor.actedTurns = (actor.actedTurns||0) + 1;
  const queueLater = bsx && bsx.turnQueue ? bsx.turnQueue.slice((bsx.turnIdx||0)+1) : [];
  actor.movedFirst = queueLater.some(a=>a.actor===defender);
  const failMove = why =>{
    actor.contMove = null; actor.contTurns = 0;
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name}... ${why}`);
    setTimeout(callback, btDelay(900));
  };
  if(move.firstTurnOnly && !firstAction){ failMove('mais ça échoue !'); return; }
  if(move.suckerPunch){
    const target = queueLater.find(a=>a.actor===defender);
    if(!target || target.move.cat==='status'){ failMove('mais ça échoue, la cible ne prépare pas d\'attaque !'); return; }
  }
  if(move.requiresPhysHit && !actor.hitPhysThisTurn){ failMove('mais le piège ne se déclenche pas !'); return; }
  if(move.focusPunch && actor.hitThisTurn){ failMove('mais perd sa concentration !'); return; }
  if(move.requiresTargetItem && !defender.heldItem){ failMove('mais ça échoue, la cible ne tient aucun objet !'); return; }
  if(move.endsTerrain && !(bsx && bsx.terrain)){ failMove('mais ça échoue, il n\'y a aucun terrain !'); return; }
  if(move.sound && actor.throatChop>0){ failMove('mais Étranglement l\'empêche d\'utiliser des sons !'); return; }
  actor.usedMoveNames = actor.usedMoveNames || new Set();
  if(move.lastResort){
    const others = (actor.moveObjs||actor.moves||[]).filter(m=>m && m.name!==move.name);
    if(!others.length || !others.every(m=>actor.usedMoveNames.has(m.name))){ failMove('mais ça échoue, il reste des capacités à utiliser !'); return; }
  }
  actor.usedMoveNames.add(move.name);
  actor.prevMoveFailed = !!actor.lastMoveFailed;
  actor.lastMoveFailed = true;
  if(!move.rage) actor.raging = false;
  if(move.ignoresAbility && defender){
    const savedAbility = defender.ability;
    defender.ability = null;
    const cbIgnore = callback;
    callback = ()=>{ defender.ability = savedAbility; cbIgnore(); };
  }
  if(move.metalBurst && !((actor.lastPhysDamage||0)+(actor.lastSpecDamage||0))){ failMove('mais ça échoue, personne ne l\'a touché !'); return; }
  if(move.synchronoise){
    const at = actor.transformedTypes||actor.types, dt = defender.transformedTypes||defender.types;
    if(!at.some(t=>dt.includes(t))){ failMove('mais ça n\'affecte pas la cible !'); return; }
  }
  if(move.naturalGift){
    const nit = actor.heldItem && ITEMS[actor.heldItem];
    if(!nit || nit.category!=='baie' || actor.itemUsed){ failMove('mais ça échoue, il n\'a pas de baie !'); return; }
  }
  if(move.fling && !actor.heldItem){ failMove('mais ça échoue, il n\'a aucun objet à lancer !'); return; }
  if(actor.powdered && move.type==='feu'){
    const pd = Math.max(1, Math.floor(actor.maxHp/4));
    actor.hp = Math.max(0, actor.hp-pd); actor.powdered = false;
    failMove(`mais la poudre explose (${pd} dégâts) !`);
    return;
  }
  if(actor.electrified){ move = { ...move, type:'electrik' }; actor.electrified = false; }
  if(bsx && bsx.ionDeluge && move.type==='normal') move = { ...move, type:'electrik' };
  if(move.effect && move.effect.copycat){
    const last = bsx && bsx.lastMoveAny;
    if(last && !(last.effect && (last.effect.copycat || last.effect.meFirst))){
      setLog(`<b>${actor.name}</b> utilise ${move.name} et copie ${last.name} !`);
      setTimeout(()=> runStep(actor, last, defender, actorIsPlayer, callback), btDelay(900));
    } else {
      setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ça échoue !`);
      setTimeout(callback, btDelay(900));
    }
    return;
  }
  if(move.effect && move.effect.meFirst){
    const tgtAction = queueLater.find(a=>a.actor===defender);
    if(tgtAction && tgtAction.move.cat!=='status' && tgtAction.move.power>0){
      const boosted = { ...tgtAction.move, power: Math.round(tgtAction.move.power*1.5) };
      setLog(`<b>${actor.name}</b> utilise ${move.name} et prend la capacité ${tgtAction.move.name} !`);
      setTimeout(()=> runStep(actor, boosted, defender, actorIsPlayer, callback), btDelay(900));
    } else {
      setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ça échoue !`);
      setTimeout(callback, btDelay(900));
    }
    return;
  }
  if(move.bide){
    if(!actor.contMove){
      actor.contMove = move; actor.contTurns = 2; actor.bideStored = 0;
      renderBattle();
      setLog(`<b>${actor.name}</b> utilise ${move.name} ! Il accumule de l'énergie...`);
      setTimeout(callback, btDelay(900));
      return;
    }
    actor.contTurns--;
    if(actor.contTurns>0){
      renderBattle();
      setLog(`<b>${actor.name}</b> accumule toujours de l'énergie...`);
      setTimeout(callback, btDelay(900));
      return;
    }
    const stored = actor.bideStored||0;
    actor.contMove = null; actor.bideStored = 0;
    if(stored<=0 || defender.hp<=0){
      renderBattle();
      setLog(`<b>${actor.name}</b> libère son énergie... mais ça échoue !`);
      setTimeout(callback, btDelay(900));
      return;
    }
    const bdmg = Math.min(defender.hp, stored*2);
    defender.hp -= bdmg;
    markHit(defender, move, bdmg);
    renderBattle();
    shakeBox(boxIdFor(defender), false);
    setLog(`<b>${actor.name}</b> libère l'énergie accumulée ! ${defender.name} subit ${bdmg} dégâts !`);
    setTimeout(callback, btDelay(1000));
    return;
  }
  if(move.escalate || move.echoed){
    if(actor.streakMove===move.name) actor.streak = Math.min((actor.streak||0)+1, 4);
    else actor.streak = 0;
  }
  actor.streakMove = move.name;
  if(actor.forcedMove){
    const forced = actor.forcedMove;
    actor.forcedMove = null;
    if(forced.name!==move.name){
      setLog(`<b>${actor.name}</b> est forcé de réutiliser ${forced.name} !`);
      setTimeout(()=> runStep(actor, forced, defender, actorIsPlayer, callback), btDelay(900));
      return;
    }
  }
  if(actor.ability==='Voix Aquatique' && move.sound){
    move = { ...move, type:'eau' };
  }
  if(move.typeFromUser){
    const userType = (actor.transformedTypes || actor.types)[0];
    move = { ...move, type: userType };
  }
  if(move.natureForce){
    const terr = battleState && battleState.terrain ? battleState.terrain.type : null;
    move = { ...move, type: { grassy:'plante', electric:'electrik', misty:'fee', psychic:'psy' }[terr] || 'normal' };
  }
  if(move.weatherBall){
    const w = (battleState && !weatherNullified() && battleState.weather) ? battleState.weather.type : null;
    const wt = { soleil:'feu', pluie:'eau', sable:'roche', grele:'glace' }[w];
    if(wt) move = { ...move, type: wt, power: move.power*2 };
  }
  if(move.itemType){
    const heldIt = actor.heldItem && ITEMS[actor.heldItem];
    const itType = itemMoveType(heldIt, move.itemType);
    if(itType) move = { ...move, type: itType };
  }
  if(move.hiddenPower) move = { ...move, type: hiddenPowerType(actor) };
  if(move.teraBlast){
    move = { ...move, cat: actor.stats.spa>actor.stats.atk ? 'spec' : 'phys' };
    if(actor.teraActive && actor.teraType) move.type = actor.teraType;
  }
  if(move.terrainPulse){
    const terr = battleState && battleState.terrain ? battleState.terrain.type : null;
    if(terr) move = { ...move, type: { grassy:'plante', electric:'electrik', misty:'fee', psychic:'psy' }[terr], power: move.power*2 };
  }
  if(move.categoryFromHigherStat){
    move = { ...move, cat: actor.stats.spa > actor.stats.atk ? 'spec' : 'phys' };
  }
  if((actor.ability==='Protéen' || actor.ability==='Libéro') && !move.metronome && !move.mirrorMove){
    const newTypes = move.type2 ? [move.type, move.type2] : [move.type];
    const current = actor.transformedTypes || actor.types;
    const already = current.length===newTypes.length && newTypes.every(t=>current.includes(t));
    if(!already) actor.transformedTypes = newTypes;
  }
  if(move.metronome){
    const pool = Object.values(MOVES).filter(m=>!m.metronome && !m.mirrorMove && !m.mimic && m.name!=='Struggle');
    const picked = rand(pool);
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! Le doigt s'agite... ${picked.name} est invoqué !`);
    setTimeout(()=> runStep(actor, picked, defender, actorIsPlayer, callback), btDelay(900));
    return;
  }
  if(move.mirrorMove){
    if(defender.lastMoveUsed){
      setLog(`<b>${actor.name}</b> utilise ${move.name} et copie ${defender.lastMoveUsed.name} !`);
      setTimeout(()=> runStep(actor, defender.lastMoveUsed, defender, actorIsPlayer, callback), btDelay(900));
    } else {
      setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ça échoue !`);
      setTimeout(callback, btDelay(900));
    }
    return;
  }
  actor.lastMoveUsed = move;
  actor.lastMoveTarget = defender;
  if(battleState) battleState.lastMoveAny = move;
  if(actor.heldItem && ITEMS[actor.heldItem] && ITEMS[actor.heldItem].choiceLock && !actor.lockedMove){
    actor.lockedMove = move;
  }
  if(actor.ability==='Instinct Gorille' && !actor.lockedMove){
    actor.lockedMove = move;
  }
  if(move.requiresAteBerry && !actor.ateBerry){
    setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ça échoue !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(move.requiresWeather && (!battleState || !battleState.weather || battleState.weather.type!==move.requiresWeather)){
    setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ça échoue !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(move.priority>0 && move.target!=='self' && battleState && battleState.terrain && battleState.terrain.type==='psychic'){
    setLog(`<b>${actor.name}</b> utilise ${move.name}... mais le Terrain Psychique bloque les attaques prioritaires !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(move.charge){
    const isReleasing = actor.chargingMove === move;
    if(!isReleasing){
      const weatherNow0 = battleState ? battleState.weather : null;
      const skipCharge = move.sunSkip && weatherNow0 && weatherNow0.type==='soleil';
      if(!skipCharge){
        actor.chargingMove = move;
        actor.chargingTarget = defender;
        if(move.semiInvuln) actor.invulnType = move.semiInvuln;
        renderBattle();
        setLog(`<b>${actor.name}</b> ${move.chargeMsg||'se prépare à attaquer'} !`);
        setTimeout(callback, btDelay(900));
        return;
      }
    } else {
      actor.chargingMove = null;
      actor.chargingTarget = null;
      actor.invulnType = null;
    }
  }
  let acc;
  if(move.target==='self' || move.neverMiss || defender.telekinesis>0){
    acc = 1;
  } else if(actor.guaranteedHit){
    acc = 1;
  } else {
    acc = move.accuracy!==undefined ? move.accuracy : 0.95;
    acc *= accuracyStageMultiplier(actor.stages.acc);
    if(move.cat!=='status') acc /= accuracyStageMultiplier(defender.foresighted ? Math.min(0, defender.stages.eva||0) : (defender.stages.eva||0));
    if(actor.ability==='Victorieux') acc *= 1.1;
  }
  const weatherNow = battleState ? battleState.weather : null;
  if(weatherNow && move.cat!=='status'){
    if(weatherNow.type==='sable' && defender.ability==='Voile Sable') acc *= 0.8;
    if(weatherNow.type==='grele' && defender.ability==='Rideau Neige') acc *= 0.8;
  }
  if(defender.invulnType && move.target!=='self'){
    if(move.bypassInvuln && move.bypassInvuln.includes(defender.invulnType)){
      acc = 1;
    } else {
      renderBattle();
      setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ${defender.name} est hors d'atteinte !`);
      setTimeout(callback, btDelay(900));
      return;
    }
  }
  if(defender.quickGuard && move.target!=='self' && actor!==defender && effectivePriority(actor, move)>0){
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ${defender.name} est protégé par Prévention !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  lungeBox(boxIdFor(actor));
  playMoveFx(move, boxIdFor(actor).replace('Box',''), boxIdFor(defender).replace('Box',''));
  if(move.isZMove) playZMoveFx(boxIdFor(actor).replace('Box',''), move.type);
  if(Math.random() > acc){
    let missMsg = '';
    if(move.crashOnMiss){
      const crash = Math.max(1, Math.round(actor.maxHp/2));
      actor.hp = Math.max(0, actor.hp - crash);
      missMsg = ` ${actor.name} se blesse en s'écrasant (${crash} dégâts) !`;
    }
    actor.contMove = null; actor.contTurns = 0;
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name}... mais rate son coup !${missMsg}`);
    actor.guaranteedHit = false;
    setTimeout(callback, btDelay(900));
    return;
  }
  actor.guaranteedHit = false;
  if(defender.protected && move.cat!=='status' && !move.ignoresProtect){
    let punishMsg = '';
    if(defender.punishOnContact && move.cat==='phys'){
      const rdmg = Math.max(1, Math.round(actor.maxHp/8));
      actor.hp = Math.max(0, actor.hp-rdmg);
      punishMsg = ` ${actor.name} est blessé au contact (${rdmg} dégâts) !`;
    }
    if(defender.protectPunish && move.cat==='phys'){
      const pp = defender.protectPunish;
      if(pp.stat){ const pl = []; applyStatBoost(actor, [{stat:pp.stat, stages:pp.stages}], pl); punishMsg += ' ' + pl.join(' '); }
      if(pp.status){ const pl = []; inflictStatus(actor, pp.status, pl); punishMsg += ' ' + pl.join(' '); }
    }
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! ${defender.name} se protège de l'attaque !${punishMsg}`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(move.counter){
    const cdmg = (actor.lastPhysDamage||0) * 2;
    renderBattle();
    if(cdmg<=0){
      setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ça échoue !`);
      setTimeout(callback, btDelay(900));
      return;
    }
    defender.hp = Math.max(0, defender.hp-cdmg);
    renderBattle();
    shakeBox(boxIdFor(defender), false);
    setLog(`<b>${actor.name}</b> utilise ${move.name} et renvoie ${cdmg} dégâts en représailles !`);
    setTimeout(callback, btDelay(1000));
    return;
  }
  if(move.mirrorCoat){
    const mdmg = (actor.lastSpecDamage||0) * 2;
    renderBattle();
    if(mdmg<=0){
      setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ça échoue !`);
      setTimeout(callback, btDelay(900));
      return;
    }
    defender.hp = Math.max(0, defender.hp-mdmg);
    renderBattle();
    shakeBox(boxIdFor(defender), false);
    setLog(`<b>${actor.name}</b> utilise ${move.name} et renvoie ${mdmg} dégâts en représailles !`);
    setTimeout(callback, btDelay(1000));
    return;
  }
  if(move.cat==='status'){
    if(defender.substitute>0 && move.target==='foe' && actor!==defender && !move.sound && !(move.effect && (move.effect.substitute || move.effect.protect))){
      renderBattle();
      setLog(`<b>${actor.name}</b> utilise ${move.name}... mais le clone de ${defender.name} bloque la capacité !`);
      setTimeout(callback, btDelay(900));
      return;
    }
    if(move.requiresStatus && defender.status!==move.requiresStatus){
      renderBattle();
      setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ça échoue !`);
      setTimeout(callback, btDelay(900));
      return;
    }
    if(actor.tauntTurns>0){
      renderBattle();
      setLog(`<b>${actor.name}</b> est provoqué et ne peut pas utiliser ${move.name} !`);
      setTimeout(callback, btDelay(900));
      return;
    }
    if(actor.heldItem==='vesteCombat'){
      renderBattle();
      setLog(`<b>${actor.name}</b> ne peut pas utiliser ${move.name} à cause de sa Veste de Combat !`);
      setTimeout(callback, btDelay(900));
      return;
    }
    if(move.yawn){
      if(defender.status){
        renderBattle();
        setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ça n'a aucun effet, ${defender.name} a déjà un problème de statut !`);
        setTimeout(callback, btDelay(900));
        return;
      }
      const bs = battleState;
      bs.pendingYawn = (bs.pendingYawn || []).filter(p=>p.target!==defender);
      bs.pendingYawn.push({ target: defender, turnsLeft: 1 });
      renderBattle();
      setLog(`<b>${actor.name}</b> utilise ${move.name} ! ${defender.name} baîlle...`);
      setTimeout(callback, btDelay(900));
      return;
    }
    const rivals = actorIsPlayer ? aliveFoeCombatants() : alivePlayerCombatants();
    const snatcher = (move.target==='self' && !(move.effect && move.effect.snatch)) ? rivals.find(c=>c.snatching) : null;
    if(snatcher){
      snatcher.snatching = false;
      logs.push(`${snatcher.name} vole la capacité ${move.name} !`);
      applyStatusEffect(snatcher, actor, move, logs);
    } else if(move.target==='foe' && defender.magicCoat && !(move.effect && move.effect.magicCoat)){
      defender.magicCoat = false;
      logs.push(`${defender.name} renvoie ${move.name} grâce à Reflet Magik !`);
      applyStatusEffect(defender, actor, move, logs);
    } else {
      applyStatusEffect(actor, defender, move, logs);
    }
    actor.lastMoveFailed = false;
    renderBattle();
    if(move.target==='foe') shakeBox(boxIdFor(defender));
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! ${logs.join(' ')}`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if((defender.ability==='Absorbe-Eau' && move.type==='eau') || (defender.ability==='Absorbe-Volt' && move.type==='electrik')){
    const heal = Math.max(1, Math.round(defender.maxHp*0.25));
    defender.hp = Math.min(defender.maxHp, defender.hp+heal);
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! Le talent ${defender.ability} de ${defender.name} absorbe l'attaque et récupère ${heal} PV !`);
    setTimeout(callback, btDelay(1000));
    return;
  }
  if((defender.ability==='Lévitation' || defender.magnetRise>0) && move.type==='sol' && !move.bypassTypeImmunity && !defender.smackDown && !(battleState && battleState.gravityTurns>0)){
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! Ça n'affecte pas ${defender.name} (Lévitation) !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(defender.heldItem==='ballonAir' && move.type==='sol' && !move.bypassTypeImmunity && !(battleState && battleState.gravityTurns>0)){
    defender.heldItem = null; defender.itemUsed = true;
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! Ça n'affecte pas ${defender.name} (Ballon) ! Le ballon éclate !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(defender.ability==='Anti-Bombe' && move.ballBomb){
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! Anti-Bombe protège totalement ${defender.name} !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(defender.ability==='Torche' && move.type==='feu'){
    defender.torchActivated = true;
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! Torche absorbe la chaleur, ${defender.name} n'est pas affecté et enflamme ses prochaines attaques Feu !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(defender.ability==='Corps Cuit' && move.type==='feu'){
    let cclogs = [];
    applyStatBoost(defender, [{stat:'def',stages:2}], cclogs);
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! Corps Cuit protège ${defender.name} de la chaleur ! ${cclogs.join(' ')}`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(defender.ability==="Cœur d'Or" && move.cat==='status' && move.target!=='self'){
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! Ça n'affecte pas ${defender.name} (Cœur d'Or) !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  let thawMsg = '';
  if(defender.status==='gel' && (move.type==='feu' || move.thawsTarget)){
    defender.status = null;
    defender.freezeTurns = 0;
    thawMsg = ` ${defender.name} dégèle sous la chaleur !`;
  }
  if(move.ohko){
    if(defender.ability==='Fermeté'){
      renderBattle();
      setLog(`<b>${actor.name}</b> utilise ${move.name} ! ${defender.name} résiste grâce à Fermeté !`);
      setTimeout(callback, btDelay(900));
      return;
    }
    defender.hp = 0;
    renderBattle();
    shakeBox(boxIdFor(defender), true);
    flashScreen('crit');
    setLog(`<b>${actor.name}</b> utilise ${move.name} !${thawMsg} Coup K.O. direct sur ${defender.name} !`);
    setTimeout(callback, btDelay(1000));
    return;
  }
  if(move.sleepOnly && defender.status!=='sommeil'){
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ${defender.name} n'est pas endormi, ça échoue !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(move.selfSleepOnly && actor.status!=='sommeil'){
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ça échoue (il faut dormir) !`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(move.halfHp){
    const hdmg = Math.max(1, Math.ceil(defender.hp/2));
    defender.hp = Math.max(0, defender.hp-hdmg);
    renderBattle();
    shakeBox(boxIdFor(defender));
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! ${defender.name} perd la moitié de ses PV actuels (${hdmg} dégâts) !`);
    setTimeout(callback, btDelay(1000));
    return;
  }
  if(move.endeavor){
    if(defender.hp<=actor.hp){
      renderBattle();
      setLog(`<b>${actor.name}</b> utilise ${move.name}... mais ça échoue !`);
      setTimeout(callback, btDelay(900));
      return;
    }
    const edmg = defender.hp - actor.hp;
    defender.hp = actor.hp;
    renderBattle();
    shakeBox(boxIdFor(defender));
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! ${defender.name} tombe au même niveau de PV (${edmg} dégâts) !`);
    setTimeout(callback, btDelay(1000));
    return;
  }
  if(move.psywave){
    const pdmg = Math.max(1, Math.round(10 + Math.random()*40));
    defender.hp = Math.max(0, defender.hp-pdmg);
    renderBattle();
    shakeBox(boxIdFor(defender));
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! Une décharge d'intensité aléatoire inflige ${pdmg} dégâts !`);
    setTimeout(callback, btDelay(1000));
    return;
  }
  if(move.present){
    if(Math.random()<0.2){
      const heal = Math.max(1, Math.round(defender.maxHp*0.25));
      defender.hp = Math.min(defender.maxHp, defender.hp+heal);
      renderBattle();
      setLog(`<b>${actor.name}</b> offre un Cadeau ! ${defender.name} récupère ${heal} PV !`);
      setTimeout(callback, btDelay(1000));
      return;
    }
    const pdmg = Math.max(1, Math.round(20 + Math.random()*40));
    defender.hp = Math.max(0, defender.hp-pdmg);
    renderBattle();
    shakeBox(boxIdFor(defender));
    setLog(`<b>${actor.name}</b> offre un Cadeau piégé ! ${defender.name} subit ${pdmg} dégâts !`);
    setTimeout(callback, btDelay(1000));
    return;
  }
  if(move.futureSight){
    const { dmg: fsDmg } = computeDamage(actor, move, defender);
    const bs = battleState;
    bs.pendingFutureSight = bs.pendingFutureSight || [];
    bs.pendingFutureSight.push({ target: defender, turnsLeft:2, dmg: fsDmg, moveName: move.name });
    renderBattle();
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! Une force mystérieuse rôde autour de ${defender.name}...`);
    setTimeout(callback, btDelay(900));
    return;
  }
  if(move.multiHit){
    if(defender.ability==='Garde Mystik'){
      renderBattle();
      setLog(`<b>${actor.name}</b> utilise ${move.name} ! Garde Mystik protège ${defender.name} !`);
      setTimeout(callback, btDelay(900));
      return;
    }
    const { min, max } = move.multiHit;
    let hits = min + Math.floor(Math.random()*(max-min+1));
    if(move.beatUp){
      const bLoc = locateActiveSlot(actor);
      const roster = bLoc ? (bLoc.side==='player' ? battleState.player : battleState.foe) : [];
      hits = Math.max(1, roster.filter(c=>c.hp>0).length);
    }
    let total = 0, actualHits = 0, lastCrit = false, hitSub = false;
    for(let i=0;i<hits;i++){
      if(defender.hp<=0) break;
      const { dmg: hdmg, crit: hcrit } = computeDamage(actor, move, defender);
      if(defender.substitute>0 && !move.sound){
        const ab = Math.min(defender.substitute, hdmg);
        defender.substitute -= ab;
        hitSub = true; total += ab; actualHits++; lastCrit = lastCrit || hcrit;
        continue;
      }
      const applied = Math.min(hdmg, defender.hp);
      defender.hp -= applied;
      total += applied;
      actualHits++;
      lastCrit = lastCrit || hcrit;
    }
    if(!hitSub){
      if(move.cat==='phys') defender.lastPhysDamage = total;
      if(move.cat==='spec') defender.lastSpecDamage = total;
    }
    const extraMsg = hitSub ? ' Le clone encaisse les coups !' : multiHitAfterEffects(actor, move, defender, total, actualHits);
    renderBattle();
    shakeBox(boxIdFor(defender), lastCrit);
    if(lastCrit) flashScreen('crit');
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! Touché ${actualHits} fois pour un total de ${total} dégâts !${extraMsg}`);
    setTimeout(callback, btDelay(1000));
    return;
  }
  const { dmg, eff, crit } = computeDamage(actor, move, defender);
  let actualDmg = dmg;
  let sashSaved = false;
  let enduredMsg = '';
  let wonderGuardMsg = '';
  if(defender.ability==='Fantaisie' && !defender.disguiseBroken && move.power>0){
    actualDmg = 0;
    defender.disguiseBroken = true;
    wonderGuardMsg = ` Le déguisement de ${defender.name} se brise à sa place !`;
  } else if(defender.ability==='Garde Mystik' && eff<=1 && move.power>0){
    actualDmg = 0;
    wonderGuardMsg = ` Garde Mystik protège ${defender.name} !`;
  } else if(defender.heldItem==='ceintureForce' && !defender.itemUsed && defender.hp===defender.maxHp && dmg>=defender.hp){
    actualDmg = defender.hp - 1;
    defender.itemUsed = true;
    sashSaved = true;
  } else if(defender.ability==='Fermeté' && defender.hp===defender.maxHp && dmg>=defender.hp){
    actualDmg = defender.hp - 1;
    enduredMsg = ` ${defender.name} tient bon grâce à Fermeté !`;
  } else if(defender.enduring && dmg>=defender.hp){
    actualDmg = defender.hp - 1;
    enduredMsg = ` ${defender.name} tient bon grâce à Ténacité !`;
  }
  if(move.holdBack) actualDmg = Math.min(actualDmg, defender.hp - 1);
  if(defender.substitute>0 && !move.sound && !move.ignoresProtect && actualDmg>0){
    const absorbed = Math.min(defender.substitute, actualDmg);
    defender.substitute -= absorbed;
    const broke = defender.substitute<=0;
    if(broke) defender.substitute = 0;
    markHit(defender, move, absorbed);
    renderBattle();
    shakeBox(boxIdFor(defender), crit);
    setLog(`<b>${actor.name}</b> utilise ${move.name} ! Le clone de ${defender.name} encaisse ${absorbed} dégâts${broke?' et disparaît':''} !`);
    setTimeout(callback, btDelay(1000));
    return;
  }
  defender.hp = Math.max(0, defender.hp-actualDmg);
  if(move.cat==='phys') defender.lastPhysDamage = actualDmg;
  if(move.cat==='spec') defender.lastSpecDamage = actualDmg;
  let msg = `<b>${actor.name}</b> ${actorIsPlayer?'utilise':'riposte avec'} ${move.name} !${crit?' <b>Coup critique !</b>':''}${effLabel(eff)} (${actualDmg} dégâts)${thawMsg}${enduredMsg}${wonderGuardMsg}`;
  if(sashSaved){ msg += ` ${defender.name} tient bon grâce à sa Ceinture Force !`; }
  if(defender.ability==='Turbo Vapeur' && actualDmg>0 && (move.type==='feu'||move.type==='eau')){
    let klogs = [];
    applyStatBoost(defender, [{stat:'spe',stages:6}], klogs);
    msg += ` ${defender.name} active sa Turbo Vapeur !`;
  }
  if(defender.heldItem==='ballonAir' && actualDmg>0){
    defender.heldItem = null; defender.itemUsed = true;
    msg += ` Le Ballon de ${defender.name} éclate !`;
  }
  if(defender.heldItem==='politiqueFaible' && !defender.itemUsed && actualDmg>0 && eff>1 && defender.hp>0){
    defender.itemUsed = true;
    let plogs = [];
    applyStatBoost(defender, [{stat:'atk',stages:2},{stat:'spa',stages:2}], plogs);
    msg += ` La Vulné-Assurance de ${defender.name} augmente son Attaque et son Attaque Spéciale !`;
  }
  if(defender.ability==='Crache-Sable' && actualDmg>0 && battleState && (!battleState.weather || battleState.weather.type!=='sable')){
    battleState.weather = { type:'sable', turns:5 };
    msg += ` ${defender.name} déclenche une tempête de sable grâce à Crache-Sable !`;
  }
  if(defender.ability==='Chute Cotonneuse' && actualDmg>0 && battleState){
    const loc = locateActiveSlot(defender);
    const foes = loc && loc.side==='player' ? aliveFoeCombatants() : alivePlayerCombatants();
    let klogs = [];
    foes.forEach(f=> applyStatBoost(f, [{stat:'spe',stages:-1}], klogs));
    msg += ` ${defender.name} disperse du coton qui réduit la Vitesse adverse !`;
  }
  if(defender.ability==='Corps Fatal' && actualDmg>0 && move.cat==='phys' && defender.hp>0){
    defender.perishCounter = 3; actor.perishCounter = 3;
    msg += ` Le Corps Fatal de ${defender.name} condamne les deux camps dans 3 tours !`;
  }
  if(defender.ability==='Âme Vagabonde' && actualDmg>0 && move.cat==='phys' && defender.hp>0){
    const tmpAbility = actor.ability;
    actor.ability = defender.ability;
    defender.ability = tmpAbility;
    msg += ` ${defender.name} échange son talent avec ${actor.name} grâce à Âme Vagabonde !`;
  }
  if(move.boostOnKO && defender.hp<=0){
    let klogs = [];
    applyStatBoost(actor, [move.boostOnKO], klogs);
    msg += ' ' + klogs.join(' ');
  }
  if(actor.ability==='Éclosion' && defender.hp<=0){
    const statKeys = ['atk','def','spa','spd','spe'];
    let bestStat = statKeys[0];
    statKeys.forEach(k=>{ if(actor.stats[k] > actor.stats[bestStat]) bestStat = k; });
    let klogs = [];
    applyStatBoost(actor, [{stat:bestStat, stages:1}], klogs);
    msg += ' ' + klogs.join(' ');
  }
  if(actor.ability==='Hennissement Glacial' && defender.hp<=0){
    let klogs = [];
    applyStatBoost(actor, [{stat:'atk', stages:1}], klogs);
    msg += ' ' + klogs.join(' ');
  }
  if(actor.ability==='Hennissement Sinistre' && defender.hp<=0){
    let klogs = [];
    applyStatBoost(actor, [{stat:'spa', stages:1}], klogs);
    msg += ' ' + klogs.join(' ');
  }
  if(defender.ability==='Banc de Poissons' && !defender.schoolBroken && defender.hp>0 && defender.hp<=defender.maxHp*0.25){
    defender.schoolBroken = true;
    let klogs = [];
    applyStatBoost(defender, [{stat:'atk',stages:-2},{stat:'def',stages:-2},{stat:'spa',stages:-2},{stat:'spd',stages:-2}], klogs);
    msg += ` ${defender.name} se disperse, perdant sa formation Banc de Poissons !`;
  }
  if(defender.ability==='Corps Blindé' && !defender.shieldsBroken && defender.hp>0 && defender.hp<=defender.maxHp*0.5){
    defender.shieldsBroken = true;
    let klogs = [];
    applyStatBoost(defender, [{stat:'def',stages:-2},{stat:'spd',stages:-2},{stat:'spe',stages:2}], klogs);
    msg += ` La coque de ${defender.name} se brise, révélant son Noyau !`;
  }
  if(move.trap && defender.hp>0){
    defender.trapped = true;
    if(move.trapDamage) defender.infested = true;
    msg += ` ${defender.name} est piégé !`;
  }
  if(move.drain){
    const h=Math.max(1,Math.round(actualDmg*move.drain));
    if(defender.ability==='Suintement'){
      actor.hp = Math.max(0, actor.hp-h);
      msg += ` Suintement fait perdre ${h} PV à ${actor.name} au lieu de le soigner !`;
    } else {
      actor.hp=Math.min(actor.maxHp,actor.hp+h);
      msg+=` ${actor.name} récupère ${h} PV !`;
    }
  }
  if(move.recoil){ const r=Math.max(1,Math.round(actualDmg*move.recoil)); actor.hp=Math.max(0,actor.hp-r); msg+=` Le contrecoup blesse ${actor.name} (${r} dégâts) !`; }
  msg += koRetaliation(actor, move, defender);
  msg += applyMoveExtras(actor, move, defender, actualDmg);
  if(move.clearsHazards && actor.hp>0 && battleState){
    const spinLoc = locateActiveSlot(actor);
    const spinLogs = [];
    if(spinLoc && clearHazards(spinLoc.side, spinLogs)) msg += ' ' + spinLogs.join(' ');
  }
  if(move.selfDestruct){
    actor.hp = 0;
    msg += ` ${actor.name} est mis K.O. par le contrecoup de l'explosion !`;
  }
  if(move.triStatus && defender.hp>0 && Math.random()<0.2){
    const pick = rand(['brulure','gel','paralysie']);
    let tlogs = [];
    inflictStatus(defender, pick, tlogs);
    msg += ' ' + tlogs.join(' ');
  }
  if(move.secondaryStatus && defender.hp>0 && Math.random()<serene(actor, move.secondaryStatus.chance)){
    let slogs = [];
    inflictStatus(defender, move.secondaryStatus.status, slogs);
    msg += ' ' + slogs.join(' ');
  }
  if(actor.ability==='Chaîne Toxique' && defender.hp>0 && actualDmg>0 && !defender.status && !move.secondaryStatus && Math.random()<0.3){
    let clogs = [];
    inflictStatus(defender, 'poison', clogs);
    msg += ' ' + clogs.join(' ');
  }
  if(move.secondaryBoost && defender.hp>0 && Math.random()<serene(actor, move.secondaryBoost.chance)){
    if(defender.ability==='Corps Sain' && move.secondaryBoost.stages<0){
      msg += ` Corps Sain empêche la baisse de statistiques de ${defender.name} !`;
    } else if(defender.mistTurns>0 && move.secondaryBoost.stages<0){
      msg += ` La Brume protège ${defender.name} de la baisse de statistiques !`;
    } else {
      let blogs = [];
      applyStatBoost(defender, [{stat:move.secondaryBoost.stat, stages:move.secondaryBoost.stages}], blogs);
      if(defender.ability==='Compétiteur' && move.secondaryBoost.stages<0){
        applyStatBoost(defender, [{stat:'spa',stages:2}], blogs);
      }
      msg += ' ' + blogs.join(' ');
    }
  }
  if(move.secondarySelfBoost && Math.random()<serene(actor, move.secondarySelfBoost.chance)){
    let blogs = [];
    applyStatBoost(actor, [{stat:move.secondarySelfBoost.stat, stages:move.secondarySelfBoost.stages}], blogs);
    msg += ' ' + blogs.join(' ');
  }
  if(move.selfBoost){
    let blogs = [];
    applyStatBoost(actor, move.selfBoost, blogs);
    msg += ' ' + blogs.join(' ');
  }
  if(move.flinch && defender.hp>0 && defender.ability!=='Attention' && Math.random()<serene(actor, move.flinch)){
    defender.flinched = true;
    msg += ` ${defender.name} recule de peur !`;
  }
  if(move.itemRemoveOnHit && defender.hp>0 && defender.heldItem){
    defender.heldItem = null;
    msg += ` ${defender.name} perd son objet tenu à cause de Sabotage !`;
  }
  if(move.wakeAllOnHit){
    if(actor.status==='sommeil'){ actor.status=null; actor.sleepCounter=0; msg += ` ${actor.name} se réveille !`; }
    if(defender.status==='sommeil'){ defender.status=null; defender.sleepCounter=0; msg += ` ${defender.name} se réveille !`; }
  }
  if(defender.ability==='Déguisement' && defender.hp>0 && actualDmg>0){
    defender.transformedTypes = [move.type];
    msg += ` ${defender.name} devient de type ${move.type} grâce à Déguisement !`;
  }
  if(defender.ability==='Stoïcisme' && defender.hp>0 && actualDmg>0){
    let slogs2 = [];
    applyStatBoost(defender, [{stat:'def',stages:1}], slogs2);
    msg += ' ' + slogs2.join(' ');
  }
  if(move.cat==='phys' && defender.hp>0 && actor.hp>0 && actor.ability!=='Sans Contact'){
    if(defender.ability==='Peau Dure'){
      const rdmg = Math.max(1, Math.round(actor.maxHp/8));
      actor.hp = Math.max(0, actor.hp-rdmg);
      msg += ` ${actor.name} est blessé par Peau Dure (${rdmg} dégâts) !`;
    }
    if(defender.heldItem==='casqueBrutal'){
      const rdmg = Math.max(1, Math.round(actor.maxHp/6));
      actor.hp = Math.max(0, actor.hp-rdmg);
      msg += ` ${actor.name} est blessé par le Casque Brut de ${defender.name} (${rdmg} dégâts) !`;
    }
    if(defender.ability==='Point Gluant'){
      let glogs = [];
      applyStatBoost(actor, [{stat:'spe',stages:-1}], glogs);
      msg += ' ' + glogs.join(' ');
    }
    if(defender.ability==='Pickpocket' && !defender.heldItem && actor.heldItem){
      defender.heldItem = actor.heldItem;
      actor.heldItem = null;
      msg += ` ${defender.name} dérobe l'objet de ${actor.name} grâce à Pickpocket !`;
    }
    if(!actor.status){
      if(defender.ability==='Statik' && Math.random()<0.3){
        inflictStatus(actor, 'paralysie', logs);
        msg += ` ${logs.pop()}`;
      } else if(defender.ability==='Point Poison' && Math.random()<0.3){
        inflictStatus(actor, 'poison', logs);
        msg += ` ${logs.pop()}`;
      } else if(defender.ability==='Corps Ardent' && Math.random()<0.3){
        inflictStatus(actor, 'brulure', logs);
        msg += ` ${logs.pop()}`;
      }
    }
  }
  if(crit && defender.hp>0){
    if(defender.ability==='Colérique'){
      defender.stages.atk = 6;
      msg += ` L'Attaque de ${defender.name} monte au maximum !`;
    }
    if(defender.ability==='Écaille Spéciale'){
      defender.stages.def = Math.min(6, defender.stages.def+1);
      msg += ` La Défense de ${defender.name} augmente !`;
    }
  }
  if(defender.heldItem && !defender.itemUsed && defender.hp>0){
    const heldItem = ITEMS[defender.heldItem];
    if(heldItem && heldItem.berryHeal && defender.hp <= Math.floor(defender.maxHp*0.5)){
      let heal = Math.max(1, Math.round(defender.maxHp*heldItem.berryHeal));
      if(defender.ability==='Bajoues') heal = Math.round(heal*1.67);
      defender.hp = Math.min(defender.maxHp, defender.hp+heal);
      defender.itemUsed = true;
      defender.ateBerry = true;
      msg += ` ${defender.name} mange sa ${heldItem.name} et récupère des PV !`;
    }
  }
  if(actor.ability==='Magicien' && !actor.heldItem && defender.heldItem && defender.hp>0 && actualDmg>0){
    actor.heldItem = defender.heldItem;
    defender.heldItem = null;
    msg += ` ${actor.name} dérobe l'objet de ${defender.name} grâce à Magicien !`;
  }
  if(actor.ability==='Lien Parental' && !move.multiHit && !move.fixedDamage && !move.ohko && move.power>0 && defender.hp>0){
    const second = computeDamage(actor, { ...move, power: Math.round(move.power*0.5) }, defender);
    const applied2 = Math.min(second.dmg, defender.hp);
    defender.hp -= applied2;
    msg += ` Lien Parental permet une seconde frappe (${applied2} dégâts) !`;
  }
  let ejectMsg = '';
  if(defender.heldItem==='boutonFuite' && defender.hp>0 && battleState){
    const loc = locateActiveSlot(defender);
    if(loc){
      const bs = battleState;
      const roster = loc.side==='player' ? bs.player : bs.foe;
      const usedIdx = loc.side==='player' ? [bs.pActive, bs.pActive2] : [bs.fActive, bs.fActive2];
      const aliveIdx = roster.map((c,i)=> (c.hp>0 && !usedIdx.includes(i)) ? i : -1).filter(i=>i>=0);
      if(aliveIdx.length>0 && !defender.trapped){
        const newIdx = rand(aliveIdx);
        const entering = setActiveSlot(loc.side, loc.slot, newIdx);
        resetBattleFields(entering);
        ejectMsg = ` ${defender.name} est éjecté grâce à son Bouton Fuite ! ${entering.name} entre sur le terrain !`;
        const opponent = loc.side==='player' ? aliveFoeCombatants()[0] : alivePlayerCombatants()[0];
        if(opponent) ejectMsg += triggerIntimidate(entering, opponent) + triggerSwitchInAbilities(entering, opponent);
      }
    }
  }
  msg += ejectMsg;
  renderBattle();
  shakeBox(boxIdFor(defender), crit);
  if(crit) flashScreen('crit');
  else if(eff>1) flashScreen('superfx');
  setLog(msg);
  setTimeout(callback, btDelay(1000));
}

/* ---- Fin de tour, K.O. et remplacements ---- */
// Appelé après chaque tour : applique endOfTurnStatus (poison/brûlure/météo/Reste...), les dégâts
// de Vampigraine/racines/infestation, puis décompte tous les effets à durée limitée (écrans,
// entrave, Rune Protect, Provoc, Dynamax, compte à rebours, météo, terrain, Prescience, Bâillement)
// avant de passer à la gestion des K.O. éventuels.
function endTurn(){
  const bs = battleState;
  const playerCombatants = alivePlayerCombatants();
  const foeCombatants = aliveFoeCombatants();
  const all = [...playerCombatants, ...foeCombatants];
  let logs = [];
  all.forEach(c=> endOfTurnStatus(c, logs));
  if(bs.waterSportTurns>0){
    bs.waterSportTurns--;
    if(bs.waterSportTurns===0) logs.push('Les jets d\'eau de Tourniquet cessent.');
  }
  [['mudSportTurns','Les jets de boue de Lance-Boue cessent.'],['gravityTurns','La gravité revient à la normale.'],['wonderRoomTurns','La Zone Étrange se dissipe.'],['trickRoomTurns','La Distorsion se dissipe.']].forEach(([k,msg])=>{
    if(bs[k]>0){ bs[k]--; if(bs[k]===0) logs.push(msg); }
  });
  if(bs.tailwind){ ['player','foe'].forEach(s=>{ if(bs.tailwind[s]>0){ bs.tailwind[s]--; if(bs.tailwind[s]===0) logs.push('Le vent arrière retombe.'); } }); }
  if(bs.luckyChant){ ['player','foe'].forEach(s=>{ if(bs.luckyChant[s]>0) bs.luckyChant[s]--; }); }
  if(bs.pledgeFx){
    ['player','foe'].forEach(side=>{
      const fx = bs.pledgeFx[side];
      if(fx.fire>0){
        (side==='player' ? playerCombatants : foeCombatants).forEach(c=>{
          const types = c.transformedTypes || c.types || [];
          if(c.hp<=0 || types.includes('feu')) return;
          c.hp = Math.max(0, c.hp - Math.max(1, Math.round(c.maxHp/8)));
          logs.push(`${c.name} est brûlé par la mer de feu !`);
        });
      }
      [['rainbow',"L'arc-en-ciel disparaît."],['fire','La mer de feu se dissipe.'],['swamp','Le marécage se dessèche.']].forEach(([k,msg])=>{
        if(fx[k]>0){ fx[k]--; if(fx[k]===0) logs.push(msg); }
      });
    });
  }
  if(bs.magicRoomTurns>0){
    bs.magicRoomTurns--;
    if(bs.magicRoomTurns===0){ [...bs.player, ...bs.foe].forEach(restoreStashedItem); logs.push('La Zone Magique se dissipe : les objets fonctionnent de nouveau.'); }
  }
  bs.redirect = null;
  bs.ionDeluge = false;
  playerCombatants.forEach(c=>{
    if(c.hp>0 && c.seeded && foeCombatants.length){
      const opp = foeCombatants[0];
      const sdmg = Math.max(1, Math.round(c.maxHp/8));
      c.hp = Math.max(0, c.hp-sdmg);
      opp.hp = Math.min(opp.maxHp, opp.hp+sdmg);
      logs.push(`${c.name} perd des PV à cause de Vampigraine, ${opp.name} récupère !`);
    }
  });
  foeCombatants.forEach(c=>{
    if(c.hp>0 && c.seeded && playerCombatants.length){
      const opp = playerCombatants[0];
      const sdmg = Math.max(1, Math.round(c.maxHp/8));
      c.hp = Math.max(0, c.hp-sdmg);
      opp.hp = Math.min(opp.maxHp, opp.hp+sdmg);
      logs.push(`${c.name} perd des PV à cause de Vampigraine, ${opp.name} récupère !`);
    }
  });
  all.forEach(c=>{
    if(c.hp>0 && c.ingrained && c.hp<c.maxHp){
      const idmg = Math.max(1, Math.round(c.maxHp/16));
      c.hp = Math.min(c.maxHp, c.hp+idmg);
      logs.push(`${c.name} récupère des PV grâce à ses racines !`);
    }
    if(c.hp>0 && c.infested){
      const wdmg = Math.max(1, Math.round(c.maxHp/8));
      c.hp = Math.max(0, c.hp-wdmg);
      logs.push(`${c.name} souffre de l'infestation !`);
    }
  });
  all.forEach(c=>{
    c.lastPhysDamage = 0;
    c.lastSpecDamage = 0;
    c.protected = false;
    c.punishOnContact = false;
    c.enduring = false;
    c.magicCoat = false;
    c.snatching = false;
    c.hitThisTurn = false;
    c.hitPhysThisTurn = false;
    c.helped = false; c.quickGuard = false; c.wideGuard = false; c.powdered = false; c.electrified = false;
    if(c.healBlock>0) c.healBlock--;
    if(c.magnetRise>0) c.magnetRise--;
    if(c.telekinesis>0) c.telekinesis--;
    if(c.embargoTurns>0){ c.embargoTurns--; if(c.embargoTurns===0) restoreStashedItem(c); }
    if(c.roosted){ c.transformedTypes = c.roostTypes || null; c.roosted = false; }
    if(c.aquaRing && c.hp>0 && c.hp<c.maxHp && !(c.healBlock>0)){
      c.hp = Math.min(c.maxHp, c.hp + Math.max(1, Math.round(c.maxHp/16)));
      logs.push(`${c.name} récupère des PV grâce à l'Anneau Hydro !`);
    }
    if(c.throatChop>0) c.throatChop--;
    if(c.encoreTurns>0){
      c.encoreTurns--;
      if(c.encoreTurns===0){
        const choiceLocked = c.heldItem && ITEMS[c.heldItem] && ITEMS[c.heldItem].choiceLock;
        if(!choiceLocked && c.ability!=='Instinct Gorille') c.lockedMove = null;
        logs.push(`L'effet d'Encore sur ${c.name} prend fin.`);
      }
    }
    if(c.mistTurns>0){
      c.mistTurns--;
      if(c.mistTurns===0) logs.push(`La Brume protégeant ${c.name} se dissipe.`);
    }
    if(c.lightScreenTurns>0){
      c.lightScreenTurns--;
      if(c.lightScreenTurns===0) logs.push(`Le Mur Lumière de ${c.name} se dissipe.`);
    }
    if(c.reflectTurns>0){
      c.reflectTurns--;
      if(c.reflectTurns===0) logs.push(`La Protection de ${c.name} se dissipe.`);
    }
    if(c.disableTurns>0){
      c.disableTurns--;
      if(c.disableTurns===0){
        logs.push(`${c.name} n'est plus entravé.`);
        c.disabledMove = null;
      }
    }
    if(c.safeguardTurns>0){
      c.safeguardTurns--;
      if(c.safeguardTurns===0) logs.push(`Rune Protect protégeant ${c.name} se dissipe.`);
    }
    if(c.tauntTurns>0){
      c.tauntTurns--;
      if(c.tauntTurns===0) logs.push(`${c.name} n'est plus provoqué.`);
    }
    if(c.dynamaxed && c.dynamaxTurns>0){
      c.dynamaxTurns--;
      if(c.dynamaxTurns===0){
        revertDynamaxBoost(c);
        c.dynamaxed = false;
        logs.push(`${c.name} revient à sa taille normale.`);
      }
    }
    if(c.perishCounter>0 && c.hp>0){
      c.perishCounter--;
      if(c.perishCounter===0){
        c.hp = 0;
        logs.push(`Le compte à rebours de ${c.name} arrive à zéro, il est mis K.O. !`);
      } else {
        logs.push(`${c.name} sera K.O. dans ${c.perishCounter} tour${c.perishCounter>1?'s':''} !`);
      }
    }
  });
  if(bs.weather){
    bs.weather.turns--;
    if(bs.weather.turns<=0){
      logs.push(`${WEATHER_LABEL[bs.weather.type]} se dissipe.`);
      bs.weather = null;
    }
  }
  if(bs.terrain){
    if(bs.terrain.type==='grassy'){
      all.forEach(c=>{
        if(c.hp>0 && c.hp<c.maxHp){
          const heal = Math.max(1, Math.round(c.maxHp/16));
          c.hp = Math.min(c.maxHp, c.hp+heal);
          logs.push(`${c.name} récupère des PV grâce à la Zone Herbue !`);
        }
      });
    }
    bs.terrain.turns--;
    if(bs.terrain.turns<=0){
      logs.push(`${TERRAIN_LABEL[bs.terrain.type]} se dissipe.`);
      bs.terrain = null;
    }
  }
  if(bs.pendingFutureSight && bs.pendingFutureSight.length){
    bs.pendingFutureSight = bs.pendingFutureSight.filter(fs=>{
      fs.turnsLeft--;
      if(fs.turnsLeft<=0){
        const target = fs.target;
        if(target.hp>0){
          target.hp = Math.max(0, target.hp - fs.dmg);
          logs.push(`La force psychique de ${fs.moveName} s'abat sur ${target.name} ! (${fs.dmg} dégâts)`);
        } else {
          logs.push(`La force psychique de ${fs.moveName} ne trouve plus sa cible...`);
        }
        return false;
      }
      return true;
    });
  }
  if(bs.pendingYawn && bs.pendingYawn.length){
    bs.pendingYawn = bs.pendingYawn.filter(p=>{
      p.turnsLeft--;
      if(p.turnsLeft<=0){
        if(p.target.hp>0) inflictStatus(p.target, 'sommeil', logs);
        return false;
      }
      return true;
    });
  }
  const turnNow = bs.turnNo || 0;
  bs.faintTurn = bs.faintTurn || {};
  [bs.pActive, bs.pActive2].forEach(i=>{ if(i!=null && bs.player[i] && bs.player[i].hp<=0) bs.faintTurn.player = turnNow; });
  [bs.fActive, bs.fActive2].forEach(i=>{ if(i!=null && bs.foe[i] && bs.foe[i].hp<=0) bs.faintTurn.foe = turnNow; });
  bs.turnNo = turnNow + 1;
  bs.roundUsed = false; bs.fusionUsed = null;
  [...bs.player, ...bs.foe].forEach(c=>{ c.loweredThisTurn = false; });
  renderBattle();
  if(logs.length) setLog(logs.join(' '));
  handleFaintsAndAdvance();
}

// Vérifie l'état de fin de tour : victoire/défaite si une équipe entière est K.O., sinon fait
// entrer le prochain Pokémon adverse ou demande au joueur de choisir un remplaçant, sinon relance
// le tour suivant.
function handleFaintsAndAdvance(){
  const bs = battleState;
  if(allFainted(bs.player)){ setTimeout(()=> gameOver(), btDelay(700)); return; }
  if(allFainted(bs.foe)){ setTimeout(()=> floorCleared(), btDelay(900)); return; }

  const foeFaintedSlots = [];
  if(bs.fActive!=null && bs.foe[bs.fActive].hp<=0) foeFaintedSlots.push('A');
  if(bs.isDouble && bs.fActive2!=null && bs.foe[bs.fActive2].hp<=0) foeFaintedSlots.push('B');
  if(foeFaintedSlots.length){
    replaceFoeSlot(foeFaintedSlots[0], ()=> handleFaintsAndAdvance());
    return;
  }

  const playerFaintedSlots = [];
  if(bs.pActive!=null && bs.player[bs.pActive].hp<=0) playerFaintedSlots.push('A');
  if(bs.isDouble && bs.pActive2!=null && bs.player[bs.pActive2].hp<=0) playerFaintedSlots.push('B');
  if(playerFaintedSlots.length){
    const slot = playerFaintedSlots[0];
    document.getElementById(slot==='A' ? 'playerBox' : 'player2Box').classList.add('faint-fade');
    setLog(`<b>${bs.player[playerSlotIdx(slot)].name} est K.O. !</b>`);
    const usedIdx = [bs.pActive, bs.pActive2].filter(x=>x!=null);
    const aliveIdx = bs.player.map((c,i)=> (c.hp>0 && !usedIdx.includes(i)) ? i : -1).filter(i=>i>=0);
    if(aliveIdx.length===0){
      // Personne en réserve : en combat double, le slot K.O. se vide et le survivant passe en slot A.
      setTimeout(()=>{
        if(slot==='A'){ bs.pActive = bs.pActive2; bs.pActive2 = null; } else bs.pActive2 = null;
        bs.selectingSlot = 'A';
        renderBattle();
        handleFaintsAndAdvance();
      }, btDelay(700));
      return;
    }
    setTimeout(()=> showSwitchPrompt(aliveIdx, slot), btDelay(700));
    return;
  }

  beginPlayerTurn();
}

// Envoie le prochain Pokémon adverse après un K.O. (choix optimal pour un Maître de Type, sinon le premier vivant).
function replaceFoeSlot(slot, callback){
  const bs = battleState;
  const idx = slot==='A' ? bs.fActive : bs.fActive2;
  document.getElementById(slot==='A' ? 'foeBox' : 'foe2Box').classList.add('faint-fade');
  setLog(`<b>${bs.foe[idx].name} est K.O. !</b>`);
  const usedIdx = [bs.fActive, bs.fActive2].filter(x=>x!=null);
  const aiLevel = foeAiLevel(bs);
  const refPlayer = alivePlayerCombatants()[0];
  const nextIdx = aiLevel>=1
    ? bestFoeSwitchIdx(bs.foe, refPlayer, usedIdx, aiLevel)
    : bs.foe.findIndex((c,i)=> c.hp>0 && !usedIdx.includes(i));
  if(nextIdx===-1){
    // Plus de remplaçant : le slot se vide. Le seul survivant d'un combat double repasse en slot A (le rendu s'appuie sur fActive).
    if(slot==='A'){ bs.fActive = bs.fActive2; bs.fActive2 = null; } else bs.fActive2 = null;
    setTimeout(callback, btDelay(300));
    return;
  }
  setActiveSlot('foe', slot, nextIdx);
  resetBattleFields(bs.foe[nextIdx]);
  setTimeout(()=>{
    const newFoe = bs.foe[nextIdx];
    const p = alivePlayerCombatants()[0];
    const intimMsg = p ? (triggerIntimidate(newFoe, p) + triggerSwitchInAbilities(newFoe, p)) : '';
    setLog(`L'adversaire envoie ${newFoe.name} !${intimMsg}`);
    renderBattle();
    pulseSprite(slot==='A' ? 'foe' : 'foe2', 'switch-in-fx');
    callback();
  }, btDelay(900));
}

// Affiche l'écran de choix forcé du prochain Pokémon après un K.O. du joueur.
function showSwitchPrompt(aliveIdx, slot){
  slot = slot || 'A';
  const bs = battleState;
  const zBanner = document.querySelector('.zmove-banner');
  if(zBanner) zBanner.remove();
  document.getElementById('movesGrid').classList.add('hidden');
  document.getElementById('mechanicsGrid').classList.add('hidden');
  document.getElementById('movesHeader').classList.add('hidden');
  document.getElementById('battleActionsToggleBtn').classList.add('hidden');
  document.getElementById('movesPanelActionsRevealed').classList.add('hidden');
  document.getElementById('cancelSwitchBtn').classList.add('hidden');
  const sw = document.getElementById('switchGrid');
  sw.classList.remove('hidden');
  sw.innerHTML='';
  setLog(`Choisis ton prochain Pokémon !`);
  aliveIdx.forEach(i=>{
    const c = bs.player[i];
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:4px;';
    const btn = document.createElement('button');
    btn.className = 'move-btn';
    btn.style.flex = '1';
    btn.innerHTML = `<span style="display:inline-block;width:30px;height:30px;vertical-align:middle;margin-right:6px;">${getSpriteHTML(c.name, c.unownForm, 'front', false, c.shiny)}</span>${c.name}${c.shiny?shinyBadgeHTML():''} <small>${(c.transformedTypes||c.types).map(t=>typeTagHTML(t)).join(' ')} · ${c.hp} / ${c.maxHp} PV<br>${c.moves.map(mv=>mv.name).join(' · ')}</small>`;
    btn.onclick = ()=>{
      if(slot==='A') bs.pActive = i; else bs.pActive2 = i;
      resetBattleFields(c);
      sw.classList.add('hidden');
      renderBattle();
      pulseSprite(slot==='A' ? 'player' : 'player2', 'switch-in-fx');
      const opponent = aliveFoeCombatants()[0];
      const intimMsg = opponent ? (triggerIntimidate(c, opponent) + triggerSwitchInAbilities(c, opponent)) : '';
      setLog(`Tu envoies ${c.name} !${intimMsg}`);
      renderBattle();
      handleFaintsAndAdvance();
    };
    const detailBtn = document.createElement('button');
    detailBtn.className = 'move-btn';
    detailBtn.style.cssText = 'flex:0 0 auto;width:34px;font-size:14px;';
    detailBtn.title = 'Voir les détails';
    detailBtn.innerHTML = phIcon('magnifying-glass');
    detailBtn.onclick = (e)=>{ e.stopPropagation(); openBattlerDetail(battlerDetailView(c)); };
    row.appendChild(btn);
    row.appendChild(detailBtn);
    sw.appendChild(row);
  });
}
