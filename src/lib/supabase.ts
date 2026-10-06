import {createClient,type SupabaseClient} from '@supabase/supabase-js';

import type {Database} from './database.types';
let client: SupabaseClient<Database> | null = null;
export function getSupabase(){
 if(typeof window==='undefined')return null;
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return null;
 return client??=createClient<Database>(url,key,{auth:{storage:window.sessionStorage,persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
}
