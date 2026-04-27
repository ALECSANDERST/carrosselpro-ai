import { create } from 'zustand';
import { CarouselProject, CarouselFormData, Slide } from '@/types';
import { generateSlides, generateCaption, generateHashtags } from '@/lib/slide-generator';
import { v4 as uuidv4 } from 'uuid';

interface ProjectsState {
  projects: CarouselProject[];
  currentProject: CarouselProject | null;
  isGenerating: boolean;
  loadProjects: () => void;
  createProject: (formData: CarouselFormData) => CarouselProject;
  updateProject: (id: string, updates: Partial<CarouselProject>) => void;
  updateSlide: (projectId: string, slideId: string, updates: Partial<Slide>) => void;
  duplicateProject: (id: string) => CarouselProject | null;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string) => void;
  reorderSlides: (projectId: string, slides: Slide[]) => void;
  addSlide: (projectId: string) => void;
  removeSlide: (projectId: string, slideId: string) => void;
}

function saveToStorage(projects: CarouselProject[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('carrosselpro_projects', JSON.stringify(projects));
  }
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  currentProject: null,
  isGenerating: false,

  loadProjects: () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('carrosselpro_projects');
    if (stored) {
      try {
        const projects = JSON.parse(stored);
        set({ projects });
      } catch {
        set({ projects: [] });
      }
    }
  },

  createProject: (formData: CarouselFormData) => {
    const slides = generateSlides(formData);
    const caption = generateCaption(formData);
    const hashtags = generateHashtags(formData);

    const project: CarouselProject = {
      id: uuidv4(),
      userId: '',
      name: formData.productName,
      productName: formData.productName,
      productDescription: formData.productDescription,
      targetAudience: formData.targetAudience,
      mainPain: formData.mainPain,
      mainBenefit: formData.mainBenefit,
      objective: formData.objective,
      toneOfVoice: formData.toneOfVoice,
      slideCount: formData.slideCount,
      finalCTA: formData.finalCTA,
      logoUrl: formData.logoFile ? URL.createObjectURL(formData.logoFile) : undefined,
      brandColors: formData.brandColors,
      template: formData.template,
      slides,
      caption,
      hashtags,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newProjects = [project, ...get().projects];
    set({ projects: newProjects, currentProject: project });
    saveToStorage(newProjects);
    return project;
  },

  updateProject: (id, updates) => {
    const projects = get().projects.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    );
    const currentProject = get().currentProject?.id === id
      ? { ...get().currentProject!, ...updates, updatedAt: new Date() }
      : get().currentProject;
    set({ projects, currentProject });
    saveToStorage(projects);
  },

  updateSlide: (projectId, slideId, updates) => {
    const projects = get().projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        slides: p.slides.map(s => s.id === slideId ? { ...s, ...updates } : s),
        updatedAt: new Date(),
      };
    });
    const current = get().currentProject;
    const currentProject = current?.id === projectId
      ? {
          ...current,
          slides: current.slides.map(s => s.id === slideId ? { ...s, ...updates } : s),
          updatedAt: new Date(),
        }
      : current;
    set({ projects, currentProject });
    saveToStorage(projects);
  },

  duplicateProject: (id) => {
    const original = get().projects.find(p => p.id === id);
    if (!original) return null;
    const duplicate: CarouselProject = {
      ...original,
      id: uuidv4(),
      name: `${original.name} (cópia)`,
      slides: original.slides.map(s => ({ ...s, id: uuidv4() })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newProjects = [duplicate, ...get().projects];
    set({ projects: newProjects });
    saveToStorage(newProjects);
    return duplicate;
  },

  deleteProject: (id) => {
    const projects = get().projects.filter(p => p.id !== id);
    const currentProject = get().currentProject?.id === id ? null : get().currentProject;
    set({ projects, currentProject });
    saveToStorage(projects);
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
