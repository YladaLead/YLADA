# 📊 ANÁLISE ÁREA NUTRI - PLANO DE COMPLEMENTAÇÃO

**Data:** Hoje  
**Objetivo:** Mapear o que já existe na área Nutri e criar plano de complementação baseado na estrutura Wellness

---

## ✅ O QUE JÁ ESTÁ IMPLEMENTADO

### **1. Estrutura de Pastas (Frontend)**
```
src/app/pt/nutri/
├── dashboard/              ✅ Implementado
├── ferramentas/           ✅ Implementado
│   ├── page.tsx           ✅ Listagem (com dados mockados)
│   ├── nova/              ✅ Criação (página completa)
│   └── templates/         ✅ Visualização de templates
├── quiz-personalizado/     ✅ Implementado
├── cursos/                 ✅ Implementado
├── leads/                  ✅ Implementado
├── relatorios/             ✅ Implementado
├── suporte/                ✅ Implementado
├── configuracoes/          ✅ Implementado
└── login/                  ✅ Implementado
```

### **2. APIs Implementadas**
```
src/app/api/nutri/
└── templates/              ✅ GET - Listar templates Nutri
    └── route.ts            ✅ Filtra por profession='nutri'
```

### **3. Componentes**
```
src/components/nutri/
└── NutriNavBar.tsx         ✅ NavBar específica Nutri
```

### **4. Diagnósticos**
```
src/lib/
├── diagnosticos-nutri.ts   ✅ Arquivo único com diagnósticos
└── diagnostics/
    └── nutri/
        └── checklist-alimentar.ts  ✅ Diagnóstico específico Nutri
```

**Características dos Diagnósticos Nutri:**
- ✅ Focados em **encaminhamento para nutricionista**
- ✅ Linguagem mais técnica e profissional
- ✅ Recomendações de consulta e acompanhamento
- ✅ Exemplo: "considere uma consulta para identificar oportunidades"

---

## ❌ O QUE ESTÁ FALTANDO

### **1. APIs Faltantes**

#### **1.1. API de Ferramentas (Links)**
```
❌ /api/nutri/ferramentas/route.ts
   - GET: Listar ferramentas do usuário
   - POST: Criar nova ferramenta
   - PUT: Atualizar ferramenta
   - DELETE: Deletar ferramenta
   - Suporte a short codes
```

#### **1.2. API de Quizzes**
```
❌ /api/nutri/quizzes/route.ts
   - GET: Listar quizzes do usuário
   - (POST/PUT/DELETE via /api/quiz com filtro profession)
```

#### **1.3. API de Portals**
```
❌ /api/nutri/portals/route.ts
   - GET: Listar portais
   - POST: Criar portal
   - PUT: Atualizar portal
   - DELETE: Deletar portal
   - Suporte a short codes
```

#### **1.4. API de Check Short Code**
```
❌ /api/nutri/check-short-code/route.ts
   - GET: Verificar disponibilidade de código curto
```

### **2. Páginas Faltantes**

#### **2.1. Gestão de Quizzes**
```
❌ /pt/nutri/quizzes/page.tsx
   - Listagem de quizzes criados
   - Exibir short code e QR code
   - Botões Editar/Excluir visíveis
   - Estatísticas (views, leads, conversão)
```

#### **2.2. Gestão de Portais**
```
❌ /pt/nutri/portals/page.tsx          - Listagem
❌ /pt/nutri/portals/novo/page.tsx     - Criação
❌ /pt/nutri/portals/[id]/editar/page.tsx - Edição
```

#### **2.3. Edição de Ferramentas**
```
❌ /pt/nutri/ferramentas/[id]/editar/page.tsx
   - Editar link criado
   - Gerenciar short code
   - Atualizar personalizações
```

### **3. Funcionalidades Faltantes**

#### **3.1. Short Codes e QR Codes**
```
❌ Suporte a short codes em:
   - Criação de links (ferramentas)
   - Criação de quizzes
   - Criação de portais
   - Edição de links/quizzes/portais
   - Exibição na listagem
```

#### **3.2. Integração com Banco de Dados**
```
❌ /pt/nutri/ferramentas/page.tsx
   - Atualmente usa dados mockados
   - Precisa buscar de /api/nutri/ferramentas
   - Filtrar por profession='nutri'
```

#### **3.3. User Slug e URLs Personalizadas**
```
❌ Suporte a user_slug em:
   - URLs de links: /pt/nutri/[user_slug]/[slug]
   - URLs de quizzes: /pt/nutri/[user_slug]/quiz/[slug]
   - URLs de portais: /pt/nutri/[user_slug]/portal/[slug]
```

### **4. Diagnósticos Específicos Nutri**

