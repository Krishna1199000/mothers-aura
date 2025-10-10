import { ArrowRight } from 'lucide-react';

export const ShopByCategory = () => {
  const categories = [
    {
      id: 1,
      title: 'Engagement Rings',
      image: '/elegant-diamond-engagement-ring.jpg',
      alt: 'Elegant diamond engagement rings'
    },
    {
      id: 2,
      title: 'Wedding Rings',
      image: '/wedding-band-rings-set.jpg',
      alt: 'Beautiful wedding ring sets'
    },
    {
      id: 3,
      title: 'Diamond Rings',
      image: '/luxury-diamond-ring-collection.jpg',
      alt: 'Premium diamond rings'
    },
    {
      id: 4,
      title: 'Pendants',
      image: '/diamond-pendant-necklace.jpg',
      alt: 'Stunning diamond pendants'
    },
    {
      id: 5,
      title: 'Earrings',
      image: '/diamond-stud-earrings.jpg',
      alt: 'Exquisite diamond earrings'
    },
    {
      id: 6,
      title: 'Bracelets',
      image: '/diamond-tennis-bracelet.jpg',
      alt: 'Luxury diamond bracelets'
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Shop by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of premium diamonds and fine jewellery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-xl bg-card shadow-luxury hover:shadow-premium transition-all duration-500 hover:-translate-y-2"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  width={800}
                  height={800}
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                <button className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors">
                  <span className="text-sm">Shop now</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Essentials for you */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold mb-8 text-center">Essentials for you</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryTile title="Traditional wear" image="/traditional-diamond-jewelry.jpg" />
            <CategoryTile title="Spiritual wear" image="/spiritual-diamond-jewelry.jpg" />
            <CategoryTile title="Party wear" image="/party-diamond-jewelry.jpg" />
            <CategoryTile title="Everyday wear" image="/everyday-diamond-jewelry.jpg" />
          </div>
        </div>
      </div>
    </section>
  );
};

const CategoryTile = ({ title, image }: { title: string; image: string }) => (
  <div className="group relative overflow-hidden rounded-xl bg-card shadow-luxury hover:shadow-premium transition-all duration-500 hover:-translate-y-1">
    <div className="aspect-[4/3] overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
      <h4 className="text-lg font-semibold">{title}</h4>
    </div>
  </div>
);