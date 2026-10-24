"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowButton, ArrowLink } from "@/components/home/arrow-button";
import { siteConfig } from "@/lib/site";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import { inHomeHero } from "@/components/home/home-hero-zone";

// ── Types ─────────────────────────────────────────────────────────────────────

type NavLink = { label: string; href: string };

export type HeaderBrand = {
  name: string;
  slug: string;
  logo: string | null;
  heroImage: string | null;
};

type MegaPanel =
  | { kind: "columns"; title: string; titleHref: string; sections: { heading?: string; links: NavLink[] }[] }
  | { kind: "split"; title: string; titleHref: string; sections: { heading?: string; links: NavLink[] }[]; cards: { label: string; sub: string; href: string; image: string; slug?: string }[] }
  | { kind: "brands" };

// ── Static nav data ───────────────────────────────────────────────────────────

const primaryNav: { label: string; href: string; mega?: MegaPanel }[] = [
  {
    label: "Kitchens",
    href: "/kitchens",
    mega: {
      kind: "split",
      title: "Kitchens & Appliances",
      titleHref: "/kitchens",
      sections: [
        {
          links: [
            { label: "German Kitchens", href: "/nolte" },
            { label: "Modular Kitchens", href: "/mrida" },
            { label: "Built-in Appliances", href: "/kitchens" },
            { label: "Kitchen Inspirations", href: "/inspiration?space=kitchen" },
          ],
        },
      ],
      cards: [
        { label: "Nolte", sub: "German kitchen systems", href: "/nolte", image: "/images/placeholders/kitchen-1.svg", slug: "nolte" },
        { label: "Mrida Kitchens", sub: "Modular kitchens for Indian homes", href: "/mrida", image: "/images/placeholders/kitchen-2.svg", slug: "mrida" },
      ],
    },
  },
  {
    label: "Inspiration",
    href: "/inspiration",
    mega: {
      kind: "columns",
      title: "Inspiration",
      titleHref: "/inspiration",
      sections: [
        {
          links: [
            { label: "All Inspirations", href: "/inspiration" },
            { label: "Kitchen Ideas", href: "/inspiration?space=kitchen" },
            { label: "Wardrobe Ideas", href: "/inspiration?space=wardrobe" },
          ],
        },
        {
          links: [
            { label: "Hardware Ideas", href: "/inspiration?space=hardware" },
            { label: "Appliance Ideas", href: "/inspiration?space=appliances" },
          ],
        },
      ],
    },
  },
  {
    label: "Wardrobes",
    href: "/wardrobes",
    mega: {
      kind: "split",
      title: "Wardrobes",
      titleHref: "/wardrobes",
      sections: [
        {
          links: [
            { label: "Walk-In Wardrobes", href: "/wardrobes" },
            { label: "Sliding Door Wardrobes", href: "/wardrobes" },
            { label: "Modular Wardrobes", href: "/wardrobes" },
            { label: "About Mrida", href: "/mrida" },
          ],
        },
      ],
      cards: [
        { label: "Mrida Wardrobes", sub: "Storage designed like furniture", href: "/wardrobes", image: "sumanglam/inspirations/ivory-jali-walk-in-3" },
      ],
    },
  },
  {
    label: "Hardware",
    href: "/hardware-appliances",
    mega: {
      kind: "columns",
      title: "Hardware",
      titleHref: "/hardware-appliances",
      sections: [
        {
          heading: "Categories",
          links: [
            { label: "Furniture Fittings", href: "/hardware-appliances" },
            { label: "Handles & Locks", href: "/hardware-appliances" },
            { label: "Sliding Systems", href: "/hardware-appliances" },
            { label: "Kitchen Accessories", href: "/hardware-appliances" },
          ],
        },
        {
          heading: "Brands",
          links: [
            { label: "Hettich", href: "/brands/hettich" },
            { label: "Blum", href: "/brands/blum" },
            { label: "Häfele", href: "/brands/hafele" },
            { label: "Yale", href: "/brands/yale" },
            { label: "Godrej", href: "/brands/godrej" },
          ],
        },
      ],
    },
  },
  {
    label: "Brands",
    href: "/brands",
    mega: { kind: "brands" },
  },
];

