import { useQuery } from "@tanstack/react-query";
import { Hemocentro } from "@/types/hemocentro";

const API_URL = "https://lucassampaio.app.n8n.cloud/webhook/hemocentros";

interface ApiResponse {
  sucesso: boolean;
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
  dados: Hemocentro[];
}

async function fetchAllHemocentros(): Promise<Hemocentro[]> {
  // First, fetch page 1 to get total pages
  const firstResponse = await fetch(`${API_URL}?pagina=1`);
  if (!firstResponse.ok) {
    throw new Error("Erro ao carregar hemocentros");
  }
  const firstData: ApiResponse = await firstResponse.json();
  
  const totalPages = firstData.total_paginas;
  const allHemocentros: Hemocentro[] = [...(firstData.dados || [])];

  // If there are more pages, fetch them all in parallel
  if (totalPages > 1) {
    const pagePromises: Promise<ApiResponse>[] = [];
    
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(
        fetch(`${API_URL}?pagina=${page}`)
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

export function useHemocentros() {
  return useQuery({
    queryKey: ["hemocentros", "all"],
    queryFn: fetchAllHemocentros,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
