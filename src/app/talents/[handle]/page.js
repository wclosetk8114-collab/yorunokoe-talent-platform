import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TipPanel from "@/components/TipPanel";
import SubscribePanel from "@/components/SubscribePanel";

export const dynamic = "force-dynamic";

export default async function TalentPage({ params }) {
  const { handle } = await params;
  const supabase = await createClient();

  const { data: talent } = await supabase
    .from("talents")
    .select("*")
    .eq("handle", handle)
    .eq("is_active", true)
    .maybeSingle();

  if (!talent) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let subscription = null;
  if (user) {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("talent_id", talent.id)
      .eq("fan_id", user.id)
      .maybeSingle();
    subscription = data;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-5">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-4xl"
          style={{ backgroundColor: `${talent.accent_color}1A` }}
        >
          {talent.avatar_emoji}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{talent.display_name}</h1>
          <p className="mt-1 text-accent">{talent.tagline}</p>
        </div>
      </div>

      <p className="mt-6 whitespace-pre-line leading-relaxed text-foreground/75">
        {talent.bio}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TipPanel talent={talent} isLoggedIn={!!user} />
        <SubscribePanel talent={talent} isLoggedIn={!!user} subscription={subscription} />
      </div>
    </div>
  );
}
