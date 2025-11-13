import React, { useRef, useEffect } from 'react';
import { type Message, type Attachment } from '../types';
import { MessageComponent } from './Message';
import { MessageInput } from './MessageInput';
import { AttachmentPreview } from './AttachmentPreview';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: () => void;
  input: string;
  onInputChange: (value: string) => void;
  attachment: Attachment | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  isLoading, 
  onSendMessage, 
  input, 
  onInputChange,
  attachment,
  onFileSelect,
  onRemoveAttachment
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const mainContentClasses = `fixed bottom-0 left-0 right-0 p-2 bg-gray-900 border-t border-gray-700 md:left-80`;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {messages.map((msg) => (
          <MessageComponent key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start max-w-4xl mx-auto w-full px-4">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-0"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-400"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
       <div className={mainContentClasses}>
           <div className="max-w-4xl mx-auto">
                {attachment && (
                  <AttachmentPreview 
                    attachment={attachment} 
                    onRemove={onRemoveAttachment} 
                  />
                )}
                <MessageInput 
                    onSendMessage={onSendMessage} 
                    isLoading={isLoading}
                    value={input}
                    onChange={onInputChange}
                    onFileSelect={onFileSelect}
                    hasAttachment={!!attachment}
                />
           </div>
        </div>
    </div>
  );
};