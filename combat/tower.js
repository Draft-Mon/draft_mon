/* ==== SOMMAIRE ====
   Progression de la Tour de Combat : quel étage est un Boss/Mini-Boss/combat double, génération
   du dresseur adverse et de son équipe, et ce qui se passe après une victoire d'étage. Repères :
   - L.10-20  : isBossFloor/isMiniBossFloor/isTwinFloor/moneyReward — nature de l'étage courant
   - L.23-42  : archétypes de dresseurs normaux (nom/emoji/thème de type/dialogue)
   - L.44-91  : Maîtres de Type (boss) — cycle sans répétition des 17 types, dialogues, sprites
   - L.93-129 : génération du dresseur (normal/mini-boss/boss) et des jumeaux (combat double)
   - L.131-146: renderTower — affiche l'écran de la Tour (étage courant, bouton Combattre)
   - L.148-160: weightedSampleLines — tirage pondéré de lignées (réutilise lineWeight du draft)
   - L.162-fin(250): generateEnemyTeam — construit l'équipe adverse complète (espèces, stats, movepool)
   - L.252-fin : awardBadge/floorCleared — récompenses et écran suivant après une victoire d'étage
==== */
function isBossFloor(floor){ return floor%10===0; }
function isMiniBossFloor(floor){ return floor%5===0 && !isBossFloor(floor); }
// ~12% de chance qu'un étage normal soit un combat double contre des jumeaux.
function isTwinFloor(floor){
  return !isBossFloor(floor) && !isMiniBossFloor(floor) && Math.random() < 0.12;
}
// Argent gagné à la fin d'un combat (majoré sur les étages Boss/Mini-Boss/combat double).
function moneyReward(floor, isTwin){
  let base = 20 + floor*8;
  if(isBossFloor(floor)) base *= 3;
  else if(isMiniBossFloor(floor)) base *= 1.75;
  else if(isTwin) base *= 1.3;
  return Math.round(base);
}
// Palier de difficulté stratégique (talents/objets/EV optimisés, cohérence de la compo, niveau d'IA en
// combat...) : regroupé par tranche de 10 étages, il n'augmente qu'après avoir battu le Maître de Type
// du palier précédent (reste donc identique du début à la fin d'un palier). Ça évite un pic de puissance
// adverse trop rapide comparé à la progression du joueur, pour qu'il ait une vraie chance de battre
// chaque Maître de Type et d'arriver jusqu'à la Ligue.
function difficultyFloor(floor){
  return Math.floor((floor-1)/10)*10 + 1;
}
// Numéro du palier (0 pour les étages 1-10, 1 pour 11-20, 2 pour 21-30...).
function difficultyTier(floor){
  return Math.floor((difficultyFloor(floor)-1)/10);
}
// Niveau des Pokémon adverses : +5% par palier de 10 étages (donc après chaque Maître de Type battu),
// sans plafond — contrairement au reste de la difficulté stratégique (qui finit par plafonner), le
// niveau doit continuer à grimper indéfiniment pour que la Tour reste un défi croissant sur la durée.
function foeLevelFor(floor){
  return LEVEL + Math.round(LEVEL * difficultyTier(floor) * 0.05);
}

