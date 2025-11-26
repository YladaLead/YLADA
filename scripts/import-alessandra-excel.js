/**
 * Script para importar dados do arquivo Excel da Alessandra
 * para a conta demo do Coach
 */

const XLSX = require('xlsx')
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

// Buscar User ID da conta demo do Coach dinamicamente
async function getCoachDemoUserId() {
  // Buscar diretamente em auth.users
  const { data: users, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error('❌ Erro ao buscar usuários:', error.message)
    return null
  }
  
  const coachUser = users.users.find(u => u.email === 'demo.coach@ylada.com')
  
  if (!coachUser) {
    console.error('❌ Usuário demo.coach@ylada.com não encontrado em auth.users')
    return null
  }
  
  return coachUser.id
}

/**
 * Função para extrair valor de uma célula específica
 */
function findValueInSheet(sheetData, searchKey, columnOffset = 0) {
  for (const row of sheetData) {
    if (!row || row.length === 0) continue
    
    const key = String(row[0] || '').toLowerCase().trim()
    const searchLower = searchKey.toLowerCase()
    
    if (key.includes(searchLower)) {
      const value = row[1 + columnOffset] || row[columnOffset]
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        return String(value).trim()
      }
    }
  }
  return null
}

/**
 * Função para extrair valor após dois pontos
 */
function extractAfterColon(text) {
  if (!text) return null
  const match = String(text).match(/:\s*(.+)/)
  return match ? match[1].trim() : null
}

/**
 * Função para parsear data brasileira
 */
function parseBrazilianDate(dateStr) {
  if (!dateStr) return null
  const match = String(dateStr).match(/(\d{2})\/(\d{2})\/(\d{4})/)
  if (match) {
    const [, day, month, year] = match
    return `${year}-${month}-${day}`
  }
  return null
}

/**
 * Função para extrair número de string
 */
function extractNumber(text, unit = '') {
  if (!text) return null
  const cleaned = String(text)
    .replace(/,/g, '.')
    .replace(new RegExp(unit, 'gi'), '')
    .replace(/[^\d.]/g, '')
    .trim()
  const num = parseFloat(cleaned)
  return isNaN(num) || num <= 0 ? null : num
}

/**
 * Função para extrair dados de todas as abas
 */
