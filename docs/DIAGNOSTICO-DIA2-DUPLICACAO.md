# 🔍 DIAGNÓSTICO - DIA 2 COM CONTEÚDO DUPLICADO

## 🚨 PROBLEMA IDENTIFICADO

O **Dia 2** está mostrando o **mesmo conteúdo do Dia 1** porque ambos apontam para o **Pilar 1 completo**.

### **Dia 1: Introdução à Filosofia YLADA**
- `action_type = 'pilar'`
- `action_id = NULL` → Padrão busca Pilar 1
- Mostra: **Pilar 1 completo** (Filosofia YLADA)

### **Dia 2: Identidade & Postura de Nutri-Empresária** ❌
- `action_type = 'pilar'` 
- `action_id = NULL` → Padrão busca Pilar 1 **NOVAMENTE**
- Mostra: **Pilar 1 completo** (mesmo conteúdo do Dia 1) ❌

## 📋 CONTEÚDO ATUAL DO DIA 2

### **No banco de dados (`populate-jornada-30-dias.sql`):**
```sql
objective = 'Definir sua identidade profissional e postura como Nutri-Empresária, não apenas como profissional técnica.'
guidance = 'A transformação começa na identidade. Hoje você vai trabalhar em como se vê e como quer ser vista...'
action_title = 'Acessar Pilar 1 - Seção: Identidade & Postura'
action_type = 'pilar'
action_id = NULL
```

### **No script atualizado (`08-atualizar-semana1-novo-formato.sql`):**
```sql
objective = 'Refletir sobre quem você é hoje como profissional e quem deseja se tornar como Nutri-Empresária...'
guidance = 'Hoje você vai olhar para si com mais consciência. Identidade não é sobre fingir ser algo...'
action_title = 'Observar sua postura profissional ao longo do dia, sem se julgar.'
action_type = 'pilar' (AINDA APONTA PARA PILAR)
```

## ✅ SOLUÇÃO

### **Opção 1: Remover referência ao Pilar (RECOMENDADO)**
- Mudar `action_type` de `'pilar'` para `'exercicio'` ou `NULL`
- Focar apenas em **reflexão** sobre identidade
- Não mostrar conteúdo externo, apenas as perguntas de reflexão

### **Opção 2: Criar conteúdo específico**
- Criar um exercício específico de "Identidade & Postura"
- Não usar o Pilar 1 completo

## 🔧 SCRIPT DE CORREÇÃO

Execute: `scripts/corrigir-dia2-identidade-postura.sql`

Este script:
1. ✅ Remove referência ao Pilar 1
2. ✅ Foca em reflexão sobre identidade
3. ✅ Mantém as 3 perguntas de reflexão coerentes com o tema
4. ✅ Garante que Dia 1 e Dia 2 tenham conteúdos diferentes

## 📊 COMPARAÇÃO

| Campo | Dia 1 | Dia 2 (ANTES) | Dia 2 (DEPOIS) |
|-------|-------|---------------|----------------|
| **Tema** | Filosofia YLADA | Identidade & Postura | Identidade & Postura |
| **action_type** | pilar | pilar ❌ | exercicio ✅ |
| **Conteúdo exibido** | Pilar 1 completo | Pilar 1 completo ❌ | Apenas reflexão ✅ |
| **Foco** | Conhecer método | Identidade própria | Identidade própria ✅ |

## ✅ RESULTADO ESPERADO

Após correção:
- ✅ Dia 1: Mostra Pilar 1 (Filosofia YLADA)
- ✅ Dia 2: Mostra apenas reflexão sobre identidade (SEM Pilar 1)
- ✅ Conteúdos diferentes e coerentes
- ✅ Dia 2 focado em "Identidade & Postura"

