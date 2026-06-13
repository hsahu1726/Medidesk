import { Mail, Phone, Twitter } from "lucide-react";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "MediSnap", href: "#medisnap" },
  { label: "Prescription Reader", href: "#prescription" },
  { label: "Contact", href: "#contact" },
  { label: "Disclaimer", href: "#disclaimer" },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-foreground text-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="font-bold text-lg text-primary">M</span>
              </div>
              <h3 className="text-xl font-bold">MediDesk</h3>
            </div>
            <p className="text-background/70 text-sm">
              AI-assisted medicine information for educational use. Always
              verify results with a doctor or pharmacist.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="mailto:shouryapratap6081@gmail.com"
              aria-label="Email MediDesk"
              className="text-background/70 hover:text-primary transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="tel:+917878419251"
              aria-label="Call MediDesk"
              className="text-background/70 hover:text-primary transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/iamyashmittal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="MediDesk on Twitter"
              className="text-background/70 hover:text-primary transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6">
          <p className="text-background/60 text-sm">
            © {new Date().getFullYear()} MediDesk. Educational information
            only.
          </p>
        </div>
      </div>
    </footer>
  );
}
