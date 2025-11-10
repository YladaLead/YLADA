# 🔧 Troubleshooting: Checkout Travando / Redirecionando para Login

## 🐛 Problema Reportado

- Página de checkout não está abrindo
- Está redirecionando para login
- Página inicial está travando
- Pode ser problema de cache

---

## ✅ SOLUÇÕES RÁPIDAS

### 1. Limpar Cache do Navegador

**Chrome/Edge:**
1. Pressione `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
2. Selecione "Imagens e arquivos em cache"
3. Período: "Última hora" ou "Todo o período"
4. Clique em "Limpar dados"

**Firefox:**
1. Pressione `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
2. Selecione "Cache"
3. Clique em "Limpar agora"

**Safari:**
1. Menu Safari → Preferências → Avançado
2. Marque "Mostrar menu Desenvolvedor"
3. Menu Desenvolvedor → Limpar Caches

### 2. Testar em Modo Anônimo

1. Abra uma janela anônima/privada
2. Acesse: `https://www.ylada.com/pt/wellness/checkout`
3. Verifique se funciona

### 3. Limpar Cookies do Site

1. Abra DevTools (F12)
2. Vá em **Application** (Chrome) ou **Storage** (Firefox)
3. Clique em **Cookies**
4. Selecione `ylada.com`
5. Delete todos os cookies
6. Recarregue a página (F5)

### 4. Verificar Console do Navegador

1. Abra DevTools (F12)
2. Vá em **Console**
3. Procure por erros em vermelho
4. Envie os erros para análise

---

## 🔍 DIAGNÓSTICO

### Verificar se é Cache

**Sintomas:**
- Página funciona em modo anônimo
- Página funciona em outro navegador
- Console mostra erros de cache

**Solução:** Limpar cache (veja acima)

### Verificar se é Autenticação

**Sintomas:**
- Console mostra: "Usuário não autenticado"
- Redireciona imediatamente para login
- Não mostra a página de checkout

**Solução:** 
- A página de checkout **NÃO requer login** para visualizar
- Login é exigido apenas ao clicar em "Continuar para Pagamento"
- Se está redirecionando, pode ser um problema no código

### Verificar se é JavaScript

**Sintomas:**
- Página carrega mas não funciona
- Botões não respondem
- Console mostra erros JavaScript

**Solução:**
- Verificar erros no console
- Verificar se JavaScript está habilitado
- Verificar se há bloqueadores de script

---

## 🛠️ VERIFICAÇÕES TÉCNICAS

### 1. Verificar URL

A URL correta é:
```
https://www.ylada.com/pt/wellness/checkout
```

**NÃO deve redirecionar automaticamente para login.**

### 2. Verificar Código

A página de checkout (`src/app/pt/wellness/checkout/page.tsx`):
- ✅ **NÃO usa** `ProtectedRoute`
- ✅ Permite visualização sem login
- ✅ Login é exigido apenas ao clicar no botão

### 3. Verificar useAuth

O `useAuth` pode estar causando redirecionamento se:
- Está verificando autenticação muito cedo
- Está redirecionando antes de carregar
- Há um loop de redirecionamento

---

## 🚨 PROBLEMAS CONHECIDOS

### Problema 1: Loop de Redirecionamento

**Sintoma:** Página fica redirecionando entre checkout e login

**Causa:** `useAuth` ou `ProtectedRoute` redirecionando incorretamente

**Solução:** Verificar se checkout não está usando `ProtectedRoute`

### Problema 2: Cache Antigo

**Sintoma:** Página mostra versão antiga do código

**Causa:** Cache do navegador ou CDN

**Solução:** Limpar cache e fazer hard refresh (Ctrl+F5)

### Problema 3: JavaScript Desabilitado

**Sintoma:** Página não carrega ou não funciona

**Causa:** JavaScript desabilitado ou bloqueado

**Solução:** Habilitar JavaScript no navegador

---

## 📞 PRÓXIMOS PASSOS

Se nenhuma solução funcionar:

1. **Enviar informações:**
   - Screenshot do erro
   - Erros do console (F12)
   - URL exata que está acessando
   - Navegador e versão

2. **Testar em outro dispositivo:**
   - Outro computador
   - Celular
   - Outro navegador

3. **Verificar logs do servidor:**
   - Vercel logs
   - Supabase logs

---

## ✅ CHECKLIST DE VERIFICAÇÃO

- [ ] Limpei o cache do navegador
- [ ] Testei em modo anônimo
- [ ] Limpei os cookies
- [ ] Verifiquei o console (F12) por erros
- [ ] Testei em outro navegador
- [ ] Verifiquei se JavaScript está habilitado
- [ ] Verifiquei a URL correta
- [ ] Testei em outro dispositivo

---

**Se ainda não funcionar, envie os detalhes acima para análise!**

