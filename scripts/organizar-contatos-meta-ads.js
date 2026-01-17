/**
 * Script para organizar contatos de nutricionistas de múltiplos arquivos Excel
 * e exportar em formato adequado para upload no Meta Ads (Facebook/Instagram)
 * 
 * Uso: node scripts/organizar-contatos-meta-ads.js [pasta-com-excel]
 */

const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

// Configurações
const DEFAULT_INPUT_FOLDER = path.join(__dirname, '../contatos-nutricionistas')
const OUTPUT_FILE = path.join(__dirname, '../contatos-meta-ads.csv')

/**
 * Valida email
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim().toLowerCase())
}

/**
 * Limpa telefone (remove caracteres não numéricos)
 */
function cleanPhone(phone) {
  if (!phone || typeof phone !== 'string') return ''
  return phone.replace(/\D/g, '')
}

/**
 * Formata telefone para E.164 (formato internacional usado pelo Meta)
 * Exemplo: +5511999999999
 */
function formatPhoneE164(phone) {
  const cleaned = cleanPhone(phone)
  
  if (!cleaned || cleaned.length < 10) return null
  
  // Se já começa com +, retornar como está (assumindo formato correto)
  if (phone.trim().startsWith('+')) {
    return phone.trim()
  }
  
  // Telefone brasileiro
  if (cleaned.length === 11 && cleaned.startsWith('55')) {
    // Já tem código do país
    return `+${cleaned}`
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    // Remove o 0 inicial e adiciona código do país
    return `+55${cleaned.slice(1)}`
  } else if (cleaned.length === 11) {
    // Telefone com DDD (11 dígitos: DDD + número)
    return `+55${cleaned}`
  } else if (cleaned.length === 10) {
    // Telefone fixo com DDD (10 dígitos)
    return `+55${cleaned}`
  } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
    // Já está no formato E.164
    return `+${cleaned}`
  }
  
  // Se não conseguir formatar, retornar null
  return null
}

/**
 * Normaliza nome (remove espaços extras, capitaliza)
 */
function normalizeName(name) {
  if (!name || typeof name !== 'string') return ''
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Detecta colunas relevantes em uma planilha
 */
function detectColumns(headers) {
  const columns = {
    name: null,
    email: null,
    phone: null,
  }
  
  const namePatterns = ['nome', 'name', 'contato', 'cliente', 'paciente', 'nutricionista']
  const emailPatterns = ['email', 'e-mail', 'mail', 'correio']
  const phonePatterns = ['telefone', 'phone', 'celular', 'whatsapp', 'tel', 'fone', 'contato']
  
  headers.forEach((header, index) => {
    if (!header) return
    
    const normalized = String(header).toLowerCase().trim()
    
    // Detectar nome
    if (!columns.name && namePatterns.some(pattern => normalized.includes(pattern))) {
      columns.name = index
    }
    
    // Detectar email
    if (!columns.email && emailPatterns.some(pattern => normalized.includes(pattern))) {
      columns.email = index
    }
    
    // Detectar telefone
    if (!columns.phone && phonePatterns.some(pattern => normalized.includes(pattern))) {
      columns.phone = index
    }
  })
  
  return columns
}

/**
 * Extrai dados de um arquivo Excel
 */
function extractDataFromExcel(filePath) {
  try {
    console.log(`\n📄 Processando: ${path.basename(filePath)}`)
    
    const workbook = XLSX.readFile(filePath)
    
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      console.log(`   ⚠️  Arquivo não contém planilhas`)
      return []
    }
    
    const contacts = []
    
    // Processar todas as planilhas
    workbook.SheetNames.forEach((sheetName, sheetIndex) => {
      const worksheet = workbook.Sheets[sheetName]
      
      if (!worksheet) return
      
      // Converter para JSON (array de arrays)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1, 
        defval: '',
        blankrows: false
      })
      
      if (jsonData.length === 0) return
      
      // Encontrar linha de cabeçalho (primeira linha com mais dados)
      let headerRowIndex = 0
      let maxColumns = 0
      
      for (let i = 0; i < Math.min(10, jsonData.length); i++) {
        const row = jsonData[i] || []
        const nonEmptyCount = row.filter(cell => cell && String(cell).trim()).length
        if (nonEmptyCount > maxColumns) {
          maxColumns = nonEmptyCount
          headerRowIndex = i
        }
      }
      
      const headers = jsonData[headerRowIndex] || []
      const columns = detectColumns(headers)
      
      console.log(`   📋 Planilha "${sheetName}": ${jsonData.length - headerRowIndex - 1} linhas`)
      console.log(`   🔍 Colunas detectadas:`, {
        nome: columns.name !== null ? headers[columns.name] : 'não encontrado',
        email: columns.email !== null ? headers[columns.email] : 'não encontrado',
        telefone: columns.phone !== null ? headers[columns.phone] : 'não encontrado',
      })
      
      // Processar linhas de dados
      for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
        const row = jsonData[i] || []
        
        const contact = {
          name: '',
          email: '',
          phone: '',
          sourceFile: path.basename(filePath),
          sourceSheet: sheetName,
          rowNumber: i + 1,
        }
        
        // Extrair nome
        if (columns.name !== null && row[columns.name]) {
          contact.name = normalizeName(String(row[columns.name]))
        }
        
        // Extrair email
        if (columns.email !== null && row[columns.email]) {
          const email = String(row[columns.email]).trim().toLowerCase()
          if (isValidEmail(email)) {
            contact.email = email
          }
        }
        
        // Extrair telefone
        if (columns.phone !== null && row[columns.phone]) {
          const phoneE164 = formatPhoneE164(String(row[columns.phone]))
          if (phoneE164) {
            contact.phone = phoneE164
          }
        }
        
        // Só adicionar se tiver pelo menos email ou telefone válido
        if (contact.email || contact.phone) {
          contacts.push(contact)
        }
      }
    })
    
    console.log(`   ✅ ${contacts.length} contatos extraídos`)
    return contacts
    
  } catch (error) {
    console.error(`   ❌ Erro ao processar arquivo: ${error.message}`)
    return []
  }
}

