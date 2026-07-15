// Supabase Configuration — TEMPLATE
// Copy this file to config.local.js and fill in your keys for local dev.
// For production, set SUPABASE_URL and SUPABASE_ANON_KEY in your hosting dashboard.
const SUPABASE_CONFIG = {
  url: window.localStorage.getItem('SUPABASE_URL') || window.__ENV?.SUPABASE_URL || "",
  anonKey: window.localStorage.getItem('SUPABASE_ANON_KEY') || window.__ENV?.SUPABASE_ANON_KEY || ""
};

const WHATSAPP_NUMBER = "254700000000";
