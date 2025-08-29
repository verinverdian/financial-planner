"use client";

import { useState, useMemo } from "react";
import TransactionFilter from "@/components/TransactionFilter";

// interface untuk data dari tabel incomes
interface Income {
    id: string;
    amount: number;
    income_date: string;   // dari DB biasanya string (ISO date)
    source: string;        // contoh: "Gaji", "Bonus"
  }
  
  // interface untuk data dari tabel expenses
  interface Expense {
    id: string;
    amount: number;
    expense_date: string;
    category: string;      // contoh: "Makanan", "Transport"
    description: string;   // keterangan singkat
  }
  
  // interface gabungan (dipakai setelah normalisasi)
  interface Transaction {
    id: string;
    type: "income" | "expense";  // penanda sumber data
    amount: number;
    date: string;                // diseragamkan jadi "date"
    category: string;
    description: string;
  }
  
export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // TODO: fetch incomes & expenses dari Supabase
  const incomes: Income[] = [];
  const expenses: Expense[] = [];

  // normalisasi
  const transactions: Transaction[] = useMemo(() => {
    const incomesNormalized: Transaction[] = incomes.map((i) => ({
      id: i.id,
      type: "income",
      amount: i.amount,
      date: i.income_date,
      category: "Income",
      description: i.source,
    }));

    const expensesNormalized: Transaction[] = expenses.map((e) => ({
      id: e.id,
      type: "expense",
      amount: e.amount,
      date: e.expense_date,
      category: e.category,
      description: e.description,
    }));

    return [...incomesNormalized, ...expensesNormalized];
  }, [incomes, expenses]);

  // filter
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = !category || t.category === category;

      const tDate = new Date(t.date);
      const matchesDate =
        (!startDate || tDate >= startDate) && (!endDate || tDate <= endDate);

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [transactions, search, category, startDate, endDate]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Daftar Transaksi</h1>

      <TransactionFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <div className="space-y-2">
        {filteredTransactions.map((t) => (
          <div
            key={t.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>
              [{t.type.toUpperCase()}] {t.description} ({t.category})
            </span>
            <span
              className={t.type === "income" ? "text-green-600" : "text-red-600"}
            >
              Rp {t.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
