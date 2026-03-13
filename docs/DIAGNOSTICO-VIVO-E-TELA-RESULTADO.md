# Diagnóstico Vivo e estrutura de tela de resultado para conversão

**Objetivo:** Elevar a percepção do diagnóstico de "quiz" para "diagnóstico inteligente" e definir a tela de resultado em 5 blocos que convertem (resultado → interpretação → insight → próximo passo → conversa). Alinha à filosofia: **Boas respostas começam boas conversas.**

**Data:** 12/03/2025

---

## 1. Por que “Diagnóstico Vivo”

Se as pessoas acham que é **um quiz**, o valor percebido é baixo.  
Se parecer **um diagnóstico inteligente**, o valor sobe.

Um **diagnóstico vivo** é quando o resultado não parece estático. Ele parece:
- **analisado** — o sistema entendeu a situação
- **contextual** — ligado às respostas da pessoa
- **interpretado** — há leitura, não só “perfil X”
- **evolutivo** — sugere caminho e próximo passo

### Diferença prática

| Quiz comum | Diagnóstico vivo |
|------------|-------------------|
| Resultado: "Seu perfil é X." Acabou. | "Analisando suas respostas... Detectamos padrões. Você parece estar em um momento onde: • existe interesse em X • mas ainda bloqueio em Y • o próximo passo seria Z" |

Isso muda a experiência e o posicionamento: o YLADA deixa de parecer **ferramenta de quiz** e passa a parecer **motor de diagnóstico inteligente**.

---

## 2. Estrutura de um diagnóstico vivo (4 blocos de conteúdo)

O resultado pode ter estes blocos:

1. **Leitura da situação** — Mostra que o sistema entendeu.  
   Ex.: *"Pelas suas respostas, parece que você já tem interesse em melhorar sua saúde, mas ainda existe dificuldade em manter consistência na rotina."*

2. **Insight principal** — O “diagnóstico” em si.  
   Ex.: *"O principal bloqueio hoje parece ser a falta de clareza sobre qual mudança realmente faria mais diferença no seu dia a dia."*

3. **Possível caminho** — Direção.  
   Ex.: *"Muitas pessoas nessa situação começam organizando pequenas mudanças que aumentam energia e disposição ao longo do dia."*

4. **Convite para conversa** — Conecta com o profissional.  
   Ex.: *"Esse diagnóstico pode ser um bom ponto de partida para uma conversa mais aprofundada."*

---

## 3. Indicadores visuais (aumentam sensação de análise)

Exemplo de indicadores curtos:

- **Nível de clareza atual:** médio  
- **Nível de energia percebido:** baixo  
- **Consistência de hábitos:** em construção  

Isso gera sensação de que houve **análise**, não só um label.

---

## 4. Inteligência coletiva

Mostrar algo como:

*"Baseado nas respostas de outras pessoas: 63% também relatam dificuldade em começar."*

Isso dá sensação de **inteligência coletiva**. O sistema já tem a tabela **diagnosis_insights** (migration 260) para alimentar esse tipo de frase.

---

## 5. Sequência antes do resultado (percepção de IA)

Uma pequena animação antes de mostrar o resultado (2–3 segundos):

1. *Analisando suas respostas…*  
2. *Identificando padrões...*  
3. *Gerando diagnóstico...*

A pessoa sente que existe **inteligência no processo**.

---

## 6. Estrutura ideal da tela de resultado (5 blocos, nessa ordem)

A tela deve ter **5 blocos** nessa ordem. Cada um tem um papel psicológico.

| # | Bloco | Papel | Exemplo de título/conteúdo |
|---|--------|--------|----------------------------|
| 1 | **Resultado do diagnóstico** | Entender em que situação está | Perfil identificado + indicadores (clareza: média, consistência: baixa, energia: moderada) |
| 2 | **Interpretação do Noel** | Confiança (a IA “leu” as respostas) | *"Pelas suas respostas, parece que você já tem interesse em melhorar, mas ainda não encontrou um caminho claro para começar. Isso é comum quando a rotina está cheia."* |
| 3 | **Insight principal** | Revelação (“é verdade”) | *"O maior bloqueio parece não ser falta de vontade, mas falta de um direcionamento simples para iniciar mudanças."* |
| 4 | **Próximo passo sugerido** | Direção | *"Muitas pessoas nessa situação começam ajustando pequenas rotinas que aumentam energia e clareza ao longo do dia."* |
| 5 | **Convite para conversa** | Ação (CTA) | *"Se quiser aprofundar isso, você pode conversar com o profissional que criou este diagnóstico."* + botão **Conversar com o profissional** |

