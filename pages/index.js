import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const runAnalysis = async () => {
    console.log("CLICK WORKING");

    setOutput("Running analysis...");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: input
        })
      });

      console.log("RESPONSE STATUS:", res.status);

      const data = await res.json();

      console.log("API RESPONSE:", data);

      setOutput(data.result || "No result returned");

    } catch (error) {
      console.error("ERROR:", error);
      setOutput("Error running analysis");
    }
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
