'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const features = [
    {
      title: 'Generación con IA',
      description: 'Crea imágenes increíbles desde texto usando los modelos más avanzados de inteligencia artificial.',
      icon: '✨',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Mejora Inteligente', 
      description: 'Mejora, restaura y upscalea tus imágenes existentes con tecnología de última generación.',
      icon: '🔧',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Múltiples Estilos',
      description: 'Explora diferentes estilos artísticos: realista, cartoon, anime, cyberpunk, vintage y más.',
      icon: '🎨',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      title: 'Galería Organizada',
      description: 'Organiza, favorita y descarga todas tus creaciones en una galería intuitiva.',
      icon: '🖼️',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'Configuración Avanzada',
      description: 'Controla cada aspecto: dimensiones, calidad, semillas, prompts negativos y más.',
      icon: '⚙️',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Interfaz Moderna',
      description: 'Disfruta de una experiencia fluida con temas oscuro/claro y diseño responsivo.',
      icon: '📱',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  const styles = [
    { name: 'Realista', sample: 'Fotografía profesional', color: 'bg-blue-100 text-blue-800' },
    { name: 'Artístico', sample: 'Pintura al óleo', color: 'bg-purple-100 text-purple-800' },
    { name: 'Cartoon', sample: 'Dibujo animado', color: 'bg-green-100 text-green-800' },
    { name: 'Anime', sample: 'Estilo japonés', color: 'bg-pink-100 text-pink-800' },
    { name: 'Cyberpunk', sample: 'Futuro distópico', color: 'bg-cyan-100 text-cyan-800' },
    { name: 'Fantasy', sample: 'Mundo mágico', color: 'bg-indigo-100 text-indigo-800' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-background via-background to-muted/50">
          <div className="container mx-auto max-w-6xl text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  AI Image Studio
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Crea y mejora imágenes increíbles usando inteligencia artificial avanzada. 
                Transforma tus ideas en arte digital profesional.
              </p>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative mx-auto max-w-4xl">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border">
                <img 
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/14a0b268-d1b5-459d-ba0c-af2dcadd1f82.png" 
                  alt="AI Image Studio Dashboard con galería de imágenes generadas y herramientas de edición modernas"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwMCIgaGVpZ2h0PSIxMDAwIiB2aWV3Qm94PSIwIDAgMTYwMCAxMDAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxNjAwIiBoZWlnaHQ9IjEwMDAiIGZpbGw9IiNmMWY1ZjkiLz48dGV4dCB4PSI4MDAiIHk9IjUwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY0NzQ4YiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDgiPkFJIEltYWdlIFN0dWRpbyBEYXNoYm9hcmQ8L3RleHQ+PC9zdmc+';
                  }}
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                ✨ Nuevo
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/generate">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
                  ✨ Generar Imágenes
                </Button>
              </Link>
              <Link href="/enhance">
                <Button size="lg" variant="outline" className="px-8 py-3 text-lg font-semibold rounded-full border-2 hover:bg-accent hover:text-accent-foreground transform hover:scale-105 transition-all duration-200">
                  🔧 Mejorar Fotos
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">10+</div>
                <div className="text-sm text-muted-foreground">Estilos Artísticos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">5</div>
                <div className="text-sm text-muted-foreground">Herramientas de Mejora</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">4K+</div>
                <div className="text-sm text-muted-foreground">Resolución Máxima</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">∞</div>
                <div className="text-sm text-muted-foreground">Creatividad</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Características Principales
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Descubre todas las herramientas que necesitas para crear y mejorar imágenes con IA
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/30">
                  <CardHeader>
                    <div className={`inline-flex w-12 h-12 items-center justify-center rounded-lg bg-gradient-to-r ${feature.gradient} text-white text-2xl mb-4`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Styles Preview */}
        <section className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Estilos Artísticos Disponibles
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explora diferentes estilos artísticos para dar vida a tus ideas
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {styles.map((style, index) => (
                <Badge key={index} variant="secondary" className={`${style.color} p-3 text-center justify-center flex flex-col space-y-1 h-20`}>
                  <div className="font-semibold">{style.name}</div>
                  <div className="text-xs opacity-75">{style.sample}</div>
                </Badge>
              ))}
            </div>

            <div className="text-center">
              <Link href="/generate">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full">
                  Explorar Estilos
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comienza en 3 Pasos Simples
              </h2>
              <p className="text-lg text-muted-foreground">
                Es súper fácil crear tus primeras imágenes con IA
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold">Describe tu Idea</h3>
                <p className="text-muted-foreground">
                  Escribe una descripción de la imagen que quieres crear o sube una foto para mejorar
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold">Elige tu Estilo</h3>
                <p className="text-muted-foreground">
                  Selecciona entre múltiples estilos artísticos y ajusta la configuración según tus preferencias
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold">¡Disfruta el Resultado!</h3>
                <p className="text-muted-foreground">
                  Recibe tu imagen generada, guárdala en tu galería y descárgala cuando quieras
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/generate">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg rounded-full">
                  ¡Empezar Ahora! ✨
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}