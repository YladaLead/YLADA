#!/usr/bin/env node

/**
 * Script para criar produtos no Stripe (Teste e Produção)
 * 
 * Uso:
 *   node scripts/create-stripe-products.js --mode test
 *   node scripts/create-stripe-products.js --mode live
 */

require('dotenv').config({ path: '.env.local' })
const Stripe = require('stripe')

const mode = process.argv.includes('--mode') 
  ? process.argv[process.argv.indexOf('--mode') + 1]
  : 'test'

if (!['test', 'live'].includes(mode)) {
  console.error('❌ Modo inválido. Use: --mode test ou --mode live')
  process.exit(1)
}

const isTest = mode === 'test'
const stripeKey = isTest 
  ? process.env.STRIPE_SECRET_KEY_BR
  : process.env.STRIPE_SECRET_KEY_BR_LIVE || process.env.STRIPE_SECRET_KEY_BR

if (!stripeKey) {
  console.error(`❌ Chave Stripe não encontrada para modo ${mode}`)
  console.error(`   Configure STRIPE_SECRET_KEY_BR${isTest ? '' : '_LIVE'} no .env.local`)
  process.exit(1)
}

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

