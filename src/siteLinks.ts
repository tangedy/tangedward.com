export interface SiteLink {
  href: string;
  label: string;
  external: boolean;
}

/** The "My links" list on the home page, also shown at the foot of the phone menu. */
export const siteLinks: SiteLink[] = [
  { href: 'https://linkedin.com/in/tanged', label: 'linkedin.com/in/tanged', external: true },
  { href: 'https://artstation.com/tangedy', label: 'artstation.com/tangedy', external: true },
  { href: 'mailto:e56tang@uwaterloo.ca', label: 'e56tang@uwaterloo.ca', external: false },
  { href: 'https://github.com/tangedy', label: 'github.com/tangedy', external: true },
];

export const externalLinkProps = (link: SiteLink) => (
  link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
);
