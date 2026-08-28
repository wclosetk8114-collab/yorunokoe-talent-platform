"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscribePanel({ talent, isLoggedIn, subscription }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isActive = subscription?.status === "active";

  async function handleSubscribe() {
    setError("");
    if (!isLoggedIn) {
      router.push(`/login?next=/talents/${talent.handle}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talentId: talent.id }),
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
      <h2 className="font-heading text-lg font-bold text-brand-dark">🌙 月額会員（ファンクラブ）</h2>
      <p className="mt-1 text-xs text-foreground/45">
        限定ASMR音源・配信アーカイブが楽しめます。
      </p>

      <p className="mt-6 text-2xl font-bold text-foreground">
        ¥{talent.monthly_plan_price?.toLocaleString()}
        <span className="text-sm font-normal text-foreground/40"> / 月</span>
      </p>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {isActive ? (
        <div className="mt-5 rounded-2xl bg-accent-light px-4 py-3.5 text-sm text-accent">
          ✓ 会員登録中です
          {subscription?.current_period_end && (
            <span className="block text-xs text-foreground/40">
              次回更新: {new Date(subscription.current_period_end).toLocaleDateString("ja-JP")}
            </span>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={loading}
          className="mt-5 w-full rounded-full bg-brand-light/60 py-3 text-sm font-semibold text-brand shadow-md shadow-brand-soft/30 ring-1 ring-inset ring-brand-soft/50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand hover:text-white hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? "処理中..." : "月額会員になる"}
        </button>
      )}
      {!isActive && (
        <p className="mt-2 text-center text-[11px] text-foreground/35">Stripeの決済ページに移動します（テストモード）</p>
      )}
    </div>
  );
}
