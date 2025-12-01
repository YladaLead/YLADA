# 📋 Instruções para Popular Módulo 1

## ✅ Passo a Passo

### 1. Executar Migration Principal
Primeiro, execute a migration que cria as tabelas:

```sql
-- No Supabase SQL Editor, execute:
-- migrations/criar-tabelas-trilha-aprendizado-wellness.sql
```

### 2. Popular Módulo 1
Depois, execute o script para popular o Módulo 1:

```sql
-- No Supabase SQL Editor, execute:
-- scripts/popular-modulo-1-fundamentos.sql
```

## 📦 O que será criado

### Módulo 1: Fundamentos do Wellness System
- **5 aulas** completas com todo o conteúdo
- **5 itens de checklist** para acompanhar o progresso
- **Ícone**: 📚
- **Ordem**: 1 (primeiro módulo)

### Aulas criadas:
1. **O que é o Wellness System** (10 min)
2. **Os 3 Pilares do Wellness System** (15 min)
3. **Como o Modelo Funciona na Prática** (12 min)
4. **Por que o Wellness System Converte Tanto** (10 min)
5. **Visão Geral das Ferramentas** (8 min)

### Checklists criados:
1. Entender o que é o Wellness System
2. Compreender os 3 pilares (Atração, Diagnóstico, Oferta)
3. Entender o fluxo completo
4. Saber por que o sistema converte tanto
5. Conhecer todas as ferramentas disponíveis

## 🎯 Resultado Esperado

Após executar os scripts, você poderá:

1. Acessar `/pt/wellness/cursos`
2. Ver a trilha "Distribuidor Iniciante"
3. Clicar na trilha e ver o Módulo 1
4. Acessar o Módulo 1 e ver todas as 5 aulas
5. Marcar aulas como concluídas
6. Marcar checklists
7. Ver o progresso atualizar automaticamente

## ⚠️ Observações

- O script usa `ON CONFLICT DO NOTHING` para evitar duplicatas
- Se executar múltiplas vezes, não criará duplicatas
- O script busca automaticamente a trilha pelo slug `distribuidor-iniciante`

## 🚀 Próximos Passos

Aguardar os módulos 2 a 8 para popular o restante da trilha.

