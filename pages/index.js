import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/copilot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input })
    });

    const data = await res.json();
    setOutput(data.result);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>ControlAI Copilot</h1>

      <textarea
        rows={5}
        cols={60}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your scenario..."
      />

      <br /><br />

      <button onClick={handleSubmit}>Run Analysis</button>

      <pre>{output}</pre>
    </div>
  );
}
