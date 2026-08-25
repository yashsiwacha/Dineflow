import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-brand-cream-light py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-terracotta uppercase tracking-[0.2em] text-xs font-semibold mb-2 block">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-brand-charcoal">
            Contact DineFlow
          </h1>
          <div className="h-1 w-20 bg-brand-terracotta mx-auto mt-4 mb-6"></div>
          <p className="text-brand-charcoal/70 leading-relaxed font-light">
            Have questions about our menus, private dining bookings, or delivery range? Drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Details */}
          <div className="space-y-8 bg-brand-cream border border-brand-cream-dark p-8 sm:p-12 rounded-sm shadow-sm">
            <h2 className="font-serif text-3xl font-bold text-brand-charcoal mb-6">
              Our Coordinates
            </h2>
            
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-brand-terracotta shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-brand-charcoal">Address</h4>
                <p className="text-sm text-brand-charcoal/70 leading-relaxed mt-1">
                  DLF CyberCity, Phase 3, Sector 24, Gurgaon, Delhi NCR, 122002
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-brand-terracotta shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-brand-charcoal">Phone & Support</h4>
                <p className="text-sm text-brand-charcoal/70 leading-relaxed mt-1">
                  Reservations: +91 99999 00000<br />
                  Home Delivery Support: +91 99999 00001
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-brand-terracotta shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-brand-charcoal">Email</h4>
                <p className="text-sm text-brand-charcoal/70 leading-relaxed mt-1">
                  concierge@dineflow.com<br />
                  media@dineflow.com
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-brand-terracotta shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-brand-charcoal">Operating Hours</h4>
                <p className="text-sm text-brand-charcoal/70 leading-relaxed mt-1">
                  Mon – Thu: 12:00 PM – 11:30 PM<br />
                  Fri – Sun: 12:00 PM – 12:30 AM
                </p>
              </div>
            </div>
          </div>

          {/* Map/Form */}
          <div className="bg-brand-cream border border-brand-cream-dark p-8 sm:p-12 rounded-sm shadow-sm space-y-6">
            <h2 className="font-serif text-3xl font-bold text-brand-charcoal">
              Enquiry Form
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-charcoal/70 mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-brand-cream-light border border-brand-cream-dark px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-brand-terracotta" 
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-charcoal/70 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-brand-cream-light border border-brand-cream-dark px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-brand-terracotta" 
                  placeholder="Your email address"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-charcoal/70 mb-1">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-brand-cream-light border border-brand-cream-dark px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-brand-terracotta" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-brand-terracotta text-white uppercase text-xs tracking-wider font-semibold py-4 rounded-sm hover:bg-brand-terracotta-dark transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
