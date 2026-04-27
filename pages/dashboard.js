import { useState } from 'react';
import ComplianceForm from '@/components/ComplianceForm';
import AnalysisResults from '@/components/AnalysisResults';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/compliance/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      setAnalysisResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-white tracking-tight">ControlAI</h1>
          <p className="mt-2 text-lg text-slate-400">Enterprise Compliance Analysis Powered by AI</p>
        </div>
      </motion.div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="lg:col-span-1">
            <div className="sticky top-8">
              <ComplianceForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2">
            {error && <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"><p className="text-red-400">Error: {error}</p></div>}
            {isLoading && <div className="flex items-center justify-center h-96"><div className="text-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full" /><p className="mt-4 text-slate-400">Analyzing compliance...</p></div></div>}
            {analysisResult && !isLoading && <AnalysisResults result={analysisResult} />}
            {!analysisResult && !isLoading && !error && <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-12 text-center"><p className="text-slate-400 text-lg">Submit a case to see detailed compliance analysis</p></div>}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
