
import React from 'react';
import { Eye, FileSearch } from 'lucide-react';
import { FeatureType } from '../lib/types';

interface FeatureToggleProps {
  activeFeature: FeatureType;
  onChange: (feature: FeatureType) => void;
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({ activeFeature, onChange }) => {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <p className="text-sm font-medium text-docai-darkGray">Select Feature</p>
      <div className="flex gap-4">
        <button
          onClick={() => onChange('ocr')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl w-40 transition-all duration-300 ${
            activeFeature === 'ocr'
              ? 'bg-docai-blue text-white shadow-md'
              : 'bg-white/50 text-docai-darkGray hover:bg-white/80'
          }`}
        >
          <FileSearch className="h-5 w-5" />
          <span className="font-medium">OCR</span>
        </button>
        
        <button
          onClick={() => onChange('vision')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl w-40 transition-all duration-300 ${
            activeFeature === 'vision'
              ? 'bg-docai-blue text-white shadow-md'
              : 'bg-white/50 text-docai-darkGray hover:bg-white/80'
          }`}
        >
          <Eye className="h-5 w-5" />
          <span className="font-medium">Vision</span>
        </button>
      </div>
    </div>
  );
};

export default FeatureToggle;