const TRAINER_ARCHETYPES = [
  {title:'Randonneur',     emoji:'sneaker',           theme:null,       minFloor:1, dialogue:"J'adore explorer les chemins de campagne !"},
  {title:'Nageuse',        emoji:'person-simple-swim', theme:'eau',      minFloor:1, dialogue:"L'eau est mon élément, tu vas te noyer !"},
  {title:'Karatéka',       emoji:'boxing-glove',      theme:'combat',   minFloor:1, dialogue:"Mon entraînement est sans faille !"},
  {title:'Cueilleuse',     emoji:'basket',            theme:'plante',   minFloor:1, dialogue:"Mes Pokémon plante sont en pleine floraison !"},
  {title:'Cycliste',       emoji:'bicycle',           theme:null,       minFloor:1, dialogue:"La vitesse, c'est ma spécialité !"},
  {title:'Scientifique',   emoji:'flask',             theme:null,       minFloor:2, dialogue:"J'ai étudié mes Pokémon à la loupe..."},
  {title:'Pompier',        emoji:'flame',             theme:'feu',      minFloor:2, dialogue:"Mon équipe va tout réduire en cendres !"},
  {title:'Géologue',       emoji:'shovel',            theme:'roche',   minFloor:2, dialogue:"Mes Pokémon sont solides comme la roche !"},
  {title:'Électricien',    emoji:'lightning',         theme:'electrik', minFloor:2, dialogue:"Tiens bon face à mon voltage !"},
  {title:'Chasseuse',      emoji:'target',            theme:null,       minFloor:3, dialogue:"Je traque les dresseurs faibles !"},
  {title:'Dresseuse Psy',  emoji:'eye',               theme:'psy',      minFloor:3, dialogue:"Je lis dans tes pensées… tu vas perdre."},
  {title:'Noctambule',     emoji:'ghost',             theme:'fantome',  minFloor:3, dialogue:"L'obscurité est mon alliée !"},
  {title:'Glaciologiste',  emoji:'snowflake',         theme:'glace',    minFloor:4, dialogue:"Le froid ralentit tes réflexes..."},
  {title:'Empoisonneur',   emoji:'skull',             theme:'poison',   minFloor:4, dialogue:"Mon venin est lent... mais mortel."},
  {title:'Vétéran',        emoji:'medal',             theme:null,       minFloor:5, dialogue:"J'ai traversé cent tours de combat. Et toi ?"},
  {title:'Élite',          emoji:'star',              theme:null,       minFloor:6, dialogue:"Seuls les meilleurs arrivent jusqu'à moi."},
];
const TRAINER_FIRST_NAMES = ['Théo','Lucie','Marc','Sarah','Hugo','Emma','Léo','Chloé','Nathan','Lina','Maxime','Inès','Paul','Camille','Yanis','Manon','Romain','Jade','Kévin','Alicia'];

/* ---- Maîtres de Type (boss) ---- */
const ALL_TYPES = Object.keys(TYPE_COLOR);
const TYPE_DISPLAY_OVERRIDE = { fee:'Fée' };
function typeDisplayName(type){ return TYPE_DISPLAY_OVERRIDE[type] || (type.charAt(0).toUpperCase()+type.slice(1)); }
// Choisit le type du prochain Maître de Type boss, sans répéter un type déjà rencontré durant cette run (recommence un cycle une fois les 17 épuisés).
function pickBossType(){
  let available = ALL_TYPES.filter(t => !bossTypesUsed.includes(t));
  if(available.length===0){ bossTypesUsed = []; available = ALL_TYPES; }
  const type = rand(available);
  bossTypesUsed.push(type);
  return type;
}
const TYPE_MASTER_DIALOGUE = {
  normal:   "La simplicité est ma plus grande force !",
  feu:      "Laisse-moi t'embraser de passion !",
  eau:      "Mon équipe déferle comme une vague !",
  plante:   "Mes racines sont profondément ancrées dans la victoire !",
  electrik: "Prépare-toi à un choc électrisant !",
  vol:      "Je plane loin au-dessus de ta portée !",
  poison:   "Un seul contact, et c'est terminé pour toi !",
  sol:      "Je te ferai mordre la poussière !",
  insecte:  "Mon armée grouillante ne connaît pas la pitié !",
  combat:   "Seule la force brute compte ici !",
  glace:    "Je vais te geler sur place !",
  psy:      "J'ai déjà prévu ta défaite...",
  fantome:  "Tes pires cauchemars vont se réaliser !",
  roche:    "Solide comme le roc, inébranlable !",
  dragon:   "Les dragons obéissent à ma volonté !",
  acier:    "Mon armure est impénétrable !",
  tenebres: "L'obscurité ne pardonne à personne !",
  fee:      "Mon charme aura ta perte !",
};
const TYPE_MASTER_SPRITE = {
  normal:'larry', feu:'flannery', eau:'misty', plante:'erika', electrik:'iono',
  vol:'kahili', poison:'koga', sol:'rika', insecte:'katy', combat:'bea',
  glace:'candice', psy:'sabrina', fantome:'phoebe', roche:'brock', dragon:'lance',
  acier:'steven', tenebres:'karen', fee:'jacinthe'
};
// Repli en icône si le sprite du dresseur (Showdown) échoue à charger.
function handleTrainerSpriteError(img){
  const span = document.createElement('span');
  span.innerHTML = phIcon(img.dataset.fallbackEmoji || 'question');
  span.className = 'trainer-avatar-fallback';
  img.replaceWith(span);
}
// Avatar du dresseur : sprite dédié pour les Maîtres de Type (TYPE_MASTER_SPRITE), sinon l'icône de son archétype.
function getTrainerAvatarHTML(trainer){
  const spriteName = trainer.masterType && TYPE_MASTER_SPRITE[trainer.masterType];
  if(!spriteName) return phIcon(trainer.emoji);
  const url = `https://play.pokemonshowdown.com/sprites/trainers/${spriteName}.png`;
  return `<img src="${url}" alt="${trainer.name.replace(/<[^>]*>/g,'').trim()}" class="trainer-sprite-img" data-fallback-emoji="${trainer.emoji}" onerror="handleTrainerSpriteError(this)">`;
}

