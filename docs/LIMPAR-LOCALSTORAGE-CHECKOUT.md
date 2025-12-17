# 🔧 Limpar localStorage com URL de Checkout

## ⚠️ Problema

Se você visitou `/pt/nutri/checkout` antes, essa URL pode estar salva no localStorage e causar redirecionamento incorreto após login.

## ✅ Solução

### **Opção 1: Limpar via Console do Navegador (Rápido)**

1. Abra o navegador
2. Pressione `F12` (ou `Cmd+Option+I` no Mac)
3. Vá na aba **Console**
4. Cole e execute:

```javascript
localStorage.removeItem('ylada_last_visited_page')
localStorage.removeItem('ylada_last_visited_timestamp')
console.log('✅ localStorage limpo!')
```

5. Feche e abra o navegador novamente
6. Tente fazer login novamente

### **Opção 2: Limpar Tudo (Se necessário)**

Se a Opção 1 não funcionar, limpe todo o localStorage:

```javascript
localStorage.clear()
console.log('✅ Todo localStorage limpo!')
```

**⚠️ Atenção:** Isso vai limpar TODOS os dados salvos no navegador (não apenas do YLADA).

---

## 🎯 **Correção Implementada**

O sistema agora:
- ✅ **Não salva** URLs com `/checkout` no localStorage
- ✅ **Não redireciona** para `/checkout` após login
- ✅ **Limpa automaticamente** URLs inválidas do localStorage

**Após esta correção, o problema não deve mais ocorrer!**

---

## 🧪 **Teste**

1. Limpe o localStorage (Opção 1 acima)
2. Faça login com `nutri1@ylada.com`
3. Deve redirecionar para `/pt/nutri/onboarding` (se sem diagnóstico) ou `/pt/nutri/home` (se com diagnóstico)
4. **NÃO deve** redirecionar para `/checkout`


