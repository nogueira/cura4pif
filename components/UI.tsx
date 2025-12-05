
import React from 'react';
import { ArrowLeft, Plus, Settings, Calendar, Home, Bell, User, ChevronRight, Search, Share, Trophy } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyle = "flex h-14 w-full items-center justify-center rounded-xl text-base font-bold transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-slate-900 shadow-lg shadow-primary/30 hover:bg-primary-400",
    secondary: "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900",
    outline: "border border-zinc-200 dark:border-zinc-700 bg-transparent text-slate-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800",
    ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, icon?: React.ReactNode }> = ({ label, icon, className = '', ...props }) => {
  return (
    <label className="flex flex-col w-full">
      {label && <p className="text-slate-900 dark:text-white text-base font-medium leading-normal pb-2">{label}</p>}
      <div className="flex w-full items-center rounded-xl bg-white dark:bg-dark-card border border-zinc-200 dark:border-zinc-700 overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
        {icon && (
          <div className="pl-4 text-slate-400">
            {icon}
          </div>
        )}
        <input 
          className={`flex-1 h-14 w-full bg-transparent px-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 outline-none ${className}`}
          {...props} 
        />
      </div>
    </label>
  );
};

export const Header: React.FC<{ title: string, showBack?: boolean, rightElement?: React.ReactNode, onBack?: () => void }> = ({ title, showBack = true, rightElement, onBack }) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-gray-50/80 dark:bg-dark-bg/80 p-4 pb-2 backdrop-blur-sm">
      <div className="flex w-12 shrink-0 items-center justify-start">
        {showBack && (
          <button onClick={onBack ? onBack : () => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
        )}
      </div>
      <h1 className="flex-1 text-center text-lg font-bold text-slate-900 dark:text-white truncate px-2">{title}</h1>
      <div className="flex w-12 shrink-0 items-center justify-end">
        {rightElement}
      </div>
    </header>
  );
};

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-dark-card px-6 py-2 pb-6">
      <div className="flex justify-between items-center">
        <Link to="/home" className={`flex flex-col items-center gap-1 ${isActive('/home') ? 'text-primary' : 'text-slate-400'}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs font-medium">Início</span>
        </Link>
        <Link to="/reminders" className={`flex flex-col items-center gap-1 ${isActive('/reminders') ? 'text-primary' : 'text-slate-400'}`}>
          <Bell className="h-6 w-6" />
          <span className="text-xs font-medium">Lembretes</span>
        </Link>
        <div className="w-12"></div> {/* Space for FAB */}
        <Link to="/achievements" className={`flex flex-col items-center gap-1 ${isActive('/achievements') ? 'text-primary' : 'text-slate-400'}`}>
          <Trophy className="h-6 w-6" />
          <span className="text-xs font-medium">Conquistas</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-primary' : 'text-slate-400'}`}>
          <User className="h-6 w-6" />
          <span className="text-xs font-medium">Perfil</span>
        </Link>
      </div>
      {/* Centered FAB */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
        <Link to="/records/new" className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-slate-900 shadow-lg shadow-primary/30 transition-transform active:scale-95">
          <Plus className="h-8 w-8" />
        </Link>
      </div>
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className = '', onClick }) => {
  return (
    <div onClick={onClick} className={`bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 ${className} ${onClick ? 'cursor-pointer active:scale-[0.99] transition-transform' : ''}`}>
      {children}
    </div>
  );
};

export const ListItem: React.FC<{ title: string, subtitle?: string, icon?: React.ReactNode, onClick?: () => void, rightElement?: React.ReactNode }> = ({ title, subtitle, icon, onClick, rightElement }) => {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 p-4 min-h-[3.5rem] justify-between ${onClick ? 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors' : ''}`}>
      <div className="flex items-center gap-4 overflow-hidden">
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-slate-900 dark:text-white shrink-0">
            {icon}
          </div>
        )}
        <div className="flex flex-col overflow-hidden">
          <p className="text-base font-medium text-slate-900 dark:text-white truncate">{title}</p>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>}
        </div>
      </div>
      {rightElement || (onClick && <ChevronRight className="h-5 w-5 text-slate-400" />)}
    </div>
  );
};