// Filtre les archétypes de dresseur disponibles à cet étage (favorise les archétypes avancés en montant dans la Tour). Partagé par generateTrainer et generateTwinTrainers.
function trainerArchetypePool(floor){
  const available = TRAINER_ARCHETYPES.filter(a => floor >= a.minFloor);
  let pool;
  if(floor >= 7) pool = available.filter(a => a.minFloor >= 5);
  else if(floor >= 5) pool = available.filter(a => a.minFloor >= 3);
  else if(floor >= 3) pool = available.filter(a => a.minFloor >= 2);
  else pool = available.filter(a => a.minFloor === 1);
  if(pool.length === 0) pool = available;
  return pool;
}
// Génère le dresseur d'un étage normal/mini-boss/boss (nom, emoji, thème de type, dialogue).
function generateTrainer(floor){
  const boss = isBossFloor(floor), miniBoss = isMiniBossFloor(floor);
  if(boss){
    const type = pickBossType();
    const name = rand(TRAINER_FIRST_NAMES);
    return {
      name: `${phIcon('crown')} MAÎTRE ${typeDisplayName(type).toUpperCase()} ${name}`,
      emoji: TYPE_ICON_SLUG[type], theme: type, dialogue: TYPE_MASTER_DIALOGUE[type],
      boss: true, miniBoss: false, masterType: type
    };
  }
  const archetype = rand(trainerArchetypePool(floor));
  const name = rand(TRAINER_FIRST_NAMES);
  const prefix = miniBoss ? `${phIcon('star')} Mini-Boss ` : '';
  return { name:`${prefix}${archetype.title} ${name}`, emoji:archetype.emoji, theme:archetype.theme, dialogue:archetype.dialogue, boss:false, miniBoss };
}
// Génère le duo de jumeaux d'un combat double : même archétype/thème, deux prénoms distincts.
function generateTwinTrainers(floor){
  const archetype = rand(trainerArchetypePool(floor));
  let n1 = rand(TRAINER_FIRST_NAMES);
  let n2 = rand(TRAINER_FIRST_NAMES);
  while(n2===n1 && TRAINER_FIRST_NAMES.length>1) n2 = rand(TRAINER_FIRST_NAMES);
  const base = { emoji:archetype.emoji, theme:archetype.theme, dialogue:archetype.dialogue, boss:false, miniBoss:false };
  return [
    { ...base, name:`${phIcon('users')} Jumeau ${archetype.title} ${n1}` },
    { ...base, name:`${phIcon('users')} Jumelle ${archetype.title} ${n2}` }
  ];
}

// Affiche l'écran de la Tour (étage courant, taille d'équipe adverse à venir, meilleur étage, argent).
function renderTower(reward, candyReward){
  document.getElementById('floorNum').textContent = towerFloor;
  updateBestFloor(towerFloor);
  const towerTier = difficultyTier(towerFloor);
  const size = isBossFloor(towerFloor) ? 6 : (isMiniBossFloor(towerFloor) ? Math.min(6, 3+towerTier) : Math.min(6, 2+towerTier));
  const badge = isBossFloor(towerFloor) ? ` · ${phIcon('crown')} ÉTAGE BOSS !` : (isMiniBossFloor(towerFloor) ? ` · ${phIcon('star')} Mini-Boss` : '');
  document.getElementById('floorDesc').innerHTML = `Équipe ennemie : ${size} Pokémon — niveau de menace ${towerFloor}${badge}<br>Meilleur étage : ${currentBestFloor()} · Mode : ${difficulty==='facile'?phIcon('smiley')+' Facile':(difficulty==='difficile'?phIcon('skull')+' Difficile':phIcon('sword')+' Normal')}`;
  document.getElementById('floorMoneyVal').textContent = money;
  document.getElementById('floorCandyVal').textContent = affinityCandy;
  const rewardEl = document.getElementById('floorReward');
  if(rewardEl){
    rewardEl.innerHTML = reward ? `+${reward} ${phIcon('coins')}${candyReward ? ` et +${candyReward} ${phIcon('cookie')}` : ''} gagnés au combat précédent !` : '';
  }
  if(window.DEV_HOOKS) window.DEV_HOOKS.renderTowerPanel();
  saveGame();
}
document.getElementById('fightBtn').onclick = ()=>{ startBattle(); };

