import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import PublicLayout from './site/PublicLayout';
import Home from './site/pages/Home';
import About from './site/pages/About';
import Works from './site/pages/Works';
import Services from './site/pages/Services';
import Contact from './site/pages/Contact';
import NotFound from './site/pages/NotFound';

const InvoiceApp = lazy(() => import('./invoice/InvoiceApp'));

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="works" element={<Works />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          
          <Route 
            path="/invoice/*" 
            element={
              <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-[var(--plaster)]">Loading...</div>}>
                <InvoiceApp />
              </Suspense>
            } 
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
