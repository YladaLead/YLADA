# 🚨 SEGURANÇA: REVOGAR TOKEN MERCADO PAGO EXPOSTO

## ⚠️ ALERTA CRÍTICO

Um Access Token do Mercado Pago foi exposto no repositório GitHub. **AÇÃO IMEDIATA NECESSÁRIA!**

---

## ✅ AÇÕES URGENTES (FAZER AGORA)

### **1. Revogar o Access Token exposto** 🔴 PRIORIDADE MÁXIMA

O token `APP_USR-6484673849752001-110918-6331ae5a16982fa7a6c9873607376f24-2974173459` foi exposto e precisa ser revogado.

#### Como revogar:

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em **"Suas integrações"** → **"Credenciais"**
3. Clique em **"Credenciais de produção"**
4. Localize o Access Token exposto
5. Clique em **"Regenerar"** ou **"Revogar"**
6. **Anote o novo Access Token** gerado

### **2. Atualizar variáveis de ambiente**

Após revogar e gerar um novo token:

#### **No .env.local (local):**
```env
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-NOVO_TOKEN_AQUI
```

#### **Na Vercel (produção):**
1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Encontre `MERCADOPAGO_ACCESS_TOKEN_LIVE`
3. Atualize com o novo token
4. Faça **redeploy** do projeto

### **3. Verificar histórico do Git**

O token exposto ainda está no histórico do Git. Mesmo removendo do código atual, ele ainda pode ser acessado em commits antigos.

#### Opções:

1. **Aceitar o risco** (se o token já foi revogado)
2. **Usar git-filter-repo** para remover do histórico (complexo)
3. **Criar novo repositório** (se necessário)

---

## 🔒 PREVENÇÃO FUTURA

### **1. Verificar .gitignore**

O arquivo `.gitignore` já está configurado corretamente:
```
.env*.local
.env
```

### **2. NUNCA commitar:**

- ❌ Arquivos `.env` ou `.env.local`
- ❌ Credenciais reais em arquivos de exemplo
- ❌ Tokens em documentação
- ❌ Chaves de API em código

### **3. Usar apenas placeholders:**

✅ **Correto:**
```env
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-xxxxxxxxxxxxx
```

❌ **ERRADO:**
```env
MERCADOPAGO_ACCESS_TOKEN_LIVE=APP_USR-6484673849752001-110918-6331ae5a16982fa7a6c9873607376f24-2974173459
```

---

## 📋 CHECKLIST PÓS-REVOGAÇÃO

- [ ] Token antigo revogado no Mercado Pago
- [ ] Novo token gerado
- [ ] `.env.local` atualizado com novo token
- [ ] Vercel atualizado com novo token
- [ ] Redeploy feito na Vercel
- [ ] Testado checkout com novo token
- [ ] Verificado que não há mais tokens expostos no código

---

## 🔍 VERIFICAR SE HÁ MAIS TOKENS EXPOSTOS

Execute no terminal:
```bash
# Procurar por tokens do Mercado Pago
grep -r "APP_USR-" --exclude-dir=node_modules --exclude="*.log" .

# Procurar por tokens de teste
grep -r "TEST-" --exclude-dir=node_modules --exclude="*.log" .
```

Se encontrar tokens reais (não placeholders), remova-os imediatamente!

---

## 📞 SUPORTE

Se precisar de ajuda:
1. Documentação Mercado Pago: https://www.mercadopago.com.br/developers/pt/docs
2. Suporte Mercado Pago: Através do painel de desenvolvedores

---

**Última atualização:** Janeiro 2025
**Status:** 🔴 URGENTE - Token exposto precisa ser revogado

