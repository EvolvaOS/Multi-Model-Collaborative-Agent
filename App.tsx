import React, { useState, useCallback, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { MemorySidebar } from './components/MemorySidebar';
import { type Message, type Memory, type Attachment } from './types';
import { getMockMemories, getAgentResponse } from './services/mmcaService';
import { Bars3Icon } from './components/icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  useEffect(() => {
    // Initial greeting and memory fetch
    setMessages([
      {
        id: 'init',
        role: 'agent',
        content: '[Agent] 您好！我是多模型協作 Agent。我已經連接到 Gemini，可以回答您的問題了。您可以打開左側的記憶體面板來查看過去的對話。',
        timestamp: new Date().toISOString(),
      },
    ]);
    const fetchMemories = async () => {
      const fetchedMemories = await getMockMemories();
      setMemories(fetchedMemories);
    };
    fetchMemories();
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() && !attachment) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      attachment: attachment ? { ...attachment, file: undefined } : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    const currentInput = input;
    const currentAttachment = attachment;
    setInput('');
    setAttachment(null);

    try {
      const agentResponseContent = await getAgentResponse(currentInput, memories, currentAttachment);
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: agentResponseContent,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'agent',
        content: '[Agent] 很抱歉，處理您的請求時發生錯誤，請稍後再試。',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, memories, attachment]);

  const handleCiteMemory = useCallback((memory: Memory) => {
    const citationText = `[正在引用記憶：「${memory.title}」]\n`;
    setInput(prev => citationText + prev);
    setIsSidebarOpen(false);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        let type: Attachment['type'] = 'other';
        if (file.type.startsWith('image/')) {
          type = 'image';
        } else if (file.type.startsWith('video/')) {
          type = 'video';
        }
        setAttachment({ name: file.name, type, url, file });
      };
      reader.readAsDataURL(file);
    }
     // Reset file input value to allow selecting the same file again
    event.target.value = '';
  };
  
  const handleRemoveAttachment = () => {
    setAttachment(null);
  };


  return (
    <div className="relative h-screen w-screen flex overflow-hidden bg-gray-900 font-sans">
      <MemorySidebar 
        isOpen={isSidebarOpen} 
        memories={memories} 
        onCite={handleCiteMemory}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col h-full relative">
        <header className="absolute top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm z-10 flex items-center p-2 border-b border-gray-700">
           <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors md:hidden"
              aria-label="Open memory sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-200 ml-2">MMCA Agent</h1>
        </header>
        
        <main className="flex-1 overflow-y-auto pt-16 pb-36">
           <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            input={input}
            onInputChange={setInput}
            attachment={attachment}
            onFileSelect={handleFileSelect}
            onRemoveAttachment={handleRemoveAttachment}
          />
        </main>
      </div>
    </div>
  );
};

export default App;