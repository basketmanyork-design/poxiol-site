// Code-owned header navigation (conversion-optimized structure).
// Products gives the three first-stage core sports primary visibility.
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
      { label: 'Soccer Jerseys', href: '/products/soccer-jerseys/' },
      { label: 'Baseball & Softball Uniforms', href: '/custom-baseball-softball-uniforms/' },
      { label: 'All Products', href: '/products/' },
    ],
  },
  { label: 'Solutions', href: '/private-label-teamwear/', children: [
    {label: 'Private Label Teamwear', href: '/private-label-teamwear/'},
    {label: 'OEM / ODM', href: '/oem-odm/'},
    {label: 'Sample Order', href: '/sample-order/'},
  ]},
  { label: 'Why POXIOL', href: '/customization/', children: [
    {label: 'Customization', href: '/customization/'},
    {label: 'Quality Control Process', href: '/quality-control-process/'},
    {label: 'Fabric Guide', href: '/fabric-guide/'},
    {label: 'Shipping & After-Sales', href: '/shipping-after-sales/'},
  ]},
  { label: 'Resources', href: '/resources/' },
  { label: 'About POXIOL', href: '/about/', children: [
    {label: 'About POXIOL', href: '/about/'},
    {label: 'Factory', href: '/factory/'},
    {label: 'Contact', href: '/contact/'},
  ]},
];

export const HEADER_CTA = { label: 'Get Quote', href: '/get-quote/' };
