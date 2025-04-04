
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { Conversation } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations, 
  activeConversationId, 
  onSelectConversation,
  isLoading 
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8" />
          </div>
          <Button size="icon" variant="ghost">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <ConversationSkeleton key={i} />
            ))}
          </div>
        ) : conversations.length > 0 ? (
          <div>
            {conversations.map((conversation) => (
              <div 
                key={conversation.id} 
                className={`p-3 hover:bg-muted/50 cursor-pointer ${
                  activeConversationId === conversation.id ? 'bg-muted' : ''
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarImage src={conversation.recipientAvatar} />
                    <AvatarFallback>
                      {(conversation.recipientName?.[0] || '?').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">
                        {conversation.recipientName || 'Unknown User'}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {conversation.lastMessageDate ? formatDate(conversation.lastMessageDate) : ''}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-0.5">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    
                    {conversation.serviceName && (
                      <div className="mt-1">
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {conversation.serviceName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium">No conversations yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your conversations will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ConversationSkeleton = () => (
  <div className="flex items-start space-x-3">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-10" />
      </div>
      <Skeleton className="h-3 w-full mt-2" />
    </div>
  </div>
);

export default ConversationList;
