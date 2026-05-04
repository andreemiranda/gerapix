import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User } from 'firebase/auth';
import { LogOut, Grid, Home, User as UserIcon, Wallet } from 'lucide-react';
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
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--navbar-bg-solid)] backdrop-blur-xl border-b border-[var(--footer-border)] h-16 flex items-center no-print overflow-hidden"
      style={{ boxShadow: 'var(--shadow-navbar)' }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>

      <div className="container mx-auto max-w-6xl px-6 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-pix-purple)] flex items-center justify-center shadow-lg shadow-[var(--color-pix-purple)]/20 transition-transform group-hover:scale-105 active:scale-95 logo-icon">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-[18px] font-extrabold text-white tracking-tight">
            Gera<span className="text-[var(--color-pix-purple)]">Pix</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={cn(
              'px-4 py-2 rounded-[var(--radius-sm)] transition-all duration-200 flex items-center gap-2 text-[14px]',
              isActive('/')
                ? 'bg-[var(--color-pix-purple)]/20 text-white font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            )}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Início</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                'px-4 py-2 rounded-[var(--radius-sm)] transition-all duration-200 flex items-center gap-2 text-[14px]',
                isActive('/admin')
                  ? 'bg-[var(--color-pix-purple)]/20 text-white font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          <div className="w-[1px] h-4 bg-white/20 mx-2" />

          {user ? (
            <button
              onClick={handleLogout}
              className="btn-ghost btn-sm text-white/60 hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)]"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          ) : (
            <Link
              to="/login"
              className={cn(
                'px-4 py-2 rounded-[var(--radius-sm)] transition-all duration-200 flex items-center gap-2 text-[14px]',
                isActive('/login')
                  ? 'bg-[var(--color-pix-purple)]/20 text-white font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Portal Admin</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
