import { v4 as uuidv4 } from 'uuid';
import { CarouselFormData, Slide, CarouselTemplate } from '@/types';
import { templates } from '@/data/templates';

export function generateSlides(formData: CarouselFormData): Slide[] {
  const template = templates.find(t => t.id === formData.template);
  if (!template) {
    throw new Error(`Template "${formData.template}" not found`);
  }

  const structure = template.slideStructure.slice(0, formData.slideCount);

  const slides: Slide[] = structure.map((hint, index) => {
    const content = generateSlideContent(
      hint.role,
      hint.titleHint,
      hint.contentHint,
      formData,
      index,
      structure.length
    );

    return {
      id: uuidv4(),
      order: index,
      title: content.title,
      subtitle: content.subtitle,
      shortText: content.shortText,
      cta: content.cta,
      visualSuggestion: content.visualSuggestion,
      backgroundColor: index === 0 ? formData.brandColors.primary : undefined,
      titleColor: index === 0 ? '#FFFFFF' : formData.brandColors.primary,
      textColor: formData.brandColors.text,
      ctaColor: formData.brandColors.accent,
      ctaTextColor: '#FFFFFF',
      fontFamily: 'Inter',
    };
  });

  return slides;
}

interface SlideContent {
  title: string;
  subtitle: string;
  shortText: string;
  cta: string;
  visualSuggestion: string;
}

