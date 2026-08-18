"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Bookmark, ExternalLink, Heart, ImageOff, Tag } from "lucide-react";
import { categoryLabel, typeLabel } from "@/lib/i18n";
import { Tool } from "@/lib/types";
import { domainOf, loadTools, saveTools } from "@/lib/storage";
import { subcategoryLabel, tagLabel, toolDescription } from "@/lib/tool-translations";
import { useLanguage } from "@/lib/use-language";

export function ToolDetail({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const [tool, setTool] = useState<Tool | null | undefined>(undefined);
  const [previewError, setPreviewError] = useState(false);
  useEffect(() => setTool(loadTools().find((item) => item.slug === slug) ?? null), [slug]);
  if (tool === undefined) return <main className="detail-shell"><p className="loading-copy">{t("loadingTool")}</p></main>;
  if (!tool) return <main className="detail-shell"><Link href="/" className="back-link"><ArrowLeft size={17} />{t("backToLibrary")}</Link><div className="not-found"><Bookmark size={30} /><h1>{t("toolNotFound")}</h1><p>{t("toolNotFoundHelp")}</p></div></main>;
  const currentTool = tool;
  function toggleFavorite() { const all = loadTools(); const now = new Date().toISOString(); const next = all.map((item) => item.id === currentTool.id ? { ...item, favorite: !item.favorite, favoritedAt: item.favorite ? undefined : now, updatedAt: now } : item); saveTools(next); setTool(next.find((item) => item.id === currentTool.id) ?? null); }
  return <main className="detail-shell"><header className="detail-nav"><Link href="/" className="back-link"><ArrowLeft size={17} />{t("library")}</Link><button className={`favorite-button large ${tool.favorite ? "is-favorite" : ""}`} onClick={toggleFavorite} aria-pressed={tool.favorite}><Heart size={18} fill={tool.favorite ? "currentColor" : "none"} />{tool.favorite ? t("saved") : t("save")}</button></header><section className="detail-hero"><div className="tool-identity detail-identity"><img src={tool.favicon} alt="" /><div><p className="eyebrow">{typeLabel(language, tool.type)}</p><h1>{tool.name}</h1></div></div><p>{toolDescription(language, tool.name, tool.description)}</p><div className="tool-meta"><span>{categoryLabel(language, tool.category)}</span><i>/</i><span>{subcategoryLabel(language, tool.subcategory)}</span></div><a className="external-button" href={tool.url} target="_blank" rel="noreferrer">{t("openWebsite")} <ExternalLink size={17} /></a></section><section className="detail-grid"><div className="preview-panel"><div className="section-label">{t("websitePreview")}</div>{!previewError ? <img src={tool.screenshot} alt={`${t("screenshotPreview")} ${tool.name}`} onError={() => setPreviewError(true)} /> : <div className="preview-fallback"><ImageOff size={28} /><p>{t("previewUnavailable")}</p><a href={tool.url} target="_blank" rel="noreferrer">{t("openOriginal")} <ArrowUpRight size={15} /></a></div>}</div><aside className="info-panel"><div><span>{t("domain")}</span><a href={tool.url} target="_blank" rel="noreferrer">{domainOf(tool.url)} <ArrowUpRight size={14} /></a></div><div><span>{t("type")}</span><p>{typeLabel(language, tool.type)}</p></div><div><span>{t("tags")}</span><p className="detail-tags"><Tag size={14} />{tool.tags.map((tag) => tagLabel(language, tag)).join(" · ")}</p></div>{tool.notes && <div><span>{t("notes")}</span><p>{tool.notes}</p></div>}</aside></section></main>;
}
