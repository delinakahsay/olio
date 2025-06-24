'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, ShoppingCart, Bot, User, Package, Heart, Star, CreditCard, Truck } from 'lucide-react';

// Product database
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 324,
    category: "Electronics",
    keywords: ["headphones", "wireless", "audio", "music", "bluetooth", "noise canceling"],
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and studio-quality sound.",
    features: ["Active Noise Cancellation", "30-hour battery", "Quick charge", "Premium audio drivers"]
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 186,
    category: "Electronics",
    keywords: ["smartwatch", "fitness", "health", "tracker", "watch", "sport", "exercise"],
    description: "Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life.",
    features: ["Heart rate monitor", "GPS tracking", "7-day battery", "Water resistant"]
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 89,
    category: "Clothing",
    keywords: ["t-shirt", "shirt", "clothing", "organic", "cotton", "sustainable", "fashion"],
    description: "Soft, sustainable organic cotton t-shirt made from 100% certified organic materials.",
    features: ["100% organic cotton", "Sustainable production", "Comfortable fit", "Multiple colors"]
  },
  {
    id: 4,
    name: "Smart Coffee Maker",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 156,
    category: "Home",
    keywords: ["coffee", "maker", "machine", "kitchen", "brewing", "smart", "programmable"],
    description: "Smart programmable coffee maker with app control, multiple brew strengths, and thermal carafe.",
    features: ["App controlled", "Programmable", "Thermal carafe", "Multiple brew strengths"]
  },
  {
    id: 5,
    name: "Leather Messenger Bag",
    price: 89.99,
    originalPrice: 129.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 203,
    category: "Accessories",
    keywords: ["bag", "messenger", "leather", "work", "laptop", "professional", "briefcase"],
    description: "Handcrafted genuine leather messenger bag perfect for work, travel, and daily use.",
    features: ["Genuine leather", "Laptop compartment", "Adjustable strap", "Multiple pockets"]
  },
  {
    id: 6,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    rating: 4.3,
    reviews: 124,
    category: "Electronics",
    keywords: ["speaker", "bluetooth", "portable", "music", "audio", "wireless", "outdoor"],
    description: "Waterproof portable Bluetooth speaker with 360° sound and 12-hour battery life.",
    features: ["Waterproof design", "360° sound", "12-hour battery", "Compact size"]
  }
];

// AI responses and logic
const getAIResponse = (message, products, cart, setCart) => {
  const lowerMessage = message.toLowerCase();
  
  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return {
      type: 'text',
      content: "Hello! I'm your AI shopping assistant. I can help you find products, answer questions, and make purchases. What are you looking for today?"
    };
  }
  
  // Help responses
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return {
      type: 'text',
      content: "I can help you with:\n• Finding products based on your needs\n• Comparing features and prices\n• Adding items to your cart\n• Answering product questions\n• Processing your order\n\nJust tell me what you're looking for!"
    };
  }
  
  // Cart-related queries
  if (lowerMessage.includes('cart') || lowerMessage.includes('basket')) {
    if (cart.length === 0) {
      return {
        type: 'text',
        content: "Your cart is currently empty. Would you like me to help you find some products?"
      };
    } else {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return {
        type: 'cart',
        content: `You have ${cart.length} item(s) in your cart. Total: $${total.toFixed(2)}`,
        cart: cart
      };
    }
  }
  
  // Product search
  let foundProducts = [];
  
  // Search through all products
  products.forEach(product => {
    const searchTerms = [
      product.name.toLowerCase(),
      product.description.toLowerCase(),
      product.category.toLowerCase(),
      ...product.keywords
    ];
    
    if (searchTerms.some(term => 
      lowerMessage.split(' ').some(word => term.includes(word) || word.includes(term))
    )) {
      foundProducts.push(product);
    }
  });
  
  // Budget-based search
  const budgetMatch = lowerMessage.match(/under (\$)?(\d+)/);
  if (budgetMatch) {
    const budget = parseInt(budgetMatch[2]);
    foundProducts = foundProducts.filter(p => p.price <= budget);
  }
  
  // Category-specific responses
  if (lowerMessage.includes('electronics') || lowerMessage.includes('tech')) {
    foundProducts = products.filter(p => p.category === 'Electronics');
  }
  
  if (lowerMessage.includes('clothing') || lowerMessage.includes('shirt') || lowerMessage.includes('fashion')) {
    foundProducts = products.filter(p => p.category === 'Clothing');
  }
  
  // Recommendation requests
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('best')) {
    if (foundProducts.length === 0) {
      foundProducts = products.sort((a, b) => b.rating - a.rating).slice(0, 3);
    }
    
    return {
      type: 'products',
      content: "Based on customer ratings and reviews, here are my top recommendations:",
      products: foundProducts.slice(0, 3)
    };
  }
  
  // Return found products
  if (foundProducts.length > 0) {
    return {
      type: 'products',
      content: `I found ${foundProducts.length} product(s) that match your search:`,
      products: foundProducts.slice(0, 4)
    };
  }
  
  // Default response
  return {
    type: 'text',
    content: "I'm not sure I understand. Could you tell me more specifically what you're looking for? For example, you could say:\n• 'I need headphones under $200'\n• 'Show me fitness products'\n• 'What's in my cart?'\n• 'Recommend something popular'"
  };
};

export default function OlioAI() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: "Hi! I'm Olio, your AI shopping assistant. I can help you find products, answer questions, and complete purchases. What can I help you find today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [cart, setCart] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Add confirmation message
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'ai',
      content: `Great! I've added "${product.name}" to your cart. Would you like to continue shopping or proceed to checkout?`,
      timestamp: new Date()
    }]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage, products, cart, setCart);
      
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        content: aiResponse.content,
        type: aiResponse.type,
        products: aiResponse.products,
        cart: aiResponse.cart,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Olio AI Shopping</h1>
                <p className="text-sm text-gray-500">Your intelligent shopping assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-xl h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-gray-600' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  }`}>
                    {message.sender === 'user' ? 
                      <User className="w-4 h-4 text-white" /> : 
                      <Bot className="w-4 h-4 text-white" />
                    }
                  </div>

                  {/* Message Content */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'user' 
                      ? 'bg-gray-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-line">{message.content}</p>
                    
                    {/* Product Cards */}
                    {message.type === 'products' && message.products && (
                      <div className="mt-4 space-y-3">
                        {message.products.map(product => (
                          <div key={product.id} className="bg-white rounded-lg p-4 shadow-sm border">
                            <div className="flex space-x-4">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                <div className="flex items-center mt-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="ml-1 text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                                    {product.originalPrice > product.price && (
                                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => addToCart(product)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Cart Display */}
                    {message.type === 'cart' && message.cart && (
                      <div className="mt-4 space-y-2">
                        {message.cart.map(item => (
                          <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm border flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                              <div>
                                <p className="font-semibold text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mt-3">
                          <CreditCard className="w-4 h-4 inline mr-2" />
                          Proceed to Checkout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t bg-gray-50 px-6 py-4 rounded-b-2xl">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about products, or say 'help' to see what I can do..."
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="1"
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "Show me headphones under $200",
                "What's popular?", 
                "I need workout gear",
                "Show my cart"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(suggestion)}
                  className="text-sm bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}