// Total des stats de base d'une espèce.
function speciesBst(sp){
  const b = sp.base;
  return b.hp + b.atk + b.def + b.spa + b.spd + b.spe;
}
// Meilleur total de stats de base d'une lignée (dernier stade ou meilleure branche), mis en cache.
const LINE_FINAL_BST = {};
function lineFinalBst(line){
  if(LINE_FINAL_BST[line.id]===undefined){
    const finals = [line.stages[line.stages.length-1], ...(line.branches||[])];
    LINE_FINAL_BST[line.id] = Math.max(...finals.map(speciesBst));
  }
  return LINE_FINAL_BST[line.id];
}
// Tire n lignées sans remise, pondérées par lineWeight (réutilise la même rareté que le draft du joueur). Avec un étage
// (>=5), les lignées aux stats élevées sont de plus en plus favorisées. Les Légendaires/Fabuleux restent totalement
// exclus des équipes adverses avant l'étage 21 (voir aussi la limite à 1 par équipe dans foeCandidateScore) : ils ne
// doivent apparaître que passé le premier palier de difficulté majeur, jamais en pile aux bas étages.
function weightedSampleLines(lines, n, floor){
  const exponent = floor ? Math.min(4, Math.max(0, (floor-3)/3)) : 0;
  const pool0 = floor>=21 ? lines : lines.filter(l => !LEGENDARY_IDS.includes(l.id) && !FABULEUX_IDS.includes(l.id));
  let pool = pool0.map(l=>({l, w: lineWeight(l) * (exponent>0 ? Math.pow(Math.max(0.5, lineFinalBst(l)/450), exponent) : 1)}));
  const result = [];
  for(let k=0;k<n && pool.length>0;k++){
    const total = pool.reduce((a,p)=>a+p.w,0);
    let r = Math.random()*total;
    let idx=0;
    for(;idx<pool.length-1;idx++){ r-=pool[idx].w; if(r<=0) break; }
    result.push(pool[idx].l);
    pool.splice(idx,1);
  }
  return result;
}

// Détermine le stade / la branche d'une lignée pour un adversaire (plus évolué en montant dans la Tour ; un Maître de
// Type garde toujours une forme de son type).
function rollFoeSpecies(line, floor, trainerTheme, isBoss){
  const maxStage = line.stages.length-1;
  let stage = 0;
  for(let s=1; s<=maxStage; s++){
    if(Math.random() < Math.min(0.9, 0.15 + floor*0.13)) stage = s;
  }
  // Les branches draftable:false (ex. Éthernatos Infinimax) ne sont jamais tirées pour une équipe
  // adverse, seulement accessibles par évolution volontaire du joueur depuis l'éditeur.
  const eligibleBranches = line.branches ? line.branches.filter(b=>b.draftable!==false) : null;
  let branch = null;
  if(eligibleBranches && eligibleBranches.length && Math.random() < Math.min(0.85, 0.15 + floor*0.13)){
    if(trainerTheme){
      const themeBranch = eligibleBranches.find(b => b.types.includes(trainerTheme));
      branch = line.branches.indexOf(themeBranch || eligibleBranches[Math.floor(Math.random()*eligibleBranches.length)]);
    } else {
      branch = line.branches.indexOf(eligibleBranches[Math.floor(Math.random()*eligibleBranches.length)]);
    }
  }
  if(isBoss && trainerTheme){
    const stageMatches = line.stages[stage].types.includes(trainerTheme);
    const branchMatches = branch!==null && line.branches[branch].types.includes(trainerTheme);
    if(!stageMatches && !branchMatches){
      const matchingBranch = eligibleBranches ? eligibleBranches.find(b=>b.types.includes(trainerTheme)) : null;
      if(matchingBranch){
        branch = line.branches.indexOf(matchingBranch);
      } else {
        const matchingStageIdx = line.stages.reduce((best,s,i)=> s.types.includes(trainerTheme) ? i : best, -1);
        if(matchingStageIdx>=0){ stage = matchingStageIdx; branch = null; }
      }
    }
  }
  const sp = branch!==null ? line.branches[branch] : line.stages[stage];
  return { line, id:line.id, stage, branch, sp, themed:false };
}

/* ---- Composition des équipes adverses (étage 5+) : on tire plus de candidats que nécessaire puis on garde ceux qui
   forment la meilleure équipe : stats brutes élevées, faiblesses communes évitées, résistances et couverture de types
   complémentaires, mélange d'attaquants physiques/spéciaux et au moins un Pokémon rapide. ---- */
