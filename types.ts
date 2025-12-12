
export interface Summary {
  purpose: string;
  actions: string[];
  due_dates: string[];
  costs: string[];
  important_info: string[];
}

export interface BridgeResponse {
  detected_language: string;
  target_language: string;
  translation_html: string;
  summary: Summary;
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  countryCode: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ProcessedResult {
  fileName: string;
  response: BridgeResponse;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
