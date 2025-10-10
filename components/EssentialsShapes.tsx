import { ArrowRight } from 'lucide-react';

export const EssentialsSection = () => {
  const essentials = [
    {
      id: 1,
      title: 'Traditional Wear',
      description: 'Classic pieces for timeless elegance',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center'
    },
    {
      id: 2,
      title: 'Spiritual Wear',
      description: 'Meaningful jewellery for special moments',
      image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop&crop=center'
    },
    {
      id: 3,
      title: 'Party Wear',
      description: 'Statement pieces that shine bright',
      image: 'https://images.unsplash.com/photo-1588444645011-3da505b9fb4d?w=400&h=400&fit=crop&crop=center'
    },
    {
      id: 4,
      title: 'Everyday Wear',
      description: 'Comfortable luxury for daily elegance',
      image: 'https://images.unsplash.com/photo-1603561596112-6a132309c76d?w=400&h=400&fit=crop&crop=center'
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Essentials for You
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the perfect piece for every occasion and moment in your life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {essentials.map((essential) => (
            <div
              key={essential.id}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl bg-card shadow-luxury hover:shadow-premium transition-all duration-500 hover:-translate-y-2">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={essential.image}
                    alt={essential.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    width={400}
                    height={400}
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">{essential.title}</h3>
                  <p className="text-white/90 text-sm mb-4">{essential.description}</p>
                  <button className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors">
                    <span className="text-sm">Explore</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};