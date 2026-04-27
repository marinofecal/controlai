import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are ControlAI, an expert compliance analyst with 25+ years of experience.
Analyze compliance cases with maximum precision.
ALWAYS return valid JSON:
{
  "summary": "Executive summary of findings",
  "risk_score": 75,
  "compliance_probability": 45,
  "applicable_regulations": [
    {
      "name": "GDPR",
      "regulation_id": "EU/2016/679",
      "relevance": 95,
      "articles": ["Art. 5", "Art. 32", "Art. 35"]
    }
  ],
  "identified_gaps": [
    {
      "description": "Data encryption not implemented",
      "severity": "HIGH",
      "business_impact": "Risk of data exposure and fines up to EUR 20M"
    }
  ],
  "action_plan": [
    {
      "action": "Implement AES-256 encryption for all data at rest",
      "priority": 1,
      "owner": "Security Team",
      "deadline": "2026-06-30"
    }
  ]
}`;

function calculateRiskScore(description) {
  let score = 50;
  const riskKeywords = {
    'unencrypted': 20, 'no encryption': 20, 'breach': 25, 'critical': 20,
    'no data protection': 15, 'indefinite retention': 15, 'no agreement': 15,
    'encryption': -10, 'protection': -8, 'agreement': -5, 'secure': -10
  };
  const lower = description.toLowerCase();
  Object.entries(riskKeywords).forEach(([kw, pts]) => {
    if (lower.includes(kw)) score += pts;
  });
  return Math.max(0, Math.min(100, score));
}

export async function analyzeCompliance(caseData) {
  try {
    if (!caseData?.description) {
      throw new Error('Description required');
    }

    const riskScore = calculateRiskScore(caseData.description);

    const userMessage = `COMPLIANCE CASE ANALYSIS:
Type: ${caseData.case_type || 'GENERAL'}
Industry: ${caseData.industry || 'General'}
Jurisdictions: ${caseData.jurisdictions?.join(', ') || 'EU'}
Description: ${caseData.description}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    const analysis = JSON.parse(content);

    return {
      ...analysis,
      metadata: {
        ai_provider: 'openai-gpt-4o-mini',
        risk_score: riskScore,
        processing_timestamp: new Date().toISOString(),
        case_type: caseData.case_type,
        industry: caseData.industry,
      },
    };
  } catch (error) {
    console.error('[ControlAI] Error:', error);
    throw error;
  }
}

export async function analyzeBatch(cases) {
  const results = await Promise.all(cases.map(analyzeCompliance));
  return { total: cases.length, results };
}

export default { analyzeCompliance, analyzeBatch };
