import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

const SEO = ({ title, description }) => {
  const location = useLocation();

  useEffect(() => {
    // Update Title
    const defaultTitle = 'CoinTasker | Premium Micro-Tasking Platform';
    document.title = title ? `${title} | CoinTasker` : defaultTitle;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionContent = description || "CoinTasker - The premier micro-tasking platform. Earn rewards by completing simple tasks or get work done efficiently.";
    
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descriptionContent;
      document.head.appendChild(meta);
    }

    // Scroll to top on route change (UX improvement)
    window.scrollTo(0, 0);
  }, [title, description, location.pathname]);

  return null;
};

export default SEO;
