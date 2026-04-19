export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `You are an EU AI Act compliance expert.

Analyze this use case and provide:
1. Risk classification
2. Key risks
3. Controls
4. Governance actions

Use case:
${prompt}`
      })
    });

    const data = await response.json();

    const result =
      data.output?.[0]?.content?.[0]?.text ||
      "No response";

    res.status(200).json({ result });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
