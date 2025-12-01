-- Script para popular Módulo 3 - Ferramentas de Atração do Wellness System
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
        'Ferramentas de Atração',
        'Aprenda a utilizar estrategicamente todos os fluxos e ferramentas que atraem pessoas de forma automática, curiosa e com alta probabilidade de engajamento. Aqui nasce o contato, a curiosidade, e a abertura da conversa.',
        3,
        '🎯',
        true
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_modulo_id;

    IF v_modulo_id IS NULL THEN
        SELECT id INTO v_modulo_id
        FROM wellness_modulos
        WHERE trilha_id = v_trilha_id AND ordem = 3
        LIMIT 1;
    END IF;

    -- Aula 1: Os Fluxos Principais de Atração
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Os Fluxos Principais de Atração',
        'Os fluxos foram criados para ativar **curiosidade imediata** e gerar leads qualificados. Cada um toca em uma dor que as pessoas já sentem.

## **1. Fluxo da Água** (um dos mais fortes)

Ativa: retenção, inchaço, dores de cabeça, fome excessiva.

Uso ideal:

• Brasileiras nos EUA
• Pessoas com barriga e inchaço
• Anúncios de custo barato

## **2. Fluxo da Proteína**

Ativa: fraqueza, fome, dificuldade de emagrecer, flacidez.

Uso ideal:

• Pessoas que "comem pouco e não emagrecem"
• Pessoas cansadas

## **3. Fluxo do Parasita**

Ativa: coceiras, gases, barriga estufada, imunidade baixa.

Uso ideal:

• Anúncios
• Tópico viral
• Leads curiosas

## **4. Fluxo da Barriga**

Ativa: gordura abdominal, inchaço, retenção.

Uso ideal:

• Conversas rápidas
• Reels

## **5. Fluxo do Intestino**

Ativa: intestino preso, gases, mal-estar.

Uso ideal:

• Mulheres 25–55 anos
• Brasileiras com rotina corrida

## **6. Fluxo da Energia**

Ativa: cansaço, preguiça, lentidão, ansiedade.

Uso ideal:

• Público de escritório
• Donas de casa cansadas

## **7. Fluxo da Idade Biológica**

Ativa: curiosidade absurda.

Uso ideal:

• Anúncios virais
• Status do WhatsApp

## **8. Fluxo do Metabolismo**

Ativa: lentidão, dificuldade de emagrecer.

Uso ideal:

• Clientes que tentaram várias dietas

## **9. Fluxo do Sono**

Ativa: insônia, descanso ruim.

Uso ideal:

• Pessoas acima de 35 anos
• Clientes com ansiedade

## **10. Fluxo da Ansiedade** (opcional)

Ativa: compulsão alimentar, fome emocional.',
        'texto',
        1,
        15,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 2: Quando Usar Cada Fluxo
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Quando Usar Cada Fluxo (Mapa Estratégico)',
        'A escolha do fluxo certo aumenta conversão.

## **Por tipo de dor:**

• **Barriga / inchaço:** Água, Barriga, Parasita, Intestino
• **Fome / compulsão:** Proteína, Ansiedade
• **Cansaço:** Energia, Metabolismo
• **Sono ruim:** Sono, Energia
• **Curiosidade:** Idade Biológica, Parasita

## **Por tipo de cliente:**

• Cliente rápido → Água, Parasita
• Cliente insegura → Proteína, Metabolismo
• Cliente que enrola → Idade Biológica
• Cliente cold → Fluxo da Energia
• Cliente acima de 40 → Sono, Metabolismo, Intestino

## **Por campanha:**

• Campanhas EUA: Água, Proteína, Parasita, Barriga
• Campanhas Brasil: Intestino, Energia, Sono',
        'texto',
        2,
        12,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 3: Atração Orgânica
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Atração Orgânica (Métodos gratuitos)',
        '## **1. Reels de 6–10s**

Formato campeão:

• Um gancho
• Uma frase forte
• CTA para o fluxo

Exemplo:

> "Seu intestino não funciona e você não sabe por quê? Descubra aqui."

## **2. Status do WhatsApp**

Poste 3 vezes ao dia:

• Manhã: frase
• Tarde: dor
• Noite: CTA para fluxo

## **3. Stories com CTA**

Ideias:

• Enquetes
• Caixas de pergunta
• Antes e depois (se tiver)
• Mini-aulas

## **4. Grupos de Facebook**

Publicar em grupos de brasileiras nos EUA usando:

• Água
• Parasita
• Proteína

## **5. Scripts curtos de abordagem**

Exemplos prontos:

> "Amiga, fiz um teste rapidinho e preciso te mostrar. Você quer ver o seu?"

> "Esse teste me chocou! Quer fazer também?"',
        'texto',
        3,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 4: Atração com Anúncios
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Atração com Anúncios (Simples e eficiente)',
        'Você NÃO precisa complicar.

## **Melhores públicos**

• Brasileiras nos EUA
• Mulheres 25–55 anos
• Interesses: saúde, bem-estar, emagrecimento

## **Melhores criativos**

• Vídeo simples
• Texto sobre dor
• Bandeirinha do Brasil 🇧🇷

## **Copys recomendadas**

> "🇧🇷 Brasileiras nos EUA: Faça o teste e descubra por que seu intestino não funciona."

> "🇧🇷 Seu nível de proteína pode estar te impedindo de emagrecer. Descubra aqui."

## **Botão ideal:**

**"Fale Conosco"** ou **"Saiba mais"**',
        'texto',
        4,
        8,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 5: Criando Efeito Viral
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Criando Efeito Viral (Muito importante)',
        'O segredo do Wellness System é que os próprios clientes **espalham** os fluxos.

### Scripts para multiplicar:

> "Mande para duas amigas e comparem os resultados."

> "Mostra esse teste para quem vive reclamando do intestino."

> "Isso aqui precisa chegar nas suas amigas que vivem cansadas."

## Como ativar o viral:

• Peça sempre para enviar para alguém
• Use frases curtas e curiosas
• Poste diariamente
• Repetição é tudo',
        'texto',
        5,
        8,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Checklists do Módulo 3
    INSERT INTO wellness_checklists (modulo_id, item, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Conhecer todos os fluxos disponíveis', 1, true),
        (v_modulo_id, 'Saber quando usar cada fluxo', 2, true),
        (v_modulo_id, 'Criar rotina de posts orgânicos (status, stories)', 3, true),
        (v_modulo_id, 'Preparar scripts de abordagem', 4, true),
        (v_modulo_id, 'Entender como criar efeito viral', 5, true)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Módulo 3 - Ferramentas de Atração criado com sucesso!';
    RAISE NOTICE 'Módulo ID: %', v_modulo_id;

END $$;

