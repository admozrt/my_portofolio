import { useCallback, useRef } from 'react';

/**
 * Synthesizes short boot/beep tones via the Web Audio API oscillator.
 * No audio file needed — avoids using the wedding background-music tracks,
 * which are the wrong mood entirely for a control-room UI.
 */
export function useBeep() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, delay = 0, gain = 0.05) => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    const startAt = ctx.currentTime + delay;
    gainNode.gain.setValueAtTime(0, startAt);
    gainNode.gain.linearRampToValueAtTime(gain, startAt + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.02);
  }, [getCtx]);

  const playBoot = useCallback(() => {
    playTone(420, 0.08, 0);
    playTone(660, 0.1, 0.09);
  }, [playTone]);

  const playBeep = useCallback(() => {
    playTone(880, 0.06, 0);
  }, [playTone]);

  return { playBoot, playBeep };
}
