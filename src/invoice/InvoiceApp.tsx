import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import Login from './Login';
import Settings from './pages/Settings';
import Customers from './pages/Customers';
import Quotes from './pages/Quotes';
import QuoteEditor from './pages/QuoteEditor';
import Invoices from './pages/Invoices';
import InvoiceEditor from './pages/InvoiceEditor';
import Dashboard from './pages/Dashboard';
import Enquiries from './pages/Enquiries';
import { LayoutDashboard, FileText, Receipt, Users, MessageSquare, Settings as SettingsIcon, LogOut, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function InvoiceApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/invoice');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--plaster)]">
        <span className="text-[var(--slate)]">Loading...</span>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/invoice', icon: LayoutDashboard },
    { name: 'Quotes', path: '/invoice/quotes', icon: FileText },
    { name: 'Invoices', path: '/invoice/invoices', icon: Receipt },
    { name: 'Customers', path: '/invoice/customers', icon: Users },
    { name: 'Enquiries', path: '/invoice/enquiries', icon: MessageSquare },
    { name: 'Settings', path: '/invoice/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[var(--plaster)] text-[var(--ink)] font-body flex flex-col md:flex-row">
      <Helmet>
        <title>Dashboard | GS Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Mobile Header - Glassmorphism */}
      <div className="md:hidden glass-dark text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold shadow-md">
            GS
          </span>
          <span className="font-heading font-bold text-lg">Admin</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation - Premium Dark Mode */}
      <aside className={cn(
        "w-full md:w-[280px] bg-primary text-white border-r-0 md:shadow-[4px_0_24px_rgba(0,0,0,0.1)] flex-col md:sticky md:top-0 md:h-screen transition-transform z-40 fixed inset-y-0 left-0 overflow-y-auto",
        mobileMenuOpen ? "translate-x-0 pt-20 md:pt-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-8 hidden md:flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center text-white font-heading font-extrabold text-xl shadow-lg shadow-accent/20">
            GS
          </span>
          <span className="font-heading font-extrabold text-2xl tracking-tight text-white">Admin</span>
        </div>

        <nav className="flex-1 px-4 py-6 md:py-2 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/invoice' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 relative group",
                  isActive 
                    ? "bg-white/10 text-white shadow-inner border border-white/5" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-accent rounded-r-full" />
                )}
                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-accent" : "group-hover:text-slate-200")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-4 mb-4 flex items-center gap-3 border border-white/5">
             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
               A
             </div>
             <div>
               <div className="text-sm font-bold text-white">Admin User</div>
               <div className="text-xs text-slate-400">Manage Account</div>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 border border-slate-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-6 md:p-12 max-w-[1600px] mx-auto w-full">
        <div className="animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/:id" element={<QuoteEditor />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/:id" element={<InvoiceEditor />} />
            <Route path="/customers/*" element={<Customers />} />
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="/settings/*" element={<Settings />} />
          </Routes>
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
