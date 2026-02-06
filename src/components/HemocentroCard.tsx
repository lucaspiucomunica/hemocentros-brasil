import { MapPin, Phone, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hemocentro } from "@/types/hemocentro";
import { formatDistance } from "@/utils/distance";

interface HemocentroCardProps {
  hemocentro: Hemocentro;
  distance?: number;
  animationDelay?: number;
}

export function HemocentroCard({
  hemocentro,
  distance,
  animationDelay = 0,
}: HemocentroCardProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${hemocentro.latitude},${hemocentro.longitude}`;

  return (
    <Card
      className="group transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 animate-slide-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {hemocentro.nome}
          </h3>
          <Badge variant="secondary" className="shrink-0 bg-secondary text-secondary-foreground">
            {hemocentro.estado}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
            <span>{hemocentro.endereco_completo}</span>
          </div>

          {hemocentro.telefone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0 text-primary" />
              <a
                href={`tel:${hemocentro.telefone}`}
                className="hover:text-primary transition-colors"
              >
                {hemocentro.telefone}
              </a>
            </div>
          )}

          {distance !== undefined && (
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 shrink-0 text-primary" />
              <span className="font-medium text-primary">
                {formatDistance(distance)} de você
              </span>
            </div>
          )}
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Navigation className="w-3.5 h-3.5" />
          Ver no mapa
        </a>
      </CardContent>
    </Card>
  );
}
