# Script de diagnóstico Docker - ResumeMatch AI

Write-Host "=== Status dos Containers ===" -ForegroundColor Cyan
docker-compose ps

Write-Host "`n=== Logs da Aplicação (últimas 20 linhas) ===" -ForegroundColor Cyan
docker-compose logs app --tail 20

Write-Host "`n=== Logs do Banco de Dados (últimas 10 linhas) ===" -ForegroundColor Cyan
docker-compose logs postgres --tail 10

Write-Host "`n=== Verificando Variáveis de Ambiente ===" -ForegroundColor Cyan
docker-compose exec app env | Select-String "DATABASE_URL|NODE_ENV"

Write-Host "`n=== Testando Conexão com o Banco ===" -ForegroundColor Cyan
docker-compose exec postgres psql -U resumematch -d resumematch -c "SELECT COUNT(*) FROM analyses;" 2>&1

Write-Host "`n=== Portas em Uso ===" -ForegroundColor Cyan
netstat -ano | Select-String ":3000|:5432"

Write-Host "`n=== Acesse a aplicação em: http://localhost:3000 ===" -ForegroundColor Green

