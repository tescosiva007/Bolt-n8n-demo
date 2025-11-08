import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://172.205.248.111:8000';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Store {
  id: string;
  code: string;
  name: string;
  area: string;
  status: string;
  postcode: string;
  created_at: string;
}

export interface Message {
  id: string;
  title: string;
  body: string;
  list_of_stores: string[];
  user_id: string;
  date_created: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  created_at: string;
}
