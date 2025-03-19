"use client";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react"; // Import the Download icon

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
} // <-- Missing closing brace was here

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    console.log("PWA: Initializing installation handler");

    const handler = (e: BeforeInstallPromptEvent) => {
      console.log("PWA: beforeinstallprompt event fired");
      // Don't prevent default - this was causing the issue
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("PWA: Already installed");
      setShowInstall(false);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log("PWA: No deferred prompt available");
      return;
    }

    try {
      console.log("PWA: Showing install prompt");
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user's choice
      const choiceResult = await deferredPrompt.userChoice;
      console.log("PWA: User choice outcome:", choiceResult.outcome);

      // Reset the deferred prompt variable
      setDeferredPrompt(null);
      setShowInstall(false);
    } catch (error) {
      console.error("PWA: Error during installation:", error);
    }
  };

  if (!showInstall) return null;

  return (
    <Button
      onClick={handleInstallClick}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2"
      variant="outline"
    >
      <Download className="h-4 w-4" />
      <span>Install POS App</span>
    </Button>
  );
}
