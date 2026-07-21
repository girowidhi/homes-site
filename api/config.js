// Vercel serverless function that injects Supabase config from env vars
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-cache');
  const url = process.env.SUPABASE_URL || 'https://gyjzjywguipdrmiuzqio.supabase.co';
  const anonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5anpqeXdndWlwZHJtaXV6cWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjczNDEsImV4cCI6MjEwMDIwMzM0MX0.Tv2Kjkz9y3QlJGrQhG89NIjEXZUGCfeNnYCaT_5WY4s';
  const js = `(function(){ window.__ENV = window.__ENV || {}; window.__ENV.SUPABASE_URL = ${JSON.stringify(url)}; window.__ENV.SUPABASE_ANON_KEY = ${JSON.stringify(anonKey)}; })();`;
  res.status(200).send(js);
}
