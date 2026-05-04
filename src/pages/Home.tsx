import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePixConfig } from '../context/PixConfigContext';
import { motion } from 'motion/react';
import { QrCode, AlertCircle, ShoppingBag, LayoutDashboard, ShieldCheck, Zap, Heart } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { handleFirestoreError } from '../lib/firestoreErrorHandler';
import { OperationType } from '../types';

export default function Home() {
  const { config, loading } = usePixConfig();
  const [amount, setAmount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          setIsAdmin(adminDoc.exists());
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `admins/${user.uid}`);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setAmount('');
  }, []);

  const handleGenerate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!config) return;

    const numericAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.')) || 0;
    
    navigate('/resultado', { 
      state: { 
        amount: numericAmount,
        originalValue: amount
      } 
    });
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numberValue = parseInt(rawValue, 10) || 0;
    
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberValue / 100);
    
    setAmount(formatted);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--color-pix-purple)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!config || !config.chave_pix) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center p-4 bg-[var(--surface-1)] py-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(var(--surface-border) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-sm w-full relative z-10"
        >
          <div className="card-accent" />
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-[var(--color-error)]/10 text-[var(--color-error)] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold mb-3 text-[var(--text-primary)]">PIX não configurado</h2>
            <p className="text-[var(--text-secondary)] mb-8 text-[13px] leading-relaxed">
              O sistema ainda não possui uma chave PIX configurada para receber pagamentos.
            </p>
            
            <button
              onClick={() => navigate(isAdmin ? '/admin' : '/login')}
              className="btn-primary w-full"
            >
              {isAdmin ? (
                <>
                  <LayoutDashboard className="w-5 h-5" />
                  Configurar no Painel
                </>
              ) : (
                'Acessar Dashboard'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 py-12 bg-[var(--surface-1)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(var(--surface-border) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        {/* Establishment Badge */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-[var(--surface-border)] rounded-full shadow-sm">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-[var(--color-pix-green)] animate-ping opacity-20"></span>
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-pix-green)] relative z-10"></div>
            </div>
            <ShoppingBag className="w-4 h-4 text-[var(--color-pix-purple)]" />
            <span className="text-[14px] font-bold text-[var(--text-primary)]">{config?.merchant_name || 'GeraPix Store'}</span>
          </div>
        </div>

        <div className="card">
          <div className="card-accent" />
          <div className="p-8">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-[var(--color-pix-purple)]/5 rounded-2xl flex items-center justify-center shrink-0 border border-[var(--surface-border)]">
                <QrCode className="w-7 h-7 text-[var(--color-pix-purple)]" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-[var(--text-primary)]">Gerar Pagamento</h1>
                <p className="text-[var(--text-secondary)] text-[13px]">Informe o valor do PIX</p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="amount" className="label-sm ml-1">Valor da Cobrança</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] font-bold text-lg">R$</span>
                  <input
                    id="amount"
                    type="text"
                    inputMode="numeric"
                    placeholder="0,00"
                    value={amount}
                    onChange={handleAmountChange}
                    className="field pl-14 py-5 text-2xl font-extrabold tracking-tight"
                  />
                </div>
                <p className="helper-text ml-1">Deixe em branco para o cliente digitar o valor.</p>
              </div>

              <button type="submit" className="btn-primary w-full group">
                <QrCode className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-6" />
                Gerar QR Code PIX
              </button>
            </form>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-11 h-11 rounded-xl bg-white border border-[var(--surface-border)] shadow-sm flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[var(--color-pix-green)]" />
            </div>
            <span className="text-[10px] font-extrabold text-[var(--text-tertiary)] uppercase tracking-wider">Seguro</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-11 h-11 rounded-xl bg-white border border-[var(--surface-border)] shadow-sm flex items-center justify-center">
              <Zap className="w-5 h-5 text-[var(--color-pix-purple)]" />
            </div>
            <span className="text-[10px] font-extrabold text-[var(--text-tertiary)] uppercase tracking-wider">Instantâneo</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-11 h-11 rounded-xl bg-white border border-[var(--surface-border)] shadow-sm flex items-center justify-center">
              <Heart className="w-5 h-5 text-[var(--color-error)]" />
            </div>
            <span className="text-[10px] font-extrabold text-[var(--text-tertiary)] uppercase tracking-wider">Gratuito</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
