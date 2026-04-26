/**
 * COMPLIANCE AI - REGULATORY KNOWLEDGE BASE
 * Comprehensive regulatory framework for Big 4 level analysis
 * Version: 1.0.0
 */

export const REGULATORY_FRAMEWORK = {
  // ============================================
  // EU REGULATIONS
  // ============================================
  EU: {
    FINANCIAL_REGULATION_2018_1046: {
      id: "EU_FR_2018_1046",
      name: "EU Financial Regulation 2018/1046",
      jurisdiction: "EU",
      scope: "All EU institutions financial management",
      key_principles: [
        "Legality and Regularity",
        "Ex-ante verification",
        "Authorizing officer authority",
        "Conflict of interest",
        "Recovery of funds",
        "Irregularity reporting"
      ],
      critical_articles: {
        "26-27": "Ex ante verification requirement for legality & regularity",
        "50-52": "Authorizing Officers - authority limits and delegations",
        "73-80": "Conflict of interest, VAT treatment, recovery procedures",
        "83-86": "Irregularity identification and reporting",
      },
      verification_pillars: [
        {
          name: "Legality",
          description: "Is this permitted by law? Valid contract? Contractor eligible?",
          checks: [
            "Valid legal basis exists",
            "Contractor on OLAF ineligibility list?",
            "EU sanctions compliance",
            "Declared conflicts of interest",
            "Required approvals in place"
          ]
        },
        {
          name: "Regularity",
          description: "Have correct procedures been followed?",
          checks: [
            "Right procurement procedure used",
            "Signatory authorized for amount",
            "Supporting documentation complete",
            "Approval hierarchies respected",
            "Timeline logical"
          ]
        },
        {
          name: "Appropriateness",
          description: "Is this transaction reasonable and justified?",
          checks: [
            "Cost reasonable for scope",
            "Mission-aligned",
            "Value for money",
            "Fraud indicators",
            "Reputational risk"
          ]
        }
      ],
      rag_priority: "CRITICAL",
      industry_applicability: ["Government", "EU Institutions", "Public Sector"]
    },

    PUBLIC_PROCUREMENT_2014_24: {
      id: "EU_PP_2014_24",
      name: "Public Procurement Directive 2014/24/EU",
      jurisdiction: "EU",
      scope: "Public procurement procedures for institutional spending",
      key_principles: [
        "Transparency",
        "Non-discrimination",
        "Equal treatment",
        "Proportionality"
      ],
      procurement_procedures: [
        {
          name: "Open Procedure",
          threshold: "EUR 50k+",
          characteristics: "Transparent, competitive, most regulated",
          risk_level: "LOW"
        },
        {
          name: "Restricted Procedure",
          threshold: "EUR 30-100k",
          characteristics: "Limited suppliers available, pre-qualification",
          risk_level: "MEDIUM"
        },
        {
          name: "Negotiated Procedure",
          threshold: "EUR 5-30k",
          characteristics: "Direct negotiation, justified by specific criteria",
          risk_level: "MEDIUM-HIGH"
        },
        {
          name: "Framework Agreement",
          threshold: "Multi-year",
          characteristics: "Multiple deliveries over time",
          risk_level: "LOW"
        },
        {
          name: "Direct Procurement",
          threshold: "EUR 5-15k",
          characteristics: "Minimal formality, requires justification",
          risk_level: "HIGH"
        }
      ],
      rag_priority: "CRITICAL",
      industry_applicability: ["Government", "Public Sector", "EU Institutions"]
    },

    CFSP_FRAMEWORK: {
      id: "EU_CFSP",
      name: "Common Foreign and Security Policy Rules",
      jurisdiction: "EU",
      scope: "Security-related and diplomatic expenditures",
      special_rules: [
        "Can bypass normal procurement for security-sensitive contracts",
        "Derogations allowed if documented and justified",
        "Classification and compartmentalization required"
      ],
      key_considerations: [
        "Is CFSP classification legitimate?",
        "Is derogation proportionate?",
        "Are justifications documented?",
        "Are essential principles still respected?"
      ],
      rag_priority: "HIGH",
      industry_applicability: ["Government", "EU Institutions", "Defense", "Security"]
    },

    DORA: {
      id: "EU_DORA",
      name: "Digital Operational Resilience Act",
      jurisdiction: "EU",
      scope: "Digital systems and IT infrastructure security",
      key_requirements: [
        "System security testing",
        "Vulnerability management",
        "Data protection",
        "Business continuity",
        "Incident reporting"
      ],
      rag_priority: "HIGH",
      industry_applicability: ["All sectors - Financial focus"]
    },

    GDPR: {
      id: "EU_GDPR",
      name: "General Data Protection Regulation",
      jurisdiction: "EU",
      scope: "Personal data protection",
      key_obligations: [
        "Legal basis for processing",
        "Data subject rights",
        "Data protection impact assessment",
        "Processor agreements",
        "Breach notification (72 hours)"
      ],
      rag_priority: "CRITICAL",
      industry_applicability: ["All sectors"]
    },

    AML_DIRECTIVES: {
      id: "EU_AML",
      name: "Anti-Money Laundering Directives (6th & 7th)",
      jurisdiction: "EU",
      scope: "AML/KYC compliance",
      key_obligations: [
        "Customer due diligence (CDD)",
        "Enhanced due diligence (EDD) for high-risk",
        "Suspicious transaction reporting (STR)",
        "Beneficial ownership transparency",
        "Record keeping (5 years)"
      ],
      rag_priority: "CRITICAL",
      industry_applicability: ["Banking", "Fintech", "Insurance", "Real Estate"]
    }
  },

  // ============================================
  // INTERNATIONAL STANDARDS & FRAMEWORKS
  // ============================================
  INTERNATIONAL: {
    SARBANES_OXLEY: {
      id: "INTL_SOX",
      name: "Sarbanes-Oxley Act (SOx)",
      jurisdiction: "US (global applicability for listed companies)",
      scope: "Financial reporting and internal controls",
      key_sections: {
        "302": "CEO/CFO certification of financial reports",
        "404": "Management assessment of internal controls",
        "906": "Criminal penalties for certification",
      },
      critical_areas: [
        "Internal control over financial reporting (ICFR)",
        "IT general controls",
        "Documentation of processes",
        "Management certifications",
        "Audit committee oversight"
      ],
      rag_priority: "CRITICAL",
      industry_applicability: ["All listed companies"]
    },

    COSO_FRAMEWORK: {
      id: "INTL_COSO",
      name: "COSO Internal Control Framework",
      jurisdiction: "Global best practice",
      scope: "Enterprise risk management and internal controls",
      five_components: [
        "Governance and Culture",
        "Strategy and Objective-Setting",
        "Performance",
        "Review and Revision",
        "Information, Communication, and Reporting"
      ],
      rag_priority: "CRITICAL",
      industry_applicability: ["All sectors"]
    },

    ISO_27001: {
      id: "INTL_ISO27001",
      name: "ISO 27001 Information Security Management",
      jurisdiction: "Global standard",
      scope: "Information security management systems",
      key_areas: [
        "Access control",
        "Encryption",
        "Incident management",
        "Vendor management",
        "Security awareness"
      ],
      rag_priority: "HIGH",
      industry_applicability: ["All sectors - Technology focus"]
    },

    BASEL_III: {
      id: "INTL_BASEL3",
      name: "Basel III Banking Regulation",
      jurisdiction: "Global banking standard",
      scope: "Bank capital adequacy and risk management",
      key_pillars: [
        "Capital requirements (8% minimum)",
        "Supervisory review",
        "Market discipline",
        "Liquidity requirements"
      ],
      rag_priority: "CRITICAL",
      industry_applicability: ["Banking", "Financial Institutions"]
    },

    IFRS_STANDARDS: {
      id: "INTL_IFRS",
      name: "International Financial Reporting Standards",
      jurisdiction: "Global (140+ countries)",
      scope: "Financial reporting standards",
      key_standards: [
        "IFRS 15 Revenue Recognition",
        "IFRS 16 Leases",
        "IFRS 17 Insurance Contracts",
        "IFRS 9 Financial Instruments"
      ],
      rag_priority: "CRITICAL",
      industry_applicability: ["All listed/large companies"]
    }
  },

  // ============================================
  // INDUSTRY-SPECIFIC REGULATIONS
  // ============================================
  INDUSTRY: {
    BANKING: {
      PSD2: {
        id: "BANK_PSD2",
        name: "Payment Services Directive 2",
        scope: "Payment services and open banking",
        key_requirements: [
          "Strong customer authentication",
          "Access to account information",
          "Payment initiation services",
          "Fraud prevention"
        ],
        rag_priority: "CRITICAL"
      },
      MiFID_II: {
        id: "BANK_MIFID2",
        name: "Markets in Financial Instruments Directive II",
        scope: "Investment services and markets",
        key_requirements: [
          "Client categorization",
          "Suitability assessment",
          "Best execution",
          "Transaction reporting",
          "Conflicts of interest"
        ],
        rag_priority: "CRITICAL"
      }
    },

    PHARMA: {
      GXP_REGULATIONS: {
        id: "PHARMA_GXP",
        name: "Good Practice Regulations (GMP, GCP, GLP)",
        scope: "Manufacturing, clinical trials, laboratory practices",
        key_requirements: [
          "Quality management system",
          "Document control",
          "Validation",
          "Deviation management",
          "Audit trail"
        ],
        rag_priority: "CRITICAL"
      },
      CLINICAL_TRIALS: {
        id: "PHARMA_CT",
        name: "Clinical Trial Regulations",
        scope: "Clinical trial conduct and reporting",
        key_requirements: [
          "Ethics committee approval",
          "Informed consent",
          "Safety monitoring",
          "Adverse event reporting",
          "Data integrity"
        ],
        rag_priority: "CRITICAL"
      }
    },

    FINTECH: {
      FCA_RULES: {
        id: "FINTECH_FCA",
        name: "UK Financial Conduct Authority Rules",
        scope: "Consumer credit, investment services",
        key_requirements: [
          "Conduct of Business",
          "Consumer credit licensing",
          "Data protection",
          "Complaints handling"
        ],
        rag_priority: "HIGH"
      },
      SEC_REGULATIONS: {
        id: "FINTECH_SEC",
        name: "US Securities and Exchange Commission Regulations",
        scope: "Securities offerings and trading",
        key_requirements: [
          "Registration requirements",
          "Disclosure obligations",
          "Anti-fraud provisions",
          "Insider trading rules"
        ],
        rag_priority: "CRITICAL"
      }
    },

    INSURANCE: {
      SOLVENCY_II: {
        id: "INS_SOLV2",
        name: "Solvency II Directive",
        scope: "Insurance company solvency and governance",
        key_pillars: [
          "Pillar I: Capital requirements",
          "Pillar II: Supervisory review",
          "Pillar III: Public disclosure"
        ],
        rag_priority: "CRITICAL"
      }
    }
  },

  // ============================================
  // RISK ASSESSMENT FRAMEWORK
  // ============================================
  RISK_LEVELS: {
    CRITICAL: {
      threshold: 90,
      description: "Immediate action required. Regulatory breach or significant risk.",
      actions: [
        "Immediate escalation to leadership",
        "Engage legal counsel",
        "Prepare remediation plan",
        "Consider disclosure requirements"
      ]
    },
    HIGH: {
      threshold: 70,
      description: "Significant compliance risk. Action plan required.",
      actions: [
        "Escalate within 5 business days",
        "Investigate root cause",
        "Develop corrective actions",
        "Monitor closely"
      ]
    },
    MEDIUM: {
      threshold: 50,
      description: "Moderate risk requiring attention.",
      actions: [
        "Schedule review",
        "Identify improvement areas",
        "Track for resolution",
        "Document findings"
      ]
    },
    LOW: {
      threshold: 0,
      description: "Minimal compliance risk.",
      actions: [
        "Continue monitoring",
        "Document rationale",
        "Include in audit trail"
      ]
    }
  }
};

