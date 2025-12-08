-- =====================================================
-- SEED COMPLETO - RESPOSTAS ALTERNATIVAS GRUPO E (AVANÇADAS)
-- Baseado em docs/noel-lousas/respostas-alternativas/respostas-alternativas-parte-3.md
-- Este script ATUALIZA as objeções avançadas/emocionais já inseridas
-- =====================================================

BEGIN;

-- =====================================================
-- GRUPO E — OBJECÇÕES AVANÇADAS E EMOCIONAIS (E.1 a E.5)
-- =====================================================

-- E.1 — "Medos ocultos"
UPDATE wellness_objecoes
SET 
  versao_curta = '[nome], fico feliz que você tenha dito isso. 😊 Todo mundo tem medos que não fala — e o Wellness foi feito justamente para caminhar com você, não contra você.',
  versao_media = 'Obrigado por abrir isso comigo, [nome]. 🙏 Muitas vezes o medo não é do projeto — é do desconhecido. E está tudo bem. A gente caminha junto, no seu ritmo, sem pressão. Quero te ajudar a ganhar clareza, porque quando a gente entende o caminho, o medo diminui muito. Quer que eu te mostre um jeito leve de começar sem risco?',
  versao_longa = 'Obrigado por abrir isso comigo, [nome]. 🙏 Muitas vezes o medo não é do projeto — é do desconhecido. E está tudo bem. A gente caminha junto, no seu ritmo, sem pressão. Quero te ajudar a ganhar clareza, porque quando a gente entende o caminho, o medo diminui muito. Quer que eu te mostre um jeito leve de começar sem risco?',
  gatilho_retomada = '[nome], posso te ajudar a identificar qual medo específico está te segurando? Assim eu te mostro exatamente como o Wellness resolve isso. 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou sobre ter medos. Separei aqui uma forma bem leve de começar sem risco, só pra você ver como é possível. Quer que eu envie?',
  resposta_se_negativa = 'Imagina, [nome], super respeito seus medos. ❤️ Eles são reais e não dá pra ignorar. Se quiser, posso te mostrar só a parte mais segura do processo — sem pressão e sem risco. Pode ser?',
  upgrade = NULL
WHERE categoria = 'avancadas' AND codigo = 'E.1';

-- E.2 — "Resistência emocional"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Totalmente compreensível, [nome]. ❤️ Às vezes a resistência não é contra o projeto — é contra uma mudança que parece grande demais.',
  versao_media = 'Totalmente compreensível, [nome]. ❤️ Às vezes a resistência não é contra o projeto — é contra uma mudança que parece grande demais. Aqui você não precisa mudar tudo: só dar um passo pequeno. E eu te ajudo em cada um deles. Me conta: o que mais te pega por dentro quando pensa nisso?',
  versao_longa = 'Totalmente compreensível, [nome]. ❤️ Às vezes a resistência não é contra o projeto — é contra uma mudança que parece grande demais. Aqui você não precisa mudar tudo: só dar um passo pequeno. E eu te ajudo em cada um deles. Me conta: o que mais te pega por dentro quando pensa nisso?',
  gatilho_retomada = '[nome], posso te ajudar a identificar o que especificamente está gerando essa resistência? Assim eu te mostro como o Wellness resolve isso de forma leve. 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou sobre sentir resistência. Separei uma forma bem leve de começar sem precisar mudar tudo de uma vez. Quer que eu envie?',
  resposta_se_negativa = 'Imagina, [nome], super respeito. ❤️ A resistência é real e não dá pra forçar. Se quiser, posso te mostrar só a parte mais leve do processo — sem pressão e sem mudanças grandes. Pode ser?',
  upgrade = NULL
WHERE categoria = 'avancadas' AND codigo = 'E.2';

