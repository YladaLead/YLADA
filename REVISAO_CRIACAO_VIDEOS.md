# 📋 Revisão Geral - Processo de Criação de Vídeos

## 🎯 Objetivo
Criar vídeos de anúncios para nutricionistas direcionados para página de vendas (/pt/nutri) com estrutura: Hook → Problema → Solução → CTA

## 🔧 Tecnologias e APIs

### APIs Configuradas
1. **Pexels** (Imagens e Vídeos)
   - Variável: `PEXELS_API_KEY`
   - Status: ✅ Funcional (funciona sem API key também, mas com limitações)
   - Uso: Buscar imagens/vídeos gratuitos de stock

2. **Unsplash** (Imagens)
   - Variável: `UNSPLASH_ACCESS_KEY`
   - Status: ✅ Funcional (fallback se Pexels falhar)
   - Uso: Buscar imagens gratuitas de stock

3. **OpenAI DALL-E** (Criação de Imagens)
   - Variável: `OPENAI_API_KEY`
   - Status: ✅ Funcional
   - Uso: Criar imagens personalizadas quando necessário

### Verificar Configuração
```bash
# Verificar se as variáveis estão configuradas
echo $PEXELS_API_KEY
echo $UNSPLASH_ACCESS_KEY
echo $OPENAI_API_KEY
```

## 🎨 Lógica de Decisão: Buscar vs Criar vs Upload

### 1. BUSCAR na Web (Pexels/Unsplash)
**Quando usar:**
- Imagens genéricas que existem em stock
- Fotos realistas comuns
- Vídeos de stock

**Exemplos:**
- "nutricionista atendendo cliente"
- "agenda cheia"
- "consultório médico"
- "alimentos saudáveis"

**Como detectar:**
- Assistente diz: "Vou buscar imagens de..."
- Sistema busca automaticamente no Pexels/Unsplash

### 2. CRIAR com DALL-E
**Quando usar:**
- Elementos específicos da marca
- Gráficos personalizados
- Interfaces customizadas
- Elementos que não existem em stock

**Exemplos:**
- "logo YLADA NUTRI"
- "dashboard YLADA"
- "gráfico personalizado"
- "botão CTA customizado"

**Como detectar:**
- Assistente diz: "Vou criar uma imagem de..." ou "Gerar com IA..."
- Sistema chama DALL-E automaticamente

### 3. UPLOAD de Imagens Próprias
**Quando usar:**
- Usuário tem imagens próprias
- Logos da marca
- Materiais específicos

**Como usar:**
- Área "Adicionar Arquivos" na timeline
- Drag & drop ou clique para upload

## 📐 Estrutura de Vídeo de Anúncio

### Template Padrão (15-30s)
```
0-5s:   HOOK - Pergunta impactante ou afirmação
5-10s:  PROBLEMA - Dor do nutricionista
10-20s: SOLUÇÃO - Como YLADA NUTRI resolve
20-25s: CTA - Chamada para ação + /pt/nutri
```

### Elementos Visuais por Segmento
- **Hook**: Imagem impactante (buscar ou criar)
- **Problema**: Imagem que representa a dor (buscar)
- **Solução**: Dashboard/plataforma YLADA (criar ou buscar)
- **CTA**: Botão/texto de ação (criar)

## 🔍 Melhorias Implementadas

### 1. Detecção Inteligente
- ✅ Detecta automaticamente "buscar" vs "criar"
- ✅ Extrai termos de busca do contexto
- ✅ Fallback para termos genéricos se necessário

### 2. Aba de Busca
- ✅ Visualiza resultados de busca
- ✅ Permite selecionar e adicionar à timeline
- ✅ Mostra status de busca em tempo real

### 3. Processo Estruturado
- ✅ Assistente gera roteiro completo
- ✅ Sugere imagens automaticamente
- ✅ Mantém contexto (objetivo, público, destino)

## 🚀 Próximos Passos

### Melhorias Sugeridas
1. **Interface de Seleção de Banco de Dados**
   - Página dedicada para visualizar Pexels/Unsplash
   - Busca avançada com filtros
   - Preview antes de adicionar

2. **Biblioteca de Elementos**
   - Salvar imagens/vídeos favoritos
   - Templates de elementos visuais
   - Coleção de CTAs personalizados

3. **Validação de APIs**
   - Verificar se todas as keys estão configuradas
   - Testar cada API individualmente
   - Mostrar status no painel

4. **Processo Mais Assertivo**
   - Checklist de criação
   - Validação de estrutura (Hook, Problema, Solução, CTA)
   - Preview do roteiro antes de gerar

## 📝 Checklist de Criação

- [ ] Objetivo definido (anúncio Instagram/Facebook)
- [ ] Público-alvo claro (nutricionistas)
- [ ] Destino definido (/pt/nutri)
- [ ] Roteiro completo gerado
- [ ] Imagens/vídeos selecionados
- [ ] Estrutura validada (Hook → Problema → Solução → CTA)
- [ ] Timeline montada
- [ ] Preview testado

