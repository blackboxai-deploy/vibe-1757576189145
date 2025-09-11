'use client';

import { useState, useCallback } from 'react';
import { useImageContext } from '@/contexts/ImageContext';
import { generateImage, ImageApiError } from '@/lib/imageApi';
import { ImageGenerationRequest, GeneratedImage, GenerationProgress } from '@/types/image';
import { buildPrompt } from '@/lib/prompts';

interface UseImageGenerationReturn {
  generateImageFromPrompt: (prompt: string, config: ImageGenerationRequest['config']) => Promise<GeneratedImage | null>;
  isGenerating: boolean;
  progress: GenerationProgress;
  error: string | null;
  clearError: () => void;
}

export const useImageGeneration = (): UseImageGenerationReturn => {
  const { 
    addGeneratedImage, 
    setGenerationProgress, 
    setIsGenerating,
    state 
  } = useImageContext();
  
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateImageFromPrompt = useCallback(async (
    prompt: string, 
    config: ImageGenerationRequest['config']
  ): Promise<GeneratedImage | null> => {
    try {
      setError(null);
      setIsGenerating(true);
      
      // Actualizar progreso: Iniciando
      setGenerationProgress({
        status: 'generating',
        progress: 10,
        message: 'Preparando la generación...',
      });

      // Construir prompt optimizado
      const optimizedPrompt = buildPrompt(prompt, config.style, config.quality);
      
      // Actualizar progreso: Enviando request
      setGenerationProgress({
        status: 'processing',
        progress: 25,
        message: 'Enviando solicitud a la IA...',
      });

      const request: ImageGenerationRequest = {
        prompt: optimizedPrompt,
        config,
      };

      // Simular progreso durante la generación
      let currentProgress = 25;
      const progressInterval = setInterval(() => {
        currentProgress = Math.min(currentProgress + 5, 90);
        setGenerationProgress({
          status: 'processing',
          progress: currentProgress,
          message: currentProgress < 50 
            ? 'La IA está procesando tu solicitud...' 
            : currentProgress < 80 
            ? 'Generando los detalles finales...'
            : 'Casi terminado...',
        });
      }, 500);

      // Generar imagen
      const generatedImage = await generateImage(request);

      // Limpiar interval y completar progreso
      clearInterval(progressInterval);
      setGenerationProgress({
        status: 'completed',
        progress: 100,
        message: '¡Imagen generada exitosamente!',
      });

      // Agregar imagen al contexto
      addGeneratedImage(generatedImage);

      // Resetear estado después de un breve delay
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress({
          status: 'idle',
          progress: 0,
        });
      }, 1000);

      return generatedImage;

    } catch (err: unknown) {
      // Manejar errores
      let errorMessage = 'Error desconocido durante la generación';
      
      if (err instanceof ImageApiError) {
        switch (err.status) {
          case 400:
            errorMessage = 'Solicitud inválida. Verifica tu prompt y configuración.';
            break;
          case 401:
            errorMessage = 'No tienes autorización para generar imágenes.';
            break;
          case 429:
            errorMessage = 'Has excedido el límite de generaciones. Espera un momento.';
            break;
          case 500:
            errorMessage = 'Error en el servidor. Inténtalo de nuevo más tarde.';
            break;
          default:
            errorMessage = err.message || 'Error al generar la imagen';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setGenerationProgress({
        status: 'error',
        progress: 0,
        message: errorMessage,
      });
      
      setIsGenerating(false);
      return null;
    }
  }, [addGeneratedImage, setGenerationProgress, setIsGenerating]);

  return {
    generateImageFromPrompt,
    isGenerating: state.isGenerating,
    progress: state.generationProgress,
    error,
    clearError,
  };
};