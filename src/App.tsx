/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Home from './pages/Home';
import Result from './pages/Result';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LgpdBanner from './components/LgpdBanner';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import LegalNotice from './pages/LegalNotice';
import ManageConsent from './pages/ManageConsent';
import { PixConfigProvider } from './context/PixConfigContext';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeAdmin: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      if (unsubscribeAdmin) {
        unsubscribeAdmin();
        unsubscribeAdmin = null;
      }

      if (user) {
        // Real-time listener for the user's admin document
        unsubscribeAdmin = onSnapshot(doc(db, 'admins', user.uid), (docSnap) => {
          setIsAdmin(docSnap.exists());
          setLoading(false);
        }, (error) => {
          console.error("Error observing admin status:", error);
          setIsAdmin(false);
          setLoading(false);
        });
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeAdmin) unsubscribeAdmin();
    };
  }, []);

  if (loading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-pix-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <PixConfigProvider>
      <BrowserRouter>
        <div className="min-h-[100dvh] flex flex-col bg-[var(--surface-1)]">
          <Navbar user={user} isAdmin={isAdmin} />
          <main className="flex-1 w-full flex flex-col relative pt-16">
            <div className="flex-1 w-full flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/resultado" element={<Result />} />
                <Route path="/login" element={user && isAdmin ? <Navigate to="/admin" /> : <Login />} />
                <Route path="/termos-de-uso" element={<TermsOfUse />} />
                <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
                <Route path="/politica-de-cookies" element={<CookiePolicy />} />
                <Route path="/aviso-legal" element={<LegalNotice />} />
                <Route path="/gerenciar-consentimento" element={<ManageConsent />} />
                <Route 
                  path="/admin" 
                  element={user ? (isAdmin ? <AdminDashboard /> : <div className="flex-1 flex items-center justify-center p-8"><div className="card max-w-sm w-full p-8 text-center"><div className="w-16 h-16 bg-[var(--color-error)]/10 text-[var(--color-error)] rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle className="w-8 h-8" /></div><h1 className="text-xl font-extrabold text-[var(--text-primary)] mb-2">Acesso Negado</h1><p className="text-[var(--text-secondary)] text-[14px] mb-8">Esta conta não possui privilégios de administrador.</p><button onClick={() => auth.signOut()} className="btn-primary w-full">Sair e Tentar Novamente</button></div></div>) : <Navigate to="/login" />} 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
          <Footer />
          <LgpdBanner />
        </div>
      </BrowserRouter>
    </PixConfigProvider>
  );
}
