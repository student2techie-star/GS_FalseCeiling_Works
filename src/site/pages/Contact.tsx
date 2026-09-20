import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, MessageCircle, Mail, Clock, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(7, "Please enter a valid phone number").max(20),
  service: z.string().optional(),
  message: z.string().max(1000).optional(),
  // Honeypot field
  website: z.string().max(0, "Invalid field").optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      service: '',
      message: '',
      website: '', // honeypot must be empty
    }
  });

  useEffect(() => {
    // Check for pre-selected service in query params
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      setValue('service', serviceParam);
    }
  }, [location, setValue]);

  const onSubmit = async (data: ContactFormValues) => {
    // Honeypot check
    if (data.website) {
      // Fake success for bots
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        throw new Error("Supabase is not configured yet. Please call us instead.");
      }

      const { error } = await supabase
        .from('enquiries')
        .insert([{
          name: data.name,
          phone: data.phone,
          service: data.service,
          message: data.message
        }]);

      if (error) throw error;

      setIsSuccess(true);
      reset();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | GS False Ceiling</title>
        <meta name="description" content="Get in touch with GS False Ceiling Works for a free site visit and quote." />
      </Helmet>

      <section className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Contact Details */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-lg text-[var(--slate)] mb-12">
              Have a project in mind? Reach out to us for a free consultation and estimate. 
              We'll get back to you as soon as possible.
            </p>

            <div className="space-y-8">
              <a href="tel:[BUSINESS_PHONE]" className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-[var(--plaster)] flex items-center justify-center rounded-full text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Call Us</h3>
                  <p className="text-[var(--slate)] group-hover:text-[var(--blue)] transition-colors">[BUSINESS_PHONE]</p>
                </div>
              </a>

              <a href="https://wa.me/[WHATSAPP_NUMBER]?text=Hi,%20I'm%20looking%20for%20a%20ceiling%20quote." target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-[var(--plaster)] flex items-center justify-center rounded-full text-[var(--ink)] group-hover:bg-[#25D366] group-hover:text-white transition-colors shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">WhatsApp</h3>
                  <p className="text-[var(--slate)] group-hover:text-[#25D366] transition-colors">[WHATSAPP_NUMBER]</p>
                </div>
              </a>

              <a href="mailto:[BUSINESS_EMAIL]" className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-[var(--plaster)] flex items-center justify-center rounded-full text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)] transition-colors shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <p className="text-[var(--slate)] group-hover:text-[var(--blue)] transition-colors">[BUSINESS_EMAIL]</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--plaster)] flex items-center justify-center rounded-full text-[var(--ink)] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Working Hours</h3>
                  <p className="text-[var(--slate)]">[WORKING_HOURS]</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--plaster)] flex items-center justify-center rounded-full text-[var(--ink)] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Office</h3>
                  <p className="text-[var(--slate)]">[ADDRESS]</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="bg-[var(--paper)] p-8 border border-[var(--line)] rounded-sm h-fit">
            <h2 className="text-2xl font-bold mb-6">Send an Enquiry</h2>
            
            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 p-6 rounded-md text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Thanks. We'll call you back soon.</h3>
                <p className="text-green-700 mb-6">Your message has been received.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700 text-sm">
                    {errorMsg}
                    <p className="mt-2 font-medium">Please call us directly at [BUSINESS_PHONE].</p>
                  </div>
                )}

                {/* Honeypot field - hidden from users */}
                <div className="hidden absolute opacity-0 pointer-events-none" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input type="text" id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name *</label>
                  <input 
                    type="text" 
                    id="name"
                    className="w-full border border-[var(--line)] rounded-md px-4 py-3 focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)] transition-all bg-[var(--plaster)]"
                    placeholder="John Doe"
                    {...register('name')}
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="phone"
                    className="w-full border border-[var(--line)] rounded-md px-4 py-3 focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)] transition-all bg-[var(--plaster)]"
                    placeholder="Your contact number"
                    {...register('phone')}
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium mb-2">Service (Optional)</label>
                  <select 
                    id="service"
                    className="w-full border border-[var(--line)] rounded-md px-4 py-3 focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)] transition-all bg-[var(--plaster)] appearance-none"
                    {...register('service')}
                  >
                    <option value="">Select a service</option>
                    <option value="gypsum-false-ceiling">Gypsum False Ceiling</option>
                    <option value="grid-tile-ceiling">Grid / Tile Ceiling</option>
                    <option value="pvc-ceiling">PVC Ceiling</option>
                    <option value="pop-work">POP Work</option>
                    <option value="cove-and-profile-lighting">Cove & Profile Lighting</option>
                    <option value="partitions">Partitions</option>
                    <option value="painting">Painting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message (Optional)</label>
                  <textarea 
                    id="message"
                    rows={4}
                    className="w-full border border-[var(--line)] rounded-md px-4 py-3 focus:outline-none focus:border-[var(--blue)] focus:ring-1 focus:ring-[var(--blue)] transition-all bg-[var(--plaster)] resize-y"
                    placeholder="Tell us a bit about your project or area size..."
                    {...register('message')}
                  />
                  {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[var(--ink)] text-[var(--paper)] py-4 rounded-md font-medium hover:bg-opacity-90 transition-colors disabled:opacity-70 flex justify-center"
                >
                  {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                </button>

              </form>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
