
import { useEffect } from 'react';
import { getSEOConfig } from '@/config/seo';

export const useSEO = (section: string) => {
  useEffect(() => {
    const config = getSEOConfig(section);
    
    // Update document title
    document.title = config.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', config.description);
    }
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', config.keywords);
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', config.title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', config.description);
    }
    
    // Add schema markup
    if (config.schema) {
      const existingSchema = document.getElementById('dynamic-schema');
      if (existingSchema) {
        existingSchema.remove();
      }
      
      const script = document.createElement('script');
      script.id = 'dynamic-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(config.schema);
      document.head.appendChild(script);
    }
    
    // Track page view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: config.title,
        page_path: `/${section}`,
      });
    }
  }, [section]);
  
  return getSEOConfig(section);
};
