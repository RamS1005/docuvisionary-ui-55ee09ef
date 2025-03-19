
import React from 'react';
import { FileText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full flex justify-between items-center py-6 px-8 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 bg-docai-blue rounded-lg flex items-center justify-center">
          <FileText className="text-white h-5 w-5" />
        </div>
        <div>
          <div className="chip">AI-POWERED</div>
          <h1 className="text-xl font-semibold text-docai-black mt-1">Document AI</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="glass-button">Documentation</button>
        <button className="primary-button">Upgrade to Pro</button>
      </div>
    </header>
  );
};

export default Header;
