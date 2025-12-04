# 📋 RESUMO COMPLETO - SISTEMA WELLNESS YLADA

## 🎯 Para ChatGPT: Estrutura Completa do Sistema Wellness

Este documento contém **TODA** a estrutura, fluxos e sistemas já implementados na área Wellness do YLADA.

---

## 🗂️ PARTE 1: SISTEMA DE ORIENTAÇÃO TÉCNICA (ENE SYSTEM)

### O que é:
Sistema que mapeia funcionalidades da plataforma Wellness e fornece orientação passo a passo para usuários.

### Estrutura:
- **Arquivo TypeScript:** `src/lib/wellness-orientation.ts`
- **Endpoint:** `GET /api/wellness/orientation?query=...`
- **Componente React:** `src/components/wellness/OrientacaoTecnica.tsx`

### Funcionalidades Mapeadas:
1. **Dashboard e Visão Geral**
   - Ver dashboard principal
   - Ver métricas e KPIs
   - Ver gráficos de performance

2. **Recrutamento e Rede**
   - Como recrutar novos consultores
   - Gerenciar equipe
   - Ver rede de contatos

3. **Vendas e Produtos**
   - Como vender produtos
   - Apresentar bebidas funcionais
   - Gerenciar clientes

4. **Bebidas Funcionais**
   - Preparo de Shake
   - Variações de sabor
   - Benefícios permitidos

5. **Campanhas e Promoções**
   - Ver campanhas ativas
   - Participar de promoções
   - Acompanhar resultados

6. **Scripts e Comunicação**
   - Scripts de vendas
   - Scripts de recrutamento
   - Templates de mensagens

7. **Relatórios e Análises**
   - Relatórios de vendas
   - Análise de performance
   - Histórico de atividades

8. **Configurações**
   - Perfil do consultor
   - Preferências
   - Integrações

9. **Suporte e Ajuda**
   - Contato com suporte
   - FAQ
   - Tutoriais

### Como Funciona:
1. Usuário faz uma pergunta (ex: "como criar portal")
2. Sistema busca na base de orientação por palavras-chave
3. Retorna passo a passo detalhado
4. Se usuário tem mentor, sugere contato

---

## 🤖 PARTE 2: SISTEMA NOEL - IA MENTOR WELLNESS

### O que é:
Sistema completo de IA para mentoria, suporte e orientação técnica na área Wellness.

### Arquitetura:

#### **Nível 1 - Consultor**
Tabela: `ylada_wellness_consultores`
- Dados básicos (nome, email, telefone)
- Disponibilidade (tempo diário/semanal)
- Perfil (experiência, estilo de trabalho)
- Objetivos (financeiro, PV, recrutar)
- Estágio do negócio (iniciante → lider)

#### **Nível 2 - Diagnóstico + Progresso**
Tabelas:
- `ylada_wellness_diagnosticos` - Diagnóstico completo do consultor
- `ylada_wellness_progresso` - Progresso diário (rituais, métricas)

#### **Nível 3 - Planos Personalizados**
Tabela: `ylada_wellness_planos`
- Planos de 7, 14, 30 ou 90 dias
- Estrutura em JSON com microtarefas diárias
- Ajustes automáticos baseados em progresso

#### **Nível 4 - Base de Conhecimento**
Tabela: `ylada_wellness_base_conhecimento`
- Scripts de vendas
- Scripts de bebidas funcionais
- Scripts de indicação
- Scripts de recrutamento
- Scripts de follow-up
- Frases motivacionais
- Fluxos padrão
- Instruções gerais

#### **Memória do NOEL**
Tabela: `ylada_wellness_interacoes`
- Todas as conversas
- Contexto usado (diagnóstico, plano, progresso)
- Scripts utilizados
- Se usou IA ou não

#### **Sistema de Notificações**
Tabela: `ylada_wellness_notificacoes`
- Notificações inteligentes
- Tipos: ritual, microtarefa, lembrete, motivacional, alerta, conquista

