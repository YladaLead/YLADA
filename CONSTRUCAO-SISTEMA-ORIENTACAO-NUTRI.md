# 🏗️ CONSTRUÇÃO: Sistema de Orientação Técnica - YLADA NUTRI

## 📋 Visão Geral

Sistema completo de orientação técnica para a área Nutri, similar ao Wellness, mas adaptado para as funcionalidades específicas da Nutri-Empresária.

**Data de Início:** 03/12/2025  
**Status:** 🚧 Em Construção  
**Área:** Nutri  
**Base:** Sistema Wellness (já implementado)

---

## 🎯 Objetivo

Criar um sistema de orientação técnica que:
- ✅ Responda dúvidas técnicas sobre funcionalidades
- ✅ Forneça passo a passo detalhado
- ✅ Integre com IA (OpenAI) como fallback
- ✅ Seja visualmente atraente e profissional
- ✅ Oriente sobre trilhas de aprendizado
- ✅ Sugira percursos personalizados

---

## 📊 Estrutura de Funcionalidades Nutri

### **1. GESTÃO GSAL** 📊
- Painel GSAL
- Leads (captação e conversão)
- Clientes (cadastro, lista, Kanban)
- Acompanhamento (evolução, histórico)
- Rotina Mínima (painel diário)
- Métricas e Relatórios

### **2. FERRAMENTAS PROFISSIONAIS** 🧰
- Meus Links (ferramentas criadas)
- Criar Fluxo
- Criar Quiz
- Templates (38 templates validados)
- Quizzes (gerenciar)

### **3. FORMAÇÃO EMPRESARIAL NUTRI** 🎓
- Jornada 30 Dias
- Pilares do Método
- Biblioteca/Manual
- Minhas Anotações
- Certificados

### **4. CONFIGURAÇÕES** ⚙️
- Perfil
- Assinatura
- Integrações
- Notificações

### **5. SUPORTE** 💬
- Chat de Suporte
- Tickets
- FAQ

---

## 🗺️ Mapeamento de Funcionalidades

### **FASE 1: Gestão GSAL** ⏳

#### **Leads**
- [ ] Ver Leads
- [ ] Converter Lead em Cliente
- [ ] Filtrar Leads
- [ ] Histórico de Leads

#### **Clientes**
- [ ] Cadastrar Novo Cliente
- [ ] Ver Lista de Clientes
- [ ] Kanban de Clientes
- [ ] Editar Cliente
- [ ] Ver Histórico do Cliente
- [ ] Buscar Cliente

#### **Acompanhamento**
- [ ] Ver Evolução do Cliente
- [ ] Adicionar Anotação
- [ ] Ver Histórico Completo
- [ ] Agendar Consulta

#### **Rotina Mínima**
- [ ] Acessar Painel Diário
- [ ] Ver Tarefas do Dia
- [ ] Marcar Tarefas Concluídas

#### **Métricas**
- [ ] Ver Relatórios GSAL
- [ ] Exportar Dados
- [ ] Análise de Performance

---

### **FASE 2: Ferramentas** ⏳

#### **Links e Ferramentas**
- [ ] Ver Minhas Ferramentas
- [ ] Criar Nova Ferramenta
- [ ] Editar Ferramenta
- [ ] Compartilhar Link
- [ ] Ver Estatísticas

#### **Quizzes**
- [ ] Ver Meus Quizzes
- [ ] Criar Quiz
- [ ] Editar Quiz
- [ ] Ver Resultados

#### **Templates**
- [ ] Ver Templates Disponíveis
- [ ] Usar Template
- [ ] Personalizar Template

#### **Fluxos**
- [ ] Criar Fluxo
- [ ] Editar Fluxo
- [ ] Ver Fluxos Criados

---

### **FASE 3: Formação Empresarial** ⏳

#### **Jornada 30 Dias**
- [ ] Acessar Jornada
- [ ] Ver Progresso
- [ ] Completar Etapas
- [ ] Ver Conteúdo

