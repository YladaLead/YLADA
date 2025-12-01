-- Script para popular Módulo 6 - Como Gerar Clientes Todos os Dias (Orgânico Simples)
-- Executar após a migration criar-tabelas-trilha-aprendizado-wellness.sql

DO $$
DECLARE
    v_trilha_id UUID;
    v_modulo_id UUID;
BEGIN
    SELECT id INTO v_trilha_id
    FROM wellness_trilhas
    WHERE slug = 'distribuidor-iniciante'
    LIMIT 1;

    IF v_trilha_id IS NULL THEN
        RAISE EXCEPTION 'Trilha "distribuidor-iniciante" não encontrada. Execute a migration primeiro.';
    END IF;

    INSERT INTO wellness_modulos (trilha_id, nome, descricao, ordem, icone, is_ativo)
    VALUES (
        v_trilha_id,
        'Como Gerar Clientes Todos os Dias',
        'Aprenda a gerar clientes TODOS OS DIAS usando apenas o celular, sem anúncios, sem investimento, sem complexidade — apenas ações orgânicas simples, repetíveis e duplicáveis. Este módulo é a espinha dorsal do iniciante.',
        6,
        '📱',
        true
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_modulo_id;

    IF v_modulo_id IS NULL THEN
        SELECT id INTO v_modulo_id
        FROM wellness_modulos
        WHERE trilha_id = v_trilha_id AND ordem = 6
        LIMIT 1;
    END IF;

    -- Aula 1: A Regra de Ouro do Iniciante
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'A Regra de Ouro do Iniciante',
        '> **O iniciante NÃO pode complicar.**

> Ele deve seguir UM FLUXO, UMA POSTAGEM e UM SCRIPT por vez.

Nada de:

• mil posts diferentes
• campanhas avançadas
• técnicas difíceis
• cinco fluxos ao mesmo tempo

📌 **O objetivo é: 3 conversas abertas por dia → 1 diagnóstico → 1 venda a cada 1–3 dias.**',
        'texto',
        1,
        5,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 2: Como Gerar Clientes no Orgânico
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Como Gerar Clientes no Orgânico (Passo a Passo)',
        '## **1. Status do WhatsApp (a ferramenta mais poderosa)**

Postar **3 vezes ao dia**:

• Manhã: dor (ex: cansaço, intestino, barriga)
• Tarde: curiosidade (ex: "fiz um teste, olha isso 👀")
• Noite: CTA (ex: "quer fazer também?")

### Exemplos prontos:

**Manhã:**

> "Você anda cansada e inchada? O corpo sempre dá sinais."

**Tarde:**

> "Fiz um teste rapidinho e descobri algo importante…"

**Noite:**

> "Quer ver o seu também? Me chama aqui 👉📲"

📌 **Duplicável:** qualquer iniciante consegue postar isso.

---

## **2. Stories (Instagram ou WhatsApp)**

Roteiro de 3 stories:

1. Pergunta
2. Dor
3. CTA

Exemplo completo:

1. "Como anda sua energia hoje? (Baixa / Normal)"
2. "Sabia que 90% das mulheres sofrem com energia baixa e acham que é normal?"
3. "Se quiser, faço seu teste rápido aqui."

---

## **3. Lista Quente (as 10 primeiras pessoas)**

O iniciante deve enviar mensagem para 10 pessoas da sua lista:

Script pronto:

> "Amiga, fiz um teste super rápido sobre energia e metabolismo. Quer ver o seu resultado também?"

Essa frase **abre conversa na hora**.

---

## **4. Postagem Simples (Feed)**

O iniciante posta 1 vez por semana.

Modelo:

> "Você sente que sua energia caiu nos últimos meses? Eu fiz uma análise e fiquei chocada com o resultado. Se quiser ver o seu, me chama aqui."

Simples, real, duplicável.',
        'texto',
        2,
        15,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 3: Como Escolher o Fluxo
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Como Escolher o Fluxo (UM só no início)',
        'O iniciante deve trabalhar apenas com **1 fluxo nos primeiros 7 dias**.

📌 Fluxo Recomendado para Iniciantes:

### **Fluxo da Energia**

ou

### **Fluxo da Água**

Motivos:

• São universais
• Alta curiosidade
• Fácil de explicar
• Conecta com ENERGY + ACELERA

### Script para enviar o fluxo:

> "Amiga, faz esse teste rapidinho e me manda o resultado aqui 🔥"',
        'texto',
        3,
        8,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 4: Rotina Diária Simples
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Rotina Diária SIMPLES (15 minutos)',
        'O iniciante só precisa fazer isso:

### **1. Postar 3 status** (manhã, tarde, noite)

### **2. Postar 1 story** sobre dor

### **3. Mandar 3 mensagens para lista quente**

### **4. Responder quem chamar**

### **5. Enviar o fluxo**

### **6. Fazer 1 diagnóstico**

📌 **Se repetir isso por 7 dias → inevitavelmente vende.**',
        'texto',
        4,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 5: Scripts de Conversa para o Iniciante
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Scripts de Conversa para o Iniciante',
        '## **Mensagem de abertura**

> "Oi! Vi sua mensagem. Quer que eu faça seu teste agora?"

## **Mensagem pós-fluxo**

> "Prontinho, terminei sua análise!"

## **Puxando a dor**

> "Isso aqui explica sua energia baixa e essa sensação de cansaço que você relatou."

## **Mostrando a solução ENERGY**

> "Seu corpo está bem lento energeticamente. O ENERGY ajuda exatamente nisso: foco, disposição e clareza mental."

## **Mostrando a solução ACELERA**

> "E por conta do metabolismo lento, o ACELERA ajuda seu corpo a queimar mais e diminuir inchaço."

## **Fechamento simples**

> "Quer que eu te passe o protocolo certinho para você começar hoje?"

Duplicável.

Qualquer pessoa consegue enviar.',
        'texto',
        5,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 6: A Matemática do Iniciante
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'A Matemática do Iniciante',
        'Se o iniciante seguir esta rotina:

• 3 conversas abertas por dia
• 1 diagnóstico por dia
• 1 venda a cada 1–3 dias

Então ele bate:

• 50 PV com 1 cliente
• 100 PV com 2 clientes
• 300 PV com 6 clientes
• 1.000 PV com equipe duplicando o método

E tudo **sem gastar R$ 1**.',
        'texto',
        6,
        5,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Scripts do Módulo 6
    INSERT INTO wellness_scripts (modulo_id, titulo, conteudo, categoria, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Status Manhã', 'Você anda cansada e inchada? O corpo sempre dá sinais.', 'status', 1, true),
        (v_modulo_id, 'Status Tarde', 'Fiz um teste rapidinho e descobri algo importante…', 'status', 2, true),
        (v_modulo_id, 'Status Noite', 'Quer ver o seu também? Me chama aqui 👉📲', 'status', 3, true),
        (v_modulo_id, 'Mensagem Lista Quente', 'Amiga, fiz um teste super rápido sobre energia e metabolismo. Quer ver o seu resultado também?', 'abertura', 4, true),
        (v_modulo_id, 'Mensagem de Abertura', 'Oi! Vi sua mensagem. Quer que eu faça seu teste agora?', 'abertura', 5, true),
        (v_modulo_id, 'Mensagem Pós-Fluxo', 'Prontinho, terminei sua análise!', 'diagnostico', 6, true),
        (v_modulo_id, 'Puxando a Dor', 'Isso aqui explica sua energia baixa e essa sensação de cansaço que você relatou.', 'diagnostico', 7, true),
        (v_modulo_id, 'Solução ENERGY', 'Seu corpo está bem lento energeticamente. O ENERGY ajuda exatamente nisso: foco, disposição e clareza mental.', 'oferta', 8, true),
        (v_modulo_id, 'Solução ACELERA', 'E por conta do metabolismo lento, o ACELERA ajuda seu corpo a queimar mais e diminuir inchaço.', 'oferta', 9, true),
        (v_modulo_id, 'Fechamento Simples', 'Quer que eu te passe o protocolo certinho para você começar hoje?', 'fechamento', 10, true)
    ON CONFLICT DO NOTHING;

    -- Checklists do Módulo 6
    INSERT INTO wellness_checklists (modulo_id, item, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Entender a regra de ouro: não complicar', 1, true),
        (v_modulo_id, 'Criar rotina de 3 status por dia no WhatsApp', 2, true),
        (v_modulo_id, 'Postar stories com CTA', 3, true),
        (v_modulo_id, 'Enviar mensagens para lista quente (10 pessoas)', 4, true),
        (v_modulo_id, 'Escolher 1 fluxo para trabalhar nos primeiros 7 dias', 5, true),
        (v_modulo_id, 'Seguir rotina diária de 15 minutos', 6, true),
        (v_modulo_id, 'Ter scripts prontos para copiar e colar', 7, true)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Módulo 6 - Como Gerar Clientes Todos os Dias criado com sucesso!';
    RAISE NOTICE 'Módulo ID: %', v_modulo_id;

END $$;

