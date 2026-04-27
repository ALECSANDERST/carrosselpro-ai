'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useProjectsStore } from '@/store/projects-store';
import { Slide } from '@/types';
import Navbar from '@/components/layout/Navbar';
import SlidePreview from '@/components/editor/SlidePreview';
import SlideEditor from '@/components/editor/SlideEditor';
import GeneralSettings from '@/components/editor/GeneralSettings';
import { exportSlideAsPng, exportAllSlidesAsZip, exportAsPdf, copyCaption } from '@/lib/export';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    projects,
    currentProject,
    setCurrentProject,
    loadProjects,
    updateProject,
    updateSlide,
    addSlide,
    removeSlide,
  } = useProjectsStore();

  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState('');
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated) {
        await useAuthStore.getState().loadSession();
        if (!useAuthStore.getState().isAuthenticated) {
          router.push('/auth');
          return;
        }
      }
      await loadProjects();
    };
    init();
  }, [isAuthenticated, router, loadProjects]);

  useEffect(() => {
    if (projects.length > 0 && params.id) {
      setCurrentProject(params.id as string);
    }
  }, [projects, params.id, setCurrentProject]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-500">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  const selectedSlide = currentProject.slides[selectedSlideIndex];

  const handleSlideUpdate = (updates: Partial<Slide>) => {
    if (selectedSlide) {
      updateSlide(currentProject.id, selectedSlide.id, updates);
    }
  };

  const handleExportPng = async () => {
    const el = slideRefs.current[selectedSlideIndex];
    if (!el) return;
    setIsExporting(true);
    try {
      await exportSlideAsPng(el, `${currentProject.name}-slide-${selectedSlideIndex + 1}.png`);
      showToast('PNG exportado com sucesso!');
    } catch {
      showToast('Erro ao exportar PNG');
    }
    setIsExporting(false);
  };

  const handleExportZip = async () => {
    const elements = slideRefs.current.filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;
    setIsExporting(true);
    try {
      await exportAllSlidesAsZip(elements, currentProject.name);
      showToast('ZIP exportado com sucesso!');
    } catch {
      showToast('Erro ao exportar ZIP');
    }
    setIsExporting(false);
  };

  const handleExportPdf = async () => {
    const elements = slideRefs.current.filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;
    setIsExporting(true);
    try {
      await exportAsPdf(elements, currentProject.name);
      showToast('PDF exportado com sucesso!');
    } catch {
      showToast('Erro ao exportar PDF');
    }
    setIsExporting(false);
  };

  const handleCopyCaption = () => {
    copyCaption(currentProject);
    showToast('Legenda copiada!');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm shadow-lg animate-in fade-in slide-in-from-right">
          {toast}
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: General Settings */}
        <aside className="w-full lg:w-72 bg-white border-r border-gray-100 p-5 lg:min-h-0">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-xs text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1 cursor-pointer"
          >
            ← Dashboard
          </button>
          <GeneralSettings
            project={currentProject}
            onUpdateProject={(updates) => updateProject(currentProject.id, updates)}
            onAddSlide={() => addSlide(currentProject.id)}
            onExportPng={handleExportPng}
            onExportZip={handleExportZip}
            onExportPdf={handleExportPdf}
            onCopyCaption={handleCopyCaption}
            isExporting={isExporting}
          />
        </aside>

        {/* Center: Preview */}
        <main className="flex-1 flex flex-col items-center justify-start p-6 min-h-0 overflow-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{currentProject.name}</h2>

          {/* Main slide preview */}
          {selectedSlide && (
            <div className="mb-6">
              <SlidePreview
                slide={selectedSlide}
                brandColors={currentProject.brandColors}
                logoUrl={currentProject.logoUrl}
                size="lg"
                previewRef={(el: HTMLDivElement | null) => {
                  slideRefs.current[selectedSlideIndex] = el;
                }}
              />
            </div>
          )}

          {/* Slide thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-4 max-w-full px-4">
            {currentProject.slides.map((slide, index) => (
              <div key={slide.id} className="relative group">
                <SlidePreview
                  slide={slide}
                  brandColors={currentProject.brandColors}
                  logoUrl={currentProject.logoUrl}
                  size="sm"
                  isSelected={index === selectedSlideIndex}
                  onClick={() => setSelectedSlideIndex(index)}
                  previewRef={(el: HTMLDivElement | null) => {
                    slideRefs.current[index] = el;
                  }}
                />
                <span className="absolute -top-2 -left-2 w-5 h-5 bg-gray-900 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {index + 1}
                </span>
                {currentProject.slides.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSlide(currentProject.id, slide.id);
                      if (selectedSlideIndex >= currentProject.slides.length - 1) {
                        setSelectedSlideIndex(Math.max(0, selectedSlideIndex - 1));
                      }
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>

        {/* Right: Slide Editor */}
        <aside className="w-full lg:w-80 bg-white border-l border-gray-100 p-5 lg:min-h-0">
          {selectedSlide ? (
            <SlideEditor
              slide={selectedSlide}
              brandColors={currentProject.brandColors}
              onUpdate={handleSlideUpdate}
            />
          ) : (
            <p className="text-sm text-gray-400">Selecione um slide para editar</p>
          )}
        </aside>
      </div>
    </div>
  );
}
