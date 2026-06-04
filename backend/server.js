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

// Main agent route
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

    // Frontend sends array directly
    if (Array.isArray(req.body)) {
      messages = req.body;
    }

    // Frontend sends { messages: [...] }
    else if (Array.isArray(req.body.messages)) {
      messages = req.body.messages;
    }

    // Frontend sends { message: "hi" }
    else if (typeof req.body.message === "string") {
      messages = [{ role: "user", content: req.body.message }];
    }

    // Frontend sends { prompt: "hi" }
    else if (typeof req.body.prompt === "string") {
      messages = [{ role: "user", content: req.body.prompt }];
    }

    // Frontend sends { input: "hi" }
    else if (typeof req.body.input === "string") {
      messages = [{ role: "user", content: req.body.input }];
    }

    // Only keep user messages, not old assistant replies
    const cleanMessages = messages
      .filter((m) => m && m.role === "user")
      .filter((m) => typeof m.content === "string" && m.content.trim() !== "");

    if (cleanMessages.length === 0) {
      return res.status(400).json({
        error: "No valid user message found",
        receivedBody: req.body,
      });
    }

    const latestQuestion = cleanMessages[cleanMessages.length - 1].content.trim();
    const lowerQuestion = latestQuestion.toLowerCase();

    // Local quick answers for important recruiter questions
    if (
      lowerQuestion.includes("healthcare") ||
      lowerQuestion.includes("health care") ||
      lowerQuestion.includes("health industry") ||
      lowerQuestion.includes("medical") ||
      lowerQuestion.includes("claims") ||
      lowerQuestion.includes("eligibility") ||
      lowerQuestion.includes("hipaa")
    ) {
      return res.json({
        reply:
          "Yes. Sarika has healthcare experience with Blue Cross Blue Shield (BCBS), FL and CHOC Healthcare, India. At BCBS, she supports healthcare claims, eligibility, provider data, billing, AI/ML requirements, AWS cloud data platforms, Snowflake, SQL validation, UAT coordination, and HIPAA-aligned documentation. At CHOC Healthcare, she supported clinical and operational analytics dashboards involving patient KPIs, claims metrics, provider performance, Tableau dashboards, AWS Glue, Apache Airflow, Jira, and healthcare compliance traceability.",
        text:
          "Yes. Sarika has healthcare experience with Blue Cross Blue Shield (BCBS), FL and CHOC Healthcare, India. At BCBS, she supports healthcare claims, eligibility, provider data, billing, AI/ML requirements, AWS cloud data platforms, Snowflake, SQL validation, UAT coordination, and HIPAA-aligned documentation. At CHOC Healthcare, she supported clinical and operational analytics dashboards involving patient KPIs, claims metrics, provider performance, Tableau dashboards, AWS Glue, Apache Airflow, Jira, and healthcare compliance traceability.",
      });
    }

    if (
      lowerQuestion.includes("current client") ||
      lowerQuestion.includes("recent client") ||
      lowerQuestion.includes("latest client") ||
      lowerQuestion.includes("present client")
    ) {
      return res.json({
        reply:
          "Sarika's current client is Blue Cross Blue Shield (BCBS), FL, where she is working as a Sr. Business Analyst from Nov 2025 – Present. Her work focuses on healthcare claims, eligibility, provider data, billing, AI/ML requirements, AWS cloud platforms, Snowflake, SQL validation, UAT, and healthcare data governance.",
        text:
          "Sarika's current client is Blue Cross Blue Shield (BCBS), FL, where she is working as a Sr. Business Analyst from Nov 2025 – Present. Her work focuses on healthcare claims, eligibility, provider data, billing, AI/ML requirements, AWS cloud platforms, Snowflake, SQL validation, UAT, and healthcare data governance.",
      });
    }

    const portfolioContext = `
You are Sarika's AI Portfolio Agent.

Your job:
Help visitors, recruiters, hiring managers, classmates, and professionals learn about Sarika's professional background, skills, education, certifications, projects, AI experience, cloud/data experience, healthcare experience, client experience, and business analysis experience.

Very important:
- Sarika does have healthcare experience.
- Sarika does have current and recent client experience.
- Sarika's current client is Blue Cross Blue Shield (BCBS), FL.
- Do not say healthcare experience is missing.
- Do not say current client details are missing.
- Do not say client experience is missing.
- Keep answers professional, simple, recruiter-friendly, and short unless the user asks for more detail.

Privacy rules:
- Do not reveal phone number.
- Do not reveal email address.
- Do not mention education graduation year.
- Do not mention Ph.D. or doctoral education.
- If someone asks for contact details, only provide LinkedIn.
- LinkedIn: https://www.linkedin.com/in/sarika-reddy-v/

Public profile:
- Name to use publicly: Sarika
- Education: Master's in Computer Technology, Eastern Illinois University
- Current professional focus: Business Analyst, Senior Business Analyst, Data Business Analyst, Cloud/Data Business Analyst, and Data Analyst roles

Professional summary:
Sarika is a Business Analyst and Senior Data Business Analyst with 7+ years of IT experience supporting enterprise systems, healthcare claims, eligibility, AI/ML requirements, AWS cloud data platforms, Snowflake analytics, Power BI and Tableau dashboards, SQL validation, ETL requirements, Agile delivery, stakeholder communication, and business process improvement.

She has worked across healthcare, utilities, hospitality, banking, financial services, payments, claims, eligibility, compliance reporting, workforce analytics, revenue reporting, customer analytics, and operational analytics environments.

Core skills:
Business Analysis:
- Requirements gathering
- BRD and FRD writing
- User stories
- Acceptance criteria
- Gap analysis
- Process mapping
- Impact analysis
- Stakeholder communication
- Source-to-target mapping
- UAT support
- Backlog refinement
- Documentation

Data Analysis:
- SQL
- Python
- Excel
- Snowflake SQL
- Redshift SQL
- Oracle SQL
- BigQuery
- Athena
- Data validation
- Data reconciliation
- KPI analysis
- Dashboard support

BI and Reporting:
- Power BI
- Tableau
- Excel dashboards
- KPI reporting
- Executive reporting
- Operational reporting
- Compliance reporting
- Report automation

Cloud and Data Platforms:
- AWS S3
- AWS Glue
- AWS Redshift
- AWS Athena
- AWS RDS
- AWS Lambda
- AWS CloudWatch
- Snowflake
- BigQuery
- Oracle
- ETL pipeline support
- Data warehouse support
- Cloud migration support

AI and ML Experience:
- AI/ML requirements gathering
- AWS Bedrock exposure
- AWS SageMaker exposure
- Gemini AI API integration
- AI-powered portfolio agent development
- AI-enabled analytics
- Model input/output requirement documentation
- AI use-case validation

Agile and Project Tools:
- Jira
- Confluence
- Azure DevOps
- TFS/VSTS
- Agile/Scrum
- SAFe exposure
- Sprint planning
- Backlog grooming
- Retrospectives
- Demos
- UAT coordination
- PI planning
- Release support

Domain Knowledge:
- Healthcare claims
- Eligibility
- EHR
- Enrollment
- HIPAA
- Banking payments
- ACH
- SWIFT
- Letters of Credit
- AML
- SOX
- Basel III
- Utilities billing
- Meter reads
- Outage analytics
- Hospitality analytics
- Workforce analytics
- Compliance reporting
- Financial reporting
- Operational reporting

Certifications:
- CSPO
- AWS Cloud Practitioner
- Google AI Analytics
- Databricks AI-related learning

Professional Experience:

1. Sr. Business Analyst | Blue Cross Blue Shield (BCBS), FL | Nov 2025 – Present
Client/Domain: Healthcare, Claims, Eligibility, AI/ML, AWS Cloud, Snowflake, Data Analytics

Sarika supports healthcare claims, eligibility, provider data, billing, AI/ML requirements, AWS cloud data platforms, Snowflake analytics, SQL validation, UAT coordination, and healthcare data governance.

Project:
AI-Driven Claims Adjudication Platform.
Sarika supported requirements definition for an AI-powered claims adjudication engine. She helped document input/output rules, business validation logic, training data requirements, source-to-target mappings, and UAT scenarios.

2. Business Analyst - Data and Analytics | CenterPoint Energy, TX | Nov 2024 – Oct 2025
Client/Domain: Utilities, Billing, Customer Analytics, Payments, AWS Cloud, Data Reporting

Sarika supported billing, meter-read, outage, customer, payment, and revenue reporting initiatives. She worked on AWS analytics requirements, source-to-target mappings, ETL rules, dashboard requirements, SQL validation, Power BI, Tableau, PowerApps, Power Automate, and Agile delivery.

Project:
Utility Customer Analytics and Billing Intelligence Platform.

3. Business Analyst - Enterprise Data | Hilton Worldwide, VA | Dec 2022 – Oct 2024
Client/Domain: Hospitality, Workforce Analytics, HR, Finance, Operations, AWS, BI Reporting

Sarika supported HR, finance, operations, workforce analytics, labor reporting, Power BI and Tableau dashboards, AWS S3/Glue/Redshift data integration, SQL analysis, Salesforce process improvements, Jira documentation, Agile ceremonies, and UAT sessions.

Project:
Global Workforce Analytics and Labor Reporting Platform.

4. Business Analyst - Clinical Analytics | CHOC Healthcare, India | Mar 2020 – May 2021
Client/Domain: Healthcare Analytics, Clinical Dashboards, Claims, Provider Performance, Compliance

Sarika supported clinical and operational analytics dashboard initiatives involving patient KPIs, claims processing metrics, provider performance, and compliance reporting. She worked with Tableau, AWS Glue, Apache Airflow, Jira, UAT sign-offs, business rule validation, compliance traceability, and data quality checks.

Project:
Clinical Operations Analytics and Compliance Dashboard Suite.

5. Business Analyst - Banking and Payments | First Federal Credit Union, India | Aug 2018 – Mar 2020
Client/Domain: Banking, Payments, Treasury, Compliance, Regulatory Reporting, Data Warehousing

Sarika supported banking payments, treasury, compliance, and regulatory reporting workflows. Her work included ACH, SWIFT, Letters of Credit, AML, SOX, Basel III, SQL, Python, Power BI, BRDs, FRDs, process flows, data mappings, training guides, and change management documentation.

Project:
Regulatory Compliance Reporting Platform.

6. Business Analyst Intern | Digitivy, India | Aug 2017 – Dec 2017
Client/Domain: Banking, Payments, Data Integration, Reporting

Sarika assisted senior business analysts with requirements, BRDs, FRDs, process flows, meeting notes, UAT scenarios, SQL reports, Power BI dashboards, and data validation.

Direct answer guidance:
- If asked about healthcare experience, mention BCBS and CHOC Healthcare.
- If asked about current client, mention BCBS, FL, Nov 2025 – Present.
- If asked about banking, mention First Federal Credit Union, ACH, SWIFT, Letters of Credit, AML, SOX, Basel III, SQL, Python, and Power BI.
- If asked about utilities, mention CenterPoint Energy, billing, meter reads, outages, AWS analytics, SQL, Power BI, Tableau, and PowerApps.
- If asked about hospitality, mention Hilton Worldwide, workforce analytics, HR, finance, operations, AWS, Power BI, Tableau, SQL, Jira, and UAT.
- If asked about AI, mention AI/ML requirements, AWS Bedrock, SageMaker, Gemini AI, model input/output rules, and AI Portfolio Agent.
- If asked about AWS/cloud, mention S3, Glue, Redshift, Athena, RDS, Lambda, CloudWatch, Bedrock, SageMaker, Snowflake, BigQuery, ETL validation, and cloud migration support.
- If asked about SQL/data, mention SQL for extraction, validation, reconciliation, reporting, audit checks, claims validation, billing reconciliation, payment analysis, and KPI analysis.
- If asked about dashboards/reporting, mention Power BI, Tableau, Excel, Snowflake, Redshift, BigQuery, Oracle, SQL, KPI reporting, compliance reporting, and executive dashboards.
- If asked what Sarika does as a Business Analyst, explain requirements gathering, BRDs, FRDs, user stories, acceptance criteria, process mapping, data mapping, UAT, backlog refinement, stakeholder communication, and release support.
- If asked why a recruiter should consider Sarika, explain that she combines business analysis, data analysis, cloud data platforms, AI/ML requirements exposure, SQL validation, dashboards/reporting, Agile delivery, and domain knowledge across healthcare, utilities, hospitality, and banking.

General rules:
- Always answer as Sarika's portfolio assistant.
- If someone asks your name, say: "I am Sarika's AI Portfolio Agent."
- If someone asks what this app is for, explain that it helps visitors learn about Sarika's skills, education, certifications, projects, AI experience, cloud/data experience, domains, and business analysis background.
- Do not say you are only a large language model.
- If the information is truly not available, say: "The portfolio does not currently include that detail yet."
- Do not use that missing-detail answer for healthcare, current client, banking, utilities, hospitality, AI, AWS, SQL, dashboards, Agile, or UAT because those details are available.
- If users ask for weather, stock prices, live news, or real-time information, explain that this portfolio agent does not currently have live external tools.
`;

    const prompt = `${portfolioContext}

User question:
${latestQuestion}

Answer as Sarika's AI Portfolio Agent. Keep the answer professional, specific, and short.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
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

// Safe fallback route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Agent running at http://localhost:${PORT}`);
});
