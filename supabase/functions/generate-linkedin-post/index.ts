
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const hashtagsLogistica = [
  '#Logistica', '#Transportes', '#Supply', '#LogisticaBrasil', '#FreteDigital',
  '#Inovacao', '#TecnologiaLogistica', '#TransporteRodoviario', '#GestaoFrotas',
  '#OtimizacaoRotas', '#Sustentabilidade', '#DigitalTransformation', '#FreteInteligente'
];

const promptTemplates = {
  "Tendências em Logística": {
    system: "Você é um especialista em logística brasileiro que cria posts profissionais para LinkedIn. Foque em tendências atuais e insights valiosos.",
    prompt: "Crie um post sobre tendências em logística para 2025. Use emojis estrategicamente, mencione dados relevantes e termine com uma pergunta engajadora."
  },
  "Tecnologia no Transporte": {
    system: "Você é um especialista em tecnologia logística que escreve para profissionais do setor de transportes.",
    prompt: "Escreva sobre como a tecnologia está transformando o transporte de cargas. Inclua exemplos práticos e benefícios tangíveis."
  },
  "Gestão de Frotas": {
    system: "Você é um consultor em gestão de frotas com experiência prática no mercado brasileiro.",
    prompt: "Crie um post sobre melhores práticas em gestão de frotas. Foque em redução de custos e eficiência operacional."
  },
  "Otimização de Rotas": {
    system: "Você é um especialista em otimização logística com foco em redução de custos operacionais.",
    prompt: "Escreva sobre a importância da otimização de rotas no transporte. Mencione economia de combustível e tempo."
  },
  "Sustentabilidade": {
    system: "Você é um consultor em sustentabilidade logística, especialista em práticas ESG para o setor de transportes.",
    prompt: "Crie um post sobre sustentabilidade na logística. Aborde práticas verdes e responsabilidade ambiental."
  },
  "Inovação em Logística": {
    system: "Você é um thought leader em inovação logística, sempre atualizado com as últimas tendências do setor.",
    prompt: "Escreva sobre inovações disruptivas na logística. Mencione tecnologias emergentes e seu impacto no setor."
  },
  "Gerenciamento de Risco": {
    system: "Você é um especialista em gestão de riscos logísticos com experiência em segurança de cargas.",
    prompt: "Crie um post sobre gerenciamento de riscos no transporte de cargas. Aborde prevenção e melhores práticas."
  },
  "Eficiência Operacional": {
    system: "Você é um consultor em eficiência operacional especializado em transportadoras e embarcadores.",
    prompt: "Escreva sobre como aumentar a eficiência operacional na logística. Foque em processos e resultados práticos."
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, tone, keywords, customPrompt } = await req.json();

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    let systemPrompt = "Você é um especialista em logística e transportes que cria conteúdo profissional para LinkedIn.";
    let userPrompt = customPrompt;

    if (!customPrompt && promptTemplates[topic]) {
      systemPrompt = promptTemplates[topic].system;
      userPrompt = promptTemplates[topic].prompt;
    }

    // Customize prompt based on tone
    const toneInstructions = {
      profissional: "Use tom profissional e formal, adequado para executivos e empresários.",
      casual: "Use tom conversacional e acessível, como se estivesse falando com um colega.",
      educativo: "Foque em ensinar e compartilhar conhecimento de forma didática.",
      inspirador: "Use tom motivacional e inspirador, destacando possibilidades e oportunidades."
    };

    systemPrompt += ` ${toneInstructions[tone] || toneInstructions.profissional}`;

    if (keywords) {
      userPrompt += ` Inclua naturalmente estas palavras-chave: ${keywords}.`;
    }

    userPrompt += ` 

    INSTRUÇÕES IMPORTANTES:
    - Limite a 1300 caracteres (ideal para LinkedIn)
    - Use emojis estrategicamente (máximo 5)
    - Inclua uma pergunta no final para gerar engajamento
    - Estruture com parágrafos curtos e claros
    - Não inclua hashtags no texto principal
    - Foque no mercado brasileiro de logística`;

    console.log('Generating post with OpenAI for topic:', topic);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    // Select relevant hashtags
    const topicHashtags = {
      "Tendências em Logística": ['#Logistica', '#Inovacao', '#Tendencias', '#LogisticaBrasil'],
      "Tecnologia no Transporte": ['#TecnologiaLogistica', '#Inovacao', '#TransporteInteligente'],
      "Gestão de Frotas": ['#GestaoFrotas', '#Eficiencia', '#Transportes'],
      "Otimização de Rotas": ['#OtimizacaoRotas', '#Eficiencia', '#Logistica'],
      "Sustentabilidade": ['#Sustentabilidade', '#LogisticaVerde', '#ESG'],
      "Inovação em Logística": ['#Inovacao', '#TecnologiaLogistica', '#DigitalTransformation'],
      "Gerenciamento de Risco": ['#GestaoRiscos', '#Seguranca', '#Transportes'],
      "Eficiência Operacional": ['#Eficiencia', '#GestaoOperacional', '#Logistica']
    };

    const selectedHashtags = topicHashtags[topic] || ['#Logistica', '#Transportes', '#Inovacao'];
    const additionalHashtags = hashtagsLogistica
      .filter(tag => !selectedHashtags.includes(tag))
      .slice(0, 6 - selectedHashtags.length);

    const allHashtags = [...selectedHashtags, ...additionalHashtags].join(' ');
    
    const finalPost = `${generatedText}\n\n${allHashtags}`;

    console.log('Post generated successfully');

    return new Response(
      JSON.stringify({ 
        generatedPost: finalPost,
        characterCount: generatedText.length,
        hashtags: allHashtags
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-linkedin-post function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
