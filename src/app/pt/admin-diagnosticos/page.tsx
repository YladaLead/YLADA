'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import YLADALogo from '../../../components/YLADALogo'

// Lista das 60 ferramentas YLADA (Catálogo Completo)
const ferramentasYLADA = [
  { id: 'quiz-interativo', nome: 'Quiz Interativo', categoria: 'Atrair Leads', objetivo: 'Atrair leads frios', icon: '🎯' },
  { id: 'quiz-bem-estar', nome: 'Quiz de Bem-Estar', categoria: 'Engajamento', objetivo: 'Engajamento', icon: '🧘‍♀️' },
  { id: 'quiz-perfil-nutricional', nome: 'Quiz de Perfil Nutricional', categoria: 'Diagnóstico', objetivo: 'Diagnóstico inicial', icon: '🥗' },
  { id: 'quiz-detox', nome: 'Quiz Detox', categoria: 'Captação', objetivo: 'Captação + curiosidade', icon: '🧽' },
  { id: 'quiz-energetico', nome: 'Quiz Energético', categoria: 'Segmentação', objetivo: 'Segmentação', icon: '⚡' },
  { id: 'calculadora-imc', nome: 'Calculadora de IMC', categoria: 'Avaliação', objetivo: 'Avaliação corporal', icon: '📊' },
  { id: 'calculadora-proteina', nome: 'Calculadora de Proteína', categoria: 'Nutrição', objetivo: 'Recomendação nutricional', icon: '🥩' },
  { id: 'calculadora-agua', nome: 'Calculadora de Água', categoria: 'Engajamento', objetivo: 'Engajamento leve', icon: '💧' },
  { id: 'calculadora-calorias', nome: 'Calculadora de Calorias', categoria: 'Diagnóstico', objetivo: 'Diagnóstico', icon: '🔥' },
  { id: 'checklist-detox', nome: 'Checklist Detox', categoria: 'Educação', objetivo: 'Educação rápida', icon: '📋' },
  { id: 'checklist-alimentar', nome: 'Checklist Alimentar', categoria: 'Avaliação', objetivo: 'Avaliação de hábitos', icon: '🍽️' },
  { id: 'mini-ebook', nome: 'Mini E-book Educativo', categoria: 'Autoridade', objetivo: 'Autoridade', icon: '📚' },
  { id: 'guia-nutraceutico', nome: 'Guia Nutracêutico', categoria: 'Atração', objetivo: 'Atração de interesse', icon: '💊' },
  { id: 'guia-proteico', nome: 'Guia Proteico', categoria: 'Especialização', objetivo: 'Especialização', icon: '🥛' },
  { id: 'tabela-comparativa', nome: 'Tabela Comparativa', categoria: 'Conversão', objetivo: 'Conversão', icon: '📊' },
  { id: 'tabela-substituicoes', nome: 'Tabela de Substituições', categoria: 'Valor', objetivo: 'Valor agregado', icon: '🔄' },
  { id: 'tabela-sintomas', nome: 'Tabela de Sintomas', categoria: 'Diagnóstico', objetivo: 'Diagnóstico leve', icon: '🩺' },
  { id: 'plano-alimentar-base', nome: 'Plano Alimentar Base', categoria: 'Valor', objetivo: 'Valor prático', icon: '📅' },
  { id: 'planner-refeicoes', nome: 'Planner de Refeições', categoria: 'Organização', objetivo: 'Organização', icon: '🗓️' },
  { id: 'rastreador-alimentar', nome: 'Rastreador Alimentar', categoria: 'Acompanhamento', objetivo: 'Acompanhamento', icon: '📈' },
  { id: 'diario-alimentar', nome: 'Diário Alimentar', categoria: 'Engajamento', objetivo: 'Engajamento', icon: '📝' },
  { id: 'tabela-metas-semanais', nome: 'Tabela de Metas Semanais', categoria: 'Motivação', objetivo: 'Motivação', icon: '🎯' },
  { id: 'template-desafio-7dias', nome: 'Template de Desafio 7 Dias', categoria: 'Gamificação', objetivo: 'Gamificação', icon: '🏆' },
  { id: 'template-desafio-21dias', nome: 'Template de Desafio 21 Dias', categoria: 'Comprometimento', objetivo: 'Comprometimento', icon: '📅' },
  { id: 'guia-hidratacao', nome: 'Guia de Hidratação', categoria: 'Educação', objetivo: 'Educação visual', icon: '💧' },
  { id: 'infografico-educativo', nome: 'Infográfico Educativo', categoria: 'Autoridade', objetivo: 'Autoridade', icon: '📊' },
  { id: 'template-receitas', nome: 'Template de Receitas', categoria: 'Valor', objetivo: 'Valor prático', icon: '👨‍🍳' },
  { id: 'cardapio-detox', nome: 'Cardápio Detox', categoria: 'Conversão', objetivo: 'Conversão indireta', icon: '🥗' },
  { id: 'simulador-resultados', nome: 'Simulador de Resultados', categoria: 'Curiosidade', objetivo: 'Curiosidade', icon: '🔮' },
  { id: 'template-avaliacao-inicial', nome: 'Template de Avaliação Inicial', categoria: 'Captação', objetivo: 'Captação', icon: '📋' },
  { id: 'formulario-recomendacao', nome: 'Formulário de Recomendação', categoria: 'Diagnóstico', objetivo: 'Diagnóstico rápido', icon: '📝' },
  { id: 'template-acompanhamento-semanal', nome: 'Template de Acompanhamento Semanal', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '📊' },
  { id: 'template-checkin-mensal', nome: 'Template de Check-in Mensal', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '📅' },
  { id: 'ficha-cliente', nome: 'Ficha de Cliente', categoria: 'Profissionalização', objetivo: 'Profissionalização', icon: '📋' },
  { id: 'template-progresso-visual', nome: 'Template de Progresso Visual', categoria: 'Engajamento', objetivo: 'Engajamento', icon: '📈' },
  { id: 'template-story-interativo', nome: 'Template de Story Interativo', categoria: 'Engajamento', objetivo: 'Engajamento nas redes', icon: '📱' },
  { id: 'post-curiosidades', nome: 'Post de Curiosidades', categoria: 'Autoridade', objetivo: 'Autoridade', icon: '💡' },
  { id: 'template-post-dica', nome: 'Template de Post com Dica', categoria: 'Conteúdo', objetivo: 'Conteúdo recorrente', icon: '📝' },
  { id: 'template-reels-roteirizado', nome: 'Template de Reels Roteirizado', categoria: 'Atração', objetivo: 'Atração visual', icon: '🎬' },
  { id: 'template-artigo-curto', nome: 'Template de Artigo Curto', categoria: 'Autoridade', objetivo: 'Autoridade escrita', icon: '📄' },
  { id: 'template-catalogo-digital', nome: 'Template de Catálogo Digital', categoria: 'Conversão', objetivo: 'Conversão direta', icon: '📱' },
  { id: 'simulador-ganho', nome: 'Simulador de Ganho', categoria: 'Recrutamento', objetivo: 'Recrutamento', icon: '💰' },
  { id: 'template-oportunidade', nome: 'Template de Oportunidade', categoria: 'Recrutamento', objetivo: 'Recrutamento', icon: '🚀' },
  { id: 'template-apresentacao-negocio', nome: 'Template de Apresentação de Negócio', categoria: 'Recrutamento', objetivo: 'Recrutamento', icon: '📊' },
  { id: 'template-script-convite', nome: 'Template de Script de Convite', categoria: 'Duplicação', objetivo: 'Duplicação', icon: '💬' },
  { id: 'template-onboarding-parceiro', nome: 'Template de Onboarding de Parceiro', categoria: 'Recrutamento', objetivo: 'Recrutamento', icon: '👥' },
  { id: 'template-plano-acao-equipe', nome: 'Template de Plano de Ação da Equipe', categoria: 'Gestão', objetivo: 'Gestão', icon: '📋' },
  { id: 'template-feedback-cliente', nome: 'Template de Feedback de Cliente', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '⭐' },
  { id: 'template-mensagem-pos-compra', nome: 'Template de Mensagem Pós-Compra', categoria: 'Retenção', objetivo: 'Retenção', icon: '🎉' },
  { id: 'template-email-reposicao', nome: 'Template de E-mail de Reposição', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '📧' },
  { id: 'template-aniversario', nome: 'Template de Aniversário', categoria: 'Relacionamento', objetivo: 'Relacionamento', icon: '🎂' },
  { id: 'template-recompensa-cashback', nome: 'Template de Recompensa / Cashback', categoria: 'Fidelização', objetivo: 'Fidelização', icon: '🎁' },
  { id: 'template-agradecimento', nome: 'Template de Agradecimento', categoria: 'Relacionamento', objetivo: 'Relacionamento', icon: '🙏' },
  { id: 'template-plano-semanal-conteudo', nome: 'Template de Plano Semanal de Conteúdo', categoria: 'Organização', objetivo: 'Organização', icon: '📅' },
  { id: 'template-reels-educativo', nome: 'Template de Reels Educativo', categoria: 'Engajamento', objetivo: 'Engajamento', icon: '🎓' },
  { id: 'template-conteudo-autoridade', nome: 'Template de Conteúdo de Autoridade', categoria: 'Branding', objetivo: 'Branding', icon: '👑' },
  { id: 'template-testemunho-visual', nome: 'Template de Testemunho Visual', categoria: 'Prova Social', objetivo: 'Prova social', icon: '💬' },
  { id: 'template-calendario-postagens', nome: 'Template de Calendário de Postagens', categoria: 'Organização', objetivo: 'Organização', icon: '📅' },
  { id: 'template-estrategia-lancamento', nome: 'Template de Estratégia de Lançamento', categoria: 'Negócio', objetivo: 'Negócio', icon: '🚀' },
  { id: 'template-jornada-cliente', nome: 'Template de Jornada do Cliente', categoria: 'Estratégico', objetivo: 'Estratégico', icon: '🗺️' }
]

