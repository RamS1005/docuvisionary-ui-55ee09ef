
import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { FeatureType } from '../lib/types';

interface ProcessingOptionsProps {
  feature: FeatureType;
}

const ProcessingOptions: React.FC<ProcessingOptionsProps> = ({ feature }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full mt-3 animate-fade-in">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-1.5 px-3 bg-white/80 hover:bg-white/90 transition-colors duration-300 rounded-lg border border-gray-200 text-xs"
      >
        <div className="flex items-center gap-1.5">
          <Settings className="h-3 w-3 text-docai-darkGray" />
          <span className="font-medium text-docai-darkGray">Processing Options</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-3 w-3 text-docai-darkGray" />
        ) : (
          <ChevronDown className="h-3 w-3 text-docai-darkGray" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-2 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 animate-fade-in">
          <div className="space-y-3">
            {feature === 'ocr' ? (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-docai-darkGray">Language</label>
                  <select className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-docai-darkGray">Detect Tables</span>
                  <div className={`toggle-pill ${true ? 'toggle-pill-active' : ''}`}>
                    <div className={`toggle-pill-handle ${true ? 'toggle-pill-handle-active' : ''}`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-docai-darkGray">Extract Entities</span>
                  <div className={`toggle-pill ${true ? 'toggle-pill-active' : ''}`}>
                    <div className={`toggle-pill-handle ${true ? 'toggle-pill-handle-active' : ''}`}></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-docai-darkGray">Detect Objects</span>
                  <div className={`toggle-pill ${true ? 'toggle-pill-active' : ''}`}>
                    <div className={`toggle-pill-handle ${true ? 'toggle-pill-handle-active' : ''}`}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-docai-darkGray">Facial Recognition</span>
                  <div className={`toggle-pill ${false ? 'toggle-pill-active' : ''}`}>
                    <div className={`toggle-pill-handle ${false ? 'toggle-pill-handle-active' : ''}`}></div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-docai-darkGray">Vision Model</label>
                  <select className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1">
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