function foeCandidateScore(team, c, statWeight, synergyWeight){
  const b = c.sp.base;
  const ctypes = c.sp.types;
  let s = (speciesBst(c.sp) - 480) / 60 * statWeight;
  // Jamais plus d'un Légendaire/Fabuleux par équipe adverse (voir aussi l'exclusion sous l'étage 21
  // dans weightedSampleLines) : sans ce garde-fou, leurs stats dominent le score et l'IA en empile
  // plusieurs dès qu'elle en pioche plus d'un candidat.
  const isLegendOrFab = LEGENDARY_IDS.includes(c.id) || FABULEUX_IDS.includes(c.id);
  if(isLegendOrFab && team.some(m => LEGENDARY_IDS.includes(m.id) || FABULEUX_IDS.includes(m.id))) s -= 20;
  AI_TYPES.forEach(t=>{
    const mult = getMult(t, ctypes);
    const teamWeak = team.filter(m=>getMult(t, m.sp.types)>=2).length;
    const teamRes = team.filter(m=>getMult(t, m.sp.types)<1).length;
    if(mult>=2){
      if(teamWeak>=2) s -= 1.2*(teamWeak-1)*synergyWeight;
      else if(teamWeak===1 && teamRes===0) s -= 0.5*synergyWeight;
    } else if(mult<1){
      if(teamWeak>=1 && teamRes===0) s += 0.6*synergyWeight;
      else if(teamRes===0) s += 0.15*synergyWeight;
    }
  });
  const covered = new Set();
  team.forEach(m=>m.sp.types.forEach(t=>AI_TYPES.forEach(d=>{ if(getMult(t,[d])>1) covered.add(d); })));
  let gain = 0;
  ctypes.forEach(t=>AI_TYPES.forEach(d=>{ if(getMult(t,[d])>1 && !covered.has(d)){ covered.add(d); gain++; } }));
  s += gain*0.35*synergyWeight;
  const phys = b.atk >= b.spa;
  if(b.spe>=95 && !team.some(m=>m.sp.base.spe>=95)) s += 0.6*synergyWeight;
  if(team.length>=2){
    const physCount = team.filter(m=>m.sp.base.atk>=m.sp.base.spa).length;
    if(phys && physCount>=team.length) s -= 0.5*synergyWeight;
    if(!phys && physCount===0) s -= 0.5*synergyWeight;
  }
  const dupes = team.filter(m=>m.sp.types[0]===ctypes[0]).length;
  s -= 0.5*synergyWeight * dupes * (c.themed ? 0.4 : 1);
  // Moins de hasard dans le choix à mesure que la compo devient plus réfléchie (étages élevés).
  const noise = Math.max(0.08, 0.4 - synergyWeight*0.15);
  return s + Math.random()*noise;
}
// Choisit `size` candidats formant la meilleure équipe (avec un quota de Pokémon thématiques / libres si donné).
function selectFoeTeam(cands, size, floor, quota){
  const statWeight = Math.min(1.5, 0.3 + floor*0.06);
  // La cohérence de la compo (couverture de types, faiblesses partagées évitées, mélange
  // physique/spécial, Pokémon rapide...) compte de plus en plus en montant dans la Tour.
  const synergyWeight = Math.min(1.6, 0.35 + floor*0.07);
  const pool = [...cands];
  const chosen = [];
  while(chosen.length<size && pool.length){
    let best = null, bestScore = -Infinity;
    pool.forEach(c=>{
      if(quota && ((c.themed && quota.themed<=0) || (!c.themed && quota.other<=0))) return;
      const sc = foeCandidateScore(chosen, c, statWeight, synergyWeight);
      if(sc>bestScore){ bestScore = sc; best = c; }
    });
    if(!best) best = pool[0];
    chosen.push(best);
    pool.splice(pool.indexOf(best), 1);
    if(quota){ if(best.themed) quota.themed--; else quota.other--; }
  }
  return chosen;
}

