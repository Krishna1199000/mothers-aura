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

  // Duplicate features for seamless infinite scroll
  const duplicatedFeatures = [...features, ...features];

  return (
    <section className="py-8 border-y border-border bg-background overflow-hidden">
      <div className="relative">
        {/* Infinite sliding container */}
        <div className="flex animate-scroll">
          {duplicatedFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex flex-col items-center text-center mx-8 min-w-[120px]"
            >
              <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-blue-100">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};