import React from 'react';
import { type Attachment } from '../types';
import { XMarkIcon, DocumentIcon } from './icons';

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemove: () => void;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachment, onRemove }) => {
  return (
    <div className="mb-2 p-2 bg-gray-700/50 rounded-lg flex items-center justify-between animate-fade-in-up">
      <div className="flex items-center gap-3 overflow-hidden">
        {attachment.type === 'image' && (
          <img src={attachment.url} alt="Preview" className="h-12 w-12 rounded-md object-cover flex-shrink-0" />
        )}
        {attachment.type === 'video' && (
          <video src={attachment.url} className="h-12 w-12 rounded-md object-cover flex-shrink-0" />
        )}
        {attachment.type === 'other' && (
          <div className="h-12 w-12 rounded-md bg-gray-600 flex items-center justify-center flex-shrink-0">
            <DocumentIcon className="h-6 w-6 text-gray-300" />
          </div>
        )}
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-gray-200 truncate">{attachment.name}</p>
          <p className="text-xs text-gray-400">準備上傳</p>
        </div>
      </div>
      <button 
        onClick={onRemove}
        className="p-1.5 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white transition-colors flex-shrink-0"
        aria-label="Remove attachment"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};
