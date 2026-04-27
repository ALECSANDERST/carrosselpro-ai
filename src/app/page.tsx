'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

const features = [
  {
    title: 'Geração Automática',
    description: 'Preencha as informações do produto e receba slides prontos em segundos.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: '6 Modelos Estratégicos',
    description: 'Venda direta, educativo, tutorial, antes e depois, objeções e lançamento.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    title: 'Editor Visual',
    description: 'Edite textos, cores, fontes e imagens com preview em tempo real.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    title: 'Exportação Completa',
    description: 'Exporte em PNG, ZIP, PDF com legenda e hashtags prontas.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-sm">CP</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            Carrossel<span className="text-indigo-600">Pro</span>
            <span className="text-xs ml-1 text-purple-500 font-medium">AI</span>
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push('/auth')}>
          Entrar
        </Button>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          Plataforma de criação de carrosséis
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Crie carrosséis
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            profissionais em minutos
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Preencha as informações do seu produto e receba slides prontos com estrutura de copywriting,
          design profissional e legenda otimizada.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" onClick={() => router.push('/auth')}>
            Começar agora — é grátis
          </Button>
          <Button variant="ghost" size="lg" onClick={() => router.push('/auth')}>
            Ver como funciona
          </Button>
        </div>

        {/* Preview mockup */}
        <div className="mt-16 relative">
          <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 max-w-3xl mx-auto">
            <div className="flex gap-4 items-start">
              <div className="w-48 bg-gray-50 rounded-xl p-4 hidden sm:block">
                <div className="space-y-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-3 rounded bg-gray-200" style={{width: `${60 + i * 10}%`}} />
                  ))}
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-56 h-56 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex flex-col justify-between p-5">
                  <div className="w-8 h-3 bg-white/30 rounded" />
                  <div>
                    <div className="h-4 bg-white/90 rounded w-3/4 mb-2" />
                    <div className="h-2 bg-white/50 rounded w-1/2 mb-3" />
                    <div className="h-2 bg-white/30 rounded w-full mb-1" />
                    <div className="h-2 bg-white/30 rounded w-4/5" />
                  </div>
                  <div className="w-20 h-6 bg-pink-500 rounded-md" />
                </div>
              </div>
              <div className="w-52 bg-gray-50 rounded-xl p-4 hidden md:block">
                <div className="space-y-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-3 rounded bg-gray-200" style={{width: `${50 + i * 15}%`}} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Tudo que você precisa</h2>
          <p className="text-gray-500">Do briefing à publicação em poucos cliques</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Pronto para criar?</h2>
          <p className="text-indigo-100 mb-8 max-w-md mx-auto">
            Cadastre-se gratuitamente e crie seu primeiro carrossel profissional em menos de 5 minutos.
          </p>
          <Button
            size="lg"
            className="bg-white text-indigo-700 hover:bg-gray-100"
            onClick={() => router.push('/auth')}
          >
            Criar minha conta
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <p className="text-sm text-gray-400">CarrosselPro AI</p>
          <p className="text-sm text-gray-400">Preparado para integrações futuras com IA, pagamentos e planos.</p>
        </div>
      </footer>
    </div>
  );
}
