/**
 * COMPLIANCE AI - ANALYSIS API ENDPOINT
 * pages/api/analyze.js
 * 
 * Main API for compliance case analysis
 * Handles: Case input → Analysis → Report generation
 */

import { Anthropic } from "@anthropic-ai/sdk";
import { REGULATORY_FRAMEWORK, ANALYSIS_PROMPTS, getRiskLevel } from "@/lib/regulatory-kb";
import { saveAnalysis } from "@/lib/supabase";

// Initialize Anthropic client
const client = new Anthropic();

/**
 * MAIN ANALYSIS HANDLER
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { caseContent, caseType, industry, userId } = req.body;

    // Validate input
    if (!caseContent || caseContent.trim().length === 0) {
      return res.status(400).json({ error: "Case content is required" });
    }

    // Build analysis prompt
    const analysisPrompt = buildAnalysisPrompt(caseContent, caseType, industry);

    // Call Claude API for analysis
    const analysis = await analyzeCase(analysisPrompt);

    // Parse and enrich analysis
    const enrichedAnalysis = enrichAnalysis(analysis, caseType, industry);

    // Save to database
    if (userId) {
      await saveAnalysis(userId, enrichedAnalysis, caseContent);
    }

    // Return analysis
    return res.status(200).json({
      success: true,
      analysis: enrichedAnalysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({
      error: "Analysis failed",
      message: error.message,
    });
  }
}

/**
 * Build detailed analysis prompt with regulatory context
 */
function buildAnalysisPrompt(caseContent, caseType, industry) {
  const systemPrompt = ANALYSIS_PROMPTS.SYSTEM_PROMPT;

  const regulatoryContext = buildRegulatoryContext(caseType, industry);

  const analysisRequest = `
${ANALYSIS_PROMPTS.ANALYSIS_PROMPT_TEMPLATE.replace("{CASE_CONTENT}", caseContent)}

${regulatoryContext}

IMPORTANT: Return your analysis as a valid JSON object matching this structure:
${JSON.stringify(ANALYSIS_PROMPTS.JSON_RESPONSE_FORMAT, null, 2)}
`;

  return { systemPrompt, analysisRequest };
}

/**
 * Build regulatory context based on case type and industry
 */
function buildRegulatoryContext(caseType, industry) {
  let context = "\n\n=== APPLICABLE REGULATORY FRAMEWORK ===\n";

  // Add EU regulations
  if (caseType?.includes("financial") || caseType?.includes("commitment")) {
    context += "\n📋 EU Financial Regulation 2018/1046:\n";
    const euFr = REGULATORY_FRAMEWORK.EU.FINANCIAL_REGULATION_2018_1046;
    context += `- Verification Pillars: ${euFr.verification_pillars.map((p) => p.name).join(", ")}\n`;
    context += `- Critical Articles: ${Object.values(euFr.critical_articles).join("; ")}\n`;
  }

  if (caseType?.includes("procurement")) {
    context += "\n📋 EU Public Procurement Directive 2014/24:\n";
    const pp = REGULATORY_FRAMEWORK.EU.PUBLIC_PROCUREMENT_2014_24;
    context += `- Procedures: ${pp.procurement_procedures.map((p) => p.name).join(", ")}\n`;
    context += `- Thresholds: Open (EUR 50k+), Restricted (EUR 30-100k), Negotiated (EUR 5-30k), Direct (EUR 5-15k)\n`;
  }

  if (caseType?.includes("data") || caseType?.includes("gdpr")) {
    context += "\n📋 EU GDPR:\n";
    const gdpr = REGULATORY_FRAMEWORK.EU.GDPR;
    context += `- Key Obligations: ${gdpr.key_obligations.join("; ")}\n`;
  }

  // Add industry-specific
  if (industry?.toLowerCase() === "banking") {
    context += "\n📋 Banking Specific:\n";
    context += `- PSD2: ${REGULATORY_FRAMEWORK.INDUSTRY.BANKING.PSD2.key_requirements.join("; ")}\n`;
    context += `- MiFID II: ${REGULATORY_FRAMEWORK.INDUSTRY.BANKING.MiFID_II.key_requirements.join("; ")}\n`;
  }

  if (industry?.toLowerCase() === "pharma") {
    context += "\n📋 Pharma Specific:\n";
    context += `- GXP: Quality management, validation, audit trail\n`;
    context += `- Clinical Trials: Ethics approval, informed consent, safety monitoring\n`;
  }

  // Add risk framework
  context += "\n\n=== RISK ASSESSMENT FRAMEWORK ===\n";
  Object.entries(REGULATORY_FRAMEWORK.RISK_LEVELS).forEach(([level, details]) => {
    context += `- ${level} (Score ${details.threshold}+): ${details.description}\n`;
  });

  return context;
}

