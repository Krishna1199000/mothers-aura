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
    <section className="py-6 sm:py-8 border-y border-border bg-background overflow-hidden">
      <div className="relative">
        {/* Infinite sliding container */}
        <div className="flex animate-scroll">
          {duplicatedFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex flex-col items-center text-center mx-4 sm:mx-6 md:mx-8 min-w-[100px] sm:min-w-[120px]"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};