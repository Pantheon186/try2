import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Home, Search, Phone, Mail, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize with welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        message: 'Hello! 👋 I\'m your travel assistant. How can I help you today?',
        timestamp: new Date(),
        quickActions: [
          {
            label: 'Search Cruises',
            action: () => handleQuickAction('search cruises'),
            icon: <Search size={16} />
          },
          {
            label: 'View Bookings',
            action: () => handleQuickAction('view bookings'),
            icon: <Home size={16} />
          },
          {
            label: 'Contact Support',
            action: () => handleQuickAction('contact support'),
            icon: <Phone size={16} />
          },
          {
            label: 'Help & FAQ',
            action: () => handleQuickAction('help'),
            icon: <HelpCircle size={16} />
          }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const handleQuickAction = (action: string) => {
    addUserMessage(action);
    handleBotResponse(action);
  };

  const addUserMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const addBotMessage = (message: string, quickActions?: QuickAction[]) => {
    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      message,
      timestamp: new Date(),
      quickActions
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleBotResponse = (userInput: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const input = userInput.toLowerCase();

      if (input.includes('cruise') || input.includes('search')) {
        addBotMessage(
          'I can help you find the perfect cruise! 🚢 Here are some options:',
          [
            {
              label: 'Luxury Cruises',
              action: () => handleQuickAction('luxury cruises'),
            },
            {
              label: 'Family Cruises',
              action: () => handleQuickAction('family cruises'),
            },
            {
              label: 'Budget Cruises',
              action: () => handleQuickAction('budget cruises'),
            },
            {
              label: 'View All Cruises',
              action: () => {
                addUserMessage('Show all cruises');
                addBotMessage('You can view all available cruises in the main dashboard. Click on "Cruises" in the navigation menu to see our complete collection with filters and search options.');
              }
            }
          ]
        );
      } else if (input.includes('booking') || input.includes('reservation')) {
        addBotMessage(
          'I can help you with your bookings! 📋 What would you like to do?',
          [
            {
              label: 'View My Bookings',
              action: () => {
                addUserMessage('View my bookings');
                addBotMessage('You can view all your bookings in the dashboard. Your booking history shows confirmed, pending, and completed reservations with full details.');
              }
            },
            {
              label: 'Cancel Booking',
              action: () => handleQuickAction('cancel booking'),
            },
            {
              label: 'Modify Booking',
              action: () => handleQuickAction('modify booking'),
            }
          ]
        );
      } else if (input.includes('hotel')) {
        addBotMessage(
          'Looking for hotels? 🏨 I can help you find the perfect accommodation:',
          [
            {
              label: 'Luxury Hotels',
              action: () => handleQuickAction('luxury hotels'),
            },
            {
              label: 'Business Hotels',
              action: () => handleQuickAction('business hotels'),
            },
            {
              label: 'Budget Hotels',
              action: () => handleQuickAction('budget hotels'),
            },
            {
              label: 'Browse Hotels',
              action: () => {
                addUserMessage('Browse all hotels');
                addBotMessage('Navigate to the "Hotels" section in the top menu to explore our extensive collection of hotels with detailed filters for location, price, and amenities.');
              }
            }
          ]
        );
      } else if (input.includes('support') || input.includes('help') || input.includes('contact')) {
        addBotMessage(
          'I\'m here to help! 🤝 Here are ways to get support:',
          [
            {
              label: 'Call Support',
              action: () => {
                addUserMessage('Call support');
                addBotMessage('📞 You can reach our support team at:\n\n🇮🇳 India: +91 1800-123-4567\n🌍 International: +91 22-1234-5678\n\nOur support hours:\nMon-Fri: 9:00 AM - 8:00 PM\nSat-Sun: 10:00 AM - 6:00 PM (IST)');
              },
              icon: <Phone size={16} />
            },
            {
              label: 'Email Support',
              action: () => {
                addUserMessage('Email support');
                addBotMessage('📧 Send us an email at:\n\n✉️ General: support@yorkeholidays.com\n✉️ Bookings: bookings@yorkeholidays.com\n✉️ Complaints: complaints@yorkeholidays.com\n\nWe typically respond within 24 hours.');
              },
              icon: <Mail size={16} />
            },
            {
              label: 'Live Chat',
              action: () => {
                addUserMessage('Live chat');
                addBotMessage('💬 You\'re already in our chat system! For human support, you can also use the floating help button in the bottom-right corner of the screen.');
              }
            }
          ]
        );
      } else if (input.includes('price') || input.includes('cost') || input.includes('payment')) {
        addBotMessage(
          'Questions about pricing and payments? 💳 Here\'s what I can help with:',
          [
            {
              label: 'Payment Methods',
              action: () => {
                addUserMessage('Payment methods');
                addBotMessage('We accept the following payment methods:\n\n💳 Credit Cards (Visa, MasterCard, American Express)\n🏦 Debit Cards\n📱 Digital Wallets (Paytm, PhonePe, Google Pay)\n🏛️ Net Banking\n💰 EMI Options available\n\nAll payments are secured with 256-bit SSL encryption.');
              }
            },
            {
              label: 'Refund Policy',
              action: () => {
                addUserMessage('Refund policy');
                addBotMessage('Our refund policy:\n\n✅ Free cancellation up to 48 hours before travel\n⏰ 50% refund for cancellations 24-48 hours before\n❌ No refund for cancellations within 24 hours\n🏥 Medical emergencies considered case-by-case\n\nRefunds are processed within 5-7 business days.');
              }
            },
            {
              label: 'Special Offers',
              action: () => handleQuickAction('special offers')
            }
          ]
        );
      } else if (input.includes('offer') || input.includes('discount') || input.includes('deal')) {
        addBotMessage(
          'Great! Here are our current special offers: 🎉',
          [
            {
              label: 'Early Bird Special',
              action: () => {
                addUserMessage('Early bird special');
                addBotMessage('🐦 Early Bird Special: Book 60+ days in advance and save 15% on all cruises! Valid until December 31, 2024. Use code: EARLY15');
              }
            },
            {
              label: 'Family Packages',
              action: () => {
                addUserMessage('Family packages');
                addBotMessage('👨‍👩‍👧‍👦 Family Fun Package: Save ₹10,000 on bookings above ₹1,00,000 for families with children. Perfect for creating memories together!');
              }
            },
            {
              label: 'Senior Discounts',
              action: () => {
                addUserMessage('Senior discounts');
                addBotMessage('👴👵 Senior Citizen Discount: 20% off for travelers above 60 years. Valid on all bookings with proper age verification.');
              }
            }
          ]
        );
      } else if (input.includes('luxury')) {
        addBotMessage(
          'Luxury travel experiences await! ✨ Here are our premium options:',
          [
            {
              label: 'Luxury Cruises',
              action: () => {
                addUserMessage('Show luxury cruises');
                addBotMessage('🛳️ Our luxury cruise collection includes:\n\n⭐ Princess Sapphire - Ultra-luxury with butler service\n⭐ Seabourn Encore - Intimate luxury experience\n⭐ Celebrity Infinity - Premium dining & spa\n\nAll feature premium amenities, fine dining, and personalized service.');
              }
            },
            {
              label: 'Luxury Hotels',
              action: () => {
                addUserMessage('Show luxury hotels');
                addBotMessage('🏨 Our luxury hotel portfolio:\n\n🌟 The Oberoi Mumbai - Panoramic sea views\n🌟 Taj Lake Palace Udaipur - Floating palace\n🌟 The Leela Palace New Delhi - Royal luxury\n\nAll offer world-class amenities and impeccable service.');
              }
            }
          ]
        );
      } else if (input.includes('family')) {
        addBotMessage(
          'Perfect for family vacations! 👨‍👩‍👧‍👦 Here are family-friendly options:',
          [
            {
              label: 'Family Cruises',
              action: () => {
                addUserMessage('Family cruise options');
                addBotMessage('🚢 Family-friendly cruises:\n\n🎪 Disney Wonder - Magical experience for kids\n🎢 Norwegian Gem - Water slides & kids club\n🎭 Royal Caribbean Explorer - Rock climbing & entertainment\n\nAll feature supervised kids activities and family dining options.');
              }
            },
            {
              label: 'Family Hotels',
              action: () => {
                addUserMessage('Family hotel options');
                addBotMessage('🏖️ Family-friendly hotels:\n\n🏊 Goa Marriott Resort - Beach access & water sports\n🎯 ITC Grand Chola Chennai - Kids activities\n🎪 Multiple pools and family suites available\n\nAll offer connecting rooms and child-friendly amenities.');
              }
            }
          ]
        );
      } else if (input.includes('budget') || input.includes('cheap') || input.includes('affordable')) {
        addBotMessage(
          'Great value options for budget-conscious travelers! 💰',
          [
            {
              label: 'Budget Cruises',
              action: () => {
                addUserMessage('Budget cruise options');
                addBotMessage('⚓ Affordable cruise options:\n\n💵 Costa Deliciosa - Starting from ₹22,000\n💵 MSC Bellissima - Starting from ₹28,000\n💵 Norwegian Gem - Starting from ₹32,000\n\nAll include meals and basic amenities.');
              }
            },
            {
              label: 'Budget Hotels',
              action: () => {
                addUserMessage('Budget hotel options');
                addBotMessage('🏨 Budget-friendly hotels:\n\n💰 FabHotel Prime Seasons - From ₹3,500/night\n💰 Treebo Trend Amber - From ₹4,500/night\n💰 Hotel Clarks Amer Jaipur - From ₹8,000/night\n\nClean, comfortable, and well-located properties.');
              }
            }
          ]
        );
      } else if (input.includes('cancel') || input.includes('refund')) {
        addBotMessage(
          'I can help you with cancellations and refunds. Here\'s what you need to know:\n\n📋 Cancellation Policy:\n• Free cancellation up to 48 hours before travel\n• 50% refund for 24-48 hour cancellations\n• Medical emergencies considered case-by-case\n\n💳 Refunds are processed within 5-7 business days to your original payment method.',
          [
            {
              label: 'Cancel Booking',
              action: () => {
                addUserMessage('How to cancel booking');
                addBotMessage('To cancel a booking:\n\n1️⃣ Go to your Dashboard\n2️⃣ Find your booking in the list\n3️⃣ Click "Cancel Booking" button\n4️⃣ Confirm cancellation\n5️⃣ Refund will be processed automatically\n\nFor assistance, contact our support team.');
              }
            },
            {
              label: 'Refund Status',
              action: () => {
                addUserMessage('Check refund status');
                addBotMessage('To check your refund status:\n\n📧 Check your email for refund confirmation\n💳 Refunds appear in 5-7 business days\n📞 Call support for urgent queries: +91 1800-123-4567\n\nRefund tracking ID is provided via email.');
              }
            }
          ]
        );
      } else if (input.includes('modify') || input.includes('change') || input.includes('update')) {
        addBotMessage(
          'Need to modify your booking? Here\'s how:\n\n✏️ What can be modified:\n• Travel dates (subject to availability)\n• Room/cabin type (price difference applies)\n• Guest details\n• Special requests\n\n⚠️ Some changes may incur fees.',
          [
            {
              label: 'Change Dates',
              action: () => {
                addUserMessage('Change travel dates');
                addBotMessage('To change travel dates:\n\n📅 Date changes are subject to availability\n💰 Price difference may apply\n⏰ Changes must be made 72+ hours before travel\n📞 Contact support for assistance: +91 1800-123-4567\n\nSome promotional rates may not be changeable.');
              }
            },
            {
              label: 'Upgrade Room',
              action: () => {
                addUserMessage('Upgrade room');
                addBotMessage('Room/cabin upgrades:\n\n⬆️ Subject to availability\n💳 Price difference charged immediately\n🎯 Upgrades available up to 24 hours before travel\n🌟 Complimentary upgrades possible for loyalty members\n\nContact your agent for upgrade options.');
              }
            }
          ]
        );
      } else if (input.includes('document') || input.includes('passport') || input.includes('visa')) {
        addBotMessage(
          'Travel documentation requirements: 📄\n\n🛂 Required Documents:\n• Valid passport (6+ months validity)\n• Visa (if required for destination)\n• Travel insurance (recommended)\n• Vaccination certificates (if applicable)\n\n📋 We\'ll provide a detailed checklist after booking.',
          [
            {
              label: 'Passport Info',
              action: () => {
                addUserMessage('Passport requirements');
                addBotMessage('Passport Requirements:\n\n📘 Must be valid for 6+ months from travel date\n📄 At least 2 blank pages required\n🔄 Renewal takes 15-30 days in India\n📍 Apply at nearest Passport Seva Kendra\n\nFor urgent renewals, Tatkal service available.');
              }
            },
            {
              label: 'Visa Requirements',
              action: () => {
                addUserMessage('Visa requirements');
                addBotMessage('Visa Information:\n\n🌍 Depends on destination country\n⏰ Processing time: 5-15 working days\n💰 Fees vary by country\n📋 We can assist with visa applications\n\nContact us for destination-specific requirements.');
              }
            }
          ]
        );
      } else {
        // Default response for unrecognized input
        addBotMessage(
          'I\'m not sure I understand that completely. Let me help you with some common topics:',
          [
            {
              label: 'Search Cruises',
              action: () => handleQuickAction('search cruises'),
              icon: <Search size={16} />
            },
            {
              label: 'View Bookings',
              action: () => handleQuickAction('view bookings'),
              icon: <Home size={16} />
            },
            {
              label: 'Get Support',
              action: () => handleQuickAction('contact support'),
              icon: <Phone size={16} />
            },
            {
              label: 'Special Offers',
              action: () => handleQuickAction('special offers'),
            }
          ]
        );
      }
    }, 1000 + Math.random() * 1000); // Random delay for more natural feel
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    addUserMessage(inputMessage);
    handleBotResponse(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold">Travel Assistant</h3>
                <p className="text-xs opacity-90">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.message}</p>
                  </div>
                  
                  {/* Quick Actions */}
                  {message.quickActions && message.quickActions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {action.icon}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'order-1 mr-2 bg-blue-500 text-white' : 'order-2 ml-2 bg-gray-200 text-gray-600'
                }`}>
                  {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Bot size={16} className="text-gray-600" />
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                maxLength={500}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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

export default Chatbot;