# 🎯 PROJETO - Reformulação Completa da Área Wellness

## 📋 Objetivo

Simplificar e otimizar a experiência dos usuários Wellness, tornando o sistema mais intuitivo, prático e eficiente.

---

## 🎯 PROBLEMAS IDENTIFICADOS

1. **Dificuldade com customização de links**
   - Usuários têm dificuldade para customizar links
   - Processo confuso e complexo

2. **Interface complexa**
   - Muitas opções confundem usuários
   - Falta de clareza no fluxo

3. **Falta de direcionamento**
   - Usuários não sabem por onde começar
   - Não há conexão entre objetivos e ferramentas

---

## ✅ SOLUÇÕES PROPOSTAS

### **1. Links Padrão e Fixos**

#### **Como funciona:**
- Cada usuário tem um `user_slug` único (nome-sobrenome)
- Links são gerados automaticamente: `/wellness/[user-slug]/[nome-ferramenta]`
- **Exemplo:** `/wellness/joao-silva/calculadora-agua`
- Sem customização (exceto Quiz Personalizado)

#### **Slug (user_slug):**
- **Formato:** `nome-sobrenome` (ex: `joao-silva`, `maria-santos`)
- **Validação:**
  - Apenas letras, números e hífens
  - Sem espaços ou caracteres especiais
  - Verificar disponibilidade em tempo real
  - Sugerir alternativas se ocupado
- **Preview:** Mostrar URL completa antes de confirmar
- **Campo no perfil:** "Como vai aparecer" mostrando preview

#### **Compatibilidade:**
- Links antigos continuam funcionando
- Sistema suporta ambos os formatos
- Migração gradual (se necessário)

---

### **2. Remover Customização de Ferramentas**

#### **O que muda:**
- ❌ Remover opção de customizar links das ferramentas
- ✅ Manter customização apenas para "Quiz Personalizado"
- ✅ Todas as outras ferramentas são padrão

#### **Exceção:**
- Quiz Personalizado ainda permite customização completa

---

### **3. Remover Portal do Bem-Estar**

#### **Ação:**
- Provisoriamente remover funcionalidade
- Pode ser reativado no futuro se necessário

---

### **4. Nova Interface Simplificada**

#### **Estrutura da Primeira Tela:**

```
┌─────────────────────────────────────────────┐
│  PAINEL WELLNESS                            │
├─────────────────────────────────────────────┤
│                                             │
│  🎯 SEUS OBJETIVOS                          │
│  ┌───────────────────────────────────────┐ │
│  │ Objetivo: Vender mais                 │ │
│  │ Meta PV: 1.000                        │ │
│  │ Progresso: 650/1.000 (65%)            │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  📅 SUA FASE                                │
│  ┌───────────────────────────────────────┐ │
│  │ Fase 2 - Desenvolvimento              │ │
│  │ Dia 25 de 90                          │ │
│  │ [Ver plano do dia]                    │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  📊 SUAS FERRAMENTAS                        │
│  (Organizadas por objetivo)                 │
│                                             │
│  💧 Para Vendas                             │
│  ┌───────────────────────────────────────┐ │
│  │ 💧 Calculadora de Água                 │ │
│  │ Link: ylada.app/w/joao/agua           │ │
│  │ [Preview] [Scripts] [QR Code] [Link]  │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 📋 Quiz de Bem-Estar                   │ │
│  │ Link: ylada.app/w/joao/quiz            │ │
│  │ [Preview] [Scripts] [QR Code] [Link]  │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  👥 Para Recrutamento                       │
│  ┌───────────────────────────────────────┐ │
│  │ 🎯 Quiz de Potencial                   │ │
│  │ Link: ylada.app/w/joao/potencial       │ │
│  │ [Preview] [Scripts] [QR Code] [Link]  │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  📝 SEÇÃO DE SCRIPTS                        │
│  (Para quem não conhece)                    │
│  - Como usar cada ferramenta                │
│  - Scripts de abertura prontos             │
│  - Fluxo passo a passo                     │
│                                             │
└─────────────────────────────────────────────┘
```

