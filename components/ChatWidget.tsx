"use client";

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // TODO: Handle message submission
      console.log('Message:', message);
      setMessage('');
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-premium hover:shadow-luxury transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Panel */}
      <div className={`fixed bottom-24 right-6 w-80 bg-card border border-border rounded-xl shadow-premium transition-all duration-300 z-40 ${
        isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Diamond Expert Chat</h3>
          <p className="text-sm text-muted-foreground">We&apos;re here to help!</p>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="text-sm">Hello! How can I help you find the perfect diamond today?</p>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};