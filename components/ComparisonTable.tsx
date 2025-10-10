import { Button } from '@/components/ui/button';
// import { Check, X } from 'lucide-react';

export const ComparisonTable = () => {
  const comparisons = [
    {
      aspect: 'Origin',
      natural: 'Formed naturally over billions of years deep in the Earth',
      labGrown: 'Created in controlled laboratory environments using advanced technology'
    },
    {
      aspect: 'Environmental Impact',
      natural: 'Traditional mining with established environmental practices',
      labGrown: 'Lower environmental footprint, minimal land disruption'
    },
    {
      aspect: 'Price per Carat',
      natural: 'Higher due to rarity and mining costs',
      labGrown: 'Typically 30-50% less expensive than natural diamonds'
    },
    {
      aspect: 'Optical Properties',
      natural: 'Identical brilliance, fire, and scintillation',
      labGrown: 'Identical brilliance, fire, and scintillation'
    },
    {
      aspect: 'Resale Value',
      natural: 'Generally maintains value better over time',
      labGrown: 'May have lower resale value but excellent for personal enjoyment'
    },
    {
      aspect: 'Certification',
      natural: 'GIA, AGS, and other reputable grading institutes',
      labGrown: 'Same grading institutes with specific lab-grown designation'
    }
  ];

  return (
    <section className="py-24 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Natural vs Lab-Grown Diamonds
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Both are real diamonds with identical properties. The choice comes down to personal preference, budget, and values.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-xl shadow-luxury overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
              {/* Comparison Aspects */}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Comparison Aspects</h3>
                <div className="space-y-6">
                  {comparisons.map((item, index) => (
                    <div key={index} className="py-4">
                      <h4 className="font-semibold text-foreground">{item.aspect}</h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Natural Diamonds */}
              <div className="p-8 bg-primary/5">
                <h3 className="text-2xl font-bold mb-6 text-center text-primary">Natural Diamonds</h3>
                <div className="space-y-6">
                  {comparisons.map((item, index) => (
                    <div key={index} className="py-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.natural}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Button variant="default" size="lg" className="w-full">
                    Shop Natural Diamonds
                  </Button>
                </div>
              </div>

              {/* Lab-Grown Diamonds */}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-center text-primary">Lab-Grown Diamonds</h3>
                <div className="space-y-6">
                  {comparisons.map((item, index) => (
                    <div key={index} className="py-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.labGrown}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Button variant="outline" size="lg" className="w-full">
                    Shop Lab-Grown Diamonds
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};