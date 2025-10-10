import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
  const footerLinks = {
    'Contact Us': [
      { name: 'hello@mothersaura.co.uk', href: 'mailto:hello@mothersaura.co.uk' },
      { name: '123 Diamond Lane, London', href: '#' }
    ],
    'Information': [
      { name: 'Terms & Conditions', href: '#' },
      { name: 'About Us', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Contact Us', href: '#' }
    ],
    'Links': [
      { name: 'Diamond Education', href: '#' },
      { name: 'Ring Sizing Guide', href: '#' },
      { name: 'Care Instructions', href: '#' },
      { name: 'Certification', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-primary-foreground rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary rotate-45"></div>
              </div>
              <span className="text-xl font-bold">Mothers Aura</span>
            </div>
            <blockquote className="text-primary-foreground/80 italic leading-relaxed">
              &ldquo;Every diamond tells a story of time, pressure, and beauty. 
              We&apos;re here to help you find the perfect chapter for yours.&rdquo;
            </blockquote>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-6 text-lg">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-6 text-lg">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/80 text-sm">
              © 2025 Mothers Aura. All rights reserved.
            </p>
            <p className="text-primary-foreground/60 text-xs mt-4 md:mt-0">
            Designed with love by krishna
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};