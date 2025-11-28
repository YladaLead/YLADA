-- =====================================================
-- YLADA - FAQs ESSENCIAIS ÁREA NUTRI - LOTE 8 (FAQs 109-125)
-- Continuando após os 110 FAQs anteriores
-- =====================================================

-- =====================================================
-- CURSOS - TRILHAS E MÓDULOS (FAQs 109-113)
-- =====================================================

-- FAQ 109: Como navegar por trilhas de aprendizado
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como navegar por trilhas de aprendizado?',
  ARRAY['navegar', 'trilhas', 'aprendizado', 'caminho', 'sequencia'],
  '📌 COMO NAVEGAR POR TRILHAS DE APRENDIZADO

🎯 O QUE SÃO TRILHAS:
- Sequência organizada de cursos
- Caminho de aprendizado estruturado
- Progressão lógica de conhecimento
- Do básico ao avançado

📝 PASSO A PASSO:

Passo 1: Acessar trilhas
   → Menu "Cursos" ou "Educação"
   → Clique em "Trilhas" ou "Trilhas de Aprendizado"
   → Página de trilhas aparecerá

Passo 2: Explorar trilhas disponíveis
   → Veja todas as trilhas disponíveis
   → Leia descrição de cada uma
   → Veja objetivos da trilha
   → Escolha trilha de interesse

Passo 3: Ver estrutura da trilha
   → Clique em uma trilha
   → Veja sequência de cursos
   → Entenda progressão
   → Veja pré-requisitos (se houver)

Passo 4: Iniciar trilha
   → Clique em "Iniciar Trilha" ou "Começar"
   → Trilha será ativada
   → Primeiro curso será aberto
   → Comece aprendizado

Passo 5: Seguir sequência
   → Complete cursos em ordem
   → Cada curso desbloqueia próximo
   → Siga progressão lógica
   → Não pule etapas

Passo 6: Acompanhar progresso
   → Veja progresso da trilha
   → Veja cursos completos
   → Veja próximos cursos
   → Acompanhe evolução

Passo 7: Navegar entre cursos
   → Acesse cursos da trilha
   → Continue de onde parou
   → Revise cursos anteriores
   → Avance para próximos

Passo 8: Completar trilha
   → Complete todos os cursos
   → Finalize trilha completa
   → Receba certificado (se disponível)
   → Aplique conhecimento

💡 DICAS:
- Siga ordem da trilha para melhor aprendizado
- Não pule cursos (conhecimento é acumulativo)
- Complete trilha para certificado completo
- Use trilhas para aprendizado estruturado

⚠️ IMPORTANTE:
- Trilhas têm sequência lógica
- Cursos podem ter pré-requisitos
- Progresso é salvo automaticamente
- Pode pausar e continuar depois',
  'cursos',
  'trilhas',
  -99
);

-- FAQ 110: Como acessar módulos específicos
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como acessar módulos específicos?',
  ARRAY['acessar', 'modulos', 'especificos', 'curso', 'conteudo'],
  '📌 COMO ACESSAR MÓDULOS ESPECÍFICOS

📝 PASSO A PASSO:

Passo 1: Acessar curso
   → Menu "Cursos"
   → Abra o curso desejado
   → Ou acesse curso em andamento

Passo 2: Ver estrutura do curso
   → Veja lista de módulos
   → Organizados em sequência
   → Cada módulo tem conteúdo específico
   → Identifique módulo desejado

Passo 3: Navegar para módulo
   → Clique no módulo específico
   → Ou use menu lateral de módulos
   → Módulo será aberto
   → Conteúdo aparecerá

Passo 4: Acessar módulo bloqueado (se aplicável)
   → Alguns módulos podem estar bloqueados
   → Complete módulos anteriores primeiro
   → Ou atenda pré-requisitos
   → Desbloqueie progressivamente

Passo 5: Ver conteúdo do módulo
   → Vídeos (se houver)
   → Textos e materiais
   → Atividades práticas
   → Recursos adicionais

Passo 6: Completar módulo
   → Assista/leia todo conteúdo
   → Complete atividades
   → Marque como concluído
   → Avance para próximo

Passo 7: Revisar módulos anteriores
   → Acesse módulos já completos
   → Revise conteúdo
   → Refaça atividades se necessário
   → Consolide aprendizado

Passo 8: Pular para módulo específico (se permitido)
   → Alguns cursos permitem acesso livre
   → Acesse módulo diretamente
   → Mas recomenda-se seguir ordem
   → Para melhor compreensão

