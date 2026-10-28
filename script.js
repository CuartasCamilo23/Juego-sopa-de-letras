// =============================================
// SOPA DE LETRAS - lógica del juego
// Modo "fijo": niveles siempre iguales (levels-fixed.js)
// Modo "aleatorio": cada partida genera palabras y posiciones nuevas, validadas
// =============================================
const MODE = new URLSearchParams(location.search).get('modo') === 'aleatorio' ? 'aleatorio' : 'fijo';
const STORE_KEY = 'sopa-progreso-' + MODE;
const MAX_HINTS = 3;
const TOTAL_LEVELS = FIXED_LEVELS.length;
const DIRS8 = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]]; // [dr, dc] por ángulo

const $ = id => document.getElementById(id);
const board = $('board'), grid = $('grid'), svg = $('board-svg'), preview = $('selection-preview');
const wordList = $('word-list'), toast = $('toast');
const SVG_NS = 'http://www.w3.org/2000/svg';

// =============================================
// PROGRESO GUARDADO
// =============================================
function loadProgress() {
    try {
        const p = JSON.parse(localStorage.getItem(STORE_KEY));
        if (p && p.unlocked) return p;
    } catch (e) { /* almacenamiento no disponible */ }
    return { unlocked: 1, stars: {}, current: 1 };
}
function saveProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* sin persistencia */ }
}
const progress = loadProgress();
let soundOn = (() => { try { return localStorage.getItem('sopa-sonido') !== 'off'; } catch (e) { return true; } })();

// =============================================
// ESTADO DEL NIVEL
// =============================================
let level = null;        // { n, theme, words, grid, size, placements }
let found = new Map();   // palabra -> color
let hintsLeft = MAX_HINTS;
let startTime = 0, elapsed = 0, timerId = null, finished = false;

function buildLevel(n) {
    const fixed = FIXED_LEVELS[n - 1];
    let data = fixed;
    if (MODE === 'aleatorio') {
        const cfg = levelConfig(n);
        const rng = SopaGen.mulberry32((Math.random() * 2 ** 32) >>> 0);
        const words = SopaGen.pickWords(THEMES[n - 1].words, cfg, rng);
        const res = words.length === cfg.count && SopaGen.generate(words, cfg, rng);
        // Respaldo: si (rarísimo) no se logra una sopa válida, se usa la fija
        if (res) data = { theme: fixed.theme, words, grid: res.grid };
    }
    const g = data.grid.map(row => [...row]);
    const placements = {};
    data.words.forEach(w => { placements[w] = SopaGen.locate(g, w); });
    return { n, theme: data.theme, words: data.words, grid: g, size: g.length, placements };
}

function loadLevel(n) {
    n = Math.max(1, Math.min(TOTAL_LEVELS, n));
    level = buildLevel(n);
    found = new Map();
    hintsLeft = MAX_HINTS;
    finished = false;
    resetSelection();
    progress.current = n;
    saveProgress();

    document.body.className = `level-bg-${n}`;
    $('current-level').textContent = n;
    $('level-theme').textContent = level.theme;
    $('mode-label').textContent = MODE === 'fijo' ? 'Clásico' : 'Aleatorio';
    $('restart-label').textContent = MODE === 'fijo' ? 'Reiniciar' : 'Nueva sopa';

    board.style.setProperty('--n', level.size);
    svg.setAttribute('viewBox', `0 0 ${level.size} ${level.size}`);
    svg.innerHTML = '<g id="found-layer"></g><g id="fx-layer"></g>';
    grid.innerHTML = '';
    level.grid.forEach((row, r) => row.forEach((ch, c) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = ch;
        cell.dataset.r = r;
        cell.dataset.c = c;
        grid.appendChild(cell);
    }));

    wordList.innerHTML = '';
    [...level.words].sort().forEach(w => {
        const li = document.createElement('li');
        li.textContent = w;
        li.dataset.word = w;
        wordList.appendChild(li);
    });

    updateHud();
    $('prev-level').disabled = n === 1;
    $('next-level').disabled = n >= TOTAL_LEVELS || n >= progress.unlocked;

    clearInterval(timerId);
    elapsed = 0;
    startTime = Date.now();
    timerId = setInterval(tick, 1000);
    tick();
}

function tick() {
    if (finished || document.hidden) return;
    elapsed = Math.floor((Date.now() - startTime) / 1000);
    $('timer').textContent = formatTime(elapsed);
}
// Pausar el reloj cuando la pestaña no está visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) startTime = Date.now() - elapsed * 1000;
});
const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function updateHud() {
    $('found-count').textContent = `${found.size}/${level.words.length}`;
    $('hint-stat').textContent = hintsLeft;
    $('hint-badge').textContent = hintsLeft;
    $('hint-btn').disabled = hintsLeft === 0 || finished;
    $('level-progress').style.width = `${found.size / level.words.length * 100}%`;
}

