import { Star } from 'lucide-react';

export const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: 'Sarah M.',
      location: 'London',
      rating: 5,
      review: 'Absolutely stunning diamond ring! The quality exceeded my expectations and the service was exceptional. Highly recommend Mothers Aura.',
      date: '2 weeks ago'
    },
    {
      id: 2,
      name: 'James R.',
      location: 'Manchester',
      rating: 5,
      review: 'Perfect engagement ring at an honest price. The certification process was transparent and the diamond is absolutely brilliant.',
      date: '1 month ago'
    },
    {
      id: 3,
      name: 'Emma K.',
      location: 'Birmingham',
      rating: 5,
      review: 'Love my lab-grown diamond earrings! They sparkle beautifully and I feel good about the ethical sourcing. Will definitely shop here again.',
      date: '3 weeks ago'
    },
    {
      id: 4,
      name: 'Michael T.',
      location: 'Glasgow',
      rating: 5,
      review: 'Outstanding customer service and beautiful jewellery. The 30-day return policy gave me confidence in my purchase.',
      date: '2 months ago'
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Real reviews from real customers (sample testimonials)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card p-8 rounded-xl shadow-luxury hover:shadow-premium transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  {review.date}
                </span>
              </div>

              <blockquote className="text-foreground mb-6 leading-relaxed">
                &ldquo;{review.review}&rdquo;
              </blockquote>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary font-semibold">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {review.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {review.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};