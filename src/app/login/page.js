import LoginForm from "@/components/LoginForm";

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;

  return (
    <div className="relative mx-auto max-w-sm overflow-hidden px-4 py-20 sm:px-6">
      <div
        className="glow-blob animate-drift h-64 w-64 bg-brand-soft"
        style={{ top: "-3rem", left: "-4rem" }}
      />
      <div className="card-soft relative animate-fade-in-up p-8">
        <h1 className="font-heading text-center text-xl font-bold text-brand-dark">
          ログイン / 新規登録
        </h1>
        <p className="mt-2 text-center text-xs text-foreground/45">
          メールアドレスとパスワードでファン登録できます。
        </p>
        <LoginForm nextPath={next || "/"} />
      </div>
    </div>
  );
}
