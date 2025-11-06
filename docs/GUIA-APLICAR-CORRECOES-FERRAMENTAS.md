# 📋 Guia: Aplicar Correções de Criação de Ferramentas em Novas Áreas

Este guia documenta as correções aplicadas na área Wellness e como replicá-las em outras áreas (nutri, coach, etc).

## ✅ Correções Aplicadas

### 1. **Validação de Template por Slug**
- **Problema**: Templates não têm coluna `slug` no banco, apenas `name`. O slug é gerado dinamicamente.
- **Solução**: Criar função helper `findTemplateBySlug()` que busca pelo `name` normalizado.

### 2. **Tratamento de Erros de Foreign Key**
- **Problema**: Erros genéricos não ajudavam a identificar o problema real.
- **Solução**: Criar função `handleDatabaseInsertError()` que retorna mensagens específicas.

### 3. **Validação Antes de Inserir**
- **Problema**: Tentativa de inserir com `template_id` ou `template_slug` inválidos causava erros.
- **Solução**: Validar template antes de inserir usando `validateTemplateBeforeCreate()`.

### 4. **Garantir Colunas no Banco**
- **Problema**: Colunas faltando causavam erros 500.
- **Solução**: Script SQL `garantir-colunas-user-templates.sql` garante todas as colunas necessárias.

---

## 🔧 Como Aplicar em Outras Áreas

### Passo 1: Importar Helpers

```typescript
// src/app/api/[area]/ferramentas/route.ts
import { 
  findTemplateBySlug, 
  validateTemplateBeforeCreate,
  handleDatabaseInsertError 
} from '@/lib/template-helpers'
```

### Passo 2: Validar Template Antes de Criar

```typescript
export async function POST(request: NextRequest) {
  try {
    // ... autenticação e validações básicas ...

    const { template_slug, template_id, profession = 'nutri' } = body

    // ✅ Validar template antes de inserir
    const { templateId, error: templateError } = await validateTemplateBeforeCreate(
      template_slug,
      template_id,
      profession, // 'nutri', 'wellness', 'coach', etc
      'pt'
    )

    if (templateError) {
      return NextResponse.json(
        { error: templateError },
        { status: 400 }
      )
    }

    // ... resto do código ...
  } catch (error: any) {
    // ✅ Usar helper para tratar erros
    const errorResponse = handleDatabaseInsertError(error)
    return NextResponse.json(
      { 
        error: errorResponse.error,
        technical: process.env.NODE_ENV === 'development' ? errorResponse.technical : undefined,
        code: errorResponse.code
      },
      { status: errorResponse.status }
    )
  }
}
```

### Passo 3: Tratar Erros na Inserção

```typescript
const { data: insertedTool, error: insertError } = await supabaseAdmin
  .from('user_templates')
  .insert(insertData)
  .select('*')
  .single()

if (insertError) {
  // ✅ Usar helper para tratar erros de inserção
  const errorResponse = handleDatabaseInsertError(insertError)
  return NextResponse.json(
    { 
      error: errorResponse.error,
      technical: errorResponse.technical,
      code: errorResponse.code,
      hint: errorResponse.hint
    },
    { status: errorResponse.status }
  )
}
```

### Passo 4: Atualizar Frontend

```typescript
// src/app/pt/[area]/ferramentas/nova/page.tsx

if (!response.ok) {
  const data = await response.json()
  
  // ✅ Log detalhado para debug
  console.error('❌ Erro ao criar ferramenta:', {
    status: response.status,
    errorData: data,
    technical: data.technical,
    code: data.code,
    hint: data.hint
  })
  
  // ✅ Mensagem específica para erro de coluna faltando
  if (data.code === '42703' || data.technical?.includes('column')) {
    throw new Error('O banco de dados precisa ser atualizado. Execute o script SQL "garantir-colunas-user-templates.sql" e tente novamente.')
  }
  
  throw new Error(data.error || 'Erro ao criar ferramenta')
}
```

---

## 📝 Checklist para Nova Área

- [ ] Importar helpers de `@/lib/template-helpers`
- [ ] Validar template antes de inserir usando `validateTemplateBeforeCreate()`
- [ ] Tratar erros de inserção usando `handleDatabaseInsertError()`
- [ ] Adicionar logs detalhados no frontend
- [ ] Testar criação de ferramenta com template válido
- [ ] Testar criação de ferramenta com template inválido
- [ ] Testar criação de ferramenta sem template
- [ ] Verificar mensagens de erro são amigáveis

---

## 🗄️ Script SQL Necessário

**IMPORTANTE**: Execute o script `garantir-colunas-user-templates.sql` no banco antes de criar ferramentas em qualquer área.

Este script garante que todas as colunas necessárias existam:
- `short_code`
- `emoji`
- `custom_colors`
- `cta_type`
- `whatsapp_number`
- `external_url`
- `cta_button_text`
- `template_slug`
- `profession`
- `custom_whatsapp_message`

---

## 🔍 Debug

Se encontrar erros ao criar ferramentas:

1. **Verificar console do navegador** (F12 → Console)
   - Procure por logs com `❌ Erro ao criar ferramenta`
   - Verifique `technical`, `code` e `hint`

2. **Verificar logs do servidor**
   - Procure por logs com `📝 Tentando inserir ferramenta`
   - Verifique se todas as colunas estão sendo enviadas

3. **Verificar banco de dados**
   - Execute: `SELECT column_name FROM information_schema.columns WHERE table_name = 'user_templates'`
   - Compare com as colunas esperadas no script SQL

4. **Verificar template existe**
   - Execute: `SELECT * FROM templates_nutrition WHERE profession = '[sua-area]' AND is_active = true`
   - Verifique se o template tem `name` e `content`

---

## 📚 Exemplo Completo

Veja `src/app/api/wellness/ferramentas/route.ts` como referência completa de implementação.

---

## ✅ Benefícios

- ✅ Código reutilizável e consistente
- ✅ Mensagens de erro amigáveis e específicas
- ✅ Validação preventiva evita erros no banco
- ✅ Logs detalhados facilitam debug
- ✅ Fácil de replicar em novas áreas

