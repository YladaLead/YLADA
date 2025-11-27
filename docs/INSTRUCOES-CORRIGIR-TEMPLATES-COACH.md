# 🔧 INSTRUÇÕES: Corrigir Templates Coach

## 📋 **PROBLEMA**

Templates não estão sendo encontrados ao criar ferramentas na área Coach:
- `calc-hidratacao` (Calculadora de Hidratação)
- `calc-proteina` (Calculadora de Proteína)
- E possivelmente outros templates

**Erro exibido:**
```
Template "calc-hidratacao" não encontrado. Por favor, selecione outro template.
```

---

## ✅ **SOLUÇÃO COMPLETA**

### **Opção 1: Script Completo (Recomendado)**

Execute o script completo que corrige e sincroniza **TODOS** os templates:

**Arquivo:** `migrations/corrigir-e-sincronizar-todos-templates-coach.sql`

**O que o script faz:**
1. ✅ Corrige slugs incorretos dos templates existentes
2. ✅ Ativa templates que estão inativos
3. ✅ Copia templates faltantes da tabela origem (`templates_nutrition`)
4. ✅ Cria templates essenciais se não existirem
5. ✅ Garante que todos os 19 templates principais estejam disponíveis

**Como executar:**
1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Abra o arquivo `migrations/corrigir-e-sincronizar-todos-templates-coach.sql`
4. Copie e cole todo o conteúdo
5. Clique em **Run** (ou pressione `Ctrl+Enter`)
6. Verifique os logs no final do script

**Templates que serão corrigidos/criados:**
- ✅ `calc-hidratacao` - Calculadora de Hidratação
- ✅ `calc-proteina` - Calculadora de Proteína
- ✅ `calc-imc` - Calculadora de IMC
- ✅ `calc-calorias` - Calculadora de Calorias
- ✅ `calc-composicao` - Calculadora de Composição Corporal
- ✅ `quiz-ganhos` - Quiz Ganhos e Prosperidade
- ✅ `quiz-potencial` - Quiz Potencial e Crescimento
- ✅ `quiz-proposito` - Quiz Propósito e Equilíbrio
- ✅ `quiz-alimentacao` - Quiz Alimentação Saudável
- ✅ `template-desafio-7dias` - Desafio 7 Dias
- ✅ `template-desafio-21dias` - Desafio 21 Dias
- ✅ `guia-hidratacao` - Guia de Hidratação
- ✅ `avaliacao-intolerancia` - Avaliação de Intolerâncias
- ✅ `avaliacao-perfil-metabolico` - Avaliação Perfil Metabólico
- ✅ `diagnostico-eletrolitos` - Diagnóstico de Eletrólitos
- ✅ `diagnostico-sintomas-intestinais` - Diagnóstico Sintomas Intestinais
- ✅ `tipo-fome` - Tipo de Fome
- ✅ `template-story-interativo` - Story Interativo
- ✅ `template-diagnostico-parasitose` - Diagnóstico de Parasitose

---

### **Opção 2: Correção Rápida (Apenas os que estão dando erro)**

Se quiser corrigir apenas os templates que estão dando erro agora:

**Arquivo:** `migrations/corrigir-templates-coach-rapido.sql`

Execute este script mais simples que corrige apenas:
- `calc-hidratacao`
- `calc-proteina`

---

## 🔍 **VERIFICAÇÃO**

Após executar o script, verifique se funcionou:

### **1. Verificar templates na API**

Acesse: `https://seu-dominio.com/api/coach/templates`

Você deve ver uma lista com todos os templates, incluindo:
- `calc-hidratacao`
- `calc-proteina`
- E os demais templates

### **2. Verificar no banco de dados**

Execute esta query no Supabase SQL Editor:

```sql
SELECT 
  name,
  slug,
  type,
  is_active,
  CASE 
    WHEN slug IS NULL THEN '❌ SEM SLUG'
    WHEN is_active = false THEN '⚠️ INATIVO'
    ELSE '✅ OK'
  END as status
FROM coach_templates_nutrition
WHERE slug IN ('calc-hidratacao', 'calc-proteina', 'calc-imc', 'calc-calorias')
ORDER BY slug;
```

