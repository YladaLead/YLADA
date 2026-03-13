# Biblioteca YLADA — Profissionais, segmentos e arquitetura alvo

**Objetivo:** Lista completa de profissionais/segmentos do YLADA e estado atual da biblioteca, para montar e otimizar a arquitetura de biblioteca (diagnósticos, estratégica, conversas, inteligência coletiva) com o ChatGPT ou na implementação.

**Data:** 12/03/2025

---

## 1. Profissionais e segmentos no YLADA (fonte única)

### 1.1 Áreas/rotas (ylada-areas.ts)

| Código      | Label        | Path        |
|------------|--------------|-------------|
| ylada      | YLADA        | /pt         |
| med        | Médicos      | /pt/med     |
| psi        | Psicologia   | /pt/psi     |
| psicanalise | Psicanálise | /pt/psicanalise |
| odonto     | Odontologia  | /pt/odonto  |
| nutra      | Nutra        | /pt/nutra   |
| coach      | Coach        | /pt/coach   |
| perfumaria | Perfumaria   | /pt/perfumaria |
| seller     | Vendedores   | /pt/seller  |
| estetica   | Estética     | /pt/estetica |
| fitness    | Fitness      | /pt/fitness |

### 1.2 Segmentos da biblioteca (ylada-biblioteca.ts)

| value              | label                                  |
|--------------------|----------------------------------------|
| nutrition          | Nutrição                               |
| nutrition_vendedor | Vendedores Nutracêuticos e suplementos |
| medicine           | Médicos                                |
| psychology         | Psicólogos e psicanalistas             |
| aesthetics         | Estética                               |
| dentistry          | Odontologia                            |
| fitness            | Fitness                                |
| perfumaria         | Perfumaria                             |

### 1.3 Profissões por segmento (ylada-profile-flows.ts)

- **med:** medico  
- **nutra:** nutricionista, vendedor_suplementos  
- **psi:** psi  
- **psicanalise:** psicanalise  
- **coach:** coach  
- **seller:** vendedor  
- **estetica:** estetica  
- **fitness:** coach (coach fitness)

### 1.4 Variantes de diagnóstico por profissão (ylada-diagnostico-variantes.ts)

- Nutricionistas  
- Psicólogos  
- Odontologia  
- Estética  
- Médicos  
- Coaches  

### 1.5 Landing / institucional (ylada-landing-areas, institutional-areas)

- med, nutri, psi, estetica, fitness, seller, coach-bem-estar, odonto, perfumaria, nutra, psicanalise  
- profissional-liberal, vendedores-geral (em construção)

---

## 2. Estado atual da biblioteca

### 2.1 Diagnósticos (ylada-diagnosticos.ts)

- **comunicacao** — marketing atrai curiosos ou clientes (perfis: curiosos, desenvolvimento, clientes); já tem `insight`, `caminho`, `porQueAcontece` por perfil.  
- Outros diagnósticos em `DIAGNOSTICOS` (ex.: agenda, etc.) com estrutura `PerfilResultado`: titulo, explicacao, consequencias, pct, posicionamento, proximoNivel, insight, caminho.

**O que falta para Diagnóstico Vivo por perfil:**  
- Leitura da situação (texto único por perfil)  
- Convite para conversa (texto ou CTA padrão)  
- Indicadores (clareza, energia, consistência, etc.) por perfil — hoje não existem como campo

### 2.2 Dores e objetivos por segmento (ylada-segmentos-dores-objetivos.ts)

- Existe `DORES_OBJETIVOS_POR_SEGMENTO` com: nutrition, aesthetics, fitness, dentistry, psychology, medicine, perfumaria, nutrition_vendedor.  
- Cada um tem: dores, objetivos, temas (lista de { value, label }).

### 2.3 Tabelas de Knowledge Layer (migrations 260–263)

- **diagnosis_insights** — diagnostic_id, answers_count, most_common_answer, conversion_rate, insight_text (para Noel Analista e “X% também relatam…”).  
- **noel_strategy_library** — topic, problem, strategy, example, next_action (ainda não populada).  
- **noel_conversation_library** — scenario, user_question, good_answer, why_it_works (ainda não populada).  
- **noel_market_insights** — segment, pattern, frequency, insight, recommended_action (ainda não populada).

