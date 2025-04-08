import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pusjmbmuwulrziqcewwo.supabase.co'; // Remplace avec ton URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1c2ptYm11d3VscnppcWNld3dvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDEwMzY0NCwiZXhwIjoyMDU5Njc5NjQ0fQ.E3mY0H4PhBHdwhZC030wHw08G1ZGtjmPCOpKXY8VXTQ'; // Remplace avec ta clé anonyme

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);