💡 DICAS:
- Siga ordem dos módulos quando possível
- Revise módulos anteriores se necessário
- Complete atividades para fixar
- Use módulos para aprendizado focado

⚠️ IMPORTANTE:
- Alguns módulos podem ter pré-requisitos
- Ordem geralmente é importante
- Progresso é salvo por módulo
- Pode acessar módulos completos sempre',
  'cursos',
  'modulos',
  -100
);

-- =====================================================
-- QUIZZES PERSONALIZADOS (FAQs 111-116)
-- =====================================================

-- FAQ 111: Como adicionar perguntas ao quiz
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como adicionar perguntas ao meu quiz personalizado?',
  ARRAY['adicionar', 'perguntas', 'quiz', 'personalizado', 'criar'],
  '📌 COMO ADICIONAR PERGUNTAS AO QUIZ PERSONALIZADO

📝 PASSO A PASSO:

Passo 1: Acessar quiz
   → Menu "Quizzes" ou "Ferramentas"
   → Encontre seu quiz personalizado
   → Clique no quiz
   → Abra em modo de edição

Passo 2: Entrar em edição de perguntas
   → Clique em "Editar Perguntas" ou "Gerenciar Perguntas"
   → Ou aba "Perguntas"
   → Seção de perguntas aparecerá

Passo 3: Adicionar nova pergunta
   → Clique em "Adicionar Pergunta" ou botão "+"
   → Formulário de pergunta aparecerá
   → Digite sua pergunta

Passo 4: Configurar pergunta
   → Digite texto da pergunta
   → Seja claro e objetivo
   → Exemplo: "Quantas refeições você faz por dia?"
   → Adicione descrição (opcional)

Passo 5: Adicionar opções de resposta
   → Adicione 2-5 opções de resposta
   → Exemplo: "1-2 refeições", "3-4 refeições", "5+ refeições"
   → Clique em "+" para adicionar opção
   → Digite cada opção

Passo 6: Marcar resposta correta (se aplicável)
   → Para perguntas objetivas, marque resposta correta
   → Clique na opção correta
   → Ou marque checkbox "Resposta Correta"
   → Sistema usará para pontuação

Passo 7: Configurar tipo de pergunta
   → Escolha tipo: múltipla escolha, verdadeiro/falso, texto
   → Configure conforme necessidade
   → Cada tipo tem opções diferentes
   → Escolha o mais adequado

Passo 8: Salvar pergunta
   → Revise pergunta e opções
   → Clique em "Salvar Pergunta"
   → Pergunta será adicionada ao quiz
   → Aparecerá na lista

Passo 9: Organizar perguntas
   → Arraste para reordenar
   → Organize em ordem lógica
   → Crie fluxo de perguntas
   → Salve ordem

💡 DICAS:
- Faça perguntas objetivas e claras
- Use opções de resposta bem definidas
- Organize perguntas em ordem lógica
- Teste quiz antes de compartilhar

⚠️ IMPORTANTE:
- Pode adicionar quantas perguntas quiser
- Perguntas podem ser editadas depois
- Ordem afeta experiência do usuário
- Teste fluxo completo do quiz',
  'ferramentas',
  'quizzes',
  -101
);

-- FAQ 112: Como configurar respostas do quiz
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como configurar as respostas do quiz?',
  ARRAY['configurar', 'respostas', 'quiz', 'opcoes', 'definir'],
  '📌 COMO CONFIGURAR RESPOSTAS DO QUIZ

📝 PASSO A PASSO:

Passo 1: Editar quiz
   → Acesse seu quiz personalizado
   → Clique em "Editar"
   → Abra seção de perguntas

Passo 2: Selecionar pergunta
   → Clique na pergunta que deseja configurar
   → Ou edite pergunta existente
   → Formulário de edição aparecerá

Passo 3: Configurar opções de resposta
   → Veja opções atuais
   → Adicione novas opções se necessário
   → Edite opções existentes
   → Remova opções se necessário

Passo 4: Definir resposta correta
   → Para perguntas objetivas
   → Marque qual opção é correta
   → Sistema usará para pontuação
   → Ou deixe sem resposta correta (subjetivo)

Passo 5: Configurar pontuação (se aplicável)
   → Atribua pontos para cada resposta
   → Ou use pontuação automática
   → Configure sistema de pontuação
   → Defina como calcular resultado

Passo 6: Adicionar feedback (se disponível)
   → Adicione feedback para cada resposta
   → Explique por que resposta está certa/errada
   → Forneça informações educativas
   → Melhore experiência do usuário

