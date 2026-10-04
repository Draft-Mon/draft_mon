/* ==== Le Ranch du Village : un dresseur itinérant propose 3 Pokémon sauvages tirés au sort (un
   seul recrutable par visite), à ajouter à l'équipe (en remplaçant un membre) ou envoyer au PC.
   On y trouve aussi le Maître des Capacités, qui refait le set d'un Pokémon de l'équipe (talent,
   nature, EV, attaques) contre MOVE_MASTER_PRICE pièces. ==== */
let ranchChoices = null;
let ranchRecruited = false;
const MOVE_MASTER_PRICE = 100;
function moveMasterBtnHTML(){
  return `<div style="text-align:center;margin-top:12px;"><button class="btn secondary" id="ranchMoveMasterBtn" style="font-size:10px;">${phIcon('graduation-cap')} Maître des Capacités — ${MOVE_MASTER_PRICE} ${phIcon('coins')}</button></div>`;
}
// Affiche les 3 candidats du Ranch (tirés une seule fois par visite au Village, mémorisés dans ranchChoices).
function renderRanchPanel(){
  const wrap = document.getElementById('villagePanelContent');
  if(ranchRecruited){
    wrap.innerHTML = `
      <div style="background:var(--bg-card);border:1px solid var(--line);border-radius:4px;padding:14px;text-align:center;">
        <div style="font-size:10px;color:var(--text-dim);">Le dresseur itinérant est reparti. Reviens après ta prochaine victoire de Boss pour de nouvelles recrues !</div>
        <div class="dex-rate" id="villageMsg" style="text-align:center;margin-top:10px;color:var(--good);"></div>
        ${moveMasterBtnHTML()}
      </div>`;
    document.getElementById('ranchMoveMasterBtn').onclick = renderMoveMasterPanel;
    return;
  }
  wrap.innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--line);border-radius:4px;padding:14px;">
      <div style="font-size:10px;color:var(--text-dim);margin-bottom:10px;text-align:center;">Un dresseur itinérant te propose 3 Pokémon sauvages. Tu ne peux en recruter qu'un seul !</div>
      <div id="ranchDraftCards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;"></div>
      <div class="dex-rate" id="villageMsg" style="text-align:center;margin-top:10px;color:var(--good);"></div>
      ${moveMasterBtnHTML()}
    </div>`;
  document.getElementById('ranchMoveMasterBtn').onclick = renderMoveMasterPanel;
  ensureRanchChoices();
  const choices = ranchChoices;
  const cardsWrap = document.getElementById('ranchDraftCards');
  choices.forEach(choice=>{
    const line = lineOf(choice.lineId);
    const hasBranch = choice.branch!==undefined && choice.branch!==null;
    const sp = hasBranch ? line.branches[choice.branch] : line.stages[choice.stage];
    const card = document.createElement('div');
    card.style.cssText = 'background:#140F0A;border:1px solid var(--line);border-radius:4px;padding:10px;text-align:center;cursor:pointer;';
    card.innerHTML = `
      <div style="width:60px;height:60px;margin:0 auto 6px;">${getSpriteHTML(sp.name, null, 'front', false, choice.shiny)}</div>
      <div style="font-size:10px;color:var(--text-main);margin-bottom:4px;">${sp.name}${choice.shiny?shinyBadgeHTML():''}</div>
      <div class="types-row" style="justify-content:center;">${sp.types.map(t=>typeTagHTML(t)).join('')}</div>
    `;
    card.onclick = ()=> renderRanchRecruit(choice, sp);
    cardsWrap.appendChild(card);
  });
}
// Écran de confirmation du recrutement : choisir d'ajouter à l'équipe (en remplaçant un membre) ou d'envoyer directement au PC.
function renderRanchRecruit(choice, sp){
  const wrap = document.getElementById('villagePanelContent');
  wrap.innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--line);border-radius:4px;padding:14px;text-align:center;">
      <div style="width:70px;height:70px;margin:0 auto 8px;">${getSpriteHTML(sp.name, null, 'front', false, choice.shiny)}</div>
      <div style="font-size:12px;color:var(--text-main);margin-bottom:4px;">${sp.name}${choice.shiny?shinyBadgeHTML():''}</div>
      <div class="types-row" style="justify-content:center;margin-bottom:12px;">${sp.types.map(t=>typeTagHTML(t)).join('')}</div>
      <div style="font-size:10px;color:var(--text-dim);margin-bottom:12px;">Où veux-tu l'envoyer ?</div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
        <button class="btn" id="ranchToTeamBtn">Ajouter à l'équipe</button>
        <button class="btn secondary" id="ranchToPCBtn" ${pcHasSpace()?'':'disabled'}>Envoyer au PC${pcHasSpace()?'':' (plein)'}</button>
        <button class="btn secondary" id="ranchCancelBtn">Annuler</button>
      </div>
      <div id="ranchTeamPicker" style="margin-top:14px;"></div>
    </div>`;
  // Une recrue arrive toujours prête à combattre (talent, nature, EV et 4 attaques), quelle que soit la
  // difficulté : hors du draft il n'y a plus d'éditeur pour la configurer (le Maître des Capacités
  // permet ensuite de refaire son set).
  const buildMember = ()=>{
    const member = autoBuildMember(choice.lineId, choice.stage, choice.branch);
    member.shiny = !!choice.shiny;
    member.computedStats = calcStats(speciesOf(member).base, member.ivs, member.evs, member.nature);
    return member;
  };
  document.getElementById('ranchCancelBtn').onclick = renderRanchPanel;
  document.getElementById('ranchToPCBtn').onclick = ()=>{
    if(!pcHasSpace()) return;
    depositToPC(buildMember());
    ranchRecruited = true;
    saveGame();
    renderVillageRanchPen();
    renderRanchPanel();
    setVillageMsg(`${phIcon('check')} ${sp.name} envoyé au PC !`);
  };
  document.getElementById('ranchToTeamBtn').onclick = ()=>{
    const picker = document.getElementById('ranchTeamPicker');
    picker.innerHTML = `<div style="font-size:9px;color:var(--text-dim);margin-bottom:8px;">Choisis le Pokémon à remplacer :</div>`;
    team.forEach((m,i)=>{
      const msp = speciesOf(m);
      const btn = document.createElement('button');
      btn.className = 'btn secondary';
      btn.style.cssText = 'width:100%;text-align:left;padding:8px;margin-bottom:6px;display:flex;align-items:center;gap:8px;';
      btn.innerHTML = `<span style="width:26px;height:26px;display:inline-block;">${getSpriteHTML(msp.name, m.unownForm, 'front', false, m.shiny)}</span><span style="font-size:10px;">${msp.name}${m.shiny?shinyBadgeHTML():''}</span>`;
      btn.onclick = ()=>{
        const newMember = buildMember();
        const replaced = team[i];
        team[i] = newMember;
        const toPC = pcHasSpace();
        if(toPC) depositToPC(replaced);
        ranchRecruited = true;
        saveGame();
        renderVillageRanchPen();
        renderVillageTeamRing();
        renderRanchPanel();
        setVillageMsg(toPC
          ? `${phIcon('check')} ${sp.name} rejoint l'équipe ! ${msp.name} est envoyé au PC.`
          : `${phIcon('check')} ${sp.name} rejoint l'équipe ! (PC plein, ${msp.name} a été relâché)`);
      };
      picker.appendChild(btn);
    });
  };
}

