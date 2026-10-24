import Image from "next/image";
import Link from "next/link";
import { resolveImage } from "@/lib/images";
import { siteConfig } from "@/lib/site";
import { ArrowButton } from "@/components/home/arrow-button";
import { HeroMenuButton } from "@/components/home/hero-menu-button";
import { homeNav } from "@/components/home/home-nav";


/**
 * V2 homepage hero: one full-bleed photo, the nav on top of it, and the
 * wordmark set edge to edge along the bottom. The only motion is a one-time
 * entrance on load (photo settles, name rises) — nothing here is tied to
 * scroll. The global floating header stays hidden while this is on screen
 * (see SiteHeader), so this nav is the one people use at the top.
 */
export function HomeHero({ image }: { image: string }) {
  return (
    <section
      // Marks this route as a V2 page so the page ground follows dark mode (globals.css).
      data-v2-page
      className="relative h-[100svh] font-tight"
      // Wordmark sized so "Sumanglam" spans the screen: width minus its side
      // insets, divided by the word's width in ems.
      style={{ ["--mark" as string]: "calc((100vw - 36px) / 4.95)" }}
    >
      <div className="relative h-full overflow-hidden bg-ink">
        <Image
          src={resolveImage(image, { width: 2400, enhance: "render" })}
          // The slot is admin-managed (Admin → Homepage), so the alt stays generic.
          alt="A kitchen at the Sumanglam showroom"
          fill
          priority
          sizes="100vw"
          className="origin-[60%_60%] animate-home-settle object-cover object-[62%_55%]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,16,12,.38),rgba(20,16,12,0)_22%),linear-gradient(to_top,rgba(20,16,12,.55),rgba(20,16,12,0)_42%)]"
        />

        <nav
          aria-label="Primary"
          className="absolute inset-x-[22px] top-[18px] z-10 flex animate-home-drop items-center justify-between text-background"
        >
          <Link href="/" className="text-[17px] font-semibold tracking-[-0.02em]">
            {siteConfig.name}
          </Link>
          <div className="hidden gap-7 text-sm font-medium lg:flex">
            {homeNav.map((item) => (
              <Link key={item.href} href={item.href} className="opacity-90 transition-opacity hover:opacity-100">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ArrowButton href="#visit" tone="light">
              <span className="sm:hidden">Visit us</span>
              <span className="hidden sm:inline">Visit the showroom</span>
            </ArrowButton>
            <HeroMenuButton />
          </div>
        </nav>

        <p className="absolute inset-x-[22px] bottom-[calc(var(--mark)*0.98+26px)] z-10 max-w-[20ch] animate-home-lift text-[clamp(18px,1.7vw,24px)] font-medium leading-[1.15] tracking-[-0.02em] text-balance text-background">
          Designed around your home.
        </p>

        <h1 className="absolute inset-x-[18px] bottom-0 z-10 overflow-hidden whitespace-nowrap pb-[0.16em] text-[length:var(--mark)] font-semibold leading-[0.82] tracking-[-0.045em] text-background">
          <span className="inline-block animate-home-rise">{siteConfig.name}</span>
        </h1>
      </div>
    </section>
  );
}
