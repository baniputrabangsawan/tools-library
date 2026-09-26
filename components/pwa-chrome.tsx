"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { useLanguage } from "@/lib/use-language";

const SESSION_KEY = "my-tools-pwa-banner";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches
    || window.matchMedia("(display-mode: window-controls-overlay)").matches
    || nav.standalone === true;
}

function isIosSafari() {
  const ua = window.navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const safari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|Chrome/.test(ua);
  return ios && safari;
}

export function PwaChrome() {
  const { t } = useLanguage();
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);
  const [mode, setMode] = useState<"prompt" | "ios" | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js");
    }

    if (isStandalone() || sessionStorage.getItem(SESSION_KEY) === "hidden") return;

    function hide() {
      sessionStorage.setItem(SESSION_KEY, "hidden");
      setVisible(false);
    }

    function onPrompt(event: Event) {
      event.preventDefault();
      deferred.current = event as BeforeInstallPromptEvent;
      setMode("prompt");
      setVisible(true);
    }

    function onInstalled() {
      deferred.current = null;
      hide();
    }

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    if (isIosSafari()) {
      setMode("ios");
      setVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, "hidden");
    setVisible(false);
  }

  async function install() {
    const event = deferred.current;
    if (event) {
      await event.prompt();
      const choice = await event.userChoice;
      deferred.current = null;
      if (choice.outcome === "accepted") {
        sessionStorage.setItem(SESSION_KEY, "hidden");
        setVisible(false);
      }
      return;
    }
    if (mode === "ios") setIosHelp(true);
  }

  if (!visible || !mode) return null;

  return (
    <div className="pwa-banner" role="dialog" aria-labelledby="pwa-banner-title" aria-describedby="pwa-banner-copy">
      <div className="pwa-banner-copy">
        <p id="pwa-banner-title">{t("installTitle")}</p>
        <p id="pwa-banner-copy">{iosHelp ? t("iosInstallHelp") : t("installBody")}</p>
      </div>
      <div className="pwa-banner-actions">
        <button type="button" className="add-button pwa-install" onClick={() => void install()}>
          {mode === "ios" ? <Share size={15} /> : <Download size={15} />}
          {t("installAction")}
        </button>
        <button type="button" className="icon-button" onClick={dismiss} aria-label={t("dismissAction")}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
