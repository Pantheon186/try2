import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Ship, Plane, Building, MapPin } from 'lucide-react';

interface CarouselItem {
  id: number;
  title: string;
  category: string;
  image: string;
  icon: React.ReactNode;
  description: string;
}

const CarouselSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel data with different travel categories
  const carouselItems: CarouselItem[] = [
    {
      id: 1,
      title: "Mediterranean Luxury Cruise",
      category: "Cruises",
      image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
      icon: <Ship size={24} />,
      description: "Sail through crystal-clear waters and discover ancient civilizations"
    },
    {
      id: 2,
      title: "Caribbean Paradise Voyage",
      category: "Cruises",
      image: "https://images.pexels.com/photos/804463/pexels-photo-804463.jpeg",
      icon: <Ship size={24} />,
      description: "Experience tropical paradise with pristine beaches and vibrant culture"
    },
    {
      id: 3,
      title: "First Class Flight Experience",
      category: "Flights",
      image: "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg",
      icon: <Plane size={24} />,
      description: "Luxury air travel with premium comfort and world-class service"
    },
    {
      id: 4,
      title: "5-Star Resort & Spa",
      category: "Hotels",
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
      icon: <Building size={24} />,
      description: "Indulge in luxury accommodations with breathtaking ocean views"
    },
    {
      id: 5,
      title: "European Grand Tour",
      category: "Holiday Packages",
      image: "https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg",
      icon: <MapPin size={24} />,
      description: "Explore Europe's most iconic destinations in ultimate comfort"
    },
    {
      id: 6,
      title: "Asian Cultural Journey",
      category: "Holiday Packages",
      image: "https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg",
      icon: <MapPin size={24} />,
      description: "Immerse yourself in rich cultures and ancient traditions"
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50" data-section="carousel">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Explore Our
            <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Premium Services
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From luxury cruises to first-class flights, discover a world of premium travel experiences 
            tailored to your desires.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Carousel */}
          <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
            {carouselItems.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                  index === currentSlide ? 'translate-x-0' : 
                  index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                }`}
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 max-w-2xl">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="text-blue-400">
                        {item.icon}
                      </div>
                      <span className="text-blue-300 font-medium text-sm uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/90 text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 shadow-lg"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-blue-500 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { name: 'Cruises', icon: <Ship size={32} />, count: '50+' },
            { name: 'Flights', icon: <Plane size={32} />, count: '200+' },
            { name: 'Hotels', icon: <Building size={32} />, count: '1000+' },
            { name: 'Packages', icon: <MapPin size={32} />, count: '150+' }
          ].map((category, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-md rounded-xl border border-white/30 p-6 text-center hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="text-blue-600 mb-3 flex justify-center">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
              <p className="text-blue-600 font-bold">{category.count} Options</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;