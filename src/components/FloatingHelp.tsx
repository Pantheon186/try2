import React, { useState } from 'react';
import { MessageCircle, X, Phone, Mail, Clock, Send, User } from 'lucide-react';

const FloatingHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'support',
      message: 'Hello! How can I help you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
    setChatMode(false);
  };

  const startChat = () => {
    setChatMode(true);
  };

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'user',
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate support response
      setTimeout(() => {
        const supportResponse = {
          id: chatMessages.length + 2,
          sender: 'support',
          message: 'Thank you for your message. Our team will assist you shortly. Is there anything specific about cruise bookings I can help you with?',
          timestamp: new Date().toLocaleTimeString()
        };
        setChatMessages(prev => [...prev, supportResponse]);
      }, 1000);
    }
  };
  const handleWhatsApp = () => {
    // In a real application, this would open WhatsApp with a pre-filled message
    window.open('https://wa.me/1234567890?text=Hi! I need help with cruise booking.', '_blank');
  };

  const handleCall = () => {
    window.open('tel:+1234567890');
  };

  const handleEmail = () => {
    window.open('mailto:support@oceanlux.com?subject=Cruise Booking Inquiry');
  };

  return (
    <>
      {/* Help Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl w-80 animate-in slide-in-from-bottom-5 duration-300">
          {!chatMode ? (
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Need Help?</h3>
                <button
                  onClick={toggleHelp}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-6 text-sm">
                Our travel experts are here to help you plan the perfect cruise experience. 
                Get in touch with us through any of these channels:
              </p>

              {/* Contact Options */}
              <div className="space-y-3">
                <button
                  onClick={startChat}
                  className="w-full flex items-center gap-3 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                >
                  <MessageCircle size={20} />
                  <span>Live Chat</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center gap-3 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp Chat</span>
                </button>

                <button
                  onClick={handleCall}
                  className="w-full flex items-center gap-3 p-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200"
                >
                  <Phone size={20} />
                  <span>Call Now</span>
                </button>

                <button
                  onClick={handleEmail}
                  className="w-full flex items-center gap-3 p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
                >
                  <Mail size={20} />
                  <span>Email Support</span>
                </button>
              </div>

              {/* Business Hours */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock size={16} />
                  <span className="font-medium">Business Hours:</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Mon-Fri: 9:00 AM - 8:00 PM<br />
                  Sat-Sun: 10:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-96">
              {/* Chat Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="text-white" size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">Support Chat</h3>
                    <p className="text-xs text-green-600">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatMode(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleHelp}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center group ${
          isOpen ? 'rotate-180' : 'hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} className="group-hover:animate-pulse" />
        )}
      </button>

      {/* Pulse Animation Ring */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-blue-500/30 animate-ping"></div>
      )}
    </>
  );
};

export default FloatingHelp;