// lib/income.ts
import { supabase } from "@/lib/supabaseClient";
import type { Income } from "@/types/income";

export async function getIncomes(user_id: string): Promise<Income[]> {
  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Income[];
}

export async function addIncome(
  income: Omit<Income, "id" | "created_at">
) {
  const { data, error } = await supabase
    .from("incomes")
    .insert([income])
    .select()
    .single();

  if (error) throw error;
  return data as Income;
}

export async function updateIncome(
  id: number,
  updates: Partial<Omit<Income, "id" | "user_id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("incomes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Income;
}

export async function deleteIncome(id: number) {
  const { error } = await supabase.from("incomes").delete().eq("id", id);
  if (error) throw error;
}
