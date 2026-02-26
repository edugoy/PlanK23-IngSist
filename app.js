// Estados y orden de ciclo al click
const STATE = {
  LOCKED: "locked",
  AVAILABLE: "available",
  IN_PROGRESS: "in_progress",
  REGULARIZED: "regularized",
  APPROVED: "approved",
};

// Click: available -> in_progress -> regularized -> approved -> available
const CYCLE = [STATE.AVAILABLE, STATE.IN_PROGRESS, STATE.REGULARIZED, STATE.APPROVED];

// Materias (id = código corto) + requisitos según el PDF (pág. 1).
// Nota: "Aprobada" implica también "Regularizada" (tu regla).
const curriculum = [
  // NIVEL 1
  { id:"SyPN", name:"Sistemas y Procesos de Negocio", year:1, term:"Anual 3Hs", order: 1, req:{ reg:[], app:[] } },
  { id:"LyED", name:"Lógica y Estructuras Discretas", year:1, term:"Anual 3Hs", order: 2, req:{ reg:[], app:[] } },
  { id:"F1",   name:"Física I", year:1, term:"Anual 5Hs", order: 3, req:{ reg:[], app:[] } },
  { id:"AGA",  name:"Álgebra y Geometría Analítica", year:1, term:"Anual 5Hs", order: 4, req:{ reg:[], app:[] } },
  { id:"AM1",  name:"Análisis Matemático I", year:1, term:"Anual 5Hs", order: 5, req:{ reg:[], app:[] } },
  { id:"IngSoc", name:"Ingeniería y Sociedad", year:1, term:"2° Cuatr. 4Hs", order: 6, req:{ reg:[], app:[] } },
  { id:"AdC",  name:"Arquitectura de Computadoras", year:1, term:"Anual 4Hs", order: 7, req:{ reg:[], app:[] } },
  { id:"AyED", name:"Algoritmos y Estructuras de Datos", year:1, term:"Anual 5Hs", order: 8, req:{ reg:[], app:[] } },

  // NIVEL 2
  { id:"ASI", name:"Análisis de Sistemas de Información", year:2, term:"Anual 6Hs", order: 1, req:{ reg:["SyPN","AyED"], app:[] } },
  { id:"AM2", name:"Análisis Matemático II", year:2, term:"Anual 5Hs", order: 2, req:{ reg:["AM1","AGA"], app:[] } },
  { id:"SySL", name:"Sintaxis y Semántica de los Lenguajes", year:2, term:"Anual 4Hs", order: 3, req:{ reg:["LyED","AyED"], app:[] } },
  { id:"PdP", name:"Paradigmas de Programación", year:2, term:"Anual 4Hs", order: 4, req:{ reg:["LyED","AyED"], app:[] } },
  { id:"Ingles1", name:"Inglés I", year:2, term:"Anual 2Hs", order: 5, req:{ reg:[], app:[] } },
  { id:"SSOO", name:"Sistemas Operativos", year:2, term:"Cuatr. 8Hs", order: 6, req:{ reg:["AdC"], app:[] } },
  { id:"PyE", name:"Probabilidad y Estadística", year:2, term:"Cuatr. 6Hs", order: 7, req:{ reg:["AM1","AGA"], app:[] } },
  { id:"F2", name:"Física II", year:2, term:"Anual 5Hs", order: 8, req:{ reg:["AM1","F1"], app:[] } },

  // NIVEL 3
  { id:"DSI", name:"Diseño de Sistemas de Información", year:3, term:"Anual 6Hs", order: 1, req:{ reg:["ASI","PdP"], app:["Ingles1","AyED","SyPN"] } },
  { id:"Ingles2", name:"Inglés II", year:3, term:"Anual 2Hs", order: 2, req:{ reg:["Ingles1"], app:[] } },
  { id:"ECO", name:"Economía", year:3, term:"Cuatr. 6Hs", order: 3, req:{ reg:[], app:["AM1","AGA"] } },
  { id:"BD", name:"Bases de Datos", year:3, term:"Cuatr. 8Hs", order: 4, req:{ reg:["SySL","ASI"], app:["LyED","AyED"] } },
  { id:"DdS", name:"Desarrollo de Software", year:3, term:"Cuatr. 8Hs", order: 5, req:{ reg:["PdP","ASI"], app:["LyED","AyED"] } },
  { id:"CD", name:"Comunicación de Datos", year:3, term:"Cuatr. 8Hs", order: 6, req:{ reg:[], app:["AdC","F1"] } },
  { id:"RD", name:"Redes de Datos", year:3, term:"Cuatr. 8Hs", order:7, req:{ reg:["SSOO","CD"], app:[] } },
  { id:"SI", name:"Seminario Integrador *", year:3, term:"Cuatr. 8Hs", order:8, req:{ reg:["ASI"], app:["SyPN","AyED","SySL","PdP"] } },

  // Electiva NIVEL 3 (6Hs)
  { id:"EL3", name:"Electiva", year:3, term:"Cuatr. 6Hs", order:12, req:{ reg:[], app:[] }, notes:"Oferta y requisitos según electiva" },

  // NIVEL 4
  { id:"AdmSI", name:"Administración de Sistemas de Información", year:4, term:"Anual 6Hs", order: 1, req:{ reg:["ECO","DSI"], app:["ASI"] } },
  { id:"IyCS", name:"Ingeniería y Calidad de Software", year:4, term:"Cuatr. 6Hs", order: 2, req:{ reg:["BD","DdS","DSI"], app:["SySL","PdP"] } },
  { id:"IO", name:"Investigación Operativa", year:4, term:"Cuatr. 8Hs", order: 3, req:{ reg:["PyE","AN"], app:[] } },
  { id:"AN", name:"Análisis Numérico", year:4, term:"Cuatr. 6Hs", order: 4, req:{ reg:["AM2"], app:["AM1","AGA"] } },
  { id:"Sim", name:"Simulación", year:4, term:"Cuatr. 6Hs", order: 5, req:{ reg:["PyE"], app:["AM2"] } },
  { id:"Leg", name:"Legislación", year:4, term:"Cuatr. 4Hs", order: 6, req:{ reg:["IngSoc"], app:[] } },
  { id:"CdD", name:"Ciencia de Datos", year:4, term:"Cuatr. 6Hs", order: 7, req:{ reg:["Sim"], app:["PyE","BD"] } },
  { id:"TpA", name:"Tecnologías para la Automatización", year:4, term:"Cuatr. 6Hs", order: 8, req:{ reg:["F2","AN"], app:["AM2"] } },

  // Electiva NIVEL 4 (12Hs)
  { id:"EL4", name:"Electiva", year:4, term:"Cuatr. 12Hs", order: 9, req:{ reg:[], app:[] }, notes:"Oferta y requisitos según electiva" },

  // NIVEL 5
  { id:"PF", name:"Proyecto Final", year:5, term:"Anual 6Hs", order: 1, req:{ reg:["IyCS","AdmSI","RD"], app:["Ingles2","DdS","DSI"] } },
  { id:"IA", name:"Inteligencia Artificial", year:5, term:"Cuatr. 6Hs", order: 2, req:{ reg:["Sim"], app:["PyE","AN"] } },
  { id:"GG", name:"Gestión Gerencial", year:5, term:"Cuatr. 6Hs", order: 3, req:{ reg:["Leg","AdmSI"], app:["ECO"] } },
  { id:"SG", name:"Sistemas de Gestión", year:5, term:"Cuatr. 6Hs", order: 4, req:{ reg:["ECO","IO"], app:["DSI"] } },
  { id:"SSI", name:"Seguridad en los Sistemas de Información", year:5, term:"Cuatr. 6Hs", order: 5, req:{ reg:["RD","AdmSI"], app:["DdS","CD"] } },

  // Electiva NIVEL 5 (24Hs)
  { id:"EL5", name:"Electiva", year:5, term:"Cuatr. 24Hs", order: 6, req:{ reg:[], app:[] }, notes:"Oferta y requisitos según electiva" },

  { id:"PPS", name:"Práctica Profesional Supervisada", year:5, term:"200Hs reloj", order: 7,
    req:{ reg:["IyCS","AdmSI","RD"], app:["Ingles2","DdS","DSI"] } },
];

