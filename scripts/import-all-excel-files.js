/**
 * Script para importar todos os arquivos Excel da raiz do projeto
 * e importar os dados para a conta de uma usuária específica
 * 
 * Uso: node scripts/import-all-excel-files.js <user_id> [area]
 * 
 * Exemplo:
 *   node scripts/import-all-excel-files.js 123e4567-e89b-12d3-a456-426614174000 coach
 */

const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente do Supabase não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Mapeamento de campos do sistema
const FIELD_MAPPINGS = [
  { key: 'name', label: 'Nome Completo', required: true },
  { key: 'birth_date', label: 'Data de Nascimento', required: false },
  { key: 'gender', label: 'Gênero', required: false },
  { key: 'cpf', label: 'CPF', required: false },
  { key: 'email', label: 'Email', required: false },
  { key: 'phone', label: 'Telefone', required: false },
  { key: 'instagram', label: 'Instagram', required: false },
  { key: 'address_street', label: 'Rua', required: false },
  { key: 'address_number', label: 'Número', required: false },
  { key: 'address_complement', label: 'Complemento', required: false },
  { key: 'address_neighborhood', label: 'Bairro', required: false },
  { key: 'address_city', label: 'Cidade', required: false },
  { key: 'address_state', label: 'Estado', required: false },
  { key: 'address_zipcode', label: 'CEP', required: false },
  { key: 'status', label: 'Status', required: false },
  { key: 'goal', label: 'Objetivo da Cliente', required: false },
  { key: 'first_assessment_date', label: 'Data da Primeira Avaliação', required: false },
  { key: 'weight', label: 'Peso (kg)', required: false },
  { key: 'height', label: 'Altura (m)', required: false },
  { key: 'bmi', label: 'IMC', required: false },
  { key: 'neck_circumference', label: 'Circunferência do Pescoço (cm)', required: false },
  { key: 'chest_circumference', label: 'Circunferência do Tórax (cm)', required: false },
  { key: 'waist_circumference', label: 'Circunferência da Cintura (cm)', required: false },
  { key: 'hip_circumference', label: 'Circunferência do Quadril (cm)', required: false },
  { key: 'arm_circumference', label: 'Circunferência do Braço (cm)', required: false },
  { key: 'thigh_circumference', label: 'Circunferência da Coxa (cm)', required: false },
  { key: 'triceps_skinfold', label: 'Dobra Cutânea Tríceps (mm)', required: false },
  { key: 'biceps_skinfold', label: 'Dobra Cutânea Bíceps (mm)', required: false },
  { key: 'subscapular_skinfold', label: 'Dobra Cutânea Subescapular (mm)', required: false },
  { key: 'iliac_skinfold', label: 'Dobra Cutânea Ilíaca (mm)', required: false },
  { key: 'abdominal_skinfold', label: 'Dobra Cutânea Abdominal (mm)', required: false },
  { key: 'thigh_skinfold', label: 'Dobra Cutânea Coxa (mm)', required: false },
  { key: 'body_fat_percentage', label: 'Gordura Corporal (%)', required: false },
  { key: 'muscle_mass', label: 'Massa Muscular (kg)', required: false },
  { key: 'bone_mass', label: 'Massa Óssea (kg)', required: false },
  { key: 'water_percentage', label: 'Água Corporal (%)', required: false },
  { key: 'visceral_fat', label: 'Gordura Visceral', required: false },
  { key: 'assessment_notes', label: 'Observações da Avaliação', required: false },
]

/**
 * Função para detectar coluna por padrões
 */
function detectColumn(headers, patterns) {
  for (const header of headers) {
    const normalized = header.toLowerCase().trim()
    for (const pattern of patterns) {
      if (normalized.includes(pattern.toLowerCase()) || pattern.toLowerCase().includes(normalized)) {
        return header
      }
    }
  }
  return null
}

/**
 * Função para extrair dados de um arquivo Excel
 */
function extractDataFromExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath)
    const allData = {}
    
    // Processar cada aba
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
      
      if (data.length > 0) {
        allData[sheetName] = data
      }
    })
    
    return allData
  } catch (error) {
    console.error(`❌ Erro ao ler arquivo ${filePath}:`, error.message)
    return null
  }
}

/**
 * Função para mapear dados de uma planilha para o formato do cliente
 */
