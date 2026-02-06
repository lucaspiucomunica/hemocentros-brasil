import { useState, useMemo, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FilterBar } from "@/components/FilterBar";
import { HemocentrosList } from "@/components/HemocentrosList";
import { StatsBar } from "@/components/StatsBar";
import { useHemocentros } from "@/hooks/useHemocentros";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance } from "@/utils/distance";
import { Hemocentro } from "@/types/hemocentro";

const Index = () => {
  const { data: hemocentros, isLoading, error } = useHemocentros();
  const { latitude, longitude, loading: loadingLocation, error: locationError, requestLocation } = useGeolocation();
  const [selectedEstado, setSelectedEstado] = useState("all");
  const [sortByDistance, setSortByDistance] = useState(false);

  // Get unique estados sorted alphabetically
  const estados = useMemo(() => {
    if (!hemocentros || !Array.isArray(hemocentros)) return [];
    const uniqueEstados = [...new Set(hemocentros.map((h) => h.estado))];
    return uniqueEstados.sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [hemocentros]);

  // Calculate distances and filter/sort hemocentros
  const filteredHemocentros = useMemo(() => {
    if (!hemocentros || !Array.isArray(hemocentros)) return [];

    let result: (Hemocentro & { distance?: number })[] = hemocentros.map((h) => {
      if (latitude !== null && longitude !== null) {
        return {
          ...h,
          distance: calculateDistance(latitude, longitude, h.latitude, h.longitude),
        };
      }
      return h;
    });

    // Filter by estado
    if (selectedEstado !== "all") {
      result = result.filter((h) => h.estado === selectedEstado);
    }

    // Sort by distance if location is available and user requested it
    if (sortByDistance && latitude !== null && longitude !== null) {
      result = result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return result;
  }, [hemocentros, selectedEstado, latitude, longitude, sortByDistance]);

  const handleNearMeClick = () => {
    setSelectedEstado("all");
    setSortByDistance(true);
    requestLocation();
  };

  const handleEstadoChange = (estado: string) => {
    setSelectedEstado(estado);
    setSortByDistance(false);
  };

  // Auto-sort when location becomes available
  useEffect(() => {
    if (latitude !== null && longitude !== null && sortByDistance) {
      // Location received, list will be sorted automatically via useMemo
    }
  }, [latitude, longitude, sortByDistance]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <main className="container mx-auto px-4 pb-12">
        <FilterBar
          estados={estados}
          selectedEstado={selectedEstado}
          onEstadoChange={handleEstadoChange}
          onNearMeClick={handleNearMeClick}
          isLoadingLocation={loadingLocation}
          locationError={locationError}
        />

        <StatsBar
          totalHemocentros={hemocentros?.length || 0}
          totalEstados={estados.length}
          filteredCount={filteredHemocentros.length}
        />

        <HemocentrosList
          hemocentros={filteredHemocentros}
          isLoading={isLoading}
          error={error}
        />
      </main>

      <footer className="bg-card border-t border-border py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>Doe sangue, salve vidas ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