// ---- Persistencia ----
const LS_KEY = "malla_states_v1";

function loadStates() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw) || {}; } catch { return {}; }
}
function saveStates(states) {
  localStorage.setItem(LS_KEY, JSON.stringify(states));
}

// ---- Lógica de requisitos ----
function isAtLeastRegularized(state) {
  return state === STATE.REGULARIZED || state === STATE.APPROVED;
}
function isApproved(state) {
  return state === STATE.APPROVED;
}

function meetsRequirements(subject, states) {
  const { reg, app } = subject.req;

  const okReg = reg.every(id => isAtLeastRegularized(states[id] || STATE.AVAILABLE));
  const okApp = app.every(id => isApproved(states[id] || STATE.AVAILABLE));

  return okReg && okApp;
}

// Recalcula locked/available respetando que si ya estás en curso/regular/aprobada, no te “bloquee”.
function recomputeAvailability(states) {
  for (const s of curriculum) {
    const current = states[s.id] || STATE.AVAILABLE;

    // si está en progreso/regular/aprobada, siempre queda interactiva
    if ([STATE.IN_PROGRESS, STATE.REGULARIZED, STATE.APPROVED].includes(current)) continue;

    states[s.id] = meetsRequirements(s, states) ? STATE.AVAILABLE : STATE.LOCKED;
  }
  return states;
}

