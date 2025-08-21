// /types/income.ts

export interface Income {
  id: number;
  user_id: string; // UUID dari Supabase Auth
  source: string;
  amount: number;
  month_year: string; // format: YYYY-MM
  notes?: string | null;
  created_at: string; // ISO timestamp
}

// Untuk data input (ketika create), id dan created_at biasanya otomatis dari Supabase
export type IncomeInput = Omit<Income, "id" | "created_at">;
