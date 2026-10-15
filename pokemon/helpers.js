/* ==== Fonctions centrales pour résoudre un membre d'équipe (lineId/stage/branch/heldItem)
   vers ses données réelles (nom, types, stats de base, talents, movepool). Utilisées partout :
   combat, draft, éditeur, dex... ==== */
// Retrouve la lignée (pokemon/gen*.js) à partir de son id.
function lineOf(id){ return LINES.find(l=>l.id===id); }
// Résout un membre vers son espèce actuelle : gère stage vs branche, puis les formes liées à un objet
// tenu (Plaques, Mémoires...). Les Méga-Gemmes (ITEMS[x].megaStone) ne comptent PAS ici : la Méga-
// Évolution ne se déclenche plus qu'en combat (voir combat/megaevolution.js) et ne dure que le temps
// du combat, donc hors combat (équipe, Dex, PC...) le Pokémon reste affiché sous sa forme normale
// même s'il tient déjà sa Méga-Gemme.
function speciesOf(member){
  const line = lineOf(member.lineId);
  const base = (line.branches && member.branch!==undefined && member.branch!==null) ? line.branches[member.branch] : line.stages[member.stage];
  const item = member.heldItem && ITEMS[member.heldItem];
  if(base.forms && member.heldItem && !(item && item.megaStone) && base.forms[member.heldItem]) return base.forms[member.heldItem];
  return base;
}
// Clé de la Méga-Évolution accessible à un membre sous l'espèce sp : sa Méga-Gemme tenue, ou pour
// Rayquaza la connaissance de Draco-Ascension (seule Méga-Évolution sans Méga-Gemme, comme dans les
// vrais jeux ; forme rangée sous la clé 'dragonascent'). null s'il n'en a pas.
function megaFormKey(member, sp){
  if(!sp || !sp.forms) return null;
  const item = member.heldItem && ITEMS[member.heldItem];
  if(item && item.megaStone && sp.forms[member.heldItem]) return member.heldItem;
  if(sp.forms.dragonascent && (member.moves||[]).includes('dragonascent')) return 'dragonascent';
  return null;
}
// Talents disponibles pour un membre (ceux du stade/branche s'ils existent, sinon ceux de la lignée).
function abilitiesFor(member){
  const line = lineOf(member.lineId);
  const sp = speciesOf(member);
  return sp.abilities || line.abilities;
}
// Movepool disponible pour un membre : pool complet + attaques exclusives à la branche pour une forme évoluée, sinon pool progressif selon le stade (movepoolForStage, dans draft/draft-core.js).
function movepoolFor(member){
  const line = lineOf(member.lineId);
  if(line.branches && member.branch!==undefined && member.branch!==null){
    const branch = line.branches[member.branch];
    const sorted = [...line.moveIds].sort((a,b)=>MOVES[a].power-MOVES[b].power);
    const statusIds = sorted.filter(id=>MOVES[id].cat==='status');
    const dmgIds = sorted.filter(id=>MOVES[id].cat!=='status');
    return [...dmgIds, ...(branch.extraMoveIds||[]), ...statusIds];
  }
  return movepoolForStage(line, member.stage);
}
