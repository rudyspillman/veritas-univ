import React, { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';

const LegalDisclaimer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('veritas_legal_accepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('veritas_legal_accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-veritas-panel border border-veritas-accent/30 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-slate-900/50 p-6 border-b border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 bg-veritas-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-6 h-6 text-veritas-warning" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Legal Disclaimer & Terms of Use</h2>
            <p className="text-slate-400 text-sm">Please review before proceeding.</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4 text-slate-300 text-sm leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar">
          <p>
            <strong>1. Analytical Assessment Only:</strong> VERITAS AI is an automated pattern recognition system. Its outputs are probabilistic assessments based on algorithmic analysis and do NOT constitute legal advice, official certification, or forensic proof.
          </p>
          <p>
            <strong>2. No Guarantee of Accuracy:</strong> While designed to detect manipulation, AI models can generate false positives and false negatives. The system makes no warranties regarding the accuracy, completeness, or reliability of its analysis.
          </p>
          <p>
            <strong>3. User Responsibility:</strong> You are solely responsible for how you use these results. Do not use this tool as the sole basis for legal, financial, or employment decisions.
          </p>
          <p>
            <strong>4. Liability Waiver:</strong> By using this system, you agree to hold the creators, developers, and operators harmless from any claims, damages, or liabilities arising from your use of the tool or reliance on its outputs.
          </p>
          <p>
            <strong>5. Data Privacy:</strong> Files uploaded for analysis are processed for the purpose of verification. Ensure you have the right to analyze any content you upload.
          </p>
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-slate-800 flex justify-end space-x-4">
          <button 
            onClick={handleAccept}
            className="px-6 py-2 bg-veritas-accent text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors"
          >
            I Acknowledge & Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimer;
