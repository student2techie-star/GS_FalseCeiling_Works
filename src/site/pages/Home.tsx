import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, Phone, MessageCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';

export default function Home() {
  const [coveDrawn, setCoveDrawn] = useState(false);

  useEffect(() => {
    // Trigger the cove light animation after a short delay on mount
    const timer = setTimeout(() => {
      setCoveDrawn(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>GS False Ceiling Works | Professional False Ceiling Services</title>
        <meta name="description" content="Quality false ceilings, partitions, and interior finishes. Built to finish the room." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-[var(--ink)] text-[var(--paper)] pt-20 pb-24 px-6 relative overflow-hidden">
        {/* The Cove Light Motif */}
        <div 
          className="absolute top-0 left-0 h-1 bg-[var(--cove)] transition-all duration-[1500ms] ease-out shadow-[0_4px_24px_rgba(255,184,77,0.6)]"
          style={{ width: coveDrawn ? '100%' : '0%' }}
        />
        
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-[1.1]">
              False ceilings, built to finish the room.
            </h1>
            <p className="text-lg md:text-xl opacity-80 mb-8 max-w-lg leading-relaxed">
              Professional installation of gypsum, PVC, and grid false ceilings, custom cove lighting, and interior partitions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/contact" 
                className="bg-[var(--blue)] text-[var(--paper)] px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
              >
                Get a free quote
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="https://wa.me/[WHATSAPP_NUMBER]" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-transparent border border-[var(--paper)] border-opacity-30 px-6 py-3 rounded-md font-medium hover:border-opacity-100 transition-colors inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp us
              </a>
            </div>
          </div>
          
          <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-[var(--slate)]">
            <div className="absolute inset-0 flex items-center justify-center opacity-50">
              <span className="font-medium text-sm tracking-widest uppercase">Placeholder: Ceiling Photo</span>
            </div>
            {/* The actual image will go here */}
            {/* <img src="/placeholder-hero.jpg" alt="Modern false ceiling with cove lighting" className="w-full h-full object-cover" /> */}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-[var(--slate)] max-w-2xl text-lg">
                We supply and install a complete range of interior finishing solutions for residential and commercial spaces.
              </p>
            </div>
            <Link to="/services" className="text-[var(--blue)] font-medium inline-flex items-center gap-1 hover:underline group">
              View all services 
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Gypsum False Ceiling', desc: 'Seamless, smooth finishes for elegant interiors.' },
              { title: 'Grid / Tile Ceiling', desc: 'Practical acoustic solutions for offices.' },
              { title: 'PVC Ceiling', desc: 'Moisture-resistant panels for specific areas.' },
              { title: 'Cove & Profile Lighting', desc: 'Custom lighting integrations.' }
            ].map((service, i) => (
              <Link key={i} to={`/services#${service.title.replace(/\s+/g, '-').toLowerCase()}`} className="group border border-[var(--line)] p-6 rounded-md hover:border-[var(--blue)] transition-colors bg-[var(--paper)]">
                <h3 className="font-bold text-xl mb-2 group-hover:text-[var(--blue)] transition-colors">{service.title}</h3>
                <p className="text-[var(--slate)] text-sm mb-4">{service.desc}</p>
                <span className="text-sm font-medium text-[var(--blue)] flex items-center gap-1">
                  Learn more <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured works */}
      <section className="py-24 px-6 bg-[var(--paper)] border-y border-[var(--line)]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Works</h2>
              <p className="text-[var(--slate)] max-w-2xl text-lg">
                A selection of our recent residential and commercial projects.
              </p>
            </div>
            <Link to="/works" className="text-[var(--blue)] font-medium inline-flex items-center gap-1 hover:underline group">
              View gallery
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Link key={item} to="/works" className="group block aspect-square rounded-sm overflow-hidden bg-gray-200 relative">
                 <div className="absolute inset-0 flex items-center justify-center opacity-50 text-[var(--slate)]">
                  <span className="font-medium text-xs tracking-widest uppercase">Project Photo {item}</span>
                </div>
                {/* <img src={`/placeholder-work-${item}.jpg`} alt={`Project ${item}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <span className="text-[var(--paper)] font-medium">View Project</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How a project runs */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How a project runs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Site Visit', desc: 'We visit your site to understand your requirements and inspect the area.' },
              { num: '02', title: 'Measurement & Quote', desc: 'Accurate measurements are taken to provide a detailed, room-wise quotation.' },
              { num: '03', title: 'Work', desc: 'Our skilled team executes the work with quality materials and neat finishes.' },
              { num: '04', title: 'Handover', desc: 'Final inspection, cleanup, and project handover on schedule.' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-heading font-bold text-[var(--line)] mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-[var(--slate)] leading-relaxed">{step.desc}</p>
                {i !== 3 && (
                  <div className="hidden md:block absolute top-6 left-12 right-0 h-px bg-[var(--line)] w-full ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Call to Action */}
      <section className="py-24 px-6 bg-[var(--ink)] text-[var(--paper)] text-center">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your project?</h2>
          <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto">
            Contact us today for a free site visit and estimate. We're here to answer your questions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="tel:[BUSINESS_PHONE]" 
              className="bg-[var(--blue)] text-[var(--paper)] px-8 py-4 rounded-md font-medium hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call [BUSINESS_PHONE]
            </a>
            <a 
              href="https://wa.me/[WHATSAPP_NUMBER]" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-transparent border border-[var(--paper)] border-opacity-30 px-8 py-4 rounded-md font-medium hover:border-opacity-100 transition-colors inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
