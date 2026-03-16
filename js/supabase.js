const SUPABASE_URL = "https://wuizcshgkdolkngqoutj.supabase.co";
const SUPABASE_KEY = "sb_publishable_hHr-ZsPbx8vFZfOJ-mGARg_Atr7yIdI";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);