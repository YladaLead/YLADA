# 🚀 PLANO DE AÇÃO - GESTÃO DE CLIENTES MVP

**Data:** 18 de Dezembro de 2025  
**Objetivo:** Entregar Gestão de Clientes 100% funcional para nutricionistas  
**Prazo Estimado:** 1-2 semanas (20-37 horas)

---

## 📋 TAREFAS PRIORIZADAS

---

## 🔴 FASE 1: FUNDAÇÃO (CRÍTICO) - 2-3 horas

### ✅ Tarefa 1: Corrigir Schema do Banco de Dados

**Prioridade:** 🔴 MÁXIMA  
**Tempo:** 2h  
**Responsável:** Dev  
**Dependências:** Nenhuma

**O que fazer:**

1. **Executar migration no Supabase:**
   - Ir em Supabase → SQL Editor
   - Executar arquivo `migrations/ajustes-finais-schema-gestao.sql`
   - Se não existir, criar baseado em `docs/AJUSTES-SCHEMA-ANTES-INTERFACES.md`

2. **Adicionar campos faltantes em `clients`:**
```sql
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS phone_country_code VARCHAR(5) DEFAULT 'BR',
ADD COLUMN IF NOT EXISTS instagram VARCHAR(100),
ADD COLUMN IF NOT EXISTS goal TEXT;
```

3. **Adicionar campos faltantes em `emotional_behavioral_history`:**
```sql
ALTER TABLE emotional_behavioral_history
ADD COLUMN IF NOT EXISTS story TEXT,
ADD COLUMN IF NOT EXISTS moment_of_change TEXT,
ADD COLUMN IF NOT EXISTS commitment INTEGER CHECK (commitment >= 1 AND commitment <= 10),
ADD COLUMN IF NOT EXISTS biggest_fear TEXT,
ADD COLUMN IF NOT EXISTS behavioral_block TEXT;
```

4. **Adicionar campos faltantes em `programs`:**
```sql
ALTER TABLE programs
ADD COLUMN IF NOT EXISTS stage VARCHAR(50),
ADD COLUMN IF NOT EXISTS weekly_goal TEXT;
```

5. **Verificar que tudo foi aplicado:**
```sql
-- Verificar clients
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'clients' 
AND column_name IN ('phone_country_code', 'instagram', 'goal');

-- Verificar emotional_behavioral_history
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'emotional_behavioral_history' 
AND column_name IN ('story', 'moment_of_change', 'commitment', 'biggest_fear', 'behavioral_block');

-- Verificar programs
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'programs' 
AND column_name IN ('stage', 'weekly_goal');
```

**Critério de Sucesso:**
- ✅ Todos os campos listados existem no banco
- ✅ Nenhum erro ao executar queries de verificação
- ✅ Frontend não dá erro ao tentar salvar novos campos

---

## 🔴 FASE 2: EVOLUÇÃO FÍSICA (CRÍTICO) - 10 horas

### ✅ Tarefa 2: Criar Modal de Nova Evolução Física

**Prioridade:** 🔴 MÁXIMA  
**Tempo:** 4h  
**Responsável:** Dev  
**Dependências:** Tarefa 1

**O que fazer:**

1. **Criar componente `NovaEvolucaoModal.tsx` em `src/components/nutri/`:**

```typescript
// Estrutura básica
interface NovaEvolucaoModalProps {
  isOpen: boolean
  onClose: () => void
  clientId: string
  onSuccess: () => void
}

// Campos do formulário:
- data (date) - obrigatório
- peso (number) - obrigatório
- altura (number)
- imc (calculado automaticamente)
- gordura_corporal (number)
- massa_muscular (number)
- massa_ossea (number)
- agua (number)
- gordura_visceral (number)
- circunferencias (json):
  - pescoco
  - torax
  - cintura
  - quadril
  - braco_direito
  - braco_esquerdo
  - coxa_direita
  - coxa_esquerda
- observacoes (textarea)
```

2. **Implementar cálculo automático de IMC:**
```typescript
const calcularIMC = (peso: number, altura: number) => {
  if (!peso || !altura) return null
  const alturaMetros = altura / 100
  return (peso / (alturaMetros * alturaMetros)).toFixed(2)
}
```

