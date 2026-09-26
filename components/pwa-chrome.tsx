"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { useLanguage } from "@/lib/use-language";

const SESSION_KEY = "my-tools-pwa-banner";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    __pwaPrompt?: BeforeInstallPromptEvent | null;
  }
}

type Platform = "prompt" | "ios" | "android" | "desktop";

function isStandalone() {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches
    || window.matchMedia("(display-mode: window-controls-overlay)").matches
    || nav.standalone === true;
}

function detectPlatform(): Exclude<Platform, "prompt"> {
  const ua = window.navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (ios) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

export function PwaChrome() {
  const { t } = useLanguage();
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");

  useEffect(() => {
    if (isStandalone() || sessionStorage.getItem(SESSION_KEY) === "hidden") return;

    const detected = detectPlatform();
    setPlatform(window.__pwaPrompt ? "prompt" : detected);
    setVisible(true);
    if (window.__pwaPrompt) deferred.current = window.__pwaPrompt;

    function hide() {
      sessionStorage.setItem(SESSION_KEY, "hidden");
      setVisible(false);
    }

    function onPrompt(event: Event) {
      event.preventDefault();
      const promptEvent = (event as BeforeInstallPromptEvent).prompt ? event as BeforeInstallPromptEvent : window.__pwaPrompt;
      if (!promptEvent) return;
      deferred.current = promptEvent;
      window.__pwaPrompt = promptEvent;
      setPlatform("prompt");
    }

    function onInstalled() {
      deferred.current = null;
      window.__pwaPrompt = null;
      hide();
    }

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("pwa:prompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("pwa:prompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, "hidden");
    setVisible(false);
  }

  async function install() {
    const event = deferred.current ?? window.__pwaPrompt ?? null;
    if (event) {
      await event.prompt();
      const choice = await event.userChoice;
      deferred.current = null;
      window.__pwaPrompt = null;
      if (choice.outcome === "accepted") {
        sessionStorage.setItem(SESSION_KEY, "hidden");
        setVisible(false);
      }
      return;
    }
    setShowHelp(true);
  }

  if (!visible) return null;

  const help = platform === "ios"
    ? t("iosInstallHelp")
    : platform === "android"
      ? t("androidInstallHelp")
      : t("desktopInstallHelp");

  return (
    <div className="pwa-banner" role="dialog" aria-labelledby="pwa-banner-title" aria-describedby="pwa-banner-copy">
      <div className="pwa-banner-copy">
        <p id="pwa-banner-title">{t("installTitle")}</p>
        <p id="pwa-banner-copy">{showHelp ? help : t("installBody")}</p>
      </div>
      <div className="pwa-banner-actions">
        <button type="button" className="add-button pwa-install" onClick={() => void install()}>
          {platform === "ios" ? <Share size={15} /> : <Download size={15} />}
          {t("installAction")}
        </button>
        <button type="button" className="icon-button" onClick={dismiss} aria-label={t("dismissAction")}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
