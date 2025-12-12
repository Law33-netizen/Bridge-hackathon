import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Globe, Loader2, Sparkles } from 'lucide-react';
import { BridgeResponse, ChatMessage, LanguageOption } from '../types';
import { getChatResponse } from '../services/geminiService';
import { SUPPORTED_LANGUAGES, getQuickPrompts } from '../constants';

interface ChatAssistantProps {
  context: BridgeResponse;
  initialLanguage: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ context, initialLanguage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatLanguage, setChatLanguage] = useState(initialLanguage);
  const [showLangSelector, setShowLangSelector] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    // Reset messages when context changes or component mounts
    setMessages([
      { role: 'model', text: getGreeting(chatLanguage) }
    ]);
  }, [context]);

  const getGreeting = (lang: string) => {
    const prompts = getQuickPrompts(lang);
    // Simple fallback logic for greeting based on prompts
    if (lang === 'es') return "Hola, soy Bridge. ¿Cómo puedo ayudarte con este documento?";
    if (lang === 'zh') return "你好，我是 Bridge。关于这份文件，有什么我可以帮你的吗？";
    if (lang === 'vi') return "Xin chào, tôi là Bridge. Tôi có thể giúp gì cho bạn với tài liệu này?";
    return "Hi, I'm Bridge. How can I help you with this document?";
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getChatResponse(messages, text, context, chatLanguage);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I had trouble connecting. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (code: string) => {
    setChatLanguage(code);
    setShowLangSelector(false);
    // Add a system message indicating language switch or just let the next response follow it
    // But per requirements: "dynamically switch languages". 
    // We can also re-generate the greeting or just let the quick prompts update.
    // The Quick Prompts update automatically via render.
  };

  const quickPrompts = getQuickPrompts(chatLanguage);
  const currentLangOption = SUPPORTED_LANGUAGES.find(l => l.code === chatLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-semibold text-gray-800">Bridge Assistant</span>
        </div>
        
        {/* Chat Language Selector */}
        <div className="relative">
          <button 
            onClick={() => setShowLangSelector(!showLangSelector)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-600 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{chatLanguage}</span>
          </button>
          
          {showLangSelector && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center gap-2
                    ${chatLanguage === lang.code ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700'}
                  `}
                >
                  <span className="text-lg">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
              ${msg.role === 'user' ? 'bg-gray-800' : 'bg-blue-600'}
            `}>
              {msg.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            
            <div className={`
              max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-gray-800 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
              }
            `}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
             </div>
             <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none text-gray-500 text-sm italic">
                Thinking...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-3 bg-white border-t border-gray-100 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-1">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
            placeholder={
              chatLanguage === 'es' ? 'Escribe una pregunta...' : 
              chatLanguage === 'zh' ? '输入问题...' :
              'Ask a question...'
            }
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
          <button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
