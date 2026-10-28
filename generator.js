// =============================================
// GENERADOR Y VALIDADOR DE SOPAS DE LETRAS
// Se usa en el navegador (modo aleatorio) y en Node (tools/build-fixed.js).
// =============================================
(function (root) {
    // Letras de relleno con frecuencia aproximada del español
    const FILL = 'EEEEEAAAAAOOOOSSSSRRRNNNIIIDDLLLCCTTUUMMPPBGVYQHFZJÑX';
    // Las 4 líneas posibles; leer una línea al revés cubre las otras 4 direcciones
    const LINES = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    const reverse = s => [...s].reverse().join('');

    function mulberry32(seed) {
        return function () {
            seed = (seed + 0x6D2B79F5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    // Cuántas veces aparece la palabra (en cualquier dirección) en la cuadrícula
    function countOccurrences(g, word) {
        const n = g.length, L = word.length, rw = reverse(word);
        let count = 0;
        for (const [dr, dc] of LINES) {
            for (let r = 0; r < n; r++) {
                for (let c = 0; c < n; c++) {
                    const er = r + dr * (L - 1), ec = c + dc * (L - 1);
                    if (er < 0 || er >= n || ec < 0 || ec >= n) continue;
                    let s = '';
                    for (let i = 0; i < L; i++) s += g[r + dr * i][c + dc * i];
                    if (s === word || s === rw) count++;
                }
            }
        }
        return count;
    }

    // Posición de la palabra leída en su sentido: {r, c, dr, dc}
    function locate(g, word) {
        const n = g.length, L = word.length;
        for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]]) {
            for (let r = 0; r < n; r++) {
                for (let c = 0; c < n; c++) {
                    let i = 0;
                    for (; i < L; i++) {
                        const rr = r + dr * i, cc = c + dc * i;
                        if (rr < 0 || rr >= n || cc < 0 || cc >= n || g[rr][cc] !== word[i]) break;
                    }
                    if (i === L) return { r, c, dr, dc };
                }
            }
        }
        return null;
    }

    // Una palabra dentro de otra (p. ej. SOL en SOLAR) haría la sopa ambigua
    function hasConflict(word, words) {
        return words.some(o => o !== word && (o.includes(word) || o.includes(reverse(word)) ||
            word.includes(o) || word.includes(reverse(o))));
    }

    function validate(g, words) {
        return g.every(row => row.length === g.length) &&
            words.every(w => !hasConflict(w, words) && countOccurrences(g, w) === 1);
    }

    function shuffle(arr, rng) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Elige `count` palabras que quepan y no se contengan entre sí
    function pickWords(pool, cfg, rng) {
        const fits = pool.filter(w => w.length <= cfg.size);
        const list = rng ? shuffle([...fits], rng) : fits;
        const out = [];
        for (const w of list) {
            if (out.length === cfg.count) break;
            if (!hasConflict(w, [...out, w])) out.push(w);
        }
        return out;
    }

    // Devuelve {grid: string[]} o null si no logra una sopa válida
    function generate(words, cfg, rng) {
        const n = cfg.size;
        const order = [...words].sort((a, b) => b.length - a.length);
        const letters = words.join('');

        for (let attempt = 0; attempt < 300; attempt++) {
            const g = Array.from({ length: n }, () => Array(n).fill(null));
            let ok = true;

            for (let wi = 0; wi < order.length && ok; wi++) {
                const w = order[wi], L = w.length;
                // La palabra más larga estrena la dirección más nueva del nivel
                const dirs = wi === 0 ? [cfg.dirs[cfg.dirs.length - 1]] : shuffle([...cfg.dirs], rng);
                let placed = false;

                for (const [dr, dc] of dirs) {
                    const cands = [];
                    for (let r = 0; r < n; r++) {
                        for (let c = 0; c < n; c++) {
                            const er = r + dr * (L - 1), ec = c + dc * (L - 1);
                            if (er < 0 || er >= n || ec < 0 || ec >= n) continue;
                            let ov = 0, fit = true;
                            for (let i = 0; i < L; i++) {
                                const ch = g[r + dr * i][c + dc * i];
                                if (ch === null) continue;
                                if (ch !== w[i]) { fit = false; break; }
                                ov++;
                            }
                            if (fit && ov < L) cands.push({ r, c, ov });
                        }
                    }
                    if (!cands.length) continue;
                    const crossing = cands.filter(x => x.ov > 0);
                    const pool = cfg.overlap && crossing.length && rng() < 0.65 ? crossing : cands;
                    const p = pool[Math.floor(rng() * pool.length)];
                    for (let i = 0; i < L; i++) g[p.r + dr * i][p.c + dc * i] = w[i];
                    placed = true;
                    break;
                }
                ok = placed;
            }
            if (!ok) continue;

            for (let f = 0; f < 15; f++) {
                const filled = g.map(row => row.map(ch => ch !== null ? ch :
                    rng() < cfg.bias ? letters[Math.floor(rng() * letters.length)]
                                     : FILL[Math.floor(rng() * FILL.length)]));
                if (validate(filled, words)) return { grid: filled.map(row => row.join('')) };
            }
        }
        return null;
    }

    const api = { mulberry32, countOccurrences, locate, validate, pickWords, generate, reverse };
    if (typeof module !== 'undefined') module.exports = api;
    else root.SopaGen = api;
})(this);
