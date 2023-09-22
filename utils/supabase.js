import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(`https://${process.env.SUPABASE_REFERENCE_ID}.supabase.co`,process.env.SUPABASE_PROJECT_API_KEY);
