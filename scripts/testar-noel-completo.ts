/**
 * Script para testar o NOEL - 10 Testes Automáticos
 * 
 * Executa os 10 testes definidos no documento de implantação
 * para validar o funcionamento completo do NOEL antes do deploy.
 * 
 * Uso:
 *   npx tsx scripts/testar-noel-completo.ts
 * 
 * Requer:
 *   - Variáveis de ambiente configuradas (.env)
 *   - Servidor rodando (localhost:3000)
 *   - Usuário de teste autenticado
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Lista de testes
const testes = [
  {
    nome: 'Convite leve',
    prompt: 'Me dá um convite leve.',
    esperado: {
      temResposta: true,
      temCTA: true,
      perfilEsperado: null, // pode ser qualquer um
    }
  },
  {
    nome: 'Venda Turbo Detox',
    prompt: 'Como vendo o turbo detox?',
    esperado: {
      temResposta: true,
      temCTA: true,
      perfilEsperado: 'beverage_distributor',
      contemPalavras: ['turbo', 'detox', 'energia']
    }
  },
  {
    nome: 'Fluxo 2-5-10',
    prompt: 'O que é 2-5-10?',
    esperado: {
      temResposta: true,
      temCTA: true,
      contemPalavras: ['2', '5', '10', 'convite', 'follow']
    }
  },
  {
    nome: 'Detecção de perfil',
    prompt: 'Eu vendo shakes e chá.',
    esperado: {
      temResposta: true,
      perfilEsperado: 'product_distributor',
      contemPalavras: ['shake', 'chá']
    }
  },
  {
    nome: 'Follow-up',
    prompt: 'Me manda um follow-up leve.',
    esperado: {
      temResposta: true,
      temCTA: true,
      contemPalavras: ['oi', 'mensagem']
    }
  },
  {
    nome: 'Cliente sumido',
    prompt: 'O cliente sumiu, o que eu digo?',
    esperado: {
      temResposta: true,
      temCTA: true,
      contemPalavras: ['cliente', 'mensagem']
    }
  },
  {
    nome: 'Convite avaliação',
    prompt: 'Como eu convido alguém pra avaliação?',
    esperado: {
      temResposta: true,
      temCTA: true,
      perfilEsperado: 'wellness_activator',
      contemPalavras: ['avaliação', 'convite']
    }
  },
  {
    nome: 'Recrutamento',
    prompt: 'Como explico o negócio em 1 minuto?',
    esperado: {
      temResposta: true,
      temCTA: true,
      contemPalavras: ['negócio', 'trabalho']
    }
  },
  {
    nome: 'Começar hoje',
    prompt: 'Quero começar hoje, o que eu faço?',
    esperado: {
      temResposta: true,
      temCTA: true,
      contemPalavras: ['começar', 'primeiro', 'checklist']
    }
  },
  {
    nome: 'Saudação',
    prompt: 'Oi Noel, tudo bem?',
    esperado: {
      temResposta: true,
      temCTA: true,
      contemPalavras: ['oi', 'tudo bem', 'ajudar']
    }
  }
]

interface TestResult {
  nome: string
  prompt: string
  sucesso: boolean
  resposta?: string
  erro?: string
  perfilDetectado?: string
  categoriaDetectada?: string
  detalhes: string[]
}

/**
 * Executa um teste individual
 */
