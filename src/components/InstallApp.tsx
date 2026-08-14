import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

import {
  installPWA,
  isInstallPromptAvailable,
} from '../pwaInstall';

export const InstallApp: React.FC = () => {
  const [canInstall, setCanInstall] =
    useState(false);

  const [isInstalled, setIsInstalled] =
    useState(false);

  useEffect(() => {

    // Check if already installed
    const standalone =
      window.matchMedia(
        '(display-mode: standalone)'
      ).matches ||
      (window.navigator as any).standalone === true;

    if (standalone) {
      setIsInstalled(true);
      return;
    }

    // Check current state
    setCanInstall(
      isInstallPromptAvailable()
    );

    // Browser has provided install prompt
    const handleInstallAvailable = () => {
      console.log(
        '✅ Install button activated'
      );

      setCanInstall(true);
    };

    // App installed
    const handleInstalled = () => {
      console.log(
        '🎉 Jin Sangeet installed'
      );

      setCanInstall(false);
      setIsInstalled(true);
    };

    window.addEventListener(
      'pwa-install-available',
      handleInstallAvailable
    );

    window.addEventListener(
      'pwa-installed',
      handleInstalled
    );

    return () => {
      window.removeEventListener(
        'pwa-install-available',
        handleInstallAvailable
      );

      window.removeEventListener(
        'pwa-installed',
        handleInstalled
      );
    };

  }, []);

  const handleInstall = async () => {

    console.log(
      '📱 Install App clicked'
    );

    if (!canInstall) {
      console.log(
        '⚠️ Native install prompt is not available'
      );

      alert(
        'Please wait a moment and try again. If the Install icon is visible in your browser address bar, you can also use that option.'
      );

      return;
    }

    const installed =
      await installPWA();

    if (installed) {
      setCanInstall(false);
      setIsInstalled(true);
    }
  };

  if (isInstalled) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      className="
        fixed
        left-3
        sm:left-8
        top-4
        sm:top-5

        z-50

        flex
        items-center
        gap-2

        h-9
        sm:h-10

        px-3
        sm:px-4

        rounded-full

        border
        border-white/20

        bg-white/10
        backdrop-blur-xl

        text-white

        shadow-lg

        hover:bg-white/20
        hover:border-white/30
        hover:scale-105

        active:scale-95

        transition-all
        duration-200
      "
    >

      <span
        className="
          w-7
          h-7
          sm:w-8
          sm:h-8

          rounded-full

          bg-white

          text-[#4a1c17]

          flex
          items-center
          justify-center

          shadow-md
        "
      >
        <Download
          className="w-4 h-4 sm:w-[17px] sm:h-[17px]"
        />
      </span>

      <span
        className="
          text-[10px]
          sm:text-xs

          font-semibold

          uppercase

          tracking-wider

          whitespace-nowrap
        "
      >
        <span className="sm:hidden">
          Install
        </span>

        <span className="hidden sm:inline">
          Install App
        </span>
      </span>

    </button>
  );
};