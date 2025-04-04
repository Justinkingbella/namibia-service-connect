
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { useConversations } from '@/hooks/useConversations';
import ConversationList from '@/components/messages/ConversationList';
import MessageThread from '@/components/messages/MessageThread';
import { Conversation } from '@/types';

const MessagesPage = () => {
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const { conversations, messages, loading, activeConversation, setActiveConversation, sendMessage, createConversation } = useConversations();
  
  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setActiveConversation(conversation.id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with service providers and customers</p>
        </div>
        
        <Card className="p-0 overflow-hidden">
          <div className="flex flex-col md:flex-row h-[70vh]">
            <div className="w-full md:w-1/3 border-r">
              <ConversationList 
                conversations={conversations}
                activeConversationId={activeConversation}
                onSelectConversation={handleSelectConversation}
                isLoading={loading}
              />
            </div>
            
            <div className="w-full md:w-2/3">
              <MessageThread 
                conversation={currentConversation}
                messages={activeConversation ? messages[activeConversation] || [] : []}
                onSendMessage={(content) => sendMessage(activeConversation, content)}
                isLoading={loading}
              />
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