function mapDataToClient(data, fileName) {
  const clientData = {
    name: null,
    email: null,
    phone: null,
    birth_date: null,
    gender: null,
    cpf: null,
    instagram: null,
    address_street: null,
    address_number: null,
    address_complement: null,
    address_neighborhood: null,
    address_city: null,
    address_state: null,
    address_zipcode: null,
    status: 'lead',
    goal: null,
    firstAssessment: null
  }
  
  // Tentar extrair nome do nome do arquivo
  const fileNameMatch = fileName.match(/([A-ZÁÉÍÓÚÇÃÊÔÕ][a-záéíóúçãêôõ]+(?:\s+[A-ZÁÉÍÓÚÇÃÊÔÕ][a-záéíóúçãêôõ]+)+)/)
  if (fileNameMatch) {
    clientData.name = fileNameMatch[1].trim()
  }
  
  // Processar cada aba
  for (const [sheetName, sheetData] of Object.entries(data)) {
    if (!sheetData || sheetData.length === 0) continue
    
    // Tentar encontrar cabeçalhos
    const firstRow = sheetData[0] || []
    const headers = firstRow.map(h => String(h || '').trim())
    
    // Procurar por dados em formato de tabela
    if (headers.length > 1 && headers[0] && headers[0].length > 0) {
      // Formato de tabela com cabeçalhos
      for (let i = 1; i < sheetData.length; i++) {
        const row = sheetData[i] || []
        if (row.length === 0) continue
        
        headers.forEach((header, idx) => {
          const value = row[idx]
          if (!value) return
          
          const normalizedHeader = header.toLowerCase()
          
          // Mapear campos
          if (normalizedHeader.includes('nome') && !clientData.name) {
            clientData.name = String(value).trim()
          } else if (normalizedHeader.includes('email') && !clientData.email) {
            clientData.email = String(value).trim()
          } else if ((normalizedHeader.includes('telefone') || normalizedHeader.includes('phone')) && !clientData.phone) {
            clientData.phone = String(value).trim()
          } else if ((normalizedHeader.includes('data') && normalizedHeader.includes('nasc')) && !clientData.birth_date) {
            clientData.birth_date = String(value).trim()
          } else if (normalizedHeader.includes('peso') && !clientData.firstAssessment) {
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.weight = parseFloat(String(value).replace(',', '.')) || null
          } else if (normalizedHeader.includes('altura') && !clientData.firstAssessment) {
            if (!clientData.firstAssessment) clientData.firstAssessment = {}
            clientData.firstAssessment.height = parseFloat(String(value).replace(',', '.')) || null
          }
        })
      }
    } else {
      // Formato de formulário (chave: valor)
      for (const row of sheetData) {
        if (!row || row.length < 2) continue
        
        const key = String(row[0] || '').toLowerCase().trim()
        const value = row[1] ? String(row[1]).trim() : ''
        
        if (!key || !value) continue
        
        if (key.includes('nome') && !clientData.name) {
          clientData.name = value
        } else if (key.includes('email') && !clientData.email) {
          clientData.email = value
        } else if (key.includes('telefone') && !clientData.phone) {
          clientData.phone = value
        } else if (key.includes('data') && key.includes('nasc')) {
          clientData.birth_date = value
        } else if (key.includes('peso')) {
          if (!clientData.firstAssessment) clientData.firstAssessment = {}
          clientData.firstAssessment.weight = parseFloat(value.replace(',', '.')) || null
        } else if (key.includes('altura')) {
          if (!clientData.firstAssessment) clientData.firstAssessment = {}
          clientData.firstAssessment.height = parseFloat(value.replace(',', '.')) || null
        }
      }
    }
  }
  
  return clientData
}

/**
 * Função principal
 */
