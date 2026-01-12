import { Link } from 'react-router-dom';
import { Sparkles, Linkedin, Twitter, Github, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', to: '/#features' },
      { label: 'For Companies', to: '/company/login' },
      { label: 'For Job Seekers', to: '/user/login' },
    ],
    company: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Careers', to: '/about' },
    ],
    support: [
      { label: 'Help Center', to: '/contact' },
      { label: 'Privacy Policy', to: '/about' },
      { label: 'Terms of Service', to: '/about' },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xl font-display font-bold">
                AIMatch
              </span>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Revolutionizing recruitment with AI-powered resume matching and ATS scoring. Find the perfect match faster.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center transition-colors hover:bg-primary-foreground/20"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} AIMatch. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm">
            Made with ❤️ for better hiring
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
