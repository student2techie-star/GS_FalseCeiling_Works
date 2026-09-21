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
        <title>Contact Us | GS False Ceiling</title>
        <meta name="description" content="Get in touch with GS False Ceiling Works for a free site visit and quote." />
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
              <a href="tel:[BUSINESS_PHONE]" className="flex items-center gap-6 group p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-line">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent flex items-center justify-center rounded-full text-white shadow-md group-hover:scale-110 transition-transform shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-1 text-primary">Call Us directly</h3>
                  <p className="text-slate-500 group-hover:text-accent transition-colors font-medium">[BUSINESS_PHONE]</p>
                </div>
              </a>

              <a href="https://wa.me/[WHATSAPP_NUMBER]?text=Hi,%20I'm%20looking%20for%20a%20ceiling%20quote." target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-line">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center rounded-full text-white shadow-md group-hover:scale-110 transition-transform shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-1 text-primary">Chat on WhatsApp</h3>
                  <p className="text-slate-500 group-hover:text-emerald-500 transition-colors font-medium">[WHATSAPP_NUMBER]</p>
                </div>
              </a>

              <a href="mailto:[BUSINESS_EMAIL]" className="flex items-center gap-6 group p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-line">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center rounded-full text-primary shadow-sm group-hover:scale-110 transition-transform shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-1 text-primary">Email Us</h3>
                  <p className="text-slate-500 group-hover:text-accent transition-colors font-medium">[BUSINESS_EMAIL]</p>
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
                    <p className="mt-2 font-medium">Please call us directly at [BUSINESS_PHONE].</p>
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
