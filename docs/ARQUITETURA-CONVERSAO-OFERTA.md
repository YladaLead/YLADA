# Arquitetura de conversão: Método → Oferta → Checkout

Objetivo: **uma página de decisão enxuta** entre a landing do método e o checkout, sem duas páginas longas seguidas.

---

## Fluxo atual (Nutri)

| Etapa | Rota | Papel |
|-------|------|--------|
| 1. Landing do método | `/pt/sistema-conversas-ativas` | Apresentação do método, CTA único forte |
| 2. **Página de oferta** | `/pt/nutri/oferta` | Decisão: headline, benefício, o que recebe, planos, garantia, botão checkout |
| 3. Checkout | `/pt/nutri/checkout` | Pagamento |

A página institucional longa (`/pt/nutri`) continua existindo para tráfego que chega por “Conhecer a plataforma” ou links diretos; não faz parte do funil quente Método → Oferta → Checkout.

---

## Estrutura da página de oferta (oferta enxuta)

1. Headline forte  
2. Benefício direto (ex.: não é assinatura, é decisão; Noel)  
3. O que você recebe (lista curta)  
4. Planos (mensal / anual)  
5. Garantia  
6. Botão checkout  

Sem repetição institucional. Página de **decisão**, não de apresentação.

---

## Escala multi-área (futuro)

Padrão sugerido por segmento:

- `/pt/sistema-conversas-ativas` (ou `/pt/metodo`) → landing do método  
- `/pt/nutri/oferta` → oferta Nutri → `/pt/nutri/checkout`  
- `/pt/wellness/oferta` → oferta Wellness → checkout Wellness (quando existir)  
- `/pt/coach/oferta` → oferta Coach → checkout Coach  
- etc.

Cada área tem: **página institucional** (apresentação) + **página de oferta** (decisão) + **checkout**.
