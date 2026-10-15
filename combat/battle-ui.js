/* ==== SOMMAIRE ====
   Affichage de l'écran de combat et gestion des clics du joueur (grille de capacités, switch,
   sac, cible en combat double). Repères :
   - L.11-24 : clearLog/setLog/renderBench — journal de combat + rangée de Poké Balls (équipe)
   - L.26-77 : renderCombatantBox/renderBattle — affiche l'état complet d'un/des combattant(s)
   - L.79-fin(157) : renderMoveGrid — construit la grille de boutons d'attaque (+ boutons Capacité
     Z/Dynamax, aperçu de la capacité surboostée)
   - L.159-fin(295): gestion des clics — choix d'attaque (avec choix de cible en double), switch
     manuel, sac (Potion), et les petites animations (shakeBox/lungeBox/flashScreen)
==== */
// Repère visuel d'efficacité de type sur un bouton d'attaque (▲▲ hyper efficace ×4, ▲ super efficace
// ×2, ▼ peu efficace, ▼▼ très peu efficace ×0.25, icône "interdit" aucun effet) — rien si neutre, si la capacité
// n'inflige pas de dégâts, ou si aucune cible sans ambiguïté n'est fournie (voir effTarget dans
// renderMoveGrid, désactivable dans les Paramètres).
function moveEffectivenessBadgeHTML(move, defender){
  if(!defender || move.cat==='status' || !move.power) return '';
  const eff = getMult(move.type, defender.transformedTypes || defender.types);
  if(eff===1) return '';
  if(eff===0) return ` <span class="eff-badge eff-none" title="Aucun effet">${phIcon('prohibit')}</span>`;
  if(eff>=4) return ` <span class="eff-badge eff-hyper" title="Hyper efficace (×${eff})">▲▲</span>`;
  if(eff>1) return ` <span class="eff-badge eff-super" title="Super efficace (×${eff})">▲</span>`;
  return ` <span class="eff-badge eff-weak" title="${eff<=0.25?'Très peu efficace':'Peu efficace'} (×${eff})">▼${eff<=0.25?'▼':''}</span>`;
}
function clearLog(){ document.getElementById('log').innerHTML = ''; }
// Ajoute une ligne au journal de combat (garde au plus 60 lignes, scroll auto vers le bas).
function setLog(html){
  if(!html) return;
  const el = document.getElementById('log');
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = html;
  el.appendChild(entry);
  while(el.children.length > 60){ el.removeChild(el.firstChild); }
  el.scrollTop = el.scrollHeight;
}

// Rangée de Poké Balls représentant toute l'équipe (vivant/K.O./actif), affichée sous le terrain de combat.
function renderBench(containerId, roster, activeIdxs, hazards, pledge){
  const el = document.getElementById(containerId);
  el.innerHTML='';
  const actives = Array.isArray(activeIdxs) ? activeIdxs : [activeIdxs];
  roster.forEach((c,i)=>{
    const span = document.createElement('div');
    span.className = 'pokeball-icon' + (c.hp>0?' alive':' fainted') + (actives.includes(i)?' active':'');
    span.title = c.name;
    el.appendChild(span);
  });
  if(hazards){
    const chips = [];
    if(hazards.rocks) chips.push({ icon:phIcon('mountains'), label:HAZARD_LABEL.rocks });
    if(hazards.spikes) chips.push({ icon:phIcon('triangle')+hazards.spikes, label:`${HAZARD_LABEL.spikes} (${hazards.spikes}/3)` });
    if(hazards.toxic) chips.push({ icon:phIcon('skull')+hazards.toxic, label:`${HAZARD_LABEL.toxic} (${hazards.toxic}/2)` });
    if(hazards.web) chips.push({ icon:phIcon('asterisk'), label:HAZARD_LABEL.web });
    chips.forEach(ch=>{
      const chip = document.createElement('span');
      chip.className = 'hazard-chip';
      chip.innerHTML = ch.icon;
      chip.title = ch.label;
      el.appendChild(chip);
    });
  }
  if(pledge){
    ['rainbow','fire','swamp'].forEach(k=>{
      if(!(pledge[k]>0)) return;
      const chip = document.createElement('span');
      chip.className = 'hazard-chip';
      chip.innerHTML = phIcon(PLEDGE_ICON[k]);
      chip.title = `${PLEDGE_LABEL[k]} (${pledge[k]} tour${pledge[k]>1?'s':''})`;
      el.appendChild(chip);
    });
  }
}

