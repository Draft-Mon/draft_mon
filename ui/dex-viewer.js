/* ==== SOMMAIRE ====
   Le Pokédex consultable (écran Dex) : grille de toutes les espèces/formes/branches avec filtres
   (recherche, type, rareté, lignées boostées par affinité). Sert aussi d'écran de sélection en mode
   développeur. Repères :
   - L.10-16 : rarityKey — catégorie de rareté utilisée par le filtre (distinct de rarityInfo)
   - renderDex — construit la grille filtrée (une carte par stade/branche de chaque lignée), avec un
     indicateur de niveau d'affinité sur chaque carte boostée et le compteur de lignées boostées
   - dexAffinityPipsHTML — les 5 pastilles de niveau d'affinité, réutilisées carte + fiche détail
   - filtres (listes d'options type/rareté + les menus déroulants + réinitialisation)
   - openDexDetail : fenêtre de détail d'une carte (stats, talents, affinité, chaîne d'évolution, movepool)
==== */
function rarityKey(line){
  if(LEGENDARY_IDS.includes(line.id)) return 'legendaire';
  if(FABULEUX_IDS.includes(line.id)) return 'fabuleux';
  if(PSEUDO_IDS.includes(line.id)) return 'pseudo';
  const bst = lineFinalBST(line);
  if(bst>=BST_RARE_THRESHOLD) return 'rare';
  if(bst>=BST_PEU_COMMUN_THRESHOLD) return 'peucommun';
  return 'commun';
}
// Regroupe les faiblesses/résistances/immunités d'un ou deux types contre les 18 types offensifs (fiche détail du Dex).
function typeMatchupGroups(types){
  const groups = {4:[], 2:[], 0.5:[], 0.25:[], 0:[]};
  Object.keys(TYPE_COLOR).forEach(t=>{
    const mult = getMult(t, types);
    if(groups[mult]) groups[mult].push(t); else if(mult===0) groups[0].push(t);
  });
  return groups;
}
// Affiche les groupes faiblesse/résistance/immunité (une ligne de badges de type par groupe non vide).
function typeMatchupHTML(types){
  const g = typeMatchupGroups(types);
  const row = (label, list) => list.length ? `<div style="margin-bottom:6px;"><span style="font-size:9px;color:var(--text-dim);display:block;margin-bottom:3px;">${label}</span><div class="types-row" style="justify-content:flex-start;">${list.map(t=>typeTagHTML(t)).join('')}</div></div>` : '';
  return `${row('×4 Faible', g[4])}${row('×2 Faible', g[2])}${row('×0.5 Résiste', g[0.5])}${row('×0.25 Résiste', g[0.25])}${row('Immunisé', g[0])}`;
}
// Pendant offensif de typeMatchupHTML : ce que les types du Pokémon (ses capacités STAB) donnent contre
// chacun des 18 types en défense, en gardant pour chaque cible le meilleur de ses deux types.
function typeOffenseHTML(types){
  const groups = {2:[], 0.5:[], 0:[]};
  Object.keys(TYPE_COLOR).forEach(d=>{
    const best = Math.max(...types.map(t=>getMult(t, [d])));
    if(groups[best]) groups[best].push(d);
  });
  const row = (label, list) => list.length ? `<div style="margin-bottom:6px;"><span style="font-size:9px;color:var(--text-dim);display:block;margin-bottom:3px;">${label}</span><div class="types-row" style="justify-content:flex-start;">${list.map(t=>typeTagHTML(t)).join('')}</div></div>` : '';
  return `${row('×2 Super efficace', groups[2])}${row('×0.5 Peu efficace', groups[0.5])}${row('Sans effet', groups[0])}` || '<span style="font-size:9px;color:var(--text-dim);">Neutre contre tous les types.</span>';
}
// Les 5 pastilles de niveau d'affinité d'une lignée (pleines jusqu'au niveau actuel), avec le
// multiplicateur de tirage en info-bulle. `size` en px (plus petit sur la carte, plus grand en fiche détail).
function dexAffinityPipsHTML(lineId, size){
  const lvl = affinityLevel(lineId);
  const px = size || 10;
  const pips = Array.from({length:AFFINITY_MAX}).map((_,i)=>
    `<span style="font-size:${px}px;color:${i<lvl?'var(--accent)':'var(--line-bright)'};">${phIcon('heart')}</span>`
  ).join('');
  return `<span title="Affinité ×${affinityMultiplier(lineId).toFixed(1)}" style="display:inline-flex;gap:1px;">${pips}</span>`;
}

