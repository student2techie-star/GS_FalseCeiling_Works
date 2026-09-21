import { Helmet } from 'react-helmet-async';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About G S Decors & Enterprises | Mayiladuthurai</title>
        <meta name="description" content="Learn about G S Decors & Enterprises, an established ceiling and interior decoration materials business in Koranad, Mayiladuthurai." />
      </Helmet>

      {/* Hero */}
      <section className="bg-[var(--ink)] text-[var(--paper)] py-20 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About G S Decors & Enterprises</h1>
          <p className="text-lg md:text-xl opacity-80 leading-relaxed">
            G S Decors & Enterprises is an established business based in Koranad, Mayiladuthurai, offering ceiling and interior-decoration materials for residential, commercial and professional requirements. Established in 1996, the business has served customers in the interior and ceiling-materials segment over the years.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          <div>
            <h2 className="text-3xl font-bold mb-6">What We Offer</h2>
            <p className="text-lg text-[var(--slate)] leading-relaxed mb-6">
              We provide an extensive selection of ceiling and interior decoration materials suited for a variety of applications, whether residential or commercial.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Ceiling materials (PVC, Gypsum, Mineral Fibre)',
                'Interior decoration materials',
                'Product enquiries and consultations',
                'Project-related material requirements'
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-[var(--slate)] items-center">
                  <CheckCircle2 className="w-5 h-5 text-[var(--blue)] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--paper)] p-8 border border-[var(--line)] rounded-sm">
            <h2 className="text-2xl font-bold mb-6">Why Customers Contact Us</h2>
            <p className="text-[var(--slate)] leading-relaxed mb-6">
              Our commitment to providing quality interior materials has made us a reliable local choice.
            </p>
            
            <ul className="space-y-4">
              {[
                'Wide range of ceiling-related materials under one roof',
                'Established local business presence in Mayiladuthurai',
                'Dedicated product enquiry support',
                'Convenient phone and WhatsApp communication',
                'Suitable solutions for homeowners, contractors, and professionals'
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-[var(--slate)] items-center">
                  <CheckCircle2 className="w-5 h-5 text-[var(--cove)] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* Service Areas */}
      <section className="py-24 px-6 bg-[var(--paper)] border-t border-[var(--line)]">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Based in Mayiladuthurai</h2>
          <p className="text-lg text-[var(--slate)] leading-relaxed max-w-2xl mx-auto mb-8">
            We are proud to serve customers, contractors, and interior professionals across Mayiladuthurai and surrounding areas.
          </p>
          <div className="inline-flex flex-col items-center justify-center p-8 bg-[var(--plaster)] border border-[var(--line)] rounded-xl">
            <h3 className="font-bold text-xl mb-2 text-[var(--primary)]">G S Decors & Enterprises</h3>
            <p className="text-[var(--slate)] text-center">
              No. 3/74, Main Road, Mungil Thottam,<br />
              Opposite Palpannai, Koranad,<br />
              Mayiladuthurai, Tamil Nadu – 609001
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
