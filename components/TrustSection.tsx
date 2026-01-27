import Image from 'next/image';

export const TrustSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
            The direct route to remarkable jewellery.
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            No unnecessary markups. No confusion. Just certified quality.
          </p>
        </div>

        <div className="w-full flex justify-center overflow-hidden">
          <div className="w-full max-w-6xl bg-white dark:bg-gray-900">
            <div className="relative w-full aspect-[3/2]">
              <Image
                src="/designer.jpg"
                alt="Explaining"
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};