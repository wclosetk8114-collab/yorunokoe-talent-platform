import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-20 border-b border-brand-light bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🌙</span>
          <span className="text-lg font-bold tracking-tight text-brand">
            よるのこえ <span className="font-normal text-accent">Talent</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hidden text-foreground/70 hover:text-brand sm:inline">
            タレント一覧
          </Link>
          {user ? (
            <>
              <Link href="/mypage" className="text-foreground/70 hover:text-brand">
                マイページ
              </Link>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-full border border-brand/30 px-4 py-1.5 text-brand transition hover:bg-brand-light"
                >
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-brand px-4 py-1.5 text-white transition hover:bg-brand-dark"
            >
              ログイン / 新規登録
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
