import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import PublicLayout from './site/PublicLayout';
import Home from './site/pages/Home';
const About = lazy(() => import('./site/pages/About'));
const Products = lazy(() => import('./site/pages/Products'));
const Works = lazy(() => import('./site/pages/Works'));
const Services = lazy(() => import('./site/pages/Services'));
const Contact = lazy(() => import('./site/pages/Contact'));
const NotFound = lazy(() => import('./site/pages/NotFound'));

const InvoiceApp = lazy(() => import('./invoice/InvoiceApp'));

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route element={<Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}><Outlet /></Suspense>}>
              <Route path="about" element={<About />} />
              <Route path="products" element={<Products />} />
              <Route path="works" element={<Works />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
          
          <Route 
            path="/admin/*" 
            element={
              <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-[var(--plaster)]">Loading...</div>}>
                <InvoiceApp />
              </Suspense>
            } 
          />
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" />
      </HelmetProvider>
    </ErrorBoundary>
  );
}