// =============================================
// SELECCIÓN: arrastre fluido con ajuste a 8 direcciones + toque-toque
// =============================================
let down = null;      // { r, c, x, y } donde se presionó
let moved = false;
let pending = null;   // primera letra elegida en modo toque-toque
let line = null;      // { r, c, dr, dc, steps } selección actual

function pointToGrid(e) {
    const rect = grid.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / rect.width * level.size,
        y: (e.clientY - rect.top) / rect.height * level.size
    };
}

// Línea desde la celda inicial hacia el puntero, ajustada al ángulo de 45° más cercano
function snapLine(start, p) {
    const dx = p.x - (start.c + 0.5), dy = p.y - (start.r + 0.5);
    if (Math.hypot(dx, dy) < 0.5) return { r: start.r, c: start.c, dr: 0, dc: 0, steps: 0 };
    const k = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8;
    const [dr, dc] = DIRS8[k];
    let steps = Math.max(0, Math.round((dx * dc + dy * dr) / (dc * dc + dr * dr)));
    const n = level.size;
    while (steps > 0) {
        const er = start.r + dr * steps, ec = start.c + dc * steps;
        if (er >= 0 && er < n && ec >= 0 && ec < n) break;
        steps--;
    }
    return { r: start.r, c: start.c, dr, dc, steps };
}

const lineCells = l => Array.from({ length: l.steps + 1 }, (_, i) => [l.r + l.dr * i, l.c + l.dc * i]);
const lineText = l => lineCells(l).map(([r, c]) => level.grid[r][c]).join('');

function makePill(l, cls, color) {
    const el = document.createElementNS(SVG_NS, 'line');
    el.setAttribute('x1', l.c + 0.5);
    el.setAttribute('y1', l.r + 0.5);
    el.setAttribute('x2', l.c + l.dc * l.steps + 0.5);
    el.setAttribute('y2', l.r + l.dr * l.steps + 0.5);
    el.setAttribute('stroke-width', 0.8);
    el.setAttribute('class', cls);
    if (color) el.style.stroke = color;
    return el;
}

function drawActive(l) {
    const old = $('active-pill');
    if (old) old.remove();
    document.querySelectorAll('.cell.sel').forEach(c => c.classList.remove('sel'));
    if (!l) { preview.classList.remove('visible'); return; }
    const pill = makePill(l, 'pill-active');
    pill.id = 'active-pill';
    $('fx-layer').appendChild(pill);
    lineCells(l).forEach(([r, c]) => cellAt(r, c).classList.add('sel'));
    preview.textContent = lineText(l);
    preview.className = 'selection-preview visible';
}

function drawPending(cell) {
    const old = $('pending-dot');
    if (old) old.remove();
    if (!cell) return;
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.id = 'pending-dot';
    dot.setAttribute('cx', cell.c + 0.5);
    dot.setAttribute('cy', cell.r + 0.5);
    dot.setAttribute('r', 0.42);
    dot.setAttribute('class', 'pill-pending');
    $('fx-layer').appendChild(dot);
}

const cellAt = (r, c) => grid.children[r * level.size + c];

function resetSelection() {
    down = null; moved = false; pending = null; line = null;
    if ($('fx-layer')) { drawActive(null); drawPending(null); }
}

board.addEventListener('pointerdown', e => {
    if (finished || e.button > 0) return;
    e.preventDefault();
    const p = pointToGrid(e);
    const r = Math.floor(p.y), c = Math.floor(p.x);
    if (r < 0 || c < 0 || r >= level.size || c >= level.size) return;
    board.setPointerCapture(e.pointerId);
    down = { r, c, x: e.clientX, y: e.clientY };
    moved = false;
    drawActive({ r, c, dr: 0, dc: 0, steps: 0 });
    beep(520, 0.03);
});

board.addEventListener('pointermove', e => {
    if (!down) return;
    const cellPx = grid.getBoundingClientRect().width / level.size;
    if (!moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) < cellPx * 0.35) return;
    if (!moved) { moved = true; pending = null; drawPending(null); }
    const l = snapLine(down, pointToGrid(e));
    if (!line || l.steps !== line.steps || l.dr !== line.dr || l.dc !== line.dc) {
        if (line && l.steps > line.steps) beep(560 + l.steps * 40, 0.025);
        line = l;
        drawActive(l);
    }
});