Passo 7: Configurar tipo de resposta
   → Múltipla escolha: uma ou várias opções
   → Verdadeiro/Falso: apenas duas opções
   → Texto livre: resposta aberta
   → Escolha tipo adequado

Passo 8: Salvar configurações
   → Revise todas as configurações
   → Clique em "Salvar" ou "Aplicar"
   → Configurações serão salvas
   → Quiz será atualizado

💡 DICAS:
- Configure respostas claras e objetivas
- Use feedback para educar
- Pontuação ajuda a calcular resultados
- Teste diferentes respostas

⚠️ IMPORTANTE:
- Respostas afetam resultado do quiz
- Configuração correta é importante
- Pode editar depois se necessário
- Teste antes de compartilhar',
  'ferramentas',
  'quizzes',
  -102
);

-- FAQ 113: Como definir resultados do quiz
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como definir os resultados do quiz?',
  ARRAY['definir', 'resultados', 'quiz', 'diagnostico', 'conclusao'],
  '📌 COMO DEFINIR RESULTADOS DO QUIZ

📝 PASSO A PASSO:

Passo 1: Acessar configurações de resultados
   → Abra seu quiz personalizado
   → Clique em "Editar"
   → Acesse "Resultados" ou "Diagnósticos"

Passo 2: Entender sistema de resultados
   → Resultados são baseados em pontuação
   → Ou combinação de respostas
   → Defina faixas de pontuação
   → Cada faixa = um resultado

Passo 3: Criar resultado
   → Clique em "Adicionar Resultado" ou "+"
   → Formulário de resultado aparecerá
   → Defina nome do resultado
   → Exemplo: "Perfil Metabólico Rápido"

Passo 4: Configurar faixa de pontuação
   → Defina pontuação mínima
   → Defina pontuação máxima
   → Exemplo: 0-30 pontos = "Iniciante"
   → Exemplo: 31-60 pontos = "Intermediário"

Passo 5: Escrever descrição do resultado
   → Descreva o que resultado significa
   → Explique características
   → Forneça informações relevantes
   → Seja claro e objetivo

Passo 6: Adicionar recomendações (opcional)
   → Adicione recomendações baseadas no resultado
   → Sugira próximos passos
   → Forneça orientações
   → Melhore valor do quiz

Passo 7: Configurar múltiplos resultados
   → Crie vários resultados possíveis
   → Cada faixa de pontuação = um resultado
   → Exemplo: 3-5 resultados diferentes
   → Cubra todas as possibilidades

Passo 8: Salvar resultados
   → Revise todos os resultados
   → Verifique faixas de pontuação
   → Clique em "Salvar" ou "Aplicar"
   → Resultados serão configurados

Passo 9: Testar resultados
   → Teste quiz completo
   → Verifique se resultados aparecem corretamente
   → Confirme que faixas funcionam
   → Ajuste se necessário

💡 DICAS:
- Crie resultados claros e úteis
- Faixas de pontuação devem cobrir todas as possibilidades
- Descrições devem ser informativas
- Recomendações aumentam valor

⚠️ IMPORTANTE:
- Resultados são calculados automaticamente
- Baseados em pontuação ou respostas
- Usuário verá resultado ao final
- Pode compartilhar resultado',
  'ferramentas',
  'quizzes',
  -103
);

-- FAQ 114: Como editar quiz personalizado
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como editar um quiz personalizado?',
  ARRAY['editar', 'quiz', 'personalizado', 'modificar', 'atualizar'],
  '📌 COMO EDITAR QUIZ PERSONALIZADO

📝 PASSO A PASSO:

Passo 1: Acessar quizzes
   → Menu "Quizzes" ou "Ferramentas"
   → Encontre quiz que deseja editar
   → Clique no quiz

Passo 2: Abrir edição
   → Clique em "Editar" ou ícone de lápis
   → Ou três pontos (...) → "Editar"
   → Modo de edição será ativado

Passo 3: Editar informações básicas
   → Altere nome do quiz
   → Modifique descrição
   → Atualize imagem (se disponível)
   → Altere configurações gerais

Passo 4: Editar perguntas
   → Clique em pergunta que deseja editar
   → Modifique texto da pergunta
   → Altere opções de resposta
   → Configure resposta correta

Passo 5: Adicionar perguntas
   → Clique em "Adicionar Pergunta"
   → Crie novas perguntas
   → Expanda quiz
   → Adicione conteúdo

Passo 6: Remover perguntas
   → Clique em pergunta
   → Clique em "Remover" ou ícone de lixeira
   → Confirme remoção
   → Pergunta será removida

Passo 7: Reordenar perguntas
   → Arraste perguntas para nova posição
   → Organize em ordem lógica
   → Crie melhor fluxo
   → Salve ordem

