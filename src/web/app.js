/* ───────────────────────────────────────────────────────────
   RIASEC Vocational Prediction — Web Client
   Talks to FastAPI at /questions and /predict
─────────────────────────────────────────────────────────── */

const API_BASE = '';  // same origin (served by FastAPI)

// ── Metadata ────────────────────────────────────────────────
const DIM_META = {
  R: { name: 'Realista',      desc: 'Prático · Técnico · Manual',          color: 'rgb(250,84,84)',   css: 'dim-R' },
  I: { name: 'Investigativo', desc: 'Analítico · Científico · Curioso',    color: 'rgb(99,102,241)',  css: 'dim-I' },
  A: { name: 'Artístico',     desc: 'Criativo · Expressivo · Inovador',    color: 'rgb(251,146,60)',  css: 'dim-A' },
  S: { name: 'Social',        desc: 'Empático · Comunicativo · Solidário', color: 'rgb(52,211,153)',  css: 'dim-S' },
  E: { name: 'Empreendedor',  desc: 'Líder · Persuasivo · Ambicioso',      color: 'rgb(251,191,36)',  css: 'dim-E' },
  C: { name: 'Convencional',  desc: 'Organizado · Detalhista · Rigoroso',  color: 'rgb(139,92,246)',  css: 'dim-C' },
};

const BIG5_META = [
  { key: 'extraversion',      label: 'Extraversão',         color: '#6c63ff' },
  { key: 'agreeableness',     label: 'Amabilidade',         color: '#34d399' },
  { key: 'conscientiousness', label: 'Conscienciosidade',   color: '#60a5fa' },
  { key: 'neuroticism',       label: 'Neuroticismo',        color: '#f87171' },
  { key: 'openness',          label: 'Abertura',            color: '#fbbf24' },
];

const LIKERT_LABELS = {
  1: '1', 2: '2', 3: '3', 4: '4', 5: '5',
};

