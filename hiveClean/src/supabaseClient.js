import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://oqzblabzwbaccmmnfnfu.supabase.co'
const supabaseAnonKey  = 'sb_publishable_f2H65syCWF3P8VDLdGDwHw_k2ZkT9f-'

export const supabase = createClient(supabaseUrl,supabaseAnonKey)