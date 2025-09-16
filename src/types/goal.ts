// src/types/goal.ts
export interface Goal {
    id: number;
    user_id: string;
    goal_name: string;
    target_amount: number | null;
    saved_amount: number;
    deadline?: string | null;
    notes?: string | null;
    created_at: string;
  }
  