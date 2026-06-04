const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/debug", (req, res) => {
  res.json({
    status: "backend working",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

const resumeData = {
  name: "Sarika",
  email: "vontarys@gmail.com",
  linkedin: "https://www.linkedin.com/in/sarika-reddy-v/",
  education: "Master's in Computer Technology, Eastern Illinois University",
  experienceYears: "7+ years of IT experience",
  currentFocus:
    "Business Analyst, Senior Business Analyst, Data Business Analyst, Cloud/Data Business Analyst, and Data Analyst roles",

  clients: [
    {
      name: "Blue Cross Blue Shield (BCBS), FL",
      role: "Sr. Business Analyst",
      dates: "Nov 2025 – Present",
      industry: "Healthcare",
      project: "AI-Driven Claims Adjudication Platform",
      summary:
        "Sarika supports healthcare claims, eligibility, provider data, billing, AI/ML requirements, AWS cloud data platforms, Snowflake analytics, SQL validation, UAT coordination, and healthcare data governance.",
      tools:
        "AWS Bedrock, SageMaker, S3, Glue, Redshift, Snowflake, SQL, Jira, healthcare claims data, eligibility data, provider data",
    },
    {
      name: "CenterPoint Energy, TX",
      role: "Business Analyst – Data and Analytics",
      dates: "Nov 2024 – Oct 2025",
      industry: "Utilities",
      project: "Utility Customer Analytics and Billing Intelligence Platform",
      summary:
        "Sarika supported billing, meter-read, outage, customer, payment, and revenue reporting initiatives. She worked on AWS analytics requirements, source-to-target mappings, ETL rules, dashboard requirements, SQL validation, Power BI, Tableau, PowerApps, Power Automate, and Agile delivery.",
      tools:
        "AWS S3, Glue, Athena, Redshift, Power BI, Tableau, Snowflake, Oracle, SQL, PowerApps, Power Automate, Jira",
    },
    {
      name: "Hilton Worldwide, VA",
      role: "Business Analyst – Enterprise Data",
      dates: "Dec 2022 – Oct 2024",
      industry: "Hospitality",
      project: "Global Workforce Analytics and Labor Reporting Platform",
      summary:
        "Sarika supported HR, finance, operations, workforce analytics, labor reporting, enterprise dashboards, AWS-based data integration, SQL analysis, Salesforce process improvements, Jira documentation, Agile ceremonies, and UAT sessions.",
      tools:
        "Power BI, Tableau, AWS S3, Glue, Redshift, SQL, Jira, Confluence, Salesforce process documentation",
    },
    {
      name: "CHOC Healthcare, India",
      role: "Business Analyst – Clinical Analytics",
      dates: "Mar 2020 – May 2021",
      industry: "Healthcare Analytics",
      project: "Clinical Operations Analytics and Compliance Dashboard Suite",
      summary:
        "Sarika supported clinical and operational analytics dashboards involving patient KPIs, claims processing metrics, provider performance, compliance reporting, Tableau dashboards, AWS Glue workflows, Apache Airflow coordination, Jira reporting, UAT sign-offs, and healthcare compliance traceability.",
      tools:
        "Tableau, AWS Glue, Apache Airflow, Jira, healthcare data, claims metrics, provider performance data",
    },
    {
      name: "First Federal Credit Union, India",
      role: "Business Analyst – Banking and Payments",
      dates: "Aug 2018 – Mar 2020",
      industry: "Banking and Payments",
      project: "Regulatory Compliance Reporting Platform",
      summary:
        "Sarika supported banking payments, treasury, compliance, and regulatory reporting workflows involving ACH, SWIFT, Letters of Credit, AML, SOX, Basel III, SQL, Python, Power BI, BRDs, FRDs, process flows, data mappings, and change management documentation.",
      tools:
        "SQL, Python, Power BI, banking systems, ACH, SWIFT, AML, SOX, Basel III, treasury reporting",
    },
    {
      name: "Digitivy, India",
      role: "Business Analyst Intern",
      dates: "Aug 2017 – Dec 2017",
      industry: "Banking, Payments, Data Integration, Reporting",
      project: "Payment Integration and Banking Reporting Support",
      summary:
        "Sarika assisted senior business analysts with requirements, BRDs, FRDs, process flows, meeting notes, UAT scenarios, SQL reports, Power BI dashboards, and data validation.",
      tools:
        "SQL, Power BI, Jira, Confluence, BRDs, FRDs, process flows, UAT support",
    },
  ],

  skills: {
    businessAnalysis:
      "Requirements gathering, BRDs, FRDs, user stories, acceptance criteria, gap analysis, process mapping, impact analysis, root cause analysis, stakeholder communication, source-to-target mapping, UAT support, backlog refinement, documentation, SDLC, and release support.",
    dataAnalysis:
      "SQL, Python, Excel, Snowflake SQL, Redshift SQL, Oracle SQL, BigQuery, Athena, RDS, data validation, reconciliation, data quality, KPI analysis, and reporting analysis.",
    dashboards:
      "Power BI, Tableau, Excel dashboards, KPI reporting, executive reporting, operational reporting, compliance reporting, report automation, dashboard requirements, and dashboard validation.",
    cloud:
      "AWS S3, Glue, Redshift, Athena, RDS, Lambda, CloudWatch, Bedrock, SageMaker exposure, Snowflake, BigQuery, Oracle, ETL pipeline support, data warehouse support, and cloud migration support.",
    aws:
      "AWS S3, Glue, Redshift, Athena, RDS, Lambda, CloudWatch, Bedrock, and SageMaker exposure. Sarika has supported AWS data pipeline requirements, ETL validation, source-to-target mapping, cloud migration support, dashboard data integration, and AI/ML requirement discussions.",
    gcp:
      "GCP exposure through BigQuery, cloud analytics, enterprise reporting, data validation, and dashboard-related data analysis use cases.",
    azure:
      "Azure-related experience through Azure DevOps, Agile backlog tracking, requirements management, UAT coordination, and collaboration with cloud/data delivery teams.",
    ai:
      "AI/ML requirements gathering, AWS Bedrock exposure, AWS SageMaker exposure, Gemini AI API integration, AI-powered portfolio agent development, AI-enabled analytics, model input/output requirement documentation, AI use-case validation, and healthcare claims AI/ML workflow support.",
    agile:
      "Jira, Confluence, Azure DevOps, TFS/VSTS, Agile/Scrum, SAFe exposure, sprint planning, backlog grooming, retrospectives, demos, UAT coordination, PI planning, release support, defect tracking, and stakeholder sign-off.",
    domains:
      "Healthcare claims, eligibility, EHR, enrollment, HIPAA, provider data, billing, banking payments, ACH, SWIFT, Letters of Credit, AML, SOX, Basel III, utilities billing, meter reads, outage analytics, hospitality analytics, workforce analytics, compliance reporting, financial reporting, and operational reporting.",
    languages:
      "SQL, Python, and JavaScript. Sarika uses SQL heavily for data analysis, validation, reconciliation, reporting, and dashboard support; Python for analysis and data-related tasks; and JavaScript/Node.js/Express for her AI portfolio agent project.",
  },

  certifications:
    "CSPO, AWS Cloud Practitioner, Google AI Analytics, and Databricks AI-related learning.",

  portfolioProject:
    "Sarika built this AI Portfolio Agent using Gemini AI, Node.js, Express, JavaScript, and Render. The project demonstrates Gemini API integration, backend development, environment variable handling, API troubleshooting, frontend-backend communication, local recruiter-style responses, and cloud deployment.",
};

const sendResponse = (res, reply) => {
  return res.json({
    reply,
    text: reply,
    response: reply,
    answer: reply,
  });
};

const includesAny = (text, words) => {
  return words.some((word) => text.includes(word));
};

const clientLine = (client) => {
  return `${client.name} | ${client.role} | ${client.dates} | ${client.industry}`;
};

app.post("/api/agent", async (req, res) => {
  console.log("Agent route hit");
  console.log("Request body:", req.body);
  console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

  try {
    let messages = [];

    if (Array.isArray(req.body)) {
      messages = req.body;
    } else if (Array.isArray(req.body.messages)) {
      messages = req.body.messages;
    } else if (typeof req.body.message === "string") {
      messages = [{ role: "user", content: req.body.message }];
    } else if (typeof req.body.prompt === "string") {
      messages = [{ role: "user", content: req.body.prompt }];
    } else if (typeof req.body.input === "string") {
      messages = [{ role: "user", content: req.body.input }];
    }

    const cleanMessages = messages
      .filter((m) => m && m.role === "user")
      .filter((m) => typeof m.content === "string" && m.content.trim() !== "");

    if (cleanMessages.length === 0) {
      return sendResponse(
        res,
        "Please ask a question about Sarika's resume, skills, projects, clients, education, cloud experience, dashboards, or business analyst background."
      );
    }

    const latestQuestion = cleanMessages[cleanMessages.length - 1].content.trim();
    const lowerQuestion = latestQuestion.toLowerCase();

    const currentClient = resumeData.clients[0];
    const previousClient = resumeData.clients[1];
    const clientBeforePrevious = resumeData.clients[2];

    if (["hi", "hello", "hey", "hi!", "hello!"].includes(lowerQuestion)) {
      return sendResponse(
        res,
        "Hello! I am Sarika's AI Portfolio Agent. You can ask me about Sarika's current client, previous client, total experience, industries, projects, tools, cloud experience, dashboards, SQL, AI experience, or business analyst background."
      );
    }

    if (
      includesAny(lowerQuestion, [
        "email",
        "e-mail",
        "contact",
        "linkedin",
        "reach",
      ])
    ) {
      return sendResponse(
        res,
        `You can contact Sarika by email at ${resumeData.email}. You can also view her LinkedIn profile here: ${resumeData.linkedin}. Phone number is not shared through this portfolio agent.`
      );
    }

    if (
      includesAny(lowerQuestion, [
        "your name",
        "who are you",
        "what is your name",
      ])
    ) {
      return sendResponse(res, "I am Sarika's AI Portfolio Agent.");
    }

    if (
      includesAny(lowerQuestion, [
        "what is this app",
        "what this app",
        "app for",
        "purpose",
        "portfolio agent",
      ])
    ) {
      return sendResponse(
        res,
        "This app is a resume-based AI portfolio assistant. It helps recruiters and visitors ask questions about Sarika's experience, clients, projects, skills, tools, cloud platforms, dashboards, and business analysis background."
      );
    }

    if (
      includesAny(lowerQuestion, [
        "education",
        "degree",
        "university",
        "master",
      ])
    ) {
      return sendResponse(res, resumeData.education);
    }

    if (
      includesAny(lowerQuestion, [
        "how many years",
        "years of experience",
        "total experience",
        "experience does she have",
        "overall experience",
      ])
    ) {
      return sendResponse(
        res,
        `Sarika has ${resumeData.experienceYears}. Her resume experience spans Business Analyst, Senior Business Analyst, Data Business Analyst, Cloud/Data Business Analyst, and Data Analyst responsibilities across healthcare, utilities, hospitality, banking, payments, compliance, and enterprise reporting domains.`
      );
    }

    if (
      includesAny(lowerQuestion, [
        "current client",
        "present client",
        "current project",
        "currently working",
        "current role",
      ])
    ) {
      return sendResponse(
        res,
        `Sarika's current client is ${currentClient.name}, where she is working as a ${currentClient.role} from ${currentClient.dates}. Her current project is ${currentClient.project}. ${currentClient.summary}`
      );
    }

    if (
      includesAny(lowerQuestion, [
        "previous client",
        "last client",
        "prior client",
        "before current",
        "client before bcbs",
        "previous project",
        "last project",
      ])
    ) {
      return sendResponse(
        res,
        `Sarika's previous client before BCBS was ${previousClient.name}, where she worked as a ${previousClient.role} from ${previousClient.dates}. Her previous project was ${previousClient.project}. ${previousClient.summary}`
      );
    }

    if (
      includesAny(lowerQuestion, [
        "before previous",
        "before centerpoint",
        "client before centerpoint",
        "project before centerpoint",
      ])
    ) {
      return sendResponse(
        res,
        `Before CenterPoint Energy, Sarika worked with ${clientBeforePrevious.name} as a ${clientBeforePrevious.role} from ${clientBeforePrevious.dates}. The project was ${clientBeforePrevious.project}. ${clientBeforePrevious.summary}`
      );
    }

    if (
      includesAny(lowerQuestion, [
        "client history",
        "all clients",
        "clients list",
        "list of clients",
        "what clients",
        "which clients",
        "client details",
        "client experience",
      ])
    ) {
      const list = resumeData.clients.map((c, i) => `${i + 1}. ${clientLine(c)}`).join("\n");
      return sendResponse(res, `Sarika's client history:\n${list}`);
    }

    if (
      includesAny(lowerQuestion, [
        "project history",
        "all projects",
        "project list",
        "projects worked",
        "what projects",
        "which projects",
      ])
    ) {
      const list = resumeData.clients
        .map((c, i) => `${i + 1}. ${c.project} - ${c.name}, ${c.dates}`)
        .join("\n");
      return sendResponse(res, `Sarika's project experience includes:\n${list}\n7. AI Portfolio Agent - Built using Gemini AI, Node.js, Express, JavaScript, and Render.`);
    }

    if (
      includesAny(lowerQuestion, [
        "healthcare",
        "health care",
        "health industry",
        "medical",
        "claims",
        "eligibility",
        "hipaa",
        "provider data",
        "healthcare client",
      ])
    ) {
      return sendResponse(
        res,
        "Yes. Sarika has healthcare experience with Blue Cross Blue Shield (BCBS), FL and CHOC Healthcare, India. At BCBS, she supports healthcare claims, eligibility, provider data, billing, AI/ML requirements, AWS cloud data platforms, Snowflake, SQL validation, UAT coordination, and HIPAA-aligned documentation. At CHOC Healthcare, she supported clinical and operational analytics dashboards involving patient KPIs, claims metrics, provider performance, Tableau dashboards, AWS Glue, Apache Airflow, Jira, and healthcare compliance traceability."
      );
    }

    if (
      includesAny(lowerQuestion, [
        "industry",
        "industries",
        "domain",
        "domains",
        "business domain",
      ])
    ) {
      return sendResponse(
        res,
        `Sarika has domain experience in ${resumeData.skills.domains}`
      );
    }

    if (
      includesAny(lowerQuestion, [
        "skill",
        "skills",
        "tools",
        "technology",
        "tech stack",
        "technical skills",
      ])
    ) {
      return sendResponse(
        res,
        `Sarika's key skills include:\nBusiness Analysis: ${resumeData.skills.businessAnalysis}\nData Analysis: ${resumeData.skills.dataAnalysis}\nBI/Reporting: ${resumeData.skills.dashboards}\nCloud/Data Platforms: ${resumeData.skills.cloud}`
      );
    }

    if (
      includesAny(lowerQuestion, [
        "language",
        "languages",
        "programming",
        "coding",
        "javascript",
        "python",
      ])
    ) {
      return sendResponse(res, resumeData.skills.languages);
    }

    if (
      /\bai\b/.test(lowerQuestion) ||
      /\bml\b/.test(lowerQuestion) ||
      includesAny(lowerQuestion, [
        "artificial intelligence",
        "machine learning",
        "gemini",
        "bedrock",
        "sagemaker",
        "ai experience",
        "ml experience",
      ])
    ) {
      return sendResponse(res, resumeData.skills.ai);
    }

    if (
      includesAny(lowerQuestion, [
        "cloud",
        "cloud experience",
        "cloud platforms",
      ])
    ) {
      return sendResponse(
        res,
        `Sarika has cloud/data platform experience across AWS, GCP, and Azure-related environments. AWS: ${resumeData.skills.aws} GCP: ${resumeData.skills.gcp} Azure: ${resumeData.skills.azure}`
      );
    }

    if (
      includesAny(lowerQuestion, [
        "aws",
        "s3",
        "glue",
        "redshift",
        "athena",
        "lambda",
        "cloudwatch",
      ])
    ) {
      return sendResponse(res, resumeData.skills.aws);
    }

    if (
      includesAny(lowerQuestion, ["gcp", "google cloud", "bigquery"])
    ) {
      return sendResponse(res, resumeData.skills.gcp);
    }

    if (
      includesAny(lowerQuestion, ["azure", "azure devops"])
    ) {
      return sendResponse(res, resumeData.skills.azure);
    }

    if (
      includesAny(lowerQuestion, [
        "sql",
        "data analysis",
        "data analyst",
        "data validation",
        "reconciliation",
        "data quality",
      ])
    ) {
      return sendResponse(res, resumeData.skills.dataAnalysis);
    }

    if (
      includesAny(lowerQuestion, [
        "dashboard",
        "dashboards",
        "power bi",
        "tableau",
        "reporting",
        "kpi",
        "reports",
      ])
    ) {
      return sendResponse(res, resumeData.skills.dashboards);
    }

    if (
      includesAny(lowerQuestion, [
        "banking",
        "payment",
        "payments",
        "ach",
        "swift",
        "aml",
        "sox",
        "basel",
        "treasury",
      ])
    ) {
      const banking = resumeData.clients[4];
      return sendResponse(
        res,
        `Sarika has banking and payments experience with ${banking.name}, where she worked as a ${banking.role} from ${banking.dates}. ${banking.summary}`
      );
    }

    if (
      includesAny(lowerQuestion, [
        "utilities",
        "utility",
        "billing",
        "meter",
        "outage",
        "centerpoint",
      ])
    ) {
      const utilities = resumeData.clients[1];
      return sendResponse(
        res,
        `Sarika has utilities experience with ${utilities.name}, where she worked as a ${utilities.role} from ${utilities.dates}. ${utilities.summary}`
      );
    }

    if (
      includesAny(lowerQuestion, [
        "hospitality",
        "hilton",
        "workforce",
        "hr",
        "labor",
      ])
    ) {
      const hospitality = resumeData.clients[2];
      return sendResponse(
        res,
        `Sarika has hospitality and enterprise data experience with ${hospitality.name}, where she worked as a ${hospitality.role} from ${hospitality.dates}. ${hospitality.summary}`
      );
    }

    if (
      includesAny(lowerQuestion, [
        "business analyst",
        "ba experience",
        "requirements",
        "user stories",
        "acceptance criteria",
        "brd",
        "frd",
        "process mapping",
        "data mapping",
      ])
    ) {
      return sendResponse(res, resumeData.skills.businessAnalysis);
    }

    if (
      includesAny(lowerQuestion, [
        "agile",
        "uat",
        "jira",
        "confluence",
        "scrum",
        "sprint",
      ])
    ) {
      return sendResponse(res, resumeData.skills.agile);
    }

    if (
      includesAny(lowerQuestion, [
        "certification",
        "certifications",
        "certified",
        "cspo",
      ])
    ) {
      return sendResponse(res, resumeData.certifications);
    }

    if (
      includesAny(lowerQuestion, [
        "why should",
        "recruiter",
        "good fit",
        "hire",
        "strength",
        "value",
      ])
    ) {
      return sendResponse(
        res,
        "Recruiters should consider Sarika because she combines business analysis, data analysis, cloud data platform knowledge across AWS, GCP, and Azure-related environments, AI/ML requirements exposure, SQL validation, dashboard/reporting experience, Agile delivery, and strong domain knowledge across healthcare, utilities, hospitality, and banking. She can work with stakeholders, product owners, data engineers, QA teams, and business users to turn business needs into clear, testable, and deliverable solutions."
      );
    }

    if (
      includesAny(lowerQuestion, [
        "weather",
        "stock",
        "news",
        "today's weather",
        "current news",
      ])
    ) {
      return sendResponse(
        res,
        "This portfolio agent does not currently have live external tools for weather, stock prices, or real-time news. It is focused on answering questions about Sarika's resume, skills, clients, projects, and professional background."
      );
    }

    // Gemini fallback for uncommon resume questions
    if (!process.env.GEMINI_API_KEY) {
      return sendResponse(
        res,
        "I can answer common resume questions locally. Try asking about current client, previous client, years of experience, cloud experience, dashboards, SQL, projects, industries, or education."
      );
    }

    const prompt = `
You are Sarika's AI Portfolio Agent.

Use only the resume profile below. Do not reveal phone number. Email and LinkedIn can be shared.

Profile:
Name: Sarika
Email: ${resumeData.email}
LinkedIn: ${resumeData.linkedin}
Education: ${resumeData.education}
Experience: ${resumeData.experienceYears}
Current focus: ${resumeData.currentFocus}

Client history:
${resumeData.clients.map((c, i) => `${i + 1}. ${clientLine(c)}. Project: ${c.project}. Summary: ${c.summary}. Tools: ${c.tools}`).join("\n")}

Skills:
Business Analysis: ${resumeData.skills.businessAnalysis}
Data Analysis: ${resumeData.skills.dataAnalysis}
Dashboards: ${resumeData.skills.dashboards}
Cloud: ${resumeData.skills.cloud}
AI: ${resumeData.skills.ai}
Agile: ${resumeData.skills.agile}
Languages: ${resumeData.skills.languages}
Certifications: ${resumeData.certifications}

User question:
${latestQuestion}

Answer like a recruiter-friendly portfolio assistant. Be specific, short, and accurate.
`;

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

      if (response.status === 429) {
        return sendResponse(
          res,
          "Gemini daily quota is currently reached, but I can still answer common resume questions. Try asking about current client, previous client, years of experience, cloud experience, dashboards, SQL, projects, industries, education, or certifications."
        );
      }

      return sendResponse(
        res,
        data.error?.message ||
          "Gemini is currently unavailable. Please ask a resume-related question such as current client, previous client, cloud experience, dashboards, SQL, projects, or education."
      );
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I can help with Sarika's resume, clients, projects, skills, and experience. Please ask a resume-related question.";

    return sendResponse(res, reply);
  } catch (err) {
    console.error("Server error:", err);

    return sendResponse(
      res,
      "The server handled the request, but something went wrong. Please ask about Sarika's current client, previous client, experience, projects, cloud skills, dashboards, SQL, or business analyst background."
    );
  }
});

app.use(express.static(path.join(__dirname, "../frontend")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Agent running at http://localhost:${PORT}`);
});
