# 🚀 PLANO DE INÍCIO - SISTEMA DE FEATURES/MÓDULOS
## Para Áreas Nutri, Coach e Nutra (Novas)

> **Contexto:** Não há migração de usuários. Todas as áreas são novas ou terão novos usuários apenas.

---

## 📋 SITUAÇÃO ATUAL

- ✅ Área Nutri: Existe mas pode ser ajustada
- ✅ Área Coach: Existe mas pode ser ajustada  
- ⏳ Área Nutra: Ainda não foi feita
- ✅ Estrutura de assinaturas existe
- ❌ Sistema de features/módulos não existe

---

## 🎯 OBJETIVO

Criar estrutura de features/módulos **do zero** para permitir:
- Planos separados (Gestão, Ferramentas, Cursos, Completo)
- Acesso granular por funcionalidade
- Escalável para futuras expansões

---

## 📊 ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

### **FASE 0: Estrutura Base (ANTES DE TUDO)** ⭐
**Tempo:** 4-6 horas  
**Prioridade:** ALTA

#### Por que fazer primeiro?
- ✅ Base para tudo que vem depois
- ✅ Não precisa refatorar depois
- ✅ Cursos já nascem com estrutura correta
- ✅ Baixo risco (só adiciona, não quebra)

#### O que fazer:

1. **Adicionar Campo `features` na Tabela `subscriptions`**
   ```sql
   -- migrations/add-features-to-subscriptions.sql
   ALTER TABLE subscriptions
   ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '["completo"]'::jsonb;
   
   CREATE INDEX IF NOT EXISTS idx_subscriptions_features 
     ON subscriptions USING GIN (features);
   ```

2. **Criar Helper `hasFeatureAccess()`**
   ```typescript
   // src/lib/feature-helpers.ts
   export async function hasFeatureAccess(
     userId: string,
     area: 'nutri' | 'coach' | 'nutra',
     feature: 'gestao' | 'ferramentas' | 'cursos' | 'completo'
   ): Promise<boolean> {
     // Verificar se tem feature específica OU 'completo'
   }
   ```

3. **Atualizar `hasActiveSubscription()` para incluir features**
   - Manter compatibilidade com código existente
   - Adicionar verificação de features opcional

4. **Criar Componente `RequireFeature`**
   ```typescript
   // src/components/auth/RequireFeature.tsx
   <RequireFeature area="nutri" feature="cursos">
     <CursosPage />
   </RequireFeature>
   ```

5. **Testar com usuário de teste**
   - Criar assinatura com features específicas
   - Testar acesso

**✅ Resultado:** Estrutura pronta, mas não usada ainda (não quebra nada)

---

### **FASE 1: Implementar Cursos Nutri** ⭐⭐
**Tempo:** 30 horas (já planejado)  
**Prioridade:** ALTA

#### O que fazer:

1. **Seguir plano de cursos já criado**
   - Usar estrutura de features para restringir acesso
   - Verificar: `hasFeatureAccess(userId, 'nutri', 'cursos')` OU `plan_type = 'annual'`

2. **Checkout de Cursos**
   - Criar plano específico "Só Cursos"
   - Features: `['cursos']`
   - Preço: Definir

3. **Checkout Completo**
   - Features: `['completo']`
   - Inclui tudo

**✅ Resultado:** Cursos funcionando com sistema de features

---

### **FASE 2: Implementar Cursos Coach** ⭐
**Tempo:** 20 horas (reutilizar código Nutri)  
**Prioridade:** MÉDIA

#### O que fazer:

1. **Duplicar estrutura de cursos Nutri para Coach**
   - Reutilizar componentes
   - Adaptar APIs
   - Mesma lógica de features

**✅ Resultado:** Coach com cursos também

---

### **FASE 3: Criar Área Nutra do Zero** ⭐⭐
**Tempo:** 40-50 horas  
**Prioridade:** ALTA (se for próxima área)

#### O que fazer:

1. **Criar estrutura completa Nutra**
   - Duplicar de Coach/Nutri
   - Ajustar para Nutra
   - Já com sistema de features integrado

2. **Checkout Nutra**
   - Planos com features desde o início
   - Gestão, Ferramentas, Cursos, Completo

**✅ Resultado:** Nutra completa com features desde o início

---

