import { create } from 'zustand';
import { CarouselProject, CarouselFormData, Slide } from '@/types';
import { generateSlides, generateCaption, generateHashtags } from '@/lib/slide-generator';
import { createClient } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface ProjectsState {
  projects: CarouselProject[];
  currentProject: CarouselProject | null;
  isGenerating: boolean;
  isLoading: boolean;
  loadProjects: () => Promise<void>;
  createProject: (formData: CarouselFormData) => Promise<CarouselProject>;
  updateProject: (id: string, updates: Partial<CarouselProject>) => Promise<void>;
  updateSlide: (projectId: string, slideId: string, updates: Partial<Slide>) => void;
  duplicateProject: (id: string) => Promise<CarouselProject | null>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (id: string) => void;
  reorderSlides: (projectId: string, slides: Slide[]) => void;
  addSlide: (projectId: string) => void;
  removeSlide: (projectId: string, slideId: string) => void;
}

function mapDbToProject(row: Record<string, unknown>): CarouselProject {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    productName: row.product_name as string,
    productDescription: row.product_description as string,
    targetAudience: row.target_audience as string,
    mainPain: row.main_pain as string,
    mainBenefit: row.main_benefit as string,
    objective: (row.objective as string) || '',
    toneOfVoice: (row.tone_of_voice as string) || 'profissional',
    slideCount: row.slide_count as number,
    finalCTA: (row.final_cta as string) || '',
    logoUrl: row.logo_url as string | undefined,
    brandColors: row.brand_colors as CarouselProject['brandColors'],
    template: row.template as CarouselProject['template'],
    slides: row.slides as Slide[],
    caption: row.caption as string | undefined,
    hashtags: row.hashtags as string[] | undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  currentProject: null,
  isGenerating: false,
  isLoading: false,

  loadProjects: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data, error } = await supabase
      .from('carousel_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const projects = data.map(mapDbToProject);
      set({ projects, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  createProject: async (formData: CarouselFormData) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const slides = generateSlides(formData);
    const caption = generateCaption(formData);
    const hashtags = generateHashtags(formData);

    const projectData = {
      user_id: user.id,
      name: formData.productName,
      product_name: formData.productName,
      product_description: formData.productDescription,
      target_audience: formData.targetAudience,
      main_pain: formData.mainPain,
      main_benefit: formData.mainBenefit,
      objective: formData.objective,
      tone_of_voice: formData.toneOfVoice,
      slide_count: formData.slideCount,
      final_cta: formData.finalCTA,
      brand_colors: formData.brandColors,
      template: formData.template,
      slides,
      caption,
      hashtags,
    };

    const { data, error } = await supabase
      .from('carousel_projects')
      .insert(projectData)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const project = mapDbToProject(data);
    set({ projects: [project, ...get().projects], currentProject: project });
    return project;
  },

  updateProject: async (id, updates) => {
    const supabase = createClient();

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.brandColors !== undefined) dbUpdates.brand_colors = updates.brandColors;
    if (updates.slides !== undefined) dbUpdates.slides = updates.slides;
    if (updates.caption !== undefined) dbUpdates.caption = updates.caption;
    if (updates.hashtags !== undefined) dbUpdates.hashtags = updates.hashtags;
    if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;

    await supabase.from('carousel_projects').update(dbUpdates).eq('id', id);

    const projects = get().projects.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    );
    const currentProject = get().currentProject?.id === id
      ? { ...get().currentProject!, ...updates, updatedAt: new Date() }
      : get().currentProject;
    set({ projects, currentProject });
  },

  updateSlide: (projectId, slideId, updates) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;

    const newSlides = project.slides.map(s =>
      s.id === slideId ? { ...s, ...updates } : s
    );

    get().updateProject(projectId, { slides: newSlides });
  },

  duplicateProject: async (id) => {
    const original = get().projects.find(p => p.id === id);
    if (!original) return null;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const projectData = {
      user_id: user.id,
      name: `${original.name} (cópia)`,
      product_name: original.productName,
      product_description: original.productDescription,
      target_audience: original.targetAudience,
      main_pain: original.mainPain,
      main_benefit: original.mainBenefit,
      objective: original.objective,
      tone_of_voice: original.toneOfVoice,
      slide_count: original.slideCount,
      final_cta: original.finalCTA,
      brand_colors: original.brandColors,
      template: original.template,
      slides: original.slides.map(s => ({ ...s, id: uuidv4() })),
      caption: original.caption,
      hashtags: original.hashtags,
    };

    const { data, error } = await supabase
      .from('carousel_projects')
      .insert(projectData)
      .select()
      .single();

    if (error) return null;

    const duplicate = mapDbToProject(data);
    set({ projects: [duplicate, ...get().projects] });
    return duplicate;
  },

  deleteProject: async (id) => {
    const supabase = createClient();
    await supabase.from('carousel_projects').delete().eq('id', id);

    const projects = get().projects.filter(p => p.id !== id);
    const currentProject = get().currentProject?.id === id ? null : get().currentProject;
    set({ projects, currentProject });
  },

  setCurrentProject: (id) => {
    const project = get().projects.find(p => p.id === id) || null;
    set({ currentProject: project });
  },

  reorderSlides: (projectId, slides) => {
    const reordered = slides.map((s, i) => ({ ...s, order: i }));
    get().updateProject(projectId, { slides: reordered });
  },

  addSlide: (projectId) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;
    const newSlide: Slide = {
      id: uuidv4(),
      order: project.slides.length,
      title: 'Novo Slide',
      subtitle: '',
      shortText: 'Edite este slide',
      cta: '',
      visualSuggestion: '',
      titleColor: project.brandColors.primary,
      textColor: project.brandColors.text,
      ctaColor: project.brandColors.accent,
      ctaTextColor: '#FFFFFF',
      fontFamily: 'Inter',
    };
    get().updateProject(projectId, { slides: [...project.slides, newSlide] });
  },

  removeSlide: (projectId, slideId) => {
    const project = get().projects.find(p => p.id === projectId);
    if (!project) return;
    const slides = project.slides
      .filter(s => s.id !== slideId)
      .map((s, i) => ({ ...s, order: i }));
    get().updateProject(projectId, { slides });
  },
}));
