export interface QuizItem {
  id: string;
  question: string;
  description: string;
  image?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
    icon?: string;
  }[];
}

export interface PhaseInfo {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badgeName: string;
  badgeIcon: string;
  accentColor: string;
  bgGradient: string;
  bannerImage: string;
}

export const PHASES_CONFIG: PhaseInfo[] = [
  {
    id: 1,
    title: 'Fase 1: O Que é um Navegador?',
    subtitle: 'Navegador vs. Sites vs. Aplicativos',
    description: 'Descubra como o navegador funciona como uma nave espacial que nos leva para qualquer lugar da internet!',
    badgeName: 'Capitão dos Navegadores',
    badgeIcon: 'Compass',
    accentColor: 'indigo',
    bgGradient: 'from-blue-600 to-indigo-700',
    bannerImage: '/src/assets/images/hero_browser_adventure_1790178279754.jpg',
  },
  {
    id: 2,
    title: 'Fase 2: As Peças do Navegador',
    subtitle: 'Barra de endereço, abas e botões',
    description: 'Explore a janela do navegador e descubra para que serve cada botão e onde digitamos os sites!',
    badgeName: 'Mestre da Barra de Endereço',
    badgeIcon: 'Search',
    accentColor: 'emerald',
    bgGradient: 'from-emerald-600 to-teal-700',
    bannerImage: '/src/assets/images/browser_window_guide_1790178290164.jpg',
  },
  {
    id: 3,
    title: 'Fase 3: Classificador de Ícones',
    subtitle: 'Ligue cada botão ao seu superpoder',
    description: 'Setas, estrelinhas, cadeados e lupas: organize os símbolos do navegador e mostre que você é craque!',
    badgeName: 'Decifrador de Ícones',
    badgeIcon: 'Layers',
    accentColor: 'amber',
    bgGradient: 'from-amber-500 to-orange-600',
    bannerImage: '/src/assets/images/browser_window_guide_1790178290164.jpg',
  },
  {
    id: 4,
    title: 'Fase 4: Detetive das Palavras-Chave',
    subtitle: 'Como pesquisar no buscador sem complicação',
    description: 'Aprenda a escolher as palavras mágicas que fazem o computador achar exatamente o que você procura!',
    badgeName: 'Super Detetive da Busca',
    badgeIcon: 'Key',
    accentColor: 'violet',
    bgGradient: 'from-purple-600 to-indigo-800',
    bannerImage: '/src/assets/images/keyword_detective_kids_1790178305372.jpg',
  },
  {
    id: 5,
    title: 'Fase 5: Guardiões da Internet',
    subtitle: 'Segurança digital e proteção online',
    description: 'Aprenda a reconhecer perigos, proteger seus dados pessoais e navegar com total segurança e tranquilidade!',
    badgeName: 'Guardião Digital 5 Estrelas',
    badgeIcon: 'ShieldCheck',
    accentColor: 'rose',
    bgGradient: 'from-rose-500 to-red-700',
    bannerImage: '/src/assets/images/digital_safety_shield_1790178315802.jpg',
  },
];

