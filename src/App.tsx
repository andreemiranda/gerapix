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
import { PixConfigProvider } from './context/PixConfigContext';

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
        <div className="min-h-[100dvh] flex flex-col bg-slate-50">
          <Navbar user={user} isAdmin={isAdmin} />
          <main className="flex-1 w-full flex flex-col relative">
            <div className="flex-1 w-full flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/resultado" element={<Result />} />
                <Route path="/login" element={user && isAdmin ? <Navigate to="/admin" /> : <Login />} />
                <Route 
                  path="/admin" 
                  element={user ? (isAdmin ? <AdminDashboard /> : <div className="p-8 text-center"><h1 className="text-2xl font-bold text-red-500">Acesso Negado</h1><p>Você não tem permissão para acessar esta área.</p><button onClick={() => auth.signOut()} className="mt-4 text-pix-purple underline">Sair e tentar outra conta</button></div>) : <Navigate to="/login" />} 
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </PixConfigProvider>
  );
}
