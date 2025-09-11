'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-background/95 backdrop-blur">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🎨</span>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Image Studio
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Crea y mejora imágenes increíbles usando inteligencia artificial avanzada. 
              Genera arte digital, mejora fotos existentes y explora tu creatividad sin límites.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <span className="text-xl">🐦</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <span className="text-xl">📸</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <span className="text-xl">⚡</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/generate" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Generar Imágenes
                </Link>
              </li>
              <li>
                <Link 
                  href="/enhance" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mejorar Imágenes
                </Link>
              </li>
              <li>
                <Link 
                  href="/gallery" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Galería
                </Link>
              </li>
              <li>
                <Link 
                  href="/settings" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Configuración
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Soporte
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Centro de Ayuda
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tutoriales
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Términos de Uso
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-muted-foreground text-sm">
            © {currentYear} AI Image Studio. Todos los derechos reservados.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span className="flex items-center space-x-1">
              <span>⚡</span>
              <span>Powered by AI</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>🚀</span>
              <span>Built with Next.js</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>💖</span>
              <span>Made with love</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};