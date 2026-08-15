import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isStripeConfigured } from "@/lib/payments";

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const body = await request.json();
  const talentId = body.talentId;
  if (!talentId) {
    return NextResponse.json({ error: "入力内容を確認してください。" }, { status: 400 });
  }

  const { data: sub, error } = await supabase
    .from("subscriptions")
    .upsert(
      { talent_id: talentId, fan_id: user.id, status: "incomplete" },
      { onConflict: "talent_id,fan_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (isStripeConfigured()) {
    // TODO: Stripe Checkout Session (subscription mode) をここで作成し、
    // session.url を redirectUrl として返す。
    return NextResponse.json(
      { error: "Stripe連携は準備中です。" },
      { status: 501 }
    );
  }

  return NextResponse.json({
    redirectUrl: `/checkout/demo?type=subscribe&id=${sub.id}`,
  });
}
