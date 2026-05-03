import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User } from 'firebase/auth';
import { LogOut, Grid, Home, User as UserIcon } from 'lucide-react';
import { signOut, auth } from '../lib/firebase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavbarProps {
  user: User | null;
  isAdmin: boolean;
}

export default function Navbar({ user, isAdmin }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/60 px-4 py-4 sticky top-0 z-50 shadow-sm no-print">
      <div className="container mx-auto max-w-4xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-pix-purple flex items-center justify-center ring-1 ring-pix-purple/20 transition-transform group-hover:scale-105"
               style={{ background: 'linear-gradient(135deg, #7000FF 0%, #4D00B8 100%)' }}>
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-2.12c-1.39-.17-1.89-1.07-1.93-1.85h.92c.03.3.18.91.95.91.81 0 .96-.34.96-.54 0-.41-.53-.54-.93-.72-.45-.19-1-.44-1-1.12 0-.61.42-1.07 1-1.22V8.5h1v2.12c1.39.17 1.89 1.07 1.93 1.85h-.92c-.03-.3-.18-.91-.95-.91-.81 0-.96.34-.96.54 0 .41.53.54.91.72.45.19 1 .44 1 1.12 0 .61-.42 1.07-1 1.22v1.84h-1z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Gera<span className="text-pix-purple">Pix</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={cn(
              "p-2 rounded-xl transition-all flex items-center gap-2",
              isActive('/') 
                ? "bg-pix-purple/8 text-pix-purple" 
                : "text-slate-500 hover:text-pix-purple hover:bg-slate-50"
            )}
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-bold">Início</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "p-2 rounded-xl transition-all flex items-center gap-2",
                isActive('/admin') 
                  ? "bg-pix-purple/8 text-pix-purple" 
                  : "text-slate-500 hover:text-pix-purple hover:bg-slate-50"
              )}
            >
              <Grid className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-bold">Painel</span>
            </Link>
          )}

          <div className="w-px h-4 bg-slate-200 mx-1" />

          {user ? (
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border hover:border-red-100 rounded-xl transition-all flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-bold">Sair</span>
            </button>
          ) : (
            <Link
              to="/login"
              className={cn(
                "p-2 rounded-xl transition-all flex items-center gap-2",
                isActive('/login') 
                  ? "bg-pix-purple/8 text-pix-purple" 
                  : "text-slate-500 hover:text-pix-purple hover:bg-slate-50"
              )}
            >
              <UserIcon className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-bold">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
