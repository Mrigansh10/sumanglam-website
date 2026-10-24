/** Links shared by the homepage hero nav and its slim footer. */
export const homeNav = [
  { label: "Kitchens", href: "/kitchens" },
  { label: "Wardrobes", href: "/wardrobes" },
  { label: "Hardware", href: "/hardware-appliances" },
  { label: "Inspiration", href: "/inspiration" },
  { label: "Contact", href: "/contact" },
];

/** Fuller link list for the site-wide closing section (the footer). */
export const footerNav = [
  ...homeNav.slice(0, 4),
  { label: "Brands", href: "/brands" },
  { label: "Nolte", href: "/nolte" },
  { label: "Mrida", href: "/mrida" },
  { label: "Architects & Designers", href: "/architects-designers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
