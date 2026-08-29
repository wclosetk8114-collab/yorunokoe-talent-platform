"use client";

import { useRef, useState } from "react";

// Handles use their own audio filename prefix; only "hana" differs from its file prefix.
const AUDIO_PREFIX = {
  hana: "karin",
};

let activeAudioEl = null;

export default function TrialPlayButton({ handle }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const prefix = AUDIO_PREFIX[handle] ?? handle;
  const src = `/audio/${prefix}_greeting.mp3`;

  function handleClick(e) {
    // Card is wrapped in a <Link>; stop the click from triggering navigation.
    e.preventDefault();
    e.stopPropagation();

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
    <div className="mt-3">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand ring-1 ring-inset ring-brand/30 transition hover:bg-brand/20 hover:text-brand-dark"
      >
        <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
        {playing ? "再生中…" : "お試し再生"}
      </button>
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
