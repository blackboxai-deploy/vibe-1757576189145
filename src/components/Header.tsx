'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { href: '/', label: 'Inicio', icon: '🏠' },
    { href: '/generate', label: 'Generar', icon: '✨' },
    { href: '/enhance', label: 'Mejorar', icon: '🔧' },
    { href: '/gallery', label: 'Galería', icon: '🖼️' },
    { href: '/settings', label: 'Configuración', icon: '⚙️' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        {/* Logo and Brand */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
        >
          <span className="text-3xl">🎨</span>
          <span className="hidden sm:block">AI Image Studio</span>
          <span className="block sm:hidden">AIS</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  'flex items-center space-x-2 transition-all duration-200',
                  pathname === item.href 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation & Theme Toggle */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
            title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            <span className="text-lg">
              {theme === 'dark' ? '☀️' : '🌙'}
            </span>
          </Button>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <details className="dropdown">
              <summary className="btn btn-ghost p-2">
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <div className="w-4 h-0.5 bg-current mb-1"></div>
                  <div className="w-4 h-0.5 bg-current mb-1"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                </div>
              </summary>
              <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 absolute right-0 top-full mt-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-2 p-2 rounded-lg transition-colors',
                        pathname === item.href 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden border-t bg-background/95 backdrop-blur">
        <div className="container px-4 py-2">
          <div className="flex justify-around items-center">
            {navItems.slice(0, 4).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'flex flex-col items-center space-y-1 p-2 h-auto min-w-0',
                    pathname === item.href 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-medium leading-none">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};