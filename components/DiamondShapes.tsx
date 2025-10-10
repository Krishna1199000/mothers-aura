export const DiamondShapes = () => {
    const shapes = [
      { name: 'Round', svg: 'M12 3L21 12L12 21L3 12Z' },
      { name: 'Princess', svg: 'M3 3H21V21H3Z' },
      { name: 'Cushion', svg: 'M6 3H18C19.5 3 21 4.5 21 6V18C21 19.5 19.5 21 18 21H6C4.5 21 3 19.5 3 18V6C3 4.5 4.5 3 6 3Z' },
      { name: 'Oval', svg: 'M12 3C16.5 3 21 6.5 21 12C21 17.5 16.5 21 12 21C7.5 21 3 17.5 3 12C3 6.5 7.5 3 12 3Z' },
      { name: 'Emerald', svg: 'M6 3H18L21 6V18L18 21H6L3 18V6Z' },
      { name: 'Pear', svg: 'M12 3C16.5 3 21 7.5 21 12C21 16.5 16.5 21 12 21C9.5 21 7 19.5 5.5 17C4 14.5 4 9.5 5.5 7C7 4.5 9.5 3 12 3Z' },
      { name: 'Marquise', svg: 'M3 12L12 3L21 12L12 21Z' },
      { name: 'Radiant', svg: 'M6 3H18L21 6V18L18 21H6L3 18V6Z' },
      { name: 'Asscher', svg: 'M7 3H17L21 7V17L17 21H7L3 17V7Z' },
      { name: 'Heart', svg: 'M12 21C12 21 21 14 21 8C21 5 19 3 16.5 3C14.5 3 12.5 4 12 6C11.5 4 9.5 3 7.5 3C5 3 3 5 3 8C3 14 12 21 12 21Z' }
    ];
  
    return (
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Shop Diamonds by Shape
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each diamond shape offers its own unique brilliance and character
            </p>
          </div>
  
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {shapes.map((shape, index) => (
              <button
                key={index}
                className="group flex flex-col items-center p-6 rounded-xl border border-border hover:border-primary hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-12 h-12 stroke-current text-muted-foreground group-hover:text-primary transition-colors duration-300"
                    fill="none"
                    strokeWidth="1.5"
                  >
                    <path d={shape.svg} />
                  </svg>
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {shape.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  };