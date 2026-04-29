import { Link, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { LogOut, Grid, Home, User as UserIcon } from 'lucide-react';
import { signOut, auth } from '../lib/firebase';

interface NavbarProps {
  user: User | null;
  isAdmin: boolean;
}

export default function Navbar({ user, isAdmin }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-4 py-4 sticky top-0 z-50 shadow-sm no-print">
      <div className="container mx-auto max-w-4xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pix-purple flex items-center justify-center">
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

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className="p-2 text-slate-500 hover:text-pix-purple hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Início</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="p-2 text-slate-500 hover:text-pix-purple hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Grid className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Painel</span>
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Sair</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="p-2 text-slate-500 hover:text-pix-purple hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <UserIcon className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
