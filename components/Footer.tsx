import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
  const footerLinks = {
    'Contact Us': [
      { name: 'admintejas@mothersauradiamonds.com', href: 'mailto:admintejas@mothersauradiamonds.com'},
      { name: '+91 86575 85167', href: 'tel:+918657585167' }
    ],
    'Information': [
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'About Us', href: '/about' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Contact Us', href: '/contact' }
    ],
    'Links': [
      { name: 'Diamond Education', href: '/diamond-education' },
      { name: 'Ring Sizing Guide', href: '/sizing-guide' },
      { name: 'Care Instructions', href: '/care' },
      { name: 'Certification', href: '/certification' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/mothersaura', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/mothers_aura?igsh=MWhydGR5dHZxaXRsdw%3D%3D&utm_source=qr', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/in/mother-s-aura-6991a7395', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://x.com/MOTHERSAURA007', label: 'Twitter' }
  ];

  return (
    <footer className="text-white" style={{ backgroundColor: '#112158' }}>
      <div className="container mx-auto px-4 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-[#112158] rotate-45"></div>
              </div>
              <span className="text-xl font-bold">Mothers Aura</span>
            </div>
            <blockquote className="text-white/80 italic leading-relaxed">
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
                      className="text-white/80 hover:text-white transition-colors"
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
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm">
              © 2025 Mothers Aura. All rights reserved.
            </p>
            <p className="text-white/60 text-xs mt-4 md:mt-0">
            Designed with love by krishna
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};