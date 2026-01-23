# 🤖 Carol - Sistema Completo de IA para WhatsApp

## ✅ O QUE FOI CRIADO

### **1. IA "Carol" - Resposta Automática**
- ✅ Responde automaticamente quando pessoa envia mensagem
- ✅ Usa OpenAI (GPT-4o-mini)
- ✅ Contexto completo (tags, histórico, sessões)
- ✅ Respostas personalizadas e acolhedoras

### **2. Disparo de Boas-vindas**
- ✅ Para quem preencheu mas não chamou
- ✅ Envia opções de aula automaticamente
- ✅ Adiciona tags automaticamente

### **3. Disparo de Remarketing**
- ✅ Para quem agendou mas não participou
- ✅ Oferece novas opções de aula
- ✅ Mensagem empática e acolhedora

### **4. Filtros de Agendadas**
- ✅ Filtrar por data
- ✅ Filtrar por hora
- ✅ Filtrar por sessão específica
- ✅ Visualização agrupada

---

## 🚀 COMO USAR

### **Acessos Rápidos:**
- **Atendimento:** `/admin/whatsapp` (Carol responde automaticamente)
- **Controle Carol:** `/admin/whatsapp/carol` (Disparos manuais)
- **Agendadas:** `/admin/whatsapp/agendadas` (Filtros por data/hora)
- **Relatórios:** `/admin/whatsapp/relatorios` (Índices e diagnósticos)

---

## 📋 FLUXOS

### **Fluxo 1: Pessoa Preenche e Chama**
```
Formulário → Mensagem automática → Pessoa responde → Carol responde
```

### **Fluxo 2: Pessoa Preenche mas NÃO Chama**
```
Formulário → Mensagem automática → Não responde → Disparo boas-vindas
```

### **Fluxo 3: Pessoa Agenda mas NÃO Participa**
```
Recebe link → Agenda → Não participa → Disparo remarketing
```

---

## ⚙️ CONFIGURAÇÃO

### **1. OpenAI (Obrigatório)**
```
OPENAI_API_KEY=sk-...
```

### **2. Cron Jobs (Opcional)**
```
CRON_SECRET=sua-chave
```

---

## ✅ PRONTO!

Sistema completo integrado e funcionando! 🚀