// Objet tenu d'un adversaire (étage 6+) : Orbe Vie, baies, Restes, Ceinture Force, Veste de Combat, et dès l'étage 12
// les objets Choix pour les Pokémon qui n'ont que des attaques.
function pickFoeItem(sp, moveIds, floor, bossLike){
  if(floor < 6) return null;
  const chance = Math.min(0.9, 0.25 + (floor-6)*0.06 + (bossLike ? 0.2 : 0));
  if(Math.random() > chance) return null;
  const b = sp.base;
  const phys = b.atk >= b.spa;
  const bulkTotal = b.hp + b.def + b.spd;
  const allDamaging = moveIds.every(id=>MOVES[id].cat!=='status');
  const pool = [['orbeVie',3],['baieSitrus',2],['baieLum',2],['reste', bulkTotal>=290 ? 4 : 1],['ceintureForce', bulkTotal<250 ? 3 : 0.5],['griffeTranchante',0.7]];
  if(allDamaging){
    pool.push(['vesteCombat', bulkTotal>=290 ? 3 : 0.5]);
    if(floor >= 12){
      pool.push([phys ? 'bandeauChoix' : 'lunettesChoix', 2.5]);
      if(b.spe >= 95) pool.push(['mouchoirChoix', 1.5]);
    }
  }
  const valid = pool.filter(([k])=>ITEMS[k]);
  const total = valid.reduce((a,[,w])=>a+w,0);
  let r = Math.random()*total;
  for(const [k,w] of valid){ r-=w; if(r<=0) return k; }
  return valid[valid.length-1][0];
}

// Construit un combattant adverse complet : stats (EV et nature optimisés avec la progression), attaques, talent, objet.
// Plus l'étage est élevé, plus ce Pokémon a de chances d'utiliser un vrai set compétitif : un des
// sets joués en tournoi pour son espèce (jusqu'à 5, tiré au hasard — voir pokemon/tournament-sets.js et
// competitiveSetFor) avec talent, objet, nature, EV et attaques, plutôt que la logique générique ci-dessous (qui reste utilisée pour les espèces non
// couvertes par un set curé, ou tôt dans la Tour).
function buildFoeMember(spec, floor, strength, bossLike, level){
  const { line, id, stage, branch, sp } = spec;
  const ivs = {hp:31,atk:31,def:31,spa:31,spd:31,spe:31};
  // Budget total d'EV réparti entre les 6 stats (max 32 chacune, max EV_TOTAL_MAX au total), qui grandit
  // avec la force du dresseur — comme le budget de 510 des jeux officiels, mais à l'échelle réduite.
  const totalEv = Math.round(EV_TOTAL_MAX*strength);
  const evs = {hp:0,atk:0,def:0,spa:0,spd:0,spe:0};
  const b = sp.base;
  const phys = b.atk >= b.spa;
  const main = phys ? 'atk' : 'spa', opposite = phys ? 'spa' : 'atk';
  const movepool = movepoolFor({lineId:id, stage, branch});
  const curatedChance = Math.min(1, Math.max(0, (floor-4)*0.1));
  const curated = floor >= 5 && Math.random() < curatedChance ? competitiveSetFor(sp, line, true) : null;
  let nature, ability, moveIds;
  if(curated){
    nature = natureFor(curated.plus, curated.minus);
    const fullEvs = convertRealEvs(curated.evs);
    const fullTotal = Object.values(fullEvs).reduce((a,v)=>a+v,0) || 1;
    const scale = Math.min(1, totalEv/fullTotal);
    Object.keys(evs).forEach(k=>{ evs[k] = Math.min(EV_MAX, Math.round(fullEvs[k]*scale)); });
    ability = curated.ability || rand(sp.abilities || line.abilities);
    moveIds = resolveSetMoves(curated, movepool, sp, floor);
  } else {
    // À partir de l'étage 5, de plus en plus d'adversaires ont une répartition d'EV et une nature pensées pour leur rôle.
    const optimized = floor >= 5 && Math.random() < Math.min(1, (floor-3)*0.25);
    if(optimized){
      let remaining = totalEv;
      const give = (k, v)=>{ const g = Math.max(0, Math.min(v, remaining, EV_MAX-evs[k])); evs[k] += g; remaining -= g; };
      const bulky = (b.hp + b.def + b.spd) >= 290 && b.spe < 80;
      give(main, EV_MAX);
      if(bulky){ give('hp', EV_MAX); give(phys ? 'def' : 'spd', EV_MAX); }
      else { give('spe', EV_MAX); give('hp', EV_MAX); }
      give('hp', remaining); give('def', remaining); give('spd', remaining);
      nature = NATURES.find(n=>n.plus===main && n.minus===opposite) || NATURES.find(n=>n.plus===main) || NATURES[0];
    } else {
      let remaining = totalEv;
      const statKeys = shuffle(['hp','atk','def','spa','spd','spe']);
      statKeys.forEach((k,i)=>{
        if(i===statKeys.length-1){ evs[k]=Math.max(0,Math.min(EV_MAX,remaining)); }
        else { const give = Math.max(0,Math.min(EV_MAX, remaining, Math.round(remaining*(0.2+Math.random()*0.3)))); evs[k]=give; remaining-=give; }
      });
      nature = rand(NATURES.filter(n=>n.plus));
    }
    ability = rand(sp.abilities || line.abilities);
    moveIds = floor >= 4 ? pickSmartMoves(movepool, sp, floor) : shuffle(movepool).slice(0,4);
  }
  const stats = calcStats(sp.base, ivs, evs, nature, level);
  return {
    lineId:id, stage, branch, name:sp.name, types:sp.types, unownForm: pickFormSprite(sp.name), moveObjs: moveIds.map(mid=>MOVES[mid]), ppCur: moveIds.map(mid=>basePP(MOVES[mid])),
    ability, level: level||LEVEL, ivs, evs, nature,
    heldItem: (curated && curated.item) || pickFoeItem(sp, moveIds, floor, bossLike), itemUsed:false,
    stats, maxHp: stats.hp, hp: stats.hp, ...freshBattleFields()
  };
}

