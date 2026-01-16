import { supabase, isSupabaseConfigured } from './supabase';

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
  read?: boolean;
}

export const getMessages = async (): Promise<Message[]> => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      return data as Message[];
    }
    console.error('Supabase error fetching messages:', error);
  }
  return [];
};

export const saveMessage = async (msg: Omit<Message, 'id' | 'created_at'>): Promise<boolean> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('messages')
      .insert([{
        ...msg,
        read: false
      }]);
      
    if (error) {
      console.error('Supabase insert message error:', error);
      return false;
    }

    // Attempt to notify admin via Supabase Edge Function (if deployed)
    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-message-email', {
        body: {
          name: msg.name,
          email: msg.email,
          phone: msg.phone,
        subject: msg.subject,
          message: msg.message
        }
      });
      if (fnError) {
        console.warn('Email function invocation failed:', fnError);
      } else {
        console.log('Email notification dispatched:', data);
      }
    } catch (err) {
      console.warn('Error invoking email function:', err);
    }
    return true;
  }
  
  // Fallback for demo/localhost (only works if admin is on same browser)
  console.warn('Supabase not configured. Message will not be sent to admin in production.');
  return true; // Simulate success
};

export const deleteMessage = async (id: string): Promise<Message[]> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete message error:', error);
    }
    return await getMessages();
  }
  return [];
};

export const markMessageRead = async (id: string, read: boolean): Promise<Message[]> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('messages')
      .update({ read })
      .eq('id', id);
    if (error) {
      console.error('Supabase update message error:', error);
    }
    return await getMessages();
  }
  return [];
};
