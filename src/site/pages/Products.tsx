import { Helmet } from 'react-helmet-async';
import { products, productCategories } from '../data/products';
import { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredProducts.length);
    }
  }, [lightboxIndex, filteredProducts.length]);

  const prevImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredProducts.length) % filteredProducts.length);
    }
  }, [lightboxIndex, filteredProducts.length]);

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
        <title>Ceiling & Interior Products | G S Decors & Enterprises</title>
        <meta name="description" content="Explore ceiling and interior decoration products available from G S Decors & Enterprises in Mayiladuthurai." />
      </Helmet>

      {/* Page Header */}
      <section className="pt-24 pb-16 px-6 bg-primary text-white">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-6">Our Products</h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Explore our comprehensive range of high-quality ceiling and interior materials suitable for residential, commercial, and professional projects.
          </p>
        </div>
      </section>

      {/* Products Content */}
      <section className="py-16 px-6 bg-plaster min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Categories Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {productCategories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-6 py-2 rounded-full font-semibold text-sm transition-all shadow-sm border",
                  activeCategory === category 
                    ? "bg-primary text-white border-primary" 
                    : "bg-white text-slate-600 border-line hover:border-primary hover:text-primary"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => (
              <button key={product.id} onClick={() => openLightbox(idx)} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-line hover:border-transparent text-left outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                    {product.category}
                  </div>
                </div>
              </button>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-line">
                <h3 className="text-xl font-semibold text-primary mb-2">No products found</h3>
                <p className="text-slate-500">Product information will be updated soon. Contact us for current availability.</p>
              </div>
            )}
          </div>
          
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 flex items-center justify-center backdrop-blur-sm">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 bg-black/20 p-2 rounded-full hover:bg-black/40"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-6 text-white/50 hover:text-white transition-colors p-3 z-50 bg-black/20 rounded-full hover:bg-black/40"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <div className="max-w-6xl w-full px-16 aspect-video flex flex-col items-center justify-center relative">
             <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
                <img 
                 src={filteredProducts[lightboxIndex].image} 
                 alt={filteredProducts[lightboxIndex].name}
                 className="max-w-full max-h-[85vh] object-contain shadow-2xl"
               />
             </div>
             <div className="absolute bottom-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-white text-center shadow-xl">
               <p className="font-semibold">{filteredProducts[lightboxIndex].name}</p>
               <p className="text-xs text-white/80 mt-1">{filteredProducts[lightboxIndex].category}</p>
             </div>
          </div>

          <button 
            onClick={nextImage}
            className="absolute right-6 text-white/50 hover:text-white transition-colors p-3 z-50 bg-black/20 rounded-full hover:bg-black/40"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  );
}
