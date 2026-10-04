/* ==== Composant menu déroulant réutilisable partout dans le jeu (filtres du Dex, choix
   nature/talent dans l'éditeur...), à la place du <select> natif du navigateur. Ajoute une barre de
   recherche en haut de la liste dès qu'il y a assez d'options pour que ça vaille le coup (nature,
   talent...). ==== */
const CSEL_SEARCH_THRESHOLD = 8;
// Écran tactile : on ne donne pas le focus à la barre de recherche à l'ouverture, sinon le clavier
// virtuel surgit, redimensionne la fenêtre et pousse la liste hors de l'écran (le menu semble alors
// ne pas s'ouvrir). La recherche reste utilisable en touchant le champ.
function cselIsTouch(){ return !!(window.matchMedia && window.matchMedia('(pointer:coarse)').matches); }
// Place la liste d'un menu déroulant qui vient de s'ouvrir pour qu'elle reste visible : elle est en
// position:absolute sous son déclencheur, donc coupée dès qu'un ancêtre défilant (fenêtre modale,
// panneau du Campement...) ou le bas de l'écran n'a plus la place — typiquement sur mobile, pour les
// menus du bas d'une fenêtre. On l'ouvre alors vers le haut et/ou on limite sa hauteur à la place
// réellement disponible, puis on la fait défiler dans la vue.
function positionCselDropdown(trigger, dropdown){
  dropdown.style.top = ''; dropdown.style.bottom = ''; dropdown.style.maxHeight = '';
  const r = trigger.getBoundingClientRect();
  let top = 0, bottom = window.innerHeight;
  for(let el = trigger.parentElement; el && el!==document.body && el!==document.documentElement; el = el.parentElement){
    const oy = getComputedStyle(el).overflowY;
    if(oy==='auto' || oy==='scroll' || oy==='hidden'){
      const b = el.getBoundingClientRect();
      top = Math.max(top, b.top); bottom = Math.min(bottom, b.bottom);
    }
  }
  const margin = 8, minH = 120;
  const below = bottom - r.bottom - margin, above = r.top - top - margin;
  const wanted = dropdown.offsetHeight;
  if(below < wanted){
    if(above > below){
      dropdown.style.top = 'auto';
      dropdown.style.bottom = 'calc(100% + 3px)';
      dropdown.style.maxHeight = Math.max(minH, Math.min(wanted, above)) + 'px';
    } else {
      dropdown.style.maxHeight = Math.max(minH, below) + 'px';
    }
  }
  if(dropdown.scrollIntoView) dropdown.scrollIntoView({block:'nearest'});
}
// Construit un menu déroulant (bouton déclencheur + liste d'options) à partir d'une liste {value,label,html}.
// Une entrée {group:'titre'} insère un intertitre de groupe (ex. Physiques/Spéciales/Statut) au-dessus
// des options qui la suivent ; il se masque tout seul quand la recherche vide son groupe.
function createCustomSelect({options, value, placeholder, onChange, searchable}){
  const csel = document.createElement('div');
  csel.className = 'csel';

  const trigger = document.createElement('div');
  trigger.className = 'csel-trigger';

  const dropdown = document.createElement('div');
  dropdown.className = 'csel-dropdown';

  const renderTrigger = (val)=>{
    const opt = options.find(o=>o.value===val);
    trigger.innerHTML = opt
      ? `<span class="csel-name">${opt.html!==undefined ? opt.html : opt.label}</span><span class="csel-arrow">▾</span>`
      : `<span class="csel-name csel-empty">${placeholder||'— Choisir —'}</span><span class="csel-arrow">▾</span>`;
  };
  renderTrigger(value);

  const wantSearch = searchable!==undefined ? searchable : options.length > CSEL_SEARCH_THRESHOLD;
  let searchInput = null;
  if(wantSearch){
    const searchWrap = document.createElement('div');
    searchWrap.className = 'csel-search-wrap';
    searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'csel-search';
    searchInput.placeholder = 'Rechercher...';
    searchWrap.appendChild(searchInput);
    dropdown.appendChild(searchWrap);
    searchInput.onclick = (e)=> e.stopPropagation();
    searchInput.oninput = ()=>{
      const q = searchInput.value.trim().toLowerCase();
      let curGroup = null, groupHasVisible = false;
      dropdown.querySelectorAll('.csel-opt, .csel-group-label').forEach(o=>{
        if(o.classList.contains('csel-group-label')){
          if(curGroup) curGroup.classList.toggle('csel-opt-hidden', !groupHasVisible);
          curGroup = o; groupHasVisible = false;
          return;
        }
        const visible = !q || o.textContent.toLowerCase().includes(q);
        o.classList.toggle('csel-opt-hidden', !visible);
        if(visible) groupHasVisible = true;
      });
      if(curGroup) curGroup.classList.toggle('csel-opt-hidden', !groupHasVisible);
    };
  }

  options.forEach(opt=>{
    if(opt.group!==undefined){
      const sep = document.createElement('div');
      sep.className = 'csel-group-label';
      sep.innerHTML = opt.group;
      dropdown.appendChild(sep);
      return;
    }
    const el = document.createElement('div');
    el.className = 'csel-opt' + (opt.value===value ? ' selected' : '');
    el.innerHTML = `<span class="csel-opt-name">${opt.html!==undefined ? opt.html : opt.label}</span>`;
    el.onclick = ()=>{
      value = opt.value;
      renderTrigger(value);
      dropdown.querySelectorAll('.csel-opt').forEach(o=>o.classList.remove('selected'));
      el.classList.add('selected');
      dropdown.classList.remove('open');
      trigger.classList.remove('open');
      onChange(opt.value);
    };
    dropdown.appendChild(el);
  });

  trigger.onclick = (e)=>{
    e.stopPropagation();
    const wasOpen = dropdown.classList.contains('open');
    document.querySelectorAll('.csel-dropdown.open').forEach(d=>d.classList.remove('open'));
    document.querySelectorAll('.csel-trigger.open').forEach(d=>d.classList.remove('open'));
    if(!wasOpen){
      dropdown.classList.add('open'); trigger.classList.add('open');
      if(searchInput){ searchInput.value=''; dropdown.querySelectorAll('.csel-opt-hidden').forEach(o=>o.classList.remove('csel-opt-hidden')); if(!cselIsTouch()) setTimeout(()=>searchInput.focus({preventScroll:true}), 0); }
      positionCselDropdown(trigger, dropdown);
    }
  };

  csel.appendChild(trigger);
  csel.appendChild(dropdown);
  return csel;
}
document.addEventListener('click', ()=>{
  document.querySelectorAll('.csel-dropdown.open').forEach(d=>d.classList.remove('open'));
  document.querySelectorAll('.csel-trigger.open').forEach(d=>d.classList.remove('open'));
});