// Phase 1: Browser Identification questions
export const PHASE1_ITEMS: QuizItem[] = [
  {
    id: 'p1_q1',
    question: 'O que é exatamente um NAVEGADOR de internet (Browser)?',
    description: 'Pense no navegador como um meio de transporte para viajar pelo mundo digital!',
    options: [
      {
        id: 'opt1',
        text: 'É o programa que abre a janela para a gente entrar e visitar todos os sites da internet.',
        isCorrect: true,
        explanation: 'Muito bem! Exemplos de navegadores são o Google Chrome, Mozilla Firefox, Microsoft Edge e Safari. Eles são como carros que nos levam pelas estradas da web!',
        icon: 'Globe',
      },
      {
        id: 'opt2',
        text: 'É um jogo que já vem instalado no videogame.',
        isCorrect: false,
        explanation: 'Não é bem isso! Jogos são divertidos, mas o navegador é o programa usado para abrir páginas na internet.',
        icon: 'Gamepad',
      },
      {
        id: 'opt3',
        text: 'É a caixa física do computador onde ligamos na tomada.',
        isCorrect: false,
        explanation: 'Isso é o computador ou gabinete! O navegador é um programa de software que roda dentro do computador.',
        icon: 'Cpu',
      },
    ],
  },
  {
    id: 'p1_q2',
    question: 'Qual a diferença entre um NAVEGADOR e um SITE?',
    description: 'Imagine uma garagem e os carros ou uma casa e as estradas...',
    options: [
      {
        id: 'opt1',
        text: 'O navegador é o veículo (como o Chrome); o site é o lugar que a gente visita (como o YouTube ou a Wikipédia).',
        isCorrect: true,
        explanation: 'Exato! Você usa o navegador para ir até os sites. O site vive dentro da internet e você o vê pela janela do navegador!',
        icon: 'CheckCircle',
      },
      {
        id: 'opt2',
        text: 'Navegador e site são a mesma coisa, só mudam de nome.',
        isCorrect: false,
        explanation: 'São diferentes! O navegador é o aplicativo que você abre no celular ou PC, e o site é a página com conteúdo que você visita.',
        icon: 'HelpCircle',
      },
      {
        id: 'opt3',
        text: 'O site é a tomada de energia e o navegador é a tela.',
        isCorrect: false,
        explanation: 'Não! Ambos são programas digitais: um é a ferramenta de navegação e o outro é o conteúdo.',
        icon: 'AlertCircle',
      },
    ],
  },
  {
    id: 'p1_q3',
    question: 'Qual destes itens abaixo É um NAVEGADOR de verdade?',
    description: 'Procure o ícone do programa que usamos para acessar a web!',
    options: [
      {
        id: 'opt1',
        text: 'Google Chrome (ou Mozilla Firefox / Microsoft Edge)',
        isCorrect: true,
        explanation: 'Parabéns! O Chrome, Firefox, Edge e Safari são os navegadores mais famosos do mundo!',
        icon: 'Compass',
      },
      {
        id: 'opt2',
        text: 'A Calculadora do computador',
        isCorrect: false,
        explanation: 'A calculadora só faz contas matemáticas no computador, ela não navega na internet!',
        icon: 'Calculator',
      },
      {
        id: 'opt3',
        text: 'O Paint (programa de desenhar)',
        isCorrect: false,
        explanation: 'O Paint serve para pintar e fazer desenhos no computador, não para acessar sites da web.',
        icon: 'Palette',
      },
    ],
  },
  {
    id: 'p1_q4',
    question: 'O que o navegador precisa para abrir sites como a Wikipédia ou o site da escola?',
    description: 'Pense no que conecta o computador com o resto do mundo.',
    options: [
      {
        id: 'opt1',
        text: 'Estar conectado à Internet (por Wi-Fi ou cabo de rede).',
        isCorrect: true,
        explanation: 'Show! Sem internet, o navegador mostra uma mensagem dizendo que está offline (às vezes até aquele joguinho do dinossauro!).',
        icon: 'Wifi',
      },
      {
        id: 'opt2',
        text: 'Estar com uma impressora ligada.',
        isCorrect: false,
        explanation: 'A impressora serve apenas para colocar coisas no papel, não é necessária para navegar.',
        icon: 'Printer',
      },
      {
        id: 'opt3',
        text: 'Ter uma caneta mágica colorida.',
        isCorrect: false,
        explanation: 'Uma caneta mágica seria incrível, mas para abrir sites precisamos de conexão com a internet!',
        icon: 'Sparkles',
      },
    ],
  },
];

// Phase 2: Browser Elements interactive missions
export interface BrowserMission {
  id: string;
  title: string;
  instruction: string;
  targetKey: 'address-bar' | 'back-button' | 'forward-button' | 'refresh-button' | 'new-tab' | 'bookmark-star' | 'security-lock' | 'home-button';
  targetLabel: string;
  successMessage: string;
  detailedTip: string;
  kidHint: string;
}