// Sistema completo de diagnósticos por profissão e ferramenta
const diagnosticosCompletos = {
  // 1. CALCULADORA DE IMC
  'calculadora-imc': {
    nutri: {
      baixoPeso: [
        '📋 Avaliação nutricional completa para ganho de peso saudável',
        '🥗 Plano alimentar hipercalórico e nutritivo',
        '💊 Suplementação para aumento de massa muscular',
        '📅 Acompanhamento nutricional semanal'
      ],
      pesoNormal: [
        '📋 Manutenção do peso com alimentação equilibrada',
        '🥗 Plano alimentar para otimização da saúde',
        '💪 Estratégias para ganho de massa muscular',
        '📅 Consultas de manutenção mensais'
      ],
      sobrepeso: [
        '📋 Plano alimentar para redução de peso',
        '🥗 Reeducação alimentar e mudança de hábitos',
        '💊 Suplementação para controle do apetite',
        '📅 Acompanhamento nutricional quinzenal'
      ],
      obesidade: [
        '📋 Plano alimentar para redução de peso',
        '🥗 Reeducação alimentar completa',
        '💊 Suplementação para controle metabólico',
        '📅 Acompanhamento nutricional semanal intensivo'
      ]
    },
    sales: {
      baixoPeso: [
        '💊 Whey Protein para ganho de massa muscular',
        '🍯 Maltodextrina para aumento calórico',
        '🥛 Mass Gainer para ganho de peso',
        '📞 Consultoria personalizada de suplementação'
      ],
      pesoNormal: [
        '💊 Multivitamínicos para otimização da saúde',
        '🥗 Proteínas para manutenção muscular',
        '💪 Creatina para performance física',
        '📞 Consultoria de suplementação preventiva'
      ],
      sobrepeso: [
        '💊 Termogênicos para aceleração metabólica',
        '🥗 Proteínas para preservação muscular',
        '💪 L-Carnitina para queima de gordura',
        '📞 Consultoria de suplementação para emagrecimento'
      ],
      obesidade: [
        '💊 Suplementos para controle metabólico',
        '🥗 Proteínas para preservação muscular',
        '💪 Suplementos para redução de apetite',
        '📞 Consultoria especializada em suplementação'
      ]
    },
    coach: {
      baixoPeso: [
        '🧘‍♀️ Programa de ganho de peso saudável',
        '💪 Treinos para aumento de massa muscular',
        '🍎 Coaching nutricional para ganho de peso',
        '📅 Acompanhamento semanal de transformação'
      ],
      pesoNormal: [
        '🧘‍♀️ Programa de otimização da saúde',
        '💪 Treinos para manutenção e performance',
        '🍎 Coaching de hábitos saudáveis',
        '📅 Acompanhamento mensal de bem-estar'
      ],
      sobrepeso: [
        '🧘‍♀️ Programa de transformação corporal',
        '💪 Treinos para redução de peso',
        '🍎 Coaching de mudança de hábitos',
        '📅 Acompanhamento quinzenal de progresso'
      ],
      obesidade: [
        '🧘‍♀️ Programa intensivo de transformação',
        '💪 Treinos adaptados para início da jornada',
        '🍎 Coaching completo de mudança de vida',
        '📅 Acompanhamento semanal intensivo'
      ]
    }
  },

  // 2. QUIZ INTERATIVO (Metabolismo)
  'quiz-interativo': {
    nutri: {
      metabolismoLento: [
        '📋 Seu metabolismo está pedindo um olhar profissional',
        '🍎 Pequenas correções nutricionais e ajustes nos horários das refeições podem acelerar o metabolismo naturalmente',
        '⏰ Com um acompanhamento personalizado, você pode ver resultados em até 15 dias',
        '✅ CTA: Quero uma avaliação nutricional personalizada'
      ],
      metabolismoEquilibrado: [
        '📋 Seu metabolismo está estável, mas com espaço para otimização',
        '🍏 Um plano nutricional de precisão pode melhorar absorção, reduzir fadiga e manter o equilíbrio natural do corpo',
        '📅 CTA: Quero meu plano personalizado com nutricionista',
        '🎯 Gatilhos: autoridade + aprimoramento'
      ],
      metabolismoAcelerado: [
        '📋 Seu metabolismo rápido pode estar pedindo nutrientes estabilizadores',
        '🥦 Uma dieta com equilíbrio entre proteína, gordura e carboidrato ajuda a evitar oscilações de energia e compulsão alimentar',
        '📞 CTA: Quero ajustar minha alimentação com ajuda profissional',
        '🎯 Gatilhos: equilíbrio, segurança, autocuidado'
      ]
    },
    sales: {
      metabolismoLento: [
        '💊 Seu corpo mostra sinais claros de carência de nutrientes essenciais',
        '⚡ Quando faltam vitaminas e minerais, o metabolismo entra em \"modo de economia\"',
        '💬 CTA: Quero ver os suplementos ideais para o meu tipo de metabolismo',
        '🎯 Gatilhos: personalização, autoridade científica, praticidade'
      ],
      metabolismoEquilibrado: [
        '💊 Seu metabolismo está bom, mas pode ganhar performance com suporte nutricional específico',
        '⚡ Suplementos certos potencializam absorção, energia e foco, evitando desequilíbrios',
        '⚡ CTA: Ver suplementos que mantêm o equilíbrio metabólico',
        '🎯 Gatilhos: manutenção, performance, conveniência'
      ],
      metabolismoAcelerado: [
        '💊 Seu corpo está acelerado e precisa de apoio antioxidante e restaurador',
        '⚡ Alguns nutracêuticos ajudam a reduzir estresse oxidativo e manter foco, sem perder vitalidade',
        '💊 CTA: Ver suplementos para estabilidade e foco',
        '🎯 Gatilhos: equilíbrio, desempenho, prevenção'
      ]
    },
    coach: {
      metabolismoLento: [
        '🌱 Seu metabolismo está em modo lento, e isso reflete diretamente na sua energia e disposição mental',
        '🌿 A primeira mudança não é no prato — é na rotina. Vamos ajustar sono, hidratação e movimento com um plano simples de 7 dias',
        '🌿 CTA: Quero começar o desafio de 7 dias',
        '🎯 Gatilhos: empoderamento, leveza, pertencimento'
      ],
      metabolismoEquilibrado: [
        '🌼 Você está equilibrado — mas é provável que sua rotina precise de ajustes estratégicos para manter essa constância',
        '🌿 O Desafio de 7 Dias vai te ajudar a fortalecer seus hábitos e manter o foco no que realmente importa',
        '🌿 CTA: Quero reforçar minha rotina saudável',
        '🎯 Gatilhos: evolução contínua, comunidade, comprometimento'
      ],
      metabolismoAcelerado: [
        '🔆 Você é naturalmente ativo(a), mas talvez esteja acelerando demais',
        '🌿 Vamos usar técnicas de respiração, foco e alimentação consciente para ajudar seu corpo a manter ritmo e paz interna',
        '🌿 CTA: Quero aprender a equilibrar minha energia',
        '🎯 Gatilhos: autoconsciência, estabilidade, leveza'
      ]
    }
  },

  // 3. QUIZ DE BEM-ESTAR
  'quiz-bem-estar': {
    nutri: {
      baixoBemEstar: [
        '📋 Avaliação completa de bem-estar nutricional',
        '🥗 Plano alimentar para melhoria do humor',
        '💊 Suplementos para equilíbrio emocional',
        '📅 Acompanhamento nutricional terapêutico'
      ],
      bemEstarModerado: [
        '📋 Otimização nutricional para bem-estar',
        '🥗 Plano alimentar para manutenção do humor',
        '💊 Suplementos de apoio emocional',
        '📅 Consultas de manutenção do bem-estar'
      ],
      altoBemEstar: [
        '📋 Manutenção nutricional do bem-estar',
        '🥗 Plano alimentar para sustentação energética',
        '💊 Suplementos preventivos de bem-estar',
        '📅 Acompanhamento preventivo nutricional'
      ]
    },
    sales: {
      baixoBemEstar: [
        '💊 Suplementos para equilíbrio emocional',
        '🥗 Proteínas para estabilização do humor',
        '💪 Suplementos para energia e disposição',
        '📞 Consultoria de suplementação para bem-estar'
      ],
      bemEstarModerado: [
        '💊 Multivitamínicos para suporte emocional',
        '🥗 Proteínas para manutenção energética',
        '💪 Suplementos de performance mental',
        '📞 Consultoria preventiva de bem-estar'
      ],
      altoBemEstar: [
        '💊 Suplementos para sustentação do bem-estar',
        '🥗 Proteínas para otimização energética',
        '💪 Suplementos de manutenção',
        '📞 Consultoria especializada em bem-estar'
      ]
    },
    coach: {
      baixoBemEstar: [
        '🧘‍♀️ Programa intensivo de bem-estar',
        '💪 Treinos para melhoria do humor',
        '🍎 Coaching nutricional terapêutico',
        '📅 Acompanhamento semanal de transformação'
      ],
      bemEstarModerado: [
        '🧘‍♀️ Programa de otimização do bem-estar',
        '💪 Treinos para manutenção energética',
        '🍎 Coaching de hábitos de bem-estar',
        '📅 Acompanhamento mensal de progresso'
      ],
      altoBemEstar: [
        '🧘‍♀️ Programa de sustentação do bem-estar',
        '💪 Treinos para manutenção da performance',
        '🍎 Coaching preventivo de bem-estar',
        '📅 Acompanhamento preventivo especializado'
      ]
    }
  },

  // 11. MINI E-BOOK EDUCATIVO
  'mini-ebook': {
    nutri: {
      baixoConhecimento: [
        '📋 E-book completo sobre nutrição básica',
        '🥗 Guia prático de alimentação saudável',
        '💊 Informações sobre suplementação',
        '📅 Consulta nutricional educativa'
      ],
      conhecimentoModerado: [
        '📋 E-book sobre nutrição avançada',
        '🥗 Guia de otimização nutricional',
        '💊 Suplementação específica por objetivo',
        '📅 Consulta nutricional especializada'
      ],
      altoConhecimento: [
        '📋 E-book sobre nutrição de alta performance',
        '🥗 Guia de nutrição esportiva',
        '💊 Suplementação de elite',
        '📅 Consulta nutricional de performance'
      ]
    },
    sales: {
      baixoConhecimento: [
        '💊 E-book sobre suplementos básicos',
        '🥗 Guia de produtos nutricionais',
        '💪 Informações sobre suplementação',
        '📞 Consultoria educativa em suplementos'
      ],
      conhecimentoModerado: [
        '💊 E-book sobre suplementos avançados',
        '🥗 Guia de produtos especializados',
        '💪 Suplementação por objetivo',
        '📞 Consultoria especializada em produtos'
      ],
      altoConhecimento: [
        '💊 E-book sobre suplementos de elite',
        '🥗 Guia de produtos de alta performance',
        '💪 Suplementação profissional',
        '📞 Consultoria premium em suplementos'
      ]
    },
    coach: {
      baixoConhecimento: [
        '🧘‍♀️ E-book sobre bem-estar básico',
        '💪 Guia de exercícios fundamentais',
        '🍎 Coaching nutricional educativo',
        '📅 Programa de transformação inicial'
      ],
      conhecimentoModerado: [
        '🧘‍♀️ E-book sobre bem-estar avançado',
        '💪 Guia de treinos especializados',
        '🍎 Coaching nutricional específico',
        '📅 Programa de transformação intermediário'
      ],
      altoConhecimento: [
        '🧘‍♀️ E-book sobre bem-estar de elite',
        '💪 Guia de treinos de alta performance',
        '🍎 Coaching nutricional profissional',
        '📅 Programa de transformação avançado'
      ]
    }
  },

  // 12. GUIA NUTRACÊUTICO
  'guia-nutraceutico': {
    nutri: {
      baixoInteresse: [
        '📋 Guia básico de nutracêuticos',
        '🥗 Informações sobre alimentos funcionais',
        '💊 Suplementação preventiva',
        '📅 Consulta nutricional preventiva'
      ],
      interesseModerado: [
        '📋 Guia avançado de nutracêuticos',
        '🥗 Alimentos funcionais específicos',
        '💊 Suplementação direcionada',
        '📅 Consulta nutricional especializada'
      ],
      altoInteresse: [
        '📋 Guia especializado em nutracêuticos',
        '🥗 Alimentos funcionais de alta qualidade',
        '💊 Suplementação de precisão',
        '📅 Consulta nutricional de alta performance'
      ]
    },
    sales: {
      baixoInteresse: [
        '💊 Guia básico de produtos nutracêuticos',
        '🥗 Produtos funcionais essenciais',
        '💪 Suplementação preventiva',
        '📞 Consultoria básica em nutracêuticos'
      ],
      interesseModerado: [
        '💊 Guia avançado de nutracêuticos',
        '🥗 Produtos funcionais específicos',
        '💪 Suplementação direcionada',
        '📞 Consultoria especializada em produtos'
      ],
      altoInteresse: [
        '💊 Guia premium de nutracêuticos',
        '🥗 Produtos funcionais de elite',
        '💪 Suplementação de precisão',
        '📞 Consultoria premium em nutracêuticos'
      ]
    },
    coach: {
      baixoInteresse: [
        '🧘‍♀️ Guia básico de bem-estar natural',
        '💪 Exercícios com foco em saúde',
        '🍎 Coaching nutricional preventivo',
        '📅 Programa de bem-estar inicial'
      ],
      interesseModerado: [
        '🧘‍♀️ Guia avançado de bem-estar natural',
        '💪 Treinos com foco em performance',
        '🍎 Coaching nutricional específico',
        '📅 Programa de bem-estar intermediário'
      ],
      altoInteresse: [
        '🧘‍♀️ Guia especializado em bem-estar natural',
        '💪 Treinos de alta performance natural',
        '🍎 Coaching nutricional profissional',
        '📅 Programa de bem-estar avançado'
      ]
    }
  },

  // 13. GUIA PROTEICO
  'guia-proteico': {
    nutri: {
      baixaProteina: [
        '📋 Guia completo de proteínas',
        '🥗 Plano alimentar rico em proteínas',
        '💊 Suplementação proteica específica',
        '📅 Consulta nutricional proteica'
      ],
      proteinaModerada: [
        '📋 Guia de otimização proteica',
        '🥗 Plano alimentar balanceado',
        '💊 Suplementação proteica preventiva',
        '📅 Consulta nutricional especializada'
      ],
      altaProteina: [
        '📋 Guia de performance proteica',
        '🥗 Plano alimentar de alta qualidade',
        '💊 Suplementação proteica avançada',
        '📅 Consulta nutricional de performance'
      ]
    },
    sales: {
      baixaProteina: [
        '💊 Guia completo de suplementos proteicos',
        '🥗 Produtos proteicos essenciais',
        '💪 Suplementação proteica básica',
        '📞 Consultoria especializada em proteínas'
      ],
      proteinaModerada: [
        '💊 Guia de otimização proteica',
        '🥗 Produtos proteicos balanceados',
        '💪 Suplementação proteica moderada',
        '📞 Consultoria preventiva proteica'
      ],
      altaProteina: [
        '💊 Guia de performance proteica',
        '🥗 Produtos proteicos de alta qualidade',
        '💪 Suplementação proteica avançada',
        '📞 Consultoria premium em proteínas'
      ]
    },
    coach: {
      baixaProteina: [
        '🧘‍♀️ Guia de treinos para ganho muscular',
        '💪 Exercícios focados em massa muscular',
        '🍎 Coaching nutricional proteico',
        '📅 Programa de ganho muscular'
      ],
      proteinaModerada: [
        '🧘‍♀️ Guia de treinos balanceados',
        '💪 Exercícios para manutenção muscular',
        '🍎 Coaching nutricional equilibrado',
        '📅 Programa de manutenção muscular'
      ],
      altaProteina: [
        '🧘‍♀️ Guia de treinos de alta performance',
        '💪 Exercícios para performance muscular',
        '🍎 Coaching nutricional de elite',
        '📅 Programa de performance muscular'
      ]
    }
  },

  // 14. TABELA COMPARATIVA
  'tabela-comparativa': {
    nutri: [
      '📋 Análise comparativa de produtos',
      '🥗 Recomendações baseadas em evidências',
      '💊 Suplementação personalizada',
      '📅 Consulta nutricional comparativa'
    ],
    sales: [
      '💊 Comparativo detalhado de produtos',
      '🥗 Produtos recomendados por categoria',
      '💪 Suplementação direcionada',
      '📞 Consultoria comparativa em produtos'
    ],
    coach: [
      '🧘‍♀️ Comparativo de estratégias de treino',
      '💪 Exercícios recomendados por objetivo',
      '🍎 Coaching nutricional comparativo',
      '📅 Programa de treino personalizado'
    ]
  },

  // 15. TABELA DE SUBSTITUIÇÕES
  'tabela-substituicoes': {
    nutri: [
      '📋 Guia completo de substituições alimentares',
      '🥗 Alternativas nutritivas por categoria',
      '💊 Suplementação para substituições',
      '📅 Consulta nutricional de substituições'
    ],
    sales: [
      '💊 Guia de produtos substitutos',
      '🥗 Alternativas por categoria de produto',
      '💪 Suplementação para substituições',
      '📞 Consultoria em produtos substitutos'
    ],
    coach: [
      '🧘‍♀️ Guia de exercícios substitutos',
      '💪 Alternativas de treino por objetivo',
      '🍎 Coaching nutricional de substituições',
      '📅 Programa de treino adaptado'
    ]
  },

  // 16. TABELA DE SINTOMAS
  'tabela-sintomas': {
    nutri: [
      '📋 Análise nutricional de sintomas',
      '🥗 Plano alimentar para correção',
      '💊 Suplementação para sintomas específicos',
      '📅 Consulta nutricional terapêutica'
    ],
    sales: [
      '💊 Produtos para sintomas específicos',
      '🥗 Suplementação direcionada',
      '💪 Produtos de apoio terapêutico',
      '📞 Consultoria em produtos terapêuticos'
    ],
    coach: [
      '🧘‍♀️ Programa de bem-estar para sintomas',
      '💪 Exercícios adaptados para sintomas',
      '🍎 Coaching nutricional terapêutico',
      '📅 Programa de transformação terapêutica'
    ]
  },

  // 17. PLANO ALIMENTAR BASE
  'plano-alimentar-base': {
    nutri: [
      '📋 Plano alimentar personalizado',
      '🥗 Cardápio baseado em necessidades',
      '💊 Suplementação complementar',
      '📅 Acompanhamento nutricional semanal'
    ],
    sales: [
      '💊 Produtos complementares ao plano',
      '🥗 Suplementação para o plano alimentar',
      '💪 Produtos de apoio nutricional',
      '📞 Consultoria em produtos complementares'
    ],
    coach: [
      '🧘‍♀️ Programa de transformação alimentar',
      '💪 Exercícios complementares ao plano',
      '🍎 Coaching nutricional do plano',
      '📅 Acompanhamento do plano alimentar'
    ]
  },

  // 18. PLANNER DE REFEIÇÕES
  'planner-refeicoes': {
    nutri: [
      '📋 Planner personalizado de refeições',
      '🥗 Organização semanal de cardápio',
      '💊 Suplementação integrada ao planner',
      '📅 Acompanhamento do planner semanal'
    ],
    sales: [
      '💊 Produtos para o planner de refeições',
      '🥗 Suplementação integrada',
      '💪 Produtos de apoio ao planner',
      '📞 Consultoria em produtos do planner'
    ],
    coach: [
      '🧘‍♀️ Programa de organização alimentar',
      '💪 Exercícios integrados ao planner',
      '🍎 Coaching do planner alimentar',
      '📅 Acompanhamento do planner'
    ]
  },

  // 19. RASTREADOR ALIMENTAR
  'rastreador-alimentar': {
    nutri: [
      '📋 Análise do rastreamento alimentar',
      '🥗 Correções baseadas no rastreamento',
      '💊 Suplementação baseada no padrão',
      '📅 Consulta nutricional de análise'
    ],
    sales: [
      '💊 Produtos baseados no rastreamento',
      '🥗 Suplementação personalizada',
      '💪 Produtos para correção de padrões',
      '📞 Consultoria baseada no rastreamento'
    ],
    coach: [
      '🧘‍♀️ Programa baseado no rastreamento',
      '💪 Exercícios para correção de padrões',
      '🍎 Coaching nutricional de análise',
      '📅 Acompanhamento de correção'
    ]
  },

  // 20. DIÁRIO ALIMENTAR
  'diario-alimentar': {
    nutri: [
      '📋 Análise do diário alimentar',
      '🥗 Plano de correção alimentar',
      '💊 Suplementação baseada no diário',
      '📅 Consulta nutricional de análise'
    ],
    sales: [
      '💊 Produtos para correção alimentar',
      '🥗 Suplementação baseada no diário',
      '💪 Produtos de apoio alimentar',
      '📞 Consultoria baseada no diário'
    ],
    coach: [
      '🧘‍♀️ Programa de correção alimentar',
      '💪 Exercícios para mudança de hábitos',
      '🍎 Coaching nutricional de transformação',
      '📅 Acompanhamento de mudança'
    ]
  },

  // 21. TABELA DE METAS SEMANAIS
  'tabela-metas-semanais': {
    nutri: {
      metasBasicas: [
        '📋 Definição de metas nutricionais básicas',
        '🥗 Plano alimentar para metas simples',
        '💊 Suplementação básica para metas',
        '📅 Acompanhamento semanal de metas'
      ],
      metasModeradas: [
        '📋 Definição de metas nutricionais moderadas',
        '🥗 Plano alimentar para metas específicas',
        '💊 Suplementação direcionada para metas',
        '📅 Acompanhamento quinzenal de metas'
      ],
      metasAvancadas: [
        '📋 Definição de metas nutricionais avançadas',
        '🥗 Plano alimentar para metas complexas',
        '💊 Suplementação avançada para metas',
        '📅 Acompanhamento semanal intensivo de metas'
      ]
    },
    sales: {
      metasBasicas: [
        '💊 Produtos básicos para metas simples',
        '🥗 Suplementação preventiva',
        '💪 Produtos de apoio básico',
        '📞 Consultoria básica em metas'
      ],
      metasModeradas: [
        '💊 Produtos moderados para metas específicas',
        '🥗 Suplementação direcionada',
        '💪 Produtos de apoio moderado',
        '📞 Consultoria moderada em metas'
      ],
      metasAvancadas: [
        '💊 Produtos avançados para metas complexas',
        '🥗 Suplementação avançada',
        '💪 Produtos de apoio avançado',
        '📞 Consultoria avançada em metas'
      ]
    },
    coach: {
      metasBasicas: [
        '🧘‍♀️ Programa básico de metas',
        '💪 Exercícios para metas simples',
        '🍎 Coaching nutricional básico',
        '📅 Acompanhamento básico de metas'
      ],
      metasModeradas: [
        '🧘‍♀️ Programa moderado de metas',
        '💪 Exercícios para metas específicas',
        '🍎 Coaching nutricional moderado',
        '📅 Acompanhamento moderado de metas'
      ],
      metasAvancadas: [
        '🧘‍♀️ Programa avançado de metas',
        '💪 Exercícios para metas complexas',
        '🍎 Coaching nutricional avançado',
        '📅 Acompanhamento avançado de metas'
      ]
    }
  },

  // 22. TEMPLATE DE DESAFIO 7 DIAS
  'template-desafio-7dias': {
    nutri: {
      desafioBasico: [
        '📋 Desafio nutricional básico de 7 dias',
        '🥗 Plano alimentar simples para desafio',
        '💊 Suplementação básica para desafio',
        '📅 Acompanhamento diário do desafio'
      ],
      desafioModerado: [
        '📋 Desafio nutricional moderado de 7 dias',
        '🥗 Plano alimentar específico para desafio',
        '💊 Suplementação direcionada para desafio',
        '📅 Acompanhamento intensivo do desafio'
      ],
      desafioAvancado: [
        '📋 Desafio nutricional avançado de 7 dias',
        '🥗 Plano alimentar complexo para desafio',
        '💊 Suplementação avançada para desafio',
        '📅 Acompanhamento especializado do desafio'
      ]
    },
    sales: {
      desafioBasico: [
        '💊 Produtos básicos para desafio de 7 dias',
        '🥗 Suplementação preventiva',
        '💪 Produtos de apoio básico',
        '📞 Consultoria básica em desafios'
      ],
      desafioModerado: [
        '💊 Produtos moderados para desafio específico',
        '🥗 Suplementação direcionada',
        '💪 Produtos de apoio moderado',
        '📞 Consultoria moderada em desafios'
      ],
      desafioAvancado: [
        '💊 Produtos avançados para desafio complexo',
        '🥗 Suplementação avançada',
        '💪 Produtos de apoio avançado',
        '📞 Consultoria avançada em desafios'
      ]
    },
    coach: {
      desafioBasico: [
        '🧘‍♀️ Programa básico de desafio de 7 dias',
        '💪 Exercícios básicos para desafio',
        '🍎 Coaching nutricional básico',
        '📅 Acompanhamento básico do desafio'
      ],
      desafioModerado: [
        '🧘‍♀️ Programa moderado de desafio',
        '💪 Exercícios moderados para desafio',
        '🍎 Coaching nutricional moderado',
        '📅 Acompanhamento moderado do desafio'
      ],
      desafioAvancado: [
        '🧘‍♀️ Programa avançado de desafio',
        '💪 Exercícios avançados para desafio',
        '🍎 Coaching nutricional avançado',
        '📅 Acompanhamento avançado do desafio'
      ]
    }
  },

  // 23. TEMPLATE DE DESAFIO 21 DIAS
  'template-desafio-21dias': {
    nutri: {
      desafioBasico: [
        '📋 Desafio nutricional básico de 21 dias',
        '🥗 Plano alimentar simples para desafio',
        '💊 Suplementação básica para desafio',
        '📅 Acompanhamento semanal do desafio'
      ],
      desafioModerado: [
        '📋 Desafio nutricional moderado de 21 dias',
        '🥗 Plano alimentar específico para desafio',
        '💊 Suplementação direcionada para desafio',
        '📅 Acompanhamento quinzenal do desafio'
      ],
      desafioAvancado: [
        '📋 Desafio nutricional avançado de 21 dias',
        '🥗 Plano alimentar complexo para desafio',
        '💊 Suplementação avançada para desafio',
        '📅 Acompanhamento semanal intensivo do desafio'
      ]
    },
    sales: {
      desafioBasico: [
        '💊 Produtos básicos para desafio de 21 dias',
        '🥗 Suplementação preventiva',
        '💪 Produtos de apoio básico',
        '📞 Consultoria básica em desafios'
      ],
      desafioModerado: [
        '💊 Produtos moderados para desafio específico',
        '🥗 Suplementação direcionada',
        '💪 Produtos de apoio moderado',
        '📞 Consultoria moderada em desafios'
      ],
      desafioAvancado: [
        '💊 Produtos avançados para desafio complexo',
        '🥗 Suplementação avançada',
        '💪 Produtos de apoio avançado',
        '📞 Consultoria avançada em desafios'
      ]
    },
    coach: {
      desafioBasico: [
        '🧘‍♀️ Programa básico de desafio de 21 dias',
        '💪 Exercícios básicos para desafio',
        '🍎 Coaching nutricional básico',
        '📅 Acompanhamento básico do desafio'
      ],
      desafioModerado: [
        '🧘‍♀️ Programa moderado de desafio',
        '💪 Exercícios moderados para desafio',
        '🍎 Coaching nutricional moderado',
        '📅 Acompanhamento moderado do desafio'
      ],
      desafioAvancado: [
        '🧘‍♀️ Programa avançado de desafio',
        '💪 Exercícios avançados para desafio',
        '🍎 Coaching nutricional avançado',
        '📅 Acompanhamento avançado do desafio'
      ]
    }
  },

  // 24. GUIA DE HIDRATAÇÃO
  'guia-hidratacao': {
    nutri: {
      baixaHidratacao: [
        '📋 Guia completo de hidratação',
        '🥗 Plano alimentar rico em líquidos',
        '💊 Suplementos eletrolíticos',
        '📅 Acompanhamento hidratacional semanal'
      ],
      hidratacaoModerada: [
        '📋 Guia de otimização da hidratação',
        '🥗 Plano alimentar para manutenção hidratacional',
        '💊 Suplementos de apoio hidratacional',
        '📅 Consultas de manutenção hidratacional'
      ],
      altaHidratacao: [
        '📋 Guia de manutenção da hidratação otimizada',
        '🥗 Plano alimentar para sustentação hidratacional',
        '💊 Suplementos preventivos hidratacionais',
        '📅 Acompanhamento preventivo hidratacional'
      ]
    },
    sales: {
      baixaHidratacao: [
        '💊 Eletrólitos para correção hidratacional',
        '🥗 Suplementos hidratacionais',
        '💪 Suplementos para reposição hídrica',
        '📞 Consultoria especializada em hidratação'
      ],
      hidratacaoModerada: [
        '💊 Eletrólitos para manutenção',
        '🥗 Suplementos hidratacionais moderados',
        '💪 Suplementos de apoio hidratacional',
        '📞 Consultoria preventiva hidratacional'
      ],
      altaHidratacao: [
        '💊 Eletrólitos para otimização',
        '🥗 Suplementos hidratacionais avançados',
        '💪 Suplementos de manutenção hidratacional',
        '📞 Consultoria especializada hidratacional'
      ]
    },
    coach: {
      baixaHidratacao: [
        '🧘‍♀️ Programa intensivo de hidratação',
        '💪 Treinos adaptados para hidratação',
        '🍎 Coaching nutricional hidratacional',
        '📅 Acompanhamento semanal hidratacional'
      ],
      hidratacaoModerada: [
        '🧘‍♀️ Programa de otimização hidratacional',
        '💪 Treinos para manutenção hidratacional',
        '🍎 Coaching de hábitos hidratacionais',
        '📅 Acompanhamento mensal hidratacional'
      ],
      altaHidratacao: [
        '🧘‍♀️ Programa de sustentação hidratacional',
        '💪 Treinos para manutenção da hidratação',
        '🍎 Coaching preventivo hidratacional',
        '📅 Acompanhamento preventivo hidratacional'
      ]
    }
  },

  // 25. INFOGRÁFICO EDUCATIVO
  'infografico-educativo': {
    nutri: {
      conhecimentoBasico: [
        '📋 Infográfico sobre nutrição básica',
        '🥗 Informações visuais sobre alimentação',
        '💊 Suplementação educativa',
        '📅 Consulta nutricional educativa'
      ],
      conhecimentoModerado: [
        '📋 Infográfico sobre nutrição moderada',
        '🥗 Informações visuais especializadas',
        '💊 Suplementação direcionada',
        '📅 Consulta nutricional especializada'
      ],
      conhecimentoAvancado: [
        '📋 Infográfico sobre nutrição avançada',
        '🥗 Informações visuais de alta qualidade',
        '💊 Suplementação avançada',
        '📅 Consulta nutricional de performance'
      ]
    },
    sales: {
      conhecimentoBasico: [
        '💊 Infográfico sobre suplementos básicos',
        '🥗 Informações visuais sobre produtos',
        '💪 Suplementação educativa',
        '📞 Consultoria educativa em suplementos'
      ],
      conhecimentoModerado: [
        '💊 Infográfico sobre suplementos moderados',
        '🥗 Informações visuais especializadas',
        '💪 Suplementação direcionada',
        '📞 Consultoria especializada em produtos'
      ],
      conhecimentoAvancado: [
        '💊 Infográfico sobre suplementos avançados',
        '🥗 Informações visuais de alta qualidade',
        '💪 Suplementação avançada',
        '📞 Consultoria premium em suplementos'
      ]
    },
    coach: {
      conhecimentoBasico: [
        '🧘‍♀️ Infográfico sobre bem-estar básico',
        '💪 Informações visuais sobre exercícios',
        '🍎 Coaching nutricional educativo',
        '📅 Programa educativo de transformação'
      ],
      conhecimentoModerado: [
        '🧘‍♀️ Infográfico sobre bem-estar moderado',
        '💪 Informações visuais especializadas',
        '🍎 Coaching nutricional específico',
        '📅 Programa especializado de transformação'
      ],
      conhecimentoAvancado: [
        '🧘‍♀️ Infográfico sobre bem-estar avançado',
        '💪 Informações visuais de alta qualidade',
        '🍎 Coaching nutricional profissional',
        '📅 Programa profissional de transformação'
      ]
    }
  },

  // 26. TEMPLATE DE RECEITAS
  'template-receitas': {
    nutri: {
      receitasBasicas: [
        '📋 Receitas básicas e nutritivas',
        '🥗 Plano alimentar com receitas simples',
        '💊 Suplementação básica',
        '📅 Consulta nutricional com receitas'
      ],
      receitasModeradas: [
        '📋 Receitas moderadas e especializadas',
        '🥗 Plano alimentar com receitas específicas',
        '💊 Suplementação direcionada',
        '📅 Consulta nutricional especializada'
      ],
      receitasAvancadas: [
        '📋 Receitas avançadas e de alta qualidade',
        '🥗 Plano alimentar com receitas complexas',
        '💊 Suplementação avançada',
        '📅 Consulta nutricional de performance'
      ]
    },
    sales: {
      receitasBasicas: [
        '💊 Produtos básicos para receitas',
        '🥗 Suplementação preventiva',
        '💪 Produtos de apoio básico',
        '📞 Consultoria básica em receitas'
      ],
      receitasModeradas: [
        '💊 Produtos moderados para receitas',
        '🥗 Suplementação direcionada',
        '💪 Produtos de apoio moderado',
        '📞 Consultoria moderada em receitas'
      ],
      receitasAvancadas: [
        '💊 Produtos avançados para receitas',
        '🥗 Suplementação avançada',
        '💪 Produtos de apoio avançado',
        '📞 Consultoria avançada em receitas'
      ]
    },
    coach: {
      receitasBasicas: [
        '🧘‍♀️ Programa básico com receitas',
        '💪 Exercícios básicos',
        '🍎 Coaching nutricional básico',
        '📅 Programa básico de transformação'
      ],
      receitasModeradas: [
        '🧘‍♀️ Programa moderado com receitas',
        '💪 Exercícios moderados',
        '🍎 Coaching nutricional moderado',
        '📅 Programa moderado de transformação'
      ],
      receitasAvancadas: [
        '🧘‍♀️ Programa avançado com receitas',
        '💪 Exercícios avançados',
        '🍎 Coaching nutricional avançado',
        '📅 Programa avançado de transformação'
      ]
    }
  },

  // 27. CARDÁPIO DETOX
  'cardapio-detox': {
    nutri: {
      detoxBasico: [
        '📋 Cardápio detox básico',
        '🥗 Plano alimentar detox simples',
        '💊 Suplementos detox básicos',
        '📅 Acompanhamento detox semanal'
      ],
      detoxModerado: [
        '📋 Cardápio detox moderado',
        '🥗 Plano alimentar detox específico',
        '💊 Suplementos detox moderados',
        '📅 Acompanhamento detox quinzenal'
      ],
      detoxAvancado: [
        '📋 Cardápio detox avançado',
        '🥗 Plano alimentar detox complexo',
        '💊 Suplementos detox avançados',
        '📅 Acompanhamento detox semanal intensivo'
      ]
    },
    sales: {
      detoxBasico: [
        '💊 Produtos detox básicos',
        '🥗 Suplementação preventiva',
        '💪 Produtos de apoio básico',
        '📞 Consultoria básica em detox'
      ],
      detoxModerado: [
        '💊 Produtos detox moderados',
        '🥗 Suplementação direcionada',
        '💪 Produtos de apoio moderado',
        '📞 Consultoria moderada em detox'
      ],
      detoxAvancado: [
        '💊 Produtos detox avançados',
        '🥗 Suplementação avançada',
        '💪 Produtos de apoio avançado',
        '📞 Consultoria avançada em detox'
      ]
    },
    coach: {
      detoxBasico: [
        '🧘‍♀️ Programa básico de detox',
        '💪 Exercícios básicos para detox',
        '🍎 Coaching nutricional básico',
        '📅 Programa básico de detox'
      ],
      detoxModerado: [
        '🧘‍♀️ Programa moderado de detox',
        '💪 Exercícios moderados para detox',
        '🍎 Coaching nutricional moderado',
        '📅 Programa moderado de detox'
      ],
      detoxAvancado: [
        '🧘‍♀️ Programa avançado de detox',
        '💪 Exercícios avançados para detox',
        '🍎 Coaching nutricional avançado',
        '📅 Programa avançado de detox'
      ]
    }
  },

  // 28. SIMULADOR DE RESULTADOS
  'simulador-resultados': {
    nutri: {
      resultadosBasicos: [
        '📋 Simulação de resultados básicos',
        '🥗 Plano alimentar para resultados simples',
        '💊 Suplementação básica',
        '📅 Consulta nutricional para resultados'
      ],
      resultadosModerados: [
        '📋 Simulação de resultados moderados',
        '🥗 Plano alimentar para resultados específicos',
        '💊 Suplementação direcionada',
        '📅 Consulta nutricional especializada'
      ],
      resultadosAvancados: [
        '📋 Simulação de resultados avançados',
        '🥗 Plano alimentar para resultados complexos',
        '💊 Suplementação avançada',
        '📅 Consulta nutricional de performance'
      ]
    },
    sales: {
      resultadosBasicos: [
        '💊 Produtos para resultados básicos',
        '🥗 Suplementação preventiva',
        '💪 Produtos de apoio básico',
        '📞 Consultoria básica em resultados'
      ],
      resultadosModerados: [
        '💊 Produtos para resultados moderados',
        '🥗 Suplementação direcionada',
        '💪 Produtos de apoio moderado',
        '📞 Consultoria moderada em resultados'
      ],
      resultadosAvancados: [
        '💊 Produtos para resultados avançados',
        '🥗 Suplementação avançada',
        '💪 Produtos de apoio avançado',
        '📞 Consultoria avançada em resultados'
      ]
    },
    coach: {
      resultadosBasicos: [
        '🧘‍♀️ Programa básico para resultados',
        '💪 Exercícios básicos',
        '🍎 Coaching nutricional básico',
        '📅 Programa básico de resultados'
      ],
      resultadosModerados: [
        '🧘‍♀️ Programa moderado para resultados',
        '💪 Exercícios moderados',
        '🍎 Coaching nutricional moderado',
        '📅 Programa moderado de resultados'
      ],
      resultadosAvancados: [
        '🧘‍♀️ Programa avançado para resultados',
        '💪 Exercícios avançados',
        '🍎 Coaching nutricional avançado',
        '📅 Programa avançado de resultados'
      ]
    }
  },

  // 29. TEMPLATE DE AVALIAÇÃO INICIAL
  'template-avaliacao-inicial': {
    nutri: {
      avaliacaoBasica: [
        '📋 Avaliação nutricional básica',
        '🥗 Plano alimentar simples',
        '💊 Suplementação básica',
        '📅 Consulta nutricional inicial'
      ],
      avaliacaoModerada: [
        '📋 Avaliação nutricional moderada',
        '🥗 Plano alimentar específico',
        '💊 Suplementação direcionada',
        '📅 Consulta nutricional especializada'
      ],
      avaliacaoAvancada: [
        '📋 Avaliação nutricional avançada',
        '🥗 Plano alimentar complexo',
        '💊 Suplementação avançada',
        '📅 Consulta nutricional de performance'
      ]
    },
    sales: {
      avaliacaoBasica: [
        '💊 Produtos básicos para avaliação',
        '🥗 Suplementação preventiva',
        '💪 Produtos de apoio básico',
        '📞 Consultoria básica em avaliação'
      ],
      avaliacaoModerada: [
        '💊 Produtos moderados para avaliação',
        '🥗 Suplementação direcionada',
        '💪 Produtos de apoio moderado',
        '📞 Consultoria moderada em avaliação'
      ],
      avaliacaoAvancada: [
        '💊 Produtos avançados para avaliação',
        '🥗 Suplementação avançada',
        '💪 Produtos de apoio avançado',
        '📞 Consultoria avançada em avaliação'
      ]
    },
    coach: {
      avaliacaoBasica: [
        '🧘‍♀️ Programa básico de avaliação',
        '💪 Exercícios básicos',
        '🍎 Coaching nutricional básico',
        '📅 Programa básico de avaliação'
      ],
      avaliacaoModerada: [
        '🧘‍♀️ Programa moderado de avaliação',
        '💪 Exercícios moderados',
        '🍎 Coaching nutricional moderado',
        '📅 Programa moderado de avaliação'
      ],
      avaliacaoAvancada: [
        '🧘‍♀️ Programa avançado de avaliação',
        '💪 Exercícios avançados',
        '🍎 Coaching nutricional avançado',
        '📅 Programa avançado de avaliação'
      ]
    }
  },

  // 30. FORMULÁRIO DE RECOMENDAÇÃO
  'formulario-recomendacao': {
    nutri: {
      recomendacaoBasica: [
        '📋 Recomendações nutricionais básicas',
        '🥗 Plano alimentar simples',
        '💊 Suplementação básica',
        '📅 Consulta nutricional básica'
      ],
      recomendacaoModerada: [
        '📋 Recomendações nutricionais moderadas',
        '🥗 Plano alimentar específico',
        '💊 Suplementação direcionada',
        '📅 Consulta nutricional especializada'
      ],
      recomendacaoAvancada: [
        '📋 Recomendações nutricionais avançadas',
        '🥗 Plano alimentar complexo',
        '💊 Suplementação avançada',
        '📅 Consulta nutricional de performance'
      ]
    },
    sales: {
      recomendacaoBasica: [
        '💊 Produtos básicos recomendados',
        '🥗 Suplementação preventiva',
        '💪 Produtos de apoio básico',
        '📞 Consultoria básica em recomendações'
      ],
      recomendacaoModerada: [
        '💊 Produtos moderados recomendados',
        '🥗 Suplementação direcionada',
        '💪 Produtos de apoio moderado',
        '📞 Consultoria moderada em recomendações'
      ],
      recomendacaoAvancada: [
        '💊 Produtos avançados recomendados',
        '🥗 Suplementação avançada',
        '💪 Produtos de apoio avançado',
        '📞 Consultoria avançada em recomendações'
      ]
    },
    coach: {
      recomendacaoBasica: [
        '🧘‍♀️ Programa básico recomendado',
        '💪 Exercícios básicos',
        '🍎 Coaching nutricional básico',
        '📅 Programa básico recomendado'
      ],
      recomendacaoModerada: [
        '🧘‍♀️ Programa moderado recomendado',
        '💪 Exercícios moderados',
        '🍎 Coaching nutricional moderado',
        '📅 Programa moderado recomendado'
      ],
      recomendacaoAvancada: [
        '🧘‍♀️ Programa avançado recomendado',
        '💪 Exercícios avançados',
        '🍎 Coaching nutricional avançado',
        '📅 Programa avançado recomendado'
      ]
    }
  },

  // 31. TEMPLATE DE ACOMPANHAMENTO SEMANAL
  'template-acompanhamento-semanal': {
    nutri: {
      acompanhamentoBasico: [
        '📋 Acompanhamento nutricional semanal básico',
        '🥗 Plano alimentar semanal simples',
        '💊 Suplementação básica semanal',
        '📅 Consulta nutricional semanal'
      ],
      acompanhamentoModerado: [
        '📋 Acompanhamento nutricional semanal moderado',
        '🥗 Plano alimentar semanal específico',
        '💊 Suplementação direcionada semanal',
        '📅 Consulta nutricional especializada semanal'
      ],
      acompanhamentoAvancado: [
        '📋 Acompanhamento nutricional semanal avançado',
        '🥗 Plano alimentar semanal complexo',
        '💊 Suplementação avançada semanal',
        '📅 Consulta nutricional de performance semanal'
      ]
    },
    sales: {
      acompanhamentoBasico: [
        '💊 Produtos básicos para acompanhamento semanal',
        '🥗 Suplementação preventiva semanal',
        '💪 Produtos de apoio básico semanal',
        '📞 Consultoria básica semanal'
      ],
      acompanhamentoModerado: [
        '💊 Produtos moderados para acompanhamento semanal',
        '🥗 Suplementação direcionada semanal',
        '💪 Produtos de apoio moderado semanal',
        '📞 Consultoria moderada semanal'
      ],
      acompanhamentoAvancado: [
        '💊 Produtos avançados para acompanhamento semanal',
        '🥗 Suplementação avançada semanal',
        '💪 Produtos de apoio avançado semanal',
        '📞 Consultoria avançada semanal'
      ]
    },
    coach: {
      acompanhamentoBasico: [
        '🧘‍♀️ Programa básico de acompanhamento semanal',
        '💪 Exercícios básicos semanais',
        '🍎 Coaching nutricional básico semanal',
        '📅 Programa básico semanal'
      ],
      acompanhamentoModerado: [
        '🧘‍♀️ Programa moderado de acompanhamento semanal',
        '💪 Exercícios moderados semanais',
        '🍎 Coaching nutricional moderado semanal',
        '📅 Programa moderado semanal'
      ],
      acompanhamentoAvancado: [
        '🧘‍♀️ Programa avançado de acompanhamento semanal',
        '💪 Exercícios avançados semanais',
        '🍎 Coaching nutricional avançado semanal',
        '📅 Programa avançado semanal'
      ]
    }
  },

  // 32. TEMPLATE DE CHECK-IN MENSAL
  'template-checkin-mensal': {
    nutri: {
      checkinBasico: [
        '📋 Check-in nutricional mensal básico',
        '🥗 Plano alimentar mensal simples',
        '💊 Suplementação básica mensal',
        '📅 Consulta nutricional mensal'
      ],
      checkinModerado: [
        '📋 Check-in nutricional mensal moderado',
        '🥗 Plano alimentar mensal específico',
        '💊 Suplementação direcionada mensal',
        '📅 Consulta nutricional especializada mensal'
      ],
      checkinAvancado: [
        '📋 Check-in nutricional mensal avançado',
        '🥗 Plano alimentar mensal complexo',
        '💊 Suplementação avançada mensal',
        '📅 Consulta nutricional de performance mensal'
      ]
    },
    sales: {
      checkinBasico: [
        '💊 Produtos básicos para check-in mensal',
        '🥗 Suplementação preventiva mensal',
        '💪 Produtos de apoio básico mensal',
        '📞 Consultoria básica mensal'
      ],
      checkinModerado: [
        '💊 Produtos moderados para check-in mensal',
        '🥗 Suplementação direcionada mensal',
        '💪 Produtos de apoio moderado mensal',
        '📞 Consultoria moderada mensal'
      ],
      checkinAvancado: [
        '💊 Produtos avançados para check-in mensal',
        '🥗 Suplementação avançada mensal',
        '💪 Produtos de apoio avançado mensal',
        '📞 Consultoria avançada mensal'
      ]
    },
    coach: {
      checkinBasico: [
        '🧘‍♀️ Programa básico de check-in mensal',
        '💪 Exercícios básicos mensais',
        '🍎 Coaching nutricional básico mensal',
        '📅 Programa básico mensal'
      ],
      checkinModerado: [
        '🧘‍♀️ Programa moderado de check-in mensal',
        '💪 Exercícios moderados mensais',
        '🍎 Coaching nutricional moderado mensal',
        '📅 Programa moderado mensal'
      ],
      checkinAvancado: [
        '🧘‍♀️ Programa avançado de check-in mensal',
        '💪 Exercícios avançados mensais',
        '🍎 Coaching nutricional avançado mensal',
        '📅 Programa avançado mensal'
      ]
    }
  },

  // 33. FICHA DE CLIENTE
  'ficha-cliente': {
    nutri: {
      fichaBasica: [
        '📋 Ficha nutricional básica do cliente',
        '🥗 Plano alimentar simples personalizado',
        '💊 Suplementação básica personalizada',
        '📅 Consulta nutricional personalizada'
      ],
      fichaModerada: [
        '📋 Ficha nutricional moderada do cliente',
        '🥗 Plano alimentar específico personalizado',
        '💊 Suplementação direcionada personalizada',
        '📅 Consulta nutricional especializada personalizada'
      ],
      fichaAvancada: [
        '📋 Ficha nutricional avançada do cliente',
        '🥗 Plano alimentar complexo personalizado',
        '💊 Suplementação avançada personalizada',
        '📅 Consulta nutricional de performance personalizada'
      ]
    },
    sales: {
      fichaBasica: [
        '💊 Produtos básicos personalizados para cliente',
        '🥗 Suplementação preventiva personalizada',
        '💪 Produtos de apoio básico personalizado',
        '📞 Consultoria básica personalizada'
      ],
      fichaModerada: [
        '💊 Produtos moderados personalizados para cliente',
        '🥗 Suplementação direcionada personalizada',
        '💪 Produtos de apoio moderado personalizado',
        '📞 Consultoria moderada personalizada'
      ],
      fichaAvancada: [
        '💊 Produtos avançados personalizados para cliente',
        '🥗 Suplementação avançada personalizada',
        '💪 Produtos de apoio avançado personalizado',
        '📞 Consultoria avançada personalizada'
      ]
    },
    coach: {
      fichaBasica: [
        '🧘‍♀️ Programa básico personalizado para cliente',
        '💪 Exercícios básicos personalizados',
        '🍎 Coaching nutricional básico personalizado',
        '📅 Programa básico personalizado'
      ],
      fichaModerada: [
        '🧘‍♀️ Programa moderado personalizado para cliente',
        '💪 Exercícios moderados personalizados',
        '🍎 Coaching nutricional moderado personalizado',
        '📅 Programa moderado personalizado'
      ],
      fichaAvancada: [
        '🧘‍♀️ Programa avançado personalizado para cliente',
        '💪 Exercícios avançados personalizados',
        '🍎 Coaching nutricional avançado personalizado',
        '📅 Programa avançado personalizado'
      ]
    }
  },

  // 34. TEMPLATE DE PROGRESSO VISUAL
  'template-progresso-visual': {
    nutri: {
      progressoBasico: [
        '📋 Acompanhamento visual básico do progresso',
        '🥗 Plano alimentar com progresso visual',
        '💊 Suplementação com acompanhamento visual',
        '📅 Consulta nutricional com progresso visual'
      ],
      progressoModerado: [
        '📋 Acompanhamento visual moderado do progresso',
        '🥗 Plano alimentar específico com progresso visual',
        '💊 Suplementação direcionada com acompanhamento visual',
        '📅 Consulta nutricional especializada com progresso visual'
      ],
      progressoAvancado: [
        '📋 Acompanhamento visual avançado do progresso',
        '🥗 Plano alimentar complexo com progresso visual',
        '💊 Suplementação avançada com acompanhamento visual',
        '📅 Consulta nutricional de performance com progresso visual'
      ]
    },
    sales: {
      progressoBasico: [
        '💊 Produtos básicos com acompanhamento visual',
        '🥗 Suplementação preventiva com progresso visual',
        '💪 Produtos de apoio básico com acompanhamento visual',
        '📞 Consultoria básica com progresso visual'
      ],
      progressoModerado: [
        '💊 Produtos moderados com acompanhamento visual',
        '🥗 Suplementação direcionada com progresso visual',
        '💪 Produtos de apoio moderado com acompanhamento visual',
        '📞 Consultoria moderada com progresso visual'
      ],
      progressoAvancado: [
        '💊 Produtos avançados com acompanhamento visual',
        '🥗 Suplementação avançada com progresso visual',
        '💪 Produtos de apoio avançado com acompanhamento visual',
        '📞 Consultoria avançada com progresso visual'
      ]
    },
    coach: {
      progressoBasico: [
        '🧘‍♀️ Programa básico com acompanhamento visual',
        '💪 Exercícios básicos com progresso visual',
        '🍎 Coaching nutricional básico com acompanhamento visual',
        '📅 Programa básico com progresso visual'
      ],
      progressoModerado: [
        '🧘‍♀️ Programa moderado com acompanhamento visual',
        '💪 Exercícios moderados com progresso visual',
        '🍎 Coaching nutricional moderado com acompanhamento visual',
        '📅 Programa moderado com progresso visual'
      ],
      progressoAvancado: [
        '🧘‍♀️ Programa avançado com acompanhamento visual',
        '💪 Exercícios avançados com progresso visual',
        '🍎 Coaching nutricional avançado com acompanhamento visual',
        '📅 Programa avançado com progresso visual'
      ]
    }
  },

  // 35. TEMPLATE DE STORY INTERATIVO
  'template-story-interativo': {
    nutri: {
      storyBasico: [
        '📋 Story interativo básico sobre nutrição',
        '🥗 Conteúdo visual simples sobre alimentação',
        '💊 Informações básicas sobre suplementação',
        '📅 Engajamento básico nutricional'
      ],
      storyModerado: [
        '📋 Story interativo moderado sobre nutrição',
        '🥗 Conteúdo visual específico sobre alimentação',
        '💊 Informações direcionadas sobre suplementação',
        '📅 Engajamento moderado nutricional'
      ],
      storyAvancado: [
        '📋 Story interativo avançado sobre nutrição',
        '🥗 Conteúdo visual complexo sobre alimentação',
        '💊 Informações avançadas sobre suplementação',
        '📅 Engajamento avançado nutricional'
      ]
    },
    sales: {
      storyBasico: [
        '💊 Story interativo básico sobre produtos',
        '🥗 Conteúdo visual simples sobre suplementos',
        '💪 Informações básicas sobre produtos',
        '📞 Engajamento básico em produtos'
      ],
      storyModerado: [
        '💊 Story interativo moderado sobre produtos',
        '🥗 Conteúdo visual específico sobre suplementos',
        '💪 Informações direcionadas sobre produtos',
        '📞 Engajamento moderado em produtos'
      ],
      storyAvancado: [
        '💊 Story interativo avançado sobre produtos',
        '🥗 Conteúdo visual complexo sobre suplementos',
        '💪 Informações avançadas sobre produtos',
        '📞 Engajamento avançado em produtos'
      ]
    },
    coach: {
      storyBasico: [
        '🧘‍♀️ Story interativo básico sobre bem-estar',
        '💪 Conteúdo visual simples sobre exercícios',
        '🍎 Informações básicas sobre coaching',
        '📅 Engajamento básico em bem-estar'
      ],
      storyModerado: [
        '🧘‍♀️ Story interativo moderado sobre bem-estar',
        '💪 Conteúdo visual específico sobre exercícios',
        '🍎 Informações direcionadas sobre coaching',
        '📅 Engajamento moderado em bem-estar'
      ],
      storyAvancado: [
        '🧘‍♀️ Story interativo avançado sobre bem-estar',
        '💪 Conteúdo visual complexo sobre exercícios',
        '🍎 Informações avançadas sobre coaching',
        '📅 Engajamento avançado em bem-estar'
      ]
    }
  },

  // 36. POST DE CURIOSIDADES
  'post-curiosidades': {
    nutri: {
      curiosidadeBasica: [
        '📋 Post básico com curiosidades nutricionais',
        '🥗 Conteúdo simples sobre alimentação',
        '💊 Informações básicas sobre nutrição',
        '📅 Engajamento básico nutricional'
      ],
      curiosidadeModerada: [
        '📋 Post moderado com curiosidades nutricionais',
        '🥗 Conteúdo específico sobre alimentação',
        '💊 Informações direcionadas sobre nutrição',
        '📅 Engajamento moderado nutricional'
      ],
      curiosidadeAvancada: [
        '📋 Post avançado com curiosidades nutricionais',
        '🥗 Conteúdo complexo sobre alimentação',
        '💊 Informações avançadas sobre nutrição',
        '📅 Engajamento avançado nutricional'
      ]
    },
    sales: {
      curiosidadeBasica: [
        '💊 Post básico com curiosidades sobre produtos',
        '🥗 Conteúdo simples sobre suplementos',
        '💪 Informações básicas sobre produtos',
        '📞 Engajamento básico em produtos'
      ],
      curiosidadeModerada: [
        '💊 Post moderado com curiosidades sobre produtos',
        '🥗 Conteúdo específico sobre suplementos',
        '💪 Informações direcionadas sobre produtos',
        '📞 Engajamento moderado em produtos'
      ],
      curiosidadeAvancada: [
        '💊 Post avançado com curiosidades sobre produtos',
        '🥗 Conteúdo complexo sobre suplementos',
        '💪 Informações avançadas sobre produtos',
        '📞 Engajamento avançado em produtos'
      ]
    },
    coach: {
      curiosidadeBasica: [
        '🧘‍♀️ Post básico com curiosidades sobre bem-estar',
        '💪 Conteúdo simples sobre exercícios',
        '🍎 Informações básicas sobre coaching',
        '📅 Engajamento básico em bem-estar'
      ],
      curiosidadeModerada: [
        '🧘‍♀️ Post moderado com curiosidades sobre bem-estar',
        '💪 Conteúdo específico sobre exercícios',
        '🍎 Informações direcionadas sobre coaching',
        '📅 Engajamento moderado em bem-estar'
      ],
      curiosidadeAvancada: [
        '🧘‍♀️ Post avançado com curiosidades sobre bem-estar',
        '💪 Conteúdo complexo sobre exercícios',
        '🍎 Informações avançadas sobre coaching',
        '📅 Engajamento avançado em bem-estar'
      ]
    }
  },

  // 37. TEMPLATE DE POST COM DICA
  'template-post-dica': {
    nutri: {
      dicaBasica: [
        '📋 Post básico com dicas nutricionais',
        '🥗 Dicas simples sobre alimentação',
        '💊 Dicas básicas sobre suplementação',
        '📅 Engajamento básico nutricional'
      ],
      dicaModerada: [
        '📋 Post moderado com dicas nutricionais',
        '🥗 Dicas específicas sobre alimentação',
        '💊 Dicas direcionadas sobre suplementação',
        '📅 Engajamento moderado nutricional'
      ],
      dicaAvancada: [
        '📋 Post avançado com dicas nutricionais',
        '🥗 Dicas complexas sobre alimentação',
        '💊 Dicas avançadas sobre suplementação',
        '📅 Engajamento avançado nutricional'
      ]
    },
    sales: {
      dicaBasica: [
        '💊 Post básico com dicas sobre produtos',
        '🥗 Dicas simples sobre suplementos',
        '💪 Dicas básicas sobre produtos',
        '📞 Engajamento básico em produtos'
      ],
      dicaModerada: [
        '💊 Post moderado com dicas sobre produtos',
        '🥗 Dicas específicas sobre suplementos',
        '💪 Dicas direcionadas sobre produtos',
        '📞 Engajamento moderado em produtos'
      ],
      dicaAvancada: [
        '💊 Post avançado com dicas sobre produtos',
        '🥗 Dicas complexas sobre suplementos',
        '💪 Dicas avançadas sobre produtos',
        '📞 Engajamento avançado em produtos'
      ]
    },
    coach: {
      dicaBasica: [
        '🧘‍♀️ Post básico com dicas sobre bem-estar',
        '💪 Dicas simples sobre exercícios',
        '🍎 Dicas básicas sobre coaching',
        '📅 Engajamento básico em bem-estar'
      ],
      dicaModerada: [
        '🧘‍♀️ Post moderado com dicas sobre bem-estar',
        '💪 Dicas específicas sobre exercícios',
        '🍎 Dicas direcionadas sobre coaching',
        '📅 Engajamento moderado em bem-estar'
      ],
      dicaAvancada: [
        '🧘‍♀️ Post avançado com dicas sobre bem-estar',
        '💪 Dicas complexas sobre exercícios',
        '🍎 Dicas avançadas sobre coaching',
        '📅 Engajamento avançado em bem-estar'
      ]
    }
  },

  // 38. TEMPLATE DE REELS ROTEIRIZADO
  'template-reels-roteirizado': {
    nutri: {
      reelsBasico: [
        '📋 Reels básico roteirizado sobre nutrição',
        '🥗 Roteiro simples sobre alimentação',
        '💊 Conteúdo básico sobre suplementação',
        '📅 Engajamento básico nutricional'
      ],
      reelsModerado: [
        '📋 Reels moderado roteirizado sobre nutrição',
        '🥗 Roteiro específico sobre alimentação',
        '💊 Conteúdo direcionado sobre suplementação',
        '📅 Engajamento moderado nutricional'
      ],
      reelsAvancado: [
        '📋 Reels avançado roteirizado sobre nutrição',
        '🥗 Roteiro complexo sobre alimentação',
        '💊 Conteúdo avançado sobre suplementação',
        '📅 Engajamento avançado nutricional'
      ]
    },
    sales: {
      reelsBasico: [
        '💊 Reels básico roteirizado sobre produtos',
        '🥗 Roteiro simples sobre suplementos',
        '💪 Conteúdo básico sobre produtos',
        '📞 Engajamento básico em produtos'
      ],
      reelsModerado: [
        '💊 Reels moderado roteirizado sobre produtos',
        '🥗 Roteiro específico sobre suplementos',
        '💪 Conteúdo direcionado sobre produtos',
        '📞 Engajamento moderado em produtos'
      ],
      reelsAvancado: [
        '💊 Reels avançado roteirizado sobre produtos',
        '🥗 Roteiro complexo sobre suplementos',
        '💪 Conteúdo avançado sobre produtos',
        '📞 Engajamento avançado em produtos'
      ]
    },
    coach: {
      reelsBasico: [
        '🧘‍♀️ Reels básico roteirizado sobre bem-estar',
        '💪 Roteiro simples sobre exercícios',
        '🍎 Conteúdo básico sobre coaching',
        '📅 Engajamento básico em bem-estar'
      ],
      reelsModerado: [
        '🧘‍♀️ Reels moderado roteirizado sobre bem-estar',
        '💪 Roteiro específico sobre exercícios',
        '🍎 Conteúdo direcionado sobre coaching',
        '📅 Engajamento moderado em bem-estar'
      ],
      reelsAvancado: [
        '🧘‍♀️ Reels avançado roteirizado sobre bem-estar',
        '💪 Roteiro complexo sobre exercícios',
        '🍎 Conteúdo avançado sobre coaching',
        '📅 Engajamento avançado em bem-estar'
      ]
    }
  },

  // 39. TEMPLATE DE ARTIGO CURTO
  'template-artigo-curto': {
    nutri: {
      artigoBasico: [
        '📋 Artigo curto básico sobre nutrição',
        '🥗 Conteúdo simples sobre alimentação',
        '💊 Informações básicas sobre suplementação',
        '📅 Engajamento básico nutricional'
      ],
      artigoModerado: [
        '📋 Artigo curto moderado sobre nutrição',
        '🥗 Conteúdo específico sobre alimentação',
        '💊 Informações direcionadas sobre suplementação',
        '📅 Engajamento moderado nutricional'
      ],
      artigoAvancado: [
        '📋 Artigo curto avançado sobre nutrição',
        '🥗 Conteúdo complexo sobre alimentação',
        '💊 Informações avançadas sobre suplementação',
        '📅 Engajamento avançado nutricional'
      ]
    },
    sales: {
      artigoBasico: [
        '💊 Artigo curto básico sobre produtos',
        '🥗 Conteúdo simples sobre suplementos',
        '💪 Informações básicas sobre produtos',
        '📞 Engajamento básico em produtos'
      ],
      artigoModerado: [
        '💊 Artigo curto moderado sobre produtos',
        '🥗 Conteúdo específico sobre suplementos',
        '💪 Informações direcionadas sobre produtos',
        '📞 Engajamento moderado em produtos'
      ],
      artigoAvancado: [
        '💊 Artigo curto avançado sobre produtos',
        '🥗 Conteúdo complexo sobre suplementos',
        '💪 Informações avançadas sobre produtos',
        '📞 Engajamento avançado em produtos'
      ]
    },
    coach: {
      artigoBasico: [
        '🧘‍♀️ Artigo curto básico sobre bem-estar',
        '💪 Conteúdo simples sobre exercícios',
        '🍎 Informações básicas sobre coaching',
        '📅 Engajamento básico em bem-estar'
      ],
      artigoModerado: [
        '🧘‍♀️ Artigo curto moderado sobre bem-estar',
        '💪 Conteúdo específico sobre exercícios',
        '🍎 Informações direcionadas sobre coaching',
        '📅 Engajamento moderado em bem-estar'
      ],
      artigoAvancado: [
        '🧘‍♀️ Artigo curto avançado sobre bem-estar',
        '💪 Conteúdo complexo sobre exercícios',
        '🍎 Informações avançadas sobre coaching',
        '📅 Engajamento avançado em bem-estar'
      ]
    }
  },

  // 40. TEMPLATE DE CATÁLOGO DIGITAL
  'template-catalogo-digital': {
    nutri: {
      catalogoBasico: [
        '📋 Catálogo digital básico nutricional',
        '🥗 Produtos básicos de alimentação',
        '💊 Suplementos básicos',
        '📅 Consulta nutricional básica'
      ],
      catalogoModerado: [
        '📋 Catálogo digital moderado nutricional',
        '🥗 Produtos específicos de alimentação',
        '💊 Suplementos direcionados',
        '📅 Consulta nutricional especializada'
      ],
      catalogoAvancado: [
        '📋 Catálogo digital avançado nutricional',
        '🥗 Produtos complexos de alimentação',
        '💊 Suplementos avançados',
        '📅 Consulta nutricional de performance'
      ]
    },
    sales: {
      catalogoBasico: [
        '💊 Catálogo digital básico de produtos',
        '🥗 Suplementos básicos',
        '💪 Produtos básicos',
        '📞 Consultoria básica em produtos'
      ],
      catalogoModerado: [
        '💊 Catálogo digital moderado de produtos',
        '🥗 Suplementos direcionados',
        '💪 Produtos específicos',
        '📞 Consultoria moderada em produtos'
      ],
      catalogoAvancado: [
        '💊 Catálogo digital avançado de produtos',
        '🥗 Suplementos avançados',
        '💪 Produtos complexos',
        '📞 Consultoria avançada em produtos'
      ]
    },
    coach: {
      catalogoBasico: [
        '🧘‍♀️ Catálogo digital básico de bem-estar',
        '💪 Exercícios básicos',
        '🍎 Coaching básico',
        '📅 Programa básico de bem-estar'
      ],
      catalogoModerado: [
        '🧘‍♀️ Catálogo digital moderado de bem-estar',
        '💪 Exercícios específicos',
        '🍎 Coaching direcionado',
        '📅 Programa moderado de bem-estar'
      ],
      catalogoAvancado: [
        '🧘‍♀️ Catálogo digital avançado de bem-estar',
        '💪 Exercícios complexos',
        '🍎 Coaching avançado',
        '📅 Programa avançado de bem-estar'
      ]
    }
  },

  // 41. SIMULADOR DE GANHO
  'simulador-ganho': {
    nutri: {
      ganhoBasico: [
        '📋 Simulação básica de ganho nutricional',
        '🥗 Plano alimentar para ganho simples',
        '💊 Suplementação básica para ganho',
        '📅 Consulta nutricional para ganho'
      ],
      ganhoModerado: [
        '📋 Simulação moderada de ganho nutricional',
        '🥗 Plano alimentar para ganho específico',
        '💊 Suplementação direcionada para ganho',
        '📅 Consulta nutricional especializada para ganho'
      ],
      ganhoAvancado: [
        '📋 Simulação avançada de ganho nutricional',
        '🥗 Plano alimentar para ganho complexo',
        '💊 Suplementação avançada para ganho',
        '📅 Consulta nutricional de performance para ganho'
      ]
    },
    sales: {
      ganhoBasico: [
        '💊 Produtos básicos para ganho',
        '🥗 Suplementação preventiva para ganho',
        '💪 Produtos de apoio básico para ganho',
        '📞 Consultoria básica para ganho'
      ],
      ganhoModerado: [
        '💊 Produtos moderados para ganho',
        '🥗 Suplementação direcionada para ganho',
        '💪 Produtos de apoio moderado para ganho',
        '📞 Consultoria moderada para ganho'
      ],
      ganhoAvancado: [
        '💊 Produtos avançados para ganho',
        '🥗 Suplementação avançada para ganho',
        '💪 Produtos de apoio avançado para ganho',
        '📞 Consultoria avançada para ganho'
      ]
    },
    coach: {
      ganhoBasico: [
        '🧘‍♀️ Programa básico para ganho',
        '💪 Exercícios básicos para ganho',
        '🍎 Coaching nutricional básico para ganho',
        '📅 Programa básico para ganho'
      ],
      ganhoModerado: [
        '🧘‍♀️ Programa moderado para ganho',
        '💪 Exercícios moderados para ganho',
        '🍎 Coaching nutricional moderado para ganho',
        '📅 Programa moderado para ganho'
      ],
      ganhoAvancado: [
        '🧘‍♀️ Programa avançado para ganho',
        '💪 Exercícios avançados para ganho',
        '🍎 Coaching nutricional avançado para ganho',
        '📅 Programa avançado para ganho'
      ]
    }
  },

  // 42. TEMPLATE DE OPORTUNIDADE
  'template-oportunidade': {
    nutri: {
      oportunidadeBasica: [
        '📋 Oportunidade básica nutricional',
        '🥗 Plano alimentar básico',
        '💊 Suplementação básica',
        '📅 Consulta nutricional básica'
      ],
      oportunidadeModerada: [
        '📋 Oportunidade moderada nutricional',
        '🥗 Plano alimentar específico',
        '💊 Suplementação direcionada',
        '📅 Consulta nutricional especializada'
      ],
      oportunidadeAvancada: [
        '📋 Oportunidade avançada nutricional',
        '🥗 Plano alimentar complexo',
        '💊 Suplementação avançada',
        '📅 Consulta nutricional de performance'
      ]
    },
    sales: {
      oportunidadeBasica: [
        '💊 Oportunidade básica de produtos',
        '🥗 Suplementação preventiva',
        '💪 Produtos básicos',
        '📞 Consultoria básica'
      ],
      oportunidadeModerada: [
        '💊 Oportunidade moderada de produtos',
        '🥗 Suplementação direcionada',
        '💪 Produtos específicos',
        '📞 Consultoria moderada'
      ],
      oportunidadeAvancada: [
        '💊 Oportunidade avançada de produtos',
        '🥗 Suplementação avançada',
        '💪 Produtos complexos',
        '📞 Consultoria avançada'
      ]
    },
    coach: {
      oportunidadeBasica: [
        '🧘‍♀️ Oportunidade básica de bem-estar',
        '💪 Exercícios básicos',
        '🍎 Coaching básico',
        '📅 Programa básico'
      ],
      oportunidadeModerada: [
        '🧘‍♀️ Oportunidade moderada de bem-estar',
        '💪 Exercícios específicos',
        '🍎 Coaching direcionado',
        '📅 Programa moderado'
      ],
      oportunidadeAvancada: [
        '🧘‍♀️ Oportunidade avançada de bem-estar',
        '💪 Exercícios complexos',
        '🍎 Coaching avançado',
        '📅 Programa avançado'
      ]
    }
  },

  // 43. TEMPLATE DE APRESENTAÇÃO DE NEGÓCIO
  'template-apresentacao-negocio': {
    nutri: {
      apresentacaoBasica: [
        '📋 Apresentação básica do negócio nutricional',
        '🥗 Plano alimentar básico',
        '💊 Suplementação básica',
        '📅 Consulta nutricional básica'
      ],
      apresentacaoModerada: [
        '📋 Apresentação moderada do negócio nutricional',
        '🥗 Plano alimentar específico',
        '💊 Suplementação direcionada',
        '📅 Consulta nutricional especializada'
      ],
      apresentacaoAvancada: [
        '📋 Apresentação avançada do negócio nutricional',
        '🥗 Plano alimentar complexo',
        '💊 Suplementação avançada',
        '📅 Consulta nutricional de performance'
      ]
    },
    sales: {
      apresentacaoBasica: [
        '💊 Apresentação básica do negócio de produtos',
        '🥗 Suplementação preventiva',
        '💪 Produtos básicos',
        '📞 Consultoria básica'
      ],
      apresentacaoModerada: [
        '💊 Apresentação moderada do negócio de produtos',
        '🥗 Suplementação direcionada',
        '💪 Produtos específicos',
        '📞 Consultoria moderada'
      ],
      apresentacaoAvancada: [
        '💊 Apresentação avançada do negócio de produtos',
        '🥗 Suplementação avançada',
        '💪 Produtos complexos',
        '📞 Consultoria avançada'
      ]
    },
    coach: {
      apresentacaoBasica: [
        '🧘‍♀️ Apresentação básica do negócio de bem-estar',
        '💪 Exercícios básicos',
        '🍎 Coaching básico',
        '📅 Programa básico'
      ],
      apresentacaoModerada: [
        '🧘‍♀️ Apresentação moderada do negócio de bem-estar',
        '💪 Exercícios específicos',
        '🍎 Coaching direcionado',
        '📅 Programa moderado'
      ],
      apresentacaoAvancada: [
        '🧘‍♀️ Apresentação avançada do negócio de bem-estar',
        '💪 Exercícios complexos',
        '🍎 Coaching avançado',
        '📅 Programa avançado'
      ]
    }
  },

  // 44. TEMPLATE DE SCRIPT DE CONVITE
  'template-script-convite': {
    nutri: {
      conviteBasico: [
        '📋 Script básico de convite nutricional',
        '🥗 Convite simples para consulta',
        '💊 Convite básico para suplementação',
        '📅 Convite básico nutricional'
      ],
      conviteModerado: [
        '📋 Script moderado de convite nutricional',
        '🥗 Convite específico para consulta',
        '💊 Convite direcionado para suplementação',
        '📅 Convite moderado nutricional'
      ],
      conviteAvancado: [
        '📋 Script avançado de convite nutricional',
        '🥗 Convite complexo para consulta',
        '💊 Convite avançado para suplementação',
        '📅 Convite avançado nutricional'
      ]
    },
    sales: {
      conviteBasico: [
        '💊 Script básico de convite para produtos',
        '🥗 Convite simples para suplementos',
        '💪 Convite básico para produtos',
        '📞 Convite básico'
      ],
      conviteModerado: [
        '💊 Script moderado de convite para produtos',
        '🥗 Convite específico para suplementos',
        '💪 Convite direcionado para produtos',
        '📞 Convite moderado'
      ],
      conviteAvancado: [
        '💊 Script avançado de convite para produtos',
        '🥗 Convite complexo para suplementos',
        '💪 Convite avançado para produtos',
        '📞 Convite avançado'
      ]
    },
    coach: {
      conviteBasico: [
        '🧘‍♀️ Script básico de convite para bem-estar',
        '💪 Convite simples para exercícios',
        '🍎 Convite básico para coaching',
        '📅 Convite básico'
      ],
      conviteModerado: [
        '🧘‍♀️ Script moderado de convite para bem-estar',
        '💪 Convite específico para exercícios',
        '🍎 Convite direcionado para coaching',
        '📅 Convite moderado'
      ],
      conviteAvancado: [
        '🧘‍♀️ Script avançado de convite para bem-estar',
        '💪 Convite complexo para exercícios',
        '🍎 Convite avançado para coaching',
        '📅 Convite avançado'
      ]
    }
  },

  // 45. TEMPLATE DE ONBOARDING DE PARCEIRO
  'template-onboarding-parceiro': {
    nutri: {
      onboardingBasico: [
        '📋 Onboarding básico de parceiro nutricional',
        '🥗 Treinamento básico nutricional',
        '💊 Suplementação básica para parceiros',
        '📅 Consulta nutricional básica para parceiros'
      ],
      onboardingModerado: [
        '📋 Onboarding moderado de parceiro nutricional',
        '🥗 Treinamento específico nutricional',
        '💊 Suplementação direcionada para parceiros',
        '📅 Consulta nutricional especializada para parceiros'
      ],
      onboardingAvancado: [
        '📋 Onboarding avançado de parceiro nutricional',
        '🥗 Treinamento complexo nutricional',
        '💊 Suplementação avançada para parceiros',
        '📅 Consulta nutricional de performance para parceiros'
      ]
    },
    sales: {
      onboardingBasico: [
        '💊 Onboarding básico de parceiro de produtos',
        '🥗 Treinamento básico de produtos',
        '💪 Produtos básicos para parceiros',
        '📞 Consultoria básica para parceiros'
      ],
      onboardingModerado: [
        '💊 Onboarding moderado de parceiro de produtos',
        '🥗 Treinamento específico de produtos',
        '💪 Produtos específicos para parceiros',
        '📞 Consultoria moderada para parceiros'
      ],
      onboardingAvancado: [
        '💊 Onboarding avançado de parceiro de produtos',
        '🥗 Treinamento complexo de produtos',
        '💪 Produtos complexos para parceiros',
        '📞 Consultoria avançada para parceiros'
      ]
    },
    coach: {
      onboardingBasico: [
        '🧘‍♀️ Onboarding básico de parceiro de bem-estar',
        '💪 Treinamento básico de exercícios',
        '🍎 Coaching básico para parceiros',
        '📅 Programa básico para parceiros'
      ],
      onboardingModerado: [
        '🧘‍♀️ Onboarding moderado de parceiro de bem-estar',
        '💪 Treinamento específico de exercícios',
        '🍎 Coaching direcionado para parceiros',
        '📅 Programa moderado para parceiros'
      ],
      onboardingAvancado: [
        '🧘‍♀️ Onboarding avançado de parceiro de bem-estar',
        '💪 Treinamento complexo de exercícios',
        '🍎 Coaching avançado para parceiros',
        '📅 Programa avançado para parceiros'
      ]
    }
  },

  // 46. TEMPLATE DE PLANO DE AÇÃO DA EQUIPE
  'template-plano-acao-equipe': {
    nutri: {
      planoBasico: [
        '📋 Plano básico de ação da equipe nutricional',
        '🥗 Ações básicas nutricionais',
        '💊 Suplementação básica da equipe',
        '📅 Consulta nutricional básica da equipe'
      ],
      planoModerado: [
        '📋 Plano moderado de ação da equipe nutricional',
        '🥗 Ações específicas nutricionais',
        '💊 Suplementação direcionada da equipe',
        '📅 Consulta nutricional especializada da equipe'
      ],
      planoAvancado: [
        '📋 Plano avançado de ação da equipe nutricional',
        '🥗 Ações complexas nutricionais',
        '💊 Suplementação avançada da equipe',
        '📅 Consulta nutricional de performance da equipe'
      ]
    },
    sales: {
      planoBasico: [
        '💊 Plano básico de ação da equipe de produtos',
        '🥗 Ações básicas de produtos',
        '💪 Produtos básicos da equipe',
        '📞 Consultoria básica da equipe'
      ],
      planoModerado: [
        '💊 Plano moderado de ação da equipe de produtos',
        '🥗 Ações específicas de produtos',
        '💪 Produtos específicos da equipe',
        '📞 Consultoria moderada da equipe'
      ],
      planoAvancado: [
        '💊 Plano avançado de ação da equipe de produtos',
        '🥗 Ações complexas de produtos',
        '💪 Produtos complexos da equipe',
        '📞 Consultoria avançada da equipe'
      ]
    },
    coach: {
      planoBasico: [
        '🧘‍♀️ Plano básico de ação da equipe de bem-estar',
        '💪 Ações básicas de exercícios',
        '🍎 Coaching básico da equipe',
        '📅 Programa básico da equipe'
      ],
      planoModerado: [
        '🧘‍♀️ Plano moderado de ação da equipe de bem-estar',
        '💪 Ações específicas de exercícios',
        '🍎 Coaching direcionado da equipe',
        '📅 Programa moderado da equipe'
      ],
      planoAvancado: [
        '🧘‍♀️ Plano avançado de ação da equipe de bem-estar',
        '💪 Ações complexas de exercícios',
        '🍎 Coaching avançado da equipe',
        '📅 Programa avançado da equipe'
      ]
    }
  },

  // 47. TEMPLATE DE FEEDBACK DE CLIENTE
  'template-feedback-cliente': {
    nutri: {
      feedbackBasico: [
        '📋 Feedback básico de cliente nutricional',
        '🥗 Avaliação básica nutricional',
        '💊 Suplementação básica baseada no feedback',
        '📅 Consulta nutricional básica baseada no feedback'
      ],
      feedbackModerado: [
        '📋 Feedback moderado de cliente nutricional',
        '🥗 Avaliação específica nutricional',
        '💊 Suplementação direcionada baseada no feedback',
        '📅 Consulta nutricional especializada baseada no feedback'
      ],
      feedbackAvancado: [
        '📋 Feedback avançado de cliente nutricional',
        '🥗 Avaliação complexa nutricional',
        '💊 Suplementação avançada baseada no feedback',
        '📅 Consulta nutricional de performance baseada no feedback'
      ]
    },
    sales: {
      feedbackBasico: [
        '💊 Feedback básico de cliente de produtos',
        '🥗 Avaliação básica de produtos',
        '💪 Produtos básicos baseados no feedback',
        '📞 Consultoria básica baseada no feedback'
      ],
      feedbackModerado: [
        '💊 Feedback moderado de cliente de produtos',
        '🥗 Avaliação específica de produtos',
        '💪 Produtos específicos baseados no feedback',
        '📞 Consultoria moderada baseada no feedback'
      ],
      feedbackAvancado: [
        '💊 Feedback avançado de cliente de produtos',
        '🥗 Avaliação complexa de produtos',
        '💪 Produtos complexos baseados no feedback',
        '📞 Consultoria avançada baseada no feedback'
      ]
    },
    coach: {
      feedbackBasico: [
        '🧘‍♀️ Feedback básico de cliente de bem-estar',
        '💪 Avaliação básica de exercícios',
        '🍎 Coaching básico baseado no feedback',
        '📅 Programa básico baseado no feedback'
      ],
      feedbackModerado: [
        '🧘‍♀️ Feedback moderado de cliente de bem-estar',
        '💪 Avaliação específica de exercícios',
        '🍎 Coaching direcionado baseado no feedback',
        '📅 Programa moderado baseado no feedback'
      ],
      feedbackAvancado: [
        '🧘‍♀️ Feedback avançado de cliente de bem-estar',
        '💪 Avaliação complexa de exercícios',
        '🍎 Coaching avançado baseado no feedback',
        '📅 Programa avançado baseado no feedback'
      ]
    }
  },

  // 48. TEMPLATE DE MENSAGEM PÓS-COMPRA
  'template-mensagem-pos-compra': {
    nutri: {
      mensagemBasica: [
        '📋 Mensagem básica pós-compra nutricional',
        '🥗 Orientações básicas nutricionais',
        '💊 Suplementação básica pós-compra',
        '📅 Consulta nutricional básica pós-compra'
      ],
      mensagemModerada: [
        '📋 Mensagem moderada pós-compra nutricional',
        '🥗 Orientações específicas nutricionais',
        '💊 Suplementação direcionada pós-compra',
        '📅 Consulta nutricional especializada pós-compra'
      ],
      mensagemAvancada: [
        '📋 Mensagem avançada pós-compra nutricional',
        '🥗 Orientações complexas nutricionais',
        '💊 Suplementação avançada pós-compra',
        '📅 Consulta nutricional de performance pós-compra'
      ]
    },
    sales: {
      mensagemBasica: [
        '💊 Mensagem básica pós-compra de produtos',
        '🥗 Orientações básicas de produtos',
        '💪 Produtos básicos pós-compra',
        '📞 Consultoria básica pós-compra'
      ],
      mensagemModerada: [
        '💊 Mensagem moderada pós-compra de produtos',
        '🥗 Orientações específicas de produtos',
        '💪 Produtos específicos pós-compra',
        '📞 Consultoria moderada pós-compra'
      ],
      mensagemAvancada: [
        '💊 Mensagem avançada pós-compra de produtos',
        '🥗 Orientações complexas de produtos',
        '💪 Produtos complexos pós-compra',
        '📞 Consultoria avançada pós-compra'
      ]
    },
    coach: {
      mensagemBasica: [
        '🧘‍♀️ Mensagem básica pós-compra de bem-estar',
        '💪 Orientações básicas de exercícios',
        '🍎 Coaching básico pós-compra',
        '📅 Programa básico pós-compra'
      ],
      mensagemModerada: [
        '🧘‍♀️ Mensagem moderada pós-compra de bem-estar',
        '💪 Orientações específicas de exercícios',
        '🍎 Coaching direcionado pós-compra',
        '📅 Programa moderado pós-compra'
      ],
      mensagemAvancada: [
        '🧘‍♀️ Mensagem avançada pós-compra de bem-estar',
        '💪 Orientações complexas de exercícios',
        '🍎 Coaching avançado pós-compra',
        '📅 Programa avançado pós-compra'
      ]
    }
  },

  // 49. TEMPLATE DE E-MAIL DE REPOSIÇÃO
  'template-email-reposicao': {
    nutri: {
      reposicaoBasica: [
        '📋 E-mail básico de reposição nutricional',
        '🥗 Reposição básica nutricional',
        '💊 Suplementação básica de reposição',
        '📅 Consulta nutricional básica de reposição'
      ],
      reposicaoModerada: [
        '📋 E-mail moderado de reposição nutricional',
        '🥗 Reposição específica nutricional',
        '💊 Suplementação direcionada de reposição',
        '📅 Consulta nutricional especializada de reposição'
      ],
      reposicaoAvancada: [
        '📋 E-mail avançado de reposição nutricional',
        '🥗 Reposição complexa nutricional',
        '💊 Suplementação avançada de reposição',
        '📅 Consulta nutricional de performance de reposição'
      ]
    },
    sales: {
      reposicaoBasica: [
        '💊 E-mail básico de reposição de produtos',
        '🥗 Reposição básica de produtos',
        '💪 Produtos básicos de reposição',
        '📞 Consultoria básica de reposição'
      ],
      reposicaoModerada: [
        '💊 E-mail moderado de reposição de produtos',
        '🥗 Reposição específica de produtos',
        '💪 Produtos específicos de reposição',
        '📞 Consultoria moderada de reposição'
      ],
      reposicaoAvancada: [
        '💊 E-mail avançado de reposição de produtos',
        '🥗 Reposição complexa de produtos',
        '💪 Produtos complexos de reposição',
        '📞 Consultoria avançada de reposição'
      ]
    },
    coach: {
      reposicaoBasica: [
        '🧘‍♀️ E-mail básico de reposição de bem-estar',
        '💪 Reposição básica de exercícios',
        '🍎 Coaching básico de reposição',
        '📅 Programa básico de reposição'
      ],
      reposicaoModerada: [
        '🧘‍♀️ E-mail moderado de reposição de bem-estar',
        '💪 Reposição específica de exercícios',
        '🍎 Coaching direcionado de reposição',
        '📅 Programa moderado de reposição'
      ],
      reposicaoAvancada: [
        '🧘‍♀️ E-mail avançado de reposição de bem-estar',
        '💪 Reposição complexa de exercícios',
        '🍎 Coaching avançado de reposição',
        '📅 Programa avançado de reposição'
      ]
    }
  },

  // 50. TEMPLATE DE ANIVERSÁRIO
  'template-aniversario': {
    nutri: [
      '📋 Mensagem de aniversário nutricional',
      '🥗 Ofertas especiais nutricionais',
      '💊 Suplementação especial de aniversário',
      '📅 Consulta nutricional especial de aniversário'
    ],
    sales: [
      '💊 Mensagem de aniversário de produtos',
      '🥗 Ofertas especiais de produtos',
      '💪 Produtos especiais de aniversário',
      '📞 Consultoria especial de aniversário'
    ],
    coach: [
      '🧘‍♀️ Mensagem de aniversário de bem-estar',
      '💪 Ofertas especiais de exercícios',
      '🍎 Coaching especial de aniversário',
      '📅 Programa especial de aniversário'
    ]
  },

  // 51. TEMPLATE DE RECOMPENSA / CASHBACK
  'template-recompensa-cashback': {
    nutri: {
      recompensaBasica: [
        '📋 Sistema básico de recompensa nutricional',
        '🥗 Pontos por consultas nutricionais',
        '💊 Cashback em suplementação',
        '📅 Programa básico de fidelidade'
      ],
      recompensaModerada: [
        '📋 Sistema moderado de recompensa nutricional',
        '🥗 Pontos por planos alimentares',
        '💊 Cashback direcionado em suplementação',
        '📅 Programa moderado de fidelidade'
      ],
      recompensaAvancada: [
        '📋 Sistema avançado de recompensa nutricional',
        '🥗 Pontos por acompanhamento nutricional',
        '💊 Cashback avançado em suplementação',
        '📅 Programa avançado de fidelidade'
      ]
    },
    sales: {
      recompensaBasica: [
        '💊 Sistema básico de recompensa de produtos',
        '🥗 Pontos por compras de suplementos',
        '💪 Cashback básico em produtos',
        '📞 Programa básico de fidelidade'
      ],
      recompensaModerada: [
        '💊 Sistema moderado de recompensa de produtos',
        '🥗 Pontos por consultoria',
        '💪 Cashback moderado em produtos',
        '📞 Programa moderado de fidelidade'
      ],
      recompensaAvancada: [
        '💊 Sistema avançado de recompensa de produtos',
        '🥗 Pontos por indicações',
        '💪 Cashback avançado em produtos',
        '📞 Programa avançado de fidelidade'
      ]
    },
    coach: {
      recompensaBasica: [
        '🧘‍♀️ Sistema básico de recompensa de bem-estar',
        '💪 Pontos por exercícios',
        '🍎 Cashback básico em coaching',
        '📅 Programa básico de fidelidade'
      ],
      recompensaModerada: [
        '🧘‍♀️ Sistema moderado de recompensa de bem-estar',
        '💪 Pontos por programas',
        '🍎 Cashback moderado em coaching',
        '📅 Programa moderado de fidelidade'
      ],
      recompensaAvancada: [
        '🧘‍♀️ Sistema avançado de recompensa de bem-estar',
        '💪 Pontos por transformações',
        '🍎 Cashback avançado em coaching',
        '📅 Programa avançado de fidelidade'
      ]
    }
  },

  // 52. TEMPLATE DE AGRADECIMENTO
  'template-agradecimento': {
    nutri: {
      agradecimentoBasico: [
        '📋 Agradecimento básico nutricional',
        '🥗 Mensagem simples de gratidão',
        '💊 Obrigado pela confiança',
        '📅 Agradecimento básico'
      ],
      agradecimentoModerado: [
        '📋 Agradecimento moderado nutricional',
        '🥗 Mensagem específica de gratidão',
        '💊 Obrigado pela parceria',
        '📅 Agradecimento moderado'
      ],
      agradecimentoAvancado: [
        '📋 Agradecimento avançado nutricional',
        '🥗 Mensagem complexa de gratidão',
        '💊 Obrigado pela transformação',
        '📅 Agradecimento avançado'
      ]
    },
    sales: {
      agradecimentoBasico: [
        '💊 Agradecimento básico de produtos',
        '🥗 Mensagem simples de gratidão',
        '💪 Obrigado pela compra',
        '📞 Agradecimento básico'
      ],
      agradecimentoModerado: [
        '💊 Agradecimento moderado de produtos',
        '🥗 Mensagem específica de gratidão',
        '💪 Obrigado pela indicação',
        '📞 Agradecimento moderado'
      ],
      agradecimentoAvancado: [
        '💊 Agradecimento avançado de produtos',
        '🥗 Mensagem complexa de gratidão',
        '💪 Obrigado pela parceria',
        '📞 Agradecimento avançado'
      ]
    },
    coach: {
      agradecimentoBasico: [
        '🧘‍♀️ Agradecimento básico de bem-estar',
        '💪 Mensagem simples de gratidão',
        '🍎 Obrigado pela confiança',
        '📅 Agradecimento básico'
      ],
      agradecimentoModerado: [
        '🧘‍♀️ Agradecimento moderado de bem-estar',
        '💪 Mensagem específica de gratidão',
        '🍎 Obrigado pela dedicação',
        '📅 Agradecimento moderado'
      ],
      agradecimentoAvancado: [
        '🧘‍♀️ Agradecimento avançado de bem-estar',
        '💪 Mensagem complexa de gratidão',
        '🍎 Obrigado pela transformação',
        '📅 Agradecimento avançado'
      ]
    }
  },

  // 53. TEMPLATE DE PLANO SEMANAL DE CONTEÚDO
  'template-plano-semanal-conteudo': {
    nutri: {
      conteudoBasico: [
        '📋 Plano básico semanal de conteúdo nutricional',
        '🥗 Conteúdo simples sobre alimentação',
        '💊 Posts básicos sobre suplementação',
        '📅 Cronograma básico semanal'
      ],
      conteudoModerado: [
        '📋 Plano moderado semanal de conteúdo nutricional',
        '🥗 Conteúdo específico sobre alimentação',
        '💊 Posts direcionados sobre suplementação',
        '📅 Cronograma moderado semanal'
      ],
      conteudoAvancado: [
        '📋 Plano avançado semanal de conteúdo nutricional',
        '🥗 Conteúdo complexo sobre alimentação',
        '💊 Posts avançados sobre suplementação',
        '📅 Cronograma avançado semanal'
      ]
    },
    sales: {
      conteudoBasico: [
        '💊 Plano básico semanal de conteúdo de produtos',
        '🥗 Conteúdo simples sobre suplementos',
        '💪 Posts básicos sobre produtos',
        '📞 Cronograma básico semanal'
      ],
      conteudoModerado: [
        '💊 Plano moderado semanal de conteúdo de produtos',
        '🥗 Conteúdo específico sobre suplementos',
        '💪 Posts direcionados sobre produtos',
        '📞 Cronograma moderado semanal'
      ],
      conteudoAvancado: [
        '💊 Plano avançado semanal de conteúdo de produtos',
        '🥗 Conteúdo complexo sobre suplementos',
        '💪 Posts avançados sobre produtos',
        '📞 Cronograma avançado semanal'
      ]
    },
    coach: {
      conteudoBasico: [
        '🧘‍♀️ Plano básico semanal de conteúdo de bem-estar',
        '💪 Conteúdo simples sobre exercícios',
        '🍎 Posts básicos sobre coaching',
        '📅 Cronograma básico semanal'
      ],
      conteudoModerado: [
        '🧘‍♀️ Plano moderado semanal de conteúdo de bem-estar',
        '💪 Conteúdo específico sobre exercícios',
        '🍎 Posts direcionados sobre coaching',
        '📅 Cronograma moderado semanal'
      ],
      conteudoAvancado: [
        '🧘‍♀️ Plano avançado semanal de conteúdo de bem-estar',
        '💪 Conteúdo complexo sobre exercícios',
        '🍎 Posts avançados sobre coaching',
        '📅 Cronograma avançado semanal'
      ]
    }
  },

  // 54. TEMPLATE DE REELS EDUCATIVO
  'template-reels-educativo': {
    nutri: {
      reelsBasico: [
        '📋 Reels básico educativo nutricional',
        '🥗 Educação simples sobre alimentação',
        '💊 Informações básicas sobre suplementação',
        '📅 Conteúdo básico educativo'
      ],
      reelsModerado: [
        '📋 Reels moderado educativo nutricional',
        '🥗 Educação específica sobre alimentação',
        '💊 Informações direcionadas sobre suplementação',
        '📅 Conteúdo moderado educativo'
      ],
      reelsAvancado: [
        '📋 Reels avançado educativo nutricional',
        '🥗 Educação complexa sobre alimentação',
        '💊 Informações avançadas sobre suplementação',
        '📅 Conteúdo avançado educativo'
      ]
    },
    sales: {
      reelsBasico: [
        '💊 Reels básico educativo de produtos',
        '🥗 Educação simples sobre suplementos',
        '💪 Informações básicas sobre produtos',
        '📞 Conteúdo básico educativo'
      ],
      reelsModerado: [
        '💊 Reels moderado educativo de produtos',
        '🥗 Educação específica sobre suplementos',
        '💪 Informações direcionadas sobre produtos',
        '📞 Conteúdo moderado educativo'
      ],
      reelsAvancado: [
        '💊 Reels avançado educativo de produtos',
        '🥗 Educação complexa sobre suplementos',
        '💪 Informações avançadas sobre produtos',
        '📞 Conteúdo avançado educativo'
      ]
    },
    coach: {
      reelsBasico: [
        '🧘‍♀️ Reels básico educativo de bem-estar',
        '💪 Educação simples sobre exercícios',
        '🍎 Informações básicas sobre coaching',
        '📅 Conteúdo básico educativo'
      ],
      reelsModerado: [
        '🧘‍♀️ Reels moderado educativo de bem-estar',
        '💪 Educação específica sobre exercícios',
        '🍎 Informações direcionadas sobre coaching',
        '📅 Conteúdo moderado educativo'
      ],
      reelsAvancado: [
        '🧘‍♀️ Reels avançado educativo de bem-estar',
        '💪 Educação complexa sobre exercícios',
        '🍎 Informações avançadas sobre coaching',
        '📅 Conteúdo avançado educativo'
      ]
    }
  },

  // 55. TEMPLATE DE CONTEÚDO DE AUTORIDADE
  'template-conteudo-autoridade': {
    nutri: {
      autoridadeBasica: [
        '📋 Conteúdo básico de autoridade nutricional',
        '🥗 Autoridade simples em alimentação',
        '💊 Credibilidade básica em suplementação',
        '📅 Posicionamento básico nutricional'
      ],
      autoridadeModerada: [
        '📋 Conteúdo moderado de autoridade nutricional',
        '🥗 Autoridade específica em alimentação',
        '💊 Credibilidade direcionada em suplementação',
        '📅 Posicionamento moderado nutricional'
      ],
      autoridadeAvancada: [
        '📋 Conteúdo avançado de autoridade nutricional',
        '🥗 Autoridade complexa em alimentação',
        '💊 Credibilidade avançada em suplementação',
        '📅 Posicionamento avançado nutricional'
      ]
    },
    sales: {
      autoridadeBasica: [
        '💊 Conteúdo básico de autoridade de produtos',
        '🥗 Autoridade simples em suplementos',
        '💪 Credibilidade básica em produtos',
        '📞 Posicionamento básico'
      ],
      autoridadeModerada: [
        '💊 Conteúdo moderado de autoridade de produtos',
        '🥗 Autoridade específica em suplementos',
        '💪 Credibilidade direcionada em produtos',
        '📞 Posicionamento moderado'
      ],
      autoridadeAvancada: [
        '💊 Conteúdo avançado de autoridade de produtos',
        '🥗 Autoridade complexa em suplementos',
        '💪 Credibilidade avançada em produtos',
        '📞 Posicionamento avançado'
      ]
    },
    coach: {
      autoridadeBasica: [
        '🧘‍♀️ Conteúdo básico de autoridade de bem-estar',
        '💪 Autoridade simples em exercícios',
        '🍎 Credibilidade básica em coaching',
        '📅 Posicionamento básico'
      ],
      autoridadeModerada: [
        '🧘‍♀️ Conteúdo moderado de autoridade de bem-estar',
        '💪 Autoridade específica em exercícios',
        '🍎 Credibilidade direcionada em coaching',
        '📅 Posicionamento moderado'
      ],
      autoridadeAvancada: [
        '🧘‍♀️ Conteúdo avançado de autoridade de bem-estar',
        '💪 Autoridade complexa em exercícios',
        '🍎 Credibilidade avançada em coaching',
        '📅 Posicionamento avançado'
      ]
    }
  },

  // 56. TEMPLATE DE TESTEMUNHO VISUAL
  'template-testemunho-visual': {
    nutri: {
      testemunhoBasico: [
        '📋 Testemunho básico visual nutricional',
        '🥗 Depoimento simples sobre alimentação',
        '💊 Resultado básico com suplementação',
        '📅 Transformação básica nutricional'
      ],
      testemunhoModerado: [
        '📋 Testemunho moderado visual nutricional',
        '🥗 Depoimento específico sobre alimentação',
        '💊 Resultado direcionado com suplementação',
        '📅 Transformação moderada nutricional'
      ],
      testemunhoAvancado: [
        '📋 Testemunho avançado visual nutricional',
        '🥗 Depoimento complexo sobre alimentação',
        '💊 Resultado avançado com suplementação',
        '📅 Transformação avançada nutricional'
      ]
    },
    sales: {
      testemunhoBasico: [
        '💊 Testemunho básico visual de produtos',
        '🥗 Depoimento simples sobre suplementos',
        '💪 Resultado básico com produtos',
        '📞 Transformação básica'
      ],
      testemunhoModerado: [
        '💊 Testemunho moderado visual de produtos',
        '🥗 Depoimento específico sobre suplementos',
        '💪 Resultado direcionado com produtos',
        '📞 Transformação moderada'
      ],
      testemunhoAvancado: [
        '💊 Testemunho avançado visual de produtos',
        '🥗 Depoimento complexo sobre suplementos',
        '💪 Resultado avançado com produtos',
        '📞 Transformação avançada'
      ]
    },
    coach: {
      testemunhoBasico: [
        '🧘‍♀️ Testemunho básico visual de bem-estar',
        '💪 Depoimento simples sobre exercícios',
        '🍎 Resultado básico com coaching',
        '📅 Transformação básica'
      ],
      testemunhoModerado: [
        '🧘‍♀️ Testemunho moderado visual de bem-estar',
        '💪 Depoimento específico sobre exercícios',
        '🍎 Resultado direcionado com coaching',
        '📅 Transformação moderada'
      ],
      testemunhoAvancado: [
        '🧘‍♀️ Testemunho avançado visual de bem-estar',
        '💪 Depoimento complexo sobre exercícios',
        '🍎 Resultado avançado com coaching',
        '📅 Transformação avançada'
      ]
    }
  },

  // 57. TEMPLATE DE CALENDÁRIO DE POSTAGENS
  'template-calendario-postagens': {
    nutri: {
      calendarioBasico: [
        '📋 Calendário básico de postagens nutricionais',
        '🥗 Cronograma simples de alimentação',
        '💊 Posts básicos sobre suplementação',
        '📅 Agenda básica nutricional'
      ],
      calendarioModerado: [
        '📋 Calendário moderado de postagens nutricionais',
        '🥗 Cronograma específico de alimentação',
        '💊 Posts direcionados sobre suplementação',
        '📅 Agenda moderada nutricional'
      ],
      calendarioAvancado: [
        '📋 Calendário avançado de postagens nutricionais',
        '🥗 Cronograma complexo de alimentação',
        '💊 Posts avançados sobre suplementação',
        '📅 Agenda avançada nutricional'
      ]
    },
    sales: {
      calendarioBasico: [
        '💊 Calendário básico de postagens de produtos',
        '🥗 Cronograma simples de suplementos',
        '💪 Posts básicos sobre produtos',
        '📞 Agenda básica'
      ],
      calendarioModerado: [
        '💊 Calendário moderado de postagens de produtos',
        '🥗 Cronograma específico de suplementos',
        '💪 Posts direcionados sobre produtos',
        '📞 Agenda moderada'
      ],
      calendarioAvancado: [
        '💊 Calendário avançado de postagens de produtos',
        '🥗 Cronograma complexo de suplementos',
        '💪 Posts avançados sobre produtos',
        '📞 Agenda avançada'
      ]
    },
    coach: {
      calendarioBasico: [
        '🧘‍♀️ Calendário básico de postagens de bem-estar',
        '💪 Cronograma simples de exercícios',
        '🍎 Posts básicos sobre coaching',
        '📅 Agenda básica'
      ],
      calendarioModerado: [
        '🧘‍♀️ Calendário moderado de postagens de bem-estar',
        '💪 Cronograma específico de exercícios',
        '🍎 Posts direcionados sobre coaching',
        '📅 Agenda moderada'
      ],
      calendarioAvancado: [
        '🧘‍♀️ Calendário avançado de postagens de bem-estar',
        '💪 Cronograma complexo de exercícios',
        '🍎 Posts avançados sobre coaching',
        '📅 Agenda avançada'
      ]
    }
  },

  // 58. TEMPLATE DE ESTRATÉGIA DE LANÇAMENTO
  'template-estrategia-lancamento': {
    nutri: {
      lancamentoBasico: [
        '📋 Estratégia básica de lançamento nutricional',
        '🥗 Lançamento simples de produtos',
        '💊 Estratégia básica de suplementação',
        '📅 Plano básico de lançamento'
      ],
      lancamentoModerado: [
        '📋 Estratégia moderada de lançamento nutricional',
        '🥗 Lançamento específico de produtos',
        '💊 Estratégia direcionada de suplementação',
        '📅 Plano moderado de lançamento'
      ],
      lancamentoAvancado: [
        '📋 Estratégia avançada de lançamento nutricional',
        '🥗 Lançamento complexo de produtos',
        '💊 Estratégia avançada de suplementação',
        '📅 Plano avançado de lançamento'
      ]
    },
    sales: {
      lancamentoBasico: [
        '💊 Estratégia básica de lançamento de produtos',
        '🥗 Lançamento simples de suplementos',
        '💪 Estratégia básica de produtos',
        '📞 Plano básico de lançamento'
      ],
      lancamentoModerado: [
        '💊 Estratégia moderada de lançamento de produtos',
        '🥗 Lançamento específico de suplementos',
        '💪 Estratégia direcionada de produtos',
        '📞 Plano moderado de lançamento'
      ],
      lancamentoAvancado: [
        '💊 Estratégia avançada de lançamento de produtos',
        '🥗 Lançamento complexo de suplementos',
        '💪 Estratégia avançada de produtos',
        '📞 Plano avançado de lançamento'
      ]
    },
    coach: {
      lancamentoBasico: [
        '🧘‍♀️ Estratégia básica de lançamento de bem-estar',
        '💪 Lançamento simples de programas',
        '🍎 Estratégia básica de coaching',
        '📅 Plano básico de lançamento'
      ],
      lancamentoModerado: [
        '🧘‍♀️ Estratégia moderada de lançamento de bem-estar',
        '💪 Lançamento específico de programas',
        '🍎 Estratégia direcionada de coaching',
        '📅 Plano moderado de lançamento'
      ],
      lancamentoAvancado: [
        '🧘‍♀️ Estratégia avançada de lançamento de bem-estar',
        '💪 Lançamento complexo de programas',
        '🍎 Estratégia avançada de coaching',
        '📅 Plano avançado de lançamento'
      ]
    }
  },

  // 59. TEMPLATE DE JORNADA DO CLIENTE
  'template-jornada-cliente': {
    nutri: {
      jornadaBasica: [
        '📋 Jornada básica do cliente nutricional',
        '🥗 Experiência simples de alimentação',
        '💊 Processo básico de suplementação',
        '📅 Acompanhamento básico nutricional'
      ],
      jornadaModerada: [
        '📋 Jornada moderada do cliente nutricional',
        '🥗 Experiência específica de alimentação',
        '💊 Processo direcionado de suplementação',
        '📅 Acompanhamento moderado nutricional'
      ],
      jornadaAvancada: [
        '📋 Jornada avançada do cliente nutricional',
        '🥗 Experiência complexa de alimentação',
        '💊 Processo avançado de suplementação',
        '📅 Acompanhamento avançado nutricional'
      ]
    },
    sales: {
      jornadaBasica: [
        '💊 Jornada básica do cliente de produtos',
        '🥗 Experiência simples de suplementos',
        '💪 Processo básico de produtos',
        '📞 Acompanhamento básico'
      ],
      jornadaModerada: [
        '💊 Jornada moderada do cliente de produtos',
        '🥗 Experiência específica de suplementos',
        '💪 Processo direcionado de produtos',
        '📞 Acompanhamento moderado'
      ],
      jornadaAvancada: [
        '💊 Jornada avançada do cliente de produtos',
        '🥗 Experiência complexa de suplementos',
        '💪 Processo avançado de produtos',
        '📞 Acompanhamento avançado'
      ]
    },
    coach: {
      jornadaBasica: [
        '🧘‍♀️ Jornada básica do cliente de bem-estar',
        '💪 Experiência simples de exercícios',
        '🍎 Processo básico de coaching',
        '📅 Acompanhamento básico'
      ],
      jornadaModerada: [
        '🧘‍♀️ Jornada moderada do cliente de bem-estar',
        '💪 Experiência específica de exercícios',
        '🍎 Processo direcionado de coaching',
        '📅 Acompanhamento moderado'
      ],
      jornadaAvancada: [
        '🧘‍♀️ Jornada avançada do cliente de bem-estar',
        '💪 Experiência complexa de exercícios',
        '🍎 Processo avançado de coaching',
        '📅 Acompanhamento avançado'
      ]
    }
  },

  // 60. TEMPLATE DE JORNADA DO CLIENTE (FINAL)
  'template-jornada-cliente-final': {
    nutri: [
      '📋 Jornada completa do cliente nutricional',
      '🥗 Experiência total de transformação',
      '💊 Processo completo de suplementação',
      '📅 Acompanhamento integral nutricional'
    ],
    sales: [
      '💊 Jornada completa do cliente de produtos',
      '🥗 Experiência total de transformação',
      '💪 Processo completo de produtos',
      '📞 Acompanhamento integral'
    ],
    coach: [
      '🧘‍♀️ Jornada completa do cliente de bem-estar',
      '💪 Experiência total de transformação',
      '🍎 Processo completo de coaching',
      '📅 Acompanhamento integral'
    ]
  },

  // 4. QUIZ DE PERFIL NUTRICIONAL
  'quiz-perfil-nutricional': {
    nutri: {
      perfilDeficiente: [
        '📋 Avaliação nutricional completa para correção de deficiências',
        '🥗 Plano alimentar para reposição nutricional',
        '💊 Suplementação específica para deficiências',
        '📅 Acompanhamento nutricional intensivo semanal'
      ],
      perfilEquilibrado: [
        '📋 Manutenção do equilíbrio nutricional',
        '🥗 Plano alimentar para otimização nutricional',
        '💊 Suplementação preventiva',
        '📅 Consultas de manutenção mensais'
      ],
      perfilOtimizado: [
        '📋 Otimização avançada do perfil nutricional',
        '🥗 Plano alimentar para performance nutricional',
        '💊 Suplementação de alta performance',
        '📅 Acompanhamento especializado nutricional'
      ]
    },
    sales: {
      perfilDeficiente: [
        '💊 Multivitamínicos para correção de deficiências',
        '🥗 Proteínas para reposição nutricional',
        '💪 Suplementos específicos para deficiências',
        '📞 Consultoria especializada em deficiências nutricionais'
      ],
      perfilEquilibrado: [
        '💊 Multivitamínicos para manutenção',
        '🥗 Proteínas para equilíbrio nutricional',
        '💪 Suplementos preventivos',
        '📞 Consultoria preventiva de suplementação'
      ],
      perfilOtimizado: [
        '💊 Suplementos de alta performance nutricional',
        '🥗 Proteínas para otimização',
        '💪 Suplementos avançados',
        '📞 Consultoria especializada em performance nutricional'
      ]
    },
    coach: {
      perfilDeficiente: [
        '🧘‍♀️ Programa intensivo de correção nutricional',
        '💪 Treinos adaptados para deficiências',
        '🍎 Coaching nutricional terapêutico',
        '📅 Acompanhamento semanal de correção'
      ],
      perfilEquilibrado: [
        '🧘‍♀️ Programa de manutenção nutricional',
        '💪 Treinos para equilíbrio nutricional',
        '🍎 Coaching de hábitos nutricionais',
        '📅 Acompanhamento mensal de manutenção'
      ],
      perfilOtimizado: [
        '🧘‍♀️ Programa de otimização nutricional avançada',
        '💪 Treinos para performance nutricional',
        '🍎 Coaching nutricional de alta performance',
        '📅 Acompanhamento especializado nutricional'
      ]
    }
  },

  // 5. QUIZ DETOX
  'quiz-detox': {
    nutri: {
      baixaToxicidade: [
        '📋 Manutenção da saúde detox natural',
        '🥗 Plano alimentar para sustentação detox',
        '💊 Suplementos de apoio detox',
        '📅 Consultas de manutenção detox mensais'
      ],
      toxicidadeModerada: [
        '📋 Plano detox moderado para redução de toxinas',
        '🥗 Plano alimentar detox específico',
        '💊 Suplementos detox específicos',
        '📅 Acompanhamento detox quinzenal'
      ],
      altaToxicidade: [
        '📋 Plano detox intensivo para eliminação de toxinas',
        '🥗 Plano alimentar detox completo',
        '💊 Suplementos detox intensivos',
        '📅 Acompanhamento detox semanal intensivo'
      ]
    },
    sales: {
      baixaToxicidade: [
        '💊 Suplementos de manutenção detox',
        '🥗 Proteínas para sustentação detox',
        '💪 Suplementos de apoio detox',
        '📞 Consultoria preventiva detox'
      ],
      toxicidadeModerada: [
        '💊 Suplementos detox moderados',
        '🥗 Proteínas para apoio detox',
        '💪 Suplementos específicos detox',
        '📞 Consultoria detox moderada'
      ],
      altaToxicidade: [
        '💊 Suplementos detox intensivos',
        '🥗 Proteínas para suporte detox',
        '💪 Suplementos detox avançados',
        '📞 Consultoria especializada detox'
      ]
    },
    coach: {
      baixaToxicidade: [
        '🧘‍♀️ Programa de manutenção detox',
        '💪 Treinos para sustentação detox',
        '🍎 Coaching nutricional detox preventivo',
        '📅 Acompanhamento mensal detox'
      ],
      toxicidadeModerada: [
        '🧘‍♀️ Programa detox moderado',
        '💪 Treinos para apoio detox',
        '🍎 Coaching nutricional detox',
        '📅 Acompanhamento quinzenal detox'
      ],
      altaToxicidade: [
        '🧘‍♀️ Programa detox intensivo',
        '💪 Treinos para suporte detox',
        '🍎 Coaching nutricional detox intensivo',
        '📅 Acompanhamento semanal detox'
      ]
    }
  },

  // 6. QUIZ ENERGÉTICO
  'quiz-energetico': {
    nutri: {
      baixaEnergia: [
        '📋 Avaliação energética completa',
        '🥗 Plano alimentar para aumento de energia',
        '💊 Suplementos energéticos naturais',
        '📅 Acompanhamento energético semanal'
      ],
      energiaModerada: [
        '📋 Otimização energética nutricional',
        '🥗 Plano alimentar para manutenção energética',
        '💊 Suplementos de apoio energético',
        '📅 Consultas de manutenção energética'
      ],
      altaEnergia: [
        '📋 Manutenção da alta energia',
        '🥗 Plano alimentar para sustentação energética',
        '💊 Suplementos preventivos energéticos',
        '📅 Acompanhamento preventivo energético'
      ]
    },
    sales: {
      baixaEnergia: [
        '💊 Suplementos energéticos para aumento',
        '🥗 Proteínas para energia',
        '💪 Suplementos para disposição',
        '📞 Consultoria energética especializada'
      ],
      energiaModerada: [
        '💊 Suplementos energéticos moderados',
        '🥗 Proteínas para manutenção energética',
        '💪 Suplementos de apoio energético',
        '📞 Consultoria preventiva energética'
      ],
      altaEnergia: [
        '💊 Suplementos para sustentação energética',
        '🥗 Proteínas para otimização energética',
        '💪 Suplementos de manutenção energética',
        '📞 Consultoria especializada energética'
      ]
    },
    coach: {
      baixaEnergia: [
        '🧘‍♀️ Programa intensivo de aumento energético',
        '💪 Treinos para aumento de energia',
        '🍎 Coaching nutricional energético',
        '📅 Acompanhamento semanal energético'
      ],
      energiaModerada: [
        '🧘‍♀️ Programa de otimização energética',
        '💪 Treinos para manutenção energética',
        '🍎 Coaching de hábitos energéticos',
        '📅 Acompanhamento mensal energético'
      ],
      altaEnergia: [
        '🧘‍♀️ Programa de sustentação energética',
        '💪 Treinos para manutenção da energia',
        '🍎 Coaching preventivo energético',
        '📅 Acompanhamento preventivo energético'
      ]
    }
  },

  // 7. CALCULADORA DE PROTEÍNA
  'calculadora-proteina': {
    nutri: {
      baixaProteina: [
        '📋 Plano proteico para correção de deficiência',
        '🥗 Estratégias para aumentar consumo de proteínas',
        '💊 Suplementação proteica para ganho de massa',
        '📅 Acompanhamento proteico semanal'
      ],
      proteinaNormal: [
        '📋 Otimização da distribuição proteica diária',
        '🥗 Plano alimentar para manutenção muscular',
        '💊 Suplementação proteica preventiva',
        '📅 Consultas de manutenção quinzenais'
      ],
      altaProteina: [
        '📋 Manutenção da alta ingestão proteica',
        '🥗 Plano alimentar para atletas de alta performance',
        '💊 Suplementação proteica especializada',
        '📅 Acompanhamento especializado mensal'
      ]
    },
    sales: {
      baixaProteina: [
        '💊 Whey Protein para correção imediata',
        '🥗 Proteínas vegetais de alta qualidade',
        '💪 Suplementos proteicos para iniciantes',
        '📞 Consultoria especializada em ganho de massa'
      ],
      proteinaNormal: [
        '💊 Proteínas para manutenção muscular',
        '🥗 Suplementos proteicos específicos',
        '💪 Produtos para performance moderada',
        '📞 Consultoria para praticantes regulares'
      ],
      altaProteina: [
        '💊 Proteínas premium para atletas',
        '🥗 Suplementos proteicos de alta performance',
        '💪 Produtos para atletas de elite',
        '📞 Consultoria especializada em esportes'
      ]
    },
    coach: {
      baixaProteina: [
        '🧘‍♀️ Programa de reeducação proteica básica',
        '💪 Exercícios leves com foco na proteína',
        '🍎 Coaching para mudança de hábitos proteicos',
        '📅 Programa de 30 dias para correção'
      ],
      proteinaNormal: [
        '🧘‍♀️ Programa de otimização proteica',
        '💪 Exercícios moderados com proteína adequada',
        '🍎 Coaching para melhoria da performance',
        '📅 Programa de 60 dias para evolução'
      ],
      altaProteina: [
        '🧘‍♀️ Programa de manutenção proteica avançada',
        '💪 Exercícios intensos com proteína otimizada',
        '🍎 Coaching para atletas de alta performance',
        '📅 Programa de acompanhamento contínuo'
      ]
    }
  },

  // 8. CALCULADORA DE ÁGUA
  'calculadora-agua': {
    nutri: {
      baixaHidratacao: [
        '📋 Plano hidratacional para correção imediata',
        '🥗 Estratégias para aumentar consumo de líquidos',
        '💊 Suplementos eletrolíticos para reposição',
        '📅 Acompanhamento hidratacional diário'
      ],
      hidratacaoModerada: [
        '📋 Otimização da hidratação para melhor performance',
        '🥗 Plano alimentar rico em frutas e vegetais',
        '💊 Suplementos de apoio hidratacional',
        '📅 Consultas de manutenção quinzenais'
      ],
      altaHidratacao: [
        '📋 Manutenção da hidratação otimizada',
        '🥗 Plano alimentar para sustentação hidratacional',
        '💊 Suplementos preventivos para atletas',
        '📅 Acompanhamento preventivo mensal'
      ]
    },
    sales: {
      baixaHidratacao: [
        '💊 Eletrólitos para correção hidratacional',
        '🥗 Suplementos hidratacionais',
        '💪 Suplementos para reposição hídrica',
        '📞 Consultoria especializada em hidratação'
      ],
      hidratacaoModerada: [
        '💊 Eletrólitos para manutenção',
        '🥗 Suplementos hidratacionais moderados',
        '💪 Suplementos de apoio hidratacional',
        '📞 Consultoria preventiva hidratacional'
      ],
      altaHidratacao: [
        '💊 Eletrólitos para otimização',
        '🥗 Suplementos hidratacionais avançados',
        '💪 Suplementos de manutenção hidratacional',
        '📞 Consultoria especializada hidratacional'
      ]
    },
    coach: {
      baixaHidratacao: [
        '🧘‍♀️ Programa intensivo de hidratação',
        '💪 Treinos adaptados para hidratação',
        '🍎 Coaching nutricional hidratacional',
        '📅 Acompanhamento semanal hidratacional'
      ],
      hidratacaoModerada: [
        '🧘‍♀️ Programa de otimização hidratacional',
        '💪 Treinos para manutenção hidratacional',
        '🍎 Coaching de hábitos hidratacionais',
        '📅 Acompanhamento mensal hidratacional'
      ],
      altaHidratacao: [
        '🧘‍♀️ Programa de sustentação hidratacional',
        '💪 Treinos para manutenção da hidratação',
        '🍎 Coaching preventivo hidratacional',
        '📅 Acompanhamento preventivo hidratacional'
      ]
    }
  },

  // 9. CALCULADORA DE CALORIAS
  'calculadora-calorias': {
    nutri: {
      deficitCalorico: [
        '📋 Plano calórico estratégico para emagrecimento',
        '🥗 Estratégias para déficit calórico sustentável',
        '💊 Suplementos para preservação muscular',
        '📅 Acompanhamento calórico semanal'
      ],
      manutencaoCalorica: [
        '📋 Manutenção do equilíbrio energético',
        '🥗 Plano alimentar para peso estável',
        '💊 Suplementos para manutenção da saúde',
        '📅 Consultas de manutenção quinzenais'
      ],
      superavitCalorico: [
        '📋 Plano calórico para ganho de peso saudável',
        '🥗 Estratégias para superávit calórico controlado',
        '💊 Suplementos para ganho de massa muscular',
        '📅 Acompanhamento calórico especializado'
      ]
    },
    sales: {
      deficitCalorico: [
        '💊 Termogênicos para queima calórica',
        '🥗 Proteínas para preservação muscular',
        '💪 Suplementos para controle do apetite',
        '📞 Consultoria especializada em emagrecimento'
      ],
      manutencaoCalorica: [
        '💊 Multivitamínicos para manutenção energética',
        '🥗 Suplementos para equilíbrio nutricional',
        '💪 Produtos para manutenção da saúde',
        '📞 Consultoria para manutenção do peso'
      ],
      superavitCalorico: [
        '💊 Suplementos hipercalóricos para ganho',
        '🥗 Proteínas para aumento de massa',
        '💪 Produtos para ganho de peso saudável',
        '📞 Consultoria especializada em ganho de massa'
      ]
    },
    coach: {
      deficitCalorico: [
        '🧘‍♀️ Programa de reeducação calórica para emagrecimento',
        '💪 Exercícios para queima calórica eficiente',
        '🍎 Coaching para mudança de hábitos alimentares',
        '📅 Programa de 30 dias para redução'
      ],
      manutencaoCalorica: [
        '🧘‍♀️ Programa de manutenção energética',
        '💪 Exercícios para equilíbrio calórico',
        '🍎 Coaching para manutenção do peso',
        '📅 Programa de 60 dias para estabilização'
      ],
      superavitCalorico: [
        '🧘‍♀️ Programa de ganho de peso saudável',
        '💪 Exercícios para aumento de massa muscular',
        '🍎 Coaching para ganho de peso controlado',
        '📅 Programa de 90 dias para ganho'
      ]
    }
  },

  // 10. CHECKLIST ALIMENTAR
  'checklist-alimentar': {
    nutri: {
      alimentacaoDeficiente: [
        '📋 Avaliação nutricional completa para correção de hábitos',
        '🥗 Plano alimentar para melhoria da qualidade nutricional',
        '💊 Suplementação para correção de deficiências',
        '📅 Acompanhamento nutricional semanal'
      ],
      alimentacaoModerada: [
        '📋 Avaliação nutricional para otimização de hábitos',
        '🥗 Plano alimentar para melhoria específica',
        '💊 Suplementação direcionada',
        '📅 Acompanhamento nutricional quinzenal'
      ],
      alimentacaoEquilibrada: [
        '📋 Manutenção dos bons hábitos alimentares',
        '🥗 Plano alimentar para otimização da saúde',
        '💊 Suplementação preventiva',
        '📅 Consultas de manutenção mensais'
      ]
    },
    sales: {
      alimentacaoDeficiente: [
        '💊 Produtos para correção de deficiências nutricionais',
        '🥗 Suplementos multivitamínicos completos',
        '💪 Produtos de apoio nutricional básico',
        '📞 Consultoria nutricional para iniciantes'
      ],
      alimentacaoModerada: [
        '💊 Produtos para otimização nutricional',
        '🥗 Suplementos direcionados',
        '💪 Produtos de apoio nutricional moderado',
        '📞 Consultoria nutricional intermediária'
      ],
      alimentacaoEquilibrada: [
        '💊 Produtos para manutenção da saúde',
        '🥗 Suplementos preventivos',
        '💪 Produtos de apoio nutricional avançado',
        '📞 Consultoria nutricional para manutenção'
      ]
    },
    coach: {
      alimentacaoDeficiente: [
        '🧘‍♀️ Programa de reeducação alimentar básica',
        '💪 Exercícios leves para iniciantes',
        '🍎 Coaching nutricional para mudança de hábitos',
        '📅 Programa de 90 dias para transformação'
      ],
      alimentacaoModerada: [
        '🧘‍♀️ Programa de otimização alimentar',
        '💪 Exercícios moderados',
        '🍎 Coaching nutricional para melhoria',
        '📅 Programa de 60 dias para evolução'
      ],
      alimentacaoEquilibrada: [
        '🧘‍♀️ Programa de manutenção de bem-estar',
        '💪 Exercícios avançados',
        '🍎 Coaching nutricional para performance',
        '📅 Programa de acompanhamento contínuo'
      ]
    }
  },

  // 11. CHECKLIST DETOX
  'checklist-detox': {
    nutri: {
      baixaToxicidade: [
        '📋 Manutenção da saúde detox natural',
        '🥗 Plano alimentar para sustentação detox',
        '💊 Suplementos de apoio detox',
        '📅 Consultas de manutenção detox mensais'
      ],
      toxicidadeModerada: [
        '📋 Plano detox moderado para redução',
        '🥗 Plano alimentar detox específico',
        '💊 Suplementos detox específicos',
        '📅 Acompanhamento detox quinzenal'
      ],
      altaToxicidade: [
        '📋 Plano detox intensivo para eliminação',
        '🥗 Plano alimentar detox completo',
        '💊 Suplementos detox intensivos',
        '📅 Acompanhamento detox semanal intensivo'
      ]
    },
    sales: {
      baixaToxicidade: [
        '💊 Suplementos de manutenção detox',
        '🥗 Proteínas para sustentação detox',
        '💪 Suplementos de apoio detox',
        '📞 Consultoria preventiva detox'
      ],
      toxicidadeModerada: [
        '💊 Suplementos detox moderados',
        '🥗 Proteínas para apoio detox',
        '💪 Suplementos específicos detox',
        '📞 Consultoria detox moderada'
      ],
      altaToxicidade: [
        '💊 Suplementos detox intensivos',
        '🥗 Proteínas para suporte detox',
        '💪 Suplementos detox avançados',
        '📞 Consultoria especializada detox'
      ]
    },
    coach: {
      baixaToxicidade: [
        '🧘‍♀️ Programa de manutenção detox',
        '💪 Treinos para sustentação detox',
        '🍎 Coaching nutricional detox preventivo',
        '📅 Acompanhamento mensal detox'
      ],
      toxicidadeModerada: [
        '🧘‍♀️ Programa detox moderado',
        '💪 Treinos para apoio detox',
        '🍎 Coaching nutricional detox',
        '📅 Acompanhamento quinzenal detox'
      ],
      altaToxicidade: [
        '🧘‍♀️ Programa detox intensivo',
        '💪 Treinos para suporte detox',
        '🍎 Coaching nutricional detox intensivo',
        '📅 Acompanhamento semanal detox'
      ]
    }
  }
}