3. **Implementar submit do formulário:**
```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  
  const response = await fetch(`/api/nutri/clientes/${clientId}/evolucao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
    credentials: 'include'
  })
  
  if (response.ok) {
    onSuccess()
    onClose()
  }
}
```

4. **Adicionar validações:**
- Peso entre 30kg e 300kg
- Altura entre 100cm e 250cm
- Data não pode ser futura
- Campos numéricos não negativos

5. **Integrar no perfil do cliente:**
```typescript
// Em src/app/pt/nutri/(protected)/clientes/[id]/page.tsx
// Na aba 'evolucao', adicionar:
<button 
  onClick={() => setShowNovaEvolucaoModal(true)}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
>
  + Registrar Nova Medição
</button>

<NovaEvolucaoModal
  isOpen={showNovaEvolucaoModal}
  onClose={() => setShowNovaEvolucaoModal(false)}
  clientId={clientId}
  onSuccess={() => {
    // Recarregar dados de evolução
  }}
/>
```

**Critério de Sucesso:**
- ✅ Modal abre e fecha corretamente
- ✅ Formulário salva dados no banco
- ✅ IMC é calculado automaticamente
- ✅ Validações funcionam
- ✅ Feedback visual de sucesso/erro

---

### ✅ Tarefa 3: Implementar Tabela de Histórico de Evoluções

**Prioridade:** 🔴 MÁXIMA  
**Tempo:** 3h  
**Responsável:** Dev  
**Dependências:** Tarefa 2

**O que fazer:**

1. **Criar componente `TabelaEvolucao.tsx`:**

```typescript
// Colunas da tabela:
- Data
- Peso (kg)
- IMC
- Circunferência Cintura (cm)
- Circunferência Quadril (cm)
- % Gordura
- Massa Muscular (kg)
- Ações (Ver detalhes, Editar, Excluir)
```

2. **Implementar carregamento de dados:**
```typescript
useEffect(() => {
  const carregarEvolucoes = async () => {
    const response = await fetch(`/api/nutri/clientes/${clientId}/evolucao`)
    const data = await response.json()
    setEvolucoes(data.data.evolutions)
  }
  carregarEvolucoes()
}, [clientId])
```

3. **Implementar ordenação (mais recente primeiro)**

4. **Implementar modal de detalhes (expandir para ver todas as medidas)**

5. **Implementar edição inline ou modal**

6. **Implementar exclusão com confirmação**

7. **Adicionar indicadores visuais:**
- 🔺 Peso aumentou
- 🔻 Peso diminuiu
- ➖ Peso manteve
- Cores: verde (progresso positivo), amarelo (neutro), vermelho (regressão)

**Critério de Sucesso:**
- ✅ Tabela carrega dados do banco
- ✅ Ordenação funciona
- ✅ Edição funciona
- ✅ Exclusão funciona com confirmação
- ✅ Indicadores visuais ajudam interpretação

---

### ✅ Tarefa 4: Implementar Gráfico de Evolução de Peso

**Prioridade:** 🔴 MÁXIMA  
**Tempo:** 3h  
**Responsável:** Dev  
**Dependências:** Tarefa 3

**O que fazer:**

1. **Instalar biblioteca de gráficos:**
```bash
npm install recharts
# ou
npm install chart.js react-chartjs-2
```

2. **Criar componente `GraficoEvolucaoPeso.tsx`:**

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface GraficoEvolucaoPesoProps {
  evolucoes: Evolution[]
}

export default function GraficoEvolucaoPeso({ evolucoes }: GraficoEvolucaoPesoProps) {
  // Preparar dados (últimos 6 meses ou 10 registros)
  const dados = evolucoes
    .slice(0, 10)
    .reverse()
    .map(ev => ({
      data: new Date(ev.measurement_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      peso: ev.weight,
      imc: ev.imc
    }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={dados}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="data" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="peso" stroke="#3b82f6" strokeWidth={2} name="Peso (kg)" />
        <Line type="monotone" dataKey="imc" stroke="#10b981" strokeWidth={2} name="IMC" />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

3. **Adicionar filtros:**
- Últimos 3 meses
- Últimos 6 meses
- Último ano
- Todos

4. **Adicionar informações estatísticas:**
```typescript
// Acima do gráfico
- Peso inicial: XX kg
- Peso atual: XX kg
- Variação: +/-XX kg (+/-XX%)
- Meta: XX kg (se definida)
- Faltam: XX kg
```

5. **Tornar responsivo para mobile**

**Critério de Sucesso:**
- ✅ Gráfico renderiza corretamente
- ✅ Dados são exibidos de forma legível
- ✅ Filtros funcionam
- ✅ Estatísticas estão corretas
- ✅ Responsivo em mobile

---

## 🔴 FASE 3: AVALIAÇÕES (CRÍTICO) - 8 horas

### ✅ Tarefa 5: Criar Formulário de Avaliação Antropométrica

**Prioridade:** 🔴 MÁXIMA  
**Tempo:** 5h  
**Responsável:** Dev  
**Dependências:** Tarefa 1

**O que fazer:**

1. **Criar componente `NovaAvaliacaoModal.tsx`:**

```typescript
// Seções do formulário:
1. Dados Gerais:
   - data_avaliacao (date)
   - tipo (select: 'antropometrica', 'bioimpedancia', 'anamnese', 'reevaluacao')
   - objetivo (textarea)

