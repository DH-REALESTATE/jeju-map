import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    if (!process.env.REALJEJU_PUBLIC_SUPABASE_URL) {
      return res.status(500).json({ error: 'Missing REALJEJU_PUBLIC_SUPABASE_URL' });
    }

    if (!process.env.REALJEJU_SUPABASE_SECRET_KEY) {
      return res.status(500).json({ error: 'Missing REALJEJU_SUPABASE_SECRET_KEY' });
    }

    const supabase = createClient(
      process.env.REALJEJU_PUBLIC_SUPABASE_URL,
      process.env.REALJEJU_SUPABASE_SECRET_KEY
    );

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { listingNo } = req.body || {};
    if (!listingNo) {
      return res.status(400).json({ error: 'listingNo is required' });
    }

    const { data, error } = await supabase.rpc('increment_listing_view', {
      p_listing_no: String(listingNo),
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      ok: true,
      listingNo,
      views: data?.[0]?.out_views ?? data?.[0]?.views ?? 0,
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
