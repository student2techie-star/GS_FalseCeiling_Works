import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    id: 'gypsum-false-ceiling',
    title: 'Gypsum False Ceiling',
    desc: 'The industry standard for residential and premium commercial spaces. Gypsum boards offer a seamless, smooth finish that can be painted to match any decor. They provide excellent fire resistance and sound insulation.',
    bestFor: 'Living rooms, bedrooms, retail stores, and boardrooms.',
  },
  {
    id: 'grid-tile-ceiling',
    title: 'Grid / Tile Ceiling',
    desc: 'A highly practical drop ceiling system utilizing a metal grid and acoustic or mineral fiber tiles. This system allows easy access to plumbing, electrical wiring, and HVAC systems hidden above.',
    bestFor: 'Offices, hospitals, schools, and commercial kitchens.',
  },
  {
    id: 'pvc-ceiling',
    title: 'PVC Ceiling',
    desc: 'Lightweight, durable, and completely moisture-resistant. PVC panels are quick to install, require zero painting, and are extremely easy to clean.',
    bestFor: 'Bathrooms, balconies, damp areas, and budget-friendly renovations.',
  },
  {
    id: 'pop-work',
    title: 'POP Work',
    desc: 'Plaster of Paris offers ultimate flexibility for creating intricate cornices, decorative moldings, and custom ceiling patterns that add a touch of classic elegance.',
    bestFor: 'Traditional interiors, custom decorative borders, and heritage renovations.',
  },
  {
    id: 'cove-and-profile-lighting',
    title: 'Cove & Profile Lighting',
    desc: 'We design and build custom recessed ledges and integrated aluminum profiles to house LED strips, creating soft, ambient, indirect lighting that elevates the mood of any room.',
    bestFor: 'Living spaces, home theaters, and modern bedrooms.',
  },
  {
    id: 'partitions',
    title: 'Partitions',
    desc: 'Quickly divide spaces without the mess of wet masonry work. Our drywall partitions use sturdy metal tracks and gypsum boards, offering excellent soundproofing when packed with acoustic insulation.',
    bestFor: 'Office cabins, studio apartments, and commercial layout changes.',
  },
  {
    id: 'painting',
    title: 'Painting',
    desc: 'We offer professional painting services to perfectly finish our ceiling and partition work, ensuring a flawless, uniform look across the entire space.',
    bestFor: 'New ceiling installations and complete room makeovers.',
  }
];

export default function Services() {
  return (
    <>
      <Helmet>
        <title>Our Services | GS False Ceiling</title>
        <meta name="description" content="Gypsum ceilings, grid ceilings, PVC, POP work, lighting, and partitions." />
      </Helmet>

      <section className="bg-[var(--ink)] text-[var(--paper)] py-16 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Comprehensive interior finishing solutions, executed with precision and care.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 max-w-[1000px] mx-auto">
        <div className="space-y-24">
          {SERVICES.map((svc, index) => (
            <div key={svc.id} id={svc.id} className="scroll-mt-32 grid md:grid-cols-2 gap-12 items-center">
              <div className={`order-2 ${index % 2 !== 0 ? 'md:order-1' : 'md:order-2'}`}>
                <h2 className="text-3xl font-bold mb-4">{svc.title}</h2>
                <p className="text-[var(--slate)] text-lg leading-relaxed mb-6">
                  {svc.desc}
                </p>
                <div className="bg-[var(--plaster)] p-4 rounded-md mb-8 border border-[var(--line)]">
                  <span className="font-semibold text-[var(--ink)] block mb-1">Where it works best:</span>
                  <span className="text-[var(--slate)]">{svc.bestFor}</span>
                </div>
                
                <Link 
                  to={`/contact?service=${svc.id}`}
                  className="inline-flex items-center gap-2 text-[var(--blue)] font-medium hover:underline group"
                >
                  Ask about this
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className={`order-1 ${index % 2 !== 0 ? 'md:order-2' : 'md:order-1'} aspect-[4/3] bg-slate-200 rounded-sm flex items-center justify-center`}>
                <span className="text-[var(--slate)] font-medium text-sm tracking-widest uppercase">Photo: {svc.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