// Categorias dinâmicas baseadas na ferramenta escolhida
const getCategoriasPorFerramenta = (ferramentaId: string) => {
  const categoriasMap: { [key: string]: any[] } = {
    'calculadora-imc': [
      { id: 'baixoPeso', label: 'Baixo Peso', range: '< 18.5', color: 'blue' },
      { id: 'pesoNormal', label: 'Peso Normal', range: '18.5 - 24.9', color: 'green' },
      { id: 'sobrepeso', label: 'Sobrepeso', range: '25.0 - 29.9', color: 'yellow' },
      { id: 'obesidade', label: 'Obesidade', range: '≥ 30.0', color: 'red' }
    ],
    'quiz-interativo': [
      { id: 'metabolismoLento', label: 'Metabolismo Lento', range: '6-9 pontos', color: 'blue' },
      { id: 'metabolismoEquilibrado', label: 'Metabolismo Equilibrado', range: '10-13 pontos', color: 'green' },
      { id: 'metabolismoAcelerado', label: 'Metabolismo Acelerado', range: '14-18 pontos', color: 'yellow' }
    ],
    'quiz-bem-estar': [
      { id: 'baixo-bem-estar', label: 'Baixo Bem-estar', range: '0-40 pontos', color: 'red' },
      { id: 'bem-estar-moderado', label: 'Bem-estar Moderado', range: '41-70 pontos', color: 'yellow' },
      { id: 'alto-bem-estar', label: 'Alto Bem-estar', range: '71-100 pontos', color: 'green' }
    ],
    'quiz-perfil-nutricional': [
      { id: 'perfil-deficiente', label: 'Perfil Deficiente', range: '0-30 pontos', color: 'red' },
      { id: 'perfil-equilibrado', label: 'Perfil Equilibrado', range: '31-70 pontos', color: 'green' },
      { id: 'perfil-otimizado', label: 'Perfil Otimizado', range: '71-100 pontos', color: 'blue' }
    ],
    'quiz-detox': [
      { id: 'baixa-toxicidade', label: 'Baixa Toxicidade', range: '0-3 sinais', color: 'green' },
      { id: 'toxicidade-moderada', label: 'Toxicidade Moderada', range: '4-6 sinais', color: 'yellow' },
      { id: 'alta-toxicidade', label: 'Alta Toxicidade', range: '7+ sinais', color: 'red' }
    ],
    'quiz-energetico': [
      { id: 'baixa-energia', label: 'Baixa Energia', range: '0-30 pontos', color: 'red' },
      { id: 'energia-moderada', label: 'Energia Moderada', range: '31-70 pontos', color: 'yellow' },
      { id: 'alta-energia', label: 'Alta Energia', range: '71-100 pontos', color: 'green' }
    ],
    'calculadora-proteina': [
      { id: 'baixa-proteina', label: 'Baixa Proteína', range: '< 0.8g/kg', color: 'blue' },
      { id: 'proteina-normal', label: 'Proteína Normal', range: '0.8-1.2g/kg', color: 'green' },
      { id: 'alta-proteina', label: 'Alta Proteína', range: '> 1.2g/kg', color: 'yellow' }
    ],
    'calculadora-agua': [
      { id: 'baixa-hidratacao', label: 'Baixa Hidratação', range: '< 2L/dia', color: 'red' },
      { id: 'hidratacao-moderada', label: 'Hidratação Moderada', range: '2-3L/dia', color: 'yellow' },
      { id: 'alta-hidratacao', label: 'Alta Hidratação', range: '> 3L/dia', color: 'green' }
    ],
    'calculadora-calorias': [
      { id: 'deficit-calorico', label: 'Déficit Calórico', range: 'Perda de peso', color: 'blue' },
      { id: 'manutencao-calorica', label: 'Manutenção', range: 'Peso estável', color: 'green' },
      { id: 'superavit-calorico', label: 'Superávit Calórico', range: 'Ganho de peso', color: 'yellow' }
    ],
    'checklist-alimentar': [
      { id: 'alimentacao-deficiente', label: 'Alimentação Deficiente', range: '0-40 pontos', color: 'red' },
      { id: 'alimentacao-moderada', label: 'Alimentação Moderada', range: '41-70 pontos', color: 'yellow' },
      { id: 'alimentacao-equilibrada', label: 'Alimentação Equilibrada', range: '71-100 pontos', color: 'green' }
    ],
    'checklist-detox': [
      { id: 'baixa-toxicidade', label: 'Baixa Toxicidade', range: '0-3 sinais', color: 'green' },
      { id: 'toxicidade-moderada', label: 'Toxicidade Moderada', range: '4-6 sinais', color: 'yellow' },
      { id: 'alta-toxicidade', label: 'Alta Toxicidade', range: '7+ sinais', color: 'red' }
    ],
    'mini-ebook': [
      { id: 'baixo-conhecimento', label: 'Baixo Conhecimento', range: '0-40 pontos', color: 'red' },
      { id: 'conhecimento-moderado', label: 'Conhecimento Moderado', range: '41-70 pontos', color: 'yellow' },
      { id: 'alto-conhecimento', label: 'Alto Conhecimento', range: '71-100 pontos', color: 'green' }
    ],
    'guia-nutraceutico': [
      { id: 'baixo-interesse', label: 'Baixo Interesse', range: '0-40 pontos', color: 'red' },
      { id: 'interesse-moderado', label: 'Interesse Moderado', range: '41-70 pontos', color: 'yellow' },
      { id: 'alto-interesse', label: 'Alto Interesse', range: '71-100 pontos', color: 'green' }
    ],
    'guia-proteico': [
      { id: 'baixa-proteina', label: 'Baixa Proteína', range: '< 0.8g/kg', color: 'blue' },
      { id: 'proteina-moderada', label: 'Proteína Moderada', range: '0.8-1.2g/kg', color: 'green' },
      { id: 'alta-proteina', label: 'Alta Proteína', range: '> 1.2g/kg', color: 'yellow' }
    ],
    'tabela-comparativa': [
      { id: 'comparacao-basica', label: 'Comparação Básica', range: 'Produtos essenciais', color: 'blue' },
      { id: 'comparacao-avancada', label: 'Comparação Avançada', range: 'Produtos especializados', color: 'green' },
      { id: 'comparacao-premium', label: 'Comparação Premium', range: 'Produtos de elite', color: 'yellow' }
    ],
    'tabela-substituicoes': [
      { id: 'substituicoes-basicas', label: 'Substituições Básicas', range: 'Alternativas simples', color: 'blue' },
      { id: 'substituicoes-avancadas', label: 'Substituições Avançadas', range: 'Alternativas especializadas', color: 'green' },
      { id: 'substituicoes-premium', label: 'Substituições Premium', range: 'Alternativas de elite', color: 'yellow' }
    ],
    'tabela-sintomas': [
      { id: 'sintomas-leves', label: 'Sintomas Leves', range: '1-3 sintomas', color: 'green' },
      { id: 'sintomas-moderados', label: 'Sintomas Moderados', range: '4-6 sintomas', color: 'yellow' },
      { id: 'sintomas-graves', label: 'Sintomas Graves', range: '7+ sintomas', color: 'red' }
    ],
    'plano-alimentar-base': [
      { id: 'plano-basico', label: 'Plano Básico', range: 'Alimentação equilibrada', color: 'blue' },
      { id: 'plano-avancado', label: 'Plano Avançado', range: 'Alimentação especializada', color: 'green' },
      { id: 'plano-premium', label: 'Plano Premium', range: 'Alimentação de elite', color: 'yellow' }
    ],
    'planner-refeicoes': [
      { id: 'planner-simples', label: 'Planner Simples', range: 'Organização básica', color: 'blue' },
      { id: 'planner-avancado', label: 'Planner Avançado', range: 'Organização especializada', color: 'green' },
      { id: 'planner-premium', label: 'Planner Premium', range: 'Organização de elite', color: 'yellow' }
    ],
    'rastreador-alimentar': [
      { id: 'rastreamento-basico', label: 'Rastreamento Básico', range: 'Padrões simples', color: 'blue' },
      { id: 'rastreamento-avancado', label: 'Rastreamento Avançado', range: 'Padrões complexos', color: 'green' },
      { id: 'rastreamento-premium', label: 'Rastreamento Premium', range: 'Padrões de elite', color: 'yellow' }
    ],
    'diario-alimentar': [
      { id: 'diario-basico', label: 'Diário Básico', range: 'Registro simples', color: 'blue' },
      { id: 'diario-avancado', label: 'Diário Avançado', range: 'Registro detalhado', color: 'green' },
      { id: 'diario-premium', label: 'Diário Premium', range: 'Registro profissional', color: 'yellow' }
    ],
    'tabela-metas-semanais': [
      { id: 'metas-basicas', label: 'Metas Básicas', range: 'Objetivos simples', color: 'blue' },
      { id: 'metas-moderadas', label: 'Metas Moderadas', range: 'Objetivos específicos', color: 'green' },
      { id: 'metas-avancadas', label: 'Metas Avançadas', range: 'Objetivos complexos', color: 'yellow' }
    ],
    'template-desafio-7dias': [
      { id: 'desafio-basico', label: 'Desafio Básico', range: '7 dias simples', color: 'blue' },
      { id: 'desafio-moderado', label: 'Desafio Moderado', range: '7 dias específicos', color: 'green' },
      { id: 'desafio-avancado', label: 'Desafio Avançado', range: '7 dias complexos', color: 'yellow' }
    ],
    'template-desafio-21dias': [
      { id: 'desafio-basico', label: 'Desafio Básico', range: '21 dias simples', color: 'blue' },
      { id: 'desafio-moderado', label: 'Desafio Moderado', range: '21 dias específicos', color: 'green' },
      { id: 'desafio-avancado', label: 'Desafio Avançado', range: '21 dias complexos', color: 'yellow' }
    ],
    'guia-hidratacao': [
      { id: 'baixa-hidratacao', label: 'Baixa Hidratação', range: '< 2L/dia', color: 'red' },
      { id: 'hidratacao-moderada', label: 'Hidratação Moderada', range: '2-3L/dia', color: 'yellow' },
      { id: 'alta-hidratacao', label: 'Alta Hidratação', range: '> 3L/dia', color: 'green' }
    ],
    'infografico-educativo': [
      { id: 'conhecimento-basico', label: 'Conhecimento Básico', range: '0-40 pontos', color: 'red' },
      { id: 'conhecimento-moderado', label: 'Conhecimento Moderado', range: '41-70 pontos', color: 'yellow' },
      { id: 'conhecimento-avancado', label: 'Conhecimento Avançado', range: '71-100 pontos', color: 'green' }
    ],
    'template-receitas': [
      { id: 'receitas-basicas', label: 'Receitas Básicas', range: 'Receitas simples', color: 'blue' },
      { id: 'receitas-moderadas', label: 'Receitas Moderadas', range: 'Receitas específicas', color: 'green' },
      { id: 'receitas-avancadas', label: 'Receitas Avançadas', range: 'Receitas complexas', color: 'yellow' }
    ],
    'cardapio-detox': [
      { id: 'detox-basico', label: 'Detox Básico', range: 'Detox simples', color: 'blue' },
      { id: 'detox-moderado', label: 'Detox Moderado', range: 'Detox específico', color: 'green' },
      { id: 'detox-avancado', label: 'Detox Avançado', range: 'Detox complexo', color: 'yellow' }
    ],
    'simulador-resultados': [
      { id: 'resultados-basicos', label: 'Resultados Básicos', range: 'Resultados simples', color: 'blue' },
      { id: 'resultados-moderados', label: 'Resultados Moderados', range: 'Resultados específicos', color: 'green' },
      { id: 'resultados-avancados', label: 'Resultados Avançados', range: 'Resultados complexos', color: 'yellow' }
    ],
    'template-avaliacao-inicial': [
      { id: 'avaliacao-basica', label: 'Avaliação Básica', range: 'Avaliação simples', color: 'blue' },
      { id: 'avaliacao-moderada', label: 'Avaliação Moderada', range: 'Avaliação específica', color: 'green' },
      { id: 'avaliacao-avancada', label: 'Avaliação Avançada', range: 'Avaliação complexa', color: 'yellow' }
    ],
    'formulario-recomendacao': [
      { id: 'recomendacao-basica', label: 'Recomendação Básica', range: 'Recomendações simples', color: 'blue' },
      { id: 'recomendacao-moderada', label: 'Recomendação Moderada', range: 'Recomendações específicas', color: 'green' },
      { id: 'recomendacao-avancada', label: 'Recomendação Avançada', range: 'Recomendações complexas', color: 'yellow' }
    ],
    'template-acompanhamento-semanal': [
      { id: 'acompanhamento-basico', label: 'Acompanhamento Básico', range: 'Semanal simples', color: 'blue' },
      { id: 'acompanhamento-moderado', label: 'Acompanhamento Moderado', range: 'Semanal específico', color: 'green' },
      { id: 'acompanhamento-avancado', label: 'Acompanhamento Avançado', range: 'Semanal complexo', color: 'yellow' }
    ],
    'template-checkin-mensal': [
      { id: 'checkin-basico', label: 'Check-in Básico', range: 'Mensal simples', color: 'blue' },
      { id: 'checkin-moderado', label: 'Check-in Moderado', range: 'Mensal específico', color: 'green' },
      { id: 'checkin-avancado', label: 'Check-in Avançado', range: 'Mensal complexo', color: 'yellow' }
    ],
    'ficha-cliente': [
      { id: 'ficha-basica', label: 'Ficha Básica', range: 'Cliente simples', color: 'blue' },
      { id: 'ficha-moderada', label: 'Ficha Moderada', range: 'Cliente específico', color: 'green' },
      { id: 'ficha-avancada', label: 'Ficha Avançada', range: 'Cliente complexo', color: 'yellow' }
    ],
    'template-progresso-visual': [
      { id: 'progresso-basico', label: 'Progresso Básico', range: 'Visual simples', color: 'blue' },
      { id: 'progresso-moderado', label: 'Progresso Moderado', range: 'Visual específico', color: 'green' },
      { id: 'progresso-avancado', label: 'Progresso Avançado', range: 'Visual complexo', color: 'yellow' }
    ],
    'template-story-interativo': [
      { id: 'story-basico', label: 'Story Básico', range: 'Interativo simples', color: 'blue' },
      { id: 'story-moderado', label: 'Story Moderado', range: 'Interativo específico', color: 'green' },
      { id: 'story-avancado', label: 'Story Avançado', range: 'Interativo complexo', color: 'yellow' }
    ],
    'post-curiosidades': [
      { id: 'curiosidade-basica', label: 'Curiosidade Básica', range: 'Post simples', color: 'blue' },
      { id: 'curiosidade-moderada', label: 'Curiosidade Moderada', range: 'Post específico', color: 'green' },
      { id: 'curiosidade-avancada', label: 'Curiosidade Avançada', range: 'Post complexo', color: 'yellow' }
    ],
    'template-post-dica': [
      { id: 'dica-basica', label: 'Dica Básica', range: 'Post simples', color: 'blue' },
      { id: 'dica-moderada', label: 'Dica Moderada', range: 'Post específico', color: 'green' },
      { id: 'dica-avancada', label: 'Dica Avançada', range: 'Post complexo', color: 'yellow' }
    ],
    'template-reels-roteirizado': [
      { id: 'reels-basico', label: 'Reels Básico', range: 'Roteiro simples', color: 'blue' },
      { id: 'reels-moderado', label: 'Reels Moderado', range: 'Roteiro específico', color: 'green' },
      { id: 'reels-avancado', label: 'Reels Avançado', range: 'Roteiro complexo', color: 'yellow' }
    ],
    'template-artigo-curto': [
      { id: 'artigo-basico', label: 'Artigo Básico', range: 'Artigo simples', color: 'blue' },
      { id: 'artigo-moderado', label: 'Artigo Moderado', range: 'Artigo específico', color: 'green' },
      { id: 'artigo-avancado', label: 'Artigo Avançado', range: 'Artigo complexo', color: 'yellow' }
    ],
    'template-catalogo-digital': [
      { id: 'catalogo-basico', label: 'Catálogo Básico', range: 'Digital simples', color: 'blue' },
      { id: 'catalogo-moderado', label: 'Catálogo Moderado', range: 'Digital específico', color: 'green' },
      { id: 'catalogo-avancado', label: 'Catálogo Avançado', range: 'Digital complexo', color: 'yellow' }
    ],
    'simulador-ganho': [
      { id: 'ganho-basico', label: 'Ganho Básico', range: 'Simulação simples', color: 'blue' },
      { id: 'ganho-moderado', label: 'Ganho Moderado', range: 'Simulação específica', color: 'green' },
      { id: 'ganho-avancado', label: 'Ganho Avançado', range: 'Simulação complexa', color: 'yellow' }
    ],
    'template-oportunidade': [
      { id: 'oportunidade-basica', label: 'Oportunidade Básica', range: 'Oportunidade simples', color: 'blue' },
      { id: 'oportunidade-moderada', label: 'Oportunidade Moderada', range: 'Oportunidade específica', color: 'green' },
      { id: 'oportunidade-avancada', label: 'Oportunidade Avançada', range: 'Oportunidade complexa', color: 'yellow' }
    ],
    'template-apresentacao-negocio': [
      { id: 'apresentacao-basica', label: 'Apresentação Básica', range: 'Apresentação simples', color: 'blue' },
      { id: 'apresentacao-moderada', label: 'Apresentação Moderada', range: 'Apresentação específica', color: 'green' },
      { id: 'apresentacao-avancada', label: 'Apresentação Avançada', range: 'Apresentação complexa', color: 'yellow' }
    ],
    'template-script-convite': [
      { id: 'convite-basico', label: 'Convite Básico', range: 'Script simples', color: 'blue' },
      { id: 'convite-moderado', label: 'Convite Moderado', range: 'Script específico', color: 'green' },
      { id: 'convite-avancado', label: 'Convite Avançado', range: 'Script complexo', color: 'yellow' }
    ],
    'template-onboarding-parceiro': [
      { id: 'onboarding-basico', label: 'Onboarding Básico', range: 'Onboarding simples', color: 'blue' },
      { id: 'onboarding-moderado', label: 'Onboarding Moderado', range: 'Onboarding específico', color: 'green' },
      { id: 'onboarding-avancado', label: 'Onboarding Avançado', range: 'Onboarding complexo', color: 'yellow' }
    ],
    'template-plano-acao-equipe': [
      { id: 'plano-basico', label: 'Plano Básico', range: 'Plano simples', color: 'blue' },
      { id: 'plano-moderado', label: 'Plano Moderado', range: 'Plano específico', color: 'green' },
      { id: 'plano-avancado', label: 'Plano Avançado', range: 'Plano complexo', color: 'yellow' }
    ],
    'template-feedback-cliente': [
      { id: 'feedback-basico', label: 'Feedback Básico', range: 'Feedback simples', color: 'blue' },
      { id: 'feedback-moderado', label: 'Feedback Moderado', range: 'Feedback específico', color: 'green' },
      { id: 'feedback-avancado', label: 'Feedback Avançado', range: 'Feedback complexo', color: 'yellow' }
    ],
    'template-mensagem-pos-compra': [
      { id: 'mensagem-basica', label: 'Mensagem Básica', range: 'Mensagem simples', color: 'blue' },
      { id: 'mensagem-moderada', label: 'Mensagem Moderada', range: 'Mensagem específica', color: 'green' },
      { id: 'mensagem-avancada', label: 'Mensagem Avançada', range: 'Mensagem complexa', color: 'yellow' }
    ],
    'template-email-reposicao': [
      { id: 'reposicao-basica', label: 'Reposição Básica', range: 'E-mail simples', color: 'blue' },
      { id: 'reposicao-moderada', label: 'Reposição Moderada', range: 'E-mail específico', color: 'green' },
      { id: 'reposicao-avancada', label: 'Reposição Avançada', range: 'E-mail complexo', color: 'yellow' }
    ],
    'template-aniversario': [
      { id: 'aniversario-especial', label: 'Aniversário Especial', range: 'Mensagem especial', color: 'purple' }
    ],
    'template-recompensa-cashback': [
      { id: 'recompensa-basica', label: 'Recompensa Básica', range: 'Sistema simples', color: 'blue' },
      { id: 'recompensa-moderada', label: 'Recompensa Moderada', range: 'Sistema específico', color: 'green' },
      { id: 'recompensa-avancada', label: 'Recompensa Avançada', range: 'Sistema complexo', color: 'yellow' }
    ],
    'template-agradecimento': [
      { id: 'agradecimento-basico', label: 'Agradecimento Básico', range: 'Mensagem simples', color: 'blue' },
      { id: 'agradecimento-moderado', label: 'Agradecimento Moderado', range: 'Mensagem específica', color: 'green' },
      { id: 'agradecimento-avancado', label: 'Agradecimento Avançado', range: 'Mensagem complexa', color: 'yellow' }
    ],
    'template-plano-semanal-conteudo': [
      { id: 'conteudo-basico', label: 'Conteúdo Básico', range: 'Plano simples', color: 'blue' },
      { id: 'conteudo-moderado', label: 'Conteúdo Moderado', range: 'Plano específico', color: 'green' },
      { id: 'conteudo-avancado', label: 'Conteúdo Avançado', range: 'Plano complexo', color: 'yellow' }
    ],
    'template-reels-educativo': [
      { id: 'reels-basico', label: 'Reels Básico', range: 'Educativo simples', color: 'blue' },
      { id: 'reels-moderado', label: 'Reels Moderado', range: 'Educativo específico', color: 'green' },
      { id: 'reels-avancado', label: 'Reels Avançado', range: 'Educativo complexo', color: 'yellow' }
    ],
    'template-conteudo-autoridade': [
      { id: 'autoridade-basica', label: 'Autoridade Básica', range: 'Conteúdo simples', color: 'blue' },
      { id: 'autoridade-moderada', label: 'Autoridade Moderada', range: 'Conteúdo específico', color: 'green' },
      { id: 'autoridade-avancada', label: 'Autoridade Avançada', range: 'Conteúdo complexo', color: 'yellow' }
    ],
    'template-testemunho-visual': [
      { id: 'testemunho-basico', label: 'Testemunho Básico', range: 'Visual simples', color: 'blue' },
      { id: 'testemunho-moderado', label: 'Testemunho Moderado', range: 'Visual específico', color: 'green' },
      { id: 'testemunho-avancado', label: 'Testemunho Avançado', range: 'Visual complexo', color: 'yellow' }
    ],
    'template-calendario-postagens': [
      { id: 'calendario-basico', label: 'Calendário Básico', range: 'Postagens simples', color: 'blue' },
      { id: 'calendario-moderado', label: 'Calendário Moderado', range: 'Postagens específicas', color: 'green' },
      { id: 'calendario-avancado', label: 'Calendário Avançado', range: 'Postagens complexas', color: 'yellow' }
    ],
    'template-estrategia-lancamento': [
      { id: 'lancamento-basico', label: 'Lançamento Básico', range: 'Estratégia simples', color: 'blue' },
      { id: 'lancamento-moderado', label: 'Lançamento Moderado', range: 'Estratégia específica', color: 'green' },
      { id: 'lancamento-avancado', label: 'Lançamento Avançado', range: 'Estratégia complexa', color: 'yellow' }
    ],
    'template-jornada-cliente': [
      { id: 'jornada-basica', label: 'Jornada Básica', range: 'Experiência simples', color: 'blue' },
      { id: 'jornada-moderada', label: 'Jornada Moderada', range: 'Experiência específica', color: 'green' },
      { id: 'jornada-avancada', label: 'Jornada Avançada', range: 'Experiência complexa', color: 'yellow' }
    ],
    'template-jornada-cliente-final': [
      { id: 'jornada-completa', label: 'Jornada Completa', range: 'Experiência total', color: 'purple' }
    ]
  }
  
  return categoriasMap[ferramentaId] || categoriasMap['calculadora-imc']
}

