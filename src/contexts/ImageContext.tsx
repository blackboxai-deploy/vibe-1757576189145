'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { GeneratedImage, EnhancedImage, ImageHistory, GenerationProgress } from '@/types/image';

interface ImageState {
  generatedImages: GeneratedImage[];
  enhancedImages: EnhancedImage[];
  currentImage: GeneratedImage | EnhancedImage | null;
  generationProgress: GenerationProgress;
  isGenerating: boolean;
  isEnhancing: boolean;
  history: ImageHistory;
}

type ImageAction =
  | { type: 'SET_GENERATED_IMAGES'; payload: GeneratedImage[] }
  | { type: 'ADD_GENERATED_IMAGE'; payload: GeneratedImage }
  | { type: 'SET_ENHANCED_IMAGES'; payload: EnhancedImage[] }
  | { type: 'ADD_ENHANCED_IMAGE'; payload: EnhancedImage }
  | { type: 'SET_CURRENT_IMAGE'; payload: GeneratedImage | EnhancedImage | null }
  | { type: 'SET_GENERATION_PROGRESS'; payload: GenerationProgress }
  | { type: 'SET_IS_GENERATING'; payload: boolean }
  | { type: 'SET_IS_ENHANCING'; payload: boolean }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'DELETE_IMAGE'; payload: string }
  | { type: 'CLEAR_IMAGES' }
  | { type: 'LOAD_FROM_STORAGE'; payload: ImageHistory };

const initialState: ImageState = {
  generatedImages: [],
  enhancedImages: [],
  currentImage: null,
  generationProgress: {
    status: 'idle',
    progress: 0,
  },
  isGenerating: false,
  isEnhancing: false,
  history: {
    generated: [],
    enhanced: [],
  },
};

function imageReducer(state: ImageState, action: ImageAction): ImageState {
  switch (action.type) {
    case 'SET_GENERATED_IMAGES':
      return {
        ...state,
        generatedImages: action.payload,
        history: {
          ...state.history,
          generated: action.payload,
        },
      };

    case 'ADD_GENERATED_IMAGE':
      const newGeneratedImages = [action.payload, ...state.generatedImages];
      return {
        ...state,
        generatedImages: newGeneratedImages,
        currentImage: action.payload,
        history: {
          ...state.history,
          generated: newGeneratedImages,
        },
      };

    case 'SET_ENHANCED_IMAGES':
      return {
        ...state,
        enhancedImages: action.payload,
        history: {
          ...state.history,
          enhanced: action.payload,
        },
      };

    case 'ADD_ENHANCED_IMAGE':
      const newEnhancedImages = [action.payload, ...state.enhancedImages];
      return {
        ...state,
        enhancedImages: newEnhancedImages,
        currentImage: action.payload,
        history: {
          ...state.history,
          enhanced: newEnhancedImages,
        },
      };

    case 'SET_CURRENT_IMAGE':
      return {
        ...state,
        currentImage: action.payload,
      };

    case 'SET_GENERATION_PROGRESS':
      return {
        ...state,
        generationProgress: action.payload,
      };

    case 'SET_IS_GENERATING':
      return {
        ...state,
        isGenerating: action.payload,
        generationProgress: action.payload 
          ? { status: 'generating', progress: 0 }
          : { status: 'idle', progress: 0 },
      };

    case 'SET_IS_ENHANCING':
      return {
        ...state,
        isEnhancing: action.payload,
      };

    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        generatedImages: state.generatedImages.map((img) =>
          img.id === action.payload
            ? { ...img, isFavorite: !img.isFavorite }
            : img
        ),
      };

    case 'DELETE_IMAGE':
      return {
        ...state,
        generatedImages: state.generatedImages.filter((img) => img.id !== action.payload),
        enhancedImages: state.enhancedImages.filter((img) => img.id !== action.payload),
      };

    case 'CLEAR_IMAGES':
      return {
        ...state,
        generatedImages: [],
        enhancedImages: [],
        currentImage: null,
      };

    case 'LOAD_FROM_STORAGE':
      return {
        ...state,
        generatedImages: action.payload.generated,
        enhancedImages: action.payload.enhanced,
        history: action.payload,
      };

    default:
      return state;
  }
}

interface ImageContextType {
  state: ImageState;
  addGeneratedImage: (image: GeneratedImage) => void;
  addEnhancedImage: (image: EnhancedImage) => void;
  setCurrentImage: (image: GeneratedImage | EnhancedImage | null) => void;
  setGenerationProgress: (progress: GenerationProgress) => void;
  setIsGenerating: (generating: boolean) => void;
  setIsEnhancing: (enhancing: boolean) => void;
  toggleFavorite: (imageId: string) => void;
  deleteImage: (imageId: string) => void;
  clearImages: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};

interface ImageProviderProps {
  children: React.ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(imageReducer, initialState);

  const addGeneratedImage = useCallback((image: GeneratedImage) => {
    dispatch({ type: 'ADD_GENERATED_IMAGE', payload: image });
  }, []);

  const addEnhancedImage = useCallback((image: EnhancedImage) => {
    dispatch({ type: 'ADD_ENHANCED_IMAGE', payload: image });
  }, []);

  const setCurrentImage = useCallback((image: GeneratedImage | EnhancedImage | null) => {
    dispatch({ type: 'SET_CURRENT_IMAGE', payload: image });
  }, []);

  const setGenerationProgress = useCallback((progress: GenerationProgress) => {
    dispatch({ type: 'SET_GENERATION_PROGRESS', payload: progress });
  }, []);

  const setIsGenerating = useCallback((generating: boolean) => {
    dispatch({ type: 'SET_IS_GENERATING', payload: generating });
  }, []);

  const setIsEnhancing = useCallback((enhancing: boolean) => {
    dispatch({ type: 'SET_IS_ENHANCING', payload: enhancing });
  }, []);

  const toggleFavorite = useCallback((imageId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: imageId });
  }, []);

  const deleteImage = useCallback((imageId: string) => {
    dispatch({ type: 'DELETE_IMAGE', payload: imageId });
  }, []);

  const clearImages = useCallback(() => {
    dispatch({ type: 'CLEAR_IMAGES' });
  }, []);

  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('imageHistory');
      if (stored) {
        const history: ImageHistory = JSON.parse(stored);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: history });
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }, []);

  const saveToStorage = useCallback(() => {
    try {
      const history: ImageHistory = {
        generated: state.generatedImages,
        enhanced: state.enhancedImages,
      };
      localStorage.setItem('imageHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }, [state.generatedImages, state.enhancedImages]);

  // Auto-save to localStorage when images change
  React.useEffect(() => {
    saveToStorage();
  }, [saveToStorage]);

  // Load from localStorage on mount
  React.useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const value: ImageContextType = {
    state,
    addGeneratedImage,
    addEnhancedImage,
    setCurrentImage,
    setGenerationProgress,
    setIsGenerating,
    setIsEnhancing,
    toggleFavorite,
    deleteImage,
    clearImages,
    loadFromStorage,
    saveToStorage,
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};