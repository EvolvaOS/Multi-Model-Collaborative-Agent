
import React from 'react';
import { type Memory } from '../types';
import { XMarkIcon } from './icons';

interface MemorySidebarProps {
  isOpen: boolean;
  memories: Memory[];
  onCite: (memory: Memory) => void;
  onClose: () => void;
}

export const MemorySidebar: React.FC<MemorySidebarProps> = ({ isOpen, memories, onCite, onClose }) => {
  return (
    <>
      <aside className={`fixed top-0 left-0 z-40 w-80 h-screen bg-gray-800 border-r border-gray-700 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex-shrink-0`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">記憶日誌</h2>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors md:hidden" aria-label="Close sidebar">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-2 overflow-y-auto h-[calc(100vh-65px)]">
          {memories.length === 0 ? (
            <p className="text-gray-400 p-4 text-center">目前沒有任何記憶。</p>
          ) : (
            <ul className="space-y-2">
              {memories.map((memory) => (
                <li key={memory.id} className="bg-gray-700/50 rounded-lg p-3 group">
                  <h3 className="font-semibold text-gray-200 truncate">{memory.title}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{memory.summary}</p>
                  <div className="mt-3 flex justify-end">
                     <button 
                        onClick={() => onCite(memory)}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                     >
                        引用記憶
                     </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/60 z-30 md:hidden" aria-hidden="true"></div>}
    </>
  );
};