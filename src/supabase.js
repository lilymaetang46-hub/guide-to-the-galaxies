import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bwxjqrrebgszccypnryc.supabase.co";
const supabaseAnonKey = "sb_publishable_AvDxD-7amP5BpSohRUzd2Q_sudlqH0e";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);