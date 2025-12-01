-- Script para popular Módulo 2 - Configuração Completa do Sistema Wellness
-- Executar após a migration criar-tabelas-trilha-aprendizado-wellness.sql

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

    -- Criar Módulo 2
    INSERT INTO wellness_modulos (trilha_id, nome, descricao, ordem, icone, is_ativo)
    VALUES (
        v_trilha_id,
        'Configuração Completa do Sistema',
        'Aprenda a configurar completamente o seu Wellness System — desde a criação da conta até integrações avançadas com WhatsApp, botões, kits, produtos e IA — para que o sistema comece a gerar leads, diagnósticos e vendas imediatamente.',
        2,
        '⚙️',
        true
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_modulo_id;

    IF v_modulo_id IS NULL THEN
        SELECT id INTO v_modulo_id
        FROM wellness_modulos
        WHERE trilha_id = v_trilha_id AND ordem = 2
        LIMIT 1;
    END IF;

    -- Aula 1: Criando e Personalizando sua Conta
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Criando e Personalizando sua Conta',
        '### 1. Criando a conta

• Acesse o link oficial da plataforma.
• Clique em **Criar conta**.
• Cadastre: nome, e-mail, telefone.
• Confirme o e-mail (se solicitado).

### 2. Personalizando o perfil

Um perfil completo aumenta a confiança e a conversão.

Inclua:

• **Nome profissional** (ex.: *André — Especialista em Bem‑Estar*)
• **Foto profissional** (rosto claro, fundo limpo)
• **Mini descrição**: exemplo pronto:

> "Ajudo brasileiras nos EUA a melhorar energia, barriga, metabolismo e intestino através de métodos simples e personalizados."

### 3. Link profissional

Esse link é o seu principal ativo.

Você pode usar em:

• Bio do Instagram
• Status do WhatsApp
• Anúncios
• Parcerias
• QR codes',
        'texto',
        1,
        8,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 2: Configurando Botões, Kit e Produtos
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Configurando Botões, Kit e Produtos',
        '## **1. Botão de Contato (WhatsApp)**

O botão é essencial para o fechamento.

Você pode escolher entre:

• **Botão único** → "Fale Conosco"
• **Botão com frase personalizada**

Exemplos:

• "Quero melhorar minha saúde"
• "Quero saber meu resultado"

### Como configurar

• Vá em **Configurações**.
• Escolha **Contato / WhatsApp**.
• Coloque seu número com DDI.
• Personalize o CTA.

---

## **2. Ativando o KIT automático após diagnóstico**

Você pode escolher:

• **Exibir kit automaticamente** após o diagnóstico.
• **Não exibir kit**, levando apenas ao contato.
• **Híbrido**, dependendo do fluxo.

### Quando usar cada opção

• **Exibir Kit** → quando quer vender direto e rápido.
• **Botão sem Kit** → quando quer conversar primeiro para entender a pessoa.
• **Híbrido** → estratégia ideal para quem quer volume + personalização.

---

## **3. Exibição de Produtos**

Você pode ativar ou ocultar produtos.

### Quando ativar

• Quando você tem estoque e quer vender imediatamente.
• Quando a pessoa já está decidida.

### Quando ocultar

• Quando quer focar no diálogo.
• Quando trabalha com fechamento personalizado.',
        'texto',
        2,
        12,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 3: Integrações Essenciais
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Integrações Essenciais',
        '## **1. Integração com WhatsApp**

O fluxo ideal de venda termina no WhatsApp.

A integração garante:

• Mensagem automática pré-preenchida.
• Nome do cliente vindo direto.
• Fluxo contínuo entre sistema → chat.

---

## **2. Integração Z-API (opcional)**

Para quem quer automação avançada.

Permite:

• Respostas automáticas.
• Sequências de follow-up.
• Funis automáticos.
• Ativação de lembretes.

Obs.: Mesmo sem Z-API, o sistema funciona perfeitamente.

---

## **3. IA integrada ao Wellness**

A IA ajuda a:

• Interpretar respostas dos fluxos.
• Criar diagnósticos profissionais.
• Guiar você nos scripts de atendimento.
• Criar mensagens personalizadas.

É a base do efeito WOW do sistema.',
        'texto',
        3,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 4: Primeiros Ajustes de Vendas
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Primeiros Ajustes de Vendas',
        'Para vender mais rápido, você precisa preparar:

### **1. Mensagens Salvas**

Salve diretamente no WhatsApp:

• Abertura
• Pedido de informações
• Quebra de objeção
• Confirmação de pedido

### **2. Respostas Rápidas (atalhos)**

Exemplos:

• `/resultado` — mensagem para pedir o print
• `/atendimento` — início do roteiro
• `/kit` — apresentação do kit
• `/upsell` — oferta complementar

### **3. Organização do Fluxo de Atendimento**

A ordem ideal:

1. Abertura
2. Alinhamento
3. Explicação técnica simples
4. Oferta
5. Fechamento
6. Confirmação

### **4. Atalhos de Conversão**

• Link direto para diagnóstico
• Link direto para kit
• Link para agendamento rápido

Tudo isso aumenta sua velocidade e produtividade.',
        'texto',
        4,
        10,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Aula 5: Checklist Final de Configuração
    INSERT INTO wellness_aulas (modulo_id, titulo, conteudo, tipo, ordem, duracao_minutos, is_ativo)
    VALUES (
        v_modulo_id,
        'Checklist Final de Configuração',
        'Antes de começar a captar leads:

### ✔️ Botão de WhatsApp configurado

### ✔️ Kit ativado (ou estratégia escolhida)

### ✔️ Produtos ativados ou ocultos

### ✔️ Fluxos funcionando normalmente

### ✔️ Link principal testado

### ✔️ Diagnóstico funcionando

### ✔️ Scripts prontos para copiar e colar

### ✔️ Mensagens salvas organizadas

### ✔️ Foto e descrição profissional configuradas',
        'texto',
        5,
        5,
        true
    )
    ON CONFLICT DO NOTHING;

    -- Checklists do Módulo 2
    INSERT INTO wellness_checklists (modulo_id, item, ordem, is_ativo)
    VALUES
        (v_modulo_id, 'Criar e personalizar conta no sistema', 1, true),
        (v_modulo_id, 'Configurar botão de WhatsApp', 2, true),
        (v_modulo_id, 'Ativar/desativar kit automático', 3, true),
        (v_modulo_id, 'Configurar exibição de produtos', 4, true),
        (v_modulo_id, 'Integrar WhatsApp e IA', 5, true),
        (v_modulo_id, 'Salvar mensagens e atalhos no WhatsApp', 6, true),
        (v_modulo_id, 'Testar link principal e diagnóstico', 7, true),
        (v_modulo_id, 'Configurar foto e descrição profissional', 8, true)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Módulo 2 - Configuração Completa do Sistema criado com sucesso!';
    RAISE NOTICE 'Módulo ID: %', v_modulo_id;

END $$;

