import { useState } from 'react';

export type ConsentStatus = 'accepted' | 'rejected' | null;

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentStatus>(() => {
    const saved = localStorage.getItem('gerapix_cookie_consent');
    return (saved as ConsentStatus) || null;
  });

  const acceptAll = () => {
    localStorage.setItem('gerapix_cookie_consent', 'accepted');
    setConsent('accepted');
  };

  const rejectAll = () => {
    localStorage.setItem('gerapix_cookie_consent', 'rejected');
    setConsent('rejected');
  };

  const resetConsent = () => {
    localStorage.removeItem('gerapix_cookie_consent');
    setConsent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { consent, acceptAll, rejectAll, resetConsent };
}
