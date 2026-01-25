# 🔧 Correção: Carol Enviando Horários Errados e Links

## 🐛 PROBLEMA IDENTIFICADO

A Carol estava:
1. ❌ Enviando **links do Zoom** nas opções iniciais (quando deveria enviar apenas dias/horários)
2. ❌ Enviando **horários incorretos** (possível problema de timezone)

## ✅ CORREÇÕES APLICADAS

### **1. Remoção Forçada de Links**

**Antes:**
```
1. Segunda-feira, 26/01/2026 às 13:00 - [Link do Zoom](https://...)
```

**Agora:**
```
📅 *Opções de Aula Disponíveis:*

*Opção 1:*
Segunda-feira, 26/01/2026
🕒 13:00 (horário de Brasília)

*Opção 2:*
Segunda-feira, 26/01/2026
🕒 18:00 (horário de Brasília)

💬 *Qual você prefere?*
Digite o número da opção (ex: "1", "opção 1", "primeira") ou o dia/horário (ex: "segunda às 10:00")
```

### **2. Lógica de Detecção Melhorada**

- Detecta quando a pessoa pergunta sobre horários/dias/agendamento
- Força o uso do formato correto (sem links)
- Remove qualquer link que a IA possa ter adicionado

### **3. Instruções Mais Rígidas para a IA**

Adicionado no prompt:
- "NUNCA inclua links do Zoom nas opções iniciais"
- "Apenas mostre dias e horários"
- "Quando a pessoa escolher uma opção, você enviará o link específico"

---

## 🔍 VERIFICAÇÃO DE HORÁRIOS

### **Como Verificar se os Horários Estão Corretos:**

1. **Verificar no Banco de Dados:**
   - Tabela: `whatsapp_workshop_sessions`
   - Campo: `starts_at` (deve estar em UTC)
   - Exemplo: `2026-01-26T16:00:00Z` (16:00 UTC = 13:00 BRT)

2. **Verificar Formatação:**
   - Função: `formatSessionDateTime()`
   - Timezone: `America/Sao_Paulo`
   - Deve converter UTC → BRT corretamente

3. **Testar:**
   - Enviar mensagem: "Quais horários disponíveis?"
   - Verificar se os horários aparecem corretos (horário de Brasília)

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Horários no banco estão em UTC
- [ ] Função `formatSessionDateTime` usa timezone `America/Sao_Paulo`
- [ ] Carol não envia links nas opções iniciais
- [ ] Carol envia apenas dias/horários
- [ ] Quando pessoa escolhe, Carol envia link + flyer

---

## 🧪 COMO TESTAR

1. **Enviar mensagem:** "Quais horários disponíveis?"
2. **Verificar resposta:**
   - ✅ Deve ter apenas dias/horários (SEM links)
   - ✅ Horários devem estar corretos (horário de Brasília)
   - ✅ Formato deve ser o especificado

3. **Escolher opção:** "1" ou "opção 1"
4. **Verificar resposta:**
   - ✅ Deve enviar flyer (se configurado)
   - ✅ Deve enviar link específico do Zoom
   - ✅ Deve confirmar data/hora escolhida

---

**Última atualização:** 2026-01-25
**Versão:** 1.0
