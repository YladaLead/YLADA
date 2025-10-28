# Refatoração: Estrutura Modular por Perfil

## Problema Atual
- Estrutura plana dificulta localização de erros
- Nomenclatura inconsistente entre arquivos
- Conflitos ao compartilhar código entre perfis
- Difícil identificar origem de problemas

## Nova Estrutura Proposta

```
src/
├── app/
│   ├── pt/
│   │   ├── [profiles]/
│   │   │   ├── nutri/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── ferramentas/
│   │   │   │   │   ├── nova/
│   │   │   │   │   ├── templates/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── leads/
│   │   │   │   ├── relatorios/
│   │   │   │   ├── suporte/
│   │   │   │   └── page.tsx
│   │   │   ├── consultor/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── ferramentas/
│   │   │   │   ├── leads/
│   │   │   │   ├── suporte/
│   │   │   │   └── page.tsx
│   │   │   ├── coach/
│   │   │   │   └── [igual estrutura acima]
│   │   │   └── wellness/
│   │   │       └── [igual estrutura acima]
│   │   └── [shared]/
│   │       ├── templates/
│   │       ├── como-funciona/
│   │       └── escolha-perfil/
│   ├── api/
│   │   ├── [profiles]/
│   │   │   ├── nutri/
│   │   │   ├── consultor/
│   │   │   ├── coach/
│   │   │   └── wellness/
│   │   └── [shared]/
│   │       ├── ylada-assistant/
│   │       └── quiz/
│   └── components/
│       ├── [profiles]/
│       │   ├── nutri/
│       │   │   ├── DashboardCard.tsx
│       │   │   └── StatsWidget.tsx
│       │   ├── consultor/
│       │   ├── coach/
│       │   └── wellness/
│       └── [shared]/
│           ├── ChatInterface.tsx
│           └── YLADALogo.tsx
├── lib/
│   ├── [profiles]/
│   │   ├── nutri/
│   │   │   ├── nutri-service.ts
│   │   │   └── nutri-queries.ts
│   │   ├── consultor/
│   │   │   ├── consultor-service.ts
│   │   │   └── consultor-queries.ts
│   │   ├── coach/
│   │   │   ├── coach-service.ts
│   │   │   └── coach-queries.ts
│   │   └── wellness/
│   │       ├── wellness-service.ts
│   │       └── wellness-queries.ts
│   ├── [shared]/
│   │   ├── supabase.ts
│   │   ├── openai-assistant-specialized.ts
│   │   └── quiz-db.ts
│   └── [types]/
│       ├── nutri.types.ts
│       ├── consultor.types.ts
│       ├── coach.types.ts
│       └── wellness.types.ts
└── database/
    └── schemas/
        ├── core/
        │   ├── users.schema.sql
        │   ├── profiles.schema.sql
        │   └── auth.schema.sql
        ├── features/
        │   ├── templates.schema.sql
        │   ├── leads.schema.sql
        │   └── quizzes.schema.sql
        └── profiles/
            ├── nutri.schema.sql
            ├── consultor.schema.sql
            ├── coach.schema.sql
            └── wellness.schema.sql
```

## Padronização de Nomenclatura Supabase

### Tabelas Core (Compartilhadas)
```sql
-- Sistema básico
auth_users (Supabase padrão)
ylada_users (extensão)
ylada_user_profiles (perfis profissionais)

-- Features gerais
ylada_templates (templates base)
ylada_user_templates (templates personalizados)
ylada_leads (leads capturados)
ylada_quizzes (quizzes personalizados)
```

### Tabelas por Perfil
```sql
-- Perfil Nutri
ylada_nutri_templates
ylada_nutri_leads
ylada_nutri_configs

-- Perfil Consultor
ylada_consultor_templates
ylada_consultor_leads
ylada_consultor_configs

-- Perfil Coach
ylada_coach_templates
ylada_coach_leads
ylada_coach_configs

-- Perfil Wellness
ylada_wellness_templates
ylada_wellness_leads
ylada_wellness_configs
```

## Benefícios

### 1. Clareza de Erros
- Saber exatamente onde está o problema (`/lib/nutri/nutri-service.ts`)
- Stack trace mais legível
- Debugging mais rápido

### 2. Isolamento de Conflitos
- Cada perfil tem seu próprio módulo
- Mudanças em um perfil não afetam outros
- Testes isolados por perfil

### 3. Manutenção Simplificada
- Código organizado por contexto
- Onboarding de novos devs mais rápido
- Refatoração mais segura

### 4. Escalabilidade
- Adicionar novos perfis é simples
- Fácil identificar dependências
- Performance melhor com lazy loading

## Migração

### Fase 1: Criar nova estrutura (não quebra nada)
1. Criar novas pastas `[profiles]/` e `[shared]/`
2. Mover arquivos gradualmente
3. Manter compatibilidade com estrutura antiga

### Fase 2: Atualizar imports
1. Atualizar imports para nova estrutura
2. Verificar que tudo funciona
3. Remover código antigo

### Fase 3: Otimizar
1. Lazy loading de módulos
2. Otimizar bundles
3. Melhorar performance

## Conclusão

Esta refatoração:
- Separa responsabilidades por perfil
- Torna erros mais fácil de localizar
- Facilita manutenção e evolução
- Melhora performance com lazy loading
- Permite escalar para novos perfis

