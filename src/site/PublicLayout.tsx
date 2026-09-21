import { Outlet, Link, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
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
          <Link to="/" className="flex items-center gap-3">
            <img src="/GS_FalseCeiling_Works/logo.png" alt="G S Decors & Enterprises Logo" className="h-10 w-auto object-contain" />
            <span className="font-heading font-extrabold text-xl tracking-tight text-gradient hidden sm:block">
              G S Decors & Enterprises
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
            <a href="tel:+919159523147" className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--primary)] rounded-full hover:bg-[var(--line)] transition-colors">
              <Phone className="w-4 h-4 group-hover:animate-bounce" />
              <span>Call</span>
            </a>
            <a href="https://wa.me/919159523147?text=Hello%20G%20S%20Decors%20%26%20Enterprises%2C%20I%20would%20like%20to%20know%20more%20about%20your%20ceiling%20and%20interior%20decoration%20products." target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-gradient-to-r from-primary to-accent text-white rounded-full hover:shadow-lg hover:shadow-accent/20 transition-all hover:-translate-y-0.5">
              <span>WhatsApp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </header>
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
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[var(--cove)]" /> +91 91595 23147</li>
              <li>No. 3/74, Main Road, Mungil Thottam,<br/>Opposite Palpannai, Koranad,<br/>Mayiladuthurai, Tamil Nadu – 609001</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-white">Service Areas</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Mayiladuthurai, Koranad, and surrounding districts.
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

      {/* Mobile Sticky Bar - Glass effect */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="glass-dark rounded-full p-2 flex gap-2">
          <a href="tel:+919159523147" className="flex-1 flex justify-center items-center gap-2 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors">
            <Phone className="w-4 h-4" /> Call
          </a>
          <a href="https://wa.me/919159523147?text=Hello%20G%20S%20Decors%20%26%20Enterprises%2C%20I%20would%20like%20to%20know%20more%20about%20your%20ceiling%20and%20interior%20decoration%20products." target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold text-sm shadow-lg">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </div>

      {/* Desktop Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919159523147?text=Hello%20G%20S%20Decors%20%26%20Enterprises%2C%20I%20would%20like%20to%20know%20more%20about%20your%20ceiling%20and%20interior%20decoration%20products." 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hidden md:flex fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
