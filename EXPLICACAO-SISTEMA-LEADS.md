# 🎯 EXPLICAÇÃO COMPLETA - SISTEMA DE LEADS

**Data:** 18 de Dezembro de 2025

---

## 📊 1. COMO FUNCIONA A BUSCA E FILTROS

Baseado no código da página `/pt/nutri/leads`, aqui está a lógica:

### 🔍 **Busca por Nome/Email/Cidade**

```typescript
const leadsFiltrados = leads.filter(lead => {
  const buscaMatch = busca === '' || 
    lead.nome.toLowerCase().includes(busca.toLowerCase()) ||
    lead.email.toLowerCase().includes(busca.toLowerCase()) ||
    lead.cidade.toLowerCase().includes(busca.toLowerCase())
  
  return buscaMatch
})
```

**O que acontece:**
1. Você digita no campo "Buscar"
2. O sistema busca em 3 campos simultaneamente:
   - **Nome** do lead
   - **Email** do lead
   - **Cidade** do lead
3. Busca é **case-insensitive** (não diferencia maiúsculas/minúsculas)
4. Busca é **parcial** (encontra se contém o texto, não precisa ser exato)

**Exemplos:**
- Digitar "maria" → Encontra "Maria Silva", "maria@email.com"
- Digitar "são" → Encontra leads de "São Paulo"
- Digitar "99999" → Encontra telefone "(11) 99999-9999"

---

### 📋 **Filtro por Status**

```typescript
const statusMatch = filtroStatus === 'todos' || lead.status === filtroStatus
```

**Status disponíveis:**
- **Todos** (mostra todos os leads)
- **Novo** (lead acabou de chegar, ainda não contatado)
- **Contatado** (você já entrou em contato)
- **Convertido** (virou cliente)
- **Perdido** (não teve interesse ou não respondeu)

**Como funciona:**
1. Você seleciona um status no dropdown
2. Se selecionar "Todos", mostra todos
3. Se selecionar um específico, mostra apenas aqueles com esse status

---

### 🧮 **Filtro por Ferramenta**

```typescript
const ferramentaMatch = filtroFerramenta === 'todas' || lead.ferramenta === filtroFerramenta
```

**Ferramentas disponíveis:**
- **Todas** (mostra de todas as ferramentas)
- **Quiz Interativo**
- **Calculadora de IMC**
- **Post de Curiosidades**
- **Template Post Dica**

**Como funciona:**
1. Você seleciona uma ferramenta no dropdown
2. Se selecionar "Todas", mostra todos
3. Se selecionar uma específica, mostra apenas leads que vieram dessa ferramenta

---

### 🔗 **Filtros Combinados**

```typescript
const leadsFiltrados = leads.filter(lead => {
  const statusMatch = filtroStatus === 'todos' || lead.status === filtroStatus
  const ferramentaMatch = filtroFerramenta === 'todas' || lead.ferramenta === filtroFerramenta
  const buscaMatch = busca === '' || 
    lead.nome.toLowerCase().includes(busca.toLowerCase()) ||
    lead.email.toLowerCase().includes(busca.toLowerCase()) ||
    lead.cidade.toLowerCase().includes(busca.toLowerCase())
  
  return statusMatch && ferramentaMatch && buscaMatch // TODOS devem ser verdadeiros
})
```

**Você pode combinar:**
- Buscar "maria" + Filtrar por "novo" + Filtrar por "Quiz Interativo"
- Resultado: Apenas leads chamadas "Maria" que são novos e vieram do Quiz

---

## 🚀 2. DE ONDE VÊM OS LEADS? (FLUXO COMPLETO)

### 📥 **Fontes de Leads**

Os leads são criados automaticamente quando alguém:

#### 1. **Responde um Quiz**
```
Pessoa acessa → seu-dominio.com/q/seu-quiz
                ↓
        Responde as perguntas
                ↓
        Fornece nome, email, telefone
                ↓
    Lead é CRIADO AUTOMATICAMENTE na tabela "leads"
                ↓
    Aparece na sua área de Leads ✅
```

**Código:** `/api/quiz/resposta` → Cria lead ao salvar resposta

---

#### 2. **Usa uma Calculadora (IMC, Água, etc.)**
```
Pessoa acessa → Calculadora de IMC
                ↓
        Calcula seu IMC
                ↓
        Fornece email para receber resultado
                ↓
    Lead é CRIADO AUTOMATICAMENTE
                ↓
    Aparece na sua área de Leads ✅
```

**Código:** `/api/templates/[templateId]/submit` → Cria lead ao usar calculadora

---

#### 3. **Preenche um Formulário**
```
Pessoa acessa → Formulário de avaliação
                ↓
        Responde perguntas
                ↓
        Fornece dados de contato
                ↓
    Lead é CRIADO AUTOMATICAMENTE
                ↓
    Aparece na sua área de Leads ✅
```

**Código:** `/api/public/formularios/[formId]/respostas` → Cria lead ao responder

---

