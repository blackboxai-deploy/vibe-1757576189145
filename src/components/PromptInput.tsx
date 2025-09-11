'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { promptCategories, getRandomPrompt } from '@/lib/prompts';
import { cn } from '@/lib/utils';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: (prompt: string) => void;
  isGenerating?: boolean;
  placeholder?: string;
  className?: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  value,
  onChange,
  onGenerate,
  isGenerating = false,
  placeholder = "Describe la imagen que quieres crear...",
  className,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isGenerating) {
      onGenerate(value.trim());
    }
  }, [value, onGenerate, isGenerating]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  }, [onChange]);

  const handleRandomPrompt = useCallback(() => {
    const randomPrompt = getRandomPrompt(selectedCategory || undefined);
    onChange(randomPrompt);
  }, [selectedCategory, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Input Principal */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[100px] resize-none text-base leading-relaxed pr-12"
            disabled={isGenerating}
          />
          
          {/* Contador de caracteres */}
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {value.length}/500
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            disabled={!value.trim() || isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generando...
              </>
            ) : (
              <>
                ✨ Generar Imagen
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleRandomPrompt}
            disabled={isGenerating}
          >
            🎲 Aleatorio
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowSuggestions(!showSuggestions)}
            disabled={isGenerating}
          >
            💡 Sugerencias
          </Button>
        </div>
      </form>

      {/* Panel de Sugerencias */}
      {showSuggestions && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Categorías de Prompts</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(false)}
                className="h-6 w-6 p-0"
              >
                ✕
              </Button>
            </div>
            
            {/* Selector de categorías */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                Todos
              </Badge>
              {promptCategories.map((category) => (
                <Badge
                  key={category.category}
                  variant={selectedCategory === category.category ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.category)}
                >
                  {category.category}
                </Badge>
              ))}
            </div>

            {/* Lista de prompts */}
            <div className="max-h-60 overflow-y-auto space-y-2">
              {(selectedCategory 
                ? promptCategories.find(c => c.category === selectedCategory)?.prompts || []
                : promptCategories.reduce<string[]>((acc, category) => [...acc, ...category.prompts], [])
              ).map((prompt, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors text-sm leading-relaxed"
                  onClick={() => handleSuggestionClick(prompt)}
                >
                  {prompt}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consejos rápidos */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>💡 <strong>Consejo:</strong> Sé específico con los detalles para mejores resultados</p>
        <p>⌨️ <strong>Atajo:</strong> Cmd/Ctrl + Enter para generar rápidamente</p>
      </div>
    </div>
  );
};