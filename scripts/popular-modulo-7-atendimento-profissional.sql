-- Script para popular Módulo 7 - Atendimento Profissional e Continuidade
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
        'Atendimento Profissional e Continuidade',
        'Aprenda a atender um cliente de forma profissional, simples e duplicável, garantindo resultado nos primeiros dias, confiança do cliente, continuidade do protocolo, e venda recorrente de ENERGY + ACELERA.',
        7,
        '💬',
        true
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_modulo_id;

    IF v_modulo_id IS NULL THEN
        SELECT id INTO v_modulo_id
        FROM wellness_modulos
        WHERE trilha_id = v_trilha_id AND ordem = 7
        LIMIT 1;
    END IF;

    -- Aula 1: A Regra do Atendimento Profissional
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'A Regra do Atendimento Profissional',
        '## O novo distribuidor precisa seguir 5 regras:

### **1. Atender rápido**

Responder dentro de minutos quando possível.

### **2. Ser simples**

Nada de termos técnicos.

Nada de explicação científica.

O cliente quer **clareza**, não aula.

### **3. Ser amigável e acolhedor**

O cliente tem que sentir que está sendo acompanhado.

### **4. Sempre falar baseado no diagnóstico**

Nunca inventar nada fora do que a cliente relatou.

### **5. Focar no ENERGY + ACELERA**

Eles formam o protocolo simples que qualquer cliente entende e começa rápido.',
        'texto',
        1,
        8,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 2: Como Conduzir os Primeiros 3 Dias
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Como Conduzir os Primeiros 3 Dias',
        'Esses 3 dias definem se o cliente vai continuar ou desistir.

Aqui está o **roteiro duplicável**.

---

## **📅 DIA 1 — Acolhimento + Como Usar**

Mensagem pronta:

> "Oi! Que bom que você começou hoje! Me avise quando tomar o ENERGY e me diga como se sentiu. Ele vai te ajudar na disposição e foco. E use o ACELERA 1–2x no dia para ajudar seu corpo a acelerar e desinchar. Qualquer dúvida, estou aqui!"

Objetivos do Dia 1:

• Ensinar como usar
• Criar confiança
• Mostrar que está presente

---

## **📅 DIA 2 — Acompanhamento e Pequena Vitória**

Mensagem pronta:

> "Bom dia! Como você acordou hoje? Normalmente no segundo dia já dá pra sentir alguma diferença na energia ou no inchaço. Me fala como foi aí!"

Objetivos do Dia 2:

• Buscar primeira vitória
• Validar o protocolo
• Aumentar o vínculo

---

## **📅 DIA 3 — Check-in + Preparação para Continuidade**

Mensagem pronta:

> "Oi! E aí, sentiu mais foco ou menos inchaço nesses primeiros dias? Isso é ótimo, porque seu corpo já está respondendo. Se seguir direitinho a semana toda, o resultado fica ainda melhor!"

Objetivos do Dia 3:

• Reforçar resultado
• Preparar continuidade
• Começar a puxar o próximo kit',
        'texto',
        2,
        15,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 3: Scripts de Continuidade e Retenção
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Scripts de Continuidade e Retenção',
        '## **1. Renovação do próximo kit (ENERGY + ACELERA)**

> "Você respondeu super bem nesses dias. Para manter o corpo acelerando e com energia, o ideal é seguir por mais um mês com ENERGY + ACELERA. Quer que eu já deixe separado para você?"

---

## **2. Cliente sumiu**

> "Oi! Só passando para ver como você está. Quero garantir que você esteja usando certinho e sentindo os benefícios. Me chama aqui quando puder! 💚"

---

## **3. Cliente que não está sentindo nada ainda**

> "É normal! Cada corpo reage de um jeito. Por isso é importante manter pelo menos 7 dias para o corpo ajustar. Continua que vai responder sim!"

---

## **4. Cliente que está AMANDO (hora de duplicar)**

> "Fico MUITO feliz que você está gostando! Inclusive, se conhecer alguém que também precisa melhorar energia ou metabolismo, posso fazer o mesmo teste para ela. Quer indicar alguém?"

---

## **5. Cliente reclamando ou insegura**

> "Entendo você! Por isso estou aqui te acompanhando. Vamos ajustar juntos. Me diga exatamente como você usou ontem e hoje para eu te ajudar certinho."',
        'texto',
        3,
        12,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 4: Como Garantir Resultados Rápidos
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Como Garantir Resultados Rápidos (Efeito WOW)',
        'O Efeito WOW acontece quando o cliente sente **um benefício rápido**, normalmente em:

