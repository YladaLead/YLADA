# FLOWS POR ÁREA — YLADA

Objetivo: Criar versões do carrossel adaptadas por segmento, mantendo a mesma estrutura de conversão.

Estrutura padrão (todos seguem):

1. Dor
2. Entrada no YLADA
3. Pergunta
4. Noel orienta
5. Diagnóstico (perguntas)
6. Compartilhamento
7. Entrada do cliente
8. Resposta
9. Resultado (WOW)
10. WhatsApp
11. Fechamento

---

# 🩺 MÉDICOS

1. Pacientes perguntam e somem, ou não chegam.
2. Entra no YLADA.
3. "Como atrair pacientes que já entendem o valor da consulta?"
4. Noel orienta.
5. Perguntas:
   * Você sente algum sintoma recorrente?
   * Já procurou avaliação médica?
   * Isso afeta sua qualidade de vida?
6. Compartilha.
7. Pessoas entram.
8. Respondem.
9. Resultado:
   Você está adiando algo que merece atenção.
10. "Quero agendar uma avaliação"
11. Pacientes mais conscientes.

---

# 🟣 NUTRIÇÃO

1. Você tenta emagrecer, mas nada funciona.
2. Você entra e pergunta o que fazer.
3. "O que está me impedindo de emagrecer?"
4. Noel organiza o caminho.
5. Perguntas:
   * Como está sua rotina alimentar?
   * Você consegue manter constância?
   * Sente ansiedade?
6. Compartilha o link.
7. Pessoas entram.
8. Respondem.
9. Resultado:
   Seu foco não é dieta. É rotina.
10. "Quero ajuda com isso"
11. Pessoas chegam prontas.

---

# 🔵 ESTÉTICA

1. Você posta, mas não atrai clientes.
2. Entra no YLADA.
3. "Por que não estou atraindo clientes?"
4. Noel orienta.
5. Perguntas:
   * Você mostra seus resultados?
   * Seu posicionamento está claro?
   * Seus clientes entendem seu valor?
6. Compartilha.
7. Pessoas entram.
8. Respondem.
9. Resultado:
   Seu problema não é cliente. É posicionamento.
10. "Quero melhorar isso"
11. Conversas mais fáceis.

---

# 🟡 PSICÓLOGOS

1. Conversas não evoluem.
2. Entra no YLADA.
3. "Por que as pessoas não iniciam terapia?"
4. Noel orienta.
5. Perguntas:
   * Você sente dificuldade emocional?
   * Já tentou resolver sozinho?
   * O que mais te incomoda hoje?
6. Compartilha.
7. Pessoas entram.
8. Respondem.
9. Resultado:
   Você não precisa de mais informação. Precisa de acompanhamento.
10. "Quero conversar"
11. Pacientes mais preparados.

---

# 🔴 ODONTOLOGIA

1. Pessoas perguntam preço e somem.
2. Entra no YLADA.
3. "Como atrair pacientes mais preparados?"
4. Noel orienta.
5. Perguntas:
   * Você sente dor ou desconforto?
   * Já avaliou esse problema?
   * Isso afeta sua rotina?
6. Compartilha.
7. Pessoas entram.
8. Respondem.
9. Resultado:
   Você está adiando algo que precisa de atenção.
10. "Quero avaliar isso"
11. Pacientes conscientes.

---

# 🟢 SUPLEMENTAÇÃO & PERFORMANCE

1. Você tenta vender, mas as pessoas não se interessam.
2. Entra no YLADA.
3. "Como atrair pessoas interessadas em energia e resultados?"
4. Noel orienta.
5. Perguntas:
   * Como está sua energia?
   * Você sente cansaço?
   * Está satisfeito com seu corpo?
6. Compartilha.
7. Pessoas entram.
8. Respondem.
9. Resultado:
   Seu problema não é suplemento. É constância e energia.
10. "Quero melhorar isso"
11. Clientes chegam prontos.

---

# 🟠 FITNESS

1. Você não consegue fechar alunos.
2. Entra no YLADA.
3. "Por que as pessoas não começam treino?"
4. Noel orienta.
5. Perguntas:
   * Você tem constância?
   * Falta motivação?
   * Já tentou antes?
6. Compartilha.
7. Pessoas entram.
8. Respondem.
9. Resultado:
   Você não precisa de mais treino. Precisa de consistência.
10. "Quero começar certo"
11. Alunos mais preparados.

---

# 🟣 PERFUMARIA

1. Você mostra produtos, mas não vende.
2. Entra no YLADA.
3. "Como ajudar o cliente a escolher a fragrância certa?"
4. Noel orienta.
5. Perguntas:
   * Prefere fragrâncias suaves ou marcantes?
   * Usa no dia ou noite?
   * Quer algo mais elegante ou casual?
6. Compartilha.
7. Pessoas entram.
8. Respondem.
9. Resultado:
   Sua fragrância ideal é mais marcante e sofisticada.
10. "Quero testar isso"
11. Cliente já decidido.

---

# 💣 PADRÃO FINAL

Todos seguem:
👉 Pergunta → Reflexão → Clareza → Conversa

Isso é o núcleo do YLADA.

---

## Implementação

**Status:** ✅ Implementado. O carrossel usa `selectedArea` para personalizar o conteúdo conforme a área escolhida no seletor.

**Arquivo:** `src/config/ylada-carousel-flows.ts` — mapeia cada área (med, nutri, psi, odonto, estetica, fitness, perfumaria, seller) ao conteúdo dos slides 1, 3, 4, 5, 6, 7, 8, 9, 10 e 11.
