
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Send, MessageSquare, MoreVertical } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/formatters';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  content: string;
  timestamp: Date;
  read: boolean;
  isSystemMessage?: boolean;
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    role: 'provider' | 'customer' | 'admin';
  }[];
  lastMessage: {
    content: string;
    timestamp: Date;
    senderId: string;
    read: boolean;
  };
  unreadCount: number;
}

const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participants: [
      { id: 'user1', name: 'Jane Cooper', avatar: 'https://randomuser.me/api/portraits/women/10.jpg', role: 'customer' },
      { id: 'user2', name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', role: 'provider' }
    ],
    lastMessage: {
      content: 'Is the service still available for tomorrow?',
      timestamp: new Date('2025-04-04T14:30:00'),
      senderId: 'user1',
      read: false
    },
    unreadCount: 2
  },
  {
    id: 'conv2',
    participants: [
      { id: 'user3', name: 'Robert Fox', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', role: 'customer' },
      { id: 'user4', name: 'Alice Johnson', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', role: 'provider' }
    ],
    lastMessage: {
      content: 'Thank you for completing the service!',
      timestamp: new Date('2025-04-04T10:15:00'),
      senderId: 'user3',
      read: true
    },
    unreadCount: 0
  },
  {
    id: 'conv3',
    participants: [
      { id: 'user5', name: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', role: 'provider' },
      { id: 'user6', name: 'Michael Davis', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', role: 'customer' }
    ],
    lastMessage: {
      content: 'I need to reschedule the appointment, is that possible?',
      timestamp: new Date('2025-04-03T18:45:00'),
      senderId: 'user6',
      read: false
    },
    unreadCount: 1
  },
  {
    id: 'conv4',
    participants: [
      { id: 'user7', name: 'Emily Johnson', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', role: 'customer' },
      { id: 'user8', name: 'Tech Support', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', role: 'admin' }
    ],
    lastMessage: {
      content: 'I reported an issue with payment verification',
      timestamp: new Date('2025-04-03T09:20:00'),
      senderId: 'user7',
      read: true
    },
    unreadCount: 0
  }
];

const mockMessages: Record<string, Message[]> = {
  'conv1': [
    {
      id: 'msg1',
      senderId: 'user2',
      senderName: 'John Smith',
      senderAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      recipientId: 'user1',
      recipientName: 'Jane Cooper',
      recipientAvatar: 'https://randomuser.me/api/portraits/women/10.jpg',
      content: 'Hello! How can I help you today?',
      timestamp: new Date('2025-04-04T14:20:00'),
      read: true
    },
    {
      id: 'msg2',
      senderId: 'user1',
      senderName: 'Jane Cooper',
      senderAvatar: 'https://randomuser.me/api/portraits/women/10.jpg',
      recipientId: 'user2',
      recipientName: 'John Smith',
      recipientAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      content: 'I\'m interested in booking your cleaning service.',
      timestamp: new Date('2025-04-04T14:25:00'),
      read: true
    },
    {
      id: 'msg3',
      senderId: 'user1',
      senderName: 'Jane Cooper',
      senderAvatar: 'https://randomuser.me/api/portraits/women/10.jpg',
      recipientId: 'user2',
      recipientName: 'John Smith',
      recipientAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      content: 'Is the service still available for tomorrow?',
      timestamp: new Date('2025-04-04T14:30:00'),
      read: false
    }
  ],
  'conv2': [
    {
      id: 'msg4',
      senderId: 'user4',
      senderName: 'Alice Johnson',
      senderAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      recipientId: 'user3',
      recipientName: 'Robert Fox',
      recipientAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      content: 'I\'ve completed the plumbing repair. Please let me know if everything looks good!',
      timestamp: new Date('2025-04-04T10:10:00'),
      read: true
    },
    {
      id: 'msg5',
      senderId: 'user3',
      senderName: 'Robert Fox',
      senderAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      recipientId: 'user4',
      recipientName: 'Alice Johnson',
      recipientAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      content: 'Thank you for completing the service!',
      timestamp: new Date('2025-04-04T10:15:00'),
      read: true
    }
  ]
};

const AdminMessagesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeConversation, setActiveConversation] = useState<string | null>('conv1');
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = mockConversations.filter(conversation => {
    const participantNames = conversation.participants.map(p => p.name.toLowerCase()).join(' ');
    return participantNames.includes(searchTerm.toLowerCase());
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage, 'to conversation:', activeConversation);
      setNewMessage('');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Message Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor conversations between users and providers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
          {/* Conversations List */}
          <Card className="col-span-1 overflow-hidden border">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="px-2 py-1 border-b bg-gray-50">
              <Tabs defaultValue="all">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="h-[calc(100vh-350px)]">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    activeConversation === conversation.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <img
                        src={conversation.participants[0].avatar}
                        alt={conversation.participants[0].name}
                        className="h-full w-full object-cover"
                      />
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{conversation.participants[0].name}</span>
                        <Badge className="ml-2 text-xs" variant="outline">
                          {conversation.participants[0].role}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="truncate max-w-[120px] inline-block">
                          {conversation.lastMessage.content}
                        </span>
                        <span className="mx-1">·</span>
                        <span className="text-xs">
                          {formatDate(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {conversation.unreadCount > 0 && (
                    <Badge className="bg-primary">{conversation.unreadCount}</Badge>
                  )}
                </div>
              ))}
            </ScrollArea>
          </Card>

          {/* Messages */}
          <Card className="col-span-2 flex flex-col h-full">
            {activeConversation ? (
              <>
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <img
                        src={mockConversations.find(c => c.id === activeConversation)?.participants[0].avatar}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {mockConversations.find(c => c.id === activeConversation)?.participants[0].name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {mockConversations.find(c => c.id === activeConversation)?.participants.map(p => p.role).join(' & ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Mark all as read</DropdownMenuItem>
                        <DropdownMenuItem>Export conversation</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Close conversation</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {mockMessages[activeConversation]?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === 'admin' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] flex ${
                            message.senderId === 'admin' ? 'flex-row-reverse' : 'flex-row'
                          } items-end gap-2`}
                        >
                          {message.senderId !== 'admin' && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <img
                                src={message.senderAvatar}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg p-3 ${
                              message.senderId === 'admin'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="text-sm">{message.content}</div>
                            <div
                              className={`text-xs mt-1 ${
                                message.senderId === 'admin'
                                  ? 'text-primary-foreground/80'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {formatDate(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                    <MessageSquare className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium">Select a conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a conversation from the list to monitor
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminMessagesPage;