/**
 * Remove duplicatas baseado em email ou telefone
 */
function removeDuplicates(contacts) {
  const seen = new Map()
  const unique = []
  let duplicates = 0
  
  contacts.forEach(contact => {
    const key = contact.email || contact.phone
    
    if (!key) {
      // Contato sem email nem telefone válido - pular
      return
    }
    
    if (seen.has(key)) {
      duplicates++
      // Se o contato atual tem mais informações, substituir
      const existing = seen.get(key)
      if (contact.name && !existing.name) {
        existing.name = contact.name
      }
      if (contact.email && !existing.email) {
        existing.email = contact.email
      }
      if (contact.phone && !existing.phone) {
        existing.phone = contact.phone
      }
    } else {
      seen.set(key, contact)
      unique.push(contact)
    }
  })
  
  console.log(`\n🔄 Removidas ${duplicates} duplicatas`)
  return unique
}

/**
 * Gera CSV no formato do Meta Ads
 */
function generateMetaAdsCSV(contacts) {
  // Cabeçalho do CSV (formato Meta Ads)
  const headers = ['Email', 'Nome', 'Telefone']
  const rows = [headers]
  
  contacts.forEach(contact => {
    const row = [
      contact.email || '',
      contact.name || '',
      contact.phone || '',
    ]
    rows.push(row)
  })
  
  // Converter para CSV
  const csvContent = rows.map(row => {
    return row.map(cell => {
      // Escapar aspas e envolver em aspas se necessário
      const cellStr = String(cell || '')
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`
      }
      return cellStr
    }).join(',')
  }).join('\n')
  
  return csvContent
}

/**
 * Função principal
 */
function main() {
  const inputFolder = process.argv[2] || DEFAULT_INPUT_FOLDER
  const projectRoot = path.join(__dirname, '..')
  
  console.log('🚀 Organizador de Contatos para Meta Ads')
  console.log('=' .repeat(50))
  
  // Criar pasta se não existir
  if (!fs.existsSync(inputFolder)) {
    console.log(`\n📁 Criando pasta: ${inputFolder}`)
    fs.mkdirSync(inputFolder, { recursive: true })
    console.log(`✅ Pasta criada!`)
    console.log(`\n💡 Coloque seus arquivos Excel (.xlsx ou .xls) nesta pasta e execute o script novamente.`)
    console.log(`   Pasta: ${inputFolder}`)
    process.exit(0)
  }
  
  console.log(`📁 Pasta de entrada: ${inputFolder}`)
  console.log(`📄 Arquivo de saída: ${OUTPUT_FILE}`)
  
  // Buscar arquivos Excel na pasta especificada
  let files = []
  
  if (fs.existsSync(inputFolder)) {
    files = fs.readdirSync(inputFolder)
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ext === '.xlsx' || ext === '.xls'
      })
      .map(file => path.join(inputFolder, file))
  }
  
  // Se não encontrou arquivos na pasta, procurar na raiz do projeto também
  if (files.length === 0) {
    console.log(`\n⚠️  Nenhum arquivo Excel encontrado em: ${inputFolder}`)
    console.log(`🔍 Procurando arquivos Excel na raiz do projeto...`)
    
    const rootFiles = fs.readdirSync(projectRoot)
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ext === '.xlsx' || ext === '.xls'
      })
      .map(file => path.join(projectRoot, file))
    
    if (rootFiles.length > 0) {
      console.log(`✅ Encontrados ${rootFiles.length} arquivo(s) Excel na raiz do projeto`)
      files = rootFiles
    }
  }
  
  if (files.length === 0) {
    console.error(`\n❌ Erro: Nenhum arquivo Excel encontrado!`)
    console.log(`\n💡 Instruções:`)
    console.log(`   1. Coloque seus arquivos Excel (.xlsx ou .xls) em uma das opções:`)
    console.log(`      - Pasta: ${inputFolder}`)
    console.log(`      - Raiz do projeto: ${projectRoot}`)
    console.log(`   2. Ou especifique uma pasta customizada:`)
    console.log(`      node scripts/organizar-contatos-meta-ads.js /caminho/para/sua/pasta`)
    process.exit(1)
  }
  
  console.log(`\n📊 Encontrados ${files.length} arquivo(s) Excel`)
  
  // Processar todos os arquivos
  let allContacts = []
  
  files.forEach(file => {
    const contacts = extractDataFromExcel(file)
    allContacts = allContacts.concat(contacts)
  })
  
  console.log(`\n📈 Total de contatos extraídos: ${allContacts.length}`)
  
  // Remover duplicatas
  const uniqueContacts = removeDuplicates(allContacts)
  
  console.log(`\n✅ Contatos únicos: ${uniqueContacts.length}`)
  
  // Estatísticas
  const withEmail = uniqueContacts.filter(c => c.email).length
  const withPhone = uniqueContacts.filter(c => c.phone).length
  const withBoth = uniqueContacts.filter(c => c.email && c.phone).length
  const withName = uniqueContacts.filter(c => c.name).length
  
  console.log(`\n📊 Estatísticas:`)
  console.log(`   📧 Com email: ${withEmail}`)
  console.log(`   📱 Com telefone: ${withPhone}`)
  console.log(`   ✅ Com email e telefone: ${withBoth}`)
  console.log(`   👤 Com nome: ${withName}`)
  
  // Gerar CSV
  const csvContent = generateMetaAdsCSV(uniqueContacts)
  
  // Salvar arquivo
  fs.writeFileSync(OUTPUT_FILE, csvContent, 'utf-8')
  
  console.log(`\n✅ Arquivo gerado com sucesso: ${OUTPUT_FILE}`)
  console.log(`\n📋 Próximos passos:`)
  console.log(`   1. Abra o Meta Business Suite`)
  console.log(`   2. Vá em Públicos > Criar público personalizado`)
  console.log(`   3. Selecione "Arquivo de clientes"`)
  console.log(`   4. Faça upload do arquivo: ${path.basename(OUTPUT_FILE)}`)
  console.log(`   5. Mapeie as colunas: Email, Nome, Telefone`)
  console.log(`\n✨ Pronto para usar nos anúncios!`)
}

// Executar
main()

