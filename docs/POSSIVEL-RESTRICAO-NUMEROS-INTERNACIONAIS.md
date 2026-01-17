# ⚠️ Possível Restrição: Números Internacionais na Z-API

## 🐛 PROBLEMA

Ainda há erros 400 ao enviar mensagens para número dos EUA (`17862535032`), mesmo após correção do formato.

---

## 🔍 POSSÍVEIS CAUSAS

### **1. Restrição da Instância Z-API**

A instância Z-API pode estar configurada para **aceitar apenas números brasileiros**.

**Verificar:**
1. Acesse: https://developer.z-api.com.br/
2. Vá em "Instâncias Web" → Sua instância
3. Verifique configurações de:
   - Países permitidos
   - Restrições geográficas
   - Limitações do plano

### **2. Plano Z-API**

Alguns planos da Z-API podem ter restrições para números internacionais.

**Verificar:**
- Qual plano você está usando?
- O plano permite envio para números internacionais?
- Há custo adicional para números dos EUA?

### **3. Formato Específico da Z-API**

A Z-API pode exigir formato específico para números dos EUA.

**Formato esperado:**
- ✅ `17862535032` (1 + código de área + número)
- ❌ `+17862535032` (com +)
- ❌ `0017862535032` (com 00)

---

## ✅ VERIFICAÇÕES

### **1. Verificar Logs Detalhados**

Após o próximo deploy, os logs mostrarão o erro específico da Z-API:

```
[Z-API] ❌ Erro detalhado: {
  status: 400,
  errorData: { ... }, // Mensagem específica da Z-API
  phone: '17862535032',
  instanceId: '...'
}
```

### **2. Testar Manualmente via cURL**

```bash
curl -X POST https://api.z-api.io/instances/3ED484E8415CF126D6009EBD599F8B90/token/6633B5CACF7FC081FCAC3611/send-text \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "17862535032",
    "message": "Teste número EUA"
  }'
```

**Se der erro 400:** Verificar mensagem de erro específica
**Se funcionar:** Problema está no código

### **3. Verificar Documentação Z-API**

Acesse: https://developer.z-api.io/
- Verificar se há restrições para números internacionais
- Verificar formato específico necessário
- Verificar se precisa de configuração adicional

---

## 🔧 SOLUÇÕES POSSÍVEIS

### **Solução 1: Configurar Instância para Aceitar Internacionais**

1. Acesse dashboard Z-API
2. Vá em configurações da instância
3. Habilite "Números internacionais" ou similar
4. Salve configurações

### **Solução 2: Usar Instância Diferente para Internacionais**

Se a instância atual não aceita internacionais:
1. Criar nova instância Z-API
2. Configurar para aceitar números internacionais
3. Usar instância específica para números dos EUA

### **Solução 3: Validar Antes de Enviar**

Adicionar validação para verificar se número é suportado:

```typescript
// Verificar se instância aceita número internacional
if (phone.startsWith('1') && !instance.allowsInternational) {
  return {
    success: false,
    error: 'Esta instância não aceita números dos EUA. Configure uma instância internacional.'
  }
}
```

---

## 📋 PRÓXIMOS PASSOS

1. ✅ **Aguardar deploy** (logs melhorados)
2. ✅ **Verificar logs da Vercel** (erro específico da Z-API)
3. ✅ **Testar manualmente** (curl)
4. ✅ **Verificar configurações** da instância Z-API
5. ✅ **Verificar plano** Z-API (restrições)

---

**Após o deploy, verifique os logs detalhados para ver o erro específico da Z-API!**
