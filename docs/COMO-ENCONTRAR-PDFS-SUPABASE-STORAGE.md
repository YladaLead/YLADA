# 🔍 Como Encontrar PDFs no Supabase Storage

## 📍 Onde os PDFs Estão

**⚠️ IMPORTANTE:** Os PDFs podem estar em diferentes buckets:

1. **`wellness-biblioteca`** (recomendado) - Para materiais da biblioteca
   - Estrutura: `pdfs/scripts/` ou `pdfs/aulas/`

2. **`wellness-cursos-pdfs`** (alternativo) - Para PDFs de cursos
   - Estrutura: `pdf/` (pasta única)

**Verifique em qual bucket seus PDFs estão!**

### Estrutura de Pastas Esperada:
```
wellness-biblioteca/
├── pdfs/
│   ├── scripts/          ← Scripts em PDF
│   └── aulas/            ← Aulas em PDF
├── videos/
└── imagens/
```

---

## 🔎 Como Verificar no Supabase Dashboard

### Método 1: Via Interface Web (Mais Fácil)

1. **Acesse o Supabase Dashboard**
   - URL: `https://app.supabase.com`
   - Faça login na sua conta

2. **Navegue até Storage**
   - No menu lateral, clique em **"Storage"**
   - Ou acesse diretamente: `https://app.supabase.com/project/[SEU-PROJETO]/storage/buckets`

3. **Abra o Bucket**
   - Clique no bucket: **`wellness-biblioteca`**
   - Se não existir, você precisa criá-lo primeiro (veja `migrations/022-criar-bucket-wellness-biblioteca.sql`)

4. **Navegue pelas Pastas**
   - Clique em `pdfs/`
   - Depois em `scripts/` ou `aulas/`
   - Você verá todos os PDFs listados

5. **Copie a URL**
   - Clique em um arquivo PDF
   - A URL pública aparecerá na interface
   - Formato: `https://[PROJETO].supabase.co/storage/v1/object/public/wellness-biblioteca/pdfs/scripts/[NOME-ARQUIVO].pdf`

---

## 🔧 Método 2: Via Script TypeScript

Execute o script que lista todos os PDFs:

```bash
# Configure as variáveis de ambiente primeiro
export NEXT_PUBLIC_SUPABASE_URL="https://[SEU-PROJETO].supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="[SUA-CHAVE]"

# Execute o script
npx tsx scripts/listar-pdfs-storage-wellness.ts
```

O script vai:
- Listar todos os PDFs em `pdfs/scripts/`
- Listar todos os PDFs em `pdfs/aulas/`
- Mostrar a URL pública de cada arquivo
- Mostrar o tamanho de cada arquivo

---

## 🔧 Método 3: Via SQL (Verificar no Banco)

Execute este SQL no Supabase SQL Editor:

```sql
-- Ver quais materiais existem no banco
SELECT 
  codigo,
  titulo,
  url,
  CASE 
    WHEN url LIKE '%placeholder%' OR url LIKE '%example.com%' THEN '⚠️ Precisa atualizar'
    ELSE '✅ OK'
  END as status
FROM wellness_materiais
WHERE tipo = 'pdf' 
  AND categoria = 'script'
ORDER BY titulo;
```

---

## 📝 Passo a Passo para Atualizar URLs

### 1. Identificar o ID do Projeto

O ID do projeto aparece na URL do Supabase Dashboard:
- Exemplo: `https://app.supabase.com/project/fubynpjagxxqbyfjsile/...`
- O ID é: `fubynpjagxxqbyfjsile`

### 2. Verificar Nomes dos Arquivos

No Supabase Dashboard → Storage → `wellness-biblioteca` → `pdfs/scripts/`:
- Anote os nomes EXATOS dos arquivos
- Exemplo: `Calculadora-de-Hidratacao.pdf` (com maiúsculas/minúsculas corretas)

### 3. Atualizar URLs no Banco

Edite o arquivo `migrations/164-atualizar-urls-pdfs-biblioteca-wellness.sql`:
- Substitua `[SEU-PROJETO]` pelo ID do seu projeto
- Ajuste os nomes dos arquivos conforme estão no storage
- Execute o script no Supabase SQL Editor

### 4. Verificar Resultado

Execute novamente a query de verificação:

```sql
SELECT codigo, titulo, url 
FROM wellness_materiais 
WHERE tipo = 'pdf' AND categoria = 'script';
```

Todos devem ter URLs válidas (não placeholders).

---

## 🎯 Mapeamento dos PDFs da Imagem

Baseado na imagem que você mostrou, aqui estão os PDFs que precisam ser mapeados:

| PDF na Imagem | Código no Banco | Categoria |
|--------------|----------------|-----------|
| Calculadora-de-Hidratacao.pdf | `pdf-script-convite-leve-completo` | convite |
| Calculadora-IMC.pdf | `pdf-script-convite-pessoas-proximas` | convite |
| Calculadora-de-proteina.pdf | `pdf-script-convite-leads-frios` | convite |
| Como-Se-Compor...a.pdf | `pdf-script-follow-up-completo` | follow-up |
| Composicao-Corporal.pdf | `pdf-script-follow-up-apos-link` | follow-up |
| Planejador-de-Refeicoes.pdf | `pdf-script-apresentacao-produtos` | apresentacao |
| Quiz-de-Aliment...el.pdf | `pdf-script-apresentacao-oportunidade` | apresentacao |
| Quiz-de-Bem-Estar-Di...o.pdf | `pdf-script-fechamento-produtos` | fechamento |
| QUIZ-Ganhos-e-Prosperi...e.pdf | `pdf-script-fechamento-kits` | fechamento |
| Quiz-Perfil-de-Bem-Estar.pdf | `pdf-script-objecoes-completo` | objecao |
| Quiz-Potencial-e-Crescim...o.pdf | `pdf-script-objecao-dinheiro` | objecao |
| Quiz-Proposito-e-Equilibrio.pdf | `pdf-script-objecao-tempo` | objecao |

**⚠️ IMPORTANTE:** Os nomes com `...` estão truncados na imagem. Você precisa verificar os nomes COMPLETOS no Supabase Storage.

---

## ✅ Checklist Final

- [ ] Bucket `wellness-biblioteca` existe no Supabase
- [ ] PDFs estão na pasta `pdfs/scripts/` ou `pdfs/aulas/`
- [ ] Anotei os nomes EXATOS de todos os PDFs
- [ ] Identifiquei o ID do projeto Supabase
- [ ] Atualizei o script `164-atualizar-urls-pdfs-biblioteca-wellness.sql`
- [ ] Executei o script de atualização
- [ ] Verifiquei que todas as URLs foram atualizadas
- [ ] Testei abrindo os PDFs na página `/pt/wellness/biblioteca/scripts`

---

## 🆘 Problemas Comuns

### "Bucket não encontrado"
- Execute: `migrations/022-criar-bucket-wellness-biblioteca.sql`

### "PDFs não aparecem na lista"
- Verifique se estão na pasta correta (`pdfs/scripts/`)
- Verifique se os nomes dos arquivos estão corretos (case-sensitive)

### "URLs não atualizam"
- Verifique se o código (`codigo`) está correto
- Verifique se a URL do projeto está correta
- Verifique se os nomes dos arquivos estão exatos (incluindo maiúsculas/minúsculas)

---

## 📞 Próximos Passos

Após atualizar as URLs:
1. Recarregue a página `/pt/wellness/biblioteca/scripts`
2. Os PDFs devem aparecer na lista
3. Clique em um PDF para testar se abre corretamente



