2. Medidas Antropométricas:
   - peso (number)
   - altura (number)
   - imc (calculado)
   - circunferencias (objeto com todos os campos)
   - dobras_cutaneas (opcional):
     - tricipital
     - bicipital
     - subescapular
     - suprailíaca
     - abdominal
     - coxa

3. Composição Corporal:
   - gordura_corporal (%)
   - massa_muscular (kg)
   - massa_ossea (kg)
   - agua (%)
   - gordura_visceral (nivel)
   - metabolismo_basal (kcal)

4. Observações:
   - interpretacao (textarea)
   - recomendacoes (textarea)
   - observacoes (textarea)
```

2. **Implementar wizard/tabs para dividir formulário:**
```typescript
const [currentStep, setCurrentStep] = useState(1)

const steps = [
  { id: 1, label: 'Dados Gerais' },
  { id: 2, label: 'Medidas' },
  { id: 3, label: 'Composição' },
  { id: 4, label: 'Observações' }
]
```

3. **Implementar salvamento:**
```typescript
const handleSubmit = async () => {
  const response = await fetch(`/api/nutri/clientes/${clientId}/avaliacoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...formData,
      is_reevaluation: false,
      assessment_number: 1
    }),
    credentials: 'include'
  })
}
```

4. **Implementar salvar como rascunho:**
```typescript
const handleSaveAsDraft = async () => {
  const response = await fetch(`/api/nutri/clientes/${clientId}/avaliacoes`, {
    method: 'POST',
    body: JSON.stringify({ ...formData, status: 'rascunho' }),
    credentials: 'include'
  })
}
```

5. **Adicionar validações:**
- Campos obrigatórios: data, peso, altura
- Validações de range (peso, altura, etc.)

**Critério de Sucesso:**
- ✅ Formulário completo funciona
- ✅ Wizard facilita preenchimento
- ✅ Salvamento funciona
- ✅ Rascunho funciona
- ✅ Dados aparecem na lista de avaliações

---

### ✅ Tarefa 6: Implementar Lista e Visualização de Avaliações

**Prioridade:** 🔴 MÁXIMA  
**Tempo:** 3h  
**Responsável:** Dev  
**Dependências:** Tarefa 5

**O que fazer:**

1. **Criar componente `ListaAvaliacoes.tsx`:**

```typescript
// Cards de avaliações:
- Data da avaliação
- Tipo (badge)
- Número (1ª avaliação, 2ª avaliação, etc.)
- Resumo (peso, IMC, % gordura)
- Ações (Ver detalhes, Editar, Excluir, Criar reavaliação)
```

2. **Criar componente `DetalhesAvaliacaoModal.tsx`:**
```typescript
// Exibir todas as informações da avaliação
// Organizado por seções
// Botões: Editar, Excluir, Criar Reavaliação, Download PDF
```

3. **Implementar ordenação (mais recente primeiro)**

4. **Implementar filtro por tipo**

5. **Implementar busca por data**

6. **Adicionar indicadores:**
- 🟢 Avaliação inicial
- 🔵 Reavaliação
- 🟡 Rascunho

**Critério de Sucesso:**
- ✅ Lista carrega avaliações do banco
- ✅ Visualização detalhada funciona
- ✅ Filtros e busca funcionam
- ✅ Ações (editar, excluir) funcionam

---

## 🟡 FASE 4: REAVALIAÇÕES (ALTA) - 6 horas

### ✅ Tarefa 7: Implementar Sistema de Reavaliação

**Prioridade:** 🟡 ALTA  
**Tempo:** 4h  
**Responsável:** Dev  
**Dependências:** Tarefa 6

**O que fazer:**

1. **Criar componente `NovaReavaliacaoModal.tsx`:**

```typescript
// Similar ao NovaAvaliacaoModal, mas:
- Pre-carrega dados da última avaliação
- Mostra comparação lado a lado (antes vs agora)
- Calcula automaticamente diferenças
- Incrementa assessment_number
- Marca is_reevaluation = true
- Define parent_assessment_id
```

2. **Implementar carregamento da avaliação anterior:**
```typescript
useEffect(() => {
  const carregarUltimaAvaliacao = async () => {
    const response = await fetch(`/api/nutri/clientes/${clientId}/avaliacoes?limit=1&order=desc`)
    const data = await response.json()
    setAvaliacaoAnterior(data.data.assessments[0])
  }
  carregarUltimaAvaliacao()
}, [clientId])
```

3. **Implementar cálculos de diferença:**
```typescript
const calcularDiferenca = (valorAtual: number, valorAnterior: number) => {
  const diff = valorAtual - valorAnterior
  const percent = ((diff / valorAnterior) * 100).toFixed(1)
  return { diff, percent }
}
```

4. **Implementar UI de comparação:**
```typescript
// Para cada campo:
<div className="grid grid-cols-3 gap-4">
  <div>
    <label>Anterior</label>
    <input value={avaliacaoAnterior.weight} disabled />
  </div>
  <div>
    <label>Atual</label>
    <input value={formData.weight} onChange={...} />
  </div>
  <div>
    <label>Diferença</label>
    <span className={diff > 0 ? 'text-red-600' : 'text-green-600'}>
      {diff > 0 ? '+' : ''}{diff} kg ({percent}%)
    </span>
  </div>
</div>
```

5. **Integrar na lista de avaliações:**
```typescript
<button onClick={() => setShowReavaliacaoModal(true)}>
  🔄 Criar Reavaliação
</button>
```

**Critério de Sucesso:**
- ✅ Reavaliação carrega dados anteriores
- ✅ Comparação funciona
- ✅ Diferenças são calculadas automaticamente
- ✅ Salvamento funciona
- ✅ Numeração sequencial funciona (1ª, 2ª, 3ª...)

---

### ✅ Tarefa 8: Implementar Visualização de Comparação

**Prioridade:** 🟡 ALTA  
**Tempo:** 2h  
**Responsável:** Dev  
**Dependências:** Tarefa 7

**O que fazer:**

1. **Criar componente `ComparacaoAvaliacoes.tsx`:**

```typescript
// Exibir lado a lado:
- Avaliação anterior vs Reavaliação
- Todas as medidas
- Diferenças destacadas
- Percentuais
- Gráfico de barras comparativo
```

2. **Implementar API de comparação:**
```typescript
// GET /api/nutri/clientes/[id]/avaliacoes/[avaliacaoId]/comparacao
// Retorna:
{
  previous: {...},
  current: {...},
  differences: {
    weight: { diff: -2.5, percent: -3.1 },
    body_fat: { diff: -1.2, percent: -4.5 },
    // ...
  }
}
```

3. **Adicionar botão na lista de avaliações:**
```typescript
// Para reavaliações, mostrar:
<button onClick={() => setShowComparacao(true)}>
  📊 Ver Comparação
</button>
```

**Critério de Sucesso:**
- ✅ Comparação exibe dados corretamente
- ✅ Diferenças são calculadas e exibidas
- ✅ Visual é claro e profissional

---

## 🟡 FASE 5: MELHORIAS (ALTA) - 7 horas

### ✅ Tarefa 9: Melhorar Timeline/Histórico

**Prioridade:** 🟡 ALTA  
**Tempo:** 4h  
**Responsável:** Dev  
**Dependências:** Nenhuma

**O que fazer:**

1. **Criar componente `TimelineCliente.tsx`:**

```typescript
// Estrutura:
- Linha do tempo vertical
- Eventos ordenados por data (mais recente primeiro)
- Ícones diferentes por tipo de evento
- Filtros por tipo
- Busca por texto
```

2. **Tipos de eventos:**
```typescript
const eventIcons = {
  cliente_criado: '👤',
  status_alterado: '🔄',
  consulta_agendada: '📅',
  consulta_realizada: '✅',
  avaliacao_criada: '📋',
  evolucao_registrada: '📈',
  programa_criado: '📝',
  nota_adicionada: '💭',
  documento_enviado: '📎'
}
```

3. **Implementar criação automática de eventos:**

```typescript
// Em cada API (clientes, evolucao, avaliacoes, etc.):

// Após criar/atualizar, adicionar:
await supabaseAdmin
  .from('client_history')
  .insert({
    client_id: clientId,
    user_id: userId,
    activity_type: 'evolucao_registrada',
    description: 'Nova medição registrada: 75kg',
    metadata: {
      weight: 75,
      measurement_date: '2025-12-18'
    }
  })
```

4. **Implementar filtros:**
```typescript
const [filtroTipo, setFiltroTipo] = useState('todos')
const [busca, setBusca] = useState('')

const eventosFiltrados = eventos
  .filter(ev => filtroTipo === 'todos' || ev.activity_type === filtroTipo)
  .filter(ev => ev.description.toLowerCase().includes(busca.toLowerCase()))
```

5. **Adicionar busca por data/período**

**Critério de Sucesso:**
- ✅ Timeline exibe eventos corretamente
- ✅ Eventos são criados automaticamente
- ✅ Filtros funcionam
- ✅ Busca funciona
- ✅ Visual é claro e cronológico

---

### ✅ Tarefa 10: Melhorar Aba de Agenda no Perfil

**Prioridade:** 🟡 ALTA  
**Tempo:** 3h  
**Responsável:** Dev  
**Dependências:** Nenhuma

**O que fazer:**

1. **Criar componente `AgendaCliente.tsx`:**

```typescript
// Exibir:
- Próxima consulta (destacada)
- Consultas futuras (lista)
- Histórico de consultas (lista paginada)
- Botão "Agendar Nova Consulta"
- Filtros (futuras, passadas, canceladas)
```

2. **Implementar carregamento:**
```typescript
useEffect(() => {
  const carregarConsultas = async () => {
    const response = await fetch(`/api/nutri/appointments?client_id=${clientId}`)
    const data = await response.json()
    setConsultas(data.data.appointments)
  }
  carregarConsultas()
}, [clientId])
```

3. **Implementar modal de nova consulta:**
```typescript
// Criar modal inline para agendar
// Campos:
- Título
- Data e hora (início e fim)
- Tipo (consulta, retorno, avaliação)
- Localização (presencial, online, domicílio)
- Observações
- Lembrete (15 min antes, 1 dia antes)
```

4. **Implementar ações:**
- Ver detalhes
- Editar
- Cancelar
- Marcar como realizada
- Marcar como falta

5. **Adicionar indicadores visuais:**
- 🟢 Confirmada
- 🟡 Agendada
- 🔴 Cancelada
- ⚫ Falta
- ✅ Realizada

**Critério de Sucesso:**
- ✅ Lista carrega consultas do cliente
- ✅ Próxima consulta é destacada
- ✅ Modal de nova consulta funciona
- ✅ Ações funcionam
- ✅ Integração com API de appointments funciona

---

## 🟢 FASE 6: NICE-TO-HAVE (MÉDIA) - 10+ horas

### ✅ Tarefa 11: Upload de Fotos de Evolução

**Prioridade:** 🟢 MÉDIA  
**Tempo:** 5h  

(Detalhes omitidos por brevidade - pode ser adicionado depois)

---

### ✅ Tarefa 12: Formulário de Registro Emocional

**Prioridade:** 🟢 MÉDIA  
**Tempo:** 4h  

(Detalhes omitidos por brevidade - pode ser adicionado depois)

---

### ✅ Tarefa 13: Gráficos Adicionais

**Prioridade:** 🟢 MÉDIA  
**Tempo:** 6h  

(Gráficos de circunferências, composição corporal, etc.)

---

## 📊 CRONOGRAMA RESUMIDO

| Fase | Tempo Total | Prioridade | Pode Entregar? |
|------|-------------|------------|----------------|
| Fase 1: Fundação | 2h | 🔴 MÁXIMA | Sim |
| Fase 2: Evolução Física | 10h | 🔴 MÁXIMA | Sim |
| Fase 3: Avaliações | 8h | 🔴 MÁXIMA | Sim |
| **TOTAL MVP MÍNIMO** | **20h** | - | **✅ SIM** |
| Fase 4: Reavaliações | 6h | 🟡 ALTA | Sim |
| Fase 5: Melhorias | 7h | 🟡 ALTA | Sim |
| **TOTAL MVP COMPLETO** | **33h** | - | **✅ SIM** |
| Fase 6: Nice-to-have | 10h+ | 🟢 MÉDIA | Depois |

---

## ✅ CHECKLIST DE ENTREGA

### MVP Mínimo (20h):
- [ ] Schema do banco corrigido
- [ ] Formulário de nova evolução física funciona
- [ ] Tabela de histórico de evoluções funciona
- [ ] Gráfico de peso funciona
- [ ] Formulário de avaliação funciona
- [ ] Lista de avaliações funciona
- [ ] Visualização de avaliação funciona

### MVP Completo (33h):
- [ ] Todos os itens do MVP Mínimo
- [ ] Sistema de reavaliação funciona
- [ ] Comparação de avaliações funciona
- [ ] Timeline/histórico funciona
- [ ] Aba de agenda no perfil funciona

### Nice-to-have (depois):
- [ ] Upload de fotos
- [ ] Registro emocional
- [ ] Gráficos avançados
- [ ] Exportação de relatórios

---

## 🎯 CRITÉRIOS DE ACEITAÇÃO

Para considerar a Gestão de Clientes **pronta para produção**:

1. ✅ Nutricionista consegue cadastrar cliente
2. ✅ Nutricionista consegue registrar evolução física
3. ✅ Nutricionista vê gráfico de evolução de peso
4. ✅ Nutricionista consegue criar avaliação
5. ✅ Nutricionista consegue criar reavaliação
6. ✅ Nutricionista vê comparação entre avaliações
7. ✅ Nutricionista vê timeline de eventos
8. ✅ Nutricionista consegue agendar consulta
9. ✅ Nenhum erro crítico no console
10. ✅ Performance aceitável (< 3s para carregar dados)

---

## 🚀 COMO COMEÇAR

### Hoje (Dia 1):

```bash
# 1. Corrigir schema
# Acessar Supabase SQL Editor
# Executar migrations pendentes

# 2. Criar branch
git checkout -b feature/gestao-clientes-mvp

# 3. Começar Tarefa 2
# Criar src/components/nutri/NovaEvolucaoModal.tsx
```

### Amanhã (Dia 2):

```bash
# Continuar Fase 2
# Tarefas 3 e 4
```

### Próximos 3 dias:

```bash
# Fase 3: Avaliações
# Tarefas 5 e 6
```

### Próximos 2 dias:

```bash
# Fase 4 e 5
# Tarefas 7, 8, 9, 10
```

---

## 📞 DÚVIDAS FREQUENTES

**Q: Preciso fazer tudo de uma vez?**  
A: Não! Faça por fases. Entregue MVP Mínimo primeiro (20h), depois adicione melhorias.

**Q: Posso pular alguma tarefa?**  
A: Fase 1, 2 e 3 são obrigatórias. Fases 4, 5 e 6 podem ser adiadas.

**Q: Como sei se está funcionando?**  
A: Teste cada funcionalidade após implementar. Use o checklist de validação.

**Q: E se encontrar bugs?**  
A: Corrija imediatamente se for crítico. Se não, adicione à lista de melhorias.

---

**Última atualização:** 18 de Dezembro de 2025  
**Status:** 📋 Plano pronto, aguardando execução

