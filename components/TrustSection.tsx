import Image from 'next/image';

export const TrustSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The direct route to remarkable jewellery.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            No unnecessary markups. No confusion. Just certified quality.
          </p>
        </div>

        <div className="w-full flex justify-center overflow-hidden">
          <div className="w-full max-w-6xl bg-white">
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