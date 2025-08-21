import { useEffect, useMemo, useRef, useState } from 'react';

/** ---------- Config roues ---------- */
const WHEEL_FR = 'FR'; // européenne (0-36)
const WHEEL_US = 'US'; // américaine (0, 00, 1-36)

/** Représentation des tirages en strings: "0","00","1",...,"36" */
const NUMBERS_FR = Array.from({ length: 37 }, (_, i) => String(i));
const NUMBERS_US = ['0', '00'].concat(Array.from({ length: 36 }, (_, i) => String(i + 1)));

const REDS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].map(String));
const BLACKS = new Set(Array.from({ length: 36 }, (_, i) => String(i + 1)).filter(n => !REDS.has(n)));

const STORAGE_KEY_PREFIX = 'roulette_v2';
const key = (wheel) => ({
  spins: `${STORAGE_KEY_PREFIX}:${wheel}:spins`,
  seed:  `${STORAGE_KEY_PREFIX}:${wheel}:seed`,
  wheel: `${STORAGE_KEY_PREFIX}:wheel`,
});

function isZeroLike(s){ return s === '0' || s === '00'; }
function isRed(s){ return REDS.has(s); }
function isBlack(s){ return BLACKS.has(s); }
function isOdd(s){ const n = Number(s); return !isZeroLike(s) && n % 2 === 1; }
function isEven(s){ const n = Number(s); return !isZeroLike(s) && n % 2 === 0; }
function isManque(s){ const n = Number(s); return n >= 1 && n <= 18; }
function isPasse(s){ const n = Number(s); return n >= 19 && n <= 36; }
function dozenOf(s){
  if (isZeroLike(s)) return 0;
  const n = Number(s);
  if (n <= 12) return 1;
  if (n <= 24) return 2;
  return 3;
}
function columnOf(s){
  if (isZeroLike(s)) return 0;
  const mod = Number(s) % 3;
  return mod === 1 ? 1 : mod === 2 ? 2 : 3;
}
function pct(part, total){ return total ? `${((part/total)*100).toFixed(1)}%` : '0%'; }

/** ---------- Streaks ---------- */
function computeStreaks(spins, predicateA, predicateB){
  let current = 0, currentKind = null;
  let maxA = 0, maxB = 0;

  for (const s of spins){
    const a = predicateA(s);
    const b = predicateB(s);
    const kind = a ? 'A' : b ? 'B' : null;

    if (!kind){ current = 0; currentKind = null; continue; }

    if (kind === currentKind) current += 1;
    else { currentKind = kind; current = 1; }

    if (kind === 'A') maxA = Math.max(maxA, current);
    if (kind === 'B') maxB = Math.max(maxB, current);
  }

  // streak courant (depuis la fin)
  let currentLen = 0, currentType = null;
  for (let i = spins.length - 1; i >= 0; i--){
    const s = spins[i];
    const a = predicateA(s);
    const b = predicateB(s);
    const kind = a ? 'A' : b ? 'B' : null;
    if (!kind) break;
    if (!currentType) currentType = kind;
    if (kind === currentType) currentLen += 1;
    else break;
  }

  return {
    current: { type: currentType, len: currentLen },
    max: { A: maxA, B: maxB }
  };
}

