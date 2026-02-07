# 🐳 Guia Docker - ResumeMatch AI

## Requisitos

- Docker
- Docker Compose

## Uso Rápido

### 1. Construir e iniciar os containers

```bash
docker-compose up -d --build
```

### 2. Acessar a aplicação

Abra [http://localhost:3000](http://localhost:3000)

### 3. Parar os containers

```bash
docker-compose down
```

### 4. Parar e remover volumes (limpar dados)

```bash
docker-compose down -v
```

## Comandos Úteis

### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas aplicação
docker-compose logs -f app

# Apenas banco de dados
docker-compose logs -f postgres
```

### Executar comandos no container

```bash
# Acessar shell do container da aplicação
docker-compose exec app sh

# Executar comandos no banco
docker-compose exec postgres psql -U resumematch -d resumematch
```

### Reconstruir apenas a aplicação

```bash
docker-compose build app
docker-compose up -d app
```

## Estrutura

- **app**: Container da aplicação Next.js (frontend + backend)
- **postgres**: Container do banco de dados PostgreSQL

## Variáveis de Ambiente

As variáveis estão configuradas no `docker-compose.yml`. Para customizar, edite o arquivo ou use um arquivo `.env`.

## Banco de Dados

O banco é inicializado automaticamente com o script `scripts/create-tables.sql` na primeira execução.

**Credenciais padrão:**
- Usuário: `resumematch`
- Senha: `resumematch123`
- Database: `resumematch`
- Porta: `5432`

## Troubleshooting

### Erro: "The system cannot find the file specified" ou "unable to get image"

**Problema:** Docker Desktop não está rodando ou não está acessível.

**Solução:**
1. Abra o **Docker Desktop** no Windows
2. Aguarde até que o ícone na bandeja do sistema mostre "Docker Desktop is running"
3. Verifique se o Docker está rodando:
   ```bash
   docker --version
   docker ps
   ```
4. Se ainda não funcionar, reinicie o Docker Desktop
5. Tente novamente:
   ```bash
   docker-compose up -d --build
   ```

### Porta já em uso

Se a porta 3000 ou 5432 estiver em uso, altere no `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Mude 3000 para outra porta
```

### Reconstruir do zero

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