// Construit la grille du Dex : une carte par stade normal + par branche de chaque lignée,
// filtrée selon dexFilters ; en mode développeur, les cartes deviennent cliquables pour la sélection libre.
function renderDex(){
  const grid = document.getElementById('dexGrid');
  grid.innerHTML='';
  let count = 0;
  const boostedLines = new Set();

  LINES.forEach(line=>{
    if(affinityLevel(line.id)>0) boostedLines.add(line.id);
    const allStages = [
      ...line.stages.map((sp,i)=>({sp,stageIdx:i,isBranch:false,branchIdx:null})),
      ...(line.branches ? line.branches.map((sp,bi)=>({sp,stageIdx:null,isBranch:true,branchIdx:bi})) : [])
    ];
    allStages.forEach(({sp: baseSp, stageIdx, isBranch, branchIdx})=>{
      // Chaque espèce est suivie de ses Méga-Évolutions (formes liées à une Méga-Gemme) puis, pour la
      // forme finale d'une lignée de GIGAMAX_LINES, de sa forme Gigamax : des cartes à part entière avec
      // leur propre rareté "Méga"/"Gigamax", jamais proposées au draft (ce ne sont pas des lignées).
      const isFinalForm = isBranch || stageIdx===line.stages.length-1;
      const variants = [{kind:'base', sp:baseSp}];
      Object.keys(baseSp.forms||{}).filter(k=>(ITEMS[k] && ITEMS[k].megaStone) || k==='dragonascent').forEach(k=> variants.push({kind:'mega', formKey:k, sp:baseSp.forms[k]}));
      const gmaxId = (isFinalForm && typeof GIGAMAX_LINES!=='undefined' && GIGAMAX_LINES[line.id]) ? GIGAMAX_SPRITE_IDS[baseSp.name] : null;
      if(gmaxId) variants.push({kind:'gigamax', formKey:'gigamax', spriteId:gmaxId, sp:{name:`${baseSp.name} Gigamax`, types:baseSp.types, base:baseSp.base}});
      variants.forEach(({kind, formKey, spriteId, sp})=>{
      if(dexFilters.search && !(sp.name+' '+I18N.name(sp.name)).toLowerCase().includes(dexFilters.search.toLowerCase())) return;
      if(dexFilters.type && !sp.types.includes(dexFilters.type)) return;
      if(dexFilters.type2 && !sp.types.includes(dexFilters.type2)) return;
      // Une branche non-draftable (ex. Éthernatos Infinimax) n'est jamais une rareté en soi : elle
      // partage juste la rareté de sa lignée, sauf si elle est bloquée au tirage (voir buildFacileCandidates),
      // auquel cas elle affiche "Injouable" à la place (uniquement accessible via l'éditeur).
      const isUndraftableBranch = isBranch && baseSp.draftable===false;
      if(dexFilters.rarity){
        const key = kind!=='base' ? kind : (isUndraftableBranch ? 'injouable' : rarityKey(line));
        if(key !== dexFilters.rarity) return;
      }
      if(dexFilters.boosted && affinityLevel(line.id)<=0) return;

      const rarity = kind==='mega' ? {label:'Méga', css:'rarity-mega'}
        : kind==='gigamax' ? {label:'Gigamax', css:'rarity-gigamax'}
        : isUndraftableBranch ? {label:'Injouable', css:'rarity-injouable'} : rarityInfo(line);
      let rateText;
      if(kind==='mega'){
        rateText = formKey==='dragonascent'
          ? `Non draftable — Méga-Évolution de ${baseSp.name} en combat (s'il connaît ${MOVES.dragonascent.name})`
          : `Non draftable — Méga-Évolution de ${baseSp.name} en combat (objet tenu : ${ITEMS[formKey].name})`;
      } else if(kind==='gigamax'){
        rateText = `Non draftable — forme Gigamax de ${baseSp.name} en combat (objet tenu : ${ITEMS.facteurGigamax.name})`;
      } else if(isUndraftableBranch){
        rateText = `Non draftable — obtenue uniquement en faisant évoluer ${line.stages[0].name} depuis l'éditeur`;
      } else if(isBranch){
        rateText = `Forme à embranchement — obtenue en draft (mode Facile) ou en faisant évoluer ${line.stages[0].name}`;
      } else if(stageIdx===0){
        rateText = `Taux d'apparition en draft : ${appearanceRate(line, stageIdx).toFixed(2)}%`;
      } else {
        rateText = `Taux en draft direct : ${appearanceRate(line, stageIdx).toFixed(2)}% — ou en évoluant`;
      }

      const card = document.createElement('div');
      card.className='dex-card';
      card.innerHTML = `
        <span class="rarity-badge ${rarity.css}">${rarity.label}</span>
        <div class="emoji">${getSpriteHTML(kind==='gigamax' ? baseSp.name : sp.name, null, 'front', false, false, spriteId)}</div>
        <div class="pname">${sp.name}</div>
        <div class="types-row">${sp.types.map(t=>typeTagHTML(t)).join('')}</div>
        <div class="stat-line">PV ${sp.base.hp} · Atq ${sp.base.atk} · Déf ${sp.base.def}</div>
        <div class="stat-line">AtqSp ${sp.base.spa} · DéfSp ${sp.base.spd} · Vit ${sp.base.spe}</div>
        <div class="dex-rate">${rateText}</div>
        ${affinityLevel(line.id)>0 ? `<div style="margin-top:4px;">${dexAffinityPipsHTML(line.id)}</div>` : ''}
      `;
      // Comportement par défaut : ouvre la fiche détail (voir openDexDetail). En mode développeur, le hook
      // peut le remplacer (sélection libre d'équipe) — mais seulement quand il le veut vraiment, sinon la
      // fiche détail reste disponible même avec les outils de dev chargés.
      card.style.cursor = 'pointer';
      card.onclick = ()=> openDexDetail(line, isBranch ? null : stageIdx, isBranch ? branchIdx : null, kind==='base' ? null : formKey);
      if(window.DEV_HOOKS && kind==='base'){
        const entry = { lineId: line.id, stage: isBranch ? line.stages.length-1 : stageIdx, branch: isBranch ? branchIdx : null };
        window.DEV_HOOKS.decorateDexCard(card, sp, entry);
      }
      grid.appendChild(card);
      count++;
      });
    });
  });

  document.getElementById('dexCount').innerHTML = `${count} Pokémon affichés · ${phIcon('heart')} ${boostedLines.size} lignée${boostedLines.size>1?'s':''} boostée${boostedLines.size>1?'s':''}`;
}

