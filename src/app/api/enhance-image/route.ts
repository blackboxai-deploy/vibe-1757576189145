import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, EnhancedImage, EnhancementConfig } from '@/types/image';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const configString = formData.get('config') as string;
    
    // Validar entrada
    if (!imageFile) {
      return NextResponse.json({
        success: false,
        error: 'Imagen es requerida',
      } as ApiResponse<never>, { status: 400 });
    }

    if (!configString) {
      return NextResponse.json({
        success: false,
        error: 'Configuración es requerida',
      } as ApiResponse<never>, { status: 400 });
    }

    let config: EnhancementConfig;
    try {
      config = JSON.parse(configString);
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Configuración inválida',
      } as ApiResponse<never>, { status: 400 });
    }

    // Validar archivo de imagen
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json({
        success: false,
        error: 'Formato de imagen no válido. Se permiten: JPG, PNG, WebP',
      } as ApiResponse<never>, { status: 400 });
    }

    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'La imagen es demasiado grande. Máximo 10MB permitido',
      } as ApiResponse<never>, { status: 400 });
    }

    // Simular procesamiento de mejora (en producción esto procesaría la imagen real)
    const processingTime = 1000 + Math.random() * 4000; // 1-5 segundos
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Generar ID único para la imagen mejorada
    const enhancedId = `enhanced_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simular dimensiones originales (en producción se obtendrían de la imagen real)
    const originalSize = { width: 800, height: 600 };
    
    // Calcular dimensiones mejoradas basadas en los tipos de mejora
    let enhancedSize = { ...originalSize };
    const hasUpscale = config.enhancements.some(e => e.type === 'upscale');
    if (hasUpscale) {
      const upscaleEnhancement = config.enhancements.find(e => e.type === 'upscale');
      const multiplier = upscaleEnhancement?.strength || 2;
      enhancedSize.width *= multiplier;
      enhancedSize.height *= multiplier;
    }
    
    // Crear URLs de imagen simuladas
    const originalUrl = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/349f4fe1-5a71-45a2-98c3-119b8074e278.png`;
    const enhancedUrl = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5979e8fe-1af8-4f15-8482-abcc262af472.png`;
    
    // Crear imagen mejorada
    const enhancedImage: EnhancedImage = {
      id: enhancedId,
      originalUrl,
      enhancedUrl,
      enhancements: config.enhancements,
      originalSize,
      enhancedSize,
      processingTime: Math.round(processingTime),
      createdAt: new Date(),
      fileName: imageFile.name,
    };

    return NextResponse.json({
      success: true,
      data: enhancedImage,
      message: 'Imagen mejorada exitosamente',
    } as ApiResponse<EnhancedImage>);

  } catch (error) {
    console.error('Error enhancing image:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al mejorar la imagen',
    } as ApiResponse<never>, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API de mejora de imágenes funcionando correctamente',
    supportedFormats: ['JPEG', 'PNG', 'WebP'],
    maxFileSize: '10MB',
    availableEnhancements: [
      'upscale',
      'denoise', 
      'colorize',
      'restore',
      'enhance_details',
      'fix_lighting',
      'remove_background',
      'artistic_style'
    ],
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}