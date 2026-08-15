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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-brand-light bg-white/60 py-8 text-center text-sm text-foreground/60">
          <p>よるのこえ Talent — 癒し系ASMR配信者事務所</p>
          <p className="mt-1">© 2026 Yorunokoe Talent. 本サイトはプロトタイプ版です。</p>
        </footer>
      </body>
    </html>
  );
}
