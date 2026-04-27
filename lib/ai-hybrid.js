import Groq from 'groq-sdk';
import OpenAI from 'openai';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are ControlAI, an expert compliance analyst with 25+ years of experience.
Analyze compliance cases with maximum precision.
ALWAYS return valid JSON:
{
  "summary": "Executive summary",
  "risk_score": 75,
  "compliance_probability": 45,
  "applicable_regulations": [{"name": "GDPR", "regulation_id": "EU/2016/679", "relevance": 95, "articles": ["Art. 32"]}],
  "identified_gaps": [{"description": "Gap", "severity": "HIGH", "business_impact": "Impact"}],
  "action_plan": [{"action": "Action", "priority": 1, "owner": "Owner", "deadline": "2026-06-30"}]
}`;

function calculateRiskScore(description) {
  let score = 50;
  const riskKeywords = {
    'unencrypted': 20, 'no encryption': 20, 'breach': 25, 'critical': 20,
    'no data protection': 15, 'indefinite retention': 15,
    'encryption': -10, 'protection': -8, 'agreement': -5
  };
  const lower = description.toLowerCase();
  Object.entries(riskKeywords).forEach(([kw, pts]) => {
    if (lower.includes(kw)) score += pts;
  });
  return Math.max(0, Math.min(100, score));
}

function shouldUseOpenAI(riskScore, caseType) {
  const complexTypes = ['CRIMINAL', 'FINANCIAL_CRIME', 'DATA_BREACH', 'HEALTHCARE'];
  return riskScore > 75 || complexTypes.includes(caseType);
}

export async function analyzeCompliance(caseData) {
  try {
    if (!caseData?.description) throw new Error('Description required');

    const riskScore = calculateRiskScore(caseData.description);
    const useOpenAI = shouldUseOpenAI(riskScore, caseData.case_type);

    const userMessage = `COMPLIANCE CASE:
Type: ${caseData.case_type || 'GENERAL'}
Industry: ${caseData.industry || 'General'}
Jurisdictions: ${caseData.jurisdictions?.join(', ') || 'EU'}
Description: ${caseData.description}`;

    let response;

    if (useOpenAI) {
      response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      });
    } else {
      response = await groq.chat.completions.create({
        model: 'llama-3.2-90b-vision-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      });
    }

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response');

    const analysis = JSON.parse(content);

    return {
      ...analysis,
      metadata: {
        ai_provider: useOpenAI ? 'openai-gpt-4o-mini' : 'groq-llama-3.2-90b',
        risk_score: riskScore,
        processing_timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('[ControlAI]', error);
    throw error;
  }
}

export async function analyzeBatch(cases) {
  const results = await Promise.all(cases.map(analyzeCompliance));
  return { total: cases.length, results };
}

export default { analyzeCompliance, analyzeBatch };
