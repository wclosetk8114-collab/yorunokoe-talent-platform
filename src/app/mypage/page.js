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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-xl font-bold text-brand">マイページ</h1>
      <p className="mt-1 text-sm text-foreground/60">{user.email} でログイン中</p>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-foreground/70">加入中の月額会員</h2>
        {!subscriptions?.length && (
          <p className="text-sm text-foreground/50">まだ加入しているタレントはいません。</p>
        )}
        <div className="space-y-2">
          {subscriptions?.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-brand-light bg-white px-4 py-3"
            >
              <span>
                {s.talents?.avatar_emoji} {s.talents?.display_name}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  s.status === "active"
                    ? "bg-accent/10 text-accent"
                    : "bg-foreground/10 text-foreground/50"
                }`}
              >
                {s.status === "active" ? "会員中" : s.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-bold text-foreground/70">投げ銭の履歴</h2>
        {!tips?.length && (
          <p className="text-sm text-foreground/50">まだ投げ銭の履歴はありません。</p>
        )}
        <div className="space-y-2">
          {tips?.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-brand-light bg-white px-4 py-3 text-sm"
            >
              <span>
                {t.talents?.avatar_emoji} {t.talents?.display_name}
              </span>
              <span className="font-semibold text-brand">¥{t.amount.toLocaleString()}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  t.status === "paid"
                    ? "bg-accent/10 text-accent"
                    : "bg-foreground/10 text-foreground/50"
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
