# Estrutura de Páginas - YLADA

## 📁 Estrutura Geral

```
src/app/
├── 📄 page.tsx                         # Landing page principal (/)
├── 📄 layout.tsx                       # Layout global
├── 📄 not-found.tsx                   # Página 404
│
├── 🌐 /pt/                             # Roteamento Português (Brasil)
│   ├── page.tsx                        # Landing PT
│   ├── layout.tsx                       # Layout PT
│   │
│   ├── 👥 /admin-diagnosticos/         # Área Admin (38 templates)
│   │   └── page.tsx
│   │
│   ├── 👨‍💼 /nutri/                      # ÁREA NUTRICIONISTA
│   │   ├── page.tsx                     # Landing Nutri
│   │   ├── dashboard/page.tsx          # Dashboard principal
│   │   ├── ferramentas/
│   │   │   ├── page.tsx                # Lista de ferramentas
│   │   │   ├── nova/page.tsx           # Criar nova ferramenta
│   │   │   └── templates/
│   │   │       └── page.tsx             # 38 templates validados ✅
│   │   ├── leads/page.tsx              # Gestão de leads
│   │   ├── relatorios/page.tsx         # Relatórios e analytics
│   │   ├── cursos/page.tsx             # Meus cursos
│   │   ├── quiz-personalizado/page.tsx  # Criar quiz customizado
│   │   ├── configuracoes/page.tsx      # Configurações do perfil
│   │   └── suporte/page.tsx            # Central de ajuda
│   │
│   ├── 🟢 /wellness/                   # ÁREA WELLNESS (Herbalife)
│   │   ├── page.tsx                     # Landing Wellness
│   │   ├── dashboard/page.tsx          # Dashboard principal
│   │   ├── ferramentas/
│   │   │   ├── page.tsx                # Lista de ferramentas criadas
│   │   │   ├── nova/page.tsx           # Criar novo link
│   │   │   └── [id]/editar/page.tsx    # Editar ferramenta ✅
│   │   ├── templates/
│   │   │   ├── page.tsx                # Lista de templates (13)
│   │   │   ├── imc/page.tsx           # Template: Calculadora IMC
│   │   │   ├── proteina/page.tsx      # Template: Calculadora Proteína
│   │   │   ├── hidratacao/page.tsx     # Template: Calculadora Hidratação
│   │   │   ├── composicao/page.tsx     # Template: Composição Corporal
│   │   │   ├── ganhos/page.tsx        # Template: Quiz Ganhos
│   │   │   ├── potencial/page.tsx      # Template: Quiz Potencial
│   │   │   ├── proposito/page.tsx      # Template: Quiz Propósito
│   │   │   ├── parasitas/page.tsx      # Template: Quiz Parasitas
│   │   │   ├── healthy-eating/page.tsx # Template: Quiz Alimentação
│   │   │   ├── wellness-profile/page.tsx # Template: Quiz Perfil
│   │   │   ├── nutrition-assessment/page.tsx # Template: Avaliação Nutricional
│   │   │   ├── daily-wellness/page.tsx  # Template: Tabela Bem-Estar
│   │   │   └── meal-planner/page.tsx   # Template: Planejador Refeições
│   │   ├── [user-slug]/[tool-slug]/    # Rotas dinâmicas de links personalizados ✅
│   │   │   └── page.tsx
│   │   ├── cursos/page.tsx             # Meus cursos
│   │   ├── configuracao/page.tsx       # Configurações
│   │   ├── quiz-personalizado/page.tsx # Quiz customizado
│   │   └── suporte/page.tsx            # Suporte
│   │
│   ├── 🏋️ /coach/                      # ÁREA COACH
│   │   ├── page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── ferramentas/
│   │   ├── leads/
│   │   └── suporte/page.tsx
│   │
│   ├── 💼 /consultor/                  # ÁREA CONSULTOR
│   │   ├── page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── ferramentas/
│   │   ├── leads/
│   │   └── suporte/page.tsx
│   │
│   ├── 🎨 /templates/                   # Templates públicos (acesso geral)
│   │   └── page.tsx
│   │
│   └── 📝 /como-funciona/              # Página informativa
│       └── page.tsx
│
├── 🌍 /en/                             # Roteamento Inglês
│   ├── page.tsx
│   ├── how-it-works/page.tsx
│   ├── profile-selection/page.tsx
│   └── templates/page.tsx
│
├── 🌎 /es/                             # Roteamento Espanhol
│   ├── page.tsx
│   ├── como-funciona/page.tsx
│   ├── seleccion-perfil/page.tsx
│   └── plantillas/page.tsx
│
├── 🔧 /api/                            # API Routes
│   ├── wellness/ferramentas/
│   │   ├── route.ts                    # CRUD ferramentas Wellness
│   │   ├── check-slug/route.ts         # Validar slug único
│   │   ├── by-url/route.ts             # Buscar por URL
│   │   └── track-view/route.ts         # Tracking visualizações ✅
│   ├── leads/route.ts                  # Gestão de leads
│   ├── quiz/route.ts                   # Quizzes
│   ├── templates/                      # Templates API
│   └── ...outras rotas
│
└── 📱 Outras páginas públicas
    ├── calculadora-imc/page.tsx
    ├── quiz-interativo/page.tsx
    ├── post-curiosidades/page.tsx
    └── template/[id]/page.tsx
```

