const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const logosDir = path.join(__dirname, '..', 'public', 'logos');
  
  // Lista de arquivos SVG para converter
  const svgFiles = [
    'ylada-logo-horizontal.svg',
    'ylada-logo-text-only.svg', 
    'ylada-icon.svg',
    'ylada-icon-dark.svg'
  ];

  for (const svgFile of svgFiles) {
    const svgPath = path.join(logosDir, svgFile);
    const pngPath = path.join(logosDir, svgFile.replace('.svg', '.png'));
    
    try {
      // Ler o arquivo SVG
      const svgBuffer = fs.readFileSync(svgPath);
      
      // Converter para PNG
      await sharp(svgBuffer)
        .png()
        .toFile(pngPath);
      
      console.log(`✅ Convertido: ${svgFile} → ${svgFile.replace('.svg', '.png')}`);
    } catch (error) {
      console.error(`❌ Erro ao converter ${svgFile}:`, error.message);
    }
  }

  // Criar favicons em diferentes tamanhos
  const iconPath = path.join(logosDir, 'ylada-icon.png');
  
  try {
    // Favicon 16x16
    await sharp(iconPath)
      .resize(16, 16)
      .png()
      .toFile(path.join(logosDir, 'ylada-favicon-16.png'));
    
    // Favicon 32x32
    await sharp(iconPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(logosDir, 'ylada-favicon-32.png'));
    
    console.log('✅ Favicons criados: 16x16 e 32x32');
  } catch (error) {
    console.error('❌ Erro ao criar favicons:', error.message);
  }
}

convertSvgToPng().catch(console.error);
