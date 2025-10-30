import { Star, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

export const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: 'Cameron Williamson',
      rating: 5,
      review: 'Best product ever. I will definitely buy again..thanks Mothers Aura. All these years but they were either more sweeter or not tasty at all. It easily gets mixed with water n what a taste you will definitely like it. after having the supplement I got nice sleep n felt very satisfied.',
      productImage: '/elegant-diamond-engagement-ring.jpg'
    },
    {
      id: 2,
      name: 'Ronald Richards',
      rating: 5,
      review: 'Great product, love this diamond brand. Likes: Good packaging, provided with certification, container quality is good, quantity value for money, mixes well with any setting but you have to choose carefully. Dislikes: for me, it\'s too expensive & a bit of premium feel which I don\'t like much.',
      productImage: '/luxury-diamond-ring-collection.jpg'
    },
    {
      id: 3,
      name: 'Darlene Robertson',
      rating: 5,
      review: 'I got to know how important diamonds are for jewelry I am a minimalist so it\'s difficult for my style. Hence, i have opted for diamonds from Mothers Aura. It is great in quality. It is brilliant and its not heavy so it feels like natural jewelry. The combination of cut and clarity is great hence I wear it every day.',
      productImage: '/diamond-pendant-necklace.jpg'
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
            Customer Testimonials
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="text-yellow-400 fill-current"
                />
              ))}
            </div>
            <span className="text-lg text-gray-600 dark:text-gray-300">
              (350+ Reviews)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg relative border border-transparent dark:border-gray-800"
            >
              {/* Quote Icon */}
              <Quote size={32} className="text-black dark:text-white mb-4" />
              
              {/* Review Text */}
              <blockquote className="text-black dark:text-gray-200 mb-6 leading-relaxed text-sm">
                {review.review}
              </blockquote>

              {/* Product Image */}
              <div className="mb-4">
                <Image
                  src={review.productImage}
                  alt="Product"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded border-2 border-white dark:border-gray-800 shadow-sm"
                />
              </div>

              {/* Reviewer Info */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-black dark:text-white text-sm">
                    {review.name}
                  </div>
                  <div className="flex space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
                
                {/* Navigation Arrow */}
                <ChevronRight size={20} className="text-black dark:text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};