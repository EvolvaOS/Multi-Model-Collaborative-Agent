import React, { useRef, useEffect } from 'react';
import { PaperAirplaneIcon, PaperClipIcon } from './icons';

interface MessageInputProps {
  onSendMessage: () => void;
  isLoading: boolean;
  value: string;
  onChange: (value: string) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasAttachment: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, value, onChange, onFileSelect, hasAttachment }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((value.trim() || hasAttachment) && !isLoading) {
      onSendMessage();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 bg-gray-800 p-2 rounded-xl border border-gray-700 focus-within:border-blue-500 transition-colors">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileSelect}
        className="hidden" 
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={handleAttachmentClick}
        disabled={isLoading}
        className="p-2 rounded-lg text-gray-400 disabled:text-gray-600 hover:bg-gray-700 hover:text-white transition-colors focus:outline-none"
        aria-label="Attach file"
      >
        <PaperClipIcon className="h-5 w-5" />
      </button>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="請輸入您的訊息或引用一則記憶..."
        className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none resize-none max-h-48"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || (!value.trim() && !hasAttachment)}
        className="p-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
        aria-label="Send message"
      >
        <PaperAirplaneIcon className="h-5 w-5" />
      </button>
    </form>
  );
};