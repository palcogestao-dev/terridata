import { useState, useEffect } from "react";

// ─── ESTADOS ─────────────────────────────────────────────────────────────────
const ESTADOS_BR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

// ─── BLOCOS ───────────────────────────────────────────────────────────────────
const BLOCKS = [
  { id:1, label:"BLOCO 1", title:"Contexto da Gestão",         icon:"🏛️", desc:"Entendendo o cenário e os desafios da sua administração municipal." },
  { id:2, label:"BLOCO 2", title:"Infraestrutura & Resiliência",icon:"🏗️", desc:"Como o município cuida da estrutura urbana e responde a desafios climáticos." },
  { id:3, label:"BLOCO 3", title:"Desenvolvimento Econômico",   icon:"📈", desc:"O ambiente para negócios e a capacidade de atração de investimentos." },
  { id:4, label:"BLOCO 4", title:"Segurança & Mobilidade",      icon:"🚦", desc:"A percepção de segurança e a fluidez do deslocamento urbano." },
  { id:5, label:"BLOCO 5", title:"Questão Social",              icon:"🤝", desc:"A atuação do município frente às vulnerabilidades sociais." },
  { id:6, label:"BLOCO 6", title:"Dinamismo da Cidade",         icon:"🎭", desc:"A oferta de cultura, eventos e vida pública para os cidadãos." },
  { id:7, label:"BLOCO 7", title:"Inovação",                    icon:"💡", desc:"A agenda de inovação e tecnologia na gestão municipal." },
  { id:8, label:"BLOCO 8", title:"Educação",                    icon:"📚", desc:"A qualidade da educação pública municipal." },
  { id:9, label:"BLOCO FINAL", title:"Decisão & Prioridade",    icon:"🎯", desc:"Como as decisões são tomadas e quais são as prioridades estratégicas da gestão." },
];

// ─── PERGUNTAS ────────────────────────────────────────────────────────────────
// Perguntas pontuadas: 4,5,6,7,8,9,10,11,12,13 = 10 perguntas = máx 40 pts
// Bloco final (14,15): NÃO pontuam — são contextuais
const QUESTIONS = [
  { block:1, id:1,  scored:false, text:"Qual é o seu cargo?",
    options:["Prefeito(a) / Vice","Secretário(a)","Assessor(a)","Diretor(a) / Coordenador(a)","Técnico(a) / Analista","Outro"] },
  { block:1, id:2,  scored:false, text:"Porte do município",
    options:["Até 50 mil habitantes","50 a 150 mil","150 a 500 mil","Acima de 500 mil"] },
  { block:1, id:3,  scored:false, text:"Hoje, qual é o principal desafio da gestão no seu município?",
    options:["Resolver problemas operacionais urgentes","Organizar melhor a gestão","Atrair investimentos e dinamizar a economia","Estruturar crescimento com visão de longo prazo"] },
  { block:2, id:4,  scored:true,  text:"Como está a manutenção urbana do município (ruas, limpeza, iluminação)?",
    options:["Não existe ou é muito insuficiente","Existe de forma limitada e pouco organizada","Existe de forma estruturada e funcional","É bem estruturada, integrada e gera resultado"] },
  { block:2, id:5,  scored:true,  text:"Como funciona a preparação e resposta a enchentes ou eventos climáticos?",
    options:["Não existe planejamento nem resposta organizada","Existe alguma reação, mas com dificuldades","Existe estrutura funcional de resposta","É preventiva, integrada e bem coordenada"] },
  { block:3, id:6,  scored:true,  text:"Como é o ambiente para abrir e manter negócios no município?",
    options:["Difícil e burocrático","Possível, mas com muitas barreiras","Favorável","Muito atrativo e estimulante"] },
  { block:3, id:7,  scored:true,  text:"Como o município atua para atrair e apoiar negócios?",
    options:["Não atua","Atua pontualmente","Atua com programas estruturados","Atua de forma estratégica e contínua"] },
  { block:4, id:8,  scored:true,  text:"Como você avalia a segurança no município?",
    options:["Muito baixa","Baixa","Moderada","Alta"] },
  { block:4, id:9,  scored:true,  text:"Como está a mobilidade urbana (acesso, circulação, deslocamento)?",
    options:["Desorganizada","Com gargalos relevantes","Funcional","Fluida e eficiente"] },
  { block:5, id:10, scored:true,  text:"Como o município atua nas vulnerabilidades sociais?",
    options:["Não atua ou atua muito pouco","Atua de forma limitada","Atua com programas estruturados","Atua de forma integrada e contínua"] },
  { block:6, id:11, scored:true,  text:"Como está a oferta de eventos e atividades na cidade?",
    options:["Praticamente inexistente","Baixa","Regular","Estratégica e frequente"] },
  { block:7, id:12, scored:true,  text:"Como está a agenda de inovação no município?",
    options:["Não existe","Iniciativas isoladas","Estruturada","Ecossistema ativo"] },
  { block:8, id:13, scored:true,  text:"Como você avalia a educação municipal?",
    options:["Muito abaixo do esperado","Abaixo do esperado","Adequada","Alta qualidade"] },
  { block:9, id:14, scored:false, text:"Hoje, as decisões da gestão são tomadas:",
    options:["De forma reativa, conforme urgências","Misturando urgência com alguma análise","Com análise antes da execução","Com critérios claros e priorização"] },
  { block:9, id:15, scored:false, text:"Hoje, qual é a prioridade mais importante da gestão?",
    options:["Organizar a base antes de crescer","Melhorar eficiência e execução","Atrair investimento e desenvolver a cidade","Estruturar crescimento sustentável"] },
];

// Máximo: 10 perguntas × 4 = 40 pts
const MAX_SCORE = 40;

