import React, { useState, useRef, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '../constants';
import { ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full sm:w-auto min-w-[240px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between bg-white border px-4 py-3 rounded-xl shadow-sm transition-all duration-200
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-blue-400'}
          ${disabled ? 'bg-gray-50 opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-3">
          <img
            src={`https://flagcdn.com/w40/${selectedOption.countryCode}.png`}
            srcSet={`https://flagcdn.com/w80/${selectedOption.countryCode}.png 2x`}
            width="24"
            height="18"
            alt={selectedOption.name}
            className="rounded-sm object-cover shadow-sm border border-gray-100"
          />
          <span className="font-medium text-gray-900">{selectedOption.name}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-[300px] overflow-y-auto">
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50
                  ${lang.code === selectedLanguage ? 'bg-blue-50/50' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://flagcdn.com/w40/${lang.countryCode}.png`}
                    srcSet={`https://flagcdn.com/w80/${lang.countryCode}.png 2x`}
                    width="24"
                    height="18"
                    alt={lang.name}
                    className="rounded-sm object-cover shadow-sm border border-gray-100"
                  />
                  <span className={`font-medium ${lang.code === selectedLanguage ? 'text-blue-700' : 'text-gray-700'}`}>
                    {lang.name}
                  </span>
                </div>
                {lang.code === selectedLanguage && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;