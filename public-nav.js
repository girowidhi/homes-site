// public-nav.js - Automates navigation routing across all TobillionHomes public pages
// Runs on every public page to wire up all links, buttons, and icons

(function () {
  'use strict';

  // ── Navigation Route Map ─────────────────────────────────────────────────────
  const ROUTES = {
    home: 'index.html',
    listings: 'properties.html',
    properties: 'properties.html',
    'browse counties': 'properties.html',
    projects: 'developments.html',
    developments: 'developments.html',
    'developments & projects': 'developments.html',
    about: 'about.html',
    'about us': 'about.html',
    'our story': 'about.html',
    news: 'news.html',
    'market insights': 'news.html',
    'market insights & news': 'news.html',
    'read all news': 'news.html',
    'read all news ': 'news.html',
    'mortgage guide': 'mortgage.html',
    'mortgage calculator': 'mortgage.html',
    mortgage: 'mortgage.html',
    'privacy policy': 'privacy.html',
    'terms of service': 'privacy.html',
    'terms': 'privacy.html',
    'security': 'privacy.html',
    'contact support': 'contact.html',
    'contact': 'contact.html',
    'contact us': 'contact.html',
    'nairobi hq': 'contact.html',
    'admin login': 'admin-login.html',
    'our premium agents': 'agents.html',
    'agents': 'agents.html',
    'property management': 'list-property.html',
    'list property': 'list-property.html',
    'list my property now': 'list-property.html',
    'list your property': 'list-property.html',
    'explore neighborhoods': 'neighborhoods.html',
    'neighborhoods': 'neighborhoods.html',
    'faq': 'faq.html',
    'frequently asked questions': 'faq.html',
    'compare properties': 'compare.html',
    'compare': 'compare.html',
    'view active listings': 'properties.html',
    'login': 'login.html',
    'sign up': 'login.html',
    'sign up for free': 'login.html',
    'register': 'login.html',
    'my account': 'account.html',
    'schedule a consultation': 'contact.html',
    'contact our sales team': 'contact.html',
    'our agents': 'agents.html',
    'careers': 'contact.html',
  };

  // ── Vegence UI Style & Layout Injection ───────────────────────────────────────
  function injectStyles() {
    // Vegence CSS
    if (!document.querySelector('link[href="vegence-ui.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'vegence-ui.css';
      document.head.appendChild(link);
    }
    // Fonts are set via tailwind config + vegence-ui.css — no external font loading needed
  }

  function setupNotchNavbar() {
    // Hide standard headers on pages
    const existingHeader = document.querySelector('header');
    if (existingHeader && !existingHeader.classList.contains('notch-nav')) {
      existingHeader.style.display = 'none';
    }
    
    if (document.querySelector('.notch-nav')) return;

    const notchNav = document.createElement('header');
    notchNav.className = 'notch-nav glass-effect flex justify-between items-center z-50';
    
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    
    notchNav.innerHTML = `
      <button class="mobile-hamburger material-symbols-outlined" id="mobile-menu-btn" aria-label="Open menu">menu</button>
      <div style="display:flex;align-items:center;gap:0.75rem;min-width:0;flex:1;overflow:hidden;">
        <span style="font-size:1rem;font-weight:700;color:#000613;white-space:nowrap;cursor:pointer;flex-shrink:0;" onclick="window.location.href='index.html'">TobillionHomes</span>
        <div class="notch-nav-links hidden md:flex" style="gap:1rem;overflow:hidden;flex:1;">
          <a class="notch-nav-link" style="color:${currentFile==='properties.html'?'#006c4e':'#43474e'};font-weight:600;" href="properties.html">Listings</a>
          <a class="notch-nav-link" style="color:${currentFile==='developments.html'?'#006c4e':'#43474e'};font-weight:600;" href="developments.html">Projects</a>
          <a class="notch-nav-link" style="color:${currentFile==='about.html'?'#006c4e':'#43474e'};font-weight:600;" href="about.html">About</a>
          <a class="notch-nav-link" style="color:${currentFile==='news.html'?'#006c4e':'#43474e'};font-weight:600;" href="news.html">News</a>
          <a class="notch-nav-link" style="color:${currentFile==='agents.html'?'#006c4e':'#43474e'};font-weight:600;" href="agents.html">Agents</a>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:0.6rem;flex-shrink:0;">
        <a href="list-property.html" class="vegence-btn-interactive" style="display:none;background:#000613;color:#fff;padding:0.45rem 1rem;border-radius:9999px;font-size:0.75rem;font-weight:700;white-space:nowrap;text-decoration:none;letter-spacing:0.02em;" id="nav-list-btn">List Property</a>
        <span class="material-symbols-outlined" style="cursor:pointer;color:#43474e;font-size:20px;transition:color 0.2s;" onmouseenter="this.style.color='#006c4e'" onmouseleave="this.style.color='#43474e'" onclick="window.location.href='account.html'">favorite</span>
        <div class="dropdown-modern" id="profile-dropdown" style="position:relative;">
          <div class="dropdown-trigger" id="profile-trigger" style="background:transparent;border:none;padding:0;min-width:unset;box-shadow:none;gap:4px;">
            <span class="material-symbols-outlined" style="color:#43474e;font-size:20px;transition:color 0.2s;">account_circle</span>
            <span class="material-symbols-outlined trigger-arrow" style="font-size:14px;color:#43474e;opacity:0.5;">expand_more</span>
          </div>
          <div class="dropdown-menu" style="right:0;min-width:180px;" id="profile-dropdown-menu">
            <div class="dropdown-item" data-href="account.html">
              <span class="material-symbols-outlined">person</span>
              My Account
            </div>
            <div class="dropdown-item" data-href="account.html">
              <span class="material-symbols-outlined">favorite</span>
              Saved Listings
            </div>
            <div class="dropdown-item" data-href="list-property.html">
              <span class="material-symbols-outlined">add_home</span>
              List a Property
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" data-href="admin-login.html" id="dropdown-admin-link">
              <span class="material-symbols-outlined">admin_panel_settings</span>
              Admin Panel
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" id="dropdown-logout" style="color:#ba1a1a;">
              <span class="material-symbols-outlined" style="color:#ba1a1a;">logout</span>
              Sign Out
            </div>
          </div>
        </div>
      </div>
    `;

    // Show list-property button on wider screens
    const listBtn = document.getElementById('nav-list-btn');
    if (listBtn) {
      const showListBtn = () => { listBtn.style.display = window.innerWidth >= 640 ? 'block' : 'none'; };
      showListBtn();
      window.addEventListener('resize', showListBtn);
    }
    
    document.body.prepend(notchNav);
    
    // ── Profile Dropdown Wiring ─────────────────────────────────────────
    const profileDropdown = document.getElementById('profile-dropdown');
    const profileTrigger = document.getElementById('profile-trigger');
    
    function closeAllDropdowns() {
      document.querySelectorAll('.dropdown-modern.active').forEach(d => d.classList.remove('active'));
    }
    
    if (profileTrigger && profileDropdown) {
      profileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllDropdowns();
        profileDropdown.classList.toggle('active');
      });
    }
    
    // Wire dropdown items
    document.querySelectorAll('#profile-dropdown .dropdown-item').forEach(item => {
      item.addEventListener('click', async (e) => {
        e.stopPropagation();
        closeAllDropdowns();
        const href = item.dataset.href;
        if (href) {
          window.location.href = href;
        }
      });
    });
    
    // Wire sign-out
    const logoutItem = document.getElementById('dropdown-logout');
    if (logoutItem) {
      logoutItem.addEventListener('click', async (e) => {
        e.stopPropagation();
        closeAllDropdowns();
        try {
          await logoutUser();
        } catch {}
        window.location.href = 'login.html';
      });
    }
    
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#profile-dropdown')) {
        closeAllDropdowns();
      }
    });

    // ── Mobile Hamburger Drawer ──────────────────────────────────────────
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn && !document.getElementById('mobile-drawer')) {
      const drawer = document.createElement('div');
      drawer.className = 'mobile-drawer';
      drawer.id = 'mobile-drawer';
      drawer.innerHTML = `
        <div class="mobile-drawer-overlay" id="drawer-overlay"></div>
        <div class="mobile-drawer-panel">
          <div class="mobile-drawer-header">
            <span>TobillionHomes</span>
            <button class="mobile-drawer-close material-symbols-outlined" id="drawer-close">close</button>
          </div>
          <nav style="display:flex;flex-direction:column;gap:4px;">
            <a class="mobile-drawer-item ${currentFile==='index.html'?'active':''}" href="index.html"><span class="material-symbols-outlined">home</span> Home</a>
            <a class="mobile-drawer-item ${currentFile==='properties.html'?'active':''}" href="properties.html"><span class="material-symbols-outlined">search</span> Browse Listings</a>
            <a class="mobile-drawer-item ${currentFile==='developments.html'?'active':''}" href="developments.html"><span class="material-symbols-outlined">apartment</span> Developments</a>
            <a class="mobile-drawer-item ${currentFile==='agents.html'?'active':''}" href="agents.html"><span class="material-symbols-outlined">groups</span> Elite Agents</a>
            <a class="mobile-drawer-item ${currentFile==='about.html'?'active':''}" href="about.html"><span class="material-symbols-outlined">info</span> About Us</a>
            <a class="mobile-drawer-item ${currentFile==='news.html'?'active':''}" href="news.html"><span class="material-symbols-outlined">newspaper</span> News & Insights</a>
            <a class="mobile-drawer-item ${currentFile==='contact.html'?'active':''}" href="contact.html"><span class="material-symbols-outlined">support</span> Contact</a>
          </nav>
          <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(0,6,19,0.06);">
            <a class="mobile-drawer-item" href="list-property.html"><span class="material-symbols-outlined">add_home</span> List Your Property</a>
            <a class="mobile-drawer-item" href="account.html"><span class="material-symbols-outlined">favorite</span> Saved Listings</a>
            <a class="mobile-drawer-item" href="login.html"><span class="material-symbols-outlined">person</span> Sign In / Register</a>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);

      function openDrawer() {
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      function closeDrawer() {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
      }

      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDrawer();
      });

      document.getElementById('drawer-close').addEventListener('click', closeDrawer);
      document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
      });
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        notchNav.classList.add('scrolled');
      } else {
        notchNav.classList.remove('scrolled');
      }
    });
  }

  function setupGlassDock() {
    // Hide standard mobile fixed bottom navigation elements
    const oldMobileNavs = document.querySelectorAll('nav[class*="fixed"][class*="bottom"], nav[class*="bottom-0"]');
    oldMobileNavs.forEach(nav => {
      if (!nav.classList.contains('glass-dock')) {
        nav.style.display = 'none';
      }
    });
    
    if (document.querySelector('.glass-dock')) return;
    
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    
    const glassDock = document.createElement('div');
    glassDock.className = 'glass-dock glass-effect';
    
    glassDock.innerHTML = `
      <a href="index.html" class="dock-item ${currentFile === 'index.html' || currentFile === '' ? 'active' : ''}" data-tooltip="Home" data-route="index.html">
        <span class="material-symbols-outlined">home</span>
      </a>
      <a href="properties.html" class="dock-item ${currentFile === 'properties.html' ? 'active' : ''}" data-tooltip="Listings" data-route="properties.html">
        <span class="material-symbols-outlined">apartment</span>
      </a>
      <a href="account.html" class="dock-item ${currentFile === 'account.html' ? 'active' : ''}" data-tooltip="Favorites" data-route="account.html">
        <span class="material-symbols-outlined">favorite</span>
      </a>
      <a href="agents.html" class="dock-item ${currentFile === 'agents.html' ? 'active' : ''}" data-tooltip="Elite Agents" data-route="agents.html">
        <span class="material-symbols-outlined">groups</span>
      </a>
      <a href="contact.html" class="dock-item ${currentFile === 'contact.html' ? 'active' : ''}" data-tooltip="Contact Us" data-route="contact.html">
        <span class="material-symbols-outlined">chat_bubble</span>
      </a>
      <a href="login.html" class="dock-item ${currentFile === 'login.html' ? 'active' : ''}" data-tooltip="Account" data-route="login.html">
        <span class="material-symbols-outlined">account_circle</span>
      </a>
    `;
    
    document.body.appendChild(glassDock);
    
    const dockItems = glassDock.querySelectorAll('.dock-item');
    dockItems.forEach((item, index) => {
      item.addEventListener('mousemove', () => {
        dockItems.forEach(el => {
          el.style.transform = '';
          el.style.zIndex = '1';
        });
        
        item.style.transform = 'scale(1.4) translateY(-8px)';
        item.style.zIndex = '10';
        
        if (dockItems[index - 1]) {
          dockItems[index - 1].style.transform = 'scale(1.18) translateY(-4px)';
          dockItems[index - 1].style.zIndex = '5';
        }
        if (dockItems[index + 1]) {
          dockItems[index + 1].style.transform = 'scale(1.18) translateY(-4px)';
          dockItems[index + 1].style.zIndex = '5';
        }
      });
      
      item.addEventListener('mouseleave', () => {
        dockItems.forEach(el => {
          el.style.transform = '';
          el.style.zIndex = '1';
        });
      });
      
      if (item.getAttribute('data-route') === 'login.html') {
        item.addEventListener('click', async (e) => {
          e.preventDefault();
          try {
            const user = typeof getCurrentUser === 'function' ? await getCurrentUser() : null;
            window.location.href = user ? 'account.html' : 'login.html';
          } catch {
            window.location.href = 'login.html';
          }
        });
      }
    });
  }

  function maskAvatars() {
    const avatarImgs = document.querySelectorAll('main img, .agent-card img, img[class*="rounded-full"]');
    avatarImgs.forEach((img, index) => {
      if (img.classList.contains('w-full') && img.classList.contains('h-full') && !img.closest('.group') && !img.closest('[class*="card"]')) {
        return; 
      }
      
      const isAgentPhoto = img.closest('[class*="agent"]') || img.closest('.lg\\:col-span-2') || img.closest('[class*="profile"]') || img.classList.contains('rounded-full');
      if (isAgentPhoto) {
        img.classList.remove('rounded-full');
        if (index % 2 === 0) {
          img.classList.add('masked-avatar-blob');
        } else {
          img.classList.add('masked-avatar-squircle');
        }
      }
    });
  }

  function injectKineticLoader() {
    if (document.getElementById('kinetic-loader')) return;
    const overlay = document.createElement('div');
    overlay.id = 'kinetic-loader';
    overlay.className = 'kinetic-loader-overlay';
    overlay.innerHTML = `
      <div class="kinetic-loader-card">
        <div class="blob-loader"></div>
        <div class="kinetic-text" id="kinetic-loader-text">Matching Properties...</div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // ── Silhouette Skyline Footer Injection ───────────────────────────────────
  function injectSilhouetteFooter() {
    // Only inject once and only on pages that have a footer
    if (document.getElementById('skyline-footer-svg')) return;
    const footerEl = document.querySelector('footer');
    if (!footerEl) return;

    const skylineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    skylineSvg.setAttribute('id', 'skyline-footer-svg');
    skylineSvg.setAttribute('class', 'footer-skyline');
    skylineSvg.setAttribute('viewBox', '0 0 1440 160');
    skylineSvg.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    skylineSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    skylineSvg.setAttribute('aria-hidden', 'true');
    skylineSvg.innerHTML = `
      <g fill="#000613" opacity="0.95">
        <!-- Far background buildings -->
        <rect x="0" y="110" width="30" height="50"/>
        <rect x="28" y="90" width="20" height="70"/>
        <rect x="46" y="100" width="15" height="60"/>
        <!-- Antenna on bg building -->
        <rect x="55" y="75" width="2" height="25"/>
        <rect x="59" y="95" width="25" height="65"/>
        <rect x="82" y="80" width="35" height="80"/>
        <!-- Windows on tall building -->
        <rect x="86" y="84" width="5" height="4" fill="#7bd8b1" opacity="0.6"/>
        <rect x="95" y="84" width="5" height="4" fill="#7bd8b1" opacity="0.6"/>
        <rect x="86" y="92" width="5" height="4" fill="#7bd8b1" opacity="0.6"/>
        <rect x="95" y="92" width="5" height="4" fill="#7bd8b1" opacity="0.3"/>
        <rect x="86" y="100" width="5" height="4" fill="#7bd8b1" opacity="0.6"/>
        <rect x="115" y="105" width="22" height="55"/>
        <rect x="135" y="88" width="18" height="72"/>
        <!-- Stepped pyramid tower -->
        <rect x="151" y="60" width="40" height="100"/>
        <rect x="155" y="50" width="32" height="20"/>
        <rect x="160" y="38" width="22" height="18"/>
        <rect x="166" y="25" width="10" height="18"/>
        <!-- Antenna -->
        <rect x="170" y="8" width="2" height="22"/>
        <rect x="169" y="8" width="4" height="3"/>
        <!-- Windows on tower -->
        <rect x="156" y="66" width="7" height="6" fill="#7bd8b1" opacity="0.5"/>
        <rect x="168" y="66" width="7" height="6" fill="#7bd8b1" opacity="0.5"/>
        <rect x="180" y="66" width="7" height="6" fill="#7bd8b1" opacity="0.5"/>
        <rect x="156" y="78" width="7" height="6" fill="#7bd8b1" opacity="0.4"/>
        <rect x="168" y="78" width="7" height="6" fill="#7bd8b1" opacity="0.8"/>
        <rect x="180" y="78" width="7" height="6" fill="#7bd8b1" opacity="0.4"/>
        <rect x="189" y="100" width="25" height="60"/>
        <rect x="212" y="115" width="16" height="45"/>
        <!-- Curved arch building -->
        <rect x="226" y="70" width="50" height="90"/>
        <ellipse cx="251" cy="70" rx="25" ry="12"/>
        <!-- Windows -->
        <rect x="233" y="78" width="8" height="6" fill="#7bd8b1" opacity="0.5"/>
        <rect x="248" y="78" width="8" height="6" fill="#7bd8b1" opacity="0.5"/>
        <rect x="263" y="78" width="8" height="6" fill="#7bd8b1" opacity="0.5"/>
        <rect x="274" y="100" width="28" height="60"/>
        <rect x="300" y="85" width="20" height="75"/>
        <rect x="318" y="65" width="45" height="95"/>
        <!-- Antenna -->
        <rect x="339" y="48" width="2" height="22"/>
        <rect x="336" y="48" width="8" height="3"/>
        <!-- Windows -->
        <rect x="323" y="72" width="8" height="6" fill="#7bd8b1" opacity="0.6"/>
        <rect x="337" y="72" width="8" height="6" fill="#7bd8b1" opacity="0.3"/>
        <rect x="351" y="72" width="8" height="6" fill="#7bd8b1" opacity="0.6"/>
        <rect x="323" y="84" width="8" height="6" fill="#7bd8b1" opacity="0.4"/>
        <rect x="337" y="84" width="8" height="6" fill="#7bd8b1" opacity="0.6"/>
        <rect x="351" y="84" width="8" height="6" fill="#7bd8b1" opacity="0.4"/>
        <rect x="361" y="110" width="22" height="50"/>
        <rect x="381" y="90" width="30" height="70"/>
        <!-- Glass curtain wall skyscraper -->
        <rect x="409" y="40" width="55" height="120"/>
        <rect x="413" y="30" width="47" height="16"/>
        <rect x="419" y="18" width="35" height="16"/>
        <!-- Horizontal floor lines -->
        <rect x="409" y="55" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="409" y="67" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="409" y="79" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="409" y="91" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="409" y="103" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="409" y="115" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="409" y="127" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="462" y="100" width="25" height="60"/>
        <rect x="485" y="80" width="35" height="80"/>
        <!-- Stepped top -->
        <rect x="490" y="68" width="25" height="16"/>
        <rect x="495" y="56" width="15" height="16"/>
        <rect x="498" y="46" width="9" height="14"/>
        <rect x="518" y="105" width="20" height="55"/>
        <rect x="536" y="88" width="28" height="72"/>
        <!-- Diamond crown building -->
        <rect x="562" y="55" width="50" height="105"/>
        <polygon points="562,55 587,30 612,55"/>
        <!-- Antenna -->
        <rect x="586" y="10" width="2" height="24"/>
        <circle cx="587" cy="9" r="3" fill="#7bd8b1" opacity="0.9"/>
        <!-- Windows -->
        <rect x="568" y="62" width="9" height="7" fill="#7bd8b1" opacity="0.5"/>
        <rect x="582" y="62" width="9" height="7" fill="#7bd8b1" opacity="0.7"/>
        <rect x="596" y="62" width="9" height="7" fill="#7bd8b1" opacity="0.5"/>
        <rect x="568" y="74" width="9" height="7" fill="#7bd8b1" opacity="0.4"/>
        <rect x="582" y="74" width="9" height="7" fill="#7bd8b1" opacity="0.5"/>
        <rect x="596" y="74" width="9" height="7" fill="#7bd8b1" opacity="0.4"/>
        <rect x="610" y="100" width="22" height="60"/>
        <rect x="630" y="78" width="40" height="82"/>
        <!-- Arch on top -->
        <ellipse cx="650" cy="78" rx="20" ry="10"/>
        <rect x="660" y="95" width="22" height="65"/>
        <!-- Center landmark - Tallest -->
        <rect x="680" y="20" width="60" height="140"/>
        <rect x="685" y="10" width="50" height="16"/>
        <rect x="693" y="0" width="34" height="14"/>
        <rect x="709" y="-8" width="2" height="12"/>
        <!-- Horizontal floors -->
        <rect x="680" y="36" width="60" height="1.5" fill="#7bd8b1" opacity="0.25"/>
        <rect x="680" y="52" width="60" height="1.5" fill="#7bd8b1" opacity="0.25"/>
        <rect x="680" y="68" width="60" height="1.5" fill="#7bd8b1" opacity="0.25"/>
        <rect x="680" y="84" width="60" height="1.5" fill="#7bd8b1" opacity="0.25"/>
        <rect x="680" y="100" width="60" height="1.5" fill="#7bd8b1" opacity="0.25"/>
        <rect x="680" y="116" width="60" height="1.5" fill="#7bd8b1" opacity="0.25"/>
        <rect x="680" y="132" width="60" height="1.5" fill="#7bd8b1" opacity="0.25"/>
        <!-- Windows on landmark -->
        <rect x="686" y="40" width="10" height="8" fill="#7bd8b1" opacity="0.6"/>
        <rect x="702" y="40" width="10" height="8" fill="#7bd8b1" opacity="0.9"/>
        <rect x="718" y="40" width="10" height="8" fill="#7bd8b1" opacity="0.6"/>
        <rect x="686" y="56" width="10" height="8" fill="#7bd8b1" opacity="0.4"/>
        <rect x="702" y="56" width="10" height="8" fill="#7bd8b1" opacity="0.6"/>
        <rect x="718" y="56" width="10" height="8" fill="#7bd8b1" opacity="0.4"/>
        <!-- Right side mirror -->
        <rect x="738" y="78" width="40" height="82"/>
        <ellipse cx="758" cy="78" rx="20" ry="10"/>
        <rect x="776" y="100" width="22" height="60"/>
        <rect x="796" y="70" width="45" height="90"/>
        <rect x="839" y="85" width="22" height="75"/>
        <!-- Pyramid crown -->
        <rect x="858" y="52" width="55" height="108"/>
        <polygon points="858,52 885,26 913,52"/>
        <rect x="884" y="6" width="2" height="24"/>
        <circle cx="885" cy="5" r="3" fill="#7bd8b1" opacity="0.9"/>
        <rect x="864" y="60" width="9" height="7" fill="#7bd8b1" opacity="0.5"/>
        <rect x="878" y="60" width="9" height="7" fill="#7bd8b1" opacity="0.7"/>
        <rect x="892" y="60" width="9" height="7" fill="#7bd8b1" opacity="0.5"/>
        <rect x="910" y="95" width="22" height="65"/>
        <rect x="930" y="78" width="35" height="82"/>
        <rect x="933" y="66" width="29" height="16"/>
        <rect x="937" y="54" width="21" height="16"/>
        <rect x="962" y="100" width="24" height="60"/>
        <!-- Glass curtain right -->
        <rect x="984" y="42" width="55" height="118"/>
        <rect x="988" y="32" width="47" height="16"/>
        <rect x="994" y="20" width="35" height="16"/>
        <rect x="984" y="57" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="984" y="69" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="984" y="81" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="984" y="93" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="984" y="105" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="984" y="117" width="55" height="1" fill="#7bd8b1" opacity="0.3"/>
        <rect x="1037" y="95" width="28" height="65"/>
        <rect x="1063" y="72" width="40" height="88"/>
        <ellipse cx="1083" cy="72" rx="20" ry="11"/>
        <rect x="1101" y="88" width="22" height="72"/>
        <rect x="1121" y="58" width="50" height="102"/>
        <rect x="1125" y="46" width="42" height="18"/>
        <rect x="1131" y="34" width="30" height="16"/>
        <rect x="1136" y="22" width="20" height="16"/>
        <rect x="1145" y="8" width="2" height="18"/>
        <rect x="1143" y="8" width="6" height="3"/>
        <rect x="1127" y="65" width="8" height="6" fill="#7bd8b1" opacity="0.5"/>
        <rect x="1141" y="65" width="8" height="6" fill="#7bd8b1" opacity="0.7"/>
        <rect x="1155" y="65" width="8" height="6" fill="#7bd8b1" opacity="0.5"/>
        <rect x="1169" y="95" width="22" height="65"/>
        <rect x="1189" y="78" width="30" height="82"/>
        <rect x="1217" y="92" width="20" height="68"/>
        <rect x="1235" y="70" width="42" height="90"/>
        <rect x="1239" y="56" width="34" height="20"/>
        <rect x="1244" y="42" width="24" height="18"/>
        <rect x="1275" y="100" width="22" height="60"/>
        <rect x="1295" y="85" width="30" height="75"/>
        <rect x="1323" y="102" width="20" height="58"/>
        <rect x="1341" y="88" width="28" height="72"/>
        <rect x="1367" y="98" width="25" height="62"/>
        <rect x="1390" y="110" width="18" height="50"/>
        <rect x="1406" y="95" width="22" height="65"/>
        <rect x="1426" y="105" width="14" height="55"/>
        <!-- Ground / baseline -->
        <rect x="0" y="155" width="1440" height="10"/>
      </g>
    `;

    footerEl.insertBefore(skylineSvg, footerEl.firstChild);
  }

  window.showKineticLoader = function(text = 'Matching Properties...', duration = 1200) {
    injectKineticLoader();
    const overlay = document.getElementById('kinetic-loader');
    const textEl = document.getElementById('kinetic-loader-text');
    if (textEl) textEl.innerText = text;
    if (overlay) overlay.classList.add('active');
    
    if (duration) {
      setTimeout(() => {
        window.hideKineticLoader();
      }, duration);
    }
  };

  window.hideKineticLoader = function() {
    const overlay = document.getElementById('kinetic-loader');
    if (overlay) overlay.classList.remove('active');
  };

  function setupLoaderTriggers() {
    // Intercept clicks on searches, bookings, and forms
    document.querySelectorAll('button, a').forEach(el => {
      const text = el.textContent.trim().toLowerCase();
      const isSearch = text.includes('search') || el.id === 'apply-filters';
      const isBooking = text.includes('book') || text.includes('consultation') || text.includes('list my property') || text.includes('partner');
      
      if (isSearch) {
        el.addEventListener('click', () => {
          window.showKineticLoader('Searching Listings...', 1400);
        });
      } else if (isBooking) {
        el.addEventListener('click', (e) => {
          const targetHref = el.getAttribute('href');
          if (targetHref && targetHref !== '#') {
            e.preventDefault();
            window.showKineticLoader('Securing Consultation...', 1000);
            setTimeout(() => {
              window.location.href = targetHref;
            }, 900);
          } else {
            window.showKineticLoader('Connecting Agent...', 1200);
          }
        });
      }
    });

    // Intercept county links
    document.querySelectorAll('section h3').forEach(h3 => {
      const card = h3.closest('[class*="rounded"]') || h3.parentElement;
      const section = h3.closest('section');
      const heading = section?.querySelector('h2');
      if (heading && heading.textContent.toLowerCase().includes('county') && card) {
        card.addEventListener('click', () => {
          window.showKineticLoader(`Loading ${h3.textContent} Properties...`, 1300);
        });
      }
    });
  }

  function initMorphText() {
    const headings = document.querySelectorAll('h1');
    headings.forEach(h1 => {
      if (h1.textContent.includes('Your Gateway to')) {
        h1.innerHTML = `Your Gateway to <div class="morph-text-wrapper"><span class="morph-word active">Premium</span><span class="morph-word">Exclusive</span><span class="morph-word">Luxury</span><span class="morph-word">Waterfront</span><span class="morph-word">Off-Market</span></div> Kenyan Real Estate`;
        startMorphing();
      }
    });
  }

  function startMorphing() {
    const words = document.querySelectorAll('.morph-word');
    if (words.length === 0) return;
    let currentIndex = 0;
    
    setInterval(() => {
      const currentWord = words[currentIndex];
      if (currentWord) {
        currentWord.classList.remove('active');
        currentWord.classList.add('exit');
      }
      
      currentIndex = (currentIndex + 1) % words.length;
      
      const nextWord = words[currentIndex];
      if (nextWord) {
        nextWord.classList.remove('exit');
        nextWord.classList.add('active');
      }
      
      setTimeout(() => {
        words.forEach((w, idx) => {
          if (idx !== currentIndex) w.classList.remove('exit');
        });
      }, 600);
    }, 3200);
  }

  // ── Dynamic Nav: load from site_content ────────────────────────────────────
  async function loadDynamicNav() {
    try {
      if (typeof fetchSiteContent !== 'function') return;
      var navItems = await fetchSiteContent('nav');
      if (!navItems || !Array.isArray(navItems) || navItems.length === 0) return;

      var currentFile = window.location.pathname.split('/').pop() || 'index.html';

      // Update notch navbar links
      var navLinks = document.querySelector('.notch-nav-links');
      if (navLinks) {
        navLinks.innerHTML = navItems.map(function(item){
          var isActive = currentFile === item.link;
          return '<a class="notch-nav-link" style="color:' + (isActive ? '#006c4e' : '#43474e') + ';font-weight:600;" href="' + item.link + '">' + item.label + '</a>';
        }).join('');
      }

      // Update mobile drawer main nav items (keep the special bottom items)
      var drawerNav = document.querySelector('.mobile-drawer-panel > nav');
      if (drawerNav) {
        drawerNav.innerHTML = navItems.map(function(item){
          var isActive = currentFile === item.link;
          return '<a class="mobile-drawer-item' + (isActive ? ' active' : '') + '" href="' + item.link + '"><span class="material-symbols-outlined">navigation</span> ' + item.label + '</a>';
        }).join('');
      }
    } catch(e) {}
  }

  // ── Main Initializer ─────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    setupNotchNavbar();
    setupGlassDock();
    maskAvatars();
    injectKineticLoader();
    injectSilhouetteFooter();
    initMorphText();
    setupLoaderTriggers();
    loadDynamicNav();

    wireLogoLinks();
    wireNavLinks();
    wireButtons();
    wireIcons();
    wireSearchForms();
    wireCountyCards();
    wirePropertyCards();
    wireNewsCards();
    wireFooterLinks();
    wireMobileNav();
    wireWhatsApp();
    wireBackToListings();
  }

  // ── Logo → Home ──────────────────────────────────────────────────────────────
  function wireLogoLinks() {
    document.querySelectorAll('span, div, a, h1, h2').forEach(el => {
      if (el.children.length === 0 && el.textContent.trim() === 'TobillionHomes') {
        el.style.cursor = 'pointer';
        el.addEventListener('click', e => {
          if (el.tagName !== 'A') {
            e.stopPropagation();
            window.location.href = ROUTES.home;
          } else {
            el.href = ROUTES.home;
          }
        });
      }
    });
    document.querySelectorAll('a').forEach(a => {
      if (a.textContent.trim() === 'TobillionHomes') {
        a.href = ROUTES.home;
      }
    });
  }

  // ── Nav & Footer Anchor Links ────────────────────────────────────────────────
  function wireNavLinks() {
    document.querySelectorAll('a').forEach(link => {
      const text = link.textContent.trim().toLowerCase();
      if (ROUTES[text]) {
        link.href = ROUTES[text];
      }
    });
  }

  // ── Buttons (CTA, Header, Page) ──────────────────────────────────────────────
  function wireButtons() {
    document.querySelectorAll('button').forEach(btn => {
      const text = btn.textContent.trim().toLowerCase();
      if (ROUTES[text]) {
        btn.addEventListener('click', e => {
          e.preventDefault();
          window.location.href = ROUTES[text];
        });
      } else if (text.includes('list property') || text.includes('list my property') || text.includes('list your property')) {
        btn.addEventListener('click', e => {
          e.preventDefault();
          window.location.href = ROUTES['list property'];
        });
      } else if (text.includes('contact') && (text.includes('sale') || text.includes('team') || text.includes('consult'))) {
        btn.addEventListener('click', e => {
          e.preventDefault();
          window.location.href = ROUTES['contact us'];
        });
      } else if (text.includes('schedule')) {
        btn.addEventListener('click', e => {
          e.preventDefault();
          window.location.href = ROUTES['contact us'];
        });
      } else if (text.includes('view active listing') || text.includes('explore listing') || text.includes('browse listing')) {
        btn.addEventListener('click', e => {
          e.preventDefault();
          window.location.href = ROUTES['properties'];
        });
      } else if (text.includes('add listing') || text.includes('add new listing')) {
        btn.addEventListener('click', e => {
          e.preventDefault();
          window.location.href = 'admin-add-property.html';
        });
      } else if (text.includes('discover our story')) {
        btn.addEventListener('click', e => {
          e.preventDefault();
          window.location.href = ROUTES['about us'];
        });
      } else if (text.includes('apply filter') || text.includes('apply')) {
        // handled by property filter logic on properties.html
      }
    });

    // Wire "a" tags acting as buttons  
    document.querySelectorAll('a').forEach(a => {
      const text = a.textContent.trim().toLowerCase();
      if (!a.href || a.href === '#' || a.href.endsWith('#')) {
        if (ROUTES[text]) {
          a.href = ROUTES[text];
        }
      }
    });
  }

  // ── Material Symbols Icons in Header ────────────────────────────────────────
  function wireIcons() {
    document.querySelectorAll('.material-symbols-outlined').forEach(icon => {
      const iconText = icon.textContent.trim();
      const parentAnchor = icon.closest('a');

      if (iconText === 'favorite') {
        if (parentAnchor) { parentAnchor.href = 'account.html'; return; }
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', () => { window.location.href = 'account.html'; });
      } else if (iconText === 'account_circle' || iconText === 'person') {
        if (parentAnchor) { parentAnchor.href = 'login.html'; return; }
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', async () => {
          try {
            const user = await getCurrentUser();
            window.location.href = user ? 'account.html' : 'login.html';
          } catch {
            window.location.href = 'login.html';
          }
        });
      } else if (iconText === 'home') {
        if (parentAnchor) { parentAnchor.href = 'index.html'; }
      } else if (iconText === 'search' && parentAnchor) {
        parentAnchor.href = 'properties.html';
      }
    });
  }

  // ── Hero Search Form → properties.html ──────────────────────────────────────
  function wireSearchForms() {
    document.querySelectorAll('button').forEach(btn => {
      if (!btn.textContent.trim().toLowerCase().includes('search')) return;
      const container = btn.closest('div');
      if (!container) return;
      const inputs = container.querySelectorAll('input, select');
      if (inputs.length === 0) return;

      btn.addEventListener('click', e => {
        e.preventDefault();
        const params = new URLSearchParams();
        inputs.forEach(input => {
          const ph = (input.placeholder || '').toLowerCase();
          const val = input.value.trim();
          if (!val) return;
          if (ph.includes('county') || ph.includes('e.g. nairobi')) params.append('county', val);
          else if (ph.includes('estate') || ph.includes('e.g. karen')) params.append('estate', val);
          else if (input.tagName === 'SELECT' && val !== 'Property Type') params.append('type', val);
        });
        window.location.href = `properties.html?${params.toString()}`;
      });
    });

    // Also wire any search button by class/id
    const applyBtn = document.querySelector('#apply-filters, .apply-filters-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const county = document.querySelector('select[name="county"]')?.value || '';
        const type = document.querySelector('select[name="type"]')?.value || '';
        const estate = document.querySelector('input[name="estate"]')?.value || '';
        const params = new URLSearchParams();
        if (county) params.append('county', county);
        if (type) params.append('type', type);
        if (estate) params.append('estate', estate);
        window.location.href = `properties.html?${params.toString()}`;
      });
    }
  }

  // ── County Bento Cards → properties.html?county=X ───────────────────────────
  function wireCountyCards() {
    // Strategy 1: Cards with background-image containing county names
    document.querySelectorAll('div[style*="background-image"]').forEach(card => {
      const parent = card.parentElement;
      if (!parent) return;
      const titleEl = parent.querySelector('h3');
      if (!titleEl) return;
      const section = card.closest('section');
      if (!section) return;
      const heading = section.querySelector('h2');
      if (!heading || !heading.textContent.toLowerCase().includes('county')) return;

      const wrapper = card.closest('[class*="group"]') || card.parentElement.parentElement;
      if (wrapper) {
        wrapper.style.cursor = 'pointer';
        wrapper.addEventListener('click', () => {
          const county = titleEl.textContent.trim();
          window.location.href = `properties.html?county=${encodeURIComponent(county)}`;
        });
      }
    });

    // Strategy 2: Any heading with county name inside a clickable card
    document.querySelectorAll('section').forEach(sec => {
      const h2 = sec.querySelector('h2');
      if (!h2 || !h2.textContent.toLowerCase().includes('county')) return;
      sec.querySelectorAll('h3').forEach(h3 => {
        const card = h3.closest('[class*="rounded"]') || h3.parentElement;
        if (card) {
          card.style.cursor = 'pointer';
          card.addEventListener('click', () => {
            window.location.href = `properties.html?county=${encodeURIComponent(h3.textContent.trim())}`;
          });
        }
      });
    });
  }

  // ── Property Cards → detail.html?id=X ───────────────────────────────────────
  function wirePropertyCards() {
    // Wire chevron buttons inside cards to go to detail page
    document.querySelectorAll('[class*="listing-card"], [class*="property-card"]').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        window.location.href = id ? `detail.html?id=${id}` : 'detail.html';
      });
    });

    // Wire individual chevron_right buttons inside property cards to navigate to detail
    document.querySelectorAll('button').forEach(btn => {
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon && icon.textContent.trim() === 'chevron_right') {
        // Find nearest card ancestor with a data-id
        const card = btn.closest('[data-id]');
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const id = card?.dataset?.id;
          window.location.href = id ? `detail.html?id=${id}` : 'detail.html';
        });
      }
    });

    // Wire "Explore More" / "View All" type links in similar-properties sections
    document.querySelectorAll('a').forEach(a => {
      const text = a.textContent.trim().toLowerCase();
      if (text === 'explore more' || text === 'see all' || text === 'view all properties') {
        a.href = 'properties.html';
      }
    });
  }

  // ── News Cards → news.html ──────────────────────────────────────────────────
  function wireNewsCards() {
    document.querySelectorAll('[class*="cursor-pointer"]').forEach(card => {
      const hasHeading = card.querySelector('h3');
      const section = card.closest('section');
      if (hasHeading && section) {
        const h2 = section.querySelector('h2');
        if (h2 && (h2.textContent.includes('News') || h2.textContent.includes('Insights'))) {
          card.addEventListener('click', () => {
            window.location.href = 'news.html';
          });
        }
      }
    });
  }

  // ── Footer Links ─────────────────────────────────────────────────────────────
  function wireFooterLinks() {
    const footerMap = {
      'browse counties': 'properties.html',
      'property management': 'list-property.html',
      'mortgage guide': 'mortgage.html',
      'privacy policy': 'privacy.html',
      'contact support': 'contact.html',
      'terms of service': 'privacy.html',
      'terms': 'privacy.html',
      'security': 'privacy.html',
      'about us': 'about.html',
      'our story': 'about.html',
      'nairobi hq': 'contact.html',
      'careers': 'contact.html',
      'api documentation': 'admin-dashboard.html',
    };

    document.querySelectorAll('footer a').forEach(a => {
      const text = a.textContent.trim().toLowerCase();
      if (footerMap[text]) {
        a.href = footerMap[text];
      }
    });

    // Bottom bar links
    document.querySelectorAll('a').forEach(a => {
      const text = a.textContent.trim().toLowerCase();
      if (text === 'admin login') a.href = 'admin-login.html';
      if (text === 'terms') a.href = 'privacy.html';
      if (text === 'security') a.href = 'privacy.html';
    });
  }

  // ── Mobile Bottom Nav ────────────────────────────────────────────────────────
  function wireMobileNav() {
    document.querySelectorAll('nav[class*="fixed"] a, nav[class*="bottom"] a').forEach(a => {
      const text = a.textContent.trim().toLowerCase();
      if (text.includes('home')) a.href = 'index.html';
      else if (text.includes('search')) a.href = 'properties.html';
      else if (text.includes('saved') || text.includes('favourite') || text.includes('favorite')) a.href = 'account.html';
      else if (text.includes('profile') || text.includes('account')) a.href = 'account.html';
    });
  }

  // ── WhatsApp Floating Button ─────────────────────────────────────────────────
  function wireWhatsApp() {
    document.querySelectorAll('a[href="#"]').forEach(a => {
      const svg = a.querySelector('svg');
      if (svg) {
        // Check if it's the WhatsApp button (contains the whatsapp SVG path)
        const path = svg.querySelector('path');
        if (path && path.getAttribute('d') && path.getAttribute('d').startsWith('M17.472')) {
          a.href = 'https://wa.me/254700000000?text=Hello%20TobillionHomes%2C%20I%20would%20like%20to%20inquire%20about%20properties.';
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
      }
    });
  }

  // ── "Back to Listings" Links ─────────────────────────────────────────────────
  function wireBackToListings() {
    document.querySelectorAll('a').forEach(a => {
      const text = a.textContent.trim().toLowerCase();
      if (text.includes('back to listing') || text.includes('back to properties')) {
        a.href = 'properties.html';
      }
    });
  }

  // ── Run after DOM ready ──────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
