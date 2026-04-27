import Groq from 'groq-sdk';
import OpenAI from 'openai';

// Inicializar clientes
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Eres ControlAI, un experto en cumplimiento regulatorio con 25+ años de experiencia en Big 4 consulting.

Tu objetivo: Analizar casos de compliance con máxima precisión.

IMPORTANTE - SIEMPRE devuelve JSON válido con esta estructura exacta:
{
  "summary": "Resumen ejecutivo breve",
  "risk_score": 75,
  "compliance_probability": 45,
  "applicable_regulations": [
    {"name": "GDPR", "regulation_id": "EU/2016/679", "relevance": 95, "articles": ["Art. 28", "Art. 32"]}
  ],
  "identified_gaps": [
    {"description": "Gap", "severity": "HIGH", "business_impact": "Impact"}
  ],
  "action_plan": [
    {"action": "Action", "priority": 1, "owner": "Owner", "deadline": "2026-06-30"}
  ]
}`;

function calculateRiskScore(description) {
  let score = 0;
  const keywords = {
    crítico: 25, crítica: 25, breach: 25, robo: 25,
    encriptación: -10, protección: -10, cumplimiento: -5,
  };
  
  const lowerDesc = description.toLowerCase();
  Object.entries(keywords).forEach(([keyword, points]) => {
    if (lowerDesc.includes(keyword)) score += points;
  });
  
  return Math.max(0, Math.min(100, 50 + score));
}

function shouldUseOpenAI(riskScore, caseType) {
  const complexCaseTypes = ['CRIMINAL', 'FINANCIAL_CRIME', 'DATA_BREACH', 'HEALTHCARE'];
  if (riskScore > 75) return true;
  if (complexCaseTypes.includes(caseType)) return true;
  return false;
}

export async function analyzeCompliance(caseData) {
  try {
    if (!caseData || !caseData.description) {
      throw new Error('Case description is required');
    }

    const riskScore = calculateRiskScore(caseData.description);
    const useOpenAI = shouldUseOpenAI(riskScore, caseData.case_type);

    console.log(`[ControlAI] Risk: ${riskScore}, Provider: ${useOpenAI ? 'OpenAI' : 'Groq'}`);

    const userMessage = `CASO DE ANÁLISIS:
Tipo: ${caseData.case_type || 'GENERAL_COMPLIANCE'}
Industria: ${caseData.industry || 'General'}
Jurisdicciones: ${caseData.jurisdictions?.join(', ') || 'EU'}
Descripción: ${caseData.description}`;

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
        model: 'llama-3.1-70b-versatile',
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
      throw new Error('No response from AI');
    }

    let analysis = JSON.parse(content);

    return {
      ...analysis,
      metadata: {
        ai_provider: useOpenAI ? 'openai' : 'groq',
        risk_score: riskScore,
        processing_timestamp: new Date().toISOString(),
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
