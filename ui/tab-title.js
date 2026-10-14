/* ==== Titre de l'onglet du navigateur selon l'écran affiché (étage de la Tour, Campement, Pokédex,
   Builder d'équipe...). Le détail vient en premier pour rester lisible quand l'onglet est étroit, et
   l'accueil affiche juste "Draft Mon". Suit le même principe que ui/music.js : un MutationObserver
   détecte les changements d'écran (classe .hidden des .panel) et le changement d'étage (#floorNum). ==== */
const TAB_TITLE_BASE = 'Draft Mon';
const TAB_TITLES = {
  screenMenu: ()=> '',
  screenDex: ()=> 'Pokédex',
  screenTeamBuilder: ()=> "Builder d'équipe",
  screenDraft: ()=> 'Draft',
  screenBuilder: ()=> 'Équipe',
  screenTower: ()=> `Étage ${towerFloor}`,
  screenBattle: ()=> `Étage ${towerFloor} · Combat`,
  screenEvent: ()=> `Étage ${towerFloor} · Événement`,
  screenVillage: ()=> 'Campement',
  screenEnd: ()=> 'Game over'
};

function updateTabTitle(){
  const panel = [...document.querySelectorAll('.panel')].find(p=> !p.classList.contains('hidden'));
  const detail = panel && TAB_TITLES[panel.id] ? TAB_TITLES[panel.id]() : '';
  const title = detail ? `${detail} · ${TAB_TITLE_BASE}` : TAB_TITLE_BASE;
  if(document.title !== title) document.title = title;
}

const tabTitleObserver = new MutationObserver(updateTabTitle);
document.querySelectorAll('.panel').forEach(p=>{
  tabTitleObserver.observe(p, { attributes:true, attributeFilter:['class'] });
});
tabTitleObserver.observe(document.getElementById('floorNum'), { childList:true, characterData:true, subtree:true });
updateTabTitle();
