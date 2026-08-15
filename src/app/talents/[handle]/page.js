import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TipPanel from "@/components/TipPanel";
import SubscribePanel from "@/components/SubscribePanel";
import VoiceSample from "@/components/VoiceSample";

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
    <div className="relative mx-auto max-w-3xl overflow-hidden px-4 py-14 sm:px-6">
      <div
        className="glow-blob h-72 w-72"
        style={{ top: "-2rem", right: "-4rem", backgroundColor: `${talent.accent_color}22` }}
      />

      <div className="relative flex items-center gap-5 animate-fade-in-up">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-4xl shadow-inner"
          style={{ backgroundColor: `${talent.accent_color}17` }}
        >
          {talent.avatar_emoji}
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {talent.display_name}
          </h1>
          <p className="mt-1 text-accent">{talent.tagline}</p>
        </div>
      </div>

      <p className="relative mt-7 whitespace-pre-line text-[15px] leading-loose text-foreground/65">
        {talent.bio}
      </p>

      <VoiceSample handle={talent.handle} />

      <div className="relative mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TipPanel talent={talent} isLoggedIn={!!user} />
        <SubscribePanel talent={talent} isLoggedIn={!!user} subscription={subscription} />
      </div>
    </div>
  );
}
