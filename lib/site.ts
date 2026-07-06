import { clientEnv } from "@/lib/env";

/**
 * Central site configuration. Business details marked [PLACEHOLDER] must be
 * confirmed before launch — see project-vault/15_Open_Questions.md.
 */
export const siteConfig = {
  name: "Sumanglam",
  tagline: "Designed Around Your Home",
  description:
    "Premium modular kitchen showroom in Jaipur — German kitchens by Nolte, personalized luxury kitchens by Mrida, plus wardrobes, branded hardware, and built-in appliances. Visit the showroom at New Aatish Market.",
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  // TEMPORARY OG image (1200×630 crop of the homepage sage-green hero render,
  // pre-warmed on Cloudinary). Replace with a curated asset when the new render
  // batch arrives — swap the URL here, nothing else references it.
  ogImage:
    "https://res.cloudinary.com/de9turgsy/image/upload/if_w_lt_2000_and_h_lt_2000/e_gen_restore/e_upscale/if_end/f_jpg,q_auto:good,w_1200,h_630,c_fill,g_auto/sumanglam/inspirations/sage-green-classic-kitchen-1",
  contact: {
    phone: clientEnv.NEXT_PUBLIC_CONTACT_PHONE || "+91 94140 78298",
    phoneSecondary: "+91 96940 99093",
    email: clientEnv.NEXT_PUBLIC_CONTACT_EMAIL || "inquiries@sumanglam.co",
    whatsappNumber: clientEnv.NEXT_PUBLIC_WHATSAPP_NUMBER || "919694099093",
    address: "S-13, New Aatish Market, Devi Nagar, Jaipur, Rajasthan 302019",
    addressShort: "S-13, New Aatish Market, Jaipur",
    mapsUrl: "https://maps.app.goo.gl/mkgkSVioTnZftXRU6",
    googleReviewUrl: "https://share.google/G7s64ZUGEhSvjXlG0",
    mapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.765097726519!2d75.7584208!3d26.8792033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db457e77f7c4f%3A0xe14b0ebfccecb10a!2sSumanglam!5e0!3m2!1sen!2sin",
    hours: "Mon–Sat, 10:30 AM – 8:00 PM",
    hoursClosed: "Closed on Sundays",
  },
} as const;

export const navigation = {
  main: [
    { label: "Kitchens", href: "/kitchens" },
    { label: "Inspiration", href: "/inspiration" },
    { label: "Hardware", href: "/hardware-appliances" },
    { label: "Brands", href: "/brands" },
    { label: "Architects & Designers", href: "/architects-designers" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footer: {
    explore: [
      { label: "Kitchens", href: "/kitchens" },
      { label: "Inspiration", href: "/inspiration" },
      { label: "Hardware", href: "/hardware-appliances" },
      { label: "Brands", href: "/brands" },
    ],
    solutions: [
      { label: "Nolte Kitchens", href: "/nolte" },
      { label: "Mrida", href: "/mrida" },
      { label: "Mrida Wardrobes", href: "/wardrobes" },
      { label: "Architects & Designers", href: "/architects-designers" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Book Consultation", href: "/book-consultation" },
    ],
  },
} as const;
