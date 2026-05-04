import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, db } from '../lib/firebase';
import { setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, AlertCircle, Mail, Lock, LogIn, ChevronLeft } from 'lucide-react';
import { handleFirestoreError } from '../lib/firestoreErrorHandler';
import { OperationType } from '../types';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();

  const [isInitializing, setIsInitializing] = useState(false);
  const [isAdminCountChecked, setIsAdminCountChecked] = useState(false);

  useEffect(() => {
    const checkAdminCount = async () => {
      try {
        const countDocRef = doc(db, 'admin_count', 'total');
        const countSnap = await getDoc(countDocRef);
        const adminCount = countSnap.exists() ? countSnap.data().count : 0;
        setIsInitializing(adminCount === 0);
        setIsAdminCountChecked(true);
      } catch (err) {
        console.error("Error checking admin count:", err);
        setIsAdminCountChecked(true);
      }
    };
    checkAdminCount();
  }, []);

  const handleAfterLogin = async (user: any) => {
    try {
      const adminDocRef = doc(db, 'admins', user.uid);
      const adminDocSnap = await getDoc(adminDocRef);

      if (adminDocSnap.exists()) {
        navigate('/admin');
        return;
      }

      const countDocRef = doc(db, 'admin_count', 'total');
      const countSnap = await getDoc(countDocRef);
      const adminCount = countSnap.exists() ? countSnap.data().count : 0;

      if (adminCount === 0) {
        await setDoc(doc(db, 'admins', user.uid), {
          email: user.email,
          username: user.displayName || user.email?.split('@')[0] || 'admin',
          role: 'admin',
          createdAt: serverTimestamp()
        });
        
        await setDoc(doc(db, 'admin_count', 'total'), { count: 1 });

        await setDoc(doc(db, 'config', 'settings'), {
          tipo_chave: 'aleatoria',
          chave_pix: '',
          identificador: 'GERAPIX',
          merchant_name: 'LOJA TESTE',
          merchant_city: 'SAO PAULO',
          updatedAt: serverTimestamp()
        });

        navigate('/admin');
      } else {
        setError('Acesso negado. Você não tem permissão de administrador.');
        await auth.signOut();
      }
    } catch (err: any) {
      if (err instanceof Error && err.message.includes('{')) {
        throw err;
      }
      handleFirestoreError(err, OperationType.WRITE, 'admins/login-check');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleAfterLogin(result.user);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/configuration-not-found') {
        setError('Configuração do Firebase Auth não encontrada.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Domínio não autorizado.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('O popup foi bloqueado pelo seu navegador.');
      } else {
        setError(`Erro: ${err.message || 'Erro desconhecido'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isInitializing) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await handleAfterLogin(result.user);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await handleAfterLogin(result.user);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('Senha muito fraca (mín. 6 caracteres).');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Dados de acesso incorretos.');
      } else {
        setError(`Erro: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 py-12 bg-[var(--surface-1)] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(var(--surface-border) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="card">
          <div className="card-accent" />
          <div className="p-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[var(--color-pix-purple)]/5 text-[var(--color-pix-purple)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--surface-border)]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-2">
                {isInitializing ? 'Configurar Sistema' : 'Acesso Administrador'}
              </h1>
              <p className="text-[var(--text-secondary)] text-[14px]">
                {isInitializing ? 'Crie o primeiro acesso do sistema' : 'Faça login para gerenciar sua loja'}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-4 bg-[var(--color-error)]/10 border-l-4 border-[var(--color-error)] rounded-r-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-[var(--color-error)] shrink-0 mt-0.5" />
                  <p className="text-[13px] text-[var(--color-error)] font-bold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!showPasswordForm ? (
              <div className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="btn-secondary w-full group relative overflow-hidden"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span>{isInitializing ? 'Setup com Google' : 'Entrar com Google'}</span>
                </button>

                <div className="relative flex items-center justify-center py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--surface-border)]"></div>
                  </div>
                  <span className="relative bg-white px-4 text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">ou</span>
                </div>

                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="btn-ghost w-full hover:bg-[var(--surface-2)] text-[var(--text-secondary)] font-bold text-[14px]"
                >
                  <Mail className="w-4 h-4" />
                  {isInitializing ? 'Configurar com E-mail' : 'Entrar com E-mail'}
                </button>
              </div>
            ) : (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleEmailLogin} 
                className="space-y-6"
              >
                <div className="space-y-1.5">
                  <label htmlFor="email" className="label-sm ml-1">E-mail Corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@gerapix.com"
                      className="field pl-11"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="label-sm mb-0 ml-1">Senha</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="field pl-11"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isAdminCountChecked}
                  className="btn-primary w-full shadow-lg"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      {isInitializing ? 'Criar Gestor' : 'Acessar Painel'}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="w-full flex items-center justify-center gap-2 text-[13px] font-bold text-[var(--color-pix-purple)] hover:opacity-80 transition-opacity mt-4"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar para Outros Métodos
                </button>
              </motion.form>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] text-[var(--text-tertiary)] font-medium leading-relaxed tracking-wide px-8">
          {isInitializing 
            ? 'Primeiro acesso? Registre o e-mail que será o proprietário da conta.'
            : 'Esta área é exclusiva para administradores autorizados.'}
        </p>
      </motion.div>
    </div>
  );
}
