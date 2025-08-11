'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Expense } from '@/types/expense';
import type { Income } from '@/types/income';
import Header from '@/components/Header';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseChart from '@/components/ExpenseChart';
import IncomeForm from '@/components/IncomeForm';
import IncomeList from '@/components/IncomeList';

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [filter, setFilter] = useState('');
  const [month, setMonth] = useState<string>(''); // format YYYY-MM

  // === Load dari localStorage ===
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

    const savedIncomes = localStorage.getItem('incomes');
    if (savedIncomes) setIncomes(JSON.parse(savedIncomes));

    const savedMonth = localStorage.getItem('month');
    if (savedMonth) setMonth(savedMonth);
  }, []);

  // === Simpan ke localStorage ===
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('month', month);
  }, [month]);

  // === Handler Tambah Income ===
  const handleAddIncome = (income: Income) => {
    if (!income.amount || income.amount <= 0) {
      alert('Nominal pemasukan harus lebih dari 0');
      return;
    }
    if (!income.source) {
      alert('Sumber pemasukan tidak boleh kosong');
      return;
    }
    setIncomes(prev => [...prev, { ...income, month }]);
  };

  // === Handler Tambah Expense ===
  const handleAddExpense = (expense: Expense) => {
    if (!expense.amount || expense.amount <= 0) {
      alert('Nominal pengeluaran harus lebih dari 0');
      return;
    }
    if (!expense.category) {
      alert('Kategori tidak boleh kosong');
      return;
    }
    setExpenses(prev => [...prev, { ...expense, month }]);
  };

  // === Filter data per bulan & kategori ===
  const filteredIncomes = useMemo(() => {
    return incomes.filter(inc => inc.month === month);
  }, [incomes, month]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(
      exp =>
        exp.month === month &&
        (filter ? exp.category === filter : true)
    );
  }, [expenses, filter, month]);

  // === Hitung total ===
  const totalIncome = filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalIncome - totalExpenses;
  const percentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  // === Export data ===
  const handleExport = () => {
    const data = {
      incomes: filteredIncomes,
      expenses: filteredExpenses
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-${month}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Warna progress bar
  let progressColor = 'bg-green-500';
  if (percentage >= 80) progressColor = 'bg-red-500';
  else if (percentage >= 50) progressColor = 'bg-yellow-500';

  // Format bulan-tahun
  const formatMonthYear = (monthString: string) => {
    if (!monthString) return '';
    const [year, month] = monthString.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-600">
      <Header />

      <div className="p-4 pb-0 shadow-sm">
        <div className="px-4 py-3 leading-normal bg-green-100 dark:bg-gray-800 dark:border-gray-900 rounded-lg border-2 border-green-400">
          <p>Halo 👋, selamat datang di perencana keuangan kamu!</p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* Bagian kiri */}
        <div className="w-full md:w-1/3 space-y-4">
          {/* Pilih bulan */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <label className="block font-semibold mb-2 dark:text-white">Pilih Bulan</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Form Pemasukan */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <IncomeForm onAdd={handleAddIncome} />
          </div>

          {/* Form Pengeluaran */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <ExpenseForm onAdd={handleAddExpense} />
          </div>

          {/* Filter & Export */}
          <div className="flex gap-2 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Semua Kategori</option>
              <option value="Makanan">Makanan</option>
              <option value="Transportasi">Transportasi</option>
              <option value="Hiburan">Hiburan</option>
              <option value="Tagihan">Tagihan</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            <button
              onClick={handleExport}
              className="bg-green-500 dark:bg-gray-400 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              Export
            </button>
          </div>
        </div>

        {/* Bagian kanan */}
        <div className="w-full md:w-2/3 space-y-4">
          {/* Ringkasan */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="flex justify-between mb-4 border-b border-dashed border-gray-400 pb-4">
              <span className="text-xl font-bold">Total Pemasukan {month && `(${formatMonthYear(month)})`}</span>
              <span className="text-xl font-bold">Rp {totalIncome.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between mb-4 text-red-500">
              <span className="text-xl font-bold">Total Pengeluaran</span>
              <span className="text-xl font-bold">Rp {totalExpenses.toLocaleString('id-ID')}</span>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full mb-2 overflow-hidden">
              <div
                className={`h-4 rounded-full ${progressColor} transition-all duration-500`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mb-4">{percentage.toFixed(1)}% dari pemasukan</p>
            <div className="flex justify-between">
              <span className="text-xl font-bold text-green-600">Sisa Uang</span>
              <span className={`text-xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                Rp {remaining.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* List Pemasukan */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            {/* <IncomeList incomes={filteredIncomes} /> */}
            <IncomeList
              incomes={filteredIncomes}
              onEdit={(updatedIncome) => {
                setIncomes((prev) =>
                  prev.map((inc) =>
                    inc.id === updatedIncome.id ? updatedIncome : inc
                  )
                );
              }}
              onDelete={(id) => {
                setIncomes((prev) => prev.filter((inc) => inc.id !== id));
              }}
            />

          </div>

          {/* List Pengeluaran */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <ExpenseList
              expenses={expenses} // kirim semua
              month={month}
              filter={filter}
              onEdit={(updatedExpense) => {
                setExpenses((prev) =>
                  prev.map((exp) =>
                    exp.id === updatedExpense.id ? updatedExpense : exp
                  )
                );
              }}
              onDelete={(id) => {
                setExpenses((prev) => prev.filter((exp) => exp.id !== id));
              }}
            />
          </div>

          {/* Grafik */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            {filteredExpenses.length >= 0 && (
              <ExpenseChart expenses={filteredExpenses} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
