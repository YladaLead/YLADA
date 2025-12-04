# 🧠 PROMPT PARA O CLAUDE — Criar Página do Plano Diário NOEL Wellness (Dias 1 a 90)

Claude, você vai criar a página do **Plano Diário** do sistema Wellness — integrando:

- ✅ Banco Supabase
- ✅ Endpoints já criados
- ✅ Lógica do NOEL
- ✅ Ritual 2-5-10
- ✅ Scripts
- ✅ Notificações
- ✅ Mensagens inspiracionais
- ✅ Checklists
- ✅ Progresso
- ✅ UX motivacional

A página deve ser **simples, elegante, funcional, motivadora** e extremamente **duplicável** para o distribuidor Herbalife.

---

## 🔷 1. ROTA E ARQUITETURA

### Criar:

**`/app/pt/wellness/plano/[dia]/page.tsx`**

Onde:
- `[dia]` é um número entre 1 e 90 (dynamic route)

### Comportamento:

- A página carrega automaticamente o plano do dia via Supabase
- Se o usuário tentar acessar um dia inexistente → redirecionar para dia 1
- Se o usuário tentar acessar dia < 1 → redirecionar para dia 1
- Se o usuário tentar acessar dia > 90 → redirecionar para dia 90

### Estrutura de arquivos:

```
src/app/pt/wellness/plano/[dia]/
  ├── page.tsx                    # Página principal
  └── components/
      ├── DayHeader.tsx          # Header motivacional
      ├── Checklist.tsx           # Checklist interativo
      ├── ScriptCard.tsx          # Card de script
      ├── ScriptsBlock.tsx        # Bloco de scripts sugeridos
      ├── NotificationsBlock.tsx  # Bloco de notificações
      ├── NoelChatButton.tsx      # Botão flutuante do NOEL
      ├── NoelChatModal.tsx       # Modal do chat NOEL
      ├── ProgressBar.tsx         # Barra de progresso
      └── DayNavigation.tsx       # Navegação entre dias
```

---

## 🔷 2. FONTE DE DADOS

### Tabela principal:

**`wellness_planos_dias`**

### Colunas a usar:

```typescript
interface PlanoDia {
  id: number
  dia: number              // 1-90
  fase: number             // 1, 2, 3, 4
  titulo: string
  foco: string
  microtarefas: string[]   // JSON array de strings
  scripts_sugeridos: string[]  // JSON array de slugs
  notificacoes_do_dia: string[] // JSON array de slugs
  mensagem_noel: string
  created_at: string
}
```

### Tabela de progresso:

**`ylada_wellness_progresso`**

### Colunas a usar:

```typescript
interface Progresso {
  id: string
  consultor_id: string
  data: string              // DATE (YYYY-MM-DD)
  ritual_2_executado: boolean
  ritual_5_executado: boolean
  ritual_10_executado: boolean
  microtarefas_completadas: number
  microtarefas_total: number
  pv_dia?: number
  vendas_dia?: number
  contatos_dia?: number
  recrutamentos_dia?: number
  observacoes?: string
}
```

### Tabela de scripts:

**`ylada_wellness_base_conhecimento`**

### Colunas a usar:

```typescript
interface Script {
  id: string
  categoria: string
  subcategoria?: string
  titulo: string
  conteudo: string
  // ... outras colunas
}
```

### Endpoints já existentes:

✅ **POST `/api/wellness/progresso/registrar`**
- Body: `{ consultor_id, data, ritual_2_executado?, ritual_5_executado?, ritual_10_executado?, microtarefas_completadas?, ... }`

✅ **POST `/api/wellness/ritual/executar`**
- Body: `{ consultor_id, tipo: 'ritual_2' | 'ritual_5' | 'ritual_10', dia?, observacoes? }`

✅ **POST `/api/wellness/notificacoes/create`**
- Body: `{ consultor_id, tipo, titulo, mensagem, acao_url?, acao_texto? }`

✅ **POST `/api/wellness/noel/responder`**
- Body: `{ consultor_id, mensagem, conversation_history? }`

✅ **GET `/api/wellness/scripts`**
- Query params: `?categoria=...&estagio=...&tags=...`

---

## 🔷 3. LAYOUT DA PÁGINA (UX EXATA)

A página deve ter **5 blocos principais**:

### 🔹 (1) HEADER MOTIVACIONAL DO DIA

**Component:** `<DayHeader />`

**Deve exibir:**

