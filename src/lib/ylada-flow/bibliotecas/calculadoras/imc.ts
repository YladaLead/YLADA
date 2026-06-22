// =====================================================
// MOLDE — Calculadora de IMC no contrato YladaFlow
// =====================================================
//
// Fonte: blueprint-plataforma/Chat5_Calculadoras_Revisao_Formulas.md §1
// Decisão B (Andre, 22/06): captura SEXO, mas o sexo NÃO entra na conta nem muda a
// faixa OMS (o número e a classificação são iguais p/ homem e mulher adultos). O sexo
// só PERSONALIZA A LEITURA (composição corporal difere) — via devolutiva.porFaixa[].porSexo.
//
// FÓRMULA (formulaId 'imc-oms-v1'): imc = peso_kg / (altura_cm/100)². Faixas OMS adulto.
// Tom: IMC é triagem, não diagnóstico; nunca constranger; sempre salvaguarda.
//
// STATUS: adição pura. Inert até o motor de calculadora ser generalizado (briefing Cursor).
// =====================================================

import type { YladaFlow } from '@/types/ylada-flow'

export const FLUXO_CALCULADORA_IMC: YladaFlow = {
  id: 'calc-imc',
  handle: 'imc',
  nome: 'Calculadora de IMC',
  objetivo: 'A pessoa descobre o próprio IMC, entende o que ele diz (e o que não diz) e abre conversa com quem enviou.',
  tenantId: '<rede da líder>',
  ownerId: '<líder/membro>',
  idiomaPadrao: 'pt',

  dimensoes: {
    frente: 'rede',
    nicho: 'pro-lideres',
    regiao: 'BR',
    funil: 'marketing',
    tipo: 'calculadora',
    finalidade: 'diagnostico-servico',
    governanca: ['bem-estar'],
  },

  abertura: {
    gancho: 'Descubra em 30 segundos o seu IMC e o que ele diz sobre o seu momento.',
    baixaFriccao: 'Sem cadastro · 3 perguntas · 30 seg · resultado na hora',
    autoridadeSutil: 'Usa a faixa oficial da OMS, com uma leitura que respeita o seu corpo.',
    ctaUnico: 'Calcular meu IMC',
    coerenciaOrigem: 'Continua a dica de quem te enviou (serve, não vende).',
  },

  origemEsperada: { canal: 'whatsapp', funil: 'marketing', temperatura: 'morno' },

  // Inputs: peso e altura entram na CONTA; sexo e idade só na LEITURA (Decisão B + extensão).
  // Régua refinada: vale perguntar o que muda o número OU a leitura de forma real.
  perguntas: [
    {
      id: 'peso',
      texto: 'Seu peso (kg)',
      tipo: 'numero',
      placeholder: 'Ex: 70.5',
      min: 30,
      max: 300,
      step: 0.1,
      papel: { alimentaLeitura: ['contexto'] },
    },
    {
      id: 'altura',
      texto: 'Sua altura (cm)',
      tipo: 'numero',
      placeholder: 'Ex: 170',
      min: 100,
      max: 250,
      step: 1,
      papel: { alimentaLeitura: ['contexto'] },
    },
    {
      id: 'idade',
      texto: 'Sua idade',
      tipo: 'numero',
      placeholder: 'Ex: 40',
      min: 18,
      max: 120,
      step: 1,
      // Não entra na conta; personaliza a leitura (faixa saudável sobe no idoso + sarcopenia).
      papel: { alimentaLeitura: ['perfil'] },
    },
    {
      id: 'sexo',
      texto: 'Você é:',
      tipo: 'multipla_escolha',
      opcoes: ['Mulher', 'Homem'], // engine mapeia → 'F' / 'M' (não entra na conta; personaliza a leitura)
      papel: { alimentaLeitura: ['perfil'] },
    },
  ],

  separacao2080: { regraId: 'servico-sem-prontidao-v1' },

  calculadora: {
    formulaId: 'imc-oms-v1',
    inputs: [
      { id: 'peso', unidade: 'kg', min: 30, max: 300 },
      { id: 'altura', unidade: 'cm', min: 100, max: 250 },
      { id: 'idade', unidade: 'anos', min: 18, max: 120 }, // só leitura
      { id: 'sexo', unidade: '' }, // só leitura
    ],
    unidadeSaida: 'kg/m²',
    casasDecimais: 1, // ex.: 22,9
    faixaSegura: { min: 10, max: 60 }, // IMC plausível
    salvaguarda: 'O IMC é uma triagem, não um diagnóstico, e não separa músculo de gordura. Para uma avaliação completa, fale com um profissional de saúde.',
  },

  devolutiva: {
    // Fallback (back-compat com o runtime atual). A leitura real é porFaixa.
    porPerfil: {
      pronto: {
        espelho: 'Seu IMC deu {imc} ({classificacao}).',
        causa: 'O IMC dá um primeiro retrato, mas não conta a história toda do seu corpo.',
        primeiroPasso: 'Pra entender o que esse número significa pra você, vale uma conversa com quem te enviou.',
        ctaWhatsApp: 'Quero entender melhor meu resultado',
      },
      curioso: {
        espelho: 'Seu IMC deu {imc} ({classificacao}).',
        causa: 'O IMC dá um primeiro retrato, mas não conta a história toda do seu corpo.',
        primeiroPasso: 'Pra entender o que esse número significa pra você, vale uma conversa com quem te enviou.',
        ctaWhatsApp: 'Quero entender melhor meu resultado',
      },
    },
    // Leitura por faixa OMS. porSexo personaliza onde a composição corporal pesa (Decisão B).
    porFaixa: [
      {
        id: 'abaixo',
        rotulo: 'Abaixo do peso',
        max: 18.5,
        bloco: {
          espelho: 'Seu IMC deu {imc}, que fica abaixo da faixa de peso saudável.',
          causa: 'Nem sempre é falta de comer. Metabolismo, correria e rotina alimentar entram nessa conta.',
          primeiroPasso: 'Vale montar com um nutricionista um cardápio que te leve a um peso confortável, com saúde e sem radicalismo.',
          ctaWhatsApp: 'Quero ajuda pra chegar num peso saudável',
        },
        porSexo: {
          F: { causa: 'Nem sempre é falta de comer. Em mulher, peso muito baixo também pode mexer com energia e com o ciclo, então vale atenção.' },
          M: { causa: 'Nem sempre é falta de comer. Em homem, peso baixo costuma vir junto de pouca massa muscular, que dá pra construir com orientação.' },
        },
      },
      {
        id: 'normal',
        rotulo: 'Peso normal',
        min: 18.5,
        max: 25,
        bloco: {
          espelho: 'Seu IMC deu {imc}, dentro da faixa de peso saudável. Bom sinal.',
          causa: 'Isso mostra que sua rotina está te servindo bem nesse ponto. O IMC, porém, não enxerga músculo nem gordura separados.',
          primeiroPasso: 'Mantenha o que funciona. Se quiser afinar energia ou composição corporal, dá pra evoluir com orientação.',
          ctaWhatsApp: 'Quero otimizar minha energia e composição',
        },
        porSexo: {
          F: { causa: 'Sua rotina está te servindo bem aqui. Mas o IMC não separa músculo de gordura, e mulher costuma ter mais gordura corporal no mesmo IMC, então o número sozinho engana um pouco.' },
          M: { causa: 'Sua rotina está te servindo bem aqui. Mas o IMC não separa músculo de gordura, e homem costuma ter mais massa muscular, que pode puxar o número pra cima sem ser gordura.' },
        },
        porIdade: [
          { de: 60, bloco: { causa: 'Está numa faixa boa. Depois dos 60, vale ficar de olho na massa muscular, que cai com a idade: dá pra ter peso "normal" e ainda assim ter perdido músculo. Força e proteína ajudam a manter.' } },
        ],
      },
      {
        id: 'sobrepeso',
        rotulo: 'Sobrepeso',
        min: 25,
        max: 30,
        bloco: {
          espelho: 'Seu IMC deu {imc}, que entra na faixa de sobrepeso.',
          causa: 'Isso quase nunca é só força de vontade. Sono, estresse, rotina e o dia a dia pesam junto, e ninguém faz isso sozinho.',
          primeiroPasso: 'Ajustes pequenos e sustentáveis costumam mover mais que dieta radical. Vale um plano com acompanhamento.',
          ctaWhatsApp: 'Quero um plano que caiba na minha rotina',
        },
        porSexo: {
          F: { espelho: 'Seu IMC deu {imc}, na faixa de sobrepeso. Lembrando que o IMC não distingue músculo de gordura, e em mulher a distribuição de gordura é diferente, então ele é só um ponto de partida.' },
          M: { espelho: 'Seu IMC deu {imc}, na faixa de sobrepeso. Lembrando que o IMC não distingue músculo de gordura, e quem tem mais massa muscular pode cair aqui sem excesso de gordura.' },
        },
        porIdade: [
          {
            de: 60,
            bloco: {
              espelho: 'Seu IMC deu {imc}, que a tabela chama de sobrepeso. Mas depois dos 60 a faixa saudável sobe um pouco: um IMC perto de 25 a 27 costuma ser tranquilo nessa idade, então não precisa soar alarme.',
              causa: 'O que pesa mais aqui não é o número em si, é manter músculo, força e disposição. O IMC sozinho não enxerga isso.',
            },
          },
        ],
      },
      {
        id: 'obesidade',
        rotulo: 'Obesidade',
        min: 30,
        bloco: {
          espelho: 'Seu IMC deu {imc}, na faixa de obesidade.',
          causa: 'É uma condição de saúde com várias causas, não um defeito seu. E é justamente onde acompanhamento faz a maior diferença.',
          primeiroPasso: 'O passo mais valioso é falar com um profissional de saúde pra montar um plano seguro, no seu ritmo, sem promessa milagrosa.',
          ctaWhatsApp: 'Quero conversar sobre um caminho seguro',
        },
        porIdade: [
          { de: 60, bloco: { causa: 'É uma condição de saúde com várias causas, não um defeito seu. Depois dos 60, o cuidado é perder gordura sem perder músculo: por isso acompanhamento profissional faz tanta diferença aqui.' } },
        ],
      },
    ],
  },

  ganchosIndicacao: [
    { etapa: 'compartilhar-devolutiva', frase: 'Conhece alguém que ia querer entender o próprio número? Manda essa calculadora.' },
  ],

  handoff: {
    templateId: 'handoff-padrao',
    captacaoDados: false,
    inclui: { resumoRespostas: true, classificacao2080: true, scriptSugerido: true },
  },

  origemBiblioteca: 'biblioteca-calculadoras-servico-v1',
  tags: ['calculadora', 'imc', 'saude', 'servico', 'pro-lideres'],
}

export default FLUXO_CALCULADORA_IMC