function extractClientData(workbook) {
  const clientData = {
    name: null,
    email: null,
    phone: null,
    birth_date: null,
    gender: null,
    cpf: null,
    instagram: null,
    goal: null,
    status: 'ativa',
    address_street: null,
    address_neighborhood: null,
    address_city: null,
    firstAssessment: {},
    currentWeight: null, // Peso atual para evolução
    evolutionData: {} // Dados para evolução física
  }
  
  // Processar cada aba
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
    
    if (data.length === 0) return
    
    console.log(`\n📋 Processando aba: ${sheetName}`)
    
    // Aba FICHA ou FICHA NOVA - Dados pessoais
    if (sheetName.includes('FICHA')) {
      // Processar linha por linha procurando padrões
      for (const row of data) {
        if (!row || row.length === 0) continue
        
        const firstCell = String(row[0] || '').trim()
        const secondCell = row[1] ? String(row[1]).trim() : ''
        
        // Nome
        if (firstCell.includes('NOME:') && !clientData.name) {
          clientData.name = extractAfterColon(firstCell) || secondCell || null
        }
        
        // Email
        if (firstCell.includes('EMAIL:') && !clientData.email) {
          const email = extractAfterColon(firstCell) || secondCell
          if (email && email !== 'EMAIL:' && email.includes('@')) {
            clientData.email = email
          }
        }
        
        // Telefone
        if (firstCell.includes('TELEFONE:') && !clientData.phone) {
          const phone = extractAfterColon(firstCell) || secondCell
          if (phone && phone !== 'TELEFONE:') {
            clientData.phone = phone
          }
        }
        
        // Instagram
        if (firstCell.includes('INSTAGRAM:') && !clientData.instagram) {
          const instagram = extractAfterColon(firstCell) || secondCell
          if (instagram && instagram !== 'INSTAGRAM:') {
            clientData.instagram = instagram
          }
        }
        
        // Data de Nascimento
        if (firstCell.includes('DATA DE NASCIMENTO:') || firstCell.includes('DATA DE NASC')) {
          const dateStr = extractAfterColon(firstCell) || secondCell
          if (dateStr) {
            const parsedDate = parseBrazilianDate(dateStr)
            if (parsedDate) clientData.birth_date = parsedDate
          }
        }
        
        // CPF
        if (firstCell.includes('CPF:') && !clientData.cpf) {
          const cpf = extractAfterColon(firstCell) || secondCell
          if (cpf && cpf !== 'CPF:') {
            clientData.cpf = cpf.replace(/[^\d]/g, '')
          }
        }
        
        // Endereço
        if (firstCell.includes('ENDEREÇO:') || firstCell.includes('ENDEREÇO')) {
          const address = extractAfterColon(firstCell) || secondCell
          if (address && address !== 'ENDEREÇO:') {
            // Tentar separar endereço
            const parts = address.split(',').map(p => p.trim())
            if (parts.length > 0) clientData.address_street = parts[0]
            if (parts.length > 1) clientData.address_neighborhood = parts[1]
            if (parts.length > 2) clientData.address_city = parts[2]
          }
        }
        
        // Objetivo/Meta
        if ((firstCell.includes('OBJETIVO') || firstCell.includes('META') || firstCell.includes('ALÉM DO PESO')) && !clientData.goal) {
          const goal = extractAfterColon(firstCell) || secondCell
          if (goal && goal.length > 5) {
            clientData.goal = goal.substring(0, 500) // Limitar tamanho
          }
        }
      }
    }
    
    // Aba REAVALIACAO - Dados de avaliação
    if (sheetName.includes('REAVALIACAO') || sheetName.includes('REAVALIAÇÃO')) {
      for (let i = 0; i < data.length; i++) {
        const row = data[i] || []
        if (row.length === 0) continue
        
        const firstCell = String(row[0] || '').trim()
        const secondCell = row[1] ? String(row[1]).trim() : ''
        const thirdCell = row[2] ? String(row[2]).trim() : ''
        const combined = `${firstCell} ${secondCell} ${thirdCell}`.toLowerCase()
        
        // Altura - pode estar em qualquer coluna
        if (combined.includes('altura') && !clientData.firstAssessment.height) {
          // Procurar número que parece altura (1.5 a 2.5)
          const alturaMatch = combined.match(/(\d+[,.]?\d*)\s*m/i) || combined.match(/altura[:\s]*(\d+[,.]?\d*)/i)
          if (alturaMatch) {
            const alturaValue = extractNumber(alturaMatch[1], 'm')
            if (alturaValue && alturaValue >= 1.0 && alturaValue <= 2.5) {
              clientData.firstAssessment.height = alturaValue
            }
          } else {
            // Tentar extrair de qualquer coluna
            for (let j = 0; j < row.length; j++) {
              const cell = String(row[j] || '').trim()
              const alturaValue = extractNumber(cell, 'm')
              if (alturaValue && alturaValue >= 1.0 && alturaValue <= 2.5) {
                clientData.firstAssessment.height = alturaValue
                break
              }
            }
          }
        }
        
        // Peso Inicial
        if (combined.includes('peso inicial') && !clientData.firstAssessment.weight) {
          const pesoMatch = combined.match(/peso\s+inicial[:\s]*(\d+[,.]?\d*)/i)
          if (pesoMatch) {
            const pesoValue = extractNumber(pesoMatch[1], 'kg')
            if (pesoValue) clientData.firstAssessment.weight = pesoValue
          } else {
            // Procurar número que parece peso (30 a 300 kg)
            for (let j = 0; j < row.length; j++) {
              const cell = String(row[j] || '').trim()
              const pesoValue = extractNumber(cell, 'kg')
              if (pesoValue && pesoValue >= 30 && pesoValue <= 300) {
                clientData.firstAssessment.weight = pesoValue
                break
              }
            }
          }
        }
        
        // Peso Atual / Último Peso
        if (combined.includes('último peso') || combined.includes('ultimo peso')) {
          const pesoMatch = combined.match(/último\s+peso[:\s]*(\d+[,.]?\d*)/i) || combined.match(/ultimo\s+peso[:\s]*(\d+[,.]?\d*)/i)
          if (pesoMatch) {
            const pesoValue = extractNumber(pesoMatch[1], 'kg')
            if (pesoValue) {
              // Guardar como peso atual para evolução
              clientData.currentWeight = pesoValue
              // Se não tiver peso inicial, usar este
              if (!clientData.firstAssessment.weight) {
                clientData.firstAssessment.weight = pesoValue
              }
            }
          } else {
            // Procurar na linha seguinte (linha 13 tem "89.5kg")
            if (i + 1 < data.length) {
              const nextRow = data[i + 1] || []
              for (let j = 0; j < nextRow.length; j++) {
                const cell = String(nextRow[j] || '').trim()
                const pesoValue = extractNumber(cell, 'kg')
                if (pesoValue && pesoValue >= 30 && pesoValue <= 300) {
                  clientData.currentWeight = pesoValue
                  if (!clientData.firstAssessment.weight) {
                    clientData.firstAssessment.weight = pesoValue
                  }
                  break
                }
              }
            }
          }
        }
        
        // Meta
        if (combined.includes('meta:') && !clientData.goal) {
          const meta = extractAfterColon(firstCell) || secondCell || thirdCell
          if (meta && meta.length > 2) {
            clientData.goal = `Meta: ${meta.substring(0, 200)}`
          }
        }
      }
      
      // Se não encontrou altura/peso nas células com texto, procurar em todas as células
      if (!clientData.firstAssessment.height || !clientData.firstAssessment.weight) {
        for (const row of data) {
          if (!row || row.length === 0) continue
          for (let j = 0; j < row.length; j++) {
            const cell = String(row[j] || '').trim()
            
            // Altura (1.0 a 2.5)
            if (!clientData.firstAssessment.height) {
              const alturaValue = extractNumber(cell, 'm')
              if (alturaValue && alturaValue >= 1.0 && alturaValue <= 2.5) {
                clientData.firstAssessment.height = alturaValue
              }
            }
            
            // Peso (30 a 300 kg)
            if (!clientData.firstAssessment.weight) {
              const pesoValue = extractNumber(cell, 'kg')
              if (pesoValue && pesoValue >= 30 && pesoValue <= 300) {
                clientData.firstAssessment.weight = pesoValue
              }
            }
          }
        }
      }
    }
    
    // Aba Biopedancia - Dados de bioimpedância
    if (sheetName.includes('Biopedancia') || sheetName.includes('BIO')) {
      const gordura = findValueInSheet(data, 'gordura')
      if (gordura) {
        const gorduraValue = parseFloat(String(gordura).replace(',', '.').replace('%', '').trim())
        if (gorduraValue && gorduraValue > 0) {
          clientData.firstAssessment.body_fat_percentage = gorduraValue
        }
      }
      
      const massaMuscular = findValueInSheet(data, 'massa muscular')
      if (massaMuscular) {
        const massaValue = parseFloat(String(massaMuscular).replace(',', '.').replace('kg', '').trim())
        if (massaValue && massaValue > 0) {
          clientData.firstAssessment.muscle_mass = massaValue
        }
      }
      
      const agua = findValueInSheet(data, 'água') || findValueInSheet(data, 'agua')
      if (agua) {
        const aguaValue = parseFloat(String(agua).replace(',', '.').replace('%', '').trim())
        if (aguaValue && aguaValue > 0) {
          clientData.firstAssessment.water_percentage = aguaValue
        }
      }
    }
    
    // Aba Medidas - Medidas corporais
    if (sheetName.includes('Medidas')) {
      // Procurar por tabela de medidas
      for (let i = 1; i < data.length; i++) {
        const row = data[i] || []
        if (row.length < 3) continue
        
        // Tentar identificar colunas pelo cabeçalho
        const headerRow = data[1] || []
        const headerMap = {}
        headerRow.forEach((header, idx) => {
          const h = String(header || '').toLowerCase()
          if (h.includes('peso')) headerMap.peso = idx
          if (h.includes('cintura')) headerMap.cintura = idx
          if (h.includes('quadril')) headerMap.quadril = idx
          if (h.includes('busto')) headerMap.busto = idx
          if (h.includes('estomago') || h.includes('estômago')) headerMap.estomago = idx
          if (h.includes('barriga')) headerMap.barriga = idx
          if (h.includes('culote')) headerMap.culote = idx
          if (h.includes('coxa')) headerMap.coxa = idx
          if (h.includes('braço') || h.includes('braco')) headerMap.braco = idx
        })
        
        // Extrair valores se houver dados na linha
        if (row.length > 1) {
          if (headerMap.peso !== undefined && row[headerMap.peso]) {
            const pesoValue = extractNumber(String(row[headerMap.peso]), 'kg')
            if (pesoValue && pesoValue > 0 && !clientData.firstAssessment.weight) {
              clientData.firstAssessment.weight = pesoValue
            }
          }
          
          if (headerMap.cintura !== undefined && row[headerMap.cintura]) {
            const cinturaValue = extractNumber(String(row[headerMap.cintura]), 'cm')
            if (cinturaValue && cinturaValue > 0) {
              clientData.firstAssessment.waist_circumference = cinturaValue
            }
          }
          
          if (headerMap.quadril !== undefined && row[headerMap.quadril]) {
            const quadrilValue = extractNumber(String(row[headerMap.quadril]), 'cm')
            if (quadrilValue && quadrilValue > 0) {
              clientData.firstAssessment.hip_circumference = quadrilValue
            }
          }
        }
      }
    }
    
    // Aba PESO A DISTANCIA - Peso atual
    if (sheetName.includes('PESO') && sheetName.includes('DISTANCIA')) {
      for (const row of data) {
        if (!row || row.length === 0) continue
        for (let j = 0; j < row.length; j++) {
          const cell = String(row[j] || '').trim()
          const pesoValue = extractNumber(cell, 'kg')
          if (pesoValue && pesoValue >= 30 && pesoValue <= 300) {
            // Se não tiver peso na avaliação inicial, usar este
            if (!clientData.firstAssessment.weight) {
              clientData.firstAssessment.weight = pesoValue
            }
            // Guardar peso atual para evolução
            if (!clientData.currentWeight) {
              clientData.currentWeight = pesoValue
            }
          }
        }
      }
    }
  })
  
  // Se não encontrou nome, tentar extrair do nome do arquivo
  if (!clientData.name) {
    const fileNameMatch = path.basename(process.argv[2] || '').match(/([A-ZÁÉÍÓÚÇÃÊÔÕ][a-záéíóúçãêôõ]+(?:\s+[A-ZÁÉÍÓÚÇÃÊÔÕ][a-záéíóúçãêôõ]+)+)/)
    if (fileNameMatch) {
      clientData.name = fileNameMatch[1].trim()
    }
  }
  
  // Calcular IMC se tiver peso e altura
  if (clientData.firstAssessment.weight && clientData.firstAssessment.height) {
    const bmi = clientData.firstAssessment.weight / (clientData.firstAssessment.height * clientData.firstAssessment.height)
    clientData.firstAssessment.bmi = parseFloat(bmi.toFixed(2))
  }
  
  return clientData
}

