
import React from 'react';
import { Eye, FileSearch } from 'lucide-react';
import { FeatureType } from '../lib/types';

interface FeatureToggleProps {
  activeFeature: FeatureType;
  onChange: (feature: FeatureType) => void;
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({ activeFeature, onChange }) => {
  return (
    <div className="flex flex-col gap-2 animate-fade-in">
      <p className="text-xs font-medium text-docai-darkGray">Select Feature</p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange('ocr')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg w-full transition-all duration-300 text-xs ${
            activeFeature === 'ocr'
              ? 'bg-docai-blue text-white shadow-sm'
              : 'bg-white/80 text-docai-darkGray hover:bg-white border border-gray-200'
          }`}
        >
          <FileSearch className="h-4 w-4" />
          <span className="font-medium">OCR</span>
        </button>
        
        <button
          onClick={() => onChange('vision')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg w-full transition-all duration-300 text-xs ${
            activeFeature === 'vision'
              ? 'bg-docai-blue text-white shadow-sm'
              : 'bg-white/80 text-docai-darkGray hover:bg-white border border-gray-200'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span className="font-medium">Vision</span>
        </button>
      </div>
    </div>
  );
};

export default FeatureToggle;
