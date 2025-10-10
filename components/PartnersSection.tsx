export const PartnersSection = () => {
    const partners = [
      { name: 'Razorpay', logo: 'R' },
      { name: 'Payoneer', logo: 'P' },
      { name: 'PayPal', logo: 'PP' },
      { name: 'Wise', logo: 'W' },
      { name: 'Remitly', logo: 'R' }
    ];
  
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-xl font-semibold text-muted-foreground mb-4">
              Trusted Payment Partners
            </h3>
          </div>
  
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center w-20 h-20 bg-background rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-2xl font-bold text-muted-foreground">
                  {partner.logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };