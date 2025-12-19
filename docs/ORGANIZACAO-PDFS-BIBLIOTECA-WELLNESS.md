# 📚 Organização Final dos PDFs na Biblioteca Wellness

## ✅ Estrutura Implementada

### 1. **Cartilhas** (`/pt/wellness/biblioteca/cartilhas`)
**Conteúdo:** Apenas PDFs de uso de ferramentas

**Inclui:**
- ✅ Calculadoras (Hidratação, IMC, Proteína)
- ✅ Quizzes (Alimentação, Bem-Estar, Perfil, Propósito, Potencial, Ganhos)
- ✅ Guias práticos (Composição Corporal, Planejador de Refeições)

**Exclui:**
- ❌ PDFs de scripts (removidos)
- ❌ PDFs de aulas (vinculados às aulas)

---

### 2. **Aulas** (`/pt/wellness/cursos/[slug]/modulos/[moduloId]`)
**Conteúdo:** PDFs complementares vinculados às aulas

**Como funciona:**
- Cada aula na trilha pode ter um PDF complementar
- Campo `material_url` na tabela `wellness_aulas`
- Aparece como "Material Complementar" abaixo do conteúdo da aula
- Botões: "Abrir PDF" e "Baixar PDF"

**PDFs vinculados:**
- Aula 1: Fundamentos do Wellness System
- Aula 2: Os 3 Pilares do Wellness System
- Aula 3: Como o Modelo Funciona na Prática
- Aula 4: Por que o Wellness System Converte Tanto
- Aula 5: Visão Geral das Ferramentas

---

### 3. **Scripts** (`/pt/wellness/biblioteca/scripts`)
**Conteúdo:** Apenas orientação para usar o NOEL

**Mensagem:**
> "Os scripts oficiais agora estão centralizados no NOEL. Sempre que precisar de um script, peça diretamente para o NOEL que ele monta, adapta e personaliza para você."

**Botão:** "Falar com o NOEL"

---

## 🗄️ Estrutura no Banco de Dados

### Tabela: `wellness_materiais`
- **Categoria `cartilha`**: Apenas PDFs de ferramentas (ativo = true)
- **Categoria `cartilha`**: PDFs de scripts/aulas (ativo = false)

### Tabela: `wellness_aulas`
- **Campo `material_url`**: URL do PDF complementar da aula
- Vinculado automaticamente via migration 170

---

## 📋 Migrations Criadas

1. **`170-organizar-pdfs-biblioteca-wellness.sql`**
   - Adiciona campo `material_url` em `wellness_aulas`
   - Desativa PDFs de scripts e aulas em `wellness_materiais`
   - Vincula PDFs de aulas às aulas correspondentes

2. **`171-separar-pdfs-ferramentas-cartilhas.sql`**
   - Garante que apenas PDFs de ferramentas fiquem ativos
   - Atualiza tags para facilitar filtragem

---

## 🎯 Resultado Final

### Para o Usuário:

1. **Cartilhas** → Vê apenas PDFs de uso de ferramentas
2. **Aulas** → Vê o conteúdo + pode baixar PDF complementar
3. **Scripts** → É direcionado para o NOEL

### Organização Lógica:

- **Ferramentas** = Cartilhas (guias de como usar)
- **Aulas** = Trilha de Aprendizado (com PDFs complementares)
- **Scripts** = NOEL (personalizados e contextuais)

---

## ✅ Próximos Passos

1. Execute as migrations no Supabase:
   ```sql
   -- migrations/170-organizar-pdfs-biblioteca-wellness.sql
   -- migrations/171-separar-pdfs-ferramentas-cartilhas.sql
   ```

2. Verifique:
   - Cartilhas mostram apenas PDFs de ferramentas
   - Aulas têm botão de download do PDF
   - Scripts redireciona para NOEL

3. Teste:
   - Acesse `/pt/wellness/biblioteca/cartilhas`
   - Acesse `/pt/wellness/cursos/distribuidor-iniciante`
   - Acesse `/pt/wellness/biblioteca/scripts`

---

## 📝 Notas Técnicas

- O filtro de cartilhas é feito no frontend (pode ser otimizado no backend depois)
- PDFs de aulas são vinculados automaticamente baseado no título e ordem
- Se uma aula não for encontrada, o PDF não será vinculado (mas não quebra)









