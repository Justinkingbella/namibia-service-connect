
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { Conversation } from '@/types/conversations';
import { formatDate } from '@/lib/utils';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading?: boolean;
  currentUserId: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  isLoading = false,
  currentUserId
}) => {
  // Get other participant from a conversation
  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== currentUserId) || {
      id: '',
      name: 'Unknown User',
      avatar: ''
    };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search messages" 
              className="pl-8"
              disabled={isLoading}
            />
          </div>
          <Button size="icon" variant="ghost">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-muted-foreground">No conversations yet</p>
            <Button variant="link" size="sm" className="mt-2">
              Start a new conversation
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map(conversation => {
              const otherParticipant = getOtherParticipant(conversation);
              const displayName = conversation.serviceName || 
                                 otherParticipant.name || 
                                 'Unknown User';
              
              return (
                <div
                  key={conversation.id}
                  className={`
                    p-3 hover:bg-muted cursor-pointer
                    ${activeConversationId === conversation.id ? 'bg-muted' : ''}
                  `}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={otherParticipant.avatar || ''} alt={displayName} />
                      <AvatarFallback>
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm truncate">
                          {displayName}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {conversation.lastMessageDate ? 
                            formatDate(conversation.lastMessageDate) : ''}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage || 'No messages yet'}
                        </p>
                        
                        {conversation.unreadCount > 0 && (
                          <span className="ml-2 flex-shrink-0 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
