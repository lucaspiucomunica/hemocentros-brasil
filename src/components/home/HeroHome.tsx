import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroHomeProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export function HeroHome({ title, subtitle, ctaText, ctaLink }: HeroHomeProps) {
  return (
    <section className="gradient-hero-home text-white py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="flex justify-center mb-6">
          <Heart className="h-16 w-16 md:h-20 md:w-20 animate-pulse-slow" />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
          {title}
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-2xl mx-auto animate-slide-up">
          {subtitle}
        </p>

        <Link to={ctaLink}>
          <Button
            size="lg"
            variant="outline"
            className="bg-white/10 hover:bg-white/20 border-white text-white hover:text-white backdrop-blur-sm"
          >
            {ctaText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