export const PHASE2_MISSIONS: BrowserMission[] = [
  {
    id: 'm1',
    title: 'Missão 1: Onde Digitamos o Endereço?',
    instruction: 'Clique no lugar do navegador onde escrevemos o endereço do site que queremos visitar (como "www.escola.com.br")!',
    targetKey: 'address-bar',
    targetLabel: 'Barra de Endereço (URL)',
    successMessage: 'Sensacional! Essa é a Barra de Endereço! Nela digitamos o nome do site que queremos visitar, ou palavras para pesquisar.',
    detailedTip: 'A barra de endereço também é chamada de Omnibox porque serve tanto para digitar o link (URL) quanto para fazer pesquisas diretas.',
    kidHint: 'Dica: É aquele retângulo longo no topo do navegador que mostra o texto "https://www.escola-aventura.edu.br"!',
  },
  {
    id: 'm2',
    title: 'Missão 2: Como Voltar para a Página Anterior?',
    instruction: 'Ops! Entramos numa página sem querer e queremos voltar para a página de onde viemos. Onde clicamos?',
    targetKey: 'back-button',
    targetLabel: 'Botão Voltar (Seta para a Esquerda)',
    successMessage: 'Muito bem! A seta apontando para a esquerda faz o navegador dar um passo para trás e voltar para a página anterior!',
    detailedTip: 'Se você quiser voltar ainda mais páginas, pode clicar nele várias vezes ou segurar com o botão direito para ver o histórico recente.',
    kidHint: 'Dica: Procure uma seta que aponta para trás (⬅️) no canto esquerdo da barra de navegação!',
  },
  {
    id: 'm3',
    title: 'Missão 3: A Página Travou! O que Fazer?',
    instruction: 'A página da internet parou no meio ou não carregou as fotos direito. Em qual botão clicamos para recarregar a página?',
    targetKey: 'refresh-button',
    targetLabel: 'Botão Recarregar / Atualizar (Seta Circular)',
    successMessage: 'Perfeito! O botão de Recarregar (a setinha circular em volta de si mesma) pede ao site para mandar as informações de novo!',
    detailedTip: 'Também dá para recarregar apertando a tecla F5 ou Ctrl + R no teclado do computador.',
    kidHint: 'Dica: Procure uma setinha que faz uma curva em círculo (🔄) ao lado da seta de voltar!',
  },
  {
    id: 'm4',
    title: 'Missão 4: Como Abrir Outro Site sem Fechar Este?',
    instruction: 'Você está lendo um texto mas quer abrir um jogo educativo ao lado sem perder sua leitura. Onde clicamos para criar uma Nova Aba?',
    targetKey: 'new-tab',
    targetLabel: 'Botão Nova Aba (Símbolo de Mais +)',
    successMessage: 'Excelente! O botão de + cria uma Nova Aba (Guia). Assim você pode ter várias páginas abertas ao mesmo tempo!',
    detailedTip: 'Cada aba funciona como uma pasta separada dentro do mesmo navegador. No teclado, o atalho é Ctrl + T.',
    kidHint: 'Dica: Olhe lá no topo, bem acima da barra de endereço, perto do nome da página onde tem um sinalzinho de mais (+)!',
  },
  {
    id: 'm5',
    title: 'Missão 5: Adoramos Este Site! Como Salvar?',
    instruction: 'Você encontrou o site perfeito com pesquisas para a feira de ciências e quer guardá-lo para abrir amanhã sem esquecer. Onde clicamos?',
    targetKey: 'bookmark-star',
    targetLabel: 'Estrela de Favoritos',
    successMessage: 'Isso aí! A Estrelinha guarda a página nos seus Favoritos (Marcadores)! Assim você clica e entra rapidinho sem ter que digitar tudo de novo.',
    detailedTip: 'No computador você pode apertar Ctrl + D para adicionar qualquer site aos favoritos.',
    kidHint: 'Dica: Procure uma estrelinha bonita (⭐) do lado direito dentro da barra de endereço!',
  },
  {
    id: 'm6',
    title: 'Missão 6: Como Saber se o Site é Seguro?',
    instruction: 'Para saber se a nossa conexão com o site está protegida e criptografada, qual símbolo procuramos na barra de endereço?',
    targetKey: 'security-lock',
    targetLabel: 'Cadeado de Segurança (HTTPS)',
    successMessage: 'Brilhante! O Cadeado fechado mostra que o site usa segurança digital (HTTPS), protegendo a comunicação entre o seu computador e o servidor.',
    detailedTip: 'Sites com cadeado aberto ou aviso vermelho de "Não Seguro" exigem atenção redobrada!',
    kidHint: 'Dica: Procure um desenho de cadeado fechado (🔒) antes do endereço do site!',
  },
];

// Phase 3: Icon Classifier items
export interface IconMatchItem {
  id: string;
  iconChar: string;
  name: string;
  actionDescription: string;
  soundCue: string;
  category: 'Navegação' | 'Organização' | 'Segurança';
}

