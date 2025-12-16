# 🔄 Como Reiniciar o Servidor

## Problema: Localhost não abre

### Solução Rápida

1. **Parar o servidor atual:**
   ```bash
   # No terminal onde o Next.js está rodando, pressione:
   Ctrl + C
   ```

2. **Limpar cache:**
   ```bash
   rm -rf .next
   ```

3. **Reiniciar:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

### Se o servidor não parar

1. **Encontrar processo:**
   ```bash
   lsof -ti:3000
   ```

2. **Matar processo:**
   ```bash
   kill -9 $(lsof -ti:3000)
   ```

3. **Limpar e reiniciar:**
   ```bash
   rm -rf .next
   npm run dev
   ```

### Verificar se está funcionando

Após reiniciar, acesse:
- `http://localhost:3000`
- Deve mostrar a página inicial

### Se ainda não funcionar

Verificar logs do terminal para erros de compilação.

