# Schema JSON para getMaterialInfo - Adicionar no OpenAI Assistant

## 📋 Função: getMaterialInfo

**Cole este JSON no campo "Function" ou "Schema" do OpenAI Assistant:**

```json
{
  "name": "getMaterialInfo",
  "description": "Busca materiais da biblioteca Wellness (imagens, vídeos, PDFs, posts, stories) por nome, tipo ou categoria. Use quando o usuário perguntar sobre materiais, imagens, vídeos, posts para redes sociais ou qualquer conteúdo da biblioteca.",
  "parameters": {
    "type": "object",
    "properties": {
      "busca": {
        "type": "string",
        "description": "Nome, título ou descrição do material que o usuário está procurando (ex: 'bebida funcional', 'imagem acelera', 'vídeo de treinamento', 'post para instagram')"
      },
      "tipo": {
        "type": "string",
        "enum": ["imagem", "video", "pdf", "link", "documento"],
        "description": "Tipo de material: imagem (fotos, posts, stories), video (vídeos de treinamento), pdf (documentos), link (links externos), documento (outros documentos)"
      },
      "categoria": {
        "type": "string",
        "enum": ["apresentacao", "cartilha", "produto", "treinamento", "script", "divulgacao", "outro"],
        "description": "Categoria do material: apresentacao (materiais de apresentação), cartilha (cartilhas de treinamento), produto (produtos e bebidas), treinamento (vídeos e materiais de treinamento), script (scripts oficiais), divulgacao (materiais para redes sociais), outro"
      },
      "link_atalho": {
        "type": "string",
        "description": "Link de atalho do material (ex: 'bebida-funcional'). Use quando o usuário mencionar um link específico."
      }
    },
    "required": []
  }
}
```

## 📝 Exemplos de Uso

### Exemplo 1: Buscar imagem específica
**Usuário:** "Você tem a imagem da bebida funcional?"
**Function Call:**
```json
{
  "name": "getMaterialInfo",
  "arguments": {
    "busca": "bebida funcional",
    "tipo": "imagem"
  }
}
```

### Exemplo 2: Buscar material de divulgação
**Usuário:** "Preciso de um post para instagram"
**Function Call:**
```json
{
  "name": "getMaterialInfo",
  "arguments": {
    "categoria": "divulgacao",
    "tipo": "imagem"
  }
}
```

### Exemplo 3: Buscar vídeo de treinamento
**Usuário:** "Tem algum vídeo de treinamento?"
**Function Call:**
```json
{
  "name": "getMaterialInfo",
  "arguments": {
    "tipo": "video",
    "categoria": "treinamento"
  }
}
```

## ✅ Como Adicionar no OpenAI

1. Acesse: https://platform.openai.com/assistants
2. Abra o Assistant do NOEL
3. Vá em **"Functions"** ou **"Tools"**
4. Clique em **"Add Function"** ou **"Create Function"**
5. Cole o JSON acima
6. **NÃO configure URL** - o backend já faz isso automaticamente
7. Salve

## 🔗 Resposta da Função

A função retorna:
- `titulo`: Nome do material
- `descricao`: Descrição do material
- `tipo`: Tipo (imagem, video, pdf, etc)
- `categoria`: Categoria do material
- `link_atalho_completo`: Link curto formatado (ex: https://ylada.app/m/bebida-funcional)
- `link_direto`: URL direta do arquivo

O NOEL deve SEMPRE entregar o `link_atalho_completo` formatado como link clicável na resposta.
