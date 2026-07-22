import { getSql } from './neon.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { action, params } = req.body || {};
    const sql = getSql();
    let result;

    switch (action) {

      // ── Properties ──────────────────────────────────────────
      case 'fetchProperties': {
        const limit = params?.limit || 500;
        const offset = ((params?.page || 1) - 1) * limit;
        result = await sql`SELECT * FROM properties ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
        break;
      }

      case 'fetchPropertyById': {
        const rows = await sql`SELECT * FROM properties WHERE id = ${params.id}`;
        return res.json({ data: rows[0] || null, error: null });
      }

      case 'searchProperties': {
        const { county, estate, type, minPrice, maxPrice, status } = params || {};
        result = await sql`
          SELECT * FROM properties WHERE 1=1
          ${county ? sql`AND location_county ILIKE ${'%' + county + '%'}` : sql``}
          ${estate ? sql`AND location_estate ILIKE ${'%' + estate + '%'}` : sql``}
          ${type && type !== 'Property Type' ? sql`AND type = ${type}` : sql``}
          ${status ? sql`AND status = ${status}` : sql``}
          ${minPrice ? sql`AND price >= ${Number(minPrice)}` : sql``}
          ${maxPrice ? sql`AND price <= ${Number(maxPrice)}` : sql``}
          ORDER BY created_at DESC
        `;
        break;
      }

      case 'addProperty': {
        const { title, type, price, bedrooms, bathrooms, area_sqft, description,
                location_county, location_estate, latitude, longitude, features,
                status: propStatus, image_url, images, featured, meta_title, meta_description } = params;
        const rows = await sql`
          INSERT INTO properties (title, type, price, bedrooms, bathrooms, area_sqft, description,
            location_county, location_estate, latitude, longitude, features,
            status, image_url, images, featured, meta_title, meta_description)
          VALUES (${title}, ${type}, ${price}, ${bedrooms}, ${bathrooms}, ${area_sqft}, ${description},
            ${location_county}, ${location_estate}, ${latitude}, ${longitude},
            ${features || null}, ${propStatus || 'For Sale'}, ${image_url || ''},
            ${images || null}, ${featured || false}, ${meta_title || null}, ${meta_description || null})
          RETURNING *
        `;
        result = rows;
        break;
      }

      case 'deleteProperty': {
        const tok = await verifyToken(sql, params?.token, 'admin');
        if (!tok) return res.status(403).json({ error: { message: 'Unauthorized' } });
        await sql`DELETE FROM properties WHERE id = ${params.id}`;
        return res.json({ data: { success: true }, error: null });
      }

      // ── Auth ────────────────────────────────────────────────
      case 'loginUser': {
        const { email, password } = params;
        const rows = await sql`
          SELECT * FROM users
          WHERE email = ${email}
          AND encrypted_password = crypt(${password}, encrypted_password)
        `;
        if (rows.length === 0) {
          return res.status(401).json({ error: { message: 'Invalid email or password' } });
        }
        const user = rows[0];
        const sessionId = crypto.randomUUID();
        await sql`INSERT INTO user_sessions (id, user_id) VALUES (${sessionId}, ${user.id})`;
        const profile = (await sql`SELECT * FROM profiles WHERE id = ${user.id}`)[0] || null;
        return res.json({
          data: {
            session: { access_token: sessionId, user: { id: user.id, email: user.email } },
            user: { id: user.id, email: user.email, role: profile?.role || user.role }
          },
          error: null
        });
      }

      case 'getSession': {
        const token = params?.token;
        if (!token) return res.json({ data: { session: null }, error: null });
        const sessions = await sql`
          SELECT s.*, u.email, COALESCE(p.role, u.role) as role
          FROM user_sessions s
          JOIN users u ON u.id = s.user_id
          LEFT JOIN profiles p ON p.id = s.user_id
          WHERE s.id = ${token}
        `;
        if (sessions.length === 0) return res.json({ data: { session: null }, error: null });
        const s = sessions[0];
        return res.json({
          data: {
            session: { access_token: s.id, user: { id: s.user_id, email: s.email } },
            user: { id: s.user_id, email: s.email, role: s.role }
          },
          error: null
        });
      }

      case 'getUserProfile': {
        const tok = await verifyToken(sql, params?.token);
        if (!tok) return res.json({ data: null, error: null });
        const profile = (await sql`SELECT * FROM profiles WHERE id = ${tok.userId}`)[0] || null;
        return res.json({ data: profile, error: null });
      }

      case 'authSignOut': {
        if (params?.token) await sql`DELETE FROM user_sessions WHERE id = ${params.token}`;
        return res.json({ data: { success: true }, error: null });
      }

      // ── Leads ───────────────────────────────────────────────
      case 'fetchLeads': {
        const tok = await verifyToken(sql, params?.token, 'admin');
        if (!tok) return res.status(403).json({ error: { message: 'Unauthorized' } });
        const rows = await sql`SELECT i.*, p.title as property_title FROM inquiries i LEFT JOIN properties p ON p.id = i.property_id ORDER BY i.created_at DESC`;
        return res.json({ data: rows, error: null });
      }

      case 'updateLeadStatus': {
        const tok = await verifyToken(sql, params?.token, 'admin');
        if (!tok) return res.status(403).json({ error: { message: 'Unauthorized' } });
        await sql`UPDATE inquiries SET status = ${params.status} WHERE id = ${params.id}`;
        return res.json({ data: { success: true }, error: null });
      }

      case 'deleteLead': {
        const tok = await verifyToken(sql, params?.token, 'admin');
        if (!tok) return res.status(403).json({ error: { message: 'Unauthorized' } });
        await sql`DELETE FROM inquiries WHERE id = ${params.id}`;
        return res.json({ data: { success: true }, error: null });
      }

      // ── Site Content ────────────────────────────────────────
      case 'fetchSiteContent': {
        const key = params?.key;
        if (key) {
          const rows = await sql`SELECT value FROM site_content WHERE key = ${key}`;
          return res.json({ data: rows.length > 0 ? rows[0].value : null, error: null });
        }
        const rows = await sql`SELECT * FROM site_content`;
        const obj = {};
        rows.forEach(r => { obj[r.key] = r.value; });
        return res.json({ data: obj, error: null });
      }

      case 'saveSiteContent': {
        const tok = await verifyToken(sql, params?.token, 'admin');
        if (!tok) return res.status(403).json({ error: { message: 'Unauthorized' } });
        const existing = await sql`SELECT key FROM site_content WHERE key = ${params.key}`;
        if (existing.length > 0) {
          await sql`UPDATE site_content SET value = ${JSON.stringify(params.value)}, updated_at = NOW() WHERE key = ${params.key}`;
        } else {
          await sql`INSERT INTO site_content (key, value) VALUES (${params.key}, ${JSON.stringify(params.value)})`;
        }
        return res.json({ data: { success: true }, error: null });
      }

      // ── Media ────────────────────────────────────────────────
      case 'fetchMediaItems': {
        const rows = await sql`SELECT * FROM media_items ORDER BY created_at DESC`;
        return res.json({ data: rows, error: null });
      }

      case 'addMediaItem': {
        const { name, url, size, type: mimeType } = params;
        const id = crypto.randomUUID();
        await sql`INSERT INTO media_items (id, name, url, size, type, created_at) VALUES (${id}, ${name}, ${url}, ${size || 0}, ${mimeType || ''}, NOW())`;
        return res.json({ data: { id, name, url, size, type: mimeType }, error: null });
      }

      case 'deleteMediaItem': {
        const tok = await verifyToken(sql, params?.token, 'admin');
        if (!tok) return res.status(403).json({ error: { message: 'Unauthorized' } });
        await sql`DELETE FROM media_items WHERE id = ${params.id}`;
        return res.json({ data: { success: true }, error: null });
      }

      default:
        return res.status(400).json({ error: { message: 'Unknown action: ' + action } });
    }

    return res.json({ data: result, error: null });
  } catch (e) {
    console.error('Query error:', e);
    return res.status(500).json({ error: { message: e.message || 'Database error' } });
  }
}

async function verifyToken(sql, token, requiredRole) {
  if (!token) return null;
  const sessions = await sql`SELECT user_id FROM user_sessions WHERE id = ${token}`;
  if (sessions.length === 0) return null;
  const userId = sessions[0].user_id;
  if (requiredRole) {
    const profiles = await sql`SELECT role FROM users WHERE id = ${userId}`;
    if (profiles.length === 0 || profiles[0].role !== requiredRole) return null;
  }
  return { userId };
}
