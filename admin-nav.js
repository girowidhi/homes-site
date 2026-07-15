// admin-nav.js - Access control, navigation routing, and shared UI components for all TobillionHomes Admin pages

// Inject vegence-ui.css on admin pages (same look & feel as public pages)
(function injectAdminStyles() {
  if (!document.querySelector('link[href="vegence-ui.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'vegence-ui.css';
    document.head.appendChild(link);
  }
})();

// ── MODAL SYSTEM ────────────────────────────────────────────────
(function injectModalStyles() {
  const style = document.createElement('style');
  style.textContent = `
.admin-modal-overlay {
  position: fixed; inset: 0; z-index: 99999;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
}
.admin-modal-overlay.open { opacity: 1; pointer-events: auto; }
.admin-modal-dialog {
  background: var(--md-sys-color-surface, #fff);
  border-radius: 1.25rem; width: min(90vw, 480px);
  max-height: 80vh; display: flex; flex-direction: column;
  box-shadow: 0 24px 48px -12px rgba(0,0,0,0.4);
  transform: scale(0.96) translateY(8px);
  transition: transform 0.25s ease;
}
.admin-modal-overlay.open .admin-modal-dialog { transform: scale(1) translateY(0); }
.admin-modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem 0; font-size: 1.25rem; font-weight: 600;
  color: var(--md-sys-color-on-surface, #1b1b1f);
}
.admin-modal-body { padding: 1rem 1.5rem 1.5rem; overflow-y: auto; color: var(--md-sys-color-on-surface-variant, #44474e); line-height: 1.6; }
.admin-modal-footer {
  display: flex; gap: 0.75rem; justify-content: flex-end;
  padding: 0 1.5rem 1.25rem;
}
.admin-modal-footer button {
  padding: 0.625rem 1.5rem; border-radius: 999px; border: none;
  font-weight: 500; font-size: 0.875rem; cursor: pointer; transition: background 0.2s;
}
.admin-modal-btn-cancel { background: var(--md-sys-color-surface-container-high, #eceef4); color: var(--md-sys-color-on-surface, #1b1b1f); }
.admin-modal-btn-cancel:hover { background: var(--md-sys-color-surface-container-highest, #dde1ea); }
.admin-modal-btn-confirm { background: var(--md-sys-color-primary, #006c4e); color: var(--md-sys-color-on-primary, #fff); }
.admin-modal-btn-confirm:hover { filter: brightness(1.1); }
.admin-modal-btn-danger { background: var(--md-sys-color-error, #ba1a1a); color: var(--md-sys-color-on-error, #fff); }
.admin-modal-btn-danger:hover { filter: brightness(1.1); }
.admin-modal-close {
  background: none; border: none; font-size: 1.5rem; cursor: pointer;
  color: var(--md-sys-color-on-surface-variant, #44474e); padding: 0; line-height: 1;
}
`;
  document.head.appendChild(style);
})();

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const authorized = await checkAdminOrRedirect();
    if (authorized) {
      setTimeout(initAdminNavigation, 100);
    }
  } catch (e) {
    console.error("Admin nav init error:", e);
    showToast("Database connection issue. Some features may be limited.", "error");
  }
});

// ── Sidebar toggle (global for all admin pages) ──────────────────────
function initAdminSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');

  if (!sidebar) return;

  function toggleSidebar() {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('open');
      if (sidebarOverlay) sidebarOverlay.classList.toggle('open');
      document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    } else {
      sidebar.classList.toggle('collapsed');
      document.querySelector('.admin-main')?.classList.toggle('sidebar-collapsed');
      localStorage.setItem('admin_sidebar_collapsed', sidebar.classList.contains('collapsed'));
    }
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  const saved = localStorage.getItem('admin_sidebar_collapsed');
  if (saved === 'true' && window.innerWidth > 768) {
    sidebar.classList.add('collapsed');
    document.querySelector('.admin-main')?.classList.add('sidebar-collapsed');
  }
}

