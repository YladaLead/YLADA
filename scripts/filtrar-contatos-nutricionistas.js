/**
 * Script para filtrar e limpar contatos de nutricionistas
 * Remove: escritórios de contabilidade, telefones duplicados, telefones inválidos
 */

const fs = require('fs')
const path = require('path')

const INPUT_FILE = path.join(__dirname, '../contatos-meta-ads.csv')
const OUTPUT_FILE = path.join(__dirname, '../contatos-meta-ads-filtrado.csv')

/**
 * Verifica se é escritório de contabilidade ou empresa genérica
 */
function isContabilidadeOrEmpresa(nome) {
  if (!nome || typeof nome !== 'string') return false
  
  const nomeLower = nome.toLowerCase()
  
  // Palavras que indicam escritório de contabilidade
  const palavrasContabilidade = [
    'contabil',
    'contador',
    'escritorio',
    'escritório',
    'auditoria',
    'auditor',
    'consultoria contabil',
    'consultoria e contabilidade',
    'assessoria contabil',
    'assessoria e contabilidade',
    'contabilidade empresarial',
    'contabilidade e consultoria',
    'contabilita',
    'contabilista',
  ]
  
  // Palavras que indicam empresa genérica (mas não clínica de nutrição)
  const palavrasEmpresa = [
    'ltda',
    'me eireli',
    'eireli',
    'consultoria empresarial',
    'assessoria empresarial',
    'gestao empresarial',
  ]
  
  // Verificar se contém palavras de contabilidade
  const isContabilidade = palavrasContabilidade.some(palavra => 
    nomeLower.includes(palavra)
  )
  
  // Verificar se contém palavras de empresa genérica
  const isEmpresaGenerica = palavrasEmpresa.some(palavra => 
    nomeLower.includes(palavra)
  )
  
  // Exceções: se for clínica de nutrição, não remover
  const isClinicaNutricao = nomeLower.includes('clinica') && 
    (nomeLower.includes('nutri') || nomeLower.includes('nutrição') || nomeLower.includes('saude'))
  
  // Exceções: se for consultoria nutricional, não remover
  const isConsultoriaNutricao = nomeLower.includes('consultoria') && 
    (nomeLower.includes('nutri') || nomeLower.includes('nutrição') || nomeLower.includes('aliment'))
  
  if (isClinicaNutricao || isConsultoriaNutricao) {
    return false
  }
  
  return isContabilidade || isEmpresaGenerica
}

/**
 * Verifica se telefone é inválido/genérico
 */
function isTelefoneInvalido(telefone) {
  if (!telefone || typeof telefone !== 'string') return true
  
  const cleaned = telefone.replace(/\D/g, '')
  
  // Telefones genéricos/falsos
  const telefonesInvalidos = [
    '5511999999999',
    '5521999999999',
    '5585999999999',
    '5599999999999',
    '5511111111111',
    '5521222222222',
    '55111111111',
    '55212222222',
    '11999999999',
    '21999999999',
    '85999999999',
    '99999999999',
    '11111111111',
    '21222222222',
  ]
  
  // Verificar se é sequência repetida
  if (/^(\d)\1{9,}$/.test(cleaned)) {
    return true
  }
  
  // Verificar se está na lista de inválidos
  return telefonesInvalidos.includes(cleaned)
}

/**
 * Verifica se parece ser nutricionista individual
 */
function isNutricionistaIndividual(nome) {
  if (!nome || typeof nome !== 'string') return false
  
  const nomeLower = nome.toLowerCase()
  
  // Indicadores de nutricionista individual
  const indicadores = [
    'nutricionista',
    'nutri',
    'nutrição',
    'nutrologia',
    'dra.',
    'dr.',
    'doutora',
    'doutor',
  ]
  
  // Se não tem nenhum indicador, provavelmente não é nutricionista
  const temIndicador = indicadores.some(ind => nomeLower.includes(ind))
  
  // Se tem indicador E não é empresa de contabilidade, provavelmente é válido
  return temIndicador && !isContabilidadeOrEmpresa(nome)
}

/**
 * Função principal
 */
