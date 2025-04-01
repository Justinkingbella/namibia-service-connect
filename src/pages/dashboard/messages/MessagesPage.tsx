
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, Send, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import ConversationList from '@/components/messages/ConversationList';
import MessageThread from '@/components/messages/MessageThread';
import { toast } from '@/hooks/use-toast';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/contexts/AuthContext';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    conversations, 
    currentConversation, 
    messages, 
    loading,
    setCurrentConversation,
    sendMessage
  } = useConversations();
  
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const filteredConversations = conversations.filter(conversation =>
    conversation.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversation(conversationId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentConversation || !user) return;

    setSendingMessage(true);
    const success = await sendMessage(currentConversation, newMessage.trim());
    setSendingMessage(false);
    
    if (success) {
      setNewMessage('');
    }
  };

  const currentConversationData = currentConversation 
    ? conversations.find(c => c.id === currentConversation) 
    : null;

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
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ConversationList
                conversations={filteredConversations}
                selectedId={currentConversation}
                onSelect={handleSelectConversation}
              />
            )}
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col border overflow-hidden h-full">
          {currentConversation && currentConversationData ? (
            <>
              <CardHeader className="py-3 px-4 border-b flex flex-row items-center">
                <Avatar className="h-9 w-9 mr-3">
                  {currentConversationData.recipientAvatar ? (
                    <AvatarImage src={currentConversationData.recipientAvatar} alt={currentConversationData.recipientName} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <CardTitle className="text-base font-medium">
                  {currentConversationData.recipientName}
                </CardTitle>
              </CardHeader>
              <div className="flex-grow overflow-y-auto p-4 h-[calc(100vh-360px)]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <MessageThread
                    messages={messages[currentConversation] || []}
                    currentUserId={user?.id}
                  />
                )}
              </div>
              <div className="p-3 border-t">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    className="flex-1"
                    disabled={sendingMessage}
                  />
                  <Button
                    variant="primary"
                    size="md"
                    className="px-4 flex-shrink-0"
                    disabled={!newMessage.trim() || sendingMessage}
                    onClick={handleSendMessage}
                  >
                    {sendingMessage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
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
