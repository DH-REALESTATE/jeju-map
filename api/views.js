import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REALJEJU_PUBLIC_SUPABASE_URL,
  process.env.REALJEJU_SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
  try {
    const ids = String(req.query.ids || '')
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      return res.status(200).json({ items: {} });
    }

    const { data, error } = await supabase
      .from('listing_views')
      .select('listing_no, views')
      .in('listing_no', ids);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const items = {};
    for (const row of data || []) {
      items[row.listing_no] = row.views;
    }

    return res.status(200).json({ items });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