function main() {
  console.log('🔍 Filtrando contatos de nutricionistas...')
  console.log('=' .repeat(50))
  
  // Ler arquivo CSV
  const content = fs.readFileSync(INPUT_FILE, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())
  
  if (lines.length === 0) {
    console.error('❌ Arquivo vazio ou não encontrado')
    process.exit(1)
  }
  
  const header = lines[0]
  const dataLines = lines.slice(1)
  
  console.log(`📊 Total de contatos: ${dataLines.length}`)
  
  // Processar contatos
  const telefonesVistos = new Map()
  const contatosFiltrados = []
  let removidosContabilidade = 0
  let removidosTelefoneInvalido = 0
  let removidosTelefoneDuplicado = 0
  let removidosNaoNutricionista = 0
  
  dataLines.forEach((line, index) => {
    // Parse CSV simples (considerando que pode ter vírgulas dentro de aspas)
    const parts = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    parts.push(current.trim())
    
    // Remover aspas dos valores
    const email = (parts[1] || '').replace(/^"|"$/g, '')
    const nome = (parts[0] || '').replace(/^"|"$/g, '')
    const telefone = (parts[2] || '').replace(/^"|"$/g, '')
    
    // 1. Remover escritórios de contabilidade
    if (isContabilidadeOrEmpresa(nome)) {
      removidosContabilidade++
      return
    }
    
    // 2. Remover telefones inválidos
    if (telefone && isTelefoneInvalido(telefone)) {
      removidosTelefoneInvalido++
      return
    }
    
    // 3. Remover telefones duplicados (manter apenas o primeiro)
    if (telefone) {
      if (telefonesVistos.has(telefone)) {
        removidosTelefoneDuplicado++
        return
      }
      telefonesVistos.set(telefone, true)
    }
    
    // 4. Verificar se parece ser nutricionista (opcional - mais permissivo)
    // Se não tem nome mas tem email ou telefone válido, manter
    if (!nome || nome.trim() === '') {
      // Sem nome mas tem contato válido - manter
      contatosFiltrados.push({ email, nome, telefone })
    } else if (isNutricionistaIndividual(nome) || email || telefone) {
      // Tem indicador de nutricionista OU tem contato válido - manter
      contatosFiltrados.push({ email, nome, telefone })
    } else {
      removidosNaoNutricionista++
    }
  })
  
  // Gerar CSV filtrado
  const csvLines = [header]
  contatosFiltrados.forEach(contato => {
    const row = [
      contato.email || '',
      contato.nome || '',
      contato.telefone || '',
    ].map(cell => {
      // Escapar aspas e vírgulas
      const cellStr = String(cell || '')
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`
      }
      return cellStr
    }).join(',')
    csvLines.push(row)
  })
  
  // Salvar arquivo
  fs.writeFileSync(OUTPUT_FILE, csvLines.join('\n'), 'utf-8')
  
  // Estatísticas
  const withEmail = contatosFiltrados.filter(c => c.email).length
  const withPhone = contatosFiltrados.filter(c => c.telefone).length
  const withBoth = contatosFiltrados.filter(c => c.email && c.telefone).length
  const withName = contatosFiltrados.filter(c => c.nome).length
  
  console.log(`\n✅ Filtragem concluída!`)
  console.log(`\n📊 Estatísticas de remoção:`)
  console.log(`   🏢 Escritórios de contabilidade: ${removidosContabilidade}`)
  console.log(`   📵 Telefones inválidos: ${removidosTelefoneInvalido}`)
  console.log(`   🔁 Telefones duplicados: ${removidosTelefoneDuplicado}`)
  console.log(`   ❌ Não parece ser nutricionista: ${removidosNaoNutricionista}`)
  console.log(`\n✅ Contatos filtrados: ${contatosFiltrados.length}`)
  console.log(`\n📊 Estatísticas dos contatos filtrados:`)
  console.log(`   📧 Com email: ${withEmail}`)
  console.log(`   📱 Com telefone: ${withPhone}`)
  console.log(`   ✅ Com email e telefone: ${withBoth}`)
  console.log(`   👤 Com nome: ${withName}`)
  console.log(`\n📄 Arquivo gerado: ${OUTPUT_FILE}`)
  console.log(`\n✨ Lista limpa e pronta para Meta Ads!`)
}

// Executar
main()

