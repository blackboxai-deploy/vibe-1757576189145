'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PromptInput } from '@/components/PromptInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { LoadingOverlay, GenerationProgress } from '@/components/LoadingSpinner';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useImageContext } from '@/contexts/ImageContext';
import { ImageStyle, ImageQuality, ImageDimensions } from '@/types/image';
import { cn } from '@/lib/utils';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ImageStyle>('realistic');
  const [quality, setQuality] = useState<ImageQuality>('high');
  const [dimensions, setDimensions] = useState<ImageDimensions>('1024x1024');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [seed, setSeed] = useState<number | undefined>();
  const [useRandomSeed, setUseRandomSeed] = useState(true);
  const [guidanceScale, setGuidanceScale] = useState([7]);
  const [steps, setSteps] = useState([20]);

  const { generateImageFromPrompt, isGenerating, progress, error, clearError } = useImageGeneration();
  const { state } = useImageContext();

  const styleOptions: { value: ImageStyle; label: string; description: string }[] = [
    { value: 'realistic', label: 'Realista', description: 'Fotografía fotorrealista' },
    { value: 'artistic', label: 'Artístico', description: 'Pintura al óleo tradicional' },
    { value: 'cartoon', label: 'Cartoon', description: 'Dibujo animado colorido' },
    { value: 'anime', label: 'Anime', description: 'Estilo japonés anime/manga' },
    { value: 'cyberpunk', label: 'Cyberpunk', description: 'Futurista con neón' },
    { value: 'fantasy', label: 'Fantasy', description: 'Mundo mágico épico' },
    { value: 'abstract', label: 'Abstracto', description: 'Arte abstracto moderno' },
    { value: 'vintage', label: 'Vintage', description: 'Estilo retro clásico' },
    { value: 'oil_painting', label: 'Óleo', description: 'Pintura al óleo clásica' },
    { value: 'watercolor', label: 'Acuarela', description: 'Acuarela suave' },
    { value: 'sketch', label: 'Boceto', description: 'Dibujo a lápiz' },
    { value: 'digital_art', label: 'Arte Digital', description: 'Arte digital moderno' },
  ];

  const qualityOptions: { value: ImageQuality; label: string; description: string }[] = [
    { value: 'draft', label: 'Borrador', description: 'Rápido, calidad básica' },
    { value: 'standard', label: 'Estándar', description: 'Equilibrio tiempo/calidad' },
    { value: 'high', label: 'Alta', description: 'Calidad superior' },
    { value: 'ultra', label: 'Ultra', description: 'Máxima calidad (más lento)' },
  ];

  const dimensionOptions: { value: ImageDimensions; label: string; aspect: string }[] = [
    { value: '512x512', label: '512×512', aspect: 'Cuadrado (1:1)' },
    { value: '768x768', label: '768×768', aspect: 'Cuadrado (1:1)' },
    { value: '1024x1024', label: '1024×1024', aspect: 'Cuadrado (1:1)' },
    { value: '512x768', label: '512×768', aspect: 'Retrato (2:3)' },
    { value: '768x512', label: '768×512', aspect: 'Paisaje (3:2)' },
    { value: '1024x768', label: '1024×768', aspect: 'Paisaje (4:3)' },
    { value: '768x1024', label: '768×1024', aspect: 'Retrato (3:4)' },
    { value: '1536x1024', label: '1536×1024', aspect: 'Ancho (3:2)' },
    { value: '1024x1536', label: '1024×1536', aspect: 'Alto (2:3)' },
  ];

  const handleGenerate = async (promptText: string) => {
    if (!promptText.trim()) return;

    clearError();
    
    const config = {
      style,
      quality,
      dimensions,
      seed: useRandomSeed ? undefined : seed,
      negativePrompt: negativePrompt.trim() || undefined,
      guidanceScale: guidanceScale[0],
      steps: steps[0],
    };

    await generateImageFromPrompt(promptText, config);
  };

  const generateRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Generador de Imágenes IA
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transforma tus ideas en arte digital usando inteligencia artificial avanzada
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel de Configuración */}
            <div className="lg:col-span-1 space-y-6">
              {/* Prompt Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">✨ Descripción</CardTitle>
                  <CardDescription>
                    Describe la imagen que quieres crear
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PromptInput
                    value={prompt}
                    onChange={setPrompt}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                  />
                </CardContent>
              </Card>

              {/* Estilo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🎨 Estilo Artístico</CardTitle>
                  <CardDescription>
                    Selecciona el estilo visual para tu imagen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {styleOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={style === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStyle(option.value)}
                        className={cn(
                          "h-auto p-3 flex flex-col items-start text-left",
                          style === option.value && "bg-gradient-to-r from-purple-600 to-pink-600"
                        )}
                      >
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs opacity-75">{option.description}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Configuración Básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">⚙️ Configuración</CardTitle>
                  <CardDescription>
                    Ajusta la calidad y dimensiones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Calidad */}
                  <div className="space-y-2">
                    <Label>Calidad</Label>
                    <Select value={quality} onValueChange={(value: ImageQuality) => setQuality(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {qualityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span>{option.label}</span>
                              <span className="text-xs text-muted-foreground">{option.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dimensiones */}
                  <div className="space-y-2">
                    <Label>Dimensiones</Label>
                    <Select value={dimensions} onValueChange={(value: ImageDimensions) => setDimensions(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dimensionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span>{option.label}</span>
                              <span className="text-xs text-muted-foreground">{option.aspect}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Configuración Avanzada */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🔧 Configuración Avanzada</CardTitle>
                  <CardDescription>
                    Opciones para usuarios expertos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Prompt Negativo */}
                  <div className="space-y-2">
                    <Label>Prompt Negativo (opcional)</Label>
                    <textarea
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="Elementos que NO quieres en la imagen..."
                      className="w-full p-2 text-sm border rounded-md min-h-[60px] bg-background"
                      disabled={isGenerating}
                    />
                  </div>

                  {/* Semilla */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={useRandomSeed}
                        onCheckedChange={setUseRandomSeed}
                      />
                      <Label>Semilla aleatoria</Label>
                    </div>
                    {!useRandomSeed && (
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={seed || ''}
                          onChange={(e) => setSeed(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="Número de semilla"
                          className="flex-1 p-2 text-sm border rounded-md bg-background"
                          disabled={isGenerating}
                        />
                        <Button size="sm" onClick={generateRandomSeed} disabled={isGenerating}>
                          🎲
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Guidance Scale */}
                  <div className="space-y-2">
                    <Label>Guidance Scale: {guidanceScale[0]}</Label>
                    <Slider
                      value={guidanceScale}
                      onValueChange={setGuidanceScale}
                      max={20}
                      min={1}
                      step={0.5}
                      disabled={isGenerating}
                    />
                    <p className="text-xs text-muted-foreground">
                      Qué tan estrictamente seguir el prompt (7 recomendado)
                    </p>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2">
                    <Label>Pasos de Inferencia: {steps[0]}</Label>
                    <Slider
                      value={steps}
                      onValueChange={setSteps}
                      max={50}
                      min={10}
                      step={5}
                      disabled={isGenerating}
                    />
                    <p className="text-xs text-muted-foreground">
                      Más pasos = mejor calidad pero más lento (20 recomendado)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panel Principal - Resultado */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">🖼️ Imagen Generada</CardTitle>
                    {state.generatedImages.length > 0 && (
                      <Badge variant="secondary">
                        {state.generatedImages.length} imagen{state.generatedImages.length !== 1 ? 's' : ''} creada{state.generatedImages.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {isGenerating 
                      ? 'Tu imagen se está generando...' 
                      : 'Aquí aparecerá tu imagen generada'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <LoadingOverlay
                    isVisible={isGenerating}
                    message={progress.message || 'Generando imagen...'}
                    progress={progress.progress}
                  >
                    <div className="min-h-[400px] flex items-center justify-center bg-muted/30 rounded-lg">
                      {state.currentImage && !isGenerating ? (
                        <div className="space-y-4 w-full">
                          <div className="relative">
                            <img
                              src={'url' in state.currentImage ? state.currentImage.url : state.currentImage.enhancedUrl}
                              alt={`Imagen generada: ${(state.currentImage as any).prompt || 'Imagen mejorada'}`}
                              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNmMWY1ZjkiLz48dGV4dCB4PSI0MDAiIHk9IjMwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY0NzQ4YiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiPkVycm9yIGNhcmdhbmRvIGltYWdlbjwvdGV4dD48L3N2Zz4=';
                              }}
                            />
                          </div>
                          
                          {/* Información de la imagen */}
                          <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                              <strong>Prompt:</strong> {(state.currentImage as any).prompt}
                            </p>
                            <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
                              <span>Estilo: {(state.currentImage as any).style || 'N/A'}</span>
                              <span>Calidad: {(state.currentImage as any).quality || 'N/A'}</span>
                              <span>
                                {'width' in state.currentImage && state.currentImage.width 
                                  ? `${state.currentImage.width}×${state.currentImage.height}` 
                                  : 'enhancedSize' in state.currentImage && state.currentImage.enhancedSize
                                  ? `${state.currentImage.enhancedSize.width}×${state.currentImage.enhancedSize.height}`
                                  : 'N/A'
                                }
                              </span>
                            </div>
                            
                            {/* Botones de acción */}
                            <div className="flex justify-center space-x-2 pt-4">
                              <Button size="sm" variant="outline">
                                ⭐ Favorito
                              </Button>
                              <Button size="sm" variant="outline">
                                📥 Descargar
                              </Button>
                              <Button size="sm" variant="outline">
                                🔄 Variación
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : !isGenerating ? (
                        <div className="text-center space-y-4 text-muted-foreground">
                          <div className="text-6xl">🎨</div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2">¡Crea tu primera imagen!</h3>
                            <p>Describe lo que quieres generar y presiona el botón de generar</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </LoadingOverlay>

                  {/* Progreso de generación */}
                  {isGenerating && (
                    <div className="mt-4">
                      <GenerationProgress
                        progress={progress.progress}
                        status={progress.message || 'Generando...'}
                      />
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center space-x-2 text-destructive">
                        <span>⚠️</span>
                        <span className="font-medium">Error:</span>
                      </div>
                      <p className="text-sm mt-1">{error}</p>
                      <Button size="sm" variant="outline" onClick={clearError} className="mt-2">
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