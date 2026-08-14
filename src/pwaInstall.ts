let deferredPrompt: Event | null = null;

export function initPWAInstall() {
  window.addEventListener('beforeinstallprompt', (event) => {
    console.log('🔥 BEFORE INSTALL PROMPT CAPTURED');

    event.preventDefault();

    deferredPrompt = event;

    window.dispatchEvent(
      new CustomEvent('pwa-install-available')
    );
  });

  window.addEventListener('appinstalled', () => {
    console.log('✅ Jin Sangeet installed');

    deferredPrompt = null;

    window.dispatchEvent(
      new CustomEvent('pwa-installed')
    );
  });
}

export async function installPWA(): Promise<boolean> {
  if (!deferredPrompt) {
    console.log(
      '❌ No beforeinstallprompt event available'
    );

    return false;
  }

  const promptEvent =
    deferredPrompt as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
      }>;
    };

  try {
    await promptEvent.prompt();

    const result =
      await promptEvent.userChoice;

    console.log(
      '📱 Install result:',
      result.outcome
    );

    deferredPrompt = null;

    return result.outcome === 'accepted';

  } catch (error) {
    console.error(
      '❌ PWA installation failed:',
      error
    );

    return false;
  }
}

export function isInstallPromptAvailable() {
  return deferredPrompt !== null;
}