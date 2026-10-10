import { Helmet } from 'react-helmet-async';
import defaultOgImage from '../assets/False_ceiling_outputs/designer-false-ceilings-ideas-21.jpeg';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: string;
  children?: React.ReactNode;
}

export default function SEO({ 
  title, 
  description, 
  keywords, 
  url = "https://gsdecors.com", 
  image,
  type = "website",
  children 
}: SEOProps) {
  
  // Ensure we provide an absolute URL for Open Graph images
  const ogImageUrl = image || `https://gsdecors.com${defaultOgImage}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImageUrl} />

      {/* Global GEO Indexing Tags */}
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Mayiladuthurai" />
      <meta name="geo.position" content="11.101734;79.675973" />
      <meta name="ICBM" content="11.101734, 79.675973" />

      {/* Global LocalBusiness Schema */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "G S Decors & Enterprises",
            "image": "${ogImageUrl}",
            "@id": "${url}",
            "url": "${url}",
            "telephone": "+917826089418",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "No. 3/74, Main Road, Mungil Thottam, Opposite to Mayiladuthurai District Collectorate",
              "addressLocality": "Mayiladuthurai",
              "addressRegion": "Tamil Nadu",
              "postalCode": "609001",
              "addressCountry": "IN"
            }
          }
        `}
      </script>

      {children}
    </Helmet>
  );
}
