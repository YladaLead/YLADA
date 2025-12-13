# 🎯 PLANO ESTRATÉGICO - IMPLEMENTAÇÃO LYA (Mentora das Nutricionistas)
## Análise da Conversa + Plano de Execução Completo

**Data:** Hoje  
**Status:** ✅ Aprovado para implementação  
**Foco:** MVP Funcional da LYA na Área Nutri

---

## 📊 ANÁLISE DA CONVERSA - MINHA OPINIÃO

### ✅ **CONCORDO TOTALMENTE COM:**

1. **Estratégia MVP Primeiro**
   - ✅ Funcionalidade antes de visual
   - ✅ Testar com usuários reais antes de escalar
   - ✅ Uma regra de decisão por vez

2. **Formulário de Diagnóstico Obrigatório**
   - ✅ Essencial para personalização
   - ✅ Campo aberto é genial (captura nuances)
   - ✅ Deve bloquear acesso até completar

3. **Perfil Estratégico Automático**
   - ✅ Converte dados em inteligência
   - ✅ Classifica tipo, nível, foco
   - ✅ Base para todas as decisões da LYA

4. **Condução pelo Próximo Passo**
   - ✅ Não sobrecarregar com opções
   - ✅ Uma ação por vez
   - ✅ Orientar, não mandar

5. **Aprender com NOEL**
   - ✅ Reaproveitar lógica de decisão
   - ✅ Tom acolhedor + firme
   - ✅ Baseado em dados reais

### 🎯 **PONTOS DE ATENÇÃO:**

1. **LYA vs NOEL**
   - NOEL = Execução guiada (operacional)
   - LYA = Decisão estratégica (empresarial)
   - Ambos seguem mesma filosofia, papéis distintos

2. **Campo Aberto é Crítico**
   - Deve influenciar tom, ritmo e prioridade
   - LYA deve reconhecer explicitamente
   - Não pode ser ignorado

3. **Visual Depois**
   - Focar em funcionalidade primeiro
   - Testar com usuários reais
   - Refinar baseado em uso, não opinião

---

## 🚀 PLANO ESTRATÉGICO DE IMPLEMENTAÇÃO

### **FASE 1: FUNDAÇÃO (MVP FUNCIONAL)** ⭐ PRIORIDADE MÁXIMA

**Objetivo:** Fazer a LYA existir e funcionar de verdade

#### **1.1. Formulário de Diagnóstico Obrigatório**

**O que criar:**
- Página `/pt/nutri/onboarding` ou `/pt/nutri/diagnostico`
- Formulário completo com todos os campos
- Bloqueio de acesso até completar
- Salvar em `nutri_diagnostico` (nova tabela ou JSONB em `user_profiles`)

**Campos do Formulário:**

**BLOCO 1 - Perfil Profissional:**
- Tipo de atuação (clínica física, online, híbrida, iniciante, outra)
- Tempo de atuação (menos de 1 ano, 1-3 anos, 3-5 anos, mais de 5 anos)
- Autoavaliação (técnica boa/negócio fraco, técnica boa/negócio razoável, técnica boa/negócio bom, mais empreendedora)

**BLOCO 2 - Momento Atual do Negócio:**
- Situação atual (poucos pacientes, agenda instável, agenda cheia desorganizada, agenda cheia organizada)
- Processos existentes (checklist):
  - Captação de clientes (Sim/Não)
  - Avaliação estruturada (Sim/Não)
  - Fechamento de planos (Sim/Não)
  - Acompanhamento ativo (Sim/Não)

**BLOCO 3 - Objetivo Principal (90 dias):**
- Objetivo (lotar agenda, organizar rotina, vender planos, aumentar faturamento, estruturar negócio, outro)
- Meta financeira mensal (até R$5k, R$5k-10k, R$10k-20k, acima de R$20k)

**BLOCO 4 - Travas e Dificuldades:**
- O que mais trava (multi-select, até 3):
  - Falta de clientes
  - Falta de constância
  - Dificuldade em vender
  - Falta de organização
  - Insegurança
  - Falta de tempo
  - Medo de aparecer
  - Não saber por onde começar

**BLOCO 5 - Tempo, Energia e Disciplina:**
- Tempo disponível por dia (até 30min, 30-60min, 1-2h, mais de 2h)
- Preferência (passo a passo guiado, autonomia com orientação pontual)

**BLOCO 6 - Campo Aberto (OBRIGATÓRIO):**
- "Existe algo importante sobre você, seu momento ou seu negócio que não perguntamos aqui e que a LYA deveria saber para te orientar melhor?"
- Texto livre (mínimo 50 caracteres)

