import { ImageGenerationRequest, ImageEnhancementRequest, ApiResponse, GeneratedImage, EnhancedImage } from '@/types/image';

const API_BASE_URL = '/api';

export class ImageApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ImageApiError';
  }
}

export async function generateImage(
  request: ImageGenerationRequest
): Promise<GeneratedImage> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data: ApiResponse<GeneratedImage> = await response.json();

    if (!response.ok) {
      throw new ImageApiError(
        data.error || 'Error generating image',
        response.status
      );
    }

    if (!data.success || !data.data) {
      throw new ImageApiError('Invalid response from server');
    }

    return data.data;
  } catch (error) {
    if (error instanceof ImageApiError) {
      throw error;
    }
    throw new ImageApiError('Network error while generating image');
  }
}

export async function enhanceImage(
  request: ImageEnhancementRequest
): Promise<EnhancedImage> {
  try {
    const formData = new FormData();
    
    if (request.imageData instanceof File) {
      formData.append('image', request.imageData);
    } else {
      // Convert base64 string to blob
      const response = await fetch(request.imageData);
      const blob = await response.blob();
      formData.append('image', blob);
    }
    
    formData.append('config', JSON.stringify(request.config));

    const response = await fetch(`${API_BASE_URL}/enhance-image`, {
      method: 'POST',
      body: formData,
    });

    const data: ApiResponse<EnhancedImage> = await response.json();

    if (!response.ok) {
      throw new ImageApiError(
        data.error || 'Error enhancing image',
        response.status
      );
    }

    if (!data.success || !data.data) {
      throw new ImageApiError('Invalid response from server');
    }

    return data.data;
  } catch (error) {
    if (error instanceof ImageApiError) {
      throw error;
    }
    throw new ImageApiError('Network error while enhancing image');
  }
}

export async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data: ApiResponse<{ url: string }> = await response.json();

    if (!response.ok) {
      throw new ImageApiError(
        data.error || 'Error uploading image',
        response.status
      );
    }

    if (!data.success || !data.data) {
      throw new ImageApiError('Invalid response from server');
    }

    return data.data.url;
  } catch (error) {
    if (error instanceof ImageApiError) {
      throw error;
    }
    throw new ImageApiError('Network error while uploading image');
  }
}

export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    throw new ImageApiError('Error downloading image');
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato de archivo no válido. Se permiten: JPG, PNG, WebP',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'El archivo es demasiado grande. Máximo 10MB permitido',
    };
  }

  return { valid: true };
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    
    img.onerror = () => {
      reject(new Error('Error loading image'));
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  });
}

export function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }

    img.onload = () => {
      const { width, height } = img;
      
      // Calculate new dimensions
      let newWidth = width;
      let newHeight = height;
      
      if (width > maxWidth) {
        newWidth = maxWidth;
        newHeight = (height * maxWidth) / width;
      }
      
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = (newWidth * maxHeight) / newHeight;
      }
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Error compressing image'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Error loading image'));
    img.src = URL.createObjectURL(file);
  });
}