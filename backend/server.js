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

  const send = (reply) => {
    return res.json({
      reply,
      text: reply,
      response: reply,
      answer: reply,
    });
  };

  if (!process.env.GEMINI_API_KEY) {
    return send(
      "The backend is working, but the Gemini API key is not configured in Render. Please add GEMINI_API_KEY in Render Environment settings."
    );
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
      return send("Please ask a question about Sarika's profile, skills, projects, or experience.");
    }

    const latestQuestion = cleanMessages[cleanMessages.length - 1].content.trim();
    const lowerQuestion = latestQuestion.toLowerCase();

    // Local answers to save Gemini quota
    if (
      lowerQuestion === "hi" ||
      lowerQuestion === "hello" ||
      lowerQuestion === "hey" ||
      lowerQuestion === "hi!" ||
      lowerQuestion === "hello!"
    ) {
      return send(
        "Hello! I am Sarika's AI Portfolio Agent. You can ask me about Sarika's healthcare experience, current client, AI experience, AWS/cloud skills, SQL experience, dashboards, projects, and business analyst background."
      );
    }

    if (
      lowerQuestion.includes("your name") ||
      lowerQuestion.includes("who are you") ||
      lowerQuestion.includes("what is your name")
    ) {
      return send("I am Sarika's AI Portfolio Agent.");
    }

    if (
      lowerQuestion.includes("what is this app") ||
      lowerQuestion.includes("what this app") ||
      lowerQuestion.includes("app for") ||
      lowerQuestion.includes("purpose")
    ) {
      return send(
        "This app is a basic AI-powered portfolio assistant. It helps visitors learn about Sarika's business analysis, data analysis, AI, cloud, dashboard, domain, project, and professional background."
      );
    }

    if (
      lowerQuestion.includes("healthcare") ||
      lowerQuestion.includes("health care") ||
      lowerQuestion.includes("health industry") ||
      lowerQuestion.includes("medical") ||
      lowerQuestion.includes("claims") ||
      lowerQuestion.includes("eligibility") ||
      lowerQuestion.includes("hipaa")
    ) {
      return send(
        "Yes. Sarika has healthcare experience with Blue Cross Blue Shield (BCBS), FL and CHOC Healthcare, India. At BCBS, she supports healthcare claims, eligibility, provider data, billing, AI/ML requirements, AWS cloud data platforms, Snowflake, SQL validation, UAT coordination, and HIPAA-aligned documentation. At CHOC Healthcare, she supported clinical and operational analytics dashboards involving patient KPIs, claims metrics, provider performance, Tableau dashboards, AWS Glue, Apache Airflow, Jira, and healthcare compliance traceability."
      );
    }

    if (
      lowerQuestion.includes("current client") ||
      lowerQuestion.includes("recent client") ||
      lowerQuestion.includes("latest client") ||
      lowerQuestion.includes("present client") ||
      lowerQuestion.includes("current project")
    ) {
      return send(
        "Sarika's current client is Blue Cross Blue Shield (BCBS), FL, where she is working as a Sr. Business Analyst from Nov 2025 – Present. Her work focuses on healthcare claims, eligibility, provider data, billing, AI/ML requirements, AWS cloud platforms, Snowflake, SQL validation, UAT, and healthcare data governance."
      );
    }

    if (
      lowerQuestion.includes("client") ||
      lowerQuestion.includes("clients") ||
      lowerQuestion.includes("worked with")
    ) {
      return send(
        "Sarika has worked with Blue Cross Blue Shield (BCBS), CenterPoint Energy, Hilton Worldwide, CHOC Healthcare, First Federal Credit Union, and Digitivy. Her domain experience includes healthcare, utilities, hospitality, banking, payments, compliance, reporting, and enterprise data analytics."
      );
    }

    if (
      lowerQuestion.includes("education") ||
      lowerQuestion.includes("degree") ||
      lowerQuestion.includes("university") ||
      lowerQuestion.includes("master")
    ) {
      return send(
        "Sarika has a Master's in Computer Technology from Eastern Illinois University."
      );
    }

    if (
      lowerQuestion.includes("skill") ||
      lowerQuestion.includes("tools") ||
      lowerQuestion.includes("technology") ||
      lowerQuestion.includes("tech stack")
    ) {
      return send(
        "Sarika's key skills include requirements gathering, BRDs, FRDs, user stories, acceptance criteria, gap analysis, process mapping, source-to-target mapping, UAT support, SQL, Python, Excel, Power BI, Tableau, Snowflake, Redshift, Oracle, BigQuery, AWS S3, Glue, Redshift, Athena, Jira, Confluence, Azure DevOps, Agile/Scrum, and AI/ML requirement documentation."
      );
    }

    if (
      lowerQuestion.includes("ai") ||
      lowerQuestion.includes("ml") ||
      lowerQuestion.includes("gemini") ||
      lowerQuestion.includes("bedrock") ||
      lowerQuestion.includes("sagemaker")
    ) {
      return send(
        "Sarika has AI experience through AI/ML requirement gathering for healthcare claims and eligibility workflows, AWS Bedrock and SageMaker-related requirement discussions, model input/output validation rules, AI use-case documentation, and this AI Portfolio Agent project built with Gemini AI, Node.js, Express, JavaScript, and Render."
      );
    }

    if (
      lowerQuestion.includes("aws") ||
      lowerQuestion.includes("cloud") ||
      lowerQuestion.includes("s3") ||
      lowerQuestion.includes("glue") ||
      lowerQuestion.includes("redshift") ||
      lowerQuestion.includes("athena")
    ) {
      return send(
        "Sarika has AWS cloud and data platform experience with S3, Glue, Redshift, Athena, RDS, Lambda, CloudWatch, Bedrock, and SageMaker exposure. She has supported cloud data pipeline requirements, ETL validation, source-to-target mapping, cloud migration support, Snowflake analytics, BigQuery reporting, and AWS-connected dashboard projects."
      );
    }

    if (
      lowerQuestion.includes("sql") ||
      lowerQuestion.includes("data analysis") ||
      lowerQuestion.includes("data analyst") ||
      lowerQuestion.includes("data validation") ||
      lowerQuestion.includes("reconciliation")
    ) {
      return send(
        "Sarika uses SQL for data extraction, validation, reconciliation, reporting, dashboard support, audit checks, claims validation, billing reconciliation, payment analysis, financial reporting, and operational KPI analysis. She has worked with Snowflake SQL, Redshift SQL, Oracle SQL, Athena, RDS, and BigQuery."
      );
    }

    if (
      lowerQuestion.includes("dashboard") ||
      lowerQuestion.includes("power bi") ||
      lowerQuestion.includes("tableau") ||
      lowerQuestion.includes("reporting") ||
      lowerQuestion.includes("kpi")
    ) {
      return send(
        "Sarika has strong dashboard and reporting experience using Power BI, Tableau, Excel, Snowflake, Redshift, BigQuery, Oracle, and SQL. She has supported dashboards for healthcare KPIs, claims metrics, provider performance, billing trends, outage response, revenue performance, workforce analytics, labor reporting, treasury, liquidity, and compliance reporting."
      );
    }

    if (
      lowerQuestion.includes("banking") ||
      lowerQuestion.includes("payment") ||
      lowerQuestion.includes("ach") ||
      lowerQuestion.includes("swift") ||
      lowerQuestion.includes("aml") ||
      lowerQuestion.includes("sox") ||
      lowerQuestion.includes("basel")
    ) {
      return send(
        "Sarika has banking and payments experience with First Federal Credit Union, India. Her work includes credit, deposits, treasury, compliance reporting, ACH, SWIFT, Letters of Credit, AML, SOX, Basel III, SQL validation, Python analysis, Power BI dashboards, data warehouse support, BRDs, FRDs, process flows, and payment lifecycle documentation."
      );
    }

    if (
      lowerQuestion.includes("utilities") ||
      lowerQuestion.includes("utility") ||
      lowerQuestion.includes("billing") ||
      lowerQuestion.includes("meter") ||
      lowerQuestion.includes("outage")
    ) {
      return send(
        "Sarika has utilities experience with CenterPoint Energy, TX as a Business Analyst – Data and Analytics from Nov 2024 – Oct 2025. She supported billing, meter-read, outage, customer, payment, revenue reporting, AWS analytics requirements, source-to-target mappings, ETL validation, Power BI/Tableau dashboards, SQL reconciliation, PowerApps, Power Automate, and Agile delivery."
      );
    }

    if (
      lowerQuestion.includes("hospitality") ||
      lowerQuestion.includes("hilton") ||
      lowerQuestion.includes("workforce") ||
      lowerQuestion.includes("hr") ||
      lowerQuestion.includes("labor")
    ) {
      return send(
        "Sarika has hospitality and enterprise data experience with Hilton Worldwide, VA as a Business Analyst – Enterprise Data from Dec 2022 – Oct 2024. She supported HR, finance, operations, workforce analytics, labor reporting, Power BI/Tableau dashboards, AWS S3/Glue/Redshift data integration, SQL analysis, Salesforce process improvements, Jira documentation, Agile ceremonies, and UAT sessions."
      );
    }

    if (
      lowerQuestion.includes("business analyst") ||
      lowerQuestion.includes("ba experience") ||
      lowerQuestion.includes("requirements") ||
      lowerQuestion.includes("user stories") ||
      lowerQuestion.includes("acceptance criteria")
    ) {
      return send(
        "As a Business Analyst, Sarika gathers and documents requirements, creates BRDs and FRDs, writes user stories and acceptance criteria, conducts gap analysis, process mapping, impact analysis, source-to-target mapping, UAT coordination, backlog refinement, stakeholder communication, dashboard requirements, data validation rules, and release support across healthcare, utilities, hospitality, and banking domains."
      );
    }

    if (
      lowerQuestion.includes("agile") ||
      lowerQuestion.includes("uat") ||
      lowerQuestion.includes("jira") ||
      lowerQuestion.includes("confluence") ||
      lowerQuestion.includes("scrum")
    ) {
      return send(
        "Sarika supports Agile teams through sprint planning, backlog grooming, demos, retrospectives, PI planning, user story creation, acceptance criteria definition, Jira tracking, Confluence documentation, UAT test scenario preparation, defect tracking, QA coordination, stakeholder sign-off, and release validation."
      );
    }

    if (
      lowerQuestion.includes("project") ||
      lowerQuestion.includes("projects") ||
      lowerQuestion.includes("portfolio project")
    ) {
      return send(
        "Some of Sarika's project experience includes AI-Driven Claims Adjudication Platform, Utility Customer Analytics and Billing Intelligence Platform, Global Workforce Analytics and Labor Reporting Platform, Clinical Operations Analytics and Compliance Dashboard Suite, Banking Payments and Regulatory Reporting Platform, and this AI Portfolio Agent built with Gemini AI, Node.js, Express, JavaScript, and Render."
      );
    }

    if (
      lowerQuestion.includes("recruiter") ||
      lowerQuestion.includes("why should") ||
      lowerQuestion.includes("good fit") ||
      lowerQuestion.includes("hire")
    ) {
      return send(
        "Recruiters should consider Sarika because she combines business analysis, data analysis, cloud data platform knowledge, AI/ML requirements exposure, SQL validation, dashboard/reporting experience, Agile delivery, and strong domain knowledge across healthcare, utilities, hospitality, and banking. She can work with stakeholders, product owners, data engineers, QA teams, and business users to turn business needs into clear, testable, and deliverable solutions."
      );
    }

    if (
      lowerQuestion.includes("contact") ||
      lowerQuestion.includes("linkedin") ||
      lowerQuestion.includes("reach")
    ) {
      return send(
        "You can view Sarika's LinkedIn profile here: https://www.linkedin.com/in/sarika-reddy-v/"
      );
    }

    if (
      lowerQuestion.includes("weather") ||
      lowerQuestion.includes("stock") ||
      lowerQuestion.includes("news") ||
      lowerQuestion.includes("today")
    ) {
      return send(
        "This portfolio agent does not currently have live external tools for weather, stock prices, or real-time news. It is focused on answering questions about Sarika's portfolio, skills, projects, and professional background."
      );
    }

    // Fallback Gemini prompt for uncommon questions
    const portfolioContext = `
You are Sarika's AI Portfolio Agent.

Answer questions about Sarika's professional background using the profile below.

Privacy rules:
- Do not reveal phone number or email.
- Do not mention education graduation year.
- Do not mention Ph.D. or doctoral education.
- If asked for contact details, provide only LinkedIn: https://www.linkedin.com/in/sarika-reddy-v/

Profile:
- Name to use publicly: Sarika
- Education: Master's in Computer Technology, Eastern Illinois University
- Current client: Blue Cross Blue Shield (BCBS), FL
- Current role: Sr. Business Analyst
- Current duration: Nov 2025 – Present
- Professional focus: Business Analyst, Senior Business Analyst, Data Business Analyst, Cloud/Data Business Analyst, and Data Analyst roles

Experience summary:
Sarika has 7+ years of IT experience supporting enterprise systems, healthcare claims, eligibility, AI/ML requirements, AWS cloud data platforms, Snowflake analytics, Power BI/Tableau dashboards, SQL validation, ETL requirements, Agile delivery, stakeholder communication, and business process improvement.

Domains:
Healthcare, utilities, hospitality, banking, financial services, payments, compliance reporting, workforce analytics, revenue reporting, customer analytics, and operational analytics.

Clients:
- Blue Cross Blue Shield (BCBS), FL | Sr. Business Analyst | Nov 2025 – Present
- CenterPoint Energy, TX | Business Analyst – Data and Analytics | Nov 2024 – Oct 2025
- Hilton Worldwide, VA | Business Analyst – Enterprise Data | Dec 2022 – Oct 2024
- CHOC Healthcare, India | Business Analyst – Clinical Analytics | Mar 2020 – May 2021
- First Federal Credit Union, India | Business Analyst – Banking and Payments | Aug 2018 – Mar 2020
- Digitivy, India | Business Analyst Intern | Aug 2017 – Dec 2017

Skills:
Requirements gathering, BRDs, FRDs, user stories, acceptance criteria, gap analysis, process mapping, source-to-target mapping, UAT, Jira, Confluence, Agile/Scrum, SQL, Python, Excel, Power BI, Tableau, Snowflake, Redshift, Oracle, BigQuery, AWS S3, Glue, Redshift, Athena, RDS, Lambda, CloudWatch, Bedrock, SageMaker, AI/ML requirements, and dashboard reporting.

Projects:
AI-Driven Claims Adjudication Platform, Utility Customer Analytics and Billing Intelligence Platform, Global Workforce Analytics and Labor Reporting Platform, Clinical Operations Analytics and Compliance Dashboard Suite, Banking Payments and Regulatory Reporting Platform, and AI Portfolio Agent built with Gemini AI, Node.js, Express, JavaScript, and Render.

Rules:
- Always answer as Sarika's AI Portfolio Agent.
- Keep answers professional, recruiter-friendly, and short.
- Sarika does have healthcare experience.
- Sarika does have current client experience.
- Do not say healthcare, current client, AI, AWS, SQL, dashboard, Agile, UAT, banking, utilities, or hospitality details are missing.
`;

    const prompt = `${portfolioContext}

User question:
${latestQuestion}

Answer as Sarika's AI Portfolio Agent. Keep the answer professional, specific, and short.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

      // Do not break frontend if Gemini quota is exhausted
      if (response.status === 429) {
        return send(
          "Gemini daily quota is currently reached, but I can still answer common portfolio questions. Try asking about Sarika's healthcare experience, current client, AI experience, AWS skills, SQL experience, dashboards, projects, or business analyst background."
        );
      }

      return send(
        data.error?.message ||
          "Gemini is currently unavailable. Please ask a portfolio-related question such as healthcare experience, current client, AI experience, AWS skills, SQL, dashboards, or projects."
      );
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I can help with Sarika's portfolio, skills, projects, and experience. Please ask a portfolio-related question.";

    return send(reply);
  } catch (err) {
    console.error("Server error:", err);

    return send(
      "The server handled the request, but something went wrong. Please ask about Sarika's healthcare experience, current client, AI experience, AWS/cloud skills, SQL, dashboards, projects, or business analyst background."
    );
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
