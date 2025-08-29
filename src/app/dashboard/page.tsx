'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import DashboardHeader from '@/components/DashboardHeader';
import IncomeForm from '@/components/IncomeForm';
import ExpenseForm from '@/components/ExpenseForm';
import IncomeList from '@/components/IncomeList';
import ExpenseList from '@/components/ExpenseList';
import MonthFilter from '@/components/MonthFilter';
import ExpenseChart from '@/components/ExpenseChart';
import SummaryCard from '@/components/SummaryCard';
import Last7DaysExpenseChart from '@/components/Last7DaysExpenseChart';
import { useRouter } from 'next/navigation';
import type { Income } from '@/types/income';
import type { Expense } from '@/types/expense';
import IncomeExpenseTrendChart from '@/components/IncomeExpenseTrendChart';
import QuickSummary from '@/components/QuickSummary';

export default function Dashboard() {
  const router = useRouter();

  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // ✅ State bulan yang dipilih (default: bulan sekarang)
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );

  // ================= Session =================
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/auth/login');
      } else {
        const uid = session.user.id;
        setUserId(uid);

        // ✅ Cek apakah uid sama dengan state userId
        console.log('session.user.id:', uid);
        console.log('userId state:', userId);
        console.log('Apakah sama?', uid === userId);
      }

      setCheckingSession(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.replace('/');
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, userId]);

  // ================= Fetch data =================
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setLoading(true);

      const { data: incomeData, error: incomeError } = await supabase
        .from('incomes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (incomeError) console.error('Error fetching incomes:', incomeError.message);
      else setIncomes((incomeData || []) as Income[]);

      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (expenseError) console.error('Error fetching expenses:', expenseError.message);
      else setExpenses((expenseData || []) as Expense[]);

      setLoading(false);
    };

    fetchData();
  }, [userId]);

  // ================= Filter data sesuai bulan =================
  const filteredIncomes = useMemo(() => {
    return incomes.filter((i) => i.month_year === selectedMonth);
  }, [incomes, selectedMonth]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => e.expense_date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // ================= Perhitungan Ringkasan =================
  const {
    totalIncomeCurrent,
    totalIncomePrev,
    totalExpenseCurrent,
    totalExpensePrev,
  } = useMemo(() => {
    const [y, m] = selectedMonth.split('-').map(Number);

    const totalIncomeCurrent = filteredIncomes.reduce((s, i) => s + Number(i.amount), 0);
    const totalExpenseCurrent = filteredExpenses.reduce((s, e) => s + Number(e.amount), 0);

    // Hitung bulan sebelumnya
    const prevMonth = m === 1 ? 12 : m - 1;
    const prevYear = m === 1 ? y - 1 : y;
    const prevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

    const totalIncomePrev = incomes
      .filter((i) => i.month_year === prevMonthStr)
      .reduce((s, i) => s + Number(i.amount), 0);

    const totalExpensePrev = expenses
      .filter((e) => e.expense_date.startsWith(prevMonthStr))
      .reduce((s, e) => s + Number(e.amount), 0);

    return {
      totalIncomeCurrent,
      totalIncomePrev,
      totalExpenseCurrent,
      totalExpensePrev,
    };
  }, [filteredIncomes, filteredExpenses, incomes, expenses, selectedMonth]);

  // ================= Cari kategori terbesar =================
  const topCategory = useMemo(() => {
    if (filteredExpenses.length === 0) return null;

    const categoryTotals: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    });

    // cari kategori dengan jumlah terbesar
    const entries = Object.entries(categoryTotals);
    if (entries.length === 0) return null;

    const [maxCategory, maxAmount] = entries.reduce((a, b) => (a[1] > b[1] ? a : b));
    const totalExpense = filteredExpenses.reduce((s, e) => s + Number(e.amount), 0);

    return {
      name: maxCategory,
      percentage: (maxAmount / totalExpense) * 100,
    };
  }, [filteredExpenses]);


  // ================= CRUD =================
  const handleDeleteIncome = async (id: number) => {
    const { error } = await supabase.from('incomes').delete().eq('id', id);
    if (error) console.error('Error deleting income:', error.message);
    else setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateIncome = (updatedIncome: Income) => {
    setIncomes((prev) => prev.map((inc) => (inc.id === updatedIncome.id ? updatedIncome : inc)));
  };

  const handleAddIncome = (newIncome: Income) => {
    setIncomes((prev) => [newIncome, ...prev]);
  };

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = async (id: number) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) console.error('Error deleting expense:', error.message);
    else setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses((prev) => prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e)));
  };

  if (checkingSession) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Memeriksa sesi...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-600">
      <Header />

      {/* Alert informasi user */}
      <div className="px-6 py-1">
        <DashboardHeader />
      </div>

      <div className="max-w-8xl mx-auto p-4 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 space-y-4">
          {/* Form Incomes */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            {!checkingSession ? (
              userId ? (
                <IncomeForm onAdded={handleAddIncome} />
              ) : (
                <p className="text-red-500">Anda belum login!</p>
              )
            ) : (
              <p className="text-gray-500">Memeriksa sesi...</p>
            )}
          </div>
          {/* Form Expenses */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            {!checkingSession ? (
              userId ? (
                <ExpenseForm onAdd={handleAddExpense} />
              ) : (
                <p className="text-red-500">Anda belum login!</p>
              )
            ) : (
              <p className="text-gray-500">Memeriksa sesi...</p>
            )}
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            {/* <BudgetsTracker totalExpense={totalExpenseCurrent} /> */}
          </div>
        </div>

        {/* Konten utama */}
        <div className="w-full md:w-2/3 space-y-4">
          {/* Filter */}
          <div className="pt-6 pl-6 bg-white">
            <MonthFilter
              value={selectedMonth}
              onChange={(month) => setSelectedMonth(month)}
            />
          </div>

          {/* ✅ Summary */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <QuickSummary
              totalIncome={totalIncomeCurrent}
              lastMonthIncome={totalIncomePrev}
              totalExpense={totalExpenseCurrent}
              lastMonthExpense={totalExpensePrev}
              selectedMonth={selectedMonth}
              topCategory={topCategory || undefined} // << ini tambahan
            />
            {/* <SummaryCard
              totalIncome={totalIncomeCurrent}
              lastMonthIncome={totalIncomePrev}
              totalExpense={totalExpenseCurrent}
              lastMonthExpense={totalExpensePrev}
              selectedMonth={selectedMonth}
            /> */}
          </div>

          {/* Chart */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <ExpenseChart expenses={filteredExpenses} month={selectedMonth} />
            </div>
            <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-x-auto">
              <Last7DaysExpenseChart expenses={filteredExpenses} month={selectedMonth} />
            </div>
          </div>

          <div className="p-6">
            <IncomeExpenseTrendChart
              incomes={incomes}
              expenses={expenses}
            />
          </div>

          {/* <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <ExpenseChart expenses={filteredExpenses} month={selectedMonth} />
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <Last7DaysExpenseChart expenses={filteredExpenses} month={selectedMonth} />
          </div> */}


          {/* Income List */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            {loading ? (
              <p className="text-gray-500">Memuat data pemasukan...</p>
            ) : filteredIncomes.length > 0 ? (
              <IncomeList
                incomes={filteredIncomes}
                onUpdated={handleUpdateIncome}
                onDeleted={handleDeleteIncome}
              />
            ) : (
              <p className="text-gray-500">Belum ada pemasukan.</p>
            )}
          </div>

          {/* Expense List */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            {loading ? (
              <p className="text-gray-500">Memuat data pengeluaran...</p>
            ) : filteredExpenses.length > 0 ? (
              <ExpenseList
                expenses={filteredExpenses}
                onUpdated={handleUpdateExpense}
                onDeleted={handleDeleteExpense}
              />
            ) : (
              <p className="text-gray-500">Belum ada pengeluaran.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