const mobileNav: NavLink[] = [
  { label: "Kitchens", href: "/kitchens" },
  { label: "Inspiration", href: "/inspiration" },
  { label: "Wardrobes", href: "/wardrobes" },
  { label: "Hardware", href: "/hardware-appliances" },
  { label: "Brands", href: "/brands" },
  { label: "Architects & Designers", href: "/architects-designers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ── Panel renderers ───────────────────────────────────────────────────────────

function ColumnsPanel({ panel }: { panel: Extract<MegaPanel, { kind: "columns" }> }) {
  return (
    <div className="px-[22px] pb-10 pt-8">
      <Link href={panel.titleHref} className="group inline-flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-[-0.04em] text-fg transition-colors group-hover:text-accent-fg">
          {panel.title}
        </span>
        <span className="text-2xl text-fg/40 transition-colors group-hover:text-accent-fg">→</span>
      </Link>
      <div className="mt-6 flex gap-14">
        {panel.sections.map((section, i) => (
          <div key={i} className="min-w-36">
            {section.heading && (
              <p className="mb-3 text-[13px] text-fg/50">
                {section.heading}
              </p>
            )}
            <ul className="space-y-2.5">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-fg/65 transition-colors hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitPanel({ panel, brands }: { panel: Extract<MegaPanel, { kind: "split" }>; brands: HeaderBrand[] }) {
  const heroBySlug = Object.fromEntries(
    brands.filter((b) => b.heroImage).map((b) => [b.slug, b.heroImage as string]),
  );
  return (
    <div className="px-[22px] pb-10 pt-8">
      <Link href={panel.titleHref} className="group inline-flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-[-0.04em] text-fg transition-colors group-hover:text-accent-fg">
          {panel.title}
        </span>
        <span className="text-2xl text-fg/40 transition-colors group-hover:text-accent-fg">→</span>
      </Link>
      <div className="mt-6 flex gap-10">
        <div className="min-w-44 shrink-0">
          {panel.sections.map((section, i) => (
            <ul key={i} className="space-y-2.5">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-fg/65 transition-colors hover:text-fg">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
        <div className="flex gap-4">
          {panel.cards.map((card) => {
            const hero = card.slug ? heroBySlug[card.slug] : undefined;
            return (
            <Link key={card.href + card.label} href={card.href} className="group w-48 shrink-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-card">
                <Image
                  src={resolveImage(hero ?? card.image, { width: 480, enhance: "render" })}
                  alt={card.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-fg group-hover:text-accent-fg">{card.label}</p>
              <p className="text-xs text-fg/50">{card.sub}</p>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const BRAND_CATEGORIES: { label: string; slugs: string[] }[] = [
  { label: "Kitchens", slugs: ["nolte", "mrida"] },
  { label: "Appliances", slugs: ["bosch", "siemens", "liebherr", "blaupunkt", "hafele"] },
  { label: "Hardware", slugs: ["hettich", "blum", "yale", "spitze", "godrej", "dorset", "brass-barony", "everyday"] },
];

function brandHref(slug: string) {
  if (slug === "nolte") return "/nolte";
  if (slug === "mrida") return "/mrida";
  return `/brands/${slug}`;
}

function BrandsPanel({ brands }: { brands: HeaderBrand[] }) {
  const bySlug = Object.fromEntries(brands.map((b) => [b.slug, b]));

  return (
    <div className="px-[22px] pb-10 pt-8">
      <Link href="/brands" className="group inline-flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-[-0.04em] text-fg transition-colors group-hover:text-accent-fg">
          Brands
        </span>
        <span className="text-2xl text-fg/40 transition-colors group-hover:text-accent-fg">→</span>
      </Link>
      <div className="mt-6 flex gap-12">

      {BRAND_CATEGORIES.map((cat) => {
        const catBrands = cat.slugs.map((s) => bySlug[s]).filter(Boolean);
        if (!catBrands.length) return null;
        return (
          <div key={cat.label} className="min-w-32">
            <p className="mb-4 text-[13px] text-fg/50">{cat.label}</p>
            <div className="flex flex-col gap-3">
              {catBrands.map((brand) => {
                const hasLogo = brand.logo && !brand.logo.startsWith("/");
                return hasLogo ? (
                  <Link key={brand.slug} href={brandHref(brand.slug)} className="group transition-transform duration-200 hover:-translate-y-0.5">
                    {/* White tile so dark logos stay readable on the panel in dark mode. */}
                    <span className="block rounded-md bg-white px-2.5 py-1.5">
                      <span className="relative block h-7 w-28">
                        <Image
                          src={resolveImage(brand.logo, { width: 400 })}
                          alt={brand.name}
                          fill
                          sizes="112px"
                          className="object-contain object-left transition-[filter] duration-200 group-hover:brightness-110"
                        />
                      </span>
                    </span>
                  </Link>
                ) : (
                  <Link key={brand.slug} href={brandHref(brand.slug)} className="text-sm text-fg/65 transition-colors hover:text-fg">
                    {brand.name}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

// ── Main header ───────────────────────────────────────────────────────────────

/** Dispatched on `window` to open the mobile menu from outside the header. */
export const OPEN_SITE_MENU_EVENT = "sumanglam:open-menu";

export function SiteHeader({ brands = [] }: { brands?: HeaderBrand[] }) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [hidden, setHidden] = useState(pathname === "/");
  const [scrolled, setScrolled] = useState(false);

  const overHeaderRef = useRef(false);
  const overPanelRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    // Headroom.js-style: don't hide until user has scrolled past this offset,
    // and require at least `tolerance` px of movement to avoid jitter.
    const OFFSET = 100;
    const TOLERANCE = 5;

    function onScroll() {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      setScrolled(currentY > 24);
      if (inHomeHero(pathname)) {
        setHidden(true);
        setActiveMenu(null);
      } else if (currentY < OFFSET) {
        setHidden(false);
      } else if (delta > TOLERANCE) {
        setHidden(true);
        setActiveMenu(null);
      } else if (delta < -TOLERANCE) {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    function openMenu() {
      setMobileOpen(true);
      setHidden(false);
    }
    window.addEventListener(OPEN_SITE_MENU_EVENT, openMenu);
    return () => window.removeEventListener(OPEN_SITE_MENU_EVENT, openMenu);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveMenu(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function scheduleClose() {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      if (!overHeaderRef.current && !overPanelRef.current) setActiveMenu(null);
    }, 80);
  }

  function cancelClose() {
    clearTimeout(closeTimerRef.current);
  }

  const activeItem = primaryNav.find((item) => item.href === activeMenu);
  const activePanel = activeItem?.mega ?? null;

  return (
    <>
      {/* ── Header (V2: full-width ivory bar, aligned with the homepage hero nav) ── */}
      <motion.div
        className="fixed inset-x-0 top-0 z-50 font-tight"
        animate={{ y: hidden && !mobileOpen ? "-120%" : "0%", opacity: hidden && !mobileOpen ? 0 : 1 }}
        transition={
          hidden && !mobileOpen
            ? { duration: 0.85, ease: [0.65, 0, 0.35, 1] }
            : { duration: 0.4, ease: [0, 0, 0.2, 1] }
        }
      >
        <header
          className="border-b border-card bg-page shadow-[0_8px_24px_rgba(34,29,23,0.06)]"
          onMouseEnter={() => { overHeaderRef.current = true; cancelClose(); }}
          onMouseLeave={() => { overHeaderRef.current = false; scheduleClose(); }}
        >
          <div
            className={cn(
              "flex items-center justify-between gap-6 px-[22px] transition-[height] duration-300 ease-out",
              scrolled ? "h-14" : "h-16",
            )}
          >
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 text-[17px] font-semibold tracking-[-0.02em] text-fg"
              aria-label={`${siteConfig.name} — home`}
            >
              {siteConfig.name}
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
              {primaryNav.map((item) => {
                const isActive = pathname.startsWith(item.href) && item.href !== "/";
                const isOpen = activeMenu === item.href;
                return (
                  <div
                    key={item.href}
                    onMouseEnter={() => {
                      if (item.mega) setActiveMenu(item.href);
                      else setActiveMenu(null);
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative px-3 py-2 text-sm font-medium transition-colors",
                        isActive || isOpen ? "text-fg" : "text-fg/65 hover:text-fg",
                      )}
                    >
                      {item.label}
                      {(isActive || isOpen) && (
                        <span className="absolute inset-x-3 bottom-0 h-px bg-accent" />
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2.5">
              <ArrowButton href={pathname === "/" ? "#visit" : "/contact"}>
                <span className="sm:hidden">Visit us</span>
                <span className="hidden sm:inline">Visit the showroom</span>
              </ArrowButton>
              <button
                type="button"
                onClick={() => { setMobileOpen((v) => !v); setHidden(false); }}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="flex size-[38px] items-center justify-center rounded-lg text-fg transition-colors hover:bg-card lg:hidden"
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* ── Mega-menu panel ── */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              className="absolute inset-x-0 top-full"
              initial={{ opacity: 0, y: -8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => { overPanelRef.current = true; cancelClose(); }}
              onMouseLeave={() => { overPanelRef.current = false; scheduleClose(); }}
            >
              <div className="border-b border-card bg-page shadow-[0_24px_48px_rgba(34,29,23,0.10)]">
                {activePanel.kind === "columns" && <ColumnsPanel panel={activePanel} />}
                {activePanel.kind === "split" && <SplitPanel panel={activePanel} brands={brands} />}
                {activePanel.kind === "brands" && <BrandsPanel brands={brands} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-x-0 bottom-0 top-0 z-[45] overflow-y-auto bg-page pt-24 font-tight">
          <nav
            aria-label="Full menu"
            className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-5 py-8 sm:px-8"
          >
            {mobileNav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b border-fg/10 py-4 text-[30px] font-semibold leading-none tracking-[-0.04em] text-fg transition-colors hover:text-accent-fg sm:text-4xl",
                  pathname.startsWith(item.href) && item.href !== "/" && "text-accent-fg",
                )}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ArrowButton href="/book-consultation" size="lg">Book a consultation</ArrowButton>
              <ArrowLink href="/contact">Visit the showroom</ArrowLink>
            </div>
            <p className="mt-8 text-sm text-fg/60">
              {siteConfig.contact.hours} · {siteConfig.contact.phone}
            </p>
          </nav>
        </div>
      )}
    </>
  );
}
