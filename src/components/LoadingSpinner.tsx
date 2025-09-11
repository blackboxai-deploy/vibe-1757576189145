'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'accent' | 'muted';
  message?: string;
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variantStyles = {
  default: 'text-primary',
  accent: 'text-accent-foreground',
  muted: 'text-muted-foreground',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  message,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      <div className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeStyles[size],
        variantStyles[variant]
      )}>
        <span className="sr-only">Cargando...</span>
      </div>
      {message && (
        <p className={cn(
          'text-sm font-medium',
          variantStyles[variant]
        )}>
          {message}
        </p>
      )}
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
  children?: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Generando imagen...',
  progress,
  children,
}) => {
  if (!isVisible) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
        <div className="flex flex-col items-center space-y-4 p-6">
          {/* Spinner personalizado con gradiente */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"></div>
            <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-2 border-transparent border-t-purple-300 border-r-pink-300 animate-spin animation-delay-150"></div>
          </div>

          {/* Mensaje */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{message}</h3>
            
            {/* Barra de progreso si se proporciona */}
            {typeof progress === 'number' && (
              <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                ></div>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round(progress)}% completado
                </p>
              </div>
            )}
            
            {/* Consejos aleatorios durante la carga */}
            <p className="text-sm text-muted-foreground max-w-xs">
              💡 Consejo: Prueba con diferentes estilos artísticos para obtener resultados únicos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface GenerationProgressProps {
  progress: number;
  status: string;
  className?: string;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  progress,
  status,
  className,
}) => {
  return (
    <div className={cn('w-full space-y-3', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{status}</span>
        <span className="text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      
      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        {/* Barra de progreso animada */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        >
          {/* Efecto de brillo */}
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      </div>
      
      {/* Indicadores de fase */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span className={progress >= 25 ? 'text-purple-500' : ''}>
          Iniciando
        </span>
        <span className={progress >= 50 ? 'text-purple-500' : ''}>
          Procesando
        </span>
        <span className={progress >= 75 ? 'text-purple-500' : ''}>
          Refinando
        </span>
        <span className={progress >= 100 ? 'text-purple-500' : ''}>
          Completado
        </span>
      </div>
    </div>
  );
};