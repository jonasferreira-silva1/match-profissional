# ResumeMatch AI

<div align="center">

![ResumeMatch AI](https://img.shields.io/badge/ResumeMatch-AI-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue?style=for-the-badge&logo=postgresql)

**Plataforma inteligente de análise de compatibilidade entre currículos e vagas de emprego**

[Características](#-características) • [Tecnologias](#-tecnologias) • [Instalação](#-instalação) • [Uso](#-como-usar)

</div>

---

## 📋 Sobre o Projeto

**ResumeMatch AI** é uma aplicação web moderna que utiliza técnicas avançadas de **Processamento de Linguagem Natural (NLP)** para analisar a compatibilidade entre currículos e descrições de vagas de emprego. A plataforma oferece um diagnóstico completo e acionável, ajudando candidatos a entender por que não estão passando em processos seletivos e como melhorar suas chances.

### 🎯 Objetivo Principal

Resolver o problema de baixa taxa de aprovação em processos seletivos, fornecendo:
- **Análise quantitativa** da compatibilidade entre currículo e vaga
- **Identificação precisa** de skills faltantes e presentes
- **Sugestões práticas e acionáveis** para melhorar o currículo
- **Simulação de ATS** (Applicant Tracking System) para otimização

---

## ✨ Características

### 🔍 Análise Inteligente

- **TF-IDF + Cosine Similarity**: Algoritmo de similaridade textual que compara o vocabulário e termos-chave entre a vaga e o currículo
- **Extração Automática de Skills**: Identifica mais de 200+ habilidades técnicas e soft skills em 8 categorias diferentes
- **Detecção de Nível de Experiência**: Analisa se o nível do candidato (Júnior/Pleno/Sênior) corresponde ao da vaga
- **Score Composto**: Calcula um score geral ponderado considerando múltiplos fatores

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
- **Neon Serverless** - Cliente PostgreSQL serverless
- **NLP Engine Customizado** - Implementação própria de TF-IDF e Cosine Similarity

### Banco de Dados

- **PostgreSQL** (via Neon) - Banco de dados relacional
- **Schema otimizado** com índices para performance

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
│   ├── nlp-engine.ts             # Motor de NLP (TF-IDF, Cosine)
│   └── utils.ts                  # Utilitários
├── hooks/                        # React hooks customizados
├── scripts/
│   └── create-tables.sql         # Script de criação do banco
└── public/                       # Arquivos estáticos
```

### Fluxo de Dados

1. **Upload/Input**: Usuário envia descrição da vaga e currículo (PDF ou texto)
2. **Extração**: Sistema extrai texto do PDF (se aplicável)
3. **Processamento NLP**: 
   - Tokenização e limpeza de texto
   - Cálculo de TF-IDF
   - Similaridade de cosseno
   - Extração de skills
   - Detecção de nível de experiência
4. **Análise**: Geração de scores, sugestões e insights
5. **Persistência**: Salva resultados no banco de dados
6. **Visualização**: Dashboard interativo com resultados

### Algoritmos Implementados

#### TF-IDF (Term Frequency-Inverse Document Frequency)
- Calcula a importância de termos no documento
- Normaliza pela frequência no corpus
- Reduz peso de palavras comuns (stop words)

#### Cosine Similarity
- Mede similaridade entre vetores de documentos
- Retorna valor entre 0 e 1
- Independente do tamanho dos documentos

#### Skills Matching
- Banco de dados com 200+ skills categorizadas
- Busca por correspondência exata e word boundaries
- Categorização automática (Linguagens, Frameworks, Databases, etc.)

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18+ ou superior
- **pnpm** (ou npm/yarn)
- **PostgreSQL** (via Neon ou local)
- **Conta Neon** (recomendado) ou PostgreSQL local

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd Match-Profissional
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Configure o banco de dados**
   
   Crie um banco PostgreSQL (recomendado: [Neon](https://neon.tech)) e execute o script:
   ```bash
   psql <your-database-url> < scripts/create-tables.sql
   ```

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

Clique em **"Analisar Compatibilidade"** e aguarde o processamento (geralmente 1-3 segundos).

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

O sistema implementa extração básica de texto de PDFs através de:
- Parsing de objetos de texto PDF (BT/ET markers)
- Extração de operadores Tj e TJ
- Fallback para texto legível quando parsing falha

### Processamento de Texto

- **Normalização**: Remove acentos e caracteres especiais
- **Stop Words**: Filtra palavras comuns (português e inglês)
- **Tokenização**: Divide texto em tokens significativos
- **Limpeza**: Remove caracteres não alfanuméricos desnecessários

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

O score geral é calculado com pesos:
- **60%** - Skills Score (compatibilidade de habilidades)
- **25%** - Similarity Score (similaridade textual)
- **15%** - Experience Score (compatibilidade de nível)

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

- [ ] Suporte a múltiplos formatos de arquivo (DOCX, TXT)
- [ ] Extração de PDF mais robusta (usando bibliotecas especializadas)
- [ ] Histórico de análises por usuário
- [ ] Comparação entre múltiplas vagas
- [ ] Exportação de relatórios em PDF
- [ ] API pública para integração
- [ ] Autenticação de usuários
- [ ] Dashboard de estatísticas agregadas
- [ ] Suporte a mais idiomas
- [ ] Machine Learning para melhorar detecção de skills

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

## 📧 Contato

Para dúvidas, sugestões ou problemas, abra uma issue no repositório.

---

<div align="center">

**Feito com ❤️ usando NLP, TF-IDF e dedicação**

[⬆ Voltar ao topo](#resumematch-ai)

</div>

