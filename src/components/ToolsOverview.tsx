
import React from 'react';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  Fuel, 
  CheckCircle, 
  ClipboardCheck,
  Package,
  BarChart,
  Shield,
  Linkedin,
  FileText,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ToolCard from './ToolCard';

interface ToolsOverviewProps {
  onToolSelect: (toolId: string) => void;
}

const ToolsOverview: React.FC<ToolsOverviewProps> = ({ onToolSelect }) => {
  const toolCategories = {
    calculadoras: {
      title: 'Calculadoras',
      description: 'Ferramentas para cálculos essenciais do transporte',
      tools: [
        {
          id: 'calculadora-frete',
          title: 'Calculadora de Frete',
          description: 'Calcule o valor ideal do frete considerando distância, combustível e custos operacionais',
          icon: <Calculator size={32} />,
          gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
        },
        {
          id: 'simulador-lucro',
          title: 'Simulador de Lucro',
          description: 'Simule diferentes cenários de frete e analise a margem de lucro de cada viagem',
          icon: <TrendingUp size={32} />,
          gradient: 'bg-gradient-to-br from-green-500 to-green-600'
        },
        {
          id: 'calculadora-risco',
          title: 'Análise de Risco',
          description: 'Avalie os riscos da rota e calcule o seguro adequado para sua carga',
          icon: <AlertTriangle size={32} />,
          gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600'
        },
        {
          id: 'calculadora-combustivel',
          title: 'Calculadora de Combustível',
          description: 'Calcule o consumo de combustível e custos por quilômetro rodado',
          icon: <Fuel size={32} />,
          gradient: 'bg-gradient-to-br from-red-500 to-red-600'
        }
      ]
    },
    ferramentas: {
      title: 'Ferramentas Operacionais',
      description: 'Recursos para otimizar suas operações diárias',
      tools: [
        {
          id: 'checklist-viagem',
          title: 'Checklist de Viagem',
          description: 'Lista completa de verificações antes, durante e após a viagem',
          icon: <ClipboardCheck size={32} />,
          gradient: 'bg-gradient-to-br from-purple-500 to-purple-600'
        },
        {
          id: 'dimensionamento-veiculo',
          title: 'Dimensionamento de Veículo',
          description: 'Escolha o veículo ideal baseado no tipo e volume da carga',
          icon: <Package size={32} />,
          gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-600'
        }
      ]
    },
    diagnosticos: {
      title: 'Diagnósticos Inteligentes',
      description: 'Análises avançadas para otimizar seu negócio',
      tools: [
        {
          id: 'diagnostico-logistica',
          title: 'Diagnóstico Logístico',
          description: 'Análise completa da sua operação logística com recomendações de melhoria',
          icon: <BarChart size={32} />,
          gradient: 'bg-gradient-to-br from-cyan-500 to-cyan-600'
        },
        {
          id: 'diagnostico-risco',
          title: 'Diagnóstico de Risco',
          description: 'Avaliação detalhada dos riscos do seu negócio de transporte',
          icon: <Shield size={32} />,
          gradient: 'bg-gradient-to-br from-teal-500 to-teal-600'
        }
      ]
    },
    geradores: {
      title: 'Geradores de Conteúdo',
      description: 'Crie conteúdo profissional automaticamente',
      tools: [
        {
          id: 'gerador-posts',
          title: 'Gerador de Posts',
          description: 'Crie posts profissionais para LinkedIn sobre logística e transporte',
          icon: <Linkedin size={32} />,
          gradient: 'bg-gradient-to-br from-blue-700 to-blue-800'
        },
        {
          id: 'gerador-contratos',
          title: 'Gerador de Contratos',
          description: 'Gere contratos de transporte personalizados e profissionais',
          icon: <FileText size={32} />,
          gradient: 'bg-gradient-to-br from-gray-600 to-gray-700'
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-blue-50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container-responsive py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Ferramentas <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">Completas</span> para Transporte
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Suite completa de calculadoras, ferramentas e diagnósticos para profissionais de logística e transportadores autônomos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle size={16} className="text-green-500" />
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle size={16} className="text-green-500" />
                <span>Sem Cadastro</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle size={16} className="text-green-500" />
                <span>Resultados Instantâneos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Sections */}
      <div className="container-responsive py-8 sm:py-12">
        {Object.entries(toolCategories).map(([categoryKey, category]) => (
          <div key={categoryKey} className="mb-12 sm:mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {category.title}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {category.description}
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  id={tool.id}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  category={category.title}
                  gradient={tool.gradient}
                  onSelect={onToolSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-blue-600 text-white py-12 sm:py-16">
        <div className="container-responsive text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Precisa de Consultoria Personalizada?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Nossa equipe de especialistas pode ajudar com soluções customizadas para seu negócio
          </p>
          <Button 
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3"
            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
          >
            Falar com Especialista
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolsOverview;
