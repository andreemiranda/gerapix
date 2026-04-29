import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePixConfig } from '../context/PixConfigContext';
import { motion } from 'motion/react';
import { QrCode, AlertCircle, ShoppingBag, LayoutDashboard } from 'lucide-react';
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

  // Reset value when returning home (Bug #6)
  useEffect(() => {
    setAmount('');
  }, []);

  const handleGenerate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!config) return;

    // Convert formatted string "0,00" to number
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
    
    // Format as 0,00 style
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numberValue / 100);
    
    setAmount(formatted);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pix-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!config || !config.chave_pix) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center p-4 bg-slate-50 font-sans py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pix-card p-8 w-full max-w-sm text-center"
        >
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-800">PIX não configurado</h2>
          <p className="text-slate-500 mb-6 text-sm">
            O sistema ainda não possui uma chave PIX configurada para receber pagamentos.
          </p>
          
          <button
            onClick={() => navigate(isAdmin ? '/admin' : '/login')}
            className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            {isAdmin ? (
              <>
                <LayoutDashboard className="w-4 h-4" />
                Configurar no Painel
              </>
            ) : (
              'Acessar como Administrador'
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 bg-slate-50 font-sans py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        {/* Store Info UX #3 */}
        <div className="mb-6 flex flex-col items-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100 mb-2">
            <ShoppingBag className="w-4 h-4 text-pix-purple" />
            <span className="text-sm font-bold text-slate-800">{config?.merchant_name || 'Estabelecimento'}</span>
          </div>
        </div>

        <div className="pix-card p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pix-purple/10 text-pix-purple rounded-xl flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">Gerar PIX</h1>
              <p className="text-slate-500 text-xs sm:text-sm truncate">Informe o valor da cobrança</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-700 ml-1">
                Valor Total
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-lg">
                  R$
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-12 py-3 sm:py-4 text-xl sm:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-pix-purple/20 focus:border-pix-purple transition-all"
                />
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">
                Deixe em branco para valor livre
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-pix-purple/10 text-pix-purple border border-pix-purple/10 font-bold py-3 sm:py-4 rounded-xl shadow-lg shadow-pix-purple/5 hover:bg-pix-purple hover:text-white hover:shadow-pix-purple/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <span className="text-sm sm:text-base">Gerar QR Code PIX</span>
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 sm:w-5 sm:h-5 fill-current group-hover:rotate-12 transition-transform"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-2.12c-1.39-.17-1.89-1.07-1.93-1.85h.92c.03.3.18.91.95.91.81 0 .96-.34.96-.54 0-.41-.53-.54-.93-.72-.45-.19-1-.44-1-1.12 0-.61.42-1.07 1-1.22V8.5h1v2.12c1.39.17 1.89-1.07 1.93-1.85h-.92c-.03-.3-.18-.91-.95-.91-.81 0-.96.34-.96.54 0 .41.53.54.91.72.45.19 1 .44 1 1.12 0 .61-.42 1.07-1 1.22v1.84h-1z" />
              </svg>
            </button>
          </form>
        </div>

        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pix-green/10 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pix-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seguro</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-pix-purple/10 flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pix-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instantâneo</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

