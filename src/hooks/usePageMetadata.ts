import { useEffect } from 'react';

const SITE_URL = 'https://tangedward.com';

export const usePageMetadata = (title: string, description: string, path: string) => {
  useEffect(() => {
    document.title = title;

    const setMetaContent = (selector: string, content: string) => {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
    };

    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', `${SITE_URL}${path}`);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);

    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute('href', `${SITE_URL}${path}`);
  }, [description, path, title]);
};