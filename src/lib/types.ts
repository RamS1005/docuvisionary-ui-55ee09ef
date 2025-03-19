
export type FeatureType = 'ocr' | 'vision';

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
  uploadedAt: Date;
  processed: boolean;
  processingResult?: ProcessingResult;
}

export interface ProcessingResult {
  text?: string;
  entities?: Entity[];
  summary?: string;
  confidence: number;
}

export interface Entity {
  text: string;
  type: string;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
}
