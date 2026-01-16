import { supabase, isSupabaseConfigured } from './supabase';

export interface Notice {
  id: string;
  type: 'important' | 'alert' | 'promo' | 'update';
  title: string;
  content: string;
  date: string;
}

const STORAGE_KEY = 'topone_notices';

export const defaultNotices: Notice[] = [
  {
    id: '1',
    type: 'important',
    title: 'Holiday Schedule Update',
    content: 'Please note that our depot will be closed from December 24th to January 2nd for the holiday season. Normal operations resume January 3rd.',
    date: 'Dec 15, 2024'
  },
  {
    id: '2',
    type: 'update',
    title: 'New Stock Alert: Plaster Sand',
    content: 'We have just received a fresh delivery of high-quality plaster sand. Bulk orders are now available for immediate delivery.',
    date: 'Dec 18, 2024'
  },
  {
    id: '3',
    type: 'alert',
    title: 'Rain Delay Warning',
    content: 'Due to heavy rainfall affecting the quarry, some deliveries may experience slight delays over the next 48 hours. We appreciate your patience.',
    date: 'Dec 20, 2024'
  },
  {
    id: '4',
    type: 'promo',
    title: 'End of Year Special',
    content: 'Get 10% off all gravel mix orders over 10 tons. Valid until December 23rd. Contact sales for more details.',
    date: 'Dec 21, 2024'
  }
];

export const getNotices = async (): Promise<Notice[]> => {
  // 1. Try Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      return data as Notice[];
    }
    console.error('Supabase error:', error);
  }

  // 2. Fallback to Local Storage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNotices));
    return defaultNotices;
  }
  return JSON.parse(stored);
};

export const saveNotice = async (notice: Notice): Promise<Notice[]> => {
  // 1. Try Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('notices')
      .insert([notice]);
      
    if (error) {
      console.error('Supabase insert error:', error);
      alert('Failed to save to database. Check console.');
    } else {
      // Re-fetch to get the latest state
      return await getNotices();
    }
  }

  // 2. Fallback to Local Storage
  const stored = localStorage.getItem(STORAGE_KEY);
  const notices = stored ? JSON.parse(stored) : defaultNotices;
  const newNotices = [notice, ...notices];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotices));
  return newNotices;
};

export const deleteNotice = async (id: string): Promise<Notice[]> => {
  // 1. Try Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      alert('Error deleting notice: ' + error.message);
      return await getNotices(); // Return current state instead of falling through
    } else {
      return await getNotices();
    }
  }

  // 2. Fallback to Local Storage
  const stored = localStorage.getItem(STORAGE_KEY);
  const notices = stored ? JSON.parse(stored) : defaultNotices;
  const newNotices = notices.filter((n: Notice) => n.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotices));
  return newNotices;
};