// Met à jour l'affichage complet d'un combattant actif : nom, types, icône de statut, badges de
// changement de stats, sprite, barre et texte de PV.
function renderCombatantBox(c, prefix){
  document.getElementById(prefix+'Box').classList.remove('faint-fade');
  document.getElementById(prefix+'Name').innerHTML = c.name + (c.shiny ? shinyBadgeHTML() : '');
  const typeTag = document.getElementById(prefix+'Type');
  typeTag.innerHTML = (c.transformedTypes||c.types).map(t=>typeBadgeIconHTML(t)).join('');

  const box = document.getElementById(prefix+'Box');
  let badge = box.querySelector('.status-icon-badge');
  if(c.status){
    if(!badge){ badge = document.createElement('div'); badge.className='status-icon-badge'; box.appendChild(badge); }
    badge.innerHTML = statusIconHTML(c.status, 18);
    badge.title = STATUS_LABEL[c.status];
  } else if(badge){
    badge.remove();
  }

  let statBadgesEl = document.getElementById(prefix+'StatBadges');
  if(!statBadgesEl){
    statBadgesEl = document.createElement('div');
    statBadgesEl.className = 'stat-badges';
    statBadgesEl.id = prefix+'StatBadges';
    document.getElementById(prefix+'HpText').insertAdjacentElement('afterend', statBadgesEl);
  }
  statBadgesEl.innerHTML = ['atk','def','spa','spd','spe'].map(stat=>{
    const stage = c.stages ? c.stages[stat] : 0;
    if(!stage) return '';
    const cls = stage>0 ? 'boost' : 'nerf';
    const sign = stage>0 ? '+' : '';
    return `<span class="stat-badge ${cls}">${STAT_LABEL[stat]} ${sign}${stage}</span>`;
  }).join('');
  if(c.confuseCounter>0){
    statBadgesEl.innerHTML += `<span class="stat-badge nerf">${statusIconHTML('confusion',10)} Confus</span>`;
  }
  const facing = prefix.startsWith('player') ? 'back' : 'front';
  document.getElementById(prefix+'Sprite').innerHTML = getSpriteHTML(c.name, c.unownForm, facing, true, c.shiny);
  const ratio = Math.max(c.hp,0)/c.maxHp;
  const fill = document.getElementById(prefix+'HpFill');
  fill.style.width = (ratio*100)+'%';
  fill.style.background = ratio>0.5?'var(--good)':(ratio>0.2?'var(--mid)':'var(--low)');
  document.getElementById(prefix+'HpText').textContent = `${Math.max(c.hp,0)} / ${c.maxHp} PV`;
}

// Point d'entrée principal d'affichage : redessine tout l'écran de combat (1 ou 2 combattants par
// camp selon solo/double, bandeau météo, bancs d'équipe) puis la grille de capacités.
function renderBattle(){
  const bs = battleState;
  const p = bs.player[bs.pActive], f = bs.foe[bs.fActive];
  renderCombatantBox(p, 'player');
  renderCombatantBox(f, 'foe');
  const showP2 = !!(bs.isDouble && bs.pActive2!=null && bs.player[bs.pActive2]);
  const showF2 = !!(bs.isDouble && bs.fActive2!=null && bs.foe[bs.fActive2]);
  document.getElementById('player2Box').classList.toggle('hidden', !showP2);
  document.getElementById('foe2Box').classList.toggle('hidden', !showF2);
  if(showP2) renderCombatantBox(bs.player[bs.pActive2], 'player2');
  if(showF2) renderCombatantBox(bs.foe[bs.fActive2], 'foe2');
  document.getElementById('screenBattle').classList.toggle('is-double-battle', !!bs.isDouble);
  renderBench('playerBench', bs.player, showP2 ? [bs.pActive, bs.pActive2] : [bs.pActive], bs.hazards && bs.hazards.player, bs.pledgeFx && bs.pledgeFx.player);
  renderBench('foeBench', bs.foe, showF2 ? [bs.fActive, bs.fActive2] : [bs.fActive], bs.hazards && bs.hazards.foe, bs.pledgeFx && bs.pledgeFx.foe);
  document.getElementById('weatherBanner').textContent = bs.weather ? `${WEATHER_LABEL[bs.weather.type]} (${bs.weather.turns} tour${bs.weather.turns>1?'s':''} restant${bs.weather.turns>1?'s':''})` : '';
  renderMoveGrid();
}

