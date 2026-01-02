# Lista de Páginas Usando `/c/` Incorretamente

## 📋 Resumo
A abreviação `/c/` deve ser usada **APENAS** em:
- ✅ Formulários públicos (páginas de preenchimento): `/pt/c/[user-slug]/formulario/[slug]`
- ✅ Links de lembretes/notificações
- ✅ Ferramentas públicas: `/pt/c/[user-slug]/[tool-slug]`
- ✅ Quizzes públicos: `/pt/c/[user-slug]/quiz/[slug]`
- ✅ Portais públicos: `/pt/c/portal/[slug]`

**NÃO deve ser usada** em páginas administrativas (que devem usar `/pt/coach/`).

---

## ❌ Páginas Administrativas Usando `/c/` Incorretamente

### 1. **Sidebar (Menu Lateral)**
**Arquivo:** `src/components/coach/CoachSidebar.tsx`
- Linha 58: `href: '/pt/c/leads'` → deve ser `/pt/coach/leads`
- Linha 67: `href: '/pt/c/clientes/kanban'` → deve ser `/pt/coach/clientes/kanban`
- Linha 76: `href: '/pt/c/formularios'` → deve ser `/pt/coach/formularios`

### 2. **Página Home**
**Arquivo:** `src/app/pt/coach/home/page.tsx`
- Linha 278: `href="/pt/c/formularios"` → deve ser `/pt/coach/formularios`
- Linha 425: `href="/pt/c/clientes/kanban"` → deve ser `/pt/coach/clientes/kanban`
- Linha 455: `href="/pt/c/formularios/novo"` → deve ser `/pt/coach/formularios/novo`
- Linha 473: `href="/pt/c/formularios/respostas"` → deve ser `/pt/coach/formularios/respostas`
- Linha 529: `href="/pt/c/leads"` → deve ser `/pt/coach/leads`
- Linha 645: `href="/pt/c/formularios/novo"` → deve ser `/pt/coach/formularios/novo`

### 3. **Página de Formulários**
**Arquivo:** `src/app/pt/coach/formularios/page.tsx`
- Linha 314: `router.push('/pt/c/configuracao')` → deve ser `/pt/coach/configuracao`
- Linha 351: `href="/pt/c/formularios/novo"` → deve ser `/pt/coach/formularios/novo`
- Linha 429: `router.push(\`/pt/c/formularios/${template.id}\`)` → deve ser `/pt/coach/formularios/${template.id}`
- Linha 553: `router.push(\`/pt/c/formularios/${form.id}\`)` → deve ser `/pt/coach/formularios/${form.id}`
- Linha 678: `href="/pt/c/formularios/novo"` → deve ser `/pt/coach/formularios/novo`

### 4. **Página de Formulários (Edição)**
**Arquivo:** `src/app/pt/coach/formularios/[id]/page.tsx`
- Linha 62: `router.push('/pt/c/formularios')` → deve ser `/pt/coach/formularios`
- Linha 229: `router.push('/pt/c/formularios')` → deve ser `/pt/coach/formularios`
- Linha 260: `router.push('/pt/c/formularios')` → deve ser `/pt/coach/formularios`
- Linha 384: `router.push('/pt/c/formularios')` → deve ser `/pt/coach/formularios`
- Linha 677: `router.push('/pt/c/formularios')` → deve ser `/pt/coach/formularios`

### 5. **Página de Formulários (Enviar)**
**Arquivo:** `src/app/pt/coach/formularios/[id]/enviar/page.tsx`
- Linha 168: `router.push('/pt/c/formularios')` → deve ser `/pt/coach/formularios`

### 6. **Página de Formulários (Respostas)**
**Arquivo:** `src/app/pt/coach/formularios/[id]/respostas/page.tsx`
- Linha 258: `href="/pt/c/formularios"` → deve ser `/pt/coach/formularios`

### 7. **Página de Formulários (Novo)**
**Arquivo:** `src/app/pt/coach/formularios/novo/page.tsx`
- Linha 649: `router.push('/pt/c/formularios')` → deve ser `/pt/coach/formularios`