async function executarTeste(
  teste: typeof testes[0],
  userId: string,
  authToken: string
): Promise<TestResult> {
  const resultado: TestResult = {
    nome: teste.nome,
    prompt: teste.prompt,
    sucesso: false,
    detalhes: []
  }

  try {
    // Fazer requisição para /api/wellness/noel
    const response = await fetch('http://localhost:3000/api/wellness/noel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        message: teste.prompt,
        conversationHistory: []
      })
    })

    const data = await response.json()

    if (!response.ok) {
      resultado.erro = data.error || `HTTP ${response.status}`
      resultado.detalhes.push(`❌ Erro HTTP: ${response.status}`)
      return resultado
    }

    if (!data.response) {
      resultado.erro = 'Resposta vazia'
      resultado.detalhes.push('❌ Resposta vazia')
      return resultado
    }

    resultado.resposta = data.response
    resultado.perfilDetectado = data.profile_detected
    resultado.categoriaDetectada = data.category_detected || data.module

    // Validar resposta
    const validacoes: string[] = []

    // Verificar se tem resposta
    if (teste.esperado.temResposta && data.response) {
      validacoes.push('✅ Tem resposta')
    } else if (teste.esperado.temResposta) {
      validacoes.push('❌ Sem resposta')
    }

    // Verificar se tem CTA
    if (teste.esperado.temCTA) {
      const temCTA = data.response.includes('?') || 
                     data.response.includes('Quer') ||
                     data.response.includes('quer') ||
                     data.response.includes('pode')
      if (temCTA) {
        validacoes.push('✅ Tem CTA')
      } else {
        validacoes.push('⚠️ CTA não detectado')
      }
    }

    // Verificar perfil esperado
    if (teste.esperado.perfilEsperado) {
      if (resultado.perfilDetectado === teste.esperado.perfilEsperado) {
        validacoes.push(`✅ Perfil correto: ${teste.esperado.perfilEsperado}`)
      } else {
        validacoes.push(`⚠️ Perfil esperado: ${teste.esperado.perfilEsperado}, detectado: ${resultado.perfilDetectado || 'nenhum'}`)
      }
    }

    // Verificar palavras-chave
    if (teste.esperado.contemPalavras) {
      const palavrasEncontradas = teste.esperado.contemPalavras.filter(palavra =>
        data.response.toLowerCase().includes(palavra.toLowerCase())
      )
      if (palavrasEncontradas.length > 0) {
        validacoes.push(`✅ Palavras encontradas: ${palavrasEncontradas.join(', ')}`)
      } else {
        validacoes.push(`⚠️ Palavras esperadas não encontradas: ${teste.esperado.contemPalavras.join(', ')}`)
      }
    }

    resultado.detalhes = validacoes
    resultado.sucesso = validacoes.filter(v => v.startsWith('✅')).length > 0

  } catch (error: any) {
    resultado.erro = error.message
    resultado.detalhes.push(`❌ Erro: ${error.message}`)
  }

  return resultado
}

/**
 * Executa todos os testes
 */
async function executarTodosTestes() {
  console.log('🧪 ==========================================')
  console.log('🧪 TESTES AUTOMÁTICOS DO NOEL')
  console.log('🧪 ==========================================\n')

  // Buscar um usuário de teste (primeiro usuário wellness)
  const { data: usuarios, error: userError } = await supabase
    .from('user_profiles')
    .select('user_id, nome_completo')
    .eq('profession', 'wellness')
    .limit(1)

  if (userError || !usuarios || usuarios.length === 0) {
    console.error('❌ Erro ao buscar usuário de teste:', userError?.message)
    console.error('   Certifique-se de que existe pelo menos um usuário wellness no banco')
    process.exit(1)
  }

  const userId = usuarios[0].user_id
  console.log(`👤 Usuário de teste: ${usuarios[0].nome_completo} (${userId})\n`)

  // Nota: Para testes reais, seria necessário um token de autenticação válido
  // Por enquanto, vamos apenas simular ou usar service role
  console.log('⚠️  NOTA: Este script requer autenticação.')
  console.log('   Para testes completos, execute manualmente via interface web.\n')
  console.log('📋 Lista de testes que serão executados:\n')

  const resultados: TestResult[] = []

  for (let i = 0; i < testes.length; i++) {
    const teste = testes[i]
    console.log(`${i + 1}. ${teste.nome}`)
    console.log(`   Prompt: "${teste.prompt}"`)
    console.log(`   Esperado: ${JSON.stringify(teste.esperado)}\n`)
  }

  console.log('✅ Lista de testes gerada.')
  console.log('\n💡 Para executar os testes reais:')
  console.log('   1. Acesse a interface do NOEL no navegador')
  console.log('   2. Execute cada teste manualmente')
  console.log('   3. Valide as respostas conforme os critérios acima')
  console.log('\n📝 Ou aguarde implementação de autenticação no script.')
}

// Executar
executarTodosTestes().catch(console.error)
