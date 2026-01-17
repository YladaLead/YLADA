# 📝 Formulário de Captura para Nutricionistas - Área NUTRI

## ✅ RESPOSTA: SIM, É VIÁVEL E RECOMENDADO!

Adicionar um formulário na área NUTRI para capturar dados das nutricionistas interessadas é **muito viável** e faz todo sentido estratégico.

---

## 🎯 POR QUE FAZ SENTIDO?

### **Benefícios:**

1. **Captura de Leads Qualificados**
   - Nutricionistas que demonstram interesse real (preenchem formulário)
   - Dados para follow-up personalizado
   - Segmentação de audiências no Facebook

2. **Redução de Fricção**
   - Algumas pessoas preferem preencher formulário do que clicar direto no WhatsApp
   - Dá tempo para a pessoa pensar antes de entrar em contato
   - Cria comprometimento (quem preenche está mais interessada)

3. **Rastreamento Melhorado**
   - Evento `Lead` no Pixel (formulário preenchido)
   - Evento `Contact` no Pixel (clique WhatsApp)
   - Permite criar audiências: "Preencheu formulário mas não clicou WhatsApp"

4. **Automação de Follow-up**
   - Email automático de boas-vindas
   - Sequência de emails educativos
   - Notificação para equipe de vendas

---

## 📍 ONDE COLOCAR O FORMULÁRIO?

### **Opção 1: Modal Pop-up (Recomendado)**
- Aparece após X segundos na página OU ao rolar 50% da página
- Não interrompe a leitura inicial
- Alta taxa de conversão

### **Opção 2: Seção Dedicada na Página**
- Seção específica tipo "Quer saber mais? Deixe seus dados"
- Aparece antes do CTA final (botões de checkout)
- Mais discreto, menos intrusivo

### **Opção 3: Banner Fixo (Sticky)**
- Banner no topo ou rodapé da página
- Sempre visível
- Pode ser fechado pelo usuário

### **Opção 4: Widget Flutuante**
- Botão flutuante "Quero saber mais"
- Abre modal com formulário
- Similar ao botão "Fale Conosco" que já existe

---

## 📋 CAMPOS DO FORMULÁRIO

### **Campos Essenciais:**
- ✅ Nome completo
- ✅ Email
- ✅ WhatsApp (com DDD)
- ✅ CRN (opcional, mas valioso para validação)

### **Campos Opcionais (para segmentação):**
- Área de atuação (Clínica, Esportiva, Funcional, etc.)
- Tempo de formada
- Objetivo principal (Organizar negócio, Captar mais clientes, etc.)

### **Exemplo de Formulário:**

```
┌─────────────────────────────────────┐
│  Quer se tornar uma Nutri-Empresária? │
│                                       │
│  Deixe seus dados e vamos conversar! │
│                                       │
│  Nome completo *                     │
│  [___________________________]       │
│                                       │
│  Email *                              │
│  [___________________________]       │
│                                       │
│  WhatsApp (com DDD) *                │
│  [(__) _____-____]                   │
│                                       │
│  CRN (opcional)                      │
│  [___________________________]       │
│                                       │
│  [Enviar]  ou  [Falar no WhatsApp]   │
└─────────────────────────────────────┘
```

---

## 🔄 FLUXO COM FORMULÁRIO

### **Fluxo 1: Formulário → WhatsApp**
```
Nutricionista acessa página
    ↓
Lê conteúdo
    ↓
Preenche formulário (Lead capturado)
    ↓
Recebe confirmação
    ↓
Botão "Falar no WhatsApp" aparece
    ↓
Clica no WhatsApp (Contact capturado)
```

### **Fluxo 2: Formulário → Email Follow-up**
```
Nutricionista preenche formulário
    ↓
Lead salvo no sistema
    ↓
Email automático enviado
    ↓
Equipe de vendas recebe notificação
    ↓
Follow-up personalizado
```

---

## 📊 EVENTOS DO PIXEL COM FORMULÁRIO

### **Eventos que serão disparados:**

1. **ViewContent** - Visualizou página
2. **Lead** - Preencheu formulário ⭐ **NOVO**
3. **Contact** - Clicou no WhatsApp

### **Audiências que você pode criar:**

1. **Nutricionistas Interessadas (Lead)**
   - Pessoas que preencheram formulário
   - Usar para remarketing
   - Enviar conteúdo educativo

2. **Nutricionistas Prontas para Contato (Lead + Contact)**
   - Preencheram formulário E clicaram WhatsApp
   - Alta intenção de compra
   - Criar lookalike audience

3. **Nutricionistas que Não Converteram (Lead sem Contact)**
   - Preencheram formulário mas não clicaram WhatsApp
   - Campanha de reengajamento
   - Oferecer conteúdo adicional

---

## 🛠️ IMPLEMENTAÇÃO TÉCNICA

### **Onde adicionar:**

1. **Criar componente:** `src/components/nutri/LeadCaptureForm.tsx`
2. **Adicionar na página:** `src/app/pt/nutri/page.tsx`
3. **Criar API endpoint:** `/api/nutri/leads` (se não existir)
4. **Salvar no banco:** Tabela `nutri_leads` ou similar

### **Estrutura de dados:**

```typescript
interface NutriLead {
  name: string
  email: string
  phone: string
  crn?: string
  area?: string
  objetivo?: string
  source: 'nutri_landing_page'
  created_at: Date
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: Planejamento**
- [ ] Definir campos do formulário
- [ ] Escolher onde colocar (modal, seção, banner)
- [ ] Definir quando mostrar (tempo, scroll, etc.)

### **Fase 2: Desenvolvimento**
- [ ] Criar componente de formulário
- [ ] Criar/atualizar API endpoint
- [ ] Integrar com banco de dados
- [ ] Adicionar validações

### **Fase 3: Pixel e Rastreamento**
- [ ] Adicionar evento `Lead` quando formulário for preenchido
- [ ] Testar rastreamento
- [ ] Configurar audiências no Facebook

### **Fase 4: Automação**
- [ ] Email automático de confirmação
- [ ] Notificação para equipe de vendas
- [ ] Sequência de follow-up (opcional)

---

## 🎯 RECOMENDAÇÃO FINAL

**SIM, implemente o formulário!**

**Por quê:**
- ✅ Captura leads qualificados
- ✅ Melhora rastreamento no Pixel
- ✅ Permite automação de follow-up
- ✅ Reduz fricção para pessoas que preferem formulário
- ✅ Cria mais pontos de conversão

**Como começar:**
1. Comece simples: Nome, Email, WhatsApp
2. Adicione como modal pop-up (maior conversão)
3. Integre com Pixel (evento Lead)
4. Depois adicione automações

---

**💡 Dica:** Teste A/B entre formulário e botão WhatsApp direto para ver qual converte mais no seu público.

