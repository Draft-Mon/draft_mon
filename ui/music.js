/* ==== SOMMAIRE ====
   Musique de fond : une piste (ou playlist) par écran, et une piste dédiée par Maître de Type
   rencontré en combat. Bascule automatiquement au changement d'écran (MutationObserver) avec un
   fondu enchaîné entre 2 lecteurs <audio> alternés. Repères :
   - L.11-32 : MUSIC_TRACKS/TYPE_MUSIC/SCREEN_MUSIC — quelle(s) piste(s) pour quel écran/quel type
   - L.42-fin(64): fadeAudioTo/shuffledOrder — fondu de volume + ordre de lecture aléatoire d'une playlist
   - L.66-fin(133): resolveTrackList/getEffectiveMusicKey/playTrackFile/advancePlaylist/
     playMusicKey/updateMusicForActiveScreen — résolution et lecture effective de la musique
   - L.135-fin : réglage du volume, déverrouillage au premier clic (autoplay bloqué par le
     navigateur sinon), fenêtre de réglages, écoute des changements d'écran
==== */
const MUSIC_TRACKS = {
  menu: ['assets/audio/menu/menu.mp3'],
  village: ['assets/audio/village/village.mp3'],
  battle: ['assets/audio/battle/battle.mp3']
};
const TYPE_MUSIC = {
  normal:   ['assets/audio/dresseur/Larry.mp3'],
  feu:      ['assets/audio/dresseur/flannery.mp3'],
  eau:      ['assets/audio/dresseur/Misty.mp3'],
  plante:   ['assets/audio/dresseur/Erika.mp3'],
  electrik: ['assets/audio/dresseur/Iono.mp3'],
  vol:      ['assets/audio/dresseur/Kahili.mp3'],
  poison:   ['assets/audio/dresseur/Koga.mp3'],
  sol:      ['assets/audio/dresseur/Rika.mp3'],
  insecte:  ['assets/audio/dresseur/katy.mp3'],
  combat:   ['assets/audio/dresseur/bea.mp3'],
  glace:    ['assets/audio/dresseur/Candice.mp3'],
  psy:      ['assets/audio/dresseur/Sabrina.mp3'],
  fantome:  ['assets/audio/dresseur/Phoebe.mp3'],
  roche:    ['assets/audio/dresseur/Brock.mp3'],
  dragon:   ['assets/audio/dresseur/Lance.mp3'],
  acier:    ['assets/audio/dresseur/Steven.mp3'],
  tenebres: ['assets/audio/dresseur/Karen.mp3'],
  fee:      ['assets/audio/dresseur/Jacinthe.mp3'],
};
const SCREEN_MUSIC = {
  screenMenu: 'menu', screenDex: 'menu', screenEnd: 'menu',
  screenDraft: 'village', screenBuilder: 'village', screenVillage: 'village', screenTower: 'village',
  screenBattle: 'battle'
};
const MUSIC_FADE_MS = 700;

let musicVolume = parseFloat(localStorage.getItem('draftArenaMusicVolume'));
if(isNaN(musicVolume)) musicVolume = 0.4;
// Affiche ou non un repère d'efficacité (super efficace/peu efficace/aucun effet) sur les boutons
// d'attaque en combat (voir buildEffectivenessBadgeHTML dans combat/battle-ui.js) — activé par défaut.
let showMoveEffectiveness = localStorage.getItem('draftArenaShowEffectiveness');
showMoveEffectiveness = showMoveEffectiveness===null ? true : showMoveEffectiveness==='1';
function setShowMoveEffectiveness(val){
  showMoveEffectiveness = !!val;
  try { localStorage.setItem('draftArenaShowEffectiveness', showMoveEffectiveness ? '1' : '0'); } catch(e){}
  if(typeof battleState!=='undefined' && battleState && !document.getElementById('screenBattle').classList.contains('hidden') && typeof renderMoveGrid==='function') renderMoveGrid();
}
// Vitesse du jeu (x1/x1.5/x2) : raccourcit les délais entre chaque étape d'un combat (combat/battle-flow.js,
// via btDelay). Ne touche pas aux effets visuels liés à une durée d'animation CSS (combat/move-fx.js,
// flashScreen dans combat/battle-ui.js) pour ne pas les désynchroniser de leur animation.
const GAME_SPEEDS = [1, 1.5, 2];
let gameSpeed = parseFloat(localStorage.getItem('draftArenaGameSpeed'));
if(!GAME_SPEEDS.includes(gameSpeed)) gameSpeed = 1;
function setGameSpeed(val){
  gameSpeed = GAME_SPEEDS.includes(val) ? val : 1;
  try { localStorage.setItem('draftArenaGameSpeed', String(gameSpeed)); } catch(e){}
}
function btDelay(ms){ return Math.round(ms / gameSpeed); }
let musicUnlocked = false;
let currentTrackKey = null;
let playlistState = null;

