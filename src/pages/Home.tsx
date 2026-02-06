import { MapPin, ImageIcon } from "lucide-react";
import { HeroHome } from "@/components/home/HeroHome";
import { FeatureCard } from "@/components/home/FeatureCard";

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroHome
        title="Hemocentros do Brasil"
        subtitle="Encontre hemocentros próximos e compartilhe sua doação"
        ctaText="Encontrar Hemocentros"
        ctaLink="/hemocentros"
      />

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Card 1 - Buscar Hemocentros */}
            <FeatureCard
              icon={<MapPin className="w-full h-full" />}
              title="Encontre Hemocentros"
              description="Localize hemocentros próximos a você em todos os estados brasileiros"
              stats="200+ hemocentros | 27 estados"
              features={[
                "Busca por estado e cidade",
                "Localização GPS com distância calculada",
                "Informações de contato e endereço completo",
              ]}
              buttonText="Buscar agora"
              buttonLink="/hemocentros"
              variant="coral"
            />

            {/* Card 2 - Foto com Moldura */}
            <FeatureCard
              icon={<ImageIcon className="w-full h-full" />}
              title="Foto com Moldura"
              description="Crie sua foto de doador com moldura personalizada e compartilhe nas redes sociais"
              features={[
                "Upload de imagem fácil e rápido",
                "Recorte ajustável no formato 9:16",
                "Download instantâneo em alta qualidade",
              ]}
              buttonText="Criar foto"
              buttonLink="/foto-moldura"
              variant="magenta"
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Doe sangue. Salve vidas.
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Cada doação pode salvar até 4 vidas. Encontre um hemocentro próximo e faça a diferença.
          </p>
        </div>
      </section>
    </div>
  );
}
