
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ncuwexzciddfvftzhdxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdXdleHpjaWRkZnZmdHpoZHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTIxMjkzNzAsImV4cCI6MjAwNzcwNTM3MH0.L9GoXIl9CU8Qa9Qn-JCtEmKIrRZer-nZB1gIMm75MO0';

if (!supabaseKey) {
  console.error('Supabase anon key is not defined');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