#### **Funcionalidades por Ferramenta:**
1. **Preview:** Visual da ferramenta
2. **Link:** Link completo (pré-formatado)
3. **Link Curto:** Versão curta (ex: `ylada.app/w/abc123`)
4. **QR Code:** Gerar e baixar QR Code
5. **Scripts:** Scripts de abertura prontos
6. **CTA:** Configuração do CTA pós-resultado

---

### **5. CTA Estratégico Pós-Resultado**

#### **O que é:**
- Botão que aparece DEPOIS que a pessoa preencheu a ferramenta
- Aparece após mostrar o resultado/diagnóstico

#### **Estrutura:**
```
[Resultado da ferramenta mostrado]
"Você precisa beber 2,5 litros de água por dia"

[Mensagem acima do botão - opcional]
"Melhore sua hidratação"

[Botão CTA]
"Saiba como melhorar sua hidratação"
```

#### **Configuração por ferramenta:**
- **Calculadora de Água:**
  - Mensagem: "Melhore sua hidratação"
  - Botão: "Saiba como melhorar sua hidratação"
  - Ação: Abre WhatsApp com mensagem pré-formatada

- **Quiz de Bem-Estar:**
  - Mensagem: "Descubra mais sobre bem-estar"
  - Botão: "Fale comigo sobre seus resultados"
  - Ação: Abre WhatsApp

#### **Contexto:**
- Distribuidor Herbalife compartilhou o link
- Pessoa preencheu e viu resultado
- CTA direciona para próximo passo (contato, produto, etc.)
- Mensagem adequada ao contexto Herbalife

---

### **6. Links Curtos e QR Code**

#### **Links Curtos:**
- Formato: `ylada.app/w/[codigo-curto]`
- Exemplo: `ylada.app/w/abc123` → redireciona para link completo
- Mais fácil de compartilhar
- Pode ter analytics

#### **QR Code:**
- Gerar automaticamente para cada link
- Download para impressão/compartilhamento
- Útil para eventos presenciais
- Incluir logo/branding

---

### **7. Objetivos e Fases na Primeira Tela**

#### **Seção de Objetivos:**
- Mostrar objetivo principal do usuário
- Metas (PV, vendas, equipe)
- Progresso visual
- Atualização em tempo real

#### **Seção de Fase:**
- Mostrar fase atual (Fase 1, 2, 3, 4)
- Dia atual do plano (ex: Dia 25 de 90)
- Link para ver plano do dia
- Progresso da fase

#### **Organização de Ferramentas:**
- Agrupar por objetivo:
  - Para Vendas
  - Para Recrutamento
  - Para Acompanhamento
- Sugerir ferramentas baseadas na fase atual
- Preparado para integração com NOEL

---

## 📊 ESTRUTURA DE DADOS

### **Tabela: `wellness_noel_profile`**
```sql
-- Já existe (criada no onboarding)
-- Adicionar campos se necessário
```

### **Tabela: `user_profiles`**
```sql
-- Adicionar/ajustar:
- user_slug (nome-sobrenome)
- slug_validado (boolean)
- slug_preview (text) -- mostrar antes de confirmar
```

### **Tabela: Links Curtos (nova)**
```sql
CREATE TABLE wellness_short_links (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  tool_id UUID REFERENCES coach_user_templates(id),
  short_code TEXT UNIQUE, -- ex: "abc123"
  full_url TEXT,
  qr_code_url TEXT,
  created_at TIMESTAMPTZ,
  clicks INTEGER DEFAULT 0
);
```

### **Tabela: CTAs por Ferramenta (nova)**
```sql
CREATE TABLE wellness_tool_ctas (
  id UUID PRIMARY KEY,
  tool_slug TEXT, -- ex: "calculadora-agua"
  pre_message TEXT, -- "Melhore sua hidratação"
  button_text TEXT, -- "Saiba como melhorar"
  action_type TEXT, -- "whatsapp", "link", "form"
  action_value TEXT, -- URL ou número WhatsApp
  created_at TIMESTAMPTZ
);
```

---

## 🗂️ ARQUIVOS A MODIFICAR

