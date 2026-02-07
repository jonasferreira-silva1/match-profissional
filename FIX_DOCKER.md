# 🔧 Como Corrigir Erro do Docker

## Erro: "500 Internal Server Error" ou "unable to get image"

### ✅ Solução 1: Reiniciar Docker Desktop (Mais Comum)

1. **Feche completamente o Docker Desktop**
   - Clique com botão direito no ícone do Docker na bandeja do sistema
   - Selecione "Quit Docker Desktop"
   - Aguarde alguns segundos

2. **Abra o Docker Desktop novamente**
   - Procure "Docker Desktop" no menu Iniciar
   - Aguarde até aparecer "Docker Desktop is running"

3. **Verifique se está funcionando**:
   ```bash
   docker ps
   ```

4. **Tente novamente**:
   ```bash
   docker-compose up -d --build app
   ```

---

### ✅ Solução 2: Reiniciar o Serviço Docker

1. Abra o **Gerenciador de Tarefas** (Ctrl + Shift + Esc)
2. Vá na aba **Serviços**
3. Procure por **Docker Desktop Service**
4. Clique com botão direito → **Reiniciar**

---

### ✅ Solução 3: Verificar Versão da API do Docker

O erro pode ser incompatibilidade de versão. Tente:

```bash
# Verificar versão do Docker
docker version

# Se a versão do cliente e servidor forem muito diferentes, atualize o Docker Desktop
```

---

### ✅ Solução 4: Limpar e Reconstruir

Se nada funcionar, tente limpar tudo:

```bash
# Parar todos os containers
docker-compose down

# Limpar imagens antigas (opcional)
docker system prune -a

# Tentar novamente
docker-compose up -d --build app
```

---

### ✅ Solução 5: Atualizar Docker Desktop

1. Baixe a versão mais recente do Docker Desktop
2. Desinstale a versão atual
3. Instale a nova versão
4. Reinicie o computador

---

## 🎯 Solução Rápida (Recomendada)

**Passo a passo mais simples:**

1. Feche o Docker Desktop completamente
2. Abra o Docker Desktop novamente
3. Aguarde aparecer "Docker Desktop is running"
4. Execute:
   ```bash
   docker-compose up -d --build app
   ```

---

## ⚠️ Se Nada Funcionar

Se após tentar todas as soluções ainda não funcionar:

1. **Verifique os logs do Docker Desktop**:
   - Abra Docker Desktop
   - Vá em Settings → Troubleshoot
   - Veja se há erros

2. **Reinstale o Docker Desktop**:
   - Desinstale completamente
   - Baixe a versão mais recente
   - Instale novamente

3. **Verifique requisitos do sistema**:
   - Windows 10/11 64-bit
   - WSL 2 habilitado (se necessário)
   - Virtualização habilitada no BIOS

