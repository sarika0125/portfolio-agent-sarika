const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Debug route to check backend and Gemini key
app.get("/api/debug", (req, res) => {
  res.json({
    status: "backend working",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Gemini agent route
app.post("/api/agent", async (req, res) => {
  console.log("Agent route hit");
  console.log("Request body:", req.body);
  console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY not set",
    });
  }

  try {
    let contents = [];

    // If frontend sends: { messages: [...] }
    if (Array.isArray(req.body.messages)) {
      contents = req.body.messages.map((m) => ({
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

    // If frontend sends: { message: "hi" }
    else if (typeof req.body.message === "string") {
      contents = [
        {
          role: "user",
          parts: [{ text: req.body.message }],
        },
      ];
    }

    // If frontend sends something else
    else {
      return res.status(400).json({
        error:
          "Invalid request body. Send either { message: 'hi' } or { messages: [...] }",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return res.status(response.status).json({
        error: data.error?.message || "Gemini API error",
        details: data,
      });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    // Return both names so frontend can read either data.reply or data.text
    res.json({
      reply: text,
      text: text,
    });
  } catch (err) {
    console.error("Server error:", err);

    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

// Frontend fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`NEW SERVER CODE RUNNING - Agent running at http://localhost:${PORT}`);
});
