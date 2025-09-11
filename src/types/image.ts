export interface GeneratedImage {
  id: string;
  prompt: string;
  style: ImageStyle;
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  quality: ImageQuality;
  seed?: number;
  createdAt: Date;
  isFavorite: boolean;
  tags: string[];
  model?: string;
  negativePrompt?: string;
}

export interface EnhancedImage {
  id: string;
  originalUrl: string;
  enhancedUrl: string;
  enhancements: Enhancement[];
  originalSize: { width: number; height: number };
  enhancedSize: { width: number; height: number };
  processingTime: number;
  createdAt: Date;
  fileName: string;
}

export interface Enhancement {
  type: EnhancementType;
  strength: number;
  settings?: Record<string, any>;
}

export type EnhancementType = 
  | 'upscale'
  | 'denoise'
  | 'colorize'
  | 'restore'
  | 'enhance_details'
  | 'fix_lighting'
  | 'remove_background'
  | 'artistic_style';

export type ImageStyle = 
  | 'realistic'
  | 'artistic'
  | 'cartoon'
  | 'anime'
  | 'cyberpunk'
  | 'fantasy'
  | 'abstract'
  | 'vintage'
  | 'oil_painting'
  | 'watercolor'
  | 'sketch'
  | 'digital_art';

export type ImageQuality = 'draft' | 'standard' | 'high' | 'ultra';

export type ImageDimensions = 
  | '512x512'
  | '768x768'
  | '1024x1024'
  | '512x768'
  | '768x512'
  | '1024x768'
  | '768x1024'
  | '1536x1024'
  | '1024x1536';

export interface GenerationConfig {
  style: ImageStyle;
  quality: ImageQuality;
  dimensions: ImageDimensions;
  seed?: number;
  negativePrompt?: string;
  guidanceScale?: number;
  steps?: number;
}

export interface EnhancementConfig {
  enhancements: Enhancement[];
  outputFormat: 'png' | 'jpg' | 'webp';
  maxSize?: number;
}

export interface ImageGenerationRequest {
  prompt: string;
  config: GenerationConfig;
}

export interface ImageEnhancementRequest {
  imageData: string | File;
  config: EnhancementConfig;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GenerationProgress {
  status: 'idle' | 'generating' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
  timeRemaining?: number;
}

export interface PromptSuggestion {
  category: string;
  prompts: string[];
}

export interface ImageHistory {
  generated: GeneratedImage[];
  enhanced: EnhancedImage[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'es' | 'en';
  defaultStyle: ImageStyle;
  defaultQuality: ImageQuality;
  autoSave: boolean;
  showTutorials: boolean;
}