export const PHASE3_ICONS: IconMatchItem[] = [
  {
    id: 'icon_back',
    iconChar: '⬅️',
    name: 'Seta para a Esquerda',
    actionDescription: 'Voltar para a página da web que visitamos antes.',
    soundCue: 'Voltando um passo no histórico!',
    category: 'Navegação',
  },
  {
    id: 'icon_forward',
    iconChar: '➡️',
    name: 'Seta para a Direita',
    actionDescription: 'Avançar para a página seguinte depois que já tínhamos voltado.',
    soundCue: 'Avançando no caminho!',
    category: 'Navegação',
  },
  {
    id: 'icon_refresh',
    iconChar: '🔄',
    name: 'Seta Circular',
    actionDescription: 'Recarregar a página para atualizar fotos e notícias.',
    soundCue: 'Recarregando tudo com carinho!',
    category: 'Navegação',
  },
  {
    id: 'icon_lock',
    iconChar: '🔒',
    name: 'Cadeado Fechado',
    actionDescription: 'Indica conexão segura e protegida por criptografia (HTTPS).',
    soundCue: 'Proteção ativada contra bisbilhoteiros!',
    category: 'Segurança',
  },
  {
    id: 'icon_star',
    iconChar: '⭐',
    name: 'Estrela',
    actionDescription: 'Salvar a página na lista de Favoritos para achar depois.',
    soundCue: 'Site especial guardado com carinho!',
    category: 'Organização',
  },
  {
    id: 'icon_plus',
    iconChar: '➕',
    name: 'Sinal de Adição',
    actionDescription: 'Abrir uma Nova Aba para ver outro site ao mesmo tempo.',
    soundCue: 'Mais uma folhinha digital aberta!',
    category: 'Organização',
  },
  {
    id: 'icon_home',
    iconChar: '🏠',
    name: 'Casinha',
    actionDescription: 'Voltar direto para a Página Inicial configurada no navegador.',
    soundCue: 'De volta ao porto seguro!',
    category: 'Navegação',
  },
  {
    id: 'icon_search',
    iconChar: '🔍',
    name: 'Lupa',
    actionDescription: 'Fazer uma busca ou pesquisa por um assunto novo na internet.',
    soundCue: 'Investigando o assunto com a lupa!',
    category: 'Navegação',
  },
];

// Phase 4: Keyword Detective items
export interface KeywordScenario {
  id: string;
  goal: string;
  topic: string;
  options: {
    id: string;
    text: string;
    isBest: boolean;
    rating: 'Ótimo' | 'Muito Longo' | 'Vago Demais';
    feedback: string;
  }[];
  simulatedResults: {
    title: string;
    url: string;
    snippet: string;
  }[];
}

