# ⏰ Configuração de Horários Fixos do Workshop

## 📋 HORÁRIOS CONFIGURADOS

### **Horários Fixos:**

1. **Segunda-feira às 10:00**
   - Link: Usa o link das 9:00
   - Mesmo link das sessões das 9:00

2. **Terça a Sexta às 9:00**
   - Link: Link das 9:00 (fixo)
   - Mesmo link para todos os dias

3. **Segunda a Sexta às 15:00**
   - Link: Link das 15:00 (fixo)
   - Mesmo link para todos os dias

4. **Quarta-feira às 20:00**
   - Link: `https://us02web.zoom.us/j/88212513126?pwd=8KROrQtFJacJKRaaCwSsAM2avjeWfs.1`
   - Link específico para esse horário

---

## 🔧 COMO FUNCIONA

### **Geração Automática de Sessões:**

1. **Acesse:** `/admin/whatsapp/workshop`
2. **Clique em:** "🔄 Gerar Sessões Automáticas (4 semanas)"
3. **Sistema cria:** Todas as sessões para as próximas 4 semanas automaticamente
4. **Links:** Usa os links configurados ou busca do banco

---

## ⚙️ CONFIGURAÇÃO DOS LINKS

### **Opção 1: Variáveis de Ambiente (Recomendado)**

Adicione no `.env.local` e no Vercel:

```env
ZOOM_LINK_9H=https://us02web.zoom.us/j/... (link das 9:00)
ZOOM_LINK_15H=https://us02web.zoom.us/j/... (link das 15:00)
```

### **Opção 2: Buscar do Banco**

Se não configurar variáveis de ambiente:
- Sistema busca automaticamente do banco
- Procura por sessões ativas com horário 9:00 e 15:00
- Usa os links encontrados

**Importante:** Adicione pelo menos uma sessão manualmente com cada link primeiro!

---

## 📅 RESUMO DOS HORÁRIOS

| Dia | Horário | Link |
|-----|---------|------|
| Segunda | 10:00 | Link das 9:00 |
| Terça | 9:00 | Link das 9:00 |
| Quarta | 9:00 | Link das 9:00 |
| Quarta | 20:00 | Link específico (já configurado) |
| Quinta | 9:00 | Link das 9:00 |
| Sexta | 9:00 | Link das 9:00 |
| Segunda a Sexta | 15:00 | Link das 15:00 |

---

## 🎯 COMO USAR

### **1. Primeira Vez (Configurar Links):**

1. Adicione manualmente uma sessão às **9:00** com o link correto
2. Adicione manualmente uma sessão às **15:00** com o link correto
3. Ou configure as variáveis de ambiente `ZOOM_LINK_9H` e `ZOOM_LINK_15H`

### **2. Gerar Sessões:**

1. Acesse `/admin/whatsapp/workshop`
2. Clique em "🔄 Gerar Sessões Automáticas (4 semanas)"
3. Sistema cria todas as sessões automaticamente
4. Verifique se foram criadas corretamente

### **3. Manutenção:**

- Execute novamente quando quiser gerar mais semanas
- Sistema não cria duplicatas (verifica se já existe)
- Pode executar quantas vezes quiser

---

## ✅ CHECKLIST

- [ ] Link das 9:00 configurado (variável ou banco)
- [ ] Link das 15:00 configurado (variável ou banco)
- [ ] Link das 20:00 já está no código (quarta-feira)
- [ ] Botão "Gerar Sessões" funcionando
- [ ] Sessões sendo criadas corretamente

---

**Última atualização:** 2026-01-25
**Versão:** 1.0
