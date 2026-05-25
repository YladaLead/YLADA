-- Avaliação do Perfil Metabólico (Pro Líderes vendas): entrega alinhada ao template Wellness.
-- Três perfis (rápido / moderado / lento) ↔ arquétipos leve / moderado / urgente + recomendações em specific_actions.
-- Faixas de score na API: 8 e 12 em 15 pts (ver avaliacao-perfil-metabolico-risk-bands.ts).

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json = $leve$
{
  "profile_title": "Metabolismo mais favorável — manutenção preventiva",
  "profile_summary": "Na leitura das respostas, seu ritmo parece mais estável: menos travamentos no dia a dia. Ainda assim, manter sono, refeições e estresse sob controle ajuda a não perder esse bom padrão quando a rotina aperta.",
  "frase_identificacao": "Se combina com você, o corpo hoje parece responder bem — o cuidado é não deixar o ritmo escorregar em fases mais corridas.",
  "main_blocker": "O ponto de atenção é proteger o básico: refeições regulares, sono e hidratação nos dias em que a agenda dispara.",
  "consequence": "Sem esse cuidado simples, muita gente perde o equilíbrio metabólico justamente quando estava indo bem.",
  "growth_potential": "Quem te enviou este link pode ajudar a consolidar hábitos que sustentam esse perfil — conversa leve, sem radicalismo.",
  "dica_rapida": "Use este resultado como linha de base; se a rotina mudar muito, vale refazer a avaliação e comparar.",
  "specific_actions": [
    "Manter proteína e refeições regulares nos dias mais corridos",
    "Evitar ficar muitas horas sem comer se você já sente queda brusca de energia",
    "Continuar observando o sono — é onde muita gente perde o equilíbrio",
    "Reforçar hidratação em dias de mais estresse ou treino",
    "Revisar o perfil de tempos em tempos se a vida mudar bastante"
  ],
  "cta_text": "Quero alinhar hábitos com quem me enviou o link",
  "whatsapp_prefill": "Oi! Fiz a avaliação de perfil metabólico e saiu um perfil mais favorável. Quero conversar com quem me enviou este link sobre como manter isso na rotina."
}
$leve$::jsonb
WHERE flow_id = 'avaliacao-perfil-metabolico'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'leve';

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json = $mod$
{
  "profile_title": "Metabolismo moderado — boa margem para ajustes",
  "profile_summary": "Há um meio-termo interessante: você não está no extremo, mas já nota sinais (energia, digestão ou rotina) que podem ser afinados. É um perfil com espaço para mudanças conscientes, uma de cada vez.",
  "frase_identificacao": "Se você se reconhece aqui, provavelmente já sentiu que um desvio de sono ou de refeição pesa rápido no dia.",
  "main_blocker": "O que mais pesa é oscilar: alguns pilares funcionam e outros caem (sono, horário da janta, lanche da tarde).",
  "consequence": "Mudar tudo de uma vez costuma esconder o que realmente ajuda — e aumenta a frustração.",
  "growth_potential": "Conversar com quem te enviou ajuda a escolher um eixo só (sono, refeição ou movimento) e testar com calma.",
  "dica_rapida": "Traga este perfil na conversa e peça ajuda para validar uma hipótese por vez — assim o próximo passo fica claro.",
  "specific_actions": [
    "Escolher um único hábito (sono, horário da janta ou caminhada) para observar por 10 dias",
    "Notar se a fome bate junto com estresse ou cansaço",
    "Experimentar refeições mais estáveis no horário que costuma ser mais difícil",
    "Perceber se o inchaço segue algum padrão de alimento ou horário",
    "Usar o resultado como roteiro na conversa com quem te acompanha"
  ],
  "cta_text": "Quero afinar meu perfil com apoio",
  "whatsapp_prefill": "Oi! Fiz a avaliação de perfil metabólico e saiu um perfil moderado, com margem para ajustes. Quero falar com quem me enviou este link."
}
$mod$::jsonb
WHERE flow_id = 'avaliacao-perfil-metabolico'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'moderado';

UPDATE public.ylada_flow_diagnosis_outcomes
SET content_json = $urg$
{
  "profile_title": "Metabolismo pedindo mais apoio — mapa para a conversa",
  "profile_summary": "Pelas respostas, seu corpo parece estar pedindo mais apoio: energia oscilante, fome ou corpo pesado aparecem com frequência. Isso sugere um perfil mais lento ou sob estresse — um mapa útil antes de falar com quem te enviou o link.",
  "frase_identificacao": "Se isso é você, o dia provavelmente já mostrou que força de vontade sozinha não explica tudo — e tudo bem pedir direção.",
  "main_blocker": "Sono, estresse, horários de refeição e digestão costumam se misturar; o valor está em ver o padrão que você acabou de descrever.",
  "consequence": "Seguir no achismo ou em promessas rápidas tende a aumentar cansaço e sensação de corpo que não responde.",
  "growth_potential": "Quem te enviou pode ajudar a priorizar um ou dois ajustes pequenos e mensuráveis — conversa com método, sem julgamento.",
  "dica_rapida": "Por uma semana, anote só três coisas: quando a energia cai, o que comeu antes e como dormiu — esse triângulo costuma mostrar por onde começar.",
  "specific_actions": [
    "Observar em quais horários a energia cai mais e o que você come antes",
    "Anotar dias com mais inchaço ou fome fora de hora",
    "Priorizar sono regular por uma ou duas semanas como teste simples",
    "Registrar uma semana de refeições sem julgar — só perceber padrões",
    "Levar essas observações para quem te orienta em nutrição ou bem-estar"
  ],
  "cta_text": "Quero montar um plano com quem me enviou o link",
  "whatsapp_prefill": "Oi! Fiz a avaliação de perfil metabólico e saiu um perfil que pede mais apoio no dia a dia. Quero conversar com quem me enviou este link."
}
$urg$::jsonb
WHERE flow_id = 'avaliacao-perfil-metabolico'
  AND architecture = 'RISK_DIAGNOSIS'
  AND diagnosis_vertical IS NULL
  AND archetype_code = 'urgente';
