import { useState, useMemo, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FilterBar } from "@/components/FilterBar";
import { HemocentrosList } from "@/components/HemocentrosList";
import { StatsBar } from "@/components/StatsBar";
import { useAllHemocentros } from "@/hooks/useHemocentros";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance } from "@/utils/distance";
import { Hemocentro } from "@/types/hemocentro";
import { AlertCircle } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ITEMS_PER_PAGE = 50;
const MAX_DISTANCE_KM = 500;

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEstado, setSelectedEstado] = useState("all");
  const [sortByDistance, setSortByDistance] = useState(false);
  const [showBeyondLimit, setShowBeyondLimit] = useState(false);
  const [showDistanceDialog, setShowDistanceDialog] = useState(false);
  const [closestHemocentro, setClosestHemocentro] = useState<(Hemocentro & { distance: number }) | null>(null);
  
  const { latitude, longitude, loading: loadingLocation, error: locationError, requestLocation } = useGeolocation();
  
  // Busca TODOS os hemocentros de uma vez (única chamada à API)
  const { data: allHemocentrosData, isLoading, error } = useAllHemocentros();
  
  // Extrai lista de estados únicos dos dados
  const estados = useMemo(() => {
    if (!allHemocentrosData) return [];
    const uniqueEstados = [...new Set(allHemocentrosData.map((h) => h.estado))];
    return uniqueEstados.sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [allHemocentrosData]);
  
  // Total geral de hemocentros (sem filtros)
  const totalGeralHemocentros = allHemocentrosData?.length || 0;
  
  // Filtra hemocentros por estado (no frontend)
  const filteredByEstado = useMemo(() => {
    if (!allHemocentrosData) return [];
    if (selectedEstado === "all") return allHemocentrosData;
    return allHemocentrosData.filter((h) => h.estado === selectedEstado);
  }, [allHemocentrosData, selectedEstado]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedEstado, sortByDistance]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Calcula distâncias e ordena hemocentros (no frontend)
  const processedHemocentros = useMemo(() => {
    if (!filteredByEstado || !Array.isArray(filteredByEstado)) return [];

    let result: (Hemocentro & { distance?: number })[] = filteredByEstado.map((h) => {
      if (latitude !== null && longitude !== null) {
        return {
          ...h,
          distance: calculateDistance(latitude, longitude, h.latitude, h.longitude),
        };
      }
      return h;
    });

    // Ordena por distância se a localização estiver disponível e o usuário solicitou
    if (sortByDistance && latitude !== null && longitude !== null) {
      result = result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      // Filtra por distância máxima (500km)
      const withinLimit = result.filter((h) => (h.distance || 0) <= MAX_DISTANCE_KM);
      
      // Se houver resultados dentro do limite, retorna eles
      if (withinLimit.length > 0) {
        return withinLimit;
      }
      
      // Se não houver nenhum dentro do limite
      if (result.length > 0) {
        const closest = result[0] as Hemocentro & { distance: number };
        
        // Se o usuário aceitou ver além do limite, mostra apenas o mais próximo
        if (showBeyondLimit) {
          return [closest];
        }
        
        // Caso contrário, mostra o dialog e retorna vazio
        if (!showDistanceDialog) {
          setClosestHemocentro(closest);
          setShowDistanceDialog(true);
        }
        return [];
      }
    }

    return result;
  }, [filteredByEstado, latitude, longitude, sortByDistance, showBeyondLimit, showDistanceDialog]);

  // Paginação no frontend
  const paginatedHemocentros = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return processedHemocentros.slice(startIndex, endIndex);
  }, [processedHemocentros, currentPage]);

  // Calcula total de páginas e verifica se deve mostrar paginação
  const totalPagesCalculated = Math.ceil(processedHemocentros.length / ITEMS_PER_PAGE);
  const totalFiltradoCalculated = processedHemocentros.length;
  const showPagination = !isLoading && !error && totalFiltradoCalculated > ITEMS_PER_PAGE;

  const handleNearMeClick = () => {
    setSelectedEstado("all"); // Reset o filtro de estado
    setSortByDistance(true);
    setShowBeyondLimit(false);
    requestLocation();
  };

  const handleEstadoChange = (estado: string) => {
    setSelectedEstado(estado);
    setSortByDistance(false); // Desativa ordenação por distância
    setShowBeyondLimit(false);
  };

  const handleShowBeyondLimit = () => {
    setShowBeyondLimit(true);
    setShowDistanceDialog(false);
  };

  const handleCancelBeyondLimit = () => {
    setShowDistanceDialog(false);
    setSortByDistance(false); // Desativa o modo de distância
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const totalPagesToShow = totalPagesCalculated;
    
    if (totalPagesToShow <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPagesToShow; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPagesToShow - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPagesToShow - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      items.push(
        <PaginationItem key={totalPagesToShow}>
          <PaginationLink
            onClick={() => setCurrentPage(totalPagesToShow)}
            isActive={currentPage === totalPagesToShow}
            className="cursor-pointer"
          >
            {totalPagesToShow}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      {/* Dialog para distância além do limite */}
      <AlertDialog open={showDistanceDialog} onOpenChange={setShowDistanceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <AlertDialogTitle>Nenhum hemocentro encontrado em um raio de 500km</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {closestHemocentro && (
                <>
                  O hemocentro mais próximo é o <strong>{closestHemocentro.nome}</strong> em{" "}
                  <strong>{closestHemocentro.estado}</strong>, localizado a aproximadamente{" "}
                  <strong>{closestHemocentro.distance.toFixed(1)} km</strong> de distância.
                  <br />
                  <br />
                  Deseja visualizar este hemocentro mesmo estando além do limite de 500km?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelBeyondLimit}>
              Não, obrigado
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleShowBeyondLimit}>
              Sim, mostrar o mais próximo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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
          totalHemocentros={totalGeralHemocentros}
          totalEstados={27}
          filteredCount={totalFiltradoCalculated}
        />

        {/* Mensagem informativa sobre limite de distância */}
        {sortByDistance && !isLoading && paginatedHemocentros.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {showBeyondLimit ? (
                <>
                  📍 <strong>Mostrando o hemocentro mais próximo</strong> (além do limite de 500km)
                </>
              ) : (
                <>
                  📍 <strong>Mostrando hemocentros em um raio de até 500km</strong> da sua localização
                </>
              )}
            </p>
          </div>
        )}

        <HemocentrosList
          hemocentros={paginatedHemocentros}
          isLoading={isLoading}
          error={error}
        />

        {/* Pagination Controls - só mostra se tiver mais de 50 resultados */}
        {showPagination && totalPagesCalculated > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {renderPaginationItems()}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(totalPagesCalculated, prev + 1))}
                    className={currentPage === totalPagesCalculated ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Página {currentPage} de {totalPagesCalculated} • Mostrando {paginatedHemocentros.length} de {totalFiltradoCalculated} hemocentros
            </p>
          </div>
        )}
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
