"use client";

import { Star, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Testimonial {
  id: string;
  name: string;
  review: string;
  imageUrl: string | null;
  rating: number;
}

export const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/customer-testimonials');
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        } else {
          // Fallback to empty array if API fails
          setReviews([]);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-black dark:text-white">
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

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">Loading testimonials...</div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">No testimonials available yet.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-900 p-4 sm:p-5 md:p-6 rounded-xl shadow-lg relative border border-transparent dark:border-gray-800"
              >
                {/* Quote Icon */}
                <Quote size={32} className="text-black dark:text-white mb-4" />
                
                {/* Review Text */}
                <blockquote className="text-black dark:text-gray-200 mb-6 leading-relaxed text-sm">
                  {review.review}
                </blockquote>

                {/* Product Image */}
                {review.imageUrl && (
                  <div className="mb-4">
                    <Image
                      src={review.imageUrl}
                      alt={review.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded border-2 border-white dark:border-gray-800 shadow-sm"
                    />
                  </div>
                )}

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
                          className={
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }
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
        )}
      </div>
    </section>
  );
};