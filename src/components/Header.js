import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-20 border-b border-brand/15 bg-[#0a0806]/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🌙</span>
          <span className="font-heading text-lg font-bold tracking-wide text-brand">
            よるのこえ <span className="font-normal text-accent">Talent</span>
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/"
            className="hidden text-foreground/60 transition hover:text-brand sm:inline"
          >
            タレント一覧
          </Link>
          {user ? (
            <>
              <Link href="/mypage" className="text-foreground/60 transition hover:text-brand">
                マイページ
              </Link>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-full bg-brand/[0.08] px-4 py-1.5 text-brand shadow-sm shadow-brand-soft/30 ring-1 ring-inset ring-brand-soft/30 transition hover:bg-brand-light"
                >
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-brand px-5 py-2 text-ink shadow-md shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-deep hover:text-brand-dark hover:shadow-lg"
            >
              ログイン / 新規登録
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