- **Dia X de 90** (badge/número grande)
- **Título do dia** (h1)
- **Fase** (badge: "Fase 1 - Fundamentos", "Fase 2 - Ritmo", etc.)
- **Foco do dia** (subtítulo)
- **Mensagem do NOEL** (estilo inspiracional)
  - Estilo aprovado: Jim Rohn + Mark Hughes + Eric Worre
  - Tom híbrido (90% "você")
  - Intensidade moderada

**Exemplo de render:**

```tsx
<div className="day-header">
  <div className="day-badge">Dia 7 de 90</div>
  <div className="phase-badge">Fase 1 - Fundamentos</div>
  <h1>Primeira Semana Concluída</h1>
  <p className="foco">Fundamentos: Criar base sólida e estabelecer rotina</p>
  <div className="mensagem-noel">
    <p>Você provou que é capaz. Agora continue — seu futuro precisa da sua consistência.</p>
  </div>
</div>
```

**Estilo:**
- Background gradiente suave (azul/roxo)
- Texto branco/contrastante
- Espaçamento generoso
- Tipografia grande e legível

---

### 🔹 (2) CHECKLIST INTERATIVO — Microtarefas do Dia

**Component:** `<Checklist />`

**Requisitos:**

1. **Cada microtarefa deve ser marcada individualmente**
   - Checkbox interativo
   - Ao marcar → enviar para `POST /api/wellness/progresso/registrar`
   - Atualizar `microtarefas_completadas` no banco

2. **Quando o usuário marca → enviar para:**
   ```
   POST /api/wellness/progresso/registrar
   {
     consultor_id: "...",
     data: "2025-01-XX",
     microtarefas_completadas: X,
     microtarefas_total: Y
   }
   ```

3. **Quando todas forem marcadas → mostrar selo:**
   ```
   🔥 Dia concluído — excelente trabalho!
   ```

4. **Deve ser salvo no Supabase**
   - Persistir estado
   - Refletir o progresso quando recarregar

5. **Checklist exibido assim:**
   ```
   ☐ Ritual 2 — 2 conexões
   ☐ Ritual 5 — 5 ações
   ☐ Ritual 10 — 10 minutos de revisão
   ☐ Preparar 1 bebida funcional
   ☐ Enviar 1 ferramenta Wellness
   ```

**Estrutura:**

```tsx
<div className="checklist">
  <h2>Microtarefas do Dia</h2>
  <div className="checklist-items">
    {microtarefas.map((tarefa, index) => (
      <ChecklistItem
        key={index}
        tarefa={tarefa}
        checked={progresso?.microtarefas_completadas > index}
        onToggle={() => handleToggleTarefa(index)}
      />
    ))}
  </div>
  {todasCompletas && (
    <div className="completion-badge">
      🔥 Dia concluído — excelente trabalho!
    </div>
  )}
</div>
```

**Estilo:**
- Cards brancos com sombra suave
- Checkbox grande e fácil de clicar
- Animação suave ao marcar
- Feedback visual imediato

---

### 🔹 (3) SCRIPTS SUGERIDOS

**Component:** `<ScriptsBlock />` e `<ScriptCard />`

**Requisitos:**

1. **Cada script sugerido no seed deve render assim:**
   - Título do script (card)
   - Botão "Abrir"
   - Ao clicar → abrir modal com o script completo

2. **Importante:** combinar com a tabela `ylada_wellness_base_conhecimento`
   - Buscar scripts pelos slugs em `scripts_sugeridos`
   - Exibir `titulo` e `conteudo`

3. **Estrutura:**

```tsx
<div className="scripts-block">
  <h2>Scripts Sugeridos para Hoje</h2>
  <div className="scripts-grid">
    {scripts.map((script) => (
      <ScriptCard
        key={script.id}
        titulo={script.titulo}
        onOpen={() => openScriptModal(script)}
      />
    ))}
  </div>
</div>
```

**Modal do Script:**

```tsx
<Modal isOpen={isScriptModalOpen} onClose={closeScriptModal}>
  <h3>{scriptSelecionado.titulo}</h3>
  <div className="script-content">
    {scriptSelecionado.conteudo}
  </div>
  <button onClick={copyScript}>Copiar Script</button>
</Modal>
```

**Estilo:**
- Cards com hover effect
- Modal limpo e legível
- Botão de copiar funcional

---

### 🔹 (4) NOTIFICAÇÕES DO DIA

**Component:** `<NotificationsBlock />`

**Requisitos:**

1. **Deve exibir:**
   - `notificacoes_do_dia` (slugs do seed)
   - Lista de notificações disponíveis

