/* ==== SOMMAIRE ====
   Mécaniques des Boss (Maîtres de Type) : un Boss n'utilise une mécanique de combat (Méga-Évolution,
   Téracristallisation, Capacité Z ou Dynamax) que si le joueur en a débloqué une lui-même (Méga-Bracelet,
   Bracelet Z ou Bracelet Dynamax achetés au Pokéshop, ou un Orbe Téracristal), et toujours à partir de
   l'étage BOSS_MECHANIC_FLOOR. La mécanique est tirée au hasard parmi celles possibles pour l'as de
   l'équipe (son dernier Pokémon), qui l'utilise une seule fois par combat, dès sa première attaque
   (pour la Capacité Z : sa première attaque où l'attaque du type de son Cristal Z n'est pas résistée). Les Mini-Boss et les dresseurs
   normaux n'en ont jamais. Repères :
   - playerHasMechanic : le joueur a-t-il débloqué au moins une mécanique ?
   - assignBossMechanic(enemy, floor) : choisit et prépare la mécanique (appelé à la création de
     l'équipe du Boss, voir startBattle dans battle-flow.js)
   - applyFoeMechanic(f, move, target) : déclenche la mécanique quand l'IA a choisi son coup (voir
     runFoeDecisions) ; renvoie le coup à jouer (Capacité Max/Z) et le message d'annonce
==== */
const BOSS_MECHANIC_FLOOR = 50;

function playerHasMechanic(){
  return hasKeyItem('megaBracelet') || hasKeyItem('braceletZ') || hasKeyItem('braceletDynamax')
    || (bag.orbeTera||0)>0 || team.some(m=>m && m.heldItem==='orbeTera');
}

function assignBossMechanic(enemy, floor){
  if(!enemy || !enemy.length || !(floor>=BOSS_MECHANIC_FLOOR || playerHasMechanic())) return;
  const ace = enemy[enemy.length-1];
  const offensive = (ace.moveObjs||[]).filter(m=>m && m.cat!=='status');
  const strongest = offensive.slice().sort((a,b)=>(b.power||0)-(a.power||0))[0] || null;
  const sp = speciesOf({ lineId:ace.lineId, stage:ace.stage, branch:ace.branch, heldItem:null });
  // Méga-Évolutions possibles : une Méga-Gemme de l'espèce, ou Draco-Ascension pour Rayquaza.
  const megaKeys = Object.keys((sp && sp.forms) || {}).filter(k=>
    (ITEMS[k] && ITEMS[k].megaStone) || (k==='dragonascent' && (ace.moveObjs||[]).some(m=>m===MOVES.dragonascent)));
  const options = ['tera'];
  if(strongest) options.push('dynamax', 'z');
  if(megaKeys.length && ace.evs) options.push('mega');
  let kind = rand(options);
  if(kind==='z'){
    const crystal = Object.keys(ITEMS).find(k=>ITEMS[k].category==='zcristal' && ITEMS[k].zType===strongest.type);
    if(crystal){ ace.heldItem = crystal; ace.zType = strongest.type; }
    else kind = 'dynamax';
  }
  if(kind==='mega'){
    const key = rand(megaKeys), form = sp.forms[key];
    if(key!=='dragonascent') ace.heldItem = key;
    ace.megaFormData = { name:form.name, types:form.types, abilities:form.abilities };
    ace.megaStats = calcStats(form.base, ace.ivs, ace.evs, ace.nature, ace.level);
  }
  // Type Tera offensif : celui de sa plus forte attaque (sinon son premier type).
  if(kind==='tera') ace.teraType = strongest ? strongest.type : ace.types[0];
  ace.bossMechanic = kind;
}

function applyFoeMechanic(f, move, target){
  const bs = battleState;
  const offensive = !!move && (move.cat==='phys' || move.cat==='spec');
  if(!f.bossMechanic || f.bossMechUsed){
    if(f.dynamaxed && offensive) move = buildMaxMove(move, f, bs, target);
    return { move, msg:'' };
  }
  const prefix = boxIdFor(f).replace('Box','');
  let msg = '';
  if(f.bossMechanic==='mega'){
    const oldName = f.name;
    activateMegaEvolve(f);
    playMegaEvolveFx(prefix);
    msg = `${oldName} Méga-Évolue en ${f.name} !`;
  } else if(f.bossMechanic==='tera'){
    activateTera(f);
    playTeraFx(prefix, f.teraType);
    msg = `${f.name} se Téracristallise en type ${typeDisplayName(f.teraType)} !`;
  } else if(f.bossMechanic==='dynamax'){
    if(!offensive) return { move, msg:'' };
    applyDynamaxBoost(f);
    f.dynamaxed = true;
    f.dynamaxTurns = 3;
    playDynamaxFx(prefix);
    msg = `${f.name} se Dynamaxe !`;
    move = buildMaxMove(move, f, bs, target);
  } else if(f.bossMechanic==='z'){
    // L'IA a choisi d'attaquer : elle passe par son attaque du type du Cristal Z si celle-ci n'est pas
    // résistée par la cible, pour déclencher sa Capacité Z.
    if(!offensive) return { move, msg:'' };
    if(move.type!==f.zType){
      const zIdx = (f.moveObjs||[]).findIndex((m,i)=> m && m.type===f.zType && m.cat!=='status' && f.ppCur[i]>0);
      const zMove = zIdx>=0 ? f.moveObjs[zIdx] : null;
      if(!zMove || !target || getMult(zMove.type, target.transformedTypes || target.types) < 1) return { move, msg:'' };
      move = zMove;
    }
    move = buildZMove(move);
    msg = `${f.name} libère toute sa puissance Z !`;
  }
  f.bossMechUsed = true;
  return { move, msg };
}
