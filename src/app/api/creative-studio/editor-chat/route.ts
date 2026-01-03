import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Configuração por área
function getAreaConfig(area: string) {
  const configs: Record<string, any> = {
    nutri: {
      product: 'YLADA NUTRI',
      description: 'plataforma completa para nutricionistas',
      professionals: 'NUTRICIONISTAS',
      targetAudience: 'Nutricionistas que querem lotar agenda e aumentar vendas',
      ctaUrl: '/pt/nutri',
      avatar: 'Lia',
      avatarGender: 'feminino, profissional',
      tone: 'Profissional, confiável, empático',
      colors: 'Verde/azul (saúde e confiança)',
      painPoints: ['agenda vazia', 'dificuldade em atrair clientes', 'falta de sistema de gestão'],
      solutions: ['lotar agenda', 'aumentar vendas', 'sistema completo de gestão'],
    },
    coach: {
      product: 'YLADA COACH',
      description: 'plataforma completa para personal trainers',
      professionals: 'PERSONAL TRAINERS',
      targetAudience: 'Personal trainers que querem mais clientes e resultados',
      ctaUrl: '/pt/coach',
      avatar: 'Noel',
      avatarGender: 'masculino, motivador',
      tone: 'Energético, motivador, inspirador',
      colors: 'Laranja/vermelho (energia e ação)',
      painPoints: ['poucos clientes', 'dificuldade em reter alunos', 'falta de metodologia'],
      solutions: ['mais clientes', 'sistema de treinamento', 'metodologia comprovada'],
    },
    wellness: {
      product: 'YLADA WELLNESS',
      description: 'plataforma completa de bem-estar',
      professionals: 'PROFISSIONAIS DE BEM-ESTAR',
      targetAudience: 'Profissionais que querem promover bem-estar e qualidade de vida',
      ctaUrl: '/pt/wellness',
      avatar: 'Lia',
      avatarGender: 'feminino, calmo',
      tone: 'Calmo, equilibrado, acolhedor',
      colors: 'Verde claro/azul claro (bem-estar e paz)',
      painPoints: ['falta de estrutura', 'dificuldade em organizar programas', 'falta de ferramentas'],
      solutions: ['programa completo', 'ferramentas de gestão', 'sistema organizado'],
    },
    nutra: {
      product: 'YLADA NUTRA',
      description: 'plataforma completa de nutrição',
      professionals: 'PROFISSIONAIS DE NUTRIÇÃO',
      targetAudience: 'Profissionais que querem simplificar nutrição e alimentação saudável',
      ctaUrl: '/pt/nutra',
      avatar: 'Noel',
      avatarGender: 'masculino, acessível',
      tone: 'Acessível, educativo, prático',
      colors: 'Verde/amarelo (nutrição e energia)',
      painPoints: ['complexidade da nutrição', 'dificuldade em educar clientes', 'falta de recursos'],
      solutions: ['nutrição simplificada', 'recursos educativos', 'ferramentas práticas'],
    },
  }
  
  return configs[area] || configs.nutri
}

