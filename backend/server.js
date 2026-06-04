const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Debug route
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
    let messages = [];

    // Case 1: frontend sends array directly:
    // [{ role: "user", content: "hi" }]
    if (Array.isArray(req.body)) {
      messages = req.body;
    }

    // Case 2: frontend sends { messages: [...] }
    else if (Array.isArray(req.body.messages)) {
      messages = req.body.messages;
    }

    // Case 3: frontend sends { message: "hi" }
    else if (typeof req.body.message === "string") {
      messages = [{ role: "user", content: req.body.message }];
    }

    // Case 4: frontend sends { prompt: "hi" }
    else if (typeof req.body.prompt === "string") {
      messages = [{ role: "user", content: req.body.prompt }];
    }

    // Case 5: frontend sends { input: "hi" }
    else if (typeof req.body.input === "string") {
      messages = [{ role: "user", content: req.body.input }];
    }

    // Keep only valid user/assistant messages and remove old error messages
    const cleanMessages = messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant"))
      .filter((m) => typeof m.content === "string" && m.content.trim() !== "")
      .filter((m) => !m.content.includes("Sorry, I could not get a response."));

    if (cleanMessages.length === 0) {
      return res.status(400).json({
        error: "No valid message found",
        receivedBody: req.body,
      });
    }

    const contents = cleanMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

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

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    res.json({
      reply,
      text: reply,
      response: reply,
      answer: reply,
    });
  } catch (err) {
    console.error("Server error:", err);

    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});

// Serve frontend files after API routes
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Agent running at http://localhost:${PORT}`);
});
