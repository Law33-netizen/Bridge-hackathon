import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndSetFile = (file: File) => {
    // Check type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or Image file (JPG, PNG, WebP).");
      return;
    }
    // Check size (e.g. 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large. Please upload a file smaller than 10MB.");
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    // Determine how to clear the input value in a real DOM scenario if needed, 
    // but React state management handles the UI reset here.
    onFileSelect(null as any); // Inform parent
  };

  if (selectedFile) {
    return (
      <div className="w-full animate-in fade-in zoom-in-95 duration-300">
         <div className="relative overflow-hidden bg-blue-50/50 border-2 border-blue-200 rounded-xl shadow-sm transition-all duration-300 group">
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="h-14 w-14 flex-shrink-0 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
                   {selectedFile.type.includes('image') ? (
                     <ImageIcon className="h-7 w-7" />
                   ) : (
                     <FileText className="h-7 w-7" />
                   )}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Ready to process
                    </span>
                  </p>
                </div>
              </div>

              {!isLoading && (
                <button 
                  onClick={(e) => { e.preventDefault(); clearFile(); }}
                  className="p-2 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg border border-gray-200 hover:border-red-200 transition-all shadow-sm"
                  title="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        className={`relative group border-2 border-dashed rounded-xl transition-all duration-300 ease-out overflow-hidden bg-slate-50
          ${dragActive 
            ? 'border-blue-500 bg-blue-50 scale-[1.01] ring-4 ring-blue-50/50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
          }
          ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag} 
        onDragLeave={handleDrag} 
        onDragOver={handleDrag} 
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
          onChange={handleChange}
          accept="application/pdf,image/jpeg,image/png,image/webp,image/heic"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
          <div 
            className={`
              p-4 rounded-full mb-4 transition-all duration-300 shadow-sm
              ${dragActive 
                ? 'bg-blue-100 text-blue-600 scale-110' 
                : 'bg-white text-blue-500 group-hover:scale-110 group-hover:text-blue-600'
              }
            `}
          >
            <UploadCloud className={`h-8 w-8 ${dragActive ? 'animate-bounce' : ''}`} />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Click to upload or drag & drop
          </h3>
          
          <p className="text-gray-500 text-sm max-w-xs mb-6">
            Supported formats: PDF, JPG, PNG, WebP
          </p>

          <div className="bg-white border border-gray-200 text-gray-700 font-semibold py-2.5 px-6 rounded-lg shadow-sm group-hover:border-blue-400 group-hover:text-blue-600 transition-colors duration-200">
            Browse Files
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;