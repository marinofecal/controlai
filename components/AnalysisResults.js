import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, TrendingUp, FileText } from 'lucide-react';
import clsx from 'clsx';

const getRiskColor = (score) => {
  if (score > 75) return 'text-red-500';
  if (score > 50) return 'text-yellow-500';
  if (score > 25) return 'text-blue-500';
  return 'text-green-500';
};

const getRiskBgColor = (score) => {
  if (score > 75) return 'bg-red-500/10 border-red-500/20';
  if (score > 50) return 'bg-yellow-500/10 border-yellow-500/20';
  if (score > 25) return 'bg-blue-500/10 border-blue-500/20';
  return 'bg-green-500/10 border-green-500/20';
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'CRITICAL': return 'bg-red-500/20 border-red-500/30 text-red-400';
    case 'HIGH': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
    case 'MEDIUM': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
    default: return 'bg-green-500/20 border-green-500/30 text-green-400';
  }
};

export default function AnalysisResults({ result }) {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8"><h3 className="text-xl font-bold text-white mb-4">Executive Summary</h3><p className="text-slate-300 leading-relaxed">{result.summary}</p></motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className={clsx('border rounded-xl p-8 backdrop-blur-xl', getRiskBgColor(result.risk_score))}>
          <div className="flex items-center justify-between mb-4"><h4 className="text-sm font-semibold text-slate-300">Risk Score</h4><TrendingUp className={`w-5 h-5 ${getRiskColor(result.risk_score)}`} /></div>
          <div className={`text-4xl font-bold ${getRiskColor(result.risk_score)}`}>{result.risk_score}/100</div>
          <div className="mt-4 w-full bg-slate-700/50 rounded-full h-2"><motion.div initial={{ width: 0 }} animate={{ width: `${result.risk_score}%` }} transition={{ duration: 1, ease: 'easeOut' }} className={`h-2 rounded-full ${getRiskColor(result.risk_score).replace('text-', 'bg-')}`} /></div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4"><h4 className="text-sm font-semibold text-slate-300">Compliance Probability</h4><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
          <div className="text-4xl font-bold text-green-500">{result.compliance_probability}%</div>
          <div className="mt-4 w-full bg-slate-700/50 rounded-full h-2"><motion.div initial={{ width: 0 }} animate={{ width: `${result.compliance_probability}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-2 rounded-full bg-green-500" /></div>
        </motion.div>
      </div>
      {result.applicable_regulations && result.applicable_regulations.length > 0 && (
        <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center"><FileText className="w-5 h-5 mr-2" />Applicable Regulations ({result.applicable_regulations.length})</h3>
          <div className="space-y-4">
            {result.applicable_regulations.map((reg, idx) => (
              <motion.div key={idx} variants={itemVariants} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2"><div><h4 className="font-semibold text-white">{reg.name}</h4><p className="text-sm text-slate-400">{reg.regulation_id}</p></div><span className="text-blue-400 font-semibold">{reg.relevance}% relevant</span></div>
                {reg.articles && reg.articles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {reg.articles.slice(0, 3).map((article, i) => (<span key={i} className="text-xs bg-blue-500/20 border border-blue-500/30 text-blue-400 px-2 py-1 rounded">{article}</span>))}
                    {reg.articles.length > 3 && (<span className="text-xs text-slate-400">+{reg.articles.length - 3} more</span>)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {result.identified_gaps && result.identified_gaps.length > 0 && (
        <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center"><AlertTriangle className="w-5 h-5 mr-2" />Identified Gaps ({result.identified_gaps.length})</h3>
          <div className="space-y-4">
            {result.identified_gaps.map((gap, idx) => (
              <motion.div key={idx} variants={itemVariants} className={clsx('border rounded-lg p-4', getSeverityColor(gap.severity))}>
                <div className="flex items-start justify-between mb-2"><h4 className="font-semibold">{gap.description}</h4><span className="text-xs font-semibold px-2 py-1 bg-black/20 rounded">{gap.severity}</span></div>
                <p className="text-sm opacity-90 mb-3">{gap.business_impact}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {result.action_plan && result.action_plan.length > 0 && (
        <motion.div variants={itemVariants} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-6">Action Plan</h3>
          <div className="space-y-4">
            {result.action_plan.slice(0, 5).map((action, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center"><span className="text-blue-400 font-semibold text-sm">{action.priority}</span></div>
                <div className="flex-grow"><h4 className="font-semibold text-white">{action.action}</h4><p className="text-sm text-slate-400 mt-1">Owner: {action.owner} | Deadline: {action.deadline}</p></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      <motion.div variants={itemVariants} className="bg-slate-700/20 border border-slate-700/50 rounded-xl p-6 text-xs text-slate-400">
        <p>Analysis powered by <strong>{result.metadata?.ai_provider}</strong> • {new Date(result.metadata?.processing_timestamp).toLocaleString()}</p>
      </motion.div>
    </motion.div>
  );
}
