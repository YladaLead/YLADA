# 📊 Organizador de Contatos para Meta Ads

Script para consolidar e organizar contatos de nutricionistas de múltiplos arquivos Excel para upload no Meta Ads (Facebook/Instagram).

## 🚀 Como Usar

### 1. Preparar os Arquivos Excel

Coloque todos os seus arquivos Excel (.xlsx ou .xls) com os contatos de nutricionistas em uma pasta. Por exemplo:

```
contatos-nutricionistas/
  ├── lista-1.xlsx
  ├── lista-2.xlsx
  ├── lista-3.xlsx
  └── ...
```

### 2. Executar o Script

**Opção 1: Usar script npm (recomendado)**
```bash
npm run organizar-contatos-meta
```
O script procurará arquivos na pasta `contatos-nutricionistas/` na raiz do projeto.

**Opção 2: Executar diretamente com pasta padrão**
```bash
node scripts/organizar-contatos-meta-ads.js
```

**Opção 3: Especificar pasta customizada**
```bash
node scripts/organizar-contatos-meta-ads.js /caminho/para/sua/pasta
```

### 3. Resultado

O script irá:
- ✅ Ler todos os arquivos Excel da pasta
- ✅ Detectar automaticamente colunas de nome, email e telefone
- ✅ Remover duplicatas
- ✅ Padronizar dados (emails em minúsculas, telefones no formato E.164)
- ✅ Gerar arquivo CSV pronto para Meta Ads

O arquivo será salvo em: `contatos-meta-ads.csv` na raiz do projeto.

## 📋 Formato do Arquivo Gerado

O CSV gerado terá as seguintes colunas:
- **Email**: Email do contato (obrigatório para Meta Ads)
- **Nome**: Nome do contato
- **Telefone**: Telefone no formato E.164 (ex: +5511999999999)

## 🔍 Detecção Automática de Colunas

O script detecta automaticamente as colunas relevantes procurando por palavras-chave:

- **Nome**: "nome", "name", "contato", "cliente", "paciente", "nutricionista"
- **Email**: "email", "e-mail", "mail", "correio"
- **Telefone**: "telefone", "phone", "celular", "whatsapp", "tel", "fone", "contato"

## 📤 Upload no Meta Ads

1. Acesse o [Meta Business Suite](https://business.facebook.com)
2. Vá em **Públicos** > **Criar público personalizado**
3. Selecione **"Arquivo de clientes"**
4. Faça upload do arquivo `contatos-meta-ads.csv`
5. Mapeie as colunas:
   - Email → Email
   - Nome → Nome (opcional)
   - Telefone → Telefone (opcional)
6. Aguarde o processamento (pode levar alguns minutos)
7. Use o público personalizado nos seus anúncios!

## ⚙️ Requisitos

- Node.js instalado
- Biblioteca `xlsx` (já incluída no projeto)

## 📊 Estatísticas

O script exibe estatísticas úteis:
- Total de contatos extraídos
- Número de duplicatas removidas
- Contatos com email
- Contatos com telefone
- Contatos com ambos
- Contatos com nome

## 🔧 Formatação de Telefones

O script converte telefones para o formato E.164 (padrão internacional):
- `(11) 99999-9999` → `+5511999999999`
- `11999999999` → `+5511999999999`
- `+55 11 99999-9999` → `+5511999999999`

## ⚠️ Observações

- O script processa **todas as planilhas** de cada arquivo Excel
- Contatos sem email E sem telefone válido são ignorados
- Duplicatas são removidas baseado em email ou telefone
- Se um contato duplicado tiver mais informações, elas são mescladas

## 🐛 Solução de Problemas

**Erro: "Pasta não encontrada"**
- Verifique se a pasta existe
- Use caminho absoluto se necessário

**Erro: "Nenhum arquivo Excel encontrado"**
- Verifique se os arquivos têm extensão .xlsx ou .xls
- Verifique se os arquivos estão na pasta correta

**Colunas não detectadas**
- Verifique se os cabeçalhos das planilhas contêm palavras-chave reconhecidas
- O script procura nas primeiras 10 linhas por cabeçalhos

## 📝 Exemplo de Uso

```bash
# Criar pasta para os arquivos Excel
mkdir contatos-nutricionistas

# Copiar arquivos Excel para a pasta
cp /caminho/arquivos/*.xlsx contatos-nutricionistas/

# Executar o script
node scripts/organizar-contatos-meta-ads.js

# Resultado: contatos-meta-ads.csv gerado na raiz do projeto
```