### **FASE 4: Planos Separados (Opcional - Depois)** ⭐
**Tempo:** 20-30 horas  
**Prioridade:** BAIXA (quando houver demanda)

#### O que fazer:

1. **Adicionar planos Gestão e Ferramentas**
   - Checkout com seleção de features
   - Preços específicos
   - Upgrade entre planos

**✅ Resultado:** Sistema completo de planos modulares

---

## 🎯 POR ONDE COMEÇAR AGORA?

### **RECOMENDAÇÃO: FASE 0 + FASE 1 (Cursos Nutri)**

**Ordem:**

1. **FASE 0: Estrutura Base** (4-6h)
   - Adicionar campo `features`
   - Criar helpers
   - Criar componente `RequireFeature`
   - ✅ **Não quebra nada existente**

2. **FASE 1: Cursos Nutri** (30h)
   - Implementar área de cursos
   - Usar features para restringir acesso
   - Checkout com opção "Só Cursos" e "Completo"

**Total:** ~35 horas (5-6 dias)

---

## 📝 CHECKLIST DE INÍCIO

### Antes de começar:

- [ ] Decidir preços:
  - [ ] Plano "Só Cursos": R$ ?
  - [ ] Plano "Completo": R$ ?
- [ ] Definir features:
  - [ ] `gestao` = CRM, Agenda, Clientes, Relatórios
  - [ ] `ferramentas` = Quizzes, Calculadoras, Links
  - [ ] `cursos` = Formação Empresarial
  - [ ] `completo` = Tudo acima
- [ ] Validar estrutura atual:
  - [ ] Tabela `subscriptions` existe
  - [ ] Helpers de assinatura funcionam
  - [ ] Área Nutri existe

### Durante implementação:

- [ ] FASE 0: Estrutura base
  - [ ] Campo `features` adicionado
  - [ ] Helper `hasFeatureAccess()` criado
  - [ ] Componente `RequireFeature` criado
  - [ ] Testado com usuário de teste
- [ ] FASE 1: Cursos Nutri
  - [ ] Estrutura de cursos implementada
  - [ ] Restrição por feature funcionando
  - [ ] Checkout com features
  - [ ] Testado end-to-end

---

## 🔧 ESTRUTURA TÉCNICA

### Banco de Dados

```sql
-- subscriptions.features será JSONB
-- Exemplos:
-- ["completo"]
-- ["cursos"]
-- ["gestao", "ferramentas"]
-- ["gestao", "cursos"]
```

### Helpers

```typescript
// Verificar se tem acesso a feature específica
hasFeatureAccess(userId, 'nutri', 'cursos')

// Verificar se tem acesso a qualquer feature
hasAnyFeature(userId, 'nutri', ['gestao', 'ferramentas'])

// Verificar se tem acesso completo
hasCompleteAccess(userId, 'nutri')
```

### Componentes

```typescript
// Proteger rota por feature
<RequireFeature area="nutri" feature="cursos">
  <CursosPage />
</RequireFeature>

// Proteger rota por múltiplas features
<RequireAnyFeature area="nutri" features={['gestao', 'ferramentas']}>
  <FerramentasPage />
</RequireAnyFeature>
```

---

## ⚠️ PONTOS DE ATENÇÃO

1. **Não quebrar áreas existentes**
   - Wellness não usa features (por enquanto)
   - Manter compatibilidade

2. **Valores padrão**
   - Assinaturas antigas (se houver) = `['completo']`
   - Novas assinaturas = definir no checkout

3. **Testes**
   - Testar cada feature isoladamente
   - Testar combinações
   - Testar upgrade

---

## ✅ CONCLUSÃO

**Começar por:**
1. ✅ FASE 0: Estrutura Base (4-6h)
2. ✅ FASE 1: Cursos Nutri (30h)

**Total:** ~35 horas

**Vantagens:**
- ✅ Base sólida desde o início
- ✅ Cursos já nascem com features
- ✅ Não quebra nada existente
- ✅ Preparado para expansão futura

**Próximos passos:**
- Coach: Reutilizar código Nutri
- Nutra: Criar do zero já com features
- Planos separados: Quando houver demanda

---

## 🚀 PRÓXIMA AÇÃO

**Implementar FASE 0 agora:**
1. Criar migration SQL
2. Criar helpers TypeScript
3. Criar componente RequireFeature
4. Testar

**Depois:** Seguir com FASE 1 (Cursos Nutri)

