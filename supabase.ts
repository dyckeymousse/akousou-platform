import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
"https://bhzwzppyhxfqatswybrq.supabase.co"

const supabaseAnonKey =
"sb_publishable_aW-Kjt3rtDzYQLW4rpO1Uw_y4tQoLF4"

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)