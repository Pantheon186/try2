import React from 'react';
import { Award, Users, Star, Globe, Trophy, Heart, Shield, Clock } from 'lucide-react';

const PerformanceSection: React.FC = () => {
  // Performance statistics and awards data
  const stats = [
    {
      icon: <Users size={48} />,
      number: '100K+',
      label: 'Happy Travelers',
      description: 'Customers who chose us for their dream vacations',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Award size={48} />,
      number: '25+',
      label: 'International Awards',
      description: 'Recognition for excellence in travel services',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: <Star size={48} />,
      number: '4.9★',
      label: 'Average Customer Rating',
      description: 'Based on 50,000+ verified customer reviews',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Globe size={48} />,
      number: '120+',
      label: 'Global Partnerships',
      description: 'Trusted relationships with premium travel brands',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Additional achievements
  const achievements = [
    {
      icon: <Trophy size={24} />,
      title: 'Best Luxury Travel Agency 2024',
      organization: 'World Travel Awards'
    },
    {
      icon: <Heart size={24} />,
      title: 'Customer Choice Award',
      organization: 'TripAdvisor Travelers Choice'
    },
    {
      icon: <Shield size={24} />,
      title: 'Trusted Travel Partner',
      organization: 'International Travel Association'
    },
    {
      icon: <Clock size={24} />,
      title: '15+ Years of Excellence',
      organization: 'Industry Experience'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50" data-section="performance">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Excellence
            <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Recognized Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            With over a decade of experience in luxury travel, we've built a reputation for delivering 
            exceptional experiences that exceed expectations. Our commitment to excellence has earned us 
            recognition from industry leaders and the trust of travelers worldwide.
          </p>
        </div>

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-8 text-center hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
            >
              {/* Icon with Gradient Background */}
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${stat.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              
              {/* Number */}
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {stat.number}
              </div>
              
              {/* Label */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {stat.label}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Awards and Recognition Section */}
        <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/30 p-8 md:p-12 shadow-xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Awards & Recognition
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our dedication to providing exceptional travel experiences has been recognized 
              by leading industry organizations and our valued customers.
            </p>
          </div>

          {/* Awards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-6 text-center hover:bg-white/80 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white mb-4">
                  {achievement.icon}
                </div>
                
                {/* Title */}
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                  {achievement.title}
                </h4>
                
                {/* Organization */}
                <p className="text-gray-600 text-xs">
                  {achievement.organization}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
              <div className="text-gray-600 text-sm">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 mb-1">100%</div>
              <div className="text-gray-600 text-sm">Secure Booking</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">50+</div>
              <div className="text-gray-600 text-sm">Countries Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">15+</div>
              <div className="text-gray-600 text-sm">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;