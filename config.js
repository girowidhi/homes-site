// Supabase Configuration
// For local dev: set SUPABASE_URL and SUPABASE_ANON_KEY in browser localStorage via DevTools.
// For Vercel production: set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel Environment Variables.

(function(){
  var env = window.__ENV || {};

  function setConfig(url, key) {
    window.SUPABASE_CONFIG = {
      url: url || window.localStorage.getItem('SUPABASE_URL') || '',
      anonKey: key || window.localStorage.getItem('SUPABASE_ANON_KEY') || ''
    };
    window.WHATSAPP_NUMBER = '254700000000';
  }

  // Set initial config from localStorage / window.__ENV
  setConfig(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

  // For Vercel deployment: fetch env vars from the API endpoint
  fetch('/api/config')
    .then(function(r) { return r.text(); })
    .then(function(js) {
      try {
        eval(js);
        var e = window.__ENV || {};
        if (e.SUPABASE_URL && e.SUPABASE_ANON_KEY) {
          setConfig(e.SUPABASE_URL, e.SUPABASE_ANON_KEY);
        }
      } catch(e) {}
    })
    .catch(function() { /* no-op, running locally */ });
})();