• energia,
• foco,
• disposição,
• leveza,
• menos inchaço.

## Como garantir o efeito WOW:

• Ensinar a usar ENERGY pela manhã
• Ensinar a usar ACELERA 1–2x ao dia
• Fazer check-in diário
• Corrigir rapidamente erros de uso

## O que evitar:

• Explicar ciência demais
• Falar de dieta radical
• Colocar pressão
• Criar protocolos complicados',
        'texto',
        4,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 5: A Regra da Simplicidade Absoluta
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'A Regra da Simplicidade Absoluta',
        'O novo distribuidor precisa repetir isso como um mantra:

> **"Eu não ensino, eu não dou aula, eu não complico. Eu acompanho."**

## Como falar:

• Frases curtas
• Tom amigável
• Palavra simples
• Nada técnico

## Como NÃO falar:

• Termos científicos
• Aulas de nutrição
• Longas explicações
• Deixar o cliente confuso

📌 **Se o cliente entende rápido, ele segue.**

📌 **Se o cliente segue, ele compra novamente.**',
        'texto',
        5,
        8,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Scripts do Módulo 7
    INSERT INTO wellness_scripts (modulo_id, titulo, conteudo, categoria, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Dia 1 - Acolhimento', 'Oi! Que bom que você começou hoje! Me avise quando tomar o ENERGY e me diga como se sentiu. Ele vai te ajudar na disposição e foco. E use o ACELERA 1–2x no dia para ajudar seu corpo a acelerar e desinchar. Qualquer dúvida, estou aqui!', 'acompanhamento', 1, true),
        (v_modulo_id, 'Dia 2 - Acompanhamento', 'Bom dia! Como você acordou hoje? Normalmente no segundo dia já dá pra sentir alguma diferença na energia ou no inchaço. Me fala como foi aí!', 'acompanhamento', 2, true),
        (v_modulo_id, 'Dia 3 - Check-in', 'Oi! E aí, sentiu mais foco ou menos inchaço nesses primeiros dias? Isso é ótimo, porque seu corpo já está respondendo. Se seguir direitinho a semana toda, o resultado fica ainda melhor!', 'acompanhamento', 3, true),
        (v_modulo_id, 'Renovação do Kit', 'Você respondeu super bem nesses dias. Para manter o corpo acelerando e com energia, o ideal é seguir por mais um mês com ENERGY + ACELERA. Quer que eu já deixe separado para você?', 'renovacao', 4, true),
        (v_modulo_id, 'Cliente Sumiu', 'Oi! Só passando para ver como você está. Quero garantir que você esteja usando certinho e sentindo os benefícios. Me chama aqui quando puder! 💚', 'reativacao', 5, true),
        (v_modulo_id, 'Cliente Não Sente Nada', 'É normal! Cada corpo reage de um jeito. Por isso é importante manter pelo menos 7 dias para o corpo ajustar. Continua que vai responder sim!', 'suporte', 6, true),
        (v_modulo_id, 'Pedir Indicação', 'Fico MUITO feliz que você está gostando! Inclusive, se conhecer alguém que também precisa melhorar energia ou metabolismo, posso fazer o mesmo teste para ela. Quer indicar alguém?', 'indicacao', 7, true),
        (v_modulo_id, 'Cliente Reclamando', 'Entendo você! Por isso estou aqui te acompanhando. Vamos ajustar juntos. Me diga exatamente como você usou ontem e hoje para eu te ajudar certinho.', 'suporte', 8, true)
    ON CONFLICT DO NOTHING;

    -- Checklists do Módulo 7
    INSERT INTO wellness_checklists (modulo_id, item, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Seguir as 5 regras do atendimento profissional', 1, true),
        (v_modulo_id, 'Enviar mensagem do Dia 1 (acolhimento)', 2, true),
        (v_modulo_id, 'Enviar mensagem do Dia 2 (acompanhamento)', 3, true),
        (v_modulo_id, 'Enviar mensagem do Dia 3 (check-in)', 4, true),
        (v_modulo_id, 'Garantir efeito WOW nos primeiros dias', 5, true),
        (v_modulo_id, 'Manter simplicidade absoluta na comunicação', 6, true),
        (v_modulo_id, 'Saber reativar clientes que sumiram', 7, true),
        (v_modulo_id, 'Pedir indicações quando cliente está gostando', 8, true)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Módulo 7 - Atendimento Profissional criado com sucesso!';
    RAISE NOTICE 'Módulo ID: %', v_modulo_id;

END $$;

