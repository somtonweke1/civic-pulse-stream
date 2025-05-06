
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ncuwexzciddfvftzhdxq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdXdleHpjaWRkZnZmdHpoZHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTIxMjkzNzAsImV4cCI6MjAwNzcwNTM3MH0.L9GoXIl9CU8Qa9Qn-JCtEmKIrRZer-nZB1gIMm75MO0';

if (!supabaseKey) {
  console.error('Supabase anon key is not defined');
}

console.log('Initializing Supabase with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);
