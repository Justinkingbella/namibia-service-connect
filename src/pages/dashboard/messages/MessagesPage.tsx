
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, Send, User } from 'lucide-react';
import { Button } from '@/components/common/Button';
import ConversationList from '@/components/messages/ConversationList';
import MessageThread from '@/components/messages/MessageThread';
import { toast } from '@/hooks/use-toast';
import { Conversation, Message } from '@/types/message';

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    recipientId: '101',
    recipientName: 'Jane Smith',
    recipientAvatar: '/placeholder.svg',
    lastMessage: 'When will you arrive for the cleaning service?',
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
  },
  {
    id: '2',
    recipientId: '102',
    recipientName: 'Michael Johnson',
    recipientAvatar: '/placeholder.svg',
    lastMessage: 'The plumbing service was great, thank you!',
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
  },
  {
    id: '3',
    recipientId: '103',
    recipientName: 'Sarah Williams',
    recipientAvatar: '/placeholder.svg',
    lastMessage: 'I need to reschedule my appointment.',
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
  },
  {
    id: '4',
    recipientId: '104',
    recipientName: 'David Brown',
    recipientAvatar: '/placeholder.svg',
    lastMessage: 'Is the quote still valid?',
    lastMessageDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    unreadCount: 0,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1-1',
      conversationId: '1',
      senderId: '101',
      text: 'Hello, I booked a cleaning service for tomorrow.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isRead: true,
    },
    {
      id: '1-2',
      conversationId: '1',
      senderId: 'current-user',
      text: "Yes, I see your booking. I'll be there at 10 AM.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: true,
    },
    {
      id: '1-3',
      conversationId: '1',
      senderId: '101',
      text: 'Perfect! Do I need to prepare anything?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isRead: true,
    },
    {
      id: '1-4',
      conversationId: '1',
      senderId: 'current-user',
      text: "Just ensure access to all areas that need cleaning. I'll bring all supplies.",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      isRead: true,
    },
    {
      id: '1-5',
      conversationId: '1',
      senderId: '101',
      text: 'When will you arrive for the cleaning service?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isRead: false,
    },
  ],
  '2': [
    {
      id: '2-1',
      conversationId: '2',
      senderId: '102',
      text: 'Thank you for fixing my sink yesterday.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      isRead: true,
    },
    {
      id: '2-2',
      conversationId: '2',
      senderId: 'current-user',
      text: 'Happy to help! Let me know if there are any other issues.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      isRead: true,
    },
    {
      id: '2-3',
      conversationId: '2',
      senderId: '102',
      text: 'The plumbing service was great, thank you!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
    },
  ],
};

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conversation =>
    conversation.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Mark messages as read
    if (conversationId) {
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 } 
            : conv
        )
      );
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // In a real app, you would send this to an API
    const newMsg: Message = {
      id: `new-${Date.now()}`,
      conversationId: selectedConversation,
      senderId: 'current-user',
      text: newMessage,
      timestamp: new Date(),
      isRead: true,
    };

    mockMessages[selectedConversation] = [
      ...(mockMessages[selectedConversation] || []),
      newMsg,
    ];

    // Update conversation last message
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === selectedConversation
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageDate: new Date(),
            }
          : conv
      )
    );

    setNewMessage('');
    
    // Show toast confirmation
    toast({
      title: "Message sent",
      description: "Your message has been delivered."
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with your service providers and customers</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="col-span-1 border overflow-hidden">
          <CardHeader className="p-4 border-b bg-muted/20">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto h-[calc(100vh-280px)]">
            <ConversationList
              conversations={filteredConversations}
              selectedId={selectedConversation}
              onSelect={handleSelectConversation}
            />
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col border overflow-hidden h-full">
          {selectedConversation ? (
            <>
              <CardHeader className="py-3 px-4 border-b flex flex-row items-center">
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-base font-medium">
                  {conversations.find(c => c.id === selectedConversation)?.recipientName}
                </CardTitle>
              </CardHeader>
              <div className="flex-grow overflow-y-auto p-4 h-[calc(100vh-360px)]">
                <MessageThread
                  messages={mockMessages[selectedConversation] || []}
                />
              </div>
              <div className="p-3 border-t">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    variant="primary"
                    size="md"
                    className="px-4 flex-shrink-0"
                    disabled={!newMessage.trim()}
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="rounded-full bg-primary/10 p-6 mb-4">
                <MessageSquare className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground max-w-sm">
                Select a conversation from the list to view messages or start a new conversation.
              </p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
