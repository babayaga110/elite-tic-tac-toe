
/**
 * Synthesizes subtle, satisfying sound effects using the Web Audio API.
 * No external assets required.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const setMuted = (muted: boolean) => {
  isMuted = muted;
};

const playTone = (freq: number, type: OscillatorType, duration: number, volume: number, fadeOut = true) => {
  if (isMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  if (fadeOut) {
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const playMoveSound = () => {
  // A subtle high-pitched click
  playTone(880, 'sine', 0.1, 0.1);
};

export const playWinSound = () => {
  // A triumphant rising arpeggio
  const ctx = getCtx();
  const startTime = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => {
      playTone(freq, 'triangle', 0.4, 0.15);
    }, i * 150);
  });
};

export const playDrawSound = () => {
  // A low-frequency damped thud
  playTone(110, 'sine', 0.5, 0.2);
};