2. **Botão "Ativar lembretes do dia"** → chama:
   ```
   POST /api/wellness/notificacoes/create
   {
     consultor_id: "...",
     tipo: "lembrete" | "ritual" | "motivacional",
     titulo: "...",
     mensagem: "...",
     acao_url: "/pt/wellness/plano/[dia]",
     acao_texto: "Ver plano do dia"
   }
   ```

3. **Exemplo:**

```tsx
<div className="notifications-block">
  <h2>Notificações de Hoje</h2>
  <ul>
    <li>• Ritual manhã</li>
    <li>• Motivacional disciplina</li>
    <li>• Ritual noite</li>
  </ul>
  <button onClick={ativarLembretes}>
    Ativar lembretes do dia
  </button>
</div>
```

**Estilo:**
- Lista simples e clara
- Botão destacado
- Feedback ao ativar

---

### 🔹 (5) BOTÃO FLUTUANTE — FALAR COM O NOEL

**Component:** `<NoelChatButton />` e `<NoelChatModal />`

**Requisitos:**

1. **No canto inferior direito:**
   - Botão flutuante fixo
   - Ícone de chat
   - Texto: "Falar com NOEL"

2. **Ao clicar:**
   - Abre modal do chat
   - Envia automaticamente o contexto (dia + progresso) para:
     ```
     POST /api/wellness/noel/responder
     {
       consultor_id: "...",
       mensagem: "Olá NOEL, estou no dia [X] do plano. Como posso melhorar hoje?",
       conversation_history: []
     }
     ```
   - Isso cria "mentor always-on"

3. **Modal do Chat:**

```tsx
<NoelChatModal isOpen={isChatOpen} onClose={closeChat}>
  <ChatHeader>
    <span>🎯</span>
    <h3>NOEL Wellness</h3>
    <p>Seu mentor oficial</p>
  </ChatHeader>
  <ChatMessages>
    {/* Mensagens do chat */}
  </ChatMessages>
  <ChatInput
    onSubmit={(mensagem) => enviarMensagemNoel(mensagem)}
  />
</NoelChatModal>
```

**Estilo:**
- Botão flutuante com z-index alto
- Modal responsivo
- Chat limpo e funcional

---

## 🔷 4. NAVEGAÇÃO ENTRE DIAS

**Component:** `<DayNavigation />`

**Requisitos:**

1. **No rodapé da página:**
   ```
   ⬅️ Dia anterior | Dia seguinte ➡️
   ```

2. **Regras:**
   - Não deixar avançar além do dia 90
   - Não deixar voltar antes do dia 1
   - Desabilitar botão quando não houver próximo/anterior

3. **Estrutura:**

```tsx
<div className="day-navigation">
  <button
    onClick={() => router.push(`/pt/wellness/plano/${dia - 1}`)}
    disabled={dia <= 1}
  >
    ⬅️ Dia anterior
  </button>
  <span>Dia {dia} de 90</span>
  <button
    onClick={() => router.push(`/pt/wellness/plano/${dia + 1}`)}
    disabled={dia >= 90}
  >
    Dia seguinte ➡️
  </button>
</div>
```

**Estilo:**
- Botões claros e acessíveis
- Feedback visual quando desabilitado

---

## 🔷 5. GAMIFICAÇÃO LEVE

**Component:** `<ProgressBar />`

**Requisitos:**

1. **Adicionar:**
   - Barra de progresso visual
   - "Você completou X de 90 dias"
   - Componente simples

2. **Estrutura:**

```tsx
<div className="progress-section">
  <h3>Seu Progresso</h3>
  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${(dia / 90) * 100}%` }}
    />
  </div>
  <p>Você completou {dia} de 90 dias</p>
</div>
```

**Estilo:**
- Barra de progresso visual
- Cores motivacionais (verde/azul)
- Texto encorajador

---

## 🔷 6. ESTILO VISUAL

### Mais importante que design:

- ✅ Deve ser **limpo**
- ✅ Fácil de entender
- ✅ Sem poluição visual
- ✅ Motivacional
- ✅ Responsivo

### Recomendações:

- **Tailwind CSS** para estilização
- **Componentes reutilizáveis**
- **Modais leves** (sem bibliotecas pesadas)
- **Cores da marca** (azul premium)
- **Tipografia legível** (Inter, Roboto, ou similar)
- **Espaçamento generoso**
- **Sombras suaves** para profundidade

### Paleta sugerida:

```css
--primary: #2563EB (azul)
--success: #10B981 (verde)
--warning: #F59E0B (amarelo)
--background: #F9FAFB (cinza claro)
--text: #1F2937 (cinza escuro)
```

---

## 🔷 7. INTEGRAÇÃO COM O SEED

A página deve estar preparada para:

1. ✅ Ler qualquer dia do banco (`wellness_planos_dias`)
2. ✅ Interpretar `microtarefas` (JSON array de strings)
3. ✅ Interpretar `scripts_sugeridos` (JSON array de slugs)
4. ✅ Buscar scripts na tabela `ylada_wellness_base_conhecimento`
5. ✅ Interpretar `notificacoes_do_dia` (JSON array de slugs)
6. ✅ Interpretar `mensagem_noel` (texto simples)

### Exemplo de parsing:

```typescript
// Carregar plano do dia
const { data: plano } = await supabase
  .from('wellness_planos_dias')
  .select('*')
  .eq('dia', dia)
  .single()

