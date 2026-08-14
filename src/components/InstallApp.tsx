import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export const InstallApp: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check whether the app is already installed
    const checkInstalled = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;

      setIsInstalled(standalone);
    };

    checkInstalled();

    // IMPORTANT:
    // Chrome fires this event when the PWA is installable.
    const handleBeforeInstallPrompt = (event: Event) => {
      console.log('✅ PWA install prompt available');

      event.preventDefault();

      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    window.addEventListener('appinstalled', () => {
      console.log('✅ Jin Sangeet installed');
      setDeferredPrompt(null);
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('❌ Install prompt not available');

      alert(
        'The install option is currently unavailable. Please open Jin Sangeet in Chrome and try again.'
      );

      return;
    }

    // Open native browser installation dialog
    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    console.log('Install choice:', outcome);

    if (outcome === 'accepted') {
      console.log('✅ User accepted installation');
    } else {
      console.log('❌ User cancelled installation');
    }

    setDeferredPrompt(null);
  };

  // Don't show after installation
  if (isInstalled) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      aria-label="Install Jin Sangeet"
      title="Install Jin Sangeet"
      className="
        fixed
        left-3
        sm:left-8
        top-4
        sm:top-5
        z-40

        flex
        items-center
        gap-2

        px-3
        py-2
        sm:px-3.5
        sm:py-2

        rounded-full

        border
        border-white/20

        bg-white/10
        backdrop-blur-xl

        text-white

        shadow-[0_10px_30px_rgba(0,0,0,0.35)]

        hover:bg-white/20
        hover:border-white/30
        hover:scale-105

        active:scale-95

        transition-all
      "
    >
      <div
        className="
          w-8
          h-8
          sm:w-9
          sm:h-9
          rounded-full
          bg-white
          text-[#4a1c17]
          flex
          items-center
          justify-center
          shadow-lg
        "
      >
        <Download className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
      </div>

      <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
        <span className="sm:hidden">Install</span>
        <span className="hidden sm:inline">Install App</span>
      </span>
    </button>
  );
};