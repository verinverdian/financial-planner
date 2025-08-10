'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Expense } from '@/types/expense';
import Header from '@/components/Header';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseChart from '@/components/ExpenseChart';

export default function HomePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState('');
  const [income, setIncome] = useState<number>(0);

  // Load data dari localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

    const savedIncome = localStorage.getItem('income');
    if (savedIncome) setIncome(Number(savedIncome));
  }, []);

  // Simpan data ke localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('income', income.toString());
  }, [income]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(expenses, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredExpenses = useMemo(() => {
    if (!filter) return expenses;
    return expenses.filter(exp => exp.category === filter);
  }, [expenses, filter]);

  const total = useMemo(
    () => filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    [filteredExpenses]
  );

  const remaining = income - total;
  const percentage = income > 0 ? (total / income) * 100 : 0;

  let progressColor = 'bg-green-500';
  if (percentage >= 80) progressColor = 'bg-red-500';
  else if (percentage >= 50) progressColor = 'bg-yellow-500';

  // Format angka input gaji
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, '');
    if (!isNaN(Number(raw))) {
      setIncome(Number(raw));
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-4 pb-0">
        <div className="px-4 py-3 leading-normal bg-green-100 rounded-lg" role="alert">
          <p>Hello, welcome to your financial planner 👋</p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* Bagian kiri */}
        <div className="w-full md:w-1/3 space-y-4">
          {/* Input pemasukan */}
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <label className="block mb-2 font-semibold text-green-600 text-lg">Pemasukan / Gaji</label>
            <input
              type="text"
              value={income ? income.toLocaleString('id-ID') : '0'}
              onChange={handleIncomeChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Masukkan jumlah pemasukan"
            />
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <ExpenseForm onAdd={handleAddExpense} />
          </div>

          <div className="flex gap-2 p-6 bg-white rounded-2xl shadow-sm">
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
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              Export
            </button>
          </div>
        </div>

        {/* Bagian kanan */}
        <div className="w-full md:w-2/3 space-y-4">
          {/* Bagian Total & Sisa */}
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">Total Pemasukan</span>
              <span className="text-2xl font-bold">
                Rp {income.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Garis pemisah putus-putus */}
            <hr className="border-t border-gray-300 border-dashed mb-4" />

            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-red-500">Total Pengeluaran</span>
              <span className="text-2xl font-bold">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-4 bg-gray-200 rounded-full mb-2 overflow-hidden">
              <div
                className={`h-4 rounded-full ${progressColor} transition-all duration-500 ease-out`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {percentage.toFixed(1)}% dari pemasukan
            </p>

            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-600">Sisa Uang</span>
              <span
                className={`text-2xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'
                  }`}
              >
                Rp {remaining.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <ExpenseList expenses={filteredExpenses} />
          </div>

          {filteredExpenses.length > 0 && (
            <div className="p-6 bg-white rounded-2xl shadow-sm">
              <ExpenseChart expenses={filteredExpenses} />
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
