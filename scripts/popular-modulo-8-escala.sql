-- Script para popular Módulo 8 - Escalando de Forma Simples e Duplicável
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
        'Escalando de Forma Simples',
        'Aprenda como crescer de forma consistente, seguindo ações simples e repetíveis. Sem complicar. Sem técnicas avançadas. Apenas disciplina + duplicação, usando os fundamentos já aprendidos.',
        8,
        '🚀',
        true
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_modulo_id;

    IF v_modulo_id IS NULL THEN
        SELECT id INTO v_modulo_id
        FROM wellness_modulos
        WHERE trilha_id = v_trilha_id AND ordem = 8
        LIMIT 1;
    END IF;

    -- Aula 1: A Regra da Escala Simples
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'A Regra da Escala Simples',
        'A regra número 1 da escala é:

> **Escalar NÃO é fazer mais. É repetir o que funciona.**

O iniciante só deve escalar quando já estiver:

• fazendo 3 conversas por dia,
• 1 diagnóstico por dia,
• vendendo ENERGY + ACELERA,
• acompanhando cliente.

**Escala = consistência, não complexidade.**',
        'texto',
        1,
        8,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 2: A Rotina de Produção de Resultados
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'A Rotina de Produção de Resultados',
        'O distribuidor aprende que escala começa com **rotina**, não com sorte.

## Rotina diária duplicável:

1. **3 conversas abertas** (lista quente/morna)
2. **1 fluxo enviado**
3. **1 diagnóstico feito**
4. **1 follow-up** em cliente em uso
5. **1 status de dor**
6. **1 story simples**

Se uma pessoa fizer isso por **30 dias**, ela cresce.

Se uma equipe inteira fizer isso por 30 dias, ela EXPLODE.',
        'texto',
        2,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 3: Multiplicando Clientes com Indicações
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Multiplicando Clientes com Indicações',
        'Indicação é a forma mais simples e poderosa de escalar.

### Quando pedir indicação?

• Após elogio
• Após resultado no ENERGY
• Após cliente dizer que está gostando

### Script duplicável:

> "Que bom que você está gostando! Se você conhecer alguém que também precisa melhorar energia ou metabolismo, posso fazer o mesmo teste pra ela. Quer indicar alguém?"

### Por que funciona?

• Não é invasivo
• Não é pedido explícito de venda
• É natural

📌 Uma indicação vale mais que 10 anúncios.',
        'texto',
        3,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 4: Duplicando o Método para Outras Pessoas
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Duplicando o Método para Outras Pessoas',
        'Escala real começa quando você **ensina outra pessoa a fazer o que você faz**.

O iniciante não ensina técnica avançada.

Ele ensina APENAS o básico:

## O que duplicar:

• Como postar status
• Como enviar o fluxo
• Como fazer o diagnóstico simples
• Como apresentar ENERGY + ACELERA
• Como acompanhar 3 dias

## O que NÃO duplicar:

• Lives
• Treinos complicados
• Explicação científica
• Estratégias avançadas

📌 Se a pessoa consegue repetir no mesmo dia → isso é duplicável.',
        'texto',
        4,
        12,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 5: Mini-Rotina Semanal
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Mini-Rotina Semanal (GUIA PRONTO)',
        '### ✔️ Segunda

• Post de dor
• 3 conversas da lista

### ✔️ Terça

• Story de energia
• 1 diagnóstico

### ✔️ Quarta

• Story de curiosidade
• Follow-up dos clientes da semana

### ✔️ Quinta

• Post de resultado (mesmo simples)
• 3 fluxos enviados

### ✔️ Sexta

• Status forte de dor
• Pedido de indicação

### ✔️ Sábado

• Story pessoal + CTA leve

### ✔️ Domingo

• Zero trabalho → dia de descanso para manter consistência

Essa rotina mantém o distribuidor em movimento **sem sobrecarregar**.',
        'texto',
        5,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 6: A Matemática da Escala
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'A Matemática da Escala',
        '## Se um distribuidor segue o sistema:

• 3 conversas/dia
• 1 diagnóstico/dia
• ENERGY + ACELERA como solução padrão
• Acompanhamento simples

Ele consegue:

• 8 a 12 vendas por mês
• 400 a 600 PV mensal
• 1.000 PV se duplicar para 2 pessoas
• 3.000 PV se duplicar para 5 pessoas

## Escala REAL é assim:

> 1 faz → 1 cresce

> 3 fazem → 3 crescem

> 10 fazem → vira um movimento

E tudo SEM anúncios, SEM complicação, SEM fórmulas mágicas.',
        'texto',
        6,
        8,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Scripts do Módulo 8
    INSERT INTO wellness_scripts (modulo_id, titulo, conteudo, categoria, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Pedir Indicação', 'Que bom que você está gostando! Se você conhecer alguém que também precisa melhorar energia ou metabolismo, posso fazer o mesmo teste pra ela. Quer indicar alguém?', 'indicacao', 1, true),
        (v_modulo_id, 'Status Segunda - Dor', 'Você anda cansada e inchada? O corpo sempre dá sinais.', 'status', 2, true),
        (v_modulo_id, 'Story Terça - Energia', 'Como anda sua energia hoje? (Baixa / Normal)', 'story', 3, true),
        (v_modulo_id, 'Story Quarta - Curiosidade', 'Sabia que 90% das mulheres sofrem com energia baixa e acham que é normal?', 'story', 4, true),
        (v_modulo_id, 'Post Quinta - Resultado', 'Você sente que sua energia melhorou nos últimos dias? Eu fiz uma análise e fiquei chocada com o resultado. Se quiser ver o seu, me chama aqui.', 'post', 5, true),
        (v_modulo_id, 'Status Sexta - Dor Forte', 'Seu intestino não funciona e você não sabe por quê? Descubra aqui.', 'status', 6, true),
        (v_modulo_id, 'Story Sábado - Pessoal', 'Comecei a usar ENERGY + ACELERA e já sinto diferença na energia! Quer fazer seu teste também?', 'story', 7, true)
    ON CONFLICT DO NOTHING;

    -- Checklists do Módulo 8
    INSERT INTO wellness_checklists (modulo_id, item, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Entender que escala é repetição, não complexidade', 1, true),
        (v_modulo_id, 'Seguir rotina diária de produção de resultados', 2, true),
        (v_modulo_id, 'Pedir indicações após elogios e resultados', 3, true),
        (v_modulo_id, 'Duplicar o método básico para outras pessoas', 4, true),
        (v_modulo_id, 'Seguir mini-rotina semanal', 5, true),
        (v_modulo_id, 'Entender a matemática da escala', 6, true)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Módulo 8 - Escalando de Forma Simples criado com sucesso!';
    RAISE NOTICE 'Módulo ID: %', v_modulo_id;

END $$;

