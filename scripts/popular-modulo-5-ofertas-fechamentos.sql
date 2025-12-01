-- Script para popular Módulo 5 - Ofertas e Fechamentos (ENERGY & ACELERA - 50 PV)
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
        'Ofertas e Fechamentos',
        'Transforme o diagnóstico em vendas consistentes, com foco estratégico nos produtos de maior resultado e maior giro: ENERGY (NRG) e ACELERA (Herbal Concentrate). O objetivo principal é garantir que cada cliente gere em média 50 pontos de volume.',
        5,
        '💰',
        true
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_modulo_id;

    IF v_modulo_id IS NULL THEN
        SELECT id INTO v_modulo_id
        FROM wellness_modulos
        WHERE trilha_id = v_trilha_id AND ordem = 5
        LIMIT 1;
    END IF;

    -- Aula 1: Como Funciona a Oferta Após o Diagnóstico
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Como Funciona a Oferta Após o Diagnóstico',
        'O diagnóstico cria o contexto perfeito para a oferta.

A oferta deve sempre **resolver a dor que apareceu no diagnóstico**.

### **Conexão Dor → Produto**

• **Cansaço → ENERGY**
• **Inchaço → ACELERA**
• **Metabolismo lento → ACELERA + ENERGY**
• **Barriga → ACELERA**
• **Retenção → ACELERA**
• **Falta de foco → ENERGY**

A oferta NÃO deve parecer venda.

Deve parecer **continuação natural da solução**.

Exemplo:

> "Com base no seu diagnóstico, seu corpo está pedindo dois ajustes principais: energia celular e aceleração do metabolismo. Eu te explico rapidinho como funciona e já te mostro a melhor opção para resolver isso hoje."',
        'texto',
        1,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 2: Ofertas com Kit Automático
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Ofertas com Kit Automático',
        'O kit automático aparece logo após o diagnóstico.

É ideal quando você quer vendas mais diretas e volume mais rápido.

### **Composição do Kit Recomendado (50+ PV)**

• **ENERGY** (produto principal)
• **ACELERA** (segundo produto principal)

**Opcional:**

• Fiber
• Liftoff
• CR7 Drive

### **Quando usar o kit automático:**

• Em anúncios
• Em tráfego frio
• Quando o cliente está respondendo rápido
• Quando a dor é clara

### Script de apresentação automática (adaptado):

> "Para resolver exatamente o que apareceu no seu diagnóstico, a combinação ideal é ENERGY + ACELERA. Eles vão te dar mais energia, diminuir o inchaço e acelerar o metabolismo. Esse é o protocolo inicial de 7 a 10 dias — rápido, simples e com resultado claro."',
        'texto',
        2,
        12,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 3: Ofertas Sem Kit (Fechamento Manual)
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Ofertas Sem Kit (Fechamento Manual)',
        'Essa abordagem funciona melhor para clientes mornas ou frias.

### **Estratégia geral:**

1. Reforçar a dor
2. Reforçar a causa
3. Mostrar risco de não resolver
4. Apresentar ENERGY ou ACELERA

### Script oficial:

> "Pelos seus resultados, sua energia e metabolismo estão muito baixos. É por isso que você sente cansaço e barriga mais estufada. Para resolver isso de forma simples, o que funciona muito é usar o ENERGY para o foco + disposição e o ACELERA para acelerar o metabolismo. Quer que eu te mostre como funciona certinho?"

### **Como criar urgência suave:**

> "Quanto mais tempo seu corpo fica nesse padrão, mais lento ele fica para reagir. Por isso é importante começar agora enquanto seu corpo ainda responde rápido."',
        'texto',
        3,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 4: Ofertas Híbridas
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Ofertas Híbridas',
        'Ideal quando o cliente não compra direto, mas demonstra interesse.

### Funcionamento:

1. Apresenta o kit
2. Se não fechar → apresenta oferta manual
3. Se ainda não fechar → apresenta protocolo mais simples
4. Direciona para ENERGY como porta de entrada

### Exemplo de oferta híbrida:

> "Tem o protocolo completo (ENERGY + ACELERA) — é o que dá resultado mais rápido. Mas se você quiser começar aos poucos, dá para iniciar somente com o ENERGY e depois complementar. O importante é começar."',
        'texto',
        4,
        8,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 5: Scripts de Fechamento Profissional
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Scripts de Fechamento Profissional',
        '## **Fechamento ENERGY**

> "Pelo que você relatou, sua energia está oscilando muito e isso interfere direto no metabolismo. O ENERGY ajuda exatamente nisso: foco, disposição e clareza mental. É um dos produtos que mais dão resultado rápido. Quer iniciar com ele hoje?"

## **Fechamento ACELERA**

> "Toda sua parte digestiva e metabólica está pedindo aceleração. O ACELERA ajuda seu corpo a queimar mais e diminuir retenção. É ele que vai agir diretamente na sua barriga e no inchaço. Posso te passar como usar certinho?"

## **Fechamento do Combo ENERGY + ACELERA** (fechamento campeão)

