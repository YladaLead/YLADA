# 📋 PLANO DE IMPLEMENTAÇÃO - CLIENTES, PV E EVOLUÇÃO

**Data:** Janeiro 2025  
**Fase:** 1 - Clientes, PV e Evolução

---

## ✅ O QUE JÁ EXISTE

### Banco de Dados
- ✅ Tabela `wellness_client_profiles` (campos básicos)
- ✅ Tabela `wellness_consultant_interactions`
- ✅ Tipos TypeScript (`WellnessClientProfile`)

### Páginas
- ❌ Não existe `/pt/wellness/clientes`
- ❌ Não existe `/pt/wellness/evolucao`

---

## 🚧 O QUE PRECISA SER CRIADO

### 1. **BANCO DE DADOS**

#### 1.1. Tabela de Produtos (com PV)
```sql
CREATE TABLE wellness_produtos (
  id UUID PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(50), -- 'bebida_funcional', 'produto_fechado', 'kit'
  tipo VARCHAR(50), -- 'energia', 'acelera', 'turbo', 'hype', 'shake', 'fiber', 'cha', etc.
  pv NUMERIC(10,2) NOT NULL, -- Pontos de Volume
  preco NUMERIC(10,2),
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### 1.2. Tabela de Compras
```sql
CREATE TABLE wellness_client_purchases (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES wellness_client_profiles(id),
  produto_id UUID REFERENCES wellness_produtos(id),
  quantidade INTEGER DEFAULT 1,
  pv_total NUMERIC(10,2), -- PV gerado nesta compra
  data_compra DATE NOT NULL,
  previsao_recompra DATE, -- data_compra + 30 dias (ou outro período)
  observacoes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### 1.3. Adicionar campos em `wellness_client_profiles`
```sql
ALTER TABLE wellness_client_profiles
ADD COLUMN IF NOT EXISTS produto_atual_id UUID REFERENCES wellness_produtos(id),
ADD COLUMN IF NOT EXISTS ultima_compra_id UUID REFERENCES wellness_client_purchases(id),
ADD COLUMN IF NOT EXISTS pv_total_cliente NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS pv_mensal NUMERIC(10,2) DEFAULT 0;
```

#### 1.4. Tabela de PV Mensal do Consultor
```sql
CREATE TABLE wellness_consultant_pv_monthly (
  id UUID PRIMARY KEY,
  consultant_id UUID REFERENCES auth.users(id),
  mes_ano VARCHAR(7) NOT NULL, -- '2025-01'
  pv_total NUMERIC(10,2) DEFAULT 0,
  pv_kits NUMERIC(10,2) DEFAULT 0,
  pv_produtos_fechados NUMERIC(10,2) DEFAULT 0,
  meta_pv NUMERIC(10,2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(consultant_id, mes_ano)
);
```

---

### 2. **APIS**

#### 2.1. `/api/wellness/clientes` (GET, POST)
- Listar clientes do consultor
- Criar novo cliente

#### 2.2. `/api/wellness/clientes/[id]` (GET, PUT, DELETE)
- Ver detalhes do cliente
- Atualizar cliente
- Deletar cliente

#### 2.3. `/api/wellness/clientes/[id]/compras` (GET, POST)
- Listar compras do cliente
- Registrar nova compra

#### 2.4. `/api/wellness/produtos` (GET)
- Listar produtos disponíveis
- Buscar por categoria/tipo

#### 2.5. `/api/wellness/pv/calcular` (POST)
- Calcular PV de uma compra
- Atualizar PV mensal do consultor

#### 2.6. `/api/wellness/pv/mensal` (GET)
- Obter PV mensal do consultor
- Histórico de PV

#### 2.7. `/api/wellness/evolucao` (GET)
- Dashboard de evolução
- Gráficos e métricas

#### 2.8. `/api/wellness/recompra/alertas` (GET)
- Clientes próximos de recompra
- Alertas do NOEL

---

### 3. **PÁGINAS**

#### 3.1. `/pt/wellness/clientes` (Lista)
- Cards de clientes
- Filtros (status, objetivo, produto)
- Busca
- Botão "Novo Cliente"

#### 3.2. `/pt/wellness/clientes/novo` (Cadastro)
- Formulário de cadastro
- Campos: nome, contato, objetivo, tipo_pessoa
- Salvar e redirecionar

#### 3.3. `/pt/wellness/clientes/[id]` (Detalhes)
- Abas:
  - Informações
  - Compras
  - Histórico
  - PV Gerado
- Botões: Editar, Nova Compra, Ver Evolução

#### 3.4. `/pt/wellness/evolucao` (Dashboard)
- Gráfico de PV mensal
- Meta vs Realizado
- Lista de clientes (top 10 por PV)
- Alertas de recompra
- Progresso de carreira

---

### 4. **COMPONENTES**

#### 4.1. `ClientCard.tsx`
- Card com informações do cliente
- Status, objetivo, PV, próxima recompra

#### 4.2. `ClientPurchaseForm.tsx`
- Formulário de registro de compra
- Seleção de produto
- Cálculo automático de PV

#### 4.3. `PVChart.tsx`
- Gráfico de PV mensal
- Usar Chart.js ou Recharts

#### 4.4. `RecompraAlert.tsx`
- Card de alerta de recompra
- Lista de clientes próximos

---

### 5. **ALGORITMOS**

#### 5.1. Cálculo de PV
- Função que recebe produto_id e quantidade
- Retorna PV total
- Atualiza PV do cliente e do consultor

#### 5.2. Cálculo de Recompra
- Data da última compra + 30 dias
- Alertar 7 dias antes
- Alertar 3 dias antes
- Alertar no dia

#### 5.3. PV Mensal do Consultor
- Soma todas as compras do mês
- Agrupa por cliente
- Calcula total

#### 5.4. Alertas do NOEL
- Quando PV está baixo
- Quando cliente está próximo de recompra
- Sugestões de estratégia

---

## 📊 ORDEM DE IMPLEMENTAÇÃO

### Fase 1: Banco de Dados (1-2 horas)
1. Criar tabela `wellness_produtos`
2. Criar tabela `wellness_client_purchases`
3. Adicionar campos em `wellness_client_profiles`
4. Criar tabela `wellness_consultant_pv_monthly`
5. Popular tabela `wellness_produtos` com produtos iniciais

### Fase 2: APIs (2-3 horas)
1. `/api/wellness/clientes` (GET, POST)
2. `/api/wellness/clientes/[id]` (GET, PUT)
3. `/api/wellness/clientes/[id]/compras` (GET, POST)
4. `/api/wellness/produtos` (GET)
5. `/api/wellness/pv/calcular` (POST)
6. `/api/wellness/pv/mensal` (GET)

### Fase 3: Páginas (3-4 horas)
1. `/pt/wellness/clientes` (lista)
2. `/pt/wellness/clientes/novo` (cadastro)
3. `/pt/wellness/clientes/[id]` (detalhes)
4. `/pt/wellness/evolucao` (dashboard)

### Fase 4: Componentes (2-3 horas)
1. `ClientCard.tsx`
2. `ClientPurchaseForm.tsx`
3. `PVChart.tsx`
4. `RecompraAlert.tsx`

### Fase 5: Algoritmos e Integração (2-3 horas)
1. Cálculo de PV
2. Cálculo de recompra
3. Alertas do NOEL
4. Integração com dashboard

---

## 🎯 TOTAL ESTIMADO: 10-15 horas

---

## ✅ CHECKLIST

### Banco de Dados
- [ ] Tabela `wellness_produtos` criada
- [ ] Tabela `wellness_client_purchases` criada
- [ ] Campos adicionados em `wellness_client_profiles`
- [ ] Tabela `wellness_consultant_pv_monthly` criada
- [ ] Produtos iniciais inseridos

### APIs
- [ ] GET/POST `/api/wellness/clientes`
- [ ] GET/PUT `/api/wellness/clientes/[id]`
- [ ] GET/POST `/api/wellness/clientes/[id]/compras`
- [ ] GET `/api/wellness/produtos`
- [ ] POST `/api/wellness/pv/calcular`
- [ ] GET `/api/wellness/pv/mensal`

### Páginas
- [ ] `/pt/wellness/clientes` (lista)
- [ ] `/pt/wellness/clientes/novo` (cadastro)
- [ ] `/pt/wellness/clientes/[id]` (detalhes)
- [ ] `/pt/wellness/evolucao` (dashboard)

### Componentes
- [ ] `ClientCard.tsx`
- [ ] `ClientPurchaseForm.tsx`
- [ ] `PVChart.tsx`
- [ ] `RecompraAlert.tsx`

### Algoritmos
- [ ] Cálculo de PV
- [ ] Cálculo de recompra
- [ ] Alertas do NOEL

---

## 🚀 PRÓXIMA AÇÃO

**Começar pela Fase 1: Banco de Dados**





