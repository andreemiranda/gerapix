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

        // Log transaction (Improvement #3)
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
      // Optional: alert user it was copied because share failed
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
  if (configLoading || generating) return <div className="h-full flex items-center justify-center"><div className="w-10 h-10 border-4 border-pix-purple border-t-transparent rounded-full animate-spin"></div></div>;
  if (error || !config) return <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4 text-red-500 font-bold"><AlertCircle className="w-12 h-12" /><p>{error || 'Configuração ausente'}</p><button onClick={() => navigate('/')} className="text-slate-600 underline">Voltar</button></div>;

  return (
    <div className="min-h-full w-full flex flex-col items-center py-8 px-4 overflow-y-auto custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="pix-card overflow-hidden shadow-2xl mb-8">
          <div className="pix-gradient p-6 text-white text-center relative overflow-hidden">
            {/* Elemento decorativo de fundo */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)' }}
            />
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Pagamento PIX</p>
            <h2 className="text-lg font-black tracking-tight truncate px-2 uppercase relative z-10">
              {config.merchant_name}
            </h2>
          </div>

          <div className="p-6 flex flex-col items-center">
            <div ref={qrRef} className="mb-6 p-1 rounded-[2rem] w-full max-w-[280px]"
              style={{ background: 'linear-gradient(135deg, rgba(112,0,255,0.15), rgba(50,188,173,0.15))' }}
            >
              <div className="bg-white rounded-[1.75rem] p-4 flex flex-col items-center">
                {/* Store Name above QR */}
                <div className="mb-3 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Confirmar Recebedor</p>
                  <p className="text-xs font-bold text-slate-800 truncate px-2">{config.merchant_name}</p>
                </div>

                <div className="relative group overflow-hidden rounded-xl bg-white p-1">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code PIX" 
                    className="w-48 h-48 sm:w-56 sm:h-56 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-pix-purple/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
                
                <div className="mt-4 flex flex-col items-center gap-1 w-full border-t border-slate-100 pt-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Valor do Pagamento</p>
                  {amount > 0 ? (
                    <p className="text-2xl font-black text-slate-800">
                      {formatCurrency(amount)}
                    </p>
                  ) : (
                    <div className="mt-1 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-center">
                      <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
                        📱 Escaneie o QR Code ou<br />
                        copie o código e <strong>digite o valor</strong><br />
                        no seu aplicativo bancário
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-wider">
                  Pix Copia e Cola
                </label>
                <div className="relative group">
                  <div className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3.5 text-[11px] font-mono text-slate-300 truncate break-all">
                    {payload}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all",
                      copied ? "bg-pix-green text-white shadow-lg shadow-pix-green/20" : 
                      "bg-slate-700 text-slate-300 hover:bg-pix-purple hover:text-white"
                    )}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 no-print">
                <button 
                  onClick={downloadQRCode}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-pix-purple hover:text-white hover:border-transparent rounded-2xl transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-[9px] font-black">BAIXAR</span>
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-pix-purple hover:text-white hover:border-transparent rounded-2xl transition-all active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span className="text-[9px] font-black">IMPRIMIR</span>
                </button>
                <button 
                  onClick={handleShare}
                  className="flex flex-col items-center justify-center gap-1.5 py-3 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-pix-purple hover:text-white hover:border-transparent rounded-2xl transition-all active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-[9px] font-black">ENVIAR</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 border-t border-slate-100 no-print">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-pix-purple hover:text-white hover:border-transparent rounded-2xl transition-all active:scale-95 font-bold text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Gerar Nova Cobrança</span>
            </button>
          </div>
        </div>

        {/* Info Message */}
        <p className="mb-10 text-center text-[10px] text-slate-400 font-medium px-8 leading-relaxed no-print">
          Confirme os dados do recebedor no seu aplicativo bancário antes de finalizar o pagamento.
        </p>
      </motion.div>
    </div>
  );
}
