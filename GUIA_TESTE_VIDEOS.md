# 🧪 Guia de Teste - Sistema de Criação de Vídeos

## 🎯 Objetivo
Testar todas as funcionalidades implementadas para criar vídeos de venda do YLADA Nutri.

---

## 📋 Checklist de Teste

### 1️⃣ **Acessar o Sistema**
- [ ] Acesse: `http://localhost:3001/pt/creative-studio`
- [ ] Selecione: **Área: Nutri** e **Propósito: Anúncio Rápido**
- [ ] Clique em "Continuar para Editor"

### 2️⃣ **Criar um Vídeo Básico**

#### Passo 1: Adicionar Mídia
- [ ] No chat, digite: **"Quero criar um anúncio sobre agenda vazia para nutricionistas"**
- [ ] Aguarde a IA gerar o roteiro
- [ ] A IA deve buscar imagens/vídeos automaticamente
- [ ] Vá na aba **"Busca"** e selecione imagens/vídeos
- [ ] Clique para adicionar à timeline

#### Passo 2: Verificar Timeline
- [ ] Verifique se os clips aparecem na timeline (lado esquerdo)
- [ ] Verifique se o preview do vídeo está funcionando
- [ ] Teste os controles: Play/Pause, avançar/voltar 10s

### 3️⃣ **Testar Sistema de Legendas**

#### Passo 1: Adicionar Primeira Legenda
- [ ] Vá na aba **"Legendas"** (última aba)
- [ ] Clique em **"Adicionar"**
- [ ] Preencha:
  - **Texto**: "Sua agenda está vazia?"
  - **Início**: 0
  - **Fim**: 5
  - **Estilo**: Hook (Grande)
  - **Posição**: Centro
  - **Animação**: Fade In
- [ ] Clique em **"Adicionar"**

#### Passo 2: Verificar Renderização
- [ ] Volte para o preview do vídeo
- [ ] Reproduza o vídeo (ou arraste a timeline para o tempo 0-5s)
- [ ] **Verifique**: O texto "Sua agenda está vazia?" deve aparecer no centro do vídeo
- [ ] **Verifique**: O texto deve ter fundo escuro e aparecer com animação fade-in

#### Passo 3: Adicionar Mais Legendas
- [ ] Adicione uma segunda legenda:
  - **Texto**: "Muitas nutricionistas enfrentam esse desafio"
  - **Início**: 5
  - **Fim**: 10
  - **Estilo**: Dor (Vermelho)
  - **Posição**: Meio Superior
  - **Animação**: Slide Up
- [ ] Adicione uma terceira legenda:
  - **Texto**: "Com YLADA NUTRI, você lota sua agenda!"
  - **Início**: 10
  - **Fim**: 15
  - **Estilo**: Solução (Verde)
  - **Posição**: Centro
  - **Animação**: Zoom
- [ ] Adicione uma quarta legenda (CTA):
  - **Texto**: "Acesse agora /pt/nutri"
  - **Início**: 15
  - **Fim**: 20
  - **Estilo**: CTA (Roxo)
  - **Posição**: Inferior
  - **Animação**: Fade In
  - **Palavras destacadas**: "acesse", "agora"

#### Passo 4: Testar Todas as Posições
- [ ] Teste cada posição:
  - Centro
  - Topo
  - Inferior
  - Meio Superior
  - Meio Inferior
- [ ] Verifique se o texto aparece no lugar correto

#### Passo 5: Testar Todas as Animações
- [ ] Crie legendas com diferentes animações:
  - Fade In
  - Slide Up
  - Slide Down
  - Zoom
  - Typewriter
- [ ] Verifique se cada animação funciona

#### Passo 6: Testar Destaque de Palavras
- [ ] Edite uma legenda existente
- [ ] Adicione palavras para destacar (ex: "agenda", "cliente", "resultado")
- [ ] Verifique se essas palavras aparecem em cor diferente

### 4️⃣ **Testar Edição de Legendas**

#### Passo 1: Editar Legenda
- [ ] Clique no ícone de **editar** (lápis) em uma legenda
- [ ] Altere o texto, tempo ou estilo
- [ ] Clique em **"Salvar"**
- [ ] Verifique se as mudanças aparecem no preview

#### Passo 2: Excluir Legenda
- [ ] Clique no ícone de **excluir** (lixeira) em uma legenda
- [ ] Verifique se a legenda foi removida
- [ ] Verifique se o texto não aparece mais no vídeo