async function main() {
  const userId = process.argv[2]
  const area = process.argv[3] || 'coach'
  
  if (!userId) {
    console.error('❌ Erro: user_id é obrigatório')
    console.log('\nUso: node scripts/import-all-excel-files.js <user_id> [area]')
    console.log('Exemplo: node scripts/import-all-excel-files.js 123e4567-e89b-12d3-a456-426614174000 coach')
    process.exit(1)
  }
  
  // Verificar se o usuário existe
  const { data: user, error: userError } = await supabase
    .from('user_profiles')
    .select('id, email, name')
    .eq('id', userId)
    .single()
  
  if (userError || !user) {
    console.error(`❌ Erro: Usuário não encontrado (${userId})`)
    process.exit(1)
  }
  
  console.log(`\n✅ Usuário encontrado: ${user.name || user.email}`)
  console.log(`📁 Procurando arquivos Excel na raiz do projeto...\n`)
  
  // Buscar todos os arquivos .xlsx na raiz
  const rootDir = path.join(__dirname, '..')
  const files = fs.readdirSync(rootDir)
    .filter(file => file.toLowerCase().endsWith('.xlsx') || file.toLowerCase().endsWith('.xls'))
    .map(file => path.join(rootDir, file))
  
  if (files.length === 0) {
    console.log('⚠️  Nenhum arquivo Excel encontrado na raiz do projeto')
    process.exit(0)
  }
  
  console.log(`📊 Encontrados ${files.length} arquivo(s) Excel:\n`)
  files.forEach((file, idx) => {
    console.log(`   ${idx + 1}. ${path.basename(file)}`)
  })
  
  console.log(`\n🔄 Processando arquivos...\n`)
  
  let totalProcessed = 0
  let totalImported = 0
  let totalErrors = 0
  
  for (const filePath of files) {
    const fileName = path.basename(filePath)
    console.log(`\n📄 Processando: ${fileName}`)
    
    try {
      // Extrair dados do Excel
      const excelData = extractDataFromExcel(filePath)
      if (!excelData) {
        console.log(`   ⚠️  Não foi possível ler o arquivo`)
        totalErrors++
        continue
      }
      
      // Mapear dados para formato do cliente
      const clientData = mapDataToClient(excelData, fileName)
      
      if (!clientData.name) {
        console.log(`   ⚠️  Nome do cliente não encontrado, pulando...`)
        totalErrors++
        continue
      }
      
      console.log(`   👤 Cliente: ${clientData.name}`)
      if (clientData.email) console.log(`   📧 Email: ${clientData.email}`)
      if (clientData.phone) console.log(`   📱 Telefone: ${clientData.phone}`)
      
      // Verificar se já existe (por email ou nome)
      let existingClient = null
      if (clientData.email) {
        const { data } = await supabase
          .from('clients')
          .select('id, name')
          .eq('user_id', userId)
          .eq('email', clientData.email)
          .single()
        existingClient = data
      }
      
      if (!existingClient && clientData.name) {
        const { data } = await supabase
          .from('clients')
          .select('id, name')
          .eq('user_id', userId)
          .ilike('name', clientData.name)
          .limit(1)
          .single()
        existingClient = data
      }
      
      if (existingClient) {
        console.log(`   ⚠️  Cliente já existe: ${existingClient.name} (ID: ${existingClient.id})`)
        totalProcessed++
        continue
      }
      
      // Preparar dados para inserção
      const insertData = {
        user_id: userId,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        birth_date: clientData.birth_date || null,
        gender: clientData.gender || null,
        cpf: clientData.cpf || null,
        instagram: clientData.instagram || null,
        address_street: clientData.address_street || null,
        address_number: clientData.address_number || null,
        address_complement: clientData.address_complement || null,
        address_neighborhood: clientData.address_neighborhood || null,
        address_city: clientData.address_city || null,
        address_state: clientData.address_state || null,
        address_zipcode: clientData.address_zipcode || null,
        status: clientData.status || 'lead',
        goal: clientData.goal || null,
      }
      
      // Inserir cliente
      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert(insertData)
        .select()
        .single()
      
      if (insertError) {
        console.log(`   ❌ Erro ao inserir: ${insertError.message}`)
        totalErrors++
        continue
      }
      
      console.log(`   ✅ Cliente criado: ${newClient.name} (ID: ${newClient.id})`)
      totalImported++
      
      // Criar primeira avaliação se houver dados
      if (clientData.firstAssessment && Object.keys(clientData.firstAssessment).length > 0) {
        const assessmentData = {
          client_id: newClient.id,
          user_id: userId,
          assessment_type: 'antropometrica',
          assessment_name: 'Avaliação Inicial',
          is_reevaluation: false,
          assessment_number: 1,
          data: clientData.firstAssessment,
          status: 'completo',
          completed_at: clientData.first_assessment_date || new Date().toISOString(),
        }
        
        const { error: assessmentError } = await supabase
          .from('assessments')
          .insert(assessmentData)
        
        if (!assessmentError) {
          console.log(`   📊 Primeira avaliação criada`)
        }
      }
      
      totalProcessed++
      
    } catch (error) {
      console.log(`   ❌ Erro ao processar: ${error.message}`)
      totalErrors++
    }
  }
  
  console.log(`\n\n📊 Resumo:`)
  console.log(`   ✅ Processados: ${totalProcessed}`)
  console.log(`   ✅ Importados: ${totalImported}`)
  console.log(`   ❌ Erros: ${totalErrors}`)
  console.log(`\n✅ Concluído!\n`)
}

// Executar
main().catch(console.error)

