export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { input } = req.body;

    if (!input || input.trim() === "") {
      return res.status(400).json({ error: "No input provided" });
    }

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
      text.includes("recruitment") ||
      text.includes("hiring") ||
      text.includes("cv") ||
      text.includes("credit scoring")
    ) {
      riskLevel = "High Risk";
      recommendations.push(
        "Implement risk management system",
        "Ensure data governance",
        "Enable human oversight in decisions"
      );
    } else if (
      text.includes("chatbot") ||
      text.includes("assistant")
    ) {
      riskLevel = "Limited Risk";
      recommendations.push(
        "Ensure transparency to users",
        "Avoid misleading outputs"
      );
    } else {
      riskLevel = "Minimal Risk";
      recommendations.push(
        "Basic documentation recommended",
        "Monitor usage"
      );
    }

    return res.status(200).json({
      detected_risk: riskLevel,
      summary: "Preliminary AI Act classification based on input description.",
      recommendations,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
