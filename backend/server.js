const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Debug route to check backend and Gemini key
app.get("/api/debug", (req, res) => {
  res.json({
    status: "backend working",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Gemini Portfolio Agent route
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

    // Clean valid messages only
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

    // Portfolio context/instructions
    const portfolioContext = `
You are Sarika's AI Portfolio Agent.

Your name is Sarika Portfolio Agent.

You help visitors learn about Sarika Reddy Vontary's professional background, skills, projects, education, and technical experience.

Profile:
- Name: Sarika Reddy Vontary
- Role focus: Business Data Analyst, Business Analyst, Data Analyst
- Skills: SQL, Python, Excel, Tableau, Power BI, Jira, Confluence, data mapping, user stories, acceptance criteria, requirements gathering, stakeholder communication, dashboards, reporting, UAT support, process improvement, and project coordination.
- Project: AI-powered portfolio agent built using Gemini AI, Node.js, Express, JavaScript, and Render.
- Education: Ph.D. in Business with a Project Management focus.
- Interests: business analysis, data analysis, project management, dashboards, AI tools, cloud deployment, and backend API integration.

Rules:
- Always answer as Sarika's portfolio assistant.
- If someone asks your name, say: "I am Sarika's AI Portfolio Agent."
- If someone asks what this app is for, explain that it helps visitors learn about Sarika's skills, projects, education, and technical background.
- Do not say you are only a large language model.
- Do not make up company names or fake experience.
- If information is not available, say the portfolio does not currently include that detail yet.
- Keep answers professional, simple, and helpful.
- If users ask for weather, stock prices, live news, or real-time information, explain that this portfolio agent does not currently have live external tools for that.
`;

    const contents = [
      {
        role: "user",
        parts: [{ text: portfolioContext }],
      },
      ...cleanMessages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

// Frontend fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Agent running at http://localhost:${PORT}`);
});
