# Imagens OG para Quizzes YLADA (WhatsApp)

## Objetivo

Links de quizzes compartilhados via WhatsApp (`/l/[slug]`) exibem uma **imagem de prévia fixa por tema/segmento**. Assim, a prévia é previsível e adequada ao assunto do quiz.

## Como funciona

1. **Rota**: `/l/[slug]` (ex: `https://ylada.app/l/abc123`)
2. **Metadata**: O layout `src/app/l/[slug]/layout.tsx` gera `og:image` dinamicamente
3. **Mapeamento**: `src/lib/ylada-og-tema-imagem.ts` mapeia tema + segmento → imagem
4. **Fontes de tema**: `config_json.meta.theme_raw`, `meta.theme`, ou título do link
5. **Fontes de segmento**: `config_json.meta.segment_code` ou `ylada_links.segment`

## Estrutura de pastas (única, compartilhada)

**Uma pasta única** — médico, nutricionista, fitness etc. usam a mesma imagem por tema.
Ex: Calculadora de IMC → `peso-gordura.jpg`, independente de quem usa.

```
public/images/og/ylada/
├── default.jpg
├── emagrecimento.jpg
├── intestino.jpg
├── metabolismo.jpg
├── energia.jpg
├── alimentacao.jpg
├── hidratacao.jpg
├── peso-gordura.jpg      ← IMC, composição, proteína
├── inchaço-retencao.jpg
├── rotina-saudavel.jpg
├── sono.jpg
├── estresse.jpg
├── foco.jpg
├── vitalidade.jpg
├── detox.jpg
├── performance.jpg
├── perfumaria-perfil.jpg
├── estetica-pele.jpg
├── estetica-rejuvenescimento.jpg
├── estetica-corporal.jpg
├── fitness-treino.jpg
├── medicina-prevencao.jpg
├── psicologia-ansiedade.jpg
├── odonto-saude.jpg
├── odonto-estetica.jpg
├── vendedor-energia.jpg
└── carreira.jpg
```

## Mapeamento tema → imagem

| Tema (normalizado) | Arquivo |
|--------------------|---------|
| emagrecimento | emagrecimento.jpg |
| intestino, digestao | intestino.jpg |
| metabolismo | metabolismo.jpg |
| energia | energia.jpg |
| alimentacao | alimentacao.jpg |
| hidratacao | hidratacao.jpg |
| peso_gordura | peso-gordura.jpg |
| inchaço_retencao, retencao | inchaço-retencao.jpg |
| rotina_saudavel | rotina-saudavel.jpg |
| sono | sono.jpg |
| estresse | estresse.jpg |
| foco_concentracao | foco.jpg |
| vitalidade_geral | vitalidade.jpg |
| detox | detox.jpg |
| performance | performance.jpg |
| preferencias_olfativas, familia_olfativa, perfil_olfativo | perfumaria-perfil.jpg |
| pele, autoestima, manchas, cabelos | estetica-pele.jpg |
| rejuvenescimento, antienvelhecimento | estetica-rejuvenescimento.jpg |
| gordura_localizada, celulite, flacidez, corporal | estetica-corporal.jpg |
| treino, recuperacao, resistencia, forca, consistencia | fitness-treino.jpg |
| ansiedade, emocoes, autoconhecimento, etc. | psicologia-ansiedade.jpg |
| saude_bucal, higiene_oral, halitose, sensibilidade | odonto-saude.jpg |
| estetica_dental, clareamento, implantes, ortodontia | odonto-estetica.jpg |
| prevencao, qualidade_vida, habitos, vitalidade | medicina-prevencao.jpg |
| b12_vitaminas, bem_estar | vendedor-energia.jpg |
| carreira, produtividade, vendas | carreira.jpg |

## Especificações técnicas

- **Formato**: JPG (recomendado) ou PNG
- **Dimensões**: 1200×630 px (proporção 1.91:1)
- **Tamanho**: < 500 KB por imagem
- **URL**: Sempre absoluta (ex: `https://ylada.app/images/og/ylada/nutrition/emagrecimento.jpg`)

## Checklist WhatsApp

1. [ ] Criar imagens em `public/images/og/ylada/{segmento}/`
2. [ ] Garantir que `default.jpg` existe em `ylada/` (ou fallback usa logo)
3. [ ] Testar URL da imagem diretamente no navegador
4. [ ] Usar [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) para raspar a URL
5. [ ] Compartilhar no WhatsApp e verificar prévia
6. [ ] Se aparecer imagem antiga: cache do WhatsApp (até 7 dias) — raspar novamente no debugger

## Fallback

- **Tema não mapeado**: usa imagem padrão do segmento (ex: médico → medicina-prevencao.jpg)
- **Segmento não mapeado**: usa `default.jpg`
- **Link inexistente**: usa logo YLADA

## Adicionar novo tema

1. Editar `src/lib/ylada-og-tema-imagem.ts`
2. Adicionar entrada em `TEMA_TO_IMAGE`: `'novo_tema': 'arquivo.jpg'`
3. Criar `public/images/og/ylada/{segmento}/arquivo.jpg`
