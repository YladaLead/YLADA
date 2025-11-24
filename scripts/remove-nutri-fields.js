const fs = require('fs');
const path = require('path');
const glob = require('glob');

const nutriDir = path.join(__dirname, '../src/lib/diagnostics/nutri');
const files = glob.sync('**/*.ts', { cwd: nutriDir });

console.log(`Encontrados ${files.length} arquivos para processar...`);

files.forEach((file) => {
  const filePath = path.join(nutriDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remover linhas que contêm os campos (com vírgula opcional no final)
  const lines = content.split('\n');
  const newLines = [];
  let skipNextComma = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Verificar se é uma linha com um dos campos a remover
    if (
      trimmed.startsWith('plano7Dias:') ||
      trimmed.startsWith('suplementacao:') ||
      trimmed.startsWith('alimentacao:')
    ) {
      // Pular esta linha
      skipNextComma = true;
      continue;
    }
    
    // Se a linha anterior foi removida e esta linha começa com vírgula, remover a vírgula
    if (skipNextComma && trimmed.startsWith(',')) {
      skipNextComma = false;
      continue;
    }
    
    // Se a linha anterior foi removida e esta linha não começa com vírgula,
    // adicionar vírgula à linha anterior se necessário
    if (skipNextComma) {
      if (newLines.length > 0) {
        const lastLine = newLines[newLines.length - 1];
        if (!lastLine.trim().endsWith(',') && !lastLine.trim().endsWith('{') && lastLine.trim() !== '') {
          newLines[newLines.length - 1] = lastLine.replace(/\s*$/, ',');
        }
      }
      skipNextComma = false;
    }
    
    newLines.push(line);
  }
  
  // Ajustar vírgulas: se uma linha termina com vírgula e a próxima é um fechamento, remover a vírgula
  for (let i = 0; i < newLines.length - 1; i++) {
    const current = newLines[i].trim();
    const next = newLines[i + 1].trim();
    
    if (current.endsWith(',') && (next === '}' || next === '},' || next.startsWith('}'))) {
      newLines[i] = newLines[i].replace(/,\s*$/, '');
    }
  }
  
  const newContent = newLines.join('\n');
  
  // Verificar se houve mudanças
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✓ Processado: ${file}`);
  } else {
    console.log(`- Sem mudanças: ${file}`);
  }
});

console.log('\n✅ Processamento concluído!');