// ─── PERFIS (faixas recalculadas para máx 40) ────────────────────────────────
const PROFILES = [
  {
    range:[10,19], emoji:"🚨", label:"Operação em Risco", color:"#C94040", bgColor:"rgba(201,64,64,0.08)",
    text:"O diagnóstico revela uma gestão com baixa previsibilidade operacional e alta dependência de respostas reativas. Nesse estágio, a administração municipal tende a consumir energia resolvendo crises do presente, com pouca capacidade de planejar o futuro. Esse padrão fragiliza a entrega de serviços públicos essenciais, compromete a confiança da população e aumenta o custo político e financeiro da gestão.",
    recommendations:[
      { block:"Infraestrutura & Resiliência", text:"Priorize a elaboração de um plano básico de manutenção urbana com calendário definido e responsáveis por área. Sem previsibilidade operacional, a manutenção reativa custa até 3x mais e gera maior desgaste político para a gestão." },
      { block:"Desenvolvimento Econômico",    text:"Antes de atrair novos investimentos, mapeie as barreiras regulatórias locais. Um ambiente burocrático afasta empreendedores e reduz a geração de emprego e renda municipal. O primeiro passo é identificar os gargalos na jornada do empreendedor." },
      { block:"Segurança & Mobilidade",       text:"Estabeleça protocolos mínimos de resposta a ocorrências e mapeie os principais gargalos de mobilidade por região. A ausência de fluxo organizado impacta diretamente a produtividade econômica e a qualidade de vida da população." },
      { block:"Questão Social",               text:"Realize um levantamento de vulnerabilidades sociais com dados territorializados — cruzando CadÚnico, CRAS e indicadores do IBGE. Sem essa base, as políticas públicas chegam tarde e com baixa efetividade." },
      { block:"Inovação & Decisão",           text:"Implante um ritual básico de gestão com dados: reunião quinzenal com indicadores por secretaria. Decisões baseadas em urgência, sem informação estruturada, perpetuam o ciclo reativo e reduzem a capacidade de planejamento orçamentário." },
    ],
  },
  {
    range:[20,27], emoji:"⚠️", label:"Crescimento Desorganizado", color:"#C97A20", bgColor:"rgba(201,122,32,0.08)",
    text:"A gestão já demonstra movimento e intenção de avançar, mas enfrenta desalinhamento entre áreas, falta de integração entre secretarias e dificuldade de sustentar prioridades ao longo do mandato. Esse estágio é comum em gestões que saíram da crise imediata, mas ainda não construíram uma estrutura decisória sólida. O risco é dispersar esforços e recursos em múltiplas frentes sem entregas consistentes para a população.",
    recommendations:[
      { block:"Infraestrutura & Resiliência", text:"Evolua de uma manutenção reativa para um plano de manutenção preventiva com metas trimestrais e responsáveis definidos. A integração entre secretarias de obras, meio ambiente e planejamento urbano é chave nessa etapa." },
      { block:"Desenvolvimento Econômico",    text:"Estruture uma política de desenvolvimento econômico com metas claras e monitoráveis: número de empresas abertas, empregos gerados, investimentos atraídos. Ações pontuais sem monitoramento não constroem reputação nem resultado mensurável." },
      { block:"Segurança & Mobilidade",       text:"Avance para uma gestão integrada de segurança pública com mapeamento de ocorrências por região e diagnóstico de fluxo de mobilidade. Indicadores transformam percepção subjetiva em política pública orientada por evidências." },
      { block:"Questão Social",               text:"Integre os programas sociais existentes numa plataforma unificada de gestão de benefícios. A fragmentação de ações entre secretarias reduz impacto, dificulta a prestação de contas e aumenta o custo operacional da política social." },
      { block:"Inovação & Decisão",           text:"Adote um modelo de gestão por resultados com metas por secretaria e revisões periódicas. O principal gargalo nesse estágio é a ausência de uma metodologia que conecte planejamento, execução e avaliação de forma sistemática." },
    ],
  },
  {
    range:[28,34], emoji:"✅", label:"Estrutura em Consolidação", color:"#2E9E7E", bgColor:"rgba(46,158,126,0.08)",
    text:"A gestão possui uma base estruturada e demonstra capacidade de execução consistente. As principais áreas funcionam, mas ainda existem espaços relevantes para integração entre secretarias, qualificação das decisões e ampliação do impacto das políticas públicas. Esse é o momento de passar de uma gestão que funciona para uma gestão que gera desenvolvimento real e sustentável para o município.",
    recommendations:[
      { block:"Infraestrutura & Resiliência", text:"Avance para um modelo de infraestrutura inteligente: mapeamento de risco climático georreferenciado, protocolos integrados com a Defesa Civil e contratos de manutenção com indicadores de desempenho." },
      { block:"Desenvolvimento Econômico",    text:"Crie um conselho municipal de desenvolvimento econômico com participação de lideranças do setor privado e academia. A cocriação de política econômica fortalece o ambiente de negócios e amplia a legitimidade das iniciativas." },
      { block:"Segurança & Mobilidade",       text:"Implante um centro de operações integrado que conecte mobilidade, segurança e serviços urbanos com dados em tempo real. Esse modelo reduz o custo operacional e melhora significativamente a resposta a ocorrências." },
      { block:"Questão Social",               text:"Avance para uma política de assistência social baseada em evidências: cruzamento sistemático de dados do CadÚnico, CRAS e CREAS para identificar famílias em situação de maior risco e direcionar recursos com mais precisão." },
      { block:"Inovação & Decisão",           text:"Estruture um laboratório de inovação pública ou participe de redes como a Rede de Inovação no Setor Público. Inovação na gestão municipal precisa de estrutura institucional para gerar impacto sustentável." },
    ],
  },
  {
    range:[35,40], emoji:"🚀", label:"Pronto para Escala", color:"#3B6FD4", bgColor:"rgba(59,111,212,0.08)",
    text:"O diagnóstico revela uma gestão com alto nível de maturidade: decisões estruturadas, áreas integradas e capacidade real de entregar resultados para a população. Esse estágio é raro no cenário municipal brasileiro e representa uma vantagem competitiva significativa para atrair investimentos, parcerias e reconhecimento institucional. O desafio agora é sustentar esse padrão, expandir o impacto e construir legado.",
    recommendations:[
      { block:"Infraestrutura & Resiliência", text:"Avance para contratos de manutenção por desempenho e adote o conceito de cidades resilientes com planejamento climático de longo prazo integrado ao Plano Diretor. Considere participar de redes internacionais como a 100 Resilient Cities." },
      { block:"Desenvolvimento Econômico",    text:"Posicione o município como hub regional: estruture uma zona de inovação, atraia âncoras econômicas estratégicas e construa uma narrativa de marca-cidade orientada a novos investidores e talentos." },
      { block:"Segurança & Mobilidade",       text:"Explore modelos de mobilidade como serviço (MaaS) e implante sistemas preditivos de segurança pública baseados em análise de dados. Esses modelos colocam o município na fronteira da gestão urbana no Brasil." },
      { block:"Questão Social",               text:"Desenvolva uma política de inclusão produtiva que conecte assistência social, capacitação profissional e mercado de trabalho, reduzindo dependência de benefícios e ampliando autonomia econômica das famílias." },
      { block:"Inovação & Decisão",           text:"Candidate o município a programas como Smart City, Cidades Empreendedoras e Rankings de Gestão Fiscal. O reconhecimento externo atrai recursos federais, parcerias privadas e talentos para a gestão pública." },
    ],
  },
];

