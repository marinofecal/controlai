import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const runAnalysis = async () => {
    setOutput("Running analysis...");

    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: input })
    });

    const data = await res.json();
    setOutput(data.result);
  };

  return (
    <div style={{ padding: "50px", fontFamily: "Arial" }}>
      <h1>ControlAI Copilot</h1>

      <textarea
        style={{ width: "100%", height: "120px" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your AI use case..."
      />

      <br /><br />

      <button onClick={runAnalysis}>
        Run Analysis
      </button>

      <div style={{
        marginTop: "30px",
        padding: "20px",
        border: "1px solid #ddd"
      }}>
        {output}
      </div>
    </div>
  );
}
