// seo-loader.js - reads site_content 'seo' and 'brand' keys, updates title & meta tags

(function(){
  function boot(n) {
    if (typeof fetchSiteContent !== 'function') {
      if (n < 20) { setTimeout(function(){ boot(n+1); }, 150); }
      return;
    }
    run();
  }
  async function run() {
    try {
      var seo = await fetchSiteContent('seo');
      if (seo && typeof seo === 'string') seo = JSON.parse(seo);
      var brand = await fetchSiteContent('brand');
      if (brand && typeof brand === 'string') brand = JSON.parse(brand);

      var name = (brand && brand.name) || '';
      var tagline = (brand && brand.tagline) || '';
      var metaTitle = (seo && seo.metaTitle) || '';
      var metaDesc = (seo && seo.metaDesc) || '';
      var ogImage = (seo && seo.ogImage) || '';

      // Update <title>
      if (metaTitle) {
        var t = document.querySelector('title');
        if (t) t.textContent = metaTitle;
      } else if (name && tagline) {
        var t = document.querySelector('title');
        if (t) t.textContent = name + ' | ' + tagline;
      } else if (name) {
        var t = document.querySelector('title');
        if (t) t.textContent = t.textContent.replace(/TobillionHomes/g, name);
      }

      // Update <meta name="description">
      if (metaDesc) {
        var md = document.querySelector('meta[name="description"]');
        if (md) md.content = metaDesc;
        else {
          md = document.createElement('meta');
          md.name = 'description';
          md.content = metaDesc;
          document.head.appendChild(md);
        }
      }

      // Update <meta property="og:image">
      if (ogImage) {
        var og = document.querySelector('meta[property="og:image"]');
        if (og) og.content = ogImage;
        else {
          og = document.createElement('meta');
          og.setAttribute('property', 'og:image');
          og.content = ogImage;
          document.head.appendChild(og);
        }
      } else if (brand && brand.logo) {
        var og = document.querySelector('meta[property="og:image"]');
        if (og) og.content = brand.logo;
      }
    } catch(e) {
      if (e) {}
    }
  }
  boot(0);
})();
