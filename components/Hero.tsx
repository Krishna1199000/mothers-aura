import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <img
          src="/luxury-diamond-macro-close-up.jpg"
          alt="Brilliant diamond with exceptional fire and clarity"
          className="w-full h-full object-cover object-center"
          loading="eager"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Brilliance, <br />
            <span className="text-primary-foreground">Honestly Priced.</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Cut the middle-man. Exceptional stones, direct to you.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" variant="default" className="px-8 py-4 text-lg font-semibold" asChild>
              <Link href="/signup">
                Shop Diamonds
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold bg-white/10 border-white/30 text-white hover:bg-white/20">
              Explore Rings
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator removed */}
    </section>
  );
};