import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: Record<string, any>;
}

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title.includes('Nathan Relógios')
      ? title
      : `${title} | Nathan Relógios & Joias`;
    document.title = formattedTitle;

    // Helper to set or create meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Helper to set or create link tags (e.g., canonical link)
    const setLinkTag = (rel: string, href: string) => {
      let tag = document.querySelector(`link[rel="${rel}"]`);
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', rel);
        document.head.appendChild(tag);
      }
      tag.setAttribute('href', href);
    };

    // 2. Set Meta Description & Keywords
    setMetaTag('description', description);
    
    const defaultKeywords = 'citizen, aqualand, meialua, luacheia, 3020, aquamont, aqua, 3740, relogiodemergulho, professionaldivers, EcoDrive, CitizenEcoDrive, RelogioEsportivo, EstiloMasculino, AcessoriosMasculinos, RelogioAnalogico, DesignAtemporal, RelogioDiver, Precisao, QualidadePremium, nathan relogios';
    setMetaTag('keywords', keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords);

    // 3. Open Graph Tags
    const currentUrl = url || window.location.href;
    const defaultImage = `${window.location.origin}/og-image.png`;
    const currentImage = image || defaultImage;

    setMetaTag('og:type', type, true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:title', formattedTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', currentImage, true);

    // 4. Twitter Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:url', currentUrl);
    setMetaTag('twitter:title', formattedTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', currentImage);

    // 5. Canonical Link
    setLinkTag('canonical', currentUrl);

    // 6. JSON-LD Structured Data
    let schemaScript = document.getElementById('json-ld-schema') as HTMLScriptElement | null;
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'json-ld-schema';
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else {
      if (schemaScript) {
        schemaScript.remove();
      }
    }

    // Cleanup page-specific JSON-LD schema when this component unmounts
    return () => {
      const activeSchema = document.getElementById('json-ld-schema');
      if (activeSchema) {
        activeSchema.remove();
      }
    };
  }, [title, description, keywords, image, url, type, schema]);

  return null;
}
