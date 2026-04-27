'use client';

import { CarouselProject } from '@/types';
import ColorPicker from '@/components/ui/ColorPicker';
import Button from '@/components/ui/Button';

interface GeneralSettingsProps {
  project: CarouselProject;
  onUpdateProject: (updates: Partial<CarouselProject>) => void;
  onAddSlide: () => void;
  onExportPng: () => void;
  onExportZip: () => void;
  onExportPdf: () => void;
  onCopyCaption: () => void;
  isExporting: boolean;
}

export default function GeneralSettings({
  project,
  onUpdateProject,
  onAddSlide,
  onExportPng,
  onExportZip,
  onExportPdf,
  onCopyCaption,
  isExporting,
}: GeneralSettingsProps) {
  const updateColor = (key: string, value: string) => {
    onUpdateProject({
      brandColors: { ...project.brandColors, [key]: value },
    });
  };

  return (
    <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Configurações Gerais</h3>
        <p className="text-xs text-gray-400">{project.slides.length} slides</p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Cores da marca</h4>
        <div className="space-y-3">
          <ColorPicker label="Primária" value={project.brandColors.primary} onChange={v => updateColor('primary', v)} />
          <ColorPicker label="Secundária" value={project.brandColors.secondary} onChange={v => updateColor('secondary', v)} />
          <ColorPicker label="Destaque" value={project.brandColors.accent} onChange={v => updateColor('accent', v)} />
          <ColorPicker label="Fundo" value={project.brandColors.background} onChange={v => updateColor('background', v)} />
          <ColorPicker label="Texto" value={project.brandColors.text} onChange={v => updateColor('text', v)} />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Slides</h4>
        <Button variant="outline" size="sm" className="w-full" onClick={onAddSlide}>
          + Adicionar slide
        </Button>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Exportar</h4>
        <div className="space-y-2">
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={onExportPng}
            isLoading={isExporting}
          >
            PNG (slide atual)
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onExportZip}
            isLoading={isExporting}
          >
            ZIP (todos os slides)
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onExportPdf}
            isLoading={isExporting}
          >
            PDF
          </Button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Legenda e Hashtags</h4>
        {project.caption && (
          <div className="bg-gray-50 rounded-xl p-3 mb-3">
            <p className="text-xs text-gray-600 whitespace-pre-line">{project.caption}</p>
          </div>
        )}
        {project.hashtags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.hashtags.map((tag, i) => (
              <span key={i} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full" onClick={onCopyCaption}>
          Copiar legenda + hashtags
        </Button>
      </div>
    </div>
  );
}