Passo 8: Editar resultados
   → Acesse seção "Resultados"
   → Modifique resultados existentes
   → Altere faixas de pontuação
   → Atualize descrições

Passo 9: Salvar alterações
   → Revise todas as mudanças
   → Clique em "Salvar" ou "Atualizar"
   → Alterações serão aplicadas
   → Quiz será atualizado

💡 DICAS:
- Salve frequentemente durante edição
- Teste quiz após editar
- Mantenha consistência
- Revise antes de salvar

⚠️ IMPORTANTE:
- Alterações são salvas imediatamente
- Pode editar a qualquer momento
- Teste quiz após editar
- Mudanças afetam versão compartilhada',
  'ferramentas',
  'quizzes',
  -104
);

-- FAQ 115: Como compartilhar quiz personalizado
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como compartilhar meu quiz personalizado?',
  ARRAY['compartilhar', 'quiz', 'personalizado', 'link', 'enviar'],
  '📌 COMO COMPARTILHAR QUIZ PERSONALIZADO

📝 PASSO A PASSO:

Passo 1: Acessar quiz
   → Menu "Quizzes" ou "Ferramentas"
   → Encontre quiz que deseja compartilhar
   → Clique no quiz

Passo 2: Obter link
   → Clique em "Compartilhar" ou ícone de compartilhar
   → Copie o link do quiz
   → Link será algo como: ylada.app/pt/nutri/seu-slug/quiz/nome

Passo 3: Compartilhar por WhatsApp
   → Abra WhatsApp
   → Cole o link na conversa
   → Adicione mensagem personalizada
   → Exemplo: "Responda este quiz e descubra seu perfil!"
   → Envie

Passo 4: Compartilhar por Email
   → Abra seu email
   → Cole o link no corpo do email
   → Adicione descrição do quiz
   → Explique o que cliente descobrirá
   → Envie

Passo 5: Compartilhar em redes sociais
   → Copie o link
   → Cole na publicação
   → Adicione descrição atrativa
   → Publique

Passo 6: Compartilhar por QR Code (se disponível)
   → Gere QR Code do quiz
   → Imprima ou mostre na tela
   → Cliente escaneia e acessa
   → Facilita acesso offline

Passo 7: Compartilhar em site/blog
   → Use o link do quiz
   → Adicione como botão ou link
   → Cliente clica e acessa
   → Integre em sua presença online

Passo 8: Compartilhar em portal
   → Adicione quiz ao seu portal
   → Cliente acessa portal e vê quiz
   → Facilita descoberta
   → Aumenta engajamento

💡 DICAS:
- Adicione mensagem personalizada ao compartilhar
- Explique o que cliente descobrirá
- Use em diferentes canais
- Facilite acesso do cliente

⚠️ IMPORTANTE:
- Link é único para cada quiz
- Funciona em qualquer dispositivo
- Cliente pode responder quantas vezes quiser
- Resultados são privados para cada pessoa',
  'ferramentas',
  'quizzes',
  -105
);

-- =====================================================
-- LINKS, QR CODES E SHORT CODES (FAQs 116-125)
-- =====================================================

-- FAQ 116: O que são short codes
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'O que são short codes?',
  ARRAY['short', 'codes', 'o que sao', 'explicacao', 'definicao'],
  '📌 O QUE SÃO SHORT CODES

🎯 CONCEITO:
- Códigos curtos para acessar ferramentas
- Alternativa aos links longos
- Mais fácil de digitar e lembrar
- Exemplo: ylada.app/abc123

📝 CARACTERÍSTICAS:

1. CÓDIGO CURTO
   → Geralmente 4-8 caracteres
   → Fácil de digitar
   → Fácil de lembrar
   → Mais prático que link completo

2. ACESSO RÁPIDO
   → Digite código diretamente
   → Acesse ferramenta rapidamente
   → Sem precisar de link completo
   → Mais conveniente

3. COMPARTILHAMENTO FÁCIL
   → Mais fácil de compartilhar
   → Pode falar código por telefone
   → Pode escrever em papel
   → Mais acessível

4. PROFISSIONAL
   → Parece mais profissional
   → Mais fácil de usar
   → Melhora experiência
   → Transmite credibilidade

💡 EXEMPLOS:
- Link completo: ylada.app/pt/nutri/dra-ana/calculadora-imc
- Short code: ylada.app/abc123
- Muito mais curto e prático!

⚠️ QUANDO USAR:
- Para compartilhar verbalmente
- Para impressos e materiais físicos
- Para facilitar acesso
- Para parecer mais profissional

