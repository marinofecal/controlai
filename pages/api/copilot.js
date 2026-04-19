const response = await fetch("https://api.x.ai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "grok-2-latest",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: input }
    ]
  })
});
