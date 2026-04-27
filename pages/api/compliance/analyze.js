import { analyzeCompliance, validateAnalysisResponse } from '@/lib/ai-hybrid';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Tipos de casos válidos
const VALID_CASE_TYPES = [
  'GDPR_COMPLIANCE',
  'FINANCIAL_REGULATION',
  'HEALTHCARE_COMPLIANCE',
  'DATA_PROTECTION',
  'GENERAL_COMPLIANCE',
  'CRIMINAL',
  'FINANCIAL_CRIME',
  'DATA_BREACH',
];

// Validar input
function validateInput(body) {
  const { case_type, industry, description, jurisdictions } = body;

  if (!description || description.trim().length < 50) {
    throw new Error('Description must be at least 50 characters');
  }

  if (case_type && !VALID_CASE_TYPES.includes(case_type)) {
    throw new Error(`Invalid case_type. Must be one of: ${VALID_CASE_TYPES.join(', ')}`);
  }

  return {
    case_type: case_type || 'GENERAL_COMPLIANCE',
    industry: industry || 'General',
    description: description.trim(),
    jurisdictions: jurisdictions || ['EU'],
    additional_context: body.additional_context || null,
  };
}

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validar input
    const caseData = validateInput(req.body);

    console.log('[API] Starting compliance analysis:', {
      case_type: caseData.case_type,
      industry: caseData.industry,
      timestamp: new Date().toISOString(),
    });

    // Análisis con motor híbrido
    const analysis = await analyzeCompliance(caseData);

    // Validar response
    validateAnalysisResponse(analysis);

    // Guardar en Supabase (opcional)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { data, error } = await supabase
          .from('compliance_analyses')
          .insert([
            {
              case_type: caseData.case_type,
              industry: caseData.industry,
              description: caseData.description,
              jurisdictions: caseData.jurisdictions,
              risk_score: analysis.risk_score,
              compliance_probability: analysis.compliance_probability,
              ai_provider: analysis.metadata.ai_provider,
              analysis_result: analysis,
              created_at: new Date().toISOString(),
            },
          ])
          .select();

        if (error) {
          console.warn('[API] Supabase insert warning:', error);
          // No fallar si Supabase no funciona, solo advertir
        } else {
          console.log('[API] Analysis saved to Supabase:', data?.[0]?.id);
        }
      } catch (dbError) {
        console.warn('[API] Database error (non-blocking):', dbError.message);
      }
    }

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      data: analysis,
      message: 'Compliance analysis completed successfully',
    });
  } catch (error) {
    console.error('[API] Error:', error);

    // Errores específicos
    if (error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: 'API configuration error. Check environment variables.',
        details: error.message,
      });
    }

    if (error.message.includes('validation')) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.message,
      });
    }

    // Error genérico
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message,
    });
  }
}
