/**
 * COMPLIANCE AI - EXPORT UTILITIES
 * lib/export.js
 */

import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, AlignmentType, WidthType } from 'docx';

/**
 * Export analysis to JSON
 */
export async function exportJSON(analysis) {
  return JSON.stringify(analysis, null, 2);
}

/**
 * Export analysis to PDF
 */
export async function exportPDF(analysis) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { height } = page.getSize();
  let y = height - 50;

  const fontSize = 12;
  const titleFontSize = 20;
  const headingFontSize = 14;

  // Title
  page.drawText('COMPLIANCE ANALYSIS REPORT', {
    x: 50,
    y,
    size: titleFontSize,
    color: rgb(26, 54, 93),
  });
  y -= 40;

  // Executive Summary
  page.drawText('EXECUTIVE SUMMARY', {
    x: 50,
    y,
    size: headingFontSize,
    color: rgb(45, 90, 140),
  });
  y -= 20;

  const summaryLines = wrapText(analysis.executive_summary, 80);
  summaryLines.forEach((line) => {
    page.drawText(line, {
      x: 50,
      y,
      size: fontSize,
      color: rgb(74, 85, 104),
    });
    y -= 15;
  });
  y -= 10;

  // Risk Assessment
  page.drawText('RISK ASSESSMENT', {
    x: 50,
    y,
    size: headingFontSize,
    color: rgb(45, 90, 140),
  });
  y -= 20;

  const riskColor = getRiskColor(analysis.risk_assessment.level);
  page.drawText(
    `Level: ${analysis.risk_assessment.level} | Score: ${analysis.risk_assessment.score}/100`,
    {
      x: 50,
      y,
      size: fontSize,
      color: riskColor,
    }
  );
  y -= 15;
  page.drawText(analysis.risk_assessment.rationale, {
    x: 50,
    y,
    size: fontSize,
    color: rgb(74, 85, 104),
  });
  y -= 20;

  // Compliance Gaps
  if (analysis.compliance_gaps && analysis.compliance_gaps.length > 0) {
    page.drawText('COMPLIANCE GAPS', {
      x: 50,
      y,
      size: headingFontSize,
      color: rgb(45, 90, 140),
    });
    y -= 20;

    analysis.compliance_gaps.forEach((gap, index) => {
      page.drawText(`${index + 1}. ${gap.gap}`, {
        x: 50,
        y,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      y -= 15;
      page.drawText(`   Severity: ${gap.severity}`, {
        x: 70,
        y,
        size: fontSize - 2,
        color: rgb(112, 128, 144),
      });
      y -= 12;
    });
    y -= 10;
  }

  // Recommended Actions
  if (analysis.recommended_actions && analysis.recommended_actions.length > 0) {
    page.drawText('RECOMMENDED ACTIONS', {
      x: 50,
      y,
      size: headingFontSize,
      color: rgb(45, 90, 140),
    });
    y -= 20;

    analysis.recommended_actions.forEach((action, index) => {
      page.drawText(`${index + 1}. ${action.action}`, {
        x: 50,
        y,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      y -= 15;
      page.drawText(`   Timeline: ${action.timeline} | Priority: ${action.priority}`, {
        x: 70,
        y,
        size: fontSize - 2,
        color: rgb(112, 128, 144),
      });
      y -= 12;

      // Check if we need a new page
      if (y < 50) {
        const newPage = pdfDoc.addPage([612, 792]);
        y = 792 - 50;
      }
    });
  }

  // Footer
  page.drawText(`Generated: ${new Date().toLocaleString()}`, {
    x: 50,
    y: 30,
    size: 10,
    color: rgb(160, 174, 192),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

/**
 * Export analysis to DOCX
 */
export async function exportDOCX(analysis) {
  const doc = new Document({
    sections: [
      {
        children: [
          // Title
          new Paragraph({
            text: 'COMPLIANCE ANALYSIS REPORT',
            heading: 'Heading1',
            alignment: AlignmentType.CENTER,
            thematicBreak: false,
          }),

          new Paragraph(''),

          // Date
          new Paragraph({
            text: `Generated: ${new Date().toLocaleString()}`,
            alignment: AlignmentType.RIGHT,
            size: 20,
          }),

          new Paragraph(''),
          new Paragraph(''),

          // Executive Summary
          new Paragraph({
            text: 'EXECUTIVE SUMMARY',
            heading: 'Heading2',
          }),

          new Paragraph({
            text: analysis.executive_summary,
            spacing: { line: 360 },
          }),

          new Paragraph(''),

          // Risk Assessment
          new Paragraph({
            text: 'RISK ASSESSMENT',
            heading: 'Heading2',
          }),

          new Paragraph({
            text: `Risk Level: ${analysis.risk_assessment.level}`,
            bold: true,
          }),

          new Paragraph({
            text: `Score: ${analysis.risk_assessment.score}/100`,
            bold: true,
          }),

          new Paragraph({
            text: analysis.risk_assessment.rationale,
            spacing: { line: 360 },
          }),

          new Paragraph(''),

          // Compliance Gaps
          ...(analysis.compliance_gaps && analysis.compliance_gaps.length > 0
            ? [
                new Paragraph({
                  text: 'COMPLIANCE GAPS',
                  heading: 'Heading2',
                }),
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  rows: [
                    // Header
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph('Gap')],
                          shading: { fill: 'D5E8F0' },
                        }),
                        new TableCell({
                          children: [new Paragraph('Severity')],
                          shading: { fill: 'D5E8F0' },
                        }),
                        new TableCell({
                          children: [new Paragraph('Impact')],
                          shading: { fill: 'D5E8F0' },
                        }),
                      ],
                    }),
                    // Rows
                    ...analysis.compliance_gaps.map(
                      (gap) =>
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [new Paragraph(gap.gap)],
                            }),
                            new TableCell({
                              children: [new Paragraph(gap.severity)],
                            }),
                            new TableCell({
                              children: [new Paragraph(gap.impact)],
                            }),
                          ],
                        })
                    ),
                  ],
                }),
                new Paragraph(''),
              ]
            : []),

          // Recommended Actions
          ...(analysis.recommended_actions && analysis.recommended_actions.length > 0
            ? [
                new Paragraph({
                  text: 'RECOMMENDED ACTIONS',
                  heading: 'Heading2',
                }),
                ...analysis.recommended_actions.map(
                  (action, index) =>
                    new Paragraph({
                      text: `${index + 1}. ${action.action}`,
                      bullet: { level: 0 },
                    })
                ),
                new Paragraph(''),
              ]
            : []),

          // Regulatory References
          ...(analysis.regulatory_references && analysis.regulatory_references.length > 0
            ? [
                new Paragraph({
                  text: 'REGULATORY REFERENCES',
                  heading: 'Heading2',
                }),
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  rows: [
                    // Header
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph('Regulation')],
                          shading: { fill: 'D5E8F0' },
                        }),
                        new TableCell({
                          children: [new Paragraph('Article')],
                          shading: { fill: 'D5E8F0' },
                        }),
                        new TableCell({
                          children: [new Paragraph('Requirement')],
                          shading: { fill: 'D5E8F0' },
                        }),
                      ],
                    }),
                    // Rows
                    ...analysis.regulatory_references.map(
                      (ref) =>
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [new Paragraph(ref.regulation)],
                            }),
                            new TableCell({
                              children: [new Paragraph(ref.article || 'N/A')],
                            }),
                            new TableCell({
                              children: [new Paragraph(ref.requirement)],
                            }),
                          ],
                        })
                    ),
                  ],
                }),
              ]
            : []),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

/**
 * UTILITIES
 */
function wrapText(text, maxWidth) {
  if (!text) return [];

  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    if ((currentLine + word).length > maxWidth) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

function getRiskColor(level) {
  switch (level) {
    case 'CRITICAL':
      return rgb(197, 48, 48); // Red
    case 'HIGH':
      return rgb(237, 137, 54); // Orange
    case 'MEDIUM':
      return rgb(236, 201, 75); // Yellow
    case 'LOW':
      return rgb(56, 161, 105); // Green
    default:
      return rgb(0, 0, 0); // Black
  }
}

/**
 * Download file helper
 */
export function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
