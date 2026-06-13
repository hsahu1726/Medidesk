import { Mail, Phone, Twitter } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Press', href: '#press' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'Disclaimer', href: '#disclaimer' }
    ],
    support: [
      { label: 'Help Center', href: '#help' },
      { label: 'Contact Support', href: '#support' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Feedback', href: '#feedback' }
    ]
  };

  return (
    <footer id="footer" className="bg-foreground text-background border-t border-border">
      <div className="container mx-auto px-4 py-16">
        {/* Footer Top */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="font-bold text-lg text-primary">M</span>
              </div>
              <h3 className="text-xl font-bold">MediDesk</h3>
            </div>
            <p className="text-background/70 text-sm mb-6">
              Your AI-powered medicine assistant for better health management.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:shouryapratap6081@gmail.com" className="text-background/70 hover:text-primary transition-all duration-300 hover:scale-125 hover:translate-y-[-2px] animate-menu-item inline-block">
                <Mail className="w-5 h-5" />
              </a>
              <a href="tel:+917878419251" className="text-background/70 hover:text-primary transition-all duration-300 hover:scale-125 hover:translate-y-[-2px] animate-menu-item inline-block">
                <Phone className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/iamyashmittal" target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-primary transition-all duration-300 hover:scale-125 hover:translate-y-[-2px] animate-menu-item inline-block">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-background/70 hover:text-primary transition-all duration-300 hover:translate-x-1 text-sm inline-block animate-menu-item">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-background/70 hover:text-primary transition-all duration-300 hover:translate-x-1 text-sm inline-block animate-menu-item">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-background/70 hover:text-primary transition-all duration-300 hover:translate-x-1 text-sm inline-block animate-menu-item">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/60 text-sm">
              © 2025 MediDesk. All rights reserved. Built with care for your health.
            </p>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="text-background/60 hover:text-primary transition-all duration-300 hover:translate-x-1 text-sm animate-menu-item inline-block">
                Privacy
              </a>
              <a href="#terms" className="text-background/60 hover:text-primary transition-all duration-300 hover:translate-x-1 text-sm animate-menu-item inline-block">
                Terms
              </a>
              <a href="#sitemap" className="text-background/60 hover:text-primary transition-all duration-300 hover:translate-x-1 text-sm animate-menu-item inline-block">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
