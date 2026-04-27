import { analyzeCompliance } from '@/lib/ai-hybrid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { case_type, industry, description, jurisdictions, additional_context } = req.body;

    if (!description || description.length < 50) {
      return res.status(400).json({ error: 'Description must be at least 50 characters' });
    }

    const caseData = {
      case_type,
      industry,
      description,
      jurisdictions,
      additional_context,
    };

    const analysis = await analyzeCompliance(caseData);

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Analysis failed',
    });
  }
}
