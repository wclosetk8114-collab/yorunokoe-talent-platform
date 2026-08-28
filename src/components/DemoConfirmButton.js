"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DemoConfirmButton({ type, id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/demo-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました。");
      router.push(`/checkout/thanks?type=${type}`);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={loading}
        className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white shadow-md shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? "処理中..." : "支払いを完了する（デモ）"}
      </button>
    </div>
  );
}
