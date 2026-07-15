// Supabase Configuration
// For local dev: set SUPABASE_URL and SUPABASE_ANON_KEY in browser localStorage via DevTools.
// For production: set these as environment variables in your hosting dashboard.
(function(){
  var env = window.__ENV || {};
  window.SUPABASE_CONFIG = {
    url: window.localStorage.getItem('SUPABASE_URL') || env.SUPABASE_URL || '',
    anonKey: window.localStorage.getItem('SUPABASE_ANON_KEY') || env.SUPABASE_ANON_KEY || ''
  };
  window.WHATSAPP_NUMBER = '254700000000';
})();