## 📊 Resumo por Área

### ✅ Área Wellness (COMPLETA)
- **Status:** ✅ Pronta e funcional
- **Templates:** 13 templates funcionais
- **Funcionalidades:**
  - ✅ Dashboard completo
  - ✅ Criar/Editar/Listar ferramentas
  - ✅ 13 templates com componentes compartilhados
  - ✅ Rotas dinâmicas [user-slug]/[tool-slug]
  - ✅ Tracking de visualizações
  - ✅ Sistema de configuração completo
  - ✅ Cursos, Configurações, Suporte

### 🔨 Área Nutri (EM DESENVOLVIMENTO)
- **Status:** 🟡 Em desenvolvimento
- **Templates:** 38 templates validados importados ✅
- **Funcionalidades:**
  - ✅ Dashboard (dados mockados)
  - ✅ Lista de ferramentas (dados mockados)
  - ✅ Criar ferramenta (básico)
  - ✅ **38 templates importados** ✅
  - ✅ Busca e filtros funcionando ✅
  - ⚠️ Leads (página básica)
  - ⚠️ Relatórios (página básica)
  - ⚠️ Falta conectar ao banco

### 🏗️ Áreas Coach e Consultor
- **Status:** 🟡 Estrutura básica
- **Funcionalidades:** Dashboard básico, sem funcionalidades completas

## 🔍 Componentes Compartilhados

```
src/components/
├── wellness/
│   ├── WellnessHeader.tsx      # Header compartilhado ✅
│   ├── WellnessLanding.tsx      # Landing page compartilhada ✅
│   └── WellnessCTAButton.tsx   # Botão CTA compartilhado ✅
├── ChatIA.tsx
├── LanguageSelector.tsx
└── YLADALogo.tsx
```

## 📦 Tipos e Interfaces

```
src/types/
└── wellness.ts                  # Tipos compartilhados Wellness ✅
```

## 🗄️ Banco de Dados

### Tabelas Principais
- `users` - Usuários do sistema
- `user_profiles` - Perfis (nutri, wellness, coach, etc)
- `user_templates` - Ferramentas criadas pelos usuários
- `templates_nutrition` - Templates base (38 templates)
- `wellness_tools` - View para ferramentas Wellness

## 🎯 Padrões Identificados

### ❌ Problemas de Organização
1. **Páginas públicas misturadas:**
   - `calculadora-imc/page.tsx` (público)
   - `quiz-interativo/page.tsx` (público)
   - Deveriam estar em `/pt/` ou `/tools/`

2. **Templates duplicados:**
   - Templates em `/pt/wellness/templates/` (13 funcionais)
   - Templates em `/pt/admin-diagnosticos/` (38 validados)
   - Templates em `/pt/nutri/ferramentas/templates/` (38 importados)

3. **Estrutura inconsistente:**
   - Wellness tem `/ferramentas/nova` e `/ferramentas/[id]/editar`
   - Nutri tem `/ferramentas/nova` mas não tem edição ainda

### ✅ Pontos Positivos
1. **Wellness bem estruturada:** Sistema completo e escalável
2. **Componentes reutilizáveis:** WellnessHeader, WellnessLanding, WellnessCTAButton
3. **Types bem definidos:** `wellness.ts` com interfaces claras
4. **API routes organizadas:** `/api/wellness/ferramentas/` bem estruturado

## 📋 Recomendações

1. **Consolidar templates:** Unificar os 38 templates em um só lugar
2. **Padronizar estrutura:** Nutri deveria seguir o padrão Wellness
3. **Mover páginas públicas:** Criar `/pt/ferramentas/` ou `/tools/` para públicas
4. **Criar sistema de templates unificado:** Um catálogo único para todas as áreas



