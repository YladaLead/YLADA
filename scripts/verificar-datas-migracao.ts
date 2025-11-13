/**
 * Script para verificar se as datas de vencimento no CSV estão corretas
 * Compara com o que está no banco de dados
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

interface CSVRow {
  email: string
  nome: string
  dataCadastro: string
  dataVencimento: string | null
}

function parseCSV(csvPath: string): CSVRow[] {
  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())
  const rows: CSVRow[] = []

  // Pular header
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(';')
    if (parts.length >= 4) {
      rows.push({
        email: parts[0].trim(),
        nome: parts[1].trim(),
        dataCadastro: parts[2].trim(),
        dataVencimento: parts[3].trim() === 'null' ? null : parts[3].trim()
      })
    }
  }

  return rows
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr || dateStr === 'null') return null
  
  // Formato: DD/MM/YYYY
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  
  const day = parseInt(parts[0])
  const month = parseInt(parts[1]) - 1 // JavaScript months are 0-indexed
  const year = parseInt(parts[2])
  
  return new Date(year, month, day)
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR')
}

function calcularDiasEntre(d1: Date, d2: Date): number {
  const diffTime = d2.getTime() - d1.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

async function verificarDatas() {
  console.log('🔍 Verificando datas de vencimento...\n')

  const csvPath = path.join(process.cwd(), '..', 'Desktop', 'migrados data.csv')
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Arquivo não encontrado: ${csvPath}`)
    process.exit(1)
  }

  const csvRows = parseCSV(csvPath)
  console.log(`📊 Total de registros no CSV: ${csvRows.length}\n`)

  const problemas: Array<{
    email: string
    nome: string
    problema: string
    csvData: string
    bancoData?: string
  }> = []

  for (const row of csvRows) {
    const dataCadastro = parseDate(row.dataCadastro)
    const dataVencimentoCSV = row.dataVencimento ? parseDate(row.dataVencimento) : null

    if (!dataCadastro) {
      problemas.push({
        email: row.email,
        nome: row.nome,
        problema: 'Data de cadastro inválida',
        csvData: row.dataCadastro
      })
      continue
    }

    // Buscar no banco
    const { data: user } = await supabaseAdmin.auth.admin.listUsers()
    const usuario = user.users.find(u => u.email === row.email)

    if (!usuario) {
      problemas.push({
        email: row.email,
        nome: row.nome,
        problema: 'Usuário não encontrado no banco',
        csvData: row.dataVencimento || 'null'
      })
      continue
    }

    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('current_period_end, plan_type')
      .eq('user_id', usuario.id)
      .eq('area', 'wellness')
      .eq('status', 'active')
      .single()

    if (!subscription) {
      problemas.push({
        email: row.email,
        nome: row.nome,
        problema: 'Assinatura não encontrada no banco',
        csvData: row.dataVencimento || 'null'
      })
      continue
    }

    const dataVencimentoBanco = subscription.current_period_end 
      ? new Date(subscription.current_period_end) 
      : null

    // Verificar se a data do CSV está correta (1 mês após cadastro para monthly, 1 ano para annual)
    if (dataVencimentoCSV) {
      const diasEntre = calcularDiasEntre(dataCadastro, dataVencimentoCSV)
      const planType = subscription.plan_type || 'monthly'
      const diasEsperados = planType === 'annual' ? 365 : 30

      // Tolerância de ±2 dias
      if (Math.abs(diasEntre - diasEsperados) > 2) {
        problemas.push({
          email: row.email,
          nome: row.nome,
          problema: `Data de vencimento no CSV parece incorreta (${diasEntre} dias após cadastro, esperado ~${diasEsperados} dias)`,
          csvData: formatDate(dataVencimentoCSV),
          bancoData: dataVencimentoBanco ? formatDate(dataVencimentoBanco) : 'null'
        })
      }
    }

    // Verificar se CSV e banco estão diferentes
    if (dataVencimentoCSV && dataVencimentoBanco) {
      const csvDateStr = dataVencimentoCSV.toISOString().split('T')[0]
      const bancoDateStr = dataVencimentoBanco.toISOString().split('T')[0]
      
      if (csvDateStr !== bancoDateStr) {
        problemas.push({
          email: row.email,
          nome: row.nome,
          problema: `Data no CSV (${formatDate(dataVencimentoCSV)}) diferente da data no banco (${formatDate(dataVencimentoBanco)})`,
          csvData: formatDate(dataVencimentoCSV),
          bancoData: formatDate(dataVencimentoBanco)
        })
      }
    }
  }

  // Relatório
  console.log('📋 RELATÓRIO DE VERIFICAÇÃO\n')
  console.log(`✅ Registros verificados: ${csvRows.length}`)
  console.log(`⚠️  Problemas encontrados: ${problemas.length}\n`)

  if (problemas.length > 0) {
    console.log('⚠️  PROBLEMAS ENCONTRADOS:\n')
    problemas.forEach((p, i) => {
      console.log(`${i + 1}. ${p.nome} (${p.email})`)
      console.log(`   Problema: ${p.problema}`)
      console.log(`   CSV: ${p.csvData}`)
      if (p.bancoData) {
        console.log(`   Banco: ${p.bancoData}`)
      }
      console.log('')
    })
  } else {
    console.log('✅ Todas as datas estão corretas!')
  }
}

verificarDatas().catch(console.error)