const profissoes = [
  { id: 'nutri', label: 'Nutricionista', icon: '🥗', color: 'green' },
  { id: 'sales', label: 'Consultor Nutra', icon: '💊', color: 'blue' },
  { id: 'coach', label: 'Coach de Bem-estar', icon: '🧘‍♀️', color: 'purple' }
]

export default function AdminDiagnosticos() {
  const [profissaoSelecionada, setProfissaoSelecionada] = useState<'nutri' | 'sales' | 'coach'>('nutri')
  const [ferramentaSelecionada, setFerramentaSelecionada] = useState<string>('quiz-interativo')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('metabolismo-lento')

  // Filtrar ferramentas por profissão
  const ferramentasFiltradas = ferramentasYLADA.filter(ferramenta => {
    if (profissaoSelecionada === 'nutri') {
      return ['Atrair Leads', 'Engajamento', 'Diagnóstico', 'Captação', 'Segmentação', 'Avaliação', 'Nutrição', 'Educação', 'Autoridade', 'Atração', 'Especialização', 'Conversão', 'Valor', 'Organização', 'Acompanhamento', 'Motivação', 'Gamificação', 'Comprometimento', 'Curiosidade', 'Profissionalização', 'Conteúdo', 'Branding', 'Prova Social', 'Negócio', 'Estratégico'].includes(ferramenta.categoria)
    } else if (profissaoSelecionada === 'sales') {
      return ['Atrair Leads', 'Engajamento', 'Diagnóstico', 'Captação', 'Segmentação', 'Avaliação', 'Nutrição', 'Educação', 'Autoridade', 'Atração', 'Especialização', 'Conversão', 'Valor', 'Organização', 'Acompanhamento', 'Motivação', 'Gamificação', 'Comprometimento', 'Curiosidade', 'Profissionalização', 'Conteúdo', 'Branding', 'Prova Social', 'Negócio', 'Estratégico', 'Recrutamento', 'Duplicação', 'Gestão', 'Fidelização', 'Retenção', 'Relacionamento'].includes(ferramenta.categoria)
    } else if (profissaoSelecionada === 'coach') {
      return ['Atrair Leads', 'Engajamento', 'Diagnóstico', 'Captação', 'Segmentação', 'Avaliação', 'Nutrição', 'Educação', 'Autoridade', 'Atração', 'Especialização', 'Conversão', 'Valor', 'Organização', 'Acompanhamento', 'Motivação', 'Gamificação', 'Comprometimento', 'Curiosidade', 'Profissionalização', 'Conteúdo', 'Branding', 'Prova Social', 'Negócio', 'Estratégico'].includes(ferramenta.categoria)
    }
    return true
  })

  // Obter categorias dinâmicas baseadas na ferramenta
  const categoriasAtuais = getCategoriasPorFerramenta(ferramentaSelecionada)

  // Atualizar categoria automaticamente quando a ferramenta muda
  useEffect(() => {
    if (categoriasAtuais.length > 0) {
      setCategoriaSelecionada(categoriasAtuais[0].id)
    }
  }, [ferramentaSelecionada])

  // Obter diagnósticos dinâmicos baseados na ferramenta e profissão
  const diagnosticosAtuais = (diagnosticosCompletos as any)[ferramentaSelecionada]?.[profissaoSelecionada]?.[categoriaSelecionada] || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/pt/templates-environment">
            <YLADALogo size="md" responsive={true} />
          </Link>
          <div className="text-sm text-gray-600">
            Área Administrativa - Diagnósticos
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              📊 Diagnósticos por Profissão
            </h1>
            <p className="text-gray-600">
              Visualize todas as respostas padrão da Calculadora de IMC por profissão e categoria
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Filtros</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Seleção de Profissão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissão
                </label>
                <select
                  value={profissaoSelecionada}
                  onChange={(e) => setProfissaoSelecionada(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  {profissoes.map((profissao) => (
                    <option key={profissao.id} value={profissao.id}>
                      {profissao.icon} {profissao.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seleção de Ferramenta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ferramenta ({ferramentasFiltradas.length} disponíveis)
                </label>
                <select
                  value={ferramentaSelecionada}
                  onChange={(e) => setFerramentaSelecionada(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  {ferramentasFiltradas.map((ferramenta) => (
                    <option key={ferramenta.id} value={ferramenta.id}>
                      {ferramenta.icon} {ferramenta.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seleção de Categoria/Resultado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resultado/Categoria
                </label>
                <select
                  value={categoriaSelecionada}
                  onChange={(e) => setCategoriaSelecionada(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                >
                  {categoriasAtuais.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.label} ({categoria.range})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Informações dos Filtros */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-800">
                  <strong>Profissão:</strong> {profissoes.find(p => p.id === profissaoSelecionada)?.label}
                </span>
                <span className="text-blue-800">
                  <strong>Ferramenta:</strong> {ferramentasYLADA.find(f => f.id === ferramentaSelecionada)?.nome}
                </span>
                <span className="text-blue-800">
                  <strong>Categoria:</strong> {categoriasAtuais.find(c => c.id === categoriaSelecionada)?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Diagnósticos para {profissoes.find(p => p.id === profissaoSelecionada)?.label} - {ferramentasYLADA.find(f => f.id === ferramentaSelecionada)?.nome} - {categoriasAtuais.find(c => c.id === categoriaSelecionada)?.label}
              </h2>
              <div className="text-sm text-gray-500">
                {diagnosticosAtuais.length} recomendações
              </div>
            </div>

            {/* Lista de Diagnósticos */}
            <div className="space-y-3">
                {diagnosticosAtuais.map((diagnostico: string, index: number) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-500 mr-3 mt-1 font-bold">
                    {index + 1}.
                  </span>
                  <span className="text-gray-800 flex-1">
                    {diagnostico}
                  </span>
                </div>
              ))}
            </div>

            {/* Seção de Preview do Quiz */}
            {ferramentaSelecionada === 'quiz-interativo' && (
              <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  🎯 Preview do Quiz Interativo - "Descubra seu Tipo de Metabolismo"
                </h3>
                
                {/* Tela de Abertura */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">🔍 Descubra Seu Tipo de Metabolismo em 60 Segundos</h4>
                  <p className="text-gray-700 mb-3">Entenda por que seu corpo reage de um jeito único à alimentação, energia e suplementos — e descubra o melhor caminho para ter mais resultados.</p>
                  <p className="text-blue-600 font-semibold">🚀 Leva menos de 1 minuto e pode mudar a forma como você cuida do seu corpo.</p>
                </div>
                
                <div className="space-y-6">
                  {/* Pergunta 1 */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3">🕐 1. Como é seu nível de energia ao longo do dia?</h4>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                        <input type="radio" name="energia-dia" className="mr-3" />
                        <span className="text-gray-700">(A) Vivo cansado, mesmo dormindo bem</span>
                      </label>
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                        <input type="radio" name="energia-dia" className="mr-3" />
                        <span className="text-gray-700">(B) Tenho altos e baixos</span>
                      </label>
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                        <input type="radio" name="energia-dia" className="mr-3" />
                        <span className="text-gray-700">(C) Energia constante o dia inteiro</span>
                      </label>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Autopercepção e comparação</p>
                  </div>

                  {/* Pergunta 2 */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-3">🍽️ 2. Como costuma ser sua fome?</h4>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                        <input type="radio" name="fome" className="mr-3" />
                        <span className="text-gray-700">(A) Forte, com vontade de comer o tempo todo</span>
                      </label>
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                        <input type="radio" name="fome" className="mr-3" />
                        <span className="text-gray-700">(B) Varia conforme o dia</span>
                      </label>
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                        <input type="radio" name="fome" className="mr-3" />
                        <span className="text-gray-700">(C) Como de forma leve, sem exagerar</span>
                      </label>
                    </div>
                    <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Identificação emocional com comportamento alimentar</p>
                  </div>

                  {/* Pergunta 3 */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-3">💧 3. Quanta água você costuma beber por dia?</h4>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                        <input type="radio" name="agua" className="mr-3" />
                        <span className="text-gray-700">(A) Quase nenhuma</span>
                      </label>
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                        <input type="radio" name="agua" className="mr-3" />
                        <span className="text-gray-700">(B) Mais ou menos 1 litro</span>
                      </label>
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                        <input type="radio" name="agua" className="mr-3" />
                        <span className="text-gray-700">(C) Sempre carrego minha garrafinha</span>
                      </label>
                    </div>
                    <p className="text-xs text-purple-600 mt-2">🧠 Gatilho: Contraste e consciência de hábito</p>
                  </div>

                  {/* Pergunta 4 */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-900 mb-3">💤 4. Como anda a qualidade do seu sono?</h4>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                        <input type="radio" name="sono" className="mr-3" />
                        <span className="text-gray-700">(A) Péssima, acordo cansado</span>
                      </label>
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                        <input type="radio" name="sono" className="mr-3" />
                        <span className="text-gray-700">(B) Regular, depende do dia</span>
                      </label>
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                        <input type="radio" name="sono" className="mr-3" />
                        <span className="text-gray-700">(C) Durmo bem e acordo disposto</span>
                      </label>
                    </div>
                    <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Reflexão + padrão de saúde percebida</p>
                  </div>

                  {/* Pergunta 5 */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-3">🏃‍♂️ 5. Você pratica atividade física com qual frequência?</h4>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                        <input type="radio" name="exercicio" className="mr-3" />
                        <span className="text-gray-700">(A) Quase nunca</span>
                      </label>
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                        <input type="radio" name="exercicio" className="mr-3" />
                        <span className="text-gray-700">(B) 2 a 3 vezes por semana</span>
                      </label>
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-red-300">
                        <input type="radio" name="exercicio" className="mr-3" />
                        <span className="text-gray-700">(C) Quase todos os dias</span>
                      </label>
                    </div>
                    <p className="text-xs text-red-600 mt-2">🧠 Gatilho: Comparação e autoavaliação social</p>
                  </div>

                  {/* Pergunta 6 */}
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-900 mb-3">⚖️ 6. Qual dessas opções melhor descreve você?</h4>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                        <input type="radio" name="peso" className="mr-3" />
                        <span className="text-gray-700">(A) Tenho dificuldade em perder peso</span>
                      </label>
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                        <input type="radio" name="peso" className="mr-3" />
                        <span className="text-gray-700">(B) Mantenho o peso com esforço</span>
                      </label>
                      <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                        <input type="radio" name="peso" className="mr-3" />
                        <span className="text-gray-700">(C) Emagreço facilmente</span>
                      </label>
                    </div>
                    <p className="text-xs text-indigo-600 mt-2">🧠 Gatilho: Diagnóstico rápido (dor e aspiração)</p>
                  </div>

                  {/* Sistema de Pontuação */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">📊 Sistema de Pontuação</h4>
                    <div className="mb-3 text-sm text-gray-600">
                      <p><strong>A = 1 ponto | B = 2 pontos | C = 3 pontos</strong></p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-blue-100 rounded-lg">
                        <div className="font-semibold text-blue-900">Metabolismo Lento</div>
                        <div className="text-blue-700">6-9 pontos</div>
                        <div className="text-xs text-blue-600 mt-1">Dificuldade em eliminar toxinas</div>
                      </div>
                      <div className="text-center p-3 bg-green-100 rounded-lg">
                        <div className="font-semibold text-green-900">Metabolismo Equilibrado</div>
                        <div className="text-green-700">10-13 pontos</div>
                        <div className="text-xs text-green-600 mt-1">Boa resposta metabólica</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-100 rounded-lg">
                        <div className="font-semibold text-yellow-900">Metabolismo Acelerado</div>
                        <div className="text-yellow-700">14-18 pontos</div>
                        <div className="text-xs text-yellow-600 mt-1">Alta queima, instabilidade</div>
                      </div>
                    </div>
                  </div>

                  {/* CTAs por Profissão */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">🎯 CTAs Personalizados por Profissão</h4>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                        <h5 className="font-semibold text-green-900">🧬 Para NUTRICIONISTAS</h5>
                        <p className="text-sm text-gray-700">"Seu metabolismo pode mudar em 30 dias. Agende uma avaliação nutricional gratuita."</p>
                        <p className="text-xs text-green-600 mt-1">✅ Quero minha avaliação com o(a) nutricionista</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border-l-4 border-purple-500">
                        <h5 className="font-semibold text-purple-900">🌿 Para COACHS DE BEM-ESTAR</h5>
                        <p className="text-sm text-gray-700">"Entre no Desafio de 7 Dias do Bem-Estar e comece sua transformação."</p>
                        <p className="text-xs text-purple-600 mt-1">🌿 Quero entrar no desafio agora</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
                        <h5 className="font-semibold text-blue-900">💊 Para CONSULTORES NUTRA</h5>
                        <p className="text-sm text-gray-700">"Veja quais suplementos naturais podem acelerar seus resultados."</p>
                        <p className="text-xs text-blue-600 mt-1">💬 Falar com o(a) consultor e ver produtos indicados</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informações Adicionais */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">📊 Categoria</h3>
                <p className="text-blue-800 text-sm">
                  {categoriasAtuais.find(c => c.id === categoriaSelecionada)?.label} 
                  ({categoriasAtuais.find(c => c.id === categoriaSelecionada)?.range})
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">👨‍⚕️ Profissão</h3>
                <p className="text-green-800 text-sm">
                  {profissoes.find(p => p.id === profissaoSelecionada)?.label}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">🛠️ Ferramenta</h3>
                <p className="text-purple-800 text-sm">
                  {ferramentasYLADA.find(f => f.id === ferramentaSelecionada)?.nome}
                </p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">📝 Total</h3>
                <p className="text-orange-800 text-sm">
                  {diagnosticosAtuais.length} recomendações específicas
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <YLADALogo size="lg" />
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Área Administrativa YLADA
            </p>
            <p className="text-gray-500 text-xs">
              &copy; 2024 YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
