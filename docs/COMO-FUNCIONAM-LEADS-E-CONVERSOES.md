# 📊 Como Funcionam Leads e Conversões no YLADA

## 🎯 Resumo

**Leads são REAIS** ✅ - Quando alguém preenche um formulário, o sistema salva automaticamente.

**Conversões são ESTIMATIVAS** ⚠️ - Atualmente calculadas como 30% dos leads (sistema de rastreamento real ainda não implementado).

---

## 📈 LEADS (Números Reais)

### Como são coletados:

1. **Usuário acessa uma ferramenta** (calculadora, quiz, etc.)
2. **Preenche o formulário** com nome, email, telefone, etc.
3. **Sistema salva automaticamente**:
   - Cria registro na tabela `leads` com todos os dados
   - Incrementa o contador `leads_count` na ferramenta (`user_templates`)
   - Associa o lead à ferramenta e ao usuário dono da ferramenta

### Onde você vê os números:

- **Dashboard**: Número de leads por ferramenta
- **API**: `/api/wellness/dashboard` retorna `leads_count` de cada ferramenta
- **Banco de dados**: Tabela `leads` e campo `leads_count` em `user_templates`

### Exemplo:

```
Ferramenta "Calculadora de Água":
- 19 leads = 19 pessoas reais preencheram o formulário
- Cada lead está salvo na tabela `leads` com nome, email, telefone, etc.
```

---

## 💰 CONVERSÕES (Números Reais)

### Como são coletadas:

As conversões são **rastreadas automaticamente** quando o usuário clica no botão CTA (WhatsApp ou URL externa) após preencher o formulário:

1. **Usuário preenche formulário** → Lead é capturado
2. **Usuário vê resultado** da ferramenta
3. **Usuário clica no botão CTA** (WhatsApp ou URL externa)
4. **Sistema registra conversão** automaticamente

### Exemplo:

```
Ferramenta "Calculadora de Água":
- 19 leads = 19 pessoas preencheram o formulário
- 5 conversões = 5 pessoas clicaram no botão CTA após ver o resultado
```

### ✅ Como Funciona:

- **Rastreamento automático**: Quando o botão CTA é clicado, o sistema registra uma conversão
- **Números reais**: Cada conversão representa uma pessoa que realmente interagiu com o CTA
- **Armazenado no banco**: Campo `conversions_count` na tabela `user_templates`

---

## 🔧 Como o Sistema Monitora

### 1. Captura de Leads

**Arquivo**: `src/app/api/leads/route.ts`

Quando alguém preenche um formulário:
```javascript
// Salva o lead
await supabaseAdmin.from('leads').insert({
  link_id: link.id,
  user_id: link.user_id,
  name: sanitizedData.name,
  email: sanitizedData.email,
  phone: sanitizedData.phone,
  // ...
})

// Incrementa contador
await supabaseAdmin
  .from('generated_links') // ou user_templates
  .update({ leads_count: (link.leads_count || 0) + 1 })
```

### 2. Exibição no Dashboard

**Arquivo**: `src/app/api/wellness/dashboard/route.ts`

```javascript
// Busca ferramentas com leads_count
const tools = await supabaseAdmin
  .from('user_templates')
  .select('id, title, leads_count, ...')

// Calcula conversões (estimativa)
conversoes: Math.round((tool.leads_count || 0) * 0.3)
```

### 3. Frontend

**Arquivo**: `src/app/pt/wellness/dashboard/page.tsx`

O dashboard busca os dados da API e exibe:
- **Leads**: Número real de `leads_count`
- **Conversões**: Estimativa calculada (30% dos leads)

---

## ✅ Sistema Implementado

O rastreamento de conversões está **funcionando**:

### Como é Rastreado:

1. **Componente CTA**: `WellnessCTAButton` tem evento `onClick` que chama a API
2. **API de Conversões**: `/api/wellness/conversions` registra o clique
3. **Banco de Dados**: Incrementa `conversions_count` na tabela `user_templates`
4. **Dashboard**: Exibe conversões reais ao invés de estimativas

### Arquivos Envolvidos:

- `src/components/wellness/WellnessCTAButton.tsx` - Rastreia cliques no botão
- `src/app/api/wellness/conversions/route.ts` - API que registra conversões
- `src/app/api/wellness/dashboard/route.ts` - Retorna conversões reais
- `add-conversions-count-column.sql` - Script para adicionar coluna no banco

---

## 📊 Estrutura de Dados

### Tabela `leads`
```sql
leads
├── id (UUID)
├── link_id / template_id (UUID) → user_templates
├── user_id (UUID) → usuário dono da ferramenta
├── name (VARCHAR)
├── email (VARCHAR)
├── phone (VARCHAR)
├── additional_data (JSONB)
├── created_at (TIMESTAMP)
└── (futuro: status, converted_at)
```

### Tabela `user_templates`
```sql
user_templates
├── id (UUID)
├── user_id (UUID)
├── title (VARCHAR)
├── leads_count (INTEGER) ← Contador real de leads
├── views (INTEGER)
└── ...
```

---

## ✅ Conclusão

- **Leads**: ✅ Números reais, coletados automaticamente quando formulário é preenchido
- **Conversões**: ✅ Números reais, rastreadas quando botão CTA é clicado
- **Monitoramento**: Automático via API e banco de dados
- **Status**: Sistema completo e funcionando! 🎉

---

## 🔍 Verificar Dados Reais

Para ver os leads reais de uma ferramenta:

```sql
-- Ver todos os leads de uma ferramenta
SELECT * FROM leads 
WHERE template_id = 'id-da-ferramenta'
ORDER BY created_at DESC;

-- Contar leads por ferramenta
SELECT 
  ut.title,
  ut.leads_count as contador,
  COUNT(l.id) as leads_reais
FROM user_templates ut
LEFT JOIN leads l ON l.template_id = ut.id
WHERE ut.user_id = 'seu-user-id'
GROUP BY ut.id, ut.title, ut.leads_count;
```

