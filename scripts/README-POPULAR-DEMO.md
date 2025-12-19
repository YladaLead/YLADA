## 📦 Popular Conta Demo com Casos de Teste

**Objetivo:** Criar clientes fictícias com perfis diversos para testar o sistema de Gestão de Clientes.

---

## 🎯 8 Casos Criados

### 1️⃣ **Ana Silva** - Emagrecimento (ATIVA)
- **Objetivo:** Perder 10kg para casamento
- **Status:** Cliente há 2 meses
- **Evolução:** -5.7kg (78.5kg → 72.8kg)
- **Perfil:** Muito comprometida, alta adesão
- **Tags:** `emagrecimento`, `evento-importante`, `alta-adesao`

### 2️⃣ **Mariana Costa** - Hipertrofia (ATIVA)
- **Objetivo:** Ganhar 5kg de massa muscular
- **Status:** Cliente há 4 meses
- **Evolução:** +4.1kg sendo 3.9kg massa magra
- **Perfil:** Atleta, treina 6x/semana, competição
- **Tags:** `hipertrofia`, `atleta`, `musculacao`

### 3️⃣ **Júlia Mendes** - Diabetes (ATIVA)
- **Objetivo:** Controlar diabetes tipo 2
- **Status:** Cliente há 3 meses
- **Evolução:** Glicemia 145 → 108mg/dL (médico reduziu medicação!)
- **Perfil:** Melhorando muito, controlando alimentação
- **Tags:** `diabetes`, `emagrecimento`, `cronico`

### 4️⃣ **Camila Oliveira** - Vegetariana (ATIVA)
- **Objetivo:** Corrigir anemia ferropriva
- **Status:** Cliente há 1 mês
- **Evolução:** Iniciando suplementação, ganhando energia
- **Perfil:** Vegetariana estrita, precisa balancear nutrição
- **Tags:** `vegetariana`, `anemia`, `deficiencia-nutricional`

### 5️⃣ **Patricia Santos** - Compulsão Alimentar (PAUSA)
- **Objetivo:** Controlar compulsão noturna
- **Status:** Pausado (iniciou terapia)
- **Evolução:** Perdeu 4.7kg antes da pausa
- **Perfil:** Caso complexo, trabalho nutri + psicólogo
- **Tags:** `compulsao-alimentar`, `obesidade`, `terapia`

### 6️⃣ **Fernanda Lima** - Gestante (ATIVA)
- **Objetivo:** Gestação saudável, controlar peso
- **Status:** Cliente há 2 meses (20 semanas de gestação)
- **Evolução:** Ganho excessivo inicial, agora controlado
- **Perfil:** Primeira gestação, prevenindo diabetes gestacional
- **Tags:** `gestante`, `ganho-peso-excessivo`, `prevencao-diabetes`

### 7️⃣ **Beatriz Souza** - Lead (PRÉ-CONSULTA)
- **Objetivo:** Emagrecer e melhorar relação com comida
- **Status:** Primeira consulta agendada (próxima semana)
- **Origem:** Quiz de emagrecimento (lead convertida)
- **Perfil:** Lead qualificada, interessada
- **Tags:** `lead`, `quiz`, `emagrecimento`

### 8️⃣ **Larissa Rodrigues** - Caso de Sucesso (FINALIZADA) 🎉
- **Objetivo:** Perder 12kg
- **Status:** Finalizada (objetivo atingido!)
- **Evolução:** -13.5kg em 6 meses (78kg → 64.5kg)
- **Perfil:** SUCESSO! Manteve peso, finalizou acompanhamento
- **Tags:** `sucesso`, `objetivo-atingido`, `emagrecimento`

---

## 🚀 Como Executar

### **Opção 1: Script Simples (Recomendado)**

Use: `popular-demo-SUPABASE.sql`

#### Passo 1: Descubra seu `user_id`

```sql
-- Cole no Supabase SQL Editor:
SELECT id, email FROM auth.users LIMIT 5;
```

Copie o **UUID** (id) do seu usuário.

#### Passo 2: Substitua no script

1. Abra o arquivo: `scripts/popular-demo-SUPABASE.sql`
2. Procure por: `'SEU-USER-ID-AQUI'` (aparece 8 vezes)
3. Substitua TODAS as ocorrências pelo seu UUID
4. Exemplo:
   ```sql
   -- ANTES:
   'SEU-USER-ID-AQUI'::uuid
   
   -- DEPOIS:
   '550e8400-e29b-41d4-a716-446655440000'::uuid
   ```

#### Passo 3: Execute no Supabase

1. Acesse: Supabase Dashboard → SQL Editor
2. Cole o script COMPLETO (com substituições)
3. Clique em **RUN**
4. Aguarde: "✅ CONTA DEMO POPULADA COM SUCESSO!"