// Maître des Capacités, étape 1 : choix du Pokémon de l'équipe dont on veut refaire le set.
function renderMoveMasterPanel(){
  const wrap = document.getElementById('villagePanelContent');
  wrap.innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--line);border-radius:4px;padding:14px;">
      <div style="font-size:10px;color:var(--text-dim);margin-bottom:10px;text-align:center;">Le Maître des Capacités refait le set d'un de tes Pokémon (talent, nature, EV et attaques) pour ${MOVE_MASTER_PRICE} ${phIcon('coins')}. Tu ne paies qu'en validant.</div>
      <div id="moveMasterTeam"></div>
      <div class="dex-rate" id="villageMsg" style="text-align:center;margin-top:10px;color:var(--good);"></div>
      <div style="text-align:center;margin-top:10px;"><button class="btn secondary" id="moveMasterBackBtn">◀ Retour</button></div>
    </div>`;
  const list = document.getElementById('moveMasterTeam');
  team.forEach((m,i)=>{
    const sp = speciesOf(m);
    const btn = document.createElement('button');
    btn.className = 'btn secondary';
    btn.style.cssText = 'width:100%;text-align:left;padding:8px;margin-bottom:6px;display:flex;align-items:center;gap:8px;';
    btn.innerHTML = `<span style="width:30px;height:30px;display:inline-block;flex-shrink:0;">${getSpriteHTML(sp.name, m.unownForm, 'front', false, m.shiny)}</span>
      <span style="min-width:0;"><span style="font-size:10px;display:block;">${sp.name}${m.shiny?shinyBadgeHTML():''}</span>
      <span style="font-size:8px;color:var(--text-dim);display:block;white-space:normal;">${m.moves.filter(Boolean).map(id=>MOVES[id].name).join(' · ') || 'Aucune attaque'}</span></span>`;
    btn.onclick = ()=> renderMoveMasterEdit(i);
    list.appendChild(btn);
  });
  document.getElementById('moveMasterBackBtn').onclick = renderRanchPanel;
}
// Maître des Capacités, étape 2 : édition du set sur un brouillon (rien n'est modifié ni payé tant
// que le joueur n'a pas validé).
function renderMoveMasterEdit(idx){
  const m = team[idx];
  const sp = speciesOf(m);
  const abilities = abilitiesFor(m);
  const movepool = [...new Set(movepoolFor(m))].filter(id=>MOVES[id]);
  const neededMoves = Math.min(4, movepool.length);
  const draft = {
    nature: m.nature,
    ability: abilities.includes(m.ability) ? m.ability : abilities[0],
    evs: {...m.evs},
    moves: [0,1,2,3].map(s=> movepool.includes(m.moves[s]) ? m.moves[s] : null)
  };
  const wrap = document.getElementById('villagePanelContent');
  const label = (t)=> `<label style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.5px;display:block;margin:8px 0 3px;">${t}</label>`;
  wrap.innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--line);border-radius:4px;padding:14px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
        <div style="width:48px;height:48px;flex-shrink:0;">${getSpriteHTML(sp.name, m.unownForm, 'front', false, m.shiny)}</div>
        <div>
          <div style="font-size:12px;color:var(--text-main);">${sp.name}${m.shiny?shinyBadgeHTML():''}</div>
          <div class="types-row" style="justify-content:flex-start;margin-top:3px;">${sp.types.map(t=>typeTagHTML(t)).join('')}</div>
        </div>
      </div>
      ${label('Talent')}<div id="mmAbility"></div>
      <div class="effect-desc" id="mmAbilityDesc" style="margin-top:4px;"></div>
      ${label('Nature')}<div id="mmNature"></div>
      ${label(`EV (0–${EV_MAX} par stat · ${EV_TOTAL_MAX} max au total)`)}
      <div class="ev-grid" id="mmEvGrid" style="grid-template-columns:1fr 1fr;"></div>
      <div class="ev-total" id="mmEvTotal"></div>
      ${label('Attaques')}<div id="mmMoves" style="display:flex;flex-direction:column;gap:6px;"></div>
      <div class="dex-rate" id="villageMsg" style="text-align:center;margin-top:10px;color:var(--good);"></div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px;">
        <button class="btn" id="mmValidateBtn">Valider — ${MOVE_MASTER_PRICE} ${phIcon('coins')}</button>
        <button class="btn secondary" id="mmCancelBtn">Annuler</button>
      </div>
    </div>`;
  const evTotal = ()=> Object.values(draft.evs).reduce((a,b)=>a+b,0);
  const refresh = ()=>{
    const total = evTotal();
    const el = document.getElementById('mmEvTotal');
    el.textContent = `${total} / ${EV_TOTAL_MAX}`;
    el.className = 'ev-total' + (total>EV_TOTAL_MAX ? ' over' : '');
    const chosen = draft.moves.filter(Boolean);
    const ok = chosen.length>=neededMoves && new Set(chosen).size===chosen.length && total<=EV_TOTAL_MAX && money>=MOVE_MASTER_PRICE;
    document.getElementById('mmValidateBtn').disabled = !ok;
  };
  document.getElementById('mmAbilityDesc').textContent = ABILITY_DESC[draft.ability]||'';
  document.getElementById('mmAbility').appendChild(createCustomSelect({
    options: abilities.map(a=>({value:a, label:a})),
    value: draft.ability,
    onChange: (val)=>{ draft.ability = val; document.getElementById('mmAbilityDesc').textContent = ABILITY_DESC[val]||''; }
  }));
  document.getElementById('mmNature').appendChild(createCustomSelect({
    options: NATURES.map(n=>({
      value:n.name,
      label:n.name+(n.plus?` (+${STAT_LABEL[n.plus]}/-${STAT_LABEL[n.minus]})`:''),
      html: n.plus
        ? `${n.name} <span style="color:var(--good);font-weight:700;">+${STAT_LABEL[n.plus]}</span> <span style="color:var(--low);font-weight:700;">-${STAT_LABEL[n.minus]}</span>`
        : `${n.name} <span style="color:var(--text-dim);">(neutre)</span>`
    })),
    value: draft.nature.name,
    onChange: (val)=>{ draft.nature = NATURES.find(n=>n.name===val); }
  }));
  const evGrid = document.getElementById('mmEvGrid');
  ['hp','atk','def','spa','spd','spe'].forEach(stat=>{
    const row = document.createElement('div'); row.className = 'ev-row';
    row.innerHTML = `<label>${STAT_LABEL[stat]}</label><input type="number" min="0" max="${EV_MAX}" step="1" value="${draft.evs[stat]||0}">`;
    const inp = row.querySelector('input');
    inp.onchange = ()=>{
      const v = Math.max(0, Math.min(EV_MAX, parseInt(inp.value)||0));
      draft.evs[stat] = v; inp.value = v;
      refresh();
    };
    evGrid.appendChild(row);
  });
  // Les 4 menus d'attaques : chacun exclut les capacités déjà prises dans les autres emplacements, et
  // regroupe les attaques par catégorie (Physiques / Spéciales / Statut) comme l'éditeur d'équipe du draft.
  const movesEl = document.getElementById('mmMoves');
  const moveOptionHTML = (id)=>{
    const mv = MOVES[id];
    return `${typeTagHTML(mv.type, {style:'font-size:8px;padding:2px 7px;'})} ${mv.name} <span class="cat-chip cat-${mv.cat}">${mv.cat==='phys'?'Phys':mv.cat==='spec'?'Spéc':'Statut'}</span>${mv.cat!=='status'?` <span style="font-size:10px;color:var(--text-dim);">${mv.power}</span>`:''}`;
  };
  const buildMoveSlots = ()=>{
    movesEl.innerHTML = '';
    for(let slot=0;slot<4;slot++){
      const taken = draft.moves.filter((id,i)=> i!==slot && id);
      const ids = movepool.filter(id=>!taken.includes(id)).sort((a,b)=>(MOVES[b].power||0)-(MOVES[a].power||0));
      const options = [];
      [['phys', phIcon('sword')+' Physiques'], ['spec', phIcon('sparkle')+' Spéciales'], ['status', phIcon('spiral')+' Statut']].forEach(([cat, title])=>{
        const catIds = ids.filter(id=>MOVES[id].cat===cat);
        if(!catIds.length) return;
        options.push({group:title});
        catIds.forEach(id=> options.push({value:id, label:MOVES[id].name, html:moveOptionHTML(id)}));
      });
      movesEl.appendChild(createCustomSelect({
        options,
        value: draft.moves[slot],
        placeholder: '— Choisir une attaque —',
        searchable: true,
        onChange: (val)=>{ draft.moves[slot] = val; buildMoveSlots(); refresh(); }
      }));
    }
  };
  buildMoveSlots();
  refresh();
  if(money<MOVE_MASTER_PRICE) setVillageMsg(`<span style="color:var(--low);">Pas assez d'argent (${MOVE_MASTER_PRICE} ${phIcon('coins')} requis) !</span>`);
  document.getElementById('mmCancelBtn').onclick = renderMoveMasterPanel;
  document.getElementById('mmValidateBtn').onclick = ()=>{
    if(money<MOVE_MASTER_PRICE) return;
    money -= MOVE_MASTER_PRICE;
    const oldMax = m.computedStats ? m.computedStats.hp : null;
    m.ability = draft.ability;
    m.nature = draft.nature;
    m.evs = draft.evs;
    m.moves = [0,1,2,3].map(s=>draft.moves[s]||null);
    m.computedStats = calcStats(sp.base, m.ivs, m.evs, m.nature);
    // PV courants (conservés d'un combat à l'autre en Difficile) : suivent le nouveau maximum.
    if(typeof m.hp==='number') m.hp = (m.hp>=oldMax) ? m.computedStats.hp : Math.min(m.hp, m.computedStats.hp);
    refreshVillageMoney();
    saveGame();
    renderMoveMasterPanel();
    setVillageMsg(`${phIcon('check')} Le set de ${sp.name} a été refait !`);
  };
}

document.getElementById('villagePokecentreBtn').onclick = renderPokecentrePanel;
document.getElementById('villagePokeshopBtn').onclick = renderPokeshopPanel;
document.getElementById('villageRanchBtn').onclick = renderRanchPanel;
document.getElementById('villageContinueBtn').onclick = ()=>{
  document.getElementById('screenVillage').classList.add('hidden');
  document.getElementById('screenTower').classList.remove('hidden');
  renderTower();
};