function generateSlideContent(
  role: string,
  titleHint: string,
  contentHint: string,
  form: CarouselFormData,
  index: number,
  total: number
): SlideContent {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const generators: Record<string, () => SlideContent> = {
    hook: () => ({
      title: `Você ainda ${form.mainPain.toLowerCase()}?`,
      subtitle: form.productName,
      shortText: `Se você faz parte do público de ${form.targetAudience.toLowerCase()}, isso vai mudar sua vida.`,
      cta: 'Deslize para descobrir →',
      visualSuggestion: 'Imagem de impacto relacionada à dor do público. Fundo escuro com texto claro.',
    }),
    capa: () => ({
      title: form.productName,
      subtitle: titleHint,
      shortText: form.productDescription.substring(0, 100),
      cta: 'Deslize para saber mais →',
      visualSuggestion: 'Logo centralizado com fundo na cor primária da marca.',
    }),
    teaser: () => ({
      title: 'Algo incrível está chegando...',
      subtitle: form.productName,
      shortText: `Para quem busca ${form.mainBenefit.toLowerCase()}.`,
      cta: 'Deslize para descobrir →',
      visualSuggestion: 'Fundo misterioso com elementos visuais sutis. Usar cor primária.',
    }),
    problema: () => ({
      title: `O problema de ${form.mainPain.toLowerCase()}`,
      subtitle: 'Você não está sozinho(a)',
      shortText: `${form.targetAudience} enfrentam isso diariamente. É frustrante, cansativo e parece não ter solução.`,
      cta: '',
      visualSuggestion: 'Ícone ou ilustração representando frustração/problema.',
    }),
    agitacao: () => ({
      title: 'E se nada mudar?',
      subtitle: 'As consequências são reais',
      shortText: `Continuar com ${form.mainPain.toLowerCase()} pode custar caro. Seu tempo, dinheiro e energia estão em jogo.`,
      cta: '',
      visualSuggestion: 'Visual que transmita urgência. Números ou estatísticas.',
    }),
    solucao: () => ({
      title: `Conheça ${form.productName}`,
      subtitle: form.mainBenefit,
      shortText: form.productDescription.substring(0, 120),
      cta: '',
      visualSuggestion: 'Mockup do produto ou visual clean apresentando a solução.',
    }),
    revelacao: () => ({
      title: `Apresentando: ${form.productName}`,
      subtitle: form.mainBenefit,
      shortText: form.productDescription.substring(0, 120),
      cta: '',
      visualSuggestion: 'Reveal dramático do produto. Fundo premium.',
    }),
    contexto: () => ({
      title: 'Por que isso importa?',
      subtitle: `Para ${form.targetAudience.toLowerCase()}`,
      shortText: `Entender sobre ${form.productName.toLowerCase()} pode ser o diferencial que você precisa.`,
      cta: '',
      visualSuggestion: 'Dados ou contexto visual sobre o tema.',
    }),
    intro: () => ({
      title: 'O que você vai aprender',
      subtitle: `Guia prático sobre ${form.productName.toLowerCase()}`,
      shortText: `Em poucos passos, você vai dominar ${form.mainBenefit.toLowerCase()}.`,
      cta: '',
      visualSuggestion: 'Lista visual ou checklist dos passos.',
    }),
    'o-que-e': () => ({
      title: `O que é ${form.productName}?`,
      subtitle: 'Simples e direto',
      shortText: form.productDescription.substring(0, 140),
      cta: '',
      visualSuggestion: 'Infográfico ou visual explicativo.',
    }),
    'para-quem': () => ({
      title: 'Feito para você',
      subtitle: `Ideal para ${form.targetAudience.toLowerCase()}`,
      shortText: `Se você ${form.mainPain.toLowerCase()}, ${form.productName} foi pensado exatamente para o seu perfil.`,
      cta: '',
      visualSuggestion: 'Personas ou avatares representando o público-alvo.',
    }),
    disponibilidade: () => ({
      title: 'Disponível agora',
      subtitle: 'Não perca essa oportunidade',
      shortText: `${form.productName} está pronto para transformar sua experiência.`,
      cta: form.finalCTA,
      visualSuggestion: 'Badge de "novo" ou "disponível". Visual de lançamento.',
    }),
    'prova-social': () => ({
      title: 'Quem usa, aprova',
      subtitle: 'Resultados reais',
      shortText: `Centenas de pessoas em ${form.targetAudience.toLowerCase()} já estão colhendo os resultados.`,
      cta: '',
      visualSuggestion: 'Espaço para depoimentos ou logos de clientes.',
    }),
    prova: () => ({
      title: 'A prova está nos resultados',
      subtitle: 'Dados que não mentem',
      shortText: `${form.productName} já ajudou pessoas com ${form.mainPain.toLowerCase()} a alcançar ${form.mainBenefit.toLowerCase()}.`,
      cta: '',
      visualSuggestion: 'Gráficos, números ou cases de sucesso.',
    }),
    oferta: () => ({
      title: 'Uma oferta especial para você',
      subtitle: form.productName,
      shortText: `Tudo o que você precisa para ${form.mainBenefit.toLowerCase()}, em um só lugar.`,
      cta: form.finalCTA,
      visualSuggestion: 'Box de oferta com destaque de preço/condições.',
    }),
    urgencia: () => ({
      title: 'Mas corra...',
      subtitle: 'Vagas limitadas',
      shortText: 'Essa condição especial não vai durar para sempre. Garanta agora.',
      cta: form.finalCTA,
      visualSuggestion: 'Timer ou indicador de escassez. Cores quentes.',
    }),
    resumo: () => ({
      title: 'Recapitulando',
      subtitle: 'Os pontos principais',
      shortText: `Tudo sobre ${form.productName.toLowerCase()} resumido para você.`,
      cta: '',
      visualSuggestion: 'Checklist visual ou bullet points.',
    }),
    aplicacao: () => ({
      title: 'Agora é sua vez',
      subtitle: 'Coloque em prática',
      shortText: `Comece aplicando o que aprendeu sobre ${form.productName.toLowerCase()} hoje mesmo.`,
      cta: form.finalCTA,
      visualSuggestion: 'Visual motivacional com call-to-action.',
    }),
    resultado: () => ({
      title: 'O resultado',
      subtitle: 'O que esperar',
      shortText: `Ao seguir esses passos, você vai ${form.mainBenefit.toLowerCase()}.`,
      cta: '',
      visualSuggestion: 'Visual de "antes e depois" ou resultado final.',
    }),
    transicao: () => ({
      title: 'Até que tudo mudou',
      subtitle: `Com ${form.productName}`,
      shortText: `O momento em que ${form.targetAudience.toLowerCase()} descobriram uma forma melhor.`,
      cta: '',
      visualSuggestion: 'Visual de transição. Seta ou divisor visual.',
    }),
    'dica-extra': () => ({
      title: 'Dica bônus',
      subtitle: 'Isso faz toda diferença',
      shortText: `Use ${form.productName} combinado com consistência para maximizar seus resultados.`,
      cta: '',
      visualSuggestion: 'Ícone de estrela ou destaque especial.',
    }),
  };

  const numberedGenerators: Record<string, (n: string) => SlideContent> = {
    'beneficio': (n) => ({
      title: n === '1' ? form.mainBenefit : `Benefício #${n}`,
      subtitle: form.productName,
      shortText: `Com ${form.productName.toLowerCase()}, você alcança resultados que antes pareciam impossíveis.`,
      cta: '',
      visualSuggestion: `Ícone ou visual representando o benefício #${n}.`,
    }),
    'dica': (n) => ({
      title: `#${n} — Dica importante`,
      subtitle: `Sobre ${form.productName.toLowerCase()}`,
      shortText: contentHint,
      cta: '',
      visualSuggestion: `Número "${n}" em destaque com ícone temático.`,
    }),
    'passo': (n) => ({
      title: `Passo ${n}`,
      subtitle: titleHint,
      shortText: contentHint,
      cta: '',
      visualSuggestion: `Número "${n}" grande com instrução visual do passo.`,
    }),
    'antes': (n) => ({
      title: n === '1' ? 'Antes: A realidade' : 'Antes: As frustrações',
      subtitle: `Sem ${form.productName.toLowerCase()}`,
      shortText: n === '1'
        ? `Quem ${form.mainPain.toLowerCase()} sabe como é difícil.`
        : 'Cada dia parece igual, sem progresso real.',
      cta: '',
      visualSuggestion: 'Visual em tons frios/cinza representando a situação anterior.',
    }),
    'depois': (n) => ({
      title: n === '1' ? 'Depois: A transformação' : 'Depois: Os resultados',
      subtitle: `Com ${form.productName}`,
      shortText: n === '1'
        ? `${form.mainBenefit} se torna parte da sua rotina.`
        : 'Resultados concretos que você pode medir.',
      cta: '',
      visualSuggestion: 'Visual vibrante com cores quentes representando a nova realidade.',
    }),
    'objecao': (n) => ({
      title: `"Mas ${n === '1' ? 'é muito caro' : n === '2' ? 'não tenho tempo' : 'será que funciona'}?"`,
      subtitle: `Objeção #${n}`,
      shortText: 'Essa é uma das dúvidas mais comuns. Veja a verdade...',
      cta: '',
      visualSuggestion: 'Ícone de dúvida ou interrogação em destaque.',
    }),
    'resposta': (n) => ({
      title: 'A verdade é que...',
      subtitle: `Resposta à objeção #${n}`,
      shortText: `${form.productName} foi projetado para resolver exatamente isso. ${form.mainBenefit}.`,
      cta: '',
      visualSuggestion: 'Ícone de check ou confirmação. Visual positivo.',
    }),
    'diferencial': (n) => ({
      title: `Diferencial #${n}`,
      subtitle: form.productName,
      shortText: n === '1'
        ? `${form.mainBenefit} — algo que ninguém mais oferece assim.`
        : 'Uma experiência pensada nos mínimos detalhes.',
      cta: '',
      visualSuggestion: `Ícone de destaque #${n} com visual premium.`,
    }),
  };

  if (isLast || role === 'cta') {
    return {
      title: form.finalCTA || 'Comece agora',
      subtitle: form.productName,
      shortText: `${form.mainBenefit}. Não perca mais tempo.`,
      cta: form.finalCTA || 'Saiba mais',
      visualSuggestion: 'CTA em destaque com cor de acento. Logo da marca. Visual limpo.',
    };
  }

  if (generators[role]) {
    return generators[role]();
  }

  const match = role.match(/^(.+)-(\d+)$/);
  if (match) {
    const [, base, num] = match;
    if (numberedGenerators[base]) {
      return numberedGenerators[base](num);
    }
  }

  return {
    title: titleHint,
    subtitle: form.productName,
    shortText: contentHint,
    cta: isLast ? form.finalCTA : '',
    visualSuggestion: 'Visual temático alinhado ao conteúdo do slide.',
  };
}

export function generateCaption(form: CarouselFormData): string {
  const lines = [
    `${form.mainPain}? Isso muda agora.`,
    '',
    form.productDescription.substring(0, 200),
    '',
    `${form.mainBenefit}.`,
    '',
    `${form.finalCTA}`,
    '',
    `#${form.productName.replace(/\s+/g, '')}`,
  ];
  return lines.join('\n');
}

export function generateHashtags(form: CarouselFormData): string[] {
  const base = [
    form.productName.replace(/\s+/g, ''),
    'carrossel',
    'marketing',
    'empreendedorismo',
  ];

  const templateTags: Record<CarouselTemplate, string[]> = {
    'venda-direta': ['vendas', 'oferta', 'promocao'],
    'educativo': ['dicas', 'aprenda', 'conhecimento'],
    'antes-depois': ['transformacao', 'resultado', 'antesedepois'],
    'quebra-objecoes': ['mitos', 'verdade', 'faq'],
    'tutorial': ['tutorial', 'comofazer', 'passoapasso'],
    'lancamento': ['novidade', 'lancamento', 'novo'],
  };

  return [...base, ...(templateTags[form.template] || [])].map(t => `#${t}`);
}
