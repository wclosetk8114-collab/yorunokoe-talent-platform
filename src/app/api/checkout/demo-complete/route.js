import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isStripeConfigured } from "@/lib/payments";

export async function POST(request) {
  if (isStripeConfigured()) {
    return NextResponse.json({ error: "デモ決済は無効化されています。" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const { type, id } = await request.json();

  if (type === "tip") {
    const { error } = await supabase
      .from("tips")
      .update({ status: "paid" })
      .eq("id", id)
      .eq("fan_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (type === "subscribe") {
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + 30);
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "active", current_period_end: periodEnd.toISOString() })
      .eq("id", id)
      .eq("fan_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
