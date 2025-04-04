
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Conversation, Message } from '@/types/conversations';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useConversations';
import ConversationList from '@/components/messages/ConversationList';
import MessageThread from '@/components/messages/MessageThread';

const MessagesPage = () => {
  const { user } = useAuth();
  const { 
    conversations, 
    messages, 
    loading, 
    activeConversation,
    setActiveConversation,
    sendMessage
  } = useConversations();
  
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const isLoading = loading;

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation.id);
    setCurrentConversation(conversation);
  };

  const handleSendMessage = (content: string) => {
    if (!activeConversation || !content.trim()) return;
    
    const recipientId = currentConversation?.participants.find(
      p => p.id !== user?.id
    )?.id;
    
    if (!recipientId) return;
    
    sendMessage(activeConversation, content, recipientId);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-140px)]">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        
        <Card className="flex flex-1 overflow-hidden">
          <div className="w-full md:w-1/3 border-r">
            <ConversationList 
              conversations={conversations} 
              activeConversationId={activeConversation}
              onSelectConversation={handleSelectConversation}
              isLoading={isLoading}
              currentUserId={user?.id || ''}
            />
          </div>
          
          <div className="hidden md:flex flex-1 flex-col">
            {activeConversation && messages[activeConversation] ? (
              <MessageThread 
                messages={messages[activeConversation] || []} 
                currentUserId={user?.id || ''}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation or start a new one
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
