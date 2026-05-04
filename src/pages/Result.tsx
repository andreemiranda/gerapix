import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { usePixConfig } from '../context/PixConfigContext';
import { generatePixPayload } from '../utils/pixPayload';
import { formatCurrency } from '../utils/currency';
import QRCode from 'qrcode';
import { motion } from 'motion/react';
import { Copy, Check, ChevronLeft, Download, Share2, Printer, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Result() {
  const { config, loading: configLoading } = usePixConfig();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [payload, setPayload] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const amount = location.state?.amount || 0;
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (configLoading || !config) return;

    const generateQR = async () => {
      try {
        const pixPayload = generatePixPayload({
          key: config.chave_pix,
          amount: amount,
          name: config.merchant_name || 'LOJA',
          city: config.merchant_city || 'BRASIL',
          transactionId: config.identificador || '***'
        });
        
        setPayload(pixPayload);

        addDoc(collection(db, 'transactions'), {
          payload: pixPayload,
          amount: amount,
          identificador: config.identificador,
          timestamp: serverTimestamp()
        }).catch(err => console.error("Logging failed:", err));
        
        const url = await QRCode.toDataURL(pixPayload, {
          width: 1024,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        });
        setQrCodeUrl(url);
      } catch (err: any) {
        console.error(err);
        setError('Erro ao gerar código PIX.');
      } finally {
        setGenerating(false);
      }
    };

    generateQR();
  }, [config, configLoading, amount]);

  const handleCopy = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Pagamento PIX',
      text: `Pague ${formatCurrency(amount)} via PIX para ${config?.merchant_name}`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        throw new Error('Share not supported');
      }
    } catch (err) {
      handleCopy();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `gerapix-${config?.identificador || 'qrcode'}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  if (!location.state) return <Navigate to="/" replace />;
  if (configLoading || generating) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--color-pix-purple)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[var(--surface-1)]">
        <div className="w-16 h-16 bg-[var(--color-error)]/10 text-[var(--color-error)] rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Ops! Algo deu errado</h2>
        <p className="text-[var(--text-secondary)] mb-8 text-[14px]">{error || 'Configuração ausente'}</p>
        <button onClick={() => navigate('/')} className="btn-secondary">
          <ChevronLeft className="w-5 h-5" />
          Voltar para Início
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center p-4 py-12 bg-[var(--surface-1)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(var(--surface-border) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="card shadow-[var(--shadow-lg)] border-[var(--color-pix-purple)]/20">
          <div className="card-accent" />
          
          <div className="p-8 flex flex-col items-center">
            {/* Value Highlight */}
            <div className="text-center mb-8">
              <p className="text-[11px] font-extrabold text-[var(--text-tertiary)] uppercase tracking-[0.15em] mb-2">Total a Pagar</p>
              {amount > 0 ? (
                <h2 className="text-[28px] font-[800] text-[var(--text-primary)] tracking-tight">
                  <span className="text-[18px] mr-1">R$</span>
                  {formatCurrency(amount).replace('R$', '').trim()}
                </h2>
              ) : (
                <div className="px-4 py-2 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-xl">
                  <p className="text-[13px] font-bold text-[var(--color-warning)]">VALOR EM ABERTO</p>
                </div>
              )}
            </div>

            {/* QR Code Frame */}
            <div 
              ref={qrRef} 
              className="mb-8 p-1.5 rounded-[2rem] w-full max-w-[300px] border border-[var(--surface-border)] bg-gradient-to-br from-white to-[var(--surface-1)] shadow-inner"
            >
              <div className="bg-white rounded-[1.75rem] p-5 flex flex-col items-center">
                <div className="mb-4 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[var(--text-tertiary)] uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-pix-green)]" />
                    Recebedor Verificado
                  </div>
                  <p className="text-[14px] font-bold text-[var(--text-primary)] truncate max-w-[220px]">{config.merchant_name}</p>
                </div>

                <div className="relative group overflow-hidden rounded-2xl bg-white p-2 border border-[var(--surface-border)] shadow-sm">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code PIX" 
                    className="w-52 h-52 sm:w-56 sm:h-56 transition-transform group-hover:scale-105"
                  />
                </div>

                <p className="mt-4 text-[11px] text-[var(--text-tertiary)] font-medium text-center leading-relaxed">
                  Escaneie este código no seu <br />aplicativo bancário para pagar.
                </p>
              </div>
            </div>

            {/* Copy Paste Section */}
            <div className="w-full space-y-6">
              <div className="space-y-2">
                <label className="label-sm ml-1">Pix Copia e Cola</label>
                <div className="relative group">
                  <div className="field font-mono text-[11px] break-all leading-relaxed pr-12 min-h-[48px] bg-[var(--surface-1)]">
                    {payload}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "absolute right-2 top-1.5 p-2 rounded-lg transition-all",
                      copied ? "bg-[var(--color-pix-green)] text-white shadow-lg" : 
                      "text-[var(--text-tertiary)] hover:bg-[var(--surface-2)] hover:text-[var(--color-pix-purple)]"
                    )}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handleCopy} className="btn-primary w-full group">
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                  {copied ? 'Código Copiado!' : 'Copiar Código PIX'}
                </button>

                <div className="grid grid-cols-2 gap-3 no-print">
                  <button onClick={handleShare} className="btn-secondary btn-sm">
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </button>
                  <button onClick={handlePrint} className="btn-secondary btn-sm">
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </button>
                </div>
                
                <button onClick={downloadQRCode} className="btn-secondary btn-sm w-full no-print">
                  <Download className="w-4 h-4" />
                  Baixar QR Code
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface-1)] p-6 border-t border-[var(--surface-border)] no-print">
            <button
              onClick={() => navigate('/')}
              className="btn-ghost w-full font-bold text-[13px]"
            >
              <ChevronLeft className="w-4 h-4" />
              Gerar Nova Cobrança
            </button>
          </div>
        </div>

        {/* Security Warning */}
        <div className="mt-8 flex flex-col items-center gap-2 px-8 text-center no-print">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-info)] uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            Dica de Segurança
          </div>
          <p className="text-[11px] text-[var(--text-tertiary)] leading-relaxed">
            Confirme sempre o nome do estabelecimento no seu banco antes de confirmar o pagamento.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Inline component dependencies
function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