document.getElementById('dexSearch').oninput = (e)=>{ dexFilters.search = e.target.value; renderDex(); };

function typeOptionHTML(type, label){
  return `<span class="type-tag t-${type}">${typeIconHTML(type, 11)}${label}</span>`;
}
function rarityOptionHTML(css, label){
  return `<span class="rarity-badge ${css}">${label}</span>`;
}
const DEX_TYPE_OPTIONS = [
  {value:'', label:'Tous les types'},
  {value:'normal', label:'Normal'},{value:'feu', label:'Feu'},{value:'eau', label:'Eau'},
  {value:'plante', label:'Plante'},{value:'electrik', label:'Electrik'},{value:'vol', label:'Vol'},
  {value:'poison', label:'Poison'},{value:'sol', label:'Sol'},{value:'insecte', label:'Insecte'},
  {value:'combat', label:'Combat'},{value:'glace', label:'Glace'},{value:'psy', label:'Psy'},
  {value:'fantome', label:'Fantôme'},{value:'roche', label:'Roche'},{value:'dragon', label:'Dragon'},
  {value:'acier', label:'Acier'},{value:'tenebres', label:'Ténèbres'},{value:'fee', label:'Fée'}
].map(o=> o.value ? {...o, html: typeOptionHTML(o.value, o.label)} : o);
const DEX_TYPE_OPTIONS_2 = DEX_TYPE_OPTIONS.map(o=> o.value ? o : {...o, label:'2ème type (optionnel)'});
const DEX_RARITY_OPTIONS = [
  {value:'', label:'Toutes raretés'},
  {value:'commun', label:'Commun', css:'rarity-commun'},{value:'peucommun', label:'Peu Commun', css:'rarity-peucommun'},
  {value:'rare', label:'Rare', css:'rarity-rare'},{value:'pseudo', label:'Pseudo-légendaire', css:'rarity-pseudo'},
  {value:'legendaire', label:'Légendaire', css:'rarity-legendaire'},{value:'fabuleux', label:'Fabuleux', css:'rarity-fabuleux'},
  {value:'injouable', label:'Injouable', css:'rarity-injouable'},
  {value:'mega', label:'Méga', css:'rarity-mega'},{value:'gigamax', label:'Gigamax', css:'rarity-gigamax'}
].map(o=> o.value ? {...o, html: rarityOptionHTML(o.css, o.label)} : o);
// Affiche le menu déroulant de filtre par type principal.
function renderDexTypeFilter(){
  const c = document.getElementById('dexTypeFilter');
  c.innerHTML = '';
  c.appendChild(createCustomSelect({
    options: DEX_TYPE_OPTIONS, value: dexFilters.type,
    onChange: (val)=>{ dexFilters.type = val; renderDex(); }
  }));
}
// Affiche le menu déroulant de filtre par second type (optionnel).
function renderDexTypeFilter2(){
  const c = document.getElementById('dexTypeFilter2');
  c.innerHTML = '';
  c.appendChild(createCustomSelect({
    options: DEX_TYPE_OPTIONS_2, value: dexFilters.type2,
    onChange: (val)=>{ dexFilters.type2 = val; renderDex(); }
  }));
}
// Affiche le menu déroulant de filtre par rareté.
function renderDexRarityFilter(){
  const c = document.getElementById('dexRarityFilter');
  c.innerHTML = '';
  c.appendChild(createCustomSelect({
    options: DEX_RARITY_OPTIONS, value: dexFilters.rarity,
    onChange: (val)=>{ dexFilters.rarity = val; renderDex(); }
  }));
}
renderDexTypeFilter();
renderDexTypeFilter2();
renderDexRarityFilter();
// Bouton "Boostées" (icône cœur) : bascule l'affichage entre toutes les lignées et seulement celles avec de l'affinité.
function refreshDexBoostedFilterBtn(){
  document.getElementById('dexBoostedFilter').classList.toggle('diff-active', dexFilters.boosted);
}
document.getElementById('dexBoostedFilter').onclick = ()=>{
  dexFilters.boosted = !dexFilters.boosted;
  refreshDexBoostedFilterBtn();
  renderDex();
};
refreshDexBoostedFilterBtn();
document.getElementById('dexResetFilter').onclick = ()=>{
  dexFilters = {search:'', type:'', type2:'', rarity:'', boosted:false};
  document.getElementById('dexSearch').value = '';
  renderDexTypeFilter();
  renderDexTypeFilter2();
  renderDexRarityFilter();
  refreshDexBoostedFilterBtn();
  renderDex();
};

