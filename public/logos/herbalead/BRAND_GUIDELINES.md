# HerbaLead - Brand Guidelines

## 🎯 Identidade da Marca

**HerbaLead** é uma plataforma de aceleração de leads para profissionais da área de saúde e bem-estar.

### Slogan
"YOUR LEAD ACCELERATOR"

## 🎨 Paleta de Cores

### Cores Primárias
```css
/* Verde Principal */
--herbalead-green: #10B981;
--herbalead-green-light: #34D399;
--herbalead-green-dark: #059669;

/* Azul Principal */
--herbalead-blue: #1E40AF;
--herbalead-blue-light: #3B82F6;
--herbalead-blue-dark: #1E3A8A;
```

### Cores Neutras
```css
/* Cinzas */
--herbalead-gray-50: #F9FAFB;
--herbalead-gray-100: #F3F4F6;
--herbalead-gray-500: #6B7280;
--herbalead-gray-900: #111827;
```

## 🔤 Tipografia

### Fontes Recomendadas
- **Títulos**: Inter, system-ui, sans-serif
- **Corpo**: Inter, system-ui, sans-serif
- **Monospace**: 'Fira Code', monospace

### Hierarquia
```css
/* Títulos */
h1 { font-size: 2.5rem; font-weight: 700; }
h2 { font-size: 2rem; font-weight: 600; }
h3 { font-size: 1.5rem; font-weight: 600; }

/* Corpo */
body { font-size: 1rem; font-weight: 400; line-height: 1.6; }
small { font-size: 0.875rem; font-weight: 400; }
```

## 🖼️ Uso do Logotipo

### Regras de Uso
1. **Sempre manter proporções** originais
2. **Não distorcer** ou esticar
3. **Manter área de respiro** mínima
4. **Usar versão apropriada** para o fundo

### Versões Disponíveis
- **Horizontal**: Para cabeçalhos e banners
- **Vertical**: Para espaços estreitos
- **Ícone**: Para favicons e ícones pequenos
- **Monocromático**: Para impressão

### Área de Respiro
Mínimo de **1x** a altura do ícone em todos os lados.

## 🎯 Aplicação em UI

### Botões Primários
```css
.btn-primary {
  background: var(--herbalead-green);
  color: white;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
}
```

### Botões Secundários
```css
.btn-secondary {
  background: transparent;
  color: var(--herbalead-blue);
  border: 2px solid var(--herbalead-blue);
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
}
```

### Cards
```css
.card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}
```

## 📱 Responsividade

### Breakpoints
```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

## ✅ Checklist de Implementação

- [x] Definir paleta de cores
- [x] Organizar arquivos de logo
- [x] Criar documentação
- [ ] Implementar CSS variables
- [ ] Atualizar componentes
- [ ] Testar acessibilidade
- [ ] Validar contraste
- [ ] Documentar componentes

---

**Versão**: 1.0  
**Data**: $(date)  
**Mantido por**: Equipe HerbaLead

