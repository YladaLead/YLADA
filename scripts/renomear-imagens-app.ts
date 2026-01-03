#!/usr/bin/env ts-node

/**
 * Script para renomear imagens do app com nomes descritivos
 * Baseado na estrutura e conteúdo das imagens
 */

import * as fs from 'fs'
import * as path from 'path'

const imagensAppPath = path.join(__dirname, '..', 'imagens-app')

// Mapeamento de nomes descritivos por pasta e ordem
const nomesPorPasta: Record<string, string[]> = {
  'agenda': [
    'agenda-vazia.png',           // Primeira imagem (provavelmente agenda vazia)
    'agenda-cheia.png',           // Segunda imagem (provavelmente agenda cheia)
  ],
  'captacao': [
    'formulario-captacao.png',    // Primeira imagem
    'dashboard-captacao.png',     // Segunda imagem
  ],
  'clientes': [
    'lista-clientes-vazia.png',   // Primeira imagem
    'lista-clientes-cheia.png',   // Segunda imagem
  ],
  'gestao-clientes': [
    'cadastro-cliente.png',        // Primeira imagem
    'perfil-cliente.png',          // Segunda imagem
    'historico-consultas.png',     // Terceira imagem
  ],
  'jornada-30-dias': [
    'dia-1-onboarding.png',        // Primeira imagem
    'dia-3-primeiro-cliente.png',  // Segunda imagem
    'dia-5-primeira-consulta.png', // Terceira imagem
    'dia-10-dashboard-inicial.png', // Quarta imagem
    'dia-15-agenda-preenchendo.png', // Quinta imagem
  ],
  'videos': [
    'navegacao-dashboard-agenda.mov',
    'cadastrando-cliente.mov',
    'visualizando-relatorios.mov',
    'agendando-consulta.mov',
    'gestao-completa.mov',
  ],
}

// Função para listar arquivos em uma pasta
function listarArquivos(pasta: string): string[] {
  const pastaPath = path.join(imagensAppPath, pasta)
  if (!fs.existsSync(pastaPath)) {
    return []
  }
  
  return fs.readdirSync(pastaPath)
    .filter(arquivo => {
      const arquivoPath = path.join(pastaPath, arquivo)
      return fs.statSync(arquivoPath).isFile()
    })
    .sort() // Ordenar por nome (que geralmente tem timestamp)
}

// Função para renomear arquivos
function renomearArquivos(pasta: string, arquivos: string[], novosNomes: string[]) {
  const pastaPath = path.join(imagensAppPath, pasta)
  
  console.log(`\n📁 ${pasta.toUpperCase()}:`)
  console.log(`   Encontrados ${arquivos.length} arquivo(s)`)
  
  arquivos.forEach((arquivoAntigo, index) => {
    if (index >= novosNomes.length) {
      console.log(`   ⚠️  ${arquivoAntigo} - Sem nome definido (adicionar ao mapeamento)`)
      return
    }
    
    const nomeNovo = novosNomes[index]
    const caminhoAntigo = path.join(pastaPath, arquivoAntigo)
    const caminhoNovo = path.join(pastaPath, nomeNovo)
    
    // Verificar extensão original
    const extensao = path.extname(arquivoAntigo)
    const nomeSemExtensao = path.basename(nomeNovo, path.extname(nomeNovo))
    const nomeFinal = nomeSemExtensao + extensao
    
    const caminhoFinal = path.join(pastaPath, nomeFinal)
    
    try {
      // Verificar se já existe com o nome novo
      if (fs.existsSync(caminhoFinal) && caminhoAntigo !== caminhoFinal) {
        console.log(`   ⚠️  ${nomeFinal} já existe, pulando...`)
        return
      }
      
      fs.renameSync(caminhoAntigo, caminhoFinal)
      console.log(`   ✅ ${arquivoAntigo} → ${nomeFinal}`)
    } catch (error: any) {
      console.log(`   ❌ Erro ao renomear ${arquivoAntigo}: ${error.message}`)
    }
  })
}

// Função principal
function main() {
  console.log('🔄 Renomeando imagens do app com nomes descritivos...\n')
  
  // Processar cada pasta
  Object.keys(nomesPorPasta).forEach(pasta => {
    const arquivos = listarArquivos(pasta)
    if (arquivos.length > 0) {
      renomearArquivos(pasta, arquivos, nomesPorPasta[pasta])
    } else {
      console.log(`\n📁 ${pasta.toUpperCase()}:`)
      console.log(`   📭 Pasta vazia`)
    }
  })
  
  console.log('\n✅ Processo concluído!')
  console.log('\n📋 Próximos passos:')
  console.log('   1. Verifique se os nomes estão corretos')
  console.log('   2. Ajuste manualmente se necessário')
  console.log('   3. Execute o script de upload para Supabase')
}

// Executar
if (require.main === module) {
  main()
}

export { main }


