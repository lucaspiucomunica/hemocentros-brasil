import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  estados: string[];
  selectedEstado: string;
  onEstadoChange: (estado: string) => void;
  onNearMeClick: () => void;
  isLoadingLocation: boolean;
  locationError: string | null;
}

export function FilterBar({
  estados,
  selectedEstado,
  onEstadoChange,
  onNearMeClick,
  isLoadingLocation,
  locationError,
}: FilterBarProps) {
  return (
    <div className="bg-card shadow-card rounded-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Filtrar por Estado
          </label>
          <Select value={selectedEstado} onValueChange={onEstadoChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos os estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estados</SelectItem>
              {estados.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:self-end">
          <Button
            onClick={onNearMeClick}
            disabled={isLoadingLocation}
            className="w-full md:w-auto shadow-button"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4 mr-2" />
            )}
            Próximo a mim
          </Button>
        </div>
      </div>

      {locationError && (
        <p className="text-destructive text-sm mt-3">{locationError}</p>
      )}
    </div>
  );
}
