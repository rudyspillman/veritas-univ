import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Image as ImageIcon, Mic, Film, X, Search, Terminal } from 'lucide-react';
import { analyzeContent } from './services/geminiService';
import { VerificationResult, InputMode, HistoryItem } from './types';
import AnalysisView from './components/AnalysisView';
import LegalDisclaimer from './components/LegalDisclaimer';

function App() {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.TEXT);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; type: string; data: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit for this demo.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip the data URL prefix to get raw base64 for Gemini
        const base64Data = base64String.split(',')[1];
        
        setSelectedFile({
          name: file.name,
          type: file.type,
          data: base64Data
        });
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = async () => {
    if (!inputText && !selectedFile) {
      setError("Please provide text or a file to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const verification = await analyzeContent(
        inputText || null, 
        selectedFile ? { mimeType: selectedFile.type, data: selectedFile.data } : null
      );
      
      setResult(verification);
      
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        type: selectedFile ? (selectedFile.type.startsWith('image') ? 'image' : selectedFile.type.startsWith('audio') ? 'audio' : 'video') : 'text',
        preview: selectedFile ? selectedFile.name : inputText.substring(0, 30) + '...',
        result: verification
      };
      
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (e: any) {
      setError(e.message || "Analysis failed due to an unknown error.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setInputText('');
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-veritas-dark text-veritas-text font-sans selection:bg-veritas-accent selection:text-black">
      <LegalDisclaimer />
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-veritas-dark/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-veritas-accent rounded-sm flex items-center justify-center">
              <Terminal className="text-black w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight font-mono text-white">VERITAS<span className="text-veritas-accent">.AI</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-mono text-slate-400">
            <span className="flex items-center"><div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>SYSTEM ONLINE</span>
            <span>V 2.5.0-PRO</span>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {!result && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in-up">
            
            <div className="text-center space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Universal Verification Engine
              </h1>
              <p className="text-lg text-slate-400 font-light">
                Analyze text, documents, and media for manipulation, fraud, and AI generation using forensic protocols.
              </p>
            </div>

            {/* Input Card */}
            <div className="w-full max-w-3xl bg-veritas-panel border border-slate-700 rounded-2xl p-2 shadow-2xl overflow-hidden relative">
              
              {/* Tabs */}
              <div className="flex border-b border-slate-700 bg-slate-900/50">
                <button
                  onClick={() => setInputMode(InputMode.TEXT)}
                  className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${inputMode === InputMode.TEXT ? 'text-veritas-accent border-b-2 border-veritas-accent bg-slate-800/50' : 'text-slate-400 hover:text-white'}`}
                >
                  <FileText className="w-4 h-4" />
                  <span>TEXT ANALYSIS</span>
                </button>
                <button
                  onClick={() => setInputMode(InputMode.FILE)}
                  className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center space-x-2 transition-colors ${inputMode === InputMode.FILE ? 'text-veritas-accent border-b-2 border-veritas-accent bg-slate-800/50' : 'text-slate-400 hover:text-white'}`}
                >
                  <Upload className="w-4 h-4" />
                  <span>MEDIA UPLOAD</span>
                </button>
              </div>

              <div className="p-6 min-h-[300px] flex flex-col">
                {inputMode === InputMode.TEXT ? (
                  <textarea
                    className="w-full h-full min-h-[250px] bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-veritas-accent focus:ring-1 focus:ring-veritas-accent transition-all resize-none font-mono text-sm"
                    placeholder="Paste email content, contract text, or suspicious messages here for forensic analysis..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                ) : (
                  <div className="flex-1 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center p-8 bg-slate-900/20 hover:bg-slate-900/40 transition-colors group relative">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept="image/*,audio/*,video/*,application/pdf"
                    />
                    
                    {!selectedFile ? (
                      <>
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-veritas-accent" />
                        </div>
                        <p className="text-slate-300 font-medium">Drag & drop or click to upload</p>
                        <p className="text-slate-500 text-sm mt-2">Supports Images, Audio, Video, PDF (Max 10MB)</p>
                        <div className="flex space-x-4 mt-6 text-slate-600">
                          <ImageIcon className="w-5 h-5" />
                          <Mic className="w-5 h-5" />
                          <Film className="w-5 h-5" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center animate-fade-in">
                        <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 border border-emerald-500/50">
                          <FileText className="w-8 h-8 text-emerald-500" />
                        </div>
                        <p className="text-white font-medium break-all text-center px-4">{selectedFile.name}</p>
                        <p className="text-emerald-500 text-xs mt-1 uppercase tracking-wide">Ready for Analysis</p>
                        <button 
                          onClick={(e) => {
                             e.stopPropagation();
                             setSelectedFile(null);
                             if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-300 z-20"
                        >
                          Remove File
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-mono">
                  {selectedFile || inputText.length > 0 ? 'INPUT DETECTED' : 'WAITING FOR INPUT...'}
                </div>
                <button
                  onClick={handleAnalysis}
                  disabled={isAnalyzing || (!inputText && !selectedFile)}
                  className={`px-8 py-3 rounded-lg font-bold tracking-wide transition-all flex items-center shadow-lg ${
                    isAnalyzing || (!inputText && !selectedFile)
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-veritas-accent text-black hover:bg-cyan-300 hover:shadow-cyan-500/20'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      VERIFY
                    </>
                  )}
                </button>
              </div>
              
              {/* Scanning overlay effect */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-veritas-dark/50 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
                   <div className="w-full max-w-md h-1 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-veritas-accent animate-[loading_2s_ease-in-out_infinite]"></div>
                   </div>
                   <p className="mt-4 font-mono text-veritas-accent animate-pulse">RUNNING FORENSIC PROTOCOLS...</p>
                </div>
              )}
            </div>
            
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 flex items-center max-w-2xl w-full">
                <X className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}
          </div>
        )}

        {result && (
          <AnalysisView result={result} onReset={resetAnalysis} />
        )}
      </main>

      {/* History Sidebar - simplified for mobile/desktop layout */}
      {history.length > 0 && !result && (
         <div className="max-w-7xl mx-auto px-6 mb-12 animate-fade-in">
            <h3 className="text-slate-500 font-mono text-sm uppercase tracking-widest mb-4">Recent Analyses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => setResult(item.result)}>
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className={`w-2 h-10 rounded-full ${item.result.verdict === 'Authentic' ? 'bg-emerald-500' : item.result.verdict === 'Fraudulent' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                    <div className="flex-1 min-w-0">
                       <div className="text-white font-medium truncate">{item.preview}</div>
                       <div className="text-xs text-slate-400 font-mono">{new Date(item.result.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-600">{item.result.score}%</div>
                </div>
              ))}
            </div>
         </div>
      )}
    </div>
  );
}

export default App;
