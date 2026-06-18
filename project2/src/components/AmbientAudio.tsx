"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function AmbientAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // 1. Generate Brown Noise Buffer
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise integration filter
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Boost amplitude
      }

      // 2. Playback Source
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      sourceRef.current = source;

      // 3. Modulated Lowpass Filter (Wind Swell)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;
      filter.Q.value = 1.2;

      // 4. LFO to modulate filter frequency (Breathing effect)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.06; // Slow cycle (16.6s)
      lfoRef.current = lfo;

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 180; // Modulate frequency by +/- 180Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // 5. Main Gain
      const mainGain = ctx.createGain();
      mainGain.gain.value = 0.15; // Soft ambient volume
      mainGainRef.current = mainGain;

      // Connect Graph
      source.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      // Start Synthesizers
      lfo.start();
      source.start();
      setIsPlaying(true);
    } catch (err) {
      console.warn("Failed to initialize Web Audio context:", err);
    }
  };

  const togglePlayback = async () => {
    if (!audioCtxRef.current) {
      initAudio();
      return;
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
      setIsPlaying(true);
    } else if (isPlaying) {
      // Fade out
      if (mainGainRef.current) {
        mainGainRef.current.gain.setValueAtTime(mainGainRef.current.gain.value, ctx.currentTime);
        mainGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      }
      setTimeout(() => {
        if (ctx.state !== 'closed') {
          ctx.suspend();
          setIsPlaying(false);
        }
      }, 550);
    } else {
      // Fade in
      ctx.resume();
      if (mainGainRef.current) {
        mainGainRef.current.gain.setValueAtTime(0.0001, ctx.currentTime);
        mainGainRef.current.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.5);
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    // Attempt autoplay trigger on first interaction
    const triggerEvents = ['click', 'touchstart', 'wheel'];
    const autoPlayTrigger = () => {
      initAudio();
      triggerEvents.forEach(evt => window.removeEventListener(evt, autoPlayTrigger));
    };

    triggerEvents.forEach(evt => window.addEventListener(evt, autoPlayTrigger, { passive: true }));

    return () => {
      triggerEvents.forEach(evt => window.removeEventListener(evt, autoPlayTrigger));
      
      // Cleanup Audio nodes on component teardown
      try {
        if (sourceRef.current) sourceRef.current.stop();
        if (lfoRef.current) lfoRef.current.stop();
        if (audioCtxRef.current) audioCtxRef.current.close();
      } catch {
        // Already closed or not started
      }
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-brand-black border border-brand-cream/20 px-4 py-2.5 rounded-none pointer-events-auto">
      <button 
        onClick={togglePlayback}
        className="flex items-center gap-2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-brand-cream/80 hover:text-brand-gold transition-colors duration-300 cursor-pointer bg-transparent border-none"
      >
        <span className="relative flex h-2 w-2">
          {isPlaying ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-brand-gold/45"></span>
              <span className="relative inline-flex rounded-none h-2 w-2 bg-brand-gold"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-none h-2 w-2 bg-brand-copper/50"></span>
          )}
        </span>
        {isPlaying ? 'Ambient Audio On' : 'Ambient Audio Off'}
      </button>

      {/* Small soundwave animation */}
      {isPlaying && (
        <div className="flex items-end gap-[2px] h-3 w-4">
          <div className="w-[1.5px] bg-brand-gold rounded-none animate-[soundWave_1.2s_infinite_ease-in-out_delay-100] h-3"></div>
          <div className="w-[1.5px] bg-brand-gold rounded-none animate-[soundWave_0.8s_infinite_ease-in-out_delay-300] h-1"></div>
          <div className="w-[1.5px] bg-brand-gold rounded-none animate-[soundWave_1.0s_infinite_ease-in-out_delay-500] h-2"></div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes soundWave {
          0%, 100% { height: 3px; }
          50% { height: 12px; }
        }
      `}</style>
    </div>
  );
}
