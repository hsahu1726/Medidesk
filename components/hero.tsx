'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useScrollAnimation } from '@/hooks/use-scroll-animation';

export default function Hero() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-20 md:py-32">
      {/* Animated blob background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full animate-blob blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full animate-blob animation-delay-2000 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-primary/20 rounded-full animate-blob animation-delay-4000 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className={`text-5xl md:text-6xl font-bold text-balance mb-6 text-foreground transition-all duration-1000 ${isVisible ? 'animate-float' : 'opacity-0 translate-y-8'}`}>
          MediDesk <span className="text-primary">– Smart Medicine Helper</span>
        </h1>
        
        <p className={`text-xl md:text-2xl text-muted-foreground text-balance mb-10 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'animate-float' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: isVisible ? '0.2s' : '0s' }}>
          Your AI-powered medicine assistant. <span className="text-primary font-semibold">Scan medicines</span>, <span className="text-primary font-semibold">read prescriptions</span>, and <span className="text-primary font-semibold">set reminders</span> effortlessly.
        </p>
        
        <Link href="#features" passHref>
  <Button asChild className="mt-8 px-8 py-4 text-lg font-semibold">
    <span>Get Started</span>
  </Button>
</Link>
      </div>
    </section>
  );
}
