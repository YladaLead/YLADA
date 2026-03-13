# Prompt para o Claude — Ajustes na Home e na página do Método YLADA

Use este prompt ao pedir ao Claude que implemente os ajustes. **Não reconstrua páginas**: apenas altere textos e adicione os blocos indicados.

---

## CONTEXTO

- O **YLADA** é uma plataforma que permite profissionais criarem **diagnósticos** com perguntas estratégicas, para atrair pessoas realmente interessadas e **iniciar conversas mais produtivas** com clientes.
- Fluxo: **Perguntas → Diagnóstico → Clareza → Conversa → Cliente**
- A **Home** (`/pt`) e a página **Método YLADA** (`/pt/metodo-ylada`) já existem e estão boas. O objetivo é **refinar textos e adicionar poucos blocos**, sem mudar layout nem ordem de seções.

**Arquivos principais:**
- Home: `src/app/pt/InstitutionalPageContent.tsx` (e possivelmente página em `src/app/pt/page.tsx`)
- Método: `src/app/pt/metodo-ylada/page.tsx`

---

# PARTE 1 — HOME (`/pt`)

## 1.1 Primeira dobra (HERO)

- **Manter** o título: *"Seu marketing atrai curiosos ou clientes prontos para contratar?"*
- **Manter** o subtítulo: *"Descubra em menos de 1 minuto se sua comunicação profissional está realmente atraindo pessoas interessadas."*
- **Adicionar** logo abaixo desse subtítulo (antes do card da pergunta) a frase:
  - *"O YLADA usa diagnósticos inteligentes para iniciar conversas mais preparadas com clientes."*
- **Não alterar** o layout nem a pergunta inicial.

## 1.2 Botão principal (CTA orientado ao resultado)

- Onde hoje aparecer **"Fazer diagnóstico"** ou **"Fazer diagnóstico agora"** como texto do botão principal que leva ao diagnóstico, **substituir** por:
  - **"Descobrir meu perfil"**
- Objetivo: botão orientado ao resultado (o que a pessoa ganha), não só à ação.
- Opcional: logo abaixo do botão principal do hero, se houver uma frase de apoio, trocar para *"Diagnóstico antes da conversa."* ou *"Comece pela clareza."*

## 1.3 Seção "O que acontece depois do diagnóstico"

- **Manter** o título e a lista numerada atual (1–4).
- **Adicionar** uma frase **antes** da lista:
  - *"O diagnóstico não é apenas um teste. Ele prepara a conversa."*

## 1.4 Seção "Como funciona" (4 blocos)

- **Manter** os 4 blocos visuais (cards).
- **Ajustar** apenas os textos para:

| # | Título                    | Descrição                                                                 |
|---|---------------------------|---------------------------------------------------------------------------|
| 1 | Criar diagnóstico         | Transforme seu conhecimento em perguntas que revelam o problema do cliente. |
| 2 | Compartilhar link         | Envie nas redes sociais, WhatsApp ou anúncios.                           |
| 3 | Receber respostas         | Veja quem respondeu e entenda melhor a situação de cada pessoa.         |
| 4 | Iniciar uma conversa mais preparada | O cliente chega com mais clareza e a conversa avança com mais facilidade. |

(Se o 4º bloco estiver como "Converter clientes", trocar título e descrição pelo da tabela.)

## 1.5 Frase filosófica

- **Adicionar** uma frase entre seções, **antes** de "Exemplos de diagnósticos":
  - *"Boas conversas começam com boas perguntas."*
- Pode ser um parágrafo centralizado, estilo destaque, sem alterar a estrutura ao redor.

## 1.6 Menu

- Garantir que no menu principal exista o item **"Método"** apontando para **`/pt/metodo-ylada`** (se já existir, manter).

---

# PARTE 2 — PÁGINA MÉTODO YLADA (`/pt/metodo-ylada`)

