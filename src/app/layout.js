import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "よるのこえ Talent | 癒し系ASMR配信者事務所",
  description:
    "安心できる声に、いつでも会える。よるのこえ Talent 所属タレントを応援しよう。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col text-foreground">
        <div className="moon-deco" aria-hidden="true" />
        <Header />
        <main className="relative z-[1] flex-1">{children}</main>
        <footer className="relative z-[1] mt-8 border-t border-brand/10 bg-brand/[0.02] py-10 text-center text-sm text-foreground/50">
          <p className="font-heading">🌙 よるのこえ Talent — 癒し系ASMR配信者事務所</p>
          <p className="mt-2 text-xs tracking-wide">
            © 2026 Yorunokoe Talent. 本サイトはプロトタイプ版です。
          </p>
        </footer>
      </body>
    </html>
  );
}
