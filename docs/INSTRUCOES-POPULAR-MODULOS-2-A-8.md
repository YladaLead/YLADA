# 📋 Instruções para Popular Módulos 2 a 8

## ✅ Ordem de Execução

### 1. PRIMEIRO: Executar Migration Principal
```sql
-- migrations/criar-tabelas-trilha-aprendizado-wellness.sql
```

### 2. SEGUNDO: Popular Módulo 1
```sql
-- scripts/popular-modulo-1-fundamentos.sql
```

### 3. TERCEIRO: Popular Módulos 2 a 8

Você tem duas opções:

#### **Opção A: Executar todos de uma vez (recomendado)**

Execute na ordem:

1. `scripts/popular-modulo-2-configuracao.sql`
2. `scripts/popular-modulo-3-ferramentas-atracao.sql`
3. `scripts/popular-modulo-4-diagnostico-wow.sql`
4. `scripts/popular-modulo-5-ofertas-fechamentos.sql`
5. `scripts/popular-modulo-6-gerar-clientes.sql`
6. `scripts/popular-modulo-7-atendimento-profissional.sql`
7. `scripts/popular-modulo-8-escala.sql`

#### **Opção B: Executar um por vez (para testar)**

Execute cada script individualmente e teste antes de passar para o próximo.

---

## 📦 O que será criado

### Módulo 2: Configuração Completa do Sistema
- **5 aulas** (55 minutos total)
- **8 checklists**
- **Ícone**: ⚙️

### Módulo 3: Ferramentas de Atração
- **5 aulas** (53 minutos total)
- **5 checklists**
- **Ícone**: 🎯

### Módulo 4: Diagnóstico WOW
- **5 aulas** (59 minutos total)
- **10 scripts prontos**
- **5 checklists**
- **Ícone**: ✨

### Módulo 5: Ofertas e Fechamentos
- **6 aulas** (60 minutos total)
- **10 scripts prontos**
- **6 checklists**
- **Ícone**: 💰

### Módulo 6: Como Gerar Clientes Todos os Dias
- **6 aulas** (53 minutos total)
- **10 scripts prontos**
- **7 checklists**
- **Ícone**: 📱

### Módulo 7: Atendimento Profissional
- **5 aulas** (53 minutos total)
- **8 scripts prontos**
- **8 checklists**
- **Ícone**: 💬

### Módulo 8: Escalando de Forma Simples
- **6 aulas** (58 minutos total)
- **7 scripts prontos**
- **6 checklists**
- **Ícone**: 🚀

---

## 🎯 Total da Trilha Completa

- **8 módulos**
- **43 aulas** (total: ~431 minutos = ~7 horas)
- **55 scripts prontos para copiar**
- **46 checklists**

---

## ✅ Verificar se funcionou

Após executar todos os scripts, use um dos scripts de validação:

### **Opção 1: Validação Rápida (recomendado)**

Execute no Supabase SQL Editor:

```sql
-- scripts/validar-trilha-rapido.sql
```

Este script mostra:
- Resumo geral (módulos, aulas, scripts, checklists)
- Lista de módulos com contagens
- Comparação entre esperado vs encontrado

### **Opção 2: Validação Completa (detalhada)**

Execute no Supabase SQL Editor:

```sql
-- scripts/validar-trilha-completa.sql
```

Este script mostra:
- ✅ Estatísticas gerais
- 📦 Detalhamento por módulo
- ✅ Verificação de módulos esperados
- 📚 Lista completa de todas as aulas
- 📊 Resumo final com duração total

### **Resultado Esperado:**

Você deve ver:
- ✅ **8 módulos** criados
- ✅ **43 aulas** no total
- ✅ **55 scripts** prontos
- ✅ **46 checklists**
- ✅ **~431 minutos** de conteúdo (~7 horas)

---

## 🚀 Próximos Passos

Após popular todos os módulos:

1. Acesse `/pt/wellness/cursos`
2. Veja a trilha "Distribuidor Iniciante"
3. Abra cada módulo e verifique se o conteúdo está aparecendo
4. Teste marcar aulas como concluídas
5. Teste os scripts copiáveis
6. Teste os checklists

---

## ⚠️ Observações

- Todos os scripts usam `ON CONFLICT DO NOTHING` para evitar duplicatas
- Se executar múltiplas vezes, não criará duplicatas
- Os scripts são idempotentes (podem ser executados várias vezes sem problemas)

