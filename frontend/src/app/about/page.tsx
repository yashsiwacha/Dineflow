import React from 'react';

export default function About() {
  return (
    <div className="bg-brand-cream-light py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-terracotta uppercase tracking-[0.2em] text-xs font-semibold mb-2 block">
            Our Story
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-brand-charcoal">
            The Heritage of DineFlow
          </h1>
          <div className="h-1 w-20 bg-brand-terracotta mx-auto mt-4 mb-6"></div>
          <p className="text-brand-charcoal/70 leading-relaxed font-light">
            Founded with a vision to redefine traditional North Indian fine-dining in Delhi NCR, DineFlow blends ancestral slow-cooking with clean execution.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative h-[480px] rounded-sm overflow-hidden border border-brand-cream-dark shadow-md">
            <img 
              src="/assets/restaurant/interior_dineflow.webp" 
              alt="DineFlow Interior" 
              className="object-cover w-full h-full" 
            />
          </div>
          <div className="space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
              Crafted Gastronomy. Effortless Experience.
            </h2>
            <p className="text-brand-charcoal/75 leading-relaxed font-light">
              At DineFlow, we believe that dining should be an art form, not just a service. Our recipes are sourced from the historic culinary regions of Punjab and Awadh, utilizing fresh ingredients and stone-ground spices.
            </p>
            <p className="text-brand-charcoal/75 leading-relaxed font-light">
              However, exceptional food should not be bogged down by slow execution. We have embedded modern digital coordination into our operations — from kitchen event loops to real-time status feeds. This ensures your meal is prepared with maximum care and delivered with zero friction.
            </p>
          </div>
        </div>

        {/* Chef Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
              Led by Chef Kabir
            </h2>
            <p className="text-brand-charcoal/75 leading-relaxed font-light">
              With over two decades of experience in Michelin-starred and traditional Indian kitchens, Chef Kabir curates a menu that honors history while incorporating modern global presentations.
            </p>
            <p className="text-brand-charcoal/75 leading-relaxed font-light">
              "We don't modify the soul of the dish; we change only how it meets the eye. The butter chicken still has the rich clay-oven smokiness, but its presentation is clean, deconstructed, and refined for the modern epicurean."
            </p>
          </div>
          <div className="order-1 lg:order-2 relative h-[480px] rounded-sm overflow-hidden border border-brand-cream-dark shadow-md">
            <img 
              src="/assets/restaurant/kitchen_atmosphere.webp" 
              alt="Chef Kabir Cooking" 
              className="object-cover w-full h-full" 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