// Couleur de la barre de stat de base selon sa valeur (même code couleur que l'éditeur d'équipe).
function dexStatBarColor(val){
  if(val>=150) return '#6F35FC';
  if(val>=110) return '#EE8130';
  if(val>=80)  return '#7AC74C';
  if(val>=50)  return '#F7D02C';
  return '#C22E28';
}
function dexStatBarHTML(label, val){
  const pct = Math.min(100, Math.round(val/255*100));
  return `<div class="stat-bar-row">
    <span class="stat-bar-label">${label}</span>
    <span class="stat-bar-val">${val}</span>
    <div class="stat-bar-track"><div class="stat-bar-fill" style="width:${pct}%;background:${dexStatBarColor(val)};"></div></div>
  </div>`;
}
// Fenêtre de détail d'une carte du Dex : sprite (avec aperçu shiny et, s'il existe, Méga/Gigamax),
// stats de base, talents (avec description), chaîne d'évolution complète de la lignée (cliquable
// pour naviguer d'un stade/branche à l'autre) et movepool complet (recherche + Physiques/Spéciales/Statut).
// `initialForm` (optionnel) ouvre directement la fiche sur une forme alternative : clé de Méga-Gemme
// ou 'gigamax' (cartes Méga/Gigamax de la grille du Dex).
function openDexDetail(line, stageIdx, branchIdx, initialForm){
  const isBranch = branchIdx!==null && branchIdx!==undefined;
  const member = { lineId: line.id, stage: isBranch ? line.stages.length-1 : stageIdx, branch: isBranch ? branchIdx : null };
  const sp = speciesOf(member);
  const baseAbilities = abilitiesFor(member);
  const movepool = movepoolFor(member);
  const physMoves = movepool.filter(id=>MOVES[id] && MOVES[id].cat==='phys').sort((a,b)=>(MOVES[b].power||0)-(MOVES[a].power||0));
  const specMoves = movepool.filter(id=>MOVES[id] && MOVES[id].cat==='spec').sort((a,b)=>(MOVES[b].power||0)-(MOVES[a].power||0));
  const statusMoves = movepool.filter(id=>MOVES[id] && MOVES[id].cat==='status');

  // Formes alternatives consultables (aperçu uniquement, ne change pas la lignée réellement affichée) :
  // chaque Méga-Évolution propre à cette espèce (sp.forms), et sa forme Gigamax si la lignée en a une
  // (GIGAMAX_LINES) et qu'on regarde bien une forme finale (comme dans les vrais jeux).
  const megaKeys = Object.keys(sp.forms || {});
  const isFinalForm = isBranch || stageIdx === line.stages.length-1;
  const gigamaxSpriteId = (isFinalForm && typeof GIGAMAX_LINES!=='undefined' && GIGAMAX_LINES[line.id]) ? GIGAMAX_SPRITE_IDS[sp.name] : null;

  const overlay = document.createElement('div');
  overlay.className = 'patchnotes-overlay';

  const chainEntries = [
    ...line.stages.map((s,i)=>({sp:s, onClick:()=>openDexDetail(line, i, null), current: !isBranch && i===stageIdx})),
    ...(line.branches ? line.branches.map((b,i)=>({sp:b, onClick:()=>openDexDetail(line, null, i), current: isBranch && i===branchIdx})) : [])
  ];
  const chainHTML = chainEntries.map((e,i)=>`
    ${i>0 && !(line.branches && i===line.stages.length) ? '<span class="dex-chain-arrow">→</span>' : (i===line.stages.length && line.branches ? '<span class="dex-chain-arrow">⑂</span>' : '')}
    <button class="dex-chain-node${e.current?' current':''}" data-idx="${i}">
      <span style="width:34px;height:34px;display:block;">${getSpriteHTML(e.sp.name, null)}</span>
      <span class="dex-chain-name">${e.sp.name}</span>
    </button>`).join('');

  const moveRowHTML = id=>{
    const mv = MOVES[id];
    return `<div class="dex-move-row">
      ${typeTagHTML(mv.type, {style:'font-size:8px;padding:2px 7px;flex-shrink:0;'})}
      <span class="dex-move-name">${mv.name}</span>
      <span class="cat-chip cat-${mv.cat}">${mv.cat==='phys'?'Phys':mv.cat==='spec'?'Spéc':'Statut'}</span>
      <span class="dex-move-power">${mv.cat!=='status'?mv.power:'—'}</span>
    </div>`;
  };
  const moveListHTML = `
    <div class="csel-search-wrap" style="position:static;padding:0 0 8px;border-bottom:none;">
      <input type="text" id="dexMoveSearch" class="csel-search" placeholder="Rechercher une attaque...">
    </div>
    <div class="dex-move-list">
      ${physMoves.length ? `<div class="csel-group-label">${phIcon('sword')} Physiques</div>${physMoves.map(moveRowHTML).join('')}` : ''}
      ${specMoves.length ? `<div class="csel-group-label">${phIcon('sparkle')} Spéciales</div>${specMoves.map(moveRowHTML).join('')}` : ''}
      ${statusMoves.length ? `<div class="csel-group-label">${phIcon('spiral')} Statut</div>${statusMoves.map(moveRowHTML).join('')}` : ''}
    </div>`;

  // État de l'aperçu (forme + shiny), indépendant de ce qui est réellement affiché ailleurs (Dex/équipe) :
  // ce n'est qu'une consultation, rien n'est enregistré.
  let viewForm = 'base'; // 'base' | 'gigamax' | une clé de sp.forms
  if(initialForm==='gigamax' ? gigamaxSpriteId : megaKeys.includes(initialForm)) viewForm = initialForm;
  let viewShiny = false;
  function resolveView(){
    if(viewForm==='gigamax') return { name:`${sp.name} Gigamax`, types:sp.types, base:sp.base, abilities:baseAbilities, spriteId:gigamaxSpriteId, spriteName:sp.name };
    if(viewForm!=='base' && sp.forms && sp.forms[viewForm]){
      const f = sp.forms[viewForm];
      return { name:f.name, types:f.types, base:f.base, abilities:f.abilities||baseAbilities, spriteId:null, spriteName:f.name };
    }
    return { name:sp.name, types:sp.types, base:sp.base, abilities:baseAbilities, spriteId:null, spriteName:sp.name };
  }
  function formToggleHTML(){
    if(!megaKeys.length && !gigamaxSpriteId) return '';
    const btn = (key, label, icon) => `<button class="btn secondary dex-form-btn${viewForm===key?' active':''}" data-form="${key}" style="padding:5px 10px;font-size:9px;width:auto;">${icon} ${label}</button>`;
    return `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">
      ${btn('base', sp.name, '◆')}
      ${megaKeys.map(k=>btn(k, sp.forms[k].name, phIcon('diamond'))).join('')}
      ${gigamaxSpriteId ? btn('gigamax', 'Gigamax', phIcon('circle')) : ''}
    </div>`;
  }
  // Section Affinité de la fiche : niveau (5 pastilles), multiplicateur, taux d'apparition avant/après
  // boost, et la progression des bonbons déjà investis vers le prochain palier (voir meta/affinity.js).
  function affinityDetailHTML(){
    const lineId = line.id;
    const lvl = affinityLevel(lineId);
    const mult = affinityMultiplier(lineId);
    let boostedRate;
    if(isBranch){
      const b = line.branches[branchIdx];
      const w = b.draftable===false ? 0 : (b.rarityWeight!==undefined ? b.rarityWeight : lineWeight(line)) * mult;
      boostedRate = facileAppearanceRate(w);
    } else {
      boostedRate = appearanceRate(line, stageIdx);
    }
    const baseRate = mult>0 ? boostedRate/mult : boostedRate;
    const cost = affinityNextCost(lineId);
    const progress = affinityProgressFor(lineId);
    const barPct = cost ? Math.min(100, Math.round(progress/cost*100)) : 100;
    return `
      <div class="editor-section">
        <div class="editor-section-title">Affinité</div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          ${dexAffinityPipsHTML(lineId, 16)}
          <span style="font-size:12px;color:var(--accent);font-weight:700;">×${mult.toFixed(1)}</span>
        </div>
        <div style="font-size:10px;color:var(--text-dim);margin-bottom:8px;">Taux d'apparition : ${baseRate.toFixed(2)}% → <b style="color:var(--text-main);">${boostedRate.toFixed(2)}%</b></div>
        ${cost ? `
          <div class="stat-bar-track" style="height:8px;"><div class="stat-bar-fill" style="width:${barPct}%;background:var(--accent);"></div></div>
          <div style="font-size:9px;color:var(--text-dim);margin-top:3px;">${progress} / ${cost} ${phIcon('cookie')} pour le palier ${lvl+1}</div>
        ` : `<div style="font-size:10px;color:var(--good);">${phIcon('check')} Niveau d'affinité maximum atteint !</div>`}
      </div>`;
  }
  function topHTML(){
    const v = resolveView();
    return `
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
        <div style="width:64px;height:64px;flex-shrink:0;">${getSpriteHTML(v.spriteName, null, 'front', false, viewShiny, v.spriteId)}</div>
        <div>
          <h2 style="margin:0;">${v.name}</h2>
          <div style="font-size:10px;color:var(--text-dim);margin:2px 0 6px;">N°${DEX_NUMBERS[sp.name]||'?'}</div>
          <div class="types-row">${v.types.map(t=>typeTagHTML(t)).join('')}</div>
        </div>
      </div>
      <div style="margin-bottom:14px;">
        <button class="btn secondary dex-shiny-btn${viewShiny?' active':''}" id="dexShinyToggleBtn" style="padding:5px 10px;font-size:9px;width:auto;">${phIcon('sparkle')} ${viewShiny?'Voir la forme normale':'Voir en chromatique'}</button>
        ${formToggleHTML()}
      </div>
      <div class="editor-section">
        <div class="editor-section-title">Stats de base</div>
        <div class="stat-bars">
          ${dexStatBarHTML('PV', v.base.hp)}
          ${dexStatBarHTML('Atq', v.base.atk)}
          ${dexStatBarHTML('Déf', v.base.def)}
          ${dexStatBarHTML('AtqSp', v.base.spa)}
          ${dexStatBarHTML('DéfSp', v.base.spd)}
          ${dexStatBarHTML('Vit', v.base.spe)}
        </div>
      </div>
      <div class="editor-section">
        <div class="editor-section-title">Talents</div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${v.abilities.map(a=>`<div><b style="color:var(--text-main);font-size:11px;">${a}</b><div class="effect-desc" style="margin-top:2px;">${ABILITY_DESC[a]||''}</div></div>`).join('')}
        </div>
      </div>
      <div class="editor-section">
        <div class="editor-section-title">Faiblesses & résistances (en défense)</div>
        ${typeMatchupHTML(v.types)}
      </div>
      <div class="editor-section">
        <div class="editor-section-title">Efficacité en attaque (types ${v.types.map(t=>typeDisplayName(t)).join(' / ')})</div>
        ${typeOffenseHTML(v.types)}
      </div>
      ${affinityDetailHTML()}`;
  }
  function bindTop(){
    document.getElementById('dexShinyToggleBtn').onclick = ()=>{ viewShiny = !viewShiny; refreshTop(); };
    topEl.querySelectorAll('.dex-form-btn').forEach(btn=>{
      btn.onclick = ()=>{ viewForm = btn.dataset.form; refreshTop(); };
    });
  }
  function refreshTop(){ topEl.innerHTML = topHTML(); bindTop(); }

  overlay.innerHTML = `
    <div class="patchnotes-modal" style="max-width:520px;position:relative;">
      <button class="patchnotes-close" id="dexDetailCloseBtn">${phIcon('x')}</button>
      <div id="dexDetailTop"></div>
      ${chainEntries.length>1 ? `
      <div class="editor-section">
        <div class="editor-section-title">Chaîne d'évolution</div>
        <div class="dex-chain-row">${chainHTML}</div>
      </div>` : ''}
      <div class="editor-section">
        <div class="editor-section-title">Attaques (${movepool.length})</div>
        ${moveListHTML}
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const topEl = document.getElementById('dexDetailTop');
  refreshTop();
  const close = ()=> overlay.remove();
  document.getElementById('dexDetailCloseBtn').onclick = close;
  overlay.onclick = (e)=>{ if(e.target===overlay) close(); };
  overlay.querySelectorAll('.dex-chain-node').forEach((btn,i)=>{
    btn.onclick = ()=>{ close(); chainEntries[i].onClick(); };
  });
  const moveSearch = document.getElementById('dexMoveSearch');
  moveSearch.oninput = ()=>{
    const q = moveSearch.value.trim().toLowerCase();
    let curGroup = null, groupHasVisible = false;
    overlay.querySelectorAll('.dex-move-row, .csel-group-label').forEach(el=>{
      if(el.classList.contains('csel-group-label')){
        if(curGroup) curGroup.classList.toggle('csel-opt-hidden', !groupHasVisible);
        curGroup = el; groupHasVisible = false;
        return;
      }
      const visible = !q || el.textContent.toLowerCase().includes(q);
      el.classList.toggle('csel-opt-hidden', !visible);
      if(visible) groupHasVisible = true;
    });
    if(curGroup) curGroup.classList.toggle('csel-opt-hidden', !groupHasVisible);
  };
}
