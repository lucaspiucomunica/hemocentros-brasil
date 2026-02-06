import { Hemocentro } from "@/types/hemocentro";
import { HemocentroCard } from "./HemocentroCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";

interface HemocentrosListProps {
  hemocentros: (Hemocentro & { distance?: number })[];
  isLoading: boolean;
  error: Error | null;
}

export function HemocentrosList({
  hemocentros,
  isLoading,
  error,
}: HemocentrosListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-5 shadow-card">
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-lg">
          Erro ao carregar hemocentros. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  if (hemocentros.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">
          Nenhum hemocentro encontrado com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {hemocentros.map((hemocentro, index) => (
        <HemocentroCard
          key={hemocentro.id}
          hemocentro={hemocentro}
          distance={hemocentro.distance}
          animationDelay={index * 50}
        />
      ))}
    </div>
  );
}