#### **Ritual 2-5-10**
Tabela: `ylada_wellness_ritual_dias`
- Execuções diárias do ritual
- Horários e observações

### Endpoints:

1. **POST `/api/wellness/consultor/create`**
   - Cria consultor + diagnóstico inicial

2. **POST `/api/wellness/diagnostico/generate`**
   - Gera diagnóstico completo
   - Analisa perfil automaticamente

3. **POST `/api/wellness/plano/generate`**
   - Gera plano personalizado (7/14/30/90 dias)
   - Baseado em: objetivo, tempo, estilo, desejo de recrutar

4. **POST `/api/wellness/progresso/registrar`**
   - Salva execuções diárias
   - Atualiza ritual automaticamente

5. **POST `/api/wellness/noel/responder`**
   - **Fluxo principal do NOEL**
   - Algoritmo: contexto → estratégia → resposta
   - Reduz uso de IA (prioriza scripts)

6. **GET `/api/wellness/scripts`**
   - Busca scripts da biblioteca
   - Filtros: categoria, estágio, tempo, tags

7. **POST `/api/wellness/notificacoes/create`**
   - Cria notificações inteligentes

8. **POST `/api/wellness/ritual/executar`**
   - Marca execução do Ritual 2-5-10
   - Cria notificação de conquista se todos completos

### Algoritmo do NOEL:

```
1. CARREGAR CONTEXTO COMPLETO
   ├─ Consultor (estágio, tempo, objetivos)
   ├─ Diagnóstico (perfil, desafios)
   ├─ Plano ativo (microtarefas do dia)
   ├─ Progresso hoje (rituais, métricas)
   └─ Scripts relevantes

2. DECIDIR ESTRATÉGIA
   ├─ Resposta pronta? → Script + ajuste
   ├─ Contexto disponível? → Ajuste sem IA
   └─ Fallback → IA completa

3. GERAR RESPOSTA
   ├─ Personalizar para estágio
   ├─ Personalizar para tempo
   ├─ Adicionar contexto do progresso
   └─ Incluir lembretes do ritual

4. SALVAR INTERAÇÃO
   └─ Registrar tudo para aprendizado
```

### Redução de Tokens:
- **Scripts prontos:** 0 tokens
- **Ajuste personalizado:** Poucos tokens
- **IA completa:** Apenas fallback
- **Resultado:** 60-80% redução no uso de tokens OpenAI

---

## ⚡ PARTE 3: RITUAL 2-5-10

### O que é:
Sistema de rotina diária para consultores manterem consistência.

### Estrutura:

**RITUAL 2 (Manhã):**
- 2 contatos
- Enviar mensagens para 2 pessoas
- Foco: networking e follow-up

**RITUAL 5 (Tarde):**
- 5 ações de vendas/recrutamento
- Apresentar produtos
- Fazer follow-up
- Foco: ação e resultados

**RITUAL 10 (Noite):**
- 10 minutos de revisão
- Revisar o dia
- Planejar o próximo dia
- Foco: organização e planejamento

### Integração:
- Atualiza `ylada_wellness_progresso` automaticamente
- Cria notificação de conquista quando todos completos
- Usado pelo NOEL para personalizar respostas

---

## 📅 PARTE 4: GERADOR DE PLANOS

### Tipos de Planos:

1. **7 dias:** Fase de ação guiada - Primeiros passos estruturados
2. **14 dias:** Fase de ação guiada - Construção de rotina
3. **30 dias:** Fase de consistência e volume - Aceleração de resultados
4. **90 dias:** Fase de liderança - Desenvolvimento completo

### Baseado em:
- Objetivo financeiro
- Objetivo PV
- Tempo disponível diário/semanal
- Estilo de trabalho
- Desejo de recrutar