**Implementação Técnica:**
```typescript
// Nova tabela ou coluna JSONB em user_profiles
interface NutriDiagnostico {
  user_id: string
  perfil_profissional: {
    tipo_atuacao: string
    tempo_atuacao: string
    autoavaliacao: string
  }
  momento_negocio: {
    situacao_atual: string
    processos: {
      captacao: boolean
      avaliacao: boolean
      fechamento: boolean
      acompanhamento: boolean
    }
  }
  objetivo: {
    principal: string
    meta_financeira: string
  }
  travas: string[] // array de até 3
  tempo_disciplina: {
    tempo_disponivel: string
    preferencia: string
  }
  campo_aberto: string // texto livre obrigatório
  completed_at: timestamp
}
```

**Bloqueio de Acesso:**
- Verificar `diagnostico_completo = true` em todas as rotas protegidas
- Se `false`, redirecionar para `/pt/nutri/diagnostico`
- Não permitir acesso a outras áreas até completar

#### **1.2. Geração Automática de Perfil Estratégico**

**Função:** `gerarPerfilEstrategico(diagnostico: NutriDiagnostico)`

**Saída:**
```typescript
interface PerfilEstrategico {
  user_id: string
  tipo_nutri: 'iniciante' | 'clinica_construcao' | 'clinica_cheia' | 'online_estrategica' | 'hibrida'
  nivel_empresarial: 'baixo' | 'medio' | 'alto'
  foco_prioritario: 'captacao' | 'organizacao' | 'fechamento' | 'acompanhamento'
  tom_lya: 'acolhedor' | 'firme' | 'estrategico' | 'direto'
  ritmo_conducao: 'guiado' | 'autonomo'
  created_at: timestamp
  updated_at: timestamp
}
```

**Lógica de Classificação:**

**Tipo de Nutri:**
- `iniciante`: tempo_atuacao = "menos de 1 ano" OU situacao = "poucos pacientes"
- `clinica_construcao`: situacao = "agenda instável" OU processos incompletos
- `clinica_cheia`: situacao = "agenda cheia desorganizada"
- `online_estrategica`: tipo_atuacao = "online" + processos completos
- `hibrida`: tipo_atuacao = "híbrida"

**Nível Empresarial:**
- `baixo`: autoavaliacao = "técnica boa/negócio fraco" OU processos < 2
- `medio`: autoavaliacao = "técnica boa/negócio razoável" OU processos = 2-3
- `alto`: autoavaliacao = "técnica boa/negócio bom" OU "mais empreendedora" OU processos = 4

**Foco Prioritário:**
- `captacao`: travas inclui "falta de clientes" OU objetivo = "lotar agenda"
- `organizacao`: travas inclui "falta de organização" OU situacao = "agenda cheia desorganizada"
- `fechamento`: travas inclui "dificuldade em vender" OU objetivo = "vender planos"
- `acompanhamento`: processos.acompanhamento = false OU objetivo = "aumentar faturamento"

**Tom da LYA:**
- Analisar campo_aberto para detectar:
  - Insegurança → `acolhedor`
  - Urgência → `firme`
  - Confusão → `direto`
  - Avançada → `estrategico`

**Ritmo de Condução:**
- Baseado em preferencia do formulário

#### **1.3. Primeira Resposta Automática da LYA**

**Trigger:** `onDiagnosticoCompleto = true`

**O que a LYA deve fazer:**
1. Reconhecer explicitamente o campo aberto
2. Definir foco principal baseado no perfil estratégico
3. Sugerir 1 ação prática única
4. Indicar link interno exato
5. Definir 1 métrica simples

**Exemplo de Resposta:**
```
"Olá! Li o que você escreveu e isso é importante para a forma como vou te conduzir aqui.

Seu foco agora é [CAPTAÇÃO/ORGANIZAÇÃO/FECHAMENTO/ACOMPANHAMENTO].

Hoje, [AÇÃO PRÁTICA ÚNICA].

Isso destrava [BENEFÍCIO ESPECÍFICO].

Acesse: [LINK INTERNO EXATO]

Meta: [MÉTRICA SIMPLES] até [PRAZO]."
```

**Salvar em:**
- Tabela `lya_analise_atual` ou coluna JSONB em `user_profiles`
- Atualizar quando nutri executa ação ou 1x por dia

#### **1.4. Bloco Fixo "Análise da LYA Hoje"**

**Onde:** Home (`/pt/nutri/home`)

**O que:**
- Card simples (sem visual refinado)
- Texto vindo de `lya_analise_atual`
- Botão "Ir para ação" (link interno)
- Atualiza quando:
  - Nutri executa a ação sugerida
  - Ou 1x por dia (verificar se precisa atualizar)

**Implementação:**
```tsx
// Componente simples na home
<LyaAnaliseHoje />
```

#### **1.5. Regra Única de Decisão (MVP)**

**Regra:**
```
SE jornada_nao_iniciada
→ LYA sempre orienta: "Inicie o Dia 1 da Jornada"
→ Link: /pt/nutri/metodo/jornada/dia/1
```

**Implementação:**
- Verificar se `jornada_dia_atual = null`
- Se sim, LYA sempre sugere Dia 1
- Não criar outras regras ainda

