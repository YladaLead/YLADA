# 🚀 Guia Rápido: Implementar Nova Área (Nutri/Coach/Nutra)

## 📋 Checklist Pré-Implementação

### 1. Banco de Dados

```bash
# Executar no Supabase SQL Editor (nesta ordem):
1. corrigir-recursao-rls-user-profiles.sql
2. garantir-colunas-user-templates.sql
3. schema-wellness-ferramentas.sql (adaptar para área específica)
```

### 2. Estrutura de Arquivos

```typescript
src/app/pt/[area]/
├── page.tsx                    # Landing page
├── login/page.tsx              # Login específico
├── dashboard/page.tsx          # Dashboard principal
├── configuracao/page.tsx       # Configurações
├── ferramentas/
│   ├── page.tsx               # Lista de ferramentas
│   ├── nova/page.tsx          # Criar nova
│   └── [id]/editar/page.tsx   # Editar existente
└── checkout/page.tsx           # Checkout Stripe
```

### 3. Componentes Necessários

- [ ] `ProtectedRoute` com `perfil={area}`
- [ ] `RequireSubscription` com `area={area}`
- [ ] `LoginForm` reutilizável
- [ ] Função `gerarTituloDoSlug` copiada

---

## 🔧 Passo a Passo

### Passo 1: Copiar Estrutura Wellness

```bash
# Copiar estrutura base
cp -r src/app/pt/wellness src/app/pt/[area]
```

### Passo 2: Adaptar Rotas

Substituir `wellness` por `[area]` em:
- Rotas de API: `/api/wellness/` → `/api/[area]/`
- Rotas de página: `/pt/wellness/` → `/pt/[area]/`
- `profession` no banco: `'wellness'` → `'[area]'`

### Passo 3: Adaptar Componentes

```typescript
// Exemplo: ProtectedRoute
<ProtectedRoute perfil="nutri" allowAdmin={true}>
  <Dashboard />
</ProtectedRoute>

// Exemplo: RequireSubscription
<RequireSubscription area="nutri">
  <Content />
</RequireSubscription>
```

### Passo 4: Verificar Schema

```sql
-- Verificar se todas as colunas existem
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_templates'
ORDER BY ordinal_position;
```

### Passo 5: Testar

- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Criar ferramenta funciona
- [ ] Editar ferramenta funciona
- [ ] RLS funciona (admin e usuário comum)

---

## ⚠️ Pontos de Atenção

1. **Hooks sempre no topo** do componente
2. **Usar `gerarTituloDoSlug`** para títulos
3. **Verificar colunas** antes de INSERT
4. **Testar RLS** com diferentes usuários
5. **Logs detalhados** para debug

---

## 📚 Documentação Completa

Ver `docs/LICOES-APRENDIDAS-WELLNESS.md` para detalhes completos.