// Construit la grille de boutons d'attaque du Pokémon en train de choisir : Lutte si plus de PP,
// bouton Capacité Z / indicateur ou bouton Dynamax (mutuellement exclusifs), puis les 4 capacités
// avec leur aperçu Capacité Z/Max si applicable et leur état (PP épuisés, entravée, bloquée par un objet Choix).
// Construit un bouton compact de la colonne mécaniques (icône + libellé) ; grisé et non cliquable
// si indisponible, mais toujours affiché pour garder la colonne à hauteur fixe.
function buildMechButton(icon, label, available, isActive, tooltip, onClick){
  const btn = document.createElement('button');
  btn.className = 'mech-btn' + (isActive ? ' active' : '');
  btn.disabled = !available || battleState.locked;
  btn.title = tooltip || '';
  btn.innerHTML = `<span class="mech-icon">${icon}</span><span class="mech-label">${label}</span>`;
  if(available && onClick) btn.onclick = onClick;
  return btn;
}
// Construit un indicateur (non cliquable) montrant qu'une mécanique est déjà active ce combat.
function buildMechIndicator(icon, label, tooltip){
  const el = document.createElement('div');
  el.className = 'mech-btn active';
  el.style.cursor = 'default';
  el.title = tooltip || '';
  el.innerHTML = `<span class="mech-icon">${icon}</span><span class="mech-label">${label}</span>`;
  return el;
}
function renderMoveGrid(){
  const bs = battleState;
  const slot = bs.selectingSlot || 'A';
  const activeIdx = playerSlotIdx(slot);
  const p = bs.player[activeIdx];
  const grid = document.getElementById('movesGrid');
  const mechGrid = document.getElementById('mechanicsGrid');
  const header = document.getElementById('movesHeader');
  const oldZBanner = grid.parentNode.querySelector('.zmove-banner');
  if(oldZBanner) oldZBanner.remove();
  grid.innerHTML='';
  mechGrid.innerHTML='';
  document.getElementById('switchGrid').classList.add('hidden');
  grid.classList.remove('hidden');
  // Les écrans de choix (Pokémon suivant après un K.O., cible, changement, sac) masquent la colonne des
  // mécaniques : on la réaffiche à chaque retour à la grille d'attaques, sinon Dynamax/Méga/Téra disparaissent
  // pour tous les combats suivants.
  mechGrid.classList.remove('hidden');
  header.classList.toggle('hidden', !bs.isDouble);
  if(bs.isDouble) header.textContent = `Choisis l'attaque pour ${p.name}`;
  document.getElementById('battleActionsToggleBtn').classList.remove('hidden');
  document.getElementById('cancelSwitchBtn').classList.add('hidden');
  document.getElementById('manualSwitchBtn').disabled = bs.locked;
  document.getElementById('bagBtn').disabled = bs.locked;
  const allOutOfPP = p.moves.every((mv,idx)=> (p.ppCur ? p.ppCur[idx] : 1) <= 0);
  if(allOutOfPP){
    const btn = document.createElement('button');
    btn.className = 'move-btn';
    btn.disabled = bs.locked;
    btn.innerHTML = `${STRUGGLE_MOVE.name} <small>Plus aucun PP disponible · Attaque de dernier recours (blesse aussi l'utilisateur)</small>`;
    btn.onclick = ()=> handleMoveChoice(-1);
    grid.appendChild(btn);
    return;
  }
  // Colonne fixe de 4 boutons compacts (icône + libellé), toujours affichés dans le même ordre
  // (Dynamax / Méga / Téracristallisation / Capacité Z) pour que la colonne garde toujours la même hauteur et
  // reste alignée avec le bloc d'attaques — actif/disponible/indisponible plutôt qu'apparaître et
  // disparaître. Le détail va dans le title (tooltip) pour rester compact. Les 4 mécaniques sont
  // mutuellement exclusives pour le tour en cours (activer l'une désactive la déclaration des autres) ;
  // un Pokémon déjà Dynamax/Téracristallisé/Méga-Évolué ne peut pas en déclarer une autre par-dessus.
  const mechActive = p.dynamaxed || p.teraActive || p.megaEvolved;
  if(!canDeclareZMove(p, bs) || mechActive) bs.declaringZMove = false;
  // Dynamax
  if(p.dynamaxed){
    mechGrid.appendChild(buildMechIndicator(phIcon('circle'),'Dynamax',`${p.dynamaxTurns} tour${p.dynamaxTurns>1?'s':''} restant${p.dynamaxTurns>1?'s':''}`));
  } else {
    const available = canDynamax(p, bs) && !bs.declaringZMove && !bs.declaringTera && !bs.declaringMega && !mechActive;
    mechGrid.appendChild(buildMechButton(phIcon('circle'),'Dynamax', available, bs.declaringDynamax,
      bs.declaringDynamax ? 'Dynamax activé — clique pour annuler' : (available ? 'Toutes les capacités offensives deviennent Max pendant 3 tours' : (bs.dynamaxUsed ? 'Déjà utilisé ce combat' : (!hasKeyItem('braceletDynamax') ? 'Nécessite le Bracelet Dynamax (Pokéshop, onglet Bracelets)' : 'Indisponible pour le moment'))),
      ()=>{ bs.declaringDynamax = !bs.declaringDynamax; if(bs.declaringDynamax){ bs.declaringZMove = false; bs.declaringTera = false; bs.declaringMega = false; } renderMoveGrid(); }));
    if(!available) bs.declaringDynamax = false;
  }
  // Méga-Évolution : se déclare en combat comme le Téracristal (plus une transformation acquise avant le
  // combat), dure jusqu'à la fin du combat même en cas de changement de Pokémon, une fois par combat.
  if(p.megaEvolved){
    mechGrid.appendChild(buildMechIndicator(phIcon('diamond'),'Méga','Méga-Évolué — jusqu\'à la fin du combat'));
  } else {
    const available = canMegaEvolve(p, bs) && !bs.declaringZMove && !bs.declaringDynamax && !bs.declaringTera && !mechActive;
    let megaTip;
    if(bs.declaringMega) megaTip = 'Méga-Évolution activée — clique pour annuler';
    else if(available) megaTip = 'Se Méga-Évolue au prochain coup, pour le reste du combat';
    else if(bs.megaUsed) megaTip = 'Déjà utilisée ce combat';
    else if(!hasKeyItem('megaBracelet')) megaTip = 'Nécessite le Méga-Bracelet (Pokéshop, onglet Bracelets)';
    else if(!p.megaFormData) megaTip = 'Nécessite la Méga-Gemme correspondante en objet tenu';
    else megaTip = 'Indisponible pour le moment';
    mechGrid.appendChild(buildMechButton(phIcon('diamond'),'Méga', available, bs.declaringMega, megaTip,
      ()=>{ bs.declaringMega = !bs.declaringMega; if(bs.declaringMega){ bs.declaringZMove = false; bs.declaringDynamax = false; bs.declaringTera = false; } renderMoveGrid(); }));
    if(!available) bs.declaringMega = false;
  }
  // Téracristallisation
  if(p.teraActive){
    mechGrid.appendChild(buildMechIndicator(typeIconHTML(p.teraType),'Téracristal',`Téracristallisé — Type Tera : ${p.teraType}`));
  } else {
    const available = canTerastallize(p, bs) && !bs.declaringZMove && !bs.declaringMega && !p.dynamaxed;
    mechGrid.appendChild(buildMechButton(phIcon('diamond'),'Téracristal', available, bs.declaringTera,
      bs.declaringTera ? 'Téracristallisation activée — clique pour annuler' : (available ? `Devient mono-type ${p.teraType} pour le reste du combat` : "Nécessite l'Orbe Tera en objet tenu"),
      ()=>{ bs.declaringTera = !bs.declaringTera; if(bs.declaringTera){ bs.declaringZMove = false; bs.declaringDynamax = false; bs.declaringMega = false; } renderMoveGrid(); }));
    if(!available) bs.declaringTera = false;
  }
  // Capacité Z : bouton de la colonne comme les autres mécaniques, grisé tant qu'aucune capacité offensive
  // ne correspond au Cristal Z tenu (ou si la Capacité Z a déjà servi ce combat).
  const zAvailable = canDeclareZMove(p, bs) && !mechActive && !bs.declaringDynamax && !bs.declaringTera && !bs.declaringMega;
  let zTip;
  if(bs.declaringZMove) zTip = 'Capacité Z activée — clique pour annuler, ou choisis la capacité à surboosster';
  else if(zAvailable) zTip = 'Choisis ensuite la capacité offensive à transformer en Capacité Z (une fois par combat)';
  else if(bs.zMoveUsed) zTip = 'Déjà utilisée ce combat';
  else if(!hasKeyItem('braceletZ')) zTip = 'Nécessite le Bracelet Z (Pokéshop, onglet Bracelets)';
  else if(!zCrystalHeldBy(p)) zTip = "Nécessite un Cristal Z en objet tenu, du même type qu'une de tes attaques offensives";
  else zTip = 'Indisponible : aucune attaque offensive du type du Cristal Z avec des PP restants';
  mechGrid.appendChild(buildMechButton(phIcon('lightning'),'Z', zAvailable || bs.declaringZMove, bs.declaringZMove, zTip,
    ()=>{ bs.declaringZMove = !bs.declaringZMove; if(bs.declaringZMove){ bs.declaringDynamax = false; bs.declaringTera = false; bs.declaringMega = false; } renderMoveGrid(); }));
  const zEligible = bs.declaringZMove ? eligibleZMoveIndexes(p) : null;
  const dynamaxPreview = bs.declaringDynamax || p.dynamaxed;
  // Repère d'efficacité (désactivable dans les Paramètres — voir ui/music.js) : seulement quand la
  // cible est sans ambiguïté (un seul ennemi vivant), sinon on ne devine pas laquelle sera visée.
  const foesNow = aliveFoeCombatants();
  const effTarget = (showMoveEffectiveness && foesNow.length===1) ? foesNow[0] : null;
  p.moves.forEach((mv, idx)=>{
    const btn = document.createElement('button');
    btn.className='move-btn';
    const isDisabled = (p.disabledMove && p.disabledMove.name===mv.name) || (p.tormented && p.lastMoveUsed && p.lastMoveUsed.name===mv.name);
    const isLockedOut = p.lockedMove && p.lockedMove.name!==mv.name;
    const ppCur = p.ppCur ? p.ppCur[idx] : null;
    const ppMax = basePP(mv);
    const noPP = ppCur!==null && ppCur<=0;
    const zReady = zEligible && zEligible.includes(idx);
    const zBlocked = zEligible && !zReady;
    const maxReady = dynamaxPreview && (mv.cat==='phys'||mv.cat==='spec');
    btn.disabled = bs.locked || isDisabled || isLockedOut || noPP || zBlocked;
    if(zReady){
      const zPreview = buildZMove(mv);
      btn.innerHTML = `${phIcon('lightning')} ${zPreview.name}${moveEffectivenessBadgeHTML(zPreview, effTarget)} <small>${typeIconHTML(mv.type)} ${mv.type} · Pwr ${zPreview.power} · via ${mv.name}</small>`;
    } else if(maxReady){
      const maxPreview = buildMaxMove(mv, p, null, null);
      btn.innerHTML = `${phIcon('circle')} ${maxPreview.name}${moveEffectivenessBadgeHTML(maxPreview, effTarget)} <small>${typeIconHTML(mv.type)} ${mv.type} · Pwr ${maxPreview.power} · via ${mv.name}</small>`;
    } else {
      btn.innerHTML = `${mv.name}${isDisabled?' '+phIcon('prohibit'):''}${isLockedOut?' '+phIcon('lock-simple'):''}${moveEffectivenessBadgeHTML(mv, effTarget)} <small>${typeIconHTML(mv.type)} ${mv.type} · ${mv.cat==='phys'?'Phys':(mv.cat==='spec'?'Spéc':'Statut')} · ${mv.cat==='status'?'—':'Pwr '+mv.power} · PP ${ppCur!==null?ppCur:'?'}/${ppMax}${isDisabled?' · Entravé':''}${isLockedOut?(p.encoreTurns>0?' · Encore':" · Bloqué par l'objet"):''}</small>`;
    }
    btn.onclick = ()=> handleMoveChoice(idx);
    grid.appendChild(btn);
  });
}

