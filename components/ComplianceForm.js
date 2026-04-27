import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

const CASE_TYPES = [
  { value: 'GDPR_COMPLIANCE', label: 'GDPR Compliance' },
  { value: 'FINANCIAL_REGULATION', label: 'Financial Regulation' },
  { value: 'HEALTHCARE_COMPLIANCE', label: 'Healthcare Compliance' },
  { value: 'DATA_PROTECTION', label: 'Data Protection' },
  { value: 'GENERAL_COMPLIANCE', label: 'General Compliance' },
  { value: 'CRIMINAL', label: 'Criminal' },
  { value: 'FINANCIAL_CRIME', label: 'Financial Crime' },
  { value: 'DATA_BREACH', label: 'Data Breach' },
];

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Insurance', 'Retail', 'Manufacturing', 'Energy', 'Real Estate', 'Other'];
const JURISDICTIONS = ['EU', 'UK', 'USA', 'APAC', 'LATAM', 'Canada', 'Australia'];

export default function ComplianceForm({ onAnalyze, isLoading }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      case_type: 'GDPR_COMPLIANCE',
      industry: 'Technology',
      description: '',
      jurisdictions: ['EU'],
      additional_context: '',
    },
  });

  const onSubmit = (data) => {
    onAnalyze(data);
  };

  return (
    <motion.form onSubmit={handleSubmit(onSubmit)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8 backdrop-blur-xl">
      <h2 className="text-2xl font-bold text-white mb-8">Compliance Case</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">Case Type</label>
        <Controller name="case_type" control={control} render={({ field }) => (
          <select {...field} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
            {CASE_TYPES.map((type) => (<option key={type.value} value={type.value}>{type.label}</option>))}
          </select>
        )} />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">Industry</label>
        <Controller name="industry" control={control} render={({ field }) => (
          <select {...field} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
            {INDUSTRIES.map((industry) => (<option key={industry} value={industry}>{industry}</option>))}
          </select>
        )} />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">Jurisdictions</label>
        <Controller name="jurisdictions" control={control} render={({ field }) => (
          <div className="grid grid-cols-2 gap-3">
            {JURISDICTIONS.map((jurisdiction) => (
              <label key={jurisdiction} className="flex items-center p-3 bg-slate-700/50 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/70 transition">
                <input type="checkbox" value={jurisdiction} checked={field.value.includes(jurisdiction)} onChange={(e) => { const newValue = e.target.checked ? [...field.value, jurisdiction] : field.value.filter((j) => j !== jurisdiction); field.onChange(newValue); }} className="w-4 h-4 accent-blue-500 rounded" />
                <span className="ml-2 text-sm text-slate-300">{jurisdiction}</span>
              </label>
            ))}
          </div>
        )} />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">Case Description <span className="text-red-400">*</span></label>
        <Controller name="description" control={control} rules={{ required: 'Description is required', minLength: { value: 50, message: 'Description must be at least 50 characters' } }} render={({ field }) => (
          <div>
            <textarea {...field} placeholder="Describe your compliance case in detail..." className={clsx('w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-1 transition resize-none', errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500')} rows="6" />
            {errors.description && (<div className="mt-2 flex items-center text-red-400 text-sm"><AlertCircle className="w-4 h-4 mr-2" />{errors.description.message}</div>)}
          </div>
        )} />
      </div>
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-300 mb-3">Additional Context (Optional)</label>
        <Controller name="additional_context" control={control} render={({ field }) => (<textarea {...field} placeholder="Any additional information..." className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none" rows="3" />)} />
      </div>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className={clsx('w-full py-3 px-4 rounded-lg font-semibold text-white transition flex items-center justify-center', isLoading ? 'bg-slate-700 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25')}>
        {isLoading ? (<><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />Analyzing...</>) : (<><CheckCircle2 className="w-5 h-5 mr-2" />Analyze Case</>)}
      </motion.button>
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-blue-400">💡 <strong>Pro Tip:</strong> Provide detailed descriptions for more accurate analysis.</p>
      </div>
    </motion.form>
  );
}
