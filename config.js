// Supabase Configuration
// For local dev: set SUPABASE_URL and SUPABASE_ANON_KEY in browser localStorage via DevTools.
// For Vercel production: set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel Environment Variables.
// The /api/config script (loaded before this) sets window.__ENV from Vercel env vars.

(function(){
  var env = window.__ENV || {};

  function setConfig(url, key) {
    window.SUPABASE_CONFIG = {
      url: url || window.localStorage.getItem('SUPABASE_URL') || '',
      anonKey: key || window.localStorage.getItem('SUPABASE_ANON_KEY') || ''
    };
    window.WHATSAPP_NUMBER = '254700000000';
    if (url) {
      var origin = url.replace(/\/rest\/v1.*$/, '').replace(/\/$/, '');
      var link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      var link2 = document.createElement('link');
      link2.rel = 'dns-prefetch';
      link2.href = origin;
      document.head.appendChild(link2);
    }
  }

  // Set config from window.__ENV (populated by /api/config script) or localStorage
  setConfig(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
})();
