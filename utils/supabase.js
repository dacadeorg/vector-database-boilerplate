import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(`https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`,process.env.SUPABASE_KEY);
