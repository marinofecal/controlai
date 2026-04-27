/**
 * Middleware de Seguridad para Compliance AI
 * - Input validation
 * - Rate limiting
 * - CORS headers
 * - Payload size limits
 */

// Rate limiter (simple en-memory, para producción usar Redis)
const rateLimitMap = new Map();

export function withSecurityHeaders(req, res, handler) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return handler(req, res);
}

export function validateRequest(req, res, handler) {
  // Validar método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Validar Content-Type
  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(400).json({ error: 'Content-Type must be application/json' });
  }

  // Validar body existe
  if (!req.body) {
    return res.status(400).json({ error: 'Request body required' });
  }

  // Validar tamaño del payload (máx 50KB)
  const bodySize = JSON.stringify(req.body).length;
  if (bodySize > 50000) {
    return res.status(413).json({ error: 'Payload too large' });
  }

  return handler(req, res);
}

export function rateLimit(req, res, handler, limit = 10, window = 60000) {
  // Identificar cliente (IP o user ID)
  const clientId = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  
  if (!rateLimitMap.has(clientId)) {
    rateLimitMap.set(clientId, []);
  }

  const requests = rateLimitMap.get(clientId).filter(time => now - time < window);
  
  if (requests.length >= limit) {
    return res.status(429).json({ 
      error: 'Too Many Requests',
      retryAfter: Math.ceil((requests[0] + window - now) / 1000)
    });
  }

  requests.push(now);
  rateLimitMap.set(clientId, requests);

  return handler(req, res);
}

export function sanitizeInput(data) {
  if (typeof data !== 'object' || data === null) return data;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    // Remover datos sensibles
    if (['apiKey', 'token', 'password', 'secret'].includes(key.toLowerCase())) {
      continue;
    }
    
    // Sanitizar strings
    if (typeof value === 'string') {
      sanitized[key] = value.trim().substring(0, 10000);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

export function withErrorHandler(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      console.error('[API Error]', error.message);
      
      // No exponer detalles de error en producción
      const isDev = process.env.NODE_ENV === 'development';
      res.status(500).json({
        error: 'Internal Server Error',
        ...(isDev && { message: error.message })
      });
    }
  };
}
