import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with local development URLs
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

if (!supabaseKey) {
  console.error('Supabase anon key is not defined');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