#### 4. **Acessa um Portal/Landing Page**
```
Pessoa acessa → Portal "Emagreça Agora"
                ↓
        Baixa material gratuito
                ↓
        Fornece email
                ↓
    Lead é CRIADO AUTOMATICAMENTE
                ↓
    Aparece na sua área de Leads ✅
```

**Código:** `/api/portals/[portalId]/lead` → Cria lead ao capturar

---

### 📊 **Estrutura do Lead no Banco de Dados**

Quando um lead é criado, é salvo na tabela `leads` com:

```typescript
{
  id: 'uuid-gerado-automaticamente',
  user_id: 'seu-id-nutricionista',
  name: 'Nome do Lead',
  email: 'lead@email.com',
  phone: '11999999999',
  additional_data: {
    idade: 28,
    cidade: 'São Paulo',
    ferramenta: 'Quiz Interativo',
    resultado: 'Metabolismo Rápido',
    status: 'novo',
    score: 85,
    observacoes: 'Interessada em emagrecimento'
  },
  template_id: 'id-do-quiz-ou-calculadora',
  created_at: '2025-12-18T21:00:00',
  converted_to_client: false
}
```

---

### 🎯 **Mapeamento para Exibição**

Quando a página de Leads carrega, ela transforma os dados do banco:

```typescript
const leadsMapeados = data.data.leads.map((l: any) => ({
  id: l.id,                                              // ID do lead
  nome: l.name,                                          // Nome fornecido
  email: l.email,                                        // Email fornecido
  telefone: l.phone,                                     // Telefone fornecido
  idade: l.additional_data?.idade || null,              // Idade (se fornecida)
  cidade: l.additional_data?.cidade || '-',             // Cidade (se fornecida)
  ferramenta: l.additional_data?.ferramenta || l.template_id || 'Ferramenta',  // Qual ferramenta usou
  resultado: l.additional_data?.resultado || '-',       // Resultado do quiz/calculadora
  status: l.additional_data?.status || 'novo',          // Status (novo, contatado, etc.)
  data: new Date(l.created_at).toISOString().slice(0, 10),  // Data que virou lead
  ultimoContato: l.additional_data?.ultimo_contato || null,  // Última vez que você contatou
  observacoes: l.additional_data?.observacoes || '',    // Suas anotações
  score: l.additional_data?.score || 0,                 // Score de qualificação
  leadOriginal: l                                        // Lead original para conversão
}))
```

---

## 🔔 3. SISTEMA DE ALERTAS

### ⚠️ **Leads Parados (Precisam Atenção)**

```typescript
const leadPrecisaAtencao = (lead: any) => {
  const diasParado = calcularDiasParado(lead)
  return diasParado >= diasAlerta && lead.status !== 'convertido'
}
```

**Como funciona:**
1. Sistema calcula quantos dias o lead está sem contato
2. Se passou X dias (configurável: 1, 2, 3, 5 ou 7) E ainda não foi convertido
3. Lead aparece no alerta laranja no topo da página
4. Você pode clicar em "Converter" direto do alerta

**Exemplo:**
- Lead "Maria Silva" criado há 5 dias
- Você configurou alertas para 3 dias
- Status ainda é "novo"
- **ALERTA:** "Maria Silva - 5 dias sem contato" ⚠️

---

## 🔄 4. CONVERTER LEAD EM CLIENTE

### 📝 **Processo de Conversão**

```
1. Você clica em "Converter em Cliente"
   ↓
2. Modal abre com opções:
   - Status inicial (Contato, Pré-Consulta, Ativa)
   - Criar avaliação inicial? (sim/não)
   ↓
3. Você confirma
   ↓
4. Sistema chama API: /api/nutri/leads/{leadId}/convert-to-client
   ↓
5. API faz:
   - Cria registro na tabela "clients"
   - Copia dados do lead (nome, email, telefone)
   - Define status inicial
   - Se marcou "criar avaliação", cria avaliação em rascunho
   - Marca lead como convertido (converted_to_client = true)
   ↓
6. Lead sai da lista de Leads
   ↓
7. Cliente aparece na lista de Clientes ✅
   ↓
8. Você é redirecionado para o perfil do novo cliente
```

**Código:**
```typescript
const converterLead = async () => {
  const response = await fetch(`/api/nutri/leads/${leadId}/convert-to-client`, {
    method: 'POST',
    body: JSON.stringify({
      status: statusInicial,
      create_initial_assessment: criarAvaliacaoInicial
    })
  })
  
  if (response.ok) {
    // Lead virou cliente!
    router.push(`/pt/nutri/clientes/${clienteId}`)
  }
}
```

---

## 📊 5. ESTATÍSTICAS NA PÁGINA

### **4 Cards no Topo**

```typescript
// Total de Leads
leads.length

// Novos (não contatados)
leads.filter(l => l.status === 'novo').length

// Contatados (já entrou em contato)
leads.filter(l => l.status === 'contatado').length

// Convertidos (viraram clientes)
leads.filter(l => l.status === 'convertido').length
```

---

## 🎨 6. CORES E BADGES