🎯 VANTAGENS:
- Mais curto e prático
- Fácil de lembrar
- Fácil de compartilhar
- Mais profissional',
  'ferramentas',
  'short-codes',
  -106
);

-- FAQ 117: Como gerar short code para ferramenta
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como gerar short code para minha ferramenta?',
  ARRAY['gerar', 'short', 'code', 'ferramenta', 'criar', 'código'],
  '📌 COMO GERAR SHORT CODE PARA FERRAMENTA

📝 PASSO A PASSO:

Passo 1: Acessar ferramenta
   → Menu "Ferramentas"
   → Encontre ferramenta desejada
   → Clique na ferramenta

Passo 2: Abrir configurações
   → Clique em "Configurações" ou "Opções"
   → Ou "Compartilhar" → "Short Code"
   → Seção de short code aparecerá

Passo 3: Gerar short code
   → Clique em "Gerar Short Code" ou "Criar Código"
   → Sistema gerará código automaticamente
   → Código único será criado
   → Exemplo: "abc123"

Passo 4: Personalizar código (se disponível)
   → Digite código personalizado desejado
   → Use apenas letras e números
   → Exemplo: "imc2024", "nutri1"
   → Verifique disponibilidade

Passo 5: Verificar disponibilidade
   → Sistema verificará se código está disponível
   → Se já existe, escolha outro
   → Se disponível, pode usar
   → Confirme código

Passo 6: Salvar short code
   → Revise código gerado
   → Clique em "Salvar" ou "Aplicar"
   → Short code será ativado
   → Link será criado

Passo 7: Ver link completo
   → Link será: ylada.app/seu-short-code
   → Copie link completo
   → Use para compartilhar
   → Teste se funciona

Passo 8: Compartilhar
   → Use short code para compartilhar
   → Mais fácil que link completo
   → Pode falar código por telefone
   → Pode escrever em materiais

💡 DICAS:
- Use código descritivo se personalizar
- Mantenha código curto e simples
- Teste código antes de compartilhar
- Use para facilitar acesso

⚠️ IMPORTANTE:
- Código deve ser único
- Não pode usar espaços ou caracteres especiais
- Link funciona imediatamente
- Pode desativar depois se necessário',
  'ferramentas',
  'short-codes',
  -107
);

-- FAQ 118: Como usar short code
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como usar o short code?',
  ARRAY['usar', 'short', 'code', 'como', 'utilizar'],
  '📌 COMO USAR SHORT CODE

📝 FORMAS DE USO:

1. COMPARTILHAR LINK
   → Copie link completo: ylada.app/seu-code
   → Compartilhe por WhatsApp, email, etc.
   → Cliente clica e acessa
   → Mais curto que link completo

2. FALAR CÓDIGO
   → Diga código por telefone
   → Cliente digita no navegador
   → Acessa diretamente
   → Exemplo: "Acesse ylada.app e digite abc123"

3. ESCREVER EM MATERIAIS
   → Imprima código em cartões
   → Escreva em folhetos
   → Adicione em materiais físicos
   → Cliente digita código

4. USAR EM QR CODE
   → Gere QR code do short code
   → Cliente escaneia
   → Acessa automaticamente
   → Facilita ainda mais

5. COMPARTILHAR VERBALMENTE
   → Fale código em consultas
   → Cliente anota e acessa depois
   → Mais fácil que link completo
   → Mais profissional

💡 DICAS:
- Use para facilitar acesso
- Ideal para compartilhamento verbal
- Funciona em qualquer navegador
- Mais profissional que link longo

⚠️ IMPORTANTE:
- Código funciona imediatamente
- Cliente digita no navegador
- Redireciona para ferramenta completa
- Funciona em qualquer dispositivo',
  'ferramentas',
  'short-codes',
  -108
);

-- FAQ 119: Posso personalizar short code
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Posso personalizar meu short code?',
  ARRAY['personalizar', 'short', 'code', 'customizar', 'escolher'],
  '📌 POSSO PERSONALIZAR SHORT CODE

📝 SOBRE PERSONALIZAÇÃO:

SIM, PODE PERSONALIZAR:
   → Ao gerar short code, pode escolher código
   → Digite código desejado
   → Sistema verificará disponibilidade
   → Se disponível, pode usar

📝 COMO PERSONALIZAR:

Passo 1: Gerar short code
   → Acesse configurações da ferramenta
   → Clique em "Gerar Short Code"
   → Opção de personalizar aparecerá

