import fs from 'fs';
import JSZip from 'jszip';
import { PDFDocument, rgb } from 'pdf-lib';

const zip = new JSZip();
const baseDir = 'YLADA_Brand_Kit';
const folders = ['Logos','Favicons','Print','Docs'];
folders.forEach(f => zip.folder(`${baseDir}/${f}`));

// Cores e texto da marca
const green = '#10B981', dark = '#374151';
const font = 'Montserrat';

// Criar logos básicos como PNGs simulados (placeholders)
const logos = [
  'ylada-logo-horizontal.png','ylada-logo-horizontal-white.png',
  'ylada-logo-vertical.png','ylada-logo-vertical-white.png',
  'ylada-logo-icon.png','ylada-logo-icon-white.png',
  'ylada-favicon-16.png','ylada-favicon-32.png'
];
logos.forEach(name => zip.file(`${baseDir}/Logos/${name}`, 'LOGO_YLADA_PLACEHOLDER'));

// Criar PDF do Brand Guide bilíngue
(async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const { height } = page.getSize();
  page.drawText('YLADA — Brand Guide', { x: 180, y: height - 80, size: 24 });
  page.drawText('Português / English', { x: 220, y: height - 110, size: 14 });
  page.drawText('Paleta de Cores: Verde Emerald (' + green + '), Cinza (' + dark + ')', { x: 50, y: height - 160, size: 12 });
  page.drawText('Fontes: Montserrat / Inter', { x: 50, y: height - 180, size: 12 });
  page.drawText('Logos: Horizontal, Vertical, Ícone, Favicons, Impressão', { x: 50, y: height - 200, size: 12 });
  page.drawText('Filosofia: Democratizar o acesso à geração de leads inteligente.', { x: 50, y: height - 220, size: 12 });
  const pdfBytes = await pdfDoc.save();
  zip.file(`${baseDir}/Docs/ylada-brand-guide.pdf`, pdfBytes);

  // Compactar tudo
  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync('YLADA_Brand_Kit.zip', content);
  console.log('✅ YLADA_Brand_Kit.zip gerado com sucesso!');
})();
