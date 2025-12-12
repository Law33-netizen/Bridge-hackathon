import React, { useState, useEffect, useRef } from 'react';
import { FileText, File as FileIcon, Sparkles, MessageSquare, Info } from 'lucide-react';
import { BridgeResponse } from '../types';
import SummaryView from './SummaryView';
import ChatAssistant from './ChatAssistant';

interface TranslationViewProps {
  htmlContent: string;
  language: string;
  originalFile: File | null;
  summary: BridgeResponse['summary'];
  // We need the full response context for the chat
  fullResponse?: BridgeResponse; 
}

// Helper to allow the parent to pass fullResponse implicitly by matching props or we update App.tsx?
// Since I can only update files provided, I will assume fullResponse might be passed. 
// However, looking at App.tsx, it passes specific props. I should update App.tsx to pass the full response object to TranslationView.
// But first let's fix this component to accept what it needs.
// Actually, `summary` is part of `BridgeResponse`. I can reconstruct a partial context or better yet, 
// I will update the Props here and then update App.tsx.

const TranslationView: React.FC<TranslationViewProps & { fullResponse: BridgeResponse }> = ({ 
  htmlContent, 
  language, 
  originalFile, 
  summary,
  fullResponse 
}) => {
  const [activeTab, setActiveTab] = useState<'translation' | 'original'>('translation');
  const [sidebarTab, setSidebarTab] = useState<'summary' | 'chat'>('summary');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const translationContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (originalFile) {
      const url = URL.createObjectURL(originalFile);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [originalFile]);

  const handleActionHover = (index: number | null) => {
    if (!translationContainerRef.current) return;
    
    // First, remove active class from all highlights
    const highlights = translationContainerRef.current.querySelectorAll('.action-highlight');
    highlights.forEach(el => el.classList.remove('active'));

    // If an index is provided, highlight the specific element
    if (index !== null) {
      const targetEl = translationContainerRef.current.querySelector(`#action-ref-${index}`);
      if (targetEl) {
        targetEl.classList.add('active');
        
        // Scroll into view if we are on the translation tab
        if (activeTab === 'translation') {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left Column: Document Viewer (Tabs + Content) */}
      <div className="flex-1 h-full flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-800 px-4 py-3 flex justify-between items-center shrink-0">
          <div className="flex space-x-2 bg-gray-700/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('translation')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'translation'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Translated
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'original'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
              }`}
            >
              <FileIcon className="h-4 w-4" />
              Original
            </button>
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 bg-gray-700 px-2 py-1 rounded hidden sm:inline-block">
            {activeTab === 'translation' ? language : originalFile?.name.split('.').pop() || 'FILE'}
          </span>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex flex-col">
          {activeTab === 'translation' ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full">
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg mx-auto max-w-none">
                  <div 
                    ref={translationContainerRef}
                    className="document-content prose prose-sm sm:prose max-w-none text-gray-800 p-6 sm:p-8"
                    dangerouslySetInnerHTML={{ __html: htmlContent }} 
                  />
                </div>
              </div>
              <div className="bg-white border-t border-gray-200 p-3 text-center text-xs text-gray-500 shrink-0 z-10 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
                AI-generated translation. Always verify important details with official sources.
              </div>
            </>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center p-4">
              {fileUrl ? (
                originalFile?.type === 'application/pdf' ? (
                  <iframe 
                    src={fileUrl} 
                    className="w-full h-full rounded shadow-sm border border-gray-200 bg-white" 
                    title="Original Document" 
                  />
                ) : (
                  <div className="w-full h-full overflow-auto flex items-center justify-center">
                    <img 
                      src={fileUrl} 
                      alt="Original Document" 
                      className="max-w-full max-h-full object-contain shadow-sm rounded bg-white" 
                    />
                  </div>
                )
              ) : (
                  <div className="text-gray-400">Loading document...</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Sidebar (Tabs + Content) */}
      <div className="w-96 shrink-0 h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSidebarTab('summary')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              sidebarTab === 'summary' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Info className="h-4 w-4" />
            Summary
          </button>
          <button
            onClick={() => setSidebarTab('chat')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              sidebarTab === 'chat' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Ask AI
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-hidden relative">
           {sidebarTab === 'summary' ? (
             <SummaryView 
               summary={summary} 
               onActionHover={handleActionHover}
             />
           ) : (
             <ChatAssistant 
               context={fullResponse}
               initialLanguage={language}
             />
           )}
        </div>
      </div>
    </div>
  );
};

export default TranslationView;
