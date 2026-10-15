/* ==== SOMMAIRE ====
   Dynamax/Gigamax : une fois par combat, avec le Bracelet Dynamax (objet clé du Pokéshop), pour le
   joueur (et pour certains Boss, voir combat/boss-mechanics.js), pendant 3 tours chaque capacité
   offensive choisie devient une Capacité Max surboostée (PV du porteur aussi boostés de 50%).
   - MAX_MOVE_BY_TYPE : nom/texte de la Capacité Max générique par type
   - maxMovePower : table officielle de conversion puissance de base → puissance Capacité Max
   - GIGAMAX_LINES : lignées éligibles au Gigamax (nom officiel de leur Capacité G-Max + effet
     bonus codé pour certaines), actif si le porteur tient le Facteur Gigamax
   - canDynamax / buildMaxMove : condition d'activation + construction de la capacité réelle
   - applyDynamaxBoost / revertDynamaxBoost : mise à l'échelle atomique des PV actuels/max
==== */
const MAX_MOVE_BY_TYPE = {
  normal:   { name:'Ultimatteraque',      desc:"Une attaque colossale libérée par la puissance Dynamax." },
  combat:   { name:'Ultimapoing',         desc:"Un poing titanesque libéré par la puissance Dynamax." },
  vol:      { name:'Ultimenvol',          desc:"Une bourrasque géante libérée par la puissance Dynamax." },
  poison:   { name:'Ultimeffluve',        desc:"Une vague toxique libérée par la puissance Dynamax." },
  sol:      { name:'Ultimonde',           desc:"Un séisme titanesque libéré par la puissance Dynamax." },
  roche:    { name:'Ultimassif',          desc:"Un éboulement colossal libéré par la puissance Dynamax." },
  insecte:  { name:'Ultimessaim',         desc:"Un nuage grouillant libéré par la puissance Dynamax." },
  fantome:  { name:'Ultimocculte',        desc:"Une terreur spectrale libérée par la puissance Dynamax." },
  acier:    { name:'Ultimétal',           desc:"Un impact d'acier libéré par la puissance Dynamax." },
  feu:      { name:'Ultimbrasier',        desc:"Un brasier titanesque libéré par la puissance Dynamax." },
  eau:      { name:'Ultimarée',           desc:"Un raz-de-marée libéré par la puissance Dynamax." },
  plante:   { name:'Ultimflore',          desc:"Une déferlante végétale libérée par la puissance Dynamax." },
  electrik: { name:'Ultimclair',          desc:"Un déluge électrique libéré par la puissance Dynamax." },
  psy:      { name:'Ultimesprit',         desc:"Une onde psychique dévastatrice libérée par la puissance Dynamax." },
  glace:    { name:'Ultimgel',            desc:"Un blizzard titanesque libéré par la puissance Dynamax." },
  dragon:   { name:'Ultimraptor',         desc:"Une furie draconique libérée par la puissance Dynamax." },
  tenebres: { name:'Ultimombre',          desc:"Une vague ténébreuse libérée par la puissance Dynamax." },
  fee:      { name:'Ultimastral',         desc:"Un éclat féérique libéré par la puissance Dynamax." }
};
function maxMovePower(basePower){
  const p = basePower || 0;
  if(p>=115) return 150;
  if(p>=105) return 140;
  if(p>=75) return 130;
  if(p>=65) return 120;
  if(p>=55) return 110;
  if(p>=45) return 100;
  return 90;
}
const GIGAMAX_LINES = {
  ouistempo:   { name:'G-Max Décibelle',       desc:"Fait vibrer le sol au rythme d'un tambour géant.", fixedPower:130 },
  flambino:    { name:'G-Max Foudre-Boulet',   desc:"Projette une boule de feu titanesque.", fixedPower:130 },
  larmeleon:   { name:'G-Max Hydro-Sniper',    desc:"Tire un jet d'eau d'une précision chirurgicale.", fixedPower:130 },
  minisange:   { name:'G-Max Chaos Acier',     desc:"Projette des éclats d'acier tranchants.", secondaryBoost:{stat:'def',stages:-1,chance:1} },
  khelocrok:   { name:'G-Max Écueil',          desc:"Fait surgir des récifs de pierre acérés.", secondaryBoost:{stat:'spd',stages:-1,chance:1} },
  charibari:   { name:'G-Max Déferlante Acier',desc:"Charge dans une armure d'acier écrasante.", secondaryBoost:{stat:'def',stages:-1,chance:1} },
  duralugon:   { name:'G-Max Rayon Laser',     desc:"Tire un rayon laser depuis son cou d'acier.", secondaryBoost:{stat:'spe',stages:-1,chance:1} },
  charbi:      { name:'G-Max Magma',           desc:"Déchaîne un torrent de lave et de cendres.", gigaWeather:'sable' },
  toxizap:     { name:'G-Max Choc Statique',   desc:"Diffuse des ondes toxiques crépitantes.", secondaryStatus:{status:'poison',chance:1} },
  grillepattes:{ name:'G-Max Infernaux',       desc:"Encercle la cible de flammes ardentes.", trap:true },
  grimalin:    { name:'G-Max Ténèbres',        desc:"Plonge la cible dans un sommeil irrésistible.", gigaYawn:true },
  bulbasaur:   { name:'G-Max Rugissement Vert',desc:"Absorbe l'énergie vitale de la cible.", fixedPower:120 },
  charmander:  { name:'G-Max Incendie',        desc:"Embrase durablement le terrain autour de la cible.", fixedPower:120 },
  squirtle:    { name:'G-Max Canon-Rafale',    desc:"Déclenche un déluge d'eau ininterrompu.", fixedPower:120 },
  snorlax:     { name:'G-Max Câlin Collant',   desc:"Étreint la cible avec une force colossale.", secondaryBoost:{stat:'spe',stages:-1,chance:1} },
  gastly:      { name:'G-Max Épouvante',       desc:"Plonge la cible dans une terreur profonde.", secondaryBoost:{stat:'atk',stages:-1,chance:1} }
};
// Vrai si ce Pokémon peut Dynamaxer ce combat (Bracelet Dynamax dans le sac, pas déjà utilisé, au moins
// une capacité offensive avec PP).
function canDynamax(p, bs){
  if(!p || !bs || bs.dynamaxUsed || !hasKeyItem('braceletDynamax')) return false;
  return (p.moves||[]).some((m,i)=> m && (m.cat==='phys'||m.cat==='spec') && p.ppCur[i]>0);
}
// Transforme une capacité de base en Capacité Max : puissance selon la table officielle, perd ses
// effets secondaires ; si le porteur est Gigamax-éligible (tient le Facteur Gigamax + capacité de
// son propre type), applique en plus le nom officiel de sa Capacité G-Max et son effet bonus.
function buildMaxMove(baseMove, user, bs, target){
  const maxData = MAX_MOVE_BY_TYPE[baseMove.type] || { name:`${baseMove.name} Max`, desc:"Une capacité surboostée par la puissance Dynamax." };
  const mv = { ...baseMove };
  delete mv.secondaryStatus; delete mv.secondaryBoost; delete mv.secondarySelfBoost;
  delete mv.drain; delete mv.recoil; delete mv.multiHit; delete mv.flinch; delete mv.ohko;
  delete mv.trap; delete mv.trapDamage; delete mv.charge; delete mv.sunSkip; delete mv.chargeMsg;
  mv.power = maxMovePower(baseMove.power);
  mv.name = maxData.name;
  mv.desc = maxData.desc;
  mv.isMaxMove = true;
  const gmax = GIGAMAX_LINES[user.lineId];
  if(gmax && user.heldItem==='facteurGigamax' && baseMove.type===(user.transformedTypes||user.types)[0]){
    mv.name = gmax.name;
    mv.desc = gmax.desc;
    if(gmax.fixedPower) mv.power = gmax.fixedPower;
    if(gmax.secondaryBoost) mv.secondaryBoost = gmax.secondaryBoost;
    if(gmax.secondaryStatus) mv.secondaryStatus = gmax.secondaryStatus;
    if(gmax.trap) mv.trap = true;
    if(gmax.gigaWeather && bs) bs.weather = { type: gmax.gigaWeather, turns: 5 };
    if(gmax.gigaYawn && bs && target){
      bs.pendingYawn = (bs.pendingYawn || []).filter(p=>p.target!==target);
      bs.pendingYawn.push({ target, turnsLeft: 1 });
    }
  }
  return mv;
}
// Augmente PV actuels et PV max de 50% ensemble, de façon atomique (déclenchement du Dynamax).
function applyDynamaxBoost(c){
  if(c.dynamaxHpBoosted) return;
  c.maxHp = Math.round(c.maxHp * 1.5);
  c.hp = Math.round(c.hp * 1.5);
  c.dynamaxHpBoosted = true;
}
// Annule applyDynamaxBoost (fin du Dynamax ou changement de Pokémon) : PV actuels/max ramenés à la normale.
function revertDynamaxBoost(c){
  if(!c.dynamaxHpBoosted) return;
  const newMaxHp = Math.round(c.maxHp / 1.5);
  c.hp = Math.min(newMaxHp, Math.round(c.hp / 1.5));
  c.maxHp = newMaxHp;
  c.dynamaxHpBoosted = false;
}
