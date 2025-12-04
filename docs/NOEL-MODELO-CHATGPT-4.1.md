# 🤖 NOEL - Modelo ChatGPT 4.1

## ✅ Modelo Configurado

O NOEL está configurado para usar **ChatGPT 4.1** (gpt-4-turbo ou gpt-4.1).

---

## 🔧 Configuração

### **No Agent Builder (OpenAI Platform):**

Ao configurar o nó **Agent**, escolha:

- **Model:** `gpt-4-turbo` ou `gpt-4.1` (conforme disponível na sua conta)
- **Temperature:** `0.7` (recomendado)

### **No Código (API):**

O código usa `gpt-4-turbo` como padrão, mas pode ser configurado via variável de ambiente:

```env
# Opcional: Especificar modelo customizado
OPENAI_MODEL=gpt-4-turbo
# ou
OPENAI_MODEL=gpt-4.1
```

Se não especificar, usa `gpt-4-turbo` por padrão.

---

## 📝 Notas

- **ChatGPT 4.1** é a versão mais recente disponível
- O nome exato do modelo pode variar na OpenAI Platform
- Use o modelo mais recente disponível na sua conta
- `gpt-4-turbo` geralmente corresponde ao ChatGPT 4.1

---

## ✅ Checklist

- [ ] Verificar qual modelo está disponível na sua conta OpenAI
- [ ] Configurar no Agent Builder: `gpt-4-turbo` ou `gpt-4.1`
- [ ] (Opcional) Adicionar `OPENAI_MODEL` no `.env.local` se quiser especificar

---

**Status:** ✅ Documentado para ChatGPT 4.1

