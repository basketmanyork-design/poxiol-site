// Code-owned header navigation (conversion-optimized structure).
// Products gives the three first-stage core sports primary visibility.
// "Get Quote" replaces the old "Contact" entry to signal B2B purchase intent.

import {productNavigationEntries} from './site-taxonomy.ts'

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
      ...productNavigationEntries().map((item) => ({label: item.label, href: item.path})),
      { label: 'All Products', href: '/products/' },
    ],
  },
  { label: 'Factory', href: '/factory/' },
  { label: 'Customization', href: '/customization/' },
  { label: 'Quality Control', href: '/quality-control-process/' },
  { label: 'Resources', href: '/resources/' },
];

export const HEADER_CTA = { label: 'Get Quote', href: '/get-quote/' };