---

### **FASE 2: INTEGRAÇÃO COM ÁREAS EXISTENTES** ⏳ DEPOIS DO MVP

#### **2.1. LYA + Jornada 30 Dias**
- Detectar progresso
- Identificar abandono
- Retomar do ponto de parada

#### **2.2. LYA + Pilares**
- Sugerir pilar baseado em foco prioritário
- Contextualizar conteúdo

#### **2.3. LYA + Ferramentas**
- Sugerir ferramenta específica
- Guiar criação passo a passo

#### **2.4. LYA + GSAL**
- Ler status (leads, avaliações, planos, acompanhamento)
- Sugerir próximos passos baseado em gaps

---

### **FASE 3: INTELIGÊNCIAS AVANÇADAS** ⏳ DEPOIS DE TESTES

#### **3.1. Leitura de Comportamento**
- Detectar uso/não uso das áreas
- Identificar padrões

#### **3.2. Ajustes Automáticos de Rota**
- Mudar foco se necessário
- Adaptar ritmo

#### **3.3. Mensagens Proativas**
- Lembretes inteligentes
- Motivação contextual

#### **3.4. Análise de Anotações**
- Ler anotações da nutri
- Extrair insights
- Sugerir ações

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **MVP (Fase 1) - OBRIGATÓRIO**

**Backend:**
- [ ] Criar tabela `nutri_diagnostico` ou coluna JSONB
- [ ] Criar tabela `nutri_perfil_estrategico` ou coluna JSONB
- [ ] Criar tabela `lya_analise_atual` ou coluna JSONB
- [ ] Função `gerarPerfilEstrategico()`
- [ ] API `/api/nutri/diagnostico` (POST para salvar)
- [ ] API `/api/nutri/perfil-estrategico` (GET)
- [ ] API `/api/nutri/lya/analise` (GET, POST)
- [ ] Verificação de `diagnostico_completo` em rotas protegidas

**Frontend:**
- [ ] Página `/pt/nutri/diagnostico` (formulário completo)
- [ ] Bloqueio de acesso até completar diagnóstico
- [ ] Componente `LyaAnaliseHoje` na home
- [ ] Integração com OpenAI para gerar resposta da LYA
- [ ] Exibir primeira resposta após diagnóstico

**Lógica:**
- [ ] Prompt-mestre da LYA (baseado na conversa)
- [ ] Regra única: Jornada não iniciada → Dia 1
- [ ] Interpretação do campo aberto
- [ ] Classificação automática de perfil

**Testes:**
- [ ] Testar com você mesmo
- [ ] Testar com 2-3 nutricionistas reais
- [ ] Observar onde travam
- [ ] Observar onde executam
- [ ] Observar onde ignoram a LYA

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### **1. Criar Estrutura de Dados**
- Definir schema das tabelas
- Criar migrations
- Definir tipos TypeScript

### **2. Criar Formulário de Diagnóstico**
- Página completa
- Validação de campos
- Bloqueio de acesso
- Salvar no banco

### **3. Implementar Geração de Perfil**
- Função de classificação
- Salvar perfil estratégico
- Testar lógica

### **4. Integrar OpenAI para LYA**
- Prompt-mestre
- Primeira resposta automática
- Salvar análise

### **5. Criar Bloco na Home**
- Componente simples
- Buscar análise atual
- Exibir e atualizar

---

## ⚠️ REGRAS IMPORTANTES

### **O QUE FAZER:**
✅ MVP funcional primeiro  
✅ Testar com usuários reais  
✅ Uma regra de decisão por vez  
✅ Campo aberto é obrigatório e crítico  
✅ LYA reconhece campo aberto explicitamente  
✅ Uma ação por vez, não excesso  
✅ Aprender com experiência NOEL  

### **O QUE NÃO FAZER:**
❌ Redesenhar visual agora  
❌ Criar múltiplas automações de uma vez  
❌ Ignorar campo aberto  
❌ Sobrecarregar com opções  
❌ Competir com o método  
❌ Gerar dependência emocional  

---

## 📊 MÉTRICAS DE SUCESSO (MVP)

**Após implementação:**
1. Nutricionistas completam diagnóstico? (meta: 100%)
2. LYA gera resposta relevante? (meta: 80%+ satisfação)
3. Nutricionistas executam ação sugerida? (meta: 60%+)
4. Redução de abandono? (comparar antes/depois)
5. Tempo até primeira ação? (meta: < 24h)

---

## 🎓 REFERÊNCIAS

- **NOEL (Wellness):** Experiência de onboarding e condução
- **Análise Completa Área Nutri:** Documento com toda estrutura
- **Conversa ChatGPT:** Estratégia e filosofia da LYA

---

**Status:** ✅ Plano aprovado e pronto para implementação  
**Próximo passo:** Entregar pacote de implementação para Claude

