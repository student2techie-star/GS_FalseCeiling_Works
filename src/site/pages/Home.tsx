import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Phone, MessageCircle, Star, Shield, PenTool } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>G S Decors & Enterprises | Ceiling & Interior Materials in Mayiladuthurai</title>
        <meta name="description" content="G S Decors & Enterprises in Koranad, Mayiladuthurai offers ceiling and interior decoration materials for residential, commercial and professional requirements." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "G S Decors & Enterprises",
              "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
              "@id": "",
              "url": "",
              "telephone": "+919159523147",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "No. 3/74, Main Road, Mungil Thottam, Opposite Palpannai, Koranad",
                "addressLocality": "Mayiladuthurai",
                "addressRegion": "Tamil Nadu",
                "postalCode": "609001",
                "addressCountry": "IN"
              }
            }
          `}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[var(--plaster)] z-[-2]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-[-1] animate-pulse duration-[10s]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 z-[-1]" />
        
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
          <div className={cn("transition-all duration-1000", isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="text-sm font-semibold text-primary">Interior Decoration Solutions</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold mb-8 leading-[1.1] text-primary">
              G S Decors & <br/>
              <span className="text-gradient relative">
                Enterprises
                <span className={cn("absolute -bottom-2 left-0 h-1 bg-accent transition-all duration-[2000ms] ease-out", isLoaded ? "w-full" : "w-0")}></span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-body">
              Explore quality ceiling and interior decoration materials for residential, commercial and professional projects in Mayiladuthurai.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products" 
                className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1 inline-flex items-center gap-2 group"
              >
                Explore Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/contact" 
                className="bg-white/50 backdrop-blur-md border border-slate-200 text-primary px-8 py-4 rounded-full font-semibold hover:bg-white transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
              >
                Get a Quote
              </Link>
              <a 
                href="https://wa.me/919159523147?text=Hello%20G%20S%20Decors%20%26%20Enterprises%2C%20I%20would%20like%20to%20know%20more%20about%20your%20ceiling%20and%20interior%20decoration%20products." 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/50 backdrop-blur-md border border-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-white transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform text-accent" />
                WhatsApp Us
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2"><Star className="w-5 h-5 text-cove" /> Established in 1996</div>
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-accent" /> Premium Materials</div>
            </div>
          </div>
          
          <div className={cn("relative transition-all duration-1000 delay-300", isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10")}>
            <div className="relative aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 border-8 border-white/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay z-10" />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <span className="font-medium text-sm tracking-widest text-slate-400 uppercase">Placeholder: Hero Image</span>
              </div>
              {/* <img src="/hero.jpg" alt="Modern false ceiling" className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000" /> */}
              
              {/* Floating Badge */}
              <div className="absolute bottom-8 left-[-2rem] glass rounded-2xl p-4 flex items-center gap-4 z-20 animate-bounce" style={{animationDuration: '3s'}}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-blue flex items-center justify-center text-white">
                  <PenTool className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-primary">Custom Designs</div>
                  <div className="text-xs text-slate-500">Tailored to your space</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Intro & Product Categories */}
      <section className="py-32 px-6 bg-white relative">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-6 text-primary">Your Partner for Ceiling & Interior Solutions</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                G S Decors & Enterprises provides ceiling and interior-decoration materials for a wide range of residential and commercial requirements. We help customers, contractors, builders and interior professionals find suitable materials for their projects.
              </p>
            </div>
            <Link to="/products" className="text-accent font-semibold inline-flex items-center gap-1 hover:text-blue transition-colors group px-6 py-3 rounded-full bg-accent/5 hover:bg-accent/10">
              View all products 
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'PVC False Ceiling', desc: 'Practical ceiling solution suitable for a variety of interior applications.', color: 'from-blue-500 to-cyan-500', link: 'pvc-false-ceiling' },
              { title: 'Gypsum Boards', desc: 'High-quality gypsum boards for seamless, elegant ceilings.', color: 'from-purple-500 to-pink-500', link: 'gypsum-ceiling' },
              { title: 'Armstrong Systems', desc: 'Premium modular ceiling systems offering superior acoustics.', color: 'from-amber-500 to-orange-500', link: 'armstrong-ceiling' },
              { title: 'Interior Materials', desc: 'Complete range of grid systems and decorative interior materials.', color: 'from-emerald-500 to-teal-500', link: 'interior-materials' }
            ].map((service, i) => (
              <Link key={i} to={`/products`} className="group relative p-8 rounded-3xl bg-plaster hover:bg-white transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-transparent hover:border-line overflow-hidden flex flex-col h-full">
                <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity", service.color)} />
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 border border-slate-100">
                  <span className={cn("w-6 h-6 rounded-full bg-gradient-to-br", service.color)} />
                </div>
                <h3 className="font-heading font-bold text-xl mb-4 text-primary group-hover:text-accent transition-colors">{service.title}</h3>
                <p className="text-slate-500 mb-8 flex-grow">{service.desc}</p>
                <a 
                  href={`https://wa.me/919159523147?text=Hello%20G%20S%20Decors%20%26%20Enterprises%2C%20I%20am%20interested%20in%20${encodeURIComponent(service.title)}.%20Please%20share%20the%20available%20options%20and%20price%20details.`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary flex items-center gap-2 group-hover:text-accent transition-colors mt-auto z-20 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle className="w-4 h-4" /> Enquire on WhatsApp
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured works */}
      <section className="py-32 px-6 bg-plaster relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-line z-0" />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-6 text-primary">Featured Projects</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              A curated selection of our most recent residential and commercial transformations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <Link key={item} to="/works" className={cn("group block aspect-[4/3] rounded-[2rem] overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 relative", index % 2 === 0 ? "md:translate-y-8" : "")}>
                 <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  <span className="font-medium text-xs tracking-widest uppercase">Project Photo {item}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <span className="text-white font-heading font-bold text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Modern Living Room</span>
                  <span className="text-white/80 text-sm mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">View Project details →</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-24 text-center">
             <Link to="/works" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-semibold border border-line hover:border-accent hover:text-accent transition-all hover:shadow-md group">
              View full gallery
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* How a project runs */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-6 text-primary">Our Process</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">From initial concept to flawless execution.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-line via-accent to-line opacity-50 z-0" />
            
            {[
              { num: '01', title: 'Site Visit', desc: 'Comprehensive inspection to understand your space and vision.' },
              { num: '02', title: 'Measurement', desc: 'Precise calculations for an accurate, transparent quotation.' },
              { num: '03', title: 'Execution', desc: 'Expert installation using premium materials and craftsmanship.' },
              { num: '04', title: 'Handover', desc: 'Final walkthrough, cleanup, and project delivery on time.' },
            ].map((step, i) => (
              <div key={i} className="relative z-10 group text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl bg-plaster border border-line flex items-center justify-center text-2xl font-heading font-extrabold text-slate-400 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300 shadow-sm mx-auto md:mx-0 mb-6 group-hover:-translate-y-2">
                  {step.num}
                </div>
                <h3 className="text-xl font-heading font-bold mb-4 text-primary">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Call to Action */}
      <section className="py-32 px-6 bg-primary relative overflow-hidden rounded-t-[3rem]">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 z-0" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 z-0" />
        
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-8 text-white leading-tight">
            Need Ceiling or <br/>Interior Materials?
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-body">
            Contact G S Decors & Enterprises for product information and enquiries.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="tel:+919159523147" 
              className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all inline-flex items-center justify-center gap-3 group text-lg"
            >
              <Phone className="w-5 h-5 group-hover:animate-bounce text-accent" />
              Call Now
            </a>
            <a 
              href="https://wa.me/919159523147?text=Hello%20G%20S%20Decors%20%26%20Enterprises%2C%20I%20would%20like%20to%20know%20more%20about%20your%20ceiling%20and%20interior%20decoration%20products." 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all inline-flex items-center justify-center gap-3 group text-lg"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
