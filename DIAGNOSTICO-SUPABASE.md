# 🔍 Diagnóstico da Jornada no Supabase

## O que preciso ver:

### 1. **Execute o script SQL**
Execute o arquivo `scripts/diagnostico-jornada-supabase.sql` no Supabase SQL Editor e me envie os resultados.

### 2. **Ou me envie estas informações manualmente:**

#### A) **Estrutura da Tabela**
- Vá em **Table Editor** → `journey_days`
- Me diga: a tabela existe? Quantas linhas tem?

#### B) **Dados na Tabela**
- Execute esta query simples:
```sql
SELECT COUNT(*) FROM journey_days;
SELECT * FROM journey_days LIMIT 5;
```

#### C) **Políticas RLS (Row Level Security)**
- Vá em **Authentication** → **Policies**
- Procure por políticas na tabela `journey_days`
- Me diga: há políticas? Quais são?

#### D) **Histórico de Migrations**
- Vá em **SQL Editor** → **History**
- Procure por execuções relacionadas a `journey_days` ou `populate-jornada`
- Me diga: quando foi a última vez que executou a migration?

#### E) **Logs do Supabase**
- Vá em **Logs** → **Postgres Logs** (se disponível)
- Procure por erros relacionados a `journey_days`
- Me envie qualquer erro encontrado

### 3. **Informações do Projeto**
- **URL do Supabase**: (se puder compartilhar)
- **Plano do Supabase**: (Free, Pro, etc.)
- **Quando foi a última vez que funcionou**: Ontem às 17h-18h

---

## Possíveis Causas:

1. **Tabela vazia** - Dados foram apagados acidentalmente
2. **RLS bloqueando** - Políticas de segurança impedindo leitura
3. **Problema de conexão** - API não conseguindo acessar o Supabase
4. **Migration não executada** - Dados nunca foram inseridos
5. **Schema diferente** - Tabela existe mas com estrutura diferente

---

## Próximos Passos:

Depois que eu tiver essas informações, vou:
1. Identificar a causa exata
2. Criar script de correção
3. Restaurar os dados se necessário
4. Ajustar RLS se for o problema

