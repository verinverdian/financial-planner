export interface Expense {
  id: number;
  user_id: string;
  category: string;
  description: string;
  amount: number;
  expense_date: string; // format date ISO
  notes?: string;
  month?: string; // tambahkan ini
}