### 2.4 Biblioteca de conteúdos (quizzes, calculadoras, links)

- `ylada-biblioteca.ts`: tipos (quiz, calculadora, link), filtro por segmento e tema.  
- Temas “Top 12” + temas por segmento (getTemasPorSegmento, getDoresPorSegmento, getObjetivosPorSegmento).

---

## 3. Arquitetura alvo (três camadas)

### 3.1 Biblioteca de diagnósticos

- Por diagnóstico: tema, perguntas, perfis possíveis, **indicadores**, resultado base, CTA.  
- Por **perfil** (Diagnóstico Vivo): leitura_da_situacao, insight_principal, possivel_caminho, convite_para_conversa (+ indicadores: clareza, energia, consistência, etc.).  
- Fonte: expandir `PerfilResultado` / config ou tabela `diagnosis_library` com esses campos.

### 3.2 Biblioteca estratégica (Noel)

- **noel_strategy_library**: tema, problema, estratégia sugerida, quando usar, exemplo prático.  
- Popular com estratégias reais por tema (gerar clientes, iniciar conversas, filtrar curiosos, criar autoridade, etc.) e por segmento (nutrition, medicine, psychology, aesthetics, fitness, seller, etc.).

### 3.3 Biblioteca de conversas

- **noel_conversation_library**: situação, pergunta do cliente, resposta recomendada, objetivo da resposta.  
- Ex.: situação “cliente pergunta preço” → resposta que leva a diagnóstico antes da proposta.

### 3.4 Inteligência coletiva

- **diagnosis_insights**: já existe; alimentar com respostas agregadas e `insight_text` para frases tipo “64% também relatam…”.

---

## 4. O que passar ao ChatGPT (ou usar na implementação)

- **Lista de profissionais/segmentos:** a acima (áreas, segmentos biblioteca, profissões por segmento, variantes de diagnóstico).  
- **Estado atual:** diagnósticos com perfis (insight, caminho); dores/objetivos/temas por segmento; tabelas 260–263 criadas mas estratégica/conversas/market não populadas.  
- **Objetivo:** padronizar resultados (leitura + insight + caminho + convite + indicadores), popular biblioteca estratégica e de conversas por segmento, e começar a capturar insights (resposta mais comum, etc.) para o Noel Analista.

Com isso o ChatGPT (ou o time) pode propor: (1) estrutura exata de campos/tabelas para diagnósticos vivos, (2) lista de entradas iniciais para noel_strategy_library e noel_conversation_library por profissão, (3) fluxo diagnóstico → biblioteca → 5 blocos + Noel.

---

## 5. Recomendação

**Sim, vale passar todos os profissionais/segmentos que vocês têm** (esta lista) **para o ChatGPT** (ou usar neste doc) **para montar e otimizar toda a arquitetura de biblioteca.**

Motivos:

1. Ele precisa saber **quem** existe (med, nutri, psi, estetica, fitness, seller, coach, odonto, perfumaria, nutra, psicanalise, etc.) para sugerir conteúdos e estrutura **por segmento**.  
2. A biblioteca estratégica e a de conversas ficam muito melhores quando pensadas **por profissão** (ex.: “cliente pergunta preço” em nutri vs estética).  
3. O Diagnóstico Vivo (leitura, insight, caminho, convite, indicadores) pode ser padronizado **e** ter variações por área, se a lista de áreas estiver explícita.  
4. Um único documento com “todos os profissionais” + “estado atual” evita suposições e acelera o desenho da arquitetura e do plano de conteúdo (até 100–200 diagnósticos de qualidade).

**Sugestão de uso:** enviar ao ChatGPT (ou abrir no Cursor) este arquivo + `docs/DIAGNOSTICO-VIVO-E-TELA-RESULTADO.md` + `docs/YLADA-ARQUITETURA-COMPLETA.md` e pedir: “Com base nestes profissionais e no estado atual da biblioteca, proponha a arquitetura completa da biblioteca (três camadas), campos por perfil de diagnóstico vivo, e primeiros itens para strategy_library e conversation_library por segmento.”
