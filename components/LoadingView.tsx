import React from 'react';
import { Sparkles, FileText, RefreshCw, Languages } from 'lucide-react';

const LoadingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] w-full animate-in fade-in zoom-in-95 duration-500">
      
      {/* Cute Logo Animation Container */}
      <div className="relative mb-10">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Main Icon Stack */}
        <div className="relative z-10 flex items-center justify-center">
           {/* Document Icon - Floats */}
           <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-float">
              <FileText className="w-12 h-12 text-gray-400" />
           </div>

           {/* Arrow/Transition - Spins */}
           <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-blue-50 p-2 rounded-full border border-blue-100 shadow-sm">
              <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
           </div>

           {/* Translated Icon - Floats with delay */}
           <div className="absolute -right-14 -bottom-2 bg-white p-3 rounded-2xl shadow-xl border border-blue-100 animate-float" style={{ animationDelay: '1.5s' }}>
              <Languages className="w-8 h-8 text-blue-600" />
           </div>
           
           {/* Magic Sparkles */}
           <Sparkles className="absolute -top-6 -right-8 w-8 h-8 text-yellow-400 fill-yellow-100 animate-spin-slow" />
           <Sparkles className="absolute -bottom-4 -left-6 w-5 h-5 text-blue-300 animate-pulse delay-75" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Making paperwork easy...</h2>
      
      <div className="flex flex-col items-center gap-2 max-w-sm text-center">
        <p className="text-gray-500 text-lg">
          Bridge is translating and summarizing the important details for you.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mt-10 w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full w-full animate-progress origin-left"></div>
      </div>
      
    </div>
  );
};

export default LoadingView;