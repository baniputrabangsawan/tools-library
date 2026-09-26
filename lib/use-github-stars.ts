"use client";

import { useEffect, useMemo, useState } from "react";
import { Tool } from "@/lib/types";

type CacheEntry = { stars: number; fetchedAt: number };
type StarCache = Record<string, CacheEntry>;

const cacheKey = "my-tools-github-stars-v1";
const cacheLifetime = 6 * 60 * 60 * 1000;

function repositoryFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") return null;
    const [owner, repository] = parsed.pathname.split("/").filter(Boolean);
    if (!owner || !repository) return null;
    return `${owner}/${repository.replace(/\.git$/, "")}`;
  } catch {
    return null;
  }
}

function readCache(): StarCache {
  try {
    return JSON.parse(window.localStorage.getItem(cacheKey) ?? "{}") as StarCache;
  } catch {
    return {};
  }
}

export function useGitHubStars(tools: Tool[]) {
  const repositories = useMemo(
    () => tools.flatMap((tool) => {
      const repository = tool.type === "GitHub Repository" ? repositoryFromUrl(tool.url) : null;
      return repository ? [{ id: tool.id, repository }] : [];
    }),
    [tools],
  );
  const repositoryKey = repositories.map(({ id, repository }) => `${id}:${repository}`).join("|");
  const [stars, setStars] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!repositories.length) return;
    let active = true;
    const cache = readCache();
    const now = Date.now();
    const cachedStars: Record<string, number> = {};
    const stale: typeof repositories = [];

    for (const item of repositories) {
      const cached = cache[item.repository];
      if (cached && now - cached.fetchedAt < cacheLifetime) cachedStars[item.id] = cached.stars;
      else stale.push(item);
    }
    setStars(cachedStars);

    if (!stale.length) return () => { active = false; };

    void Promise.all(stale.map(async ({ id, repository }) => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repository}`, {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!response.ok) return null;
        const data = await response.json() as { stargazers_count?: number };
        if (typeof data.stargazers_count !== "number") return null;
        return { id, repository, stars: data.stargazers_count };
      } catch {
        return null;
      }
    })).then((results) => {
      if (!active) return;
      const successful = results.filter((result): result is NonNullable<typeof result> => result !== null);
      if (!successful.length) return;
      const nextCache = readCache();
      const nextStars = { ...cachedStars };
      for (const result of successful) {
        nextStars[result.id] = result.stars;
        nextCache[result.repository] = { stars: result.stars, fetchedAt: Date.now() };
      }
      window.localStorage.setItem(cacheKey, JSON.stringify(nextCache));
      setStars(nextStars);
    });

    return () => { active = false; };
    // repositoryKey captures both IDs and repository URLs without rerunning for unrelated object changes.
  }, [repositoryKey]);

  return stars;
}

export function formatGitHubStars(stars: number, language: "en" | "id") {
  return new Intl.NumberFormat(language === "id" ? "id-ID" : "en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(stars);
}
