// db.js — Neon database layer for TobillionHomes

let sessionToken = localStorage.getItem('neon_session_token') || null;
let lastDbError = null;
let propertiesCache = null;
let propertiesCacheTime = 0;
const CACHE_TTL = 60000;

// Set session token after login
function setSessionToken(token) {
  sessionToken = token;
  if (token) localStorage.setItem('neon_session_token', token);
  else localStorage.removeItem('neon_session_token');
}

async function api(action, params = {}) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, params }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: { message: 'HTTP ' + res.status } }));
      return { data: null, error: err.error || { message: 'Request failed' } };
    }
    const json = await res.json();
    if (json.error) return { data: null, error: json.error };
    return { data: json.data, error: null };
  } catch (e) {
    if (e.name === 'AbortError') return { data: null, error: { message: 'Request timed out' } };
    return { data: null, error: { message: e.message || 'Network error' } };
  }
}

function hydrateProperty(p) {
  if (!p) return p;
  if (typeof p.features === 'string') try { p.features = JSON.parse(p.features); } catch(e) {}
  if (typeof p.images === 'string') try { p.images = JSON.parse(p.images); } catch(e) {}
  return p;
}

// ── Health ────────────────────────────────────────────────
async function checkSupabaseHealth() {
  const { data, error } = await api('fetchProperties', { limit: 1 });
  return !error;
}

// ── Properties ────────────────────────────────────────────
async function fetchProperties({ limit = 500, page = 1, force = false, retryCount = 0 } = {}) {
  const now = Date.now();
  if (propertiesCache && !force && (now - propertiesCacheTime) < CACHE_TTL) return propertiesCache;
  if (propertiesCache && !force && page === 1) return propertiesCache;

  const { data, error } = await api('fetchProperties', { limit, page });
  if (error) {
    lastDbError = error.message;
    if (retryCount < 1) {
      await new Promise(r => setTimeout(r, 2000));
      return fetchProperties({ limit, page, force, retryCount: retryCount + 1 });
    }
    return [];
  }
  lastDbError = null;
  const hydrated = (data || []).map(hydrateProperty);
  if (page === 1) { propertiesCache = hydrated; propertiesCacheTime = now; }
  return hydrated;
}

async function fetchPropertyById(id) {
  const { data, error } = await api('fetchPropertyById', { id });
  if (error || !data) return null;
  return hydrateProperty(data);
}

async function searchProperties({ county, estate, type, minPrice, maxPrice, status } = {}) {
  const { data, error } = await api('searchProperties', { county, estate, type, minPrice, maxPrice, status });
  if (error) return [];
  return (data || []).map(hydrateProperty);
}

async function getPropertyById(id) { return fetchPropertyById(id); }
async function fetchAllProperties() { return fetchProperties(); }
async function fetchPropertiesWithFilters(filters) { return searchProperties(filters); }

// ── Admin: Properties CRUD ────────────────────────────────
async function addProperty(propertyData) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== 'admin') return { data: null, error: { message: 'Admin authorization required.' } };
  const { data, error } = await api('addProperty', { ...propertyData });
  return { data: data && data[0] ? data[0] : null, error };
}

async function deleteProperty(id) {
  if (!sessionToken) return false;
  const { error } = await api('deleteProperty', { id, token: sessionToken });
  if (error) { console.error('Error deleting property:', error); return false; }
  return true;
}

// ── Auth (replaces Supabase Auth) ─────────────────────────
async function loginUser(email, password) {
  const { data, error } = await api('loginUser', { email, password });
  if (data?.session?.access_token) {
    setSessionToken(data.session.access_token);
  }
  return { data, error };
}

async function getSession() {
  if (!sessionToken) return { data: { session: null } };
  const { data, error } = await api('getSession', { token: sessionToken });
  return { data, error };
}

async function getCurrentUser() {
  const { data } = await getSession();
  return data?.session?.user || null;
}

async function getUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await api('getUserProfile', { token: sessionToken });
  if (error || !data) return null;
  return data;
}

async function requireAdmin() {
  const profile = await getUserProfile();
  return profile && profile.role === 'admin';
}

async function checkAdminOrRedirect() {
  try {
    const profile = await getUserProfile();
    if (!profile || profile.role !== 'admin') {
      setSessionToken(null);
      window.location.href = 'admin-login.html';
      return false;
    }
    return true;
  } catch (e) {
    window.location.href = 'admin-login.html';
    return false;
  }
}

async function authSignOut() {
  if (sessionToken) await api('authSignOut', { token: sessionToken });
  setSessionToken(null);
}

async function authSignIn(email, password) { return loginUser(email, password); }

async function logoutUser() {
  await authSignOut();
}

// ── Leads ─────────────────────────────────────────────────
async function fetchLeads() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return [];
  const { data, error } = await api('fetchLeads', { token: sessionToken });
  if (error) return [];
  return data || [];
}

async function updateLeadStatus(id, status) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return false;
  const { error } = await api('updateLeadStatus', { id, status, token: sessionToken });
  return !error;
}

async function deleteLead(id) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return false;
  const { error } = await api('deleteLead', { id, token: sessionToken });
  return !error;
}

// ── Site Content ──────────────────────────────────────────
async function fetchSiteContent(key) {
  const { data, error } = await api('fetchSiteContent', { key });
  if (error) return null;
  return data;
}

async function saveSiteContent(key, value) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return false;
  const { error } = await api('saveSiteContent', { key, value, token: sessionToken });
  return !error;
}

// ── Media ─────────────────────────────────────────────────
async function fetchMediaItems() {
  const { data, error } = await api('fetchMediaItems');
  if (error) return [];
  return data || [];
}

async function addMediaItem(name, url, size, type) {
  const { error } = await api('addMediaItem', { name, url, size, type });
  return !error;
}

async function deleteMediaItem(id) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) return false;
  const { error } = await api('deleteMediaItem', { id, token: sessionToken });
  return !error;
}

// Stubs for functions that were Supabase-specific
async function uploadMediaItem(file, onProgress) {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      const url = dataUrl;
      const name = file.name;
      const size = file.size;
      const type = file.type;
      await addMediaItem(name, url, size, type);
      resolve({ data: { url, name, size, type }, error: null });
    };
    reader.onerror = () => resolve({ error: { message: 'Failed to read file' } });
    reader.readAsDataURL(file);
  });
}

async function deleteMediaItems(paths) {
  for (const p of paths) await deleteMediaItem(p);
  return true;
}

async function getMediaPublicUrl(path) { return path; }

// Backward compatibility aliases
async function authSignUp(email, password) {
  return { data: null, error: { message: 'Sign up not available. Contact admin.' } };
}

sessionToken = localStorage.getItem('neon_session_token') || null;
