/**
 * Exemplo canónico de quiz (Pro Líderes Noel) — ganho de massa muscular.
 * Anexado ao system prompt quando o fio menciona o tema (economiza tokens nos outros temas).
 */
export const FLUXO_PRESET_GANHAR_MASSA_MUSCULAR = `### Título do fluxo
Ganho de Massa Muscular

### Texto na primeira tela (gancho)
Descubra como otimizar seu treino e alimentação para conquistar o corpo que deseja. Responda algumas perguntas e veja como podemos ajudar!

---

### Pergunta 1
Você já pratica algum tipo de atividade física?

A) Sim, regularmente

B) Sim, de vez em quando

C) Não, mas quero começar

D) Não, não tenho interesse

---

### Pergunta 2
Qual é o seu principal objetivo em relação à massa muscular?

A) Aumentar a força

B) Melhorar a definição

C) Ganhar peso

D) Melhorar a saúde geral

---

### Pergunta 3
Você tem alguma restrição alimentar?

A) Sim

B) Não

---

### Pergunta 4
Você já segue algum tipo de dieta específica?

A) Sim, dieta para ganho de massa

B) Sim, dieta balanceada

C) Não, não sigo dieta

---

### Pergunta 5
Qual é a sua maior dificuldade para ganhar massa muscular?

A) Falta de motivação

B) Dificuldade em seguir a dieta

C) Não sei como treinar corretamente

D) Outro (especificar)

---

### CTA WhatsApp
"Entre em contato conosco para receber orientações personalizadas e dicas práticas sobre treino e alimentação!"
`

export function proLideresNoelThreadMentionsMassaMuscular(text: string): boolean {
  return /massa\s*muscular|hipertrof|ganhar\s+massa|ganho\s+de\s+massa|muscula(c|ç)/i.test(text)
}
