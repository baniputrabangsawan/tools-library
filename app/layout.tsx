import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { languageCookieName, parseLanguage } from "@/lib/i18n";
import { LanguageProvider } from "@/lib/use-language";
import { PwaChrome } from "@/components/pwa-chrome";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "My Tools - Personal resource library",
  description: "A visual library for the websites and tools you want to find again.",
  manifest: "/manifest.webmanifest",
  applicationName: "My Tools",
  appleWebApp: {
    capable: true,
    title: "My Tools",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#101318" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem("my-tools-theme");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

const languageMigrateScript = `(function(){try{var k="my-tools-language";var m=document.cookie.match(/(?:^|; )my-tools-language=([^;]*)/);var c=m?decodeURIComponent(m[1]):"";if(c==="id"||c==="en")return;var ls=localStorage.getItem(k);if(ls!=="id"&&ls!=="en")return;document.cookie=k+"="+ls+"; path=/; max-age=31536000; SameSite=Lax";location.reload();}catch(e){}})();`;

const pwaScript = `(function(){try{window.__pwaPrompt=null;window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__pwaPrompt=e;window.dispatchEvent(new Event("pwa:prompt"));});if("serviceWorker"in navigator)navigator.serviceWorker.register("/sw.js");}catch(e){}})();`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const language = parseLanguage((await cookies()).get(languageCookieName)?.value);
  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: languageMigrateScript }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: pwaScript }} />
      </head>
      <body className={`${geist.variable} ${geistMono.variable}`}>
        <LanguageProvider initialLanguage={language}>
          {children}
          <PwaChrome />
        </LanguageProvider>
      </body>
    </html>
  );
}
