-- Script para popular Módulo 1 - Fundamentos do Wellness System
-- Executar após a migration criar-tabelas-trilha-aprendizado-wellness.sql

-- =====================================================
-- 1. BUSCAR ID DA TRILHA
-- =====================================================
DO $$
DECLARE
    v_trilha_id UUID;
    v_modulo_id UUID;
BEGIN
    -- Buscar ID da trilha "Distribuidor Iniciante"
    SELECT id INTO v_trilha_id
    FROM wellness_trilhas
    WHERE slug = 'distribuidor-iniciante'
    LIMIT 1;

    IF v_trilha_id IS NULL THEN
        RAISE EXCEPTION 'Trilha "distribuidor-iniciante" não encontrada. Execute a migration primeiro.';
    END IF;

    -- =====================================================
    -- 2. CRIAR MÓDULO 1
    -- =====================================================
    INSERT INTO wellness_modulos (trilha_id, nome, descricao, ordem, icone, is_ativo)
    VALUES (
        v_trilha_id,
        'Fundamentos do Wellness System',
        'Compreenda o que é o Wellness System, seus 3 pilares, como funciona o fluxo geral de vendas e por que o modelo converte.',
        1,
        '📚',
        true
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_modulo_id;

    -- Se não inseriu, buscar o ID existente
    IF v_modulo_id IS NULL THEN
        SELECT id INTO v_modulo_id
        FROM wellness_modulos
        WHERE trilha_id = v_trilha_id AND ordem = 1
        LIMIT 1;
    END IF;

    -- =====================================================
    -- 3. CRIAR AULAS DO MÓDULO 1
    -- =====================================================

    -- Aula 1: O que é o Wellness System
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'O que é o Wellness System',
        'O **Wellness System** é um ecossistema de ferramentas, fluxos, diagnósticos e scripts de IA criado para:

• Atração inteligente de leads
• Diagnóstico automatizado e profissional
• Fechamento eficiente
• Escala com pouco esforço

Ele combina **tecnologia + scripts prontos + fluxos estratégicos** que tornam qualquer pessoa capaz de gerar conversões mesmo sem experiência prévia.

### Os pilares fundamentais:

• Simplicidade
• Personalização
• Velocidade
• Resultados reais

### O que o distribuidor ganha:

• Leads todos os dias
• Conversas abertas automaticamente
• Ferramentas que eliminam objeções
• Diagnósticos prontos que vendem sozinhos
• Método replicável para crescer

### O que o cliente ganha:

• Uma avaliação completa e profissional
• Clareza sobre seus problemas
• Protocolos personalizados
• Acompanhamento organizado
• Experiência superior',
        'texto',
        1,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 2: Os 3 Pilares do Wellness System
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Os 3 Pilares do Wellness System',
        '## **1. Atração Inteligente**

Ferramentas e fluxos que geram leads automaticamente:

• Água
• Proteína
• Parasitas
• Barriga
• Intestino
• Idade Biológica
• Metabolismo
• Energia

Esses fluxos criam **curiosidade**, **interesse** e **engajamento imediato**, abrindo conversas com qualidade.

---

## **2. Diagnóstico WOW**

O momento mais poderoso do sistema.

O diagnóstico:

• Usa IA
• Interpreta respostas
• Entrega clareza para a pessoa
• Mostra onde está o problema
• Facilita o fechamento

É o momento em que o cliente pensa:

> "Uau, ninguém nunca me explicou isso assim."

---

## **3. Oferta e Conversão**

Após o diagnóstico, o sistema leva o cliente para:

• Oferta com kit (automática)
• Oferta com botão (manual)
• Oferta híbrida

Tudo com scripts prontos que:

• Tiram dúvidas
• Eliminam objeções
• Guiam a pessoa para a compra',
        'texto',
        2,
        15,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 3: Como o Modelo Funciona na Prática
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Como o Modelo Funciona na Prática',
        'O fluxo geral é sempre:

**1. Atração → 2. Diagnóstico → 3. Oferta → 4. Fechamento → 5. Acompanhamento → 6. Escala**

### 1. Atração

Através dos fluxos.

Eles fazem o "trabalho duro":

• chamam atenção
• geram curiosidade
• abrem conversa

### 2. Diagnóstico

Onde entra o profissionalismo.

O diferencial.

O momento "WOW".

### 3. Oferta

Fechamento com kit ou com botão, dependendo da estratégia escolhida.

### 4. Fechamento

Scripts prontos + objeções quebradas.

### 5. Acompanhamento

O que mantém o cliente ativo.

### 6. Escala

Com anúncios, parcerias e automações.',
        'texto',
        3,
        12,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 4: Por que o Wellness System Converte Tanto
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Por que o Wellness System Converte Tanto',
        '### **Motivo 1 — O sistema resolve a dor antes de vender**

O fluxo + diagnóstico mostra o problema da pessoa.

Quando a dor está clara → a venda é natural.

### **Motivo 2 — Scripts profissionais**

Você não improvisa.

Segue o roteiro.

É por isso que converte.

### **Motivo 3 — IA que aumenta a autoridade**

O cliente sente que recebeu uma análise real.

### **Motivo 4 — Múltiplas ofertas**

Kit

Botão

Acompanhamento

Programa

Híbrido

Sempre existe um caminho para a compra.

### **Motivo 5 — É replicável**

Qualquer pessoa consegue aplicar.

Experiência não é necessária.',
        'texto',
        4,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 5: Visão Geral das Ferramentas
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Visão Geral das Ferramentas',
        '### Você terá acesso a:

• Fluxos que atraem (água, parasitas, proteína etc.)
• Diagnósticos automáticos
• Scripts de atendimento
• Scripts de fechamento
• Scripts de objeções
• Ofertas automáticas
• Personalização de botões
• IA integrada

É tudo o que você precisa para:

• Captar
• Diagnosticar
• Fechar
• Escalar',
        'texto',
        5,
        8,
        true
    )
    ON CONFLICT DO NOTHING;

    -- =====================================================
    -- 4. CRIAR CHECKLISTS DO MÓDULO 1
    -- =====================================================

    INSERT INTO wellness_checklists (modulo_id, item, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Entender o que é o Wellness System', 1, true),
        (v_modulo_id, 'Compreender os 3 pilares (Atração, Diagnóstico, Oferta)', 2, true),
        (v_modulo_id, 'Entender o fluxo completo: Atração → Diagnóstico → Oferta → Fechamento → Acompanhamento → Escala', 3, true),
        (v_modulo_id, 'Saber por que o sistema converte tanto', 4, true),
        (v_modulo_id, 'Conhecer todas as ferramentas disponíveis', 5, true)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Módulo 1 - Fundamentos do Wellness System criado com sucesso!';
    RAISE NOTICE 'Trilha ID: %', v_trilha_id;
    RAISE NOTICE 'Módulo ID: %', v_modulo_id;

END $$;

