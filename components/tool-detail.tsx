"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Bookmark, ExternalLink, Heart, ImageOff, Star, Tag } from "lucide-react";
import { categoryLabel, typeLabel } from "@/lib/i18n";
import { Tool } from "@/lib/types";
import { domainOf, loadTools, saveTools } from "@/lib/storage";
import { subcategoryLabel, tagLabel, toolDescription } from "@/lib/tool-translations";
import { useLanguage } from "@/lib/use-language";
import { formatGitHubStars, useGitHubStars } from "@/lib/use-github-stars";

export function ToolDetail({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const [tool, setTool] = useState<Tool | null | undefined>(undefined);
  const [previewError, setPreviewError] = useState(false);
  const router = useRouter();
  useEffect(() => {
    function onSearchHotkey(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      sessionStorage.setItem("my-tools-focus-search", "1");
      router.push("/");
    }
    window.addEventListener("keydown", onSearchHotkey);
    return () => window.removeEventListener("keydown", onSearchHotkey);
  }, [router]);
  const githubStars = useGitHubStars(tool ? [tool] : []);
  useEffect(() => setTool(loadTools().find((item) => item.slug === slug) ?? null), [slug]);
  if (tool === undefined) return <main className="detail-shell"><p className="loading-copy">{t("loadingTool")}</p></main>;
  if (!tool) {
    return (
      <main className="detail-shell">
        <Link href="/" className="back-link"><ArrowLeft size={16} />{t("backToLibrary")}</Link>
        <div className="not-found"><Bookmark size={28} /><h1>{t("toolNotFound")}</h1><p>{t("toolNotFoundHelp")}</p></div>
      </main>
    );
  }
  const currentTool = tool;
  function toggleFavorite() {
    const all = loadTools();
    const now = new Date().toISOString();
    const next = all.map((item) => item.id === currentTool.id ? { ...item, favorite: !item.favorite, favoritedAt: item.favorite ? undefined : now, updatedAt: now } : item);
    saveTools(next);
    setTool(next.find((item) => item.id === currentTool.id) ?? null);
  }
  const starCount = githubStars[tool.id];
  return (
    <main className="detail-shell">
      <header className="detail-nav">
        <Link href="/" className="back-link"><ArrowLeft size={16} />{t("library")}</Link>
        <button className={`favorite-button large ${tool.favorite ? "is-favorite" : ""}`} onClick={toggleFavorite} aria-pressed={tool.favorite}>
          <Heart size={16} fill={tool.favorite ? "currentColor" : "none"} />
          {tool.favorite ? t("saved") : t("save")}
        </button>
      </header>
      <section className="detail-hero">
        <div className="tool-identity detail-identity">
          <img src={tool.favicon} alt="" />
          <div>
            <p className="eyebrow">{typeLabel(language, tool.type)}</p>
            <h1>{tool.name}</h1>
          </div>
        </div>
        <p>{toolDescription(language, tool.name, tool.description)}</p>
        <div className="tool-meta">
          <span>{categoryLabel(language, tool.category)}</span>
          <i>/</i>
          <span>{subcategoryLabel(language, tool.subcategory)}</span>
        </div>
        <a className="external-button" href={tool.url} target="_blank" rel="noreferrer">{t("openWebsite")} <ExternalLink size={16} /></a>
      </section>
      <section className="detail-grid">
        <div className="preview-panel">
          <div className="section-label">{t("websitePreview")}</div>
          {!previewError ? (
            <img src={tool.screenshot} alt={`${t("screenshotPreview")} ${tool.name}`} onError={() => setPreviewError(true)} />
          ) : (
            <div className="preview-fallback">
              <ImageOff size={26} />
              <p>{t("previewUnavailable")}</p>
              <a href={tool.url} target="_blank" rel="noreferrer">{t("openOriginal")} <ArrowUpRight size={14} /></a>
            </div>
          )}
        </div>
        <aside className="info-panel">
          <div>
            <span>{t("domain")}</span>
            <a href={tool.url} target="_blank" rel="noreferrer">{domainOf(tool.url)} <ArrowUpRight size={13} /></a>
          </div>
          <div>
            <span>{t("type")}</span>
            <p>{typeLabel(language, tool.type)}</p>
          </div>
          {starCount !== undefined && (
            <div>
              <span>{t("githubStars")}</span>
              <p className="github-stars-detail">
                <Star size={13} fill="currentColor" aria-hidden="true" />
                {formatGitHubStars(starCount, language)}
                <small>({starCount.toLocaleString(language === "id" ? "id-ID" : "en-US")})</small>
              </p>
            </div>
          )}
          <div>
            <span>{t("tags")}</span>
            <p className="detail-tags"><Tag size={13} />{tool.tags.map((item) => tagLabel(language, item)).join(" · ")}</p>
          </div>
          {tool.notes && <div><span>{t("notes")}</span><p>{tool.notes}</p></div>}
        </aside>
      </section>
    </main>
  );
}
