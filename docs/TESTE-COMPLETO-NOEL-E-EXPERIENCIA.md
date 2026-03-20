# Teste completo — Noel como guia e experiência do usuário

Objetivo: garantir que a experiência do usuário tenha o **Noel como guia**, que o **board seja preenchido** (perfil/onboarding concluído), e que todas as situações reais de campo sejam testadas (criar fluxo, estratégia, link para post, etc.).

---

## 1. O que precisa estar pronto

- **Contas e perfil:** `node scripts/criar-contas-teste-interno.js` — cria as 12 contas (telefone +55 19 99723-0912) e **preenche o perfil Noel (`ylada_noel_profile`) por área** com características comuns a cada profissão (ylada, nutri, coach, med, psi, odonto, fitness, seller, nutra, estética, perfumaria). Assim o board e o Noel já têm contexto ao fazer login.
- **App:** `npm run dev` (anote a porta: 3000, 3004, etc.).
- **Telefone em todas as contas:** +55 19 99723-0912 (para você ver no WhatsApp a mensagem que chega no profissional).

---

## 2. Prioridade: onboarding e board preenchido

- **Perfil Noel já preenchido:** ao rodar `node scripts/criar-contas-teste-interno.js`, cada conta ganha um registro em `ylada_noel_profile` com dados típicos da área (dor, fase, metas, área específica — ex.: estética com `area_estetica`/`estetica_tipo_atuacao`, nutri com `area_nutri`/`modalidade_atendimento`). O board e o Noel usam esse perfil.
- **Onboarding (nome + telefone):** se após o login cair em **/pt/onboarding**, preencher **Nome** e **Telefone/WhatsApp** (+55 19 99723-0912) e clicar em **"Gerar meu Diagnóstico Estratégico"** (ou Continuar/Começar). Isso garante que a experiência de primeiro acesso fique completa.
- Para testar por **área** (ex.: estética), use a conta dessa área: **teste-interno-11@teste.ylada.com** (estética). O perfil Noel dessa conta já vem com características de estética (facial, clínica com equipe, pele, skincare, etc.).

---

## 3. Noel — 5 a 10 perguntas variadas (situações reais)

Para testar o comportamento do Noel em situações reais, fazer **pelo menos 5 a 10 perguntas** variadas, por exemplo:

| # | Tipo | Exemplo de pergunta |
|---|------|----------------------|
| 1 | Próximo passo | "Qual meu próximo passo?" |
| 2 | Criar fluxo/diagnóstico | "Quero criar um diagnóstico para minha área. Como faço?" |
| 3 | Estratégia | "Me sugira uma estratégia para captar mais clientes." |
| 4 | Link para post | "Pode gerar um link para eu usar no post ou no Instagram?" |
| 5 | Fluxo do zero | "Como criar um fluxo de diagnóstico do zero?" |
| 6 | Melhor diagnóstico | "Qual o melhor diagnóstico para começar a conversar com cliente?" |
| 7 | Script WhatsApp | "Preciso de um script para enviar no WhatsApp. Pode me dar um?" |
| 8 | Organizar semana | "Como organizar minha semana para atrair mais leads?" |
| 9 | Área específica | "Sou da área de estética. O que você me recomenda para começar?" |
| 10 | Link já criado | "Me dá o link do último diagnóstico que criei para eu compartilhar." |

**O que observar:** o Noel deve responder de forma coerente com o perfil (área), sugerir links/fluxos quando fizer sentido, e em algum momento **criar ou sugerir link** (incl. para post). Há também a área onde o Noel **cria o link** (ex.: "Criar em 1 clique com o Noel") — testar esse fluxo.

---

## 4. Áreas e perfis a testar

- **ylada (matriz):** teste-interno-01@teste.ylada.com — primeiro teste, board geral.
- **estética:** teste-interno-11@teste.ylada.com — para ver board e Noel específicos de estética.
- **perfumaria:** teste-interno-12@teste.ylada.com — para ver board e Noel de vendas em perfumaria (perfil olfativo, fragrâncias).
- **nutri, coach, seller, etc.:** usar os outros e-mails da lista para conferir se o conteúdo muda por perfil.