/**
 * ANALYSIS TEMPLATES
 * Pre-built question sets for specific scenarios
 */
export const ANALYSIS_TEMPLATES = {
  COMMITMENT_VERIFICATION: {
    id: "template_commitment",
    name: "Financial Commitment Verification",
    questions: [
      "Is there a valid, signed contract?",
      "Was the right procurement procedure used?",
      "Is the signatory authorized for this amount?",
      "Is there available budget?",
      "Is the contractor eligible (not on sanctions/exclusion lists)?",
      "Has conflict of interest been declared?",
      "Are all supporting documents present?"
    ],
    applicable_regulations: ["EU_FR_2018_1046", "EU_PP_2014_24"],
    risk_assessment: true
  },

  PAYMENT_VERIFICATION: {
    id: "template_payment",
    name: "Payment Authorization Verification",
    questions: [
      "Was the good/service actually delivered?",
      "Does the invoice match the contract?",
      "Are mathematical calculations correct?",
      "Is VAT treatment correct?",
      "Are supporting documents (delivery proof, quality) present?",
      "Is this consistent with the original commitment?",
      "Are there fraud indicators?"
    ],
    applicable_regulations: ["EU_FR_2018_1046"],
    risk_assessment: true
  },

  PROCUREMENT_COMPLIANCE: {
    id: "template_procurement",
    name: "Procurement Procedure Compliance",
    questions: [
      "What is the contract value?",
      "What is the contract type (services/supplies/works)?",
      "What procedure was used?",
      "Was the correct threshold procedure applied?",
      "Were evaluation criteria transparent and documented?",
      "Was the selection justified?",
      "Are there conflicts of interest?"
    ],
    applicable_regulations: ["EU_PP_2014_24"],
    risk_assessment: true
  },

  DATA_PROTECTION: {
    id: "template_data",
    name: "GDPR Data Protection Assessment",
    questions: [
      "Is there a legal basis for processing?",
      "Have data subjects been informed?",
      "Has data protection impact assessment been done?",
      "Are processor agreements in place?",
      "Is data encryption implemented?",
      "Is breach notification procedure established?",
      "Are data retention limits respected?"
    ],
    applicable_regulations: ["EU_GDPR"],
    risk_assessment: true
  },

  AML_COMPLIANCE: {
    id: "template_aml",
    name: "AML/KYC Compliance Check",
    questions: [
      "Has customer due diligence been completed?",
      "Is beneficial ownership identified?",
      "Are sanctions lists checked?",
      "Is politically exposed person (PEP) assessment done?",
      "Are suspicious activities monitored?",
      "Is transaction monitoring in place?",
      "Are records retained (5+ years)?"
    ],
    applicable_regulations: ["EU_AML"],
    risk_assessment: true
  }
};