// Construit l'équipe adverse complète pour un combat : choisit les lignées (thématiques selon le
// dresseur, 100% du type pour un Maître de Type), leur stade/branche (plus évolué en montant dans
// la Tour), puis, dès l'étage 5, garde les candidats qui forment l'équipe la plus solide (voir selectFoeTeam).
// Chaque combattant reçoit ses stats (force croissante avec l'étage), ses 4 attaques, son talent et un objet éventuel.
function generateEnemyTeam(floor, trainerTheme, isBoss, maxSize){
  // Taille d'équipe : un dresseur normal commence à 2 Pokémon, un Mini-Boss à 3, un Boss a toujours
  // son équipe complète de 6 — et la base (normal/Mini-Boss) grandit de 1 par palier de 10 étages
  // (même rythme que le reste de la difficulté, voir difficultyTier) jusqu'au plafond de 6.
  const tier = difficultyTier(floor);
  let size = isBossFloor(floor) ? 6 : (isMiniBossFloor(floor) ? Math.min(6, 3+tier) : Math.min(6, 2+tier));
  let strength = Math.min(1, 0.3 + floor*0.1);
  if(isBossFloor(floor)) strength = Math.min(1, strength+0.25);
  else if(isMiniBossFloor(floor)) strength = Math.min(1, strength+0.12);
  if(maxSize) size = Math.min(size, maxSize);
  const bossLike = isBossFloor(floor) || isMiniBossFloor(floor);
  // Toute la sophistication stratégique (biais vers les espèces fortes, évolutions, cohérence de la
  // compo, sets curés...) utilise le palier de difficulté (dFloor), pas l'étage réel : elle ne progresse
  // donc que par palier de 10, après un Maître de Type — voir difficultyFloor.
  const dFloor = difficultyFloor(floor);
  const foeLevel = foeLevelFor(floor);

  const optimize = dFloor >= 5;
  const over = !optimize ? 1 : (dFloor >= 10 ? 3 : 2);
  const sample = (lines, n) => weightedSampleLines(lines, Math.min(lines.length, n*over), optimize ? dFloor : 0);
  const rolled = (lines, themed) => lines.map(l=>({ ...rollFoeSpecies(l, dFloor, trainerTheme, isBoss), themed }));
  const themedLines = trainerTheme ? LINES.filter(l =>
    l.stages.some(s => s.types.includes(trainerTheme)) ||
    (l.branches && l.branches.some(b => b.types.includes(trainerTheme)))
  ) : [];

  let cands, quota = null;
  if(isBoss){
    cands = rolled(sample(themedLines, size), true);
  } else if(trainerTheme){
    const themeCount = Math.ceil(size * 0.7);
    const themedNeed = Math.min(themeCount, themedLines.length);
    const themedCands = rolled(sample(themedLines, themedNeed), true);
    const usedLines = themedCands.map(c=>c.line);
    const otherPool = LINES.filter(l => !usedLines.includes(l));
    const otherNeed = size - themedNeed;
    cands = [...themedCands, ...rolled(sample(otherPool, otherNeed), false)];
    quota = { themed: themedNeed, other: otherNeed };
  } else {
    cands = rolled(sample(LINES, size), false);
  }

  let chosen = optimize ? selectFoeTeam(cands, size, dFloor, quota) : cands.slice(0, size);
  if(chosen.length < size){
    // Même garde-fou Légendaire/Fabuleux que weightedSampleLines/foeCandidateScore : ce filet de secours
    // (pool thématique ou candidats insuffisants) ne doit pas les réintroduire en douce, ni en empiler
    // plusieurs (un tirage au hasard n'a pas le score anti-pile de foeCandidateScore).
    const usedIds = chosen.map(c=>c.id);
    let hasLegend = chosen.some(c => LEGENDARY_IDS.includes(c.id) || FABULEUX_IDS.includes(c.id));
    const shuffledPool = shuffle(LINES.filter(l => !usedIds.includes(l.id)
      && (dFloor>=21 || !(LEGENDARY_IDS.includes(l.id) || FABULEUX_IDS.includes(l.id)))));
    const extra = [];
    for(const l of shuffledPool){
      if(extra.length >= size - chosen.length) break;
      const isLegendOrFab = LEGENDARY_IDS.includes(l.id) || FABULEUX_IDS.includes(l.id);
      if(isLegendOrFab && hasLegend) continue;
      if(isLegendOrFab) hasLegend = true;
      extra.push(l);
    }
    chosen = [...chosen, ...rolled(extra, false)];
  }
  // Aux paliers avancés, le Pokémon le plus puissant est gardé pour la fin (l'as de l'équipe).
  if(dFloor >= 10 && chosen.length>=3){
    const ace = chosen.reduce((best,c)=> speciesBst(c.sp)>speciesBst(best.sp) ? c : best);
    chosen = [...chosen.filter(c=>c!==ace), ace];
  }
  return chosen.map(spec => buildFoeMember(spec, dFloor, strength, bossLike, foeLevel));
}

