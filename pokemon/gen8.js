/* ==== SOMMAIRE ====
   Pokédex n°810 à 898 (région de Galar) + 14 lignées de Formes de Galar + contenu DLC. Repères
   (lignes approximatives) :
   - L.3-148   : Starters, lignées classiques de Galar, fossiles combinés
   - L.149-188 : Légendaires de Galar (Zacian/Zamazenta/Éthernatos) + DLC (Wushours/Shifours,
     Zarude, Régieleki, Régidrago, Blizzeval/Spectreval, Sylveroy)
   - L.189-241 : Formes de Galar (lignées séparées, réutilisent le n° de Pokédex national)
   - L.242-fin : DEX_NUMBERS_GEN8 (numéros de Pokédex, utilisés pour résoudre les sprites)
==== */
const LINES_GEN8 = [
{id:'ouistempo',abilities:['Engrais','Copeaux Surge'],moveIds:['scratch','growl','branchpoke','razorleaf','drumbeating','grassyglide','solarblade','protect','swift','endure','hyperbeam','solarbeam','facade','sleeptalk','rest','swordsdance','sunnyday','takedown','bodyslam','gigadrain','doubleedge','bulletseed','bulldoze','magicalleaf','thief','brickbreak','earthquake','scaryface','knockoff','focusblast','slam','screech','uproar','taunt','endeavor','nobleroar','grassyterrain','boomburst','strength','growth','fakeout','frenzyplant','leechseed','substitute','hammerarm','assurance','fling','worryseed','seedbomb','drainpunch','energyball','leafstorm','grassknot','woodhammer','round','acrobatics','grasspledge','workup','terablast','doublehit','earthpower','gigaimpact','lowsweep','snarl','attract','bodypress','brutalswing','bulkup','darkestlariat','falseswipe','focusenergy','focuspunch','highhorsepower','hypervoice','lowkick','megakick','megapunch','mudshot','snore','stompingtantrum','superpower','trailblaze','uturn','natureforce'],
 stages:[
  {name:'Ouistempo',types:['plante'],base:st(50,65,50,40,40,65)},
  {name:'Badabouin',types:['plante'],base:st(70,85,70,55,60,80)},
  {name:'Gorythmic',types:['plante'],base:st(100,125,90,60,70,85)}]},
{id:'flambino',abilities:['Brasier','Libéro'],moveIds:['growl','ember','doublekick','pyroball','flamethrower','fireblast','protect','swift','endure','hyperbeam','facade','doubleedge','sleeptalk','rest','suckerpunch','sunnyday','takedown','heatwave','willowisp','tackle','overheat','firespin','taunt','zenheadbutt','focusblast','shadowball','headbutt','counter','agility','quickattack','bounce','courtchange','firefang','firepunch','sandattack','highjumpkick','superfang','blastburn','coaching','scorchingsands','substitute','helpinghand','assurance','flareblitz','gunkshot','electroball','flamecharge','lowsweep','round','allyswitch','acrobatics','firepledge','workup','terablast','temperflare','feint','fling','gigaimpact','smackdown','snarl','attract','batonpass','blazekick','bulkup','burningjealousy','focusenergy','ironhead','lowkick','megakick','mudshot','mudslap','revenge','reversal','snore','swordsdance','trailblaze','uturn','weatherball'],
 stages:[
  {name:'Flambino',types:['feu'],base:st(50,71,40,40,40,69)},
  {name:'Lapyro',types:['feu'],base:st(65,86,60,55,60,94)},
  {name:'Pyrobut',types:['feu'],base:st(80,116,75,65,75,119)}]},
{id:'larmeleon',abilities:['Torrent','Sniper'],moveIds:['pound','watergun','snipeshot','icebeam','surf','hydropump','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','raindance','takedown','waterpulse','icywind','blizzard','waterfall','whirlpool','mudshot','muddywater','weatherball','bind','growl','uturn','suckerpunch','liquidation','tearfullook','mist','doubleteam','haze','fellstinger','hydrocannon','scaleshot','substitute','aquaring','iceshard','aquajet','soak','round','waterpledge','workup','terablast','chillingwater','fling','vacuumwave','gigaimpact','smackdown','scald','acrobatics','snowscape','agility','aircutter','airslash','attract','batonpass','bounce','breakingswipe','darkpulse','dive','flipturn','focusenergy','iciclespear','lightscreen','metronome','psychup','reflect','safeguard','shadowball','skittersmack','snore','swordsdance','taunt'],
 stages:[
  {name:'Larméléon',types:['eau'],base:st(50,40,40,70,40,70)},
  {name:'Arrozard',types:['eau'],base:st(65,60,55,95,55,90)},
  {name:'Lézargus',types:['eau'],base:st(70,85,65,125,65,120)}]},
{id:'rongourmand',abilities:['Bajoues','Gloutonnerie'],moveIds:['tackle','bite','superfang','stuffcheeks','bodyslam','crunch','protect','endure','hyperbeam','facade','doubleedge','sleeptalk','rest','raindance','sunnyday','takedown','thief','dig','bulldoze','uproar','earthquake','attract','hypervoice','tailwhip','counter','stockpile','spitup','swallow','bulletseed','belch','firefang','icefang','thunderfang','defensecurl','bellydrum','rollout','substitute','gyroball','payback','assurance','fling','lastresort','seedbomb','round','tailslap','terablast','gigaimpact','wildcharge','covet','amnesia','bodypress','brutalswing','curse','endeavor','highhorsepower','irontail','knockoff','mudshot','mudslap','psychicfangs','snore','stompingtantrum','superpower','swordsdance','trailblaze'],
 stages:[
  {name:'Rongourmand',types:['normal'],base:st(70,55,55,35,35,25)},
  {name:'Rongrigou',types:['normal'],base:st(120,95,95,55,75,20)}]},
{id:'minisange',abilities:['Regard Vif','Tension','Cœur de Coq'],moveIds:['peck','dualwingbeat','ironhead','flashcannon','protect','swift','endure','hyperbeam','fly','facade','sleeptalk','rest','raindance','sunnyday','takedown','bodyslam','aerialace','thief','doubleedge','airslash','agility','scaryface','taunt','uturn','irondefense','hurricane','furyattack','leer','drillpeck','swagger','powertrip','screech','steelwing','sandattack','skyattack','spite','rocksmash','steelbeam','substitute','roost','pluck','tailwind','payback','assurance','bravebird','nastyplot','defog','honeclaws','round','retaliate','workup','terablast','gigaimpact','heavyslam','aircutter','attract','bodypress','bulkup','curse','faketears','featherdance','focusenergy','lightscreen','metalclaw','reflect','revenge','reversal','snore','stridoson'],
 stages:[
  {name:'Minisange',types:['vol'],base:st(38,47,35,33,35,57)},
  {name:'Bleuseille',types:['vol'],base:st(68,67,55,43,55,77)},
  {name:'Corvaillus',types:['vol','acier'],base:st(98,87,105,53,85,67),abilities:['Pression','Tension','Armure Miroir']}]},
{id:'larvadar',abilities:['Essaim','Œil Composé','Télépathe'],moveIds:['confusion','leechlife','psybeam','psychic','protect','endure','hyperbeam','facade','sleeptalk','rest','calmmind','futuresight','lightscreen','shadowball','zenheadbutt','reflect','solarbeam','skillswap','trick','safeguard','agility','hypnosis','confuseray','mirrorcoat','magiccoat','psychicterrain','supersonic','recover','stickyweb','infestation','expandingforce','strugglebug','substitute','helpinghand','payback','powerswap','guardswap','bugbuzz','energyball','trickroom','wonderroom','psyshock','magicroom','round','storedpower','allyswitch','gigaimpact','psychocut','afteryou','attract','batonpass','bodypress','gigadrain','imprison','irondefense','snore','uturn'],
 stages:[
  {name:'Larvadar',types:['insecte'],base:st(25,20,20,25,45,45)},
  {name:'Coléodôme',types:['insecte','psy'],base:st(50,35,80,50,90,30)},
  {name:'Astronelle',types:['insecte','psy'],base:st(60,45,110,80,120,90),abilities:['Essaim','Fouille','Télépathe']}]},
{id:'goupilou',abilities:['Fuite','Délestage','Filature'],moveIds:['crunch','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','thief','taunt','shadowball','dig','darkpulse','knockoff','shadowclaw','tailwhip','quickattack','beatup','suckerpunch','nightslash','firefang','icefang','thunderfang','lashout','torment','howl','burningjealousy','substitute','assurance','nastyplot','honeclaws','foulplay','round','quickguard','tailslap','snarl','gigaimpact','grassknot','acrobatics','partingshot','agility','attract','batonpass','faketears','mudshot','playrough','psychic','screech','snore','uturn'],
 stages:[
  {name:'Goupilou',types:['tenebres'],base:st(40,28,28,47,52,50)},
  {name:'Roublenard',types:['tenebres'],base:st(70,58,58,87,92,90)}]},
{id:'tournicoton',abilities:['Chute Cotonneuse','Régé-Force','Pose Spore'],moveIds:['cottonspore','gigadrain','protect','endure','hyperbeam','solarbeam','facade','sleeptalk','rest','synthesis','sunnyday','bulletseed','magicalleaf','lightscreen','growth','sing','razorleaf','rapidspin','sweetscent','hypervoice','aromatherapy','leafage','grassyglide','poisonpowder','stunspore','sleeppowder','leechseed','substitute','helpinghand','worryseed','energyball','leafstorm','grassknot','round','leaftornado','seedbomb','gigaimpact','cottonguard','attract','charm','grassyterrain','pollenpuff','snore','weatherball'],
 stages:[
  {name:'Tournicoton',types:['plante'],base:st(40,40,60,40,60,10)},
  {name:'Blancoton',types:['plante'],base:st(60,50,90,80,120,60)}]},
{id:'moumouton',abilities:['Pelage Moelleux','Fuite','Anti-Bombe'],moveIds:['tackle','headbutt','bodyslam','doubleedge','protect','endure','hyperbeam','facade','sleeptalk','rest','takedown','thunderwave','zenheadbutt','agility','attract','swagger','doublekick','growl','defensecurl','reversal','grassyglide','stomp','counter','substitute','payback','copycat','guardswap','guardsplit','electroball','round','wildcharge','cottonguard','lastresort','gigaimpact','retaliate','batonpass','bodypress','bounce','megakick','snore','swordsdance'],
 stages:[
  {name:'Moumouton',types:['normal'],base:st(42,40,55,40,45,48)},
  {name:'Moumouflon',types:['normal'],base:st(72,80,100,60,90,88),abilities:['Pelage Moelleux','Impassible','Anti-Bombe']}]},
{id:'khelocrok',abilities:['Mâchouille','Coque Armure','Glissade'],moveIds:['tackle','bite','liquidation','crunch','stoneedge','protect','endure','hyperbeam','surf','facade','sleeptalk','rest','raindance','takedown','icebeam','bodyslam','rockslide','waterpulse','blizzard','rocktomb','bulldoze','doubleedge','earthquake','waterfall','hydropump','dig','watergun','sandstorm','stealthrock','whirlpool','scaryface','mudshot','attract','headbutt','counter','jawlock','icefang','scaleshot','skittersmack','skullbash','meteorbeam','substitute','payback','assurance','gastroacid','round','shellsmash','dragontail','terablast','chillingwater','rockpolish','earthpower','gigaimpact','headsmash','scald','razorshell','icespinner','bodypress','dive','falseswipe','highhorsepower','irondefense','irontail','megahorn','muddywater','poisonjab','revenge','rockblast','sandtomb','smartstrike','snore','stompingtantrum','superfang','superpower','swordsdance','throatchop'],
 stages:[
  {name:'Khélocrok',types:['eau'],base:st(50,64,50,38,38,44)},
  {name:'Torgamord',types:['eau','roche'],base:st(90,115,90,48,68,74)}]},
{id:'voltoutou',abilities:['Ramasse Ball','Phobique'],moveIds:['tackle','bite','discharge','thunderbolt','protect','swift','endure','hyperbeam','facade','doubleedge','sleeptalk','rest','thunderwave','thunder','agility','dig','charge','tailwhip','charm','spark','crunch','playrough','electricterrain','firefang','thunderfang','risingvoltage','sandattack','howl','roar','substitute','helpinghand','electroball','flamecharge','round','voltswitch','wildcharge','snarl','nuzzle','gigaimpact','electrify','attract','bulkup','eerieimpulse','focusenergy','hypervoice','psychicfangs','snore','uproar'],
 stages:[
  {name:'Voltoutou',types:['electrik'],base:st(59,45,50,40,50,26)},
  {name:'Fulgudog',types:['electrik'],base:st(69,90,60,90,60,121),abilities:['Mâchouille','Battant']}]},
{id:'charbi',abilities:['Turbo Vapeur','Ignifugé','Torche'],moveIds:['tackle','stealthrock','rockslide','stoneedge','flamethrower','fireblast','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','takedown','bodyslam','rocktomb','bulldoze','earthquake','dig','sandstorm','curse','solarbeam','ancientpower','heatwave','ironhead','irondefense','willowisp','overheat','firespin','mudslap','smokescreen','rapidspin','rockblast','tarshot','firepunch','meteorbeam','explosion','block','scorchingsands','substitute','gyroball','rockpolish','powergem','smackdown','round','incinerate','heatcrash','terablast','temperflare','flareblitz','heavyslam','flamecharge','scald','earthpower','gigaimpact','attract','bodypress','burnup','highhorsepower','megakick','megapunch','reflect','sandtomb','selfdestruct','snore','spikes'],
 stages:[
  {name:'Charbi',types:['roche'],base:st(30,40,50,40,50,30)},
  {name:'Wagomine',types:['roche','feu'],base:st(80,60,90,60,70,50),abilities:['Turbo Vapeur','Corps Ardent','Torche']},
  {name:'Monthracite',types:['roche','feu'],base:st(110,80,120,80,90,30),abilities:['Turbo Vapeur','Corps Ardent','Torche']}]},
{id:'verpom',abilities:['Mûrissement','Gloutonnerie','Anti-Bombe'],moveIds:['appleacid','gravapple','dragonpulse','protect','endure','hyperbeam','solarbeam','facade','sleeptalk','rest','sunnyday','takedown','raindance','bodyslam','bulldoze','gigadrain','scaryface','earthquake','aerialace','zenheadbutt','outrage','bulletseed','lightscreen','magicalleaf','curse','withdraw','astonish','wingattack','fly','growth','dragonbreath','twister','recycle','irondefense','dragondance','stomp','headbutt','recover','sweetscent','dracometeor','grassyglide','defensecurl','rollout','suckerpunch','dualwingbeat','terablast','pounce','leechseed','substitute','seedbomb','dragonrush','energyball','gigaimpact','leafstorm','grassknot','heavyslam','acidspray','round','acrobatics','helpinghand','gyroball','payback','dragontail','attract'],
 stages:[
  {name:'Verpom',types:['plante','dragon'],base:st(40,40,80,40,40,20)}], branches:[
  {name:'Pomdrapi',types:['plante','dragon'],base:st(70,110,80,95,60,70),abilities:['Mûrissement','Gloutonnerie','Agitation'],extraMoveIds:['airslash','endeavor','focusenergy','grassyterrain','snore','trailblaze','uturn']},
  {name:'Dratatin',types:['plante','dragon'],base:st(110,85,80,100,80,30),abilities:['Mûrissement','Gloutonnerie','Isograisse'],extraMoveIds:['amnesia','bodypress','grassyterrain','highhorsepower','ironhead','reflect','safeguard','snore','stompingtantrum','superpower','trailblaze']}
 ]},
{id:'dunaja',abilities:['Crache-Sable','Mue','Voile Sable'],moveIds:['glare','bulldoze','earthquake','stoneedge','protect','endure','hyperbeam','facade','sleeptalk','rest','takedown','bodyslam','rockslide','rocktomb','dig','sandstorm','stealthrock','mudslap','mudshot','scaryface','ironhead','zenheadbutt','slam','sandattack','headbutt','wrap','minimize','sandtomb','brutalswing','firefang','thunderfang','scaleshot','skittersmack','scorchingsands','poisontail','belch','substitute','lastresort','dragonrush','earthpower','coil','round','drillrun','terablast','gigaimpact','attract','bodypress','endeavor','highhorsepower','hurricane','irondefense','outrage','rockblast','screech','skullbash','snore'],
 stages:[
  {name:'Dunaja',types:['sol'],base:st(52,57,75,35,50,46)},
  {name:'Dunaconda',types:['sol'],base:st(72,107,125,65,70,71)}]},
{id:'nigosier',abilities:['Dégobage'],moveIds:['watergun','peck','surf','hurricane','icebeam','hydropump','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','takedown','waterpulse','icywind','thief','blizzard','aerialace','agility','airslash','whirlpool','weatherball','fly','furyattack','thrash','drillpeck','amnesia','stockpile','spitup','swallow','dive','dualwingbeat','featherdance','belch','aquacutter','substitute','roost','pluck','tailwind','assurance','aquaring','bravebird','gigaimpact','defog','round','scald','acrobatics','terablast','pounce','chillingwater','aircutter','attract','endeavor','liquidation','reversal','snore','steelwing','superpower','throatchop','uproar'],
 stages:[
  {name:'Nigosier',types:['vol','eau'],base:st(70,85,55,85,95,85)}]},
{id:'embrochet',abilities:['Glissade','Propulseur'],moveIds:['liquidation','crunch','protect','swift','endure','hyperbeam','surf','facade','sleeptalk','rest','raindance','takedown','icebeam','waterpulse','blizzard','waterfall','hydropump','doubleedge','whirlpool','brickbreak','scaryface','agility','furyattack','bite','peck','focusenergy','dive','throatchop','icefang','scaleshot','thrash','slash','nightslash','flipturn','substitute','acupressure','assurance','aquajet','round','scald','drillrun','terablast','chillingwater','gigaimpact','attract','bounce','closecombat','laserfocus','poisonjab','psychicfangs','snore'],
 stages:[
  {name:'Embrochet',types:['eau'],base:st(41,63,40,40,30,66)},
  {name:'Hastacuda',types:['eau'],base:st(61,123,60,60,50,136)}]},
{id:'toxizap',abilities:['Phobique','Statik','Maladresse'],moveIds:['overdrive','sludgebomb','poisonjab','thunderbolt','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','takedown','thief','thunder','thunderwave','scaryface','brickbreak','taunt','toxic','thunderpunch','growl','acid','flail','belch','tearfullook','leer','thundershock','screech','swagger','spark','charge','shockwave','discharge','shiftgear','nobleroar','boomburst','thunderfang','firepunch','endeavor','poweruppunch','risingvoltage','substitute','round','nuzzle','terablast','helpinghand','payback','fling','drainpunch','gigaimpact','gunkshot','chargebeam','venoshock','sludgewave','electroball','acidspray','storedpower','hex','voltswitch','electroweb','wildcharge','snarl','attract','charm','encore','snore','stridoson'],
 stages:[
  {name:'Toxizap',types:['electrik','poison'],base:st(40,38,35,54,35,40)}], branches:[
  {name:'Salarsen',types:['electrik','poison'],base:st(75,98,70,114,70,75),abilities:['Punk Rock','Plus','Technicien'],extraMoveIds:['eerieimpulse','electricterrain','hypervoice','megakick','megapunch','metronome','poisontail','psychicnoise','throatchop','toxicspikes','trailblaze','uproar']},
  {name:'Salaquin',types:['electrik','poison'],base:st(75,98,70,114,70,75),abilities:['Punk Rock','Minus','Technicien'],extraMoveIds:['eerieimpulse','electricterrain','hypervoice','megakick','megapunch','metronome','poisontail','psychicnoise','throatchop','toxicspikes','trailblaze','uproar']}
 ]},
{id:'grillepattes',abilities:['Torche','Écran Fumée','Corps Ardent'],moveIds:['ember','lunge','firelash','flamethrower','leechlife','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','solarbeam','fireblast','heatwave','willowisp','overheat','firespin','slam','wrap','bite','smokescreen','flamewheel','crunch','bugbite','burnup','firefang','thunderfang','skittersmack','scorchingsands','defensecurl','rollout','knockoff','substitute','bugbuzz','powerwhip','venoshock','coil','round','scald','strugglebug','heatcrash','flareblitz','xscissor','gigaimpact','inferno','attract','brutalswing','mysticalfire','snore'],
 stages:[
  {name:'Grillepattes',types:['feu','insecte'],base:st(50,65,45,50,50,45)},
  {name:'Scolocendre',types:['feu','insecte'],base:st(100,115,65,90,90,65)}]},
{id:'poulpaf',abilities:['Échauffement','Technicien'],moveIds:['closecombat','liquidation','brickbreak','protect','endure','hyperbeam','surf','facade','sleeptalk','rest','bodyslam','focusblast','dig','taunt','scaryface','reversal','bulkup','icepunch','bind','leer','submission','detect','rocksmash','superpower','octazooka','topsyturvy','octolock','coaching','seismictoss','painsplit','suckerpunch','poweruppunch','skittersmack','substitute','brine','feint','payback','soak','round','circlethrow','retaliate','workup','drainpunch','gigaimpact','attract','brutalswing','dive','hydropump','megapunch','muddywater','mudshot','revenge','snore','stompingtantrum','waterfall','whirlpool'],
 stages:[
  {name:'Poulpaf',types:['combat'],base:st(50,68,60,50,50,32)},
  {name:'Krakos',types:['combat'],base:st(80,118,90,70,80,42)}]},
{id:'theffroi',abilities:['Armure Rouillée','Corps Maudit'],moveIds:['confuseray','astonish','shadowball','strengthsap','protect','endure','hyperbeam','facade','sleeptalk','rest','calmmind','psychic','curse','darkpulse','trick','lightscreen','megadrain','withdraw','gigadrain','sweetscent','memento','suckerpunch','aromaticmist','teatime','poltergeist','substitute','payback','nastyplot','trickroom','wonderroom','psyshock','foulplay','round','storedpower','allyswitch','shellsmash','hex','terablast','gigaimpact','aromatherapy','batonpass','imprison','magicalleaf','metronome','nightshade','painsplit','phantomforce','psybeam','reflect','selfdestruct','skillswap','snore','spite','willowisp'],
 stages:[
  {name:'Théffroi',types:['fantome'],base:st(40,45,45,74,54,50)},
  {name:'Polthégeist',types:['fantome'],base:st(60,65,65,134,114,70)}]},
{id:'bibichut',abilities:['Cœur Soin','Anticipation','Rebond'],moveIds:['disarmingvoice','psybeam','magicpowder','psychic','dazzlinggleam','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','calmmind','lightscreen','shadowball','reflect','thunderwave','skillswap','psychup','futuresight','trick','confusion','safeguard','charm','playnice','aromaticmist','lifedew','brutalswing','expandingforce','mysticalfire','mistyexplosion','substitute','helpinghand','healingwish','trickroom','psyshock','afteryou','round','storedpower','healpulse','quash','nuzzle','terablast','gravity','powerswap','guardswap','gigaimpact','psychocut','powerwhip','wonderroom','magicroom','agility','aromatherapy','attract','batonpass','darkpulse','drainingkiss','gigadrain','imprison','magicalleaf','metronome','mistyterrain','painsplit','playrough','psychicnoise','psychicterrain','shadowclaw','snore','swordsdance'],
 stages:[
  {name:'Bibichut',types:['psy'],base:st(42,30,45,56,53,39)},
  {name:'Chapotus',types:['psy'],base:st(57,40,65,86,73,49)},
  {name:'Sorcilence',types:['psy','fee'],base:st(57,90,95,136,103,29)}]},
{id:'grimalin',abilities:['Farceur','Fouille','Pickpocket'],moveIds:['faketears','spiritbreak','playrough','darkestlariat','throatchop','protect','endure','hyperbeam','facade','sleeptalk','rest','takedown','bodyslam','thief','taunt','brickbreak','scaryface','focusblast','darkpulse','thunderwave','lightscreen','crunch','bite','swagger','fakeout','torment','flatter','suckerpunch','confide','falsesurrender','bulkup','firepunch','icepunch','thunderpunch','burningjealousy','lashout','substitute','assurance','fling','drainpunch','nastyplot','foulplay','round','retaliate','partingshot','terablast','chillingwater','hammerarm','powerswap','gigaimpact','powerwhip','wonderroom','lowsweep','attract','bodypress','dazzlinggleam','drainingkiss','focusenergy','focuspunch','imprison','leechlife','lowkick','megakick','megapunch','metronome','mistyterrain','poweruppunch','reflect','revenge','shadowclaw','snore','stompingtantrum','superpower','trailblaze','trick','uproar'],
 stages:[
  {name:'Grimalin',types:['tenebres','fee'],base:st(45,45,30,55,40,50)},
  {name:'Fourbelin',types:['tenebres','fee'],base:st(65,60,45,75,55,70)},
  {name:'Angoliath',types:['tenebres','fee'],base:st(95,120,65,95,75,60)}]},
{id:'cremy',abilities:['Voile Sucré','Voile Aromatique'],moveIds:['tackle','drainingkiss','decorate','dazzlinggleam','protect','endure','hyperbeam','facade','sleeptalk','rest','calmmind','lightscreen','psychic','charm','solarbeam','recover','acidarmor','sweetkiss','attract','sweetscent','mistyterrain','aromaticmist','babydolleyes','mistyexplosion','substitute','helpinghand','fling','lastresort','entrainment','round','storedpower','terablast','drainpunch','energyball','gigaimpact','wonderroom','psyshock','magicroom','alluringvoice','aromatherapy','disarmingvoice','encore','endeavor','faketears','gigadrain','imprison','magicalleaf','metronome','mysticalfire','painsplit','playrough','psychup','safeguard','snore','triattack'],
 stages:[
  {name:'Crèmy',types:['fee'],base:st(45,40,40,50,61,34)},
  {name:'Charmilly',types:['fee'],base:st(65,60,75,110,121,64)}]},
{id:'hexadron',abilities:['Armurbaston','Acharné'],moveIds:['tackle','closecombat','noretreat','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','bodyslam','takedown','brickbreak','focusblast','rocktomb','rockslide','zenheadbutt','poisonjab','knockoff','swordsdance','reversal','bulkup','headbutt','counter','focusenergy','megahorn','rocksmash','irondefense','firstimpression','coaching','substitute','helpinghand','payback','assurance','seedbomb','gigaimpact','doublehit','round','retaliate','terablast','agility','beatup','bodypress','endeavor','falseswipe','highhorsepower','ironhead','lunge','psychup','revenge','screech','smartstrike','snore','superpower','throatchop','trailblaze','upperhand','uproar'],
 stages:[
  {name:'Hexadron',types:['combat'],base:st(65,100,100,70,60,75),forms:{
    falinksite:{name:'Méga-Hexadron',types:['combat'],base:st(65,135,135,70,65,100),abilities:['Acharné']}
  }}]},
{id:'wattapik',abilities:['Paratonnerre','Électro Surge'],moveIds:['thundershock','risingvoltage','discharge','thunderbolt','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','raindance','takedown','bodyslam','thunderwave','thunder','charge','curse','furyattack','watergun','bubblebeam','peck','recover','spark','poisonjab','electricterrain','zingzap','memento','suckerpunch','substitute','brine','acupressure','payback','assurance','gigaimpact','chargebeam','venoshock','electroball','round','scald','hex','electroweb','wildcharge','terablast','chillingwater','attract','hydropump','liquidation','muddywater','painsplit','pinmissile','reversal','selfdestruct','snore','spikes','supercellslam','surf','throatchop','toxicspikes','venomdrench'],
 stages:[
  {name:'Wattapik',types:['electrik'],base:st(48,101,95,91,85,15)}]},
{id:'frissonille',abilities:['Écran Poudre','Écailles Glacées'],moveIds:['powdersnow','leechlife','icebeam','gigadrain','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','blizzard','takedown','lightscreen','icywind','attract','bugbite','mist','aurorabeam','stunspore','featherdance','infestation','auroraveil','skittersmack','mirrorcoat','fairywind','tripleaxel','dualwingbeat','substitute','bugbuzz','round','strugglebug','terablast','pounce','helpinghand','tailwind','gigaimpact','avalanche','defog','wideguard','quiverdance','acrobatics','icespinner','snowscape','airslash','calmmind','dazzlinggleam','hail','hurricane','iciclespear','imprison','lunge','playrough','reflect','safeguard','snore','uturn','weatherball'],
 stages:[
  {name:'Frissonille',types:['glace','insecte'],base:st(30,25,35,45,30,20)},
  {name:'Beldeneige',types:['glace','insecte'],base:st(70,65,60,125,90,65)}]},
{id:'dolman',abilities:["Cercle d'Énergie"],moveIds:['rockthrow','stealthrock','rockslide','stoneedge','protect','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','rocktomb','takedown','bulldoze','bodyslam','sandstorm','earthquake','curse','irondefense','ancientpower','attract','rockblast','stomp','megakick','block','meteorbeam','substitute','gravity','assurance','rockpolish','powergem','earthpower','gigaimpact','wideguard','wonderroom','smackdown','heavyslam','lowsweep','round','heatcrash','terablast','hardpress','bodypress','brutalswing','endeavor','highhorsepower','imprison','lowkick','psychup','safeguard','sandtomb','selfdestruct','snore','stompingtantrum','superpower'],
 stages:[
  {name:'Dolman',types:['roche'],base:st(100,125,135,20,20,70)}]},
{id:'bekaglacon',abilities:['Tête de Gel'],moveIds:['tackle','powdersnow','icebeam','protect','endure','hyperbeam','facade','sleeptalk','rest','blizzard','raindance','takedown','bodyslam','doubleedge','icywind','waterpulse','zenheadbutt','reflect','ironhead','headbutt','mist','surf','amnesia','weatherball','freezedry','auroraveil','icepunch','bellydrum','substitute','brine','aquaring','gigaimpact','avalanche','headsmash','soak','round','iciclecrash','terablast','icespinner','snowscape','chillingwater','agility','attract','dive','featherdance','flipturn','hail','hydropump','iciclespear','irondefense','liquidation','reversal','snore','waterfall','whirlpool'],
 stages:[
  {name:'Bekaglaçon',types:['glace'],base:st(75,80,110,65,90,50)}]},
{id:'wimessir',abilities:['Attention','Synchro','Psycho Surge'],moveIds:['psybeam','expandingforce','psychic','futuresight','protect','swift','endure','facade','sleeptalk','rest','calmmind','shadowball','takedown','bodyslam','zenheadbutt','psychup','skillswap','trick','encore','disarmingvoice','playnice','psychicterrain','terrainpulse','fakeout','extrasensory','substitute','helpinghand','gravity','healingwish','powerswap','lastresort','drainpunch','energyball','trickroom','powersplit','wonderroom','psyshock','magicroom','afteryou','round','storedpower','allyswitch','terablast','aromatherapy','attract','dazzlinggleam','drainingkiss','hypervoice','imprison','magicalleaf','metronome','mysticalfire','payday','playrough','psychicnoise','snore','triattack'],
 stages:[
  {name:'Wimessir',types:['psy','normal'],base:st(60,65,55,105,95,95)}]},
{id:'morpeko',abilities:['Déclic Fringale'],moveIds:['thundershock','thunderbolt','protect','swift','endure','facade','sleeptalk','rest','takedown','thief','taunt','thunderwave','doubleedge','scaryface','thunder','brickbreak','darkpulse','knockoff','agility','crunch','leer','thunderpunch','bite','thrash','tailwhip','quickattack','spark','torment','flatter','bulletseed','powertrip','aurawheel','firefang','icefang','thunderfang','risingvoltage','lashout','superfang','swagger','rapidspin','fakeout','charge','tickle','substitute','payback','assurance','fling','seedbomb','nastyplot','chargebeam','electroball','foulplay','round','quash','voltswitch','electroweb','wildcharge','snarl','partingshot','terablast','attract','batonpass','eerieimpulse','electricterrain','endeavor','faketears','outrage','psychicfangs','revenge','reversal','snore','spite','stompingtantrum','uproar'],
 stages:[
  {name:'Morpeko',types:['electrik','tenebres'],base:st(58,95,58,70,58,97)}]},
{id:'charibari',abilities:['Sans Limite','Heavy Metal'],moveIds:['tackle','ironhead','steelroller','earthquake','protect','endure','hyperbeam','facade','sleeptalk','rest','takedown','bodyslam','rockslide','rocktomb','doubleedge','irondefense','bulldoze','flashcannon','brickbreak','sandstorm','stealthrock','dig','scaryface','stoneedge','taunt','zenheadbutt','curse','stomp','growl','strength','rollout','rocksmash','superpower','playrough','highhorsepower','steelbeam','whirlwind','slam','fissure','defensecurl','swagger','belch','substitute','fling','earthpower','powerwhip','heavyslam','round','workup','terablast','payback','gigaimpact','smackdown','heatcrash','snarl','hardpress','attract','bodypress','brutalswing','endeavor','knockoff','megakick','mudshot','outrage','revenge','rockblast','screech','snore','stompingtantrum','supercellslam'],
 stages:[
  {name:'Charibari',types:['acier'],base:st(72,80,49,40,49,40)},
  {name:'Pachyradjah',types:['acier'],base:st(122,130,69,80,69,30)}]},
{id:'galvagon',abilities:['Absorbe-Volt','Agitation','Baigne Sable'],moveIds:['tackle','thundershock','thunderbolt','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','bodyslam','thunderwave','thunder','rockslide','rocktomb','bulldoze','earthquake','outrage','dragonpulse','stoneedge','aerialace','thunderpunch','taunt','flamethrower','slam','stomp','ancientpower','charge','discharge','boltbeak','firefang','thunderfang','dracometeor','meteorbeam','risingvoltage','substitute','pluck','dragonrush','earthpower','gigaimpact','electroball','round','dragontail','wildcharge','breakingswipe','brutalswing','dragonclaw','fireblast','firespin','highhorsepower','irontail','lowkick','megakick','megapunch','rockblast','snore','stompingtantrum'],
 stages:[
  {name:'Galvagon',types:['electrik','dragon'],base:st(90,100,90,80,70,75)}]},
{id:'galvagla',abilities:['Absorbe-Volt','Statik','Glisse Neige'],moveIds:['powdersnow','icebeam','thunderbolt','protect','endure','hyperbeam','facade','sleeptalk','rest','blizzard','raindance','bodyslam','thunderwave','thunder','rockslide','bulldoze','rocktomb','icywind','taunt','thunderpunch','charge','slam','thundershock','ancientpower','discharge','freezedry','boltbeak','icefang','thunderfang','meteorbeam','risingvoltage','substitute','pluck','payback','gigaimpact','avalanche','electroball','round','echoedvoice','wildcharge','iciclecrash','hail','hydropump','hypervoice','iciclespear','irontail','lowkick','megakick','megapunch','rockblast','snore','stompingtantrum','stoneedge','surf'],
 stages:[
  {name:'Galvagla',types:['electrik','glace'],base:st(90,100,90,90,80,55)}]},
{id:'hydragon',abilities:['Absorbe-Eau','Mâchouille','Baigne Sable'],moveIds:['tackle','watergun','liquidation','dragonpulse','protect','endure','hyperbeam','surf','facade','sleeptalk','rest','raindance','bodyslam','waterfall','hydropump','rockslide','bulldoze','rocktomb','whirlpool','earthquake','stoneedge','zenheadbutt','outrage','stomp','bite','superfang','dragonbreath','crunch','ancientpower','brutalswing','fishiousrend','icefang','dracometeor','meteorbeam','substitute','brine','dragonrush','earthpower','gigaimpact','round','scald','dive','ironhead','leechlife','lowkick','megakick','psychicfangs','rockblast','snore','stompingtantrum'],
 stages:[
  {name:'Hydragon',types:['eau','dragon'],base:st(90,90,100,70,80,75)}]},
{id:'hydragla',abilities:['Absorbe-Eau','Corps Gel','Glisse Neige'],moveIds:['watergun','icebeam','liquidation','protect','endure','hyperbeam','surf','facade','sleeptalk','rest','blizzard','raindance','icywind','bodyslam','waterfall','hydropump','rockslide','rocktomb','whirlpool','zenheadbutt','bite','superfang','powdersnow','crunch','ancientpower','freezedry','auroraveil','fishiousrend','icefang','meteorbeam','substitute','brine','gigaimpact','avalanche','round','iciclecrash','dive','hail','iciclespear','irondefense','ironhead','psychicfangs','rockblast','snore','stoneedge'],
 stages:[
  {name:'Hydragla',types:['eau','glace'],base:st(90,90,100,80,90,55)}]},
{id:'duralugon',abilities:['Light Metal','Heavy Metal',"Nerfs d'Acier"],moveIds:['ironhead','steelbeam','dragonpulse','flashcannon','protect','endure','hyperbeam','facade','sleeptalk','rest','takedown','bodyslam','rockslide','rocktomb','scaryface','doubleedge','brickbreak','stoneedge','irondefense','thunderwave','stealthrock','thunderbolt','thunder','outrage','solarbeam','lightscreen','leer','focusenergy','metalclaw','rocksmash','dragonclaw','breakingswipe','dracometeor','steelroller','slash','mirrorcoat','nightslash','roar','substitute','gyroball','metalburst','gigaimpact','honeclaws','heavyslam','foulplay','round','dragontail','snarl','terablast','dragoncheer','bodypress','attract','darkpulse','laserfocus','reflect','screech','snore','stompingtantrum','swordsdance','stridoson'],
 stages:[
  {name:'Duralugon',types:['acier','dragon'],base:st(70,95,115,120,50,85)}]},
{id:'fantyrm',abilities:['Corps Sain','Infiltration','Corps Maudit'],moveIds:['dragonbreath','astonish','dracometeor','shadowball','dragonpulse','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','sunnyday','bodyslam','takedown','thief','doubleedge','thunderwave','thunderbolt','outrage','thunder','curse','bite','quickattack','infestation','agility','lockon','dragondance','uturn','phantomforce','dragondarts','disable','doubleteam','confuseray','grudge','suckerpunch','substitute','helpinghand','round','dragontail','terablast','brine','assurance','lastresort','dragonrush','doublehit','allyswitch','scald','hex','acrobatics','pounce','dragoncheer','gigaimpact','attract','batonpass','beatup','breakingswipe','dive','dragonclaw','fireblast','flamethrower','fly','hydropump','lightscreen','nightshade','psychicfangs','reflect','snore','solarbeam','steelwing','surf','triattack','willowisp'],
 stages:[
  {name:'Fantyrm',types:['dragon','fantome'],base:st(28,60,30,40,30,82)},
  {name:'Dispareptil',types:['dragon','fantome'],base:st(68,80,50,60,50,102)},
  {name:'Lanssorien',types:['dragon','fantome'],base:st(88,120,75,100,75,142)}]},
// ---- Légendaires de Galar + contenu DLC ----
{id:'zacian',abilities:['Lame Indomptable'],moveIds:['playrough','closecombat','ironhead','moonblast','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','swordsdance','bodyslam','takedown','dig','brickbreak','focusblast','dazzlinggleam','bite','quickattack','slash','metalclaw','crunch','howl','nobleroar','firefang','icefang','thunderfang','steelbeam','substitute','helpinghand','assurance','gigaimpact','psychocut','round','quickguard','retaliate','workup','wildcharge','sacredsword','tailslap','snarl','terablast','behemothblade','agility','airslash','brutalswing','falseswipe','flashcannon','focusenergy','hypervoice','imprison','irondefense','irontail','laserfocus','mistyterrain','poisonjab','psychicfangs','revenge','reversal','scaryface','snore','solarblade','trailblaze'],
 stages:[
  {name:'Zacian',types:['fee'],base:st(92,120,115,80,115,138),forms:{
    epeeRouillee:{name:'Zacian (Épée Sacrée)',types:['fee','acier'],base:st(92,150,115,80,115,148),abilities:['Regard Vif']}
  }}]},
{id:'zamazenta',abilities:['Égide Inflexible'],moveIds:['closecombat','ironhead','bodypress','stoneedge','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','bodyslam','takedown','brickbreak','focusblast','dig','scaryface','reversal','bite','quickattack','slash','metalclaw','crunch','irondefense','howl','moonblast','firefang','icefang','thunderfang','steelbeam','coaching','roar','substitute','helpinghand','metalburst','payback','powerswap','guardswap','gigaimpact','wideguard','heavyslam','round','retaliate','workup','wildcharge','tailslap','snarl','terablast','behemothbash','agility','dazzlinggleam','flashcannon','focusenergy','hypervoice','imprison','irontail','laserfocus','lightscreen','playrough','psychicfangs','reflect','revenge','safeguard','sandstorm','snore','solarbeam','trailblaze'],
 stages:[
  {name:'Zamazenta',types:['combat'],base:st(92,120,115,80,115,138),forms:{
    bouclierRouille:{name:'Zamazenta (Bouclier Royal)',types:['combat','acier'],base:st(92,120,140,80,140,128),abilities:['Regard Vif']}
  }}]},
{id:'ethernatos',abilities:['Pression'],moveIds:['sludgebomb','dynamaxcannon','dragonpulse','poisonjab','flamethrower','protect','endure','hyperbeam','facade','sleeptalk','rest','recover','sunnyday','raindance','takedown','bodyslam','scaryface','shadowball','outrage','toxic','solarbeam','agility','confuseray','cosmicpower','poisontail','dragondance','dracometeor','meteorbeam','substitute','gravity','payback','assurance','gigaimpact','crosspoison','gunkshot','venoshock','sludgewave','round','dragontail','terablast','eternabeam','brutalswing','fireblast','firespin','flashcannon','fly','lightscreen','mysticalfire','reflect','screech','snore','toxicspikes','venomdrench'],
 stages:[
  {name:'Éthernatos',types:['poison','dragon'],base:st(140,85,95,145,95,130)}], branches:[
  // Forme Infinimax (Eternamax) : la forme colossale prise par Éthernatos dans les événements de son
  // histoire officielle. Reste accessible comme forme alternative via le bouton d'évolution de
  // l'éditeur une fois Éthernatos drafté, mais draftable:false l'exclut des candidats proposés au
  // tirage (voir buildFacileCandidates) : elle n'apparaît donc jamais directement sur une carte de draft.
  {name:'Éthernatos Infinimax',types:['poison','dragon'],base:st(255,115,250,125,250,130),abilities:['Pression'],draftable:false}
 ]},
{id:'wushours',abilities:['Attention'],moveIds:['closecombat','protect','endure','facade','sleeptalk','rest','bulkup','takedown','bodyslam','brickbreak','doubleedge','scaryface','dig','zenheadbutt','swordsdance','headbutt','leer','counter','focusenergy','detect','dynamicpunch','rocksmash','focuspunch','aerialace','ironhead','firepunch','icepunch','thunderpunch','coaching','substitute','helpinghand','fling','lowsweep','round','acrobatics','retaliate','workup','terablast','attract','lowkick','megakick','megapunch','metalclaw','revenge','reversal','snore','superpower','uturn'],
 stages:[
  {name:'Wushours',types:['combat'],base:st(60,90,60,53,50,72)}],
 branches:[
  {name:'Shifours (Style Farouche)',types:['combat','tenebres'],base:st(100,130,100,63,60,97),abilities:['Poing Furtif'],extraMoveIds:['wickedblow','darkestlariat','suckerpunch','assurance','aurasphere','beatup','bodypress','crunch','darkpulse','drainpunch','falseswipe','focusblast','foulplay','gigaimpact','irondefense','lashout','payback','poisonjab','roar','rockslide','rocktomb','snarl','stoneedge','swift','taunt','throatchop','trailblaze']},
  {name:'Shifours (Style Aqua)',types:['combat','eau'],base:st(100,130,100,63,60,97),abilities:['Poing Furtif'],extraMoveIds:['surgingstrikes','liquidation','wavecrash','assurance','aurasphere','beatup','bodypress','crunch','darkestlariat','darkpulse','drainpunch','falseswipe','focusblast','foulplay','gigaimpact','irondefense','lashout','payback','poisonjab','roar','rockslide','rocktomb','snarl','stoneedge','suckerpunch','swift','taunt','throatchop','trailblaze','wickedblow']}]},
{id:'zarude',abilities:['Feuille Garde'],moveIds:['crunch','darkestlariat','gigadrain','closecombat','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','swordsdance','sunnyday','takedown','bodyslam','thief','doubleedge','solarbeam','scaryface','rockslide','taunt','dig','knockoff','brickbreak','rocktomb','aerialace','bulletseed','darkpulse','magicalleaf','leer','scratch','bind','vinewhip','thrash','bite','growth','furyswipes','swagger','synthesis','uturn','grassyglide','lashout','roar','substitute','helpinghand','hammerarm','payback','assurance','fling','seedbomb','drainpunch','energyball','gigaimpact','nastyplot','leafstorm','powerwhip','grassknot','lowsweep','round','acrobatics','snarl','terablast','brutalswing','bulkup','encore','focuspunch','grassyterrain','hypervoice','irontail','lowkick','megakick','megapunch','mudshot','petalblizzard','revenge','snore','solarblade','stompingtantrum','superpower','throatchop','trailblaze','jungleheal'],
 stages:[
  {name:'Zarude',types:['tenebres','plante'],base:st(105,120,105,70,95,105)}]},
{id:'regieleki',abilities:['Transistor'],moveIds:['thundershock','risingvoltage','thunderbolt','thunder','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','raindance','takedown','bodyslam','thunderwave','lightscreen','agility','charge','reflect','thrash','explosion','zapcannon','lockon','rapidspin','extremespeed','ancientpower','shockwave','thundercage','substitute','assurance','magnetrise','gigaimpact','chargebeam','electroball','round','acrobatics','voltswitch','electroweb','wildcharge','terablast','bounce','eerieimpulse','electricterrain','screech','selfdestruct','snore','supercellslam'],
 stages:[
  {name:'Régieleki',types:['electrik'],base:st(80,100,50,100,50,200)}]},
{id:'regidrago',abilities:['Mâchoire du Dragon'],moveIds:['dragonbreath','dragonenergy','dragonpulse','outrage','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','takedown','bodyslam','earthquake','dragonclaw','thrash','bite','focusenergy','explosion','twister','crunch','ancientpower','dragondance','firefang','icefang','thunderfang','dracometeor','scaleshot','substitute','hammerarm','earthpower','gigaimpact','round','terablast','dragoncheer','breakingswipe','laserfocus','lightscreen','reflect','reversal','selfdestruct','snore','visegrip'],
 stages:[
  {name:'Régidrago',types:['dragon'],base:st(200,100,50,100,50,80)}]},
{id:'blizzeval',abilities:['Hennissement Glacial'],moveIds:['tackle','icebeam','closecombat','protect','endure','hyperbeam','facade','sleeptalk','rest','blizzard','takedown','bodyslam','doubleedge','icywind','bulldoze','scaryface','taunt','curse','zenheadbutt','swordsdance','stomp','doublekick','thrash','tailwhip','mist','torment','irondefense','lashout','roar','substitute','payback','assurance','gigaimpact','avalanche','heavyslam','round','snarl','iciclecrash','terablast','snowscape','glaciallance','bodypress','crunch','hail','highhorsepower','iciclespear','megahorn','mudshot','outrage','smartstrike','snore','stompingtantrum','superpower','throatchop','trailblaze','uproar'],
 stages:[
  {name:'Blizzeval',types:['glace'],base:st(100,145,130,65,110,30)}]},
{id:'spectreval',abilities:['Hennissement Sinistre'],moveIds:['tackle','shadowball','poltergeist','psychic','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','calmmind','bodyslam','takedown','scaryface','taunt','curse','doubleedge','bulldoze','darkpulse','confuseray','willowisp','stomp','doublekick','thrash','tailwhip','disable','agility','haze','lashout','substitute','payback','assurance','gigaimpact','nastyplot','psychocut','foulplay','round','hex','snarl','terablast','astralbarrage','crunch','drainingkiss','mudshot','nightshade','painsplit','phantomforce','snore','stompingtantrum','uproar'],
 stages:[
  {name:'Spectreval',types:['fantome'],base:st(100,65,60,145,80,130)}]},
{id:'sylveroy',abilities:['Tension'],moveIds:['confusion','psychic','gigadrain','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','calmmind','sunnyday','takedown','lightscreen','zenheadbutt','solarbeam','reflect','skillswap','psychup','futuresight','safeguard','trick','psybeam','scaryface','pound','megadrain','growth','grassyterrain','psychicterrain','lifedew','expandingforce','leechseed','substitute','helpinghand','gravity','powerswap','guardswap','seedbomb','energyball','gigaimpact','trickroom','leafstorm','grassknot','wonderroom','psyshock','magicroom','round','storedpower','allyswitch','healpulse','snarl','terablast','agility','aromatherapy','batonpass','bodypress','bulletseed','drainingkiss','encore','imprison','magicalleaf','metronome','mudshot','payday','pollenpuff','snore','solarblade','speedswap','triattack'],
 stages:[
  {name:'Sylveroy',types:['psy','plante'],base:st(100,80,80,80,80,80),forms:{
    renePartageGlace:{name:'Sylveroy (Monture Glace)',types:['psy','glace'],base:st(100,165,150,85,130,50),abilities:['Cran']},
    renePartageSpectre:{name:'Sylveroy (Monture Spectre)',types:['psy','fantome'],base:st(100,85,80,165,100,150),abilities:['Lévitation']}
  }}]},
// ---- Formes de Galar (lignées séparées et draftables) ----
{id:'miaoussgalar',abilities:['Ramassage','Griffe Solide','Tension'],moveIds:['scratch','ironhead','crunch','protect','endure','hyperbeam','facade','doubleedge','sleeptalk','rest','raindance','sunnyday','takedown','bodyslam','irondefense','flashcannon','brickbreak','stealthrock','dig','taunt','thief','shadowball','thunderbolt','swordsdance','thunder','curse','aerialace','payday','thrash','growl','screech','furyswipes','slash','swagger','metalclaw','fakeout','steelbeam','lashout','flail','spite','nightslash','substitute','helpinghand','gyroball','payback','assurance','fling','seedbomb','xscissor','nastyplot','gunkshot','honeclaws','foulplay','round','retaliate','workup','terablast','metalburst','gigaimpact','heavyslam','chillingwater','covet','amnesia','attract','batonpass','charm','closecombat','darkpulse','endeavor','faketears','falseswipe','hypervoice','irontail','knockoff','metronome','playrough','shadowclaw','snore','throatchop','trailblaze','uproar','uturn','stridoson'],
 stages:[
  {name:'Miaouss de Galar',types:['acier'],base:st(50,65,55,40,40,40)},
  {name:'Berserkatt',types:['acier'],base:st(70,110,100,50,60,50),abilities:['Armurbaston','Griffe Solide',"Esprit d'Acier"]}]},
{id:'ponytagalar',abilities:['Fuite','Voile Pastel','Anticipation'],moveIds:['tackle','psybeam','psychic','dazzlinggleam','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','calmmind','bodyslam','zenheadbutt','takedown','doubleedge','futuresight','confusion','charm','stomp','tailwhip','growl','agility','fairywind','quickattack','megahorn','expandingforce','doublekick','horndrill','thrash','hypnosis','morningsun','substitute','healingwish','round','storedpower','allyswitch','healpulse','wildcharge','gigaimpact','psychocut','trickroom','wonderroom','magicroom','drillrun','attract','batonpass','bounce','highhorsepower','imprison','irontail','lowkick','mistyterrain','mysticalfire','payday','playrough','psychicterrain','smartstrike','snore','swordsdance','throatchop'],
 stages:[
  {name:'Ponyta de Galar',types:['psy'],base:st(50,85,55,65,65,90)},
  {name:'Galopa de Galar',types:['psy','fee'],base:st(65,100,70,80,80,105)}]},
{id:'ramolossgalar',abilities:['Gloutonnerie','Tempo Perso','Régé-Force'],moveIds:['tackle','psybeam','poisonjab','sludgebomb','psychic','shellsidearm','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','calmmind','raindance','sunnyday','shadowball','takedown','bodyslam','zenheadbutt','lightscreen','doubleedge','thunderwave','skillswap','psychup','brickbreak','scaryface','confusion','futuresight','trick','earthquake','focusblast','bulldoze','headbutt','growl','disable','acid','surf','amnesia','curse','yawn','slackoff','waterpulse','withdraw','icefang','icepunch','expandingforce','stomp','bellydrum','block','belch','substitute','helpinghand','brine','avalanche','trickroom','grassknot','wonderroom','psyshock','foulplay','round','storedpower','scald','healpulse','terablast','snowscape','chillingwater','fling','powergem','drainpunch','gigaimpact','nastyplot','gunkshot','venoshock','smackdown','sludgewave','acidspray','razorshell','attract','blizzard','bodypress','brutalswing','dig','dive','fireblast','flamethrower','hail','haze','hydropump','icebeam','icywind','imprison','irondefense','irontail','liquidation','megakick','megapunch','metronome','muddywater','mudshot','payday','psychicterrain','rockblast','safeguard','sandstorm','snore','toxic','toxicspikes','triattack','waterfall','weatherball','whirlpool'],
 stages:[
  {name:'Ramoloss de Galar',types:['psy'],base:st(90,65,65,40,40,15)},
  {name:'Flagadoss de Galar',types:['poison','psy'],base:st(95,100,95,100,70,30),abilities:['Dégainage Rapide','Tempo Perso','Régé-Force']}]},
{id:'canartichogalar',abilities:['Impassible','Querelleur'],moveIds:['peck','closecombat','protect','endure','facade','sleeptalk','rest','swordsdance','sunnyday','bodyslam','brickbreak','doubleedge','poisonjab','knockoff','slam','sandattack','leer','detect','furycutter','rocksmash','leafblade','brutalswing','irondefense','firstimpression','meteorassault','dualwingbeat','counter','quickattack','skyattack','curse','flail','nightslash','grassyglide','coaching','substitute','helpinghand','feint','assurance','bravebird','defog','simplebeam','round','quickguard','retaliate','finalgambit','workup','covet','attract','focusenergy','revenge','snore','solarblade','steelwing','superpower','throatchop'],
 stages:[
  {name:'Canarticho de Galar',types:['combat'],base:st(52,95,55,58,62,55)},
  {name:'Palarticho',types:['combat'],base:st(62,135,95,68,82,65)}]},
{id:'smogogogalar',abilities:['Lévitation','Gaz Inhibiteur','Aqua Surge'],moveIds:['smog','poisongas','sludgebomb','strangesteam','dazzlinggleam','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','takedown','bodyslam','thief','tackle','shadowball','doubleedge','scaryface','taunt','thunderbolt','toxic','thunder','smokescreen','haze','selfdestruct','sludge','explosion','destinybond','heatwave','memento','belch','mistyterrain','fairywind','aromaticmist','mistyexplosion','corrosivegas','substitute','gyroball','payback','assurance','gigaimpact','defog','gunkshot','doublehit','wonderroom','venoshock','sludgewave','acidspray','round','clearsmog','terablast','aromatherapy','attract','brutalswing','curse','darkpulse','fireblast','flamethrower','overheat','painsplit','playrough','psybeam','screech','snore','spite','toxicspikes','uproar','venomdrench','willowisp'],
 stages:[
  {name:'Smogogo de Galar',types:['poison','fee'],base:st(65,90,120,85,70,60)}]},
{id:'mmimegalar',abilities:['Esprit Vital','Anti-Écran','Corps Gel'],moveIds:['psybeam','icebeam','psychic','protect','endure','hyperbeam','facade','sleeptalk','rest','calmmind','raindance','sunnyday','lightscreen','shadowball','bodyslam','reflect','zenheadbutt','thunderwave','skillswap','icywind','thief','brickbreak','futuresight','taunt','thunderbolt','confusion','blizzard','trick','focusblast','pound','doublekick','hypnosis','mimic','safeguard','batonpass','encore','rapidspin','mirrorcoat','roleplay','recycle','teeterdance','suckerpunch','freezedry','mistyterrain','dazzlinggleam','slackoff','faketears','block','icepunch','expandingforce','tripleaxel','confuseray','fakeout','tickle','substitute','helpinghand','payback','fling','copycat','powerswap','guardswap','drainpunch','energyball','gigaimpact','nastyplot','avalanche','iceshard','trickroom','grassknot','powersplit','wonderroom','psyshock','magicroom','foulplay','round','storedpower','allyswitch','afteryou','frostbreath','icespinner','snowscape','chillingwater','attract','charm','hail','haze','iciclespear','irondefense','megakick','megapunch','metronome','psychicterrain','screech','sheercold','snore','solarbeam','stompingtantrum','swagger','thunder','torment','uproar'],
 stages:[
  {name:'M. Mime de Galar',types:['glace','psy'],base:st(50,65,65,90,90,100)},
  {name:'M. Glaquette',types:['glace','psy'],base:st(80,85,75,110,100,70),abilities:['Pieds Confus','Anti-Écran','Corps Gel']}]},
{id:'artikodingalar',abilities:['Battant'],moveIds:['psybeam','freezingglare','hurricane','psychic','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','calmmind','raindance','sunnyday','takedown','shadowball','lightscreen','reflect','agility','airslash','uturn','scaryface','fly','skillswap','futuresight','doubleteam','gust','confusion','hypnosis','recover','dreameater','ancientpower','expandingforce','dualwingbeat','substitute','helpinghand','tailwind','psychoshift','powerswap','guardswap','bravebird','gigaimpact','psychocut','trickroom','psyshock','round','storedpower','allyswitch','terablast','snowscape','aircutter','hypervoice','imprison','mindreader','psychicnoise','snore','steelwing','trick'],
 stages:[
  {name:'Artikodin de Galar',types:['psy','vol'],base:st(90,85,85,125,100,95)}]},
{id:'electhorgalar',abilities:['Acharné'],moveIds:['thunderouskick','closecombat','hurricane','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','bulkup','raindance','sunnyday','takedown','aerialace','brickbreak','doubleedge','scaryface','taunt','agility','uturn','fly','knockoff','reversal','peck','drillpeck','counter','lightscreen','focusenergy','detect','ancientpower','rocksmash','coaching','dualwingbeat','substitute','helpinghand','pluck','tailwind','payback','assurance','bravebird','gigaimpact','lowsweep','round','quickguard','acrobatics','retaliate','terablast','blazekick','bounce','endeavor','lowkick','megakick','revenge','sandstorm','screech','snore','steelwing','stompingtantrum','superpower','throatchop','trailblaze'],
 stages:[
  {name:'Électhor de Galar',types:['combat','vol'],base:st(90,125,90,85,90,100)}]},
{id:'sulfuragalar',abilities:['Furie Ultime'],moveIds:['hurricane','protect','swift','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','takedown','thief','aerialace','taunt','scaryface','airslash','shadowball','agility','uturn','fly','darkpulse','leer','gust','wingattack','skyattack','safeguard','ancientpower','memento','suckerpunch','fierywrath','lashout','dualwingbeat','substitute','helpinghand','tailwind','payback','assurance','bravebird','gigaimpact','nastyplot','foulplay','afteryou','round','hex','acrobatics','snarl','terablast','hypervoice','imprison','painsplit','sandstorm','snore','spite','steelwing'],
 stages:[
  {name:'Sulfura de Galar',types:['tenebres','vol'],base:st(90,85,90,100,125,90)}]},
{id:'corayongalar',abilities:['Armure Rouillée','Corps Maudit'],moveIds:['tackle','astonish','shadowball','ancientpower','stealthrock','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','sunnyday','bodyslam','psychic','rockslide','rocktomb','curse','icywind','calmmind','dig','bulldoze','earthquake','confuseray','icebeam','lightscreen','disable','nightshade','harden','spite','mirrorcoat','grudge','strengthsap','perishsong','meteorbeam','haze','destinybond','waterpulse','burningjealousy','poltergeist','substitute','brine','powergem','earthpower','headsmash','round','scald','hex','gigaimpact','amnesia','attract','blizzard','gigadrain','hail','hydropump','iciclespear','irondefense','leechlife','liquidation','pinmissile','reflect','revenge','rockblast','safeguard','sandstorm','screech','selfdestruct','snore','stompingtantrum','stoneedge','surf','throatchop','whirlpool','willowisp','natureforce'],
 stages:[
  {name:'Corayon de Galar',types:['fantome'],base:st(60,55,100,65,100,30)},
  {name:'Corayôme',types:['fantome'],base:st(60,95,50,145,130,30),abilities:['Armure Rouillée','Corps Fatal']}]},
{id:'zigzatongalar',abilities:['Ramassage','Gloutonnerie','Pied Véloce'],moveIds:['tackle','throatchop','closecombat','protect','swift','endure','hyperbeam','facade','doubleedge','sleeptalk','rest','raindance','sunnyday','takedown','thief','bodyslam','shadowball','dig','taunt','brickbreak','thunderbolt','scaryface','thunderwave','icebeam','thunder','knockoff','blizzard','icywind','hypervoice','sandattack','headbutt','pinmissile','leer','counter','lick','babydolleyes','furyswipes','nightslash','submission','crosschop','obstruct','firepunch','icepunch','thunderpunch','lashout','substitute','helpinghand','payback','assurance','fling','seedbomb','gunkshot','grassknot','round','quickguard','retaliate','workup','snarl','partingshot','switcheroo','gigaimpact','honeclaws','xscissor','crosspoison','attract','bodypress','bulkup','faketears','focusenergy','irondefense','irontail','lowkick','megakick','megapunch','mudshot','revenge','reversal','screech','shadowclaw','snore','stompingtantrum','surf','trick','whirlpool'],
 stages:[
  {name:'Zigzaton de Galar',types:['tenebres','normal'],base:st(38,30,41,30,41,60)},
  {name:'Linéon de Galar',types:['tenebres','normal'],base:st(78,70,61,50,61,100)},
  {name:'Ixon',types:['tenebres','normal'],base:st(93,90,101,60,81,95),abilities:['Téméraire','Cran','Acharné']}]},
{id:'darumangalar',abilities:['Agitation','Attention'],moveIds:['tackle','icebeam','protect','endure','hyperbeam','facade','sleeptalk','rest','blizzard','takedown','bodyslam','sunnyday','rockslide','rocktomb','bulldoze','thief','brickbreak','earthquake','dig','focusblast','taunt','zenheadbutt','psychic','stoneedge','ironhead','icepunch','headbutt','thrash','bite','powdersnow','bellydrum','uproar','superpower','icefang','firefang','firepunch','flamewheel','focuspunch','yawn','freezedry','poweruppunch','burningjealousy','lashout','substitute','hammerarm','gyroball','fling','flareblitz','avalanche','grassknot','round','incinerate','workup','payback','gigaimpact','iciclecrash','attract','bodypress','bulkup','encore','fireblast','firespin','flamethrower','focusenergy','heatwave','irondefense','megakick','megapunch','overheat','reversal','snore','solarbeam','uturn','willowisp'],
 stages:[
  {name:'Daruman de Galar',types:['glace'],base:st(70,90,45,15,45,50)},
  {name:'Darumacho de Galar',types:['glace'],base:st(105,140,55,30,55,95),abilities:['Instinct Gorille','Mode Zen']}]},
{id:'yamaskgalar',abilities:['Âme Vagabonde'],moveIds:['earthquake','shadowball','stealthrock','protect','endure','hyperbeam','facade','sleeptalk','rest','raindance','rockslide','rocktomb','bulldoze','thief','stoneedge','scaryface','curse','sandstorm','taunt','psychic','zenheadbutt','shadowclaw','slam','disable','nightshade','haze','destinybond','meanlook','astonish','craftyshield','brutalswing','poltergeist','memento','substitute','payback','energyball','earthpower','nastyplot','trickroom','guardsplit','powersplit','wonderroom','round','allyswitch','hex','powerswap','guardswap','gigaimpact','grassknot','psyshock','amnesia','attract','bodypress','calmmind','confuseray','darkpulse','dragonpulse','faketears','gigadrain','imprison','irondefense','phantomforce','revenge','rockblast','safeguard','sandtomb','selfdestruct','shadowpunch','skillswap','snore','toxicspikes','trick','willowisp'],
 stages:[
  {name:'Tutafeh de Galar',types:['sol','fantome'],base:st(38,55,85,30,65,30)},
  {name:'Tutétékri',types:['sol','fantome'],base:st(58,95,145,50,105,30)}]},
{id:'stunfiskgalar',abilities:['Mimétisme'],moveIds:['tackle','mudshot','earthquake','flashcannon','protect','endure','facade','sleeptalk','rest','raindance','rockslide','rocktomb','bulldoze','dig','sandstorm','stealthrock','stoneedge','irondefense','mudslap','curse','crunch','thunderwave','watergun','fissure','flail','metalclaw','revenge','muddywater','bounce','suckerpunch','snaptrap','icefang','steelbeam','terrainpulse','lashout','bind','counter','spite','painsplit','yawn','astonish','substitute','payback','earthpower','sludgewave','foulplay','round','scald','reflecttype','attract','screech','sludgebomb','snore','stompingtantrum','surf','uproar','stridoson'],
 stages:[
  {name:'Stunfisk de Galar',types:['sol','acier'],base:st(109,81,99,66,84,32)}]},
];
const DEX_NUMBERS_GEN8 = {
  'Ouistempo':810,'Badabouin':811,'Gorythmic':812,
  'Flambino':813,'Lapyro':814,'Pyrobut':815,
  'Larméléon':816,'Arrozard':817,'Lézargus':818,
  'Rongourmand':819,'Rongrigou':820,
  'Minisange':821,'Bleuseille':822,'Corvaillus':823,
  'Larvadar':824,'Coléodôme':825,'Astronelle':826,
  'Goupilou':827,'Roublenard':828,
  'Tournicoton':829,'Blancoton':830,
  'Moumouton':831,'Moumouflon':832,
  'Khélocrok':833,'Torgamord':834,
  'Voltoutou':835,'Fulgudog':836,
  'Charbi':837,'Wagomine':838,'Monthracite':839,
  'Verpom':840,'Pomdrapi':841,'Dratatin':842,
  'Dunaja':843,'Dunaconda':844,
  'Nigosier':845,
  'Embrochet':846,'Hastacuda':847,
  'Toxizap':848,'Salarsen':849,'Salaquin':849,
  'Grillepattes':850,'Scolocendre':851,
  'Poulpaf':852,'Krakos':853,
  'Théffroi':854,'Polthégeist':855,
  'Bibichut':856,'Chapotus':857,'Sorcilence':858,
  'Grimalin':859,'Fourbelin':860,'Angoliath':861,
  'Ixon':862,
  'Berserkatt':863,
  'Corayôme':864,
  'Palarticho':865,
  'M. Glaquette':866,
  'Tutétékri':867,
  'Crèmy':868,'Charmilly':869,
  'Hexadron':870,
  'Wattapik':871,
  'Frissonille':872,'Beldeneige':873,
  'Dolman':874,
  'Bekaglaçon':875,
  'Wimessir':876,
  'Morpeko':877,
  'Charibari':878,'Pachyradjah':879,
  'Galvagon':880,'Galvagla':881,'Hydragon':882,'Hydragla':883,
  'Duralugon':884,
  'Fantyrm':885,'Dispareptil':886,'Lanssorien':887,
  'Zacian':888,
  'Zamazenta':889,
  'Éthernatos':890,
  'Éthernatos Infinimax':890,
  'Wushours':891,'Shifours (Style Farouche)':892,'Shifours (Style Aqua)':892,
  'Zarude':893,
  'Régieleki':894,
  'Régidrago':895,
  'Blizzeval':896,
  'Spectreval':897,
  'Sylveroy':898,
};
