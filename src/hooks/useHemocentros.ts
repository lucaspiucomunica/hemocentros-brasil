import { useQuery } from "@tanstack/react-query";
import { Hemocentro } from "@/types/hemocentro";

const API_URL = "https://lucassampaio.app.n8n.cloud/webhook/hemocentros";

export interface ApiResponse {
  sucesso: boolean;
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
  dados: Hemocentro[];
}

interface FetchHemocentrosParams {
  page?: number;
  estado?: string;
}

async function fetchHemocentros({ page = 1, estado }: FetchHemocentrosParams): Promise<ApiResponse> {
  const params = new URLSearchParams();
  params.append("pagina", page.toString());
  if (estado && estado !== "all") {
    params.append("estado", estado);
  }
  
  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Erro ao carregar hemocentros");
  }
  const data: ApiResponse = await response.json();
  return data;
}

// Busca TODAS as páginas e retorna todos os hemocentros (com filtro opcional de estado)
async function fetchAllHemocentros(estado?: string): Promise<Hemocentro[]> {
  // Constrói a URL da primeira página
  const params = new URLSearchParams();
  params.append("pagina", "1");
  if (estado && estado !== "all") {
    params.append("estado", estado);
  }

  // Busca primeira página para saber quantas páginas existem
  const firstResponse = await fetch(`${API_URL}?${params.toString()}`);
  if (!firstResponse.ok) {
    throw new Error("Erro ao carregar hemocentros");
  }
  const firstData: ApiResponse = await firstResponse.json();
  
  const totalPages = firstData.total_paginas;
  const allHemocentros: Hemocentro[] = [...(firstData.dados || [])];

  // Se houver mais páginas, busca todas em paralelo
  if (totalPages > 1) {
    const pagePromises: Promise<ApiResponse>[] = [];
    
    for (let page = 2; page <= totalPages; page++) {
      const pageParams = new URLSearchParams();
      pageParams.append("pagina", page.toString());
      if (estado && estado !== "all") {
        pageParams.append("estado", estado);
      }
      
      pagePromises.push(
        fetch(`${API_URL}?${pageParams.toString()}`)
          .then((res) => {
            if (!res.ok) throw new Error(`Erro ao carregar página ${page}`);
            return res.json();
          })
      );
    }

    const pageResults = await Promise.all(pagePromises);
    
    for (const pageData of pageResults) {
      if (pageData.dados && Array.isArray(pageData.dados)) {
        allHemocentros.push(...pageData.dados);
      }
    }
  }

  return allHemocentros;
}

// Hook para buscar hemocentros com paginação e filtros
export function useHemocentros(page: number = 1, estado?: string) {
  return useQuery({
    queryKey: ["hemocentros", page, estado],
    queryFn: () => fetchHemocentros({ page, estado }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook para buscar TODOS os hemocentros (para ordenação por distância)
export function useAllHemocentros(enabled: boolean = true, estado?: string) {
  return useQuery({
    queryKey: ["hemocentros", "all", estado],
    queryFn: () => fetchAllHemocentros(estado),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled, // Só busca quando enabled = true
  });
}

// Hook para buscar todos os estados disponíveis
export function useEstados() {
  return useQuery({
    queryKey: ["hemocentros", "estados"],
    queryFn: async () => {
      const allHemocentros = await fetchAllHemocentros();
      const uniqueEstados = [...new Set(allHemocentros.map((h) => h.estado))];
      return uniqueEstados.sort((a, b) => a.localeCompare(b, "pt-BR"));
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook para buscar o total geral (sem filtros)
export function useHemocentrosTotals() {
  return useQuery({
    queryKey: ["hemocentros", "totals"],
    queryFn: () => fetchHemocentros({ page: 1 }),
    staleTime: 1000 * 60 * 10, // 10 minutes (muda menos)
    select: (data) => ({
      total: data.total,
      totalPaginas: data.total_paginas,
    }),
  });
}