#### **Pilares do Método**
- [ ] Ver Pilares
- [ ] Estudar Pilar
- [ ] Aplicar Conceitos

#### **Biblioteca**
- [ ] Acessar Biblioteca
- [ ] Buscar Material
- [ ] Baixar Conteúdo

#### **Anotações**
- [ ] Criar Anotação
- [ ] Ver Anotações
- [ ] Editar Anotação

#### **Certificados**
- [ ] Ver Certificados
- [ ] Baixar Certificado

---

### **FASE 4: Configurações** ⏳

#### **Perfil**
- [ ] Editar Perfil
- [ ] Atualizar Foto
- [ ] Mudar Senha

#### **Assinatura**
- [ ] Ver Assinatura
- [ ] Gerenciar Pagamento
- [ ] Ver Histórico

---

## 🤖 Chatbots Nutri

### **1. Assistente de Formação** 🎓
- **Nome:** Assistente de Formação
- **Foco:** Jornada 30 Dias, Pilares, Biblioteca, Formação Empresarial
- **Cor:** Azul (#2563EB)
- **Emoji:** 🎓

**Pode ajudar com:**
- Como acessar a Jornada 30 Dias
- Onde estão os Pilares do Método
- Como usar a Biblioteca
- Como criar anotações
- Como acessar certificados

### **2. Suporte Técnico GSAL** 📊
- **Nome:** Suporte GSAL
- **Foco:** Gestão, Leads, Clientes, Kanban, Ferramentas
- **Cor:** Verde (#16A34A)
- **Emoji:** 📊

**Pode ajudar com:**
- Como gerenciar leads
- Como usar o Kanban
- Como criar ferramentas
- Como ver relatórios
- Como configurar perfil

---

## 🎨 Design e Visual

### **Princípios de Design:**
1. **Limpeza:** Interface limpa, sem poluição visual
2. **Hierarquia:** Títulos em negrito, subtítulos claros
3. **Espaçamento:** Espaçamento generoso entre elementos
4. **Cores:** Azul para Formação, Verde para GSAL
5. **Tipografia:** Fontes legíveis, tamanhos adequados
6. **Botões:** Grandes, claros, com feedback visual

### **Componentes Visuais:**
- ✅ Cards de seleção inicial (grandes e claros)
- ✅ Mensagens formatadas (negrito, tracinhos)
- ✅ Passo a passo numerado (visual claro)
- ✅ Botões de ação (grandes e destacados)
- ✅ Sugestões rápidas (fáceis de clicar)

---

## 🔄 Fluxo de Funcionamento

### **1. Usuário abre o chat**
- Tela inicial com 2 opções:
  - 🎓 **Assistente de Formação** (Jornada, Pilares, Biblioteca)
  - 📊 **Suporte GSAL** (Gestão, Ferramentas, Configurações)

### **2. Usuário escolhe tipo de ajuda**
- Chat inicia com mensagem personalizada
- Sugestões rápidas aparecem

### **3. Usuário faz pergunta**
- Sistema busca no `NUTRI_ORIENTACAO_MAP`
- Se encontrar: mostra passo a passo
- Se não encontrar: usa OpenAI como fallback

### **4. Resposta formatada**
- Passo a passo claro e numerado
- Botão "Ir para" para navegação direta
- Opção de copiar passo a passo

---

## 📝 Estrutura de Arquivos

```
src/
├── types/
│   └── orientation.ts (já existe - compartilhado)
├── lib/
│   ├── orientation-search.ts (já existe - compartilhado)
│   ├── nutri-orientation.ts (NOVO - mapeamento Nutri)
│   └── nutri-chatbots.ts (NOVO - configuração chatbots)
├── app/
│   └── api/
│       └── nutri/
│           └── orientation/
│               └── route.ts (NOVO - API de orientação)
└── components/
    └── nutri/
        ├── NutriChatWidget.tsx (NOVO - widget de chat)
        └── OrientacaoTecnica.tsx (reutilizar do Wellness)
```

---

## ✅ Checklist de Implementação

### **Fase 1: Estrutura Base** ✅
- [x] Criar `src/lib/nutri-orientation.ts`
- [x] Criar `src/lib/nutri-chatbots.ts`
- [x] Criar `src/app/api/nutri/orientation/route.ts`
- [x] Criar `src/components/nutri/NutriChatWidget.tsx`

### **Fase 2: Mapeamento GSAL** ⏳
- [ ] Mapear funcionalidades de Leads
- [ ] Mapear funcionalidades de Clientes
- [ ] Mapear funcionalidades de Kanban
- [ ] Mapear funcionalidades de Acompanhamento
- [ ] Mapear funcionalidades de Rotina Mínima
- [ ] Mapear funcionalidades de Métricas

### **Fase 3: Mapeamento Ferramentas** ⏳
- [ ] Mapear funcionalidades de Links
- [ ] Mapear funcionalidades de Quizzes
- [ ] Mapear funcionalidades de Templates
- [ ] Mapear funcionalidades de Fluxos

### **Fase 4: Mapeamento Formação** ⏳
- [ ] Mapear Jornada 30 Dias
- [ ] Mapear Pilares do Método
- [ ] Mapear Biblioteca
- [ ] Mapear Anotações
- [ ] Mapear Certificados

### **Fase 5: Mapeamento Configurações** ⏳
- [ ] Mapear Perfil
- [ ] Mapear Assinatura

### **Fase 6: Integração Visual** ✅
- [x] Criar componente NutriChatWidget
- [x] Integrar tela de seleção inicial
- [x] Aplicar design premium
- [x] Integrar nas páginas principais (Home, Dashboard, GSAL, Jornada)
- [ ] Testar responsividade

### **Fase 7: Integração com IA** ⏳
- [ ] Configurar fallback OpenAI
- [ ] Criar prompts específicos Nutri
- [ ] Testar respostas de IA

### **Fase 8: Testes** ⏳
- [ ] Testar todas as buscas
- [ ] Verificar caminhos e links
- [ ] Testar integração com IA
- [ ] Testar visual em diferentes dispositivos

---

## 🎯 Trilhas e Percursos Sugeridos

### **Trilha 1: Primeiros Passos (Dia 1-7)**
1. Configurar perfil completo
2. Explorar Dashboard
3. Criar primeira ferramenta
4. Cadastrar primeiro cliente
5. Acessar Jornada 30 Dias
6. Ver Pilares do Método
7. Criar primeira anotação

### **Trilha 2: Gestão GSAL (Dia 8-14)**
1. Entender o sistema GSAL
2. Gerenciar leads
3. Usar Kanban
4. Acompanhar clientes
5. Ver relatórios
6. Aplicar Rotina Mínima

### **Trilha 3: Ferramentas Avançadas (Dia 15-21)**
1. Criar quizzes personalizados
2. Usar templates
3. Criar fluxos
4. Compartilhar links
5. Analisar estatísticas

### **Trilha 4: Formação Completa (Dia 22-30)**
1. Completar Jornada 30 Dias
2. Estudar todos os Pilares
3. Aplicar conceitos na prática
4. Obter certificados
5. Consolidar aprendizado

---

## 💡 Sugestões de Melhorias Futuras

1. **Percursos Personalizados:** Baseado no progresso do usuário
2. **Notificações Inteligentes:** Lembretes baseados em uso
3. **Gamificação:** Pontos e conquistas
4. **Análise de Progresso:** Dashboard de evolução
5. **Recomendações:** Sugestões baseadas em comportamento

---

## 📊 Progresso

**Fase Atual:** Fase 7 - Expansão do Mapeamento  
**Concluído:** 75%  
**Funcionalidades Mapeadas:** 40+ (de 82+ identificadas)  
**Próxima Ação:** Continuar expandindo mapeamento com funcionalidades restantes

---

## 🔗 Referências

- Sistema Wellness (já implementado)
- `CONSTRUCAO-SISTEMA-ORIENTACAO.md` (Wellness)
- `DIFERENCAS-AREAS-NUTRI-WELLNESS.md`

---

**Última Atualização:** 03/12/2025

