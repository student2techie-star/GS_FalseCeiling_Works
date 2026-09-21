import { Helmet } from 'react-helmet-async';
import { products, productCategories } from '../data/products';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MessageCircle } from 'lucide-react';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

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
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-line hover:border-transparent">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                    {product.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-heading font-bold text-xl text-primary mb-3">{product.name}</h3>
                  <p className="text-slate-500 text-sm flex-grow mb-6">{product.description}</p>
                  
                  <a 
                    href={`https://wa.me/919159523147?text=Hello%20G%20S%20Decors%20%26%20Enterprises%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}.%20Please%20share%20the%20available%20options%20and%20price%20details.`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Enquire on WhatsApp
                  </a>
                </div>
              </div>
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
    </>
  );
}
