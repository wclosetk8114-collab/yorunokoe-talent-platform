import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  const { data: talent, error: talentError } = await supabase
    .from("talents")
    .select("id, stripe_subscribe_link")
    .eq("id", talentId)
    .single();

  if (talentError || !talent) {
    return NextResponse.json({ error: "タレントが見つかりません。" }, { status: 404 });
  }

  if (!talent.stripe_subscribe_link) {
    return NextResponse.json(
      { error: "このタレントの月額プランは準備中です。" },
      { status: 501 }
    );
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

  const url = new URL(talent.stripe_subscribe_link);
  url.searchParams.set("client_reference_id", `sub:${sub.id}`);
  if (user.email) {
    url.searchParams.set("prefilled_email", user.email);
  }

  return NextResponse.json({ redirectUrl: url.toString() });
}
