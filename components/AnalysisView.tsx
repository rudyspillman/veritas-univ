import React from 'react';
import { VerificationResult, AnalysisVerdict } from '../types';
import GaugeChart from './GaugeChart';
import { ShieldCheck, ShieldAlert, ShieldX, Activity } from 'lucide-react';

interface AnalysisViewProps {
  result: VerificationResult;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onReset }) => {
  const getVerdictColor = (v: AnalysisVerdict) => {
    switch (v) {
      case AnalysisVerdict.AUTHENTIC: return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case AnalysisVerdict.SUSPICIOUS: return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case AnalysisVerdict.FRAUDULENT: return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
    }
  };

  const getVerdictIcon = (v: AnalysisVerdict) => {
    switch (v) {
      case AnalysisVerdict.AUTHENTIC: return <ShieldCheck className="w-12 h-12 mb-2" />;
      case AnalysisVerdict.SUSPICIOUS: return <ShieldAlert className="w-12 h-12 mb-2" />;
      case AnalysisVerdict.FRAUDULENT: return <ShieldX className="w-12 h-12 mb-2" />;
      default: return <Activity className="w-12 h-12 mb-2" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Result */}
      <div className={`flex flex-col md:flex-row items-center justify-between p-8 rounded-2xl border backdrop-blur-sm ${getVerdictColor(result.verdict)}`}>
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6 md:mb-0">
          {getVerdictIcon(result.verdict)}
          <h2 className="text-3xl font-bold tracking-tight uppercase font-mono">{result.verdict}</h2>
          <p className="text-sm opacity-80 font-mono mt-1">VERITAS Protocol Complete</p>
        </div>
        <div className="w-48 h-32">
          <GaugeChart score={result.score} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reasoning Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-veritas-panel border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-veritas-accent mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Forensic Summary
            </h3>
            <p className="text-slate-300 leading-relaxed font-light">
              {result.reasoning}
            </p>
          </div>

          <div className="bg-veritas-panel border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Evidence Log</h3>
            <ul className="space-y-3">
              {result.explanation.map((item, idx) => (
                <li key={idx} className="flex items-start text-slate-300 text-sm">
                  <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-veritas-accent rounded-full flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Metadata Column */}
        <div className="md:col-span-1 space-y-6">
           <div className="bg-veritas-panel border border-slate-700/50 rounded-xl p-6">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Analysis Metadata</h3>
             <div className="space-y-4 font-mono text-xs">
               <div>
                 <div className="text-slate-500">Timestamp</div>
                 <div className="text-slate-300">{new Date(result.timestamp).toLocaleString()}</div>
               </div>
               <div>
                 <div className="text-slate-500">Engine</div>
                 <div className="text-slate-300">GEMINI-3-PRO</div>
               </div>
               <div>
                 <div className="text-slate-500">Protocol</div>
                 <div className="text-slate-300">DEEP-FORENSIC-V1</div>
               </div>
               <div>
                 <div className="text-slate-500">Confidence</div>
                 <div className="text-slate-300">HIGH</div>
               </div>
             </div>
           </div>

           <button 
             onClick={onReset}
             className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold transition-all"
           >
             NEW ANALYSIS
           </button>
        </div>
      </div>
      <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded-lg text-xs text-slate-500 text-center font-mono">
        {result.disclaimer || "Analytical assessment based on algorithmic pattern recognition. Not an official certification or legal determination."}
      </div>
    </div>
  );
};

export default AnalysisView;
