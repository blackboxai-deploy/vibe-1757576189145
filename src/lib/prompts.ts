import { PromptSuggestion } from '@/types/image';

export const promptCategories: PromptSuggestion[] = [
  {
    category: 'Retratos',
    prompts: [
      'Retrato profesional de una mujer joven, iluminación suave, fondo desenfocado',
      'Retrato artístico de un hombre mayor con barba, luz dramática, blanco y negro',
      'Niña sonriente con pecas, luz natural, ambiente cálido',
      'Retrato fantasy de un elfo con ojos brillantes, estilo mágico',
      'Empresario exitoso en oficina moderna, retrato corporativo profesional',
    ],
  },
  {
    category: 'Paisajes',
    prompts: [
      'Atardecer dorado sobre montañas nevadas, cielo dramático, reflejos en lago',
      'Bosque encantado con rayos de luz filtrados, atmósfera mágica',
      'Playa tropical con palmeras y aguas cristalinas, paraíso natural',
      'Ciudad futurista con rascacielos iluminados, cyberpunk, noche lluviosa',
      'Campo de lavanda en Provenza, colores vibrantes, cielo azul',
    ],
  },
  {
    category: 'Arte Abstracto',
    prompts: [
      'Composición abstracta con formas geométricas coloridas, estilo bauhaus',
      'Flujo de energía cósmica con gradientes neón, arte digital moderno',
      'Texturas orgánicas en tonos tierra, inspiración natural abstracta',
      'Explosión de colores vibrantes, arte líquido, formas fluidas',
      'Minimalismo geométrico en blanco y negro, líneas precisas',
    ],
  },
  {
    category: 'Fantasía',
    prompts: [
      'Dragón majestuoso volando sobre castillo medieval, fantasy épico',
      'Hada luminosa en bosque mágico, partículas de luz, atmósfera encantada',
      'Guerrero élfico con armadura dorada, espada brillante, estilo heroico',
      'Portal mágico interdimensional con energías místicas, colores neón',
      'Ciudad flotante en las nubes, arquitectura fantástica, mundo mágico',
    ],
  },
  {
    category: 'Ciencia Ficción',
    prompts: [
      'Astronauta explorando planeta alienígena, paisaje extraterrestre, dos lunas',
      'Robot humanoide avanzado con ojos LED, tecnología futurista',
      'Nave espacial cruzando nebulosa colorida, viaje interestelar épico',
      'Laboratorio científico del futuro con hologramas, alta tecnología',
      'Metrópolis cyberpunk con neón y lluvia, ambiente distópico',
    ],
  },
  {
    category: 'Animales',
    prompts: [
      'León majestuoso en sabana africana, luz dorada, mirada intensa',
      'Lobo aullando a la luna llena, bosque nocturno, atmósfera mística',
      'Colibrí alimentándose de flores coloridas, macro fotografía, detalles nítidos',
      'Delfín saltando fuera del agua, océano azul cristalino, momento dinámico',
      'Águila real en vuelo, montañas de fondo, majestuosidad natural',
    ],
  },
  {
    category: 'Arquitectura',
    prompts: [
      'Catedral gótica con vitrales coloridos, arquitectura medieval impresionante',
      'Casa moderna minimalista con ventanales, diseño contemporáneo elegante',
      'Rascacielos futurista con fachada de cristal, arquitectura urbana innovadora',
      'Templo japonés tradicional entre cerezos en flor, serenidad oriental',
      'Puente colgante iluminado de noche, ingeniería espectacular',
    ],
  },
  {
    category: 'Comida',
    prompts: [
      'Plato gourmet elegantemente presentado, alta cocina, iluminación profesional',
      'Pizza artesanal recién horneada, ingredientes frescos, ambiente rústico',
      'Postre decadente con chocolate y frutas, fotografía gastronómica premium',
      'Mesa de desayuno continental, luz matutina suave, estilo lifestyle',
      'Sushi artístico en plato de cerámica, presentación japonesa tradicional',
    ],
  },
];

export const stylePromptModifiers = {
  realistic: 'fotorrealista, alta definición, detalles nítidos',
  artistic: 'pintura al óleo, pinceladas visibles, estilo artístico',
  cartoon: 'estilo cartoon, colores vibrantes, líneas suaves',
  anime: 'estilo anime, ojos grandes, colores saturados',
  cyberpunk: 'estilo cyberpunk, neón, alta tecnología, atmósfera futurista',
  fantasy: 'arte fantasy, mágico, épico, colores místicos',
  abstract: 'arte abstracto, formas no figurativas, composición experimental',
  vintage: 'estilo vintage, tonos sepia, textura antigua',
  oil_painting: 'pintura al óleo clásica, técnica tradicional, colores ricos',
  watercolor: 'acuarela, transparencias, colores suaves, papel texturizado',
  sketch: 'boceto a lápiz, líneas sueltas, sombreado artístico',
  digital_art: 'arte digital moderno, colores vibrantes, técnica digital',
};

export const qualityPromptModifiers = {
  draft: 'boceto rápido, líneas básicas',
  standard: 'calidad estándar, detalles moderados',
  high: 'alta calidad, detalles finos, iluminación profesional',
  ultra: 'calidad ultra, hiperrealista, detalles excepcionales, resolución 8K',
};

export const negativePrompts = {
  general: 'baja calidad, borroso, distorsionado, deformado, mal dibujado',
  realistic: 'cartoon, anime, dibujado, pintado, no fotográfico',
  artistic: 'fotografía, realista, técnica digital',
  portrait: 'manos extra, dedos deformados, ojos asimétricos, cara distorsionada',
};

export function buildPrompt(
  basePrompt: string,
  style: keyof typeof stylePromptModifiers,
  quality: keyof typeof qualityPromptModifiers
): string {
  const styleModifier = stylePromptModifiers[style];
  const qualityModifier = qualityPromptModifiers[quality];
  
  return `${basePrompt}, ${styleModifier}, ${qualityModifier}`;
}

export function getRandomPrompt(category?: string): string {
  if (category) {
    const categoryData = promptCategories.find(c => c.category === category);
    if (categoryData) {
      return categoryData.prompts[Math.floor(Math.random() * categoryData.prompts.length)];
    }
  }
  
  const allPrompts = promptCategories.reduce<string[]>((acc, c) => [...acc, ...c.prompts], []);
  return allPrompts[Math.floor(Math.random() * allPrompts.length)];
}

export function getSimilarPrompts(prompt: string, count: number = 3): string[] {
  const words = prompt.toLowerCase().split(' ');
  const allPrompts = promptCategories.reduce<string[]>((acc, c) => [...acc, ...c.prompts], []);
  
  const scored = allPrompts
    .filter(p => p !== prompt)
    .map(p => ({
      prompt: p,
      score: words.reduce((acc, word) => {
        return acc + (p.toLowerCase().includes(word) ? 1 : 0);
      }, 0),
    }))
    .sort((a, b) => b.score - a.score);
    
  return scored.slice(0, count).map(s => s.prompt);
}