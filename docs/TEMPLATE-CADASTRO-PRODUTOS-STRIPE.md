# 📋 TEMPLATE: CADASTRO DE PRODUTOS NO STRIPE

## 🎯 PADRÃO YLADA PARA CADASTRO DE PRODUTOS

Este documento serve como guia para cadastrar produtos no Stripe de forma consistente e organizada.

---

## 📦 ESTRUTURA DO PRODUTO

### 1. Nome do Produto

**Formato:** `YLADA [Área] [País]`

**Exemplos:**
- `YLADA Wellness Brasil`
- `YLADA Pro Brasil`
- `YLADA Pro Colômbia`
- `YLADA Pro Estados Unidos`

---

### 2. Descrição do Produto

**Formato padrão:**

**Wellness:**
```
Plataforma Wellness [País] (sem coleta de dados). Inclui criação de links, portal básico e suporte padrão.
```

**Pro (Nutra/Nutri/Coach):**
```
Plataforma YLADA Pro [País] com coleta de dados, relatórios de engajamento, funis completos e suporte prioritário.
```

---

### 3. Etiqueta da Unidade

**Valor padrão:** `plano`

**Descrição:** Esta etiqueta aparece em recibos, faturas e no portal do cliente.

---

## 🏷️ METADADOS (OBRIGATÓRIOS)

Todos os produtos devem ter os seguintes metadados:

| Chave | Valor | Exemplo |
|-------|-------|---------|
| `area` | `wellness`, `nutri`, `coach`, `nutra` | `wellness` |
| `pais` | Código do país em minúsculas | `brasil`, `colombia`, `mexico`, `estados-unidos` |
| `tipo` | `assinatura` | `assinatura` |
| `plano` | `mensal` ou `anual` | `mensal` |

**Exemplo completo:**
```
area: wellness
pais: brasil
tipo: assinatura
plano: mensal
```

---

## ✨ LISTA DE RECURSOS DE MARKETING

### Template para Wellness:

1. **Baseado na filosofia YLADA: conectar, inspirar e transformar**
2. **Fluxos interativos, experiência ética e leve para ações de bem-estar**
3. **Crie conexões reais e fortaleça sua comunidade**
4. **Ideal para projetos de saúde**

### Template para Pro (Nutra/Nutri/Coach):

1. **Baseado na filosofia YLADA: conectar, inspirar e transformar**
2. **Coleta inteligente de dados para entender seu público**
3. **Relatórios detalhados de engajamento e conversão**
4. **Funis completos com automação e personalização**
5. **Suporte prioritário e onboarding dedicado**
6. **Ideal para profissionais que querem escalar seu negócio**

---

## 💰 CONFIGURAÇÃO DE PREÇOS

### Preço Mensal

- **Tipo:** `Recurring` → `Monthly`
- **Nome:** `YLADA [País] [Área] - Mensal`
- **Valor:** (conforme tabela de preços)
- **Moeda:** `BRL` (Brasil), `USD` (outros países), `EUR` (Europa)

### Preço Anual

- **Tipo:** `Recurring` → `Yearly`
- **Nome:** `YLADA [País] [Área] - Anual`
- **Valor:** (valor total anual - 33% desconto = 8 meses)
- **Moeda:** Mesma do mensal
- ⚠️ **Lembrete:** Stripe cobra o valor total de uma vez

---

## 📊 TABELA DE PREÇOS POR PAÍS

### Brasil

| Área | Mensal | Anual (Total) | Anual (Equivalente/mês) |
|------|--------|---------------|-------------------------|
| Wellness | R$ 59,90 | R$ 570,00 | R$ 47,50 |
| Pro | R$ 97,00 | R$ 776,00 | R$ 64,67 |

### Colômbia / México / Chile

| Área | Mensal | Anual (Total) | Anual (Equivalente/mês) |
|------|--------|---------------|-------------------------|
| Pro | USD $21 | USD $168 | USD $14 |

### Peru

| Área | Mensal | Anual (Total) | Anual (Equivalente/mês) |
|------|--------|---------------|-------------------------|
| Pro | USD $17 | USD $136 | USD $11,33 |

### Argentina

| Área | Mensal | Anual (Total) | Anual (Equivalente/mês) |
|------|--------|---------------|-------------------------|
| Pro | USD $15 | USD $120 | USD $10 |

### Estados Unidos / Canadá

| Área | Mensal | Anual (Total) | Anual (Equivalente/mês) |
|------|--------|---------------|-------------------------|
| Pro | USD $24 | USD $192 | USD $16 |

### Espanha

