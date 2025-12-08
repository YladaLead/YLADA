# 🔧 CONFIGURAR CHECKOUT PRO (PREFERENCE API) - PARCELADO VENDEDOR 12x

## 🎯 IMPORTANTE: DIFERENÇA ENTRE "LINK DE PAGAMENTO" E "CHECKOUT PRO"

**Situação:**
- ✅ Você já configurou "Link de pagamento" com parcelado vendedor 12x
- ✅ Você já configurou "Checkout" com parcelado vendedor 12x
- ❌ Mas o código usa **Preference API (Checkout Pro)**, que pode ter configuração separada!

---

## 🔍 VERIFICAÇÃO NECESSÁRIA

### O código usa Preference API (Checkout Pro)

**Arquivo:** `src/lib/mercado-pago.ts`
- Usa `Preference` class do Mercado Pago SDK
- Cria preferências via API
- Redireciona para `init_point` (Checkout Pro)

**Isso significa:**
- O checkout é do tipo **"Checkout Pro"** (não "Link de pagamento")
- Pode haver configuração separada para Checkout Pro no painel

---

## 📋 PASSO A PASSO: VERIFICAR CONFIGURAÇÃO CHECKOUT PRO

### PASSO 1: Acessar Configurações

1. Acesse: https://www.mercadopago.com.br/
2. Login → **"Seu Negócio"** → **"Custos"** ou **"Taxas e parcelas"**

### PASSO 2: Verificar TODAS as Seções de Parcelamento

Procure por **TODAS** estas seções (podem estar em lugares diferentes):

#### A) "Link de pagamento" → "Parcelamento"
- ✅ Você já configurou aqui
- Verifique se 12x está habilitado

#### B) "Checkout Pro" → "Parcelamento"
- ⚠️ **VERIFIQUE AQUI TAMBÉM!**
- Pode estar em: **"Cobrar"** → **"Checkout Pro"** → **"Parcelamento"**
- Ou: **"Checkout"** → **"Checkout Pro"** → **"Parcelamento"**
- Ou: **"Integrações"** → **"Checkout Pro"** → **"Parcelamento"**

#### C) "Preference API" → "Parcelamento"
- ⚠️ **VERIFIQUE AQUI TAMBÉM!**
- Pode estar em: **"Integrações"** → **"APIs"** → **"Preference"** → **"Parcelamento"**
- Ou: **"Desenvolvedores"** → **"Checkout Pro"** → **"Parcelamento"**

#### D) "Configurações Gerais" → "Parcelamento"
- ⚠️ **VERIFIQUE AQUI TAMBÉM!**
- Pode estar em: **"Configurações"** → **"Parcelamento"**
- Ou: **"Configurações Gerais"** → **"Parcelamento"**

---

## 🔧 CONFIGURAR CHECKOUT PRO ESPECIFICAMENTE

### Se encontrar seção "Checkout Pro" ou "Preference API":

1. **Acesse a seção de "Parcelamento"**
2. **Na seção "Parcelado vendedor":**
   - Verifique se está **ATIVADO** (toggle azul)
   - Verifique se **12x** está na lista
   - Se não estiver, adicione/habilite **12x**

3. **Salve as alterações**

---

## 🧪 COMO IDENTIFICAR ONDE ESTÁ A CONFIGURAÇÃO

### Método 1: Buscar no Painel

1. No painel do Mercado Pago, use a **barra de busca** (se houver)
2. Busque por: **"Checkout Pro"**, **"Preference"**, **"Parcelamento"**
3. Verifique todas as opções que aparecerem

### Método 2: Navegar Manualmente

1. Vá em **"Seu Negócio"** → **"Custos"**
2. Procure por todas as seções relacionadas a:
   - ✅ Checkout
   - ✅ Checkout Pro
   - ✅ Preference
   - ✅ APIs
   - ✅ Integrações
   - ✅ Parcelamento

### Método 3: Verificar Menu Lateral

1. No menu lateral esquerdo, procure por:
   - **"Cobrar"**
   - **"Checkout"**
   - **"Integrações"**
   - **"Desenvolvedores"**
   - **"APIs"**

2. Em cada um, procure por **"Parcelamento"**

---

## ⚠️ SE NÃO ENCONTRAR CONFIGURAÇÃO SEPARADA

### Possibilidade 1: Configuração é Compartilhada

- Se "Link de pagamento" e "Checkout Pro" compartilham a mesma configuração
- Então a configuração que você já fez deveria funcionar
- **Nesse caso, o problema pode ser outro** (ver abaixo)

### Possibilidade 2: Configuração via API

- Algumas configurações de parcelamento podem ser feitas **via API**
- Mas o Mercado Pago geralmente usa configurações do painel
- Verifique se há algum parâmetro na API que precise ser enviado

---

## 🔍 OUTRAS POSSÍVEIS CAUSAS

### 1. Valor Mínimo para Parcelamento

- O Mercado Pago pode ter valor mínimo para parcelamento
- R$ 574,80 pode estar abaixo do mínimo para 12x
- Verifique nas configurações se há valor mínimo

### 2. Tipo de Conta

- Contas novas podem ter limitações
- Verifique se sua conta permite 12x sem juros
- Pode ser necessário aumentar volume de vendas

### 3. Bandeira do Cartão

- Algumas bandeiras podem não permitir 12x sem juros
- Verifique se há restrições por bandeira

### 4. Modo Teste vs Produção

- Se estiver em modo teste, algumas opções podem não aparecer
- Verifique se está usando credenciais de produção

---

## 📊 VERIFICAÇÃO FINAL

### Checklist:

- [ ] Verificou "Link de pagamento" → "Parcelamento" → "Parcelado vendedor" 12x
- [ ] Verificou "Checkout Pro" → "Parcelamento" → "Parcelado vendedor" 12x
- [ ] Verificou "Preference API" → "Parcelamento" → "Parcelado vendedor" 12x
- [ ] Verificou "Configurações Gerais" → "Parcelamento" → "Parcelado vendedor" 12x
- [ ] Verificou valor mínimo para parcelamento
- [ ] Verificou limitações da conta
- [ ] Verificou se está em modo produção (não teste)

---

## 🎯 PRÓXIMOS PASSOS

1. **Verifique TODAS as seções de parcelamento no painel**
2. **Habilite 12x "Parcelado vendedor" em TODAS as seções encontradas**
3. **Aguarde alguns minutos** para as alterações entrarem em vigor
4. **Teste criando um novo checkout**
5. **Se ainda não funcionar**, contate o suporte do Mercado Pago informando:
   - Você usa Preference API (Checkout Pro)
   - Precisa de 12x sem juros (parcelado vendedor)
   - Já configurou "Link de pagamento" e "Checkout", mas não funciona

---

**Última atualização:** Janeiro 2025
