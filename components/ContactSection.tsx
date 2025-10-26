"use client";

import { MessageCircle, Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ContactSection = () => {
  return (
    <section className="py-16 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our diamonds or need personalised assistance? We&apos;re here to help.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* WhatsApp Contact */}
            <div className="text-center lg:text-left bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-6">
                <MessageCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Message us on WhatsApp</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                Get instant support and personalised recommendations from our diamond experts.
              </p>
              <Button 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-white w-full lg:w-auto"
                onClick={() => window.open('https://wa.me/1234567890', '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </Button>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg mb-2">Email</p>
                        <p className="text-muted-foreground">hello@mothersaura.co.uk</p>
                        <p className="text-muted-foreground">support@mothersaura.co.uk</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg mb-2">Phone Numbers</p>
                        <p className="text-muted-foreground">+44 20 7123 4567</p>
                        <p className="text-muted-foreground">+44 161 234 5678</p>
                        <p className="text-muted-foreground">+44 121 345 6789</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg mb-2">Address</p>
                        <p className="text-muted-foreground">
                          123 Diamond Lane<br />
                          Hatton Garden<br />
                          London EC1N 8JY<br />
                          United Kingdom
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-semibold mb-4 text-lg">Follow Us</h4>
                  <div className="flex space-x-4">
                    {[
                      { icon: Facebook, href: '#', label: 'Facebook' },
                      { icon: Instagram, href: '#', label: 'Instagram' },
                      { icon: Linkedin, href: '#', label: 'LinkedIn' },
                      { icon: Twitter, href: '#', label: 'Twitter' }
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label={social.label}
                      >
                        <social.icon size={20} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};