| Área | Mensal | Anual (Total) | Anual (Equivalente/mês) |
|------|--------|---------------|-------------------------|
| Pro | € 21,90 | € 175,20 | € 14,60 |

### Portugal

| Área | Mensal | Anual (Total) | Anual (Equivalente/mês) |
|------|--------|---------------|-------------------------|
| Pro | € 19,90 | € 159,20 | € 13,27 |

---

## ✅ CHECKLIST DE CADASTRO

### Antes de Criar:

- [ ] Definir qual área (Wellness ou Pro)
- [ ] Definir qual país
- [ ] Verificar valores na tabela de preços
- [ ] Preparar descrição do produto
- [ ] Preparar lista de recursos de marketing

### Durante a Criação:

- [ ] Nome do produto no formato correto
- [ ] Descrição preenchida
- [ ] Etiqueta da unidade: `plano`
- [ ] Metadados adicionados (4 campos obrigatórios)
- [ ] Lista de recursos de marketing adicionada
- [ ] Preço mensal criado
- [ ] Preço anual criado
- [ ] Price IDs copiados e salvos

### Após Criar:

- [ ] Price IDs adicionados na planilha de controle
- [ ] Price IDs adicionados nas variáveis de ambiente (se aplicável)
- [ ] Teste de checkout realizado (modo teste)
- [ ] Verificação de metadados no webhook

---

## 📝 EXEMPLO COMPLETO: Wellness Brasil

### Informações do Produto:

- **Nome:** `YLADA Wellness Brasil`
- **Descrição:** `Plataforma Wellness Brasil (sem coleta de dados). Inclui criação de links, portal básico e suporte padrão.`
- **Etiqueta da unidade:** `plano`

### Metadados:

```
area: wellness
pais: brasil
tipo: assinatura
plano: mensal (ou anual, dependendo do preço)
```

### Recursos de Marketing:

1. Baseado na filosofia YLADA: conectar, inspirar e transformar
2. Fluxos interativos, experiência ética e leve para ações de bem-estar
3. Crie conexões reais e fortaleça sua comunidade
4. Ideal para projetos de saúde

### Preços:

**Mensal:**
- Nome: `YLADA BR Wellness - Mensal`
- Valor: `59.90` BRL
- Billing: Monthly

**Anual:**
- Nome: `YLADA BR Wellness - Anual`
- Valor: `570.00` BRL
- Billing: Yearly

---

## 📝 EXEMPLO COMPLETO: Pro Brasil

### Informações do Produto:

- **Nome:** `YLADA Pro Brasil`
- **Descrição:** `Plataforma YLADA Pro Brasil com coleta de dados, relatórios de engajamento, funis completos e suporte prioritário.`
- **Etiqueta da unidade:** `plano`

### Metadados:

```
area: nutri (ou coach, ou nutra)
pais: brasil
tipo: assinatura
plano: mensal (ou anual)
```

### Recursos de Marketing:

1. Baseado na filosofia YLADA: conectar, inspirar e transformar
2. Coleta inteligente de dados para entender seu público
3. Relatórios detalhados de engajamento e conversão
4. Funis completos com automação e personalização
5. Suporte prioritário e onboarding dedicado
6. Ideal para profissionais que querem escalar seu negócio

### Preços:

**Mensal:**
- Nome: `YLADA BR Pro - Mensal`
- Valor: `97.00` BRL
- Billing: Monthly

**Anual:**
- Nome: `YLADA BR Pro - Anual`
- Valor: `776.00` BRL
- Billing: Yearly

---

## 🔄 BOAS PRÁTICAS

1. **Sempre use os metadados:** Facilitam filtros e relatórios no Stripe
2. **Mantenha consistência:** Use os mesmos recursos de marketing para produtos similares
3. **Copie os Price IDs:** Salve em planilha ou sistema de controle
4. **Teste antes de usar:** Sempre teste em modo Test antes de produção
5. **Documente mudanças:** Se alterar valores, atualize este documento

---

## 📞 DÚVIDAS FREQUENTES

**P: Posso adicionar mais metadados?**
R: Sim, mas mantenha os 4 obrigatórios. Adicione apenas se necessário.

**P: Os recursos de marketing são obrigatórios?**
R: Não, mas são altamente recomendados para melhorar conversão.

**P: Posso mudar os valores depois?**
R: Sim, mas crie um novo preço. Não edite preços existentes que já têm assinaturas ativas.

**P: Como saber qual moeda usar?**
R: Use BRL para Brasil, USD para países das Américas, EUR para Europa.

---

**Última atualização:** {{ data atual }}

**Versão:** 1.0

