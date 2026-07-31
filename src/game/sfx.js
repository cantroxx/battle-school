/* 효과음: 소리 파일 없이 Web Audio로 직접 만든다.
 * 브라우저 정책상 사용자가 화면을 누른 뒤부터 소리가 난다. */
let ctx = null;
let muted = false;

// 음소거 (교실에서 조용히 하고 싶을 때)
export function setMuted(m) {
  muted = !!m;
}

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// freq(Hz) 음을 dur초 동안 재생. when초 뒤에 시작, slide로 음 높이 미끄러뜨리기
function beep(freq, dur, type = 'square', vol = 0.12, when = 0, slide = 0) {
  if (muted) return;
  try {
    const c = ac();
    const t = c.currentTime + when;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.linearRampToValueAtTime(freq + slide, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  } catch {
    /* 소리가 안 나도 게임은 계속 */
  }
}

export const sfx = {
  correct() { beep(660, 0.09); beep(880, 0.14, 'square', 0.12, 0.09); },
  wrong() { beep(220, 0.18, 'sawtooth', 0.1); beep(150, 0.28, 'sawtooth', 0.1, 0.12); },
  hit() { beep(120, 0.12, 'triangle', 0.2, 0, -40); },
  crit() { beep(120, 0.1, 'triangle', 0.22); beep(90, 0.18, 'triangle', 0.22, 0.08, -30); },
  combo(n) { beep(500 + 90 * Math.min(n, 6), 0.08, 'square', 0.1); },
  danger() { beep(330, 0.12, 'sawtooth', 0.1); beep(330, 0.12, 'sawtooth', 0.1, 0.18); },
  potion() { beep(520, 0.08, 'sine', 0.14); beep(780, 0.12, 'sine', 0.14, 0.08); },
  buy() { beep(988, 0.07); beep(1319, 0.12, 'square', 0.12, 0.07); },
  levelup() { [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.12, 'square', 0.12, i * 0.09)); },
  victory() { [523, 523, 659, 784, 1047].forEach((f, i) => beep(f, i === 4 ? 0.4 : 0.13, 'square', 0.12, i * 0.13)); },
  defeat() { [392, 330, 262].forEach((f, i) => beep(f, 0.25, 'triangle', 0.12, i * 0.22)); },
  achievement() { [660, 880, 1175].forEach((f, i) => beep(f, 0.14, 'sine', 0.14, i * 0.1)); },
};