#### **4.1. Status Atual**
```
✅ Arquivo único: src/lib/diagnosticos-nutri.ts
✅ Alguns diagnósticos específicos Nutri
⚠️ Muitos diagnósticos ainda usando versão Wellness
```

#### **4.2. O que Precisa**
```
❌ Adaptar diagnósticos para foco em:
   - Encaminhamento para nutricionista
   - Agendamento de consulta
   - Acompanhamento profissional
   - Linguagem técnica nutricional
```

---

## 🔍 DIFERENÇAS: NUTRI vs WELLNESS

### **1. Diagnósticos**

**Wellness:**
- Foco em **bem-estar geral**
- Linguagem mais acessível
- Encaminhamento para **especialista em bem-estar**
- Produtos e suplementos Wellness

**Nutri:**
- Foco em **nutrição profissional**
- Linguagem mais técnica
- Encaminhamento para **nutricionista**
- Consulta e acompanhamento nutricional
- Exemplo: "considere uma consulta para identificar oportunidades"

### **2. Cores**

**Wellness:**
- Verde (#10B981, #059669)
- Gradientes: `from-teal-50 to-blue-50`

**Nutri:**
- Azul (#3B82F6, #1E40AF)
- Gradientes: `from-blue-50 to-blue-100`

### **3. CTAs**

**Wellness:**
- "Conversar com Especialista"
- Foco em produtos e bem-estar

**Nutri:**
- "Agendar Consulta"
- "Falar com Nutricionista"
- Foco em consulta profissional

---

## 📋 PLANO DE COMPLEMENTAÇÃO

### **FASE 1: APIs Essenciais** ⚡ PRIORIDADE ALTA

#### **1.1. API de Ferramentas**
```
✅ Criar: /api/nutri/ferramentas/route.ts
   - Duplicar de /api/wellness/ferramentas/route.ts
   - Ajustar profession='nutri'
   - Incluir suporte a short codes
   - Validação cruzada de short codes
```

#### **1.2. API de Quizzes**
```
✅ Criar: /api/nutri/quizzes/route.ts
   - Duplicar de /api/wellness/quizzes/route.ts
   - Filtrar por profession='nutri'
   - Incluir short code e QR code na resposta
```

#### **1.3. API de Portals**
```
✅ Criar: /api/nutri/portals/route.ts
   - Duplicar de /api/wellness/portals/route.ts
   - Ajustar profession='nutri'
   - Incluir suporte a short codes
```

#### **1.4. API de Check Short Code**
```
✅ Criar: /api/nutri/check-short-code/route.ts
   - Duplicar de /api/wellness/check-short-code/route.ts
   - Mesma lógica (verifica em todas as tabelas)
```

**Tempo estimado:** 2-3 horas

---

### **FASE 2: Páginas de Gestão** ⚡ PRIORIDADE ALTA

#### **2.1. Listagem de Quizzes**
```
✅ Criar: /pt/nutri/quizzes/page.tsx
   - Duplicar de /pt/wellness/quizzes/page.tsx
   - Ajustar cores (verde → azul)
   - Ajustar rotas (/wellness → /nutri)
   - Buscar de /api/nutri/quizzes
   - Exibir short code e QR code
   - Botões Editar/Excluir visíveis
```

#### **2.2. Listagem de Portais**
```
✅ Criar: /pt/nutri/portals/page.tsx
   - Duplicar de /pt/wellness/portals/page.tsx
   - Ajustar cores e rotas
   - Buscar de /api/nutri/portals
```

#### **2.3. Criação de Portal**
```
✅ Criar: /pt/nutri/portals/novo/page.tsx
   - Duplicar de /pt/wellness/portals/novo/page.tsx
   - Ajustar cores e rotas
   - URL Encurtada ANTES da seleção de ferramentas
   - Suporte a short codes
```

#### **2.4. Edição de Portal**
```
✅ Criar: /pt/nutri/portals/[id]/editar/page.tsx
   - Duplicar de /pt/wellness/portals/[id]/editar/page.tsx
   - Ajustar cores e rotas
   - Gerenciar short codes
```

#### **2.5. Edição de Ferramenta**
```
✅ Criar: /pt/nutri/ferramentas/[id]/editar/page.tsx
   - Duplicar de /pt/wellness/ferramentas/[id]/editar/page.tsx
   - Ajustar cores e rotas
   - Gerenciar short codes
```

**Tempo estimado:** 3-4 horas

---

### **FASE 3: Integração com Banco** ⚡ PRIORIDADE MÉDIA

#### **3.1. Atualizar Listagem de Ferramentas**
```
✅ Atualizar: /pt/nutri/ferramentas/page.tsx
   - Remover dados mockados
   - Buscar de /api/nutri/ferramentas
   - Exibir short code e QR code
   - Botões Editar/Excluir visíveis (padronizar com Wellness)
```

#### **3.2. Atualizar Criação de Ferramenta**
```
✅ Atualizar: /pt/nutri/ferramentas/nova/page.tsx
   - Integrar com /api/nutri/ferramentas (POST)
   - Adicionar UI de short codes
   - Validação em tempo real
```

#### **3.3. Atualizar Quiz Personalizado**
```
✅ Atualizar: /pt/nutri/quiz-personalizado/page.tsx
   - Adicionar UI de short codes
   - Passar profession='nutri' na criação
   - Validação em tempo real
```

**Tempo estimado:** 2-3 horas

---

### **FASE 4: Short Codes e QR Codes** ⚡ PRIORIDADE MÉDIA

#### **4.1. Adicionar UI de Short Codes**
```
✅ Em todas as páginas de criação/edição:
   - Links (ferramentas)
   - Quizzes
   - Portais
   - Checkbox "Gerar URL Encurtada"
   - Opção "Personalizar Código"
   - Validação em tempo real
```

#### **4.2. Exibir Short Codes e QR Codes**
```
✅ Em todas as páginas de listagem:
   - /pt/nutri/ferramentas
   - /pt/nutri/quizzes
   - /pt/nutri/portals
   - Mostrar URL encurtada
   - Mostrar QR Code
   - Botão "Copiar"
```

**Tempo estimado:** 2-3 horas

---

### **FASE 5: User Slug e URLs** ⚡ PRIORIDADE BAIXA

#### **5.1. Suporte a User Slug**
```
✅ Atualizar construção de URLs:
   - Verificar se user_slug existe
   - Usar /pt/nutri/[user_slug]/[slug] se existir
   - Fallback para /pt/nutri/ferramenta/[id]
```

#### **5.2. Redirecionamento de Short Codes**
```
✅ Verificar: /p/[code]/route.ts
   - Já funciona para todas as áreas
   - Verificar se redireciona corretamente para Nutri
```

**Tempo estimado:** 1-2 horas

---

### **FASE 6: Diagnósticos Específicos Nutri** ⚡ PRIORIDADE BAIXA

#### **6.1. Adaptar Diagnósticos Existentes**
```
⚠️ Revisar: src/lib/diagnosticos-nutri.ts
   - Adaptar linguagem para foco em nutricionista
   - Adicionar CTAs de agendamento
   - Enfatizar consulta profissional
```

#### **6.2. Criar Diagnósticos Faltantes**
```
❌ Verificar quais templates não têm diagnósticos Nutri
   - Comparar com lista de templates Nutri no banco
   - Criar diagnósticos específicos onde faltam
```

**Tempo estimado:** 4-6 horas (depende da quantidade)

---

## 📊 MATRIZ DE COMPARAÇÃO: WELLNESS vs NUTRI

| Funcionalidade | Wellness | Nutri | Status |
|----------------|----------|-------|--------|
| **Dashboard** | ✅ | ✅ | ✅ Completo |
| **Templates (API)** | ✅ | ✅ | ✅ Completo |
| **Templates (Frontend)** | ✅ | ✅ | ✅ Completo |
| **Criação de Links** | ✅ | ✅ | ⚠️ Falta API |
| **Listagem de Links** | ✅ | ⚠️ | ⚠️ Usa mock, falta API |
| **Edição de Links** | ✅ | ❌ | ❌ Não existe |
| **Quizzes (API)** | ✅ | ❌ | ❌ Não existe |
| **Quizzes (Listagem)** | ✅ | ❌ | ❌ Não existe |
| **Criação de Quiz** | ✅ | ✅ | ⚠️ Falta short codes |
| **Portals (API)** | ✅ | ❌ | ❌ Não existe |
| **Portals (Frontend)** | ✅ | ❌ | ❌ Não existe |
| **Short Codes** | ✅ | ❌ | ❌ Não implementado |
| **QR Codes** | ✅ | ❌ | ❌ Não implementado |
| **User Slug** | ✅ | ⚠️ | ⚠️ Parcial |
| **Diagnósticos Específicos** | ✅ | ⚠️ | ⚠️ Alguns faltam |

---

## 🎯 PRIORIZAÇÃO RECOMENDADA

### **🔥 CRÍTICO (Fazer Primeiro)**
1. ✅ **API de Ferramentas** (`/api/nutri/ferramentas`)
   - Necessário para listagem funcionar
   - Base para outras funcionalidades

2. ✅ **Edição de Ferramentas** (`/pt/nutri/ferramentas/[id]/editar`)
   - Usuários precisam editar links criados
   - Gerenciar short codes

3. ✅ **Listagem de Quizzes** (`/pt/nutri/quizzes`)
   - Usuários precisam ver quizzes criados
   - Gerenciar e editar

### **⚡ IMPORTANTE (Fazer Depois)**
4. ✅ **API de Quizzes** (`/api/nutri/quizzes`)
   - Necessário para listagem funcionar

5. ✅ **Portals (Completo)**
   - API + Frontend completo
   - Funcionalidade importante

6. ✅ **Short Codes e QR Codes**
   - Melhora experiência de compartilhamento
   - Facilita uso em impressos

### **📝 DESEJÁVEL (Fazer Por Último)**
7. ✅ **User Slug**
   - URLs mais profissionais
   - Melhor SEO

8. ✅ **Diagnósticos Específicos Nutri**
   - Melhorar qualidade dos diagnósticos
   - Foco em encaminhamento profissional

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### **Backend (APIs)**
- [ ] `/api/nutri/ferramentas/route.ts` (GET, POST, PUT, DELETE)
- [ ] `/api/nutri/quizzes/route.ts` (GET)
- [ ] `/api/nutri/portals/route.ts` (GET, POST, PUT, DELETE)
- [ ] `/api/nutri/check-short-code/route.ts` (GET)
- [ ] Atualizar `/api/quiz/route.ts` para passar `profession='nutri'` quando criado via área Nutri

### **Frontend (Páginas)**
- [ ] `/pt/nutri/ferramentas/page.tsx` - Integrar com API real
- [ ] `/pt/nutri/ferramentas/[id]/editar/page.tsx` - Criar página de edição
- [ ] `/pt/nutri/ferramentas/nova/page.tsx` - Adicionar short codes
- [ ] `/pt/nutri/quizzes/page.tsx` - Criar listagem
- [ ] `/pt/nutri/quiz-personalizado/page.tsx` - Adicionar short codes
- [ ] `/pt/nutri/portals/page.tsx` - Criar listagem
- [ ] `/pt/nutri/portals/novo/page.tsx` - Criar página
- [ ] `/pt/nutri/portals/[id]/editar/page.tsx` - Criar página

### **Funcionalidades**
- [ ] Short codes em links (criação e edição)
- [ ] Short codes em quizzes (criação)
- [ ] Short codes em portais (criação e edição)
- [ ] QR codes em todas as listagens
- [ ] Botões Editar/Excluir visíveis (padronizar)
- [ ] User slug nas URLs

### **Diagnósticos**
- [ ] Revisar diagnósticos existentes
- [ ] Adaptar para foco em nutricionista
- [ ] Criar diagnósticos faltantes
- [ ] Adicionar CTAs de agendamento

---

## 🎨 AJUSTES VISUAIS NECESSÁRIOS

### **Cores**
- ✅ Wellness: Verde (#10B981)
- ✅ Nutri: Azul (#3B82F6)
- ⚠️ Verificar se todas as páginas Nutri usam azul

### **CTAs**
- ✅ Wellness: "Conversar com Especialista"
- ✅ Nutri: "Agendar Consulta" / "Falar com Nutricionista"
- ⚠️ Verificar se CTAs estão corretos

### **Logos**
- ✅ Wellness: Logo verde
- ✅ Nutri: Logo azul (`logo_ylada_azul_quadrado.png`)
- ✅ Já configurado no layout

---

## 📚 REFERÊNCIAS

### **Documentação Base**
- `ESTRUTURA-FORNECIMENTO-TEMPLATES-LINKS-QUIZZES.md` ⭐ **PRINCIPAL**
- `docs/GUIA-DUPLICACAO-AREAS-CONSOLIDADO.md`
- `docs/COMPARACAO-ESTRUTURA-DIAGNOSTICOS-WELLNESS-vs-NUTRI.md`

### **Código de Referência (Wellness)**
- `/src/app/api/wellness/ferramentas/route.ts`
- `/src/app/api/wellness/quizzes/route.ts`
- `/src/app/api/wellness/portals/route.ts`
- `/src/app/api/wellness/check-short-code/route.ts`
- `/src/app/pt/wellness/quizzes/page.tsx`
- `/src/app/pt/wellness/portals/page.tsx`

---

## ✅ CONCLUSÃO

**Status Atual:**
- ✅ Estrutura base implementada
- ✅ Templates funcionando
- ✅ Páginas principais criadas
- ⚠️ APIs faltantes (ferramentas, quizzes, portals)
- ⚠️ Funcionalidades avançadas faltantes (short codes, QR codes)
- ⚠️ Integração com banco incompleta

**Próximos Passos:**
1. Implementar APIs faltantes (Fase 1)
2. Criar páginas de gestão (Fase 2)
3. Integrar com banco (Fase 3)
4. Adicionar short codes (Fase 4)

**Tempo Total Estimado:** 10-15 horas de desenvolvimento

---

**Última atualização:** Hoje  
**Versão:** 1.0.0

