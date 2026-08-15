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
      router.push(data.redirectUrl);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-brand-light bg-white p-6">
      <h2 className="text-lg font-bold text-brand">🌙 月額会員（ファンクラブ）</h2>
      <p className="mt-1 text-xs text-foreground/60">
        限定ASMR音源・配信アーカイブが楽しめます。
      </p>

      <p className="mt-4 text-2xl font-bold text-foreground">
        ¥{talent.monthly_plan_price?.toLocaleString()}
        <span className="text-sm font-normal text-foreground/50"> / 月</span>
      </p>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {isActive ? (
        <div className="mt-4 rounded-lg bg-accent/10 px-4 py-3 text-sm text-accent">
          ✓ 会員登録中です
          {subscription?.current_period_end && (
            <span className="block text-xs text-foreground/50">
              次回更新: {new Date(subscription.current_period_end).toLocaleDateString("ja-JP")}
            </span>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={loading}
          className="mt-4 w-full rounded-full border-2 border-brand py-2.5 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white disabled:opacity-50"
        >
          {loading ? "処理中..." : "月額会員になる"}
        </button>
      )}
    </div>
  );
}
