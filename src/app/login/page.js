import LoginForm from "@/components/LoginForm";

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-center text-xl font-bold text-brand">ログイン / 新規登録</h1>
      <p className="mt-2 text-center text-xs text-foreground/60">
        メールアドレスとパスワードでファン登録できます。
      </p>
      <LoginForm nextPath={next || "/"} />
    </div>
  );
}