// Clic sur une capacité : demande la cible d'abord si combat double avec 2 ennemis vivants, sinon attaque directement.
function handleMoveChoice(moveIdx){
  const bs = battleState;
  if(bs.locked) return;
  const slot = bs.selectingSlot || 'A';
  const activeIdx = playerSlotIdx(slot);
  const p = bs.player[activeIdx];
  const move = moveIdx===-1 ? STRUGGLE_MOVE : p.moves[moveIdx];
  const foes = aliveFoeCombatants();
  // Capacités qui font changer de Pokémon après coup (Demi-Tour, Change Éclair, Relais...) : demande
  // le remplaçant AVANT l'attaque s'il y a un vrai choix à faire (voir pendingSelfSwitchIdx dans
  // combat/status-effects.js, qui utilise ce choix plutôt qu'un tirage aléatoire).
  if(move.effect && move.effect.selfSwitch){
    const usedIdx = [bs.pActive, bs.pActive2].filter(x=>x!=null);
    const switchCandidates = bs.player.map((c,i)=> (c.hp>0 && !usedIdx.includes(i)) ? i : -1).filter(i=>i>=0);
    if(switchCandidates.length>1){
      promptSelfSwitchThenAttack(moveIdx, move, switchCandidates, foes);
      return;
    }
  }
  if(bs.isDouble && move.target!=='self' && foes.length>1){
    promptTargetThenAttack(moveIdx, move, foes);
    return;
  }
  playerAttack(moveIdx);
}

