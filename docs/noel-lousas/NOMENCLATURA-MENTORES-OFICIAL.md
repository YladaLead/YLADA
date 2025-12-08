# 📝 NOMENCLATURA OFICIAL DOS MENTORES — POR ÁREA

**Data:** 2025-01-06  
**Status:** ✅ Definição Oficial

---

## 🎯 ESTRUTURA DE NOMES

Cada área terá:
- **1 Mentor Principal** (estratégico, carreira, vendas)
- **1 Vendedor** (foco em conversão, scripts, fechamento)
- **1 Suporte** (dúvidas técnicas, uso do sistema)

---

## 💚 WELLNESS

### Mentor Principal: **NOEL**
- **Nome completo:** Núcleo de Orientação, Evolução e Liderança
- **Função:** Mentor estratégico, carreira, duplicação, metas
- **Código:** `noel-wellness` ou `noel`

### Vendedor: **VENDAS WELLNESS** (nome a definir)
- **Função:** Foco em vendas, scripts, fechamento, conversão
- **Código:** `vendedor-wellness`

### Suporte: **SUPORTE WELLNESS** (nome a definir)
- **Função:** Dúvidas técnicas, uso do sistema, ferramentas
- **Código:** `suporte-wellness`

---

## 🥗 NUTRI

### Mentor Principal: **NOME A DEFINIR**
- **Função:** Mentor estratégico, carreira, duplicação, metas
- **Código:** `mentor-nutri`

### Vendedor: **NOME A DEFINIR**
- **Função:** Foco em vendas, scripts, fechamento, conversão
- **Código:** `vendedor-nutri`

### Suporte: **NOME A DEFINIR**
- **Função:** Dúvidas técnicas, uso do sistema, ferramentas
- **Código:** `suporte-nutri`

---

## 💪 COACH

### Mentor Principal: **NOME A DEFINIR**
- **Função:** Mentor estratégico, carreira, duplicação, metas
- **Código:** `mentor-coach`

### Vendedor: **NOME A DEFINIR**
- **Função:** Foco em vendas, scripts, fechamento, conversão
- **Código:** `vendedor-coach`

### Suporte: **NOME A DEFINIR**
- **Função:** Dúvidas técnicas, uso do sistema, ferramentas
- **Código:** `suporte-coach`

---

## ⚡ ULTRA

### Mentor Principal: **NOME A DEFINIR**
- **Função:** Mentor estratégico, carreira, duplicação, metas
- **Código:** `mentor-ultra`

### Vendedor: **NOME A DEFINIR**
- **Função:** Foco em vendas, scripts, fechamento, conversão
- **Código:** `vendedor-ultra`

### Suporte: **NOME A DEFINIR**
- **Função:** Dúvidas técnicas, uso do sistema, ferramentas
- **Código:** `suporte-ultra`

---

## 📊 ESTRUTURA DE TABELAS (Por Área + Tipo)

### Wellness:
```
ylada_wellness_noel_base_conhecimento      (Mentor)
ylada_wellness_vendedor_base_conhecimento  (Vendedor)
ylada_wellness_suporte_base_conhecimento   (Suporte)

ylada_wellness_noel_objecoes
ylada_wellness_vendedor_objecoes
ylada_wellness_suporte_objecoes
```

### Nutri:
```
ylada_nutri_mentor_base_conhecimento
ylada_nutri_vendedor_base_conhecimento
ylada_nutri_suporte_base_conhecimento

ylada_nutri_mentor_objecoes
ylada_nutri_vendedor_objecoes
ylada_nutri_suporte_objecoes
```

### Coach:
```
ylada_coach_mentor_base_conhecimento
ylada_coach_vendedor_base_conhecimento
ylada_coach_suporte_base_conhecimento

ylada_coach_mentor_objecoes
ylada_coach_vendedor_objecoes
ylada_coach_suporte_objecoes
```

### Ultra:
```
ylada_ultra_mentor_base_conhecimento
ylada_ultra_vendedor_base_conhecimento
ylada_ultra_suporte_base_conhecimento

ylada_ultra_mentor_objecoes
ylada_ultra_vendedor_objecoes
ylada_ultra_suporte_objecoes
```

---

## 🔧 ESTRUTURA DE CÓDIGO

```
src/lib/
├── noel-wellness/
│   ├── mentor/          (NOEL - estratégico)
│   ├── vendedor/        (Vendedor - conversão)
│   └── suporte/         (Suporte - técnico)
│
├── noel-nutri/
│   ├── mentor/          (Mentor Nutri)
│   ├── vendedor/        (Vendedor Nutri)
│   └── suporte/         (Suporte Nutri)
│
├── noel-coach/
│   ├── mentor/          (Mentor Coach)
│   ├── vendedor/        (Vendedor Coach)
│   └── suporte/         (Suporte Coach)
│
└── noel-ultra/
    ├── mentor/          (Mentor Ultra)
    ├── vendedor/        (Vendedor Ultra)
    └── suporte/         (Suporte Ultra)
```

---

## 🎯 RECOMENDAÇÃO: ESTRUTURA SIMPLIFICADA

Para não criar muitas tabelas, podemos usar **1 tabela por área** com coluna `tipo_mentor`:

```sql
ylada_wellness_base_conhecimento (
  id,
  tipo_mentor,  -- 'noel' | 'vendedor' | 'suporte'
  categoria,
  titulo,
  conteudo,
  ...
)

ylada_nutri_base_conhecimento (
  id,
  tipo_mentor,  -- 'mentor' | 'vendedor' | 'suporte'
  categoria,
  titulo,
  conteudo,
  ...
)
```

**Vantagem:** Menos tabelas, mesma separação (filtro por `area` + `tipo_mentor`)

---

**Vou implementar com a estrutura simplificada (1 tabela por área + coluna tipo_mentor). Isso está ok?**

