export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface CarouselProject {
  id: string;
  userId: string;
  name: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  mainPain: string;
  mainBenefit: string;
  objective: string;
  toneOfVoice: string;
  slideCount: number;
  finalCTA: string;
  logoUrl?: string;
  brandColors: BrandColors;
  template: CarouselTemplate;
  slides: Slide[];
  caption?: string;
  hashtags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export type CarouselTemplate =
  | 'venda-direta'
  | 'educativo'
  | 'antes-depois'
  | 'quebra-objecoes'
  | 'tutorial'
  | 'lancamento';

export interface Slide {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  shortText: string;
  cta: string;
  visualSuggestion: string;
  backgroundImageUrl?: string;
  backgroundColor?: string;
  titleColor?: string;
  textColor?: string;
  ctaColor?: string;
  ctaTextColor?: string;
  fontFamily?: string;
}

export interface CarouselFormData {
  productName: string;
  productDescription: string;
  targetAudience: string;
  mainPain: string;
  mainBenefit: string;
  objective: string;
  toneOfVoice: string;
  slideCount: number;
  finalCTA: string;
  logoFile?: File | null;
  brandColors: BrandColors;
  template: CarouselTemplate;
}

export interface TemplateInfo {
  id: CarouselTemplate;
  name: string;
  description: string;
  icon: string;
  slideStructure: SlideStructureHint[];
}

export interface SlideStructureHint {
  role: string;
  titleHint: string;
  contentHint: string;
}
