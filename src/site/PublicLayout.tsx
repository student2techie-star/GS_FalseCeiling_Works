import { Outlet, Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function PublicLayout() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Works', path: '/works' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--plaster)]">
      {/* Top Navigation */}
      <header className="bg-[var(--paper)] border-b border-[var(--line)] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-xl font-heading font-bold tracking-tight text-[var(--ink)]">
            GS False Ceiling
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={cn(
                  "text-base font-medium transition-colors hover:text-[var(--blue)]",
                  location.pathname === link.path ? "text-[var(--blue)]" : "text-[var(--ink)]"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:[BUSINESS_PHONE]" className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--line)] rounded-md hover:border-[var(--blue)] hover:text-[var(--blue)] transition-colors">
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </a>
            <a href="https://wa.me/[WHATSAPP_NUMBER]" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--ink)] text-[var(--paper)] rounded-md hover:bg-opacity-90 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--ink)] text-[var(--paper)] py-12 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">GS False Ceiling Works</h3>
            <p className="text-sm opacity-80 max-w-xs">
              Quality false ceilings, partitions, and interior finishes. Built to finish the room.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>[BUSINESS_PHONE]</li>
              <li>[BUSINESS_EMAIL]</li>
              <li>[ADDRESS]</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Service Areas</h4>
            <p className="text-sm opacity-80">
              [SERVICE_AREAS]
            </p>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-white/10 text-xs opacity-60">
          &copy; {new Date().getFullYear()} GS False Ceiling Works. All rights reserved.
        </div>
      </footer>

      {/* Mobile Sticky Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--paper)] border-t border-[var(--line)] p-4 flex gap-4 z-50">
        <a href="tel:[BUSINESS_PHONE]" className="flex-1 flex justify-center items-center gap-2 py-3 border border-[var(--line)] rounded-md font-medium text-sm">
          <Phone className="w-4 h-4" /> Call
        </a>
        <a href="https://wa.me/[WHATSAPP_NUMBER]" target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 py-3 bg-[var(--ink)] text-[var(--paper)] rounded-md font-medium text-sm">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
