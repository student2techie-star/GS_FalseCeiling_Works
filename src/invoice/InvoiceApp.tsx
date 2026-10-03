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
import Products from './pages/Products';
import { LayoutDashboard, FileText, Receipt, Users, MessageSquare, Settings as SettingsIcon, LogOut, Menu, X, Package, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function InvoiceApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingEnqCount, setPendingEnqCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
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

  useEffect(() => {
    if (session) {
      const fetchCounts = async () => {
        const { count: eCount } = await supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('handled', false);
        if (eCount !== null) setPendingEnqCount(eCount);
        
        const { count: pCount, error } = await supabase.from('item_templates').select('*', { count: 'exact', head: true }).eq('in_stock', false);
        if (!error && pCount !== null) setOutOfStockCount(pCount);
      };
      fetchCounts();
    }
  }, [session, location.pathname]);

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
    { name: 'Products', path: '/invoice/products', icon: Package },
    { name: 'Enquiries', path: '/invoice/enquiries', icon: MessageSquare },
    { name: 'Settings', path: '/invoice/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[var(--plaster)] text-[var(--ink)] font-body flex flex-col">
      <Helmet>
        <title>Dashboard | GS Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Top Navigation Bar */}
      <header className="bg-primary text-white sticky top-0 z-50 shadow-[0_4px_24px_rgba(0,0,0,0.18)] hide-on-print">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center text-white font-heading font-extrabold text-lg shadow-lg shadow-accent/20">
                GS
              </span>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white hidden sm:block">
                Admin
              </span>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/invoice' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 relative',
                      isActive
                        ? 'bg-white/15 text-white shadow-inner border border-white/10'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon className={cn('w-4 h-4', isActive ? 'text-accent' : '')} />
                    {item.name}
                    {item.name === 'Enquiries' && pendingEnqCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ml-1">
                        {pendingEnqCount}
                      </span>
                    )}
                    {item.name === 'Products' && outOfStockCount > 0 && (
                      <AlertTriangle className="w-4 h-4 text-orange-400 ml-1" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: User chip + Logout */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 border border-white/10">
                <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-xs">
                  A
                </div>
                <span className="text-sm font-semibold text-white">Admin</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-300 border border-slate-600 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Sign Out</span>
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-primary">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/invoice' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                      isActive
                        ? 'bg-white/15 text-white border border-white/10'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon className={cn('w-4 h-4', isActive ? 'text-accent' : '')} />
                    {item.name}
                    {item.name === 'Enquiries' && pendingEnqCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                        {pendingEnqCount}
                      </span>
                    )}
                    {item.name === 'Products' && outOfStockCount > 0 && (
                      <AlertTriangle className="w-4 h-4 text-orange-400 ml-auto" />
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="px-4 pb-4 pt-2 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-slate-300 border border-slate-600 hover:bg-red-500/15 hover:text-red-400 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-4 md:p-8 max-w-[1600px] mx-auto w-full">
        <div className="animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/quotes/:id" element={<QuoteEditor />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/:id" element={<InvoiceEditor />} />
            <Route path="/customers/*" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="/settings/*" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
