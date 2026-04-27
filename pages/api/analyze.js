import { analyzeComplianceCase } from '../../lib/compliance/analyzer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await analyzeComplianceCase(req.body);

    return res.status(200).json(result);

  } catch (error) {
    console.error('API error:', error);

    return res.status(500).json({
      error: 'Analysis failed'
    });
  }
}
