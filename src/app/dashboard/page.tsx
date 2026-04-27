'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useProjectsStore } from '@/store/projects-store';
import Navbar from '@/components/layout/Navbar';
import Button from '@/components/ui/Button';

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const { isAuthenticated } = useAuthStore();
  const { projects, loadProjects, duplicateProject, deleteProject } = useProjectsStore();
  const router = useRouter();

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

  const templateLabels: Record<string, string> = {
    'venda-direta': 'Venda Direta',
    'educativo': 'Educativo',
    'antes-depois': 'Antes e Depois',
    'quebra-objecoes': 'Quebra de Objeções',
    'tutorial': 'Tutorial',
    'lancamento': 'Lançamento',
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Carrosséis</h1>
            <p className="text-sm text-gray-500 mt-1">
              {projects.length === 0
                ? 'Crie seu primeiro carrossel para começar'
                : `${projects.length} projeto${projects.length > 1 ? 's' : ''}`
              }
            </p>
          </div>
          <Button onClick={() => router.push('/criar')} size="lg">
            + Criar novo carrossel
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Nenhum carrossel ainda</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Comece criando seu primeiro carrossel. Escolha um modelo, preencha as informações do produto e deixe o sistema gerar os slides automaticamente.
            </p>
            <Button onClick={() => router.push('/criar')}>
              Criar primeiro carrossel
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 group"
              >
                <div
                  className="h-36 p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer"
                  style={{ backgroundColor: project.brandColors.primary }}
                  onClick={() => router.push(`/editor/${project.id}`)}
                >
                  <div className="relative z-10">
                    <span className="text-xs font-medium text-white/70 bg-white/20 px-2 py-1 rounded-md">
                      {templateLabels[project.template] || project.template}
                    </span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-lg leading-tight">{project.name}</h3>
                    <p className="text-white/70 text-xs mt-1">
                      {project.slides.length} slides
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
                </div>

                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-3">
                    Criado em {formatDate(project.createdAt)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/editor/${project.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateProject(project.id)}
                    >
                      Duplicar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir este projeto?')) {
                          deleteProject(project.id);
                        }
                      }}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
