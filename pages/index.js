/**
 * COMPLIANCE AI - MAIN PAGE
 * pages/index.js
 * 
 * Professional Big 4-level compliance analysis interface
 */

import { useState, useRef } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const [caseContent, setCaseContent] = useState("");
  const [caseType, setCaseType] = useState("general");
  const [industry, setIndustry] = useState("general");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const fileInputRef = useRef(null);

  // ============================================
  // HANDLE CASE SUBMISSION
  // ============================================
  const handleAnalyze = async () => {
    // Validation
    if (!caseContent.trim()) {
      setError("Please enter a compliance case to analyze");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseContent: caseContent.trim(),
          caseType,
          industry,
          userId: null, // Can add auth later
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
        setHistory([...history, { id: Date.now(), ...data.analysis }]);
        setCaseContent(""); // Clear input
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HANDLE FILE UPLOAD
  // ============================================
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCaseContent(event.target?.result || "");
    };
    reader.readAsText(file);
  };

  // ============================================
  // EXPORT REPORT
  // ============================================
  const handleExportReport = async () => {
    if (!analysis) return;

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `compliance-report-${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      setError("Failed to export report");
    }
  };

  return (
    <>
      <Head>
        <title>Compliance AI - Professional Compliance Analysis</title>
        <meta
          name="description"
          content="Big 4-level compliance analysis powered by AI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* ============================================ HEADER ============================================ */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Compliance AI</h1>
            <p>Professional Compliance Analysis Platform</p>
            <p className={styles.subtitle}>
              Big 4-level regulatory analysis and risk assessment
            </p>
          </div>
        </header>

        <div className={styles.container}>
          {/* ============================================ ANALYSIS SECTION ============================================ */}
          <section className={styles.analysisSection}>
            <div className={styles.card}>
              <h2>📋 Submit Compliance Case</h2>

              {/* Case Type & Industry Selection */}
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="caseType">Case Type</label>
                  <select
                    id="caseType"
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    disabled={loading}
                  >
                    <option value="general">General Compliance</option>
                    <option value="commitment_verification">
                      Financial Commitment Verification
                    </option>
                    <option value="payment_verification">
                      Payment Authorization Verification
                    </option>
                    <option value="procurement_compliance">
                      Procurement Compliance
                    </option>
                    <option value="data_protection">Data Protection (GDPR)</option>
                    <option value="aml_compliance">AML/KYC Compliance</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="industry">Industry</label>
                  <select
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    disabled={loading}
                  >
                    <option value="general">General</option>
                    <option value="banking">Banking & Finance</option>
                    <option value="pharma">Pharmaceutical</option>
                    <option value="fintech">Fintech</option>
                    <option value="insurance">Insurance</option>
                    <option value="government">Government</option>
                  </select>
                </div>
              </div>

              {/* Case Input */}
              <div className={styles.formGroup}>
                <label htmlFor="caseContent">Case Description</label>
                <textarea
                  id="caseContent"
                  value={caseContent}
                  onChange={(e) => setCaseContent(e.target.value)}
                  placeholder="Describe the compliance case or situation... (minimum 50 characters)"
                  rows={10}
                  disabled={loading}
                  className={styles.textarea}
                />
                <p className={styles.helperText}>
                  {caseContent.length} characters
                </p>
              </div>

              {/* File Upload */}
              <div className={styles.fileUpload}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.buttonSecondary}
                  disabled={loading}
                >
                  📎 Upload Document
                </button>
              </div>

              {/* Error Display */}
              {error && <div className={styles.error}>❌ {error}</div>}

              {/* Analyze Button */}
              <div className={styles.actionButtons}>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !caseContent.trim()}
                  className={styles.buttonPrimary}
                >
                  {loading ? (
                    <>
                      <span className={styles.spinner}></span> Analyzing...
                    </>
                  ) : (
                    "▶ Analyze Case"
                  )}
                </button>

                <button
                  onClick={() => setCaseContent("")}
                  disabled={loading}
                  className={styles.buttonSecondary}
                >
                  Clear
                </button>
              </div>
            </div>
          </section>

          {/* ============================================ ANALYSIS RESULTS ============================================ */}
          {analysis && (
            <section className={styles.resultsSection}>
              <div className={styles.card}>
                <h2>📊 Compliance Analysis Results</h2>

                {/* Risk Assessment */}
                <div className={`${styles.riskBox} ${styles[`risk_${analysis.risk_assessment.level.toLowerCase()}`]}`}>
                  <h3>Risk Assessment</h3>
                  <div className={styles.riskContent}>
                    <div className={styles.riskLevel}>
                      <span className={styles.riskBadge}>
                        {analysis.risk_assessment.level}
                      </span>
                      <div className={styles.riskScore}>
                        Score: {analysis.risk_assessment.score}/100
                      </div>
                    </div>
                    <p>{analysis.risk_assessment.rationale}</p>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className={styles.section}>
                  <h3>📄 Executive Summary</h3>
                  <p>{analysis.executive_summary}</p>
                </div>

                {/* Applicable Regulations */}
                {analysis.regulatory_references && analysis.regulatory_references.length > 0 && (
                  <div className={styles.section}>
                    <h3>⚖️ Applicable Regulations</h3>
                    <div className={styles.regulationsList}>
                      {analysis.regulatory_references.map((ref, idx) => (
                        <div key={idx} className={styles.regulationItem}>
                          <strong>{ref.regulation}</strong>
                          {ref.article && <span className={styles.article}>Art. {ref.article}</span>}
                          <p>{ref.requirement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance Gaps */}
                {analysis.compliance_gaps && analysis.compliance_gaps.length > 0 && (
                  <div className={styles.section}>
                    <h3>⚠️ Compliance Gaps ({analysis.compliance_gaps.length})</h3>
                    <div className={styles.gapsList}>
                      {analysis.compliance_gaps.map((gap, idx) => (
                        <div key={idx} className={`${styles.gapItem} ${styles[`gap_${gap.severity.toLowerCase()}`]}`}>
                          <div className={styles.gapHeader}>
                            <strong>{gap.gap}</strong>
                            <span className={styles.severityBadge}>
                              {gap.severity}
                            </span>
                          </div>
                          <p><strong>Regulation:</strong> {gap.regulation}</p>
                          <p><strong>Impact:</strong> {gap.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Procedures */}
                {analysis.verification_procedures && (
                  <div className={styles.section}>
                    <h3>✓ Verification Procedures</h3>
                    <div className={styles.proceduresList}>
                      {analysis.verification_procedures.map((proc, idx) => (
                        <div key={idx} className={styles.procedureItem}>
                          <div className={styles.stepNumber}>{idx + 1}</div>
                          <div>
                            <p><strong>{proc.action}</strong></p>
                            <p><em>Evidence: {proc.evidence}</em></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Actions */}
                {analysis.recommended_actions && (
                  <div className={styles.section}>
                    <h3>📋 Recommended Actions</h3>
                    <div className={styles.actionsList}>
                      {analysis.recommended_actions.map((action, idx) => (
                        <div key={idx} className={styles.actionItem}>
                          <div className={styles.actionHeader}>
                            <strong>{action.action}</strong>
                            <span
                              className={`${styles.priorityBadge} ${styles[`priority_${action.priority.toLowerCase()}`]}`}
                            >
                              {action.priority}
                            </span>
                          </div>
                          <div className={styles.actionDetails}>
                            <p><strong>Timeline:</strong> {action.timeline}</p>
                            <p><strong>Owner:</strong> {action.owner}</p>
                            <p><strong>Success Criteria:</strong> {action.success_criteria}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Export Button */}
                <div className={styles.exportSection}>
                  <button
                    onClick={handleExportReport}
                    className={styles.buttonPrimary}
                  >
                    📥 Export Report (PDF)
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ============================================ HISTORY ============================================ */}
          {history.length > 0 && (
            <section className={styles.historySection}>
              <div className={styles.card}>
                <h2>📚 Analysis History</h2>
                <div className={styles.historyList}>
                  {history.map((item) => (
                    <div key={item.id} className={styles.historyItem}>
                      <div className={styles.historyHeader}>
                        <span className={styles.historyTime}>
                          {new Date(item.metadata.analysis_timestamp).toLocaleString()}
                        </span>
                        <span
                          className={`${styles.riskBadge} ${styles[`risk_${item.risk_assessment.level.toLowerCase()}`]}`}
                        >
                          {item.risk_assessment.level}
                        </span>
                      </div>
                      <p className={styles.historySummary}>
                        {item.executive_summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
