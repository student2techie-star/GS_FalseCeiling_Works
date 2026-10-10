import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Phone, ArrowRight, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function PublicLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/works' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--plaster)] animate-fade-in font-body">
      {/* Top Navigation - Floating Glass Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2">
        <header className="max-w-[1200px] mx-auto glass rounded-full h-16 flex items-center justify-between px-6 transition-all duration-300 shadow-sm border border-white/40">
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img src="/GS_FalseCeiling_Works/logo.png" alt="G S Decors & Enterprises Logo" className="h-8 md:h-10 w-auto object-contain" />
            <span className="font-heading font-extrabold text-base md:text-xl tracking-tight text-gradient">
              <span className="md:hidden">G S Decors</span>
              <span className="hidden md:inline">G S Decors & Enterprises</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={cn(
                  "text-sm font-semibold transition-all hover:text-[var(--accent)] relative group",
                  location.pathname === link.path ? "text-[var(--primary)]" : "text-[var(--slate)]"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-[var(--accent)] transition-all group-hover:w-full",
                  location.pathname === link.path ? "w-full" : "w-0"
                )}></span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+917826089418" className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--primary)] rounded-full hover:bg-[var(--line)] transition-colors">
              <Phone className="w-4 h-4 group-hover:animate-bounce" />
              <span>Call</span>
            </a>
            <a href="https://wa.me/917826089418?text=Hello%20G%20S%20Decors%20%26%20Enterprises%2C%20I%20would%20like%20to%20know%20more%20about%20your%20ceiling%20and%20interior%20decoration%20products." target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white rounded-full hover:shadow-lg hover:shadow-accent/20 transition-all hover:-translate-y-0.5">
              <span>WhatsApp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--primary)] hover:bg-[var(--line)] rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden max-w-[1200px] mx-auto mt-2 glass rounded-3xl p-4 border border-white/40 shadow-lg animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                    location.pathname === link.path ? "bg-[var(--primary)] text-white" : "text-[var(--slate)] hover:bg-white/50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Main Content - Add top padding to account for fixed header */}
      <main className="flex-1 pt-24 pb-12">
        <Outlet />
      </main>

      {/* Footer - Premium Dark Footer */}
      <footer className="bg-[var(--ink)] text-white py-16 px-6 rounded-t-[2.5rem] mt-auto">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center mb-6">
              <img src="/GS_FalseCeiling_Works/logo.png" alt="G S Decors & Enterprises" className="h-12 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Ceiling and interior decoration materials for residential, commercial and professional requirements. Your trusted partner in Mayiladuthurai since 1996.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-white">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[var(--cove)]" /> +91 78260 89418</li>
              <li>No. 3/74, Main Road, Mungil Thottam,<br/>Opposite to Mayiladuthurai District Collectorate,<br/>Mayiladuthurai, Tamil Nadu – 609001</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-white">Service Areas</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Mayiladuthurai and surrounding districts.
            </p>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-white/10 text-xs text-slate-400 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} G S Decors & Enterprises. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons (Stacked Vertically on Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* Mobile Floating Call Button */}
        <a 
          href="tel:+917826089418" 
          className="md:hidden bg-white text-primary p-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform duration-300 flex items-center justify-center border border-slate-100"
          aria-label="Call Us"
        >
          <Phone className="w-6 h-6" />
        </a>

        {/* Floating WhatsApp Button (Mobile & Desktop) */}
        <a 
          href="https://wa.me/917826089418?text=Hello%20G%20S%20Decors%20%26%20Enterprises%2C%20I%20would%20like%20to%20know%20more%20about%20your%20ceiling%20and%20interior%20decoration%20products." 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform duration-300 items-center justify-center"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
