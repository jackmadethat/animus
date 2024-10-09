import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pwvstgzlznfeoikydbrk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dnN0Z3psem5mZW9pa3lkYnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxOTI4MzAsImV4cCI6MjA0MTc2ODgzMH0.3v0BTZDLX1eZ2nlCxvOgbLxqYL3QfGj20K2fT9iUxfI';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;