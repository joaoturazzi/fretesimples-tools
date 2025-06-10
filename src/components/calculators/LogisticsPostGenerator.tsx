import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Linkedin, Copy, MessageSquare, Sparkles, RefreshCw, Eye, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedPost, setGeneratedPost] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [hashtags, setHashtags] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const generatePost = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-linkedin-post', {
        body: {
          topic,
          tone,
          keywords,
          customPrompt: customPrompt.trim() || undefined
        }
      });

      if (error) throw error;

      setGeneratedPost(data.generatedPost);
      setCharacterCount(data.characterCount);
      setHashtags(data.hashtags);
      setShowPreview(true);
      
      toast({
        description: "✨ Post gerado com sucesso!",
      });
    } catch (error) {
      console.error('Error generating post:', error);
      toast({
        title: "Erro ao gerar post",
        description: "Verifique sua conexão e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost);
    toast({
      description: "📋 Post copiado para a área de transferência!",
    });
  };

  const shareToLinkedIn = () => {
    const encodedText = encodeURIComponent(generatedPost);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=https://fretesimples.com&text=${encodedText}`;
    window.open(linkedinUrl, '_blank');
  };

  const resetForm = () => {
    setTopic(postTopics[0]);
    setTone("profissional");
    setKeywords("");
    setCustomPrompt("");
    setGeneratedPost("");
    setCharacterCount(0);
    setHashtags("");
    setShowPreview(false);
  };

  if (!isActive) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A66C2] via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Linkedin size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Gerador de Posts para LinkedIn</h2>
            <p className="text-blue-100 text-lg">
              IA especializada em conteúdo de logística e transportes
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <Card className="p-6 space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-purple-500" size={24} />
            Configuração do Post
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tópico Principal
              </label>
              <select 
                className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {postTopics.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tom da Mensagem
              </label>
              <select
                className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="profissional">Profissional - Para executivos</option>
                <option value="casual">Casual - Conversacional</option>
                <option value="educativo">Educativo - Didático</option>
                <option value="inspirador">Inspirador - Motivacional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavras-chave (opcional)
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: tecnologia, inovação, eficiência"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt Personalizado (opcional)
              </label>
              <Textarea
                placeholder="Descreva exatamente o que quer no post..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-[#0A66C2] hover:bg-[#084c8f] text-white"
                onClick={generatePost}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isGenerating ? 'Gerando...' : 'Gerar Post'}
              </Button>
              
              <Button
                variant="outline"
                onClick={resetForm}
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview Panel */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="text-green-500" size={24} />
              Preview do LinkedIn
            </h3>
            {generatedPost && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </Button>
                <Button
                  size="sm"
                  onClick={shareToLinkedIn}
                  className="bg-[#0A66C2] hover:bg-[#084c8f]"
                >
                  <Linkedin className="h-4 w-4 mr-1" />
                  Compartilhar
                </Button>
              </div>
            )}
          </div>

          {generatedPost ? (
            <div className="space-y-4">
              {/* LinkedIn-style preview */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0A66C2] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">👤</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Seu Nome</p>
                    <p className="text-gray-500 text-sm">Especialista em Logística • 1h</p>
                  </div>
                </div>
                
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {generatedPost}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-gray-500 text-sm">
                  <div className="flex gap-4">
                    <span>👍 0 curtidas</span>
                    <span>💬 0 comentários</span>
                  </div>
                  <span>{characterCount} caracteres</span>
                </div>
              </div>

              {/* Character count indicator */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Contagem de caracteres</span>
                  <span className={`text-sm font-bold ${
                    characterCount <= 1300 ? 'text-green-600' : 
                    characterCount <= 1500 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {characterCount} / 1300 (ideal)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      characterCount <= 1300 ? 'bg-green-500' : 
                      characterCount <= 1500 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((characterCount / 1500) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {hashtags && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="text-blue-500" size={16} />
                    <span className="text-sm font-medium text-blue-700">Hashtags Incluídas</span>
                  </div>
                  <p className="text-blue-600 text-sm">{hashtags}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Nenhum post gerado ainda</p>
              <p className="text-sm">Configure os parâmetros e clique em "Gerar Post"</p>
            </div>
          )}
        </Card>
      </div>

      {/* Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
            <Sparkles className="text-white" size={24} />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">IA Especializada</h4>
          <p className="text-gray-600 text-sm">
            Algoritmos treinados especificamente para conteúdo de logística e transportes
          </p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
            <Hash className="text-white" size={24} />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Hashtags Inteligentes</h4>
          <p className="text-gray-600 text-sm">
            Seleção automática das melhores hashtags para maximizar o alcance
          </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <Eye className="text-white" size={24} />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Preview em Tempo Real</h4>
          <p className="text-gray-600 text-sm">
            Visualize exatamente como seu post aparecerá no LinkedIn
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogisticsPostGenerator;
