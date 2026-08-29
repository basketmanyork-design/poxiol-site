import {SPORT_CATEGORIES, WEARING_SCENARIOS} from './product-taxonomy.ts'

// Code-owned header navigation (conversion-optimized structure).
// Products mirrors the approved sport + wearing-scenario taxonomy so the
// header cannot drift back to a partial category list.

export type NavChild = { label: string; href: string };

export type NavGroup = {
  label: string;
  href: string;
  items: NavChild[];
  columns?: 1 | 2;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
  groups?: NavGroup[];
};

const sportNavigationItems: NavChild[] = SPORT_CATEGORIES.map((sport) => ({
  label: sport.label,
  href: sport.contentStage === 'deep-page' ? sport.href : `/products/#sport-${sport.id}`,
}));

const scenarioNavigationItems: NavChild[] = WEARING_SCENARIOS.map((scenario) => ({
  label: scenario.label,
  href: `/products/#scenario-${scenario.id}`,
}));

export const HEADER_NAV: NavItem[] = [
  {
    label: 'Products',
    href: '/products/',
    groups: [
      {
        label: 'Explore',
        href: '/products/',
        items: [{label: 'All Products', href: '/products/'}],
      },
      {
        label: 'Browse by Sport',
        href: '/products/#sports',
        items: sportNavigationItems,
        columns: 2,
      },
      {
        label: 'Browse by Wearing Scenario',
        href: '/products/#scenarios',
        items: scenarioNavigationItems,
      },
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
