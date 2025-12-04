# 🎯 PROMPT PARA CHATGPT - SISTEMA WELLNESS YLADA

## 📋 CONTEXTO COMPLETO DO SISTEMA WELLNESS

Olá ChatGPT! Preciso que você entenda **TODA** a estrutura do sistema Wellness do YLADA para construir novos fluxos. Abaixo está tudo que já temos implementado:

---

## 🗂️ PARTE 1: SISTEMA DE ORIENTAÇÃO TÉCNICA (ENE SYSTEM)

**O que é:** Sistema que mapeia funcionalidades da plataforma e fornece orientação passo a passo.

**Arquivo:** `src/lib/wellness-orientation.ts`

**Endpoint:** `GET /api/wellness/orientation?query=...`

**Funcionalidades Mapeadas:**
- Dashboard e métricas
- Recrutamento e rede
- Vendas e produtos
- Bebidas funcionais (preparo, variações, benefícios)
- Campanhas e promoções
- Scripts e comunicação
- Relatórios
- Configurações
- Suporte

**Como funciona:**
1. Usuário pergunta (ex: "como criar portal")
2. Sistema busca por palavras-chave
3. Retorna passo a passo detalhado
4. Se tem mentor, sugere contato

---

## 🤖 PARTE 2: SISTEMA NOEL - IA MENTOR

**Estrutura de Dados:**

### Nível 1 - Consultor
```sql
ylada_wellness_consultores
- user_id, nome, email, telefone
- tempo_disponivel_diario: '15-30 min' | '30-60 min' | '1-2h' | '2-3h' | '3-5h' | '5h+'
- tempo_disponivel_semanal: '5-10h' | '10-15h' | '15-20h' | '20-30h' | '30h+'
- experiencia: 'iniciante' | '6 meses' | '1 ano' | '2-3 anos' | '3+ anos'
- estilo_trabalho: 'presencial' | 'online' | 'híbrido' | 'indefinido'
- estagio_negocio: 'iniciante' | 'ativo' | 'produtivo' | 'multiplicador' | 'lider'
- objetivo_financeiro, objetivo_pv
- deseja_recrutar: boolean
```

### Nível 2 - Diagnóstico + Progresso
```sql
ylada_wellness_diagnosticos
- consultor_id
- respostas do diagnóstico
- perfil_identificado, pontos_fortes, pontos_melhoria, recomendacoes

ylada_wellness_progresso
- consultor_id, data
- ritual_2_executado, ritual_5_executado, ritual_10_executado
- microtarefas_completadas, microtarefas_total
- pv_dia, vendas_dia, contatos_dia, recrutamentos_dia
```

### Nível 3 - Planos
```sql
ylada_wellness_planos
- consultor_id
- tipo_plano: '7d' | '14d' | '30d' | '90d'
- plano_json: JSONB com estrutura completa
- status: 'ativo' | 'pausado' | 'concluido'
```

### Nível 4 - Base de Conhecimento
```sql
ylada_wellness_base_conhecimento
- categoria: 'script_vendas' | 'script_bebidas' | 'script_indicacao' | 
             'script_recrutamento' | 'script_followup' | 'frase_motivacional' | 
             'fluxo_padrao' | 'instrucao'
- titulo, conteudo
- estagio_negocio: array
- tempo_disponivel: array
- tags: array
- prioridade: 1-10
```

### Memória e Notificações
```sql
ylada_wellness_interacoes
- consultor_id, mensagem_usuario, resposta_noel
- diagnostico_usado, plano_usado, progresso_usado
- scripts_usados, usado_ia
- topico_detectado, intencao_detectada

ylada_wellness_notificacoes
- consultor_id
- tipo: 'ritual' | 'microtarefa' | 'lembrete' | 'motivacional' | 'alerta' | 'conquista'
- titulo, mensagem, acao_url, acao_texto
- lida, data_envio

ylada_wellness_ritual_dias
- consultor_id, dia
- ritual_2_completado, ritual_2_horario
- ritual_5_completado, ritual_5_horario
- ritual_10_completado, ritual_10_horario
```

**Endpoints:**

1. `POST /api/wellness/consultor/create` - Criar consultor
2. `POST /api/wellness/diagnostico/generate` - Gerar diagnóstico
3. `POST /api/wellness/plano/generate` - Gerar plano (7/14/30/90d)
4. `POST /api/wellness/progresso/registrar` - Registrar progresso
5. `POST /api/wellness/noel/responder` - **Fluxo principal NOEL**
6. `GET /api/wellness/scripts` - Buscar scripts
7. `POST /api/wellness/notificacoes/create` - Criar notificação
8. `POST /api/wellness/ritual/executar` - Executar ritual

