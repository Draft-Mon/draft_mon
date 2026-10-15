/* ==== SOMMAIRE ====
   Tous les objets du jeu (achetables au Pokéshop ou vendus par le Marchand Itinérant). Repères
   (lignes approximatives) :
   - L.4    : Potions (soin/statut, consommables en combat)
   - L.16   : Baies (objets tenus, effet automatique en combat)
   - L.26   : Objets stratégiques tenus (Bandeau/Lunettes Choix, Orbe Vie, Ceinture Force...)
   - L.37   : Objets de forme (Plaques d'Arceus, appareils Motisma, Orbe Platiné, Gracidée...)
   - L.62   : Pierres Méga-Évolution
   - L.75   : Cristaux Z (un par type, débloquent les Capacités Z)
   - L.94   : Objets de fusion Necrozma
   - L.98   : Mémoires (retypent Silvallié)
   - L.116  : Objets légendaires de Galar (Épée/Bouclier Rouillé, Parchemins, Rênes Partagées)
   - L.123  : Facteur Gigamax (débloque le Gigamax en plus du Dynamax)
   - Après ITEMS : résolution des sprites d'objets (ITEM_SPRITE_SOURCES, itemIconHTML, retry
     automatique sur échec de chargement dans handleItemSpriteError)
==== */
function ITEM_SPRITE(slug){ return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${slug}.png`; }
const ITEMS = {
  // ---- Potions ----
  potion:       { name:'Potion',        sprite:ITEM_SPRITE('potion'),        price:100,  kind:'consumable', category:'potion', heal:0.5,  desc:"Restaure 50% des PV max." },
  superPotion:  { name:'Super Potion',  sprite:ITEM_SPRITE('super-potion'),  price:250,  kind:'consumable', category:'potion', heal:0.75, desc:"Restaure 75% des PV max." },
  hyperPotion:  { name:'Hyper Potion',  sprite:ITEM_SPRITE('hyper-potion'),  price:500,  kind:'consumable', category:'potion', heal:0.9,  desc:"Restaure 90% des PV max." },
  potionMax:    { name:'Potion Max',    sprite:ITEM_SPRITE('max-potion'),    price:900,  kind:'consumable', category:'potion', heal:1.0,  desc:"Restaure tous les PV du Pokémon." },
  antidote:     { name:'Antidote',      sprite:ITEM_SPRITE('antidote'),      price:80,   kind:'consumable', category:'potion', cureStatus:'poison',   desc:"Soigne un Pokémon empoisonné." },
  antiBrule:    { name:'Anti-Brûle',    sprite:ITEM_SPRITE('burn-heal'),     price:80,   kind:'consumable', category:'potion', cureStatus:'brulure',  desc:"Soigne un Pokémon brûlé." },
  antiGel:      { name:'Anti-Gel',      sprite:ITEM_SPRITE('ice-heal'),      price:80,   kind:'consumable', category:'potion', cureStatus:'gel',      desc:"Réchauffe un Pokémon gelé." },
  antiPara:     { name:'Anti-Para',     sprite:ITEM_SPRITE('paralyze-heal'), price:80,   kind:'consumable', category:'potion', cureStatus:'paralysie',desc:"Soigne un Pokémon paralysé." },
  reveil:       { name:'Réveil',        sprite:ITEM_SPRITE('awakening'),     price:80,   kind:'consumable', category:'potion', cureStatus:'sommeil',  desc:"Réveille un Pokémon endormi." },
  totalSoin:    { name:'Total Soin',    sprite:ITEM_SPRITE('full-heal'),     price:200,  kind:'consumable', category:'potion', cureStatus:'all',      desc:"Soigne toutes les altérations de statut." },
  guerison:     { name:'Guérison',      sprite:ITEM_SPRITE('full-restore'),  price:1200, kind:'consumable', category:'potion', heal:1.0, cureStatus:'all', desc:"Restaure tous les PV et soigne toutes les altérations de statut." },
  // ---- Baies (objets tenus) ----
  baieOran:     { name:'Baie Oran',     sprite:ITEM_SPRITE('oran-berry'),    price:150, kind:'held', category:'baie', berryHeal:0.12, desc:"Objet tenu : soigne 12% des PV max une fois passé à 50% des PV ou moins." },
  baieSitrus:   { name:'Baie Sitrus',   sprite:ITEM_SPRITE('sitrus-berry'),  price:250, kind:'held', category:'baie', berryHeal:0.25, desc:"Objet tenu : soigne 25% des PV max une fois passé à 50% des PV ou moins." },
  baiePecha:    { name:'Baie Prapêche', sprite:ITEM_SPRITE('pecha-berry'),   price:120, kind:'held', category:'baie', berryCure:'poison',   desc:"Objet tenu : soigne automatiquement le poison." },
  baieRawst:    { name:'Baie Rawst',    sprite:ITEM_SPRITE('rawst-berry'),   price:120, kind:'held', category:'baie', berryCure:'brulure',  desc:"Objet tenu : soigne automatiquement la brûlure." },
  baieAspic:    { name:'Baie Aspic',    sprite:ITEM_SPRITE('aspear-berry'),  price:120, kind:'held', category:'baie', berryCure:'gel',      desc:"Objet tenu : dégèle automatiquement le Pokémon." },
  baiePersim:   { name:'Baie Persim',   sprite:ITEM_SPRITE('persim-berry'),  price:120, kind:'held', category:'baie', berryCure:'confusion',desc:"Objet tenu : soigne automatiquement la confusion." },
  baieChesto:   { name:'Baie Chesto',   sprite:ITEM_SPRITE('chesto-berry'),  price:120, kind:'held', category:'baie', berryCure:'sommeil',  desc:"Objet tenu : réveille automatiquement le Pokémon." },
  baieSinelle:  { name:'Baie Sinelle',  sprite:ITEM_SPRITE('cheri-berry'),   price:120, kind:'held', category:'baie', berryCure:'paralysie',desc:"Objet tenu : soigne automatiquement la paralysie." },
  baieLum:      { name:'Baie Lum',      sprite:ITEM_SPRITE('lum-berry'),     price:300, kind:'held', category:'baie', berryCure:'all',      desc:"Objet tenu : soigne automatiquement n'importe quelle altération de statut." },
  // ---- Objets stratégiques (tenus) ----
  bandeauChoix:   { name:'Bandeau Choix',      sprite:ITEM_SPRITE('choice-band'),   price:400, kind:'held', category:'strat', choiceLock:'atk', desc:"Objet tenu : augmente l'Attaque de 50%, mais bloque sur la première capacité utilisée." },
  lunettesChoix:  { name:'Lunettes Choix',     sprite:ITEM_SPRITE('choice-specs'),  price:400, kind:'held', category:'strat', choiceLock:'spa', desc:"Objet tenu : augmente l'Attaque Spéciale de 50%, mais bloque sur la première capacité utilisée." },
  mouchoirChoix:  { name:'Mouchoir Choix',     sprite:ITEM_SPRITE('choice-scarf'),  price:400, kind:'held', category:'strat', choiceLock:'spe', desc:"Objet tenu : augmente la Vitesse de 50%, mais bloque sur la première capacité utilisée." },
  orbeVie:        { name:'Orbe Vie',           sprite:ITEM_SPRITE('life-orb'),      price:450, kind:'held', category:'strat', desc:"Objet tenu : augmente les dégâts infligés de 30%, mais fait perdre 10% des PV max à chaque capacité offensive utilisée." },
  vesteCombat:    { name:'Veste de Combat',    sprite:ITEM_SPRITE('assault-vest'),  price:400, kind:'held', category:'strat', desc:"Objet tenu : augmente la Défense Spéciale de 50%, mais empêche d'utiliser des capacités de statut." },
  griffeTranchante:{ name:'Griffe Tranchante', sprite:ITEM_SPRITE('scope-lens'),    price:300, kind:'held', category:'strat', desc:"Objet tenu : augmente nettement le taux de coups critiques." },
  boutonFuite:    { name:'Bouton Fuite',       sprite:ITEM_SPRITE('eject-button'),  price:300, kind:'held', category:'strat', desc:"Objet tenu : force le porteur à switcher dès qu'il subit une attaque." },
  herbeMental:    { name:'Herbe Mental',       sprite:ITEM_SPRITE('mental-herb'),   price:250, kind:'held', category:'strat', desc:"Objet tenu : soigne les effets de Provoc et Entrave. Se consomme après usage." },
  reste:          { name:'Reste',              sprite:ITEM_SPRITE('leftovers'),     price:200, kind:'held', category:'strat', desc:"Objet tenu : restaure environ 6% des PV max à la fin de chaque tour." },
  ceintureForce:  { name:'Ceinture Force',     sprite:ITEM_SPRITE('focus-sash'),    price:250, kind:'held', category:'strat', desc:"Objet tenu : survit à 1 PV si un coup l'aurait mis K.O. alors qu'il était à PV max. Se consomme après usage." },
  plumeFeerique:  { name:'Plume Enchantée',    sprite:ITEM_SPRITE('gen9/fairy-feather'), price:300, kind:'held', category:'strat', typeBoost:'fee', desc:"Objet tenu : augmente la puissance des capacités de type Fée du porteur." },
  charbon:        { name:'Charbon',             sprite:ITEM_SPRITE('charcoal'),        price:300, kind:'held', category:'strat', typeBoost:'feu', desc:"Objet tenu : augmente la puissance des capacités de type Feu du porteur." },
  eauMystique:    { name:'Eau Mystique',        sprite:ITEM_SPRITE('mystic-water'),    price:300, kind:'held', category:'strat', typeBoost:'eau', desc:"Objet tenu : augmente la puissance des capacités de type Eau du porteur." },
  graineMiracle:  { name:'Graine Miracle',      sprite:ITEM_SPRITE('miracle-seed'),    price:300, kind:'held', category:'strat', typeBoost:'plante', desc:"Objet tenu : augmente la puissance des capacités de type Plante du porteur." },
  aimant:         { name:'Aimant',              sprite:ITEM_SPRITE('magnet'),          price:300, kind:'held', category:'strat', typeBoost:'electrik', desc:"Objet tenu : augmente la puissance des capacités de type Électrik du porteur." },
  glaceEternelle: { name:'Glace Éternelle',     sprite:ITEM_SPRITE('never-melt-ice'),  price:300, kind:'held', category:'strat', typeBoost:'glace', desc:"Objet tenu : augmente la puissance des capacités de type Glace du porteur." },
  ceintureNoire:  { name:'Ceinture Noire',      sprite:ITEM_SPRITE('black-belt'),      price:300, kind:'held', category:'strat', typeBoost:'combat', desc:"Objet tenu : augmente la puissance des capacités de type Combat du porteur." },
  picVenin:       { name:'Pic Venin',           sprite:ITEM_SPRITE('poison-barb'),     price:300, kind:'held', category:'strat', typeBoost:'poison', desc:"Objet tenu : augmente la puissance des capacités de type Poison du porteur." },
  sableDoux:      { name:'Sable Doux',          sprite:ITEM_SPRITE('soft-sand'),       price:300, kind:'held', category:'strat', typeBoost:'sol', desc:"Objet tenu : augmente la puissance des capacités de type Sol du porteur." },
  becPointu:      { name:'Bec Pointu',          sprite:ITEM_SPRITE('sharp-beak'),      price:300, kind:'held', category:'strat', typeBoost:'vol', desc:"Objet tenu : augmente la puissance des capacités de type Vol du porteur." },
  cuillereTordue: { name:'Cuillère Tordue',     sprite:ITEM_SPRITE('twisted-spoon'),   price:300, kind:'held', category:'strat', typeBoost:'psy', desc:"Objet tenu : augmente la puissance des capacités de type Psy du porteur." },
  poudreArgentee: { name:'Poudre Argentée',     sprite:ITEM_SPRITE('silver-powder'),   price:300, kind:'held', category:'strat', typeBoost:'insecte', desc:"Objet tenu : augmente la puissance des capacités de type Insecte du porteur." },
  pierreDure:     { name:'Pierre Dure',         sprite:ITEM_SPRITE('hard-stone'),      price:300, kind:'held', category:'strat', typeBoost:'roche', desc:"Objet tenu : augmente la puissance des capacités de type Roche du porteur." },
  runeSort:       { name:'Rune Sort',           sprite:ITEM_SPRITE('spell-tag'),       price:300, kind:'held', category:'strat', typeBoost:'fantome', desc:"Objet tenu : augmente la puissance des capacités de type Fantôme du porteur." },
  crocDragon:     { name:'Croc Dragon',         sprite:ITEM_SPRITE('dragon-fang'),     price:300, kind:'held', category:'strat', typeBoost:'dragon', desc:"Objet tenu : augmente la puissance des capacités de type Dragon du porteur." },
  lunettesNoires: { name:'Lunettes Noires',     sprite:ITEM_SPRITE('black-glasses'),   price:300, kind:'held', category:'strat', typeBoost:'tenebres', desc:"Objet tenu : augmente la puissance des capacités de type Ténèbres du porteur." },
  peauMetal:      { name:'Peau Métal',          sprite:ITEM_SPRITE('metal-coat'),      price:300, kind:'held', category:'strat', typeBoost:'acier', desc:"Objet tenu : augmente la puissance des capacités de type Acier du porteur." },
  mouchoirSoie:   { name:'Mouchoir Soie',       sprite:ITEM_SPRITE('silk-scarf'),      price:300, kind:'held', category:'strat', typeBoost:'normal', desc:"Objet tenu : augmente la puissance des capacités de type Normal du porteur." },
  evoluroc:       { name:'Évoluroc',           sprite:ITEM_SPRITE('eviolite'),      price:350, kind:'held', category:'strat', desc:"Objet tenu : augmente la Défense et la Défense Spéciale de 50% si le porteur n'est pas encore totalement évolué." },
  casqueBrutal:   { name:'Casque Brut',        sprite:ITEM_SPRITE('rocky-helmet'),  price:300, kind:'held', category:'strat', desc:"Objet tenu : blesse l'assaillant d'1/6 de ses PV max lors d'une attaque physique au contact." },
  bottesCavalieres:{ name:'Grosses Bottes',    sprite:ITEM_SPRITE('gen8/heavy-duty-boots'), price:300, kind:'held', category:'strat', desc:"Objet tenu : le porteur est totalement épargné par les pièges d'entrée (Piège de Roc, Picots, Pics Toxik, Toile Gluante)." },
  seveNoire:      { name:'Boue Noire',         sprite:ITEM_SPRITE('black-sludge'),  price:250, kind:'held', category:'strat', desc:"Objet tenu : restaure environ 6% des PV max à la fin de chaque tour si le porteur est de type Poison, sinon lui fait perdre ce montant." },
  politiqueFaible:{ name:'Vulné-Assurance',    sprite:ITEM_SPRITE('weakness-policy'), price:300, kind:'held', category:'strat', desc:"Objet tenu : augmente fortement l'Attaque et l'Attaque Spéciale dès que le porteur subit un coup super efficace. Se consomme après usage." },
  energieImpulsive:{ name:'Énergie Booster',   sprite:ITEM_SPRITE('gen9/booster-energy'), price:300, kind:'held', category:'strat', desc:"Objet tenu : active immédiatement Protosynthèse ou Quark Chargée à l'entrée en combat, même sans le climat ou le terrain requis. Se consomme après usage." },
  argileClaire:   { name:'Lumargile',          sprite:ITEM_SPRITE('light-clay'),    price:200, kind:'held', category:'strat', desc:"Objet tenu : Protection et Mur Lumière posés par le porteur durent 8 tours au lieu de 5." },
  ceintureExperte:{ name:'Ceinture Pro',       sprite:ITEM_SPRITE('expert-belt'),   price:300, kind:'held', category:'strat', desc:"Objet tenu : augmente de 20% les dégâts infligés par une capacité super efficace." },
  ballonAir:      { name:'Ballon',             sprite:ITEM_SPRITE('air-balloon'),   price:250, kind:'held', category:'strat', desc:"Objet tenu : rend le porteur immunisé aux capacités de type Sol tant qu'il n'a pas subi de coup. Éclate au premier coup reçu." },
  // ---- Objets de forme (tenus, vendus uniquement par le Marchand Itinérant) ----
  orbePlatine:    { name:'Orbe Platiné',      sprite:ITEM_SPRITE('griseous-orb'), price:2000, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Giratina en Forme Originelle." },
  gracidee:       { name:'Gracidée',          sprite:ITEM_SPRITE('gracidea'),     price:2000, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Shaymin en Forme Ciel." },
  masqueSource:   { name:'Masque du Puits',    sprite:ITEM_SPRITE('gen9/wellspring-mask'), price:2000, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Ogerpon en Masque du Puits (Plante/Eau)." },
  masqueBraise:   { name:'Masque du Fourneau', sprite:ITEM_SPRITE('gen9/hearthflame-mask'), price:2000, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Ogerpon en Masque du Fourneau (Plante/Feu)." },
  masqueAngle:    { name:'Masque de la Pierre', sprite:ITEM_SPRITE('gen9/cornerstone-mask'), price:2000, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Ogerpon en Masque de la Pierre (Plante/Roche)." },
  miroirSacre:    { name:'Miroir Sacré',      sprite:ITEM_SPRITE('reveal-glass'), price:2000, kind:'held', category:'forme', formItem:true, emoji:'sparkle', desc:"Objet tenu : fait passer Boréas, Fulguris ou Démétéros en Forme Totémique." },
  appareilChauffe:  { name:'Four à Micro-ondes', sprite:ITEM_SPRITE('heat-rotom'), iconUrl:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10008.png', price:1500, kind:'held', category:'forme', formItem:true, emoji:'flame', desc:"Objet tenu : fait passer Motisma en Motisma Chauffe (Électrik/Feu)." },
  appareilLavage:   { name:'Machine à Laver',    sprite:ITEM_SPRITE('wash-rotom'), iconUrl:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10009.png', price:1500, kind:'held', category:'forme', formItem:true, emoji:'drop', desc:"Objet tenu : fait passer Motisma en Motisma Lavage (Électrik/Eau)." },
  appareilFrigo:    { name:'Réfrigérateur',      sprite:ITEM_SPRITE('frost-rotom'),iconUrl:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10010.png', price:1500, kind:'held', category:'forme', formItem:true, emoji:'snowflake', desc:"Objet tenu : fait passer Motisma en Motisma Frigo (Électrik/Glace)." },
  appareilVentilo:  { name:'Ventilateur',        sprite:ITEM_SPRITE('fan-rotom'),  iconUrl:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10011.png', price:1500, kind:'held', category:'forme', formItem:true, emoji:'fan', desc:"Objet tenu : fait passer Motisma en Motisma Ventilateur (Électrik/Vol)." },
  appareilTondeuse: { name:'Tondeuse à Gazon',   sprite:ITEM_SPRITE('mow-rotom'),  iconUrl:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10012.png', price:1500, kind:'held', category:'forme', formItem:true, emoji:'leaf', desc:"Objet tenu : fait passer Motisma en Motisma Tondeuse (Électrik/Plante)." },
  plaqueFlamme:   { name:'Plaque Flamme',    sprite:ITEM_SPRITE('flame-plate'),  price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Feu." },
  plaqueHydro:    { name:'Plaque Hydro',     sprite:ITEM_SPRITE('splash-plate'), price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Eau." },
  plaqueHerbe:    { name:'Plaque Herbe',     sprite:ITEM_SPRITE('meadow-plate'), price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Plante." },
  plaqueVolt:     { name:'Plaque Volt',      sprite:ITEM_SPRITE('zap-plate'),    price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Électrik." },
  plaqueCiel:     { name:'Plaque Ciel',      sprite:ITEM_SPRITE('sky-plate'),    price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Vol." },
  plaqueToxicite: { name:'Plaque Toxicité',  sprite:ITEM_SPRITE('toxic-plate'),  price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Poison." },
  plaqueTerre:    { name:'Plaque Terre',     sprite:ITEM_SPRITE('earth-plate'),  price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Sol." },
  plaqueInsecte:  { name:'Plaque Insecte',   sprite:ITEM_SPRITE('insect-plate'), price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Insecte." },
  plaquePoing:    { name:'Plaque Poing',     sprite:ITEM_SPRITE('fist-plate'),   price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Combat." },
  plaqueGlace:    { name:'Plaque Glace',     sprite:ITEM_SPRITE('icicle-plate'), price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Glace." },
  plaqueEsprit:   { name:'Plaque Esprit',    sprite:ITEM_SPRITE('mind-plate'),   price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Psy." },
  plaqueFantome:  { name:'Plaque Fantôme',   sprite:ITEM_SPRITE('spooky-plate'), price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Fantôme." },
  plaqueRoc:      { name:'Plaque Roc',       sprite:ITEM_SPRITE('stone-plate'),  price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Roche." },
  plaqueDraco:    { name:'Plaque Draco',     sprite:ITEM_SPRITE('draco-plate'),  price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Dragon." },
  plaqueFer:      { name:'Plaque Fer',       sprite:ITEM_SPRITE('iron-plate'),   price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Acier." },
  plaqueOmbre:    { name:'Plaque Ombre',     sprite:ITEM_SPRITE('dread-plate'),  price:1800, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Arceus au type Ténèbres." },
  moduleChoc:     { name:'Module Choc',      sprite:ITEM_SPRITE('shock-drive'),  price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : Techno-Buster devient de type Électrik quand Genesect le porte." },
  modulePyro:     { name:'Module Pyro',      sprite:ITEM_SPRITE('burn-drive'),   price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : Techno-Buster devient de type Feu quand Genesect le porte." },
  moduleCryo:     { name:'Module Cryo',      sprite:ITEM_SPRITE('chill-drive'),  price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : Techno-Buster devient de type Glace quand Genesect le porte." },
  moduleAqua:     { name:'Module Aqua',      sprite:ITEM_SPRITE('douse-drive'),  price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : Techno-Buster devient de type Eau quand Genesect le porte." },
  // ---- Méga-Gemmes (tenues, vendues uniquement par le Marchand Itinérant) ----
  charizarditeX:  { name:'Dracaufeurite X',  sprite:ITEM_SPRITE('charizardite-x'), price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Dracaufeu en Méga-Dracaufeu X (Feu/Dragon)." },
  charizarditeY:  { name:'Dracaufeurite Y',  sprite:ITEM_SPRITE('charizardite-y'), price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Dracaufeu en Méga-Dracaufeu Y (Feu/Vol)." },
  blastoisite:    { name:'Tortankite',       sprite:ITEM_SPRITE('blastoisinite'), price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Tortank en Méga-Tortank." },
  venusaurite:    { name:'Florizarrite',     sprite:ITEM_SPRITE('venusaurite'), price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Florizarre en Méga-Florizarre." },
  mewtwonitey:    { name:'Mewtwoïte Y',      sprite:ITEM_SPRITE('mewtwonite-y'), price:3500, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Mewtwo en Méga-Mewtwo Y." },
  gyaradosite:    { name:'Léviatorite',      sprite:ITEM_SPRITE('gyaradosite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Léviator en Méga-Léviator (Eau/Ténèbres)." },
  lucarionite:    { name:'Lucarionite',      sprite:ITEM_SPRITE('lucarionite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Lucario en Méga-Lucario." },
  garchompite:    { name:'Carchacrokite',    sprite:ITEM_SPRITE('garchompite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Carchacrok en Méga-Carchacrok." },
  metagrossite:   { name:'Métalossite',      sprite:ITEM_SPRITE('metagrossite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Métalosse en Méga-Métalosse." },
  scizorite:      { name:'Cizayoxite',       sprite:ITEM_SPRITE('scizorite'), price:2500, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Cizayox en Méga-Cizayox." },
  kangaskhanite:  { name:'Kangourexite',     sprite:ITEM_SPRITE('kangaskhanite'), price:2500, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Kangourex en Méga-Kangourex." },
  gardevoirite:   { name:'Gardevoirite',     sprite:ITEM_SPRITE('gardevoirite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Gardevoir en Méga-Gardevoir." },
  // ---- Méga-Gemmes classiques manquantes (Kalos, complétion v0.10.2) ----
  absolite:       { name:'Absolite',         sprite:ITEM_SPRITE('absolite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Absol en Méga-Absol." },
  flagadossite:   { name:'Flagadossite',     sprite:ITEM_SPRITE('slowbronite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Flagadoss en Méga-Flagadoss." },
  camerouptite:   { name:'Caméruptite',      sprite:ITEM_SPRITE('cameruptite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Camérupt en Méga-Camérupt." },
  dardargnite:    { name:'Dardargnite',      sprite:ITEM_SPRITE('beedrillite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Dardargnan en Méga-Dardargnan." },
  branettite:     { name:'Branettite',       sprite:ITEM_SPRITE('banettite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Branette en Méga-Branette." },
  mysdibulite:    { name:'Mysdibulite',      sprite:ITEM_SPRITE('mawilite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Mysdibule en Méga-Mysdibule." },
  pharampite:     { name:'Pharampite',       sprite:ITEM_SPRITE('ampharosite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Pharamp en Méga-Pharamp (Électrik/Dragon)." },
  altarite:       { name:'Altarite',         sprite:ITEM_SPRITE('altarianite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Altaria en Méga-Altaria (Dragon/Fée)." },
  tyranocivite:   { name:'Tyranocivite',     sprite:ITEM_SPRITE('tyranitarite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Tyranocif en Méga-Tyranocif." },
  roucarnagite:   { name:'Roucarnagite',     sprite:ITEM_SPRITE('pidgeotite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Roucarnage en Méga-Roucarnage." },
  elecsprintite:  { name:'Élecsprintite',    sprite:ITEM_SPRITE('manectite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Élecsprint en Méga-Élecsprint." },
  demolossite:    { name:'Démolossite',      sprite:ITEM_SPRITE('houndoominite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Démolosse en Méga-Démolosse." },
  nanmeouite:     { name:'Nanméouïte',       sprite:ITEM_SPRITE('audinite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Nanméouïe en Méga-Nanméouïe (Normal/Fée)." },
  lockpinite:     { name:'Lockpinite',       sprite:ITEM_SPRITE('lopunnite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Lockpin en Méga-Lockpin (Normal/Combat)." },
  tenefixite:     { name:'Ténéfixite',       sprite:ITEM_SPRITE('sablenite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Ténéfix en Méga-Ténéfix." },
  sharpedite:     { name:'Sharpedite',       sprite:ITEM_SPRITE('sharpedonite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Sharpedo en Méga-Sharpedo." },
  scarhinoite:    { name:'Scarhinoïte',      sprite:ITEM_SPRITE('heracronite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Scarhino en Méga-Scarhino." },
  pteraite:       { name:'Ptéraïte',         sprite:ITEM_SPRITE('aerodactylite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Ptéra en Méga-Ptéra." },
  alakazamite:    { name:'Alakazamite',      sprite:ITEM_SPRITE('alakazite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Alakazam en Méga-Alakazam." },
  oniglalite:     { name:'Oniglalite',       sprite:ITEM_SPRITE('glalitite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Oniglali en Méga-Oniglali." },
  scarabruite:    { name:'Scarabruite',      sprite:ITEM_SPRITE('pinsirite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Scarabrute en Méga-Scarabrute (Insecte/Vol)." },
  galekingite:    { name:'Galekingite',      sprite:ITEM_SPRITE('aggronite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Galeking en Méga-Galeking (perd le type Roche)." },
  gallamite:      { name:'Gallamite',        sprite:ITEM_SPRITE('galladite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Gallame en Méga-Gallame." },
  drattakite:     { name:'Drattakite',       sprite:ITEM_SPRITE('salamencite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Drattak en Méga-Drattak." },
  ectoplasmite:   { name:'Ectoplasmite',     sprite:ITEM_SPRITE('gengarite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Ectoplasma en Méga-Ectoplasma." },
  charminite:     { name:'Charminite',       sprite:ITEM_SPRITE('medichamite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Charmina en Méga-Charmina." },
  blizzarite:     { name:'Blizzarite',       sprite:ITEM_SPRITE('abomasite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Blizzaroi en Méga-Blizzaroi." },
  steelixite:     { name:'Steelixite',       sprite:ITEM_SPRITE('steelixite'), price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, desc:"Objet tenu : fait Méga-Évoluer Steelix en Méga-Steelix (Acier/Sol)." },
  // ---- Méga-Gemmes de Pokémon Légendes Z-A (tenues, vendues uniquement par le Marchand Itinérant) ----
  dragoninite:    { name:'Dracolossite',     sprite:ITEM_SPRITE('dragoninite'),    iconUrl:'assets/image/items/dragoninite.png',    price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Dracolosse en Méga-Dracolosse (Dragon/Vol)." },
  victreebelite:  { name:'Empiflorite',      sprite:ITEM_SPRITE('victreebelite'),  iconUrl:'assets/image/items/victreebelite.png',  price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Empiflor en Méga-Empiflor (Plante/Poison)." },
  clefablite:     { name:'Mélodelfite',      sprite:ITEM_SPRITE('clefablite'),     iconUrl:'assets/image/items/clefablite.png',     price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Mélodelfe en Méga-Mélodelfe (Fée/Vol)." },
  starminite:     { name:'Starossite',       sprite:ITEM_SPRITE('starminite'),     iconUrl:'assets/image/items/starminite.png',     price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Staross en Méga-Staross (Eau/Psy)." },
  meganiumite:    { name:'Méganiumite',      sprite:ITEM_SPRITE('meganiumite'),    iconUrl:'assets/image/items/meganiumite.png',    price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Méganium en Méga-Méganium (Plante/Fée)." },
  feraligite:     { name:'Aligatueurite',    sprite:ITEM_SPRITE('feraligite'),     iconUrl:'assets/image/items/feraligite.png',     price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Aligatueur en Méga-Aligatueur (Eau/Dragon)." },
  skarmorite:     { name:'Airmurite',        sprite:ITEM_SPRITE('skarmorite'),     iconUrl:'assets/image/items/skarmorite.png',     price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Airmure en Méga-Airmure." },
  froslassite:    { name:'Momartikite',      sprite:ITEM_SPRITE('froslassite'),    iconUrl:'assets/image/items/froslassite.png',    price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Momartik en Méga-Momartik." },
  emboarite:      { name:'Roitiflamite',     sprite:ITEM_SPRITE('emboarite'),      iconUrl:'assets/image/items/emboarite.png',      price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Roitiflam en Méga-Roitiflam." },
  excadrite:      { name:'Minotaupite',      sprite:ITEM_SPRITE('excadrite'),      iconUrl:'assets/image/items/excadrite.png',      price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Minotaupe en Méga-Minotaupe." },
  scolipite:      { name:'Brutapodite',      sprite:ITEM_SPRITE('scolipite'),      iconUrl:'assets/image/items/scolipite.png',      price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Brutapode en Méga-Brutapode." },
  scraftinite:    { name:'Baggaïdite',       sprite:ITEM_SPRITE('scraftinite'),    iconUrl:'assets/image/items/scraftinite.png',    price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Baggaïd en Méga-Baggaïd." },
  eelektrossite:  { name:'Ohmassacrite',     sprite:ITEM_SPRITE('eelektrossite'),  iconUrl:'assets/image/items/eelektrossite.png',  price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Ohmassacre en Méga-Ohmassacre." },
  chandelurite:   { name:'Lugulabrite',      sprite:ITEM_SPRITE('chandelurite'),   iconUrl:'assets/image/items/chandelurite.png',   price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Lugulabre en Méga-Lugulabre." },
  chesnaughtite:  { name:'Blindépiquite',    sprite:ITEM_SPRITE('chesnaughtite'),  iconUrl:'assets/image/items/chesnaughtite.png',  price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Blindépique en Méga-Blindépique." },
  delphoxite:     { name:'Goupelinite',      sprite:ITEM_SPRITE('delphoxite'),     iconUrl:'assets/image/items/delphoxite.png',     price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Goupelin en Méga-Goupelin." },
  greninjite:     { name:'Amphinolite',      sprite:ITEM_SPRITE('greninjite'),     iconUrl:'assets/image/items/greninjite.png',     price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Amphinobi en Méga-Amphinobi." },
  pyroarite:      { name:'Néméliosite',      sprite:ITEM_SPRITE('pyroarite'),      iconUrl:'assets/image/items/pyroarite.png',      price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Némélios en Méga-Némélios." },
  floettite:      { name:'Floettite',        sprite:ITEM_SPRITE('floettite'),      iconUrl:'assets/image/items/floettite.png',      price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Florges en Floette (Fleur Éternelle)." },
  barbaracite:    { name:'Golgopathite',     sprite:ITEM_SPRITE('barbaracite'),    iconUrl:'assets/image/items/barbaracite.png',    price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Golgopathe en Méga-Golgopathe (Roche/Combat)." },
  dragalgite:     { name:'Kravarekite',      sprite:ITEM_SPRITE('dragalgite'),     iconUrl:'assets/image/items/dragalgite.png',     price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Kravarech en Méga-Kravarech." },
  hawluchanite:   { name:'Brutalibrite',     sprite:ITEM_SPRITE('hawluchanite'),   iconUrl:'assets/image/items/hawluchanite.png',   price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Brutalibré en Méga-Brutalibré." },
  malamarite:     { name:'Sepiatrocite',     sprite:ITEM_SPRITE('malamarite'),     iconUrl:'assets/image/items/malamarite.png',     price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Sepiatroce en Méga-Sepiatroce." },
  zygardite:      { name:'Zygardite',        sprite:ITEM_SPRITE('zygardite'),      iconUrl:'assets/image/items/zygardite.png',      price:3200, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Zygarde en Méga-Zygarde." },
  drampanite:     { name:'Draïeulite',       sprite:ITEM_SPRITE('drampanite'),     iconUrl:'assets/image/items/drampanite.png',     price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Draïeul en Méga-Draïeul." },
  falinksite:     { name:'Hexadronite',      sprite:ITEM_SPRITE('falinksite'),     iconUrl:'assets/image/items/falinksite.png',     price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Hexadron en Méga-Hexadron." },
  // ---- Méga-Gemmes Z (Légendes Z-A : Méga-Dimension) ----
  lucarioniteZ:   { name:'Lucarionite Z',    sprite:ITEM_SPRITE('lucarionite'), iconUrl:'assets/image/items/lucarionitez.png', price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Lucario en Méga-Lucario Z." },
  absoliteZ:      { name:'Absolite Z',       sprite:ITEM_SPRITE('absolite'), iconUrl:'assets/image/items/absolitez.png', price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Absol en Méga-Absol Z." },
  garchompiteZ:   { name:'Carchacrokite Z',  sprite:ITEM_SPRITE('garchompite'), iconUrl:'assets/image/items/garchompitez.png', price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Carchacrok en Méga-Carchacrok Z." },
  // ---- Méga-Évolutions ajoutées en v0.12.1 : Méga classiques manquantes, puis Légendes Z-A : Méga-Dimension ----
  mewtwonitex:    { name:'Mewtwoïte X', sprite:ITEM_SPRITE('mewtwonite-x'), price:3500, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Mewtwo en Méga-Mewtwo X." },
  sceptilite:     { name:'Jungkoïte', sprite:ITEM_SPRITE('sceptilite'), price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Jungko en Méga-Jungko." },
  blazikenite:    { name:'Braségalite', sprite:ITEM_SPRITE('blazikenite'), price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Braségali en Méga-Braségali." },
  swampertite:    { name:'Laggronite', sprite:ITEM_SPRITE('swampertite'), price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Laggron en Méga-Laggron." },
  latiasite:      { name:'Latiasite', sprite:ITEM_SPRITE('latiasite'), price:3500, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Latias en Méga-Latias." },
  latiosite:      { name:'Latiosite', sprite:ITEM_SPRITE('latiosite'), price:3500, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Latios en Méga-Latios." },
  diancite:       { name:'Diancite', sprite:ITEM_SPRITE('diancite'), price:3500, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Diancie en Méga-Diancie." },
  raichuniteX:    { name:'Raichunite X', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/raichunitex.png', price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Raichu en Méga-Raichu X." },
  raichuniteY:    { name:'Raichunite Y', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/raichunitey.png', price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Raichu en Méga-Raichu Y." },
  chimechite:     { name:'Éokite', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/chimechite.png', price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Éoko en Méga-Éoko." },
  staraptite:     { name:'Étouraptorite', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/staraptite.png', price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Étouraptor en Méga-Étouraptor." },
  heatranite:     { name:'Heatranite', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/heatranite.png', price:3500, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Heatran en Méga-Heatran." },
  darkranite:     { name:'Darkraïte', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/darkranite.png', price:3500, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Darkrai en Méga-Darkrai." },
  golurkite:      { name:'Golemastocite', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/golurkite.png', price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Golemastoc en Méga-Golemastoc." },
  meowsticite:    { name:'Mistigrixite', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/meowsticite.png', price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Mistigrix en Méga-Mistigrix." },
  crabominite:    { name:'Crabominite', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/crabominite.png', price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Crabominable en Méga-Crabominable." },
  golisopite:     { name:'Sarmuraïte', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/golisopite.png', price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Sarmuraï en Méga-Sarmuraï." },
  magearnite:     { name:'Magearnite', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/magearnite.png', price:3500, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Magearna en Méga-Magearna." },
  zeraorite:      { name:'Zeraorite', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/zeraorite.png', price:3500, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Zeraora en Méga-Zeraora." },
  scovillainite:  { name:'Scovilainite', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/scovillainite.png', price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Scovilain en Méga-Scovilain." },
  glimmoranite:   { name:'Floréclatite', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/glimmoranite.png', price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Floréclat en Méga-Floréclat." },
  tatsugirinite:  { name:'Nigirigonite', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/tatsugirinite.png', price:2800, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Nigirigon en Méga-Nigirigon." },
  baxcalibrite:   { name:'Glaivodite', sprite:ITEM_SPRITE('key-stone'), iconUrl:'assets/image/items/baxcalibrite.png', price:3000, kind:'held', category:'forme', formItem:true, megaStone:true, emoji:'diamond', desc:"Objet tenu : fait Méga-Évoluer Glaivodo en Méga-Glaivodo." },
  // ---- Cristaux Z (tenus, vendus uniquement par le Marchand Itinérant) ----
  zCrystalNormal:   { name:'Normazélite',     sprite:ITEM_SPRITE('normalium-z--held'),   price:2200, kind:'held', category:'zcristal', zType:'normal',   emoji:'star', desc:"Objet tenu : permet de déclencher une Capacité Z Normal en combat." },
  zCrystalCombat:   { name:'Combazélite',     sprite:ITEM_SPRITE('fightinium-z--held'),  price:2200, kind:'held', category:'zcristal', zType:'combat',   emoji:'boxing-glove', desc:"Objet tenu : permet de déclencher une Capacité Z Combat en combat." },
  zCrystalVol:      { name:'Aérozélite',      sprite:ITEM_SPRITE('flyinium-z--held'),    price:2200, kind:'held', category:'zcristal', zType:'vol',      emoji:'feather', desc:"Objet tenu : permet de déclencher une Capacité Z Vol en combat." },
  zCrystalPoison:   { name:'Toxizélite',      sprite:ITEM_SPRITE('poisonium-z--held'),   price:2200, kind:'held', category:'zcristal', zType:'poison',   emoji:'skull', desc:"Objet tenu : permet de déclencher une Capacité Z Poison en combat." },
  zCrystalSol:      { name:'Terrazélite',     sprite:ITEM_SPRITE('groundium-z--held'),   price:2200, kind:'held', category:'zcristal', zType:'sol',      emoji:'mountains', desc:"Objet tenu : permet de déclencher une Capacité Z Sol en combat." },
  zCrystalRoche:    { name:'Rocazélite',      sprite:ITEM_SPRITE('rockium-z--held'),     price:2200, kind:'held', category:'zcristal', zType:'roche',    emoji:'mountains', desc:"Objet tenu : permet de déclencher une Capacité Z Roche en combat." },
  zCrystalInsecte:  { name:'Insectozélite',   sprite:ITEM_SPRITE('buginium-z--held'),    price:2200, kind:'held', category:'zcristal', zType:'insecte',  emoji:'bug', desc:"Objet tenu : permet de déclencher une Capacité Z Insecte en combat." },
  zCrystalFantome:  { name:'Spectrozélite',   sprite:ITEM_SPRITE('ghostium-z--held'),    price:2200, kind:'held', category:'zcristal', zType:'fantome',  emoji:'ghost', desc:"Objet tenu : permet de déclencher une Capacité Z Spectre en combat." },
  zCrystalAcier:    { name:'Métallozélite',   sprite:ITEM_SPRITE('steelium-z--held'),    price:2200, kind:'held', category:'zcristal', zType:'acier',    emoji:'gear', desc:"Objet tenu : permet de déclencher une Capacité Z Acier en combat." },
  zCrystalFeu:      { name:'Pyrozélite',      sprite:ITEM_SPRITE('firium-z--held'),      price:2200, kind:'held', category:'zcristal', zType:'feu',      emoji:'flame', desc:"Objet tenu : permet de déclencher une Capacité Z Feu en combat." },
  zCrystalEau:      { name:'Aquazélite',      sprite:ITEM_SPRITE('waterium-z--held'),    price:2200, kind:'held', category:'zcristal', zType:'eau',      emoji:'drop', desc:"Objet tenu : permet de déclencher une Capacité Z Eau en combat." },
  zCrystalPlante:   { name:'Florazélite',     sprite:ITEM_SPRITE('grassium-z--held'),    price:2200, kind:'held', category:'zcristal', zType:'plante',   emoji:'leaf', desc:"Objet tenu : permet de déclencher une Capacité Z Plante en combat." },
  zCrystalElectrik: { name:'Voltazélite',     sprite:ITEM_SPRITE('electrium-z--held'),   price:2200, kind:'held', category:'zcristal', zType:'electrik', emoji:'lightning', desc:"Objet tenu : permet de déclencher une Capacité Z Électrik en combat." },
  zCrystalPsy:      { name:'Psychézélite',    sprite:ITEM_SPRITE('psychium-z--held'),    price:2200, kind:'held', category:'zcristal', zType:'psy',      emoji:'eye', desc:"Objet tenu : permet de déclencher une Capacité Z Psy en combat." },
  zCrystalGlace:    { name:'Cryozélite',      sprite:ITEM_SPRITE('icium-z--held'),       price:2200, kind:'held', category:'zcristal', zType:'glace',    emoji:'snowflake', desc:"Objet tenu : permet de déclencher une Capacité Z Glace en combat." },
  zCrystalDragon:   { name:'Dracozélite',     sprite:ITEM_SPRITE('dragonium-z--held'),   price:2200, kind:'held', category:'zcristal', zType:'dragon',   emoji:'spiral', desc:"Objet tenu : permet de déclencher une Capacité Z Dragon en combat." },
  zCrystalTenebres: { name:'Ténébrozélite',   sprite:ITEM_SPRITE('darkinium-z--held'),   price:2200, kind:'held', category:'zcristal', zType:'tenebres', emoji:'moon', desc:"Objet tenu : permet de déclencher une Capacité Z Ténèbres en combat." },
  zCrystalFee:      { name:'Nymphézélite',    sprite:ITEM_SPRITE('fairium-z--held'),     price:2200, kind:'held', category:'zcristal', zType:'fee',      emoji:'flower', desc:"Objet tenu : permet de déclencher une Capacité Z Fée en combat." },
  // ---- Objets de fusion Necrozma (tenus, vendus uniquement par le Marchand Itinérant) ----
  prismeCouchant:  { name:'Prisme du Couchant', sprite:ITEM_SPRITE('n-solarizer--merge'), price:3000, kind:'held', category:'forme', formItem:true, emoji:'sun', desc:"Objet tenu : fait fusionner Necrozma avec la lumière de Solgaleo (Crinière du Couchant, Psy/Acier)." },
  prismeAurore:    { name:"Prisme de l'Aurore", sprite:ITEM_SPRITE('n-lunarizer--merge'), price:3000, kind:'held', category:'forme', formItem:true, emoji:'moon-stars', desc:"Objet tenu : fait fusionner Necrozma avec la lumière de Lunala (Ailes de l'Aurore, Psy/Spectre)." },
  ultranecrozium:  { name:'Ultranécrozium Z',  sprite:ITEM_SPRITE('ultranecrozium-z--held'), price:3500, kind:'held', category:'forme', formItem:true, emoji:'sparkle', desc:"Objet tenu : fait passer Necrozma en Ultra-Necrozma (Psy/Dragon)." },
  // ---- Mémoires (tenues, vendues uniquement par le Marchand Itinérant) : changent le type de Silvallié ----
  memoireCombat:   { name:'Mémoire Combat',   sprite:ITEM_SPRITE('fighting-memory'), price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Combat." },
  memoireVol:      { name:'Mémoire Vol',      sprite:ITEM_SPRITE('flying-memory'),   price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Vol." },
  memoirePoison:   { name:'Mémoire Poison',   sprite:ITEM_SPRITE('poison-memory'),   price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Poison." },
  memoireSol:      { name:'Mémoire Sol',      sprite:ITEM_SPRITE('ground-memory'),   price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Sol." },
  memoireRoche:    { name:'Mémoire Roche',    sprite:ITEM_SPRITE('rock-memory'),     price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Roche." },
  memoireInsecte:  { name:'Mémoire Insecte',  sprite:ITEM_SPRITE('bug-memory'),      price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Insecte." },
  memoireFantome:  { name:'Mémoire Fantôme',  sprite:ITEM_SPRITE('ghost-memory'),    price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Fantôme." },
  memoireAcier:    { name:'Mémoire Acier',    sprite:ITEM_SPRITE('steel-memory'),    price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Acier." },
  memoireFeu:      { name:'Mémoire Feu',      sprite:ITEM_SPRITE('fire-memory'),     price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Feu." },
  memoireEau:      { name:'Mémoire Eau',      sprite:ITEM_SPRITE('water-memory'),    price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Eau." },
  memoirePlante:   { name:'Mémoire Plante',   sprite:ITEM_SPRITE('grass-memory'),    price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Plante." },
  memoireElectrik: { name:'Mémoire Électrik', sprite:ITEM_SPRITE('electric-memory'), price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Électrik." },
  memoirePsy:      { name:'Mémoire Psy',      sprite:ITEM_SPRITE('psychic-memory'),  price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Psy." },
  memoireGlace:    { name:'Mémoire Glace',    sprite:ITEM_SPRITE('ice-memory'),      price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Glace." },
  memoireDragon:   { name:'Mémoire Dragon',   sprite:ITEM_SPRITE('dragon-memory'),   price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Dragon." },
  memoireTenebres: { name:'Mémoire Ténèbres', sprite:ITEM_SPRITE('dark-memory'),     price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Ténèbres." },
  memoireFee:      { name:'Mémoire Fée',      sprite:ITEM_SPRITE('fairy-memory'),    price:1500, kind:'held', category:'forme', formItem:true, desc:"Objet tenu : fait passer Silvallié au type Fée." },
  // ---- Légendaires de Galar (tenus, vendus uniquement par le Marchand Itinérant) ----
  epeeRouillee:     { name:'Épée Rouillée',   sprite:ITEM_SPRITE('rusted-sword'),    iconUrl:'assets/image/items/rusted-sword.png', price:3000, kind:'held', category:'forme', formItem:true, emoji:'sword', desc:"Objet tenu : fait passer Zacian en Forme Épée Sacrée (Fée/Acier)." },
  bouclierRouille:  { name:'Bouclier Rouillé', sprite:ITEM_SPRITE('rusted-shield'),  iconUrl:'assets/image/items/rusted-shield.png', price:3000, kind:'held', category:'forme', formItem:true, emoji:'shield', desc:"Objet tenu : fait passer Zamazenta en Forme Bouclier Royal (Combat/Acier)." },
  parcheminTenebres:{ name:'Parchemin des Ténèbres', sprite:ITEM_SPRITE('scroll-of-darkness'), iconUrl:'assets/image/items/scroll-of-darkness.png', price:2800, kind:'held', category:'forme', formItem:true, emoji:'scroll', desc:"Objet tenu : fait passer Wushours en Shifours Style Farouche (Combat/Ténèbres)." },
  parcheminAqua:    { name:'Parchemin Aqua',  sprite:ITEM_SPRITE('scroll-of-waters'), iconUrl:'assets/image/items/scroll-of-waters.png', price:2800, kind:'held', category:'forme', formItem:true, emoji:'scroll', desc:"Objet tenu : fait passer Wushours en Shifours Style Aqua (Combat/Eau)." },
  renePartageGlace: { name:'Rêne Partagée Glace', sprite:ITEM_SPRITE('reins-of-unity'), iconUrl:'assets/image/items/reins-of-unity.png', price:3200, kind:'held', category:'forme', formItem:true, emoji:'snowflake', desc:"Objet tenu : fait fusionner Sylveroy avec Blizzeval (Monture Glace, Psy/Glace)." },
  renePartageSpectre:{ name:'Rêne Partagée Spectre', sprite:ITEM_SPRITE('reins-of-unity'), iconUrl:'assets/image/items/reins-of-unity.png', price:3200, kind:'held', category:'forme', formItem:true, emoji:'ghost', desc:"Objet tenu : fait fusionner Sylveroy avec Spectreval (Monture Spectre, Psy/Spectre)." },
  // ---- Gigamax (tenu, vendu uniquement par le Marchand Itinérant) ----
  facteurGigamax:{ name:'Facteur Gigamax', sprite:ITEM_SPRITE('max-mushrooms'), iconUrl:'assets/image/items/max-mushrooms.png', price:2000, kind:'held', category:'forme', formItem:true, emoji:'circle', desc:"Objet tenu : permet au porteur de devenir Gigamax en plus de Dynamax, avec une Capacité G-Max unique s'il y est éligible." },
  // ---- Téracristallisation (tenu, vendu uniquement par le Marchand Itinérant) ----
  // ---- Objets clés (Pokéshop, onglet Bracelets) : un exemplaire dans le sac suffit pour toute la partie et
  // débloque une mécanique de combat pour toute l'équipe (voir hasKeyItem). Ni tenus ni utilisables. ----
  megaBracelet:   { name:'Méga-Bracelet',   sprite:ITEM_SPRITE('mega-bracelet'), iconUrl:'assets/image/items/mega-bracelet.png', price:3000, kind:'key', category:'cle', emoji:'diamond', desc:"Objet clé : permet à tes Pokémon de Méga-Évoluer en combat (avec leur Méga-Gemme tenue), une fois par combat." },
  braceletZ:      { name:'Bracelet Z',      sprite:ITEM_SPRITE('z-ring'), price:2500, kind:'key', category:'cle', emoji:'lightning', desc:"Objet clé : permet à tes Pokémon d'utiliser une Capacité Z en combat (avec un Cristal Z tenu), une fois par combat." },
  braceletDynamax:{ name:'Bracelet Dynamax', sprite:ITEM_SPRITE('dynamax-band'), iconUrl:'assets/image/items/dynamax-band.png', price:2500, kind:'key', category:'cle', emoji:'circle', desc:"Objet clé : permet à tes Pokémon de Dynamaxer en combat, une fois par combat." },
  orbeTera:{ name:'Orbe Téracristal', sprite:ITEM_SPRITE('tera-orb'), iconUrl:'assets/image/items/tera-orb.png', price:2000, kind:'held', category:'forme', formItem:true, emoji:'diamond', desc:"Objet tenu : permet au porteur de se Téracristalliser une fois par combat, adoptant son Type Tera (choisi dans la fenêtre Équipe) pour le reste du combat." }
};
// Vrai si le joueur possède cet objet clé (Méga-Bracelet, Bracelet Z, Bracelet Dynamax) dans son sac.
function hasKeyItem(key){ return (bag[key]||0)>0; }
const ITEM_SPRITE_SOURCES = [
  slug => `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items/${slug}.png`,
  slug => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${slug}.png`
];
const ITEM_SPRITE_MAX_ATTEMPTS = 8;
const ITEM_SPRITE_RETRY_DELAYS = [300, 600, 1200, 2000, 3000, 4000, 5000];
// Extrait le slug d'objet (ex. "potion") depuis une URL de sprite, pour retenter d'autres sources en cas d'échec.
function itemSlugFromSprite(url){
  const m = url.match(/items\/(.+)\.png$/);
  return m ? m[1] : null;
}
// Génère le <img> d'icône d'un objet (avec repli automatique vers une icône si le sprite ne charge jamais).
// iconUrl (sprite local en assets/, ou URL directe) court-circuite le système de repli PokeAPI :
// utilisé pour les objets sans sprite officiel d'objet (récupéré ailleurs, ou pas de sprite du tout).
function itemIconHTML(key, size){
  const item = ITEMS[key];
  const s = size||22;
  if(item.iconUrl){
    return `<img src="${item.iconUrl}" alt="${item.name}" data-item-emoji="${item.emoji}" data-item-size="${s}" style="width:${s}px;height:${s}px;object-fit:contain;image-rendering:pixelated;vertical-align:middle;" onerror="handleItemSpriteError(this)">`;
  }
  const slug = itemSlugFromSprite(item.sprite);
  const url = ITEM_SPRITE_SOURCES[0](slug);
  return `<img src="${url}" alt="${item.name}" data-item-slug="${slug}" data-item-emoji="${item.emoji}" data-item-size="${s}" style="width:${s}px;height:${s}px;object-fit:contain;image-rendering:pixelated;vertical-align:middle;" onerror="handleItemSpriteError(this)">`;
}
// Appelé quand un sprite d'objet échoue à charger : retente une autre source, puis abandonne vers une icône.
function handleItemSpriteError(img){
  const slug = img.dataset.itemSlug;
  const attempt = parseInt(img.dataset.itemAttempt || '0', 10) + 1;
  img.dataset.itemAttempt = String(attempt);
  if(!slug || attempt >= ITEM_SPRITE_MAX_ATTEMPTS){
    const span = document.createElement('span');
    span.innerHTML = phIcon(img.dataset.itemEmoji || 'question');
    span.style.cssText = `font-size:${img.dataset.itemSize||22}px;line-height:1;vertical-align:middle;`;
    img.replaceWith(span);
    return;
  }
  const source = ITEM_SPRITE_SOURCES[attempt % ITEM_SPRITE_SOURCES.length];
  const delay = ITEM_SPRITE_RETRY_DELAYS[Math.min(attempt-1, ITEM_SPRITE_RETRY_DELAYS.length-1)];
  setTimeout(()=>{ if(img.isConnected) img.src = source(slug); }, delay);
}
