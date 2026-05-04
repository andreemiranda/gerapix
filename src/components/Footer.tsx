import { Link } from 'react-router-dom';
import { Wallet, Github, ExternalLink } from 'lucide-react';
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--surface-1)] border-t border-[var(--surface-border)] pt-12 pb-8 px-6 no-print relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(var(--surface-border) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Zone */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-pix-purple)] flex items-center justify-center shadow-lg shadow-[var(--color-pix-purple)]/10 transition-transform group-hover:scale-105">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-[18px] font-extrabold text-[var(--text-primary)] tracking-tight">
              Gera<span className="text-[var(--color-pix-purple)]">Pix</span>
            </span>
          </Link>
          <p className="text-[13px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.1em]">
            Gerador de QR Code PIX gratuito e seguro
          </p>
        </div>

        {/* Center Zone - Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 pb-8 border-b border-[var(--surface-border)]">
          <div className="space-y-4">
            <h4 className="text-[11px] font-extrabold text-[var(--text-primary)] uppercase tracking-widest">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/termos-de-uso" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--color-pix-purple)] transition-colors">Termos de Uso</Link></li>
              <li><Link to="/politica-de-privacidade" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--color-pix-purple)] transition-colors">Privacidade</Link></li>
              <li><Link to="/politica-de-cookies" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--color-pix-purple)] transition-colors">Cookies</Link></li>
              <li><Link to="/aviso-legal" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--color-pix-purple)] transition-colors">Aviso Legal</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-extrabold text-[var(--text-primary)] uppercase tracking-widest">Conformidade</h4>
            <ul className="space-y-3">
              <li><span className="text-[13px] text-[var(--text-tertiary)] italic">Lei 13.709/2018 (LGPD)</span></li>
              <li>
                <Link 
                  to="/gerenciar-consentimento"
                  className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--color-pix-purple)] transition-colors text-left"
                >
                  Gerenciar Consentimento
                </Link>
              </li>
              <li><a href="https://github.com/andreemiranda/gerapix" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--color-pix-purple)] transition-colors flex items-center gap-1.5">Contato DPO <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] font-extrabold text-[var(--text-primary)] uppercase tracking-widest">Projeto</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com/andreemiranda" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--color-pix-purple)] transition-colors flex items-center gap-1.5">
                  Código-fonte <Github className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="mailto:acrmrochamiranda@gmail.com" className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--color-pix-purple)] transition-colors">
                  Reportar Problema
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Zone - Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[12px] text-[var(--text-tertiary)] font-medium">
            © {currentYear} GeraPix · Criado por{' '}
            <a 
              href="https://github.com/andreemiranda" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--color-pix-purple)] font-bold hover:underline inline-flex items-center gap-1.5"
              aria-label="Perfil de André Miranda no GitHub"
            >
              André Miranda
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            {' '}· Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