const musicAudioA = new Audio();
const musicAudioB = new Audio();
[musicAudioA, musicAudioB].forEach(a=>{
  a.volume = 0; a.preload = 'auto';
  a.addEventListener('ended', ()=>{ if(a === activeMusicAudio) advancePlaylist(); });
});
let activeMusicAudio = musicAudioA;

// Fait varier progressivement le volume d'un lecteur audio vers une valeur cible (fondu enchaîné entre pistes).
function fadeAudioTo(audio, targetVolume, duration){
  const start = audio.volume;
  const startTime = performance.now();
  function step(now){
    const t = Math.max(0, Math.min(1, (now - startTime) / duration));
    audio.volume = Math.max(0, Math.min(1, start + (targetVolume - start) * t));
    if(t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Ordre de lecture aléatoire des n pistes d'une playlist (Fisher-Yates).
function shuffledOrder(n){
  const arr = Array.from({length:n}, (_,i)=>i);
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

// Résout une clé musicale ("menu", "battle:feu"...) vers sa liste réelle de fichiers.
function resolveTrackList(key){
  if(!key) return [];
  if(key.startsWith('battle:')){
    const type = key.slice('battle:'.length);
    const list = TYPE_MUSIC[type];
    return (list && list.length) ? list : MUSIC_TRACKS.battle;
  }
  return MUSIC_TRACKS[key] || [];
}

// Détermine la clé musicale à jouer pour l'écran actif (musique dédiée au Maître de Type affronté en combat, sinon la musique par défaut de l'écran).
function getEffectiveMusicKey(panelId){
  if(panelId === 'screenBattle'){
    const trainer = (typeof battleState !== 'undefined' && battleState) ? battleState.trainer : null;
    const masterType = trainer && trainer.masterType;
    if(masterType && TYPE_MUSIC[masterType] && TYPE_MUSIC[masterType].length) return 'battle:' + masterType;
  }
  return SCREEN_MUSIC[panelId];
}

// Joue un fichier audio en fondu enchaîné (bascule entre les 2 lecteurs alternés A/B).
function playTrackFile(src, shouldLoop){
  const incoming = activeMusicAudio === musicAudioA ? musicAudioB : musicAudioA;
  const outgoing = activeMusicAudio;
  incoming.loop = shouldLoop;
  incoming.src = src;
  incoming.currentTime = 0;
  incoming.volume = 0;
  incoming.play().catch(()=>{});
  fadeAudioTo(incoming, musicVolume, MUSIC_FADE_MS);
  fadeAudioTo(outgoing, 0, MUSIC_FADE_MS);
  setTimeout(()=> outgoing.pause(), MUSIC_FADE_MS + 50);
  activeMusicAudio = incoming;
}

// Passe à la piste suivante d'une playlist à plusieurs pistes (appelé quand une piste se termine).
function advancePlaylist(){
  if(!playlistState) return;
  const tracks = resolveTrackList(playlistState.key);
  if(tracks.length <= 1) return;
  playlistState.pos++;
  if(playlistState.pos >= playlistState.order.length){
    let newOrder = shuffledOrder(tracks.length);
    const lastIdx = playlistState.order[playlistState.order.length - 1];
    if(newOrder.length > 1 && newOrder[0] === lastIdx){
      [newOrder[0], newOrder[1]] = [newOrder[1], newOrder[0]];
    }
    playlistState.order = newOrder;
    playlistState.pos = 0;
  }
  playTrackFile(tracks[playlistState.order[playlistState.pos]], false);
}

// Lance la musique associée à une clé (ne fait rien si c'est déjà la piste en cours).
function playMusicKey(key){
  if(!key || key === currentTrackKey) return;
  const tracks = resolveTrackList(key);
  if(!tracks.length) return;
  currentTrackKey = key;
  playlistState = { key, order: shuffledOrder(tracks.length), pos: 0 };
  playTrackFile(tracks[playlistState.order[0]], tracks.length <= 1);
}

// Détecte quel écran est actuellement visible et joue la musique correspondante (appelé à chaque changement d'écran).
function updateMusicForActiveScreen(){
  const panels = document.querySelectorAll('.panel');
  for(const p of panels){
    if(!p.classList.contains('hidden')){
      playMusicKey(getEffectiveMusicKey(p.id));
      return;
    }
  }
}

// Change le volume de la musique et le sauvegarde (persiste entre les sessions).
function setMusicVolume(vol){
  musicVolume = Math.max(0, Math.min(1, vol));
  try { localStorage.setItem('draftArenaMusicVolume', String(musicVolume)); } catch(e){}
  fadeAudioTo(activeMusicAudio, musicVolume, 150);
}

// Débloque la lecture audio (les navigateurs bloquent l'autoplay sans interaction utilisateur) : appelé sur la première interaction.
function unlockMusic(){
  if(musicUnlocked) return;
  musicUnlocked = true;
  if(!currentTrackKey) updateMusicForActiveScreen();
  activeMusicAudio.volume = 0;
  activeMusicAudio.play().then(()=>{
    fadeAudioTo(activeMusicAudio, musicVolume, MUSIC_FADE_MS);
  }).catch(()=>{});
}

// Fenêtre de réglage du volume de la musique.
function openMusicSettingsModal(){
  const overlay = document.createElement('div');
  overlay.className = 'patchnotes-overlay';
  overlay.innerHTML = `
    <div class="patchnotes-modal" style="max-width:340px;position:relative;">
      <button class="patchnotes-close" id="musicSettingsCloseBtn">${phIcon('x')}</button>
      <h2>◆ PARAMÈTRES ◆</h2>
      <div style="font-size:10px;color:var(--text-dim);margin-bottom:10px;">Volume de la musique</div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:14px;">${phIcon('speaker-low')}</span>
        <input type="range" id="musicVolumeSlider" min="0" max="100" value="${Math.round(musicVolume*100)}" style="flex:1;">
        <span style="font-size:14px;">${phIcon('speaker-high')}</span>
      </div>
      <div style="font-size:10px;color:var(--text-dim);margin:16px 0 8px;">Combats</div>
      <label style="display:flex;align-items:center;gap:8px;font-size:11px;color:var(--text-main);cursor:pointer;margin-bottom:12px;">
        <input type="checkbox" id="effectivenessToggle" ${showMoveEffectiveness?'checked':''}>
        Afficher l'efficacité des attaques (super efficace/peu efficace/aucun effet)
      </label>
      <div style="font-size:10px;color:var(--text-dim);margin-bottom:8px;">Vitesse du jeu</div>
      <div id="gameSpeedTabs" style="display:flex;gap:6px;"></div>
      <div style="font-size:10px;color:var(--text-dim);margin:16px 0 8px;">Langue</div>
      <div id="langTabs" style="display:flex;gap:6px;" data-no-i18n></div>
    </div>`;
  document.body.appendChild(overlay);
  const close = ()=> overlay.remove();
  document.getElementById('musicSettingsCloseBtn').onclick = close;
  overlay.onclick = (e)=>{ if(e.target===overlay) close(); };
  document.getElementById('musicVolumeSlider').oninput = (e)=> setMusicVolume(parseInt(e.target.value)/100);
  document.getElementById('effectivenessToggle').onchange = (e)=> setShowMoveEffectiveness(e.target.checked);
  const speedTabs = document.getElementById('gameSpeedTabs');
  GAME_SPEEDS.forEach(sp=>{
    const btn = document.createElement('button');
    btn.className = 'btn secondary' + (gameSpeed===sp ? ' diff-active' : '');
    btn.style.cssText = 'padding:6px 10px;font-size:10px;flex:1;';
    btn.textContent = 'x'+sp;
    btn.onclick = ()=>{
      setGameSpeed(sp);
      speedTabs.querySelectorAll('button').forEach(b=>b.classList.remove('diff-active'));
      btn.classList.add('diff-active');
    };
    speedTabs.appendChild(btn);
  });
  // Langue de l'interface (voir core/i18n.js) : chaque langue a sa propre page.
  const langTabs = document.getElementById('langTabs');
  [['fr','Français'],['en','English'],['es','Español']].forEach(([code,label])=>{
    const btn = document.createElement('button');
    btn.className = 'btn secondary' + (I18N.lang===code ? ' diff-active' : '');
    btn.style.cssText = 'padding:6px 10px;font-size:10px;flex:1;';
    btn.textContent = label;
    btn.onclick = ()=> I18N.setLang(code);
    langTabs.appendChild(btn);
  });
}
window.addEventListener('pointerdown', unlockMusic, { once:true, capture:true });
window.addEventListener('keydown', unlockMusic, { once:true, capture:true });
window.addEventListener('touchstart', unlockMusic, { once:true, capture:true });

const musicScreenObserver = new MutationObserver(updateMusicForActiveScreen);
document.querySelectorAll('.panel').forEach(p=>{
  musicScreenObserver.observe(p, { attributes:true, attributeFilter:['class'] });
});

document.getElementById('musicSettingsBtn').onclick = openMusicSettingsModal;
updateMusicForActiveScreen();
