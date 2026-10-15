/* ==== SOMMAIRE ====
   Méga-Évolution : une fois par combat, côté joueur uniquement, si le porteur tient la Méga-Gemme
   correspondant à son espèce, il peut se Méga-Évoluer au moment de choisir une capacité — comme la
   Téracristallisation et le Dynamax. Contrairement au Dynamax (3 tours), l'effet dure jusqu'à la fin
   du combat, y compris en cas de changement de Pokémon (rien ne le réinitialise au retrait/renvoi,
   voir resetBattleFields dans battle-flow.js). Une fois le combat terminé, le Pokémon redevient
   normal : la Méga-Gemme ne le fait plus évoluer en permanence (voir speciesOf, pokemon/helpers.js),
   seulement pendant ce combat précis (megaFormData/megaStats précalculés à l'entrée en combat).
   - canMegaEvolve / activateMegaEvolve : condition d'activation + application de l'effet
==== */
// Vrai si ce Pokémon peut se Méga-Évoluer ce combat (Méga-Bracelet dans le sac, pas déjà utilisé côté
// joueur, tient la bonne Méga-Gemme, pas déjà Méga-Évolué).
function canMegaEvolve(p, bs){
  if(!p || !bs || bs.megaUsed || p.megaEvolved || !hasKeyItem('megaBracelet')) return false;
  return !!p.megaFormData;
}
// Déclenche la Méga-Évolution : remplace nom/types/talent/stats par la forme précalculée. Les PV
// (actuels et max) ne changent jamais avec une Méga-Évolution, comme dans les vrais jeux.
function activateMegaEvolve(p){
  if(!p.megaFormData || p.megaEvolved) return;
  const f = p.megaFormData;
  p.megaEvolved = true;
  p.name = f.name;
  p.transformedTypes = f.types;
  if(f.abilities && f.abilities.length) p.ability = f.abilities[0];
  p.stats = p.megaStats;
}