// ---- UI ----
const grid = document.getElementById("grid");
const resetBtn = document.getElementById("resetBtn");

function buildGrid() {
  grid.innerHTML = "";

  for (let y=1; y<=5; y++) {
    const col = document.createElement("section");
    col.className = "year";

    const title = document.createElement("div");
    title.className = "year-title";
    title.textContent = `${y}° Año`;
    col.appendChild(title);

    const list = document.createElement("div");
    list.className = "subjects";

    curriculum.filter(s => s.year === y).sort((a,b) => a.order - b.order).forEach(s => {
      const btn = document.createElement("button");
      btn.className = "subject";
      btn.dataset.id = s.id;

      btn.innerHTML = `
        <span class="code">${s.id}</span>
        <span class="name">${s.name}</span>
        <div class="meta">${s.term}</div>
      `;

      list.appendChild(btn);
    });

    col.appendChild(list);
    grid.appendChild(col);
  }
}

function reqText(subject) {
  const parts = [];
  if (subject.req.reg.length) parts.push(`Reg: ${subject.req.reg.join(", ")}`);
  if (subject.req.app.length) parts.push(`Aprob: ${subject.req.app.join(", ")}`);
  return parts.length ? parts.join(" | ") : "Sin requisitos";
}

function render(states) {
  const buttons = grid.querySelectorAll(".subject");
  buttons.forEach(btn => {
    const id = btn.dataset.id;
    const subj = curriculum.find(s => s.id === id);
    const st = states[id] || STATE.AVAILABLE;

    btn.classList.remove("locked","in_progress","regularized","approved");
    btn.disabled = false;

    if (st === STATE.LOCKED) {
      btn.classList.add("locked");
      btn.disabled = true;
      btn.title = `Bloqueada – ${reqText(subj)}`;
    } else {
      btn.title = `${reqText(subj)}\nClick: En curso → Regularizada → Aprobada`;
      if (st === STATE.IN_PROGRESS) btn.classList.add("in_progress");
      if (st === STATE.REGULARIZED) btn.classList.add("regularized");
      if (st === STATE.APPROVED) btn.classList.add("approved");
    }
  });
}

function nextState(current) {
  // available/in_progress/regularized/approved ciclan
  const idx = CYCLE.indexOf(current);
  if (idx === -1) return STATE.AVAILABLE;
  return CYCLE[(idx + 1) % CYCLE.length];
}

function init() {
  buildGrid();

  let states = loadStates();
  states = recomputeAvailability(states);
  saveStates(states);
  render(states);

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".subject");
    if (!btn) return;

    const id = btn.dataset.id;
    const current = states[id] || STATE.AVAILABLE;

    if (current === STATE.LOCKED) return; // seguridad extra

    states[id] = nextState(current);
    states = recomputeAvailability(states);
    saveStates(states);
    render(states);
  });

  resetBtn.addEventListener("click", () => {
    localStorage.removeItem(LS_KEY);
    states = {};
    states = recomputeAvailability(states);
    saveStates(states);
    render(states);
  });
}

init();