Passo 2: Escolher código personalizado
   → Digite código desejado
   → Use apenas letras e números
   → Exemplo: "imc2024", "nutri1", "quiz-ana"
   → Seja criativo mas profissional

Passo 3: Verificar disponibilidade
   → Sistema verificará se está disponível
   → Se já existe, escolha outro
   → Se disponível, pode usar
   → Confirme código

Passo 4: Salvar código personalizado
   → Revise código escolhido
   → Clique em "Salvar" ou "Aplicar"
   → Código será ativado
   → Link será criado

💡 DICAS:
- Use código descritivo
- Relacione com ferramenta
- Mantenha curto e simples
- Use letras e números apenas

⚠️ LIMITAÇÕES:
- Código deve ser único
- Não pode usar espaços
- Não pode usar caracteres especiais (exceto hífen)
- Pode ter limite de caracteres
- Deve verificar disponibilidade

🎯 VANTAGENS:
- Código mais memorável
- Relacionado à sua marca
- Mais profissional
- Facilita lembrança',
  'ferramentas',
  'short-codes',
  -109
);

-- FAQ 120: Como gerar QR code
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como gerar QR code?',
  ARRAY['gerar', 'qr', 'code', 'codigo', 'criar'],
  '📌 COMO GERAR QR CODE

📝 PASSO A PASSO:

Passo 1: Acessar ferramenta
   → Menu "Ferramentas"
   → Encontre ferramenta desejada
   → Clique na ferramenta

Passo 2: Abrir opções de compartilhamento
   → Clique em "Compartilhar" ou ícone de compartilhar
   → Ou "QR Code"
   → Opções de compartilhamento aparecerão

Passo 3: Gerar QR code
   → Clique em "Gerar QR Code" ou "Criar QR Code"
   → QR code será gerado automaticamente
   → Imagem do QR code aparecerá
   → Pronto para usar

Passo 4: Visualizar QR code
   → Veja imagem do QR code
   → Verifique se está claro
   → Confirme que está correto
   → Pode testar escaneando

Passo 5: Baixar QR code
   → Clique em "Baixar" ou "Download"
   → Escolha formato (PNG, JPG, SVG)
   → Arquivo será baixado
   → Salve em local seguro

Passo 6: Personalizar QR code (se disponível)
   → Escolha cores
   → Adicione logo (se disponível)
   → Personalize visual
   → Torne único

Passo 7: Imprimir QR code
   → Abra arquivo baixado
   → Imprima em tamanho adequado
   → Use em materiais físicos
   → Facilite acesso

Passo 8: Usar QR code
   → Adicione em cartões de visita
   → Cole em folhetos
   → Use em materiais impressos
   → Cliente escaneia e acessa

💡 DICAS:
- QR code deve ter tamanho adequado para escaneamento
- Use em materiais físicos
- Teste antes de imprimir
- Mantenha área clara ao redor

⚠️ IMPORTANTE:
- QR code funciona imediatamente
- Cliente escaneia com celular
- Redireciona para ferramenta
- Funciona em qualquer dispositivo com câmera',
  'ferramentas',
  'qr-codes',
  -110
);

-- FAQ 121: Como usar QR code
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como usar o QR code?',
  ARRAY['usar', 'qr', 'code', 'como', 'utilizar', 'escaneiar'],
  '📌 COMO USAR QR CODE

📝 PARA VOCÊ (NUTRICIONISTA):

1. IMPRIMIR QR CODE
   → Baixe imagem do QR code
   → Imprima em tamanho adequado
   → Use em materiais físicos
   → Exemplos: cartões, folhetos, posters

2. ADICIONAR EM MATERIAIS
   → Cartões de visita
   → Folhetos informativos
   → Posters na clínica
   → Materiais de consulta

3. COMPARTILHAR DIGITALMENTE
   → Envie por WhatsApp
   → Adicione em email
   → Use em redes sociais
   → Compartilhe online

📝 PARA SEU CLIENTE:

1. ABRIR CÂMERA DO CELULAR
   → Abra app de câmera
   → Ou app de QR code
   → Aponte para QR code
   → Aguarde reconhecimento

2. ESCANEAR QR CODE
   → Mantenha câmera estável
   → Aponte para QR code
   → Aguarde alguns segundos
   → QR code será reconhecido

3. ACESSAR FERRAMENTA
   → Link será aberto automaticamente
   → Cliente acessa ferramenta
   → Pode usar imediatamente
   → Sem precisar digitar

💡 DICAS:
- QR code deve estar claro e visível
- Tamanho mínimo para escaneamento
- Use em locais bem iluminados
- Teste antes de compartilhar

