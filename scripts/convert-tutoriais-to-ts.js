const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../src/data/tutoriais-wellness.json');
const tsPath = path.join(__dirname, '../src/data/tutoriais-wellness.ts');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let tsContent = `export interface Tutorial {
  id: string
  titulo: string
  categoria: string
  conteudo: string
  tags: string[]
}

export const tutoriaisData: Tutorial[] = ${JSON.stringify(data, null, 2)};
`;

fs.writeFileSync(tsPath, tsContent);
console.log(`✅ Convertido ${data.length} tutoriais com sucesso!`);

