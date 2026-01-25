# 👋 Como Funciona o Disparo de Boas-vindas

## 🎯 RESUMO

O disparo de boas-vindas pode funcionar de **DUAS FORMAS**:

1. **AUTOMÁTICO** (via Cron Job) - Executa sozinho todos os dias
2. **MANUAL** (via Interface Admin) - Você dispara quando quiser

---

## ✅ FORMA 1: AUTOMÁTICO (Recomendado)

### **Como Funciona:**
- O sistema executa **automaticamente todos os dias às 09:00**
- Busca pessoas que preencheram o formulário nos últimos 7 dias
- Verifica se elas **NÃO** têm conversa ativa no WhatsApp
- Envia mensagem de boas-vindas automaticamente

### **Onde está configurado:**
- Arquivo: `vercel.json`
- Cron: `0 9 * * *` (todos os dias às 09:00)

### **Você precisa fazer algo?**
- ❌ **NÃO!** Funciona sozinho
- ✅ Apenas certifique-se de que o cron está ativo no Vercel

---

## ✅ FORMA 2: MANUAL (Quando quiser)

### **Como Funciona:**
- Você acessa a interface administrativa
- Clica no botão "Disparar Boas-vindas"
- O sistema processa na hora

### **Onde fazer:**
1. Acesse: `/admin/whatsapp/carol`
2. Clique em: **"Disparar Boas-vindas"**
3. Aguarde o processamento
4. Veja quantas foram enviadas

### **Quando usar:**
- Quando quiser disparar fora do horário automático
- Quando quiser testar
- Quando quiser forçar um novo disparo

---

## 📋 O QUE O SISTEMA FAZ

### **Busca:**
- Leads dos últimos 7 dias que preencheram formulário
- Que têm telefone válido
- Que **NÃO** têm conversa ativa no WhatsApp
- Ou que têm conversa mas **NUNCA** enviaram mensagem

### **Envia:**
- Mensagem de boas-vindas personalizada
- Opções de aula disponíveis (sem links)
- Instruções para escolher uma opção

### **Adiciona Tags:**
- `veio_aula_pratica`
- `recebeu_link_workshop`
- `primeiro_contato`

---

## 🔍 COMO VERIFICAR SE ESTÁ FUNCIONANDO

### **1. Verificar Logs do Cron (Automático)**
- Acesse: Vercel → Seu projeto → Logs
- Filtre por: `[Cron Carol]` ou `welcome`
- Deve aparecer: "Enviadas: X | Erros: Y"

### **2. Verificar Interface Admin (Manual)**
- Após clicar em "Disparar Boas-vindas"
- Aparece: "✅ Enviadas: X | ❌ Erros: Y"

### **3. Verificar Conversas**
- Acesse: `/admin/whatsapp`
- Procure por conversas novas com tag `veio_aula_pratica`
- Verifique se receberam a mensagem de boas-vindas

---

## ⚙️ CONFIGURAÇÃO

### **Para o Automático funcionar:**

1. **Verificar `vercel.json`:**
```json
{
  "crons": [
    {
      "path": "/api/cron/whatsapp-carol?tipo=welcome",
      "schedule": "0 9 * * *"
    }
  ]
}
```

2. **Verificar variável de ambiente:**
```
CRON_SECRET=sua-chave-secreta
```

3. **Deploy no Vercel:**
- O cron será ativado automaticamente após o deploy

---

## ❓ PERGUNTAS FREQUENTES

### **P: Preciso fazer algo para o automático funcionar?**
R: Não! Depois do deploy, funciona sozinho.

### **P: Posso desativar o automático?**
R: Sim, remova o cron do `vercel.json` e faça apenas manual.

### **P: O automático substitui o manual?**
R: Não! Você pode usar os dois. O manual é útil para testar ou disparar fora do horário.

### **P: Quantas vezes por dia o automático executa?**
R: Uma vez por dia, às 09:00.

### **P: E se eu quiser disparar mais vezes?**
R: Use o botão manual ou ajuste o cron no `vercel.json`.

---

**Última atualização:** 2026-01-25
**Versão:** 1.0