export const PHASE4_SCENARIOS: KeywordScenario[] = [
  {
    id: 'kw1',
    goal: 'A professora pediu para pesquisar o que os dinossauros herbívoros comiam.',
    topic: 'Dinossauros Herbívoros',
    options: [
      {
        id: 'kw1_opt1',
        text: 'dinossauros herbívoros alimentação folhas plantas',
        isBest: true,
        rating: 'Ótimo',
        feedback: 'Perfeito, detetive! Você usou as palavras-chave principais sem enrolação. O buscador vai direto ao ponto!',
      },
      {
        id: 'kw1_opt2',
        text: 'oi computador por favor você poderia me falar o que os dinossauros que não comiam carne comiam de café da manhã',
        isBest: false,
        rating: 'Muito Longo',
        feedback: 'Muito longo! Computadores não precisam de saudações ou palavras como "café da manhã", "por favor" e "poderia". Foco nas palavras-chave!',
      },
      {
        id: 'kw1_opt3',
        text: 'comida',
        isBest: false,
        rating: 'Vago Demais',
        feedback: 'Vago demais! Se você pesquisar só "comida", o buscador vai mostrar fotos de pizza, hambúrguer e receitas humanas, e nada sobre dinossauros!',
      },
    ],
    simulatedResults: [
      {
        title: 'Guia Escolar: O que comiam os Dinossauros Herbívoros?',
        url: 'https://ciencianaescola.org.br/dinossauros-herbivoros',
        snippet: 'Dinossauros como o Braquiossauro e Tricerátops se alimentavam de samambaias, galhos e folhas do topo das árvores com seus dentes especiais...',
      },
      {
        title: 'Museu Virtual: Plantas fósseis e dentes de dinossauros',
        url: 'https://museudosfossaisehistoria.com.br/herbivoros',
        snippet: 'Descubra como os paleontólogos descobrem a dieta dos animais pré-históricos examinando dentes fossilizados.',
      },
    ],
  },
  {
    id: 'kw2',
    goal: 'Descobrir quantos planetas existem no nosso Sistema Solar.',
    topic: 'Planetas do Sistema Solar',
    options: [
      {
        id: 'kw2_opt1',
        text: 'planetas sistema solar quantidade nomes',
        isBest: true,
        rating: 'Ótimo',
        feedback: 'Excelente escolha! Com essas palavras você descobre a contagem oficial (8 planetas) e os nomes de cada um!',
      },
      {
        id: 'kw2_opt2',
        text: 'espaço',
        isBest: false,
        rating: 'Vago Demais',
        feedback: 'Muito vago! "Espaço" pode ser espaço sideral, espaço em branco no caderno, espaço de festa ou astronautas.',
      },
      {
        id: 'kw2_opt3',
        text: 'quantos planetas tem lá no céu voando em volta do sol amarelo',
        isBest: false,
        rating: 'Muito Longo',
        feedback: 'Cheio de palavras extras! Os robôs de busca funcionam melhor com substantivos diretos: "planetas sistema solar quantidade".',
      },
    ],
    simulatedResults: [
      {
        title: 'Espaço para Crianças: Conheça os 8 planetas do Sistema Solar',
        url: 'https://astronomiamirim.edu.br/o-sistema-solar',
        snippet: 'Mercúrio, Vênus, Terra, Marte, Júpiter, Saturno, Urano e Netuno formam a nossa vizinhança cósmica!',
      },
      {
        title: 'Por que Plutão virou planeta anão? Entenda a contagem',
        url: 'https://observatoriocientifico.org.br/planetas-anoes',
        snippet: 'Em 2006, os cientistas definiram que nosso sistema tem 8 planetas principais e vários planetas anões fascinantes.',
      },
    ],
  },
  {
    id: 'kw3',
    goal: 'Achar uma receita simples de bolo de cenoura com calda de chocolate para o lanche.',
    topic: 'Culinária em Família',
    options: [
      {
        id: 'kw3_opt1',
        text: 'receita bolo de cenoura simples chocolate',
        isBest: true,
        rating: 'Ótimo',
        feedback: 'Incrível! Palavras precisas: o prato ("bolo de cenoura"), a facilidade ("simples") e a cobertura ("chocolate").',
      },
      {
        id: 'kw3_opt2',
        text: 'eu quero muito comer algo gostoso e doce hoje na minha casa com meus amigos',
        isBest: false,
        rating: 'Muito Longo',
        feedback: 'Essa é uma frase que falamos para um amigo, mas para o navegador não diz qual prato você quer cozinhar!',
      },
      {
        id: 'kw3_opt3',
        text: 'cenoura',
        isBest: false,
        rating: 'Vago Demais',
        feedback: 'Se pesquisar só "cenoura", o buscador mostrará como plantar cenouras na horta ou vitaminas da cenoura, não a receita do bolo!',
      },
    ],
    simulatedResults: [
      {
        title: 'Bolo de Cenoura Fofinho e Fácil de Liquidificador',
        url: 'https://cozinhadivertida.com.br/bolo-cenoura-chocolate',
        snippet: 'Aprenda a fazer um bolo de cenoura delicioso com cobertura crocante de chocolate! Peça sempre ajuda a um adulto para usar o forno.',
      },
      {
        title: 'Dicas de culinária para fazer receitas seguras em família',
        url: 'https://pequenoschefs.com.br/lanches-da-tarde',
        snippet: 'Receitas práticas para crianças e pais se divertirem juntos na cozinha com segurança.',
      },
    ],
  },
];

// Phase 5: Digital Safety items
export interface SafetyScenario {
  id: string;
  title: string;
  situation: string;
  alertLevel: 'Perigo' | 'Atenção' | 'Seguro';
  options: {
    id: string;
    action: string;
    isSafe: boolean;
    explanation: string;
  }[];
}