### **Status Colors**
```typescript
novo: 'bg-blue-100 text-blue-800'          // Azul
contatado: 'bg-yellow-100 text-yellow-800' // Amarelo
convertido: 'bg-green-100 text-green-800'  // Verde
perdido: 'bg-red-100 text-red-800'         // Vermelho
```

### **Score Colors**
```typescript
score >= 90: 'bg-green-100 text-green-800'  // Verde (lead quente)
score >= 80: 'bg-blue-100 text-blue-800'    // Azul (bom)
score >= 70: 'bg-yellow-100 text-yellow-800' // Amarelo (médio)
score < 70:  'bg-red-100 text-red-800'      // Vermelho (frio)
```

---

## 🧪 7. TESTE O SISTEMA DE LEADS

### **Para testar completo, você precisa:**

#### 1. **Criar um Lead de Teste**

**Opção A: Via Quiz**
```
1. Acesse: /pt/nutri/ferramentas/templates
2. Crie um quiz simples
3. Publique o quiz
4. Acesse o link público do quiz
5. Responda o quiz com dados de teste
6. Volte para /pt/nutri/leads
7. Lead deve aparecer! ✅
```

**Opção B: Via API (desenvolvimento)**
```sql
-- Inserir lead de teste no Supabase
INSERT INTO leads (
  user_id,
  name,
  email,
  phone,
  additional_data,
  template_id,
  created_at
) VALUES (
  'seu-user-id',
  'Maria Teste',
  'maria.teste@email.com',
  '11999999999',
  '{
    "idade": 28,
    "cidade": "São Paulo",
    "ferramenta": "Quiz Interativo",
    "resultado": "Metabolismo Rápido",
    "status": "novo",
    "score": 85
  }'::jsonb,
  null,
  NOW()
);
```

#### 2. **Testar Busca**
- [ ] Buscar por "maria" → Deve encontrar
- [ ] Buscar por "teste@email" → Deve encontrar
- [ ] Buscar por "paulo" → Deve encontrar (São Paulo)

#### 3. **Testar Filtros**
- [ ] Filtrar por "novo" → Deve aparecer
- [ ] Filtrar por "convertido" → Não deve aparecer
- [ ] Filtrar por "Quiz Interativo" → Deve aparecer

#### 4. **Testar Conversão**
- [ ] Clicar em "Converter em Cliente"
- [ ] Escolher status "Pré-Consulta"
- [ ] Marcar "Criar avaliação inicial"
- [ ] Confirmar
- [ ] Lead deve sumir da lista
- [ ] Cliente deve aparecer em /pt/nutri/clientes

---

## 🐛 8. PROBLEMAS COMUNS

### **Leads não aparecem?**

**Possíveis causas:**
1. ❌ Nenhum lead foi criado ainda
2. ❌ Filtros muito restritivos
3. ❌ Leads são de outro usuário
4. ❌ Erro na API (ver console)

**Soluções:**
1. ✅ Criar lead de teste via quiz
2. ✅ Resetar filtros para "Todos"
3. ✅ Verificar se user_id está correto
4. ✅ Abrir console do navegador (F12)

---

### **Busca não funciona?**

**Verificar:**
- Busca é case-insensitive (não diferencia maiúsculas)
- Busca em nome, email E cidade
- Busca é parcial (não precisa ser exata)

---

### **Conversão falha?**

**Possíveis causas:**
1. ❌ Lead já foi convertido
2. ❌ Erro na API
3. ❌ Campos obrigatórios faltando

**Soluções:**
1. ✅ Verificar se lead tem flag `converted_to_client = false`
2. ✅ Ver erro no console
3. ✅ Lead deve ter pelo menos nome

---

## 📝 9. RESUMO RÁPIDO

### **Como Leads Aparecem:**
1. Pessoa usa suas ferramentas (quiz, calculadora, formulário)
2. Fornece dados de contato
3. Lead é criado automaticamente
4. Aparece na sua área de Leads

### **Como Buscar/Filtrar:**
1. Digite no campo "Buscar" → busca nome, email, cidade
2. Selecione "Status" → filtra por status
3. Selecione "Ferramenta" → filtra por origem
4. Combine os 3 para busca precisa

### **Como Converter:**
1. Clique em "Converter em Cliente"
2. Escolha status inicial
3. Opcionalmente crie avaliação
4. Confirme
5. Lead vira cliente!

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [ ] Área de Leads carrega sem erro
- [ ] Estatísticas aparecem (Total, Novos, Contatados, Convertidos)
- [ ] Busca funciona (digitar nome/email/cidade)
- [ ] Filtro de Status funciona
- [ ] Filtro de Ferramenta funciona
- [ ] Alertas de leads parados aparecem (se tiver leads antigos)
- [ ] Botão "Converter em Cliente" funciona
- [ ] Modal de conversão abre
- [ ] Conversão cria cliente
- [ ] Lead convertido sai da lista
- [ ] Cliente aparece em /pt/nutri/clientes

---

**Última atualização:** 18 de Dezembro de 2025  
**Baseado em:** Análise do código `/pt/nutri/leads/page.tsx`

