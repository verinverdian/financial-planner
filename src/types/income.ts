export interface Income {
  id: number;
  user_id: string; // UUID dari Supabase Auth
  source: string;
  amount: number;
  month_year: string; // "YYYY-MM"
  notes?: string | null;
  created_at: string; // ISO timestamp
}