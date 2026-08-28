import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DemoConfirmButton from "@/components/DemoConfirmButton";

export const dynamic = "force-dynamic";

export default async function DemoCheckoutPage({ searchParams }) {
  const { type, id } = await searchParams;
  const supabase = await createClient();

  let summary = null;

  if (type === "tip") {
    const { data: tip } = await supabase
      .from("tips")
      .select("*, talents(display_name, avatar_emoji)")
      .eq("id", id)
      .maybeSingle();
    if (!tip) notFound();
    summary = {
      title: "投げ銭のお支払い",
      talentName: tip.talents?.display_name,
      emoji: tip.talents?.avatar_emoji,
      lines: [
        ["金額", `¥${tip.amount.toLocaleString()}`],
        ["宛先", tip.talents?.display_name],
        ...(tip.message ? [["メッセージ", tip.message]] : []),
      ],
    };
  } else if (type === "subscribe") {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*, talents(display_name, avatar_emoji, monthly_plan_price)")
      .eq("id", id)
      .maybeSingle();
    if (!sub) notFound();
    summary = {
      title: "月額会員のお申し込み",
      talentName: sub.talents?.display_name,
      emoji: sub.talents?.avatar_emoji,
      lines: [
        ["月額料金", `¥${sub.talents?.monthly_plan_price?.toLocaleString()} / 月`],
        ["加入先", sub.talents?.display_name],
      ],
    };
  } else {
    notFound();
  }

  return (
    <div className="relative mx-auto max-w-md overflow-hidden px-4 py-20 sm:px-6">
      <div
        className="glow-blob animate-drift h-64 w-64 bg-glow"
        style={{ top: "-3rem", right: "-4rem" }}
      />
      <div className="card-soft relative animate-fade-in-up p-8">
        <p className="mb-3 inline-block rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-300">
          テスト環境・デモ決済
        </p>
        <h1 className="font-heading text-xl font-bold text-brand-dark">{summary.title}</h1>
        <p className="mt-1 text-sm text-foreground/50">
          {summary.emoji} {summary.talentName}
        </p>

        <dl className="mt-6 space-y-2.5 border-t border-brand-light pt-5 text-sm">
          {summary.lines.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-foreground/40">{label}</dt>
              <dd className="text-right font-medium text-foreground">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 rounded-2xl bg-brand-light/50 px-4 py-3.5 text-xs leading-relaxed text-foreground/60">
          この環境では決済プロバイダ（Stripe）が未接続のため、実際の課金は発生しません。
          下のボタンで決済完了の動作を確認できます。本番接続後はここが実際のカード決済画面に置き換わります。
        </p>

        <DemoConfirmButton type={type} id={id} />
      </div>
    </div>
  );
}
