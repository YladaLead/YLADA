# 📊 Relatórios WhatsApp - Guia Completo

## 🎯 O QUE É

Área administrativa para **puxar relatórios e índices** baseados nas **tags** das conversas do WhatsApp.

**Acesso:** `/admin/whatsapp/relatorios`

---

## ✅ O QUE VOCÊ PODE FAZER

### **1. Ver Estatísticas Gerais**
- Total de conversas
- Total de mensagens
- Taxa de conversão
- Taxa de participação

### **2. Analisar Funil de Conversão**
Visualização completa do funil:
- **Captação** (Aula Prática)
- **Convite** (Link Workshop)
- **Participação**
- **Interessado**
- **Negociando**
- **Cliente**

### **3. Ver Distribuição por Tags**
- Top 10 tags mais usadas
- Quantidade de pessoas em cada tag
- Análise por fase do funil

### **4. Mensagens por Dia**
- Gráfico de mensagens recebidas vs enviadas
- Análise diária de volume

### **5. Conversas Sem Resposta**
- Lista de conversas sem resposta nas últimas 24h
- Link direto para cada conversa

### **6. Exportar Relatórios**
- Botão "Exportar CSV"
- Dados formatados para análise externa

---

## 🏷️ COMO O FUNIL USA AS TAGS (para a Carol e relatórios)

Os relatórios e a Carol usam **as mesmas tags** nas conversas. Para o funil bater certo:

| Fase no relatório | Tag no sistema | Quando adicionar |
|-------------------|----------------|------------------|
| **Captação** | `veio_aula_pratica` | Inscrição na aula prática / cadastro workshop |
| **Convite** | `recebeu_link_workshop` | Envio do link do workshop |
| **Participação** | `participou_aula` ou `nao_participou_aula` | Após a data da aula |
| **Interessado** | `interessado` | Quando a pessoa demonstrar interesse |
| **Negociando** | `negociando` | Quando estiver negociando |
| **Cliente** | `cliente_nutri` | **Pagamento confirmado** (webhook ou manual) |

**Importante:** Quem **já pagou** precisa ter a tag **`cliente_nutri`** na conversa para:
- Aparecer como **Cliente** no funil dos relatórios.
- A Carol tratar como cliente (não enviar cobrança/remarketing).

Se a inscrição foi acrescentada manualmente ou o webhook não encontrou a conversa na hora do pagamento, adicione a tag `cliente_nutri` manualmente na conversa (Admin WhatsApp → conversa → tags) ou use o script `scripts/corrigir-tag-cliente-nutri-cintia-paula.sql` para nomes específicos.

---

## 🔍 FILTROS DISPONÍVEIS

### **Período:**
- Últimos 7 dias
- Últimos 30 dias
- Últimos 90 dias
- Último ano
- Todo período

### **Área:**
- Todas
- Nutri
- Wellness
- Coach

---

## 📈 ÍNDICES E DIAGNÓSTICOS

### **Taxa de Conversão**
```
Taxa = (Clientes / Captação) × 100
```
**O que indica:** Quantos % dos que vieram viraram clientes

### **Taxa de Participação**
```
Taxa = (Participaram / Receberam Link) × 100
```
**O que indica:** Quantos % dos que receberam link participaram

### **Taxa de Resposta**
```
Taxa = (Mensagens Enviadas / Mensagens Recebidas) × 100
```
**O que indica:** Eficiência do atendimento

---

## 🎯 COMO USAR PARA DIAGNÓSTICOS

### **1. Identificar Gargalos no Funil**
- Se muitos em "Captação" mas poucos em "Convite" → Problema no envio de links
- Se muitos em "Participação" mas poucos em "Interessado" → Problema na apresentação
- Se muitos em "Interessado" mas poucos em "Cliente" → Problema no fechamento

### **2. Analisar Tags**
- Ver quais tags têm mais pessoas
- Identificar onde as pessoas estão "travadas"
- Focar esforços nas tags com mais volume

### **3. Monitorar Conversas Sem Resposta**
- Identificar leads que precisam de atenção urgente
- Clicar em "Ver Conversa" para responder

### **4. Comparar Períodos**
- Mudar período para ver evolução
- Comparar mês atual vs mês anterior

---

## 📥 EXPORTAR DADOS

### **Como Exportar:**
1. Configure filtros (período e área)
2. Clique em "📥 Exportar CSV"
3. Arquivo será baixado automaticamente

### **O que vem no CSV:**
- Período analisado
- Área filtrada
- Total de conversas
- Total de mensagens
- Taxa de conversão
- Taxa de participação

---

## 🚀 ACESSO RÁPIDO

**No dashboard admin (`/admin`):**
- Botão "📊 Relatórios WhatsApp" nos atalhos rápidos

**Ou acesse diretamente:**
- `/admin/whatsapp/relatorios`

---

## 💡 DICAS

1. **Use filtros:** Filtre por período e área para análises específicas
2. **Monitore diariamente:** Verifique "Conversas Sem Resposta" todos os dias
3. **Compare períodos:** Use diferentes períodos para ver evolução
4. **Exporte regularmente:** Exporte CSV para manter histórico
5. **Foque no funil:** O funil mostra onde melhorar o processo

---

## ❓ PERGUNTAS FREQUENTES

**P: As tags precisam estar adicionadas para aparecer nos relatórios?**
R: Sim. As tags precisam estar nas conversas para aparecer nas estatísticas.

**P: Posso exportar dados de todas as áreas juntas?**
R: Sim. Selecione "Todas" no filtro de área.

**P: Os relatórios são em tempo real?**
R: Sim. Os dados são buscados do banco em tempo real quando você acessa a página.

**P: Posso ver histórico de meses anteriores?**
R: Sim. Use o filtro de período "Último ano" ou "Todo período".

---

## ✅ PRONTO PARA USAR!

Agora você pode:
- ✅ Ver todos os índices baseados em tags
- ✅ Diagnosticar gargalos no funil
- ✅ Exportar relatórios
- ✅ Monitorar conversas sem resposta
- ✅ Analisar evolução ao longo do tempo

**Adicione as tags nas conversas e comece a usar os relatórios!** 🚀
