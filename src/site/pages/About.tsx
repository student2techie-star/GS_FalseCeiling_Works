import { Helmet } from 'react-helmet-async';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | GS False Ceiling Works</title>
        <meta name="description" content="Learn about GS False Ceiling Works, our materials, and how we operate in [SERVICE_AREAS]." />
      </Helmet>

      {/* Hero */}
      <section className="bg-[var(--ink)] text-[var(--paper)] py-20 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About Us</h1>
          <p className="text-lg md:text-xl opacity-80 leading-relaxed">
            We are dedicated to providing high-quality false ceiling and interior finishing solutions. 
            With [YEARS_IN_BUSINESS] years of experience, we bring precision and care to every project.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Approach</h2>
            <p className="text-lg text-[var(--slate)] leading-relaxed mb-6">
              A ceiling is more than just a cover—it defines the lighting, acoustics, and aesthetic of a room. 
              Our team focuses on clean lines, proper levelling, and secure framing to ensure that your ceiling 
              looks flawless and lasts for years.
            </p>
            <p className="text-lg text-[var(--slate)] leading-relaxed mb-8">
              We manage the process from the initial site measurement to the final coat of paint, keeping the 
              site organized and communicating clearly throughout the project.
            </p>

            <h3 className="text-xl font-bold mb-4">What to expect</h3>
            <ul className="space-y-3">
              {[
                'Transparent, room-wise quotations without hidden costs.',
                'Skilled craftsmen specializing in modern ceiling techniques.',
                'Adherence to project timelines.',
                'Clean and respectful work practices on site.'
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-[var(--slate)]">
                  <CheckCircle2 className="w-6 h-6 text-[var(--blue)] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--paper)] p-8 border border-[var(--line)] rounded-sm">
            <h2 className="text-2xl font-bold mb-6">Materials & Finishes</h2>
            <p className="text-[var(--slate)] leading-relaxed mb-6">
              The quality of a false ceiling depends entirely on the materials behind it. We use standardized 
              metal framing and premium boards to prevent sagging and cracking.
            </p>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-[var(--ink)] mb-1">Gypsum Boards</h4>
                <p className="text-sm text-[var(--slate)]">Standard and moisture-resistant boards from trusted brands, finished with jointing compound for a seamless look.</p>
              </div>
              <div>
                <h4 className="font-bold text-[var(--ink)] mb-1">Grid Systems</h4>
                <p className="text-sm text-[var(--slate)]">Durable T-grid frameworks with acoustic or mineral fiber tiles for commercial spaces.</p>
              </div>
              <div>
                <h4 className="font-bold text-[var(--ink)] mb-1">Lighting Integration</h4>
                <p className="text-sm text-[var(--slate)]">Precision cutouts for downlights and custom ledges for ambient cove lighting.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Service Areas */}
      <section className="py-24 px-6 bg-[var(--paper)] border-t border-[var(--line)]">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Service Areas</h2>
          <p className="text-lg text-[var(--slate)] leading-relaxed max-w-2xl mx-auto">
            We are based in India and actively take on residential and commercial projects across:
          </p>
          <div className="mt-8 p-6 bg-[var(--plaster)] border border-[var(--line)] rounded-md inline-block">
            <p className="font-medium text-lg">[SERVICE_AREAS]</p>
          </div>
        </div>
      </section>
    </>
  );
}
