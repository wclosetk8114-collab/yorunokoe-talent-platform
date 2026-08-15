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
      <section className="bg-gradient-to-b from-brand-light to-background px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold tracking-wide text-accent">
            HEALING ASMR TALENT AGENCY
          </p>
          <h1 className="text-3xl font-bold text-brand sm:text-4xl">
            「安心できる声」を、すべての人へ。
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/70">
            よるのこえ Talent は、安心感のある声質・語り口を持つ ASMR
            配信者が所属する癒し系タレント事務所です。投げ銭やファンクラブ加入で、
            お気に入りのタレントを直接応援できます。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-xl font-bold text-brand">所属タレント</h2>

        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
            タレント情報の取得に失敗しました：{error.message}
          </p>
        )}

        {!error && (!talents || talents.length === 0) && (
          <p className="text-foreground/60">現在準備中です。少々お待ちください。</p>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {talents?.map((talent) => (
            <Link
              key={talent.id}
              href={`/talents/${talent.handle}`}
              className="group rounded-2xl border border-brand-light bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                style={{ backgroundColor: `${talent.accent_color}1A` }}
              >
                {talent.avatar_emoji}
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-brand">
                {talent.display_name}
              </h3>
              <p className="mt-1 text-sm text-foreground/60">{talent.tagline}</p>
              <p className="mt-4 text-xs font-semibold text-accent">
                月額会員 ¥{talent.monthly_plan_price?.toLocaleString()}〜
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
