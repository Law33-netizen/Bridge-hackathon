import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import FileUpload from './components/FileUpload';
import LanguageSelector from './components/LanguageSelector';
// SummaryView is now used inside TranslationView
import TranslationView from './components/TranslationView';
import LoadingView from './components/LoadingView';
import { processDocument } from './services/geminiService';
import { ProcessedResult, ProcessingStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [file, setFile] = useState<File | null>(null);
  
  // Initialize language from localStorage or default to 'en'
  const [targetLang, setTargetLang] = useState<string>('en');

  // Load from local storage on mount (client-side only)
  useEffect(() => {
    const saved = localStorage.getItem('bridge_default_lang');
    if (saved) {
      setTargetLang(saved);
    }
  }, []);
  
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLanguageChange = (code: string) => {
    setTargetLang(code);
    localStorage.setItem('bridge_default_lang', code);
  };

  const handleProcess = async () => {
    if (!file) return;

    setStatus(ProcessingStatus.PROCESSING);
    setErrorMessage(null);

    try {
      const response = await processDocument(file, targetLang);
      setResult({ fileName: file.name, response });
      setStatus(ProcessingStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setStatus(ProcessingStatus.ERROR);
      setErrorMessage(error.message || "An unexpected error occurred while processing the document.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus(ProcessingStatus.IDLE);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
               <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Bridge</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline-block">AI Paperwork Assistant</span>
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleReset(); }} 
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              New Document
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-8 flex-1 flex flex-col w-full">
        
        {status === ProcessingStatus.PROCESSING ? (
          <LoadingView />
        ) : result ? (
          /* Results Section */
          <div className="animate-in fade-in duration-700 flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analysis Complete</h2>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 uppercase">
                    {result.response.detected_language}
                  </span>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                    {result.response.target_language}
                  </span>
                </p>
              </div>
              <button 
                onClick={handleReset}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Upload Another
              </button>
            </div>

            <div className="flex-1 min-h-0">
              <TranslationView 
                htmlContent={result.response.translation_html} 
                language={result.response.target_language} 
                originalFile={file}
                summary={result.response.summary}
                fullResponse={result.response}
              />
            </div>
          </div>
        ) : (
          /* Input Section */
          <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            <div className="text-center space-y-3 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Translate & Simplify</h2>
              <p className="text-lg text-gray-600">
                Upload any official document to get a clear summary and translation in seconds.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 relative">
              <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-t-2xl"></div>
              
              <div className="p-6 sm:p-8 space-y-8">
                
                {/* Language Selection - Always Visible */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    Choose Target Language
                  </label>
                  <LanguageSelector 
                    selectedLanguage={targetLang}
                    onLanguageChange={handleLanguageChange}
                    disabled={status === ProcessingStatus.PROCESSING}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                    Upload Document
                  </label>
                  <FileUpload 
                    onFileSelect={setFile} 
                    isLoading={status === ProcessingStatus.PROCESSING} 
                  />
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handleProcess}
                    disabled={!file || status === ProcessingStatus.PROCESSING}
                    className={`
                      w-full flex items-center justify-center gap-2 text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-200
                      ${!file || status === ProcessingStatus.PROCESSING 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      }
                    `}
                  >
                    <Sparkles className="h-5 w-5" />
                    Process Document
                  </button>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 text-red-800 p-4 rounded-xl flex items-start gap-3 border border-red-100 text-sm">
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{errorMessage}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer inside main view when no result */}
            <footer className="mt-16 text-center text-gray-400 text-sm pb-8">
              <p>Powered by Google Gemini 2.5 Flash</p>
            </footer>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