export const PHASE5_SCENARIOS: SafetyScenario[] = [
  {
    id: 'safe1',
    title: 'O Jogo que Pede Dados Pessoais',
    situation: 'Você entrou em um joguinho online novo e apareceu uma tela: "Digite seu nome completo, onde você estuda, o telefone da sua mãe e o endereço da sua casa para ganhar 500 moedas de ouro!".',
    alertLevel: 'Perigo',
    options: [
      {
        id: 's1_a',
        action: 'NUNCA digitar dados pessoais na internet e avisar um adulto responsável imediatamente!',
        isSafe: true,
        explanation: 'Atitude de mestre! Seus dados pessoais (nome completo, endereço, escola, telefone) são preciosos e nenhum estranho ou jogo deve pedir isso para você jogar!',
      },
      {
        id: 's1_b',
        action: 'Digitar tudo bem rápido porque 500 moedas de ouro no jogo valem a pena.',
        isSafe: false,
        explanation: 'Cuidado! Isso é uma armadilha perigosa. Pessoas mal-intencionadas podem usar essas informações. Nunca passe dados pessoais!',
      },
    ],
  },
  {
    id: 'safe2',
    title: 'A Janela do Prêmio Milionário',
    situation: 'De repente, pulou na tela uma janela brilhando com confetes dizendo: "URGENTE! Você é o visitante número 1.000.000 e ganhou um celular novinho grátis! CLIQUE AQUI PARA RESGATAR!".',
    alertLevel: 'Perigo',
    options: [
      {
        id: 's2_a',
        action: 'É um golpe (anúncio falso)! Não clicar em nada e fechar a janela ou aba.',
        isSafe: true,
        explanation: 'Excelente reflexo! Ninguém distribui presentes caros de graça na internet. Essas mensagens falsas tentam enganar as pessoas para instalar vírus ou roubar senhas.',
      },
      {
        id: 's2_b',
        action: 'Clicar correndo antes que outra pessoa pegue o celular de graça.',
        isSafe: false,
        explanation: 'Não faça isso! É 100% golpe. Clicar em anúncios de "Você ganhou!" pode encher seu computador de vírus.',
      },
    ],
  },
  {
    id: 'safe3',
    title: 'O Segredo da Senha',
    situation: 'Um colega em um jogo online mandou mensagem dizendo: "Ei, me passa a sua senha secreta para eu colocar uma roupinha bonita no seu personagem?".',
    alertLevel: 'Atenção',
    options: [
      {
        id: 's3_a',
        action: 'Dizer que senhas são secretas como uma escova de dentes: ninguém compartilha com ninguém!',
        isSafe: true,
        explanation: 'Isso mesmo! A sua senha só você e seus pais ou responsáveis devem saber. Se você der a senha, a pessoa pode roubar sua conta.',
      },
      {
        id: 's3_b',
        action: 'Passar a senha para ser simpático e ganhar a roupa no jogo.',
        isSafe: false,
        explanation: 'Nunca passe sua senha! Mesmo que a pessoa pareça legal, sua conta pode ser perdida para sempre.',
      },
    ],
  },
  {
    id: 'safe4',
    title: 'A Mensagem Estranha ou Assustadora',
    situation: 'Você estava navegando e apareceu uma imagem ou mensagem estranha, feia ou que te deixou com medo ou confuso.',
    alertLevel: 'Atenção',
    options: [
      {
        id: 's4_a',
        action: 'Parar de olhar e chamar na mesma hora um adulto de confiança (pais, tios ou professora).',
        isSafe: true,
        explanation: 'Perfeito! Os adultos estão aí para nos proteger. Você nunca tem culpa quando algo chato ou assustador aparece na tela.',
      },
      {
        id: 's4_b',
        action: 'Ficar olhando com medo em silêncio e guardar segredo dos adultos.',
        isSafe: false,
        explanation: 'Nunca guarde segredo sobre coisas que te deixam desconfortável na internet! Contar para um adulto é sempre a escolha certa.',
      },
    ],
  },
  {
    id: 'safe5',
    title: 'O Super Cadeado de Proteção',
    situation: 'A sua professora pediu para abrir a biblioteca digital da escola. Como você confere se a conexão com o site é protegida?',
    alertLevel: 'Seguro',
    options: [
      {
        id: 's5_a',
        action: 'Olho na barra de endereço para ver se tem o ícone do Cadeado Fechado (🔒) e as letras https://',
        isSafe: true,
        explanation: 'Show de bola! O cadeado significa que suas informações navegam num túnel secreto e protegido, onde ninguém pode espiar.',
      },
      {
        id: 's5_b',
        action: 'Apenas olho se o fundo do site é colorido e tem desenhos animados.',
        isSafe: false,
        explanation: 'Cuidado! Qualquer site (inclusive sites ruins) pode ter desenhos coloridos. A segurança de verdade quem mostra é o cadeado no navegador!',
      },
    ],
  },
];
