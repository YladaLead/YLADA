-- Script para popular Módulo 4 - Diagnóstico WOW do Wellness System
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
        'Diagnóstico WOW',
        'Transforme-se em um especialista na aplicação do Diagnóstico WOW, criando uma experiência que gera confiança, autoridade e aumenta a taxa de conversão entre 30% e 70%. O diagnóstico é o coração do sistema.',
        4,
        '✨',
        true
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_modulo_id;

    IF v_modulo_id IS NULL THEN
        SELECT id INTO v_modulo_id
        FROM wellness_modulos
        WHERE trilha_id = v_trilha_id AND ordem = 4
        LIMIT 1;
    END IF;

    -- Aula 1: O que é o Diagnóstico WOW
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'O que é o Diagnóstico WOW',
        'O Diagnóstico WOW é uma análise rápida, profissional e personalizada baseada no fluxo respondido pela cliente.

Ele transforma **respostas simples** em uma **explicação clara**, despertando associação imediata:

> "Agora faz sentido por que estou assim."

### Por que ele funciona tão bem:

• Mostra clareza sobre o problema.
• Cria autoridade instantânea.
• Faz a cliente sentir que recebeu algo valioso.
• Prepara a cabeça da pessoa para aceitar a solução.
• É personalizado, mesmo sendo automatizado.

### O Diagnóstico WOW segue 4 regras:

1. Mostrar a dor
2. Explicar a causa
3. Apontar riscos
4. Dar solução',
        'texto',
        1,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 2: Como Interpretar Cada Resposta
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Como Interpretar Cada Resposta',
        'O distribuidor precisa entender **como transformar dados em explicação profissional**.

## **1. Pontos Críticos da Água**

Indicam:

• Desidratação
• Retenção
• Inchaço
• Metabolismo lento

Frase exemplo:

> "Seu corpo está retendo muito líquido e isso está travando a sua barriga e energia."

## **2. Pontos Críticos da Proteína**

Indicam:

• Fome descontrolada
• Falta de firmeza
• Dificuldade para emagrecer

Exemplo:

> "Você tem sinais fortes de baixa proteína, e isso explica sua fome e falta de energia."

## **3. Pontos Críticos do Intestino**

Indicam:

• Intestino preso
• Estufamento
• Má absorção

Exemplo:

> "Seu intestino está funcionando muito abaixo do ideal, por isso sua barriga não desincha."

## **4. Pontos Críticos da Energia**

Indicam:

• Falta de vitaminas
• Excesso de estresse
• Sono ruim

## **5. Pontos Críticos da Idade Biológica**

Indicam:

• Rotina desregulada
• Alimentação pobre
• Falta de equilíbrio entre corpo e mente',
        'texto',
        2,
        12,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 3: O Roteiro de Atendimento
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'O Roteiro de Atendimento (Script Oficial)',
        'O roteiro deve ser **sempre o mesmo**, pois reduz erros e aumenta conversão.

### **1. Abertura profissional**

> "Oi, meu nome é ___, terminei aqui sua análise!"

### **2. Repetição do diagnóstico**

> "Pelos seus resultados, percebi que…"

### **3. Explicação simples do problema**

Explique em 20–30 segundos.

### **4. Mini aula de 30 segundos**

Exemplo:

> "Quando o intestino não funciona, nada no corpo funciona. A absorção cai, a energia cai e a barriga aumenta."

### **5. Conexão emocional**

> "Eu sei como é frustrante se sentir assim todos os dias… e ninguém te explicar o porquê."

### **6. Oferta natural**

> "Com base nisso, existem duas opções para resolver seu caso: posso te mostrar?"',
        'texto',
        3,
        15,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 4: Tipos de Clientes e Como Atender
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Tipos de Clientes e Como Atender',
        '## **1. Cliente Rápida**

✔️ Quer solução já.

Script:

> "Seu caso é simples e rápido de resolver. Posso te mostrar a solução agora?"

## **2. Cliente Insegura**

✔️ Precisa de acolhimento.

Script:

> "Eu entendo sua dúvida, e você não está sozinha. Deixa eu te explicar de forma bem simples…"

## **3. Cliente que Enrola**

✔️ Precisa de objetividade.

Script:

