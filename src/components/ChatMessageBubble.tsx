import React from 'react';
import { ChatMessage } from '@/types';
import { COLORS } from '@/constants';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isSender: boolean; // True if the current user is the sender of this message
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, isSender }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const bubbleClasses = isSender
    ? 'bg-orange-energia text-white self-end rounded-l-xl rounded-tr-xl'
    : 'bg-cinza-neutro/20 text-grafite-profundo self-start rounded-r-xl rounded-tl-xl';

  const alignmentClasses = isSender ? 'ml-auto' : 'mr-auto';

  return (
    <div className={`flex mb-3 ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] md:max-w-[60%] p-3 shadow ${bubbleClasses} ${alignmentClasses}`}>
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <p className={`text-xs mt-1 ${isSender ? 'text-white/70 text-right' : 'text-cinza-neutro text-left'}`}>
          {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default ChatMessageBubble;