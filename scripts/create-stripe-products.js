#!/usr/bin/env node

/**
 * Script para criar produtos no Stripe (Teste e Produção)
 * 
 * Uso:
 *   node scripts/create-stripe-products.js --mode test
 *   node scripts/create-stripe-products.js --mode live
 */

const path = require('path')
const fs = require('fs')

// Tentar diferentes caminhos
const envPaths = [
  path.join(process.cwd(), '.env.local'),
  path.join(__dirname, '..', '.env.local'),
  '.env.local'
]

let envPath = null
for (const p of envPaths) {
  if (fs.existsSync(p)) {
    envPath = p
    break
  }
}

if (!envPath) {
  console.error('❌ Arquivo .env.local não encontrado')
  console.error('   Procurou em:', envPaths)
  process.exit(1)
}

console.log(`📁 Carregando variáveis de: ${envPath}`)

const result = require('dotenv').config({ path: envPath })

if (result.error) {
  console.error('❌ Erro ao carregar .env.local:', result.error.message)
  process.exit(1)
}

// Debug: mostrar TODAS as variáveis carregadas do .env.local
const allEnvVars = Object.keys(result.parsed || {})
console.log(`\n📋 Total de variáveis carregadas do .env.local: ${allEnvVars.length}`)
if (allEnvVars.length > 0) {
  console.log('   Variáveis encontradas:')
  allEnvVars.forEach(key => {
    const value = result.parsed[key]
    const preview = value ? (value.length > 20 ? `${value.substring(0, 20)}...` : value) : 'vazia'
    console.log(`   - ${key}: ${preview}`)
  })
}

// Debug: mostrar variáveis Stripe encontradas
const stripeVars = Object.keys(process.env).filter(key => 
  key.includes('STRIPE') && key.includes('BR')
)
console.log(`\n🔍 Variáveis Stripe no process.env:`)
if (stripeVars.length === 0) {
  console.log('   ⚠️  Nenhuma variável Stripe encontrada!')
  console.log('   Verifique se as variáveis estão no formato correto:')
  console.log('   STRIPE_SECRET_KEY_BR=sk_test_xxxxx')
  console.log('   (Sem espaços antes ou depois do =)')
} else {
  stripeVars.forEach(key => {
    const value = process.env[key]
    const preview = value ? `${value.substring(0, 15)}...` : 'não definida'
    console.log(`   ${key}: ${preview}`)
  })
}
console.log('')

const Stripe = require('stripe')

const mode = process.argv.includes('--mode') 
  ? process.argv[process.argv.indexOf('--mode') + 1]
  : 'test'

if (!['test', 'live'].includes(mode)) {
  console.error('❌ Modo inválido. Use: --mode test ou --mode live')
  process.exit(1)
}

const isTest = mode === 'test'

// Tentar diferentes nomes de variáveis
const possibleKeys = isTest
  ? [
      process.env.STRIPE_SECRET_KEY_BR,
      process.env.STRIPE_SECRET_KEY_BR_TEST,
      process.env.STRIPE_SECRET_KEY_BR_TEST_MODE,
    ]
  : [
      process.env.STRIPE_SECRET_KEY_BR_LIVE,
      process.env.STRIPE_SECRET_KEY_BR,
      process.env.STRIPE_SECRET_KEY_BR_PRODUCTION,
    ]

const stripeKey = possibleKeys.find(key => key && key.startsWith('sk_'))

if (!stripeKey) {
  console.error(`❌ Chave Stripe não encontrada para modo ${mode}`)
  console.error(`\n   Variáveis verificadas:`)
  if (isTest) {
    console.error(`   - STRIPE_SECRET_KEY_BR: ${process.env.STRIPE_SECRET_KEY_BR ? '✅ encontrada' : '❌ não encontrada'}`)
    console.error(`   - STRIPE_SECRET_KEY_BR_TEST: ${process.env.STRIPE_SECRET_KEY_BR_TEST ? '✅ encontrada' : '❌ não encontrada'}`)
  } else {
    console.error(`   - STRIPE_SECRET_KEY_BR_LIVE: ${process.env.STRIPE_SECRET_KEY_BR_LIVE ? '✅ encontrada' : '❌ não encontrada'}`)
    console.error(`   - STRIPE_SECRET_KEY_BR: ${process.env.STRIPE_SECRET_KEY_BR ? '✅ encontrada' : '❌ não encontrada'}`)
  }
  console.error(`\n   Configure STRIPE_SECRET_KEY_BR${isTest ? '' : '_LIVE'} no .env.local`)
  console.error(`   A chave deve começar com 'sk_test_' (teste) ou 'sk_live_' (produção)`)
  process.exit(1)
}

