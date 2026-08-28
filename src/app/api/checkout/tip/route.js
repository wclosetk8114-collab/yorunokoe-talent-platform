import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTipPaymentLink } from "@/lib/stripeLinks";

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const body = await request.json();
  const amount = Number(body.amount);
  const talentId = body.talentId;
  const message = (body.message || "").slice(0, 300);

  if (!talentId || !amount) {
    return NextResponse.json({ error: "入力内容を確認してください。" }, { status: 400 });
  }

  const paymentLink = getTipPaymentLink(amount);
  if (!paymentLink) {
    return NextResponse.json(
      { error: "現在は ¥300 / ¥500 / ¥1000 / ¥3000 からお選びください。" },
      { status: 400 }
    );
  }

  const { data: tip, error } = await supabase
    .from("tips")
    .insert({
      talent_id: talentId,
      fan_id: user.id,
      amount,
      message,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const url = new URL(paymentLink);
  url.searchParams.set("client_reference_id", `tip:${tip.id}`);
  if (user.email) {
    url.searchParams.set("prefilled_email", user.email);
  }

  return NextResponse.json({ redirectUrl: url.toString() });
}
