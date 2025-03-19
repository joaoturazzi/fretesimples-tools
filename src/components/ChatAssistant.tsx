
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou o assistente do FreteSimples. Como posso ajudar você com transporte e logística hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll to the bottom of the chat on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };
  
  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Create API request to OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY || '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'}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em logística e transporte. Responda dúvidas sobre fretes, custos, cálculos e otimização de rotas de forma objetiva e prática.'
            },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: input }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      if (!response.ok) {
        throw new Error('Erro na API');
      }
      
      const data = await response.json();
      const assistantMessage = { 
        role: 'assistant', 
        content: data.choices[0].message.content 
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Erro ao comunicar com a API:', error);
      
      // Add error message
      const errorMessage = { 
        role: 'assistant', 
        content: 'Desculpe, tive um problema ao processar sua pergunta. Por favor, tente novamente mais tarde.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className={`fixed z-50 flex items-center gap-2 ${
          isOpen 
            ? 'bottom-[420px] sm:bottom-[500px] right-6' 
            : 'bottom-6 right-6'
        } bg-frete-500 text-white p-3 rounded-full shadow-lg 
        transition-all duration-300 transform hover:scale-105 active:scale-95`}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div 
          className={`fixed z-40 bottom-6 right-6 w-[calc(100%-3rem)] sm:w-[400px] 
          ${isMinimized ? 'h-14' : 'h-[400px] sm:h-[480px]'}
          bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden
          transition-all duration-300 ease-out transform`}
        >
          {/* Chat header */}
          <div 
            className="bg-frete-500 text-white p-3 flex justify-between items-center cursor-pointer"
            onClick={toggleMinimize}
          >
            <div className="flex items-center">
              <Bot size={20} className="mr-2" />
              <h3 className="font-medium">Assistente do FreteSimples</h3>
            </div>
            <button className="focus:outline-none" onClick={toggleMinimize}>
              {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {/* Chat body */}
          {!isMinimized && (
            <>
              <div className="p-4 h-[calc(100%-120px)] overflow-y-auto">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`chat-bubble ${
                      message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="chat-bubble chat-bubble-ai flex items-center">
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Digitando...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat input */}
              <form 
                onSubmit={handleSubmit}
                className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-3 bg-white"
              >
                <div className="flex">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Digite sua pergunta sobre transporte..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-frete-400 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="bg-frete-500 text-white px-4 py-2 rounded-r-lg hover:bg-frete-600 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                    disabled={!input.trim() || isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
