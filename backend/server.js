app.post("/api/agent", async (req, res) => {
  console.log("Agent route hit");
  console.log("Request body:", req.body);
  console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY not set" });
  }

  try {
    let contents = [];

    // Case 1: frontend sends { messages: [...] }
    if (Array.isArray(req.body.messages)) {
      contents = req.body.messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [
          {
            text:
              typeof m.content === "string"
                ? m.content
                : JSON.stringify(m.content),
          },
        ],
      }));
    }

    // Case 2: frontend sends { message: "hi" }
    else if (typeof req.body.message === "string") {
      contents = [
        {
          role: "user",
          parts: [{ text: req.body.message }],
        },
      ];
    }

    // Case 3: nothing valid received
    else {
      return res.status(400).json({
        error: "Invalid request body. Send either { message: 'hi' } or { messages: [...] }",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API error",
      });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    res.json({ text });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});
