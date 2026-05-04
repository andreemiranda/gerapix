import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 w-full bg-[var(--surface-1)] py-12 px-4"
    >
      <div className="max-w-[800px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-[12px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
          <Link to="/" className="hover:text-[var(--color-pix-purple)] transition-colors">
            Início
          </Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)]">{title}</span>
        </div>

        <div className="card shadow-[var(--shadow-lg)]">
          <div className="card-accent" />
          <div className="p-8 md:p-12">
            <header className="mb-12 border-b border-[var(--surface-border)] pb-8">
              <h1 className="text-[28px] md:text-[32px] font-[800] text-[var(--text-primary)] leading-tight mb-4">
                {title}
              </h1>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-pix-green)]/5 text-[var(--color-pix-green)] rounded-lg w-fit">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Última atualização: {lastUpdated}
                </span>
              </div>
            </header>

            <div
              className="prose prose-slate max-w-none 
              prose-headings:text-[var(--text-primary)] prose-headings:font-extrabold
              prose-h2:border-l-[3px] prose-h2:border-[var(--color-pix-purple)] prose-h2:pl-4 prose-h2:text-[22px] prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-[18px] prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-[var(--text-secondary)] prose-p:text-[15px] prose-p:leading-relaxed prose-p:mb-6
              prose-ul:text-[var(--text-secondary)] prose-ul:text-[15px] prose-ul:mb-6
              prose-li:mb-2
              prose-strong:text-[var(--text-primary)] prose-strong:font-bold
              prose-a:text-[var(--color-pix-purple)] prose-a:no-underline hover:prose-a:underline prose-a:font-bold
              prose-table:w-full prose-table:border-collapse prose-table:my-8
              prose-th:bg-[var(--surface-2)] prose-th:p-4 prose-th:text-left prose-th:text-[12px] prose-th:font-extrabold prose-th:text-[var(--text-primary)] prose-th:uppercase prose-th:tracking-wider prose-th:border prose-th:border-[var(--surface-border)]
              prose-td:p-4 prose-td:text-[14px] prose-td:text-[var(--text-secondary)] prose-td:border prose-td:border-[var(--surface-border)]
            "
            >
              {children}
            </div>

            <footer className="mt-16 pt-8 border-t border-[var(--surface-border)] flex flex-col md:flex-row items-center justify-between gap-6">
              <Link to="/" className="btn-secondary btn-sm">
                <ChevronLeft className="w-4 h-4" />
                Voltar ao Início
              </Link>
              <p className="text-[11px] text-[var(--text-tertiary)] font-medium">
                GeraPix é um projeto de{' '}
                <a
                  href="https://github.com/andreemiranda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-pix-purple)] font-bold hover:underline"
                >
                  André Miranda
                </a>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
