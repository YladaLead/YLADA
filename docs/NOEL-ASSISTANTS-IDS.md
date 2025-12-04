# 🤖 NOEL Assistants - IDs Configurados

## 📋 IDs dos Assistants OpenAI

### ✅ NOEL Mentor
- **ID:** `asst_pu4Tpeox9tIdP0s2i6UhX6Em`
- **Nome na OpenAI:** Wellness Mentor
- **Módulo:** Mentor (estratégias, vendas, motivação)
- **Status:** ✅ Configurado

### ⏳ NOEL Suporte
- **ID:** `asst_xxxxxxxxxxxxx` (aguardando)
- **Módulo:** Suporte (instruções técnicas)
- **Status:** ⏳ Pendente

### ⏳ NOEL Técnico
- **ID:** `asst_xxxxxxxxxxxxx` (aguardando)
- **Módulo:** Técnico (bebidas, campanhas, scripts)
- **Status:** ⏳ Pendente

---

## 🔧 Variáveis de Ambiente

Quando todos os 3 IDs estiverem disponíveis, adicionar em `.env.local`:

```env
# NOEL Wellness Assistants
OPENAI_ASSISTANT_NOEL_MENTOR_ID=asst_pu4Tpeox9tIdP0s2i6UhX6Em
OPENAI_ASSISTANT_NOEL_SUPORTE_ID=asst_xxxxxxxxxxxxx
OPENAI_ASSISTANT_NOEL_TECNICO_ID=asst_xxxxxxxxxxxxx
```

---

## 📝 Observações

- **Wellness Mentor** já está configurado na plataforma OpenAI
- Aguardando IDs dos outros 2 assistants (Suporte e Técnico)
- Após receber todos os IDs, atualizar código para usar Assistants

---

**Última atualização:** Recebido ID do Mentor

