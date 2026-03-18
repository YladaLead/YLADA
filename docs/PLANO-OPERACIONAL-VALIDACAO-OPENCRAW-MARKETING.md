# Plano operacional — Validação + OpenCraw + Marketing (YLADA)

**Objetivo:** Validar rapidamente o funil do YLADA, corrigir conversão e estruturar agentes no OpenCraw para automação.

---

## Ordem correta (resumo executivo)

1. Validar funil manual
2. Corrigir conversão básica
3. Criar agente simples no OpenCraw
4. Testar novamente
5. Só então escalar marketing

**Regra:** Manual primeiro → agente depois → tráfego depois disso.

---

## FASE 1 — Validação manual do funil (executar hoje)

### Objetivo

Simular o usuário real do começo ao fim e identificar erros.

### Passo a passo

| Etapa | O que verificar |
|-------|-----------------|
| **1. Entrada** | Página carrega rápido? Mensagem clara? Entendi o que vou ganhar? |
| **2. Página (Landing)** | Headline clara? Explica o YLADA? CTA visível? Evitar: confuso, técnico, sem dor |
| **3. Entrada no Free** | Fácil entrar? Tem fricção? Cadastro quebra? |
| **4. Onboarding** | Faz sentido preencher? Explica por quê? Rápido ou cansativo? |
| **5. Diagnóstico (Noel)** | Perguntas fazem sentido? Fluxo fluido? Parece inteligente ou genérico? |
| **6. Resultado** | Impacta? Dá clareza? Gera vontade de agir? |
| **7. CTA (WhatsApp)** | Botão claro? Texto persuasivo? Gera urgência? |
| **8. WhatsApp** | Abre corretamente? Mensagem já vem pronta? Dá continuidade? |

### Template de registro (preencher durante o teste)

```
ETAPA      | STATUS | PROBLEMA                    | AÇÃO
-----------|--------|-----------------------------|---------------------------
Landing    |        |                             |
Entrada    |        |                             |
Onboarding |        |                             |
Diagnóstico|        |                             |
Resultado  |        |                             |
CTA        |        |                             |
WhatsApp   |        |                             |
```

**Legenda STATUS:** ✅ OK | ⚠️ Atenção | ❌ Erro

---

## FASE 2 — Revisão rápida de conversão (mesmo dia)

### Checklist

**Página**
- [ ] Headline promete resultado claro?
- [ ] Está focada em dor real?
- [ ] Tem prova/exemplo?

**Diagnóstico**
- [ ] Parece personalizado?
- [ ] Evita parecer robô?
- [ ] Gera identificação?

**CTA**
- [ ] Está direto?
- [ ] Mostra benefício?
- [ ] Exemplo: ❌ "Fale conosco" → ✅ "Quero entender meu diagnóstico no WhatsApp"

**WhatsApp**
- [ ] Mensagem já vem pronta?
- [ ] Começa a conversa ou trava?

---

## FASE 3 — Agente OpenCraw (versão simples)

### Objetivo

Automatizar a validação do funil.

### O que o agente faz

1. Acessa URL
2. Clica no CTA
3. Passa onboarding
4. Responde diagnóstico
5. Chega no resultado
6. Clica no WhatsApp
7. Registra problemas

### Estrutura do agente

**INPUT:** URL do YLADA

**FLUXO:**
1. Abrir página
2. Identificar botão principal
3. Clicar
4. Preencher campos básicos
5. Avançar etapas
6. Responder perguntas
7. Capturar resultado
8. Clicar no CTA
9. Verificar abertura do WhatsApp

**OUTPUT:** Tabela no formato:
```
ETAPA      | STATUS | OBSERVAÇÃO
-----------|--------|------------
Entrada    |        |
Onboarding |        |
Diagnóstico|        |
CTA        |        |
WhatsApp   |        |
```

### Prompt para OpenCraw

```
Você é um agente de validação de funil.

Objetivo:
Percorrer todo o fluxo do YLADA como um usuário real e identificar problemas.

Passos:
1. Acesse a URL fornecida
2. Clique no principal botão de entrada
3. Complete onboarding (use dados fictícios simples)
4. Responda o diagnóstico com respostas coerentes
5. Chegue até o resultado
6. Clique no CTA de WhatsApp

Para cada etapa:
- Verifique se funcionou
- Se houve erro, travamento ou confusão
- Avalie clareza e fluidez

Saída obrigatória:
Tabela no formato:
ETAPA | STATUS | PROBLEMA/OBSERVAÇÃO
```

---

## FASE 4 — Agente de UX (depois)

**Objetivo:** Detectar onde usuário desiste, confunde, perde interesse.

**Fazer depois** — não agora.

---

## FASE 5 — Início do marketing

### Só iniciar quando

- [ ] Funil validado
- [ ] Sem erros técnicos
- [ ] CTA funcionando
- [ ] WhatsApp abrindo perfeito

### Estratégia inicial

1 promessa clara + 1 diagnóstico principal + 1 público específico

---

## Erro a evitar

**Não fazer:** marketing + agentes + estrutura complexa **sem** validar o básico.

**Resultado:** tráfego desperdiçado, confusão, baixa conversão.

---

## URL para validação

*(Preencher com a URL real do YLADA)*

- Landing: _______________
- Diagnóstico: _______________
