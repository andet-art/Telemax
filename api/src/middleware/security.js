import 'dotenv/config';

export function applySecurity(app) {
  const raw = process.env.CORS_ORIGINS || '';
  const origins = raw.split(',').map(s => s.trim()).filter(Boolean);
  const allowAll = origins.length === 0;

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowAll) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    } else if (origin && origins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
}