// Affiche l'écran de choix du remplaçant pour une capacité comme Demi-Tour/Change Éclair/Relais,
// avant de lancer l'attaque (voir handleMoveChoice). Enchaîne ensuite sur le choix de cible si la
// capacité touche un adversaire en combat double.
function promptSelfSwitchThenAttack(moveIdx, move, switchCandidates, foes){
  const bs = battleState;
  document.getElementById('movesGrid').classList.add('hidden');
  document.getElementById('mechanicsGrid').classList.add('hidden');
  document.getElementById('movesHeader').classList.add('hidden');
  document.getElementById('battleActionsToggleBtn').classList.add('hidden');
  document.getElementById('movesPanelActionsRevealed').classList.add('hidden');
  document.getElementById('cancelSwitchBtn').classList.remove('hidden');
  const sw = document.getElementById('switchGrid');
  sw.classList.remove('hidden');
  sw.innerHTML = `<div class="dex-rate" style="text-align:center;margin-bottom:6px;">${move.name} — qui entre après l'attaque ?</div>`;
  switchCandidates.forEach(i=>{
    const c = bs.player[i];
    const btn = document.createElement('button');
    btn.className='move-btn';
    btn.innerHTML = `<span style="display:inline-block;width:30px;height:30px;vertical-align:middle;margin-right:6px;">${getSpriteHTML(c.name, c.unownForm, 'front', false, c.shiny)}</span>${c.name}${c.shiny?shinyBadgeHTML():''} <small>${c.hp} / ${c.maxHp} PV</small>`;
    btn.onclick = ()=>{
      const slot = bs.selectingSlot || 'A';
      const activeIdx = playerSlotIdx(slot);
      bs.player[activeIdx].pendingSelfSwitchIdx = i;
      document.getElementById('cancelSwitchBtn').classList.add('hidden');
      if(bs.isDouble && move.target!=='self' && foes.length>1){
        promptTargetThenAttack(moveIdx, move, foes);
      } else {
        playerAttack(moveIdx);
      }
    };
    sw.appendChild(btn);
  });
}

