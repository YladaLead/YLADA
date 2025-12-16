# 📚 Migração de Scripts/Aulas em PDF para Biblioteca Wellness

## ✅ O que foi feito

Foi criada a migration `162-adicionar-scripts-aulas-pdf-biblioteca-wellness.sql` que adiciona **20 materiais em PDF** da primeira versão do Wellness System para a biblioteca.

## 📦 Materiais Adicionados

### Scripts de Convite (3 PDFs)
- Scripts de Convite Leve - Guia Completo
- Scripts de Convite - Pessoas Próximas
- Scripts de Convite - Leads Frios

### Scripts de Follow-up (2 PDFs)
- Scripts de Follow-up - Guia Completo
- Scripts de Follow-up - Após Enviar Link

### Scripts de Apresentação (2 PDFs)
- Scripts de Apresentação de Produtos
- Scripts de Apresentação da Oportunidade

### Scripts de Fechamento (2 PDFs)
- Scripts de Fechamento - Produtos
- Scripts de Fechamento - Kits

### Scripts de Objeção (3 PDFs)
- Scripts de Objeções - Guia Completo
- Scripts de Objeção - Falta de Dinheiro
- Scripts de Objeção - Falta de Tempo

### Scripts de Onboarding (2 PDFs)
- Scripts de Onboarding - Novos Clientes
- Scripts de Onboarding - Novos Distribuidores

### Aulas de Treinamento (5 PDFs)
- Aula 1: Fundamentos do Wellness System
- Aula 2: Os 3 Pilares do Wellness System
- Aula 3: Como o Modelo Funciona na Prática
- Aula 4: Por que o Wellness System Converte Tanto
- Aula 5: Visão Geral das Ferramentas

### Scripts de Recrutamento (2 PDFs)
- Scripts de Recrutamento - Guia Completo
- Scripts de Recrutamento - Leads Específicos

### Scripts Gerais (2 PDFs)
- Scripts Completos - Primeira Versão
- Guia Rápido de Scripts

## 🚀 Como Executar

### 1. Executar a Migration no Supabase

```sql
-- No Supabase SQL Editor, execute:
-- migrations/162-adicionar-scripts-aulas-pdf-biblioteca-wellness.sql
```

### 2. Upload dos PDFs para Supabase Storage

1. Acesse o Supabase Dashboard
2. Vá em **Storage** → **Buckets**
3. Certifique-se de que o bucket `wellness-biblioteca` existe
4. Crie a estrutura de pastas:
   ```
   wellness-biblioteca/
   ├── pdfs/
   │   ├── scripts/
   │   └── aulas/
   ```
5. Faça upload de todos os PDFs organizados por categoria

### 3. Atualizar URLs no Banco de Dados

Após fazer upload dos PDFs, atualize as URLs no banco:

```sql
-- Exemplo para atualizar uma URL
UPDATE wellness_materiais 
SET url = 'https://seu-projeto.supabase.co/storage/v1/object/public/wellness-biblioteca/pdfs/scripts/convite-leve-completo.pdf'
WHERE codigo = 'pdf-script-convite-leve-completo';

-- Ou atualizar todas de uma vez (ajuste os nomes dos arquivos)
UPDATE wellness_materiais 
SET url = CONCAT('https://seu-projeto.supabase.co/storage/v1/object/public/wellness-biblioteca/pdfs/scripts/', 
                 CASE 
                   WHEN codigo LIKE 'pdf-script-%' THEN REPLACE(REPLACE(codigo, 'pdf-script-', ''), '-', '_') || '.pdf'
                   WHEN codigo LIKE 'pdf-aula-%' THEN REPLACE(REPLACE(codigo, 'pdf-aula-', ''), '-', '_') || '.pdf'
                 END)
WHERE tipo = 'pdf' AND categoria = 'script';
```

## 📍 Onde os Materiais Aparecem

Após a migration, os materiais aparecerão em:

- **Biblioteca Wellness** → **Scripts Oficiais** (`/pt/wellness/biblioteca/scripts`)
- **Biblioteca Wellness** → **Materiais de Apresentação** (`/pt/wellness/biblioteca/materiais`) - quando filtrado por categoria "script"

## 🔍 Como Verificar

1. Acesse `/pt/wellness/biblioteca/scripts`
2. Os PDFs devem aparecer na lista
3. Clique em um PDF para abrir/baixar

## ⚠️ Importante

- As URLs atuais são **placeholders** e precisam ser atualizadas após o upload dos PDFs
- Todos os materiais estão marcados como `ativo = true`
- Os materiais têm tags para facilitar busca e filtragem
- A ordem (`ordem`) está definida para organizar a exibição

## 📝 Próximos Passos

1. ✅ Executar a migration no Supabase
2. ⏳ Fazer upload dos PDFs para o Supabase Storage
3. ⏳ Atualizar as URLs no banco de dados
4. ⏳ Testar na interface da biblioteca

## 🎯 Resultado Final

Após completar todos os passos, os usuários da área Wellness terão acesso a todos os scripts e aulas em PDF da primeira versão, organizados e fáceis de encontrar na biblioteca.

