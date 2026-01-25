# 🔗 Como Configurar Links do Zoom para Geração Automática

## 📋 Resumo

Para gerar sessões automaticamente, o sistema precisa dos links do Zoom das **9:00** e **15:00**. Você tem **2 opções**:

---

## ✅ Opção 1: Adicionar Sessões Manualmente (MAIS FÁCIL)

**Não precisa mexer no Supabase diretamente!** Use a interface administrativa:

### Passo a Passo:

1. **Acesse:** `/admin/whatsapp/workshop`

2. **Adicione uma sessão às 9:00:**
   - Título: `Aula Prática ao Vivo (Agenda Instável)`
   - Data e hora: Escolha qualquer dia às **09:00**
   - Link Zoom: Cole o link do Zoom das 9:00
   - Marque como **✅ Aberta**
   - Clique em **"+ Adicionar"**

3. **Adicione uma sessão às 15:00:**
   - Título: `Aula Prática ao Vivo (Agenda Instável)`
   - Data e hora: Escolha qualquer dia às **15:00**
   - Link Zoom: Cole o link do Zoom das 15:00
   - Marque como **✅ Aberta**
   - Clique em **"+ Adicionar"**

4. **Pronto!** Agora clique em **"🔄 Gerar Sessões Automáticas (4 semanas)"**

O sistema vai:
- ✅ Detectar automaticamente os links das 9:00 e 15:00 das sessões que você criou
- ✅ Gerar todas as sessões automaticamente para as próximas 4 semanas
- ✅ Usar os links corretos para cada horário

---

## ✅ Opção 2: Configurar Variáveis de Ambiente

Se preferir, pode configurar no arquivo `.env`:

```env
ZOOM_LINK_9H=https://us02web.zoom.us/j/SEU_LINK_9H_AQUI
ZOOM_LINK_15H=https://us02web.zoom.us/j/SEU_LINK_15H_AQUI
```

**Depois:**
- Reinicie o servidor (se estiver rodando localmente)
- Ou faça novo deploy (se estiver na Vercel)

---

## 🎯 Qual Opção Escolher?

**Recomendação:** Use a **Opção 1** (adicionar manualmente) porque:
- ✅ Mais fácil e rápido
- ✅ Não precisa reiniciar servidor
- ✅ Você vê imediatamente se funcionou
- ✅ Pode testar antes de gerar todas as sessões

---

## ❓ Por que não gerou?

Se você clicou em "Gerar Sessões" e não gerou nada, é porque:

1. **Não há links configurados** (nem no `.env` nem no banco)
2. **As sessões manuais não estão nas horas corretas** (precisa ser exatamente 9:00 e 15:00)

**Solução:** Adicione as 2 sessões manuais primeiro (9:00 e 15:00) e depois gere automaticamente.

---

## 📝 Estrutura da Tabela (Para Referência)

Se quiser verificar diretamente no Supabase, a tabela é:

**Tabela:** `whatsapp_workshop_sessions`

**Campos importantes:**
- `area`: `'nutri'` (fixo)
- `title`: `'Aula Prática ao Vivo (Agenda Instável)'`
- `starts_at`: Data/hora da sessão (em UTC)
- `zoom_link`: Link completo do Zoom
- `is_active`: `true` (para ser detectada)

**Mas não precisa inserir manualmente!** Use a interface administrativa que é mais fácil. 😊
