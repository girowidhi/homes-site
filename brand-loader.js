// brand-loader.js — replaces static "TobillionHomes" branding with dynamic content from site_content

(function(){
  var maxTries = 20;
  var _logo = '';
  var _name = '';
  var _parsed = null;

  function boot(n) {
    if (typeof fetchSiteContent !== 'function') {
      if (n < maxTries) { setTimeout(function(){ boot(n+1); }, 150); }
      return;
    }
    run();
  }
  async function run() {
    try {
      var brand = await fetchSiteContent('brand');
      if (brand && typeof brand === 'string') brand = JSON.parse(brand);
      _parsed = brand;
      _name = (brand && brand.name) || '';
      _logo = (brand && brand.logo) || '';
      var favicon = (brand && brand.favicon) || '';

      // Favicon
      if (favicon) {
        var link = document.querySelector('link[rel="icon"]');
        if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
        link.href = favicon;
      }

      // Title
      if (_name) {
        var t = document.querySelector('title');
        if (t) t.textContent = t.textContent.replace(/TobillionHomes/g, _name);
      }

      // Nav brand: find the first a/span/div in nav/header with headline styling
      var container = document.querySelector('nav') || document.querySelector('header');
      if (container) {
        var brandEl = findBrandElement(container);
        if (brandEl) replaceWithLogo(brandEl);
      }

      // Footer brand: find headline element in footer and replace with logo
      var footerEl = document.querySelector('footer');
      if (footerEl) {
        var footerBrand = findBrandElement(footerEl);
        if (footerBrand) replaceWithLogo(footerBrand);
      }

      // Preload logo image after replacing (smooth future navigation)
      if (_logo) {
        var preloader = new Image();
        preloader.src = _logo;
      }

      // Replace TobillionHomes text elsewhere
      if (_name) {
        walk(document.body, function(n){
          if (n.nodeValue.indexOf('TobillionHomes') !== -1) {
            n.nodeValue = n.nodeValue.split('TobillionHomes').join(_name);
          }
        });
      }
    } catch(e){
      console.warn("brand-loader: fetchSiteContent failed, using static branding", e?.message || '');
    }
  }

  function findBrandElement(root) {
    var sel = [
      'a.font-headline-md', 'span.font-headline-md', 'div.font-headline-md',
      'a[class*="font-headline"]', 'span[class*="font-headline"]', 'div[class*="font-headline"]',
      'a[href="index.html"]', 'a[href="./"]', 'a[href="/"]',
      'footer .font-headline-md', 'footer [class*="font-headline"]'
    ];
    for (var s = 0; s < sel.length; s++) {
      var els = root.querySelectorAll(sel[s]);
      for (var i = 0; i < els.length; i++) {
        if (els[i].textContent.trim().indexOf('TobillionHomes') !== -1) return els[i];
      }
    }
    var all = root.querySelectorAll('a,span,div,h1,h2,h3,h4');
    for (var j = 0; j < all.length; j++) {
      if (all[j].textContent.trim().indexOf('TobillionHomes') !== -1) return all[j];
    }
    return null;
  }

  function replaceWithLogo(el) {
    if (_logo) {
      var size = (_parsed && _parsed.logo_size) || 40;
      var transparent = (_parsed && _parsed.logo_bg_transparent) || false;
      var img = document.createElement('img');
      img.src = _logo;
      img.alt = _name || 'Logo';
      img.style.cssText = 'height:' + size + 'px;width:auto;max-width:180px;object-fit:contain;display:inline-block;vertical-align:middle';
      if (el.tagName === 'A') {
        el.innerHTML = '';
        el.appendChild(img);
      } else {
        var a = document.createElement('a');
        a.href = 'index.html';
        var aHeight = Math.max(size, 40);
        a.style.cssText = 'display:inline-flex;align-items:center;text-decoration:none;height:' + aHeight + 'px';
        if (!transparent) {
          a.style.background = '#fff';
          a.style.padding = '4px 8px';
          a.style.borderRadius = '8px';
        }
        var origClass = el.className || '';
        if (origClass) a.className = origClass;
        a.appendChild(img);
        el.parentNode.replaceChild(a, el);
      }
    } else if (_name) {
      el.textContent = _name;
    }
  }

  function walk(root, fn) {
    var iter = document.createNodeIterator(root, NodeFilter.SHOW_TEXT, null, false);
    var n;
    while ((n = iter.nextNode())) fn(n);
  }

  boot(0);
})();
