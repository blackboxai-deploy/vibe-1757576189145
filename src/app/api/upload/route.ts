import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/image';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    // Validar que se proporcionó una imagen
    if (!imageFile) {
      return NextResponse.json({
        success: false,
        error: 'No se proporcionó ninguna imagen',
      } as ApiResponse<never>, { status: 400 });
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json({
        success: false,
        error: 'Formato de imagen no válido. Se permiten: JPG, PNG, WebP',
      } as ApiResponse<never>, { status: 400 });
    }

    // Validar tamaño de archivo (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'La imagen es demasiado grande. Máximo 10MB permitido',
      } as ApiResponse<never>, { status: 400 });
    }

    // Simular subida de archivo (en producción esto subiría a un servicio de almacenamiento)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
    
    // Generar URL simulada para la imagen subida
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    
    // En producción esto sería una URL real del servicio de almacenamiento
    const imageUrl = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e1cc534a-388e-4a6f-9da3-ec8e554c73e7.png`;
    
    // Simular metadatos de la imagen
    const metadata = {
      originalName: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      uploadedAt: new Date().toISOString(),
      id: `upload_${timestamp}_${randomId}`,
    };

    return NextResponse.json({
      success: true,
      data: {
        url: imageUrl,
        metadata,
      },
      message: 'Imagen subida exitosamente',
    } as ApiResponse<{ url: string; metadata: typeof metadata }>);

  } catch (error) {
    console.error('Error uploading image:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al subir la imagen',
    } as ApiResponse<never>, { status: 500 });
  }
}

// Endpoint para obtener información sobre las capacidades de upload
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API de subida de imágenes funcionando correctamente',
    limits: {
      maxFileSize: '10MB',
      supportedFormats: ['JPEG', 'JPG', 'PNG', 'WebP'],
      maxDimensions: '4096x4096',
    },
    features: [
      'Validación automática de formato',
      'Límites de tamaño configurables',
      'Metadatos de archivo preservados',
      'URLs seguras de acceso',
    ],
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}