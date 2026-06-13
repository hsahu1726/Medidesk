'use client';

import { Moon, Sun } from 'lucide-react';
import MediDeskLogo from './logo';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Header({ isDark, toggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <MediDeskLogo />
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-foreground hover:text-primary transition-colors duration-300 hover:scale-105 hover:translate-y-[-2px] inline-block animate-menu-item">Features</a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors duration-300 hover:scale-105 hover:translate-y-[-2px] inline-block animate-menu-item">Contact</a>
          <a href="#footer" className="text-foreground hover:text-primary transition-colors duration-300 hover:scale-105 hover:translate-y-[-2px] inline-block animate-menu-item">About</a>
        </nav>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-all duration-300 hover:scale-110 hover:rotate-180 animate-menu-item"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
}