async function initAdminNavigation() {
  initAdminSidebar();

  // 1. Setup Admin profile details in header (if authenticated in Supabase)
  const profile = await getUserProfile();
  if (profile) {
    const nameEls = document.querySelectorAll('span');
    nameEls.forEach(el => {
      if (el.textContent.trim() === 'Admin User') {
        el.textContent = profile.full_name || 'Admin Administrator';
      }
    });
  }

  // 2. Wire Sidebar Navigation Links
  document.querySelectorAll('aside a, aside button').forEach(el => {
    const text = el.textContent.trim().toLowerCase();
    
    if (text.includes('dashboard')) {
      el.href = 'admin-dashboard.html';
      el.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'admin-dashboard.html'; });
    } else if (text.includes('properties')) {
      el.href = 'admin-manage-properties.html';
      el.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'admin-manage-properties.html'; });
    } else if (text.includes('leads') || text.includes('inquiries')) {
      el.href = 'admin-leads.html';
      el.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'admin-leads.html'; });
    } else if (text.includes('media library')) {
      el.href = 'admin-media.html';
      el.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'admin-media.html'; });
    } else if (text.includes('site content')) {
      el.href = 'admin-content.html';
      el.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'admin-content.html'; });
    } else if (text.includes('profile')) {
      el.href = 'admin-profile.html';
      el.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'admin-profile.html'; });
    } else if (text.includes('seo settings') || text.includes('settings')) {
      el.href = '#';
      el.addEventListener('click', (e) => {
        e.preventDefault();
        showToast("SEO & Settings are handled automatically via the Site Content editor.", "info");
        setTimeout(() => {
          window.location.href = 'admin-content.html';
        }, 1500);
      });
    } else if (text.includes('support') || text.includes('help center')) {
      el.href = 'contact.html';
      el.addEventListener('click', (e) => { e.preventDefault(); window.open('contact.html', '_blank'); });
    } else if (text.includes('logout')) {
      el.href = '#';
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        await logoutUser();
        window.location.href = 'admin-login.html';
      });
    }
  });

  // 3. Header Action Buttons ("Add Listing")
  document.querySelectorAll('header button, main button').forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    if (text.includes('add listing') || text.includes('add new listing')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'admin-add-property.html';
      });
    }
  });

  // 4. Metric Bento Card Click Handlers on Dashboard Overview
  if (window.location.pathname.includes('admin-dashboard.html')) {
    document.querySelectorAll('.luxury-shadow').forEach(card => {
      const text = card.textContent.trim().toLowerCase();
      if (text.includes('total properties')) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => { window.location.href = 'admin-manage-properties.html'; });
      } else if (text.includes('new leads')) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => { window.location.href = 'admin-leads.html'; });
      } else if (text.includes('active bookings') || text.includes('monthly revenue')) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => { window.location.href = 'admin-analytics.html'; });
      }
    });

    // Quick Actions buttons
    document.querySelectorAll('button').forEach(btn => {
      const text = btn.textContent.trim().toLowerCase();
      if (text.includes('view all admin tools')) {
        btn.addEventListener('click', () => { window.location.href = 'admin-analytics.html'; });
      }
    });

    const quickActionBtns = document.querySelectorAll('button[class*="border"]');
    quickActionBtns.forEach(btn => {
      const text = btn.textContent.trim().toLowerCase();
      if (text.includes('new property')) {
        btn.addEventListener('click', () => { window.location.href = 'admin-add-property.html'; });
      }
    });
  }

  // 5. Wire Header Elements (search, settings, profile, notifications)
  wireAdminHeader();

  injectModalSystem();
}

function wireAdminHeader() {
  // Search: Enter key navigates to manage-properties with query
  var searchInput = document.querySelector('.admin-header-search input');
  if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && this.value.trim()) {
        window.location.href = 'admin-manage-properties.html?search=' + encodeURIComponent(this.value.trim());
      }
    });
  }

  // Settings icon
  var settingsBtn = document.getElementById('settingsBtn') || document.getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', function() {
      window.location.href = 'admin-content.html';
    });
  }

  // Notification icon
  var notifBtn = document.getElementById('notifBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', function() {
      showToast('No new notifications', 'info');
    });
  }

  // Profile section (click on avatar or name)
  var profileSection = document.querySelector('header .ml-sm.flex.items-center.gap-xs');
  if (profileSection) {
    profileSection.style.cursor = 'pointer';
    profileSection.addEventListener('click', function() {
      window.location.href = 'admin-profile.html';
    });
  }
}

// ── MODAL API ───────────────────────────────────────────────────
let _modalResolve = null;

function injectModalSystem() {
  if (document.getElementById('adminModalOverlay')) return;
  const div = document.createElement('div');
  div.id = 'adminModalOverlay';
  div.className = 'admin-modal-overlay';
  div.innerHTML = `<div class="admin-modal-dialog">
    <div class="admin-modal-header"><span id="adminModalTitle"></span><button class="admin-modal-close" id="adminModalClose">&times;</button></div>
    <div class="admin-modal-body" id="adminModalBody"></div>
    <div class="admin-modal-footer" id="adminModalFooter"></div>
  </div>`;
  document.body.appendChild(div);
  document.getElementById('adminModalClose').addEventListener('click', closeModal);
  div.addEventListener('click', (e) => { if (e.target === div) closeModal(); });
}

function closeModal() {
  const ov = document.getElementById('adminModalOverlay');
  if (!ov) return;
  ov.classList.remove('open');
  if (_modalResolve) { _modalResolve(false); _modalResolve = null; }
}

function showModal({ title, body, confirmText, confirmClass, cancelText, onConfirm }) {
  injectModalSystem();
  const ov = document.getElementById('adminModalOverlay');
  document.getElementById('adminModalTitle').textContent = title || '';
  document.getElementById('adminModalBody').innerHTML = body || '';
  const footer = document.getElementById('adminModalFooter');
  footer.innerHTML = '';
  let confirmed = false;
  if (cancelText !== null) {
    const cancel = document.createElement('button');
    cancel.className = 'admin-modal-btn-cancel';
    cancel.textContent = cancelText || 'Cancel';
    cancel.addEventListener('click', closeModal);
    footer.appendChild(cancel);
  }
  if (confirmText) {
    const ok = document.createElement('button');
    ok.className = confirmClass || 'admin-modal-btn-confirm';
    ok.textContent = confirmText;
    ok.addEventListener('click', () => { confirmed = true; if (onConfirm) onConfirm(); closeModal(); });
    footer.appendChild(ok);
  }
  ov.classList.add('open');
}

function showConfirm(title, message) {
  return new Promise((resolve) => {
    _modalResolve = resolve;
    showModal({
      title, body: `<p>${message}</p>`,
      confirmText: 'Confirm', cancelText: 'Cancel',
      onConfirm: () => { if (_modalResolve) { _modalResolve(true); _modalResolve = null; } }
    });
  });
}

function showAlert(title, message) {
  showModal({
    title, body: `<p>${message}</p>`,
    confirmText: 'OK', cancelText: null
  });
}