> "Seu diagnóstico mostrou tanto baixa energia quanto metabolismo lento. A solução mais eficiente é usar ENERGY + ACELERA juntos. Eles trabalham combinados e dão resultado visível nos primeiros dias. Posso te enviar as opções de início?"',
        'texto',
        5,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 6: Como Garantir Consumo Médio de 50 PV
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Como Garantir Consumo Médio de 50 PV',
        '### **1. Protocolo de 10 dias** (ideal para recorrência)

• ENERGY diariamente
• ACELERA 1–2x ao dia

### **2. Primeiro retorno em 72h**

Mensagem:

> "Oi, só passando para saber como você está! Já percebeu diferença na energia ou no inchaço?"

### **3. Renovação automática**

> "Seu corpo respondeu super bem nessa primeira semana. Para manter o resultado, o ideal é continuar mais um mês com ENERGY + ACELERA. Quer que eu já prepare o próximo kit?"

### **4. Upgrades opcionais para aumentar PV sem resistência**

• Turbinar o Energy com Liftoff
• Combinar Acelera com Fiber
• Adicionar CR7 para quem treina',
        'texto',
        6,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Scripts do Módulo 5
    INSERT INTO wellness_scripts (modulo_id, titulo, conteudo, categoria, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Apresentação do Kit Automático', 'Para resolver exatamente o que apareceu no seu diagnóstico, a combinação ideal é ENERGY + ACELERA. Eles vão te dar mais energia, diminuir o inchaço e acelerar o metabolismo. Esse é o protocolo inicial de 7 a 10 dias — rápido, simples e com resultado claro.', 'oferta', 1, true),
        (v_modulo_id, 'Fechamento ENERGY', 'Pelo que você relatou, sua energia está oscilando muito e isso interfere direto no metabolismo. O ENERGY ajuda exatamente nisso: foco, disposição e clareza mental. É um dos produtos que mais dão resultado rápido. Quer iniciar com ele hoje?', 'fechamento', 2, true),
        (v_modulo_id, 'Fechamento ACELERA', 'Toda sua parte digestiva e metabólica está pedindo aceleração. O ACELERA ajuda seu corpo a queimar mais e diminuir retenção. É ele que vai agir diretamente na sua barriga e no inchaço. Posso te passar como usar certinho?', 'fechamento', 3, true),
        (v_modulo_id, 'Fechamento Combo ENERGY + ACELERA', 'Seu diagnóstico mostrou tanto baixa energia quanto metabolismo lento. A solução mais eficiente é usar ENERGY + ACELERA juntos. Eles trabalham combinados e dão resultado visível nos primeiros dias. Posso te enviar as opções de início?', 'fechamento', 4, true),
        (v_modulo_id, 'Oferta Híbrida', 'Tem o protocolo completo (ENERGY + ACELERA) — é o que dá resultado mais rápido. Mas se você quiser começar aos poucos, dá para iniciar somente com o ENERGY e depois complementar. O importante é começar.', 'oferta', 5, true),
        (v_modulo_id, 'Objeção: Vou pensar', 'Claro! Só não deixa muito tempo passar, porque quanto mais o metabolismo desregula, mais difícil fica do corpo reagir. Quer que eu te mostre a opção mais simples para começar?', 'objecao', 6, true),
        (v_modulo_id, 'Objeção: Tá caro', 'Eu entendo. Mas pensa assim: isso aqui vai direto no ponto do que seu corpo está gritando para resolver. E o ENERGY + ACELERA são exatamente o que seu diagnóstico mostrou que está faltando. Quer que eu te mostre a opção que cabe melhor no mês?', 'objecao', 7, true),
        (v_modulo_id, 'Objeção: Tenho medo de não funcionar', 'Entendo totalmente. É por isso que o protocolo é personalizado pro seu caso — funciona porque ele resolve exatamente o que apareceu no seu diagnóstico. Quer que eu te explique rapidamente como usar para garantir resultado?', 'objecao', 8, true),
        (v_modulo_id, 'Retorno 72h', 'Oi, só passando para saber como você está! Já percebeu diferença na energia ou no inchaço?', 'acompanhamento', 9, true),
        (v_modulo_id, 'Renovação Automática', 'Seu corpo respondeu super bem nessa primeira semana. Para manter o resultado, o ideal é continuar mais um mês com ENERGY + ACELERA. Quer que eu já prepare o próximo kit?', 'renovacao', 10, true)
    ON CONFLICT DO NOTHING;

    -- Checklists do Módulo 5
    INSERT INTO wellness_checklists (modulo_id, item, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Entender como funciona a oferta após diagnóstico', 1, true),
        (v_modulo_id, 'Saber quando usar kit automático vs fechamento manual', 2, true),
        (v_modulo_id, 'Dominar scripts de fechamento ENERGY e ACELERA', 3, true),
        (v_modulo_id, 'Saber trabalhar ofertas híbridas', 4, true),
        (v_modulo_id, 'Ter scripts de objeções prontos', 5, true),
        (v_modulo_id, 'Garantir consumo médio de 50 PV por cliente', 6, true)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Módulo 5 - Ofertas e Fechamentos criado com sucesso!';
    RAISE NOTICE 'Módulo ID: %', v_modulo_id;

END $$;

