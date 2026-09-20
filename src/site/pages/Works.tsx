import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Temporary static data
const CATEGORIES = ['All', 'Gypsum', 'Grid', 'PVC', 'POP', 'Cove lighting', 'Partition'];

const WORKS_DATA = [
  { id: 1, category: 'Gypsum', type: 'Gypsum False Ceiling', area: '450 sq ft', location: 'Living Room, City', img: '/placeholder-work.jpg' },
  { id: 2, category: 'Grid', type: 'Grid Ceiling', area: '1200 sq ft', location: 'Office Space, City', img: '/placeholder-work.jpg' },
  { id: 3, category: 'Cove lighting', type: 'Cove Lighting', area: '300 sq ft', location: 'Bedroom, City', img: '/placeholder-work.jpg' },
  { id: 4, category: 'PVC', type: 'PVC Ceiling', area: '150 sq ft', location: 'Bathroom, City', img: '/placeholder-work.jpg' },
  { id: 5, category: 'Partition', type: 'Gypsum Partition', area: '80 sq ft', location: 'Studio, City', img: '/placeholder-work.jpg' },
  { id: 6, category: 'POP', type: 'POP Cornice', area: 'Running 120 ft', location: 'Hall, City', img: '/placeholder-work.jpg' },
];

export default function Works() {
  const [filter, setFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredWorks = filter === 'All' 
    ? WORKS_DATA 
    : WORKS_DATA.filter(w => w.category === filter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredWorks.length);
    }
  }, [lightboxIndex, filteredWorks.length]);

  const prevImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredWorks.length) % filteredWorks.length);
    }
  }, [lightboxIndex, filteredWorks.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, nextImage, prevImage]);

  return (
    <>
      <Helmet>
        <title>Our Works | GS False Ceiling</title>
        <meta name="description" content="Explore our portfolio of gypsum, PVC, grid ceilings, and partitions." />
      </Helmet>

      <section className="bg-[var(--ink)] text-[var(--paper)] py-16 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Works</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            A gallery of our recent false ceiling and interior finishing projects.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 max-w-[1200px] mx-auto min-h-[50vh]">
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                filter === cat 
                  ? "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]" 
                  : "bg-transparent text-[var(--slate)] border-[var(--line)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry/Grid Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work, idx) => (
            <button 
              key={work.id} 
              onClick={() => openLightbox(idx)}
              className="group text-left block w-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)] focus-visible:ring-offset-4 rounded-sm"
            >
              <div className="aspect-[4/3] bg-[var(--line)] mb-3 overflow-hidden rounded-sm relative">
                {/* <img 
                  src={work.img} 
                  alt={`${work.type} at ${work.location}`} 
                  loading="lazy" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                /> */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50 text-[var(--ink)] bg-slate-200">
                  <span className="font-medium text-sm tracking-widest uppercase mb-1">Photo Placeholder</span>
                  <span className="text-xs">{work.category}</span>
                </div>
              </div>
              <h3 className="font-bold text-lg group-hover:text-[var(--blue)] transition-colors">{work.type}</h3>
              <p className="text-[var(--slate)] text-sm">{work.area} &bull; {work.location}</p>
            </button>
          ))}
        </div>

        {filteredWorks.length === 0 && (
          <div className="text-center py-20 text-[var(--slate)]">
            <p>No works found for this category yet.</p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-[var(--ink)] flex items-center justify-center">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-6 text-white/50 hover:text-white transition-colors p-2"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          
          <div className="max-w-5xl w-full px-16 aspect-video flex flex-col items-center justify-center relative">
             <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/50">
               {/* <img 
                 src={filteredWorks[lightboxIndex].img} 
                 alt={filteredWorks[lightboxIndex].type}
                 className="max-w-full max-h-[80vh] object-contain"
               /> */}
               <span>[IMAGE: {filteredWorks[lightboxIndex].type}]</span>
             </div>
             <div className="absolute bottom-[-40px] text-white text-center w-full">
               <p className="font-medium">{filteredWorks[lightboxIndex].type}</p>
               <p className="text-sm text-white/70">{filteredWorks[lightboxIndex].area} &bull; {filteredWorks[lightboxIndex].location}</p>
             </div>
          </div>

          <button 
            onClick={nextImage}
            className="absolute right-6 text-white/50 hover:text-white transition-colors p-2"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </>
  );
}
