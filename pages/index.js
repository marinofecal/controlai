import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/copilot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input })
    });

    const data = await res.json();
    setOutput(data.result);
    setLoading(false);
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>ControlAI Copilot</h1>
      <p>AI for Finance, Controls & Compliance</p>

      <textarea
        rows={6}
        cols={70}
        placeholder="Describe your business scenario..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSubmit}>
        {loading ? "Analyzing..." : "Run Analysis"}
      </button>

      <br /><br />

      <pre style={{ background: "#111", color: "#0f0", padding: 20 }}>
        {output}
      </pre>
    </div>
  );
}
