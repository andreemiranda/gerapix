import LegalPage from '../components/LegalPage';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { ShieldCheck, Cookie, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export default function ManageConsent() {
  const { consent, acceptAll, rejectAll, resetConsent } = useCookieConsent();

  return (
    <LegalPage title="Gerenciar Consentimento" lastUpdated="04 de Maio de 2026">
      <p>
        Nesta página, você pode gerenciar suas preferências de privacidade e cookies para o GeraPix,
        em total conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>.
      </p>

      <div className="my-10 space-y-8">
        <div className="p-6 bg-[var(--surface-2)] rounded-2xl border border-[var(--surface-border)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[var(--color-pix-purple)]" />
            </div>
            <div>
              <h3 className="text-[15px] font-extrabold text-[var(--text-primary)]">
                Status Atual
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {consent === 'accepted' ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-success)] uppercase tracking-wider bg-[var(--color-success)]/10 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3" /> Todos os cookies aceitos
                  </span>
                ) : consent === 'rejected' ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-error)] uppercase tracking-wider bg-[var(--color-error)]/10 px-2 py-0.5 rounded">
                    <XCircle className="w-3 h-3" /> Apenas cookies essenciais
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider bg-[var(--surface-1)] px-2 py-0.5 rounded border border-[var(--surface-border)]">
                    <ShieldAlert className="w-3 h-3" /> Aguardando decisão
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
            Sua decisão é armazenada localmente no seu navegador e pode ser revogada a qualquer
            momento nesta página ou no rodapé do site.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h4 className="text-[14px] font-extrabold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Cookie className="w-4 h-4 text-[var(--color-pix-purple)]" />
              Cookies Essenciais
            </h4>
            <p className="text-[13px] text-[var(--text-secondary)] mb-6">
              Necessários para o funcionamento básico, autenticação administrativa e armazenamento
              de suas preferências de privacidade.
              <strong> Não podem ser desativados.</strong>
            </p>
            <div className="text-[11px] font-bold text-[var(--color-success)] bg-[var(--color-success)]/10 px-3 py-1 rounded w-fit uppercase">
              Vigente
            </div>
          </div>

          <div className="card p-6">
            <h4 className="text-[14px] font-extrabold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[var(--color-info)]" />
              Cookies Analíticos
            </h4>
            <p className="text-[13px] text-[var(--text-secondary)] mb-6">
              Utilizados para entender como os usuários interagem com o sistema, permitindo
              melhorias de interface e performance de forma anônima.
            </p>
            <div className="text-[11px] font-bold text-[var(--text-tertiary)] bg-[var(--surface-2)] px-3 py-1 rounded w-fit uppercase border border-[var(--surface-border)]">
              Opcional
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button onClick={acceptAll} className="btn-primary flex-1">
            Aceitar Todos os Cookies
          </button>
          <button onClick={rejectAll} className="btn-secondary flex-1">
            Usar Apenas Essenciais
          </button>
        </div>

        <button
          onClick={resetConsent}
          className="w-full text-center text-[12px] font-bold text-[var(--text-tertiary)] hover:text-[var(--color-error)] transition-colors py-4 border-t border-[var(--surface-border)]"
        >
          Limpar e redefinir todas as preferências
        </button>
      </div>

      <h2>Como usamos seus dados?</h2>
      <p>
        O tratamento de dados no GeraPix é limitado ao estritamente necessário para gerar as
        cobranças PIX solicitadas. Para detalhes completos sobre quais dados coletamos e como os
        protegemos, visite nossa <a href="/politica-de-privacidade">Política de Privacidade</a>.
      </p>
    </LegalPage>
  );
}
