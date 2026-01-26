# 🔧 Correção: Link de Cadastro Nutri

## ❌ Problema Identificado

Quando a Patrícia (ou qualquer pessoa) participava da aula e recebia a mensagem da Carol, o link enviado era:

```
https://ylada.com/pt/nutri/cadastro
```

**Problema:** Essa rota não existia, então o Next.js redirecionava automaticamente para a página principal `/pt/nutri` (página de vendas), em vez de levar para o checkout onde a pessoa escolhe o plano e faz o pagamento.

---

## ✅ Solução Implementada

### **1. Corrigido o Link na Mensagem da Carol**

**Arquivo:** `src/lib/whatsapp-carol-ai.ts` (linha 3096)

**Antes:**
```typescript
const registrationUrl = process.env.NUTRI_REGISTRATION_URL || 'https://ylada.com/pt/nutri/cadastro'
```

**Depois:**
```typescript
const registrationUrl = process.env.NUTRI_REGISTRATION_URL || 'https://ylada.com/pt/nutri/checkout'
```

Agora o link aponta diretamente para `/pt/nutri/checkout`, onde a pessoa:
- Escolhe o plano (mensal ou anual)
- Informa o e-mail
- Faz o pagamento
- É redirecionada para completar o cadastro

---

### **2. Criada Rota de Redirecionamento (Compatibilidade)**

**Arquivo:** `src/app/pt/nutri/cadastro/page.tsx` (NOVO)

Criei uma rota intermediária que redireciona automaticamente para o checkout. Isso garante que:
- ✅ Links antigos que apontam para `/pt/nutri/cadastro` ainda funcionam
- ✅ Redireciona automaticamente para o checkout
- ✅ Mantém parâmetros da URL (ex: `?plan=annual`)

---

## 🔄 Fluxo Correto Agora

1. **Pessoa participa da aula** → Admin marca "✅ Participou"
2. **Carol envia mensagem** com link: `https://ylada.com/pt/nutri/checkout`
3. **Pessoa clica no link** → Vai direto para página de checkout
4. **Pessoa escolhe plano** → Mensal ou Anual
5. **Pessoa informa e-mail** → E faz o pagamento
6. **Após pagamento** → É redirecionada para completar cadastro

---

## 📋 Verificações

- ✅ Link na mensagem da Carol corrigido
- ✅ Rota `/pt/nutri/cadastro` criada (redireciona para checkout)
- ✅ Compatibilidade com links antigos mantida
- ✅ Fluxo de checkout preservado

---

## 🧪 Como Testar

1. Marque alguém como "✅ Participou" na interface admin
2. Verifique a mensagem enviada pela Carol
3. Confirme que o link é: `https://ylada.com/pt/nutri/checkout`
4. Clique no link e verifique se vai para a página de checkout
5. Teste também o link antigo: `https://ylada.com/pt/nutri/cadastro` (deve redirecionar)

---

**Data da correção:** Janeiro 2026  
**Status:** ✅ Corrigido
