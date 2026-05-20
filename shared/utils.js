// ── Web Audio ──────────────────────────────────────────────────────────────

let _ctx = null;

export function getAudioCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

export function playTone({ freq = 440, type = 'sine', duration = 0.15, gain = 0.25, delay = 0 } = {}) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    osc.type = type;
    const t = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  } catch (_) { /* audio blocked — ignored */ }
}

// ── LocalStorage ────────────────────────────────────────────────────────────

export function storageGet(toolId, key, fallback = null) {
  try {
    const raw = localStorage.getItem(`pg:${toolId}:${key}`);
    return raw === null ? fallback : JSON.parse(raw);
  } catch { return fallback; }
}

export function storageSet(toolId, key, value) {
  try { localStorage.setItem(`pg:${toolId}:${key}`, JSON.stringify(value)); }
  catch { /* quota exceeded */ }
}

// ── Math helpers ────────────────────────────────────────────────────────────

export const lerp    = (a, b, t)      => a + (b - a) * t;
export const clamp   = (v, lo, hi)    => Math.max(lo, Math.min(hi, v));
export const randInt = (min, max)     => Math.floor(Math.random() * (max - min + 1)) + min;
