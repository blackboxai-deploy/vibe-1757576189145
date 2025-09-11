'use client';

import React, { useCallback, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { validateImageFile, getImageDimensions, compressImage } from '@/lib/imageApi';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  onFileUpload?: (file: File) => Promise<string>;
  accept?: string;
  maxSize?: number;
  compress?: boolean;
  className?: string;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileSelect,
  onFileUpload,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB
  compress = true,
  className,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; dimensions?: { width: number; height: number } } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }, [disabled]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Validar archivo
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Archivo inválido');
        return;
      }

      // Simular progreso de validación
      setUploadProgress(20);

      // Obtener dimensiones
      let dimensions;
      try {
        dimensions = await getImageDimensions(file);
        setUploadProgress(40);
      } catch {
        setError('Error al leer las dimensiones de la imagen');
        return;
      }

      // Comprimir si es necesario
      let processedFile = file;
      if (compress && file.size > 1024 * 1024) { // Comprimir si es mayor a 1MB
        try {
          processedFile = await compressImage(file, 1920, 1080, 0.85);
          setUploadProgress(70);
        } catch {
          // Si falla la compresión, usar el archivo original
          processedFile = file;
        }
      }

      // Crear preview
      const objectUrl = URL.createObjectURL(processedFile);
      setPreviewUrl(objectUrl);
      
      // Guardar información del archivo
      setFileInfo({
        name: processedFile.name,
        size: processedFile.size,
        dimensions,
      });

      setUploadProgress(90);

      // Subir archivo si se proporciona función de upload
      if (onFileUpload) {
        try {
          await onFileUpload(processedFile);
        } catch (uploadError) {
          console.error('Error uploading file:', uploadError);
          setError('Error al subir el archivo');
          return;
        }
      }

      setUploadProgress(100);
      
      // Notificar al componente padre
      onFileSelect(processedFile);

    } catch (err) {
      console.error('Error processing file:', err);
      setError('Error al procesar el archivo');
    } finally {
      setIsProcessing(false);
    }
  }, [onFileSelect, onFileUpload, compress]);

  const clearFile = useCallback(() => {
    setPreviewUrl(null);
    setFileInfo(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Área de Drop */}
      <Card className={cn(
        'transition-all duration-200 cursor-pointer border-2 border-dashed',
        isDragging && !disabled ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50 hover:bg-primary/5',
        error ? 'border-destructive bg-destructive/5' : ''
      )}>
        <CardContent
          className="p-8 text-center space-y-4"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          {previewUrl ? (
            // Preview de la imagen
            <div className="space-y-4">
              <div className="relative max-w-xs mx-auto">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                >
                  ✕
                </Button>
              </div>
              
              {fileInfo && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Archivo:</strong> {fileInfo.name}</p>
                  <p><strong>Tamaño:</strong> {formatFileSize(fileInfo.size)}</p>
                  {fileInfo.dimensions && (
                    <p><strong>Dimensiones:</strong> {fileInfo.dimensions.width} × {fileInfo.dimensions.height} px</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Estado inicial
            <div className="space-y-4">
              <div className="text-4xl">📁</div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {isProcessing ? 'Procesando imagen...' : 'Sube tu imagen aquí'}
                </h3>
                <p className="text-muted-foreground">
                  Arrastra y suelta una imagen o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos soportados: JPG, PNG, WebP (máximo {formatFileSize(maxSize)})
                </p>
              </div>
            </div>
          )}

          {/* Progreso de procesamiento */}
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                {uploadProgress < 30 ? 'Validando archivo...' :
                 uploadProgress < 70 ? 'Procesando imagen...' :
                 uploadProgress < 100 ? 'Finalizando...' : 'Completado'}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              ⚠️ {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Botones adicionales */}
      {previewUrl && (
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={clearFile}>
            🗑️ Limpiar
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            🔄 Cambiar imagen
          </Button>
        </div>
      )}
    </div>
  );
};