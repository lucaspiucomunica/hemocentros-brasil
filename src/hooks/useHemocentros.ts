import { useQuery } from "@tanstack/react-query";
import { Hemocentro } from "@/types/hemocentro";

const API_URL = "https://lucassampaio.app.n8n.cloud/webhook/hemocentros";

// Busca TODOS os hemocentros de uma única vez (sem filtros, sem paginação)
// A API do n8n agora retorna todos os dados em uma única chamada
async function fetchAllHemocentros(): Promise<Hemocentro[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Erro ao carregar hemocentros");
  }
  const data = await response.json();
  
  // Compatibilidade: suporta tanto formato novo (array) quanto antigo (objeto com .dados)
  // Formato NOVO (simplificado): [ {...}, {...}, ... ]
  if (Array.isArray(data)) {
    console.log("✅ API no formato NOVO (otimizado) - array direto");
    return data;
  }
  
  // Formato ANTIGO (paginado): { "dados": [ {...}, {...}, ... ], "pagina": 1, "total_paginas": 7 }
  if (data && Array.isArray(data.dados)) {
    console.warn("⚠️ API ainda no formato ANTIGO (paginado).");
    console.warn("📋 Atualize o workflow no n8n para economizar execuções!");
    console.warn("📄 Veja: GUIA_ATUALIZACAO_N8N.md");
    
    const allHemocentros: Hemocentro[] = [...data.dados];
    const totalPages = data.total_paginas || 1;
    
    // Se houver mais páginas, busca todas
    if (totalPages > 1) {
      console.log(`📥 Buscando ${totalPages} páginas...`);
      const pagePromises: Promise<any>[] = [];
      
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
      
      console.log(`✅ ${allHemocentros.length} hemocentros carregados de ${totalPages} páginas`);
    }
    
    return allHemocentros;
  }
  
  // Formato desconhecido
  console.error("❌ Formato de resposta inesperado:", data);
  throw new Error("Formato de resposta da API inválido");
}

// Hook principal - busca TODOS os hemocentros de uma vez
// Cache de 30 DIAS (2.592.000.000 ms) já que os dados são atualizados mensalmente
export function useAllHemocentros() {
  return useQuery({
    queryKey: ["hemocentros", "all"],
    queryFn: fetchAllHemocentros,
    staleTime: 1000 * 60 * 60 * 24 * 30, // 30 dias
    gcTime: 1000 * 60 * 60 * 24 * 30, // 30 dias (cache persistente)
    refetchOnWindowFocus: false, // Não recarrega ao focar na janela
    refetchOnReconnect: false, // Não recarrega ao reconectar
  });
}
