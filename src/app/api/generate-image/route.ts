import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationRequest, ApiResponse, GeneratedImage } from '@/types/image';

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationRequest = await request.json();
    
    // Validar entrada
    if (!body.prompt || !body.config) {
      return NextResponse.json({
        success: false,
        error: 'Prompt y configuración son requeridos',
      } as ApiResponse<never>, { status: 400 });
    }

    // Validar prompt
    if (typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'El prompt debe ser una cadena de texto válida',
      } as ApiResponse<never>, { status: 400 });
    }

    // Simular tiempo de generación (en producción esto llamaría a una API real)
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Generar ID único para la imagen
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mapear dimensiones a números
    const [width, height] = body.config.dimensions.split('x').map(Number);
    
    // Crear URL de imagen simulada (en producción sería la imagen real generada)
    const imageUrl = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2190b18c-2078-49d9-ab3e-1d2e9a668c0a.png`;
    
    // Crear imagen generada
    const generatedImage: GeneratedImage = {
      id: imageId,
      prompt: body.prompt,
      style: body.config.style,
      url: imageUrl,
      thumbnailUrl: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f958a76a-3931-47bc-8f00-0bd68bd1c950.png`,
      width,
      height,
      quality: body.config.quality,
      seed: body.config.seed || Math.floor(Math.random() * 1000000),
      createdAt: new Date(),
      isFavorite: false,
      tags: extractTags(body.prompt),
      model: 'ai-studio-v1',
      negativePrompt: body.config.negativePrompt,
    };

    return NextResponse.json({
      success: true,
      data: generatedImage,
      message: 'Imagen generada exitosamente',
    } as ApiResponse<GeneratedImage>);

  } catch (error) {
    console.error('Error generating image:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al generar la imagen',
    } as ApiResponse<never>, { status: 500 });
  }
}

// Función auxiliar para extraer etiquetas del prompt
function extractTags(prompt: string): string[] {
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'];
  const words = prompt
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
    .slice(0, 5);
  
  return [...new Set(words)]; // Remover duplicados
}

// Endpoint para obtener el estado de salud de la API
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API de generación de imágenes funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}