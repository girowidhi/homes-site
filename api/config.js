// Vercel serverless function that injects Supabase config from env vars
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-cache');
  const url = process.env.SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || '';
  const js = `(function(){ window.__ENV = window.__ENV || {}; window.__ENV.SUPABASE_URL = ${JSON.stringify(url)}; window.__ENV.SUPABASE_ANON_KEY = ${JSON.stringify(anonKey)}; })();`;
  res.status(200).send(js);
}
