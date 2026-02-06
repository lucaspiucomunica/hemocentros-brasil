import { Heart } from "lucide-react";

export function HeroSection() {
  return (
    <header className="gradient-hero py-16 px-4">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-10 h-10 text-primary-foreground animate-pulse-slow" fill="currentColor" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground">
            Hemocentros do Brasil
          </h1>
        </div>
        <p className="text-primary-foreground/90 text-lg md:text-xl max-w-2xl mx-auto">
          Encontre o hemocentro mais próximo de você e ajude a salvar vidas doando sangue
        </p>
      </div>
    </header>
  );
}
