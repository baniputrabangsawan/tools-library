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

function savedPrompt() {
  const event = window.__pwaPrompt;
  return event && typeof event.prompt === "function" ? event : null;
}

export function PwaChrome() {
  const { t } = useLanguage();
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");

  useEffect(() => {
    if (isStandalone() || sessionStorage.getItem(SESSION_KEY) === "hidden") return;

    const existing = savedPrompt();
    deferred.current = existing;
    setPlatform(existing ? "prompt" : detectPlatform());
    setVisible(true);

    function hide() {
      sessionStorage.setItem(SESSION_KEY, "hidden");
      setVisible(false);
    }

    function capture(event: Event) {
      const promptEvent = typeof (event as BeforeInstallPromptEvent).prompt === "function"
        ? event as BeforeInstallPromptEvent
        : savedPrompt();
      if (!promptEvent) return;
      event.preventDefault();
      deferred.current = promptEvent;
      window.__pwaPrompt = promptEvent;
      setPlatform("prompt");
    }

    function onInstalled() {
      deferred.current = null;
      window.__pwaPrompt = null;
      hide();
    }

    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("pwa:prompt", capture);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("pwa:prompt", capture);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, "hidden");
    setVisible(false);
  }

  function install() {
    const event = deferred.current ?? savedPrompt();
    if (event) {
      const result = event.prompt();
      void Promise.resolve(result).then(() => event.userChoice).then((choice) => {
        deferred.current = null;
        window.__pwaPrompt = null;
        if (choice.outcome === "accepted") {
          sessionStorage.setItem(SESSION_KEY, "hidden");
          setVisible(false);
        } else {
          setShowHelp(true);
        }
      }).catch(() => setShowHelp(true));
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
        <p id="pwa-banner-title">{showHelp ? t("installNextStep") : t("installTitle")}</p>
        <p id="pwa-banner-copy" className={showHelp ? "pwa-help" : undefined}>{showHelp ? help : t("installBody")}</p>
      </div>
      <div className="pwa-banner-actions">
        <button type="button" className="add-button pwa-install" onClick={install}>
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
