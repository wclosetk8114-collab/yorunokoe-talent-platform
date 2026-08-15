"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRESET_AMOUNTS = [300, 500, 1000, 3000];

export default function TipPanel({ talent, isLoggedIn }) {
  const router = useRouter();
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  async function handleTip() {
    setError("");
    if (!isLoggedIn) {
      router.push(`/login?next=/talents/${talent.handle}`);
      return;
    }
    if (!effectiveAmount || effectiveAmount < 100) {
      setError("100円以上の金額を指定してください。");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          talentId: talent.id,
          amount: effectiveAmount,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました。");
      router.push(data.redirectUrl);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-brand-light bg-white p-6">
      <h2 className="text-lg font-bold text-brand">💜 投げ銭で応援する</h2>
      <p className="mt-1 text-xs text-foreground/60">単発の応援ギフトです。</p>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {PRESET_AMOUNTS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => {
              setAmount(a);
              setCustomAmount("");
            }}
            className={`rounded-lg border px-2 py-2 text-sm font-semibold transition ${
              !customAmount && amount === a
                ? "border-brand bg-brand text-white"
                : "border-brand-light text-foreground/70 hover:border-brand"
            }`}
          >
            ¥{a.toLocaleString()}
          </button>
        ))}
      </div>

      <input
        type="number"
        min={100}
        step={100}
        placeholder="金額を直接入力"
        value={customAmount}
        onChange={(e) => setCustomAmount(e.target.value)}
        className="mt-3 w-full rounded-lg border border-brand-light px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />

      <textarea
        placeholder="応援メッセージ（任意）"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        className="mt-3 w-full resize-none rounded-lg border border-brand-light px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleTip}
        disabled={loading}
        className="mt-4 w-full rounded-full bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
      >
        {loading ? "処理中..." : `¥${(effectiveAmount || 0).toLocaleString()} を投げ銭する`}
      </button>
    </div>
  );
}
