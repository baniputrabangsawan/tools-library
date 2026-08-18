"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, Bookmark, Check, CirclePlus, FolderOpen, Globe2, Heart, Menu,
  Moon, Pencil, Search, SlidersHorizontal, Sparkles, Sun, Tags, Trash2, X,
} from "lucide-react";
import { categoryLabel, typeLabel } from "@/lib/i18n";
import { categories, Tool, ToolInput, ToolType, types } from "@/lib/types";
import { domainOf, loadTools, saveTools, slugify } from "@/lib/storage";
import { subcategoryLabel, tagLabel, toolDescription } from "@/lib/tool-translations";
import { useLanguage } from "@/lib/use-language";

type Filter = "All" | Tool["category"];
type ModalState = { mode: "create" } | { mode: "edit"; tool: Tool } | null;

const defaultInput: ToolInput = {
  name: "", url: "", description: "", category: "Design", subcategory: "", type: "Website", tags: [], favorite: false, notes: "",
};

function isSkillTool(tool: Tool) {
  return tool.subcategory.toLowerCase().includes("skill") || tool.tags.some((tag) => tag.toLowerCase() === "skills" || tag.toLowerCase() === "skill");
}

export function LibraryApp() {
  const { language, setLanguage, t } = useLanguage();
  const [tools, setTools] = useState<Tool[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Filter>("All");
  const [type, setType] = useState<"All" | ToolType>("All");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [skillsOnly, setSkillsOnly] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setTools(loadTools());
    const preferred = window.localStorage.getItem("my-tools-theme");
    setDark(preferred ? preferred === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const matching = tools.filter((tool) => {
      const localized = [
        toolDescription(language, tool.name, tool.description),
        categoryLabel(language, tool.category),
        subcategoryLabel(language, tool.subcategory),
        typeLabel(language, tool.type),
        tool.tags.map((tag) => tagLabel(language, tag)).join(" "),
      ];
      const searchable = [tool.name, tool.description, tool.category, tool.subcategory, tool.type, tool.tags.join(" "), ...localized, domainOf(tool.url)].join(" ").toLowerCase();
      const inActiveCollection = favoritesOnly ? tool.favorite : skillsOnly ? isSkillTool(tool) : !isSkillTool(tool);
      return (!normalized || searchable.includes(normalized)) &&
        (category === "All" || tool.category === category) &&
        (type === "All" || tool.type === type) &&
        inActiveCollection;
    });
    return matching.sort((a, b) => {
      if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
      if (!a.favorite) return 0;
      return Date.parse(b.favoritedAt ?? b.updatedAt) - Date.parse(a.favoritedAt ?? a.updatedAt);
    });
  }, [tools, query, category, type, favoritesOnly, skillsOnly, language]);

  function commit(next: Tool[]) { setTools(next); saveTools(next); }
  function toggleFavorite(id: string) {
    const now = new Date().toISOString();
    commit(tools.map((tool) => tool.id === id ? { ...tool, favorite: !tool.favorite, favoritedAt: tool.favorite ? undefined : now, updatedAt: now } : tool));
  }
  function removeTool(id: string) { if (window.confirm(t("deleteConfirm"))) commit(tools.filter((tool) => tool.id !== id)); }
  function saveTool(input: ToolInput, existing?: Tool) {
    const now = new Date().toISOString();
    const baseSlug = slugify(input.name);
    const slug = existing?.slug ?? `${baseSlug}${tools.some((tool) => tool.slug === baseSlug) ? `-${Date.now().toString().slice(-5)}` : ""}`;
    const domain = domainOf(input.url);
    const next: Tool = {
      ...input, id: existing?.id ?? crypto.randomUUID(), slug,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      screenshot: `https://image.thum.io/get/width/1200/crop/800/noanimate/${input.url}`,
      createdAt: existing?.createdAt ?? now, updatedAt: now,
    };
    commit(existing ? tools.map((tool) => tool.id === existing.id ? next : tool) : [next, ...tools]);
    setModal(null);
  }

  function setTheme() { const next = !dark; setDark(next); window.localStorage.setItem("my-tools-theme", next ? "dark" : "light"); }
  const regularTools = tools.filter((tool) => !isSkillTool(tool));
  const skillTools = tools.filter(isSkillTool);
  const categoryCounts = categories.map((item) => ({ name: item, count: regularTools.filter((tool) => tool.category === item).length }));

  return (
    <main className="app-shell">
      <aside className={`sidebar ${showMobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand-row"><div className="brand-mark"><Bookmark size={18} fill="currentColor" /></div><span>My Tools</span><button className="icon-button mobile-close" onClick={() => setShowMobileMenu(false)} aria-label={t("closeMenu")}><X size={20} /></button></div>
        <button className="add-button" onClick={() => setModal({ mode: "create" })}><CirclePlus size={18} />{t("addTool")}</button>
        <nav className="side-nav" aria-label={t("libraryNavigation")}>
          <button className={!favoritesOnly && !skillsOnly && category === "All" ? "active" : ""} onClick={() => { setCategory("All"); setFavoritesOnly(false); setSkillsOnly(false); setShowMobileMenu(false); }}><FolderOpen size={17} />{t("allTools")} <span>{regularTools.length}</span></button>
          <button className={favoritesOnly ? "active" : ""} onClick={() => { setCategory("All"); setFavoritesOnly(true); setSkillsOnly(false); setShowMobileMenu(false); }}><Heart size={17} />{t("favorites")} <span>{tools.filter((tool) => tool.favorite).length}</span></button>
          <button className={skillsOnly ? "active" : ""} onClick={() => { setCategory("All"); setFavoritesOnly(false); setSkillsOnly(true); setShowMobileMenu(false); }}><Sparkles size={17} />{t("skills")} <span>{skillTools.length}</span></button>
          <p>{t("categories")}</p>
          {categoryCounts.map(({ name, count }) => <button key={name} className={category === name && !favoritesOnly && !skillsOnly ? "active" : ""} onClick={() => { setCategory(name); setFavoritesOnly(false); setSkillsOnly(false); setShowMobileMenu(false); }}><span className="category-indicator" />{categoryLabel(language, name)}<span>{count}</span></button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-footer"><Tags size={15} /> <span>{new Set(tools.flatMap((tool) => tool.tags)).size} {t("tagsInLibrary")}</span></div>
          <div className="language-control">
            <div className="language-label"><Globe2 size={15} aria-hidden="true" /><span>{t("language")}</span></div>
            <div className="language-switch" role="group" aria-label={t("language")}>
              <button type="button" className={language === "id" ? "active" : ""} aria-pressed={language === "id"} onClick={() => setLanguage("id")}>{t("indonesian")}</button>
              <button type="button" className={language === "en" ? "active" : ""} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>{t("english")}</button>
            </div>
          </div>
        </div>
      </aside>
      {showMobileMenu && <button className="backdrop" onClick={() => setShowMobileMenu(false)} aria-label={t("closeNavigation")} />}

      <section className="content">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setShowMobileMenu(true)} aria-label={t("openMenu")}><Menu size={21} /></button>
          <div className="search-wrap"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchPlaceholder")} aria-label={t("searchTools")} />{query && <button onClick={() => setQuery("")} aria-label={t("clearSearch")}><X size={17} /></button>}</div>
          <button className="icon-button theme-button" onClick={setTheme} aria-label={t("toggleTheme")}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
          <button className="add-button desktop-add" onClick={() => setModal({ mode: "create" })}><CirclePlus size={18} />{t("addTool")}</button>
        </header>

        <div className="page-heading">
          <div><p className="eyebrow">{t("personalLibrary")}</p><h1>{favoritesOnly ? t("favorites") : skillsOnly ? t("skills") : category === "All" ? t("heading") : categoryLabel(language, category)}</h1><p>{skillsOnly ? t("skillsIntro") : t("intro")}</p></div>
          <div className="library-stat"><strong>{filtered.length}</strong><span>{filtered.length === 1 ? t("toolFound") : t("toolsFound")}</span></div>
        </div>

        <div className="filters" aria-label={t("filters")}>
          <div className="filter-label"><SlidersHorizontal size={16} />{t("browse")}</div>
          <div className="filter-scroll"><button className={category === "All" && !favoritesOnly ? "selected" : ""} onClick={() => { setCategory("All"); setFavoritesOnly(false); }}>{t("all")}</button>{categories.map((item) => <button key={item} className={category === item && !favoritesOnly ? "selected" : ""} onClick={() => { setCategory(item); setFavoritesOnly(false); }}>{categoryLabel(language, item)}</button>)}</div>
          <select value={type} onChange={(event) => setType(event.target.value as "All" | ToolType)} aria-label={t("filterByType")}><option value="All">{t("allTypes")}</option>{types.map((item) => <option key={item} value={item}>{typeLabel(language, item)}</option>)}</select>
        </div>

        {filtered.length ? <div className="tool-grid">{filtered.map((tool) => <ToolCard key={tool.id} tool={tool} language={language} t={t} onFavorite={toggleFavorite} onEdit={(item) => setModal({ mode: "edit", tool: item })} onDelete={removeTool} />)}</div> : <EmptyState t={t} onReset={() => { setQuery(""); setCategory("All"); setType("All"); setFavoritesOnly(false); setSkillsOnly(false); }} onAdd={() => setModal({ mode: "create" })} />}
      </section>
      {modal && <ToolForm modal={modal} language={language} t={t} onClose={() => setModal(null)} onSave={saveTool} />}
    </main>
  );
}

type T = ReturnType<typeof useLanguage>["t"];

function ToolCard({ tool, language, t, onFavorite, onEdit, onDelete }: { tool: Tool; language: "en" | "id"; t: T; onFavorite: (id: string) => void; onEdit: (tool: Tool) => void; onDelete: (id: string) => void }) {
  return <article className="tool-card">
    <div className="card-top"><div className="tool-identity"><img src={tool.favicon} alt="" /><div><span className="tool-type">{typeLabel(language, tool.type)}</span><h2>{tool.name}</h2></div></div><button className={`favorite-button ${tool.favorite ? "is-favorite" : ""}`} onClick={() => onFavorite(tool.id)} aria-label={tool.favorite ? t("removeFavorite") : t("addFavorite")} aria-pressed={tool.favorite}><Heart size={17} fill={tool.favorite ? "currentColor" : "none"} /></button></div>
    <p className="tool-description">{toolDescription(language, tool.name, tool.description)}</p>
    <div className="tool-meta"><span>{categoryLabel(language, tool.category)}</span><i>/</i><span>{subcategoryLabel(language, tool.subcategory)}</span></div>
    <div className="tag-list">{tool.tags.slice(0, 3).map((tag) => <span key={tag}>{tagLabel(language, tag)}</span>)}</div>
    <div className="card-bottom"><span className="domain">{domainOf(tool.url)}</span><div className="card-actions"><button onClick={() => onEdit(tool)} aria-label={`${t("edit")} ${tool.name}`}><Pencil size={15} /></button><button onClick={() => onDelete(tool.id)} aria-label={`${t("delete")} ${tool.name}`}><Trash2 size={15} /></button><Link href={`/tools/${tool.slug}`}>{t("view")} <ArrowUpRight size={15} /></Link></div></div>
  </article>;
}

function EmptyState({ t, onReset, onAdd }: { t: T; onReset: () => void; onAdd: () => void }) { return <div className="empty-state"><div><Search size={26} /></div><h2>{t("noTools")}</h2><p>{t("noToolsHelp")}</p><span><button className="text-button" onClick={onReset}>{t("resetFilters")}</button><button className="add-button" onClick={onAdd}>{t("addTool")}</button></span></div>; }

function ToolForm({ modal, language, t, onClose, onSave }: { modal: Exclude<ModalState, null>; language: "en" | "id"; t: T; onClose: () => void; onSave: (input: ToolInput, existing?: Tool) => void }) {
  const existing = modal.mode === "edit" ? modal.tool : undefined;
  const [form, setForm] = useState<ToolInput>(existing ? { name: existing.name, url: existing.url, description: existing.description, category: existing.category, subcategory: existing.subcategory, type: existing.type, tags: existing.tags, favorite: existing.favorite, notes: existing.notes ?? "" } : defaultInput);
  const [error, setError] = useState("");
  function change<K extends keyof ToolInput>(key: K, value: ToolInput[K]) { setForm((current) => ({ ...current, [key]: value })); }
  function submit(event: React.FormEvent) { event.preventDefault(); try { new URL(form.url); if (!form.name.trim() || !form.description.trim() || !form.subcategory.trim()) throw new Error(); onSave({ ...form, name: form.name.trim(), url: form.url.trim(), description: form.description.trim(), subcategory: form.subcategory.trim(), tags: form.tags.map((tag) => tag.trim()).filter(Boolean) }, existing); } catch { setError(t("formError")); } }
  return <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="tool-form-title"><div className="modal-card"><div className="modal-header"><div><p className="eyebrow">{existing ? t("updateLibrary") : t("newBookmark")}</p><h2 id="tool-form-title">{existing ? t("editTool") : t("addATool")}</h2></div><button className="icon-button" onClick={onClose} aria-label={t("closeForm")}><X size={20} /></button></div><form onSubmit={submit}><div className="form-grid"><label className="full-width">{t("url")}<input value={form.url} onChange={(event) => change("url", event.target.value)} placeholder="https://example.com" required /></label><label>{t("name")}<input value={form.name} onChange={(event) => change("name", event.target.value)} placeholder={t("toolName")} required /></label><label>{t("type")}<select value={form.type} onChange={(event) => change("type", event.target.value as ToolType)}>{types.map((item) => <option key={item} value={item}>{typeLabel(language, item)}</option>)}</select></label><label>{t("category")}<select value={form.category} onChange={(event) => change("category", event.target.value as Tool["category"])}>{categories.map((item) => <option key={item} value={item}>{categoryLabel(language, item)}</option>)}</select></label><label>{t("subcategory")}<input value={form.subcategory} onChange={(event) => change("subcategory", event.target.value)} placeholder={t("subcategoryPlaceholder")} required /></label><label className="full-width">{t("description")}<textarea value={form.description} onChange={(event) => change("description", event.target.value)} placeholder={t("descriptionPlaceholder")} required rows={3} /></label><label className="full-width">{t("tags")}<input value={form.tags.join(", ")} onChange={(event) => change("tags", event.target.value.split(","))} placeholder={t("tagsPlaceholder")} /><small>{t("tagsHelp")}</small></label><label className="full-width">{t("notes")} <span>({t("optional")})</span><textarea value={form.notes} onChange={(event) => change("notes", event.target.value)} placeholder={t("notesPlaceholder")} rows={2} /></label></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions"><button type="button" className="text-button" onClick={onClose}>{t("cancel")}</button><button type="submit" className="add-button"><Check size={17} />{existing ? t("saveChanges") : t("addTool")}</button></div></form></div></div>;
}