console.log(`✅ Chave Stripe encontrada: ${stripeKey.substring(0, 12)}...`)

const stripe = new Stripe(stripeKey, {
  apiVersion: '2024-11-20.acacia',
})

console.log(`\n🚀 Criando produtos no Stripe (Modo: ${mode === 'test' ? 'TESTE' : 'PRODUÇÃO'})\n`)

async function createProducts() {
  try {
    // 1. Criar Produto Mensal (Recurring)
    console.log('📦 Criando produto mensal...')
    const monthlyProduct = await stripe.products.create({
      name: 'YLADA Wellness Brasil - Mensal',
      description: 'Plataforma Wellness Brasil (sem coleta de dados). Inclui criação de links, portal básico e suporte padrão.',
      metadata: {
        area: 'wellness',
        pais: 'brasil',
        tipo: 'assinatura',
        plano: 'mensal',
      },
    })

    console.log(`   ✅ Produto criado: ${monthlyProduct.id}`)

    // Criar preço mensal (Recurring - Monthly)
    const monthlyPrice = await stripe.prices.create({
      product: monthlyProduct.id,
      unit_amount: 5990, // R$ 59,90 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
      metadata: {
        area: 'wellness',
        pais: 'brasil',
        tipo: 'assinatura',
        plano: 'mensal',
      },
    })

    console.log(`   ✅ Preço mensal criado: ${monthlyPrice.id}`)
    console.log(`   💰 Price ID: ${monthlyPrice.id}\n`)

    // 2. Criar Produto Anual (One-time - Parcelado)
    console.log('📦 Criando produto anual (parcelado)...')
    const annualProduct = await stripe.products.create({
      name: 'YLADA Wellness BR - Anual Parcelado',
      description: 'Plataforma Wellness Brasil - Plano Anual (pagamento único parcelado em até 12x). Inclui criação de links, portal básico e suporte padrão.',
      metadata: {
        area: 'wellness',
        pais: 'brasil',
        tipo: 'pagamento_unico',
        plano: 'anual',
      },
    })

    console.log(`   ✅ Produto criado: ${annualProduct.id}`)

    // Criar preço anual (One-time)
    const annualPrice = await stripe.prices.create({
      product: annualProduct.id,
      unit_amount: 57000, // R$ 570,00 em centavos
      currency: 'brl',
      // Não tem 'recurring' = One-time (permite parcelamento)
      metadata: {
        area: 'wellness',
        pais: 'brasil',
        tipo: 'pagamento_unico',
        plano: 'anual',
      },
    })

    console.log(`   ✅ Preço anual criado: ${annualPrice.id}`)
    console.log(`   💰 Price ID: ${annualPrice.id}\n`)

    // 3. Resumo
    console.log('='.repeat(60))
    console.log('✅ PRODUTOS CRIADOS COM SUCESSO!\n')
    console.log('📋 Adicione estas variáveis no .env.local:\n')
    console.log(`STRIPE_PRICE_WELLNESS_MONTHLY_BR=${monthlyPrice.id}`)
    console.log(`STRIPE_PRICE_WELLNESS_ANNUAL_ONETIME_BR=${annualPrice.id}`)
    console.log('\n' + '='.repeat(60))
    console.log('\n⚠️  IMPORTANTE:')
    console.log('   1. Copie os Price IDs acima')
    console.log('   2. Adicione no .env.local')
    console.log('   3. Reinicie o servidor (npm run dev)')
    console.log('')

  } catch (error) {
    console.error('❌ Erro ao criar produtos:', error.message)
    if (error.type === 'StripeAuthenticationError') {
      console.error('   Verifique se a chave Stripe está correta')
    }
    process.exit(1)
  }
}

createProducts()

