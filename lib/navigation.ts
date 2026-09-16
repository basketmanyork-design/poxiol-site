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
  { label: 'Who We Help', href: '/#who-we-help', children: [
    {label: 'Private Label Teamwear', href: '/private-label-teamwear/'},
    {label: 'OEM / ODM', href: '/oem-odm/'},
    {label: 'Sample Order', href: '/sample-order/'},
  ]},
  { label: 'Customization', href: '/customization/', children: [
    {label: 'Customization Options', href: '/customization/'},
    {label: 'Fabric Guide', href: '/fabric-guide/'},
    {label: 'Free Mockup', href: '/free-mockup/'},
  ]},
  { label: 'Our Factory', href: '/factory/', children: [
    {label: 'Factory', href: '/factory/'},
    {label: 'Quality Control Process', href: '/quality-control-process/'},
    {label: 'Shipping & After-Sales', href: '/shipping-after-sales/'},
    {label: 'About POXIOL', href: '/about/'},
  ]},
  { label: 'Resources', href: '/resources/' },
];

export const HEADER_CTA = { label: 'Tell Us About Your Project', href: '/get-quote/' };
