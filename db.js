// db.js - Supabase integration layer for TobillionHomes

// Global Supabase client instance (lazy init)
let supabaseClient = null;
let supabaseAvailable = false;

function ensureClient() {
  if (supabaseClient) return;
  try {
    var cfgUrl = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || '';
    var cfgKey = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || '';
    if (cfgUrl && cfgKey && typeof window.supabase?.createClient === 'function') {
      supabaseClient = window.supabase.createClient(cfgUrl, cfgKey);
      supabaseAvailable = true;
    }
  } catch (e) {
    console.warn("Supabase client init failed:", e.message);
  }
}

async function checkSupabaseHealth() {
  ensureClient();
  if (!supabaseClient) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const { error } = await supabaseClient.from('properties').select('id', { count: 'exact', head: true }).limit(1).abortSignal(controller.signal);
    clearTimeout(timeout);
    if (error) {
      console.warn("Supabase health check failed:", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn("Supabase unreachable:", e.message);
    return false;
  }
}

// ----------------------------------------------------
// DATABASE ACCESS METHODS
// ----------------------------------------------------

async function fetchProperties() {
  ensureClient();
  if (!supabaseClient) return [];
  const { data, error } = await supabaseClient
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching properties: ", error);
    return [];
  }
  return data;
}

async function fetchPropertyById(id) {
  ensureClient();
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error("Error fetching property by id: ", error);
    return null;
  }
  return data;
}

async function searchProperties({ county, estate, type, minPrice, maxPrice, status }) {
  ensureClient();
  if (!supabaseClient) return [];
  let query = supabaseClient.from('properties').select('*');
  if (county) query = query.ilike('location_county', `%${county}%`);
  if (estate) query = query.ilike('location_estate', `%${estate}%`);
  if (type && type !== 'Property Type') query = query.eq('type', type);
  if (status) query = query.eq('status', status);
  if (minPrice) query = query.gte('price', minPrice);
  if (maxPrice) query = query.lte('price', maxPrice);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) {
    console.error("Search error: ", error);
    return [];
  }
  return data;
}

async function createInquiry({ propertyId, name, email, phone, message }) {
  ensureClient();
  if (!supabaseClient) return { data: null, error: { message: "Database not connected." } };
  const { data, error } = await supabaseClient
    .from('inquiries')
    .insert([{ property_id: propertyId || null, name, email, phone, message }]);
  return { data, error };
}

async function saveListing(propertyId) {
  ensureClient();
  if (!supabaseClient) { showToast("Database not connected", "error"); return false; }
  const user = await getCurrentUser();
  if (!user) {
    showToast("Please log in to save properties", "error");
    return false;
  }
  const { data, error } = await supabaseClient
    .from('saved_listings')
    .insert([{ user_id: user.id, property_id: propertyId }]);
  if (error) {
    console.error("Error saving listing: ", error);
    return false;
  }
  showToast("Property added to favorites!", "success");
  return true;
}

async function unsaveListing(propertyId) {
  ensureClient();
  if (!supabaseClient) return false;
  const user = await getCurrentUser();
  if (!user) return false;
  const { error } = await supabaseClient
    .from('saved_listings')
    .delete()
    .eq('user_id', user.id)
    .eq('property_id', propertyId);
  if (error) {
    console.error("Error unsaving listing: ", error);
    return false;
  }
  showToast("Property removed from favorites.", "success");
  return true;
}

async function fetchSavedListings() {
  ensureClient();
  if (!supabaseClient) return [];
  const user = await getCurrentUser();
  if (!user) return [];
  const { data, error } = await supabaseClient
    .from('saved_listings')
    .select('*, properties(*)')
    .eq('user_id', user.id);
  if (error) {
    console.error("Error fetching saved listings: ", error);
    return [];
  }
  return data.map(item => item.properties).filter(Boolean);
}

async function isListingSaved(propertyId) {
  ensureClient();
  if (!supabaseClient) return false;
  const user = await getCurrentUser();
  if (!user) return false;
  const { data, error } = await supabaseClient
    .from('saved_listings')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId);
  if (error || !data || data.length === 0) return false;
  return true;
}

// ----------------------------------------------------
// AUTHENTICATION & PROFILES
// ----------------------------------------------------
async function getCurrentUser() {
  ensureClient();
  if (!supabaseClient) return null;
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session ? session.user : null;
}

async function getUserProfile() {
  ensureClient();
  if (!supabaseClient) return null;
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) {
      console.error("Error fetching profile: ", error);
      return null;
    }
    return data;
  } catch (e) {
    console.error("getUserProfile error:", e);
    return null;
  }
}

async function loginUser(email, password) {
  ensureClient();
  if (!supabaseClient) {
    return { data: null, error: { message: "Supabase not connected. Please configure your Supabase URL and Anon Key in config.js." } };
  }
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function registerUser(email, password, fullName, role = 'user') {
  ensureClient();
  if (!supabaseClient) return { data: null, error: { message: "Supabase connection required for user registration." } };
  const { data, error } = await supabaseClient.auth.signUp({
    email, password,
    options: { data: { full_name: fullName, role: role } }
  });
  return { data, error };
}

async function logoutUser() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  showToast("Logged out successfully", "success");
}

// ----------------------------------------------------
// ADMIN ONLY METHODS
// ----------------------------------------------------
async function checkAdminOrRedirect() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      window.location.href = 'admin-login.html';
      return false;
    }
    const profile = await getUserProfile();
    if (!profile || profile.role !== 'admin') {
      showToast("Access Denied: Admin authorization required.", "error");
      setTimeout(() => { window.location.href = 'index.html'; }, 2000);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Auth check failed:", e);
    return true;
  }
}

