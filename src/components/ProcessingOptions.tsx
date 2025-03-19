
import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { FeatureType } from '../lib/types';

interface ProcessingOptionsProps {
  feature: FeatureType;
}

const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({ feature }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full mt-4 animate-fade-in">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-2 px-4 bg-white/50 hover:bg-white/70 transition-colors duration-300 rounded-lg"
      >
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-docai-darkGray" />
          <span className="text-sm font-medium text-docai-darkGray">Processing Options</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-docai-darkGray" />
        ) : (
          <ChevronDown className="h-4 w-4 text-docai-darkGray" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-2 p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-white/10 animate-fade-in">
          <div className="space-y-4">
            {feature === 'ocr' ? (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-docai-darkGray">Language</label>
                  <select className="text-sm bg-white/70 border border-gray-200 rounded-lg px-3 py-2">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-docai-darkGray">Detect Tables</span>
                  <div className={`toggle-pill ${true ? 'toggle-pill-active' : ''}`}>
                    <div className={`toggle-pill-handle ${true ? 'toggle-pill-handle-active' : ''}`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-docai-darkGray">Extract Entities</span>
                  <div className={`toggle-pill ${true ? 'toggle-pill-active' : ''}`}>
                    <div className={`toggle-pill-handle ${true ? 'toggle-pill-handle-active' : ''}`}></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-docai-darkGray">Detect Objects</span>
                  <div className={`toggle-pill ${true ? 'toggle-pill-active' : ''}`}>
                    <div className={`toggle-pill-handle ${true ? 'toggle-pill-handle-active' : ''}`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-docai-darkGray">Facial Recognition</span>
                  <div className={`toggle-pill ${false ? 'toggle-pill-active' : ''}`}>
                    <div className={`toggle-pill-handle ${false ? 'toggle-pill-handle-active' : ''}`}></div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-docai-darkGray">Vision Model</label>
                  <select className="text-sm bg-white/70 border border-gray-200 rounded-lg px-3 py-2">
                    <option>Standard</option>
                    <option>Enhanced</option>
                    <option>High Precision</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingOptions;
