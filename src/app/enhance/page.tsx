'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageUploader } from '@/components/ImageUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LoadingOverlay } from '@/components/LoadingSpinner';
import { enhanceImage } from '@/lib/imageApi';
import { EnhancementType, Enhancement, EnhancementConfig, EnhancedImage } from '@/types/image';
import { useImageContext } from '@/contexts/ImageContext';


export default function EnhancePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEnhancements, setSelectedEnhancements] = useState<Enhancement[]>([]);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedImage, setEnhancedImage] = useState<EnhancedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { addEnhancedImage } = useImageContext();

  const enhancementOptions: {
    type: EnhancementType;
    label: string;
    description: string;
    icon: string;
    defaultStrength: number;
    hasStrength: boolean;
    hasSettings: boolean;
  }[] = [
    {
      type: 'upscale',
      label: 'Upscaling',
      description: 'Aumentar resolución manteniendo calidad',
      icon: '🔍',
      defaultStrength: 2,
      hasStrength: true,
      hasSettings: false,
    },
    {
      type: 'denoise',
      label: 'Reducir Ruido',
      description: 'Eliminar artefactos y ruido digital',
      icon: '✨',
      defaultStrength: 0.7,
      hasStrength: true,
      hasSettings: false,
    },
    {
      type: 'colorize',
      label: 'Colorizar',
      description: 'Añadir color a fotos en blanco y negro',
      icon: '🎨',
      defaultStrength: 1,
      hasStrength: false,
      hasSettings: false,
    },
    {
      type: 'restore',
      label: 'Restaurar',
      description: 'Reparar fotos antiguas y dañadas',
      icon: '🔧',
      defaultStrength: 0.8,
      hasStrength: true,
      hasSettings: false,
    },
    {
      type: 'enhance_details',
      label: 'Mejorar Detalles',
      description: 'Acentuar características y texturas',
      icon: '🎯',
      defaultStrength: 0.6,
      hasStrength: true,
      hasSettings: false,
    },
    {
      type: 'fix_lighting',
      label: 'Corregir Iluminación',
      description: 'Ajustar exposición y contraste',
      icon: '💡',
      defaultStrength: 0.5,
      hasStrength: true,
      hasSettings: false,
    },
    {
      type: 'remove_background',
      label: 'Remover Fondo',
      description: 'Eliminar fondo automáticamente',
      icon: '🖼️',
      defaultStrength: 1,
      hasStrength: false,
      hasSettings: false,
    },
    {
      type: 'artistic_style',
      label: 'Estilo Artístico',
      description: 'Aplicar filtros artísticos',
      icon: '🎭',
      defaultStrength: 0.7,
      hasStrength: true,
      hasSettings: true,
    },
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setEnhancedImage(null);
    setError(null);
  };

  const handleEnhancementToggle = (enhancementType: EnhancementType, enabled: boolean) => {
    if (enabled) {
      const option = enhancementOptions.find(opt => opt.type === enhancementType);
      if (option) {
        const newEnhancement: Enhancement = {
          type: enhancementType,
          strength: option.defaultStrength,
        };
        setSelectedEnhancements([...selectedEnhancements, newEnhancement]);
      }
    } else {
      setSelectedEnhancements(selectedEnhancements.filter(e => e.type !== enhancementType));
    }
  };

  const updateEnhancementStrength = (enhancementType: EnhancementType, strength: number) => {
    setSelectedEnhancements(selectedEnhancements.map(e =>
      e.type === enhancementType ? { ...e, strength } : e
    ));
  };

  const handleEnhance = async () => {
    if (!selectedFile || selectedEnhancements.length === 0) {
      setError('Selecciona una imagen y al menos una mejora');
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      const config: EnhancementConfig = {
        enhancements: selectedEnhancements,
        outputFormat,
      };

      const result = await enhanceImage({
        imageData: selectedFile,
        config,
      });

      setEnhancedImage(result);
      addEnhancedImage(result);
    } catch (err: any) {
      setError(err.message || 'Error al mejorar la imagen');
    } finally {
      setIsEnhancing(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setSelectedEnhancements([]);
    setEnhancedImage(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Mejorador de Imágenes IA
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mejora, restaura y transforma tus imágenes usando inteligencia artificial avanzada
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel de Carga y Configuración */}
            <div className="lg:col-span-1 space-y-6">
              {/* Subir Imagen */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📁 Subir Imagen</CardTitle>
                  <CardDescription>
                    Sube la imagen que quieres mejorar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    onFileSelect={handleFileSelect}
                    disabled={isEnhancing}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Opciones de Mejora */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🔧 Opciones de Mejora</CardTitle>
                  <CardDescription>
                    Selecciona las mejoras que quieres aplicar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enhancementOptions.map((option) => {
                    const isSelected = selectedEnhancements.some(e => e.type === option.type);
                    const enhancement = selectedEnhancements.find(e => e.type === option.type);
                    
                    return (
                      <div key={option.type} className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => 
                              handleEnhancementToggle(option.type, checked as boolean)
                            }
                            disabled={isEnhancing}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{option.icon}</span>
                              <Label className="font-medium">{option.label}</Label>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {option.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Control de intensidad */}
                        {isSelected && option.hasStrength && enhancement && (
                          <div className="ml-8 space-y-2">
                            <Label className="text-xs">
                              Intensidad: {enhancement.strength.toFixed(1)}
                            </Label>
                            <Slider
                              value={[enhancement.strength]}
                              onValueChange={(value) => 
                                updateEnhancementStrength(option.type, value[0])
                              }
                              max={option.type === 'upscale' ? 4 : 1}
                              min={0.1}
                              step={0.1}
                              disabled={isEnhancing}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Configuración de Salida */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">⚙️ Configuración</CardTitle>
                  <CardDescription>
                    Opciones de formato de salida
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Formato de Salida</Label>
                    <Select value={outputFormat} onValueChange={(value: 'png' | 'jpg' | 'webp') => setOutputFormat(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG (Sin pérdida, transparencia)</SelectItem>
                        <SelectItem value="jpg">JPG (Comprimido, menor tamaño)</SelectItem>
                        <SelectItem value="webp">WebP (Moderno, equilibrado)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Botón de mejora */}
                  <div className="pt-4 space-y-2">
                    <Button
                      onClick={handleEnhance}
                      disabled={!selectedFile || selectedEnhancements.length === 0 || isEnhancing}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      {isEnhancing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Mejorando...
                        </>
                      ) : (
                        <>
                          🚀 Mejorar Imagen
                        </>
                      )}
                    </Button>
                    
                    {(selectedFile || enhancedImage) && (
                      <Button
                        variant="outline"
                        onClick={resetForm}
                        disabled={isEnhancing}
                        className="w-full"
                      >
                        🔄 Reiniciar
                      </Button>
                    )}
                  </div>

                  {/* Resumen */}
                  {selectedEnhancements.length > 0 && (
                    <div className="pt-4 border-t">
                      <Label className="text-sm font-medium">Mejoras Seleccionadas:</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedEnhancements.map((enhancement) => {
                          const option = enhancementOptions.find(opt => opt.type === enhancement.type);
                          return (
                            <Badge key={enhancement.type} variant="secondary" className="text-xs">
                              {option?.icon} {option?.label}
                              {option?.hasStrength && ` (${enhancement.strength.toFixed(1)})`}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Panel Principal - Comparación */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">🔍 Comparación Antes/Después</CardTitle>
                  <CardDescription>
                    {enhancedImage 
                      ? 'Compara tu imagen original con la mejorada' 
                      : selectedFile
                      ? 'Configura las mejoras y presiona el botón para procesar'
                      : 'Sube una imagen para comenzar'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <LoadingOverlay isVisible={isEnhancing} message="Procesando mejoras...">
                    <div className="min-h-[500px]">
                      {enhancedImage ? (
                        // Vista de comparación
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Imagen Original */}
                            <div className="space-y-2">
                              <h3 className="text-sm font-semibold text-center">📷 Original</h3>
                              <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                                <img
                                  src={enhancedImage.originalUrl}
                                  alt="Imagen original"
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmMWY1ZjkiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY0NzQ4YiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiPkltYWdlbiBPcmlnaW5hbDwvdGV4dD48L3N2Zz4=';
                                  }}
                                />
                              </div>
                              <div className="text-center text-xs text-muted-foreground">
                                {enhancedImage.originalSize.width} × {enhancedImage.originalSize.height} px
                              </div>
                            </div>

                            {/* Imagen Mejorada */}
                            <div className="space-y-2">
                              <h3 className="text-sm font-semibold text-center">✨ Mejorada</h3>
                              <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                                <img
                                  src={enhancedImage.enhancedUrl}
                                  alt="Imagen mejorada"
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmMWY1ZjkiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY0NzQ4YiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiPkltYWdlbiBNZWpvcmFkYTwvdGV4dD48L3N2Zz4=';
                                  }}
                                />
                              </div>
                              <div className="text-center text-xs text-muted-foreground">
                                {enhancedImage.enhancedSize.width} × {enhancedImage.enhancedSize.height} px
                              </div>
                            </div>
                          </div>

                          {/* Información del procesamiento */}
                          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                            <h4 className="font-semibold">📊 Detalles del Procesamiento</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Tiempo de procesamiento:</span>
                                <span className="ml-2 font-mono">{(enhancedImage.processingTime / 1000).toFixed(1)}s</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Archivo original:</span>
                                <span className="ml-2">{enhancedImage.fileName}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Mejoras aplicadas:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {enhancedImage.enhancements.map((enhancement, index) => {
                                  const option = enhancementOptions.find(opt => opt.type === enhancement.type);
                                  return (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {option?.icon} {option?.label}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Botones de acción */}
                          <div className="flex justify-center space-x-2">
                            <Button variant="outline" size="sm">
                              📥 Descargar Original
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                              📥 Descargar Mejorada
                            </Button>
                            <Button variant="outline" size="sm">
                              ⭐ Añadir a Favoritos
                            </Button>
                          </div>
                        </div>
                      ) : selectedFile ? (
                        // Preview de imagen cargada
                        <div className="space-y-4">
                          <h3 className="text-center text-lg font-semibold">📷 Imagen Cargada</h3>
                          <div className="max-w-md mx-auto">
                            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                              <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Imagen a mejorar"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                          <div className="text-center text-muted-foreground">
                            <p>Configura las mejoras en el panel izquierdo y presiona "Mejorar Imagen"</p>
                          </div>
                        </div>
                      ) : (
                        // Estado inicial
                        <div className="flex items-center justify-center h-full text-center space-y-4">
                          <div className="space-y-4 text-muted-foreground">
                            <div className="text-6xl">🖼️</div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">¡Mejora tu primera imagen!</h3>
                              <p>Sube una imagen en el panel izquierdo para comenzar</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </LoadingOverlay>

                  {/* Error */}
                  {error && (
                    <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center space-x-2 text-destructive">
                        <span>⚠️</span>
                        <span className="font-medium">Error:</span>
                      </div>
                      <p className="text-sm mt-1">{error}</p>
                      <Button size="sm" variant="outline" onClick={() => setError(null)} className="mt-2">
                        Cerrar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}