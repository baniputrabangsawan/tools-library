"use client";

import Link from "next/link";
import { Bookmark, WifiOff } from "lucide-react";
import { useLanguage } from "@/lib/use-language";

export default function OfflinePage() {
  const { t } = useLanguage();
  return (
    <main className="detail-shell">
      <div className="not-found">
        <WifiOff size={28} />
        <h1>{t("offlineTitle")}</h1>
        <p>{t("offlineHelp")}</p>
        <Link href="/" className="back-link" style={{ marginTop: 16 }}>
          <Bookmark size={16} />
          {t("library")}
        </Link>
      </div>
    </main>
  );
}
