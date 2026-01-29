# ✅ Correções: Horários, Formatação e Repetição da Carol

## 🔍 PROBLEMAS IDENTIFICADOS

1. **Horários incorretos**: Carol oferecia horários errados (ex: 13:00 e 18:00 ao invés de 10:00 e 15:00)
2. **Formatação ruim**: Mensagens com markdown que não funciona no WhatsApp
3. **Repetição de informações**: Carol repetia explicações já ditas na conversa
4. **Número ignorado no log**: Mensagens do número de notificação sendo ignoradas (comportamento correto)

---

## ✅ CORREÇÕES APLICADAS

### **1. Formatação de Horários Corrigida**

**Problema:** `toLocaleTimeString` não estava usando timezone correto, gerando horários errados.

**Solução:**
- Criada função `formatSessionDateTime()` que usa explicitamente timezone `America/Sao_Paulo`
- Formatação agora garante horário correto de Brasília
- Logs adicionados para debug de sessões encontradas

**Código:**
```typescript
function formatSessionDateTime(startsAt: string): { weekday: string; date: string; time: string } {
  const date = new Date(startsAt)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
  // ... formatação correta
}
```

---

### **2. Formatação de Mensagens Melhorada**

**Problema:** Mensagens com markdown (`[Link Zoom](url)`) que não funciona no WhatsApp.

**Solução:**
- Formatação direta e bonita das opções de aula
- Formato padronizado e limpo
- Garantia de que a Carol usa o formato exato fornecido

**Formato Antes:**
```
1. Segunda-feira, 26/01/2026 às 13:00 - [Link Zoom](https://...)
```

**Formato Depois:**
```
📅 *Opções de Aula Disponíveis:*

*Opção 1:*
Segunda-feira, 26/01/2026
🕒 10:00 (horário de Brasília)
🔗 https://us02web.zoom.us/j/...
```

---

### **3. Prevenção de Repetição**

**Problema:** Carol repetia informações já explicadas na conversa.

**Solução:**
- Prompt melhorado com instruções mais claras sobre não repetir
- Instrução explícita: "LEIA O HISTÓRICO PRIMEIRO"
- Instrução: "Se você JÁ explicou, NÃO explique novamente"
- Temperatura reduzida de 0.7 para 0.6 (respostas mais consistentes)
- Max tokens aumentado de 300 para 400 (permite formatação melhor)

**Prompt Atualizado:**
```
IMPORTANTE - NÃO REPETIR:
- SEMPRE leia o histórico completo antes de responder
- Se você JÁ explicou o que é a aula, NÃO explique novamente
- Se você JÁ enviou opções, NÃO envie novamente a menos que a pessoa peça
- Se a pessoa faz uma pergunta simples, responda APENAS a pergunta, sem repetir contexto
```

---

### **4. Busca de Sessões Melhorada**

**Problema:** Sessões passadas podiam ser incluídas.

**Solução:**
- Buffer de 5 minutos adicionado para evitar sessões que acabaram de passar
- Logs adicionados para debug
- Filtro mais rigoroso: `.gte('starts_at', minDate.toISOString())`

**Código:**
```typescript
const now = new Date()
const bufferMinutes = 5
const minDate = new Date(now.getTime() + bufferMinutes * 60 * 1000)

const { data: sessions } = await supabaseAdmin
  .from('whatsapp_workshop_sessions')
  .select('title, starts_at, zoom_link')
  .eq('area', area)
  .eq('is_active', true)
  .gte('starts_at', minDate.toISOString()) // Apenas futuras
  .order('starts_at', { ascending: true })
  .limit(2)
```

---

### **5. Garantia de Formato Correto**

**Problema:** OpenAI podia formatar opções de forma diferente.

**Solução:**
- Opções são formatadas diretamente no código
- Instrução explícita no prompt: "use EXATAMENTE o formato fornecido"
- Se a resposta menciona opções mas não inclui o formato, ele é adicionado automaticamente

---

## 📊 RESULTADOS ESPERADOS

Após as correções:

✅ **Horários corretos**: Carol oferece horários exatos de Brasília
✅ **Formatação bonita**: Mensagens limpas e bem formatadas
✅ **Sem repetição**: Carol não repete informações já ditas
✅ **Sessões futuras**: Apenas sessões futuras são oferecidas
✅ **Formato consistente**: Todas as opções seguem o mesmo formato

---

## 🧪 COMO TESTAR

1. **Teste de Horários:**
   - Enviar: "Quais horários?"
   - Verificar se horários correspondem aos da interface admin
   - Verificar se timezone está correto (Brasília)

2. **Teste de Formatação:**
   - Enviar: "Quero agendar"
   - Verificar se formato está bonito e limpo
   - Verificar se links estão corretos

3. **Teste de Repetição:**
   - Enviar: "Quero saber sobre a aula"
   - Aguardar resposta
   - Enviar: "Quero agendar"
   - Verificar se NÃO repete explicação da aula

4. **Teste de Sessões Futuras:**
   - Verificar logs: `[Carol AI] 📅 Sessões encontradas`
   - Confirmar que apenas sessões futuras aparecem

---

## 📝 LOGS PARA DEBUG

Agora os logs mostram:
```
[Carol AI] 🔍 Buscando sessões futuras: {
  now: "2026-01-25T11:54:00.000Z",
  minDate: "2026-01-25T11:59:00.000Z",
  area: "nutri"
}

[Carol AI] 📅 Sessões encontradas: {
  count: 2,
  sessions: [
    {
      title: "Aula prática exclusiva para nutricionistas",
      starts_at: "2026-01-26T13:00:00.000Z",
      zoom_link: "https://..."
    }
  ]
}
```

---

## ⚠️ OBSERVAÇÕES

1. **Número ignorado no log**: Mensagens do número `5519981868000` (notificação) são **intencionalmente ignoradas** para evitar loops. Isso é comportamento correto.

2. **Sessões passadas**: Se aparecerem na interface admin mas não forem oferecidas pela Carol, é porque o filtro está funcionando corretamente.

3. **Timezone**: Todas as datas/horas agora usam explicitamente `America/Sao_Paulo`.

---

**Última atualização:** 2026-01-25
**Versão:** 2.0
