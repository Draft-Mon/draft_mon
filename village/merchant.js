/* ==== Le Marchand Itinérant du Village (apparaît par chance au Campement, après un Boss ou un
   Mini-Boss) : vend tous les objets de forme spéciaux (Plaques d'Arceus, Mémoires, Cristaux Z,
   Méga-Gemmes, objets légendaires...), organisés en groupes affichés avec un titre. ==== */
const MERCHANT_SPAWN_RATE = 0.08;
const MERCHANT_GROUPS = [
  { label: 'Giratina', tab: phIcon('crown')+' Giratina', keys: ['orbePlatine'] },
  { label: 'Shaymin', tab: phIcon('flower')+' Shaymin', keys: ['gracidee'] },
  { label: 'Ogerpon', tab: phIcon('mask-happy')+' Ogerpon', keys: ['masqueSource','masqueBraise','masqueAngle'] },
  { label: 'Motisma', tab: phIcon('plug')+' Motisma', keys: ['appareilChauffe','appareilLavage','appareilFrigo','appareilVentilo','appareilTondeuse'] },
  { label: 'Boréas / Fulguris / Démétéros / Amovénus', tab: phIcon('spiral')+' Forces de la Nature', keys: ['miroirSacre'] },
  { label: 'Arceus', tab: phIcon('diamond')+' Arceus', keys: ['plaqueFlamme','plaqueHydro','plaqueHerbe','plaqueVolt','plaqueCiel','plaqueToxicite','plaqueTerre','plaqueInsecte','plaquePoing','plaqueGlace','plaqueEsprit','plaqueFantome','plaqueRoc','plaqueDraco','plaqueFer','plaqueOmbre'] },
  { label: 'Genesect (Techno-Buster)', tab: phIcon('dna')+' Genesect', keys: ['moduleChoc','modulePyro','moduleCryo','moduleAqua'] },
  { label: 'Méga Gemme', tab: phIcon('diamond')+' Méga Gemme', keys: ['venusaurite','charizarditeX','charizarditeY','blastoisite','kangaskhanite','gyaradosite','mewtwonitey','scizorite','gardevoirite','garchompite','lucarionite','metagrossite','absolite','flagadossite','camerouptite','dardargnite','branettite','mysdibulite','pharampite','altarite','tyranocivite','roucarnagite','elecsprintite','demolossite','nanmeouite','lockpinite','tenefixite','sharpedite','scarhinoite','pteraite','alakazamite','oniglalite','scarabruite','galekingite','gallamite','drattakite','ectoplasmite','charminite','blizzarite','steelixite','mewtwonitex','sceptilite','blazikenite','swampertite','latiasite','latiosite','diancite'] },
  { label: 'Cristaux Z', tab: phIcon('lightning')+' Cristaux Z', keys: ['zCrystalNormal','zCrystalCombat','zCrystalVol','zCrystalPoison','zCrystalSol','zCrystalRoche','zCrystalInsecte','zCrystalFantome','zCrystalAcier','zCrystalFeu','zCrystalEau','zCrystalPlante','zCrystalElectrik','zCrystalPsy','zCrystalGlace','zCrystalDragon','zCrystalTenebres','zCrystalFee'] },
  { label: 'Necrozma', tab: phIcon('sparkle')+' Necrozma', keys: ['prismeCouchant','prismeAurore','ultranecrozium'] },
  { label: 'Mémoires (Silvallié)', tab: phIcon('floppy-disk')+' Mémoires', keys: ['memoireCombat','memoireVol','memoirePoison','memoireSol','memoireRoche','memoireInsecte','memoireFantome','memoireAcier','memoireFeu','memoireEau','memoirePlante','memoireElectrik','memoirePsy','memoireGlace','memoireDragon','memoireTenebres','memoireFee'] },
  { label: 'Légendaires de Galar', tab: phIcon('sword')+' Galar', keys: ['epeeRouillee','bouclierRouille','parcheminTenebres','parcheminAqua','renePartageGlace','renePartageSpectre'] },
  { label: 'Gigamax', tab: phIcon('circle')+' Gigamax', keys: ['facteurGigamax'] },
  { label: 'Téracristallisation', tab: phIcon('diamond')+' Tera', keys: ['orbeTera'] },
  { label: 'Méga Gemme (Pokémon Légendes Z-A)', tab: phIcon('sparkle')+' Méga Z-A', keys: ['dragoninite','victreebelite','clefablite','starminite','meganiumite','feraligite','skarmorite','froslassite','emboarite','excadrite','scolipite','scraftinite','eelektrossite','chandelurite','chesnaughtite','delphoxite','greninjite','pyroarite','floettite','barbaracite','dragalgite','hawluchanite','malamarite','zygardite','drampanite','falinksite','lucarioniteZ','absoliteZ','garchompiteZ','raichuniteX','raichuniteY','chimechite','staraptite','heatranite','darkranite','golurkite','meowsticite','crabominite','golisopite','magearnite','zeraorite','scovillainite','glimmoranite','tatsugirinite','baxcalibrite'] }
];
// Affiche la boutique du Marchand Itinérant : un onglet par groupe d'objets spéciaux (comme le
// Pokéshop), pour que le catalogue entier reste accessible sans scroll interminable.
function renderMerchantPanel(){
  if(merchantCategory<0 || merchantCategory>=MERCHANT_GROUPS.length) merchantCategory = 0;
  const wrap = document.getElementById('villagePanelContent');
  wrap.innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--line);border-radius:4px;padding:14px;">
      <div style="font-size:10px;color:var(--text-dim);margin-bottom:10px;text-align:center;">Un marchand mystérieux te propose des objets rarissimes pour changer la forme de tes légendaires...</div>
      <div id="merchantTabs" style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;"></div>
      <div style="font-size:9px;color:var(--accent);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">${MERCHANT_GROUPS[merchantCategory].label}</div>
      <div id="merchantList" style="display:flex;flex-direction:column;gap:8px;"></div>
      <div class="dex-rate" id="villageMsg" style="margin-top:10px;color:var(--good);text-align:center;"></div>
    </div>`;
  const tabs = document.getElementById('merchantTabs');
  MERCHANT_GROUPS.forEach((group, idx)=>{
    const btn = document.createElement('button');
    btn.className = 'btn secondary' + (merchantCategory===idx ? ' diff-active' : '');
    btn.style.cssText = 'padding:6px 10px;font-size:9px;flex:1 1 auto;white-space:nowrap;';
    btn.innerHTML = group.tab || group.label;
    btn.onclick = ()=>{ merchantCategory = idx; renderMerchantPanel(); };
    tabs.appendChild(btn);
  });
  const list = document.getElementById('merchantList');
  MERCHANT_GROUPS[merchantCategory].keys.forEach(key=>{
    const item = ITEMS[key];
    const owned = bag[key]||0;
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px;background:#140F0A;border:1px solid var(--line);border-radius:3px;';
    row.innerHTML = `
      <div style="font-size:22px;">${itemIconHTML(key, 28)}</div>
      <div style="flex:1;">
        <div style="font-size:11px;color:var(--text-main);"><b>${item.name}</b> <span style="color:var(--text-dim);">(possédé : ${owned})</span></div>
        <div style="font-size:9px;color:var(--text-dim);line-height:1.4;">${item.desc}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;align-items:stretch;">
        <button class="btn secondary merchantBuyBtn" data-key="${key}" style="width:auto;flex-shrink:0;min-height:0;padding:6px 10px;font-size:10px;white-space:nowrap;">${item.price} ${phIcon('coins')}</button>
        ${sellBtnHTML(key)}
      </div>
    `;
    list.appendChild(row);
  });
  list.querySelectorAll('.merchantBuyBtn').forEach(btn=>{
    btn.onclick = ()=>{
      const key = btn.dataset.key;
      const item = ITEMS[key];
      if(money < item.price){ setVillageMsg("Pas assez d'argent !"); return; }
      money -= item.price;
      bag[key] = (bag[key]||0)+1;
      refreshVillageMoney();
      saveGame();
      renderMerchantPanel();
      setVillageMsg(`${phIcon('check')} ${item.name} acheté !`);
    };
  });
  list.querySelectorAll('.sellBtn').forEach(btn=>{
    btn.onclick = ()=> sellItem(btn.dataset.key, renderMerchantPanel);
  });
}
document.getElementById('villageMerchantBtn').onclick = ()=>{ merchantCategory = 0; renderMerchantPanel(); };
