# 🚀 Guia de Atualização do n8n - Economia de Execuções

## 📊 Problema Identificado

**Antes**: Cada filtro/paginação → nova execução n8n → **$$$ gastando créditos**

**Depois**: 1 única execução por sessão do usuário → cache de 30 dias → **economia massiva**

---

## 🎯 Mudanças Implementadas

### 1. Frontend (✅ JÁ IMPLEMENTADO)
- ✅ Busca TODOS os dados em 1 única chamada
- ✅ Cache de 30 dias no navegador
- ✅ Filtragem por estado no JavaScript
- ✅ Paginação no JavaScript
- ✅ Ordenação por distância no JavaScript
- ✅ Zero chamadas adicionais ao n8n durante uso

### 2. Backend n8n (⚠️ VOCÊ PRECISA FAZER)

---

## ⚠️ IMPORTANTE: Compatibilidade Durante Transição

O código frontend foi atualizado para ser **compatível com ambos os formatos**:

- ✅ **Formato ANTIGO** (paginado): Funciona normalmente, mas faz múltiplas requisições
- ✅ **Formato NOVO** (simplificado): Faz apenas 1 requisição e economiza execuções

Isso significa que **o site já funciona agora**, mas você deve atualizar o n8n para obter os benefícios completos de economia.

### 🔍 Como Saber Qual Formato Está Usando

Abra o **Console do navegador** (F12):

- **Formato ANTIGO**: `⚠️ API ainda no formato ANTIGO (paginado)`
- **Formato NOVO**: `✅ API no formato NOVO (otimizado)`

---

## 📝 O Que Fazer no n8n

### Opção 1: Substituir o Workflow Atual (RECOMENDADO)

1. **Abra o n8n** no navegador

2. **Importe o novo workflow**:
   - Arquivo: `API Hemocentros Brasil - SIMPLIFICADO.json`
   - Clique em "Import from File" no n8n
   - Selecione o arquivo SIMPLIFICADO

3. **Configure as credenciais do Google Sheets**:
   - No node "Ler Google Sheets"
   - Selecione sua credencial existente: `Google Sheets account`

4. **Desative o workflow antigo**:
   - Vá no workflow "API Hemocentros Brasil - GET com Cache e Filtros"
   - Clique em "Active: true" para desativar

5. **Ative o novo workflow**:
   - Vá no workflow "API Hemocentros Brasil - SIMPLIFICADO"
   - Clique em "Active: false" para ativar

6. **Teste a API**:
   ```bash
   # No PowerShell ou navegador:
   https://lucassampaio.app.n8n.cloud/webhook/hemocentros
   ```
   - Deve retornar um array JSON com TODOS os hemocentros
   - Sem parâmetros de query (estado, pagina, etc)

### Opção 2: Criar Novo Endpoint (Menos Recomendado)

Se preferir manter o workflow antigo ativo por segurança:

1. **Importe como novo workflow** (mesmo processo acima)
2. **Mude o webhook ID** no node "Webhook GET":
   - De: `hemocentros-api-v2`
   - Para: `hemocentros` (mesmo do antigo)
3. **Ative** o novo workflow
4. **Desative** o antigo depois de testar

---

## 🔍 Diferenças do Novo Workflow

### Workflow ANTIGO (complexo):
```
Webhook → VerificarCache → IF cache válido?
  ├─ SIM → Aplicar FILTROS → Aplicar PAGINAÇÃO → Responder
  └─ NÃO → Ler Sheets → Aplicar FILTROS → Aplicar PAGINAÇÃO → Responder
```
- ❌ Filtros no backend
- ❌ Paginação no backend
- ❌ Cache de 5 minutos
- ❌ Múltiplas execuções por sessão

### Workflow NOVO (simplificado):
```
Webhook → VerificarCache → IF cache válido?
  ├─ SIM → Responder TODOS os dados
  └─ NÃO → Ler Sheets → Responder TODOS os dados
```
- ✅ Zero filtros no backend
- ✅ Zero paginação no backend
- ✅ Cache de 30 DIAS
- ✅ 1 execução por sessão

---

## 📈 Economia Estimada

### Cenário Típico (1 usuário navegando):

**ANTES**:
- Carrega página: 1 execução
- Filtra por "São Paulo": 1 execução
- Troca para página 2: 1 execução
- Filtra por "Rio de Janeiro": 1 execução
- Ordena por distância: 5-10 execuções (busca todas as páginas)
- **TOTAL: 10-15 execuções por sessão** 😱

**DEPOIS**:
- Carrega página: 1 execução
- Filtra por "São Paulo": 0 execuções (frontend)
- Troca para página 2: 0 execuções (frontend)
- Filtra por "Rio de Janeiro": 0 execuções (frontend)
- Ordena por distância: 0 execuções (frontend)
- **TOTAL: 1 execução por sessão** 🎉

### Por Mês:

**ANTES**:
- 100 sessões × 10 execuções = **1.000 execuções/mês**

**DEPOIS**:
- 100 sessões × 1 execução = **100 execuções/mês**
- Ou até menos se o usuário recarregar a página (cache do navegador)

**ECONOMIA: 90% das execuções** 💰

---

## ✅ Checklist de Verificação

Após implementar, verifique:

- [ ] Workflow novo está ativo no n8n
- [ ] Workflow antigo está desativado
- [ ] API retorna array JSON (não objeto com paginação)
- [ ] Frontend carrega os dados corretamente
- [ ] Filtros por estado funcionam
- [ ] Paginação funciona
- [ ] Botão "Próximo a mim" funciona
- [ ] Performance está rápida (sem delays)

---

## 🆘 Solução de Problemas

### Erro: "Cannot read property 'dados' of undefined"

**Causa**: O frontend espera o formato antigo (objeto com `dados`)

**Solução**: Certifique-se de que AMBOS foram atualizados:
- ✅ Arquivo: `src/hooks/useHemocentros.ts`
- ✅ Arquivo: `src/pages/Index.tsx`

### Erro: "CORS policy"

**Causa**: Headers CORS não configurados

**Solução**: No workflow n8n, node "Webhook GET":
- Verifique que `Access-Control-Allow-Origin: *` está presente
- Ou configure seu domínio específico

### Cache não está funcionando

**Causa**: StaticData pode ter sido limpo

**Solução**: 
1. Faça uma requisição à API
2. Espere carregar do Sheets (1-2s)
3. Próximas requisições devem ser instantâneas

---

## 🎉 Resultado Final

Após implementar:

1. **Performance**: Filtros instantâneos (0ms de rede)
2. **Economia**: ~90% menos execuções
3. **UX**: Experiência muito mais rápida
4. **Manutenção**: Você atualiza o Sheets 1x/mês e o cache expira automaticamente

---

## 💡 Dicas Extras

### Atualizar Dados Manualmente

Se você atualizou o Google Sheets e quer limpar o cache:

1. **No n8n**: Vá em "Settings" → "Variables" → limpe `staticData`
2. **Ou aguarde**: O cache expira automaticamente em 30 dias

### Monitorar Execuções

No n8n, vá em "Executions" para ver:
- Quantas vezes o workflow executou
- Quanto tempo levou cada execução
- Se houve erros

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12)
2. Verifique a aba "Executions" no n8n
3. Compare com os arquivos de exemplo fornecidos

**Arquivos criados**:
- ✅ `API Hemocentros Brasil - SIMPLIFICADO.json` (novo workflow)
- ✅ `GUIA_ATUALIZACAO_N8N.md` (este arquivo)
- ✅ `src/hooks/useHemocentros.ts` (atualizado)
- ✅ `src/pages/Index.tsx` (atualizado)
