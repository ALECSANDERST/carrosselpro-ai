'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useProjectsStore } from '@/store/projects-store';
import { CarouselFormData, CarouselTemplate, BrandColors } from '@/types';
import { templates } from '@/data/templates';
import Navbar from '@/components/layout/Navbar';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Select from '@/components/ui/Select';
import ColorPicker from '@/components/ui/ColorPicker';
import Button from '@/components/ui/Button';

const toneOptions = [
  { value: 'profissional', label: 'Profissional' },
  { value: 'casual', label: 'Casual e amigável' },
  { value: 'inspirador', label: 'Inspirador' },
  { value: 'urgente', label: 'Urgente' },
  { value: 'educativo', label: 'Educativo' },
  { value: 'divertido', label: 'Divertido' },
  { value: 'sofisticado', label: 'Sofisticado' },
];

const defaultColors: BrandColors = {
  primary: '#4F46E5',
  secondary: '#7C3AED',
  accent: '#EC4899',
  background: '#FFFFFF',
  text: '#1F2937',
};

export default function CriarPage() {
  const { isAuthenticated } = useAuthStore();
  const { createProject } = useProjectsStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const [form, setForm] = useState<CarouselFormData>({
    productName: '',
    productDescription: '',
    targetAudience: '',
    mainPain: '',
    mainBenefit: '',
    objective: '',
    toneOfVoice: 'profissional',
    slideCount: 8,
    finalCTA: '',
    logoFile: null,
    brandColors: defaultColors,
    template: 'venda-direta',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('carrosselpro_user') : null;
      if (!stored) {
        router.push('/auth');
        return;
      }
      useAuthStore.setState({ user: JSON.parse(stored), isAuthenticated: true });
    }
  }, [isAuthenticated, router]);

  const updateForm = (updates: Partial<CarouselFormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const updateColor = (key: keyof BrandColors, value: string) => {
    setForm(prev => ({
      ...prev,
      brandColors: { ...prev.brandColors, [key]: value },
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simula processamento (futuramente será chamada de IA)
    await new Promise(resolve => setTimeout(resolve, 1500));
    const project = createProject(form);
    setIsGenerating(false);
    router.push(`/editor/${project.id}`);
  };

  const canProceed = () => {
    if (step === 1) return form.productName && form.productDescription && form.targetAudience;
    if (step === 2) return form.mainPain && form.mainBenefit && form.finalCTA;
    if (step === 3) return true;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1 cursor-pointer">
            ← Voltar ao dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Criar Novo Carrossel</h1>
          <p className="text-sm text-gray-500 mt-1">Preencha as informações e gere automaticamente</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  s === step
                    ? 'bg-indigo-600 text-white'
                    : s < step
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              {s < 4 && <div className={`w-12 h-0.5 ${s < step ? 'bg-indigo-300' : 'bg-gray-200'}`} />}
            </div>
          ))}
          <div className="ml-4 text-sm text-gray-500">
            {step === 1 && 'Produto'}
            {step === 2 && 'Estratégia'}
            {step === 3 && 'Modelo'}
            {step === 4 && 'Visual'}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          {/* Step 1: Produto */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Sobre o produto</h2>
              <Input
                label="Nome do produto / serviço"
                placeholder="Ex: Curso de Marketing Digital"
                value={form.productName}
                onChange={e => updateForm({ productName: e.target.value })}
              />
              <TextArea
                label="Descrição do produto"
                placeholder="Descreva brevemente o que é e o que faz..."
                value={form.productDescription}
                onChange={e => updateForm({ productDescription: e.target.value })}
              />
              <Input
                label="Público-alvo"
                placeholder="Ex: Empreendedores iniciantes, 25-40 anos"
                value={form.targetAudience}
                onChange={e => updateForm({ targetAudience: e.target.value })}
              />
              <Input
                label="Objetivo do carrossel"
                placeholder="Ex: Gerar leads, vender, educar..."
                value={form.objective}
                onChange={e => updateForm({ objective: e.target.value })}
              />
            </div>
          )}

          {/* Step 2: Estratégia */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Estratégia do conteúdo</h2>
              <TextArea
                label="Dor principal do público"
                placeholder="Qual o maior problema que seu público enfrenta?"
                value={form.mainPain}
                onChange={e => updateForm({ mainPain: e.target.value })}
              />
              <TextArea
                label="Benefício principal"
                placeholder="Qual a maior transformação que seu produto oferece?"
                value={form.mainBenefit}
                onChange={e => updateForm({ mainBenefit: e.target.value })}
              />
              <Select
                label="Tom de voz"
                options={toneOptions}
                value={form.toneOfVoice}
                onChange={e => updateForm({ toneOfVoice: e.target.value })}
              />
              <Input
                label="CTA final"
                placeholder="Ex: Clique no link da bio, Saiba mais, Compre agora"
                value={form.finalCTA}
                onChange={e => updateForm({ finalCTA: e.target.value })}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Quantidade de slides: {form.slideCount}
                </label>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={form.slideCount}
                  onChange={e => updateForm({ slideCount: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>3</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Modelo */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Escolha o modelo</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => updateForm({ template: t.id as CarouselTemplate })}
                    className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      form.template === t.id
                        ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-200'
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{t.icon}</span>
                      <span className="font-semibold text-gray-900">{t.name}</span>
                    </div>
                    <p className="text-sm text-gray-500">{t.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {t.slideStructure.length} slides na estrutura
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Visual */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Identidade visual</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload do logo
                </label>
                <label className="flex items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer bg-gray-50/50">
                  <div className="text-center">
                    {form.logoFile ? (
                      <p className="text-sm text-indigo-600 font-medium">{form.logoFile.name}</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500">Arraste ou clique para enviar</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG ou SVG</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => updateForm({ logoFile: e.target.files?.[0] || null })}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cores da marca
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <ColorPicker label="Primária" value={form.brandColors.primary} onChange={v => updateColor('primary', v)} />
                  <ColorPicker label="Secundária" value={form.brandColors.secondary} onChange={v => updateColor('secondary', v)} />
                  <ColorPicker label="Destaque" value={form.brandColors.accent} onChange={v => updateColor('accent', v)} />
                  <ColorPicker label="Fundo" value={form.brandColors.background} onChange={v => updateColor('background', v)} />
                  <ColorPicker label="Texto" value={form.brandColors.text} onChange={v => updateColor('text', v)} />
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preview das cores
                </label>
                <div className="flex gap-2 h-12">
                  {Object.values(form.brandColors).map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-lg first:rounded-l-xl last:rounded-r-xl"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
            >
              ← Voltar
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
              >
                Próximo →
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                isLoading={isGenerating}
                size="lg"
              >
                Gerar Carrossel
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