---

### **Opção 2: Script Completo**

Use: `popular-conta-demo-casos-teste.sql`

Este script tem mais detalhes mas é mais complexo. Cria também:
- Histórico emocional/comportamental completo
- Programas alimentares ativos
- Múltiplas medições de evolução

**Requer:** Ajustes no código (variáveis temporárias).

---

## ✅ Verificação Pós-Execução

### Ver clientes criadas:

```sql
SELECT 
  name, 
  status, 
  goal, 
  client_since
FROM clients
WHERE email LIKE '%.demo@email.com'
ORDER BY client_since DESC;
```

### Ver evolução física:

```sql
SELECT 
  c.name,
  ce.measurement_date::date,
  ce.weight,
  ce.notes
FROM client_evolution ce
JOIN clients c ON c.id = ce.client_id
WHERE c.email LIKE '%.demo@email.com'
ORDER BY c.name, ce.measurement_date;
```

### Resumo por status:

```sql
SELECT 
  status,
  COUNT(*) as total
FROM clients
WHERE email LIKE '%.demo@email.com'
GROUP BY status;
```

**Resultado esperado:**
- `ativa`: 5
- `pausa`: 1
- `pre_consulta`: 1
- `finalizada`: 1
- **TOTAL**: 8 clientes

---

## 🧹 Limpar Dados Demo

Se quiser apagar todas as clientes demo:

```sql
-- ⚠️ CUIDADO: Apaga TODAS as clientes demo!
DELETE FROM clients 
WHERE email LIKE '%.demo@email.com';
```

Isso também apaga automaticamente (CASCADE):
- Evolução física
- Histórico emocional
- Programas
- Consultas

---

## 📊 Casos de Uso

Use esses dados para:

### ✅ Testar Interfaces
- Lista de clientes com filtros (status, tags)
- Perfil completo da cliente
- Evolução física (gráficos)
- Timeline de eventos

### ✅ Demonstrar Sistema
- Para clientes em reuniões
- Para treinamento de equipe
- Para apresentações

### ✅ Validar Funcionalidades
- Criar nova consulta
- Adicionar medição
- Mudar status
- Adicionar notas

### ✅ Testar Casos Diversos
- Cliente ativa e motivada (Ana)
- Atleta avançada (Mariana)
- Condição crônica (Júlia - diabetes)
- Restrição alimentar (Camila - vegetariana)
- Caso complexo (Patricia - compulsão)
- Situação especial (Fernanda - gestante)
- Lead nova (Beatriz)
- Caso de sucesso (Larissa)

---

## 🎨 Personalização

### Adicionar mais campos:

Edite o script e adicione:
- `notes` (observações extras)
- `tags` (mais tags personalizadas)
- `custom_fields` (campos JSONB customizados)
- Mais medições em `client_evolution`

### Criar variações:

Duplique um dos casos e altere:
- Objetivo (ex: ganho de peso, performance esportiva)
- Status (ex: mais clientes em pausa)
- Evolução (ex: evolução negativa, estagnação)

---

## ⚠️ Observações Importantes

1. **Dados Fictícios:** Todos os dados são inventados
   - Nomes: Fictícios
   - Emails: `.demo@email.com`
   - Telefones: Começam com `119` (fictícios)
   - Endereços: Apenas cidades reais

2. **Não Usar em Produção:** 
   - Esses dados são para TESTE
   - Use em ambiente de desenvolvimento
   - Ou crie uma conta separada de "demo"

3. **Limpar Após Testes:**
   - Execute o DELETE ao finalizar
   - Ou mantenha para demonstrações

4. **RLS (Row Level Security):**
   - As clientes só aparecem para o `user_id` que criou
   - Outros usuários não verão esses dados

---

## 🆘 Troubleshooting

### Erro: "Duplicate key value"
**Causa:** Script executado 2x  
**Solução:** Limpe dados demo e execute novamente

### Erro: "Foreign key violation"
**Causa:** `user_id` não existe  
**Solução:** Verifique se copiou o UUID correto

### Erro: "Invalid input syntax for type uuid"
**Causa:** Esqueceu de substituir `'SEU-USER-ID-AQUI'`  
**Solução:** Substitua TODOS os placeholders

### Clientes não aparecem no frontend
**Causa:** RLS está ativo  
**Solução:** Confirme que está logado com o mesmo usuário

---

## 📁 Arquivos

- `popular-demo-SUPABASE.sql` - **Principal (use este!)**
- `popular-demo-SIMPLES.sql` - Versão psql (terminal)
- `popular-conta-demo-casos-teste.sql` - Versão completa com DO block
- `README-POPULAR-DEMO.md` - Este arquivo

---

**Criado em:** 2025-12-18  
**Versão:** 1.0  
**Compatível com:** Supabase PostgreSQL 15+