> "Para não tomar seu tempo, já vou direto no ponto…"

## **4. Cliente Fria**

✔️ Vai pelo racional.

Script:

> "Seu diagnóstico mostra 3 pontos claros que precisam ser ajustados…"

## **5. Cliente Analítica**

✔️ Quer detalhes.

Script:

> "Quer que eu te explique tecnicamente ou de forma resumida?"

## **6. Cliente que Quer Desconto**

✔️ Não dê desconto ⇒ dê valor.

Script:

> "O mais importante é você resolver isso agora. Me deixa te mostrar a melhor opção para o seu caso."',
        'texto',
        4,
        12,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 5: Scripts de Apoio
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Scripts de Apoio (Prontos para uso)',
        '## **1. Início da Conversa**

> "Prontinho, terminei sua análise! Posso te mostrar o que encontrei?"

## **2. Condução**

> "Isso aqui explica exatamente por que você está sentindo ___…"

## **3. Quebra de Objeções**

### *Objeção: Preciso pensar.*

> "Claro, só não deixa isso para depois — porque quanto mais tempo você demora, mais difícil fica para o corpo reagir."

### *Objeção: Não tenho tempo.*

> "Perfeito, justamente por isso a solução precisa ser prática e rápida."

### *Objeção: Tenho medo de não funcionar.*

> "Entendo, e é por isso que o protocolo é totalmente personalizado para o seu caso."

## **4. Fechamento**

> "Com base no seu diagnóstico, essa é a melhor opção para você começar hoje."

## **5. Confirmação do Pedido**

> "Perfeito! Só me confirme seu endereço e já preparo tudo para você."',
        'texto',
        5,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Scripts do Módulo 4
    INSERT INTO wellness_scripts (modulo_id, titulo, conteudo, categoria, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Abertura Profissional', 'Oi, meu nome é ___, terminei aqui sua análise!', 'abertura', 1, true),
        (v_modulo_id, 'Repetição do Diagnóstico', 'Pelos seus resultados, percebi que…', 'diagnostico', 2, true),
        (v_modulo_id, 'Explicação Simples', 'Quando o intestino não funciona, nada no corpo funciona. A absorção cai, a energia cai e a barriga aumenta.', 'explicacao', 3, true),
        (v_modulo_id, 'Conexão Emocional', 'Eu sei como é frustrante se sentir assim todos os dias… e ninguém te explicar o porquê.', 'emocional', 4, true),
        (v_modulo_id, 'Oferta Natural', 'Com base nisso, existem duas opções para resolver seu caso: posso te mostrar?', 'oferta', 5, true),
        (v_modulo_id, 'Objeção: Preciso pensar', 'Claro, só não deixa isso para depois — porque quanto mais tempo você demora, mais difícil fica para o corpo reagir.', 'objecao', 6, true),
        (v_modulo_id, 'Objeção: Não tenho tempo', 'Perfeito, justamente por isso a solução precisa ser prática e rápida.', 'objecao', 7, true),
        (v_modulo_id, 'Objeção: Tenho medo de não funcionar', 'Entendo, e é por isso que o protocolo é totalmente personalizado para o seu caso.', 'objecao', 8, true),
        (v_modulo_id, 'Fechamento', 'Com base no seu diagnóstico, essa é a melhor opção para você começar hoje.', 'fechamento', 9, true),
        (v_modulo_id, 'Confirmação do Pedido', 'Perfeito! Só me confirme seu endereço e já preparo tudo para você.', 'confirmacao', 10, true)
    ON CONFLICT DO NOTHING;

    -- Checklists do Módulo 4
    INSERT INTO wellness_checklists (modulo_id, item, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Entender o que é o Diagnóstico WOW', 1, true),
        (v_modulo_id, 'Saber interpretar respostas de cada fluxo', 2, true),
        (v_modulo_id, 'Dominar o roteiro de atendimento oficial', 3, true),
        (v_modulo_id, 'Saber identificar e atender cada tipo de cliente', 4, true),
        (v_modulo_id, 'Ter scripts de apoio prontos para usar', 5, true)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Módulo 4 - Diagnóstico WOW criado com sucesso!';
    RAISE NOTICE 'Módulo ID: %', v_modulo_id;

END $$;

