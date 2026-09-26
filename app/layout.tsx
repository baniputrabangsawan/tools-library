import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { languageCookieName, parseLanguage } from "@/lib/i18n";
import { LanguageProvider } from "@/lib/use-language";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "My Tools - Personal resource library",
  description: "A visual library for the websites and tools you want to find again.",
};

const themeScript = `(function(){try{var t=localStorage.getItem("my-tools-theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

const languageMigrateScript = `(function(){try{var k="my-tools-language";var m=document.cookie.match(/(?:^|; )my-tools-language=([^;]*)/);var c=m?decodeURIComponent(m[1]):"";if(c==="id"||c==="en")return;var ls=localStorage.getItem(k);if(ls!=="id"&&ls!=="en")return;document.cookie=k+"="+ls+"; path=/; max-age=31536000; SameSite=Lax";location.reload();}catch(e){}})();`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const language = parseLanguage((await cookies()).get(languageCookieName)?.value);
  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: languageMigrateScript }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <LanguageProvider initialLanguage={language}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
