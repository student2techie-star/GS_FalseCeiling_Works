import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Session } from '@supabase/supabase-js';
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
        <title>Dashboard | GS False Ceiling</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Mobile Header */}
      <div className="md:hidden bg-[var(--paper)] border-b border-[var(--line)] p-4 flex justify-between items-center sticky top-0 z-50">
        <span className="font-heading font-bold text-lg">GS Admin</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "w-full md:w-64 bg-[var(--paper)] border-r border-[var(--line)] flex-col md:sticky md:top-0 md:h-screen transition-transform z-40 fixed inset-y-0 left-0",
        mobileMenuOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-6 hidden md:block">
          <span className="font-heading font-bold text-xl tracking-tight">GS Admin</span>
        </div>

        <nav className="flex-1 px-4 py-4 md:py-0 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/invoice' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[var(--plaster)] text-[var(--blue)] font-bold" 
                    : "text-[var(--slate)] hover:bg-[var(--plaster)] hover:text-[var(--ink)]"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-[var(--blue)]" : "")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--line)]">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--slate)] hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-6 md:p-8">
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
      </main>
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