⚠️ IMPORTANTE:
- Funciona em qualquer celular com câmera
- Não precisa app especial (câmera nativa funciona)
- Redireciona automaticamente
- Facilita muito o acesso',
  'ferramentas',
  'qr-codes',
  -111
);

-- FAQ 122: Onde usar QR codes
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Onde posso usar QR codes?',
  ARRAY['onde', 'usar', 'qr', 'codes', 'locais', 'lugares'],
  '📌 ONDE USAR QR CODES

🎯 LOCAIS IDEAIS:

1. MATERIAIS FÍSICOS
   → Cartões de visita
   → Folhetos informativos
   → Posters na clínica
   → Materiais de consulta
   → Receitas e prescrições

2. ESPAÇOS FÍSICOS
   → Parede da clínica
   → Mesa de recepção
   → Sala de espera
   → Consultório
   → Área de atendimento

3. REDES SOCIAIS
   → Posts no Instagram
   → Stories
   → Facebook
   → LinkedIn
   → Outras plataformas

4. COMUNICAÇÃO DIGITAL
   → Email marketing
   → Newsletter
   → WhatsApp
   → Mensagens
   → Comunicações

5. EVENTOS
   → Palestras
   → Workshops
   → Feiras
   → Congressos
   → Apresentações

6. MATERIAIS IMPRESSOS
   → Revistas
   → Jornais
   → Panfletos
   → Catálogos
   → Materiais promocionais

💡 DICAS:
- Use em qualquer lugar onde cliente possa escanear
- Facilita acesso rápido
- Mais profissional que link longo
- Aumenta engajamento

⚠️ IMPORTANTE:
- QR code funciona offline (após impresso)
- Cliente precisa internet para acessar link
- Use em locais bem iluminados
- Teste antes de usar em grande escala',
  'ferramentas',
  'qr-codes',
  -112
);

-- FAQ 123: Como obter link da minha ferramenta
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como obter o link da minha ferramenta?',
  ARRAY['obter', 'link', 'ferramenta', 'copiar', 'url'],
  '📌 COMO OBTER LINK DA FERRAMENTA

📝 PASSO A PASSO:

Passo 1: Acessar ferramenta
   → Menu "Ferramentas"
   → Encontre ferramenta desejada
   → Clique na ferramenta

Passo 2: Abrir compartilhamento
   → Clique em "Compartilhar" ou ícone de compartilhar
   → Ou "Ver Link" ou "Copiar Link"
   → Opções de compartilhamento aparecerão

Passo 3: Ver link completo
   → Link completo será exibido
   → Formato: ylada.app/pt/nutri/seu-slug/nome-ferramenta
   → Link está pronto para copiar
   → Veja todas as opções

Passo 4: Copiar link
   → Clique em "Copiar Link" ou botão de copiar
   → Link será copiado para área de transferência
   → Ou selecione e copie manualmente
   → Link está pronto para usar

Passo 5: Verificar link
   → Cole link em algum lugar para verificar
   → Confirme que está correto
   → Teste se funciona
   → Pronto para compartilhar

Passo 6: Compartilhar
   → Use link copiado
   → Cole em WhatsApp, email, etc.
   → Compartilhe onde desejar
   → Cliente acessa diretamente

💡 DICAS:
- Link é único para cada ferramenta
- Pode copiar quantas vezes quiser
- Link funciona imediatamente
- Use para compartilhar facilmente

⚠️ IMPORTANTE:
- Link é permanente (não muda)
- Funciona em qualquer dispositivo
- Cliente pode acessar a qualquer momento
- Link é público (se ferramenta estiver ativa)',
  'ferramentas',
  'links',
  -113
);

-- FAQ 124: Como personalizar link
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como personalizar o link da minha ferramenta?',
  ARRAY['personalizar', 'link', 'url', 'customizar', 'slug'],
  '📌 COMO PERSONALIZAR LINK DA FERRAMENTA

📝 PASSO A PASSO:

Passo 1: Acessar ferramenta
   → Menu "Ferramentas"
   → Encontre ferramenta desejada
   → Clique na ferramenta

Passo 2: Editar ferramenta
   → Clique em "Editar" ou ícone de lápis
   → Modo de edição será ativado
   → Acesse configurações

Passo 3: Encontrar configuração de link
   → Procure "URL Personalizada" ou "Slug"
   → Ou "Link Personalizado"
   → Campo de personalização aparecerá

Passo 4: Ver link atual
   → Veja link atual da ferramenta
   → Formato: ylada.app/pt/nutri/seu-slug/nome-atual
   → Identifique parte personalizável

