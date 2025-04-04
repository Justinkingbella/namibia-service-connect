
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useConversations } from '@/hooks/useConversations';
import { ConversationList } from '@/components/messages/ConversationList';
import { MessageThread } from '@/components/messages/MessageThread';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MessagesPage = () => {
  const { user } = useAuth();
  const { 
    conversations, 
    loading, 
    activeConversation, 
    setActiveConversation,
    sendMessage,
    createConversation
  } = useConversations();

  // Handle initial selection if needed
  useEffect(() => {
    if (!loading && conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0].id);
    }
  }, [loading, conversations, activeConversation, setActiveConversation]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground mt-1">Communicate with customers and service providers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="md:col-span-1 h-[calc(100vh-200px)] overflow-hidden flex flex-col">
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ConversationList 
                conversations={conversations}
                activeConversationId={activeConversation}
                onSelectConversation={setActiveConversation}
                loading={loading}
              />
            </CardContent>
          </Card>
          
          {/* Message Thread */}
          <Card className="md:col-span-2 h-[calc(100vh-200px)] overflow-hidden flex flex-col">
            <CardContent className="p-0 flex-1 overflow-hidden">
              {activeConversation ? (
                <MessageThread 
                  conversationId={activeConversation}
                  onSendMessage={(content) => sendMessage(activeConversation, content)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  {loading ? (
                    <div className="animate-pulse flex flex-col items-center justify-center">
                      <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  ) : conversations.length > 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="font-medium">Select a conversation</h3>
                      <p className="text-sm text-muted-foreground">Choose a conversation from the list to view messages</p>
                    </div>
                  ) : (
                    <Alert className="mx-auto w-4/5 bg-muted/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No messages yet</AlertTitle>
                      <AlertDescription>
                        You don't have any conversations yet. When you book services or contact providers, your messages will appear here.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
