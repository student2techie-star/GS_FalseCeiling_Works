import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  imageSrc: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function Lightbox({ 
  isOpen, onClose, onNext, onPrev, imageSrc, imageAlt, title, subtitle, hasNext, hasPrev 
}: LightboxProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasNext, hasPrev, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl transition-opacity"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start md:items-center z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="text-white/80 pointer-events-auto max-w-[80%] pr-4">
          <p className="font-heading font-bold text-white text-lg md:text-xl leading-tight mb-1">{title}</p>
          <p className="text-xs md:text-sm text-accent">{subtitle}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 md:p-3 rounded-full transition-all pointer-events-auto flex-shrink-0 backdrop-blur-md border border-white/10"
          aria-label="Close"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Navigation Buttons */}
      {hasPrev && (
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-3 md:p-4 rounded-full transition-all z-10 backdrop-blur-md border border-white/5"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      )}

      {hasNext && (
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-3 md:p-4 rounded-full transition-all z-10 backdrop-blur-md border border-white/5"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      )}

      {/* Image Container */}
      <div 
        className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-16"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={imageSrc} 
          alt={imageAlt || 'Gallery Image'} 
          className="max-w-full max-h-[85vh] object-contain rounded-xl md:rounded-2xl shadow-2xl select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
