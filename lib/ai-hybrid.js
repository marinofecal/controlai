import Groq from 'groq-sdk';
import OpenAI from 'openai';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are ControlAI, an expert compliance analyst with 25+ years of experience in regulatory analysis.

Your objective: Analyze compliance cases with maximum precision.

IMPORTANT - ALWAYS return valid JSON with this exact structure:
{
  "summary": "Executive summary of the compliance case",
  "risk_score": 75,
  "compliance_probability": 45,
  "applicable_regulations": [
    {
      "name": "GDPR",
      "regulation_id": "EU/2016/679",
      "relevance": 95,
      "articles": ["Art. 5", "Art. 32"]
    }
  ],
  "identified_gaps": [
    {
      "description": "Data encryption not implemented",
      "severity": "HIGH",
      "business_impact": "Risk of data exposure and regulatory fines"
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
    'critical': 20,
    'breach': 25,
    'unencrypted': 20,
    'no data protection': 15,
    'indefinite retention': 15,
    'encryption': -10,
    'protection': -8,
    'agreement': -5,
  };

  const lowerDesc = description.toLowerCase();
  Object.entries(riskKeywords).forEach(([keyword, points]) => {
    if (lowerDesc.includes(keyword)) score += points;
  });

  return Math.max(0, Math.min(100, score));
}

function shouldUseOpenAI(riskScore, caseType) {
  const complexCaseTypes = ['CRIMINAL', 'FINANCIAL_CRIME', 'DATA_BREACH', 'HEALTHCARE'];
  if (riskScore > 75) return true;
  if (complexCaseTypes.includes(caseType)) return true;
  return false;
}

export async function analyzeCompliance(caseData) {
  try {
    if (!caseData?.description) {
      throw new Error('Case description is required');
    }

    const riskScore = calculateRiskScore(caseData.description);
    const useOpenAI = shouldUseOpenAI(riskScore, caseData.case_type);

    console.log(`[ControlAI] Risk Score: ${riskScore}, Using: ${useOpenAI ? 'OpenAI' : 'Groq'}`);

    const userMessage = `COMPLIANCE CASE ANALYSIS:
Type: ${caseData.case_type || 'GENERAL_COMPLIANCE'}
Industry: ${caseData.industry || 'General'}
Jurisdictions: ${caseData.jurisdictions?.join(', ') || 'EU'}
Description: ${caseData.description}
${caseData.additional_context ? `Additional Context: ${caseData.additional_context}` : ''}`;

    let response;

    if (useOpenAI) {
      console.log('[ControlAI] Using OpenAI GPT-4o Mini for HIGH RISK case');
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
      console.log('[ControlAI] Using Groq Mixtral for STANDARD case');
      response = await groq.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      });
    }

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI model');
    }

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('[ControlAI] JSON Parse Error:', parseError);
      throw new Error('Invalid JSON response from AI model');
    }

    return {
      ...analysis,
      metadata: {
        ai_provider: useOpenAI ? 'openai-gpt-4o-mini' : 'groq-mixtral-8x7b',
        risk_score: riskScore,
        processing_timestamp: new Date().toISOString(),
        case_type: caseData.case_type,
        industry: caseData.industry,
        jurisdictions: caseData.jurisdictions,
      },
    };
  } catch (error) {
    console.error('[ControlAI] Analysis Error:', error);
    throw error;
  }
}

export async function analyzeBatch(cases) {
  try {
    const results = await Promise.all(
      cases.map(caseData => analyzeCompliance(caseData))
    );
    return {
      total_cases: cases.length,
      analyzed: results.length,
      cases: results,
      summary: {
        high_risk: results.filter(r => r.risk_score > 75).length,
        medium_risk: results.filter(r => r.risk_score > 40 && r.risk_score <= 75).length,
        low_risk: results.filter(r => r.risk_score <= 40).length,
      },
    };
  } catch (error) {
    console.error('[ControlAI] Batch Analysis Error:', error);
    throw error;
  }
}

export default {
  analyzeCompliance,
  analyzeBatch,
};
