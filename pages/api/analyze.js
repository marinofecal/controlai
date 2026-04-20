export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { input } = req.body;

    // Validación básica
    if (!input || input.trim() === "") {
      return res.status(400).json({ error: "No input provided" });
    }

    // 🔎 Lógica básica (simulación AI Act)
    let riskLevel = "Minimal Risk";
    let recommendations = [];

    const text = input.toLowerCase();

    if (
      text.includes("biometric") ||
      text.includes("facial recognition") ||
      text.includes("surveillance")
    ) {
      riskLevel = "High Risk";
      recommendations.push(
        "Perform conformity assessment",
        "Ensure human oversight",
        "Maintain detailed documentation"
      );
    } else if (
      text.includes("hr") ||
      text.includes("recruitment") ||
      text.includes("credit scoring")
    ) {
      riskLevel = "High Risk";
      recommendations.push(
        "Implement risk management system",
        "Ensure data quality and governance",
        "Enable human review of decisions"
      );
    } else if (
      text.includes("chatbot") ||
      text.includes("ai assistant")
    ) {
      riskLevel = "Limited Risk";
      recommendations.push(
        "Ensure transparency (inform users it's AI)",
        "Avoid misleading outputs"
      );
    } else {
      riskLevel = "Minimal Risk";
      recommendations.push(
        "Basic documentation recommended",
        "Monitor usage"
      );
    }

    // 📦 Respuesta estructurada
    const result = {
      company_size: "SME",
      detected_risk: riskLevel,
      summary: "Preliminary AI Act classification based on input description.",
      recommendations: recommendations,
    };

    return res.status(200).json(result);

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
