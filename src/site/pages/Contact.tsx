import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, MessageCircle, Mail, CheckCircle2 } from 'lucide-react';
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
        <title>Contact G S Decors & Enterprises | Mayiladuthurai</title>
        <meta name="description" content="Contact G S Decors & Enterprises in Koranad, Mayiladuthurai for ceiling and interior decoration product enquiries." />
      </Helmet>

      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 z-0" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 z-0" />
        
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 relative z-10">
          
          {/* Contact Details */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Let's Connect
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 text-primary">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-slate-500 mb-12 max-w-md font-body leading-relaxed">
              Have a premium project in mind? Reach out to us for a personalized consultation and estimate. 
              We're ready to bring your vision to life.
            </p>

            <div className="space-y-6">
              <a href="tel:+919159523147" className="flex items-center gap-6 group p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-line">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent flex items-center justify-center rounded-full text-white shadow-md group-hover:scale-110 transition-transform shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-1 text-primary">Call Now</h3>
                  <p className="text-slate-500 group-hover:text-accent transition-colors font-medium">+91 91595 23147</p>
                </div>
              </a>

              <a href="https://wa.me/919159523147?text=Hello%20G%20S%20Decors%20%26%20Enterprises%2C%20I%20would%20like%20to%20know%20more%20about%20your%20ceiling%20and%20interior%20decoration%20products." target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-line">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center rounded-full text-white shadow-md group-hover:scale-110 transition-transform shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-1 text-primary">WhatsApp Us</h3>
                  <p className="text-slate-500 group-hover:text-emerald-500 transition-colors font-medium">+91 91595 23147</p>
                </div>
              </a>

              <a href="https://maps.google.com/?q=G+S+Decors+%26+Enterprises,+Koranad,+Mayiladuthurai,+Tamil+Nadu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-line">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center rounded-full text-white shadow-sm group-hover:scale-110 transition-transform shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-1 text-primary">Get Directions</h3>
                  <p className="text-slate-500 group-hover:text-accent transition-colors text-sm">
                    No. 3/74, Main Road, Mungil Thottam,<br/>Opposite Palpannai, Koranad
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="glass rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-fit relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent" />
            
            <h2 className="text-3xl font-heading font-bold mb-8 text-primary">Send an Enquiry</h2>
            
            {isSuccess ? (
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center animate-fade-in">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-emerald-900 mb-3">Message Received</h3>
                <p className="text-emerald-700 mb-8 font-medium">Thank you for reaching out. We will contact you shortly.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-8 py-3 bg-white text-emerald-700 border border-emerald-200 rounded-full font-bold hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {errorMsg && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-sm animate-fade-in">
                    {errorMsg}
                    <p className="mt-2 font-medium">Please call us directly at +91 91595 23147.</p>
                  </div>
                )}

                {/* Honeypot field - hidden from users */}
                <div className="hidden absolute opacity-0 pointer-events-none" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input type="text" id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Your Name *</label>
                  <input 
                    type="text" 
                    id="name"
                    className="w-full border-0 bg-slate-100/50 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all shadow-inner"
                    placeholder="John Doe"
                    {...register('name')}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-2 font-medium">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="phone"
                    className="w-full border-0 bg-slate-100/50 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all shadow-inner"
                    placeholder="Your contact number"
                    {...register('phone')}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-2 font-medium">{errors.phone.message}</p>}
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-bold text-slate-700 mb-2">Service of Interest</label>
                  <select 
                    id="service"
                    className="w-full border-0 bg-slate-100/50 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all shadow-inner appearance-none cursor-pointer"
                    {...register('service')}
                  >
                    <option value="">Select a service (Optional)</option>
                    <option value="pvc-false-ceiling">PVC False Ceiling</option>
                    <option value="gypsum-ceiling">Gypsum Ceiling Boards</option>
                    <option value="armstrong-ceiling">Armstrong Ceiling Systems</option>
                    <option value="mineral-fibre-ceiling">Mineral Fibre Ceiling</option>
                    <option value="interior-materials">Interior Decoration Materials</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Project Details</label>
                  <textarea 
                    id="message"
                    rows={4}
                    className="w-full border-0 bg-slate-100/50 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all shadow-inner resize-y"
                    placeholder="Tell us a bit about your space or requirements..."
                    {...register('message')}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-2 font-medium">{errors.message.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-accent/30 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none flex justify-center items-center gap-2"
                >
                  {isSubmitting ? 'Sending Request...' : 'Send Enquiry Request'}
                </button>

              </form>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
