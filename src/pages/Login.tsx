import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, db } from '../lib/firebase';
import { setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { ShieldCheck, AlertCircle, Mail, Lock, LogIn } from 'lucide-react';
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
        // If we can't check, we assume not initializing for safety
        setIsAdminCountChecked(true);
      }
    };
    checkAdminCount();
  }, []);

  const handleAfterLogin = async (user: any) => {
    try {
      // 1. Check if the current user is an admin
      const adminDocRef = doc(db, 'admins', user.uid);
      const adminDocSnap = await getDoc(adminDocRef);

      if (adminDocSnap.exists()) {
        navigate('/admin');
        return;
      }

      // 2. Not in admins. Is the system initialized?
      const countDocRef = doc(db, 'admin_count', 'total');
      const countSnap = await getDoc(countDocRef);
      const adminCount = countSnap.exists() ? countSnap.data().count : 0;

      if (adminCount === 0) {
        // First user initialization
        await setDoc(doc(db, 'admins', user.uid), {
          email: user.email,
          username: user.displayName || user.email?.split('@')[0] || 'admin',
          role: 'admin',
          createdAt: serverTimestamp()
        });
        
        await setDoc(doc(db, 'admin_count', 'total'), { count: 1 });

        // Initialize default configuration
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
        // System already has admins, but this user isn't one
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
        setError('Configuração do Firebase Auth não encontrada. Ative o Google no Console.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Domínio não autorizado. Adicione este domínio no Console Firebase -> Auth -> Settings.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('O popup de login foi bloqueado pelo seu navegador.');
      } else if (err.code === 'auth/operation-not-supported-in-this-environment') {
        setError('Login social não suportado neste navegador/iframe. Tente abrir em nova aba ou use e-mail.');
      } else {
        setError(`Erro ao realizar login: ${err.message || 'Erro desconhecido'}`);
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
        // Create new account for the first admin
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await handleAfterLogin(result.user);
      } else {
        // Normal login
        const result = await signInWithEmailAndPassword(auth, email, password);
        await handleAfterLogin(result.user);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso. Tente fazer login.');
        setIsInitializing(false);
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('E-mail ou senha incorretos.');
      } else {
        setError(`Erro na autenticação: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="pix-card p-8 border-t-4 border-t-pix-purple w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-pix-purple/10 text-pix-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isInitializing ? 'Inicializar Sistema' : 'Acesso Restrito'}
          </h1>
          <p className="text-slate-500 text-sm">
            {isInitializing ? 'Crie o primeiro administrador' : 'Painel Administrativo GeraPix'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {!showPasswordForm ? (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border-2 border-slate-200 hover:border-pix-purple hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>{isInitializing ? 'Configurar com Google' : 'Login com Google'}</span>
            </button>

            <button
              onClick={() => setShowPasswordForm(true)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-600 hover:text-pix-purple font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>{isInitializing ? 'Configurar com E-mail' : 'Entrar com E-mail'}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-pix-purple/20 focus:border-pix-purple outline-none transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-pix-purple/20 focus:border-pix-purple outline-none transition-all"
                  placeholder={isInitializing ? 'Mínimo 6 caracteres' : ''}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !isAdminCountChecked}
              className="w-full pix-gradient text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-pix-purple/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{isInitializing ? 'Criar Administrador' : 'Entrar Agora'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowPasswordForm(false)}
              className="w-full text-slate-400 hover:text-slate-600 text-xs font-semibold py-2 transition-all"
            >
              Voltar para Opções
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-[10px] text-slate-400 leading-relaxed uppercase tracking-wider">
          {isInitializing 
            ? 'O primeiro usuário a se registrar será o dono do sistema.'
            : 'Acesso exclusivo para administradores.'}
        </p>
      </motion.div>
    </div>
  );
}

