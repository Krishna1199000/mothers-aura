'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageCircle, Send, X, MinusCircle, RefreshCw, Phone, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  senderType: 'ADMIN' | 'CUSTOMER';
  createdAt: string;
  isRead: boolean;
  // client-side temporary identifier to de-duplicate before server assigns real id
  clientId?: string;
}

interface ChatWidgetProps {
  className?: string;
}

export function ChatWidget({ className }: ChatWidgetProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutopopupRun, setHasAutopopupRun] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState<'AVAILABLE' | 'BUSY' | 'OFFLINE'>('OFFLINE');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [chatStep, setChatStep] = useState<'welcome' | 'name' | 'email' | 'issue' | 'message'>('welcome');
  const [tempInput, setTempInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const faqData = [
    {
      question: "What are your shipping policies?",
      answer: "We offer free shipping on orders over $100. Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. International shipping is available to select countries."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you&apos;ll receive a tracking number via email. You can track your package using our tracking page or the carrier&apos;s website with the provided tracking number."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all items. Items must be in original condition with tags attached. Returns are free within the US, and we&apos;ll process your refund within 5-7 business days."
    },
    {
      question: "How do I care for my jewelry?",
      answer: "Store your jewelry in a cool, dry place. Clean with a soft cloth and avoid contact with perfumes, lotions, and harsh chemicals. Remove jewelry before swimming or exercising."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All transactions are secure and encrypted."
    }
  ];

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_APP_URL || window.location.origin, {
      path: '/api/socket',
      addTrailingSlash: false,
      withCredentials: true,
      transports: ['polling']
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('admin_status', (status) => {
      setAdminStatus(status);
      setShowForm(status === 'BUSY' || status === 'OFFLINE');
    });

    socketInstance.on('message', (message: any) => {
      // Only add message if it's from admin and we're in the right chat
      if (message.senderType === 'ADMIN' && (!chatId || message.chatId === chatId)) {
        setMessages((prev: Message[]) => {
          // Avoid duplicates - check both regular IDs and temp IDs
          const exists = prev.some(m => 
            m.id === message.id || 
            (m.content === message.content && Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 1000)
          );
          if (exists) return prev;
          return [...prev, {
            id: message.id,
            content: message.content,
            senderType: message.senderType,
            createdAt: message.createdAt,
            isRead: message.isRead || false
          }];
        });
      }
    });

    socketInstance.on('admin_typing', (isTyping: boolean) => {
      setIsAdminTyping(isTyping);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Scroll to bottom on new messages during conversation flow and FAQ is not shown
  useEffect(() => {
    if (!showOptions && (chatStep === 'welcome' || chatStep === 'name' || chatStep === 'email' || chatStep === 'issue' || chatStep === 'message')) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatStep, showOptions]);

  // Check admin status on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const res = await fetch('/api/chat/admin-status');
        const data = await res.json();
        setAdminStatus(data.status);
        setShowForm(data.status === 'BUSY' || data.status === 'OFFLINE');
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  // Auto-open widget 10s after page load once per browser session
  useEffect(() => {
    if (hasAutopopupRun) return;

    try {
      if (typeof window !== 'undefined') {
        const hasShown = sessionStorage.getItem('chatWidgetAutopopupShown');
        if (hasShown) return; // already auto-opened this session
      }
    } catch {}

    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasAutopopupRun(true);
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('chatWidgetAutopopupShown', '1');
        }
      } catch {}
    }, 10000);
    return () => clearTimeout(timer);
  }, [hasAutopopupRun]);

  // Poll for updates: if chatId present fetch messages; otherwise try to attach to a newly created chat for this email
  useEffect(() => {
    if (!isOpen || chatStep !== 'message') return;

    const interval = setInterval(async () => {
      try {
        if (chatId) {
          const res = await fetch(`/api/chat/public/${chatId}`);
          if (res.ok) {
            const data = await res.json();
            // Only update if we have new messages to avoid overwriting local state
            if (data.messages && data.messages.length > 0) {
              setMessages(prevMessages => {
                const newMessages = data.messages.filter((msg: Message) => {
                  const existsById = prevMessages.some(prevMsg => prevMsg.id === msg.id);
                  if (existsById) return false;
                  // De-duplicate by content, sender type, and near timestamp (within 5s)
                  const existsByContentAndTime = prevMessages.some(prevMsg => 
                    prevMsg.senderType === msg.senderType &&
                    prevMsg.content === msg.content &&
                    Math.abs(new Date(prevMsg.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 5000
                  );
                  return !existsByContentAndTime;
                });
                return newMessages.length > 0 ? [...prevMessages, ...newMessages] : prevMessages;
              });
            }
          }
        } else if (formData.email && chatStep === 'message') {
          // Try to find existing chat for this email
          const res = await fetch('/api/chat/active');
          if (res.ok) {
            const data = await res.json();
            const match = (data.chats || []).find((c: any) => c.customerEmail === formData.email);
            if (match?.id) {
              setChatId(match.id);
              localStorage.setItem('chatId', match.id);
            }
          }
        }
      } catch (error) {
        console.error('Error polling chat state:', error);
      }
    }, 3000); // Increased interval to reduce server load

    return () => clearInterval(interval);
  }, [chatId, isOpen, formData.email, chatStep]);

  // Load existing chat if any and add welcome message
  useEffect(() => {
    const loadExistingChat = async () => {
      try {
        // Check if we have a chat session in localStorage
        const savedChatId = localStorage.getItem('chatId');
        
        if (savedChatId) {
          // Try to load existing chat
          const res = await fetch(`/api/chat/public/${savedChatId}`);
          if (res.ok) {
            const data = await res.json();
            setChatId(data.id);
            setMessages(data.messages);
            setChatStep('message'); // Skip to message step if chat exists
            return;
          } else {
            // Chat not found, clear localStorage
            localStorage.removeItem('chatId');
          }
        }

        // No existing chat, start new conversation
        setMessages([
          {
            id: 'welcome',
            content: 'Hello! How can I help you today?',
            senderType: 'ADMIN',
            createdAt: new Date().toISOString(),
            isRead: false
          }
        ]);
        setChatStep('welcome');
      } catch (error) {
        console.error('Error loading existing chat:', error);
      }
    };

    if (isOpen) {
      loadExistingChat();
    }
  }, [isOpen]);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to submit chat request');

      toast({
        title: 'Request Submitted',
        description: 'We will contact you shortly!',
      });

      setFormData({ name: '', email: '', message: '' });
      setShowForm(false);
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const currentMessage = newMessage.trim();
    setNewMessage(''); // Clear input immediately to prevent loss

    try {
      // Add user's message to UI immediately
      const clientId = `client-${Date.now()}-${Math.random()}`;
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content: currentMessage,
        senderType: 'CUSTOMER',
        createdAt: new Date().toISOString(),
        isRead: false,
        clientId
      };
      setMessages((prev: Message[]) => [...prev, userMessage]);

      // Handle conversation flow based on current step
      if (chatStep === 'welcome') {
        // Store first message and ask for name
        setFormData(prev => ({ ...prev, message: currentMessage }));
        
        setTimeout(() => {
          const botMessage: Message = {
            id: `bot-${Date.now()}`,
            content: 'Before we continue, could you please tell me your name?',
            senderType: 'ADMIN',
            createdAt: new Date().toISOString(),
            isRead: false
          };
          setMessages(prev => [...prev, botMessage]);
          setChatStep('name');
        }, 800);
        
      } else if (chatStep === 'name') {
        // Store name and ask for email
        setFormData(prev => ({ ...prev, name: currentMessage }));
        
        setTimeout(() => {
          const botMessage: Message = {
            id: `bot-${Date.now()}`,
            content: `Nice to meet you, ${currentMessage}! Could you please share your email address?`,
            senderType: 'ADMIN',
            createdAt: new Date().toISOString(),
            isRead: false
          };
          setMessages(prev => [...prev, botMessage]);
          setChatStep('email');
        }, 800);
        
      } else if (chatStep === 'email') {
        // Store email and ask how we can help
        setFormData(prev => ({ ...prev, email: currentMessage }));
        
        setTimeout(() => {
          const botMessage: Message = {
            id: `bot-${Date.now()}`,
            content: 'Thank you! Now, how can I assist you today?',
            senderType: 'ADMIN',
            createdAt: new Date().toISOString(),
            isRead: false
          };
          setMessages(prev => [...prev, botMessage]);
          setChatStep('issue');
        }, 800);
        
      } else if (chatStep === 'issue') {
        // Store issue and transition to live chat
        setFormData(prev => ({ ...prev, message: currentMessage }));
        
        // Create chat session with all collected info
        try {
          const chatData = {
            name: formData.name,
            email: formData.email,
            message: `Initial inquiry: ${formData.message}\nIssue: ${currentMessage}`
          };
          
          const res = await fetch('/api/chat/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chatData)
          });

          if (!res.ok) throw new Error('Failed to create chat');
          
          const data = await res.json();
          
          if (data.chat) {
            setChatId(data.chat.id);
            localStorage.setItem('chatId', data.chat.id);
            
            // Add confirmation message
            setTimeout(() => {
              const botMessage: Message = {
                id: `bot-${Date.now()}`,
                content: 'Perfect! I\'ve connected you with our support team. An admin will respond shortly.',
                senderType: 'ADMIN',
                createdAt: new Date().toISOString(),
                isRead: false
              };
              setMessages(prev => [...prev, botMessage]);
              setChatStep('message'); // Now in live chat mode
            }, 800);
          } else {
            // Fallback if no admin available
            setTimeout(() => {
              const botMessage: Message = {
                id: `bot-${Date.now()}`,
                content: 'All our agents are currently busy. Your request has been submitted and we\'ll get back to you soon!',
                senderType: 'ADMIN',
                createdAt: new Date().toISOString(),
                isRead: false
              };
              setMessages(prev => [...prev, botMessage]);
            }, 800);
          }
        } catch (error) {
          console.error('Error creating chat:', error);
          setTimeout(() => {
            const botMessage: Message = {
              id: `bot-${Date.now()}`,
              content: 'Sorry, there was an issue connecting you to our team. Please try again or contact us directly.',
              senderType: 'ADMIN',
              createdAt: new Date().toISOString(),
              isRead: false
            };
            setMessages(prev => [...prev, botMessage]);
          }, 800);
        }
        
      } else if (chatStep === 'message') {
        // Live chat mode - send to existing chat or create new one
        if (chatId) {
          // Send to existing chat using customer endpoint
          try {
            const res = await fetch('/api/chat/customer-message', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: currentMessage,
                chatId: chatId
              })
            });
            
            if (!res.ok) {
              throw new Error('Failed to send message');
            }
            
            // Replace the temporary client message with the saved one (prevents duplicates during polling)
            try {
              const saved = await res.json();
              setMessages(prev => prev.map(m => (m.clientId === clientId ? saved : m)) as Message[]);
            } catch {}
            
            // Emit via socket for real-time updates
            if (socket && socket.connected) {
              socket.emit('message', {
                content: currentMessage,
                senderType: 'CUSTOMER',
                chatId: chatId,
                senderId: null
              });
            }
          } catch (error) {
            console.error('Error sending message:', error);
            // Show error message
            setTimeout(() => {
              const errorMessage: Message = {
                id: `error-${Date.now()}`,
                content: 'Message failed to send. Please try again.',
                senderType: 'ADMIN',
                createdAt: new Date().toISOString(),
                isRead: false
              };
              setMessages(prev => [...prev, errorMessage]);
            }, 500);
          }
        } else {
          // No chat ID - try to create or find existing chat
          try {
            const res = await fetch('/api/chat/request', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: formData.name || 'Customer',
                email: formData.email || 'customer@example.com',
                message: currentMessage
              })
            });

            if (res.ok) {
              const data = await res.json();
              if (data.chat) {
                setChatId(data.chat.id);
                localStorage.setItem('chatId', data.chat.id);
              }
            }
          } catch (error) {
            console.error('Error creating chat:', error);
          }
        }
      }

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
      
      // Restore message to input if there was an error
      setNewMessage(currentMessage);
    }
  };

  const handleTyping = () => {
    if (!socket || !chatId) return;

    socket.emit('customer_typing', { chatId, isTyping: true });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('customer_typing', { chatId, isTyping: false });
    }, 2000);
  };

  const resetChat = () => {
    try {
      localStorage.removeItem('chatId');
    } catch {}
    setChatId(null);
    setFormData({ name: '', email: '', message: '' });
    setNewMessage(''); // Clear any pending message
    setMessages([
      {
        id: 'welcome',
        content: 'Hello! How can I help you today?',
        senderType: 'ADMIN',
        createdAt: new Date().toISOString(),
        isRead: false
      }
    ]);
    setChatStep('welcome');
    setIsMinimized(false);
    setShowOptions(false); // Close FAQ if open
    setSelectedFAQ(null); // Clear selected FAQ
  };

  return (
    <AnimatePresence>
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        {/* Chat Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="flex flex-col items-end gap-1"
        >
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg px-4 py-2 mb-1 border border-gray-200 dark:border-gray-700 flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                Have a question? We are ready to help you
              </p>
            </motion.div>
          )}
          <Button
            size="lg"
            className="rounded-full p-4 shadow-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>

        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-16 right-0"
            >
              <Card className="w-[340px] max-h-[600px] shadow-xl rounded-xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 bg-primary">
                  <CardTitle className="text-xl font-semibold text-primary-foreground">
                    Live Support
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetChat}
                      title="Start new chat"
                      className="text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className={`p-3 max-h-[440px] overflow-y-auto ${isMinimized ? 'hidden' : ''}`}>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : showForm ? (
                    // Contact Form
                    <form onSubmit={handleSubmitForm} className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          All our executives are currently busy. Please fill out this quick form and our team will contact you instantly.
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <Input
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                        <Input
                          type="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                        <Textarea
                          placeholder="Your Message"
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Send Message'
                        )}
                      </Button>
                    </form>
                  ) : (
                    // Chat Interface
                    <div className="space-y-3">
                      {/* Call Image - Full Width Professional Display */}
                      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3 shadow-md border border-border">
                        <Image
                          src="/Call-image.jpg"
                          alt="Call us for assistance"
                          fill
                          className="object-cover"
                          sizes="(max-width: 340px) 340px, 340px"
                          priority
                          unoptimized
                        />
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b">
                        <Badge 
                          variant={adminStatus === 'AVAILABLE' ? 'default' : 'secondary'}
                          className={adminStatus === 'AVAILABLE' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                        >
                          <span className="flex items-center gap-2">
                            {adminStatus === 'AVAILABLE' && (
                              <motion.span
                                className="w-2 h-2 bg-white rounded-full"
                                animate={{
                                  opacity: [1, 0.5, 1],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            )}
                            {adminStatus === 'AVAILABLE' ? 'Online' : 'Offline'}
                          </span>
                        </Badge>
                        {/* Icon toolbar */}
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant={chatStep === 'message' && !showOptions ? 'default' : 'ghost'}
                            size="icon"
                            title="Start live chat"
                            onClick={() => {
                              setShowOptions(false);
                              setChatStep('message');
                            }}
                          >
                            <MessageCircle className="h-5 w-5" />
                          </Button>
                          <Button
                            variant={showOptions ? 'default' : 'ghost'}
                            size="icon"
                            title="Browse FAQ"
                            onClick={() => {
                              setShowOptions((v) => !v);
                              if (showOptions) {
                                setChatStep('message');
                              }
                            }}
                          >
                            <HelpCircle className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Call us: +852-537-5554-1"
                            onClick={() => {
                              window.open('tel:+852-537-5554-1');
                              setShowOptions(false);
                            }}
                          >
                            <Phone className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      {/* FAQ Section */}
                      {showOptions && (
                        <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Frequently Asked Questions</h3>
                            {/* <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setShowOptions(false);
                                setChatStep('message');
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button> */}
                          </div>
                          <ScrollArea className="max-h-[240px] pr-2">
                            <div className="space-y-2 text-sm">
                              {faqData.map((faq, index) => (
                                <div key={index} className="border-b border-blue-200 dark:border-blue-800 pb-2 last:border-b-0">
                                  <div 
                                    className="cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 font-medium text-blue-900 dark:text-blue-100 transition-colors"
                                    onClick={() => setSelectedFAQ(selectedFAQ === faq.question ? null : faq.question)}
                                  >
                                    • {faq.question}
                                  </div>
                                  {selectedFAQ === faq.question && (
                                    <div className="mt-2 p-3 bg-white dark:bg-blue-900/30 rounded-md text-gray-700 dark:text-gray-300 text-xs border border-blue-100 dark:border-blue-800">
                                      {faq.answer}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                          {/* <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setShowOptions(false);
                                setChatStep('message');
                              }}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Start live chat
                            </Button>
                          </div> */}
                        </div>
                      )}

                      {/* Chat Interface - Show during conversation flow and live chat */}
                      {!showOptions && (chatStep === 'welcome' || chatStep === 'name' || chatStep === 'email' || chatStep === 'issue' || chatStep === 'message') && (
                        <>
                          <ScrollArea className="h-[200px] pr-2">
                            <div className="space-y-3">
                              {messages.map((message) => (
                                <div
                                  key={message.id}
                                  className={`flex ${
                                    message.senderType === 'CUSTOMER' ? 'justify-end' : 'justify-start'
                                  }`}
                                >
                                  <div
                                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                                      message.senderType === 'CUSTOMER'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                    }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                      {new Date(message.createdAt).toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {isAdminTyping && chatStep === 'message' && (
                                <div className="flex justify-start">
                                  <div className="bg-muted rounded-lg px-4 py-2">
                                    <p className="text-sm">Admin is typing...</p>
                                  </div>
                                </div>
                              )}
                              <div ref={messagesEndRef} />
                            </div>
                          </ScrollArea>

                          <div className="flex items-center gap-2 pt-2">
                            <Input
                              placeholder={
                                chatStep === 'welcome' ? 'Type your message...' :
                                chatStep === 'name' ? 'Enter your name...' :
                                chatStep === 'email' ? 'Enter your email...' :
                                chatStep === 'issue' ? 'Describe your issue...' :
                                'Type your message...'
                              }
                              type={chatStep === 'email' ? 'email' : 'text'}
                              className="flex-1"
                              value={newMessage}
                              onChange={(e) => {
                                setNewMessage(e.target.value);
                                if (chatStep === 'message') {
                                  handleTyping();
                                }
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleSendMessage();
                                }
                              }}
                            />
                            <Button
                              size="icon"
                              onClick={handleSendMessage}
                              disabled={!newMessage.trim()}
                              className="flex-shrink-0"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
