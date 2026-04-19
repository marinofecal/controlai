const data = await response.json();

console.log("FULL RESPONSE:", data);

if (!data.choices || !data.choices[0]) {
  return res.status(500).json({
    error: "Invalid response from Grok",
    debug: data
  });
}
