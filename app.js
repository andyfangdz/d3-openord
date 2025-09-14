// Constants
const G = 9.80665; // m/s^2
const R = 287.05287; // J/(kg*K)
const T0 = 288.15; // K
const P0 = 101325; // Pa
const RHO0 = 1.225; // kg/m^3
const LAPSE = -0.0065; // K/m up to 11km
const KTS_PER_MS = 1.94384449;
const FT_PER_M = 3.280839895;
const FPM_PER_MS = 196.850394;

function isaAtm(altMeters) {
  const h = Math.max(0, altMeters);
  if (h <= 11000) {
    const T = T0 + LAPSE * h;
    const P = P0 * Math.pow(T / T0, -G / (LAPSE * R));
    const rho = P / (R * T);
    return { T, P, rho, sigma: rho / RHO0 };
  } else {
    // Simple two-layer: isothermal above 11 km (not needed here)
    const T11 = T0 + LAPSE * 11000;
    const P11 = P0 * Math.pow(T11 / T0, -G / (LAPSE * R));
    const P = P11 * Math.exp((-G * (h - 11000)) / (R * T11));
    const rho = P / (R * T11);
    return { T: T11, P, rho, sigma: rho / RHO0 };
  }
}

function qFromIAS(ias_ms) {
  return 0.5 * RHO0 * ias_ms * ias_ms;
}

function computeDragComponents(ias_ms, params) {
  const { weightN, wingArea, aspectRatio, oswald, cd0 } = params;
  const q = qFromIAS(ias_ms);
  const inducedFactor = 1.0 / (Math.PI * oswald * aspectRatio);
  // Lift equals weight in level flight for drag curve
  const cl = weightN / (q * wingArea);
  const cd_induced = cl * cl * inducedFactor;
  const di = cd_induced * q * wingArea; // N
  const dp = cd0 * q * wingArea; // N
  const d = di + dp;
  return { di, dp, d };
}

function powerAvailableKw(params, atm, throttle, powerModel) {
  const engineKwSL = params.engineKw;
  const propEff = params.propEff;
  const throttleClamped = Math.max(0, Math.min(1, throttle));
  const base = engineKwSL * throttleClamped;
  const sigma = atm.sigma;
  const engineAltKw = powerModel === 'na' ? base * sigma : base;
  const shaftKw = engineAltKw * propEff; // power at prop
  return shaftKw;
}

function computeAll(params, conditions) {
  const { minKias, maxKias, numPoints, altitudeM, powerModel } = conditions;
  const atm = isaAtm(altitudeM);
  const sigma = atm.sigma;
  const speedIAS = [];
  const speedTAS = [];
  const di = [];
  const dp = [];
  const d = [];
  const pr_kw = [];
  const ta = [];
  const pa_kw_arr = [];

  const pa_kw_const = powerAvailableKw(params, atm, conditions.throttle, powerModel);
  const min = Math.max(5, minKias / KTS_PER_MS); // convert to m/s
  const max = Math.max(min + 1, maxKias / KTS_PER_MS);

  for (let i = 0; i < numPoints; i++) {
    const f = i / (numPoints - 1);
    const vIAS = min + (max - min) * f;
    const vTAS = vIAS / Math.sqrt(sigma);
    const drag = computeDragComponents(vIAS, params);
    const powerReqKw = (drag.d * vTAS) / 1000.0; // W to kW
    const thrustAvail = Math.max(0, (pa_kw_const * 1000.0) / Math.max(0.1, vTAS)); // N, avoid div by ~0

    speedIAS.push(vIAS);
    speedTAS.push(vTAS);
    di.push(drag.di);
    dp.push(drag.dp);
    d.push(drag.d);
    pr_kw.push(powerReqKw);
    ta.push(thrustAvail);
    pa_kw_arr.push(pa_kw_const);
  }

  // Best glide: min total drag (IAS)
  let vgIdx = 0;
  for (let i = 1; i < d.length; i++) if (d[i] < d[vgIdx]) vgIdx = i;

  // Best angle: max (T_avail - D)
  let vxIdx = 0;
  let maxThrustExcess = -Infinity;
  for (let i = 0; i < d.length; i++) {
    const ex = ta[i] - d[i];
    if (ex > maxThrustExcess) {
      maxThrustExcess = ex;
      vxIdx = i;
    }
  }

  // Best rate: max (P_avail - P_req)
  let vyIdx = 0;
  let maxPowerExcess = -Infinity;
  for (let i = 0; i < pr_kw.length; i++) {
    const ex = pa_kw_arr[i] - pr_kw[i];
    if (ex > maxPowerExcess) {
      maxPowerExcess = ex;
      vyIdx = i;
    }
  }

  const weightN = params.weightN;
  const roc_ms = Math.max(0, (pa_kw_arr[vyIdx] - pr_kw[vyIdx]) * 1000.0 / weightN);
  const gamma = Math.max(0, (ta[vxIdx] - d[vxIdx]) / weightN); // rad (small-angle)

  return {
    atm,
    speedIAS,
    speedTAS,
    di,
    dp,
    d,
    pr_kw,
    ta,
    pa_kw_arr,
    vgIdx,
    vxIdx,
    vyIdx,
    roc_ms,
    gamma
  };
}

function fmtKnots(ms) {
  return (ms * KTS_PER_MS).toFixed(0) + ' kt';
}

function fmtFpm(ms) {
  return (ms * FPM_PER_MS).toFixed(0) + ' fpm';
}

function fmtDeg(rad) {
  return (rad * 180 / Math.PI).toFixed(1) + '°';
}

