'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { io, Socket } from 'socket.io-client';
import {
  MessageCircle,
  Send,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface ChatRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

interface Chat {
  id: string;
  customerName: string;
  customerEmail: string;
  lastMessageAt: string;
  status: 'ACTIVE' | 'CLOSED';
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  senderType: 'ADMIN' | 'CUSTOMER';
  createdAt: string;
  isRead: boolean;
}

export default function AdminChatsPage() {
  const { toast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [adminStatus, setAdminStatus] = useState<'AVAILABLE' | 'BUSY' | 'OFFLINE'>('OFFLINE');
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [activeChats, setActiveChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);

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

    socketInstance.on('new_chat_request', (request: ChatRequest) => {
      setChatRequests(prev => [request, ...prev]);
      toast({
        title: 'New Chat Request',
        description: `From: ${request.name}`,
      });
    });

    socketInstance.on('message', (message: Message) => {
      if (selectedChat && message.senderType === 'CUSTOMER') {
        setSelectedChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, message]
        } : null);
      }
    });

    socketInstance.on('customer_typing', ({ chatId, isTyping }: { chatId: string; isTyping: boolean }) => {
      if (selectedChat?.id === chatId) {
        setIsCustomerTyping(isTyping);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [selectedChat, toast]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [requestsRes, chatsRes, statusRes] = await Promise.all([
          fetch('/api/chat/requests'),
          fetch('/api/chat/active'),
          fetch('/api/chat/admin-status')
        ]);

        const [requestsData, chatsData, statusData] = await Promise.all([
          requestsRes.json(),
          chatsRes.json(),
          statusRes.json()
        ]);

        setChatRequests(requestsData.requests);
        setActiveChats(chatsData.chats);
        setAdminStatus(statusData.status);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load chat data',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    loadData();

    // Poll for new messages every 2 seconds
    const interval = setInterval(async () => {
      if (selectedChat) {
        try {
          const res = await fetch(`/api/chat/${selectedChat.id}`);
          if (res.ok) {
            const data = await res.json();
            setSelectedChat(data);
          }
        } catch (error) {
          console.error('Error polling for messages:', error);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedChat, toast]);

  const handleStatusToggle = async () => {
    try {
      const newStatus = adminStatus === 'AVAILABLE' ? 'BUSY' : 'AVAILABLE';
      
      const res = await fetch('/api/chat/admin-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');

      setAdminStatus(newStatus);
      socket?.emit('admin_status_change', newStatus);

      toast({
        title: 'Status Updated',
        description: `You are now ${newStatus.toLowerCase()}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleAcceptRequest = async (request: ChatRequest) => {
    try {
      const res = await fetch(`/api/chat/requests/${request.id}/accept`, {
        method: 'POST'
      });

      if (!res.ok) throw new Error('Failed to accept request');

      const data = await res.json();
      
      // Remove from requests and add to active chats
      setChatRequests(prev => prev.filter(r => r.id !== request.id));
      setActiveChats(prev => [data.chat, ...prev]);
      setSelectedChat(data.chat);

      toast({
        title: 'Chat Started',
        description: `Chat with ${request.name} has begun`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start chat',
        variant: 'destructive'
      });
    }
  };

  const handleRejectRequest = async (request: ChatRequest) => {
    try {
      const res = await fetch(`/api/chat/requests/${request.id}/reject`, {
        method: 'POST'
      });

      if (!res.ok) throw new Error('Failed to reject request');

      setChatRequests(prev => prev.filter(r => r.id !== request.id));

      toast({
        title: 'Request Rejected',
        description: `Chat request from ${request.name} was rejected`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject request',
        variant: 'destructive'
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      // Save message to database first
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          senderType: 'ADMIN',
          chatId: selectedChat.id,
          senderId: 'admin' // You might want to get this from session
        })
      });

      if (!res.ok) throw new Error('Failed to save message');

      const savedMessage = await res.json();

      // Update UI
      setSelectedChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, savedMessage]
      } : null);

      setNewMessage('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  const handleCloseChat = async (chat: Chat) => {
    try {
      const res = await fetch(`/api/chat/${chat.id}/close`, {
        method: 'POST'
      });

      if (!res.ok) throw new Error('Failed to close chat');

      setActiveChats(prev => prev.filter(c => c.id !== chat.id));
      if (selectedChat?.id === chat.id) {
        setSelectedChat(null);
      }

      toast({
        title: 'Chat Closed',
        description: `Chat with ${chat.customerName} has been closed`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to close chat',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Chat Management</h1>
        <div className="flex items-center gap-4">
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          <Button
            variant={adminStatus === 'AVAILABLE' ? 'default' : 'secondary'}
            onClick={handleStatusToggle}
          >
            {adminStatus === 'AVAILABLE' ? 'Set as Busy' : 'Set as Available'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <div className="col-span-4">
          <Tabs defaultValue="active">
            <TabsList className="w-full">
              <TabsTrigger value="active" className="flex-1">
                Active Chats
                {(activeChats?.length ?? 0) > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeChats?.length ?? 0}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex-1">
                Requests
                {(chatRequests?.length ?? 0) > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {chatRequests?.length ?? 0}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <ScrollArea className="h-[600px]">
                    {(activeChats?.length ?? 0) === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No active chats
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {(activeChats ?? []).map((chat) => (
                          <div
                            key={chat.id}
                            className={`p-4 rounded-lg cursor-pointer transition-colors ${
                              selectedChat?.id === chat.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                            onClick={() => setSelectedChat(chat)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{chat.customerName}</p>
                                <p className="text-sm opacity-70">{chat.customerEmail}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCloseChat(chat);
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="mt-2 text-sm opacity-70">
                              Last active: {new Date(chat.lastMessageAt).toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <ScrollArea className="h-[600px]">
                    {(chatRequests?.length ?? 0) === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No pending requests
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(chatRequests ?? []).map((request) => (
                          <Card key={request.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{request.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {request.email}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleAcceptRequest(request)}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRejectRequest(request)}
                                  >
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                              <p className="mt-2 text-sm">{request.message}</p>
                              <p className="mt-2 text-xs text-muted-foreground">
                                Received: {new Date(request.createdAt).toLocaleString()}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Area */}
        <div className="col-span-8">
          <Card className="h-[700px] flex flex-col">
            {selectedChat ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedChat.customerName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedChat.customerEmail}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCloseChat(selectedChat)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-4 overflow-auto">
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                      {selectedChat.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${
                              message.senderType === 'ADMIN'
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
                      {isCustomerTyping && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg px-4 py-2">
                            <p className="text-sm">Customer is typing...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>

                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
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
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>Select a chat to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
