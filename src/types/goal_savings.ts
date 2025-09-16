export interface GoalSaving {
    id: string;               // bigint → string (Supabase return as string)
    user_id: string;          // UUID
    goal_name: string;        // nama tujuan
    target_amount: number | null; // numeric bisa null
    saved_amount: number;     // default 0
    deadline: string | null;  // date → string (ISO format)
    notes: string | null;
    created_at: string;       // timestamp → string
    is_archived?: boolean;
  }  