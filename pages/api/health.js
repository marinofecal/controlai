// Health Check Endpoint

export default function handler(req, res) {
  return res.status(200).json({
    status: 'ok',
    service: 'controlai-compliance',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}