/**
 * Função principal
 */
async function main() {
  const filePath = process.argv[2] || path.join(__dirname, '..', 'Cópia de ALESSANDRA OLIVEIRA CANADÁ.xlsx')
  
  // Buscar user_id da conta demo
  const COACH_DEMO_USER_ID = await getCoachDemoUserId()
  if (!COACH_DEMO_USER_ID) {
    console.error('❌ Não foi possível encontrar a conta demo do Coach')
    process.exit(1)
  }
  
  console.log('\n🚀 Importando dados da Alessandra para conta demo do Coach\n')
  console.log(`📄 Arquivo: ${path.basename(filePath)}`)
  console.log(`👤 Conta: demo.coach@ylada.com (${COACH_DEMO_USER_ID})\n`)
  
  try {
    // Ler arquivo Excel
    console.log('📖 Lendo arquivo Excel...')
    const workbook = XLSX.readFile(filePath)
    console.log(`✅ Arquivo lido. Abas encontradas: ${workbook.SheetNames.join(', ')}`)
    
    // Extrair dados
    console.log('\n🔍 Extraindo dados das abas...')
    const clientData = extractClientData(workbook)
    
    console.log('\n📊 Dados extraídos:')
    console.log(`   Nome: ${clientData.name || 'Não encontrado'}`)
    console.log(`   Email: ${clientData.email || 'Não encontrado'}`)
    console.log(`   Telefone: ${clientData.phone || 'Não encontrado'}`)
    console.log(`   Data de Nascimento: ${clientData.birth_date || 'Não encontrada'}`)
    console.log(`   Objetivo: ${clientData.goal || 'Não encontrado'}`)
    console.log(`   Avaliação:`)
    if (Object.keys(clientData.firstAssessment).length > 0) {
      Object.entries(clientData.firstAssessment).forEach(([key, value]) => {
        console.log(`     - ${key}: ${value}`)
      })
    } else {
      console.log(`     Nenhuma medida encontrada`)
    }
    
    if (!clientData.name) {
      console.log('\n❌ Erro: Nome do cliente não encontrado')
      process.exit(1)
    }
    
    // Limpar nome (remover "NOME:" se presente)
    if (clientData.name && clientData.name.includes('NOME:')) {
      clientData.name = clientData.name.replace(/NOME:\s*/i, '').trim()
    }
    
    // Verificar se cliente já existe
    console.log('\n🔍 Verificando se cliente já existe...')
    let existingClient = null
    
    if (clientData.email && clientData.email !== 'EMAIL:') {
      const { data } = await supabase
        .from('clients')
        .select('id, name, email')
        .eq('user_id', COACH_DEMO_USER_ID)
        .eq('email', clientData.email)
        .single()
      existingClient = data
    }
    
    if (!existingClient && clientData.name) {
      const firstName = clientData.name.split(' ')[0]
      const { data } = await supabase
        .from('clients')
        .select('id, name, email')
        .eq('user_id', COACH_DEMO_USER_ID)
        .ilike('name', `%${firstName}%`)
        .limit(1)
        .single()
      existingClient = data
    }
    
    let clientId
    let clientName
    
    if (existingClient) {
      console.log(`⚠️  Cliente já existe: ${existingClient.name} (ID: ${existingClient.id})`)
      console.log('   Atualizando dados...')
      
      // Atualizar cliente existente
      const updateData = {}
      if (clientData.email && clientData.email !== 'EMAIL:') updateData.email = clientData.email
      if (clientData.phone && clientData.phone !== 'TELEFONE:') updateData.phone = clientData.phone
      if (clientData.birth_date) updateData.birth_date = clientData.birth_date
      if (clientData.gender) updateData.gender = clientData.gender
      if (clientData.cpf) updateData.cpf = clientData.cpf
      if (clientData.instagram) updateData.instagram = clientData.instagram
      if (clientData.goal) updateData.goal = clientData.goal
      if (clientData.address_street) updateData.address_street = clientData.address_street
      if (clientData.address_neighborhood) updateData.address_neighborhood = clientData.address_neighborhood
      if (clientData.address_city) updateData.address_city = clientData.address_city
      
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('clients')
          .update(updateData)
          .eq('id', existingClient.id)
        
        if (updateError) {
          console.error('⚠️  Erro ao atualizar cliente:', updateError.message)
        } else {
          console.log('✅ Dados do cliente atualizados')
        }
      }
      
      clientId = existingClient.id
      clientName = existingClient.name
    } else {
      // Criar cliente
      console.log('\n💾 Criando cliente no banco de dados...')
      const insertData = {
        user_id: COACH_DEMO_USER_ID,
        name: clientData.name,
        email: clientData.email && clientData.email !== 'EMAIL:' ? clientData.email : null,
        phone: clientData.phone && clientData.phone !== 'TELEFONE:' ? clientData.phone : null,
        birth_date: clientData.birth_date,
        gender: clientData.gender,
        cpf: clientData.cpf,
        instagram: clientData.instagram,
        status: clientData.status || 'ativa',
        goal: clientData.goal,
        address_street: clientData.address_street,
        address_neighborhood: clientData.address_neighborhood,
        address_city: clientData.address_city,
      }
      
      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert(insertData)
        .select()
        .single()
      
      if (insertError) {
        console.error('❌ Erro ao criar cliente:', insertError.message)
        process.exit(1)
      }
      
      console.log(`✅ Cliente criado: ${newClient.name} (ID: ${newClient.id})`)
      clientId = newClient.id
      clientName = newClient.name
    }
    
    // Verificar se já existe avaliação inicial
    const { data: existingAssessment } = await supabase
      .from('assessments')
      .select('id')
      .eq('client_id', clientId)
      .eq('assessment_number', 1)
      .eq('is_reevaluation', false)
      .single()
    
    // Criar evolução física se houver peso atual diferente do inicial
    if (clientData.currentWeight && clientData.firstAssessment.weight && 
        Math.abs(clientData.currentWeight - clientData.firstAssessment.weight) > 0.1) {
      console.log('\n💾 Criando evolução física...')
      
      const evolutionData = {
        client_id: clientId,
        user_id: COACH_DEMO_USER_ID,
        measurement_date: new Date().toISOString(),
        weight: clientData.currentWeight,
        height: clientData.firstAssessment.height || null,
        bmi: clientData.firstAssessment.height ? 
          parseFloat((clientData.currentWeight / (clientData.firstAssessment.height * clientData.firstAssessment.height)).toFixed(2)) : null,
        waist_circumference: clientData.firstAssessment.waist_circumference || null,
        hip_circumference: clientData.firstAssessment.hip_circumference || null,
        notes: 'Importado via Excel - Peso atual'
      }
      
      const { data: evolution, error: evolutionError } = await supabase
        .from('client_evolution')
        .insert(evolutionData)
        .select()
        .single()
      
      if (evolutionError) {
        console.error('⚠️  Erro ao criar evolução:', evolutionError.message)
      } else {
        console.log(`✅ Evolução física criada (ID: ${evolution.id})`)
      }
    }
    
    // Criar ou atualizar primeira avaliação se houver dados
    if (Object.keys(clientData.firstAssessment).length > 0) {
      if (existingAssessment) {
        console.log('\n💾 Atualizando avaliação inicial existente...')
        
        const { error: updateError } = await supabase
          .from('assessments')
          .update({
            data: clientData.firstAssessment,
            status: 'completo',
          })
          .eq('id', existingAssessment.id)
        
        if (updateError) {
          console.error('⚠️  Erro ao atualizar avaliação:', updateError.message)
        } else {
          console.log(`✅ Avaliação atualizada (ID: ${existingAssessment.id})`)
        }
      } else {
        console.log('\n💾 Criando primeira avaliação...')
        
        const assessmentData = {
          client_id: clientId,
          user_id: COACH_DEMO_USER_ID,
          assessment_type: 'antropometrica',
          assessment_name: 'Avaliação Inicial',
          is_reevaluation: false,
          assessment_number: 1,
          data: clientData.firstAssessment,
          status: 'completo',
          completed_at: new Date().toISOString(),
        }
        
        const { data: assessment, error: assessmentError } = await supabase
          .from('assessments')
          .insert(assessmentData)
          .select()
          .single()
        
        if (assessmentError) {
          console.error('⚠️  Erro ao criar avaliação:', assessmentError.message)
        } else {
          console.log(`✅ Avaliação criada (ID: ${assessment.id})`)
        }
      }
    }
    
    // Criar evento no histórico apenas se for novo cliente
    if (!existingClient) {
      await supabase
        .from('client_history')
        .insert({
          client_id: clientId,
          user_id: COACH_DEMO_USER_ID,
          activity_type: 'cliente_criado',
          title: 'Cliente criado',
          description: 'Importado via Excel',
        })
    }
    
    console.log('\n✅ Importação concluída com sucesso!')
    console.log(`\n📋 Resumo:`)
    console.log(`   Cliente: ${clientName}`)
    console.log(`   ID: ${clientId}`)
    console.log(`   Status: ${existingClient ? 'Atualizado' : 'Criado'}`)
    console.log(`   Avaliação: ${Object.keys(clientData.firstAssessment).length > 0 ? (existingAssessment ? 'Atualizada' : 'Criada') : 'Não criada (sem dados)'}`)
    console.log('\n')
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// Executar
main()