// UI hookup
const els = {
  massKg: document.getElementById('massKg'),
  wingArea: document.getElementById('wingArea'),
  aspectRatio: document.getElementById('aspectRatio'),
  oswald: document.getElementById('oswald'),
  cd0: document.getElementById('cd0'),
  powerKw: document.getElementById('powerKw'),
  propEff: document.getElementById('propEff'),
  throttle: document.getElementById('throttle'),
  throttleVal: document.getElementById('throttleVal'),
  powerModel: document.getElementById('powerModel'),
  altitudeFt: document.getElementById('altitudeFt'),
  minKias: document.getElementById('minKias'),
  maxKias: document.getElementById('maxKias'),
  numPoints: document.getElementById('numPoints'),
  vgText: document.getElementById('vgText'),
  vxText: document.getElementById('vxText'),
  vyText: document.getElementById('vyText'),
  rocText: document.getElementById('rocText'),
  gammaText: document.getElementById('gammaText')
};

function readParams() {
  const massKg = Number(els.massKg.value);
  const weightN = massKg * G;
  return {
    weightN,
    wingArea: Number(els.wingArea.value),
    aspectRatio: Number(els.aspectRatio.value),
    oswald: Number(els.oswald.value),
    cd0: Number(els.cd0.value),
    engineKw: Number(els.powerKw.value),
    propEff: Number(els.propEff.value)
  };
}

function readConditions() {
  return {
    altitudeM: Number(els.altitudeFt.value) / FT_PER_M,
    throttle: Number(els.throttle.value),
    minKias: Number(els.minKias.value),
    maxKias: Number(els.maxKias.value),
    numPoints: Number(els.numPoints.value),
    powerModel: els.powerModel.value
  };
}

let dragChart, powerChart;

function createCharts() {
  const common = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#cbd5e1' } },
      annotation: { annotations: {} }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#1f2937' }, title: { display: true, text: 'Indicated Airspeed (kt)', color: '#9ca3af' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#1f2937' }, title: { display: true, text: 'Force (N)', color: '#9ca3af' } }
    }
  };

  const dragCtx = document.getElementById('dragChart').getContext('2d');
  dragChart = new Chart(dragCtx, {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: JSON.parse(JSON.stringify(common))
  });

  const powerCtx = document.getElementById('powerChart').getContext('2d');
  const powerOptions = JSON.parse(JSON.stringify(common));
  powerOptions.scales.y.title.text = 'Power (kW)';
  powerChart = new Chart(powerCtx, {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: powerOptions
  });
}

function updateCharts() {
  const params = readParams();
  const conds = readConditions();
  const res = computeAll(params, conds);

  const labelsKt = res.speedIAS.map(v => (v * KTS_PER_MS).toFixed(0));

  // Drag chart datasets
  dragChart.data.labels = labelsKt;
  dragChart.data.datasets = [
    { label: 'Induced Drag', data: res.di, borderColor: '#ff9d76', backgroundColor: 'transparent', tension: 0.15 },
    { label: 'Parasite Drag', data: res.dp, borderColor: '#7cc4ff', backgroundColor: 'transparent', tension: 0.15 },
    { label: 'Total Drag (Thrust Required)', data: res.d, borderColor: '#c084fc', backgroundColor: 'transparent', tension: 0.15, borderWidth: 2 },
    { label: 'Thrust Available', data: res.ta, borderColor: '#6ede8a', backgroundColor: 'transparent', tension: 0.15, borderWidth: 2 }
  ];

  dragChart.options.plugins.annotation.annotations = {
    vg: {
      type: 'line',
      xMin: res.vgIdx,
      xMax: res.vgIdx,
      borderColor: '#fbbf24',
      borderWidth: 1,
      label: { enabled: true, color: '#fbbf24', content: 'Vg', position: 'start' },
      scaleID: 'x'
    },
    vx: {
      type: 'line',
      xMin: res.vxIdx,
      xMax: res.vxIdx,
      borderColor: '#22d3ee',
      borderWidth: 1,
      label: { enabled: true, color: '#22d3ee', content: 'Vx', position: 'start' },
      scaleID: 'x'
    }
  };
  dragChart.update('none');

  // Power chart datasets
  powerChart.data.labels = labelsKt;
  powerChart.data.datasets = [
    { label: 'Power Required', data: res.pr_kw, borderColor: '#c084fc', backgroundColor: 'transparent', tension: 0.15, borderWidth: 2 },
    { label: 'Power Available', data: res.pa_kw_arr, borderColor: '#6ede8a', backgroundColor: 'transparent', tension: 0.15, borderWidth: 2 }
  ];
  powerChart.options.plugins.annotation.annotations = {
    vy: {
      type: 'line',
      xMin: res.vyIdx,
      xMax: res.vyIdx,
      borderColor: '#22d3ee',
      borderWidth: 1,
      label: { enabled: true, color: '#22d3ee', content: 'Vy', position: 'start' },
      scaleID: 'x'
    }
  };
  powerChart.update('none');

  // Metrics
  els.vgText.textContent = fmtKnots(res.speedIAS[res.vgIdx]);
  els.vxText.textContent = fmtKnots(res.speedIAS[res.vxIdx]);
  els.vyText.textContent = fmtKnots(res.speedIAS[res.vyIdx]);
  els.rocText.textContent = fmtFpm(res.roc_ms);
  els.gammaText.textContent = fmtDeg(res.gamma);
}

function bindInputs() {
  const inputs = [
    els.massKg, els.wingArea, els.aspectRatio, els.oswald, els.cd0,
    els.powerKw, els.propEff, els.powerModel, els.altitudeFt,
    els.minKias, els.maxKias, els.numPoints
  ];
  inputs.forEach(el => el.addEventListener('input', updateCharts));
  els.throttle.addEventListener('input', () => {
    els.throttleVal.textContent = Number(els.throttle.value).toFixed(2);
    updateCharts();
  });
}

// Initialize
createCharts();
bindInputs();
updateCharts();

