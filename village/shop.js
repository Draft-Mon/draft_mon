/* ==== Le Pokéshop du Village : achète Potions/Baies/objets stratégiques, avec réduction possible via un boost méta acheté. ==== */
const SHOP_CATEGORIES = [
  {key:'potion', label:phIcon('pill')+' Potions'},
  {key:'baie', label:phIcon('cherries')+' Baies'},
  {key:'strat', label:phIcon('medal')+' Stratégiques'},
  {key:'cle', label:phIcon('key')+' Bracelets'},
  {key:'vendre', label:phIcon('hand-coins')+' Vendre'}
];
// Revente d'un objet du sac (Pokéshop et Marchand Itinérant) : SELL_RATE du prix d'achat de base.
const SELL_RATE = 0.6;
function sellPrice(key){ return Math.round(ITEMS[key].price * SELL_RATE); }
// Vend un exemplaire de l'objet (uniquement ceux du sac, pas ceux tenus par un Pokémon) puis rafraîchit le panneau appelant.
function sellItem(key, rerender){
  if(!(bag[key]>0)) return;
  bag[key]--;
  money += sellPrice(key);
  refreshVillageMoney();
  saveGame();
  rerender();
  setVillageMsg(`${phIcon('check')} ${ITEMS[key].name} vendu pour ${sellPrice(key)} ${phIcon('coins')} !`);
}
// Bouton "Vendre" d'une ligne d'objet (grisé si le sac n'en contient pas).
function sellBtnHTML(key){
  const owned = bag[key]||0;
  return `<button class="btn secondary sellBtn" data-key="${key}" ${owned>0?'':'disabled'} style="width:auto;flex-shrink:0;min-height:0;padding:6px 10px;font-size:10px;white-space:nowrap;" title="Vendre un exemplaire">Vendre ${sellPrice(key)} ${phIcon('coins')}</button>`;
}
// Affiche le Pokéshop (onglets de catégorie + liste d'objets achetables, prix réduit si un boost de fidélité est acheté).
function renderPokeshopPanel(){
  const wrap = document.getElementById('villagePanelContent');
  wrap.innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--line);border-radius:4px;padding:14px;">
      <div id="shopTabs" style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;"></div>
      <div id="shopList" style="display:flex;flex-direction:column;gap:8px;max-height:340px;overflow-y:auto;"></div>
      <div class="dex-rate" id="villageMsg" style="margin-top:10px;color:var(--good);text-align:center;"></div>
    </div>`;
  const tabs = document.getElementById('shopTabs');
  SHOP_CATEGORIES.forEach(cat=>{
    const btn = document.createElement('button');
    btn.className = 'btn secondary' + (shopCategory===cat.key ? ' diff-active' : '');
    btn.style.cssText = 'padding:6px 10px;font-size:9px;flex:1;';
    btn.innerHTML = cat.label;
    btn.onclick = ()=>{ shopCategory = cat.key; renderPokeshopPanel(); };
    tabs.appendChild(btn);
  });
  const list = document.getElementById('shopList');
  const discount = metaShopDiscount();
  // Onglet "Vendre" : tout ce que contient le sac (y compris les objets du Marchand), sans bouton d'achat.
  const selling = shopCategory==='vendre';
  const shown = Object.entries(ITEMS).filter(([k,it])=> selling ? (bag[k]||0)>0 : it.category===shopCategory);
  if(selling && !shown.length) list.innerHTML = `<div style="font-size:10px;color:var(--text-dim);text-align:center;padding:10px;">Ton sac est vide.</div>`;
  shown.forEach(([key, item])=>{
    const owned = bag[key]||0;
    const price = Math.round(item.price * (1 - discount));
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px;background:#140F0A;border:1px solid var(--line);border-radius:3px;';
    row.innerHTML = `
      <div style="font-size:22px;">${itemIconHTML(key, 28)}</div>
      <div style="flex:1;">
        <div style="font-size:11px;color:var(--text-main);"><b>${item.name}</b> <span style="color:var(--text-dim);">(possédé : ${owned})</span></div>
        <div style="font-size:9px;color:var(--text-dim);line-height:1.4;">${item.desc}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;align-items:stretch;">
        ${selling ? '' : `<button class="btn secondary buyBtn" data-key="${key}" ${item.kind==='key' && owned>0 ? 'disabled' : ''} style="width:auto;flex-shrink:0;min-height:0;padding:6px 10px;font-size:10px;white-space:nowrap;">${price} ${phIcon('coins')}${discount>0?` <span style="text-decoration:line-through;opacity:.5;font-size:8px;">${item.price}</span>`:''}</button>`}
        ${sellBtnHTML(key)}
      </div>
    `;
    list.appendChild(row);
  });
  list.querySelectorAll('.buyBtn').forEach(btn=>{
    btn.onclick = ()=>{
      const key = btn.dataset.key;
      const item = ITEMS[key];
      const price = Math.round(item.price * (1 - metaShopDiscount()));
      if(item.kind==='key' && (bag[key]||0)>0) return; // un objet clé ne s'achète qu'une fois
      if(money < price){ setVillageMsg("Pas assez d'argent !"); return; }
      money -= price;
      bag[key] = (bag[key]||0)+1;
      refreshVillageMoney();
      saveGame();
      renderPokeshopPanel();
      setVillageMsg(`${phIcon('check')} ${item.name} acheté !`);
    };
  });
  list.querySelectorAll('.sellBtn').forEach(btn=>{
    btn.onclick = ()=> sellItem(btn.dataset.key, renderPokeshopPanel);
  });
}