function getProfile(score) {
  return PROFILES.find(p => score >= p.range[0] && score <= p.range[1]) || PROFILES[0];
}

function getConditionals(answers) {
  const blocks = [];
  const q14 = answers[14];
  const q6  = answers[6];
  const q10 = answers[10];

  if (q14 !== undefined) {
    blocks.push(q14 <= 1 ? {
      title:"Processo decisório — ponto crítico",
      text:"As decisões ainda são tomadas predominantemente de forma reativa, sem critérios estruturados de priorização. Na gestão pública, esse padrão leva à alocação ineficiente de recursos orçamentários, descontinuidade de políticas e desgaste das equipes. A implantação de um modelo mínimo de governança decisória — com critérios claros, instâncias definidas e informação sistematizada — é pré-condição para qualquer avanço consistente.",
      alert:true,
    } : {
      title:"Processo decisório — ponto positivo",
      text:"O processo decisório demonstra maturidade relevante para a gestão pública: há análise antes da ação e critérios que orientam as escolhas. Esse padrão favorece a alocação eficiente de recursos orçamentários, reduz retrabalho e fortalece a capacidade de planejamento de médio e longo prazo.",
      alert:false,
    });
  }
  if (q6 !== undefined) {
    blocks.push(q6 <= 1 ? {
      title:"Ambiente de negócios — ponto crítico",
      text:"O ambiente burocrático e restritivo para abertura e manutenção de empresas é um dos principais inibidores do desenvolvimento econômico local. Municípios com esse perfil enfrentam dificuldade para gerar empregos formais, ampliar a arrecadação própria e atrair capital privado. A simplificação regulatória e canais digitais de relacionamento com o setor empresarial são caminhos com custo baixo e alto retorno.",
      alert:true,
    } : {
      title:"Ambiente de negócios — ponto positivo",
      text:"Existe uma base favorável para o desenvolvimento econômico do município. Ambientes percebidos como acolhedores para negócios atraem mais investimentos, geram mais empregos formais e ampliam a arrecadação de forma sustentável. O próximo passo é institucionalizar essa percepção em política pública com indicadores monitorados.",
      alert:false,
    });
  }
  if (q10 !== undefined) {
    blocks.push(q10 <= 1 ? {
      title:"Questão social — ponto crítico",
      text:"A atuação limitada nas vulnerabilidades sociais tem impacto direto em outras dimensões da gestão: aumenta a demanda por segurança pública, reduz a produtividade econômica e compromete a qualidade de vida percebida pela população. A política social bem estruturada é fator de prevenção — com retorno comprovado em indicadores de desenvolvimento humano e redução de custos em outras secretarias.",
      alert:true,
    } : {
      title:"Questão social — ponto positivo",
      text:"A atuação estruturada nas vulnerabilidades sociais contribui diretamente para a estabilidade social, a redução da pressão sobre segurança pública e a melhora da percepção da população sobre a qualidade da gestão. Municípios com política social integrada tendem a apresentar melhores índices de IDH-Municipal e maior coesão comunitária.",
      alert:false,
    });
  }
  return blocks;
}

