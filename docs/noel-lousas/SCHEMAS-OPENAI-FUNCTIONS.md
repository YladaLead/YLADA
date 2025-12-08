# 📋 Schemas JSON para OpenAI Functions - NOEL

**Data:** 2025-01-27  
**Objetivo:** Schemas prontos para colar na configuração do OpenAI Assistant

---

## 🎯 Como Usar

1. Acesse o OpenAI Assistant Builder
2. Vá em "Functions" ou "Tools"
3. Cole cada schema abaixo
4. Configure as URLs dos endpoints (ex: `https://seu-dominio.com/api/noel/getUserProfile`)

---

## 📦 FUNCTION 1: getUserProfile

```json
{
  "type": "function",
  "function": {
    "name": "getUserProfile",
    "description": "Retorna o perfil completo do consultor do Supabase, incluindo nível, tempo disponível, estilo, objetivo, plano ativo e intensidade.",
    "parameters": {
      "type": "object",
      "properties": {
        "user_id": {
          "type": "string",
          "description": "ID único do consultor (UUID)"
        }
      },
      "required": ["user_id"]
    }
  }
}
```

**Endpoint:** `POST /api/noel/getUserProfile`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "nivel": "iniciante" | "ativo" | "produtivo" | "multiplicador" | "lider",
    "tempo_disponivel": "15-30 min" | "30-60 min" | "1-2h" | "2-3h" | "3-5h" | "5h+",
    "estilo": "string",
    "objetivo": "string",
    "plano_ativo_id": "uuid" | null,
    "intensidade": "string" | null
  }
}
```

---

## 📦 FUNCTION 2: saveInteraction

```json
{
  "type": "function",
  "function": {
    "name": "saveInteraction",
    "description": "Salva no Supabase a mensagem enviada pelo usuário e a resposta do Noel, criando memória longa e histórico de interações.",
    "parameters": {
      "type": "object",
      "properties": {
        "user_id": {
          "type": "string",
          "description": "ID único do consultor (UUID)"
        },
        "user_message": {
          "type": "string",
          "description": "Mensagem enviada pelo consultor"
        },
        "noel_response": {
          "type": "string",
          "description": "Resposta do NOEL"
        }
      },
      "required": ["user_id", "user_message", "noel_response"]
    }
  }
}
```

**Endpoint:** `POST /api/noel/saveInteraction`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "created_at": "2025-01-27T10:00:00Z"
  }
}
```

---

## 📦 FUNCTION 3: getPlanDay

```json
{
  "type": "function",
  "function": {
    "name": "getPlanDay",
    "description": "Retorna o dia atual do plano de 90 dias em que o consultor está, permitindo que o NOEL puxe rituais, tarefas e personalize ações.",
    "parameters": {
      "type": "object",
      "properties": {
        "user_id": {
          "type": "string",
          "description": "ID único do consultor (UUID)"
        }
      },
      "required": ["user_id"]
    }
  }
}
```

**Endpoint:** `POST /api/noel/getPlanDay`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "current_day": 15,
    "plan_id": "uuid" | null,
    "started_at": "2025-01-12T10:00:00Z" | null,
    "last_updated_at": "2025-01-27T10:00:00Z" | null
  }
}
```

---

## 📦 FUNCTION 4: updatePlanDay

```json
{
  "type": "function",
  "function": {
    "name": "updatePlanDay",
    "description": "Atualiza o dia do plano de 90 dias do consultor, mantendo o NOEL ciente da evolução diária.",
    "parameters": {
      "type": "object",
      "properties": {
        "user_id": {
          "type": "string",
          "description": "ID único do consultor (UUID)"
        },
        "new_day": {
          "type": "number",
          "description": "Novo dia do plano (1 a 90)",
          "minimum": 1,
          "maximum": 90
        }
      },
      "required": ["user_id", "new_day"]
    }
  }
}
```

**Endpoint:** `POST /api/noel/updatePlanDay`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "current_day": 16,
    "plan_id": "uuid" | null,
    "last_updated_at": "2025-01-27T10:00:00Z"
  }
}
```

---

## 📦 FUNCTION 5: registerLead

