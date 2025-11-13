
export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
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
