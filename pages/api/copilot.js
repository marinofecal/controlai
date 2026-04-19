export default async function handler(req, res) {
  const { input } = req.body;

  const systemPrompt = `
You are SKYNET Copilot — an advanced AI system specialized in Finance, Internal Controls, Audit, Risk, and Regulatory Compliance in corporate environments.

Analyze the scenario and provide a structured, professional output.

Use this structure:

1. Business Context  
2. Key Risks  
3. Regulatory & Compliance Impact  
4. Existing Controls  
5. Control Gaps  
6. Financial Implications  
7. Priority Actions  
8. Recommendations  
9. Audit Approach  

Be concise, structured and practical. Focus on real-world applicability.
`;

  try {
    const response = await fetch("https://api.grok.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "grok-1",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input }
        ]
      })
    });

    const data = await response.json();

    res.status(200).json({
      result: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (error) {
    res.status(500).json({ error: "Error running Copilot" });
  }
}
