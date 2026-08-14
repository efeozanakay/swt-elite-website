import { BrandMark } from "@/components/BrandMark";

const LINKS = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Fleet", href: "#fleet" },
  { label: "Türkiye", href: "#coverage" },
  { label: "About", href: "#people" },
];

const LEGAL = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark border-t border-ivory/10 bg-charcoal pt-20">
      <div className="edge wrap">
        <BrandMark height={138} />

        <div className="mt-16 grid grid-cols-1 gap-12 border-t border-ivory/10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label="Footer" className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans text-small uppercase tracking-[0.08em] text-ivory/70 transition-colors duration-300 hover:text-ivory"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div>
            <p className="eyebrow mb-4">Partnership Enquiries</p>
            <a
              href="mailto:info@swtelite.com"
              className="font-sans text-body text-ivory/80"
            >
              info@swtelite.com
            </a>
          </div>

          <div>
            <p className="eyebrow mb-4">Location</p>
            <p className="font-sans text-body text-ivory/80">
              Antalya, Türkiye
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4">Operations</p>
            <p className="font-sans text-body text-ivory/80">
              Coordination available 24/7
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-ivory/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-small text-ivory/50">
            © {year} SWT Elite. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-sans text-small text-ivory/50 transition-colors duration-300 hover:text-ivory/80"
              >
                {item.label}
              </a>
            ))}
            <span className="font-sans text-small text-ivory/30">
              Designed by Ozzy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