// ── State ────────────────────────────────────────────────────
const App = (() => {
  let questions    = [];   // [{id, code, dimension, text}, ...]
  let answers      = {};   // {R2: 3, I1: 4, ...}
  let currentDim   = 0;    // index into DIM_ORDER
  let radarChart   = null;

  const DIM_ORDER = ['R', 'I', 'A', 'S', 'E', 'C'];
  const TOTAL_Qs  = 30;

  // ── Helpers ────────────────────────────────────────────────

  function show(id) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
      s.style.display = '';   // clear inline style so CSS display:none takes over
    });
    const el = document.getElementById(id);
    el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function countAnswered() {
    return Object.keys(answers).filter(k => questions.find(q => q.code === k)).length;
  }

  function updateProgress(count) {
    const pct = (count / TOTAL_Qs) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-label').textContent = `${count} / ${TOTAL_Qs}`;
  }

  // ── Start ──────────────────────────────────────────────────

  async function start() {
    show('screen-loading');
    try {
      const res = await fetch(`${API_BASE}/questions`);
      if (!res.ok) throw new Error('API offline');
      questions = await res.json();
    } catch(e) {
      alert('Não foi possível ligar à API. Verifica se o servidor está em funcionamento.');
      show('screen-cover');
      return;
    }
    currentDim = 0;
    answers = {};
    renderDim();
    show('screen-questions');
  }

  // ── Render dimension card ──────────────────────────────────

  function renderDim() {
    const letter = DIM_ORDER[currentDim];
    const meta   = DIM_META[letter];
    const dimQs  = questions.filter(q => q.dimension === letter);

    updateProgress(countAnswered());

    // prev/next buttons
    document.getElementById('btn-prev').disabled = currentDim === 0;
    const allAnswered = dimQs.every(q => answers[q.code] !== undefined);
    document.getElementById('btn-next').textContent =
      currentDim === DIM_ORDER.length - 1 ? 'Continuar →' : 'Próximo →';
    document.getElementById('btn-next').disabled = !allAnswered;

    const card = document.getElementById('dim-card');
    card.className = `dim-card ${meta.css}`;

    card.innerHTML = `
      <div class="dim-header">
        <div class="dim-dot" style="background:${meta.color}"></div>
        <div>
          <div class="dim-label">${letter} · Dimensão ${currentDim + 1} de 6</div>
          <div class="dim-name">${meta.name}</div>
          <div class="dim-desc">${meta.desc}</div>
        </div>
      </div>
      <div class="scale-hint">
        <span>Não gostaria nada</span>
        <span>Gostaria muito</span>
      </div>
      ${dimQs.map(q => renderQuestion(q, meta.color)).join('')}
    `;
  }

  function renderQuestion(q, color) {
    const cur = answers[q.code];
    const buttons = [1,2,3,4,5].map(v => {
      const sel = cur === v ? 'selected' : '';
      return `<button class="likert-btn ${sel}"
                onclick="App.answer('${q.code}', ${v})">${v}</button>`;
    }).join('');

    return `
      <div class="question-item" id="qitem-${q.code}">
        <div class="question-text">${q.text}</div>
        <div class="likert" id="likert-${q.code}">${buttons}</div>
      </div>
    `;
  }

  // answer — called from inline onclick
  function answer(code, value) {
    answers[code] = value;

    // update just the likert row
    const wrap = document.getElementById(`likert-${code}`);
    if (wrap) {
      wrap.querySelectorAll('.likert-btn').forEach((btn, idx) => {
        btn.classList.toggle('selected', idx + 1 === value);
      });
    }

    updateProgress(countAnswered());

    // enable next if all in current dim answered
    const letter = DIM_ORDER[currentDim];
    const dimQs  = questions.filter(q => q.dimension === letter);
    const allAnswered = dimQs.every(q => answers[q.code] !== undefined);
    document.getElementById('btn-next').disabled = !allAnswered;
  }

  function nextDim() {
    if (currentDim < DIM_ORDER.length - 1) {
      currentDim++;
      renderDim();
      document.getElementById('dim-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // All 6 dimensions done → demographics
      show('screen-demo');
    }
  }

  function prevDim() {
    if (currentDim > 0) {
      currentDim--;
      renderDim();
    }
  }

  // ── Submit Predict ─────────────────────────────────────────

  async function submitPredict() {
    show('screen-loading');

    const age  = parseInt(document.getElementById('d-age').value)  || 25;
    const gender = parseInt(document.getElementById('d-gender').value) || 1;
    const edu  = parseInt(document.getElementById('d-edu').value)   || 3;

    const payload = { ...answers, age, gender, education: edu };

    try {
      const res  = await fetch(`${API_BASE}/predict`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Erro na previsão');
      }
      const data = await res.json();
      renderResults(data);
      show('screen-results');
    } catch(e) {
      alert(`Erro: ${e.message}`);
      show('screen-demo');
    }
  }

  // ── Render Results ─────────────────────────────────────────

  function renderResults(data) {
    // Holland code
    document.getElementById('r-code').textContent = data.holland_code;
    document.getElementById('r-code-names').textContent =
      data.holland_code.split('').map(l => DIM_META[l]?.name || l).join(' · ');

    renderRadar(data.riasec_scores);
    renderDimList(data.riasec_scores);
    renderBig5(data.big5);
    renderCareers(data.careers);
  }

  function renderRadar(scores) {
    const labels = scores.map(s => s.letter);
    const values = scores.map(s => s.score);
    const colors = scores.map(s => DIM_META[s.letter]?.color || '#6c63ff');

    const borderColors = scores.map(s => DIM_META[s.letter]?.color || '#6c63ff');

    if (radarChart) { radarChart.destroy(); radarChart = null; }

    const ctx = document.getElementById('radar-chart').getContext('2d');
    radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: 'rgba(108,99,255,.9)',
          backgroundColor: 'rgba(108,99,255,.15)',
          borderWidth: 2,
          pointBackgroundColor: borderColors,
          pointRadius: 5,
          pointHoverRadius: 7,
        }],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            min: 1, max: 5,
            ticks: {
              stepSize: 1,
              color: 'rgba(148,144,181,.5)',
              font: { size: 10 },
              backdropColor: 'transparent',
            },
            grid:       { color: 'rgba(46,45,69,.8)' },
            angleLines: { color: 'rgba(46,45,69,.8)' },
            pointLabels: {
              color: '#e8e6f0',
              font: { size: 13, weight: '700' },
            },
          },
        },
        plugins: { legend: { display: false } },
        elements: { line: { tension: 0.15 } },
      },
    });
  }

  function renderDimList(scores) {
    const sorted = [...scores].sort((a, b) => b.score - a.score);
    const list   = document.getElementById('r-dim-list');
    list.innerHTML = sorted.map(s => {
      const color = DIM_META[s.letter]?.color || '#6c63ff';
      const pct   = ((s.score - 1) / 4) * 100;
      return `
        <div class="r-dim-item">
          <div class="r-dim-dot" style="background:${color}"></div>
          <span>${s.letter} · ${s.dimension}</span>
          <div class="r-dim-bar-wrap">
            <div class="r-dim-bar" style="width:${pct}%;background:${color}"></div>
          </div>
          <span class="r-dim-score">${s.score.toFixed(2)}</span>
        </div>
      `;
    }).join('');
  }

  function renderBig5(big5) {
    const wrap = document.getElementById('big5-bars');
    wrap.innerHTML = BIG5_META.map(trait => {
      const val = big5[trait.key] ?? 0;
      const pct = ((val - 1) / 6) * 100;
      return `
        <div class="big5-row">
          <div class="big5-meta">
            <span class="big5-trait">${trait.label}</span>
            <span class="big5-val">${val.toFixed(2)} / 7</span>
          </div>
          <div class="big5-track">
            <div class="big5-fill" style="width:${pct}%;background:${trait.color}"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderCareers(careers) {
    const list = document.getElementById('career-list');
    if (!careers.length) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:.88rem">Sem sugestões disponíveis para este código.</p>';
      return;
    }
    list.innerHTML = careers.map(c => `
      <div class="career-item">
        <div class="career-title">${c.titulo}</div>
        <div class="career-desc">${c.descricao}</div>
      </div>
    `).join('');
  }

  // ── Restart ────────────────────────────────────────────────

  function restart() {
    answers    = {};
    currentDim = 0;
    show('screen-cover');
  }

  // Public API
  return { start, answer, nextDim, prevDim, submitPredict, restart };
})();
