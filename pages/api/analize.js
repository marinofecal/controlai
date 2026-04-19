export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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

    console.log("OPENAI RAW RESPONSE:", JSON.stringify(data, null, 2));

    const result = data.output_text || "No output received";

    res.status(200).json({ result });

  } catch (error) {
    console.error("BACKEND ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}
