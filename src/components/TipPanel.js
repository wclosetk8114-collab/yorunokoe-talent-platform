"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRESET_AMOUNTS = [300, 500, 1000, 3000];

export default function TipPanel({ talent, isLoggedIn }) {
  const router = useRouter();
  const [amount, setAmount] = useState(500);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTip() {
    setError("");
    if (!isLoggedIn) {
      router.push(`/login?next=/talents/${talent.handle}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          talentId: talent.id,
          amount,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました。");
      window.location.href = data.redirectUrl;
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="card-soft p-7">
      <h2 className="font-heading text-lg font-bold text-brand-dark">💜 投げ銭で応援する</h2>
      <p className="mt-1 text-xs text-foreground/45">そっと届く、単発の応援ギフトです。</p>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {PRESET_AMOUNTS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAmount(a)}
            className={`rounded-2xl px-2 py-2.5 text-sm font-semibold transition-all duration-200 ${
              amount === a
                ? "bg-brand text-white shadow-md shadow-brand/25"
                : "bg-brand-light/60 text-foreground/60 hover:bg-brand-light"
            }`}
          >
            ¥{a.toLocaleString()}
          </button>
        ))}
      </div>

      <textarea
        placeholder="応援メッセージ（任意）"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        className="mt-3 w-full resize-none rounded-2xl bg-brand-light/40 px-4 py-2.5 text-sm placeholder:text-foreground/35 focus:bg-brand-light/80 focus:outline-none focus:ring-2 focus:ring-brand-soft"
      />

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <button
        type="button"
        onClick={handleTip}
        disabled={loading}
        className="mt-5 w-full rounded-full bg-brand py-3 text-sm font-semibold text-white shadow-md shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? "処理中..." : `¥${amount.toLocaleString()} を投げ銭する`}
      </button>
      <p className="mt-2 text-center text-[11px] text-foreground/35">Stripeの決済ページに移動します（テストモード）</p>
    </div>
  );
}