// Ajoute un badge de Maître de Type obtenu (par mode de difficulté) et sauvegarde. Retourne vrai si c'est un nouveau badge.
function awardBadge(type){
  if(!badges[difficulty]) badges[difficulty] = [];
  const isNew = !badges[difficulty].includes(type);
  if(isNew) badges[difficulty].push(type);
  try { localStorage.setItem(badgeKeyFor(difficulty), JSON.stringify(badges[difficulty])); } catch(e){}
  return isNew;
}
// Appelé quand toute l'équipe adverse est K.O. : réinitialise l'équipe du joueur (sauf en
// Difficile), verse la récompense, avance l'étage, puis dirige vers le bon écran suivant
// (Campement si Boss ou Mini-Boss, event aléatoire, ou étage suivant).
function floorCleared(){
  const clearedFloor = towerFloor;
  const wasBoss = battleState.trainer && battleState.trainer.boss;
  const wasMiniBoss = battleState.trainer && battleState.trainer.miniBoss;
  const wasTwin = !!battleState.isDouble;
  const bossMasterType = battleState.trainer && battleState.trainer.masterType;
  battleInProgress = false;
  battleState.player.forEach((c,i)=>{
    if(difficulty!=='difficile'){
      c.hp = c.maxHp; c.status=null; c.sleepCounter=0; c.confuseCounter=0;
    }
    resetBattleFields(c);
    const m = team[i];
    if(m){
      m.hp = c.hp; m.status = c.status; m.sleepCounter = c.sleepCounter;
      if(c.itemUsed) m.heldItem = null;
    }
  });
  let reward = moneyReward(clearedFloor, wasTwin);
  if(battleState.happyHour) reward *= 2;
  reward += battleState.payDayMoney || 0;
  money += reward;
  // Le dresseur vaincu donne aussi des Bonbons d'Affinité (voir meta/affinity.js), qui financeront
  // plus tard un investissement chez le Professeur (bloc 5) pour faire monter l'affinité d'une lignée.
  const candyGain = affinityCandyReward(wasMiniBoss, wasBoss);
  affinityCandy += candyGain;
  saveAffinityProgress();
  runStats.floorsCleared++;
  runStats.moneyEarned += reward;
  if(wasBoss) runStats.bosses++; else if(wasMiniBoss) runStats.miniBosses++;
  towerFloor++;
  document.getElementById('screenBattle').classList.add('hidden');
  if(wasBoss){
    const newBadge = bossMasterType ? awardBadge(bossMasterType) : false;
    document.getElementById('screenVillage').classList.remove('hidden');
    renderVillage(reward, newBadge ? bossMasterType : null, 'en battant le Boss', candyGain);
  } else if(wasMiniBoss){
    document.getElementById('screenVillage').classList.remove('hidden');
    renderVillage(reward, null, 'contre le Mini-Boss', candyGain);
  } else if(maybeTriggerTowerEvent(reward, candyGain)){
  } else {
    document.getElementById('screenTower').classList.remove('hidden');
    renderTower(reward, candyGain);
  }
}