### Estrutura do Plano (JSON):
```json
{
  "tipo": "30d",
  "objetivo": "Fase de consistência e volume",
  "dias": [
    {
      "dia": 1,
      "microtarefas": [
        "Ritual 2: 2 contatos",
        "Ritual 5: 5 ações de vendas",
        "Apresentar produto para 1 pessoa",
        "Ritual 10: Revisar dia e planejar amanhã"
      ],
      "foco": "Fundamentos: Construir base sólida",
      "meta_dia": "PV: 50 | 5 ações",
      "frase_motivacional": "Cada dia é uma nova oportunidade de crescimento! 💪"
    }
  ],
  "ajustes_automaticos": {
    "baseado_em": ["progresso_diario", "execucao_microtarefas", "resultados_pv"],
    "regras": [
      "Se progresso < 50%, reduzir complexidade",
      "Se progresso > 80%, aumentar desafio",
      "Ajustar microtarefas conforme tempo disponível"
    ]
  }
}
```

### Microtarefas Baseadas em:
- Tempo disponível (15-30 min até 5h+)
- Estágio do negócio (iniciante → lider)
- Desejo de recrutar
- Objetivos financeiros e PV

---

## 🥤 PARTE 5: SISTEMA DE BEBIDAS FUNCIONAIS

### Contexto:
O sistema Wellness é **baseado em bebidas funcionais Herbalife**. Todas as funcionalidades giram em torno de:

- Venda de produtos (Shake, chás, suplementos)
- Preparo e combinações
- Benefícios permitidos (sem alegações médicas)
- Recrutamento de consultores
- Desenvolvimento de equipe

### Scripts Específicos:
- Preparo básico do Shake
- Variações de sabor
- Benefícios permitidos
- Como apresentar produtos
- Como lidar com objeções sobre produtos

### Fluxos:
- Processo de venda de bebidas
- Follow-up pós-venda
- Recompra de clientes
- Desenvolvimento de equipe

---

## 📊 RESUMO DE TABELAS

| Tabela | Descrição |
|--------|-----------|
| `ylada_wellness_consultores` | Dados do consultor |
| `ylada_wellness_diagnosticos` | Diagnósticos completos |
| `ylada_wellness_progresso` | Progresso diário |
| `ylada_wellness_planos` | Planos personalizados |
| `ylada_wellness_base_conhecimento` | Scripts, frases, fluxos |
| `ylada_wellness_interacoes` | Memória do NOEL |
| `ylada_wellness_notificacoes` | Notificações inteligentes |
| `ylada_wellness_ritual_dias` | Ritual 2-5-10 |

---

## 🔗 ARQUIVOS DE REFERÊNCIA

### SQL:
- `scripts/criar-banco-noel-completo.sql` - Estrutura completa
- `scripts/seed-base-conhecimento-noel.sql` - Seed inicial (20 itens)

### TypeScript:
- `src/types/wellness-noel.ts` - Types completos
- `src/lib/wellness-orientation.ts` - Sistema de orientação
- `src/lib/noel-wellness/response-generator.ts` - Lógica de resposta
- `src/lib/noel-wellness/plano-generator.ts` - Gerador de planos

### API Routes:
- `src/app/api/wellness/consultor/create/route.ts`
- `src/app/api/wellness/diagnostico/generate/route.ts`
- `src/app/api/wellness/plano/generate/route.ts`
- `src/app/api/wellness/progresso/registrar/route.ts`
- `src/app/api/wellness/noel/responder/route.ts`
- `src/app/api/wellness/scripts/route.ts`
- `src/app/api/wellness/notificacoes/create/route.ts`
- `src/app/api/wellness/ritual/executar/route.ts`
- `src/app/api/wellness/orientation/route.ts`

---

## ✅ STATUS ATUAL

- ✅ Banco de dados completo
- ✅ Sistema de orientação técnica (ENE System)
- ✅ Sistema NOEL completo
- ✅ Base de conhecimento (20 itens iniciais)
- ✅ Endpoints funcionais
- ✅ Algoritmo de resposta implementado
- ✅ Ritual 2-5-10 implementado
- ✅ Gerador de planos implementado
- ⏳ Telas frontend (pendente)

---

**Pronto para uso no ChatGPT para construção de novos fluxos!** 🚀

