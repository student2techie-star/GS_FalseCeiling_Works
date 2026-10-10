import { useState, useEffect, useCallback } from 'react';
import SEO from '../../components/SEO';
import Lightbox from '../../components/Lightbox';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { galleryItems, galleryCategories } from '../data/gallery';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Works() {
  const [filter, setFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredWorks = filter === 'All' 
    ? galleryItems 
    : galleryItems.filter(w => w.category === filter);

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
      <SEO 
        title="Gallery & Projects | False Ceiling Works in Mayiladuthurai, Kumbakonam"
        description="Explore our portfolio of completed false ceiling, interior decoration, and material supply projects in Mayiladuthurai, Kumbakonam, Sirkazhi, and Karaikal."
        keywords="False ceiling works Mayiladuthurai, interior projects Kumbakonam, PVC ceiling gallery Sirkazhi, Gypsum projects Karaikal, G S Decors completed projects, Tamil Nadu ceiling installations"
        url="https://gsdecors.com/works"
      />

      <section className="bg-[var(--ink)] text-[var(--paper)] py-16 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Gallery & Projects</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            A visual showcase of our materials in residential and commercial spaces.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 max-w-[1200px] mx-auto min-h-[50vh]">
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {galleryCategories.map(cat => (
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
                 <img 
                  src={work.image} 
                  alt={work.alt} 
                  loading="lazy" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-primary shadow-sm">
                  {work.category}
                </div>
              </div>
              <h3 className="font-bold text-lg group-hover:text-[var(--blue)] transition-colors">{work.title}</h3>
            </button>
          ))}
        </div>

        {filteredWorks.length === 0 && (
          <div className="text-center py-20 text-[var(--slate)] border border-[var(--line)] rounded-xl mt-8">
             <h3 className="text-xl font-semibold text-[var(--primary)] mb-2">No projects found</h3>
            <p>More project images will be added soon.</p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
        hasNext={true}
        hasPrev={true}
        imageSrc={lightboxIndex !== null ? filteredWorks[lightboxIndex].image : ''}
        imageAlt={lightboxIndex !== null ? filteredWorks[lightboxIndex].alt : ''}
        title={lightboxIndex !== null ? filteredWorks[lightboxIndex].title : ''}
        subtitle={lightboxIndex !== null ? filteredWorks[lightboxIndex].category : ''}
      />
    </>
  );
}
