/* ==== SOMMAIRE ====
   Pokédex n°906 à 1025 (région de Paldea) + 4 lignées de Formes de Paldea + contenu DLC (Le
   Masque Turquoise / Le Disque Indigo). Repères (lignes approximatives) :
   - L.11-110  : Starters + lignées classiques de Paldea
   - L.111-135 : Formes de Paldea (Axoloto, Tauros — réutilisent le n° de Pokédex national)
   - L.136-150 : Oyacata/Nigirigon, Glaivodo, Mordudor/Gromago, Motorizard
   - L.151-170 : Fléau (Chongjian/Baojian/Dinglu/Yuyu), Trio Fidèle + Ogerpon
   - L.171-200 : Pokémon Paradoxe (passé et futur)
   - L.201-220 : Légendaires (Miraidon/Koraidon, Terapagos, Pêchaminus) + nouvelles évolutions DLC
   - L.221-fin : DEX_NUMBERS_GEN9 (numéros de Pokédex, utilisés pour résoudre les sprites)
==== */
const LINES_GEN9 = [
{id:'sprigatito',abilities:['Engrais','Protéen'],moveIds:['scratch','leafage','trailblaze','protect','swift','endure','hyperbeam','solarbeam','facade','sleeptalk','rest','takedown','thief','gigadrain','taunt','knockoff','brickbreak','shadowball','aerialace','bulletseed','darkpulse','magicalleaf','tailwhip','bite','quickattack','slash','uturn','playrough','nightslash','grassyterrain','thunderpunch','suckerpunch','petalblizzard','doubleteam','trick','leechseed','substitute','helpinghand','copycat','worryseed','seedbomb','energyball','nastyplot','leafstorm','grassknot','honeclaws','allyswitch','acrobatics','grasspledge','terablast','fling','lowsweep','powergem','gigaimpact','trickroom','foulplay','flowertrick','chillingwater','tripleaxel','solarblade','agility','aurasphere','charm','disarmingvoice','faketears','frenzyplant','grassyglide','lashout','lowkick','mudslap','pollenpuff','psychup','shadowclaw','skillswap','spikes','throatchop','toxicspikes'],
 stages:[
  {name:'Poussacha',types:['plante'],base:st(40,61,54,45,45,65)},
  {name:'Matourgeon',types:['plante'],base:st(61,80,70,65,60,90)},
  {name:'Miascarade',types:['plante','tenebres'],base:st(76,110,70,81,70,123)}]},
{id:'fuecoco',abilities:['Brasier','Inconscient'],moveIds:['tackle','ember','flamethrower','fireblast','torchsong','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','takedown','bodyslam','shadowball','willowisp','solarbeam','scaryface','dig','curse','zenheadbutt','earthquake','heatwave','overheat','firespin','leer','bite','yawn','hypervoice','lick','firefang','thunderfang','encore','slackoff','belch','sing','roar','substitute','helpinghand','flareblitz','seedbomb','flamecharge','round','incinerate','firepledge','snarl','terablast','temperflare','earthpower','gigaimpact','hex','heatcrash','alluringvoice','blastburn','burnup','crunch','disarmingvoice','imprison','mudslap','nightshade','outrage','poltergeist','scorchingsands','shadowclaw','stompingtantrum'],
 stages:[
  {name:'Chochodile',types:['feu'],base:st(67,45,59,63,58,49)},
  {name:'Crocogril',types:['feu'],base:st(81,55,78,90,58,73)},
  {name:'Flâmigator',types:['feu','fantome'],base:st(104,75,100,110,75,66)}]},
{id:'quaxly',abilities:['Torrent','Impudence'],moveIds:['pound','watergun','aquacutter','wavecrash','liquidation','closecombat','swordsdance','protect','swift','endure','hyperbeam','surf','facade','sleeptalk','rest','raindance','takedown','waterpulse','icywind','brickbreak','hydropump','whirlpool','taunt','knockoff','wingattack','growl','focusenergy','airslash','featherdance','megakick','detect','rapidspin','counter','helpinghand','roost','lastresort','bravebird','aquajet','doublehit','acrobatics','waterpledge','workup','terablast','chillingwater','lowsweep','substitute','fling','gigaimpact','icespinner','aquastep','aerialace','agility','aircutter','batonpass','bulkup','coaching','disarmingvoice','encore','endeavor','flipturn','hurricane','hydrocannon','lowkick','mistyterrain','psychup','reversal','tripleaxel','upperhand','uturn'],
 stages:[
  {name:'Coiffeton',types:['eau'],base:st(55,65,45,50,45,50)},
  {name:'Canarbello',types:['eau'],base:st(70,85,65,65,60,65)},
  {name:'Palmaval',types:['eau','combat'],base:st(85,120,80,85,75,85)}]},
{id:'lechonk',abilities:['Voile Aromatique','Gloutonnerie','Isograisse'],moveIds:['tackle','bodyslam','doubleedge','bulldoze','superfang','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','takedown','thief','dig','zenheadbutt','uproar','hypervoice','endeavor','headbutt','tailwhip','yawn','mudshot','disarmingvoice','belch','stockpile','spitup','swallow','stuffcheeks','substitute','helpinghand','seedbomb','echoedvoice','workup','terablast','chillingwater','energyball','earthpower','gigaimpact','covet','bodypress','bulletseed','curse','highhorsepower','ironhead','lashout','mudslap','playrough','stompingtantrum','trailblaze'],
 stages:[
  {name:'Gourmelet',types:['normal'],base:st(54,45,40,35,45,35)},
  {name:'Fragroin',types:['normal'],base:st(110,100,75,59,80,65),abilities:['Odeur Tenace','Gloutonnerie','Isograisse']}]},
{id:'tarountula',abilities:['Insomnia','Filature'],moveIds:['tackle','leechlife','stringshot','protect','endure','facade','sleeptalk','rest','sunnyday','raindance','takedown','thief','bodyslam','rocktomb','aerialace','brickbreak','gigadrain','bugbite','knockoff','scaryface','poisonjab','headbutt','counter','block','stickyweb','throatchop','skittersmack','memento','suckerpunch','firstimpression','lunge','substitute','feint','assurance','gastroacid','xscissor','bugbuzz','grassknot','circlethrow','strugglebug','terablast','pounce','fling','gigaimpact','electroweb','silktrap','bulletseed','falseswipe','lowkick','painsplit','reversal','shadowclaw','spikes','taunt','toxicspikes','trailblaze','upperhand','uturn'],
 stages:[
  {name:'Tissenboule',types:['insecte'],base:st(35,41,45,29,40,20)},
  {name:'Filentrappe',types:['insecte'],base:st(60,79,92,52,86,35)}]},
{id:'nymble',abilities:['Essaim','Lentiteintée'],moveIds:['tackle','leechlife','axekick','swordsdance','protect','endure','facade','sleeptalk','rest','raindance','sunnyday','takedown','thief','doubleedge','taunt','scaryface','aerialace','brickbreak','knockoff','darkpulse','agility','leer','doublekick','screech','astonish','suckerpunch','bugbite','firstimpression','lowkick','detect','bounce','throatchop','lunge','counter','skittersmack','substitute','feint','assurance','xscissor','bugbuzz','strugglebug','terablast','pounce','fling','gigaimpact','lowsweep','lashout','reversal','spite','trailblaze','uturn'],
 stages:[
  {name:'Lilliterelle',types:['insecte'],base:st(33,46,40,21,25,45)},
  {name:'Gambex',types:['insecte','tenebres'],base:st(71,102,78,52,55,92)}]},
{id:'pawmi',abilities:['Statik','Médic Nature','Poing de Fer'],moveIds:['thundershock','thunderpunch','doubleshock','closecombat','thunderbolt','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','raindance','takedown','sunnyday','brickbreak','focusblast','dig','rocktomb','thief','doubleedge','thunderwave','thunder','agility','knockoff','lowkick','focuspunch','bulkup','scratch','slam','bite','growl','quickattack','spark','charge','discharge','armthrust','thunderfang','firepunch','icepunch','machpunch','sweetkiss','fakeout','wish','substitute','helpinghand','fling','chargebeam','electroball','entrainment','voltswitch','electroweb','wildcharge','nuzzle','terablast','lowsweep','seedbomb','gigaimpact','grassknot','revivalblessing','batonpass','bodypress','charm','coaching','crunch','eerieimpulse','electricterrain','encore','metalclaw','metronome','playrough','supercellslam','superfang','throatchop','upperhand'],
 stages:[
  {name:'Pohm',types:['electrik'],base:st(45,50,20,40,25,60)},
  {name:'Pohmotte',types:['electrik','combat'],base:st(60,75,40,50,40,85),abilities:['Absorbe-Volt','Médic Nature','Poing de Fer']},
  {name:'Pohmarmotte',types:['electrik','combat'],base:st(70,115,70,70,60,105),abilities:['Absorbe-Volt','Médic Nature','Poing de Fer']}]},
{id:'tandemaus',abilities:['Fuite','Ramassage','Tempo Perso'],moveIds:['bite','populationbomb','superfang','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','takedown','doubleedge','thief','dig','thunderwave','agility','aerialace','waterpulse','hypervoice','pound','charm','encore','beatup','bulletseed','playrough','babydolleyes','batonpass','tickle','substitute','helpinghand','feint','copycat','seedbomb','switcheroo','grassknot','doublehit','lowsweep','afteryou','echoedvoice','terablast','followme','gigaimpact','tidyup','chillingwater','crunch','faketears','lowkick','mudshot','mudslap','shadowclaw','taunt','trailblaze','uturn'],
 stages:[
  {name:'Compagnol',types:['normal'],base:st(18,48,32,24,48,66)},
  {name:'Famignol',types:['normal'],base:st(74,75,70,65,75,111),abilities:['Garde-Ami','Bajoues','Technicien']}]},
{id:'fidough',abilities:['Tempo Perso','Maladresse'],moveIds:['tackle','playrough','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','bodyslam','takedown','doubleedge','dig','charm','dazzlinggleam','scaryface','tailwhip','bite','growl','lick','batonpass','crunch','babydolleyes','firefang','icefang','thunderfang','sweetscent','wish','yawn','howl','roar','substitute','helpinghand','copycat','lastresort','workup','snarl','terablast','gigaimpact','covet','agility','alluringvoice','bodypress','drainingkiss','endeavor','mistyterrain','mudshot','mudslap','psychicfangs','psychup','stompingtantrum','trailblaze'],
 stages:[
  {name:'Pâtachiot',types:['fee'],base:st(37,55,70,30,55,37)},
  {name:'Briochien',types:['fee'],base:st(57,80,135,50,80,62),abilities:['Corps Cuit','Voile Aromatique']}]},
{id:'smoliv',abilities:['Matinal','Récolte'],moveIds:['tackle','absorb','gigadrain','solarbeam','dazzlinggleam','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','lightscreen','bulletseed','megadrain','growth','razorleaf','flail','sweetscent','grassyterrain','terrainpulse','petaldance','safeguard','mirrorcoat','petalblizzard','synthesis','memento','weatherball','strengthsap','leechseed','substitute','helpinghand','seedbomb','energyball','earthpower','leafstorm','grassknot','terablast','fling','gigaimpact','alluringvoice','charm','encore','hypervoice','magicalleaf','metronome','pollenpuff','psychup','reflect','solarblade','trailblaze'],
 stages:[
  {name:'Olivini',types:['plante','normal'],base:st(41,35,50,55,50,25)},
  {name:'Olivado',types:['plante','normal'],base:st(52,53,60,78,78,44)},
  {name:'Arboliva',types:['plante','normal'],base:st(78,69,90,125,109,39),abilities:['Semeur de Graines','Récolte']}]},
{id:'tapatoes',abilities:['Intimidation','Agitation','Cran'],moveIds:['peck','growl','sandattack','furyattack','wingattack','pursuit','screech','agility','aerialace','featherdance','roost','uturn','assurance','knockoff','foulplay','payback','partingshot','taunt','torment','swagger','protect','endure','hyperbeam','facade','sleeptalk','rest','substitute','doubleedge','takedown','bodyslam','quickattack','doublehit','tripleaxel','bravebird','hurricane','airslash','dualwingbeat','uproar','spite','snarl','throatchop','lashout','round','retaliate','workup','terablast','defog','tailwind','mudslap','rockslide','stoneedge','gigaimpact','aircutter','copycat','endeavor','faketears','finalgambit','flatter','fly','heatwave','helpinghand','hypervoice','mimic','pounce','reversal','scaryface','sunnyday','thief'],
 stages:[
  {name:'Tapatoès',types:['normal','vol'],base:st(82,96,51,45,51,92)}]},
{id:'nacli',abilities:['Sel Purifiant','Fermeté','Corps Sain'],moveIds:['tackle','rockthrow','stoneedge','stealthrock','irondefense','bodypress','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','rockslide','rocktomb','takedown','bulldoze','bodyslam','sandstorm','earthquake','dig','doubleedge','curse','brickbreak','ancientpower','ironhead','rockblast','zenheadbutt','headbutt','recover','harden','mudshot','saltcure','explosion','block','firepunch','icepunch','thunderpunch','fissure','substitute','helpinghand','rockpolish','powergem','earthpower','smackdown','heavyslam','terablast','gigaimpact','gravity','hammerarm','fling','avalanche','wideguard','hardpress','dynamicpunch','flashcannon','focuspunch','meteorbeam','stompingtantrum'],
 stages:[
  {name:'Selutin',types:['roche'],base:st(55,55,100,35,37,5)},
  {name:'Amassel',types:['roche'],base:st(60,68,115,40,45,10)},
  {name:'Gigansel',types:['roche'],base:st(100,100,150,45,90,35)}]},
{id:'charcadet',abilities:['Torche','Corps Ardent'],moveIds:['ember','flamethrower','fireblast','psychic','shadowball','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','takedown','calmmind','lightscreen','reflect','taunt','solarbeam','trick','willowisp','brickbreak','focusblast','curse','psychup','psybeam','leer','firespin','nightshade','astonish','mysticalfire','expandingforce','armorcannon','swordsdance','shadowclaw','disable','spite','destinybond','nightslash','solarblade','substitute','helpinghand','flareblitz','lavaplume','flamecharge','clearsmog','incinerate','terablast','fling','energyball','trickroom','wideguard','psyshock','acidspray','storedpower','allyswitch','xscissor','vacuumwave','gigaimpact','psychocut','quickguard','hex','bitterblade','shadowsneak','confuseray','heatwave','overheat'],
 stages:[
  {name:'Charbambin',types:['feu'],base:st(40,50,40,50,40,35)}],
 branches:[
  {name:'Carmadura',types:['feu','psy'],base:st(85,60,100,125,80,75),abilities:['Torche','Armure Rouillée'],extraMoveIds:['armorcannon','expandingforce','aurasphere','burnup','darkpulse','dragonpulse','flashcannon','irondefense','meteorbeam','psychicterrain','scorchingsands','weatherball']},
  {name:'Malvalame',types:['feu','fantome'],base:st(75,125,80,60,100,85),abilities:['Torche','Armure Rouillée'],extraMoveIds:['shadowclaw','poltergeist','bulkup','burnup','closecombat','dragonclaw','falseswipe','irondefense','ironhead','phantomforce','poisonjab','throatchop']}]},
{id:'tadbulb',abilities:['Tempo Perso','Statik','Moiteur'],moveIds:['tackle','thundershock','discharge','thunderbolt','protect','swift','endure','hyperbeam','sleeptalk','rest','raindance','thunderwave','thunder','lightscreen','charge','reflect','mudslap','watergun','flail','zapcannon','spark','weatherball','mudshot','suckerpunch','electricterrain','slackoff','muddywater','substitute','chargebeam','electroball','soak','acidspray','voltswitch','electroweb','wildcharge','terablast','chillingwater','gigaimpact','confuseray','eerieimpulse','hypervoice','supercellslam','toxic','waterpulse','parabolicharge'],
 stages:[
  {name:'Têtampoule',types:['electrik'],base:st(61,31,41,59,35,84)},
  {name:'Ampibidou',types:['electrik'],base:st(109,64,91,103,83,45),abilities:['Électrogenèse','Statik','Moiteur']}]},
{id:'wattrel',abilities:['Turbo Vent','Absorbe-Volt','Battant'],moveIds:['peck','thundershock','airslash','hurricane','thunderbolt','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','takedown','agility','aerialace','uturn','thunderwave','fly','scaryface','thunder','quickattack','aircutter','growl','spark','uproar','discharge','dualwingbeat','stockpile','spitup','swallow','endeavor','featherdance','weatherball','substitute','roost','pluck','tailwind','bravebird','chargebeam','electroball','acrobatics','voltswitch','electroweb','wildcharge','terablast','gigaimpact','charge','eerieimpulse','electricterrain','supercellslam'],
 stages:[
  {name:'Zapétrel',types:['electrik','vol'],base:st(40,40,35,55,40,70)},
  {name:'Fulgulairo',types:['electrik','vol'],base:st(70,70,60,105,60,125)}]},
{id:'maschiff',abilities:['Intimidation','Fuite','Filature'],moveIds:['tackle','bite','crunch','protect','endure','hyperbeam','facade','doubleedge','sleeptalk','rest','raindance','sunnyday','takedown','thief','bodyslam','taunt','scaryface','dig','darkpulse','leer','curse','spite','headbutt','lick','reversal','swagger','jawlock','outrage','comeuppance','firefang','icefang','thunderfang','destinybond','endeavor','playrough','roar','substitute','helpinghand','payback','honeclaws','retaliate','snarl','terablast','gigaimpact','wildcharge','charm','faketears','hypervoice','lashout','painsplit','psychicfangs','trailblaze'],
 stages:[
  {name:'Grondogue',types:['tenebres'],base:st(60,78,60,40,55,49)},
  {name:'Dogrino',types:['tenebres'],base:st(80,120,90,60,70,69),abilities:['Intimidation','Chien de Garde','Filature']}]},
{id:'shroodle',abilities:['Délestage','Pickpocket','Farceur'],moveIds:['scratch','poisonjab','throatchop','sludgebomb','protect','endure','facade','sleeptalk','rest','sunnyday','raindance','takedown','doubleedge','thief','dig','scaryface','knockoff','swordsdance','taunt','leer','bite','furyswipes','slash','flatter','poisonfang','uturn','toxic','superfang','swagger','substitute','helpinghand','fling','copycat','switcheroo','nastyplot','crosspoison','gunkshot','venoshock','sludgewave','acidspray','foulplay','acrobatics','partingshot','terablast','pounce','xscissor','gigaimpact','lowsweep','doodle','batonpass','encore','endeavor','lowkick','metronome','mudshot','mudslap','poisontail','psychup','shadowclaw','skittersmack','trailblaze'],
 stages:[
  {name:'Gribouraigne',types:['poison','normal'],base:st(40,65,35,40,35,75)},
  {name:'Tag-Tag',types:['poison','normal'],base:st(63,95,60,65,60,115),abilities:['Délestage','Toxitouche','Farceur']}]},
{id:'bramblin',abilities:['Cavalier du Vent','Infiltration'],moveIds:['poltergeist','shadowball','protect','endure','hyperbeam','solarbeam','facade','sleeptalk','rest','gigadrain','thief','curse','scaryface','bulletseed','disable','absorb','megadrain','defensecurl','rollout','painsplit','rapidspin','astonish','phantomforce','infestation','beatup','block','strengthsap','leechseed','substitute','seedbomb','energyball','leafstorm','powerwhip','grassknot','hex','terablast','pounce','gigaimpact','shadowsneak','confuseray','grassyglide','grassyterrain','nightshade','skittersmack','spikes','spite','trailblaze'],
 stages:[
  {name:'Virovent',types:['fantome','plante'],base:st(40,65,30,45,35,60)},
  {name:'Virevorreur',types:['fantome','plante'],base:st(55,115,70,80,70,90)}]},
{id:'toedscool',abilities:['Force Mycélium'],moveIds:['tackle','protect','swift','endure','hyperbeam','solarbeam','sleeptalk','rest','raindance','gigadrain','scaryface','mudslap','mudshot','bulletseed','knockoff','magicalleaf','sludgebomb','wrap','supersonic','absorb','megadrain','growth','poisonpowder','stunspore','screech','spore','toxic','rapidspin','mirrorcoat','tickle','leechseed','substitute','acupressure','seedbomb','energyball','earthpower','trickroom','leafstorm','powerwhip','grassknot','venoshock','ragepowder','acidspray','foulplay','hex','terablast','gigaimpact','reflecttype','confuseray','dazzlinggleam','flashcannon','grassyglide','grassyterrain','lightscreen','lunge','painsplit','reflect','skittersmack','spikes','taunt','toxicspikes','trailblaze'],
 stages:[
  {name:'Terracool',types:['sol','plante'],base:st(40,40,35,50,100,70)},
  {name:'Terracruel',types:['sol','plante'],base:st(80,70,65,80,120,100)}]},
{id:'klawf',abilities:['Coquille Furie','Coque Armure','Régé-Force'],moveIds:['rockthrow','stoneedge','stealthrock','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','rockslide','rocktomb','takedown','bulldoze','bodyslam','sandstorm','dig','brickbreak','irondefense','thief','ancientpower','scaryface','rockblast','swordsdance','guillotine','harden','flail','metalclaw','rocksmash','highhorsepower','crabhammer','knockoff','endeavor','substitute','helpinghand','fling','xscissor','powergem','earthpower','gigaimpact','smackdown','terablast','temperflare','meteorbeam','mudshot','mudslap','reversal','shadowclaw','skittersmack','stompingtantrum','throatchop','trailblaze'],
 stages:[
  {name:'Craparoi',types:['roche'],base:st(70,100,115,35,55,75)}]},
{id:'capsakid',abilities:['Chlorophylle','Insomnia','Maladresse'],moveIds:['gigadrain','spicyextract','solarbeam','flamethrower','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','takedown','thief','zenheadbutt','scaryface','fireblast','bulletseed','willowisp','magicalleaf','firespin','overheat','headbutt','leer','bite','growth','razorleaf','crunch','leafage','firefang','thunderfang','rollout','ingrain','leechseed','substitute','helpinghand','worryseed','seedbomb','energyball','leafstorm','grassknot','ragepowder','terablast','flareblitz','gigaimpact','doublehit','temperflare','burningjealousy','endeavor','grassyglide','grassyterrain','lashout','sandstorm','stompingtantrum','superfang','swagger','trailblaze'],
 stages:[
  {name:'Pimito',types:['plante'],base:st(50,62,40,62,40,50)},
  {name:'Scovilain',types:['plante','feu'],base:st(65,108,65,108,65,75),abilities:['Chlorophylle','Insomnia','Lunatique'],forms:{
    scovillainite:{name:'Méga-Scovilain',types:['plante','feu'],base:st(65,138,85,138,85,75),abilities:['Habanéruption']}
  }}]},
{id:'rellor',abilities:['Œil Composé','Mue'],moveIds:['tackle','confusion','psychic','expandingforce','protect','endure','hyperbeam','facade','sleeptalk','rest','calmmind','raindance','sunnyday','lightscreen','shadowball','takedown','zenheadbutt','reflect','thief','psychup','skillswap','psybeam','rocktomb','trick','futuresight','safeguard','dig','sandattack','defensecurl','rollout','mudshot','bugbite','lunge','extrasensory','speedswap','recover','memento','weatherball','cosmicpower','substitute','fling','xscissor','bugbuzz','gunkshot','strugglebug','terablast','pounce','gravity','powerswap','guardswap','powergem','energyball','earthpower','gigaimpact','trickroom','psyshock','electroball','storedpower','revivalblessing','confuseray','dazzlinggleam','imprison','irondefense','leechlife','mudslap','poltergeist','psychicnoise','psychicterrain','sandstorm','skittersmack','sludgebomb'],
 stages:[
  {name:'Léboulérou',types:['insecte'],base:st(41,25,30,40,30,14)},
  {name:'Bérasca',types:['insecte','psy'],base:st(75,50,85,115,100,45),abilities:['Synchro','Télépathe']}]},
{id:'flittle',abilities:['Anticipation','Fouille','Turbo'],moveIds:['confusion','psybeam','expandingforce','dazzlinggleam','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','calmmind','raindance','sunnyday','shadowball','lightscreen','psychic','zenheadbutt','reflect','bodyslam','takedown','skillswap','psychup','doubleedge','trick','thief','growl','peck','agility','quickattack','uproar','disarmingvoice','babydolleyes','drillpeck','featherdance','hypnosis','substitute','helpinghand','roost','pluck','seedbomb','trickroom','psyshock','foulplay','storedpower','allyswitch','terablast','pounce','lastresort','energyball','bravebird','gigaimpact','hex','luminacrash','aerialace','batonpass','confuseray','flashcannon','hypervoice','lowkick','mudslap','nightshade','psychicterrain','sandstorm','uturn'],
 stages:[
  {name:'Flotillon',types:['psy'],base:st(30,35,30,55,30,75)},
  {name:'Cléopsytra',types:['psy'],base:st(95,60,60,101,60,105),abilities:['Opportuniste','Fouille','Turbo']}]},
{id:'tinkatink',abilities:['Brise Moule','Tempo Perso','Pickpocket'],moveIds:['playrough','gigatonhammer','flashcannon','protect','endure','facade','sleeptalk','rest','rockslide','rocktomb','brickbreak','bulldoze','lightscreen','thunderwave','stealthrock','thief','reflect','stoneedge','slam','sweetkiss','metalclaw','rocksmash','fakeout','flatter','knockoff','astonish','drainingkiss','fairywind','babydolleyes','brutalswing','skittersmack','icehammer','substitute','helpinghand','feint','fling','foulplay','quash','terablast','pounce','woodhammer','smackdown','heavyslam','hardpress','covet','encore','endeavor','faketears','metronome','screech','skillswap','steelbeam','swordsdance','stridoson'],
 stages:[
  {name:'Forgerette',types:['fee','acier'],base:st(50,45,45,35,64,58)},
  {name:'Forgella',types:['fee','acier'],base:st(65,55,55,45,82,78)},
  {name:'Forgelina',types:['fee','acier'],base:st(85,75,77,70,105,94)}]},
{id:'wiglett',abilities:['Point Gluant','Phobique','Voile Sable'],moveIds:['watergun','surf','liquidation','hydropump','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','raindance','takedown','icebeam','waterpulse','blizzard','whirlpool','bulldoze','dig','mudshot','muddywater','mudslap','agility','slam','sandattack','headbutt','wrap','suckerpunch','throatchop','tripledive','memento','substitute','helpinghand','earthpower','aquajet','foulplay','finalgambit','terablast','chillingwater','gigaimpact','painsplit','sandstorm','stompingtantrum'],
 stages:[
  {name:'Taupikeau',types:['eau'],base:st(10,55,25,35,25,95)},
  {name:'Triopikeau',types:['eau'],base:st(35,100,50,50,70,120)}]},
{id:'bombirdier',abilities:['Cœur de Coq','Regard Vif','Chargement Rocheux'],moveIds:['peck','airslash','hurricane','protect','endure','hyperbeam','facade','sleeptalk','raindance','sunnyday','takedown','thief','aerialace','taunt','scaryface','uturn','rocktomb','rockslide','fly','darkpulse','knockoff','leer','icywind','aircutter','wingattack','whirlwind','rockthrow','torment','memento','dualwingbeat','skyattack','featherdance','suckerpunch','powertrip','substitute','roost','pluck','tailwind','payback','powergem','bravebird','gigaimpact','nastyplot','honeclaws','foulplay','acrobatics','drillrun','snarl','partingshot','terablast','curse','endeavor','heatwave','hypervoice','lashout','psychup','rockblast','sandstorm','stealthrock','stoneedge'],
 stages:[
  {name:'Lestombaile',types:['vol','tenebres'],base:st(70,103,85,60,85,82)}]},
{id:'finizen',abilities:['Ignifu-Voile'],moveIds:['watergun','liquidation','wavecrash','hydropump','protect','swift','endure','hyperbeam','surf','facade','sleeptalk','rest','raindance','takedown','icebeam','waterpulse','icywind','bodyslam','blizzard','waterfall','whirlpool','focusblast','zenheadbutt','taunt','supersonic','mist','focusenergy','charm','encore','dive','astonish','aquatail','focuspunch','flipturn','jetpunch','icepunch','counter','haze','tickle','bounce','boomburst','substitute','helpinghand','fling','aquajet','doublehit','acrobatics','terablast','chillingwater','drainpunch','gigaimpact','grassknot','hardpress','agility','aurasphere','bulkup','closecombat','disarmingvoice','drainingkiss','endeavor','hypervoice','ironhead','outrage','psychup','reversal','throatchop'],
 stages:[
  {name:'Dofin',types:['eau'],base:st(70,45,40,45,40,75)},
  {name:'Superdofin',types:['eau'],base:st(100,70,72,53,62,100),abilities:['Zéro à Héros']}]},
{id:'varoom',abilities:['Envelocape','Début Calme'],moveIds:['poisonjab','ironhead','sludgebomb','flashcannon','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','raindance','takedown','bodyslam','doubleedge','scaryface','thief','bulldoze','irondefense','taunt','sandstorm','curse','toxic','headbutt','screech','lick','smog','sludge','poisongas','swagger','uproar','spinout','shiftgear','haze','selfdestruct','torment','substitute','gyroball','assurance','gunkshot','venoshock','sludgewave','acidspray','partingshot','terablast','magnetrise','gigaimpact','heavyslam','hardpress','temperflare','endeavor','highhorsepower','lashout','overheat','steelbeam','toxicspikes','zenheadbutt','stridoson'],
 stages:[
  {name:'Vrombi',types:['acier','poison'],base:st(45,70,63,30,45,62)},
  {name:'Vrombotor',types:['acier','poison'],base:st(80,119,90,54,67,90),abilities:['Envelocape','Filtre']}]},
{id:'orthworm',abilities:['Dévore-Terre','Voile Sable'],moveIds:['tackle','ironhead','steelbeam','earthquake','bodypress','irondefense','protect','endure','hyperbeam','facade','sleeptalk','rest','takedown','bodyslam','rockslide','rocktomb','doubleedge','bulldoze','flashcannon','sandstorm','stealthrock','dig','curse','wrap','harden','mudslap','irontail','shedtail','substitute','helpinghand','metalburst','earthpower','gigaimpact','smackdown','heavyslam','coil','terablast','highhorsepower','mudshot','rockblast','sandtomb','spikes','stompingtantrum','stridoson'],
 stages:[
  {name:'Ferdeter',types:['acier'],base:st(70,85,145,60,55,65)}]},
{id:'glimmet',abilities:['Débris Toxique','Corrosion'],moveIds:['toxicspikes','sludgebomb','rockslide','stoneedge','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','raindance','rocktomb','sandstorm','stealthrock','irondefense','mudshot','toxic','solarbeam','rockthrow','harden','selfdestruct','acidarmor','ancientpower','spikyshield','mortalspin','explosion','memento','substitute','rockpolish','powergem','gunkshot','venoshock','smackdown','sludgewave','acidspray','terablast','energyball','earthpower','gigaimpact','confuseray','dazzlinggleam','flashcannon','lightscreen','meteorbeam','reflect','rockblast','sandtomb','spikes'],
 stages:[
  {name:'Germéclat',types:['roche','poison'],base:st(48,35,42,105,58,60)},
  {name:'Floréclat',types:['roche','poison'],base:st(83,55,90,130,81,86),forms:{
    glimmoranite:{name:'Méga-Floréclat',types:['roche','poison'],base:st(83,90,105,150,96,101),abilities:['Adaptabilité']}
  }}]},
{id:'greavard',abilities:['Ramassage','Pelage Moelleux'],moveIds:['tackle','bite','shadowball','poltergeist','crunch','protect','endure','hyperbeam','facade','doubleedge','sleeptalk','rest','raindance','sunnyday','takedown','thief','scaryface','zenheadbutt','dig','bulldoze','trick','confuseray','headbutt','tailwhip','growl','lick','charm','phantomforce','playrough','lastrespects','firefang','icefang','thunderfang','disable','destinybond','memento','yawn','howl','roar','substitute','helpinghand','allyswitch','hex','snarl','terablast','gigaimpact','shadowsneak','bodypress','endeavor','mudshot','mudslap','nightshade','painsplit','psychicfangs','sandstorm','stompingtantrum','swagger','uproar','willowisp'],
 stages:[
  {name:'Toutombe',types:['fantome'],base:st(50,61,60,30,55,55)},
  {name:'Tomberro',types:['fantome'],base:st(72,101,100,50,97,68),abilities:['Baigne Sable','Pelage Moelleux']}]},
{id:'flamigo',abilities:['Querelleur','Pieds Confus','Doublage'],moveIds:['peck','closecombat','airslash','hurricane','protect','endure','hyperbeam','facade','sleeptalk','rest','swordsdance','takedown','aerialace','thief','taunt','agility','uturn','fly','reversal','wingattack','doublekick','megakick','lowkick','focusenergy','detect','throatchop','doubleteam','skyattack','substitute','roost','feint','tailwind','payback','fling','copycat','bravebird','gigaimpact','wideguard','lowsweep','quickguard','acrobatics','terablast','pounce','chillingwater','aircutter','bulkup','dualwingbeat','endeavor','featherdance','liquidation','lunge','psychup','upperhand','waterpulse'],
 stages:[
  {name:'Flamenroule',types:['vol','combat'],base:st(82,115,74,55,80,115)}]},
{id:'cetoddle',abilities:['Isograisse','Rideau Neige','Sans Limite'],moveIds:['tackle','iciclespear','icebeam','protect','endure','hyperbeam','facade','sleeptalk','rest','blizzard','raindance','takedown','bodyslam','doubleedge','icywind','bulldoze','waterpulse','earthquake','curse','growl','amnesia','flail','powdersnow','bounce','icefang','icepunch','bellydrum','superpower','yawn','substitute','helpinghand','avalanche','iceshard','heavyslam','entrainment','echoedvoice','iciclecrash','terablast','icespinner','snowscape','chillingwater','gigaimpact','hardpress','bodypress','charm','highhorsepower','hypervoice','knockoff','liquidation','playrough','stompingtantrum'],
 stages:[
  {name:'Piétacé',types:['glace'],base:st(60,85,60,40,40,55)},
  {name:'Balbalèze',types:['glace'],base:st(170,113,65,45,55,73),abilities:['Isograisse','Glisse Neige','Sans Limite']}]},
{id:'veluza',abilities:['Brise Moule','Incisif'],moveIds:['psychic','zenheadbutt','liquidation','expandingforce','protect','endure','hyperbeam','surf','sleeptalk','rest','raindance','takedown','icebeam','waterpulse','bodyslam','icywind','blizzard','doubleedge','waterfall','hydropump','tackle','focusenergy','slash','crunch','nightslash','filletaway','aquacutter','icefang','thrash','recover','substitute','pluck','gigaimpact','psychocut','aquajet','storedpower','finalgambit','drillrun','terablast','snowscape','chillingwater','agility','endeavor','flipturn','painsplit','psychicfangs','psychicterrain','scaleshot'],
 stages:[
  {name:'Délestin',types:['eau','psy'],base:st(90,102,73,78,65,70)}]},
{id:'dondozo',abilities:['Inconscient','Benêt','Ignifu-Voile'],moveIds:['tackle','liquidation','wavecrash','waterfall','earthquake','bodyslam','protect','endure','hyperbeam','surf','facade','doubleedge','sleeptalk','rest','raindance','takedown','waterpulse','hydropump','watergun','bulldoze','rockslide','scaryface','zenheadbutt','supersonic','flail','dive','tickle','aquatail','nobleroar','icefang','thrash','fissure','curse','yawn','substitute','gigaimpact','avalanche','heavyslam','soak','terablast','orderup','chillingwater','bodypress','crunch','outrage','stompingtantrum'],
 stages:[
  {name:'Oyacata',types:['eau'],base:st(150,100,115,65,65,35)}]},
{id:'tatsugiri',abilities:['Commandant','Lavabo'],moveIds:['watergun','dragonpulse','dracometeor','hydropump','protect','endure','hyperbeam','surf','facade','sleeptalk','rest','raindance','takedown','waterpulse','icywind','whirlpool','muddywater','outrage','harden','splash','mirrorcoat','memento','taunt','counter','batonpass','rapidspin','substitute','helpinghand','gigaimpact','nastyplot','soak','terablast','chillingwater','dragoncheer','dragondance','lunge'],
 stages:[
  {name:'Nigirigon',types:['dragon','eau'],base:st(68,50,60,120,95,82),forms:{
    tatsugirinite:{name:'Méga-Nigirigon',types:['dragon','eau'],base:st(68,65,90,135,125,92)}
  }}]},
{id:'frigibax',abilities:['Échange Thermique','Corps Gel'],moveIds:['tackle','dragonclaw','icefang','dracometeor','icebeam','protect','endure','hyperbeam','facade','sleeptalk','rest','blizzard','dragondance','raindance','bodyslam','takedown','scaryface','bulldoze','earthquake','doubleedge','icywind','brickbreak','outrage','aerialace','dig','dragonpulse','zenheadbutt','ironhead','leer','bite','focusenergy','dragonbreath','crunch','breakingswipe','glaiverush','thunderfang','iciclespear','aquatail','freezedry','substitute','helpinghand','dragonrush','avalanche','dragontail','iciclecrash','terablast','snowscape','gigaimpact','iceshard','dragoncheer','bodypress','falseswipe','highhorsepower','scaleshot','stompingtantrum','swordsdance'],
 stages:[
  {name:'Frigodo',types:['dragon','glace'],base:st(65,75,45,35,45,55)},
  {name:'Cryodo',types:['dragon','glace'],base:st(90,95,66,45,65,62)},
  {name:'Glaivodo',types:['dragon','glace'],base:st(115,145,92,75,86,87),forms:{
    baxcalibrite:{name:'Méga-Glaivodo',types:['dragon','glace'],base:st(115,175,117,105,101,87),abilities:['Échange Thermique']}
  }}]},
{id:'gimmighoul',abilities:['Phobique'],moveIds:['tackle','shadowball','poltergeist','makeitrain','flashcannon','protect','endure','hyperbeam','sleeptalk','rest','takedown','thief','thunderwave','ironhead','psychic','focusblast','thunderbolt','sandstorm','thunder','astonish','nightshade','recover','confuseray','memento','thunderpunch','substitute','powergem','nastyplot','hex','terablast','fling','gigaimpact','chargebeam','psyshock','heavyslam','electroball','lowsweep','dazzlinggleam','focuspunch','lightscreen','lowkick','reflect','shadowpunch','steelbeam','surf','trick','stridoson'],
 stages:[
  {name:'Mordudor',types:['fantome'],base:st(45,30,25,40,30,10)},
  {name:'Gromago',types:['acier','fantome'],base:st(87,60,95,133,91,84),abilities:["Cœur d'Or"]}]},
{id:'cyclizar',abilities:['Mue','Régé-Force'],moveIds:['tackle','dragonclaw','dracometeor','crunch','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','takedown','bodyslam','doubleedge','thunderbolt','thief','agility','aerialace','hypervoice','bite','growl','quickattack','rapidspin','taunt','uturn','dragonpulse','shiftgear','breakingswipe','shedtail','firefang','thunderfang','irontail','knockoff','aquatail','substitute','dragonrush','gigaimpact','powerwhip','acrobatics','dragontail','wildcharge','terablast','icespinner','dragoncheer','temperflare','endeavor','ironhead','mudshot','mudslap','outrage','overheat','scaleshot','supercellslam','trailblaze','uproar'],
 stages:[
  {name:'Motorizard',types:['dragon','normal'],base:st(70,95,65,85,65,121)}]},
{id:'woochien',abilities:['Fléau Tablette'],moveIds:['gigadrain','ruination','solarbeam','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','raindance','takedown','bodyslam','scaryface','taunt','knockoff','bulletseed','zenheadbutt','darkpulse','magicalleaf','lightscreen','absorb','megadrain','growth','poisonpowder','stunspore','spite','meanlook','ingrain','tickle','grassyterrain','leechseed','substitute','payback','seedbomb','energyball','gigaimpact','leafstorm','powerwhip','grassknot','foulplay','hex','snarl','terablast','bodypress','lashout','mudshot','mudslap','pollenpuff','reflect','solarblade','trailblaze'],
 stages:[
  {name:'Chongjian',types:['tenebres','plante'],base:st(85,85,100,95,135,20)}]},
{id:'chienpao',abilities:['Fléau Épée'],moveIds:['icefang','ruination','crunch','protect','endure','hyperbeam','facade','sleeptalk','rest','swordsdance','blizzard','raindance','takedown','taunt','scaryface','icywind','brickbreak','darkpulse','aerialace','mist','recover','haze','spite','powdersnow','meanlook','sheercold','suckerpunch','nightslash','throatchop','substitute','payback','gigaimpact','avalanche','iceshard','hex','acrobatics','sacredsword','snarl','iciclecrash','terablast','icespinner','snowscape','falseswipe','lashout','psychicfangs'],
 stages:[
  {name:'Baojian',types:['tenebres','glace'],base:st(80,120,80,90,65,135)}]},
{id:'tinglu',abilities:['Fléau Récipient'],moveIds:['earthquake','ruination','stoneedge','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','takedown','bodyslam','rocktomb','rockslide','dig','bulldoze','doubleedge','scaryface','taunt','sandstorm','stealthrock','mudslap','mudshot','darkpulse','whirlwind','stomp','thrash','fissure','spite','spikes','meanlook','memento','sandtomb','throatchop','stompingtantrum','substitute','payback','earthpower','gigaimpact','heavyslam','hex','snarl','terablast','bodypress','lashout','zenheadbutt'],
 stages:[
  {name:'Dinglu',types:['tenebres','sol'],base:st(155,110,125,55,80,45)}]},
{id:'chiyu',abilities:['Fléau Perle'],moveIds:['ember','flamethrower','fireblast','ruination','darkpulse','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','takedown','taunt','scaryface','heatwave','willowisp','zenheadbutt','firespin','crunch','overheat','confuseray','flamewheel','spite','swagger','meanlook','memento','bounce','substitute','payback','flareblitz','gigaimpact','nastyplot','lavaplume','flamecharge','hex','incinerate','inferno','snarl','terablast','temperflare','burningjealousy','lashout','lightscreen','psychic','reflect'],
 stages:[
  {name:'Yuyu',types:['tenebres','feu'],base:st(55,80,80,135,120,100)}]},
{id:'okidogi',abilities:['Chaîne Toxique','Chien de Garde'],moveIds:['poisonjab','sludgebomb','closecombat','protect','endure','hyperbeam','facade','sleeptalk','rest','bulkup','takedown','bodyslam','brickbreak','thief','focusblast','scaryface','dig','rocktomb','doubleedge','taunt','knockoff','thunderpunch','reversal','curse','toxic','focuspunch','lowkick','bite','counter','crunch','superpower','poisonfang','howl','brutalswing','firefang','icefang','thunderfang','firepunch','icepunch','roar','substitute','fling','forcepalm','drainpunch','gigaimpact','gunkshot','sludgewave','lowsweep','snarl','terablast','hardpress','bodypress','highhorsepower','ironhead','lashout','metalclaw','outrage','poisontail','psychicfangs','shadowclaw','spite','stompingtantrum','throatchop','upperhand','uproar'],
 stages:[
  {name:'Félicanis',types:['poison','combat'],base:st(88,128,115,58,86,80)}]},
{id:'munkidori',abilities:['Chaîne Toxique','Fouille'],moveIds:['psychic','sludgebomb','poisonjab','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','calmmind','shadowball','lightscreen','thief','taunt','psychup','psybeam','confusion','futuresight','trick','focusblast','scratch','fakeout','flatter','substitute','helpinghand','fling','gigaimpact','nastyplot','gunkshot','grassknot','psyshock','venoshock','sludgewave','acidspray','clearsmog','storedpower','hex','partingshot','terablast','batonpass','confuseray','imprison','lashout','metronome','mudslap','nightshade','poltergeist','psychicnoise','psychicterrain','shadowclaw','spite','toxic','trailblaze','uproar','uturn'],
 stages:[
  {name:'Fortusimia',types:['poison','psy'],base:st(88,75,66,130,90,106)}]},
{id:'fezandipiti',abilities:['Chaîne Toxique','Technicien'],moveIds:['poisonjab','moonblast','dazzlinggleam','airslash','sludgebomb','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','calmmind','takedown','thief','shadowball','taunt','lightscreen','toxic','swordsdance','charm','wingattack','doublekick','peck','quickattack','poisongas','swagger','attract','beatup','flatter','disarmingvoice','substitute','roost','tailwind','bravebird','gigaimpact','nastyplot','crosspoison','gunkshot','venoshock','acidspray','hex','acrobatics','tailslap','terablast','aerialace','agility','aircutter','alluringvoice','darkpulse','dualwingbeat','fly','heatwave','hurricane','icywind','lashout','playrough','poisontail','psychup','shadowclaw','spite','uproar','uturn'],
 stages:[
  {name:'Favianos',types:['poison','fee'],base:st(88,91,82,70,125,99)}]},
{id:'ogerpon',abilities:['Acharné'],moveIds:['ivycudgel','swordsdance','gigadrain','protect','endure','solarbeam','facade','sleeptalk','rest','sunnyday','raindance','takedown','bulletseed','magicalleaf','brickbreak','scaryface','rocktomb','knockoff','zenheadbutt','growth','taunt','synthesis','slam','vinewhip','quickattack','focusenergy','superpower','spikyshield','throatchop','doublekick','counter','leechseed','substitute','followme','helpinghand','fling','seedbomb','energyball','gigaimpact','leafstorm','powerwhip','grassknot','woodhammer','lowsweep','retaliate','hornleech','terablast','charm','encore','falseswipe','grassyglide','grassyterrain','lashout','lowkick','playrough','reversal','sandstorm','solarblade','spikes','stompingtantrum','trailblaze','uturn'],
 stages:[
  {name:'Ogerpon',types:['plante'],base:st(80,120,84,60,96,110),forms:{
    masqueSource:{name:'Ogerpon (Masque du Puits)',types:['plante','eau'],base:st(80,100,84,60,96,130),abilities:['Synchro Masque']},
    masqueBraise:{name:'Ogerpon (Masque du Fourneau)',types:['plante','feu'],base:st(80,120,84,60,96,130),abilities:['Synchro Masque']},
    masqueAngle:{name:'Ogerpon (Masque de la Pierre)',types:['plante','roche'],base:st(80,120,104,60,96,110),abilities:['Synchro Masque']}
  }}]},
{id:'greattusk',abilities:['Protosynthèse'],moveIds:['headlongrush','earthquake','closecombat','stoneedge','bodypress','protect','endure','hyperbeam','facade','sleeptalk','rest','bulkup','bodyslam','takedown','sunnyday','rockslide','rocktomb','bulldoze','dig','brickbreak','doubleedge','scaryface','stealthrock','mudslap','sandstorm','taunt','mudshot','zenheadbutt','knockoff','ironhead','hornattack','defensecurl','rollout','megahorn','rapidspin','endeavor','stompingtantrum','firefang','icefang','thunderfang','roar','substitute','earthpower','gigaimpact','headsmash','psyshock','smackdown','heavyslam','terablast','icespinner','temperflare','flashcannon','highhorsepower','playrough','reversal','smartstrike','supercellslam','throatchop'],
 stages:[
  {name:'Fort-Ivoire',types:['sol','combat'],base:st(115,131,131,53,53,87)}]},
{id:'screamtail',abilities:['Protosynthèse'],moveIds:['dazzlinggleam','psychic','expandingforce','psychicnoise','protect','endure','hyperbeam','facade','sleeptalk','rest','calmmind','raindance','sunnyday','lightscreen','bodyslam','reflect','zenheadbutt','takedown','thunderwave','psychup','doubleedge','thunderbolt','psybeam','trick','focusblast','rocktomb','thunder','thunderpunch','pound','bite','sing','disable','perishsong','crunch','wish','hypervoice','howl','nobleroar','playrough','boomburst','psychicfangs','firefang','icefang','thunderfang','firepunch','icepunch','roar','substitute','helpinghand','gyroball','fling','drainpunch','gigaimpact','trickroom','grassknot','psyshock','storedpower','terablast','snowscape','amnesia','batonpass','blizzard','bulkup','dig','encore','faketears','fireblast','flamethrower','icebeam','imprison','metronome','mistyexplosion','mistyterrain','psychicterrain','sandstorm','scaryface','stealthrock','stompingtantrum','uproar','waterpulse'],
 stages:[
  {name:'Hurle-Queue',types:['fee','psy'],base:st(115,40,75,45,135,111)}]},
{id:'brutebonnet',abilities:['Protosynthèse'],moveIds:['gigadrain','crunch','closecombat','protect','endure','hyperbeam','solarbeam','facade','sleeptalk','rest','sunnyday','bodyslam','thief','doubleedge','scaryface','taunt','bulletseed','zenheadbutt','darkpulse','magicalleaf','thrash','absorb','megadrain','growth','stunspore','spore','synthesis','ingrain','astonish','suckerpunch','substitute','payback','seedbomb','energyball','earthpower','gigaimpact','leafstorm','grassknot','venoshock','ragepowder','clearsmog','hex','terablast','bodypress','confuseray','grassyterrain','lashout','outrage','pollenpuff','stompingtantrum','trailblaze'],
 stages:[
  {name:'Fongus-Furie',types:['plante','tenebres'],base:st(111,127,99,79,99,55)}]},
{id:'fluttermane',abilities:['Protosynthèse'],moveIds:['shadowball','moonblast','dazzlinggleam','poltergeist','protect','swift','endure','hyperbeam','sleeptalk','rest','calmmind','sunnyday','taunt','thunderwave','icywind','thunderbolt','thunder','psybeam','confuseray','spite','perishsong','meanlook','painsplit','memento','wish','astonish','phantomforce','mysticalfire','substitute','helpinghand','powergem','energyball','gigaimpact','trickroom','chargebeam','psyshock','storedpower','hex','terablast','charm','darkpulse','disarmingvoice','drainingkiss','faketears','hypervoice','imprison','magicalleaf','mistyterrain','nightshade'],
 stages:[
  {name:'Flotte-Mèche',types:['fantome','fee'],base:st(55,55,55,135,135,135)}]},
{id:'slitherwing',abilities:['Protosynthèse'],moveIds:['leechlife','closecombat','lunge','protect','endure','hyperbeam','facade','sleeptalk','rest','bulkup','sunnyday','raindance','takedown','bodyslam','brickbreak','doubleedge','aerialace','earthquake','zenheadbutt','reversal','gigadrain','lowkick','gust','whirlwind','stomp','thrash','ember','poisonpowder','stunspore','morningsun','superpower','bugbite','firstimpression','dualwingbeat','substitute','flareblitz','bugbuzz','gigaimpact','heavyslam','flamecharge','lowsweep','acrobatics','wildcharge','heatcrash','terablast','temperflare','bodypress','curse','heatwave','highhorsepower','hurricane','sandstorm','skittersmack','stompingtantrum','trailblaze','uturn','willowisp'],
 stages:[
  {name:'Rampe-Ailes',types:['insecte','combat'],base:st(85,135,79,85,105,81)}]},
{id:'sandyshocks',abilities:['Protosynthèse'],moveIds:['thunderbolt','earthquake','stealthrock','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','takedown','sunnyday','bodyslam','bulldoze','sandstorm','thunder','thunderwave','mudshot','lightscreen','supersonic','thundershock','screech','triattack','zapcannon','spark','mirrorcoat','discharge','electricterrain','substitute','gravity','powergem','earthpower','gigaimpact','chargebeam','heavyslam','electroball','voltswitch','electroweb','wildcharge','magneticflux','terablast','bodypress','charge','eerieimpulse','flashcannon','highhorsepower','irondefense','reflect','sandtomb','scorchingsands','spikes','stompingtantrum','supercellslam','stridoson'],
 stages:[
  {name:'Pelage-Sablé',types:['electrik','sol'],base:st(85,81,97,121,85,101)}]},
{id:'roaringmoon',abilities:['Protosynthèse'],moveIds:['dragonclaw','dracometeor','crunch','protect','endure','hyperbeam','facade','sleeptalk','rest','dragondance','sunnyday','takedown','bodyslam','scaryface','rockslide','taunt','doubleedge','brickbreak','dig','earthquake','aerialace','darkpulse','shadowclaw','outrage','stoneedge','zenheadbutt','dragonpulse','leer','knockoff','fly','headbutt','bite','flamethrower','focusenergy','dragonbreath','nightslash','throatchop','firefang','thunderfang','jawlock','breakingswipe','scaleshot','roar','substitute','roost','tailwind','xscissor','dragonrush','gigaimpact','incinerate','acrobatics','dragontail','snarl','terablast','dragoncheer','airslash','bodypress','fireblast','firespin','heatwave','hurricane','hydropump','hypervoice','ironhead','lashout','metalclaw','stompingtantrum','uturn'],
 stages:[
  {name:'Rugit-Lune',types:['dragon','tenebres'],base:st(105,139,71,55,101,119)}]},
{id:'walkingwake',abilities:['Protosynthèse'],moveIds:['hydrosteam','dracometeor','dragonpulse','surf','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','raindance','takedown','bodyslam','waterpulse','waterfall','hydropump','doubleedge','sunnyday','scaryface','whirlpool','mudshot','weatherball','outrage','leer','bite','flamethrower','dragonbreath','twister','nobleroar','breakingswipe','firefang','roar','substitute','dragonrush','gigaimpact','aquajet','honeclaws','scald','snarl','terablast','chillingwater','dragoncheer','agility','crunch','dragonclaw','dragondance','flipturn','hurricane','knockoff','liquidation','lowkick'],
 stages:[
  {name:'Serpente-Eau',types:['eau','dragon'],base:st(99,83,91,125,83,109)}]},
{id:'gougingfire',abilities:['Protosynthèse'],moveIds:['flamethrower','fireblast','dracometeor','crunch','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','takedown','bodyslam','doubleedge','bulldoze','earthquake','scaryface','heatwave','stoneedge','firespin','outrage','overheat','dragonpulse','stomp','leer','bite','morningsun','crushclaw','howl','dragonclaw','ragingfury','firefang','thunderfang','doublekick','ancientpower','nobleroar','roar','substitute','flareblitz','dragonrush','gigaimpact','lavaplume','flamecharge','incinerate','dragontail','heatcrash','snarl','terablast','burningbulwark','dragoncheer','temperflare','breakingswipe','dragondance','ironhead','psychicfangs','reversal','scaleshot','scorchingsands','smartstrike','stompingtantrum','weatherball'],
 stages:[
  {name:'Feu-Perçant',types:['feu','dragon'],base:st(105,115,121,65,93,91)}]},
{id:'ragingbolt',abilities:['Protosynthèse'],moveIds:['thunderbolt','thunder','dracometeor','dragonpulse','thunderclap','calmmind','protect','endure','hyperbeam','thunderwave','discharge','earthquake','rest','sleeptalk','facade','stomp','zapcannon','dragonbreath','twister','sunnyday','charge','shockwave','electricterrain','dragonhammer','bodypress','risingvoltage','thunderfang','ancientpower','roar','substitute','gigaimpact','chargebeam','heavyslam','electroball','voltswitch','dragontail','electroweb','wildcharge','snarl','terablast','dragoncheer','bodyslam','breakingswipe','crunch','doubleedge','eerieimpulse','hypervoice','outrage','scaryface','solarbeam','stompingtantrum','supercellslam','takedown','taunt','weatherball'],
 stages:[
  {name:'Ire-Foudre',types:['electrik','dragon'],base:st(125,73,91,137,89,75)}]},
{id:'irontreads',abilities:['Quark Chargée'],moveIds:['ironhead','earthquake','steelbeam','rapidspin','protect','hyperbeam','facade','rest','takedown','rockslide','bodyslam','rocktomb','bulldoze','sandstorm','stealthrock','stoneedge','doubleedge','irondefense','scaryface','mudslap','mudshot','flashcannon','thunder','hornattack','defensecurl','rollout','megahorn','knockoff','endeavor','electricterrain','stompingtantrum','steelroller','icefang','thunderfang','substitute','gyroball','earthpower','gigaimpact','heavyslam','electroball','voltswitch','wildcharge','terablast','icespinner','hardpress','bodypress','highhorsepower','smartstrike','supercellslam','zenheadbutt','stridoson'],
 stages:[
  {name:'Roue-de-Fer',types:['sol','acier'],base:st(90,112,120,72,70,106)}]},
{id:'ironbundle',abilities:['Quark Chargée'],moveIds:['icebeam','blizzard','hydropump','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','raindance','takedown','waterpulse','icywind','bodyslam','whirlpool','thief','taunt','agility','drillpeck','powdersnow','present','freezedry','auroraveil','flipturn','icepunch','electricterrain','substitute','helpinghand','fling','gigaimpact','avalanche','acrobatics','terablast','icespinner','snowscape','chillingwater','aircutter','encore','playrough','uturn'],
 stages:[
  {name:'Hotte-de-Fer',types:['glace','eau'],base:st(56,80,114,124,60,136)}]},
{id:'ironhands',abilities:['Quark Chargée'],moveIds:['tackle','closecombat','thunderpunch','protect','endure','hyperbeam','facade','sleeptalk','rest','takedown','bodyslam','brickbreak','focusblast','rocktomb','rockslide','doubleedge','bulldoze','thunderbolt','scaryface','thunder','earthquake','lowkick','reversal','swordsdance','focuspunch','whirlwind','slam','sandattack','seismictoss','focusenergy','bellydrum','detect','fakeout','charge','armthrust','firepunch','icepunch','electricterrain','substitute','fling','forcepalm','drainpunch','gigaimpact','heavyslam','lowsweep','voltswitch','wildcharge','terablast','hardpress','bodypress','irondefense','ironhead','metronome','playrough','stompingtantrum','supercellslam'],
 stages:[
  {name:'Paume-de-Fer',types:['combat','electrik'],base:st(154,140,108,50,68,50)}]},
{id:'ironjugulis',abilities:['Quark Chargée'],moveIds:['darkpulse','hurricane','airslash','crunch','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','takedown','bodyslam','taunt','scaryface','doubleedge','uturn','rocktomb','fly','knockoff','focusblast','zenheadbutt','aircutter','focusenergy','triattack','outrage','dragonbreath','hypervoice','dragonpulse','electricterrain','firefang','roar','substitute','tailwind','assurance','earthpower','gigaimpact','chargebeam','acrobatics','dragontail','workup','snarl','terablast','dragoncheer','dualwingbeat','fireblast','flamethrower','flashcannon','heatwave','hydropump','ironhead','lashout','meteorbeam','throatchop','stridoson'],
 stages:[
  {name:'Têtes-de-Fer',types:['tenebres','vol'],base:st(94,80,86,122,80,108)}]},
{id:'ironmoth',abilities:['Quark Chargée'],moveIds:['fireblast','flamethrower','psychic','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','takedown','solarbeam','heatwave','overheat','firespin','toxic','gust','whirlwind','ember','screech','morningsun','discharge','hurricane','lunge','electricterrain','substitute','helpinghand','flareblitz','bugbuzz','energyball','gigaimpact','chargebeam','venoshock','sludgewave','flamecharge','acidspray','acrobatics','strugglebug','fierydance','terablast','pounce','agility','airslash','confuseray','dazzlinggleam','flashcannon','lightscreen','meteorbeam','toxicspikes','uturn','stridoson'],
 stages:[
  {name:'Mite-de-Fer',types:['feu','poison'],base:st(80,70,60,140,110,110)}]},
{id:'ironthorns',abilities:['Quark Chargée'],moveIds:['stoneedge','earthquake','ironhead','thunderpunch','protect','endure','hyperbeam','facade','rest','raindance','sunnyday','takedown','bodyslam','rockslide','rocktomb','bulldoze','sandstorm','dig','thunderbolt','thunder','stealthrock','thunderwave','doubleedge','brickbreak','curse','focusblast','scaryface','irondefense','taunt','icebeam','blizzard','pinmissile','bite','rockthrow','screech','charge','icefang','firefang','thunderfang','firepunch','icepunch','electricterrain','substitute','fling','powergem','earthpower','gigaimpact','chargebeam','smackdown','heavyslam','electroball','voltswitch','dragontail','electroweb','wildcharge','snarl','terablast','bodypress','breakingswipe','crunch','dragonclaw','dragondance','eerieimpulse','fireblast','flamethrower','highhorsepower','lowkick','metalclaw','meteorbeam','rockblast','sandtomb','spikes','stompingtantrum','supercellslam','swordsdance'],
 stages:[
  {name:'Épine-de-Fer',types:['roche','electrik'],base:st(100,134,110,70,84,72)}]},
{id:'ironvaliant',abilities:['Quark Chargée'],moveIds:['moonblast','closecombat','spiritbreak','swordsdance','protect','swift','endure','hyperbeam','sleeptalk','rest','brickbreak','focusblast','taunt','zenheadbutt','thunderpunch','knockoff','calmmind','lightscreen','poisonjab','psychic','shadowball','reversal','aerialace','lowkick','icepunch','disable','hypnosis','doubleteam','destinybond','furycutter','futuresight','leafblade','nightslash','dazzlinggleam','firepunch','electricterrain','substitute','helpinghand','feint','fling','xscissor','drainpunch','vacuumwave','energyball','gigaimpact','psychocut','trickroom','grassknot','chargebeam','wideguard','psyshock','storedpower','quickguard','hex','terablast','shadowsneak','agility','aurasphere','coaching','confuseray','encore','expandingforce','falseswipe','hypervoice','icywind','imprison','liquidation','magicalleaf','metronome','mistyterrain','psybeam','psychicterrain','psychup','reflect','shadowclaw','skillswap','throatchop','thunderbolt','thunderwave','trick'],
 stages:[
  {name:'Garde-de-Fer',types:['fee','combat'],base:st(74,130,90,120,60,116)}]},
{id:'ironleaves',abilities:['Quark Chargée'],moveIds:['leafblade','psyblade','closecombat','gigadrain','swordsdance','protect','swift','endure','hyperbeam','solarbeam','facade','sleeptalk','rest','takedown','doubleedge','brickbreak','irondefense','scaryface','focusblast','aerialace','magicalleaf','taunt','leer','quickattack','megahorn','imprison','nightslash','solarblade','electricterrain','substitute','helpinghand','gravity','xscissor','energyball','gigaimpact','leafstorm','grassknot','quickguard','allyswitch','quash','retaliate','workup','wildcharge','sacredsword','terablast','agility','airslash','calmmind','coaching','falseswipe','grassyterrain','psychicterrain','reversal','smartstrike','throatchop','trailblaze','stridoson'],
 stages:[
  {name:'Vert-de-Fer',types:['plante','acier'],base:st(90,130,88,70,108,104)}]},
{id:'ironboulder',abilities:['Quark Chargée'],moveIds:['closecombat','stoneedge','swordsdance','protect','endure','hyperbeam','facade','sleeptalk','rest','rocktomb','takedown','bodyslam','bulldoze','earthquake','brickbreak','doubleedge','sandstorm','scaryface','taunt','zenheadbutt','ironhead','poisonjab','irondefense','aerialace','hornattack','leer','counter','rockthrow','agility','quickattack','slash','megahorn','electricterrain','substitute','xscissor','gigaimpact','psychocut','psyshock','quickguard','wildcharge','sacredsword','terablast','mightycleave','airslash','meteorbeam','psychic','rockblast','solarblade','throatchop'],
 stages:[
  {name:'Roc-de-Fer',types:['roche','combat'],base:st(90,120,80,68,108,124)}]},
{id:'ironcrown',abilities:['Quark Chargée'],moveIds:['flashcannon','tachyoncutter','expandingforce','calmmind','protect','endure','hyperbeam','facade','sleeptalk','rest','takedown','bodyslam','psychic','zenheadbutt','doubleedge','brickbreak','futuresight','bulldoze','irondefense','confusion','leer','slash','metalclaw','electricterrain','smartstrike','substitute','gravity','metalburst','xscissor','gigaimpact','psychocut','psyshock','heavyslam','storedpower','quickguard','voltswitch','sacredsword','terablast','agility','airslash','focusblast','ironhead','psychicnoise','scaryface','solarblade','steelbeam','supercellslam','swordsdance','stridoson'],
 stages:[
  {name:'Chef-de-Fer',types:['acier','psy'],base:st(90,72,100,122,108,98)}]},
{id:'koraidon',abilities:['Pulsion Orichalque'],moveIds:['closecombat','dragonclaw','dracometeor','flamethrower','collisioncourse','protect','endure','hyperbeam','facade','sleeptalk','rest','swordsdance','bodyslam','sunnyday','takedown','focusblast','brickbreak','bulldoze','scaryface','doubleedge','dig','zenheadbutt','taunt','outrage','ironhead','shadowclaw','reversal','lowkick','dragonpulse','counter','agility','screech','ancientpower','rocksmash','breakingswipe','firefang','icefang','thunderfang','roar','substitute','helpinghand','flareblitz','drainpunch','gigaimpact','heavyslam','flamecharge','lowsweep','acrobatics','dragontail','wildcharge','heatcrash','snarl','terablast','dragoncheer','temperflare','bodypress','bulkup','crunch','dualwingbeat','fireblast','firespin','focuspunch','heatwave','meteorbeam','mudshot','mudslap','overheat','scaleshot','solarbeam','stompingtantrum','uproar','uturn'],
 stages:[
  {name:'Koraidon',types:['combat','dragon'],base:st(100,135,115,85,100,135)}]},
{id:'miraidon',abilities:['Moteur Hadron'],moveIds:['thunderbolt','dragonpulse','dracometeor','electrodrift','discharge','protect','endure','hyperbeam','facade','sleeptalk','rest','calmmind','takedown','bodyslam','thunderwave','thunder','scaryface','lightscreen','agility','outrage','zenheadbutt','crunch','taunt','thundershock','dragonbreath','mirrorcoat','charge','overheat','shockwave','electricterrain','substitute','helpinghand','powergem','gigaimpact','chargebeam','heavyslam','electroball','acrobatics','voltswitch','dragontail','wildcharge','snarl','terablast','dragoncheer','confuseray','dazzlinggleam','dragonclaw','eerieimpulse','flashcannon','reflect','solarbeam','supercellslam','swordsdance','uturn','parabolicharge','stridoson'],
 stages:[
  {name:'Miraidon',types:['electrik','dragon'],base:st(100,85,100,135,115,135)}]},
{id:'terapagos',abilities:['Téraforme Zéro'],moveIds:['earthquake','dazzlinggleam','icebeam','flamethrower','protect','endure','hyperbeam','facade','sleeptalk','rest','calmmind','raindance','sunnyday','takedown','doubleedge','bodyslam','thunderbolt','thunder','rockslide','zenheadbutt','solarbeam','waterpulse','headbutt','withdraw','triattack','rapidspin','ancientpower','roar','substitute','gravity','gyroball','flareblitz','rockpolish','bugbuzz','powergem','energyball','earthpower','gigaimpact','heavyslam','storedpower','wildcharge','heatcrash','icespinner','terastarstorm','aurasphere','bodypress','crunch','darkpulse','dragonpulse','flashcannon','ironhead','meteorbeam','scorchingsands','stealthrock','stoneedge','supercellslam','surf','toxic','weatherball'],
 stages:[
  {name:'Terapagos',types:['normal'],base:st(95,95,110,105,110,85)}]},
{id:'pecharunt',abilities:['Marionnettiste Empoisonneur'],moveIds:['malignantchain','sludgebomb','shadowball','poltergeist','recover','protect','endure','sleeptalk','rest','curse','toxic','withdraw','smog','poisongas','destinybond','memento','astonish','faketears','defensecurl','rollout','meanlook','substitute','nastyplot','gunkshot','venoshock','sludgewave','acidspray','foulplay','hex','partingshot','terablast','imprison','nightshade','phantomforce','spite'],
 stages:[
  {name:'Pêchaminus',types:['poison','fantome'],base:st(88,88,160,88,88,88)}]},
{id:'poltchageist',abilities:['Hospitalité','Ignifugé'],moveIds:['gigadrain','shadowball','matchablade','protect','endure','hyperbeam','solarbeam','sleeptalk','rest','calmmind','curse','magicalleaf','reflect','absorb','megadrain','stunspore','withdraw','memento','astonish','lifedew','strengthsap','substitute','energyball','nastyplot','trickroom','leafstorm','ragepowder','foulplay','scald','hex','terablast','grassyterrain','imprison','irondefense','nightshade','painsplit','phantomforce','poltergeist','psychup','spite','uproar'],
 stages:[
  {name:'Poltchageist',types:['plante','fantome'],base:st(40,45,45,74,54,50)},
  {name:'Théffroyable',types:['plante','fantome'],base:st(71,60,106,121,80,70)}]},
{id:'dipplin',abilities:['Sirop Collant','Gloutonnerie','Glu'],moveIds:['dragonpulse','dracometeor','syrupbomb','gigadrain','protect','endure','hyperbeam','solarbeam','facade','sleeptalk','rest','sunnyday','takedown','raindance','bodyslam','doubleedge','earthquake','outrage','bulletseed','magicalleaf','curse','reflect','growth','recover','withdraw','dragonbreath','sweetscent','recycle','astonish','defensecurl','rollout','suckerpunch','infestation','yawn','substitute','gyroball','seedbomb','energyball','gigaimpact','leafstorm','grassknot','doublehit','dragontail','terablast','pounce','dragoncheer','earthpower','nastyplot','powerwhip','heavyslam','ficklebeam','bodypress','breakingswipe','bugbite','grassyglide','grassyterrain','hydropump','pollenpuff','uproar'],
 stages:[
  {name:'Pomdramour',types:['plante','dragon'],base:st(80,80,110,95,80,40)},
  {name:'Pomdorochi',types:['plante','dragon'],base:st(106,80,110,120,80,44),abilities:['Sirop Collant','Régé-Force','Glu']}]},
{id:'archaludon',abilities:['Stoïcisme','Fermeté',"Nerfs d'Acier"],moveIds:['ironhead','steelbeam','dracometeor','flashcannon','bodypress','protect','endure','hyperbeam','facade','sleeptalk','rest','takedown','bodyslam','rockslide','rocktomb','earthquake','scaryface','doubleedge','brickbreak','stoneedge','irondefense','thunderwave','stealthrock','thunderbolt','thunder','outrage','dragonpulse','solarbeam','leer','focusenergy','metalclaw','rocksmash','dragonclaw','breakingswipe','slash','mirrorcoat','nightslash','roar','substitute','gyroball','metalburst','gigaimpact','honeclaws','smackdown','heavyslam','foulplay','dragontail','snarl','terablast','electroshot','hardpress','dragoncheer','aurasphere','darkpulse','lightscreen','meteorbeam','reflect','swordsdance','stridoson'],
 stages:[
  {name:'Pondralugon',types:['acier','dragon'],base:st(90,105,130,125,65,85)}]},
// ---- Formes de Paldea (lignées séparées et draftables, réutilisent le n° de Pokédex national) ----
{id:'wooperpaldea',abilities:['Point Poison','Absorbe-Eau','Inconscient'],moveIds:['tackle','mudshot','sludgebomb','poisonjab','earthquake','stoneedge','protect','endure','hyperbeam','facade','sleeptalk','rest','takedown','raindance','bodyslam','rockslide','bulldoze','dig','rocktomb','doubleedge','sandstorm','mudslap','stealthrock','curse','toxic','slam','tailwhip','amnesia','yawn','poisontail','toxicspikes','poisonsting','megahorn','doublekick','mist','counter','recover','haze','ancientpower','stockpile','spitup','swallow','substitute','helpinghand','earthpower','gunkshot','venoshock','sludgewave','acidspray','afteryou','terablast','chillingwater','gigaimpact','heavyslam','bodypress','highhorsepower','hydropump','ironhead','liquidation','lowkick','muddywater','spikes','stompingtantrum','surf','trailblaze','waterfall','waterpulse','zenheadbutt'],
 stages:[
  {name:'Axoloto de Paldea',types:['poison','sol'],base:st(55,45,45,25,25,15)},
  {name:'Terraiste',types:['poison','sol'],base:st(130,75,60,45,100,20)}]},
{id:'taurospaldeacombat',abilities:['Intimidation','Colérique','Rumination'],moveIds:['tackle','closecombat','bodyslam','doubleedge','bulkup','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','takedown','rocktomb','rockslide','dig','bulldoze','stoneedge','thief','zenheadbutt','scaryface','earthquake','reversal','curse','ironhead','doublekick','headbutt','thrash','tailwhip','swagger','endeavor','substitute','assurance','gigaimpact','round','workup','wildcharge','drillrun','terablast','ragingbull','bodypress','highhorsepower','irontail','lashout','megahorn','outrage','sandstorm','smartstrike','snore','stompingtantrum','surf','throatchop','trailblaze','uproar'],
 stages:[
  {name:'Tauros de Paldea (Race Combative)',types:['combat'],base:st(75,110,105,40,70,107)}]},
{id:'taurospaldeafeu',abilities:['Intimidation','Colérique','Rumination'],moveIds:['tackle','closecombat','flamethrower','bulkup','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','takedown','bodyslam','raindance','doubleedge','rocktomb','rockslide','dig','bulldoze','thief','stoneedge','earthquake','zenheadbutt','scaryface','fireblast','reversal','willowisp','curse','overheat','doublekick','headbutt','thrash','tailwhip','swagger','endeavor','substitute','flareblitz','gigaimpact','flamecharge','round','workup','wildcharge','drillrun','terablast','ragingbull','temperflare','bodypress','firespin','highhorsepower','ironhead','irontail','lashout','megahorn','outrage','sandstorm','smartstrike','snore','stompingtantrum','trailblaze','uproar'],
 stages:[
  {name:'Tauros de Paldea (Race Flamboyante)',types:['combat','feu'],base:st(75,110,105,40,70,107)}]},
{id:'taurospaldeaeau',abilities:['Intimidation','Colérique','Rumination'],moveIds:['tackle','closecombat','liquidation','bulkup','protect','endure','hyperbeam','surf','facade','sleeptalk','rest','raindance','takedown','bodyslam','waterpulse','doubleedge','rocktomb','rockslide','bulldoze','hydropump','dig','scaryface','thief','earthquake','whirlpool','stoneedge','zenheadbutt','doublekick','headbutt','thrash','tailwhip','swagger','wavecrash','curse','endeavor','substitute','gigaimpact','aquajet','round','workup','wildcharge','drillrun','terablast','ragingbull','chillingwater','bodypress','highhorsepower','ironhead','irontail','lashout','megahorn','outrage','reversal','sandstorm','smartstrike','snore','stompingtantrum','trailblaze','uproar'],
 stages:[
  {name:'Tauros de Paldea (Race Aquatique)',types:['combat','eau'],base:st(75,110,105,40,70,107)}]},
];
const DEX_NUMBERS_GEN9 = {
  'Poussacha':906,'Matourgeon':907,'Miascarade':908,
  'Chochodile':909,'Crocogril':910,'Flâmigator':911,
  'Coiffeton':912,'Canarbello':913,'Palmaval':914,
  'Gourmelet':915,'Fragroin':916,
  'Tissenboule':917,'Filentrappe':918,
  'Lilliterelle':919,'Gambex':920,
  'Pohm':921,'Pohmotte':922,'Pohmarmotte':923,
  'Compagnol':924,'Famignol':925,
  'Pâtachiot':926,'Briochien':927,
  'Olivini':928,'Olivado':929,'Arboliva':930,
  'Tapatoès':931,
  'Selutin':932,'Amassel':933,'Gigansel':934,
  'Charbambin':935,'Carmadura':936,'Malvalame':937,
  'Têtampoule':938,'Ampibidou':939,
  'Zapétrel':940,'Fulgulairo':941,
  'Grondogue':942,'Dogrino':943,
  'Gribouraigne':944,'Tag-Tag':945,
  'Virovent':946,'Virevorreur':947,
  'Terracool':948,'Terracruel':949,
  'Craparoi':950,
  'Pimito':951,'Scovilain':952,
  'Léboulérou':953,'Bérasca':954,
  'Flotillon':955,'Cléopsytra':956,
  'Forgerette':957,'Forgella':958,'Forgelina':959,
  'Taupikeau':960,'Triopikeau':961,
  'Lestombaile':962,
  'Dofin':963,'Superdofin':964,
  'Vrombi':965,'Vrombotor':966,
  'Motorizard':967,
  'Ferdeter':968,
  'Germéclat':969,'Floréclat':970,
  'Toutombe':971,'Tomberro':972,
  'Flamenroule':973,
  'Piétacé':974,'Balbalèze':975,
  'Délestin':976,
  'Oyacata':977,
  'Nigirigon':978,
  'Terraiste':980,
  'Fort-Ivoire':984,
  'Hurle-Queue':985,
  'Fongus-Furie':986,
  'Flotte-Mèche':987,
  'Rampe-Ailes':988,
  'Pelage-Sablé':989,
  'Roue-de-Fer':990,
  'Hotte-de-Fer':991,
  'Paume-de-Fer':992,
  'Têtes-de-Fer':993,
  'Mite-de-Fer':994,
  'Épine-de-Fer':995,
  'Frigodo':996,'Cryodo':997,'Glaivodo':998,
  'Mordudor':999,'Gromago':1000,
  'Chongjian':1001,
  'Baojian':1002,
  'Dinglu':1003,
  'Yuyu':1004,
  'Rugit-Lune':1005,
  'Garde-de-Fer':1006,
  'Koraidon':1007,
  'Miraidon':1008,
  'Serpente-Eau':1009,
  'Vert-de-Fer':1010,
  'Pomdramour':1011,
  'Poltchageist':1012,'Théffroyable':1013,
  'Félicanis':1014,
  'Fortusimia':1015,
  'Favianos':1016,
  'Ogerpon':1017,
  'Pondralugon':1018,
  'Pomdorochi':1019,
  'Feu-Perçant':1020,
  'Ire-Foudre':1021,
  'Roc-de-Fer':1022,
  'Chef-de-Fer':1023,
  'Terapagos':1024,
  'Pêchaminus':1025,
  'Axoloto de Paldea':10253,
  'Tauros de Paldea (Race Combative)':10250,
  'Tauros de Paldea (Race Flamboyante)':10251,
  'Tauros de Paldea (Race Aquatique)':10252,
};
