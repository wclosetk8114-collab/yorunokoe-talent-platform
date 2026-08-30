"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Handles use their own audio filename prefix; only "hana" differs from its file prefix.
const AUDIO_PREFIX = {
  hana: "karin",
};

const CATEGORIES = [
  {
    key: "greeting",
    icon: "💬",
    label: "あいさつボイス",
    desc: "まずは声の雰囲気を知りたい方に",
  },
  {
    key: "asmr",
    icon: "🌙",
    label: "ASMR囁き",
    desc: "眠れない夜に、そっと寄り添ってほしいときに",
  },
  {
    key: "meditation",
    icon: "🧘",
    label: "誘導瞑想",
    desc: "深いリラックスと眠りへ導いてほしいときに",
  },
];

let activeAudioEl = null;

function TalentRow({ talent, categoryKey }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const prefix = AUDIO_PREFIX[talent.handle] ?? talent.handle;
  const src = `/audio/${prefix}_${categoryKey}.mp3`;

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
    <div className="flex items-center gap-4 rounded-2xl bg-brand-light/30 px-4 py-3 transition hover:bg-brand-light/50">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-xl ring-1 ring-brand/20"
        style={{ backgroundColor: `${talent.accent_color}33` }}
      >
        {talent.avatar_image_url ? (
          <Image
            src={talent.avatar_image_url}
            alt={talent.display_name}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        ) : (
          talent.avatar_emoji
        )}
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/talents/${talent.handle}`}
          className="block truncate text-sm font-bold text-foreground hover:text-brand"
        >
          {talent.display_name}
        </Link>
        <p className="truncate text-xs text-foreground/50">{talent.tagline}</p>
      </div>
      <button
        type="button"
        onClick={toggle}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-ink shadow-md shadow-brand/25 transition-transform duration-200 hover:scale-105"
        aria-label={playing ? "一時停止" : "再生"}
      >
        {playing ? "❚❚" : "▶"}
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

export default function PurposeAudioFinder({ talents }) {
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const current = CATEGORIES.find((c) => c.key === category) ?? CATEGORIES[0];

  if (!talents || talents.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
      <h2 className="font-heading mb-2 text-center text-xl font-bold text-brand-dark">
        🔍 用途から探す
      </h2>
      <p className="mb-8 text-center text-sm text-foreground/50">
        今の気分に合わせてカテゴリを選び、タレントの声を聞き比べてみましょう。
      </p>

      <div className="mb-6 flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategory(c.key)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              category === c.key
                ? "bg-brand text-ink shadow-md shadow-brand/25"
                : "bg-brand-light/40 text-foreground/60 ring-1 ring-inset ring-brand-soft/30 hover:bg-brand-light/60"
            }`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <p className="mb-4 text-center text-xs text-accent">{current.desc}</p>

      <div className="card-soft mx-auto max-w-2xl space-y-2 p-4">
        {talents.map((talent) => (
          <TalentRow key={`${category}-${talent.handle}`} talent={talent} categoryKey={category} />
        ))}
      </div>
    </section>
  );
}