Em cada perfil: **onboarding concluído** → **board preenchido** → **Noel com 5–10 perguntas variadas** (incl. criar fluxo, estratégia, link para post).

---

## 5. Checklist resumido (experiência completa)

**Base recomendada:** testes da parte interna com **estética** como referência — ver **docs/CHECKLIST-TESTE-INTERNO-ESTETICA.md**.

- [ ] Login com conta da área desejada (ex.: estética = teste-interno-11).
- [ ] Se cair no onboarding: preencher nome e telefone (+55 19 99723-0912) e concluir.
- [ ] Board/Home carregado e com conteúdo (não vazio).
- [ ] Noel: 5–10 perguntas variadas (próximo passo, criar diagnóstico, estratégia, link para post, script WhatsApp, etc.).
- [ ] Noel sugere ou gera link (ex.: diagnóstico, post).
- [ ] Links: página de diagnósticos/links abre; possível criar e copiar link.
- [ ] Biblioteca: abre e lista conteúdos.
- [ ] Configurações: perfil/telefone salvam.
- [ ] Aparência: sem "YLADA YLADA" repetido; layout ok.

---

## 6. Agente automático (o que ele já faz)

O comando `npm run agente:interno` (com `URL=http://localhost:PORTA HEADLESS=false`):

- Faz login e **tenta preencher o onboarding** (nome + telefone) e clicar em continuar.
- Passa por Board, Perfil, **Noel (várias perguntas)**, Configurações, Botões, Fluxos, Biblioteca, Links, Aparência.
- Ao terminar, **espera 5 segundos** e fecha (45s só quando dá erro).
- Salva o relatório em **docs/RELATORIO-ULTIMO-TESTE-INTERNO.md**.

Para **board realmente preenchido**, é importante que o onboarding tenha sido concluído (o agente tenta; se falhar, concluir manualmente uma vez com a conta desejada).

---

## 7. Prompt para colar em outro chat (teste manual guiado)

Use o bloco abaixo em outro chat para alguém (ou outro agente) seguir o teste completo:

```
Preciso que você execute o teste completo da experiência do usuário na plataforma YLADA, com foco no Noel como guia.

CONTEXTO
- App: [URL, ex.: http://localhost:3004]
- Login: teste-interno-01@teste.ylada.com (ou teste-interno-11 para estética) | Senha: TesteYlada2025!
- Telefone para preencher onde pedir: +55 19 99723-0912

PRIORIDADE 1 — Onboarding e board preenchido
- Se após o login aparecer a tela de onboarding (Bem-vindo, Nome, Telefone), preencher Nome e Telefone (+55 19 99723-0912) e clicar no botão para continuar (ex.: "Gerar meu Diagnóstico Estratégico").
- Só assim o board fica preenchido com conteúdo coerente.

PRIORIDADE 2 — Noel (5 a 10 perguntas variadas)
Fazer pelo menos 5 a 10 perguntas ao Noel, cobrindo:
- Próximo passo
- Como criar um diagnóstico/fluxo para minha área
- Estratégia para captar mais clientes
- Gerar link para usar no post ou Instagram
- Script para enviar no WhatsApp
- Melhor diagnóstico para começar conversa com cliente
- Organizar semana para atrair leads
Anotar se as respostas fazem sentido e se em algum momento o Noel sugere ou gera link (incl. para post).

PRIORIDADE 3 — Restante da experiência
- Conferir página de Links/Diagnósticos (criar link, copiar).
- Conferir Biblioteca.
- Conferir Configurações (salvar perfil/telefone).
- Verificar se não há título repetido "YLADA YLADA" ou layout quebrado.

ENTREGA
- Tabela com ✅/⚠️/❌ por item (Onboarding, Board, Noel com N perguntas, Links, Biblioteca, Configurações, Aparência).
- Lista de ações prioritárias (o que corrigir primeiro).
- Observações sobre o Noel (respostas coerentes? link para post? criação de fluxo?).
```

---

*Relatório do último teste automático: **docs/RELATORIO-ULTIMO-TESTE-INTERNO.md**.*
