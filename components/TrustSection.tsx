import { Shield, Award, RotateCcw } from 'lucide-react';

export const TrustSection = () => {
  const trustPoints = [
    {
      icon: Shield,
      title: 'Transparent Pricing',
      description: 'No hidden markups. Clear, honest pricing on every piece.'
    },
    {
      icon: Award,
      title: 'Certified & Ethically Sourced',
      description: 'Every diamond comes with certification and ethical sourcing guarantee.'
    },
    {
      icon: RotateCcw,
      title: 'Free 30-Day Returns',
      description: 'Not completely satisfied? Return within 30 days for a full refund.'
    }
  ];

  return (
    <section className="py-24 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The direct route to remarkable jewellery.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            No unnecessary markups. No confusion. Just certified quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="text-center group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <point.icon className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold mb-4">{point.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};