/** ---------- Export CSV ---------- */
function downloadCSV(filename, rows){
  const escape = (v) => {
    const s = String(v ?? '');
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
  };
  const csv = rows.map(r => r.map(escape).join(';')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** ---------- Surbrillance prédictive ---------- */
const HIGHLIGHT_COLD = 'COLD';
const HIGHLIGHT_OVERDUE = 'OVERDUE';
const HIGHLIGHT_TOP_K = 5; // combien mettre en avant

// Sous-représentés vs attendu (écart théorique)
function rankCold(numbersList, countsMap, total, p) {
  return numbersList
    .map(n => {
      const obs = countsMap.get(n) || 0;
      const exp = total * p;
      const variance = total * p * (1 - p) || 1e-9;
      const z = (obs - exp) / Math.sqrt(variance);
      return { n, obs, exp, diff: exp - obs, z };
    })
    .sort((a, b) => (b.diff - a.diff) || (a.z - b.z)); // plus grand manque d'abord
}

// Plus longtemps non sortis
function rankOverdue(numbersList, spins) {
  const lastIndex = new Map(numbersList.map(n => [n, -1]));
  spins.forEach((s, i) => lastIndex.set(s, i));
  return numbersList
    .map(n => ({ n, last: lastIndex.get(n) }))
    .sort((a, b) => (a.last - b.last)); // -1 (jamais) en premier
}

/** ---------- UI ---------- */
export default function RouletteStats(){
  const [wheel, setWheel] = useState(WHEEL_FR);
  const [seed, setSeed] = useState(null);
  const [spins, setSpins] = useState([]);  // array of strings ("0","00","1",...)
  const [input, setInput] = useState('');
  const [highlightMode, setHighlightMode] = useState(HIGHLIGHT_COLD);
  const inputRef = useRef(null);

  // charger roue choisie
  useEffect(() => {
    const savedWheel = localStorage.getItem(key().wheel);
    if (savedWheel === WHEEL_US || savedWheel === WHEEL_FR) setWheel(savedWheel);
  }, []);
  // charger données pour la roue
  useEffect(() => {
    const k = key(wheel);
    try {
      const s = localStorage.getItem(k.seed);
      const arr = JSON.parse(localStorage.getItem(k.spins) || '[]');
      if (s) setSeed(s); else setSeed(String(Date.now()));
      setSpins(Array.isArray(arr) ? arr : []);
    } catch { setSeed(String(Date.now())); setSpins([]); }
  }, [wheel]);
  // persister
  useEffect(() => {
    const k = key(wheel);
    try {
      localStorage.setItem(key().wheel, wheel);
      localStorage.setItem(k.spins, JSON.stringify(spins));
      if (!seed){
        const newSeed = String(Date.now());
        setSeed(newSeed);
        localStorage.setItem(k.seed, newSeed);
      } else {
        localStorage.setItem(k.seed, seed);
      }
    } catch {}
  }, [wheel, spins, seed]);

  const NUMBERS = wheel === WHEEL_FR ? NUMBERS_FR : NUMBERS_US;

  /** --------- Stats --------- */
  const stats = useMemo(() => {
    const total = spins.length;
    const counts = new Map(NUMBERS.map(n => [n, 0]));
    for (const s of spins) counts.set(s, (counts.get(s) || 0) + 1);

    const reds   = spins.filter(isRed).length;
    const blacks = spins.filter(isBlack).length;
    const zeros  = spins.filter(isZeroLike).length;
    const odds   = spins.filter(isOdd).length;
    const evens  = spins.filter(isEven).length;
    const manque = spins.filter(isManque).length;
    const passe  = spins.filter(isPasse).length;

    const dozen1 = spins.filter(s => dozenOf(s) === 1).length;
    const dozen2 = spins.filter(s => dozenOf(s) === 2).length;
    const dozen3 = spins.filter(s => dozenOf(s) === 3).length;

    const col1 = spins.filter(s => columnOf(s) === 1).length;
    const col2 = spins.filter(s => columnOf(s) === 2).length;
    const col3 = spins.filter(s => columnOf(s) === 3).length;

    const p = wheel === WHEEL_US ? (1/38) : (1/37);

    const coldRank    = rankCold(NUMBERS, counts, total, p);
    const overdueRank = rankOverdue(NUMBERS, spins);

    return {
      total, counts,
      reds, blacks, zeros,
      odds, evens, manque, passe,
      dozen1, dozen2, dozen3,
      col1, col2, col3,
      p,
      coldRank,
      overdueRank
    };
  }, [spins, NUMBERS, wheel]);

  /** --------- Actions --------- */
  function addNumberString(v){
    const valid = NUMBERS.includes(v);
    if (!valid) return alert(wheel === WHEEL_US ? 'Entrez 0, 00 ou 1–36.' : 'Entrez un nombre 0–36.');
    setSpins(prev => [...prev, v]);
    setInput('');
    inputRef.current?.focus();
  }
  function onSubmit(e){
    e.preventDefault();
    const v = input.trim();
    if (v === '') return;
    if (wheel === WHEEL_US && v === '00') return addNumberString('00');
    const n = Number(v);
    if (Number.isNaN(n)) return alert('Valeur invalide.');
    if (n < 0 || n > 36) return alert('Plage invalide.');
    addNumberString(String(n));
  }
  function quickAdd(v){ addNumberString(v); }
  function resetSeed(){
    const k = key(wheel);
    const newSeed = String(Date.now());
    setSeed(newSeed);
    setSpins([]);
    localStorage.setItem(k.spins, JSON.stringify([]));
    localStorage.setItem(k.seed, newSeed);
  }
  function undo(){ setSpins(prev => prev.slice(0,-1)); }
  function switchWheel(next){
    if (next === wheel) return;
    setWheel(next);
  }

  /** --------- Export CSV --------- */
  function exportCSV(){
    const rows = [];
    rows.push(['Wheel', wheel]);
    rows.push(['Seed', seed || '']);
    rows.push([]);
    rows.push(['Historique']);
    rows.push(['Index','Valeur']);
    spins.forEach((s, i) => rows.push([i+1, s]));
    rows.push([]);

    rows.push(['Statistiques globales']);
    rows.push(['Total tirages', stats.total]);
    rows.push(['Rouges', stats.reds, pct(stats.reds, stats.total)]);
    rows.push(['Noirs', stats.blacks, pct(stats.blacks, stats.total)]);
    rows.push(['Zeros (0/00)', stats.zeros, pct(stats.zeros, stats.total)]);
    rows.push(['Pairs', stats.evens, pct(stats.evens, stats.total)]);
    rows.push(['Impairs', stats.odds, pct(stats.odds, stats.total)]);
    rows.push(['Manque (1-18)', stats.manque, pct(stats.manque, stats.total)]);
    rows.push(['Passe (19-36)', stats.passe, pct(stats.passe, stats.total)]);
    rows.push(['1re douzaine', stats.dozen1, pct(stats.dozen1, stats.total)]);
    rows.push(['2e douzaine', stats.dozen2, pct(stats.dozen2, stats.total)]);
    rows.push(['3e douzaine', stats.dozen3, pct(stats.dozen3, stats.total)]);
    rows.push(['1re colonne', stats.col1, pct(stats.col1, stats.total)]);
    rows.push(['2e colonne', stats.col2, pct(stats.col2, stats.total)]);
    rows.push(['3e colonne', stats.col3, pct(stats.col3, stats.total)]);
    rows.push([]);

    rows.push(['Fréquences par numéro (attendu vs observé)']);
    const numbersList = wheel === WHEEL_US ? NUMBERS_US : NUMBERS_FR;
    const exp = stats.total * stats.p;
    rows.push(['Numéro','Observé','Attendu','Écart (attendu - obs)','% obs']);
    numbersList.forEach(n => {
      const c = stats.counts.get(n) || 0;
      rows.push([n, c, exp.toFixed(2), (exp - c).toFixed(2), pct(c, stats.total)]);
    });

    downloadCSV(`roulette_${wheel}_${seed || 'seed'}.csv`, rows);
  }

  /** --------- Couleurs UI ---------- */
  const COLOR = {
    RED:        '#EF4444',
    BLACK:      '#111827',
    ZERO:       '#16A34A',
    ODD:        '#8B5CF6',
    EVEN:       '#3B82F6',
    MANQUE:     '#F59E0B',
    PASSE:      '#10B981',
    DOZ1:       '#0EA5E9',
    DOZ2:       '#A855F7',
    DOZ3:       '#F97316',
    COL1:       '#22C55E',
    COL2:       '#14B8A6',
    COL3:       '#EAB308',
  };

  // Liste de numéros à surligner selon le mode choisi
  const highlighted =
    highlightMode === HIGHLIGHT_OVERDUE
      ? stats.overdueRank.slice(0, HIGHLIGHT_TOP_K).map(x => x.n)
      : stats.coldRank.slice(0, HIGHLIGHT_TOP_K).map(x => x.n); // défaut: COLD

  const numbersForPad = NUMBERS;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header + switch roue + actions */}
        <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Calculateur Roulette</h1>
            <p className="text-sm text-gray-500">
              Saisis les numéros sortis. Données stockées localement. Seed : <span className="font-mono">{seed || '—'}</span>
            </p>

            {/* Surbrillance prédictive */}
            <div className="inline-flex items-center gap-2">
              <span className="text-xs text-gray-500">Surbrillance :</span>
              <div className="inline-flex rounded-lg border border-gray-300 bg-white overflow-hidden">
                <button
                  className={`px-3 py-1.5 text-sm ${highlightMode===HIGHLIGHT_COLD?'bg-gray-900 text-white':'hover:bg-gray-100'}`}
                  onClick={()=>setHighlightMode(HIGHLIGHT_COLD)}
                  title="Sous-représentés vs attendu (écart théorique)"
                >
                  COLD (écart)
                </button>
                <button
                  className={`px-3 py-1.5 text-sm ${highlightMode===HIGHLIGHT_OVERDUE?'bg-gray-900 text-white':'hover:bg-gray-100'}`}
                  onClick={()=>setHighlightMode(HIGHLIGHT_OVERDUE)}
                  title="Plus longtemps non sortis"
                >
                  OVERDUE
                </button>
              </div>
            </div>

            {highlighted.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500">
                  Mise en avant ({highlightMode === HIGHLIGHT_COLD ? 'écart théorique' : 'ancienneté'}) :
                </span>
                {highlighted.map(n => (
                  <span key={n} className="px-2 py-1 rounded-full border text-xs"
                        style={{
                          borderColor:'#e5e7eb',
                          background: isZeroLike(n) ? '#F0FDF4' : isRed(n) ? '#FEF2F2' : '#F3F4F6',
                          color: isZeroLike(n) ? '#166534' : isRed(n) ? '#B91C1C' : '#111827',
                          fontWeight: 600
                        }}>
                    {n}
                  </span>
                ))}
              </div>
            )}

            <p className="text-[11px] text-gray-500">
              ⚠️ Rappel : chaque tirage est indépendant. Cette surbrillance illustre des écarts à l’attendu (ou l’ancienneté), pas une
              augmentation de probabilité réelle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="inline-flex rounded-lg border border-gray-300 bg-white overflow-hidden">
              <button
                className={`px-3 py-2 ${wheel===WHEEL_FR?'bg-gray-900 text-white':'hover:bg-gray-100'}`}
                onClick={()=>switchWheel(WHEEL_FR)}
              >
                🇫🇷 FR (0)
              </button>
              <button
                className={`px-3 py-2 ${wheel===WHEEL_US?'bg-gray-900 text-white':'hover:bg-gray-100'}`}
                onClick={()=>switchWheel(WHEEL_US)}
              >
                🇺🇸 US (0, 00)
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={undo} disabled={spins.length===0}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50">↩️ Undo</button>
              <button onClick={resetSeed}
                className="px-3 py-2 rounded-lg bg-black text-white hover:opacity-90">Reset seed</button>
              <button onClick={exportCSV}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100">Export CSV</button>
            </div>
          </div>
        </header>

        {/* Entrée + pavé */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <form onSubmit={onSubmit} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium">
                Entrer un numéro {wheel===WHEEL_US ? '(0, 00, 1–36)' : '(0–36)'}
              </label>
              <input
                ref={inputRef}
                value={input}
                onChange={e=>setInput(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-black/20"
                placeholder={wheel===WHEEL_US ? 'Ex: 00 ou 17' : 'Ex: 17'}
              />
            </div>
            <button className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90">Ajouter</button>
          </form>

          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Ajout rapide :</p>
            <div className="grid grid-cols-10 gap-1">
              {numbersForPad.map(n => (
                <button
                  key={n}
                  onClick={() => quickAdd(n)}
                  className="py-1.5 rounded border text-sm hover:bg-gray-100"
                  style={{
                    borderColor: '#e5e7eb',
                    background: isZeroLike(n) ? '#F0FDF4' : isRed(n) ? '#FEF2F2' : '#F3F4F6',
                    color: isZeroLike(n) ? '#166534' : isRed(n) ? '#B91C1C' : '#111827',
                    fontWeight: highlighted.includes(n) ? 700 : 400,
                    boxShadow: highlighted.includes(n) ? 'inset 0 0 0 2px rgba(0,0,0,.12)' : 'none'
                  }}
                  title={`Ajouter ${n}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Résumé principal */}
        <section className="grid md:grid-cols-4 gap-4 mb-6">
          <Card title="Total tirages" value={stats.total} />
          <Card title="Rouges" value={`${stats.reds} (${pct(stats.reds, stats.total)})`} color={COLOR.RED} />
          <Card title="Noirs" value={`${stats.blacks} (${pct(stats.blacks, stats.total)})`} color={COLOR.BLACK} />
          <Card title={`Zero${wheel===WHEEL_US?' (x2)':''}`} value={`${stats.zeros} (${pct(stats.zeros, stats.total)})`} color={COLOR.ZERO} />
        </section>

        {/* Pair/Impair, Manque/Passe */}
        <section className="grid md:grid-cols-4 gap-4 mb-6">
          <Card title="Pairs" value={`${stats.evens} (${pct(stats.evens, stats.total)})`} color={COLOR.EVEN} />
          <Card title="Impairs" value={`${stats.odds} (${pct(stats.odds, stats.total)})`} color={COLOR.ODD} />
          <Card title="Manque (1–18)" value={`${stats.manque} (${pct(stats.manque, stats.total)})`} color={COLOR.MANQUE} />
          <Card title="Passe (19–36)" value={`${stats.passe} (${pct(stats.passe, stats.total)})`} color={COLOR.PASSE} />
        </section>

        {/* Douzaines & Colonnes */}
        <section className="grid md:grid-cols-3 gap-4 mb-6">
          <Card title="1re douzaine (1–12)" value={`${stats.dozen1} (${pct(stats.dozen1, stats.total)})`} color={COLOR.DOZ1} />
          <Card title="2e douzaine (13–24)" value={`${stats.dozen2} (${pct(stats.dozen2, stats.total)})`} color={COLOR.DOZ2} />
          <Card title="3e douzaine (25–36)" value={`${stats.dozen3} (${pct(stats.dozen3, stats.total)})`} color={COLOR.DOZ3} />
        </section>
        <section className="grid md:grid-cols-3 gap-4 mb-10">
          <Card title="1re colonne" value={`${stats.col1} (${pct(stats.col1, stats.total)})`} color={COLOR.COL1} />
          <Card title="2e colonne" value={`${stats.col2} (${pct(stats.col2, stats.total)})`} color={COLOR.COL2} />
          <Card title="3e colonne" value={`${stats.col3} (${pct(stats.col3, stats.total)})`} color={COLOR.COL3} />
        </section>

        {/* Streaks */}
        <section className="grid md:grid-cols-3 gap-4 mb-10">
          <StreakCard title="Séries Rouge / Noir"
            colorA={COLOR.RED} colorB={COLOR.BLACK}
            streak={stats.streakRedBlack || computeStreaks(spins, isRed, isBlack)}
            labelA="Rouge" labelB="Noir" />
          <StreakCard title="Séries Pair / Impair"
            colorA={COLOR.EVEN} colorB={COLOR.ODD}
            streak={stats.streakEvenOdd || computeStreaks(spins, isEven, isOdd)}
            labelA="Pair" labelB="Impair" />
          <StreakCard title="Séries Manque / Passe"
            colorA={COLOR.MANQUE} colorB={COLOR.PASSE}
            streak={stats.streakManquePass || computeStreaks(spins, isManque, isPasse)}
            labelA="Manque" labelB="Passe" />
        </section>

        {/* Fréquence par numéro */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Fréquence par numéro</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-4">Numéro</th>
                  <th className="py-2 pr-4">Couleur</th>
                  <th className="py-2 pr-4">Observé</th>
                  <th className="py-2 pr-4">Attendu</th>
                  <th className="py-2 pr-4">Écart</th>
                  <th className="py-2">% obs</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {NUMBERS.map(n => {
                  const c = stats.counts.get(n) || 0;
                  const exp = stats.total * stats.p;
                  const diff = exp - c; // >0 = sous-représenté
                  const isPred = highlighted.includes(n);
                  const colorName = isZeroLike(n) ? 'Vert' : isRed(n) ? 'Rouge' : 'Noir';
                  return (
                    <tr key={n} className="hover:bg-gray-50" style={isPred ? { background: '#fff7ed' } : undefined}>
                      <td className="py-2 pr-4 font-medium">{n}</td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-block h-2.5 w-2.5 rounded-full"
                                style={{ background: isZeroLike(n) ? COLOR.ZERO : isRed(n) ? COLOR.RED : COLOR.BLACK }} />
                          {colorName}
                        </span>
                      </td>
                      <td className="py-2 pr-4">{c}</td>
                      <td className="py-2 pr-4">{exp.toFixed(2)}</td>
                      <td className="py-2 pr-4">{diff.toFixed(2)}</td>
                      <td className="py-2">{pct(c, stats.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Historique */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Historique</h2>
          {spins.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun tirage enregistré pour cette seed.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {spins.slice().reverse().map((n, idx) => (
                <span key={idx}
                  className="px-2 py-1 rounded border text-sm"
                  style={{
                    borderColor:'#e5e7eb',
                    background: isZeroLike(n) ? '#F0FDF4' : isRed(n) ? '#FEF2F2' : '#F3F4F6',
                    color: isZeroLike(n) ? '#166534' : isRed(n) ? '#B91C1C' : '#111827',
                    fontWeight: highlighted.includes(n) ? 600 : 400
                  }}>
                  {n}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Card({ title, value, color }){
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1" style={{ color: color || 'inherit' }}>{value}</p>
    </div>
  );
}

function StreakCard({ title, streak, colorA, colorB, labelA, labelB }){
  const currentLabel =
    streak.current.type === 'A' ? labelA :
    streak.current.type === 'B' ? labelB : '—';
  const currentColor =
    streak.current.type === 'A' ? colorA :
    streak.current.type === 'B' ? colorB : '#9ca3af';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <div className="mt-2 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded"
              style={{ background:'#f3f4f6', border:'1px solid #e5e7eb' }}>
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: currentColor }} />
          Courant : {currentLabel} × {streak.current.len || 0}
        </span>
        <span className="text-xs text-gray-500">Max {labelA}: {streak.max.A || 0}</span>
        <span className="text-xs text-gray-500">Max {labelB}: {streak.max.B || 0}</span>
      </div>
    </div>
  );
}
