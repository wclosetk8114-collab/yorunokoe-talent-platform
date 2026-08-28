import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Stripeからのイベントを受け取り、投げ銭・月額会員の状態をSupabaseに反映する。
//
// 既知の制限（テストモードでの本実装につき）:
// このプロジェクトのVercel環境変数を追加設定する手段が今は無いため、
// Stripeの署名シークレット(whsec_)によるHMAC検証は行っていない。
// 投げ銭/サブスクのidはランダムなUUID（推測困難）で、かつSupabase側のRLSは
// 「pending→paid」「incomplete/active→active」等ごく限定的な状態遷移のみを
// 許可しているため実害は小さいが、本番（実際の課金）へ切り替える前には
// 署名検証を追加することを強く推奨する。
export async function POST(request) {
  let event;
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const supabase = await createClient();
  const type = event?.type;
  const obj = event?.data?.object;

  try {
    if (type === "checkout.session.completed" && obj) {
      const ref = obj.client_reference_id || "";
      const [kind, id] = ref.split(":");

      if (kind === "tip" && id) {
        await supabase
          .from("tips")
          .update({
            status: "paid",
            stripe_checkout_session_id: obj.id,
          })
          .eq("id", id)
          .eq("status", "pending");
      } else if (kind === "sub" && id) {
        const periodEnd = new Date();
        periodEnd.setDate(periodEnd.getDate() + 30);
        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            stripe_subscription_id: obj.subscription || null,
            stripe_customer_id: obj.customer || null,
            current_period_end: periodEnd.toISOString(),
          })
          .eq("id", id)
          .in("status", ["incomplete", "active"]);
      }
    } else if (type === "invoice.payment_succeeded" && obj?.subscription) {
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + 30);
      await supabase
        .from("subscriptions")
        .update({
          status: "active",
          current_period_end: periodEnd.toISOString(),
        })
        .eq("stripe_subscription_id", obj.subscription)
        .eq("status", "active");
    } else if (type === "customer.subscription.deleted" && obj?.id) {
      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", obj.id)
        .eq("status", "active");
    }
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
