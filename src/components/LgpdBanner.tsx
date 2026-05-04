import { useCookieConsent } from '../hooks/useCookieConsent';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LgpdBanner() {
  const { consent, acceptAll, rejectAll } = useCookieConsent();

  return (
    <AnimatePresence>
      {consent === null && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] bg-white/97 backdrop-blur-xl border-t border-[var(--surface-border)] shadow-[var(--shadow-lg)] no-print"
        >
          <div className="max-w-[960px] mx-auto p-5 md:p-6 flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex gap-4 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-pix-purple)]/5 flex items-center justify-center shrink-0 border border-[var(--surface-border)]">
                <ShieldCheck className="w-6 h-6 text-[var(--color-pix-purple)]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[14px] font-[800] text-[var(--text-primary)]">
                  Usamos cookies para melhorar sua experiência
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  Este site utiliza cookies estritamente necessários para funcionamento e, com seu
                  consentimento, cookies analíticos. Em conformidade com a Lei Geral de Proteção de
                  Dados (LGPD — Lei 13.709/2018), você pode aceitar todos os cookies ou apenas os
                  essenciais. Consulte nossa{' '}
                  <Link
                    to="/politica-de-cookies"
                    className="text-[var(--color-pix-purple)] font-bold hover:underline"
                  >
                    Política de Cookies
                  </Link>{' '}
                  e{' '}
                  <Link
                    to="/politica-de-privacidade"
                    className="text-[var(--color-pix-purple)] font-bold hover:underline"
                  >
                    Política de Privacidade
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
              <button onClick={rejectAll} className="btn-secondary btn-sm flex-1 lg:flex-none">
                Somente essenciais
              </button>
              <button onClick={acceptAll} className="btn-primary btn-sm flex-1 lg:flex-none">
                Aceitar todos
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
