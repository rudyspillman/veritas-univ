export enum AnalysisVerdict {
  AUTHENTIC = 'Authentic',
  SUSPICIOUS = 'Suspicious',
  FRAUDULENT = 'Fraudulent',
  UNKNOWN = 'Unknown'
}

export interface VerificationResult {
  score: number;
  verdict: AnalysisVerdict;
  explanation: string[];
  reasoning: string;
  timestamp: string;
  disclaimer?: string;
}

export interface HistoryItem {
  id: string;
  type: 'text' | 'image' | 'audio' | 'video';
  preview: string; // Text snippet or file name
  result: VerificationResult;
}

export enum InputMode {
  TEXT = 'TEXT',
  FILE = 'FILE'
}