// Configuração por propósito do vídeo
function getPurposeConfig(purpose: string, customObjective: string | undefined, areaConfig: any) {
  const configs: Record<string, any> = {
    'quick-ad': {
      name: 'Anúncio Rápido',
      description: 'Vídeo curto otimizado para Instagram/Facebook',
      duration: '15-30 segundos',
      structure: ['Hook (3-5s)', 'Problema (5-10s)', 'Solução (5-10s)', 'CTA (3-5s)'],
      specificInstructions: `
REGRAS ESPECÍFICAS PARA ANÚNCIO RÁPIDO:
- Hook DEVE ser impactante nos primeiros 3 segundos
- Problema deve ser direto e específico: "${areaConfig.painPoints[0]}"
- Solução deve mencionar ${areaConfig.product} e ${areaConfig.solutions[0]}
- CTA obrigatório: "Acesse ${areaConfig.ctaUrl} agora"
- Tom: ${areaConfig.tone}
- Linguagem: Direta, sem rodeios, foco em conversão rápida
- Formato: Vertical (9:16) para Instagram Stories/Reels
      `,
    },
    'sales-page': {
      name: 'Página de Vendas',
      description: 'Vídeo completo de vendas para página de captura',
      duration: '60-120 segundos',
      structure: ['Hook (5-8s)', 'Problema ampliado (15-25s)', 'Solução detalhada (30-50s)', 'Prova social (10-15s)', 'CTA forte (8-12s)'],
      specificInstructions: `
REGRAS ESPECÍFICAS PARA PÁGINA DE VENDAS:
- Hook deve garantir atenção e retenção
- Problema deve explorar TODAS as dores: ${areaConfig.painPoints.join(', ')}
- Solução deve detalhar TODOS os benefícios: ${areaConfig.solutions.join(', ')}
- Prova social: Testemunhos, resultados, números
- CTA deve criar urgência e direcionar para ${areaConfig.ctaUrl}
- Tom: ${areaConfig.tone}, mas com mais profundidade
- Formato: Horizontal (16:9) para página web
      `,
    },
    'educational': {
      name: 'Conteúdo Educativo',
      description: 'Vídeo educativo para engajamento e autoridade',
      duration: '30-60 segundos',
      structure: ['Título/Hook (3-5s)', 'Conteúdo educativo (20-45s)', 'CTA suave (5-10s)'],
      specificInstructions: `
REGRAS ESPECÍFICAS PARA CONTEÚDO EDUCATIVO:
- Hook deve ser uma pergunta ou afirmação educativa
- Conteúdo deve ensinar algo útil relacionado a ${areaConfig.professionals.toLowerCase()}
- CTA suave: "Quer saber mais? Acesse ${areaConfig.ctaUrl}"
- Tom: ${areaConfig.tone}, educativo e acessível
- Foco: Autoridade e valor, não venda direta
      `,
    },
    'testimonial': {
      name: 'Depoimento',
      description: 'Vídeo de prova social com depoimento',
      duration: '30-45 segundos',
      structure: ['Apresentação (5s)', 'Resultado (15-20s)', 'Transformação (10-15s)', 'CTA (5s)'],
      specificInstructions: `
REGRAS ESPECÍFICAS PARA DEPOIMENTO:
- Apresentação: Nome e contexto do ${areaConfig.professionals.toLowerCase()}
- Resultado: O que ${areaConfig.product} proporcionou
- Transformação: Antes vs Depois
- CTA: "Você também pode ter esses resultados. Acesse ${areaConfig.ctaUrl}"
- Tom: Autêntico, real, emocional
      `,
    },
    'custom': {
      name: 'Personalizado',
      description: customObjective || 'Vídeo com objetivo personalizado',
      duration: 'Variável',
      structure: ['Personalizado'],
      specificInstructions: `
OBJETIVO PERSONALIZADO: ${customObjective || 'Definido pelo usuário'}
- Adapte a estrutura conforme o objetivo
- Mantenha o contexto de ${areaConfig.product}
- Use tom ${areaConfig.tone}
- Direcione para ${areaConfig.ctaUrl} quando apropriado
      `,
    },
  }
  
  return configs[purpose] || configs['quick-ad']
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { message, context, mode, area, purpose, objective, hasExistingImages, existingImageCount, hasExistingVideos, existingVideoCount } = body
    // area: 'nutri' | 'coach' | 'wellness' | 'nutra'
    // purpose: 'quick-ad' | 'sales-page' | 'educational' | 'testimonial' | 'custom'
    // objective: string (quando purpose === 'custom')

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 })
    }

    // Detectar modo: 'create' ou 'edit' (padrão)
    const isCreateMode = mode === 'create'

    // Construir prompt baseado no modo
    let systemPrompt = ''

    if (isCreateMode) {
      // Determinar área e contexto
      const areaConfig = getAreaConfig(area || 'nutri')
      const purposeConfig = getPurposeConfig(purpose || 'quick-ad', objective, areaConfig)
      
      // PROMPT ESPECIALIZADO PARA CRIAÇÃO - FOCO: ANÚNCIOS YLADA NUTRI
      systemPrompt = `Você é um ESPECIALISTA EM ANÚNCIOS INSTAGRAM ADS para vender YLADA NUTRI.

OBJETIVO ÚNICO: Criar anúncios que VENDEM YLADA NUTRI para nutricionistas com agenda vazia.

PRODUTO: YLADA NUTRI
- Plataforma completa para nutricionistas
- Organiza rotina, ensina captação, ajuda a construir agenda cheia
- URL: /pt/nutri

PÚBLICO-ALVO:
- Nutricionistas
- Agenda vazia ou poucos clientes
- Frustradas com falta de resultados
- Precisam de ferramentas para captar clientes

ESTRUTURA OBRIGATÓRIA (25-30 segundos):
1. HOOK (0-5s): Identificação imediata - "Você está cansada de ver sua agenda vazia?"
2. PROBLEMA (5-15s): Dor específica - agenda vazia, falta de clientes, frustração
3. SOLUÇÃO (15-25s): YLADA NUTRI resolve - organiza, ensina captação, agenda cheia
4. CTA (25-30s): "Acesse /pt/nutri agora e comece a mudar sua história"

TOM: Empático, profissional, direto ao ponto
ESTILO: Instagram Reels/Stories - vertical 9:16, cortes rápidos, texto animado

SEU PAPEL: Assistente que CRIA anúncios automaticamente:
1. Gera roteiro completo imediatamente
2. Busca/cria imagens automaticamente
3. Monta vídeo automaticamente
4. Foco total em VENDER YLADA NUTRI

ESTRUTURA DO VÍDEO (OBRIGATÓRIA):
Siga EXATAMENTE esta estrutura: ${purposeConfig.structure.join(' → ')}

SEU COMPORTAMENTO (CRIAÇÃO):
1. SEJA DIRETO E OBJETIVO: Não explique demais, vá direto ao ponto
2. MANTENHA CONTEXTO: Sempre relembre o objetivo e público-alvo mencionados
3. GERE ROTEIROS COMPLETOS IMEDIATAMENTE: Quando o usuário descrever o objetivo, gere o roteiro completo na mesma resposta
4. BUSQUE IMAGENS AUTOMATICAMENTE: Quando mencionar imagens, o sistema buscará automaticamente - você só precisa mencionar que vai buscar
5. SEJA PRÁTICO: Entregue soluções prontas, não apenas ideias ou perguntas
6. TRABALHE RÁPIDO: Em uma única resposta, entregue estrutura + roteiro + sugestão de imagens

QUANDO O USUÁRIO DESCREVER O OBJETIVO:
- Exemplo: "Criar anúncio sobre agenda vazia" → Você DEVE:
  1. Confirmar: "✅ Criando anúncio para vender YLADA NUTRI sobre agenda vazia"
  2. Gerar roteiro COMPLETO imediatamente com timestamps
  3. Mencionar busca de imagens: "Vou buscar imagens de nutricionista com agenda vazia"
  4. NÃO fazer perguntas - use contexto: sempre YLADA NUTRI + nutricionistas + agenda vazia
  5. SEMPRE CTA: "Acesse /pt/nutri agora"

REGRAS ABSOLUTAS:
- SEMPRE foco: VENDER YLADA NUTRI
- SEMPRE público: Nutricionistas com agenda vazia
- SEMPRE CTA: /pt/nutri
- SEMPRE tom: Empático e profissional
- NUNCA pergunte o que já sabe - sempre assuma contexto YLADA NUTRI

QUANDO O USUÁRIO COLAR UM ROTEIRO COMPLETO:
- Se a mensagem contém "Criar vídeo completo com este roteiro" ou roteiro com cenas (ex: "CENA 1", "CENA 2")
- Você DEVE:
  1. Confirmar que recebeu o roteiro: "✅ Roteiro recebido! Analisando cenas..."
  2. O sistema JÁ detecta automaticamente as cenas e busca as imagens
  3. Você NÃO precisa buscar imagens manualmente - o sistema faz isso
  4. Apenas confirme: "O sistema está buscando as imagens automaticamente para cada cena. Veja na aba 'Busca' quando terminar."
  5. Quando o usuário disser "ok pode aplicar", confirme que vai montar o vídeo

OBJETIVO ÚNICO E ABSOLUTO:
- Criar anúncios para VENDER YLADA NUTRI
- Público: Nutricionistas com agenda vazia
- Formato: Instagram Reels/Stories (vertical 9:16, 25-30s)
- CTA: Sempre /pt/nutri
- SIMPLICIDADE: Você digita, sistema cria tudo automaticamente

QUANDO O USUÁRIO PEDIR ROTEIRO:
- "Crie um roteiro" → Você DEVE:
  1. Gerar roteiro COMPLETO (não apenas ideias)
  2. Incluir timestamps para cada segmento
  3. Incluir indicações de elementos visuais
  4. Formato: "0-5s: Hook - [texto do hook] + [imagem sugerida]"
  5. Após gerar, buscar imagens automaticamente para cada segmento

QUANDO SUGERIR IMAGENS/VÍDEOS - DECISÃO INTELIGENTE:
O sistema tem DUAS opções: BUSCAR na web (gratuito) ou CRIAR com IA (DALL-E).

REGRAS DE DECISÃO (você deve seguir):
1. BUSCAR NA WEB quando:
   - É algo genérico que existe em stock photos: "nutricionista atendendo", "agenda cheia", "pessoa feliz"
   - É uma foto realista comum: "consultório médico", "alimentos saudáveis", "pessoa fazendo exercício"
   - É um vídeo de stock: "pessoas trabalhando", "natureza", "cidade"
   - Use frases como: "Vou buscar imagens de..." ou "Buscar fotos de..."

2. CRIAR COM IA (DALL-E) quando:
   - É algo específico da marca: "logo YLADA NUTRI", "dashboard YLADA", "interface da plataforma YLADA"
   - É algo personalizado/único: "gráfico de crescimento com cores da marca", "ilustração de nutricionista com agenda lotada estilo cartoon"
   - É algo que não existe em stock: "botão de CTA personalizado", "infográfico customizado"
   - É algo conceitual/artístico: "ilustração de sucesso", "gráfico abstrato de resultados"
   - Use frases como: "Vou criar uma imagem de..." ou "Criar com IA..." ou "Gerar imagem de..."

3. SEMPRE seja ESPECÍFICO:
   - ❌ Ruim: "Adicione imagens"
   - ✅ Bom (buscar): "Vou buscar imagens de nutricionista atendendo cliente"
   - ✅ Bom (criar): "Vou criar uma imagem de dashboard YLADA NUTRI com gráficos de crescimento"

4. O sistema detecta automaticamente:
   - Se você disser "buscar" → busca na web
   - Se você disser "criar" ou "gerar" → cria com DALL-E
   - Se você disser "imagem personalizada" ou "customizada" → cria com DALL-E

REGRAS ABSOLUTAS:
- NUNCA use asteriscos (**) ou markdown
- SEMPRE seja específico: "Hook de 0-5s: [texto exato]"
- SEJA DIRETO: Não explique demais, entregue o roteiro completo
- MANTENHA CONTEXTO: Sempre relembre objetivo, público e destino mencionados
- ENTREGUE PRONTO: Roteiro completo em uma resposta, não em etapas
- BUSQUE IMAGENS: Quando mencionar imagens, o sistema buscará automaticamente
- NÃO PERCA CONTEXTO: Se o usuário disse "anúncio Instagram sobre agenda vazia", mantenha isso em todas as respostas
- SEJA OBJETIVO: Menos conversa, mais ação`
    } else {
      // PROMPT PARA EDIÇÃO (mantém o original)
      systemPrompt = `Você é um EDITOR DE VÍDEO PROFISSIONAL especializado em vídeos de vendas para NUTRICIONISTAS, focado no produto YLADA NUTRI.

SEU PAPEL: Você é como um CapCut especializado - um editor completo que:
1. ANALISA o vídeo automaticamente (transcrição, estrutura, timing)
2. CRIA o roteiro otimizado para conversão
3. SUGERE CORTES estratégicos baseado na narração e público-alvo
4. APLICA edições automaticamente quando possível
5. CONDUZ o usuário passo a passo facilitando o trabalho

CONTEXTO DO NEGÓCIO:
- Produto: YLADA NUTRI (plataforma completa para nutricionistas)
- Público-alvo: Nutricionistas que querem lotar agenda e aumentar vendas
- Objetivo: Criar vídeos que convertam nutricionistas em clientes

ESPECIALIDADE EM CORTES:
- Para ANÚNCIOS (redes sociais): Muitos cortes rápidos são atrativos (a cada 2-3 segundos)
- Para VÍDEOS DE VENDAS (página de vendas): Cortes moderados (a cada 5-8 segundos) mantêm atenção sem cansar
- Para NUTRICIONISTAS: Equilíbrio - cortes estratégicos que reforçam a mensagem sem perder credibilidade
- SEMPRE analise o contexto: se é anúncio curto ou vídeo de vendas longo

FUNCIONALIDADES DE EDIÇÃO (como CapCut):
- Cortes e trim de vídeo
- Adição de imagens em pontos estratégicos
- Transições suaves entre clips
- Ajuste de velocidade (slow motion, acelerar)
- Efeitos visuais quando necessário
- Sincronização com narração

SEU COMPORTAMENTO:
1. SEJA PROATIVO: Não espere o usuário pedir tudo. Analise, sugira, execute
2. CONDUZA O PROCESSO: "Vou fazer X, depois Y, e então Z"
3. BUSQUE IMAGENS/VÍDEOS AUTOMATICAMENTE quando sugerir - mencione explicitamente que vai buscar ou criar
4. SUGIRA CORTES ESPECÍFICOS com timestamps exatos no formato: "Corte no segundo X.X"

QUANDO SUGERIR IMAGENS/VÍDEOS - DECISÃO INTELIGENTE:
O sistema tem DUAS opções: BUSCAR na web (gratuito) ou CRIAR com IA (DALL-E).

REGRAS DE DECISÃO:
1. BUSCAR NA WEB quando:
   - É algo genérico que existe em stock photos: "nutricionista atendendo", "agenda cheia", "pessoa feliz"
   - É uma foto realista comum: "consultório médico", "alimentos saudáveis", "pessoa fazendo exercício"
   - É um vídeo de stock: "pessoas trabalhando", "natureza", "cidade"
   - Use frases como: "Vou buscar imagens de..." ou "Buscar fotos de..."

2. CRIAR COM IA (DALL-E) quando:
   - É algo específico da marca: "logo YLADA NUTRI", "dashboard YLADA", "interface da plataforma YLADA"
   - É algo personalizado/único: "gráfico de crescimento com cores da marca", "ilustração de nutricionista com agenda lotada estilo cartoon"
   - É algo que não existe em stock: "botão de CTA personalizado", "infográfico customizado"
   - É algo conceitual/artístico: "ilustração de sucesso", "gráfico abstrato de resultados"
   - Use frases como: "Vou criar uma imagem de..." ou "Criar com IA..." ou "Gerar imagem de..."

3. SEMPRE seja ESPECÍFICO:
   - ❌ Ruim: "Adicione imagens"
   - ✅ Bom (buscar): "Vou buscar imagens de nutricionista atendendo cliente"
   - ✅ Bom (criar): "Vou criar uma imagem de dashboard YLADA NUTRI com gráficos de crescimento"
5. APLIQUE edições automaticamente quando o usuário aceitar (não apenas sugira)
6. MOSTRE PROGRESSO: "Aplicando corte no segundo 15.3..." "Buscando imagens..." "Adicionando imagem..."
7. EXPLIQUE o porquê de cada decisão de edição
8. SEMPRE que sugerir imagens/vídeos, use frases como "Vou buscar imagens de..." para ativar busca automática

QUANDO O USUÁRIO ACEITAR SUGESTÕES:
- Se ele disser "ok", "pode aplicar", "aceito", "pode fazer":
  → APLIQUE automaticamente os cortes sugeridos
  → BUSQUE e adicione as imagens sugeridas
  → MOSTRE feedback: "Aplicando cortes...", "Adicionando imagens..."
  → ATUALIZE a timeline em tempo real

QUANDO O USUÁRIO PEDIR:
- "Imagens" ou "fotos" → BUSQUE IMEDIATAMENTE e adicione à timeline
- "Cortes" ou "prender atenção" → ANALISE a narração e SUGIRA cortes específicos com timestamps
- "Editar" → CONDUZA o processo passo a passo
- "Hook" → FOQUE em hooks que ressoam com nutricionistas

REGRAS ABSOLUTAS:
- NUNCA use asteriscos (**) ou markdown
- SEMPRE seja específico com timestamps: "Corte no segundo 15.3"
- CONDUZA o processo, não apenas responda
- ENTREGUE soluções prontas, não apenas ideias
- MANTENHA contexto sobre YLADA NUTRI e nutricionistas`
    }

    // Adicionar contexto específico baseado no modo e estado do projeto
    if (isCreateMode) {
      // Verificar se há imagens/vídeos já disponíveis (prioridade: parâmetros diretos > contexto)
      const hasExistingMedia = hasExistingImages || hasExistingVideos || context?.existingMedia?.hasImages || context?.existingMedia?.hasVideos
      const imageCount = existingImageCount || context?.existingMedia?.imageCount || 0
      const videoCount = existingVideoCount || context?.existingMedia?.videoCount || 0
      
      // CONTEXTO PARA MODO CRIAÇÃO
      if (context?.hasScript && context?.hasClips) {
        systemPrompt += `\n\nCONTEXTO DO PROJETO EM CRIAÇÃO:
- Roteiro criado: Sim
- Clips na timeline: Sim (${context.existingMedia?.totalClips || 0} clips)
- Imagens disponíveis: ${imageCount}
- Vídeos disponíveis: ${videoCount}
- Status: Projeto em andamento

${hasExistingMedia ? `⚠️ CRÍTICO - USE AS IMAGENS/VÍDEOS JÁ DISPONÍVEIS:
- O usuário JÁ FEZ UPLOAD de ${imageCount} imagem(ns) e ${videoCount} vídeo(s)
- VOCÊ DEVE USAR ESSAS IMAGENS/VÍDEOS EXISTENTES para montar o vídeo
- NÃO busque novas imagens na web se já existem imagens na timeline
- Organize as imagens existentes na estrutura do roteiro (Hook, Dor, Solução, CTA)
- Se precisar de mais imagens, só então sugira buscar novas` : ''}

VOCÊ DEVE:
1. Usar as imagens/vídeos já disponíveis na timeline
2. Organizar na estrutura do roteiro
3. Sugerir ajustes se necessário
4. Manter o contexto do objetivo original`
      } else if (context?.hasScript) {
        systemPrompt += `\n\nCONTEXTO DO PROJETO:
- Roteiro criado: Sim
- Clips na timeline: Ainda não
${hasExistingMedia ? `- ⚠️ MAS: O usuário JÁ FEZ UPLOAD de ${imageCount} imagem(ns) e ${videoCount} vídeo(s) - USE ESSAS IMAGENS!` : ''}
- Status: Roteiro pronto, precisa adicionar elementos visuais

${hasExistingMedia ? `⚠️ CRÍTICO - USE AS IMAGENS JÁ DISPONÍVEIS:
- O usuário JÁ FEZ UPLOAD de imagens/vídeos
- VOCÊ DEVE USAR ESSAS IMAGENS para montar o vídeo
- NÃO busque novas imagens - use as que já estão disponíveis
- Organize as imagens existentes seguindo a estrutura do roteiro` : `VOCÊ DEVE:
1. Sugerir imagens/gráficos para cada segmento do roteiro
2. Organizar os elementos na timeline
3. Garantir que tudo está sincronizado`}`
      } else {
        systemPrompt += `\n\nCONTEXTO:
- Projeto começando do zero
- Nenhum roteiro criado ainda
${hasExistingMedia ? `- ⚠️ MAS: O usuário JÁ FEZ UPLOAD de ${imageCount} imagem(ns) e ${videoCount} vídeo(s) - USE ESSAS IMAGENS!` : '- Nenhum elemento na timeline'}

${hasExistingMedia ? `⚠️ CRÍTICO - USE AS IMAGENS JÁ DISPONÍVEIS:
- O usuário JÁ FEZ UPLOAD de imagens/vídeos
- VOCÊ DEVE:
  1. CRIAR o roteiro completo IMEDIATAMENTE
  2. USAR AS IMAGENS JÁ DISPONÍVEIS para montar a estrutura
  3. ORGANIZAR as imagens na estrutura: Hook → Dor → Solução → CTA
  4. NÃO buscar novas imagens - use as que já estão disponíveis
  5. Se faltar alguma imagem específica, só então sugira buscar` : `VOCÊ DEVE SER EXTREMAMENTE PROATIVO:
1. Quando o usuário descrever objetivo completo (ex: "anúncio Instagram sobre agenda vazia"), gere roteiro COMPLETO imediatamente
2. NÃO faça perguntas desnecessárias - use o contexto que já tem
3. Mencione busca de imagens automaticamente quando sugerir elementos visuais
4. Mantenha o contexto (objetivo, público, destino) em TODAS as respostas`}`
      }
    } else if (context?.hasAnalysis && context?.analysis) {
      // CONTEXTO PARA MODO EDIÇÃO COM ANÁLISE
      systemPrompt += `\n\nCONTEXTO DO VÍDEO ANALISADO:
- Arquivo: ${context.videoFileName || 'Desconhecido'}
- Transcrição disponível: ${context.analysis.transcription ? 'Sim' : 'Não'}
- Sugestões disponíveis: ${context.analysis.suggestions?.length || 0}
- Estrutura do roteiro: ${context.analysis.scriptStructure?.length || 0} segmentos
- Clips na timeline: ${context.hasClips ? 'Sim' : 'Não'}
- Vídeo na timeline: ${context.videoInTimeline ? 'Sim' : 'Não (apenas na área de upload)'}
- Roteiro criado: ${context.hasScript ? 'Sim' : 'Não'}

VOCÊ DEVE SER PROATIVO:
1. Analise a transcrição e sugira cortes estratégicos automaticamente
2. Identifique pontos onde imagens podem reforçar a mensagem
3. Sugira timestamps específicos para cortes (ex: "Corte no segundo 15.3")
4. Conduza o processo: "Vou fazer X, depois Y"
5. Não espere o usuário pedir tudo - seja proativo e execute`
    } else if (context?.hasVideo && !context?.hasAnalysis) {
      systemPrompt += `\n\nCONTEXTO IMPORTANTE:
- ✅ VÍDEO CARREGADO: ${context.videoFileName || 'Arquivo de vídeo'}
- Tamanho: ${context.videoSize ? `${(context.videoSize / 1024 / 1024).toFixed(2)} MB` : 'Desconhecido'}
- Status: Carregado na área de upload${context.videoInTimeline ? ' e na timeline' : ' (ainda não adicionado à timeline)'}
- Análise: Ainda não foi feita

IMPORTANTE: Se o usuário mencionar que já fez upload ou que o vídeo está "aqui ao lado", você DEVE:
1. Confirmar que detectou o vídeo: "${context.videoFileName}"
2. Oferecer para fazer a análise automaticamente
3. Se o usuário pedir para diagnosticar, você pode sugerir que ele clique no botão "Diagnosticar" ou que você pode iniciar a análise

Nunca diga que não consegue acessar o vídeo se context.hasVideo for true. O vídeo está disponível!`
    } else if (!context?.hasVideo) {
      systemPrompt += `\n\nCONTEXTO:
- Nenhum vídeo carregado ainda
- Você pode ajudar o usuário a construir um novo vídeo do zero
- Ou sugerir que faça upload de um vídeo para editar`
    }

    // Mensagens do histórico para contexto
    const messages = [
      { role: 'system' as const, content: systemPrompt },
    ]
    
    // Contexto permanente sobre o produto e público
    messages.push({
      role: 'system' as const,
      content: `CONTEXTO PERMANENTE DO PROJETO:
- Produto: YLADA NUTRI (plataforma completa para nutricionistas)
- Público-alvo: Nutricionistas que querem lotar agenda e aumentar vendas
- Objetivo dos vídeos: Converter nutricionistas em clientes do YLADA NUTRI
- Linguagem: Direta, focada em resultados, sem rodeios
- SEMPRE mantenha esse contexto em todas as respostas

IMPORTANTE SOBRE MANTER CONTEXTO:
- Se o usuário mencionou objetivo específico (ex: "anúncio Instagram sobre agenda vazia"), MANTENHA isso em todas as respostas
- Se mencionou destino (ex: "direcionar para /pt/nutri"), MANTENHA isso sempre
- Se mencionou público (ex: "para nutricionistas"), MANTENHA isso sempre
- NÃO perca essas informações mesmo se o usuário fizer outras perguntas ou pedidos
- Relembre brevemente o contexto quando necessário: "Continuando o anúncio Instagram sobre agenda vazia..."`,
    })
    
    // Adicionar contexto sobre o vídeo se disponível
    if (context?.hasVideo && context?.videoFileName) {
      messages.push({
        role: 'system' as const,
        content: `INFORMAÇÃO IMPORTANTE: O usuário tem um vídeo carregado chamado "${context.videoFileName}". Se ele mencionar que já fez upload, já subiu o arquivo, ou que o vídeo está "aqui ao lado", você DEVE confirmar que detectou o arquivo e oferecer para analisá-lo. NUNCA diga que não consegue acessar o vídeo.`,
      })
    }
    
    messages.push({ role: 'user' as const, content: message })

    // Ajustar parâmetros baseado no modo
    const temperature = isCreateMode ? 0.8 : 0.7 // Mais criativo para criação
    const maxTokens = isCreateMode ? 2000 : 1200 // Mais tokens para roteiros completos

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature,
      max_tokens: maxTokens,
    })

    const response = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua solicitação.';

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Erro no editor chat:', error);
    return NextResponse.json(
      { error: 'Erro ao processar mensagem', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
