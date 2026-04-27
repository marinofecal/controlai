import Groq from 'groq-sdk';
import OpenAI from 'openai';

// Inicializar clientes
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt profesional para compliance
const SYSTEM_PROMPT = `Eres ControlAI, un experto en cumplimiento normativo europeo con 25+ años de experiencia en Big 4 consulting.

Tu objetivo: Analizar casos de compliance regulatorio con máxima precisión.

IMPORTANTE - SIEMPRE devuelve JSON válido con esta estructura:
{
  "summary": "Resumen ejecutivo breve",
  "risk_score": 0-100,
  "compliance_probability": 0-100,
  "applicable_regulations": [
    {
      "regulation_id": "REG-ID",
      "name": "Nombre regulación",
      "articles": ["Art. X", "Art. Y"],
      "relevance": 0-100,
      "enforcement_body": "Autoridad"
    }
  ],
  "identified_gaps": [
    {
      "gap_id": "GAP-001",
      "category": "Categoría",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "description": "Descripción detallada",
      "business_impact": "Impacto en negocio",
      "remediation_options": [
        {
          "option": "Solución 1",
          "effort": "1-3 días",
          "cost_estimate": "EUR 5,000",
          "risk_reduction": 75
        }
      ]
    }
  ],
  "action_plan": [
    {
      "priority": 1-5,
      "action": "Acción específica",
      "owner": "Rol responsable",
      "deadline": "2024-05-15",
      "estimated_cost": "EUR X",
      "success_criteria": ["Criterio 1", "Criterio 2"]
    }
  ],
  "next_steps": ["Paso 1", "Paso 2", "Paso 3"],
  "estimated_remediation_cost": "EUR X",
  "estimated_timeline": "X semanas"
}

REGLAS:
1. Identifica TODAS las regulaciones aplicables (EU, nacional, sector)
2. Cita artículos específicos, no generalidades
3. Sé conservador: assume worst-case scenario
4. Proporciona opciones de remediación viables
5. Incluye estimaciones de costo y timeline
6. Responde SIEMPRE en español
7. Formato: JSON válido, NADA más`;

// Función para calcular riesgo basado en palabras clave
function calculateRiskScore(content) {
  const criticalKeywords = [
    'dinero', 'fondos', 'datos', 'privacidad', 'seguridad',
    'paciente', 'medicamento', 'banco', 'fraude', 'criminal'
  ];
  
  const contentLower = content.toLowerCase();
  const riskKeywordCount = criticalKeywords.filter(kw => 
    contentLower.includes(kw)
  ).length;

  // Score base según palabras clave
  let baseScore = riskKeywordCount * 10;
  baseScore = Math.min(baseScore, 70); // Max 70 para bajo riesgo

  return baseScore;
}

// Función para decidir qué API usar
function shouldUseOpenAI(riskScore, caseType) {
  // Usa OpenAI para casos de ALTO RIESGO o tipos complejos
  const complexCaseTypes = ['CRIMINAL', 'FINANCIAL_CRIME', 'DATA_BREACH', 'HEALTHCARE'];
  
  if (riskScore > 75) return true;
  if (complexCaseTypes.includes(caseType)) return true;
  
  return false; // Usa Groq por defecto (80% de casos)
}

// Función principal de análisis
export async function analyzeCompliance(caseData) {
  try {
    // Validar input
    if (!caseData || !caseData.description) {
      throw new Error('Case description is required');
    }

    // Calcular riesgo
    const riskScore = calculateRiskScore(caseData.description);
    const useOpenAI = shouldUseOpenAI(riskScore, caseData.case_type);

    console.log(`[ControlAI] Risk Score: ${riskScore}, Using: ${useOpenAI ? 'OpenAI' : 'Groq'}`);

    // Preparar mensaje del usuario
    const userMessage = `CASO DE ANÁLISIS:
Tipo: ${caseData.case_type || 'GENERAL_COMPLIANCE'}
Industria: ${caseData.industry || 'General'}
Jurisdicciones: ${caseData.jurisdictions?.join(', ') || 'EU'}
Descripción: ${caseData.description}
${caseData.additional_context ? `Contexto adicional: ${caseData.additional_context}` : ''}`;

    let response;

    // ESTRATEGIA HÍBRIDA
    if (useOpenAI) {
      // OpenAI para casos de alto riesgo (máxima precisión)
      console.log('[ControlAI] Using OpenAI GPT-4o Mini for HIGH RISK case');
      response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.2, // Más bajo = más consistente y preciso
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });
    } else {
      // Groq para casos normales (rápido y económico)
      console.log('[ControlAI] Using Groq Llama 3.1 70B for STANDARD case');
      response = await groq.chat.completions.create({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });
    }

    // Extraer contenido
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI model');
    }

    // Parsear JSON
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error('Invalid JSON response from AI model');
    }

    // Enriquecer resultado
    return {
      ...analysis,
      metadata: {
        ai_provider: useOpenAI ? 'openai-gpt-4o-mini' : 'groq-llama-3.1-70b',
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

// Función para análisis batch (múltiples casos)
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

// Función para validar response format
export function validateAnalysisResponse(analysis) {
  const requiredFields = [
    'summary',
    'risk_score',
    'compliance_probability',
    'applicable_regulations',
    'identified_gaps',
    'action_plan',
    'metadata',
  ];

  const missingFields = requiredFields.filter(field => !(field in analysis));
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  return true;
}

export default {
  analyzeCompliance,
  analyzeBatch,
  validateAnalysisResponse,
};
