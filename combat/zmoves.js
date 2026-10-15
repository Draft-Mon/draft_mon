/* ==== SOMMAIRE ====
   Capacités Z : une fois par combat, côté joueur uniquement, une capacité offensive tenue avec
   le bon Cristal Z (même type) devient un coup unique surboosté et toujours précis.
   - Z_MOVE_BY_TYPE : nom/texte de la Capacité Z par type
   - zMovePower : table officielle de conversion puissance de base → puissance Capacité Z
   - zCrystalHeldBy / eligibleZMoveIndexes / canDeclareZMove : conditions d'activation
   - buildZMove : construit la capacité Z réelle à partir de la capacité de base choisie
==== */
const Z_MOVE_BY_TYPE = {
  normal:   { name:'Déferlante Fulgurante',   desc:"Une déferlante d'énergie pure libérée par un Cristal Z." },
  combat:   { name:'Frappe Totale',           desc:"Un assaut combiné d'une puissance colossale, libéré par un Cristal Z." },
  vol:      { name:'Piqué Supersonique',      desc:"Un piqué à vitesse fulgurante, libéré par un Cristal Z." },
  poison:   { name:'Déluge Corrosif',         desc:"Un déluge toxique dévastateur, libéré par un Cristal Z." },
  sol:      { name:'Fureur Tectonique',       desc:"Une secousse tellurique immense, libérée par un Cristal Z." },
  roche:    { name:'Écrasement Continental',  desc:"Un écrasement d'une puissance titanesque, libéré par un Cristal Z." },
  insecte:  { name:'Tourbillon Sauvage',      desc:"Un tourbillon d'énergie sauvage, libéré par un Cristal Z." },
  fantome:  { name:'Cauchemar Éternel',       desc:"Une vague de terreur spectrale, libérée par un Cristal Z." },
  acier:    { name:'Vrille Infernale',        desc:"Une vrille d'acier dévastatrice, libérée par un Cristal Z." },
  feu:      { name:'Surchauffe Ultime',       desc:"Un brasier d'une intensité extrême, libéré par un Cristal Z." },
  eau:      { name:'Vortex Hydrique',         desc:"Un vortex d'eau ravageur, libéré par un Cristal Z." },
  plante:   { name:'Déferlante Florale',      desc:"Une déferlante végétale explosive, libérée par un Cristal Z." },
  electrik: { name:'Chaos Giga-Voltaïque',    desc:"Une décharge d'une puissance colossale, libérée par un Cristal Z." },
  psy:      { name:'Psyché Brisée',           desc:"Une onde psychique destructrice, libérée par un Cristal Z." },
  glace:    { name:'Blizzard Absolu',         desc:"Un blizzard d'une froideur extrême, libéré par un Cristal Z." },
  dragon:   { name:'Ravage du Dragon',        desc:"Une furie draconique dévastatrice, libérée par un Cristal Z." },
  tenebres: { name:'Éclipse des Ténèbres',    desc:"Une éclipse d'énergie ténébreuse, libérée par un Cristal Z." },
  fee:      { name:'Chatoiement Ultime',      desc:"Un éclat féérique éblouissant et dévastateur, libéré par un Cristal Z." }
};
function zMovePower(basePower){
  const p = basePower || 0;
  if(p>=140) return 200;
  if(p>=130) return 195;
  if(p>=120) return 190;
  if(p>=110) return 185;
  if(p>=100) return 180;
  if(p>=90) return 175;
  if(p>=80) return 160;
  if(p>=70) return 140;
  if(p>=60) return 120;
  return 100;
}
// Retourne le Cristal Z tenu par ce Pokémon (ou null s'il n'en tient pas un).
function zCrystalHeldBy(p){
  if(!p || !p.heldItem) return null;
  const item = ITEMS[p.heldItem];
  return (item && item.category==='zcristal') ? item : null;
}
// Index des capacités du Pokémon éligibles à devenir une Capacité Z (offensive, même type que le Cristal Z tenu, PP restants).
function eligibleZMoveIndexes(p){
  const crystal = zCrystalHeldBy(p);
  if(!crystal) return [];
  return (p.moves||[]).map((m,i)=> (m && (m.cat==='phys'||m.cat==='spec') && m.type===crystal.zType && p.ppCur[i]>0) ? i : -1).filter(i=>i>=0);
}
// Vrai si ce Pokémon peut déclarer une Capacité Z ce combat (pas déjà utilisée, au moins une capacité éligible).
function canDeclareZMove(p, bs){
  if(!p || !bs || bs.zMoveUsed || !hasKeyItem('braceletZ')) return false;
  return eligibleZMoveIndexes(p).length>0;
}
// Transforme une capacité de base en Capacité Z : puissance selon la table officielle, toujours
// précise, perd ses effets secondaires (statut/boost/drain/recul/multi-coups/piège...).
function buildZMove(baseMove){
  const zData = Z_MOVE_BY_TYPE[baseMove.type] || { name:`${baseMove.name} Z`, desc:"Une capacité surboostée par un Cristal Z." };
  const z = { ...baseMove };
  delete z.secondaryStatus; delete z.secondaryBoost; delete z.secondarySelfBoost;
  delete z.drain; delete z.recoil; delete z.multiHit; delete z.flinch; delete z.ohok; delete z.ohko;
  delete z.trap; delete z.trapDamage; delete z.charge; delete z.sunSkip; delete z.chargeMsg;
  z.power = zMovePower(baseMove.power);
  z.accuracy = 1;
  z.name = zData.name;
  z.desc = zData.desc;
  z.isZMove = true;
  return z;
}