// ─── RELATÓRIO HTML ───────────────────────────────────────────────────────────
function generateReport({ lead, score, profile, conditionals, answers }) {
  const date = new Date().toLocaleDateString("pt-BR",{ day:"2-digit", month:"long", year:"numeric" });
  const pct  = Math.round((score / MAX_SCORE) * 100);

  const condHTML = conditionals.map(c => `
    <div style="border-left:4px solid ${c.alert?"#C94040":"#2E9E7E"};background:${c.alert?"#fff5f5":"#f0faf7"};border-radius:8px;padding:16px 20px;margin-bottom:12px;">
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:13px;color:${c.alert?"#C94040":"#2E9E7E"};margin-bottom:6px;">${c.title}</div>
      <div style="font-size:14px;line-height:1.75;color:#444;">${c.text}</div>
    </div>`).join("");

  const recsHTML = profile.recommendations.map(r => `
    <div style="border:1.5px solid #EBE7DB;border-radius:10px;padding:18px 22px;margin-bottom:12px;background:#fff;">
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:11px;color:${profile.color};letter-spacing:1.2px;text-transform:uppercase;margin-bottom:8px;">${r.block}</div>
      <div style="font-size:14px;line-height:1.75;color:#444;">${r.text}</div>
    </div>`).join("");

  const ctx = {
    cargo:    QUESTIONS[0].options[answers[1]]  || "—",
    porte:    QUESTIONS[1].options[answers[2]]  || "—",
    desafio:  QUESTIONS[2].options[answers[3]]  || "—",
    prio:     QUESTIONS[14].options[answers[15]] || "—",
    decisao:  QUESTIONS[13].options[answers[14]] || "—",
  };

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Relatório de Diagnóstico — ${lead.nome}</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:#F2F0E9;color:#1a1626}
@media print{
  body{background:#fff}
  .no-print{display:none!important}
  .pg-break{page-break-before:always}
  .section{box-shadow:none!important;border:1px solid #EBE7DB}
}
.print-btn{position:fixed;top:20px;right:20px;z-index:999;background:#332861;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 4px 20px rgba(51,40,97,.3)}
.print-btn:hover{background:#530D59}
.wrap{max-width:800px;margin:0 auto;padding:40px 24px 80px}
.cover{background:linear-gradient(135deg,#332861 0%,#530D59 100%);border-radius:20px;padding:52px 48px;margin-bottom:24px;color:#fff}
.cover-brand{font-family:'Syne',sans-serif;font-weight:800;font-size:15px;letter-spacing:3px;color:rgba(255,255,255,.5);margin-bottom:32px}
.cover-brand span{color:#49B79B}
.cover-eyebrow{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:12px}
.cover-title{font-family:'Syne',sans-serif;font-size:34px;font-weight:800;line-height:1.15;margin-bottom:8px}
.cover-sub{font-size:15px;color:rgba(255,255,255,.7);margin-bottom:32px}
.cover-meta{display:flex;gap:28px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,.15);padding-top:24px}
.meta-label{font-size:10px;color:rgba(255,255,255,.45);letter-spacing:1.2px;text-transform:uppercase;margin-bottom:4px}
.meta-value{font-family:'Syne',sans-serif;font-weight:700;font-size:15px;color:#fff}
.section{background:#fff;border-radius:16px;padding:32px 36px;margin-bottom:20px;box-shadow:0 2px 16px rgba(51,40,97,.06)}
.sec-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#332861;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #EBE7DB}
.score-area{text-align:center;padding:8px 0 16px}
.score-num{font-family:'Syne',sans-serif;font-size:84px;font-weight:800;line-height:1;color:${profile.color}}
.score-max{font-size:13px;color:#aaa;margin-bottom:18px}
.bar-track{height:10px;background:#EBE7DB;border-radius:10px;overflow:hidden;margin-bottom:6px}
.bar-fill{height:100%;width:${pct}%;background:${profile.color};border-radius:10px}
.bar-labels{display:flex;justify-content:space-between;font-size:10px;color:#bbb;margin-bottom:18px}
.badge{display:inline-flex;align-items:center;gap:8px;padding:12px 28px;border-radius:40px;background:${profile.bgColor};color:${profile.color};font-family:'Syne',sans-serif;font-weight:700;font-size:16px;margin-bottom:20px}
.profile-text{font-size:14px;line-height:1.8;color:#444;background:#F7F5F0;border-radius:10px;padding:20px 24px;text-align:left}
.ctx-table{width:100%;border-collapse:collapse}
.ctx-table td{padding:12px 0;border-bottom:1px solid #EBE7DB;font-size:14px;vertical-align:top}
.ctx-table td:first-child{color:#999;width:200px;font-weight:500}
.ctx-table tr:last-child td{border-bottom:none}
.cta-section{background:linear-gradient(135deg,#332861,#530D59);border-radius:16px;padding:32px;text-align:center;margin-bottom:20px}
.cta-title{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#fff;margin-bottom:8px}
.cta-sub{font-size:14px;color:rgba(255,255,255,.72);margin-bottom:20px}
.wa-btn{display:inline-block;background:#25D366;color:#fff;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none}
.footer{text-align:center;padding:24px 0 0;color:#aaa;font-size:12px;line-height:1.7}
.footer strong{color:#332861}
</style>
</head>
<body>
<button class="print-btn no-print" onclick="window.print()">⬇ Salvar como PDF</button>
<div class="wrap">

<div class="cover">
  <div class="cover-brand">TERRI<span>DATA</span></div>
  <div class="cover-eyebrow">Relatório Estratégico</div>
  <h1 class="cover-title">Diagnóstico da<br/>Gestão Municipal</h1>
  <p class="cover-sub">Análise com recomendações estratégicas por área de gestão pública</p>
  <div class="cover-meta">
    <div><div class="meta-label">Respondente</div><div class="meta-value">${lead.nome}</div></div>
    ${lead.estado ? `<div><div class="meta-label">Estado</div><div class="meta-value">${lead.estado}</div></div>` : ""}
    ${lead.municipio ? `<div><div class="meta-label">Município</div><div class="meta-value">${lead.municipio}</div></div>` : ""}
    <div><div class="meta-label">Data</div><div class="meta-value">${date}</div></div>
    <div><div class="meta-label">Perfil</div><div class="meta-value">${profile.emoji} ${profile.label}</div></div>
  </div>
</div>

<div class="section">
  <div class="sec-title">Pontuação & Perfil de Gestão</div>
  <div class="score-area">
    <div class="score-num">${score}</div>
    <div class="score-max">pontos de ${MAX_SCORE} possíveis</div>
    <div class="bar-track"><div class="bar-fill"></div></div>
    <div class="bar-labels"><span>10 — Risco</span><span>20 — Desorganizado</span><span>28 — Consolidação</span><span>35 — Escala</span><span>40</span></div>
    <div class="badge">${profile.emoji} ${profile.label}</div>
    <div class="profile-text">${profile.text}</div>
  </div>
</div>

<div class="section">
  <div class="sec-title">Contexto da gestão</div>
  <table class="ctx-table">
    <tr><td>Cargo</td><td>${ctx.cargo}</td></tr>
    <tr><td>Porte do município</td><td>${ctx.porte}</td></tr>
    <tr><td>Principal desafio</td><td>${ctx.desafio}</td></tr>
    <tr><td>Processo decisório</td><td>${ctx.decisao}</td></tr>
    <tr><td>Prioridade declarada</td><td>${ctx.prio}</td></tr>
  </table>
</div>

${conditionals.length > 0 ? `
<div class="section">
  <div class="sec-title">Pontos de atenção</div>
  ${condHTML}
</div>` : ""}

<div class="section pg-break">
  <div class="sec-title">Recomendações estratégicas por área</div>
  ${recsHTML}
</div>

<div class="cta-section">
  <div class="cta-title">Quer aprofundar esse diagnóstico?</div>
  <div class="cta-sub">Nossa equipe pode transformar essa leitura em um plano estratégico concreto para a sua gestão.</div>
  <a class="wa-btn" href="https://wa.me/5551992417486?text=Olá%2C%20acabei%20de%20fazer%20o%20diagnóstico%20de%20gestao%20municipal%20e%20gostaria%20de%20conversar." target="_blank">💬 Falar no WhatsApp</a>
</div>

<div class="footer">
  <p><strong>TerriData · Palco Inteligência de Negócios</strong> · contato@palcointeligencia.com.br · www.palcointeligencia.com.br</p>
  <p>Este diagnóstico é um instrumento de orientação estratégica e não substitui uma consultoria aprofundada.</p>
</div>

</div>
</body>
</html>`;
}

// ─── ESTILOS APP ──────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{--purple:#332861;--teal:#49B79B;--cream:#F2F0E9;--cream2:#EBE7DB;--mid:#530D59;--text:#1a1626;--muted:#7a7490}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--text);min-height:100vh}
.app{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px}

/* HEADER */
.header-bar{width:100%;max-width:680px;display:flex;align-items:center;justify-content:space-between;margin-bottom:32px}
.logo-text{font-family:'Syne',sans-serif;font-weight:800;font-size:17px;letter-spacing:3px;color:var(--purple)}
.logo-text span{color:var(--teal)}
.timer-badge{font-size:12px;color:var(--muted);font-weight:500;background:var(--cream2);padding:6px 12px;border-radius:20px}

/* CARD */
.card{width:100%;max-width:680px;background:#fff;border-radius:20px;padding:40px 44px;box-shadow:0 4px 40px rgba(51,40,97,.08);animation:fadeUp .35s ease both}
@media(max-width:600px){.card{padding:28px 22px}}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

/* PROGRESS */
.progress-wrap{margin-bottom:28px}
.progress-label{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:8px;font-weight:500}
.progress-track{height:4px;background:var(--cream2);border-radius:4px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--purple),var(--teal));border-radius:4px;transition:width .5s cubic-bezier(.4,0,.2,1)}

/* BLOCK COVER */
.block-cover{text-align:center;padding:8px 0}
.cover-icon{font-size:54px;margin-bottom:16px;display:block}
.cover-eyebrow{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--teal);margin-bottom:10px}
.cover-title-text{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:var(--purple);margin-bottom:12px;line-height:1.2}
.cover-desc{font-size:14px;color:var(--muted);line-height:1.65;max-width:400px;margin:0 auto 20px}
.cover-bar-wrap{max-width:320px;margin:0 auto 8px}
.cover-bar-track{height:6px;background:var(--cream2);border-radius:6px;overflow:hidden;margin-bottom:6px}
.cover-bar-fill{height:100%;background:linear-gradient(90deg,var(--purple),var(--teal));border-radius:6px;transition:width .6s ease}
.cover-bar-label{font-size:12px;color:var(--muted);text-align:center}
.cover-countdown{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:var(--purple);margin-top:16px;opacity:.6}

/* QUESTION */
.block-label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--teal);margin-bottom:12px}
.question-text{font-family:'Syne',sans-serif;font-size:21px;font-weight:700;color:var(--purple);line-height:1.3;margin-bottom:26px}
@media(max-width:600px){.question-text{font-size:17px}}
.options-list{display:flex;flex-direction:column;gap:10px}
.option-btn{display:flex;align-items:center;gap:14px;padding:14px 18px;border-radius:12px;border:1.5px solid var(--cream2);background:var(--cream);cursor:pointer;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--text);text-align:left;transition:all .18s ease}
.option-btn:hover{border-color:var(--teal);background:rgba(73,183,155,.06);transform:translateX(3px)}
.option-btn.selected{border-color:var(--purple);background:rgba(51,40,97,.05);font-weight:500}
.option-radio{width:20px;height:20px;border-radius:50%;border:2px solid #ccc;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .15s}
.option-btn.selected .option-radio{border-color:var(--purple);background:var(--purple)}
.option-radio-dot{width:8px;height:8px;border-radius:50%;background:#fff;opacity:0;transition:opacity .15s}
.option-btn.selected .option-radio-dot{opacity:1}
.nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:32px}
.btn-back{font-family:'DM Sans',sans-serif;font-size:14px;color:var(--muted);background:none;border:none;cursor:pointer;padding:8px 0;font-weight:500}
.btn-back:hover{color:var(--purple)}
.btn-next{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;color:#fff;background:var(--purple);border:none;border-radius:10px;padding:14px 28px;cursor:pointer;transition:all .2s;opacity:.35;pointer-events:none}
.btn-next.active{opacity:1;pointer-events:all}
.btn-next.active:hover{background:var(--mid);transform:translateY(-1px);box-shadow:0 6px 20px rgba(51,40,97,.25)}

/* WELCOME */
.welcome-eyebrow{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--teal);margin-bottom:16px}
.welcome-title{font-family:'Syne',sans-serif;font-size:30px;font-weight:800;color:var(--purple);line-height:1.15;margin-bottom:16px}
@media(max-width:600px){.welcome-title{font-size:24px}}
.welcome-sub{font-size:15px;color:var(--muted);line-height:1.65;margin-bottom:24px}
.welcome-note{font-size:13px;font-style:italic;color:var(--muted);border-left:3px solid var(--teal);padding-left:14px;line-height:1.6;margin-bottom:32px}
.btn-start{width:100%;font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:#fff;background:linear-gradient(135deg,var(--purple),var(--mid));border:none;border-radius:14px;padding:18px;cursor:pointer;transition:all .2s}
.btn-start:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(51,40,97,.3)}

/* LEAD FORM */
.form-title{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:var(--purple);margin-bottom:8px}
.form-sub{font-size:14px;color:var(--muted);margin-bottom:28px;line-height:1.6}
.form-group{margin-bottom:16px}
.form-label{display:block;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
.form-input,.form-select{width:100%;padding:13px 16px;border-radius:10px;border:1.5px solid var(--cream2);background:var(--cream);font-family:'DM Sans',sans-serif;font-size:15px;color:var(--text);outline:none;transition:border .15s;appearance:none;-webkit-appearance:none}
.form-input:focus,.form-select:focus{border-color:var(--purple)}
.select-wrap{position:relative}
.select-wrap::after{content:'▾';position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none;font-size:14px}
.btn-submit{width:100%;font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:#fff;background:linear-gradient(135deg,var(--purple),var(--mid));border:none;border-radius:14px;padding:18px;cursor:pointer;margin-top:8px;transition:all .2s}
.btn-submit:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(51,40,97,.3)}
.btn-submit:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}

/* RESULT */
.result-name{font-size:13px;color:var(--muted);text-align:center;margin-bottom:20px}
.result-score-area{text-align:center;padding:28px 0 24px;border-bottom:1px solid var(--cream2);margin-bottom:24px}
.result-score-number{font-family:'Syne',sans-serif;font-size:72px;font-weight:800;line-height:1;margin-bottom:4px}
.result-score-max{font-size:14px;color:var(--muted);margin-bottom:16px}
.score-bar-wrap{margin:16px 0}
.score-bar-track{height:6px;background:var(--cream2);border-radius:6px;overflow:hidden}
.score-bar-fill{height:100%;border-radius:6px;transition:width 1s cubic-bezier(.4,0,.2,1)}
.score-bar-labels{display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:6px}
.result-badge{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;border-radius:40px;font-family:'Syne',sans-serif;font-weight:700;font-size:15px}
.result-profile-text{font-size:14px;color:#444;line-height:1.75;margin-bottom:20px;padding:18px 20px;background:var(--cream);border-radius:12px}
.result-section-title{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--purple);margin-bottom:12px;margin-top:4px}
.cond-block{padding:14px 18px;border-radius:12px;margin-bottom:10px;border-left:3px solid}
.cond-title{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;margin-bottom:5px}
.cond-text{font-size:13px;line-height:1.7;color:#555}
.btn-download{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;color:var(--purple);background:var(--cream);border:2px solid var(--cream2);border-radius:12px;padding:15px;cursor:pointer;margin:20px 0 0;transition:all .2s}
.btn-download:hover{border-color:var(--purple);background:#fff}
.result-cta{margin-top:14px;padding:26px;border-radius:16px;background:linear-gradient(135deg,var(--purple),var(--mid));text-align:center}
.result-cta-text{font-family:'Syne',sans-serif;font-size:17px;font-weight:800;color:#fff;margin-bottom:6px}
.result-cta-sub{font-size:13px;color:rgba(255,255,255,.72);margin-bottom:18px}
.btn-cta-wa{display:inline-flex;align-items:center;gap:7px;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;background:#25D366;color:#fff;border:none;border-radius:10px;padding:14px 24px;cursor:pointer;text-decoration:none;transition:all .2s}
.btn-cta-wa:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(37,211,102,.4)}
`;

// ─── SCREENS ──────────────────────────────────────────────────────────────────
const SCREEN = { WELCOME:"welcome", BLOCK_COVER:"block_cover", QUIZ:"quiz", LEAD:"lead", RESULT:"result" };

export default function App() {
  const [screen,      setScreen]      = useState(SCREEN.WELCOME);
  const [currentQ,    setCurrentQ]    = useState(0);
  const [coverBlock,  setCoverBlock]  = useState(null);
  const [pendingQ,    setPendingQ]    = useState(0);   // next question index after cover
  const [answers,     setAnswers]     = useState({});
  const [lead,        setLead]        = useState({ nome:"", email:"", estado:"", municipio:"" });
  const [animKey,     setAnimKey]     = useState(0);
  const [countdown,   setCountdown]   = useState(2);
  const [coverPct,    setCoverPct]    = useState(0);

  // Score: only scored questions
  const score = QUESTIONS.filter(q => q.scored).reduce((acc,q) => {
    const a = answers[q.id];
    return a !== undefined ? acc + (a + 1) : acc;
  }, 0);

  const quizPct   = Math.round((currentQ / QUESTIONS.length) * 100);
  const profile   = getProfile(score);
  const conditionals = getConditionals(answers);

  // Auto-advance on block cover
  useEffect(() => {
    if (screen !== SCREEN.BLOCK_COVER) return;
    setCountdown(2);
    setCoverPct(0);

    const step = 20; // ms
    const total = 2000;
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += step;
      setCoverPct(Math.min((elapsed / total) * 100, 100));
      setCountdown(Math.max(Math.ceil((total - elapsed) / 1000), 0));
      if (elapsed >= total) {
        clearInterval(interval);
        setCurrentQ(pendingQ);
        setAnimKey(k => k + 1);
        setScreen(SCREEN.QUIZ);
      }
    }, step);
    return () => clearInterval(interval);
  }, [screen, coverBlock]);

  function goNext() {
    if (currentQ < QUESTIONS.length - 1) {
      const nextIdx = currentQ + 1;
      const curBlock  = QUESTIONS[currentQ].block;
      const nextBlock = QUESTIONS[nextIdx].block;
      if (nextBlock !== curBlock) {
        setCoverBlock(BLOCKS.find(b => b.id === nextBlock));
        setPendingQ(nextIdx);
        setScreen(SCREEN.BLOCK_COVER);
      } else {
        setCurrentQ(nextIdx);
        setAnimKey(k => k + 1);
      }
    } else {
      setScreen(SCREEN.LEAD);
    }
  }

  function goPrev() {
    if (currentQ > 0) {
      setCurrentQ(c => c - 1);
      setAnimKey(k => k + 1);
    }
  }

  function selectOption(qId, idx) {
    setAnswers(a => ({ ...a, [qId]: idx }));
  }

  function submitToGoogleForms(currentProfile, currentScore) {
    const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSePrydOBRcWxrmDc-Q5S3Jwm1fZGe3kcbNTwiM0ERvzYDew6A/formResponse";
    const now = new Date();
    const params = new URLSearchParams({
      "entry.1619683464": lead.nome,
      "entry.81708242":   lead.email,
      "entry.1907147194": lead.estado,
      "entry.38937":      lead.municipio,
      "entry.977816148":  String(currentScore),
      "entry.2086204536": currentProfile.label,
      "entry.934002573":  QUESTIONS[0].options[answers[1]]  || "",
      "entry.1362907413": QUESTIONS[1].options[answers[2]]  || "",
      "entry.1195044631": QUESTIONS[2].options[answers[3]]  || "",
      "entry.1890185371": String((answers[4] ?? -1) + 1),
      "entry.237667860":  String((answers[5] ?? -1) + 1),
      "entry.1025594654": String((answers[6] ?? -1) + 1),
      "entry.437467733":  String((answers[7] ?? -1) + 1),
      "entry.1589147376": String((answers[8] ?? -1) + 1),
      "entry.1949449337": String((answers[9] ?? -1) + 1),
      "entry.1769992499": String((answers[10] ?? -1) + 1),
      "entry.1690360976": String((answers[11] ?? -1) + 1),
      "entry.1724616346": String((answers[12] ?? -1) + 1),
      "entry.1143585914": String((answers[13] ?? -1) + 1),
      "entry.1121450639": QUESTIONS[13].options[answers[14]] || "",
      "entry.229713361":  QUESTIONS[14].options[answers[15]] || "",
      "entry.1623718053_year":  String(now.getFullYear()),
      "entry.1623718053_month": String(now.getMonth() + 1),
      "entry.1623718053_day":   String(now.getDate()),
    });
    fetch(FORM_URL + "?" + params.toString(), { method:"POST", mode:"no-cors" });
  }

  function openReport() {
    const html = generateReport({ lead, score, profile, conditionals, answers });
    const blob = new Blob([html], { type:"text/html;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `diagnostico-${lead.nome.replace(/\s+/g,"-").toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  const q        = QUESTIONS[currentQ];
  const selected = answers[q?.id];
  const leadValid= lead.nome.trim() && lead.email.trim().includes("@");
  const curBlockInfo = BLOCKS.find(b => b.id === q?.block);

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* HEADER */}
        <div className="header-bar">
          <div className="logo-text">TERRI<span>DATA</span></div>
          {screen === SCREEN.QUIZ && <div className="timer-badge">⏱ menos de 5 min</div>}
        </div>

        {/* WELCOME */}
        {screen === SCREEN.WELCOME && (
          <div className="card" key="welcome">
            <div className="welcome-eyebrow">diagnóstico estratégico da</div>
            <h1 className="welcome-title">Gestão Municipal</h1>
            <p className="welcome-sub">
              Este diagnóstico avalia o momento da sua gestão em áreas críticas para o desenvolvimento da cidade. Ao final, você receberá uma leitura clara dos riscos, gargalos e prioridades estratégicas — com recomendações práticas por área.
            </p>
            <p className="welcome-note">
              Não existem respostas certas ou erradas. Quanto mais honesto(a), mais útil será o diagnóstico.
            </p>
            <button className="btn-start" onClick={() => {
              setCoverBlock(BLOCKS[0]);
              setPendingQ(0);
              setScreen(SCREEN.BLOCK_COVER);
            }}>
              Iniciar diagnóstico →
            </button>
          </div>
        )}

        {/* BLOCK COVER — auto-advances em 2s */}
        {screen === SCREEN.BLOCK_COVER && coverBlock && (
          <div className="card" key={`cover-${coverBlock.id}`}>
            <div className="progress-wrap">
              <div className="progress-label">
                <span style={{ color:"var(--teal)", fontWeight:600 }}>{coverBlock.label}</span>
                <span>{pendingQ + 1} de {QUESTIONS.length}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width:`${quizPct}%` }} />
              </div>
            </div>
            <div className="block-cover">
              <span className="cover-icon">{coverBlock.icon}</span>
              <div className="cover-eyebrow">{coverBlock.label}</div>
              <div className="cover-title-text">{coverBlock.title}</div>
              <div className="cover-desc">{coverBlock.desc}</div>
              <div className="cover-bar-wrap">
                <div className="cover-bar-track">
                  <div className="cover-bar-fill" style={{ width:`${coverPct}%` }} />
                </div>
              </div>
              <div className="cover-countdown">Iniciando em {countdown}s…</div>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {screen === SCREEN.QUIZ && (
          <div className="card" key={`q-${animKey}`}>
            <div className="progress-wrap">
              <div className="progress-label">
                <span>{curBlockInfo?.label}</span>
                <span>{currentQ + 1} de {QUESTIONS.length}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width:`${quizPct}%` }} />
              </div>
            </div>
            <div className="block-label">{curBlockInfo?.title}</div>
            <div className="question-text">{q.text}</div>
            <div className="options-list">
              {q.options.map((opt, idx) => (
                <button key={idx}
                  className={`option-btn${selected === idx ? " selected" : ""}`}
                  onClick={() => selectOption(q.id, idx)}>
                  <div className="option-radio"><div className="option-radio-dot" /></div>
                  {opt}
                </button>
              ))}
            </div>
            <div className="nav-row">
              <button className="btn-back" onClick={goPrev}>{currentQ > 0 ? "← Voltar" : ""}</button>
              <button className={`btn-next${selected !== undefined ? " active" : ""}`} onClick={goNext}>
                {currentQ === QUESTIONS.length - 1 ? "Ver resultado →" : "Próxima →"}
              </button>
            </div>
          </div>
        )}

        {/* LEAD FORM */}
        {screen === SCREEN.LEAD && (
          <div className="card" key="lead">
            <div className="form-title">Quase lá.</div>
            <p className="form-sub">Preencha os dados abaixo para liberar seu diagnóstico completo com recomendações estratégicas.</p>

            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input className="form-input" placeholder="Seu nome"
                value={lead.nome} onChange={e => setLead({...lead, nome:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input className="form-input" type="email" placeholder="seu@email.com"
                value={lead.email} onChange={e => setLead({...lead, email:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <div className="select-wrap">
                <select className="form-select" value={lead.estado}
                  onChange={e => setLead({...lead, estado:e.target.value})}>
                  <option value="">Selecione o estado</option>
                  {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Município</label>
              <input className="form-input" placeholder="Nome do município"
                value={lead.municipio} onChange={e => setLead({...lead, municipio:e.target.value})} />
            </div>

            <button className="btn-submit" disabled={!leadValid}
              onClick={() => {
                submitToGoogleForms(getProfile(score), score);
                setScreen(SCREEN.RESULT);
              }}>
              Ver meu diagnóstico →
            </button>
          </div>
        )}

        {/* RESULT */}
        {screen === SCREEN.RESULT && (
          <div className="card" key="result">
            <p className="result-name">
              Diagnóstico de {lead.nome}
              {lead.municipio ? ` · ${lead.municipio}` : ""}
              {lead.estado ? `/${lead.estado}` : ""}
            </p>

            <div className="result-score-area">
              <div className="result-score-number" style={{ color:profile.color }}>{score}</div>
              <div className="result-score-max">pontos de {MAX_SCORE} possíveis</div>
              <div className="score-bar-wrap">
                <div className="score-bar-track">
                  <div className="score-bar-fill"
                    style={{ width:`${Math.round((score/MAX_SCORE)*100)}%`, background:profile.color }} />
                </div>
                <div className="score-bar-labels">
                  <span>10</span><span>20</span><span>28</span><span>35</span><span>40</span>
                </div>
              </div>
              <div className="result-badge" style={{ background:profile.bgColor, color:profile.color }}>
                <span>{profile.emoji}</span><span>{profile.label}</span>
              </div>
            </div>

            <div className="result-profile-text">{profile.text}</div>

            {conditionals.length > 0 && (
              <>
                <div className="result-section-title">Pontos de atenção</div>
                {conditionals.map((c,i) => (
                  <div key={i} className="cond-block"
                    style={{ borderColor:c.alert?"#C94040":"#2E9E7E",
                             background:c.alert?"rgba(201,64,64,.05)":"rgba(46,158,126,.05)" }}>
                    <div className="cond-title" style={{ color:c.alert?"#C94040":"#2E9E7E" }}>{c.title}</div>
                    <div className="cond-text">{c.text}</div>
                  </div>
                ))}
              </>
            )}

            <button className="btn-download" onClick={openReport}>
              📄 Baixar relatório completo com recomendações
            </button>

            <div className="result-cta">
              <div className="result-cta-text">Quer aprofundar esse diagnóstico?</div>
              <div className="result-cta-sub">
                Nossa equipe pode transformar essa leitura em um plano estratégico concreto para a sua gestão.
              </div>
              <a className="btn-cta-wa"
                href="https://wa.me/5551992417486?text=Olá%2C%20acabei%20de%20fazer%20o%20diagnóstico%20de%20gestao%20municipal%20e%20gostaria%20de%20conversar."
                target="_blank" rel="noopener noreferrer">
                💬 Falar no WhatsApp
              </a>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
