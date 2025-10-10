import { Truck, Headphones, Shield, Gem, Package, Sparkles } from 'lucide-react';

export const FeatureStripe = () => {
  const features = [
    { icon: Truck, label: 'Free Shipping' },
    { icon: Headphones, label: '24×7 Customer Service' },
    { icon: Shield, label: 'Lifetime Guarantee' },
    { icon: Gem, label: 'Quality' },
    { icon: Package, label: 'Variety' },
    { icon: Sparkles, label: 'Custom' }
  ];

  return (
    <section className="py-16 border-y border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary group-hover:animate-diamond-sparkle" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};