### Bloco opcional (após o CTA)

- *Diagnóstico criado com tecnologia YLADA*  
- Botão: **Criar meu próprio diagnóstico**  

Isso ativa o **loop de crescimento** da plataforma.

### Ordem visual completa

```
SEU DIAGNÓSTICO

[1] Resultado identificado + Indicadores
    ↓
[2] Interpretação do Noel
    ↓
[3] Insight principal
    ↓
[4] Próximo passo sugerido
    ↓
[5] Conversar com o profissional  [CTA]
    ↓
Powered by YLADA  |  Criar meu diagnóstico (opcional)
```

---

## 7. Por que essa ordem converte mais

A sequência psicológica é:

**Entendimento → Confiança → Identificação → Direção → Ação**

Se pular alguma etapa, a conversão cai. O diagnóstico não termina no resultado; ele **continua até iniciar a conversa**.

---

## 8. Noel interpretando o diagnóstico

Um detalhe que aumenta muito a percepção: **o Noel interpretar o diagnóstico** depois do resultado aparecer.

Exemplo:

*"Olhando seu diagnóstico, parece que o ponto mais importante agora é…"*

Isso cria sensação de **consultoria inteligente**, não apenas ferramenta. Pode ser:
- um bloco fixo de texto (interpretação genérica por perfil), ou  
- uma chamada à API do Noel passando o resultado do diagnóstico para gerar uma frase curta de interpretação.

---

## 9. Conexão com a filosofia YLADA

Isso reforça:

**Boas respostas começam boas conversas.**

Fluxo:

**Perguntas → Clareza → Diagnóstico → Conversa → Relacionamento**

O diagnóstico vira a **ponte** entre a pessoa e o profissional.

---

## 10. Onde isso pode ser implementado no código

- **Links públicos / YLADA:** `src/components/ylada/PublicLinkView.tsx` — componente `DiagnosticoQuiz` (step `result`): hoje mostra título, `resultIntro`, `result.headline`, `result.description` e CTA. Pode evoluir para os 5 blocos (resultado + indicadores, interpretação Noel, insight, próximo passo, CTA) e, antes, tela de “Analisando respostas…”.
- **Resultado por diagnóstico (pt):** `src/app/pt/resultado/page.tsx` — página de resultado com perfil, área, compartilhar; pode ganhar os mesmos 5 blocos e indicadores.
- **Wellness quiz público:** `src/app/pt/wellness/[user-slug]/quiz/[slug]/page.tsx` — etapa `resultado` com `blocosConteudo`; pode seguir o mesmo padrão (1–5) e opcionalmente Noel.
- **Outros fluxos de quiz/diagnóstico** (nutri, coach, etc.): usar a mesma estrutura para consistência de percepção.

---

## 11. Interface sugerida para os blocos (referência para o front)

```ts
// Estrutura dos 5 blocos para a tela de resultado (diagnóstico vivo)
interface DiagnosticoVivoResult {
  // 1) Resultado
  perfilIdentificado: string
  indicadores?: Array<{ label: string; valor: string }>  // ex.: { label: 'Clareza', valor: 'média' }

  // 2) Interpretação do Noel
  interpretacaoNoel?: string

  // 3) Insight principal
  insightPrincipal: string

  // 4) Próximo passo
  proximoPassoSugerido: string

  // 5) CTA
  ctaTexto?: string           // ex.: "Conversar com o profissional"
  ctaUrl?: string             // ex.: WhatsApp ou página de contato

  // Inteligência coletiva (opcional)
  insightColetivo?: string    // ex.: "63% também relatam dificuldade em começar"
}
```

---

## 12. Efeito final no mercado

O diagnóstico deixa de parecer **“um teste”** e passa a parecer **uma avaliação inteligente que inicia uma conversa**.

Se a experiência for bem feita, o YLADA pode ser visto como:

**"A plataforma de diagnósticos inteligentes para profissionais."**

Ou seja: nutricionistas, esteticistas, coaches, vendedores, médicos — todos usando diagnósticos para **iniciar conversas**. Isso é uma categoria forte de posicionamento.
