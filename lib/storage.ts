import { seedTools } from "@/lib/tools";
import { Tool } from "@/lib/types";

const storageKey = "my-tools-library-v1";

export function loadTools(): Tool[] {
  if (typeof window === "undefined") return seedTools;
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return seedTools;
    const savedTools = JSON.parse(saved) as Tool[];
    const savedIds = new Set(savedTools.map((tool) => tool.id));
    const merged = [...savedTools, ...seedTools.filter((tool) => !savedIds.has(tool.id))];
    if (merged.length !== savedTools.length) window.localStorage.setItem(storageKey, JSON.stringify(merged));
    return merged;
  } catch {
    return seedTools;
  }
}

export function saveTools(tools: Tool[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(tools));
}

export function domainOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "untitled-tool";
}
