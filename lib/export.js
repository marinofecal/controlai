import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Exportar análisis a PDF con diseño profesional
 */
export async function exportAnalysisToPDF(analysis, fileName = "analysis") {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    let yPosition = margin;

    // Header
    pdf.setFillColor(0, 102, 204);
    pdf.rect(0, 0, pageWidth, 30, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text("🛡️ ControlAI", margin, 15);

    pdf.setFontSize(10);
    pdf.text("EU AI Act Compliance Assessment", margin, 22);

    yPosition = 40;

    // Title
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont(undefined, "bold");
    pdf.text("Compliance Analysis Report", margin, yPosition);
    yPosition += 10;

    // Date
    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    pdf.text(
      `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      margin,
      yPosition
    );
    yPosition += 8;

    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Risk Level Section
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("Risk Classification", margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(14);
    const riskColor = getRiskColor(analysis.detected_risk);
    pdf.setTextColor(...riskColor);
    pdf.setFont(undefined, "bold");
    pdf.text(analysis.detected_risk, margin, yPosition);
    yPosition += 10;

    // Summary Section
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("Assessment Summary", margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    const summaryLines = pdf.splitTextToSize(analysis.summary, contentWidth);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 5 + 5;

    // Categories Section
    if (analysis.categories_detected && analysis.categories_detected.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont(undefined, "bold");
      pdf.text("Detected Categories", margin, yPosition);
      yPosition += 7;

      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      analysis.categories_detected.forEach((category) => {
        pdf.text(`• ${category}`, margin + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 3;
    }

    // Recommendations Section
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text("Recommended Actions", margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    analysis.recommendations.forEach((rec, idx) => {
      if (yPosition > pageHeight - margin - 10) {
        pdf.addPage();
        yPosition = margin;
      }
      const wrappedText = pdf.splitTextToSize(`${idx + 1}. ${rec}`, contentWidth - 5);
      pdf.text(wrappedText, margin + 5, yPosition);
      yPosition += wrappedText.length * 5 + 2;
    });

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      "This assessment is preliminary. Consult with legal experts for final compliance decisions.",
      margin,
      pageHeight - 10
    );

    // Save PDF
    pdf.save(`${fileName}-${Date.now()}.pdf`);
    return true;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    return false;
  }
}

/**
 * Exportar elemento DOM a PDF
 */
export async function exportElementToPDF(elementId, fileName = "export") {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 10;

    if (imgHeight > pageHeight - 20) {
      const ratio = (pageHeight - 20) / imgHeight;
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = (pageHeight - 20) * ratio;
      pdf.addImage(imgData, "PNG", 10, yPosition, scaledWidth, scaledHeight);
    } else {
      pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);
    }

    pdf.save(`${fileName}-${Date.now()}.pdf`);
    return true;
  } catch (error) {
    console.error("Error exporting element to PDF:", error);
    return false;
  }
}

/**
 * Exportar análisis a JSON
 */
export function exportAnalysisToJSON(analysis, fileName = "analysis") {
  try {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error exporting to JSON:", error);
    return false;
  }
}

/**
 * Exportar análisis a CSV
 */
export function exportAnalysisToCSV(analyses, fileName = "analyses") {
  try {
    const headers = [
      "ID",
      "Date",
      "Risk Level",
      "Categories",
      "Recommendations Count",
      "Summary",
    ];

    const rows = analyses.map((a) => [
      a.id || "",
      a.created_at ? new Date(a.created_at).toLocaleDateString() : "",
      a.risk_level || a.detected_risk || "",
      (a.categories_detected || a.categories || []).join("; "),
      (a.recommendations || []).length,
      (a.summary || a.input || "").substring(0, 100),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    return false;
  }
}

/**
 * Obtener color basado en nivel de riesgo
 */
function getRiskColor(riskLevel) {
  const colors = {
    "High Risk": [211, 47, 47],
    "Limited Risk": [245, 124, 0],
    "Minimal Risk": [56, 142, 60],
  };
  return colors[riskLevel] || [0, 102, 204];
}