```json
{
  "type": "function",
  "function": {
    "name": "registerLead",
    "description": "Registra um novo cliente ou interessado no Supabase, permitindo que o NOEL acompanhe clientes, follow-up, kits vendidos, upgrade para Detox e rotina mensal.",
    "parameters": {
      "type": "object",
      "properties": {
        "user_id": {
          "type": "string",
          "description": "ID único do consultor (UUID)"
        },
        "lead_name": {
          "type": "string",
          "description": "Nome do cliente/interessado"
        },
        "lead_phone": {
          "type": "string",
          "description": "Telefone do cliente/interessado (opcional)"
        },
        "lead_source": {
          "type": "string",
          "description": "Origem do lead: 'indicacao', 'instagram', 'whatsapp', 'outro' (opcional)",
          "enum": ["indicacao", "instagram", "whatsapp", "outro"]
        }
      },
      "required": ["user_id", "lead_name"]
    }
  }
}
```

**Endpoint:** `POST /api/noel/registerLead`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "lead_name": "João Silva",
    "lead_phone": "+5511999999999",
    "lead_source": "indicacao",
    "status": "novo",
    "created_at": "2025-01-27T10:00:00Z"
  }
}
```

---

## 📦 FUNCTION 6: getClientData

```json
{
  "type": "function",
  "function": {
    "name": "getClientData",
    "description": "Retorna dados completos de um cliente específico, permitindo que o NOEL personalize acompanhamento, mensagens, recomendações e intensidades.",
    "parameters": {
      "type": "object",
      "properties": {
        "client_id": {
          "type": "string",
          "description": "ID único do cliente (UUID)"
        }
      },
      "required": ["client_id"]
    }
  }
}
```

**Endpoint:** `POST /api/noel/getClientData`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "client_name": "João Silva",
    "client_phone": "+5511999999999",
    "client_email": "joao@email.com" | null,
    "status": "ativo" | "inativo" | "pausado",
    "kits_vendidos": 2,
    "upgrade_detox": true,
    "rotina_mensal": true,
    "last_follow_up_at": "2025-01-25T10:00:00Z" | null,
    "next_follow_up_at": "2025-01-30T10:00:00Z" | null,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-27T10:00:00Z"
  }
}
```

---

## 🔧 Configuração no OpenAI

### **1. Adicionar Functions no Assistant**

No OpenAI Assistant Builder, adicione todas as 6 functions acima.

### **2. Configurar URLs dos Endpoints**

Para cada function, configure a URL do servidor:

```
https://seu-dominio.com/api/noel/getUserProfile
https://seu-dominio.com/api/noel/saveInteraction
https://seu-dominio.com/api/noel/getPlanDay
https://seu-dominio.com/api/noel/updatePlanDay
https://seu-dominio.com/api/noel/registerLead
https://seu-dominio.com/api/noel/getClientData
```

### **3. Autenticação**

As rotas usam `supabaseAdmin` que requer `SUPABASE_SERVICE_ROLE_KEY`.

Para chamadas do OpenAI, você pode:
- Usar autenticação via header (se configurado)
- Ou configurar RLS policies no Supabase para permitir acesso

---

## 📊 Estrutura de Resposta Padrão

Todas as rotas retornam:

**Sucesso:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Erro:**
```json
{
  "success": false,
  "error": "Mensagem de erro descritiva"
}
```

---

## ✅ Checklist de Implementação

- [x] Migration SQL criada (`migrations/010-criar-tabelas-noel-functions.sql`)
- [x] Rota `/api/noel/getUserProfile` criada
- [x] Rota `/api/noel/saveInteraction` criada
- [x] Rota `/api/noel/getPlanDay` criada
- [x] Rota `/api/noel/updatePlanDay` criada
- [x] Rota `/api/noel/registerLead` criada
- [x] Rota `/api/noel/getClientData` criada
- [x] Schemas JSON documentados
- [ ] Executar migration no Supabase
- [ ] Testar cada endpoint
- [ ] Configurar no OpenAI Assistant

---

**Status:** ✅ **IMPLEMENTAÇÃO COMPLETA - AGUARDANDO TESTES**
