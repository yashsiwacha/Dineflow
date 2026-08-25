import React from 'react';

export default function Gallery() {
  const images = [
    { src: '/assets/hero/hero_dineflow.webp', alt: 'Signature Table Spread', size: 'md:col-span-2' },
    { src: '/assets/restaurant/interior_dineflow.webp', alt: 'DineFlow Copper Dining Room', size: '' },
    { src: '/assets/restaurant/exterior_dineflow.webp', alt: 'Elegant Restaurant Entrance', size: '' },
    { src: '/assets/restaurant/kitchen_atmosphere.webp', alt: 'Culinary Plating Details', size: 'md:col-span-2' },
    { src: '/assets/food/main_butter_chicken.webp', alt: 'Gourmet Butter Chicken', size: '' },
    { src: '/assets/food/main_dal_makhani.webp', alt: 'Slow-Cooked Dal Makhani', size: '' },
    { src: '/assets/food/starter_avocado_bhel.webp', alt: 'Avocado Bhel Starter', size: '' },
    { src: '/assets/food/tandoor_malai_tikka.webp', alt: 'Tandoori Truffle Malai Paneer', size: '' }
  ];

  return (
    <div className="bg-brand-cream-light py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-terracotta uppercase tracking-[0.2em] text-xs font-semibold mb-2 block">
            Visual Story
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-brand-charcoal">
            The Visual Gallery
          </h1>
          <div className="h-1 w-20 bg-brand-terracotta mx-auto mt-4 mb-6"></div>
          <p className="text-brand-charcoal/70 leading-relaxed font-light">
            A window into the culinary craftsmanship, elegant dining rooms, and warm ambiance that define DineFlow.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div key={i} className={`relative overflow-hidden group rounded-sm border border-brand-cream-dark shadow-sm bg-brand-cream ${img.size}`}>
              <div className="aspect-[4/3] w-full relative">
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-all duration-700" 
                />
              </div>
              <div className="absolute inset-0 bg-brand-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 pointer-events-none">
                <p className="text-brand-cream font-serif text-xl tracking-wide font-medium">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
