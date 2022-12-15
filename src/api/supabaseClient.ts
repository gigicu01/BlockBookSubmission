import { createClient } from '@supabase/supabase-js'
//Provided url to hit Supabase API for the project that we are using
const supabaseUrl = 'https://qirvaheiwtaoupddqgjo.supabase.co'

//Api key that is used and needed to hit the API 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcnZhaGVpd3Rhb3VwZGRxZ2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAwMTkxNTAsImV4cCI6MTk4NTU5NTE1MH0.rpg_BLLuHmST0k5wWaySFS9M_axYjinbPTa5dlnrwkQ" 
//Exports the Supabase Client that holds the information needed to connect to the correct API
export const supabaseClient = createClient(supabaseUrl, supabaseKey)