Passo 5: Personalizar slug
   → Digite novo slug desejado
   → Use apenas letras minúsculas, números e hífens
   → Exemplo: "calculadora-imc-personalizada"
   → Seja descritivo e profissional

Passo 6: Verificar disponibilidade
   → Sistema verificará se slug está disponível
   → Se já existe, escolha outro
   → Se disponível, pode usar
   → Confirme slug

Passo 7: Salvar personalização
   → Revise novo link
   → Clique em "Salvar" ou "Aplicar"
   → Link será atualizado
   → Personalização será aplicada

Passo 8: Verificar novo link
   → Novo link será gerado
   → Formato: ylada.app/pt/nutri/seu-slug/novo-slug
   → Teste se funciona corretamente
   → Use novo link

💡 DICAS:
- Use slug descritivo e fácil de lembrar
- Evite caracteres especiais
- Use apenas letras, números e hífens
- Torne link mais profissional

⚠️ IMPORTANTE:
- Slug deve ser único
- Não pode usar espaços ou maiúsculas
- Link antigo pode parar de funcionar
- Personalize com cuidado

🔧 LIMITAÇÕES:
- Alguns slugs podem estar reservados
- Deve seguir regras de formato
- Pode ter limite de caracteres
- Verifique disponibilidade antes',
  'ferramentas',
  'links',
  -114
);

-- FAQ 125: Como importar pacientes em massa
INSERT INTO faq_responses (
  area, pergunta, palavras_chave, resposta_completa, categoria, subcategoria, ordem_prioridade
) VALUES (
  'nutri',
  'Como importar pacientes em massa?',
  ARRAY['importar', 'pacientes', 'massa', 'csv', 'excel', 'planilha'],
  '📌 COMO IMPORTAR PACIENTES EM MASSA

📝 PASSO A PASSO:

Passo 1: Preparar planilha
   → Crie planilha Excel ou CSV
   → Colunas: Nome, Email, Telefone, Data Nascimento, etc.
   → Preencha dados dos pacientes
   → Salve arquivo

Passo 2: Acessar importação
   → Menu "Clientes"
   → Clique em "Importar" ou "Importar Pacientes"
   → Ou três pontos (...) → "Importar"
   → Página de importação aparecerá

Passo 3: Selecionar arquivo
   → Clique em "Selecionar Arquivo" ou "Escolher Arquivo"
   → Navegue até arquivo
   → Selecione arquivo (CSV ou Excel)
   → Abra arquivo

Passo 4: Mapear colunas
   → Sistema mostrará colunas do arquivo
   → Mapeie cada coluna do arquivo
   → Para campo correspondente no sistema
   → Exemplo: "Nome" → "Nome Completo"

Passo 5: Configurar importação
   → Escolha se atualiza clientes existentes
   → Configure tratamento de duplicatas
   → Defina formato de dados
   → Revise configurações

Passo 6: Visualizar prévia
   → Veja prévia dos dados
   → Verifique se mapeamento está correto
   → Confirme dados
   → Ajuste se necessário

Passo 7: Importar
   → Clique em "Importar" ou "Processar"
   → Sistema processará arquivo
   → Pacientes serão importados
   → Aguarde conclusão

Passo 8: Verificar resultado
   → Veja relatório de importação
   → Confirme quantos foram importados
   → Veja erros (se houver)
   → Corrija e reimporte se necessário

💡 DICAS:
- Prepare planilha com dados corretos
- Use formato CSV para melhor compatibilidade
- Verifique dados antes de importar
- Mantenha backup do arquivo original

⚠️ IMPORTANTE:
- Arquivo deve estar no formato correto
- Dados devem estar organizados
- Alguns campos podem ser obrigatórios
- Importação pode levar alguns minutos

🔧 FORMATO RECOMENDADO:
- CSV com encoding UTF-8
- Primeira linha como cabeçalho
- Dados organizados em colunas
- Sem caracteres especiais problemáticos',
  'clientes',
  'importacao',
  -115
);

-- =====================================================
-- FIM DO LOTE 8 (FAQs 109-125)
-- =====================================================

-- NOTA: Para executar este script:
-- 1. Conecte-se ao Supabase
-- 2. Execute este arquivo (lote8)
-- 3. Verifique se todos foram inseridos corretamente
-- 4. Teste o sistema de busca de FAQs

-- Para verificar inserção:
-- SELECT COUNT(*) FROM faq_responses WHERE area = 'nutri';
-- SELECT categoria, COUNT(*) FROM faq_responses WHERE area = 'nutri' GROUP BY categoria;