// Affiche l'écran de choix de cible (combat double, capacité offensive) avant de lancer l'attaque —
// avec le repère d'efficacité (voir moveEffectivenessBadgeHTML) propre à chaque cible possible,
// puisqu'en double la cible n'est plus implicite comme avec un seul adversaire en vie.
function promptTargetThenAttack(moveIdx, move, foes){
  const bs = battleState;
  document.getElementById('movesGrid').classList.add('hidden');
  document.getElementById('mechanicsGrid').classList.add('hidden');
  document.getElementById('movesHeader').classList.add('hidden');
  document.getElementById('battleActionsToggleBtn').classList.add('hidden');
  document.getElementById('movesPanelActionsRevealed').classList.add('hidden');
  document.getElementById('cancelSwitchBtn').classList.remove('hidden');
  const sw = document.getElementById('switchGrid');
  sw.classList.remove('hidden');
  sw.innerHTML = `<div class="dex-rate" style="text-align:center;margin-bottom:6px;">Choisis la cible :</div>`;
  foes.forEach(f=>{
    const targetIdx = bs.foe.indexOf(f);
    const btn = document.createElement('button');
    btn.className='move-btn';
    btn.innerHTML = `<span style="display:inline-block;width:30px;height:30px;vertical-align:middle;margin-right:6px;">${getSpriteHTML(f.name, f.unownForm)}</span>${f.name}${showMoveEffectiveness?moveEffectivenessBadgeHTML(move, f):''} <small>${f.hp} / ${f.maxHp} PV</small>`;
    btn.onclick = ()=>{
      document.getElementById('cancelSwitchBtn').classList.add('hidden');
      playerAttack(moveIdx, targetIdx);
    };
    sw.appendChild(btn);
  });
}

