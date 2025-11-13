
import React, { useMemo } from 'react';
import { type Message, type ParsedPart } from '../types';
import { SparklesIcon, ShieldCheckIcon, ClipboardListIcon, BrainIcon } from './icons';

interface MessageProps {
  message: Message;
}

const parseMMCAResponse = (content: string): ParsedPart[] => {
  const regex = /\[(A|B|C|Agent)\]/g;
  const parts: ParsedPart[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'Unknown',
        content: content.substring(lastIndex, match.index).trim(),
      });
    }
    const type = match[1] as 'A' | 'B' | 'C' | 'Agent';
    const nextMatch = content.slice(match.index + match[0].length);
    const nextTagMatch = /\[(A|B|C|Agent)\]/.exec(nextMatch);
    const partContent = nextTagMatch 
      ? nextMatch.substring(0, nextTagMatch.index).trim() 
      : nextMatch.trim();

    parts.push({ type, content: partContent });
    lastIndex = match.index + match[0].length + partContent.length + (nextTagMatch ? nextTagMatch.index : 0);
  }
  
  if (parts.length === 0 && content.trim()) {
    return [{ type: 'Unknown', content }];
  }

  // Handle case where agent response doesn't start with a tag
  if (parts.length > 0 && content.search(/\[(A|B|C|Agent)\]/) > 0) {
      const initialContent = content.substring(0, content.search(/\[(A|B|C|Agent)\]/)).trim();
      return [{type: 'Agent', content: initialContent}];
  }


  return parts;
};

const PartCard: React.FC<{ part: ParsedPart }> = ({ part }) => {
  const config = {
    A: {
      title: '模型 A：初步答案',
      icon: <SparklesIcon className="h-5 w-5 text-indigo-400" />,
      borderColor: 'border-indigo-500',
    },
    B: {
      title: '模型 B：事實核查',
      icon: <ShieldCheckIcon className="h-5 w-5 text-green-400" />,
      borderColor: 'border-green-500',
    },
    C: {
      title: '模型 C：補充延伸',
      icon: <ClipboardListIcon className="h-5 w-5 text-amber-400" />,
      borderColor: 'border-amber-500',
    },
    Agent: {
      title: 'Agent：綜合回應',
      icon: <BrainIcon className="h-5 w-5 text-rose-400" />,
      borderColor: 'border-rose-500',
    },
    Unknown: {
      title: '回應',
      icon: <BrainIcon className="h-5 w-5 text-gray-400" />,
      borderColor: 'border-gray-600',
    },
  }[part.type];

  if (!part.content) return null;

  return (
    <div className={`bg-gray-800/50 border-l-4 ${config.borderColor} rounded-r-lg p-4`}>
      <div className="flex items-center gap-3 mb-2">
        {config.icon}
        <h3 className="font-semibold text-sm text-gray-300">{config.title}</h3>
      </div>
      <p className="text-gray-200 whitespace-pre-wrap">{part.content}</p>
    </div>
  );
};

export const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  const parsedContent = useMemo(
    () => (isUser ? [] : parseMMCAResponse(message.content)),
    [isUser, message.content]
  );
  
  const containerClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white rounded-lg rounded-br-none'
    : 'bg-transparent';

  return (
    <div className={`${containerClasses} max-w-4xl mx-auto w-full px-4`}>
      <div className={`p-3 max-w-2xl w-full ${bubbleClasses}`}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="space-y-3">
            {parsedContent.length > 0 ? (
              parsedContent.map((part, index) => <PartCard key={index} part={part} />)
            ) : (
               <PartCard part={{type: 'Agent', content: message.content}}/>
            )}
          </div>
        )}
      </div>
    </div>
  );
};