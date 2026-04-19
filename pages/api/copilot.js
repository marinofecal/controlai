export default async function handler(req, res) {
  try {
    const { input } = req.body;

    const systemPrompt = `
You are an expert in finance, audit and compliance.
Respond in structured format with risks, controls and recommendations.
`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input }
        ]
      })
    });

    const data = await response.json();

    console.log("FULL RESPONSE:", data);

    if (!response.ok) {
      return res.status(500).json({
        error: "Grok API error",
        debug: data
      });
    }

    res.status(200).json({
      result: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({
      error: error.message
    });
  }
}