/**
 * PROMPT ENGINEERING FOR ANALYSIS
 */
export const ANALYSIS_PROMPTS = {
  SYSTEM_PROMPT: `You are an expert compliance officer at a Big 4 consulting firm (Deloitte, EY, KPMG, PwC) with 20+ years of experience in regulatory compliance, financial governance, and audit.

Your role is to analyze compliance cases and provide professional, actionable advice based on applicable regulations and best practices.

When analyzing cases:
1. Identify applicable regulations and frameworks
2. Assess compliance gaps and risks
3. Rate risk level (Critical/High/Medium/Low)
4. Provide specific, actionable recommendations
5. Reference relevant regulatory articles
6. Consider industry-specific requirements
7. Suggest verification procedures

Always maintain a professional tone, cite specific regulations, and provide recommendations that are practical and implementable.`,

  ANALYSIS_PROMPT_TEMPLATE: `Analyze the following compliance case:

CASE DETAILS:
{CASE_CONTENT}

Please provide:
1. **Executive Summary** (2-3 sentences)
2. **Applicable Regulations** (list relevant frameworks)
3. **Risk Assessment** (Critical/High/Medium/Low with score 0-100)
4. **Compliance Gaps** (identify specific issues)
5. **Regulatory References** (cite specific articles/sections)
6. **Verification Procedures** (what to check and how)
7. **Recommended Actions** (specific, prioritized steps)
8. **Timeline** (when to address each item)

Format your response as structured JSON.`,

  JSON_RESPONSE_FORMAT: {
    executive_summary: "string",
    case_type: "string",
    applicable_regulations: ["regulation_id"],
    risk_assessment: {
      level: "CRITICAL|HIGH|MEDIUM|LOW",
      score: "number 0-100",
      rationale: "string"
    },
    compliance_gaps: [
      {
        gap: "string",
        severity: "CRITICAL|HIGH|MEDIUM|LOW",
        regulation: "string",
        impact: "string"
      }
    ],
    verification_procedures: [
      {
        step: "string",
        action: "string",
        evidence: "string"
      }
    ],
    recommended_actions: [
      {
        action: "string",
        priority: "IMMEDIATE|URGENT|HIGH|MEDIUM",
        timeline: "string",
        owner: "string",
        success_criteria: "string"
      }
    ],
    regulatory_references: [
      {
        regulation: "string",
        article: "string",
        requirement: "string"
      }
    ]
  }
};

/**
 * UTILITIES
 */
export function getRiskLevel(score) {
  if (score >= 90) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 50) return "MEDIUM";
  return "LOW";
}

export function getApplicableRegulations(caseType, industry) {
  const regulations = [];
  
  // Add based on case type and industry
  if (caseType.includes("financial") || caseType.includes("commitment")) {
    regulations.push("EU_FR_2018_1046");
  }
  if (caseType.includes("procurement")) {
    regulations.push("EU_PP_2014_24");
  }
  if (caseType.includes("data") || caseType.includes("gdpr")) {
    regulations.push("EU_GDPR");
  }
  if (industry === "banking") {
    regulations.push("BANK_PSD2", "BANK_MIFID2");
  }
  
  return regulations;
}