### 8. **Página de Clientes**
**Arquivo:** `src/app/pt/coach/clientes/page.tsx`
- Linha 161: `href="/pt/c/clientes/kanban"` → deve ser `/pt/coach/clientes/kanban`

### 9. **Página de Leads**
**Arquivo:** `src/app/pt/coach/leads/page.tsx`
- Linha 276: `router.push(\`/pt/c/clientes/${data.data.client.id}\`)` → deve ser `/pt/coach/clientes/${data.data.client.id}`

### 10. **Página de Quiz Personalizado**
**Arquivo:** `src/app/pt/coach/quiz-personalizado/page.tsx`
- Linha 1363: `href="/pt/c/configuracao"` → deve ser `/pt/coach/configuracao`
- Linha 1382: `href="/pt/c/configuracao"` → deve ser `/pt/coach/configuracao`

### 11. **Página de Quiz Personalizado (C)**
**Arquivo:** `src/app/pt/coach/c/quiz-personalizado/page.tsx`
- Linha 1297: `href="/pt/c/configuracao"` → deve ser `/pt/coach/configuracao`
- Linha 1316: `href="/pt/c/configuracao"` → deve ser `/pt/coach/configuracao`

---

## ✅ Páginas que DEVEM usar `/c/` (estão corretas)

### Páginas Públicas de Formulários
- `src/app/pt/c/[user-slug]/formulario/[slug]/page.tsx` ✅
- `src/app/f/[formId]/page.tsx` (redireciona para `/pt/c/...`) ✅

### Páginas Públicas de Ferramentas
- `src/app/pt/c/[user-slug]/[tool-slug]/page.tsx` ✅
- `src/app/pt/c/[user-slug]/[tool-slug]/layout.tsx` ✅

### Páginas Públicas de Quizzes
- `src/app/pt/c/[user-slug]/quiz/[slug]/page.tsx` ✅
- `src/app/pt/c/[user-slug]/quiz/[slug]/layout.tsx` ✅

### Páginas Públicas de Portais
- `src/app/pt/c/portal/[slug]/page.tsx` ✅

### Links Curtos
- `src/app/p/[code]/route.ts` (gera links `/pt/c/...` para ferramentas públicas) ✅

---

## 🔧 Middleware
**Arquivo:** `src/middleware.ts`
- O middleware está redirecionando corretamente:
  - `/pt/coach/formularios/*` → `/pt/c/formularios/*` (páginas administrativas)
  - `/pt/coach/clientes/*` → `/pt/c/clientes/*` (páginas administrativas)
  - `/pt/coach/leads/*` → `/pt/c/leads/*` (páginas administrativas)
  
**⚠️ PROBLEMA:** O middleware está redirecionando páginas administrativas para `/c/`, mas essas páginas administrativas devem permanecer em `/pt/coach/`. O middleware deve redirecionar apenas quando o usuário acessa diretamente uma rota antiga, mas os links internos devem apontar para `/pt/coach/`.

---

## 📝 Observações

1. **APIs:** As rotas de API `/api/c/*` estão corretas (são aliases para `/api/coach/*`)

2. **Links de Formulários Públicos:** Os links gerados para formulários públicos (com `user_slug` e `slug`) estão corretos usando `/pt/c/[user-slug]/formulario/[slug]`

3. **URL Utils:** `src/lib/url-utils.ts` está correto - gera URLs públicas com `/c/`

4. **Páginas em `/pt/c/`:** As páginas que estão fisicamente em `/pt/c/` são páginas públicas e estão corretas

---

## 🎯 Ações Necessárias

1. Corrigir todos os links internos (href, router.push) de páginas administrativas para usar `/pt/coach/` ao invés de `/pt/c/`
2. Revisar o middleware - talvez remover os redirecionamentos de páginas administrativas
3. Manter apenas os redirecionamentos para links públicos de ferramentas





















