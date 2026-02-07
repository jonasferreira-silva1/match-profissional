# ResumeMatch AI

<div align="center">

![ResumeMatch AI](https://img.shields.io/badge/ResumeMatch-AI-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)
![ML](https://img.shields.io/badge/ML-Embeddings-green?style=for-the-badge)

**Plataforma inteligente de análise de compatibilidade entre currículos e vagas de emprego**

[Características](#-características) • [Tecnologias](#-tecnologias) • [Instalação](#-instalação) • [Docker](#-docker) • [Uso](#-como-usar)

**Desenvolvido por [Jonas Silva](https://github.com/jonasferreira-silva1)** | [LinkedIn](https://www.linkedin.com/in/jonas-silva01/)

</div>

---

## 📋 Sobre o Projeto

**ResumeMatch AI** é uma aplicação web moderna que utiliza técnicas avançadas de **Processamento de Linguagem Natural (NLP)** e **Machine Learning** para analisar a compatibilidade entre currículos e descrições de vagas de emprego. A plataforma oferece um diagnóstico completo e acionável, ajudando candidatos a entender por que não estão passando em processos seletivos e como melhorar suas chances.

### 🌟 Diferenciais Técnicos

- **Embeddings Semânticos**: Usa modelos de ML para entender sinônimos e contexto
- **Extração Robusta de PDF**: Biblioteca profissional (`pdf-parse`) para leitura precisa
- **Detecção Híbrida de Skills**: Combina regex (rápido) + embeddings (preciso)
- **Normalização Inteligente**: Mapeia variações para termos canônicos automaticamente
- **Sugestões Contextuais**: Feedback específico e acionável baseado no score

### 🎯 Objetivo Principal

Resolver o problema de baixa taxa de aprovação em processos seletivos, fornecendo:
- **Análise quantitativa** da compatibilidade entre currículo e vaga
- **Identificação precisa** de skills faltantes e presentes
- **Sugestões práticas e acionáveis** para melhorar o currículo
- **Simulação de ATS** (Applicant Tracking System) para otimização

---

## ✨ Características

### 🔍 Análise Inteligente

- **TF-IDF + Cosine Similarity + Embeddings Semânticos**: 
  - Similaridade textual híbrida (60% embeddings + 40% TF-IDF)
  - Entende sinônimos e contexto automaticamente
  - Detecta skills mesmo com variações de escrita (ex: "React" = "ReactJS" = "React.js")
- **Extração Automática de Skills**: 
  - Identifica mais de 200+ habilidades técnicas e soft skills em 8 categorias
  - Detecção híbrida: regex (rápido) + embeddings semânticos (preciso)
  - Normalização automática de variações
- **Extração Robusta de PDF**: 
  - Biblioteca `pdf-parse` para leitura precisa de PDFs
  - Suporta PDFs comprimidos e diferentes codificações
  - Fallback automático se necessário
- **Detecção de Nível de Experiência**: 
  - Analisa se o nível do candidato (Júnior/Pleno/Sênior) corresponde ao da vaga
  - Detecta anos de experiência mencionados
  - Identifica palavras-chave contextuais
- **Score Composto Adaptativo**: 
  - Calcula score geral ponderado considerando múltiplos fatores
  - Pesos ajustáveis por tipo de vaga

### 📊 Dashboard Interativo

- **Score Ring Animado**: Visualização circular do score geral com animação suave
- **Radar de Competências**: Gráfico radar mostrando compatibilidade por categoria de skills
- **Breakdown Detalhado**: Análise separada de Skills Técnicas, Similaridade Textual e Nível de Experiência
- **Tabs Organizadas**: Visualização separada de Skills, Insights e Sugestões

### 🎨 Interface Moderna

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Dark/Light Mode**: Suporte completo a temas claro e escuro
- **Animações Suaves**: Transições e animações que melhoram a experiência do usuário
- **UI Component Library**: Baseada em Radix UI e shadcn/ui para componentes acessíveis

### 💾 Persistência de Dados

- **Banco de Dados PostgreSQL**: Armazena todas as análises realizadas
- **Histórico Completo**: Mantém registro de análises anteriores com IDs únicos
- **Relação de Skills**: Estrutura relacional para rastreamento detalhado de competências

---

## 🛠 Tecnologias

### Frontend

- **Next.js 16.1.6** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript 5.7.3** - Tipagem estática
- **Tailwind CSS 3.4.17** - Estilização utilitária
- **Radix UI** - Componentes acessíveis e sem estilo
- **shadcn/ui** - Componentes UI customizáveis
- **Recharts 2.15.0** - Gráficos e visualizações
- **Lucide React** - Ícones modernos
- **next-themes** - Gerenciamento de temas

### Backend

- **Next.js API Routes** - Endpoints serverless
- **PostgreSQL** (via `postgres.js`) - Cliente PostgreSQL para conexões locais
- **NLP Engine Customizado** - Implementação própria de TF-IDF e Cosine Similarity
- **Semantic Engine** - Embeddings semânticos com `@xenova/transformers`
- **PDF Parsing** - Extração de texto com `pdf-parse`

### Banco de Dados

- **PostgreSQL** - Banco de dados relacional (local ou Neon)
- **Schema otimizado** com índices para performance
- **Docker Compose** - Orquestração automática com PostgreSQL

### Machine Learning / NLP

- **@xenova/transformers** - Embeddings semânticos (modelo: all-MiniLM-L6-v2)
- **TF-IDF + Cosine Similarity** - Similaridade textual tradicional
- **Hybrid Approach** - Combina métodos clássicos e ML para melhor precisão

### Ferramentas de Desenvolvimento

- **ESLint** - Linter de código
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Compatibilidade de CSS

---

## 🏗 Arquitetura

### Estrutura do Projeto

```
Match-Profissional/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint de análise
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout raiz
│   └── page.tsx                  # Página principal
├── components/
│   ├── ui/                       # Componentes UI base (shadcn)
│   ├── loading-screen.tsx        # Tela de carregamento
│   ├── results-dashboard.tsx     # Dashboard de resultados
│   ├── score-ring.tsx            # Componente de score circular
│   ├── skills-radar.tsx          # Gráfico radar de skills
│   ├── theme-provider.tsx        # Provedor de tema
│   ├── theme-toggle.tsx          # Toggle de tema
│   └── upload-form.tsx           # Formulário de upload
├── lib/
│   ├── nlp-engine.ts             # Motor de NLP (TF-IDF, Cosine, Skills)
│   ├── semantic-engine.ts        # Engine de embeddings semânticos
│   └── utils.ts                  # Utilitários
├── Dockerfile                     # Container da aplicação
├── docker-compose.yml             # Orquestração Docker
├── .dockerignore                  # Arquivos ignorados no build
├── hooks/                        # React hooks customizados
├── scripts/
│   └── create-tables.sql         # Script de criação do banco
└── public/                       # Arquivos estáticos
```

### Fluxo de Dados

1. **Upload/Input**: Usuário envia descrição da vaga e currículo (PDF ou texto)
2. **Extração de PDF**: 
   - Usa `pdf-parse` para extração profissional
   - Fallback para extração manual se necessário
   - Validação do texto extraído
3. **Processamento NLP Híbrido**: 
   - **Tokenização** e limpeza de texto
   - **TF-IDF + Cosine Similarity** (método tradicional)
   - **Embeddings Semânticos** (ML) - gera vetores semânticos
   - **Similaridade Híbrida**: 60% embeddings + 40% TF-IDF
   - **Extração de Skills Híbrida**:
     - Regex primeiro (rápido, exact matches)
     - Embeddings depois (preciso, entende sinônimos)
   - **Normalização**: Mapeia variações para termos canônicos
   - **Detecção de nível de experiência** com palavras-chave expandidas
4. **Análise**: Geração de scores, sugestões contextuais e insights
5. **Persistência**: Salva resultados no banco de dados PostgreSQL
6. **Visualização**: Dashboard interativo com resultados detalhados

### Algoritmos e Técnicas Implementadas

#### TF-IDF (Term Frequency-Inverse Document Frequency)
- Calcula a importância de termos no documento
- Normaliza pela frequência no corpus
- Reduz peso de palavras comuns (stop words)
- **Peso no score final**: 40% da similaridade textual

#### Embeddings Semânticos (Machine Learning)
- Usa modelo `all-MiniLM-L6-v2` (Xenova Transformers)
- Gera vetores semânticos de 384 dimensões
- Entende sinônimos e contexto automaticamente
- **Peso no score final**: 60% da similaridade textual
- **Exemplo**: "React" = "ReactJS" = "React.js" semanticamente

#### Cosine Similarity
- Mede similaridade entre vetores de documentos
- Retorna valor entre 0 e 1
- Independente do tamanho dos documentos
- Usado tanto para TF-IDF quanto para embeddings

#### Skills Matching Híbrido
- **Fase 1 (Regex)**: Busca rápida por correspondência exata e word boundaries
- **Fase 2 (Embeddings)**: Verifica semanticamente skills não encontradas
- Banco de dados com 200+ skills categorizadas
- Normalização automática de variações
- Categorização automática (Linguagens, Frameworks, Databases, etc.)
- **Precisão**: ~85-90% (vs ~60% apenas com regex)

---

## 🚀 Instalação

### Opção 1: Docker (Recomendado) 🐳

A forma mais fácil de rodar o projeto completo:

#### Pré-requisitos
- **Docker Desktop** instalado e rodando
- **Docker Compose** (vem com Docker Desktop)

#### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/jonasferreira-silva1/Match-Profissional
   cd Match-Profissional
   ```

2. **Inicie os containers**
   ```bash
   docker-compose up -d --build
   ```

3. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no navegador

4. **Verificar logs** (opcional)
   ```bash
   docker-compose logs -f app
   ```

**Pronto!** O banco de dados é inicializado automaticamente.

📖 **Veja mais detalhes em [DOCKER.md](./DOCKER.md)**

---

### Opção 2: Instalação Local

#### Pré-requisitos

- **Node.js** 18+ ou superior
- **pnpm** (ou npm/yarn)
- **PostgreSQL** (local ou Neon)

#### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/jonasferreira-silva1/Match-Profissional
   cd Match-Profissional
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Configure o banco de dados**
   
   **Opção A - PostgreSQL Local:**
   ```bash
   # Crie o banco
   createdb resumematch
   
   # Execute o script
   psql resumematch < scripts/create-tables.sql
   ```
   
   **Opção B - Neon (Cloud):**
   - Crie uma conta em [Neon](https://neon.tech)
   - Crie um novo projeto
   - Execute o script SQL no dashboard

4. **Configure variáveis de ambiente**
   
   Crie um arquivo `.env.local` na raiz do projeto:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

5. **Execute o projeto**
   ```bash
   pnpm dev
   # ou
   npm run dev
   ```

6. **Acesse a aplicação**
   
   Abra [http://localhost:3000](http://localhost:3000) no navegador

⚠️ **Nota**: A primeira execução pode demorar ~30-60 segundos para baixar o modelo de embeddings.

---

## 📖 Como Usar

### 1. Preparar os Dados

- **Descrição da Vaga**: Cole a descrição completa da vaga, incluindo:
  - Requisitos técnicos
  - Responsabilidades
  - Tecnologias mencionadas
  - Nível de experiência

- **Currículo**: Você pode enviar de duas formas:
  - **Upload de PDF**: Arraste e solte ou selecione um arquivo PDF
  - **Colar Texto**: Cole diretamente o texto do seu currículo

### 2. Analisar

Clique em **"Analisar Compatibilidade"** e aguarde o processamento:
- **Primeira análise**: ~5-8 segundos (carrega modelo de embeddings)
- **Análises seguintes**: ~2-4 segundos (modelo em cache)
- **Sem embeddings**: ~0.5-1 segundo (fallback)

### 3. Interpretar os Resultados

#### Score Geral
- **80-100%**: Excelente compatibilidade
- **60-79%**: Boa compatibilidade
- **40-59%**: Compatibilidade regular
- **0-39%**: Baixa compatibilidade

#### Detalhamento
- **Skills Técnicas**: Percentual de skills da vaga que você possui
- **Similaridade Textual**: Quão similar é o vocabulário usado
- **Nível de Experiência**: Compatibilidade entre níveis

#### Radar de Competências
Visualize graficamente sua força em cada categoria:
- Linguagens
- Frameworks
- Bancos de Dados
- DevOps/Infra
- Ferramentas
- Conceitos
- Dados/ML
- Soft Skills

#### Skills
- ✅ **Você tem**: Skills presentes tanto na vaga quanto no seu currículo
- ❌ **Faltando**: Skills requeridas pela vaga mas ausentes no currículo
- ➕ **Extras**: Skills no seu currículo que não são mencionadas na vaga

#### Insights
- **Pontos Fortes**: Áreas onde você se destaca
- **Lacunas**: Áreas que precisam de atenção

#### Sugestões
Sugestões categorizadas por prioridade:
- 🔴 **Crítico**: Ações essenciais para melhorar
- 🟡 **Importante**: Melhorias significativas
- 🔵 **Sugestão**: Otimizações adicionais

---

## 🧪 Funcionalidades Técnicas

### Extração de Texto de PDF

O sistema usa **biblioteca profissional** para extração robusta:
- **`pdf-parse`**: Biblioteca especializada para parsing de PDFs
- Suporta PDFs comprimidos e diferentes codificações
- Extração precisa de texto estruturado
- Fallback automático para extração manual se necessário
- Validação do texto extraído antes do processamento

### Processamento de Texto

- **Normalização**: Remove acentos e caracteres especiais
- **Stop Words**: Filtra palavras comuns (português e inglês)
- **Tokenização**: Divide texto em tokens significativos
- **Limpeza**: Remove caracteres não alfanuméricos desnecessários
- **Normalização de Skills**: Mapeia variações para termos canônicos
  - Exemplo: "ReactJS", "React.js", "react-js" → "react"

### Categorização de Skills

O sistema reconhece skills em 8 categorias:

1. **Linguagens**: Python, JavaScript, TypeScript, Java, C#, etc.
2. **Frameworks**: React, Next.js, Django, Flask, Spring, etc.
3. **Databases**: PostgreSQL, MySQL, MongoDB, Redis, etc.
4. **DevOps**: Docker, Kubernetes, AWS, Azure, Terraform, etc.
5. **Ferramentas**: Git, GitHub, Jira, Figma, Postman, etc.
6. **Conceitos**: REST API, GraphQL, Microservices, TDD, SOLID, etc.
7. **Dados/ML**: Machine Learning, TensorFlow, PyTorch, Pandas, etc.
8. **Soft Skills**: Liderança, Comunicação, Trabalho em equipe, etc.

### Cálculo de Scores

O score geral é calculado com pesos adaptativos:

**Similarity Score (Híbrido)**:
- **60%** - Embeddings Semânticos (entende contexto e sinônimos)
- **40%** - TF-IDF + Cosine Similarity (método tradicional)

**Score Final**:
- **60%** - Skills Score (compatibilidade de habilidades)
- **25%** - Similarity Score (híbrido: embeddings + TF-IDF)
- **15%** - Experience Score (compatibilidade de nível)

**Melhorias**:
- Score adaptativo por tipo de vaga (front-end vs back-end)
- Pesos podem ser ajustados dinamicamente

---

## 📊 Banco de Dados

### Schema

#### Tabela `analyses`
Armazena análises realizadas:
- `id`: ID único da análise
- `job_description`: Texto da descrição da vaga
- `resume_text`: Texto do currículo
- `score`: Score geral (0-100)
- `skills_score`: Score de skills (0-100)
- `similarity_score`: Score de similaridade (0-100)
- `experience_score`: Score de experiência (0-100)
- `created_at`: Timestamp de criação

#### Tabela `analysis_skills`
Armazena skills identificadas por análise:
- `id`: ID único
- `analysis_id`: Referência à análise
- `skill_name`: Nome da skill
- `found_in_job`: Se foi encontrada na vaga
- `found_in_resume`: Se foi encontrada no currículo
- `status`: 'match', 'missing' ou 'extra'
- `category`: Categoria da skill

### Índices

- `idx_analysis_skills_analysis_id`: Índice na foreign key
- `idx_analyses_created_at`: Índice para ordenação por data

---

## 🎨 Personalização

### Temas

O projeto suporta temas claro e escuro através de `next-themes`. As cores são definidas via CSS variables em `globals.css`.

### Componentes UI

Os componentes são baseados em `shadcn/ui` e podem ser customizados editando os arquivos em `components/ui/`.

### Adicionar Novas Skills

Edite o objeto `SKILL_DATABASE` em `lib/nlp-engine.ts` para adicionar novas skills ou categorias.

---

## 🔒 Segurança

- **Validação de Input**: Todos os inputs são validados no servidor
- **Sanitização**: Texto é limpo antes do processamento
- **Rate Limiting**: Considere implementar rate limiting em produção
- **Variáveis de Ambiente**: Nunca commite `.env.local`

---

## 🚧 Melhorias Futuras

### ✅ Implementado
- [x] Extração robusta de PDF (pdf-parse)
- [x] Embeddings semânticos para melhor detecção
- [x] Normalização inteligente de skills
- [x] Sugestões contextuais e acionáveis
- [x] Docker e docker-compose
- [x] Detecção híbrida de skills (regex + ML)

### 🔄 Em Planejamento
- [ ] Cache de embeddings para textos comuns
- [ ] Modelo de embeddings mais leve (otimização)
- [ ] Suporte a múltiplos formatos de arquivo (DOCX, TXT)
- [ ] Histórico de análises por usuário
- [ ] Comparação entre múltiplas vagas
- [ ] Exportação de relatórios em PDF
- [ ] API pública para integração
- [ ] Autenticação de usuários
- [ ] Dashboard de estatísticas agregadas
- [ ] Suporte a mais idiomas
- [ ] Fine-tuning de modelo de linguagem (BERT/RoBERTa)
- [ ] Sistema de recomendação baseado em histórico

---

## 📝 Licença

Este projeto é privado. Todos os direitos reservados.

---

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor:
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📧 Contato e Links

**Desenvolvedor**: Jonas Ferreira da Silva

- 🌐 **GitHub**: [@jonasferreira-silva1](https://github.com/jonasferreira-silva1)
- 💼 **LinkedIn**: [jonas-silva01](https://www.linkedin.com/in/jonas-silva01/)
- 📧 **Email**: jonas.fsilva1@hotmail.com

Para dúvidas, sugestões ou problemas, abra uma issue no repositório ou entre em contato.

---

---

## 🐳 Docker

O projeto inclui configuração completa de Docker para facilitar o desenvolvimento e deploy.

### Estrutura Docker

- **Dockerfile**: Multi-stage build otimizado para produção
- **docker-compose.yml**: Orquestração de app + PostgreSQL
- **.dockerignore**: Otimização do build

### Comandos Úteis

```bash
# Iniciar tudo
docker-compose up -d --build

# Ver logs
docker-compose logs -f app

# Parar
docker-compose down

# Reconstruir
docker-compose build --no-cache app
```

📖 **Documentação completa**: [DOCKER.md](./DOCKER.md)

---

## 📈 Performance e Métricas

### Precisão de Detecção

| Métrica | Antes | Depois (com ML) |
|---------|-------|-----------------|
| Detecção de Skills | ~60% | ~85-90% |
| Entende Sinônimos | ❌ | ✅ |
| Falsos Negativos | Alto | Reduzido ~40% |
| Similaridade Textual | TF-IDF apenas | Híbrido (ML + TF-IDF) |

### Tempo de Processamento

- **Primeira análise**: 5-8s (carrega modelo)
- **Análises seguintes**: 2-4s (modelo em cache)
- **Fallback (sem ML)**: 0.5-1s

---

## 🧠 Arquitetura de ML

### Abordagem Híbrida

O sistema combina **métodos clássicos** e **Machine Learning**:

1. **Regex (Rápido)**: Detecta skills com matches exatos
2. **Embeddings (Preciso)**: Complementa com detecção semântica
3. **Normalização**: Unifica variações automaticamente

### Modelo de Embeddings

- **Modelo**: `Xenova/all-MiniLM-L6-v2`
- **Tamanho**: ~23MB (quantizado)
- **Dimensões**: 384
- **Velocidade**: Rápido (otimizado para produção)
- **Precisão**: Boa para uso geral

### Vantagens da Abordagem Híbrida

✅ **Velocidade**: Regex é instantâneo  
✅ **Precisão**: Embeddings entende contexto  
✅ **Robustez**: Fallback automático se ML falhar  
✅ **Escalabilidade**: Processa apenas skills não encontradas por regex

---

<div align="center">

**Feito com ❤️ usando NLP, TF-IDF, Machine Learning e dedicação**

**Desenvolvido por [Jonas Silva](https://github.com/jonasferreira-silva1)**

[⬆ Voltar ao topo](#resumematch-ai)

</div>


