export async function analyzeComplianceCase(input) {
  const { case_type, industry, jurisdiction, description } = input;

  const prompt = `
You are a senior compliance and risk expert specialized in EU financial regulations, including DORA and GDPR.

Analyze the following case in depth.

CASE:
- Type: ${case_type}
- Industry: ${industry}
- Jurisdiction: ${jurisdiction}
- Description: ${description}

REQUIREMENTS:
- Identify at least 4-6 concrete risks
- Reference DORA and GDPR explicitly where relevant
- Highlight contractual, operational, ICT, and data risks
- Provide specific recommendations
- Assign a realistic risk score (0-100)

OUTPUT (JSON ONLY):
{
  "executive_summary": "string",
  "risk_score": number,
  "risk_level": "LOW | MEDIUM | HIGH",
  "key_risks": ["string"],
  "regulatory_gaps": [
    { "regulation": "string", "issue": "string" }
  ],
  "recommendations": ["string"]
}
`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1200,
      temperature: 0.1,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  const raw = data?.content?.[0]?.text || '{}';

  try {
    return JSON.parse(raw);
  } catch (e) {
    return {
      executive_summary: raw,
      risk_score: 60,
      risk_level: 'MEDIUM',
      key_risks: ['Fallback parsing'],
      regulatory_gaps: [],
      recommendations: []
    };
  }
}
