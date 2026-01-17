# 🚀 PLANO RÁPIDO: Anúncios Funcionais HOJE

## ✅ CONCORDO 100%

**Foco único:** Anúncios Instagram/Facebook para atrair usuários.

---

## 🎯 O QUE JÁ TEMOS (Funciona)

✅ **IA gera roteiros** - Completo, estruturado  
✅ **Busca automática com prioridade:**
   - 1º: Banco próprio (Envato no Supabase) ✅
   - 2º: APIs externas (Pexels/Unsplash) ✅
   - 3º: DALL-E (criação) ✅
✅ **Timeline visual** - Organizar clips  
✅ **Legendas animadas** - Texto sobre vídeo  
✅ **Preview em tempo real** - Ver antes de exportar  
✅ **Export básico** - Gravação de tela (funciona, mas manual)  

---

## ❌ O QUE FALTA (2-3 horas)

### 1. **VOZ (TTS)** - CRÍTICO
- **Tempo:** 1h
- **O que:** Integrar OpenAI TTS ou ElevenLabs
- **Por quê:** Anúncios precisam de narração
- **Status:** Busca de imagens/vídeos JÁ FUNCIONA (Envato + DALL-E)

### 2. **FORMATO VERTICAL (9:16)** - CRÍTICO
- **Tempo:** 30min
- **O que:** Ajustar dimensões padrão para Instagram
- **Por quê:** 80% dos anúncios são verticais

### 3. **SINCRONIZAÇÃO VOZ + LEGENDAS** - IMPORTANTE
- **Tempo:** 30min
- **O que:** Voz toca junto com legendas
- **Por quê:** Melhor experiência

---

## ✅ BUSCA DE IMAGENS/VÍDEOS (JÁ IMPLEMENTADO)

**ORDEM DE BUSCA (automática):**
1. **Banco próprio (Envato)** → `/api/creative-studio/search-media-library`
   - Busca no Supabase (media_library)
   - Imagens/vídeos do Envato que você já baixou
   - Prioridade por relevância e uso

2. **APIs externas** → `/api/creative-studio/search-images`
   - Pexels (gratuito)
   - Unsplash (gratuito)
   - Fallback se não encontrar no banco próprio

3. **DALL-E (criação)** → `/api/creative-studio/search-images?type=create`
   - Quando precisa criar algo específico
   - Logo YLADA, dashboard, interface personalizada
   - Detecta automaticamente quando deve criar vs buscar

**COMO FUNCIONA:**
- IA detecta se deve "buscar" ou "criar"
- Sistema tenta banco próprio primeiro
- Se não encontrar, busca em APIs
- Se ainda não encontrar, oferece criar com DALL-E
- Tudo automático, sem intervenção manual

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **PASSO 1: Integrar TTS (1h)**
```
[ ] Criar API route: /api/creative-studio/generate-voice
[ ] Integrar OpenAI TTS (ou ElevenLabs)
[ ] Adicionar botão "Gerar Voz" no editor
[ ] Salvar áudio no timeline
```

### **PASSO 2: Formato Vertical (30min)**
```
[ ] Ajustar dimensões padrão: 1080x1920 (9:16)
[ ] Atualizar VideoPlayer para vertical
[ ] Ajustar export para vertical
```

### **PASSO 3: Sincronização (30min)**
```
[ ] Tocar voz junto com vídeo
[ ] Sincronizar legendas com voz
[ ] Testar timing
```

---

## 🎬 FLUXO FINAL (Como vai funcionar)

```
1. Usuário: "Criar anúncio sobre agenda vazia"
   ↓
2. IA gera roteiro completo
   ↓
3. IA busca imagens automaticamente (ORDEM):
   → 1º: Banco próprio (Envato no Supabase) ✅ JÁ FUNCIONA
   → 2º: APIs externas (Pexels/Unsplash) ✅ JÁ FUNCIONA
   → 3º: DALL-E (criação) ✅ JÁ FUNCIONA
   ↓
4. Usuário adiciona imagens na timeline ✅ JÁ FUNCIONA
   ↓
5. Usuário clica "Gerar Voz" ❌ FALTA (1h)
   ↓
6. Sistema gera narração com TTS ❌ FALTA (1h)
   ↓
7. Voz + imagens + legendas sincronizados ❌ FALTA (30min)
   ↓
8. Preview em tempo real ✅ JÁ FUNCIONA
   ↓
9. Export (gravação de tela) ✅ JÁ FUNCIONA
   ↓
10. Vídeo pronto para Instagram/Facebook ✅ QUASE PRONTO
```

---

## 💰 CUSTO POR VÍDEO

- **OpenAI TTS:** $0.01/vídeo (quase grátis)
- **ElevenLabs:** $0.16/vídeo (melhor qualidade)
- **Imagens:** $0.40/vídeo (DALL-E) ou $0.00 (Envato já baixado)

**TOTAL:** $0.16-0.41 por vídeo

---

## ⏱️ TEMPO TOTAL

**2-3 horas de código = PRONTO HOJE**

---

## ✅ RESPOSTA DIRETA

**O QUE PRECISAMOS:**
1. Integrar TTS (1h)
2. Ajustar formato vertical (30min)
3. Sincronizar voz + legendas (30min)

**RESULTADO:**
- Anúncios funcionais HOJE
- Vertical 9:16 (Instagram)
- Com voz e legendas
- Pronto para exportar

---

## 🚀 PRÓXIMO PASSO

**Quer que eu implemente AGORA?**

