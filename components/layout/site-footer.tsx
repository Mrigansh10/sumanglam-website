import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Stagger } from "@/components/motion/stagger";
import { navigation, siteConfig } from "@/lib/site";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-luxe text-background/50">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-background/80 transition-colors hover:text-background"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-background">
      <Container size="wide" className="py-16 sm:py-20">
        <Stagger className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5" y={20} each={0.08}>
          <div className="lg:col-span-2">
            <p className="font-display text-2xl">{siteConfig.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-background/70">
              A premium showroom for modular kitchens, wardrobes, hardware, and
              appliances — where homes are designed, not just furnished.
            </p>
            <div className="mt-6 space-y-1.5 text-sm text-background/70">
              <p>{siteConfig.contact.address}</p>
              <p>{siteConfig.contact.hours}</p>
              <p>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-background"
                >
                  {siteConfig.contact.phone}
                </a>
                {" · "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors hover:text-background"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
            </div>
          </div>
          <FooterColumn title="Explore" links={navigation.footer.explore} />
          <FooterColumn title="Solutions" links={navigation.footer.solutions} />
          <FooterColumn title="Company" links={navigation.footer.company} />
        </Stagger>
        <div className="mt-14 flex flex-col gap-2 border-t border-background/15 pt-6 text-xs text-background/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Kitchens by Nolte & Mrida · Wardrobes by Mrida</p>
        </div>
      </Container>
    </footer>
  );
}
