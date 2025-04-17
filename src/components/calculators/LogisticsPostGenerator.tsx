
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Linkedin, Copy, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  isActive: boolean;
}

const postTopics = [
  "Tendências em Logística",
  "Tecnologia no Transporte",
  "Gestão de Frotas",
  "Otimização de Rotas",
  "Sustentabilidade",
  "Inovação em Logística",
  "Gerenciamento de Risco",
  "Eficiência Operacional"
];

const LogisticsPostGenerator = ({ isActive }: Props) => {
  const [topic, setTopic] = useState(postTopics[0]);
  const [tone, setTone] = useState("profissional");
  const [keywords, setKeywords] = useState("");
  const [generatedPost, setGeneratedPost] = useState("");
  const { toast } = useToast();

  const generatePost = () => {
    // In a real application, this would connect to an AI service
    const posts = {
      "Tendências em Logística": `🚛 Inovação em movimento: as tendências que estão transformando a logística em 2025!

📦 A logística está evoluindo rapidamente, e quem não se adaptar ficará para trás. Aqui estão 3 tendências que observo:

1. Automação inteligente
2. Sustentabilidade como prioridade
3. Dados em tempo real

Como você vê o futuro da logística? Compartilhe sua visão! 🔄

#Logistica #Inovacao #Transportes #Supply #LogisticaBrasil`,
      "Tecnologia no Transporte": `💡 A revolução digital chegou ao transporte!

🔍 Veja como a tecnologia está mudando o jogo:
- Rastreamento em tempo real
- IA para otimização de rotas
- Integração total de sistemas

O futuro é digital. Você está preparado? 🚀

#TecnologiaLogistica #Inovacao #TransporteInteligente`
    };

    setGeneratedPost(posts[topic] || "Gerando post...");
    toast({
      description: "Post gerado com sucesso!",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost);
    toast({
      description: "Post copiado para a área de transferência!",
    });
  };

  if (!isActive) return null;

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Linkedin className="h-6 w-6 text-[#0A66C2]" />
          Gerador de Posts para LinkedIn
        </h2>
        <p className="text-gray-600">
          Crie posts profissionais para LinkedIn focados em logística e transportes
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tópico
          </label>
          <select 
            className="w-full rounded-lg border border-gray-200 p-2.5"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            {postTopics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tom da Mensagem
          </label>
          <select
            className="w-full rounded-lg border border-gray-200 p-2.5"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="profissional">Profissional</option>
            <option value="casual">Casual</option>
            <option value="educativo">Educativo</option>
            <option value="inspirador">Inspirador</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Palavras-chave (opcional)
          </label>
          <Input
            placeholder="Ex: logística, inovação, tecnologia"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <Button
          className="w-full bg-[#0A66C2] hover:bg-[#084c8f]"
          onClick={generatePost}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Gerar Post
        </Button>

        {generatedPost && (
          <div className="mt-6 space-y-4">
            <div className="relative">
              <Textarea
                value={generatedPost}
                readOnly
                className="min-h-[200px] p-4 text-gray-800"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LogisticsPostGenerator;