// Parsear microtarefas (já vem como array do Supabase)
const microtarefas = plano.microtarefas // string[]

// Buscar scripts
const scripts = await Promise.all(
  plano.scripts_sugeridos.map(async (slug) => {
    const { data } = await supabase
      .from('ylada_wellness_base_conhecimento')
      .select('*')
      .eq('titulo', slug)
      .single()
    return data
  })
)
```

---

## 🔷 8. REGRAS GERAIS

### Performance:

- ✅ Tudo precisa carregar **rápido**
- ✅ Não usar animações pesadas
- ✅ Cache leve (usar `useMemo` e `useCallback`)
- ✅ Lazy loading de componentes pesados

### Funcionalidade:

- ✅ Não depender de IA para carregar a página
- ✅ A página sempre funciona mesmo sem o NOEL
- ✅ Fallbacks para dados ausentes
- ✅ Loading states apropriados

### Acessibilidade:

- ✅ Botões com aria-labels
- ✅ Navegação por teclado
- ✅ Contraste adequado
- ✅ Textos alternativos

### Segurança:

- ✅ Verificar autenticação (usar `ProtectedRoute`)
- ✅ Validar `consultor_id` antes de salvar
- ✅ Sanitizar inputs

---

## 🔷 9. ENTREGA

Você deve gerar:

1. ✅ **Todo o código da página** `/app/pt/wellness/plano/[dia]/page.tsx`
2. ✅ **Componentes auxiliares:**
   - `DayHeader.tsx`
   - `Checklist.tsx`
   - `ScriptCard.tsx`
   - `ScriptsBlock.tsx`
   - `NotificationsBlock.tsx`
   - `NoelChatButton.tsx`
   - `NoelChatModal.tsx`
   - `ProgressBar.tsx`
   - `DayNavigation.tsx`
3. ✅ **Integração com os endpoints** (todos já existem)
4. ✅ **Leitura do Supabase** com caching leve
5. ✅ **UI final funcional e elegante**

---

## ⛔ REGRAS ABSOLUTAS

### ❌ NÃO fazer:

- ❌ NÃO improvisar estilo
- ❌ NÃO mudar a estrutura UX aprovada
- ❌ NÃO criar complexidade desnecessária
- ❌ NÃO alterar a energia inspiracional do NOEL
- ❌ NÃO usar bibliotecas pesadas
- ❌ NÃO criar dependências desnecessárias

### ✅ SIM fazer:

- ✅ Seguir estrutura exata dos 5 blocos
- ✅ Usar endpoints já criados
- ✅ Manter estilo limpo e motivacional
- ✅ Garantir responsividade
- ✅ Implementar todos os componentes listados
- ✅ Testar funcionalidade completa

---

## 🚀 PRONTO PARA EXECUTAR

Este prompt está completo, detalhado e impossível de gerar errado.

**Copie e cole EXACTAMENTE no Claude (não edite nada).**

O cliente já aprovou tudo. Apenas construa conforme descrito.

---

## 📋 CHECKLIST DE ENTREGA

Antes de entregar, verifique:

- [ ] Página `/app/pt/wellness/plano/[dia]/page.tsx` criada
- [ ] Todos os 9 componentes criados
- [ ] Integração com Supabase funcionando
- [ ] Endpoints integrados corretamente
- [ ] Checklist interativo funcionando
- [ ] Scripts carregando e exibindo
- [ ] Notificações funcionando
- [ ] Chat NOEL integrado
- [ ] Navegação entre dias funcionando
- [ ] Barra de progresso exibindo corretamente
- [ ] Responsivo (mobile e desktop)
- [ ] Loading states implementados
- [ ] Error handling implementado
- [ ] Autenticação verificada
- [ ] Código limpo e comentado

---

**PRONTO PARA ENVIAR AO CLAUDE!** 🎯