async function fetchLeads() {
  ensureClient();
  if (!supabaseClient) return [];
  const { data, error } = await supabaseClient
    .from('inquiries')
    .select('*, properties(title)')
    .order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching leads: ", error);
    return [];
  }
  return data;
}

async function updateLeadStatus(id, status) {
  ensureClient();
  if (!supabaseClient) return true;
  const { error } = await supabaseClient
    .from('inquiries')
    .update({ status })
    .eq('id', id);
  if (error) {
    console.error("Error updating lead status: ", error);
    return false;
  }
  return true;
}

async function deleteLead(id) {
  ensureClient();
  if (!supabaseClient) return true;
  const { error } = await supabaseClient.from('inquiries').delete().eq('id', id);
  if (error) { console.error("Error deleting lead: ", error); return false; }
  return true;
}

async function addProperty(propertyData) {
  ensureClient();
  if (!supabaseClient) return { data: null, error: { message: "Supabase connection required." } };
  const { data, error } = await supabaseClient.from('properties').insert([propertyData]).select();
  return { data, error };
}

async function deleteProperty(id) {
  ensureClient();
  if (!supabaseClient) return true;
  const { error } = await supabaseClient.from('properties').delete().eq('id', id);
  if (error) { console.error("Error deleting property: ", error); return false; }
  return true;
}

const MEDIA_BUCKET = 'property-media';

async function getMediaBucket() {
  ensureClient();
  if (!supabaseClient) return null;
  supabaseClient.storage.createBucket(MEDIA_BUCKET, { public: true }).catch(() => { });
  return supabaseClient.storage.from(MEDIA_BUCKET);
}

async function fetchMediaItems() {
  ensureClient();
  if (!supabaseClient) return [];
  try {
    const bucket = supabaseClient.storage.from(MEDIA_BUCKET);
    const { data, error } = await bucket.list('', { sortBy: { column: 'created_at', order: 'desc' } });
    if (error) { console.error("Error listing media:", error); return []; }
    const items = (data || []).filter(f => f.metadata?.size > 0);
    const { data: publicUrl } = supabaseClient.storage.from(MEDIA_BUCKET).getPublicUrl('');
    const baseUrl = publicUrl?.publicUrl?.replace(/\/$/, '') || '';
    return items.map(f => ({
      id: f.name,
      name: f.name,
      url: `${baseUrl}/${f.name}`,
      size: f.metadata?.size || 0,
      type: f.metadata?.mimetype || 'application/octet-stream',
      created_at: f.created_at,
      updated_at: f.updated_at
    }));
  } catch (e) { console.error("Error fetching media:", e); return []; }
}

async function uploadMediaItem(file, onProgress) {
  ensureClient();
  if (!supabaseClient) return { error: { message: "Supabase not connected" } };
  try {
    const bucket = supabaseClient.storage.from(MEDIA_BUCKET);
    const path = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { data, error } = await bucket.upload(path, file, {
      cacheControl: '3600', upsert: false, contentType: file.type
    });
    if (error) {
      if (error.message && (error.message.includes('Bucket not found') || error.message.includes('bucket'))) {
        await supabaseClient.storage.createBucket(MEDIA_BUCKET, { public: true }).catch(() => { });
        const { data: d2, error: e2 } = await bucket.upload(path, file, {
          cacheControl: '3600', upsert: false, contentType: file.type
        });
        if (e2) return { error: new Error("Storage bucket 'property-media' not found or no permission.") };
        const { data: { publicUrl } } = supabaseClient.storage.from(MEDIA_BUCKET).getPublicUrl(path);
        return { data: { path, url: publicUrl, name: file.name, size: file.size, type: file.type } };
      }
      if (error.message && error.message.includes('row-level security')) {
        return { error: new Error("Upload blocked by Row-Level Security. Run the storage RLS policies.") };
      }
      return { error };
    }
    const { data: { publicUrl } } = supabaseClient.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return { data: { path, url: publicUrl, name: file.name, size: file.size, type: file.type } };
  } catch (e) { return { error: e }; }
}

async function deleteMediaItem(path) {
  ensureClient();
  if (!supabaseClient) return true;
  const { error } = await supabaseClient.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) { console.error("Error deleting media:", error); return false; }
  return true;
}

async function deleteMediaItems(paths) {
  ensureClient();
  if (!supabaseClient || !paths.length) return true;
  const { error } = await supabaseClient.storage.from(MEDIA_BUCKET).remove(paths);
  if (error) { console.error("Error deleting media:", error); return false; }
  return true;
}

async function getMediaPublicUrl(path) {
  ensureClient();
  if (!supabaseClient) return path;
  const { data } = supabaseClient.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data?.publicUrl || path;
}

async function fetchSiteContent(key) {
  ensureClient();
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient
    .from('site_content')
    .select('value')
    .eq('key', key)
    .single();
  if (error) return null;
  return data.value;
}

async function saveSiteContent(key, value) {
  ensureClient();
  if (!supabaseClient) {
    console.error("Cannot save site content: Supabase not connected");
    return false;
  }
  const { error } = await supabaseClient
    .from('site_content')
    .upsert({ key, value, updated_at: new Date() });
  if (error) {
    console.error("Error saving site content:", error);
    return false;
  }
  return true;
}

// ----------------------------------------------------
// UI UTILITIES: Toast Notifications
// ----------------------------------------------------
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:999999; display:flex; flex-direction:column; gap:8px;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const bgColor = type === 'success' ? '#006c4e' : type === 'error' ? '#ba1a1a' : '#000613';
  toast.style.cssText = `
    background: ${bgColor};
    color: #ffffff;
    padding: 16px 24px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,6,19,0.15);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 50);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => { toast.remove(); }, 300);
  }, 3500);
}
