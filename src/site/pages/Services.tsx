import { Helmet } from 'react-helmet-async';
import { MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const SERVICES = [
  {
    id: 'false-ceiling-materials',
    title: 'False Ceiling Materials',
    desc: 'Supply of suitable false-ceiling materials for different project requirements. We offer gypsum boards, PVC panels, Armstrong grids, and mineral fibre tiles.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'interior-decoration-materials',
    title: 'Interior Decoration Materials',
    desc: 'Materials for interior decoration and finishing requirements. Explore our range of decorative panels and accessories to elevate your space.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'project-material-support',
    title: 'Project Material Support',
    desc: 'We help customers and professionals identify suitable materials for their project needs, ensuring you get the right product for your specific application.',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'contractor-enquiries',
    title: 'Contractor / Professional Enquiries',
    desc: 'Dedicated enquiry flow and support for contractors, builders and interior professionals. Partner with us for reliable material supply.',
    color: 'from-emerald-500 to-teal-500'
  }
];

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Ceiling & Interior Services | G S Decors & Enterprises</title>
        <meta name="description" content="Explore ceiling and interior material solutions from G S Decors & Enterprises in Mayiladuthurai." />
      </Helmet>

      {/* Page Header */}
      <section className="pt-24 pb-16 px-6 bg-[var(--ink)] text-[var(--paper)]">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-6">Our Services</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Providing comprehensive material solutions and support for ceiling and interior projects.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 bg-[var(--plaster)] min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((svc) => (
              <div key={svc.id} id={svc.id} className="scroll-mt-32 group relative p-10 rounded-3xl bg-white transition-all duration-300 hover:shadow-xl border border-transparent hover:border-[var(--line)] overflow-hidden flex flex-col h-full">
                <div className={cn("absolute top-0 left-0 w-full h-2 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity", svc.color)} />
                
                <h2 className="text-2xl font-bold mb-4 text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors">{svc.title}</h2>
                <p className="text-[var(--slate)] text-lg leading-relaxed mb-8 flex-grow">
                  {svc.desc}
                </p>
                
                <a 
                  href={`https://wa.me/919159523147?text=Hello%20G%20S%20Decors%20%26%20Enterprises%2C%20I%20would%20like%20to%20know%20more%20about%20your%20${encodeURIComponent(svc.title)}%20services.`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[var(--plaster)] text-[var(--primary)] font-semibold px-6 py-3 rounded-full hover:bg-[var(--line)] transition-colors self-start mt-auto"
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366]" /> Enquire Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
