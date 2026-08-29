"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ nextPath }) {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName || email.split("@")[0] } },
        });
        if (error) throw error;
        setNotice(
          "登録しました。確認メールが届いている場合はリンクをクリックしてからログインしてください。"
        );
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(nextPath);
        router.refresh();
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-3">
      <div className="mb-5 flex rounded-full bg-brand-light/60 p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full py-2 font-semibold transition-all duration-200 ${
            mode === "login"
              ? "bg-brand text-ink shadow-sm shadow-brand/40"
              : "text-foreground/45"
          }`}
        >
          ログイン
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-full py-2 font-semibold transition-all duration-200 ${
            mode === "signup"
              ? "bg-brand text-ink shadow-sm shadow-brand/40"
              : "text-foreground/45"
          }`}
        >
          新規登録
        </button>
      </div>

      {mode === "signup" && (
        <input
          type="text"
          placeholder="表示名（任意）"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-2xl bg-brand-light/40 px-4 py-2.5 text-sm placeholder:text-foreground/35 focus:bg-brand-light/80 focus:outline-none focus:ring-2 focus:ring-brand-soft"
        />
      )}
      <input
        type="email"
        required
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-2xl bg-brand-light/40 px-4 py-2.5 text-sm placeholder:text-foreground/35 focus:bg-brand-light/80 focus:outline-none focus:ring-2 focus:ring-brand-soft"
      />
      <input
        type="password"
        required
        minLength={6}
        placeholder="パスワード（6文字以上）"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-2xl bg-brand-light/40 px-4 py-2.5 text-sm placeholder:text-foreground/35 focus:bg-brand-light/80 focus:outline-none focus:ring-2 focus:ring-brand-soft"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
      {notice && <p className="text-xs text-accent">{notice}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-ink shadow-md shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-deep hover:text-brand-dark hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? "処理中..." : mode === "signup" ? "登録する" : "ログインする"}
      </button>
    </form>
  );
}
