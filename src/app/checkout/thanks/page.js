import Link from "next/link";

export default async function ThanksPage({ searchParams }) {
  const { type } = await searchParams;
  const isSubscribe = type === "subscribe";

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      <div className="text-5xl">🌙💜</div>
      <h1 className="mt-4 text-xl font-bold text-brand">
        {isSubscribe ? "ご加入ありがとうございます" : "投げ銭ありがとうございます"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-foreground/70">
        {isSubscribe
          ? "月額会員としての登録が完了しました。マイページから加入状況を確認できます。"
          : "応援メッセージがタレントに届きました。"}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/mypage"
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          マイページへ
        </Link>
        <Link
          href="/"
          className="rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand hover:bg-brand-light"
        >
          タレント一覧へ
        </Link>
      </div>
    </div>
  );
}