board.addEventListener('pointerup', () => {
    if (!down) return;
    const start = down;
    down = null;
    if (moved) {
        submit(line);
    } else if (pending && (pending.r !== start.r || pending.c !== start.c)) {
        // Segundo toque: se ajusta igual que el arrastre, así no hay que ser exacto
        const l = snapLine(pending, { x: start.c + 0.5, y: start.r + 0.5 });
        pending = null;
        drawPending(null);
        submit(l);
    } else if (pending) {
        pending = null;            // tocar la misma letra cancela
        drawPending(null);
        drawActive(null);
    } else {
        pending = { r: start.r, c: start.c };
        drawActive(null);
        drawPending(pending);
        showToast('Ahora toca la última letra');
    }
    line = null;
});

board.addEventListener('pointercancel', () => { down = null; line = null; drawActive(null); });

function submit(l) {
    if (!l || l.steps === 0) { drawActive(null); return; }
    const text = lineText(l), rev = SopaGen.reverse(text);
    const word = level.words.find(w => !found.has(w) && (w === text || w === rev));
    if (word) {
        markFound(word, l);
        drawActive(null);
        return;
    }
    const pill = $('active-pill');
    if (level.words.some(w => w === text || w === rev)) showToast('Ya encontraste esa palabra');
    if (pill) {
        pill.id = '';
        pill.classList.add('bad');
        setTimeout(() => pill.remove(), 420);
    }
    preview.classList.add('bad');
    setTimeout(() => preview.classList.remove('visible', 'bad'), 420);
    document.querySelectorAll('.cell.sel').forEach(c => c.classList.remove('sel'));
    beep(180, 0.12, 'sawtooth');
    vibrate(40);
}

// =============================================
// PALABRA ENCONTRADA / VICTORIA
// =============================================
function markFound(word, l) {
    const color = `hsl(${(found.size * 137.5 + level.n * 23) % 360} 75% 55%)`;
    found.set(word, color);
    $('found-layer').appendChild(makePill(l, 'pill-found', color));
    lineCells(l).forEach(([r, c]) => cellAt(r, c).classList.add('found'));

    preview.classList.add('ok');
    setTimeout(() => preview.classList.remove('visible', 'ok'), 500);

    const li = wordList.querySelector(`li[data-word="${word}"]`);
    li.style.setProperty('--c', color);
    li.classList.add('found', 'just-found');
    setTimeout(() => li.classList.remove('just-found'), 600);

    chime();
    vibrate([60, 40, 60]);
    updateHud();
    if (found.size === level.words.length) setTimeout(winLevel, 500);
}

function calcStars() {
    const cfg = levelConfig(level.n);
    const target = cfg.count * (8 + cfg.size);   // segundos para tiempo "excelente"
    let stars = 3;
    if (elapsed > target) stars--;
    if (elapsed > target * 2) stars--;
    stars -= MAX_HINTS - hintsLeft;
    return Math.max(1, stars);
}

function winLevel() {
    finished = true;
    clearInterval(timerId);
    updateHud();
    const n = level.n, stars = calcStars();
    progress.stars[n] = Math.max(progress.stars[n] || 0, stars);
    progress.unlocked = Math.max(progress.unlocked, Math.min(TOTAL_LEVELS, n + 1));
    saveProgress();
    $('next-level').disabled = n >= TOTAL_LEVELS;

    const isLast = n === TOTAL_LEVELS;
    $('victory-title').textContent = isLast ? '¡Completaste los 100 niveles!' : '¡Nivel completado!';
    $('victory-text').textContent = isLast
        ? '¡Eres un maestro de la sopa de letras!'
        : `Encontraste las ${level.words.length} palabras de "${level.theme}".`;
    $('victory-stats').innerHTML =
        `<span>⏱ ${formatTime(elapsed)}</span><span>💡 ${MAX_HINTS - hintsLeft} pistas</span>`;
    document.querySelectorAll('#victory-modal .star').forEach((s, i) => s.classList.toggle('on', i < stars));
    $('next-level-modal').style.display = isLast ? 'none' : '';
    openModal('victory-modal');
    confetti();
    fanfare();
}