// Ouvre l'écran de changement de Pokémon volontaire (liste des membres vivants non déjà sur le terrain).
function openManualSwitch(){
  const bs = battleState;
  if(bs.locked) return;
  const slot = bs.selectingSlot || 'A';
  const activeIdx = playerSlotIdx(slot);
  if(bs.player[activeIdx].trapped){ setLog(`${bs.player[activeIdx].name} ne peut pas s'échapper !`); return; }
  const usedIdx = [bs.pActive, bs.pActive2].filter(x=>x!=null);
  const aliveIdx = bs.player.map((c,i)=> (c.hp>0 && !usedIdx.includes(i)) ? i : -1).filter(i=>i>=0);
  if(aliveIdx.length===0){ setLog("Aucun autre Pokémon disponible pour switcher !"); return; }
  document.getElementById('movesGrid').classList.add('hidden');
  document.getElementById('mechanicsGrid').classList.add('hidden');
  document.getElementById('movesHeader').classList.add('hidden');
  document.getElementById('battleActionsToggleBtn').classList.add('hidden');
  document.getElementById('movesPanelActionsRevealed').classList.add('hidden');
  document.getElementById('cancelSwitchBtn').classList.remove('hidden');
  const sw = document.getElementById('switchGrid');
  sw.classList.remove('hidden');
  sw.innerHTML='';
  aliveIdx.forEach(i=>{
    const c = bs.player[i];
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:4px;';
    const btn = document.createElement('button');
    btn.className='move-btn';
    btn.style.flex = '1';
    btn.innerHTML = `<span style="display:inline-block;width:30px;height:30px;vertical-align:middle;margin-right:6px;">${getSpriteHTML(c.name, c.unownForm, 'front', false, c.shiny)}</span>${c.name}${c.shiny?shinyBadgeHTML():''} <small>${(c.transformedTypes||c.types).map(t=>typeTagHTML(t)).join(' ')} · ${c.hp} / ${c.maxHp} PV<br>${c.moves.map(mv=>mv.name).join(' · ')}</small>`;
    btn.onclick = ()=> doVoluntarySwitch(i, slot);
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
// Referme l'écran de switch/cible/sac et réaffiche la grille de capacités normale.
function closeManualSwitch(){
  const bs = battleState;
  document.getElementById('switchGrid').classList.add('hidden');
  document.getElementById('movesGrid').classList.remove('hidden');
  document.getElementById('mechanicsGrid').classList.remove('hidden');
  document.getElementById('movesHeader').classList.toggle('hidden', !(bs && bs.isDouble));
  document.getElementById('battleActionsToggleBtn').classList.remove('hidden');
  document.getElementById('movesPanelActionsRevealed').classList.add('hidden');
  document.getElementById('cancelSwitchBtn').classList.add('hidden');
}
// Ouvre l'écran de sélection de cible pour utiliser une Potion du sac en combat.
function openBag(){
  const bs = battleState;
  if(bs.locked) return;
  if((bag.potion||0)<=0){ setLog("Tu n'as aucune Potion dans ton sac ! Achètes-en au Village."); return; }
  document.getElementById('movesGrid').classList.add('hidden');
  document.getElementById('mechanicsGrid').classList.add('hidden');
  document.getElementById('movesHeader').classList.add('hidden');
  document.getElementById('battleActionsToggleBtn').classList.add('hidden');
  document.getElementById('movesPanelActionsRevealed').classList.add('hidden');
  document.getElementById('cancelSwitchBtn').classList.remove('hidden');
  const sw = document.getElementById('switchGrid');
  sw.classList.remove('hidden');
  sw.innerHTML = `<div class="dex-rate" style="text-align:center;margin-bottom:6px;">${itemIconHTML('potion',18)} Potion (${bag.potion} restante${bag.potion>1?'s':''}) — choisis la cible :</div>`;
  let any = false;
  bs.player.forEach((c,i)=>{
    if(c.hp<=0 || c.hp>=c.maxHp) return;
    any = true;
    const btn = document.createElement('button');
    btn.className='move-btn';
    btn.innerHTML = `<span style="display:inline-block;width:30px;height:30px;vertical-align:middle;margin-right:6px;">${getSpriteHTML(c.name, c.unownForm, 'front', false, c.shiny)}</span>${c.name}${c.shiny?shinyBadgeHTML():''} <small>${c.hp} / ${c.maxHp} PV</small>`;
    btn.onclick = ()=> useBagPotion(i);
    sw.appendChild(btn);
  });
  if(!any){
    sw.innerHTML += `<div class="dex-rate" style="text-align:center;">Toute ton équipe est déjà à PV max !</div>`;
  }
}
// Secoue la boîte d'un combattant touché (tremblement plus fort sur un coup critique).
function shakeBox(id, crit){
  const box = document.getElementById(id);
  if(!box) return;
  box.classList.remove('shake','crit-shake');
  void box.offsetWidth;
  box.classList.add(crit ? 'crit-shake' : 'shake');
}
// Anime un petit bond en avant de l'attaquant au moment où il attaque.
function lungeBox(id){
  const box = document.getElementById(id);
  if(!box) return;
  box.classList.remove('lunge'); void box.offsetWidth; box.classList.add('lunge');
}
// Flash plein écran (coup critique, coup super efficace, ou couleur libre pour une mécanique activée
// — Dynamax/Téracristal/Capacité Z, voir combat/move-fx.js).
function flashScreen(kind, color){
  const flash = document.createElement('div');
  flash.className = kind==='crit' ? 'battle-flash flash-crit' : kind==='superfx' ? 'battle-flash flash-superfx' : 'battle-flash flash-custom';
  if(kind==='custom' && color) flash.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
  const arena = document.getElementById('screenBattle');
  arena.appendChild(flash);
  setTimeout(()=> flash.remove(), 700);
}

// Texte affiché après les dégâts selon l'efficacité de type (super efficace / peu efficace / aucun effet).
function effLabel(eff){
  if(eff>=2) return ' — Coup super efficace !';
  if(eff>0 && eff<1) return " — Ce n'est pas très efficace...";
  if(eff===0) return " — Ça n'affecte pas l'adversaire...";
  return '';
}

document.getElementById('manualSwitchBtn').onclick = openManualSwitch;
document.getElementById('cancelSwitchBtn').onclick = closeManualSwitch;
document.getElementById('bagBtn').onclick = openBag;
// Le bouton menu (icône liste) révèle/masque "Changer de Pokémon" et "Sac" (repliés par défaut pour garder le
// module d'actions compact, comme dans le canevas).
document.getElementById('battleActionsToggleBtn').onclick = ()=>{
  document.getElementById('movesPanelActionsRevealed').classList.toggle('hidden');
};
document.addEventListener('click', (e)=>{
  const revealed = document.getElementById('movesPanelActionsRevealed');
  const toggleBtn = document.getElementById('battleActionsToggleBtn');
  if(!revealed || revealed.classList.contains('hidden')) return;
  if(!revealed.contains(e.target) && e.target!==toggleBtn) revealed.classList.add('hidden');
});
