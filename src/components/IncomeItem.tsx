"use client";

import { useState } from "react";
import { updateIncome, deleteIncome } from "@/lib/income";
import type { Income } from "@/types/income";

export default function IncomeItem({
  income,
  onUpdated,
  onDeleted,
}: {
  income: Income;
  onUpdated: (income: Income) => void;
  onDeleted: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [source, setSource] = useState(income.source);
  const [amount, setAmount] = useState(income.amount.toString());
  const [monthYear, setMonthYear] = useState(income.month_year);
  const [notes, setNotes] = useState(income.notes || "");
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    try {
      const updated = await updateIncome(income.id, {
        source,
        amount: parseFloat(amount),
        month_year: monthYear,
        notes: notes || null,
      });
      onUpdated(updated);
      setEditing(false);
    } catch (err) {
      console.error("Error updating income:", err);
      alert("Gagal update income");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Yakin mau hapus income ini?")) return;
    try {
      await deleteIncome(income.id);
      onDeleted(income.id);
    } catch (err) {
      console.error("Error deleting income:", err);
      alert("Gagal hapus income");
    }
  }

  if (editing) {
    return (
      <div className="p-3 border rounded-lg bg-gray-50 space-y-2">
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <input
          type="month"
          value={monthYear}
          onChange={(e) => setMonthYear(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="bg-gray-400 text-white px-3 py-1 rounded"
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center py-2 border-b">
      <div>
        <p className="font-semibold">{income.source}</p>
        <p className="text-sm text-gray-600">
          Rp {income.amount.toLocaleString("id-ID")} • {income.month_year}
          {income.notes && ` • ${income.notes}`}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setEditing(true)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:underline"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
