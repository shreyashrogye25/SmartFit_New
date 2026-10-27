/* ==========================================================================
   SMARTFIT - Supabase Client Configuration
   ========================================================================== */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uhkvqqewztfwuuuqngok.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoa3ZxcWV3enRmd3V1dXFuZ29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MTAxODEsImV4cCI6MjEwNTI4NjE4MX0.4-HNhBEUg0qr1Mgt8ubRp4hAA62o8nxkxIorhAgcec0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