**Resultado esperado:**
- Todos os templates devem aparecer com status `✅ OK`
- `slug` deve estar preenchido corretamente
- `is_active` deve ser `true`

### **3. Testar criação de ferramenta**

1. Acesse a área Coach: `/pt/coach/c/ferramentas/nova`
2. Tente criar uma ferramenta usando:
   - Calculadora de Hidratação
   - Calculadora de Proteína
3. Verifique se não aparece mais o erro "Template não encontrado"

---

## 🐛 **TROUBLESHOOTING**

### **Problema: Script retorna erro**

**Possíveis causas:**
1. Tabela `coach_templates_nutrition` não existe
   - **Solução:** Execute primeiro `migrations/criar-tabelas-templates-coach.sql`

2. Coluna `slug` não existe na tabela
   - **Solução:** O script tenta criar, mas se falhar, adicione manualmente:
   ```sql
   ALTER TABLE coach_templates_nutrition ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
   ```

3. Permissões insuficientes
   - **Solução:** Execute como usuário com permissões de administrador

### **Problema: Templates ainda não aparecem**

**Verificar:**
1. Templates estão com `is_active = true`?
   ```sql
   SELECT name, slug, is_active FROM coach_templates_nutrition WHERE slug IN ('calc-hidratacao', 'calc-proteina');
   ```

2. Templates estão com `profession = 'coach'`?
   ```sql
   SELECT name, slug, profession FROM coach_templates_nutrition WHERE slug IN ('calc-hidratacao', 'calc-proteina');
   ```

3. Templates estão com `language = 'pt'`?
   ```sql
   SELECT name, slug, language FROM coach_templates_nutrition WHERE slug IN ('calc-hidratacao', 'calc-proteina');
   ```

### **Problema: Templates existem mas com slug diferente**

**Solução:** O script já corrige isso automaticamente, mas se ainda houver problema:

```sql
-- Corrigir manualmente
UPDATE coach_templates_nutrition
SET slug = 'calc-hidratacao'
WHERE (LOWER(name) LIKE '%hidratação%' OR LOWER(name) LIKE '%hidratacao%')
  AND type = 'calculadora'
  AND slug != 'calc-hidratacao';

UPDATE coach_templates_nutrition
SET slug = 'calc-proteina'
WHERE (LOWER(name) LIKE '%proteína%' OR LOWER(name) LIKE '%proteina%')
  AND type = 'calculadora'
  AND slug != 'calc-proteina';
```

---

## 📝 **NOTAS IMPORTANTES**

1. **Backup:** O script não deleta dados, apenas corrige e adiciona. Mas é sempre bom fazer backup antes.

2. **Tempo de execução:** O script completo pode levar alguns segundos dependendo da quantidade de templates.

3. **Logs:** O script mostra logs detalhados no final. Verifique se há avisos ou erros.

4. **Cache:** Após executar, pode ser necessário limpar o cache do navegador ou aguardar alguns minutos para a API atualizar.

---

## ✅ **CHECKLIST PÓS-EXECUÇÃO**

- [ ] Script executado sem erros
- [ ] Templates aparecem na API (`/api/coach/templates`)
- [ ] Templates têm `slug` correto no banco
- [ ] Templates estão com `is_active = true`
- [ ] É possível criar ferramenta usando os templates
- [ ] Não aparece mais erro "Template não encontrado"

---

## 🔗 **ARQUIVOS RELACIONADOS**

- `migrations/corrigir-e-sincronizar-todos-templates-coach.sql` - Script completo
- `migrations/criar-tabelas-templates-coach.sql` - Criação da tabela (se necessário)
- `docs/DIAGNOSTICO-TEMPLATES-COACH-NAO-ENCONTRADOS.md` - Diagnóstico detalhado
- `src/app/api/coach/templates/route.ts` - API que lista templates
- `src/app/api/coach/ferramentas/route.ts` - API que cria ferramentas

