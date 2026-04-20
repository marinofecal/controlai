import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const runAnalysis = async () => {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      console.log("API RESPONSE:", data);

      if (!response.ok) {
        setOutput("Error running analysis");
        return;
      }

      setOutput(`
AI ACT PRELIMINARY ASSESSMENT
-------------------------------------

Risk Classification: ${data.detected_risk}

Business Interpretation:
Your current AI usage has been classified based on the provided description. This classification reflects potential regulatory exposure under the EU AI Act.

Key Considerations:
- Even low-risk AI systems should be documented
- Internal visibility of AI usage is expected
- Scaling AI usage may increase regulatory obligations

Recommended Actions:
- Maintain documentation of the AI system and its purpose
- Monitor how outputs influence decisions
- Ensure transparency where applicable

Conclusion:
At this stage, your AI usage presents limited regulatory risk. However, implementing early governance practices will reduce future compliance costs and risks.
`);
    } catch (error) {
      console.error(error);
      setOutput("Error running analysis");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>ControlAI Copilot</h1>

      <textarea
        rows="6"
        cols="80"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your AI use case..."
      />

      <br /><br />

      <button onClick={runAnalysis}>Run Analysis</button>

      <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
        {output}
      </div>
    </div>
  );
}
