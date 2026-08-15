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
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <div className="mb-4 flex rounded-full bg-brand-light p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full py-1.5 font-semibold transition ${
            mode === "login" ? "bg-white text-brand shadow-sm" : "text-foreground/60"
          }`}
        >
          ログイン
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-full py-1.5 font-semibold transition ${
            mode === "signup" ? "bg-white text-brand shadow-sm" : "text-foreground/60"
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
          className="w-full rounded-lg border border-brand-light px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      )}
      <input
        type="email"
        required
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-brand-light px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
      <input
        type="password"
        required
        minLength={6}
        placeholder="パスワード（6文字以上）"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-lg border border-brand-light px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
      {notice && <p className="text-xs text-accent">{notice}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
      >
        {loading ? "処理中..." : mode === "signup" ? "登録する" : "ログインする"}
      </button>
    </form>
  );
}
