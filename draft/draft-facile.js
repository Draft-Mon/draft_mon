/* ==== Mode Facile : ne propose que les formes entièrement évoluées (dernier stade, ou chaque
   branche pour une lignée à embranchements), déjà prêtes à combattre (IV/EV/nature/attaques
   choisis automatiquement par autoBuildMember). ==== */
// Liste les formes finales de toutes les lignées (hors déjà draftées) comme candidats — une entrée
// par branche si la lignée en a, pondérée aussi par affinité (affinityMultiplier — voir meta/affinity.js).
function buildFacileCandidates(excludedLineIds){
  const candidates = [];
  LINES.forEach(line=>{
    if(excludedLineIds.includes(line.id)) return;
    const w = lineWeight(line)*affinityMultiplier(line.id);
    // Une branche peut définir draftable:false pour ne jamais être proposée directement au tirage
    // (ex. Éthernatos Infinimax, uniquement accessible en faisant évoluer Éthernatos depuis
    // l'éditeur) ; elle peut aussi définir son propre rarityWeight pour être plus rare que le reste
    // de sa lignée, sinon elle hérite du poids habituel de la lignée comme les autres branches.
    // L'affinité s'applique dans les deux cas.
    const draftableBranches = line.branches ? line.branches.filter(b=>b.draftable!==false) : [];
    if(draftableBranches.length){
      line.branches.forEach((b,bi)=>{
        if(b.draftable===false) return;
        candidates.push({lineId:line.id, stage:line.stages.length-1, branch:bi, w: (b.rarityWeight!==undefined ? b.rarityWeight : lineWeight(line))*affinityMultiplier(line.id)});
      });
    } else {
      // Aucune branche draftable (lignée sans embranchement, ou toutes ses branches exclues) :
      // on propose son dernier stade normal à la place.
      candidates.push({lineId:line.id, stage:line.stages.length-1, branch:null, w});
    }
  });
  return candidates;
}
// TOTAL_FACILE_WEIGHT sert de dénominateur au taux d'apparition affiché (facileAppearanceRate) ; comme
// l'affinité change en cours de jeu (via le Professeur), ce n'est plus une constante figée au
// chargement mais recalculé à chaque changement d'affinité (voir recalcFacileWeight).
let TOTAL_FACILE_WEIGHT = 0;
function recalcFacileWeight(){
  TOTAL_FACILE_WEIGHT = buildFacileCandidates([]).reduce((a,c)=>a+c.w,0);
}
recalcFacileWeight();
// Taux d'apparition affiché sur les cartes en mode Facile.
function facileAppearanceRate(w){
  return (w/TOTAL_FACILE_WEIGHT*100);
}
// Construit un membre "prêt à combattre" pour le mode Facile : IV max, EV tout misés sur la
// meilleure stat offensive + Vitesse (max par stat 32, max au total 66), nature assortie, et les 4
// meilleures attaques (pickSmartMoves).
function autoBuildMember(lineId, stage, branch){
  const line = lineOf(lineId);
  const sp = branch!==null && branch!==undefined ? line.branches[branch] : line.stages[stage];
  const abilities = sp.abilities || line.abilities;
  const ivs = {hp:31,atk:31,def:31,spa:31,spd:31,spe:31};
  const isPhysical = sp.base.atk >= sp.base.spa;
  const primary = isPhysical ? 'atk' : 'spa';
  const opposite = isPhysical ? 'spa' : 'atk';
  const member = {
    lineId, stage, branch: (branch!==undefined ? branch : null),
    ivs,
    moves:[null,null,null,null],
    heldItem: null,
    unownForm: pickFormSprite(sp.name),
    shiny: false
  };
  const movepool = movepoolFor(member);
  // Un set compétitif curé (à la Smogon/Coup Critique) existe pour cette espèce : on l'utilise tel
  // quel (talent, objet, nature, EV, moveset) plutôt que l'heuristique générique ci-dessous.
  const curated = competitiveSetFor(sp, line);
  if(curated){
    member.ability = curated.ability || abilities[0];
    member.heldItem = curated.item || null;
    member.nature = natureFor(curated.plus, curated.minus);
    member.evs = convertRealEvs(curated.evs);
    member.moves = resolveSetMoves(curated, movepool, sp, 5);
  } else {
    const evs = {hp:EV_TOTAL_MAX-EV_MAX*2,atk:0,def:0,spa:0,spd:0,spe:EV_MAX};
    evs[primary] = EV_MAX;
    let nature = NATURES.find(n=>n.plus===primary && n.minus===opposite);
    if(!nature) nature = NATURES.find(n=>n.plus===primary) || NATURES[0];
    member.ability = abilities[0];
    member.nature = nature;
    member.evs = evs;
    member.moves = pickSmartMoves(movepool, sp, 5);
  }
  return member;
}