A página do Método **já existe** e não deve ser reconstruída. Apenas refinamentos.

## 2.1 Hero / frase final da página

- No **bloco final** (CTA em destaque, fundo em gradiente), onde hoje aparece:
  - *"Uma nova forma de fazer marketing profissional"*
- **Substituir** por:
  - *"Uma nova forma de iniciar conversas com clientes."*

## 2.2 Botão principal do CTA final

- Onde hoje está **"Escolher minha área"**, **substituir** por:
  - **"Descobrir meu perfil"**
- Ajustar o link para **`/pt/diagnostico`** (ou manter o destino atual se fizer mais sentido para “descobrir perfil” — o importante é o texto do botão).

## 2.3 Novo bloco sobre o papel do diagnóstico

- **Inserir** um **novo bloco** **antes** da seção *"Como o Método YLADA funciona"*.

**Conteúdo:**

- **Título:** *"Toda boa conversa começa com boas perguntas."*
- **Texto:**
  - *"O Método YLADA usa diagnósticos para ajudar as pessoas a entender melhor a própria situação antes da conversa."*
  - *"Quando alguém responde um diagnóstico:"*
  - *• ela reflete sobre o próprio problema*
  - *• ela entende melhor sua situação*
  - *• a conversa começa com muito mais contexto*
  - *"Isso faz com que curiosos se afastem e interessados se aproximem naturalmente."*
- Estilo: bloco simples e curto, coerente com o restante da página (sem mudar layout geral).

## 2.4 Etapas do método ("Como o Método YLADA funciona")

- **Manter** as 4 etapas e o layout.
- **Alterar apenas a 3ª etapa:**
  - **Antes:** "Filtragem" + texto atual.
  - **Depois:**
    - **Título:** *"Diagnóstico"*
    - **Descrição:** *"A pessoa responde perguntas que ajudam a entender sua situação. Isso gera clareza e separa naturalmente curiosos de interessados."*
- Etapas 1, 2 e 4 permanecem iguais.

## 2.5 Frase de conexão (princípio do método)

- **Adicionar** uma frase curta que funcione como **princípio do método**, por exemplo **antes** do bloco final de CTA (seção em destaque com botão):
  - *"Diagnóstico antes da proposta."*
- Pode ser em negrito ou como pequeno destaque, sem alterar a estrutura da página.

---

# REGRAS GERAIS

- **Não alterar:** estrutura da página, ordem das seções, layout, componentes visuais além do necessário para o novo bloco.
- **Alterar apenas:** textos indicados, novo bloco na página Método e frase antes de "Exemplos de diagnósticos" na Home.
- **Objetivo:** reforçar o conceito do YLADA como **método de conversa guiada por diagnósticos** e deixar o CTA principal mais orientado ao resultado (*"Descobrir meu perfil"*).

---

# CHECKLIST RÁPIDO

**Home**
- [ ] Frase nova no hero: "O YLADA usa diagnósticos inteligentes..."
- [ ] CTAs principais: "Descobrir meu perfil"
- [ ] Antes da lista "O que acontece...": "O diagnóstico não é apenas um teste. Ele prepara a conversa."
- [ ] Textos dos 4 blocos "Como funciona" conforme tabela
- [ ] Frase "Boas conversas começam com boas perguntas." antes de Exemplos de diagnósticos
- [ ] Menu com "Método" → `/pt/metodo-ylada`

**Método**
- [ ] "Uma nova forma de fazer marketing profissional" → "Uma nova forma de iniciar conversas com clientes."
- [ ] Botão "Escolher minha área" → "Descobrir meu perfil" (e link para diagnóstico se aplicável)
- [ ] Novo bloco antes de "Como o Método YLADA funciona": "Toda boa conversa começa com boas perguntas." + texto
- [ ] 3ª etapa: "Filtragem" → "Diagnóstico" + nova descrição
- [ ] Frase "Diagnóstico antes da proposta." antes do CTA final
