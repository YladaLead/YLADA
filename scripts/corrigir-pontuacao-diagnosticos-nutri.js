#!/usr/bin/env node

/**
 * Script para adicionar pontos finais em diagnósticos que não têm
 * Executa: node scripts/corrigir-pontuacao-diagnosticos-nutri.js
 */

const fs = require('fs');
const path = require('path');

const diagnosticsDir = path.join(__dirname, '../src/lib/diagnostics/nutri');

// Buscar todos os arquivos TypeScript de diagnósticos
const files = fs.readdirSync(diagnosticsDir).filter(f => f.endsWith('.ts'));

let totalCorrigidos = 0;
let arquivosModificados = [];

files.forEach(file => {
  const filePath = path.join(diagnosticsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modificado = false;

  // Padrões para encontrar linhas sem ponto final
  const patterns = [
    // diagnostico sem ponto final
    {
      regex: /(diagnostico:\s*'[^']*)([^'.])(',)/g,
      replacement: (match, p1, p2, p3) => {
        // Não adicionar ponto se já tiver ou se terminar com emoji/pontuação especial
        if (p2.match(/[!?;:—]$/)) return match;
        return `${p1}${p2}.${p3}`;
      }
    },
    // causaRaiz sem ponto final
    {
      regex: /(causaRaiz:\s*'[^']*)([^'.])(',)/g,
      replacement: (match, p1, p2, p3) => {
        if (p2.match(/[!?;:—]$/)) return match;
        return `${p1}${p2}.${p3}`;
      }
    },
    // acaoImediata sem ponto final
    {
      regex: /(acaoImediata:\s*'[^']*)([^'.])(',)/g,
      replacement: (match, p1, p2, p3) => {
        if (p2.match(/[!?;:—]$/)) return match;
        return `${p1}${p2}.${p3}`;
      }
    },
    // proximoPasso sem ponto final
    {
      regex: /(proximoPasso:\s*'[^']*)([^'.])(',)/g,
      replacement: (match, p1, p2, p3) => {
        if (p2.match(/[!?;:—]$/)) return match;
        return `${p1}${p2}.${p3}`;
      }
    }
  ];

  patterns.forEach(({ regex, replacement }) => {
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, replacement);
      modificado = true;
      totalCorrigidos += matches.length;
    }
  });

  if (modificado) {
    fs.writeFileSync(filePath, content, 'utf8');
    arquivosModificados.push(file);
    console.log(`✅ Corrigido: ${file}`);
  }
});

console.log(`\n📊 Resumo:`);
console.log(`   - Arquivos modificados: ${arquivosModificados.length}`);
console.log(`   - Total de correções: ${totalCorrigidos}`);
console.log(`\n✅ Correção concluída!`);

