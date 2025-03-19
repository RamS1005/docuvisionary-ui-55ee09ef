
import React from 'react';
import { FileText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full flex justify-between items-center py-3 px-6 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-docai-blue rounded-md flex items-center justify-center">
          <FileText className="text-white h-4 w-4" />
        </div>
        <div>
          <div className="chip text-xs">AI-POWERED</div>
          <h1 className="text-lg font-semibold text-docai-black">Document AI</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="glass-button text-xs py-1.5 px-4">Documentation</button>
        <button className="primary-button text-xs py-1.5 px-4">Upgrade to Pro</button>
      </div>
    </header>
  );
};

export default Header;
