import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [caseContent, setCaseContent] = useState('');
  const [caseType, setCaseType] = useState('general');
  const [industry, setIndustry] = useState('general');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseContent: caseContent.trim(),
          caseType,
          industry,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!analysis) return;

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: analysis.caseId,
          format: 'pdf',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Report exported: ${data.export.filename}\nExpires: ${new Date(data.export.expiresAt).toLocaleString()}`);
      }
    } catch (err) {
      alert('Export failed: ' + err.message);
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      CRITICAL: '#dc2626',
      HIGH: '#ea580c',
      MEDIUM: '#ca8a04',
      LOW: '#16a34a',
    };
    return colors[level] || '#6b7280';
  };

  return (
    <>
      <Head>
        <title>Compliance AI - Professional Compliance Analysis</title>
        <meta name="description" content="AI-powered compliance analysis platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Compliance AI</h1>
          <p style={styles.subtitle}>Professional Compliance Analysis Platform</p>
        </header>

        <div style={styles.content}>
          {/* INPUT SECTION */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>📋 Submit Compliance Case</h2>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Case Type</label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  disabled={loading}
                  style={styles.select}
                >
                  <option value="general">General Compliance</option>
                  <option value="commitment_verification">Financial Commitment Verification</option>
                  <option value="payment_verification">Payment Authorization</option>
                  <option value="procurement_compliance">Procurement Compliance</option>
                  <option value="data_protection">Data Protection (GDPR)</option>
                  <option value="aml_compliance">AML/KYC Compliance</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  disabled={loading}
                  style={styles.select}
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

            <div style={styles.formGroup}>
              <label style={styles.label}>Case Description</label>
              <textarea
                value={caseContent}
                onChange={(e) => setCaseContent(e.target.value)}
                placeholder="Describe the compliance case or situation..."
                disabled={loading}
                style={styles.textarea}
              />
              <p style={styles.helperText}>{caseContent.length} characters</p>
            </div>

            {error && <div style={styles.error}>❌ {error}</div>}

            <div style={styles.buttonGroup}>
              <button
                onClick={handleAnalyze}
                disabled={loading || !caseContent.trim()}
                style={{
                  ...styles.buttonPrimary,
                  opacity: loading || !caseContent.trim() ? 0.5 : 1,
                }}
              >
                {loading ? '⏳ Analyzing...' : '▶ Analyze Case'}
              </button>
              <button
                onClick={() => {
                  setCaseContent('');
                  setAnalysis(null);
                  setError(null);
                }}
                disabled={loading}
                style={styles.buttonSecondary}
              >
                Clear
              </button>
            </div>
          </section>

          {/* RESULTS SECTION */}
          {analysis && (
            <section style={styles.card}>
              <h2 style={styles.cardTitle}>📊 Analysis Results</h2>

              {/* Risk Assessment */}
              <div
                style={{
                  ...styles.riskBox,
                  borderLeft: `4px solid ${getRiskColor(analysis.riskLevel)}`,
                }}
              >
                <div style={styles.riskHeader}>
                  <h3 style={styles.riskTitle}>Risk Assessment</h3>
                  <span
                    style={{
                      ...styles.riskBadge,
                      backgroundColor: getRiskColor(analysis.riskLevel),
                    }}
                  >
                    {analysis.riskLevel}
                  </span>
                </div>
                <p style={styles.riskScore}>Score: {analysis.riskScore}/100</p>
              </div>

              {/* Compliance Gaps */}
              {analysis.complianceGaps && analysis.complianceGaps.length > 0 && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>⚠️ Compliance Gaps ({analysis.complianceGaps.length})</h3>
                  <div style={styles.gapsList}>
                    {analysis.complianceGaps.map((gap, idx) => (
                      <div key={idx} style={styles.gapItem}>
                        <div style={styles.gapHeader}>
                          <strong>{gap.category}</strong>
                          <span
                            style={{
                              ...styles.severityBadge,
                              backgroundColor:
                                gap.severity === 'HIGH'
                                  ? '#dc2626'
                                  : gap.severity === 'MEDIUM'
                                  ? '#ca8a04'
                                  : '#16a34a',
                            }}
                          >
                            {gap.severity}
                          </span>
                        </div>
                        <p style={styles.gapDescription}>{gap.description}</p>
                        <p style={styles.gapRecommendation}>
                          💡 <strong>Recommendation:</strong> {gap.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export Section */}
              <div style={styles.exportSection}>
                <button onClick={handleExport} style={styles.buttonPrimary}>
                  📥 Export Report (PDF)
                </button>
              </div>

              {/* Metadata */}
              <div style={styles.metadata}>
                <p>
                  <strong>Case ID:</strong> {analysis.caseId}
                </p>
                <p>
                  <strong>Analyzed:</strong> {new Date(analysis.timestamp).toLocaleString()}
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '2px solid #1a365d',
  },
  title: {
    fontSize: '2.5rem',
    color: '#1a365d',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#2d5a8c',
    margin: 0,
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    color: '#1a365d',
    marginTop: 0,
    marginBottom: '20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
  },
  select: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #cbd5e0',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  textarea: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #cbd5e0',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    minHeight: '150px',
    resize: 'vertical',
  },
  helperText: {
    fontSize: '0.85rem',
    color: '#718096',
    margin: '5px 0 0 0',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  buttonPrimary: {
    padding: '12px 24px',
    backgroundColor: '#2d5a8c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonSecondary: {
    padding: '12px 24px',
    backgroundColor: '#cbd5e0',
    color: '#2d3748',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '0.95rem',
  },
  riskBox: {
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  riskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  riskTitle: {
    fontSize: '1.1rem',
    color: '#1a365d',
    margin: 0,
  },
  riskBadge: {
    padding: '6px 12px',
    color: 'white',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  riskScore: {
    fontSize: '1rem',
    color: '#2d3748',
    margin: 0,
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    color: '#1a365d',
    marginBottom: '15px',
  },
  gapsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  gapItem: {
    padding: '15px',
    backgroundColor: '#fffbeb',
    borderLeft: '4px solid #ca8a04',
    borderRadius: '4px',
  },
  gapHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  severityBadge: {
    padding: '4px 8px',
    color: 'white',
    borderRadius: '3px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  gapDescription: {
    fontSize: '0.95rem',
    color: '#2d3748',
    margin: '8px 0',
  },
  gapRecommendation: {
    fontSize: '0.9rem',
    color: '#1a365d',
    margin: '8px 0 0 0',
  },
  exportSection: {
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
    marginTop: '20px',
  },
  metadata: {
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid #e2e8f0',
    fontSize: '0.9rem',
    color: '#718096',
  },
};