-- E.3 — "Justificativas sociais"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Entendo demais, [nome]. A opinião dos outros pesa mesmo. Mas deixa eu te dizer uma coisa leve: ninguém vive sua vida por você.',
  versao_media = 'Entendo demais, [nome]. A opinião dos outros pesa mesmo. Mas deixa eu te dizer uma coisa leve: ninguém vive sua vida por você. E quando as pessoas começam a ver seus resultados, a conversa muda rápido. Você não precisa anunciar nada — só caminhar em silêncio e deixar o resultado falar. Quer começar de forma discreta?',
  versao_longa = 'Entendo demais, [nome]. A opinião dos outros pesa mesmo. Mas deixa eu te dizer uma coisa leve: ninguém vive sua vida por você. E quando as pessoas começam a ver seus resultados, a conversa muda rápido. Você não precisa anunciar nada — só caminhar em silêncio e deixar o resultado falar. Quer começar de forma discreta?',
  gatilho_retomada = '[nome], posso te mostrar como trabalhar no Wellness de forma discreta, sem precisar se expor? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou sobre a opinião dos outros. Separei uma forma bem discreta de trabalhar sem se expor. Quer que eu envie?',
  resposta_se_negativa = 'Imagina, [nome], super respeito. ❤️ A opinião dos outros realmente pesa. Se quiser, posso te mostrar só a parte mais discreta do processo — sem pressão e sem exposição. Pode ser?',
  upgrade = NULL
WHERE categoria = 'avancadas' AND codigo = 'E.3';

-- E.4 — "Bloqueios financeiros"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Super respeito seu momento, [nome]. 🙏 A ideia aqui não é te apertar, e sim te ajudar a encontrar uma forma leve de começar.',
  versao_media = 'Super respeito seu momento. 🙏 A ideia aqui não é te apertar, e sim te ajudar a encontrar uma forma leve de começar. Tem caminhos bem econômicos onde você já recupera rápido o que investiu. Se quiser, te mostro a forma mais segura pra você dar o primeiro passo sem peso. Pode ser?',
  versao_longa = 'Super respeito seu momento. 🙏 A ideia aqui não é te apertar, e sim te ajudar a encontrar uma forma leve de começar. Tem caminhos bem econômicos onde você já recupera rápido o que investiu. Se quiser, te mostro a forma mais segura pra você dar o primeiro passo sem peso. Pode ser?',
  gatilho_retomada = '[nome], posso te mostrar a forma mais econômica e segura de começar no Wellness? 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou sobre bloqueios financeiros. Separei a forma mais leve e econômica de começar. Quer que eu envie?',
  resposta_se_negativa = 'Imagina, [nome], super respeito seu momento. ❤️ Se quiser, posso te mostrar só as opções mais econômicas — sem pressão e sem peso financeiro. Pode ser?',
  upgrade = NULL
WHERE categoria = 'avancadas' AND codigo = 'E.4';

-- E.5 — "Crenças limitantes"
UPDATE wellness_objecoes
SET 
  versao_curta = 'Obrigado por confiar em mim pra falar disso, [nome]. ❤️ Muitas vezes não é uma crença — é uma história que alguém contou pra você.',
  versao_media = 'Obrigado por confiar em mim pra falar disso. ❤️ Muitas vezes não é uma crença — é uma história que alguém contou pra você, e que ficou aí dentro. Mas nada disso define seu futuro. Vamos construir uma narrativa nova, leve, que combina com quem você está se tornando. Posso te mostrar um jeito simples de destravar isso juntos?',
  versao_longa = 'Obrigado por confiar em mim pra falar disso. ❤️ Muitas vezes não é uma crença — é uma história que alguém contou pra você, e que ficou aí dentro. Mas nada disso define seu futuro. Vamos construir uma narrativa nova, leve, que combina com quem você está se tornando. Posso te mostrar um jeito simples de destravar isso juntos?',
  gatilho_retomada = '[nome], posso te ajudar a identificar qual crença específica está te limitando? Assim eu te mostro como o Wellness ajuda a construir uma nova narrativa. 😊',
  resposta_se_some = 'Oi, [nome]! Tudo bem? 😊 Lembrei que você comentou sobre crenças limitantes. Separei uma forma bem leve de começar a construir uma nova narrativa. Quer que eu envie?',
  resposta_se_negativa = 'Imagina, [nome], super respeito. ❤️ As crenças são reais e não dá pra ignorar. Se quiser, posso te mostrar só a parte mais leve do processo — sem pressão e sem forçar mudanças. Pode ser?',
  upgrade = NULL
WHERE categoria = 'avancadas' AND codigo = 'E.5';

COMMIT;

-- =====================================================
-- RESUMO
-- =====================================================
-- Grupo E (Avançadas): 5 objeções atualizadas
-- TOTAL GERAL: 40 objeções com respostas alternativas completas
-- =====================================================

