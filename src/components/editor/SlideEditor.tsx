'use client';

import { Slide, BrandColors } from '@/types';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import ColorPicker from '@/components/ui/ColorPicker';

interface SlideEditorProps {
  slide: Slide;
  brandColors: BrandColors;
  onUpdate: (updates: Partial<Slide>) => void;
}

const fontOptions = [
  'Inter',
  'Poppins',
  'Montserrat',
  'Playfair Display',
  'Roboto',
  'Open Sans',
  'Lato',
];

export default function SlideEditor({ slide, onUpdate }: SlideEditorProps) {
  return (
    <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Slide {slide.order + 1}
        </h3>
        <p className="text-xs text-gray-400 mb-4">{slide.visualSuggestion}</p>
      </div>

      <Input
        label="Título"
        value={slide.title}
        onChange={e => onUpdate({ title: e.target.value })}
      />

      <Input
        label="Subtítulo"
        value={slide.subtitle}
        onChange={e => onUpdate({ subtitle: e.target.value })}
      />

      <TextArea
        label="Texto curto"
        value={slide.shortText}
        onChange={e => onUpdate({ shortText: e.target.value })}
      />

      <Input
        label="CTA"
        value={slide.cta}
        onChange={e => onUpdate({ cta: e.target.value })}
        placeholder="Ex: Saiba mais, Compre agora"
      />

      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Cores do slide</h4>
        <div className="space-y-3">
          <ColorPicker
            label="Fundo"
            value={slide.backgroundColor || '#FFFFFF'}
            onChange={v => onUpdate({ backgroundColor: v })}
          />
          <ColorPicker
            label="Título"
            value={slide.titleColor || '#1F2937'}
            onChange={v => onUpdate({ titleColor: v })}
          />
          <ColorPicker
            label="Texto"
            value={slide.textColor || '#4B5563'}
            onChange={v => onUpdate({ textColor: v })}
          />
          <ColorPicker
            label="Botão CTA"
            value={slide.ctaColor || '#EC4899'}
            onChange={v => onUpdate({ ctaColor: v })}
          />
          <ColorPicker
            label="Texto do CTA"
            value={slide.ctaTextColor || '#FFFFFF'}
            onChange={v => onUpdate({ ctaTextColor: v })}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Fonte</h4>
        <div className="grid grid-cols-2 gap-2">
          {fontOptions.map(font => (
            <button
              key={font}
              onClick={() => onUpdate({ fontFamily: font })}
              className={`px-3 py-2 text-xs rounded-lg border transition-all cursor-pointer ${
                (slide.fontFamily || 'Inter') === font
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
              style={{ fontFamily: font }}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Imagem de fundo</h4>
        <label className="flex items-center justify-center w-full h-20 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer bg-gray-50/50">
          <div className="text-center">
            {slide.backgroundImageUrl ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-indigo-600">Imagem selecionada</span>
                <button
                  onClick={e => {
                    e.preventDefault();
                    onUpdate({ backgroundImageUrl: undefined });
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remover
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Clique para adicionar imagem</p>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                onUpdate({ backgroundImageUrl: url });
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}
