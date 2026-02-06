import { Building2, MapPinned } from "lucide-react";

interface StatsBarProps {
  totalHemocentros: number;
  totalEstados: number;
  filteredCount: number;
}

export function StatsBar({ totalHemocentros, totalEstados, filteredCount }: StatsBarProps) {
  const hasFilter = filteredCount > 0 && filteredCount !== totalHemocentros;
  
  return (
    <div className="flex flex-wrap items-center gap-4 md:gap-6 py-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-primary" />
        <span>
          <strong className="text-primary font-bold">{totalHemocentros}</strong> hemocentros cadastrados
        </span>
      </div>
      <div className="flex items-center gap-2">
        <MapPinned className="w-4 h-4 text-primary" />
        <span>
          <strong className="text-primary font-bold">{totalEstados}</strong> estados
        </span>
      </div>
      {hasFilter && (
        <div className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-xs font-medium">
          Filtrado: {filteredCount} resultado{filteredCount !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