### **Backend:**
1. `src/app/api/wellness/profile/route.ts`
   - Adicionar validação de slug
   - Preview de URL
   - Verificação de disponibilidade

2. `src/app/api/wellness/ferramentas/[id]/route.ts`
   - Remover customização de links
   - Gerar links automáticos baseados em slug

3. `src/app/api/wellness/short-links/route.ts` (NOVO)
   - Criar links curtos
   - Redirecionamento
   - Analytics

4. `src/app/api/wellness/qr-code/route.ts` (NOVO)
   - Gerar QR Code
   - Download

5. `src/app/api/wellness/tool-cta/route.ts` (NOVO)
   - Gerenciar CTAs por ferramenta

### **Frontend:**
1. `src/app/pt/wellness/dashboard/page.tsx`
   - Nova interface simplificada
   - Seção de objetivos
   - Seção de fase
   - Lista de ferramentas

2. `src/app/pt/wellness/configuracao/page.tsx`
   - Campo de slug com validação
   - Preview de URL
   - Regras de validação

3. `src/app/pt/wellness/ferramentas/[id]/page.tsx`
   - Remover customização
   - Mostrar link pré-formatado
   - Botões: Preview, Scripts, QR Code, Link

4. `src/components/wellness/WellnessToolCard.tsx` (NOVO)
   - Card de ferramenta com todas as opções

5. `src/components/wellness/WellnessCTAButton.tsx`
   - Ajustar para usar CTA configurado
   - Mensagem + botão estratégico

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: Preparação**
- [ ] Criar documento de projeto (este arquivo)
- [ ] Mapear todas as mudanças
- [ ] Definir estrutura de dados
- [ ] Planejar migração de links antigos

### **Fase 2: Backend - Slug e Validação**
- [ ] Adicionar validação de slug no perfil
- [ ] Implementar preview de URL
- [ ] Verificação de disponibilidade em tempo real
- [ ] Sugestão de alternativas

### **Fase 3: Backend - Links Automáticos**
- [ ] Remover customização de links
- [ ] Gerar links automáticos baseados em slug
- [ ] Manter compatibilidade com links antigos

### **Fase 4: Backend - Links Curtos e QR Code**
- [ ] Criar tabela de links curtos
- [ ] API para criar links curtos
- [ ] API para gerar QR Code
- [ ] Redirecionamento de links curtos

### **Fase 5: Backend - CTAs**
- [ ] Criar tabela de CTAs
- [ ] API para gerenciar CTAs
- [ ] Integração com ferramentas

### **Fase 6: Frontend - Nova Interface**
- [ ] Redesenhar dashboard
- [ ] Adicionar seção de objetivos
- [ ] Adicionar seção de fase
- [ ] Lista de ferramentas organizadas

### **Fase 7: Frontend - Ferramentas**
- [ ] Remover customização
- [ ] Mostrar links pré-formatados
- [ ] Botões: Preview, Scripts, QR Code, Link
- [ ] Integração com CTAs

### **Fase 8: Frontend - Perfil**
- [ ] Campo de slug com validação
- [ ] Preview de URL
- [ ] Regras de validação visíveis

### **Fase 9: Testes**
- [ ] Testar fluxo completo
- [ ] Validar links antigos
- [ ] Testar links curtos
- [ ] Testar QR Codes
- [ ] Testar CTAs

### **Fase 10: Documentação**
- [ ] Atualizar documentação
- [ ] Criar guia para usuários
- [ ] Documentar APIs novas

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Criar documento de projeto (FEITO)
2. ⏳ Aguardar confirmação para começar
3. ⏳ Implementar Fase 1
4. ⏳ Testar e ajustar
5. ⏳ Continuar fases seguintes

---

## 📝 NOTAS IMPORTANTES

- **Não fazer commits** até autorização
- **Trabalhar passo a passo**
- **Testar cada fase antes de continuar**
- **Manter compatibilidade com links antigos**
- **Preparar para integração com NOEL**

---

**Status:** 📋 Projeto planejado e pronto para implementação

**Data:** 2025-01-XX