/**
 * Call Claude API for analysis
 */
async function analyzeCase(promptConfig) {
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: promptConfig.analysisRequest,
      },
    ],
    system: promptConfig.systemPrompt,
  });

  // Extract text response
  const textContent = response.content.find((block) => block.type === "text");
  if (!textContent) {
    throw new Error("No text response from Claude");
  }

  // Parse JSON response
  try {
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Failed to parse Claude response:", textContent.text);
    throw new Error("Failed to parse analysis response");
  }
}

/**
 * Enrich analysis with additional context and validations
 */
function enrichAnalysis(analysis, caseType, industry) {
  return {
    // Core analysis from Claude
    ...analysis,

    // Enrich with metadata
    metadata: {
      case_type: caseType || "general",
      industry: industry || "general",
      analysis_timestamp: new Date().toISOString(),
      version: "1.0",
    },

    // Add audit trail
    audit_trail: [
      {
        timestamp: new Date().toISOString(),
        action: "analysis_created",
        status: "completed",
      },
    ],

    // Add compliance score
    compliance_score: calculateComplianceScore(analysis),

    // Add next steps (if risk is not LOW)
    next_steps:
      analysis.risk_assessment.level !== "LOW"
        ? generateNextSteps(analysis)
        : [],
  };
}

/**
 * Calculate overall compliance score
 */
function calculateComplianceScore(analysis) {
  let score = 100;

  // Deduct points for each gap
  if (analysis.compliance_gaps && Array.isArray(analysis.compliance_gaps)) {
    analysis.compliance_gaps.forEach((gap) => {
      switch (gap.severity) {
        case "CRITICAL":
          score -= 25;
          break;
        case "HIGH":
          score -= 15;
          break;
        case "MEDIUM":
          score -= 10;
          break;
        case "LOW":
          score -= 5;
          break;
      }
    });
  }

  return Math.max(0, score);
}

/**
 * Generate action plan for next steps
 */
function generateNextSteps(analysis) {
  const steps = [];

  if (analysis.recommended_actions && Array.isArray(analysis.recommended_actions)) {
    analysis.recommended_actions.forEach((action, index) => {
      steps.push({
        sequence: index + 1,
        action: action.action,
        priority: action.priority,
        timeline: action.timeline,
        owner: action.owner || "Compliance Team",
        estimated_effort: estimateEffort(action.priority),
        success_criteria: action.success_criteria,
      });
    });
  }

  return steps;
}

/**
 * Estimate effort based on priority
 */
function estimateEffort(priority) {
  const efforts = {
    IMMEDIATE: "1-2 hours",
    URGENT: "1-2 days",
    HIGH: "1-2 weeks",
    MEDIUM: "2-4 weeks",
  };
  return efforts[priority] || "As needed";
}

/**
 * ERROR HANDLING UTILITIES
 */
export class AnalysisError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * VALIDATION UTILITIES
 */
export function validateCaseInput(input) {
  if (!input) return false;
  if (typeof input !== "string") return false;
  if (input.trim().length < 50) return false; // Minimum case description length
  return true;
}

export function validateIndustry(industry) {
  const validIndustries = [
    "general",
    "banking",
    "pharma",
    "fintech",
    "insurance",
    "government",
  ];
  return industry && validIndustries.includes(industry.toLowerCase());
}

export function validateCaseType(type) {
  const validTypes = [
    "commitment_verification",
    "payment_verification",
    "procurement_compliance",
    "data_protection",
    "aml_compliance",
  ];
  return type && validTypes.includes(type.toLowerCase());
}
