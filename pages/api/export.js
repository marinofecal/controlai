import { exportPDF, exportDOCX, exportJSON } from '@/lib/export';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { analysis, format = 'pdf' } = req.body;

    if (!analysis) {
      return res.status(400).json({ error: 'Analysis data required' });
    }

    let buffer;
    let contentType;
    let filename;

    if (format === 'pdf') {
      buffer = await exportPDF(analysis);
      contentType = 'application/pdf';
      filename = `compliance-report-${new Date().toISOString().split('T')[0]}.pdf`;
    } else if (format === 'docx') {
      buffer = await exportDOCX(analysis);
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      filename = `compliance-report-${new Date().toISOString().split('T')[0]}.docx`;
    } else if (format === 'json') {
      const json = exportJSON(analysis);
      buffer = Buffer.from(json);
      contentType = 'application/json';
      filename = `compliance-report-${new Date().toISOString().split('T')[0]}.json`;
    } else {
      return res.status(400).json({ error: 'Invalid format' });
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
}
