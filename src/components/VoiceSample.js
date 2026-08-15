"use client";

import { useRef, useState } from "react";

// Handles use their own audio filename prefix; only "hana" differs from its file prefix.
const AUDIO_PREFIX = {
  yui: "yui",
  sora: "sora",
  hana: "karin",
  rui: "rui",
};

let activeAudioEl = null;

function TrackButton({ src, label, icon }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      return;
    }

    if (activeAudioEl && activeAudioEl !== audio) {
      activeAudioEl.pause();
    }
    activeAudioEl = audio;
    audio.play();
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-brand-light/40 px-4 py-3">
      <button
        type="button"
        onClick={toggle}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-md shadow-brand/25 transition-transform duration-200 hover:scale-105"
        aria-label={playing ? "一時停止" : "再生"}
      >
        {playing ? "❚❚" : "▶"}
      </button>
      <p className="flex-1 text-sm font-semibold text-foreground">
        {icon} {label}
      </p>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}

export default function VoiceSample({ handle }) {
  const prefix = AUDIO_PREFIX[handle] ?? handle;
  const base = `/audio/${prefix}`;

  return (
    <div className="card-soft relative mt-8 p-6">
      <h2 className="font-heading text-lg font-bold text-brand-dark">🎧 ボイスサンプル</h2>
      <p className="mt-1 text-xs text-foreground/50">
        実際の声を聞いてから、応援するか決められます。
      </p>
      <div className="mt-4 space-y-3">
        <TrackButton src={`${base}_greeting.mp3`} label="あいさつボイス" icon="💬" />
        <TrackButton src={`${base}_asmr.mp3`} label="ASMR囁きサンプル" icon="🌙" />
      </div>
    </div>
  );
}
