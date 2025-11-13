export interface Attachment {
  name: string;
  type: 'image' | 'video' | 'other';
  url: string; // The data URL for preview
  file?: File; // The original file object, optional for sent messages
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  attachment?: Attachment;
}

export interface Memory {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  timestamp: string;
}

export interface ParsedPart {
  type: 'A' | 'B' | 'C' | 'Agent' | 'Unknown';
  content: string;
}