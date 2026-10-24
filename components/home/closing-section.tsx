import Link from "next/link";
import { homeNav } from "@/components/home/home-nav";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Closing block of the homepage, doubling as its footer: visit details, the two
 * ways to act, and the page links. Inverse colours (charcoal in light mode,
 * ivory in dark) so it reads as the end. Target of the hero's "Visit the showroom".
 */
export function ClosingSection() {
  const { contact } = siteConfig;
  const facts = [
    { label: "Showroom", value: contact.address },
    { label: "Open", value: `${contact.hours}\n${contact.hoursClosed}` },
    { label: "Call", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  ];
  const button =
    "group inline-flex shrink-0 overflow-hidden whitespace-nowrap rounded-lg text-[15px] font-medium leading-none";
  const arrow =
    "grid w-[46px] place-items-center bg-accent text-background transition-[width] duration-300 group-hover:w-[52px]";

  return (
    <footer
      id="visit"
      aria-labelledby="visit-heading"
      className="mt-[140px] scroll-mt-16 overflow-hidden bg-fg font-tight text-page"
    >
      <div className="px-[22px] pb-10 pt-20 lg:px-10 lg:pb-12 lg:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <h2
            id="visit-heading"
            className="text-[clamp(44px,7vw,112px)] font-medium leading-[0.95] tracking-[-0.045em]"
          >
            See it in person.
          </h2>
          <div className="flex flex-wrap gap-3.5">
            <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className={button}>
              <span className="bg-page px-[18px] py-[15px] text-fg">Get directions</span>
              <span aria-hidden className={arrow}>
                ↗
              </span>
            </a>
            <Link href="/book-consultation" className={cn(button, "ring-1 ring-inset ring-page/25")}>
              <span className="px-[18px] py-[15px]">Book a consultation</span>
              <span aria-hidden className={arrow}>
                →
              </span>
            </Link>
          </div>
        </div>

        <dl className="mt-16 grid gap-y-7 border-t border-page/15 pt-8 text-[15px] leading-[1.45] sm:grid-cols-2 sm:gap-x-8 lg:mt-20 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="mb-1 text-[13px] text-page/55">{fact.label}</dt>
              <dd className="max-w-[30ch] whitespace-pre-line">
                {fact.href ? (
                  <a href={fact.href} className="underline-offset-4 hover:underline">
                    {fact.value}
                  </a>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 flex flex-wrap justify-between gap-x-8 gap-y-4 border-t border-page/15 pt-6 text-[13px] text-page/55">
          <nav aria-label="Footer" className="flex flex-wrap gap-5">
            {homeNav.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-page">
                {item.label}
              </Link>
            ))}
          </nav>
          <span>
            © {new Date().getFullYear()} {siteConfig.name}, Jaipur
          </span>
        </div>
      </div>
    </footer>
  );
}
