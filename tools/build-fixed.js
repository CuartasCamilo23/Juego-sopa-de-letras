// Genera levels-fixed.js (modo fijo) y comprueba que el modo aleatorio nunca falle.
// Uso: node tools/build-fixed.js
const fs = require('fs');
const path = require('path');
const { THEMES, levelConfig } = require('../levels-data.js');
const G = require('../generator.js');

const out = [];
THEMES.forEach((t, i) => {
    const n = i + 1, cfg = levelConfig(n);
    const words = G.pickWords(t.words, cfg, null);
    if (words.length !== cfg.count) throw new Error(`Nivel ${n}: solo ${words.length}/${cfg.count} palabras caben`);
    const res = G.generate(words, cfg, G.mulberry32(n * 7919));
    if (!res || !G.validate(res.grid, words)) throw new Error(`Nivel ${n}: no se pudo generar`);
    out.push({ theme: t.theme, words, grid: res.grid });

    // Autoprueba del modo aleatorio: 40 partidas por nivel
    const rng = G.mulberry32(n);
    for (let k = 0; k < 40; k++) {
        const w = G.pickWords(t.words, cfg, rng);
        const r = G.generate(w, cfg, rng);
        if (w.length !== cfg.count || !r || !G.validate(r.grid, w)) throw new Error(`Aleatorio nivel ${n} falló`);
    }
});

const body = out.map((l, i) => `    // Nivel ${i + 1} - ${l.theme} (${l.grid.length}x${l.grid.length})\n    {\n        theme: ${JSON.stringify(l.theme)},\n        words: ${JSON.stringify(l.words)},\n        grid: [\n${l.grid.map(r => `            "${r}"`).join(',\n')}\n        ]\n    }`).join(',\n');
fs.writeFileSync(path.join(__dirname, '..', 'levels-fixed.js'),
    `// Niveles FIJOS generados por tools/build-fixed.js y validados (cada palabra aparece exactamente una vez).\nvar FIXED_LEVELS = [\n${body}\n];\n`);
console.log('OK: 100 niveles fijos + 4000 sopas aleatorias validadas');
