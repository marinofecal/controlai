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
Risk: ${data.detected_risk}

Summary: ${data.summary}

Recommendations:
- ${data.recommendations.join("\n- ")}
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
      />

      <br /><br />

      <button onClick={runAnalysis}>Run Analysis</button>

      <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
        {output}
      </div>
    </div>
  );
}
