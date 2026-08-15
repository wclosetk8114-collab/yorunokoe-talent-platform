import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: talents, error } = await supabase
    .from("talents")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  return (
    <div>
      <section className="relative overflow-hidden px-4 py-24 sm:px-6">
        <div
          className="glow-blob animate-drift h-72 w-72 bg-brand-soft"
          style={{ top: "-4rem", left: "-3rem" }}
        />
        <div
          className="glow-blob animate-drift h-80 w-80 bg-glow"
          style={{ top: "2rem", right: "-5rem", animationDelay: "2s" }}
        />
        <div
          className="glow-blob animate-drift h-64 w-64 bg-accent-light"
          style={{ bottom: "-3rem", left: "35%", animationDelay: "4s" }}
        />

        <div className="relative mx-auto max-w-2xl text-center animate-fade-in-up">
          <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent">
            ⋆ HEALING ASMR TALENT AGENCY ⋆
          </p>
          <h1 className="font-heading text-3xl font-bold leading-relaxed text-brand-dark sm:text-4xl">
            「安心できる声」を、
            <br className="sm:hidden" />
            すべての人へ。
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-loose text-foreground/60">
            よるのこえ Talent は、安心感のある声質・語り口を持つ ASMR
            配信者が所属する、癒し系タレント事務所です。
            <br className="hidden sm:block" />
            投げ銭やファンクラブ加入で、お気に入りのタレントをそっと応援できます。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <h2 className="font-heading mb-8 text-center text-xl font-bold text-brand-dark">
          🌙 所属タレント
        </h2>

        {error && (
          <p className="card-soft mx-auto max-w-md p-6 text-center text-sm text-red-500">
            タレント情報の取得に失敗しました：{error.message}
          </p>
        )}

        {!error && (!talents || talents.length === 0) && (
          <p className="text-center text-foreground/50">現在準備中です。少々お待ちください。</p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {talents?.map((talent, i) => (
            <Link
              key={talent.id}
              href={`/talents/${talent.handle}`}
              className="card-soft animate-fade-in-up group p-7"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl transition group-hover:scale-105"
                style={{ backgroundColor: `${talent.accent_color}17` }}
              >
                {talent.avatar_emoji}
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-brand">
                {talent.display_name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/55">
                {talent.tagline}
              </p>
              <p className="mt-5 text-xs font-semibold tracking-wide text-accent">
                月額会員 ¥{talent.monthly_plan_price?.toLocaleString()}〜
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
