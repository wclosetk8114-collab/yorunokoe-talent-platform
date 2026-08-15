import Link from "next/link";

export default async function ThanksPage({ searchParams }) {
  const { type } = await searchParams;
  const isSubscribe = type === "subscribe";

  return (
    <div className="relative mx-auto max-w-md overflow-hidden px-4 py-24 text-center sm:px-6">
      <div
        className="glow-blob animate-drift h-72 w-72 bg-brand-soft"
        style={{ top: "-3rem", left: "50%", marginLeft: "-9rem" }}
      />
      <div className="relative animate-fade-in-up">
        <div className="text-5xl">🌙💜</div>
        <h1 className="font-heading mt-5 text-xl font-bold text-brand-dark">
          {isSubscribe ? "ご加入ありがとうございます" : "投げ銭ありがとうございます"}
        </h1>
        <p className="mt-3 text-sm leading-loose text-foreground/55">
          {isSubscribe
            ? "月額会員としての登録が完了しました。マイページから加入状況を確認できます。"
            : "応援メッセージがタレントに届きました。"}
        </p>
        <div className="mt-9 flex justify-center gap-3">
          <Link
            href="/mypage"
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg"
          >
            マイページへ
          </Link>
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-brand shadow-md shadow-brand-soft/40 ring-1 ring-inset ring-brand-soft transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-light"
          >
            タレント一覧へ
          </Link>
        </div>
      </div>
    </div>
  );
}
