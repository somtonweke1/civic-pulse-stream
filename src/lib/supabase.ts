import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with local development URLs
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jdXdleHpjaWRkZnZmdHpoZHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTMwNzEsImV4cCI6MjA2MTk2OTA3MX0.a0LS4cZsOtvjCEI4gU5xMSFE_8q29SUtHxWc6cGleuU';

if (!supabaseKey) {
  throw new Error('Supabase anon key is not defined');
}

if (!supabaseUrl) {
  throw new Error('Supabase URL is not defined');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
