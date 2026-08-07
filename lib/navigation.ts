// Code-owned header navigation (conversion-optimized structure).
// Products expands to the four priority categories on desktop and mobile.
// "Get Quote" replaces the old "Contact" entry to signal B2B purchase intent.

export type NavChild = { label: string; href: string };

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const HEADER_NAV: NavItem[] = [
  {
    label: 'Products',
    href: '/products/',
    children: [
      { label: 'Basketball Uniforms', href: '/products/basketball-uniforms/' },
      { label: 'Soccer Kits', href: '/products/soccer-jerseys/' },
      { label: 'Training Wear', href: '/products/training-wear/' },
      { label: 'OEM Sportswear', href: '/oem-odm/' },
    ],
  },
  { label: 'Factory', href: '/factory/' },
  { label: 'Customization', href: '/customization/' },
  { label: 'Quality Control', href: '/quality-control-process/' },
  { label: 'Resources', href: '/resources/' },
];

export const HEADER_CTA = { label: 'Get Quote', href: '/get-quote/' };
