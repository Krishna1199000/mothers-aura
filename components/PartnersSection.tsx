"use client";

import Image from 'next/image';

export const PartnersSection = () => {
  const paymentPartners = [
    { name: 'Razorpay', image: '/Mothers-aura-Razorpay.png' },
    { name: 'Remitly', image: '/Mothers-aura-Remitly.png' },
    { name: 'Wise', image: '/Mothers-aura-Wise.png' },
    { name: 'PayPal', image: '/Mothers-aura-paypal.png' },
    { name: 'Payoneer', image: '/mothers-aura-payoneer.png' }
  ];

  const certificationPartners = [
    { name: 'GCAL', image: '/Mothers-aura-GCAL.png' },
    { name: 'GIA', image: '/Mothers-aura-GIA.png' },
    { name: 'IGI', image: '/Mothers-aura-IGI.png' },
    { name: 'IGII', image: '/Mothers-aura-IGII.png' }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#EEF7FC] dark:bg-background">
      <div className="container mx-auto px-4">
        {/* Payment Partners - Single horizontal row with scroll on small screens */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h3 className="text-2xl sm:text-3xl font-bold text-muted-foreground mb-8 sm:mb-10 md:mb-12">
            Trusted Payment Partners
          </h3>
          
          <div className="flex flex-nowrap overflow-x-auto justify-start md:justify-center items-center gap-6 md:gap-10 px-1 md:px-0">
            {paymentPartners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 md:p-6 bg-background rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 shrink-0"
              >
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={160}
                  height={64}
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Certification Partners */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-muted-foreground mb-8 sm:mb-10 md:mb-12">
            Certified by Leading Laboratories
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            {certificationPartners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={200}
                  height={80}
                  className="max-h-16 sm:max-h-18 md:max-h-20 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};