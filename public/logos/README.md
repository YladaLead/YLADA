# 🎨 Logos YLADA

## ⚠️ **IMPORTANTE: ESTRUTURA ATUALIZADA**

Os logos foram organizados e movidos para uma nova estrutura mais organizada:

### 📁 Nova Localização:
```
public/images/logo/ylada/
```

### ✅ **O QUE FOI FEITO:**

1. **Organização por Cor:**
   - 🟢 Verde (2 variações) - Logo principal
   - 🟠 Laranja (4 variações)
   - 🔴 Vermelho (2 variações)
   - 🟣 Roxo (8 variações)
   - 🔵 Azul Claro (4 variações)

2. **Nomenclatura Padronizada:**
   - `ylada-quadrado-[cor]-[numero].png`
   - Exemplo: `ylada-quadrado-verde-2.png`

3. **Arquivos Criados:**
   - ✅ `/public/images/logo/ylada/logos-config.js` - Configuração atualizada
   - ✅ `/public/images/logo/ylada/README.md` - Documentação completa
   - ✅ `/src/components/Logo.tsx` - Componente React reutilizável

### 📖 **PARA USAR OS LOGOS:**

Consulte a documentação completa em:
- **`/public/images/logo/ylada/README.md`**

Ou use diretamente:
```jsx
import Logo from '@/components/Logo'

// Logo principal (verde)
<Logo cor="verde" tamanho="medio" />

// Logo roxo
<Logo cor="roxo" tamanho="grande" />
```

### 📝 **NOTAS:**
- Todos os logos originais foram preservados nesta pasta (`/public/logos/`)
- Os logos organizados estão em `/public/images/logo/ylada/`
- Use preferencialmente os logos da nova estrutura

---

**Status**: ✅ Logos organizados e documentados  
**Próximos passos**: Implementar no site usando o componente `<Logo />`
