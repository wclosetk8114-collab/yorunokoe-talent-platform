import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/mypage");
  }

  const [{ data: subscriptions }, { data: tips }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("*, talents(handle, display_name, avatar_emoji)")
      .eq("fan_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("tips")
      .select("*, talents(handle, display_name, avatar_emoji)")
      .eq("fan_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="font-heading text-xl font-bold text-brand-dark">マイページ</h1>
      <p className="mt-1 text-sm text-foreground/45">{user.email} でログイン中</p>

      <section className="mt-10 animate-fade-in-up">
        <h2 className="mb-4 text-sm font-bold text-foreground/55">🌙 加入中の月額会員</h2>
        {!subscriptions?.length && (
          <p className="card-soft p-6 text-sm text-foreground/45">
            まだ加入しているタレントはいません。
          </p>
        )}
        <div className="space-y-3">
          {subscriptions?.map((s) => (
            <div
              key={s.id}
              className="card-soft flex items-center justify-between px-5 py-4"
            >
              <span>
                {s.talents?.avatar_emoji} {s.talents?.display_name}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  s.status === "active"
                    ? "bg-accent-light text-accent"
                    : "bg-brand-light/70 text-foreground/45"
                }`}
              >
                {s.status === "active" ? "会員中" : s.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 animate-fade-in-up">
        <h2 className="mb-4 text-sm font-bold text-foreground/55">💜 投げ銭の履歴</h2>
        {!tips?.length && (
          <p className="card-soft p-6 text-sm text-foreground/45">
            まだ投げ銭の履歴はありません。
          </p>
        )}
        <div className="space-y-3">
          {tips?.map((t) => (
            <div
              key={t.id}
              className="card-soft flex items-center justify-between px-5 py-4 text-sm"
            >
              <span>
                {t.talents?.avatar_emoji} {t.talents?.display_name}
              </span>
              <span className="font-semibold text-brand">¥{t.amount.toLocaleString()}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  t.status === "paid"
                    ? "bg-accent-light text-accent"
                    : "bg-brand-light/70 text-foreground/45"
                }`}
              >
                {t.status === "paid" ? "完了" : t.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
