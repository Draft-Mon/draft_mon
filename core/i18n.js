/* ==== SOMMAIRE ====
   Traduction de l'affichage (anglais, espagnol). Le jeu est écrit en français et ses données utilisent
   les noms français comme identifiants (talents, sprites, sauvegardes...) : on ne touche donc jamais
   aux données, on traduit uniquement ce qui est affiché. Chaque langue a sa page : /draft_mon/ (fr),
   /draft_mon/en/ et /draft_mon/es/ (générées par outils/generer-pages-langues.py), qui charge son
   dictionnaire i18n/en.js ou i18n/es.js avant ce fichier. Repères :
   - I18N.lang / I18N.locale : langue de la page (attribut lang de <html>)
   - I18N.t(texte) : traduit un texte français complet (texte exact, gabarit à variables, ou phrase
     par phrase), I18N.name(nom) : traduit un nom de Pokémon/attaque/objet/talent/type/nature
   - I18N.setLang(code) : mémorise le choix et ouvre la page de cette langue (menu Paramètres)
   - traduction automatique de la page : tout texte affiché (et les attributs title/placeholder/
     aria-label/alt) passe par I18N.t dès qu'il apparaît, via un MutationObserver
   Les clés des dictionnaires sont les textes français tels qu'affichés ; {0}, {1}... marquent les
   parties variables (voir outils/extraire-textes.py pour retrouver les textes à traduire).
==== */
const I18N = (function(){
  const LANGS = ['fr', 'en', 'es'];
  const LOCALES = { fr:'fr-FR', en:'en-US', es:'es-ES' };
  const lang = LANGS.includes((document.documentElement.lang || '').slice(0, 2)) ? document.documentElement.lang.slice(0, 2) : 'fr';
  const dict = (lang !== 'fr' && window.I18N_DICT && window.I18N_DICT[lang]) || null;
  const UI = dict ? Object.assign({}, dict.ui) : {};
  const NAMES = dict ? dict.names : {};
  // Une icône placée au début ou à la fin d'un texte ("{0} Charger une partie", où {0} est une icône)
  // est un élément HTML à part : le texte affiché n'est que "Charger une partie". On ajoute donc aussi
  // chaque clé sans ses variables de début et de fin, quand la traduction a les mêmes variables aux
  // mêmes bouts.
  Object.keys(UI).forEach(key=>{
    let k = key, tr = UI[key], m;
    for(let guard = 0; guard < 4; guard++){
      if((m = k.match(/^\{(\d+)\}\s*([\s\S]+)$/)) && tr.startsWith('{' + m[1] + '}')){
        k = m[2]; tr = tr.slice(m[1].length + 2).trimStart();
      } else if((m = k.match(/^([\s\S]+?)\s*\{(\d+)\}$/)) && tr.endsWith('{' + m[2] + '}')){
        k = m[1]; tr = tr.slice(0, -(m[2].length + 2)).trimEnd();
      } else break;
      if(UI[k] === undefined) UI[k] = tr;
    }
  });

  // Gabarits à variables ("{0} utilise {1} !") compilés en expressions régulières. L'ancre (le plus
  // long morceau fixe) sert de filtre rapide avant d'essayer l'expression.
  const PATTERNS = [];
  Object.keys(UI).forEach(key=>{
    if(!/\{\d+\}/.test(key)) return;
    const parts = key.split(/\{(\d+)\}/);
    const literals = parts.filter((_, i)=> i % 2 === 0);
    const score = literals.join('').replace(/[^A-Za-zÀ-ÿ]/g, '').length;
    if(score < 2) return;
    const anchor = literals.reduce((a, b)=> b.trim().length > a.length ? b.trim() : a, '');
    const order = parts.filter((_, i)=> i % 2 === 1).map(Number);
    const src = parts.map((p, i)=> i % 2 === 0 ? p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '([\\s\\S]*?)').join('');
    // multi : le gabarit contient lui-même plusieurs phrases ("utilise {0} ! {1}").
    PATTERNS.push({ re:new RegExp('^' + src + '$'), anchor, score, order, out:UI[key], multi:/[!?.…]\s+\S/.test(key) });
  });
  PATTERNS.sort((a, b)=> b.score - a.score);

  const cache = new Map();
  function applyPattern(p, s){
    if(p.anchor && !s.includes(p.anchor)) return null;
    const m = s.match(p.re);
    if(!m) return null;
    const values = {};
    for(let i = 0; i < p.order.length; i++){
      const v = m[i + 1], tv = translateCore(v);
      // Gabarit très court ("{0} et {1}") : on ne l'applique que si chaque partie variable est un nom
      // ou un texte traduit, sinon il traduirait à moitié une phrase inconnue.
      if(p.score < 6 && tv === v && /\s/.test(v.trim()) && /[A-Za-zÀ-ÿ]{2}/.test(v)) return null;
      values[p.order[i]] = tv;
    }
    return p.out.replace(/\{(\d+)\}/g, (_, n)=> values[n] !== undefined ? values[n] : '');
  }
  function translateCore(s){
    const exact = UI[s] !== undefined ? UI[s] : NAMES[s];
    if(exact !== undefined) return exact;
    if(!/[A-Za-zÀ-ÿ]{2}/.test(s)) return s;
    // Réplique entre guillemets ("...", « ... ») : on traduit l'intérieur.
    const q = s.match(/^(["«“]\s?)([\s\S]+?)(\s?["»”])$/);
    if(q){ const inner = translateCore(q[2]); if(inner !== q[2]) return q[1] + inner + q[3]; }
    // Message fait de plusieurs phrases collées : d'abord un gabarit qui couvre plusieurs phrases,
    // sinon on traduit phrase par phrase.
    const sentences = s.split(/(?<=[!?.…)])\s+(?=[A-ZÀ-Ý0-9(«"—])/);
    if(sentences.length > 1){
      for(const p of PATTERNS){ if(p.multi){ const r = applyPattern(p, s); if(r !== null) return r; } }
      const out = sentences.map(translateCore);
      if(out.some((o, i)=> o !== sentences[i])) return out.join(' ');
    }
    for(const p of PATTERNS){ const r = applyPattern(p, s); if(r !== null) return r; }
    // Listes : chaîne d'évolution "Smogo → Smogogo", "N°109 · Smogo", formes "Boréas / Fulguris"...
    for(const sep of [' → ', ' · ', ' / ', ', ']){
      if(s.includes(sep)){
        const parts = s.split(sep), out = parts.map(translateCore);
        if(out.some((o, i)=> o !== parts[i])) return out.join(sep);
      }
    }
    return s;
  }
  // Traduit un texte en gardant ses espaces de début et de fin (texte d'un nœud HTML).
  function t(text){
    if(!dict || text == null) return text;
    text = String(text);
    const core = text.trim();
    if(!core) return text;
    let res = cache.get(core);
    if(res === undefined){
      res = translateCore(core.replace(/\s+/g, ' '));
      if(cache.size > 5000) cache.clear();
      cache.set(core, res);
    }
    if(res === core) return text;
    const start = text.indexOf(core);
    return text.slice(0, start) + res + text.slice(start + core.length);
  }
  function name(n){ return (dict && NAMES[n] !== undefined) ? NAMES[n] : n; }

  // Adresse d'une page dans une autre langue : /draft_mon/guide.html <-> /draft_mon/en/guide.html.
  function urlFor(code){
    const m = location.pathname.match(/^(.*?\/)(?:(?:en|es)\/)?([^\/]*)$/);
    const root = m ? m[1] : '/';
    const file = m ? m[2] : '';
    return root + (code === 'fr' ? '' : code + '/') + file;
  }
  function setLang(code){
    if(!LANGS.includes(code)) return;
    try { localStorage.setItem('draftArenaLang', code); } catch(e){}
    if(code !== lang) location.href = urlFor(code) + location.search;
  }

  // --- Traduction automatique de la page ---
  const ATTRS = ['title', 'placeholder', 'aria-label', 'alt'];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT', 'CODE', 'PRE']);
  function translateText(node){
    const parent = node.parentNode;
    if(!parent || SKIP.has(parent.nodeName) || (parent.closest && parent.closest('[data-no-i18n]'))) return;
    const v = node.data, r = t(v);
    if(r !== v) node.data = r;
  }
  function translateAttrs(el){
    for(const a of ATTRS){
      const v = el.getAttribute(a);
      if(v){ const r = t(v); if(r !== v) el.setAttribute(a, r); }
    }
  }
  function walk(root){
    if(root.nodeType === 3){ translateText(root); return; }
    if(root.nodeType !== 1 || SKIP.has(root.nodeName) || root.hasAttribute('data-no-i18n')) return;
    translateAttrs(root);
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: n=> (n.nodeType === 1 && (SKIP.has(n.nodeName) || n.hasAttribute('data-no-i18n'))) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    let n;
    while((n = tw.nextNode())){
      if(n.nodeType === 3) translateText(n); else translateAttrs(n);
    }
  }
  if(dict){
    walk(document.body);
    new MutationObserver(records=>{
      for(const r of records){
        if(r.type === 'childList') r.addedNodes.forEach(walk);
        else if(r.type === 'characterData') translateText(r.target);
        else if(r.type === 'attributes') translateAttrs(r.target);
      }
    }).observe(document.body, { childList:true, characterData:true, subtree:true, attributes:true, attributeFilter:ATTRS });
  }

  return { lang, locale:LOCALES[lang], t, name, setLang, urlFor, LANGS };
})();
