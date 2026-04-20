const response = await fetch("/api/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ input }),
});

const data = await response.json();

if (!response.ok) {
  setOutput("Error running analysis");
  return;
}

// 👉 Mostrar bien el resultado
setOutput(`
Risk: ${data.detected_risk}

Summary: ${data.summary}

Recommendations:
- ${data.recommendations.join("\n- ")}
`);