// =============================================
// PISTAS
// =============================================
function useHint() {
    if (hintsLeft === 0 || finished) return;
    const remaining = level.words.filter(w => !found.has(w));
    if (!remaining.length) return;
    const word = remaining[Math.floor(Math.random() * remaining.length)];
    const p = level.placements[word];
    hintsLeft--;
    updateHud();
    const ring = document.createElementNS(SVG_NS, 'circle');
    ring.setAttribute('cx', p.c + 0.5);
    ring.setAttribute('cy', p.r + 0.5);
    ring.setAttribute('r', 0.46);
    ring.setAttribute('stroke-width', 0.1);
    ring.setAttribute('class', 'hint-ring');
    $('fx-layer').appendChild(ring);
    setTimeout(() => ring.remove(), 3000);
    showToast(`Pista: "${word}" empieza aquí`);
    beep(880, 0.08);
}

// =============================================
// SELECTOR DE NIVELES Y MODALES
// =============================================
function renderLevelGrid() {
    const box = $('level-grid');
    box.innerHTML = '';
    for (let n = 1; n <= TOTAL_LEVELS; n++) {
        const b = document.createElement('button');
        const stars = progress.stars[n] || 0;
        const locked = n > progress.unlocked;
        b.className = 'level-btn' + (locked ? ' locked' : '') + (stars ? ' done' : '') + (n === level.n ? ' current' : '');
        b.disabled = locked;
        b.innerHTML = `<span class="lvl-num">${locked ? '🔒' : n}</span><span class="lvl-stars">${'★'.repeat(stars)}<i>${'★'.repeat(3 - stars)}</i></span>`;
        b.setAttribute('aria-label', `Nivel ${n}${locked ? ' bloqueado' : ''}`);
        b.addEventListener('click', () => { closeModal('levels-modal'); loadLevel(n); });
        box.appendChild(b);
    }
    setTimeout(() => box.querySelector('.current')?.scrollIntoView({ block: 'center' }), 50);
}

function openModal(id) { $(id).classList.add('active'); }
function closeModal(id) { $(id).classList.remove('active'); }

let toastTimer = null;
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 1600);
}

function confetti() {
    for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-piece';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.background = `hsl(${Math.random() * 360} 85% 60%)`;
        p.style.animationDelay = Math.random() * 0.6 + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 3000);
    }
}

// =============================================
// SONIDO Y VIBRACIÓN (sin archivos: Web Audio)
// =============================================
let audioCtx = null;
function beep(freq, dur, type = 'sine', delay = 0) {
    if (!soundOn) return;
    try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const t = audioCtx.currentTime + delay;
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + dur);
    } catch (e) { /* audio no disponible */ }
}
const chime = () => [660, 880, 1100].forEach((f, i) => beep(f, 0.15, 'triangle', i * 0.07));
const fanfare = () => [523, 659, 784, 1046].forEach((f, i) => beep(f, 0.25, 'triangle', i * 0.12));
const vibrate = p => navigator.vibrate && navigator.vibrate(p);

function updateSoundIcon() {
    $('sound-btn').querySelector('span').textContent = soundOn ? 'volume_up' : 'volume_off';
}

// =============================================
// EVENTOS DE BOTONES E INICIO
// =============================================
$('prev-level').addEventListener('click', () => loadLevel(level.n - 1));
$('next-level').addEventListener('click', () => loadLevel(level.n + 1));
$('restart-level').addEventListener('click', () => loadLevel(level.n));
$('hint-btn').addEventListener('click', useHint);
$('levels-btn').addEventListener('click', () => { renderLevelGrid(); openModal('levels-modal'); });
$('close-levels').addEventListener('click', () => closeModal('levels-modal'));
$('replay-modal').addEventListener('click', () => { closeModal('victory-modal'); loadLevel(level.n); });
$('next-level-modal').addEventListener('click', () => { closeModal('victory-modal'); loadLevel(level.n + 1); });
$('start-game').addEventListener('click', () => {
    closeModal('tutorial-modal');
    try { localStorage.setItem('sopa-tutorial', '1'); } catch (e) { /* sin persistencia */ }
});
$('sound-btn').addEventListener('click', () => {
    soundOn = !soundOn;
    try { localStorage.setItem('sopa-sonido', soundOn ? 'on' : 'off'); } catch (e) { /* sin persistencia */ }
    updateSoundIcon();
});
document.querySelectorAll('.modal').forEach(m => m.addEventListener('click', e => {
    if (e.target === m && m.id === 'levels-modal') closeModal(m.id);
}));

updateSoundIcon();
const askedLevel = parseInt(new URLSearchParams(location.search).get('nivel'), 10);
loadLevel(askedLevel && askedLevel <= progress.unlocked ? askedLevel : Math.min(progress.current || 1, progress.unlocked));
try { if (!localStorage.getItem('sopa-tutorial')) setTimeout(() => openModal('tutorial-modal'), 400); } catch (e) { /* ignorar */ }