### 5️⃣ **Testar Sincronização**

#### Passo 1: Navegação na Timeline
- [ ] Arraste a timeline para diferentes tempos
- [ ] Verifique se as legendas aparecem/desaparecem no momento correto
- [ ] Verifique se o texto muda conforme o tempo

#### Passo 2: Reprodução Contínua
- [ ] Clique em Play
- [ ] Deixe o vídeo rodar do início ao fim
- [ ] Verifique se cada legenda aparece no tempo correto
- [ ] Verifique se as transições entre legendas são suaves

### 6️⃣ **Testar Estilos Visuais**

#### Passo 1: Estilo Hook
- [ ] Crie legenda com estilo "Hook"
- [ ] **Verifique**: Texto grande, branco, fundo escuro
- [ ] **Verifique**: Aparece no centro

#### Passo 2: Estilo Dor
- [ ] Crie legenda com estilo "Dor"
- [ ] **Verifique**: Texto vermelho (#EF4444)
- [ ] **Verifique**: Fundo escuro semi-transparente

#### Passo 3: Estilo Solução
- [ ] Crie legenda com estilo "Solução"
- [ ] **Verifique**: Texto verde (#10B981)
- [ ] **Verifique**: Fundo escuro semi-transparente

#### Passo 4: Estilo CTA
- [ ] Crie legenda com estilo "CTA"
- [ ] **Verifique**: Texto branco, fundo roxo (#8B5CF6)
- [ ] **Verifique**: Aparece na parte inferior

### 7️⃣ **Testar Exportação**

#### Passo 1: Verificar Botão de Exportação
- [ ] Procure o componente **"Exportar Vídeo"** na área esquerda (acima da timeline)
- [ ] Verifique se mostra:
  - Número de clips
  - Número de legendas
  - Duração total

#### Passo 2: Tentar Exportar
- [ ] Clique em **"Exportar Vídeo"**
- [ ] **Nota**: A exportação completa ainda está em desenvolvimento
- [ ] Você verá uma mensagem informando isso
- [ ] Por enquanto, você pode fazer screen recording do preview

### 8️⃣ **Testar Fluxo Completo**

#### Cenário: Criar Anúncio Completo
1. [ ] Acesse o editor
2. [ ] Digite no chat: **"Criar anúncio de 30 segundos sobre agenda cheia para nutricionistas"**
3. [ ] Aguarde a IA gerar roteiro e buscar mídia
4. [ ] Adicione 3-4 imagens/vídeos à timeline
5. [ ] Crie legendas para cada parte do roteiro:
   - Hook (0-5s)
   - Problema (5-12s)
   - Solução (12-22s)
   - CTA (22-30s)
6. [ ] Reproduza o vídeo completo
7. [ ] Verifique se tudo está sincronizado
8. [ ] Faça ajustes se necessário

---

## 🐛 Problemas Conhecidos / Limitações

### ⚠️ Exportação
- A exportação completa de vídeo ainda não está implementada
- Por enquanto, use screen recording do preview
- A estrutura está pronta para implementação futura com FFmpeg

### ⚠️ Performance
- Muitas legendas simultâneas podem afetar performance
- Se notar lentidão, reduza o número de legendas ou simplifique animações

---

## ✅ Critérios de Sucesso

O sistema está funcionando corretamente se:

1. ✅ Legendas aparecem no tempo correto
2. ✅ Texto é renderizado com o estilo escolhido
3. ✅ Animações funcionam suavemente
4. ✅ Posicionamento está correto
5. ✅ Destaque de palavras funciona
6. ✅ Edição/exclusão funciona
7. ✅ Sincronização com timeline está correta
8. ✅ Preview mostra tudo em tempo real

---

## 📝 Notas de Teste

**Data do Teste**: _______________

**Resultados**:
- [ ] Tudo funcionando
- [ ] Problemas encontrados (anotar abaixo)
- [ ] Sugestões de melhoria

**Problemas Encontrados**:
1. 
2. 
3. 

**Sugestões**:
1. 
2. 
3. 

---

## 🚀 Próximos Passos Após Teste

1. Se tudo funcionar: Começar a criar vídeos reais!
2. Se houver problemas: Reportar e corrigir
3. Melhorias futuras: Exportação completa, mais templates, etc.


