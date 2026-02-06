# 🏥 Hemocentros Brasil

Plataforma web para localização e informações sobre hemocentros (bancos de sangue) no Brasil. O projeto facilita a busca por centros de doação de sangue próximos à localização do usuário.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido para ajudar pessoas que desejam doar sangue a encontrar o hemocentro mais próximo de sua localização. A aplicação oferece:

- 📍 Localização automática do usuário via geolocalização
- 🗺️ Lista de hemocentros com informações de contato
- 🔍 Filtros por estado e cidade
- 📊 Estatísticas sobre doação de sangue
- 📱 Interface responsiva e moderna

## 🚀 Tecnologias Utilizadas

### Core
- **[React](https://react.dev/)** `^18.3.1` - Biblioteca JavaScript para construção de interfaces
- **[TypeScript](https://www.typescriptlang.org/)** `^5.8.3` - Superset JavaScript com tipagem estática
- **[Vite](https://vite.dev/)** `^5.4.19` - Build tool e dev server ultra-rápido

### UI/Styling
- **[Tailwind CSS](https://tailwindcss.com/)** `^3.4.17` - Framework CSS utilitário
- **[shadcn/ui](https://ui.shadcn.com/)** - Coleção de componentes React reutilizáveis
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis e não estilizados
- **[Lucide React](https://lucide.dev/)** `^0.462.0` - Biblioteca de ícones

### Funcionalidades
- **[React Router DOM](https://reactrouter.com/)** `^6.30.1` - Roteamento de páginas
- **[TanStack Query](https://tanstack.com/query)** `^5.83.0` - Gerenciamento de estado assíncrono
- **[React Hook Form](https://react-hook-form.com/)** `^7.61.1` - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** `^3.25.76` - Validação de schemas TypeScript
- **[date-fns](https://date-fns.org/)** `^3.6.0` - Manipulação de datas
- **[Recharts](https://recharts.org/)** `^2.15.4` - Gráficos e visualizações

### Bibliotecas de UI Adicionais
- **next-themes** - Suporte para tema claro/escuro
- **sonner** - Notificações toast modernas
- **cmdk** - Command palette
- **vaul** - Drawer component

## 📁 Estrutura do Projeto

```
hemocentros-brasil/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes base do shadcn/ui
│   │   ├── FilterBar.tsx   # Barra de filtros
│   │   ├── HeroSection.tsx # Seção hero da página
│   │   ├── HemocentroCard.tsx      # Card de hemocentro
│   │   ├── HemocentrosList.tsx     # Lista de hemocentros
│   │   ├── NavLink.tsx     # Links de navegação
│   │   └── StatsBar.tsx    # Barra de estatísticas
│   ├── hooks/              # Custom React hooks
│   │   ├── useGeolocation.ts       # Hook de geolocalização
│   │   ├── useHemocentros.ts       # Hook para dados dos hemocentros
│   │   ├── use-mobile.tsx          # Hook para detecção mobile
│   │   └── use-toast.ts            # Hook para notificações
│   ├── lib/                # Utilitários
│   │   └── utils.ts        # Funções auxiliares
│   ├── pages/              # Páginas da aplicação
│   │   ├── Index.tsx       # Página principal
│   │   └── NotFound.tsx    # Página 404
│   ├── test/               # Testes
│   ├── types/              # Definições de tipos TypeScript
│   │   └── hemocentro.ts   # Tipos para hemocentros
│   ├── utils/              # Utilitários gerais
│   │   └── distance.ts     # Cálculo de distâncias
│   ├── App.tsx             # Componente raiz
│   └── main.tsx            # Entry point
├── public/                 # Arquivos estáticos
├── package.json            # Dependências e scripts
├── tsconfig.json           # Configuração TypeScript
├── tailwind.config.ts      # Configuração Tailwind
├── vite.config.ts          # Configuração Vite
└── components.json         # Configuração shadcn/ui
```

## 🛠️ Como Começar

### Pré-requisitos

- **Node.js** (versão 18 ou superior) - [Instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (vem com Node.js)

### Instalação

1. **Clone o repositório**
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd hemocentros-brasil
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Abra no navegador**
```
http://localhost:5173
```

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Build de produção
npm run build:dev        # Build de desenvolvimento

# Preview
npm run preview          # Preview do build de produção

# Qualidade de código
npm run lint             # Executa ESLint

# Testes
npm run test             # Executa testes
npm run test:watch       # Executa testes em modo watch
```

## 🎨 Customização

### Adicionar novos componentes shadcn/ui

```bash
npx shadcn@latest add [component-name]
```

Exemplo:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

### Configurar tema

O tema do Tailwind pode ser customizado em `tailwind.config.ts`. Os componentes shadcn/ui usam variáveis CSS definidas em `src/index.css`.

## 🔄 Fluxo de Desenvolvimento

### Trabalhando com Lovable

Este projeto foi gerado no [Lovable](https://lovable.dev/) e pode ser editado de várias formas:

1. **Via Lovable Platform**: Alterações feitas no Lovable são commitadas automaticamente
2. **Via IDE Local**: Clone o repo, faça alterações e dê push - serão refletidas no Lovable
3. **Via GitHub**: Edite arquivos diretamente no GitHub
4. **Via GitHub Codespaces**: Ambiente de desenvolvimento na nuvem

### Adicionando novas páginas

1. Crie um arquivo em `src/pages/`
2. Adicione a rota em `src/App.tsx`:

```typescript
<Route path="/sua-rota" element={<SuaPagina />} />
```

### Adicionando novos componentes

1. Crie o componente em `src/components/`
2. Para componentes UI base, use `src/components/ui/`
3. Importe onde necessário

### Trabalhando com tipos

Defina tipos customizados em `src/types/`. Exemplo:

```typescript
// src/types/hemocentro.ts
export interface Hemocentro {
  id: string;
  nome: string;
  endereco: string;
  // ...
}
```

## 🧪 Testes

O projeto usa **Vitest** para testes. Arquivos de teste estão em `src/test/`.

```bash
# Executar todos os testes
npm run test

# Modo watch (re-executa ao salvar)
npm run test:watch
```

## 📦 Deploy

### Via Lovable

1. Abra seu projeto no [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
2. Clique em **Share → Publish**

### Manual

```bash
# Build de produção
npm run build

# A pasta dist/ contém os arquivos para deploy
```

Você pode fazer deploy em plataformas como:
- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [GitHub Pages](https://pages.github.com/)

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Boas Práticas

- Use TypeScript para garantir tipagem forte
- Siga os padrões do ESLint configurados no projeto
- Componentes devem ser pequenos e reutilizáveis
- Use hooks customizados para lógica complexa
- Mantenha os estilos consistentes usando Tailwind
- Escreva testes para funcionalidades críticas

## 🐛 Troubleshooting

### Problemas com dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Build falhando

```bash
# Verificar erros de TypeScript
npx tsc --noEmit

# Verificar erros de lint
npm run lint
```

## 📄 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido com ❤️ para facilitar a doação de sangue no Brasil