**Algoritmo do NOEL:**
```
1. Carregar contexto (consultor + diagnóstico + plano + progresso + scripts)
2. Decidir estratégia:
   - Resposta pronta? → Script + ajuste
   - Contexto disponível? → Ajuste sem IA
   - Fallback → IA completa
3. Gerar resposta personalizada
4. Salvar interação
```

**Redução de tokens:** 60-80% (prioriza scripts, IA só como fallback)

---

## ⚡ PARTE 3: RITUAL 2-5-10

**RITUAL 2 (Manhã):** 2 contatos - networking e follow-up
**RITUAL 5 (Tarde):** 5 ações de vendas/recrutamento
**RITUAL 10 (Noite):** 10 minutos de revisão e planejamento

**Integração:** Atualiza progresso automaticamente, cria notificação quando todos completos

---

## 📅 PARTE 4: GERADOR DE PLANOS

**Tipos:** 7d (ação guiada), 14d (rotina), 30d (consistência), 90d (liderança)

**Baseado em:** Objetivo financeiro, PV, tempo disponível, estilo, desejo de recrutar

**Estrutura JSON:**
```json
{
  "tipo": "30d",
  "objetivo": "Fase de consistência",
  "dias": [{
    "dia": 1,
    "microtarefas": ["Ritual 2: 2 contatos", "Ritual 5: 5 ações", ...],
    "foco": "Fundamentos",
    "meta_dia": "PV: 50 | 5 ações",
    "frase_motivacional": "..."
  }],
  "ajustes_automaticos": {
    "baseado_em": ["progresso_diario", "execucao_microtarefas"],
    "regras": ["Se progresso < 50%, reduzir complexidade", ...]
  }
}
```

**Microtarefas baseadas em:** Tempo disponível, estágio, desejo de recrutar, objetivos

---

## 🥤 PARTE 5: SISTEMA DE BEBIDAS FUNCIONAIS

**Contexto:** Sistema Wellness é baseado em **bebidas funcionais Herbalife**

**Foco:**
- Venda de produtos (Shake, chás, suplementos)
- Preparo e combinações
- Benefícios permitidos (sem alegações médicas)
- Recrutamento de consultores
- Desenvolvimento de equipe

**Scripts específicos:**
- Preparo básico do Shake
- Variações de sabor
- Benefícios permitidos
- Apresentação de produtos
- Objeções sobre produtos

---

## 📊 RESUMO DE TABELAS

| Tabela | Descrição |
|--------|-----------|
| `ylada_wellness_consultores` | Dados do consultor |
| `ylada_wellness_diagnosticos` | Diagnósticos |
| `ylada_wellness_progresso` | Progresso diário |
| `ylada_wellness_planos` | Planos personalizados |
| `ylada_wellness_base_conhecimento` | Scripts, frases, fluxos |
| `ylada_wellness_interacoes` | Memória do NOEL |
| `ylada_wellness_notificacoes` | Notificações |
| `ylada_wellness_ritual_dias` | Ritual 2-5-10 |

---

## 🔗 ARQUIVOS DE REFERÊNCIA

**SQL:**
- `scripts/criar-banco-noel-completo.sql` - Estrutura completa
- `scripts/seed-base-conhecimento-noel.sql` - Seed (20 itens)

**TypeScript:**
- `src/types/wellness-noel.ts` - Types
- `src/lib/wellness-orientation.ts` - Orientação técnica
- `src/lib/noel-wellness/response-generator.ts` - Lógica NOEL
- `src/lib/noel-wellness/plano-generator.ts` - Gerador de planos

**API:**
- `src/app/api/wellness/*` - Todos os endpoints

---

## ✅ STATUS

- ✅ Banco de dados completo
- ✅ Sistema de orientação técnica
- ✅ Sistema NOEL completo
- ✅ Base de conhecimento (20 itens)
- ✅ Endpoints funcionais
- ✅ Algoritmo de resposta
- ✅ Ritual 2-5-10
- ✅ Gerador de planos

---

**Agora você tem TODO o contexto do sistema Wellness! Use isso para construir novos fluxos mantendo a consistência.** 🚀

