'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/DashboardHeader';
import IncomeForm from '@/components/IncomeForm';
import ExpenseForm from '@/components/ExpenseForm';
import IncomeList from '@/components/IncomeList';
import ExpenseList from '@/components/ExpenseList';
import MonthFilter from '@/components/MonthFilter';
import ExpenseChart from '@/components/ExpenseChart';
import Last7DaysExpenseChart from '@/components/Last7DaysExpenseChart';
import { useRouter } from 'next/navigation';
import type { Income } from '@/types/income';
import type { Expense } from '@/types/expense';
import type { GoalSaving } from '@/types/goal_savings';
import IncomeExpenseTrendChart from '@/components/IncomeExpenseTrendChart';
import QuickSummary from '@/components/QuickSummary';
import GoalCard from "@/components/GoalCard";
import GoalList from "@/components/GoalList";


/** Helper: convert various id types (string|number|null|undefined) to a number (NaN if invalid) */
const idToNumber = (id: unknown): number => {
  if (id === null || id === undefined) return NaN;
  if (typeof id === 'number') return id;
  if (typeof id === 'string') {
    const n = parseInt(id, 10);
    return Number.isNaN(n) ? NaN : n;
  }
  return NaN;
};

export default function Dashboard() {
  const router = useRouter();

  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<GoalSaving[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const [refreshGoals, setRefreshGoals] = useState(false);

  const goalsTotal = goals.length;

  // goals tercapai (is_archived = true atau sesuai kondisi)
  const goalsAchieved = goals.filter(g => g.is_archived).length;

  // bulan aktif (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
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
        setUserId(session.user.id);
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
      try {
        if ((authListener as any)?.subscription?.unsubscribe) {
          (authListener as any).subscription.unsubscribe();
        }
      } catch (e) {
        // ignore
      }
    };
  }, [router]);

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

      if (!incomeError) setIncomes((incomeData || []) as Income[]);

      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!expenseError) setExpenses((expenseData || []) as Expense[]);

      const { data: goalData, error: goalError } = await supabase
        .from('goal_savings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!goalError) setGoals((goalData || []) as GoalSaving[]);

      setLoading(false);
    };

    fetchData();
  }, [userId, refreshGoals]);

  // ================= CRUD Goals =================
  const handleDeleteGoal = async (id: number) => {
    const { error } = await supabase.from('goal_savings').delete().eq('id', id);
    if (error) {
      console.error('Error deleting goal:', error.message);
    } else {
      setGoals((prev) => prev.filter((g) => idToNumber((g as any).id) !== id));
    }
  };

  const handleUpdateGoal = (updatedGoal: GoalSaving) => {
    const updatedId = idToNumber((updatedGoal as any).id);
    setGoals((prev) =>
      prev.map((g) => (idToNumber((g as any).id) === updatedId ? updatedGoal : g))
    );
  };

  // ================= CRUD Incomes =================
  const handleDeleteIncome = async (id: number) => {
    const { error } = await supabase.from('incomes').delete().eq('id', id);
    if (error) {
      console.error('Error deleting income:', error.message);
    } else {
      setIncomes((prev) => prev.filter((i) => idToNumber((i as any).id) !== id));
      // optional: refetch goals if you prefer server truth
      // setRefreshGoals(prev => !prev);
    }
  };

  const handleUpdateIncome = (updatedIncome: Income) => {
    const updatedId = idToNumber((updatedIncome as any).id);
    setIncomes((prev) =>
      prev.map((i) => (idToNumber((i as any).id) === updatedId ? updatedIncome : i))
    );
    // optional: setRefreshGoals(prev => !prev);
  };

  const handleAddIncome = (newIncome: Income) => {
    setIncomes((prev) => [newIncome, ...prev]);
    // optional: if you prefer to re-fetch goals from server, uncomment:
    // setRefreshGoals(prev => !prev);
  };

  const handleAdded = (income: Income) => {
    setIncomes((prev) => [income, ...prev]); // ⬅️ paling baru di atas
  };


  // ================= CRUD Expenses =================
  const handleAddExpense = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = async (id: number) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) {
      console.error('Error deleting expense:', error.message);
    } else {
      setExpenses((prev) => prev.filter((e) => idToNumber((e as any).id) !== id));
    }
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    const updatedId = idToNumber((updatedExpense as any).id);
    setExpenses((prev) =>
      prev.map((e) => (idToNumber((e as any).id) === updatedId ? updatedExpense : e))
    );
  };

  // ================= Filter data sesuai bulan =================
  const filteredIncomes = useMemo(() => {
    return incomes.filter((i) => i.month_year === selectedMonth);
  }, [incomes, selectedMonth]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => e.expense_date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // ================= Ringkasan =================
  const {
    totalIncomeCurrent,
    totalIncomePrev,
    totalExpenseCurrent,
    totalExpensePrev,
  } = useMemo(() => {
    const [yStr, mStr] = selectedMonth.split('-');
    const y = Number(yStr);
    const m = Number(mStr);

    const totalIncomeCurrent = filteredIncomes.reduce((s, i) => s + Number(i.amount), 0);
    const totalExpenseCurrent = filteredExpenses.reduce((s, e) => s + Number(e.amount), 0);

    // bulan sebelumnya
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

  const incomeCount = filteredIncomes.length;
  const expenseCount = filteredExpenses.length;

  // ================= Kategori terbesar =================
  const topCategory = useMemo(() => {
    if (filteredExpenses.length === 0) return null;

    const categoryTotals: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    });

    const entries = Object.entries(categoryTotals);
    if (entries.length === 0) return null;

    const [maxCategory, maxAmount] = entries.reduce((a, b) =>
      a[1] > b[1] ? a : b
    );
    const totalExpense = filteredExpenses.reduce((s, e) => s + Number(e.amount), 0);

    return {
      name: maxCategory,
      percentage: (maxAmount / totalExpense) * 100,
    };
  }, [filteredExpenses]);

  // ================= Compute goalsWithSaved (derive saved from incomes) =================
  const goalsWithSaved = useMemo(() => {
    // For each goal, sum incomes that reference this goal (assumes 'income.goal_id' exists)
    return goals.map((g) => {
      const gid = idToNumber((g as any).id);
      const sumFromIncomes = incomes.reduce((acc, inc) => {
        const incGoalId = idToNumber((inc as any).goal_id);
        if (incGoalId === gid) {
          return acc + Number(inc.amount ?? 0);
        }
        return acc;
      }, 0);

      // Use computed sum (if any), otherwise use stored saved_amount
      const effectiveSaved = sumFromIncomes > 0 ? sumFromIncomes : Number(g.saved_amount ?? 0);

      // Return new goal object with updated saved_amount for display
      return {
        ...g,
        saved_amount: effectiveSaved,
      } as GoalSaving;
    });
  }, [goals, incomes]);

  // ================= Loading session =================
  if (checkingSession) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">⏳ Loading...</p>
      </main>
    );
  }

  // ================= Render =================
  return (
    <main className="min-h-screen bg-white dark:bg-gray-600">
      <Header />

      <div className="px-6 py-1 mt-20">
        <DashboardHeader />
      </div>

      <div className="max-w-8xl mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* Kolom kiri */}
        <div className="w-full md:w-1/3 space-y-4">
          {/* Form tambah goal */}
          {/* <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <GoalForm onAdded={() => setRefreshGoals(!refreshGoals)} />
          </div> */}

          {/* Form Incomes */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            {userId ? (
              <IncomeForm
                onAdded={(income) =>
                  setIncomes((prev) => [income, ...prev]) // ✅ terbaru di atas
                }
                onGoalUpdated={(goalId, amount) =>
                  setGoals((prev) =>
                    prev.map((g) =>
                      String(g.id) === String(goalId)
                        ? { ...g, saved_amount: (g.saved_amount || 0) + amount }
                        : g
                    )
                  )
                }
              />
            ) : (
              <p className="text-red-500">Anda belum login!</p>
            )}
          </div>

          {/* Form Expenses */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            {userId ? (
              <ExpenseForm onAdd={handleAddExpense} />
            ) : (
              <p className="text-red-500">Anda belum login!</p>
            )}
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            {loading ? (
              <p className="text-gray-500">Memuat goals...</p>
            ) : goalsWithSaved.length > 0 ? (
              <GoalCard
                goals={goalsWithSaved}
                onDeleted={handleDeleteGoal}
                onUpdated={handleUpdateGoal}
                onAdded={(newGoal?: GoalSaving) => {
                  // apabila GoalForm mengirimkan objek goal baru -> langsung tambahkan ke state
                  if (newGoal) {
                    setGoals((prev) => [newGoal, ...prev]);
                  } else {
                    // fallback: kalau tidak ada objek, bisa trig refresh minimal
                    setRefreshGoals((prev) => !prev);
                  }
                }}
              />
            ) : (
              <p className="text-gray-500">Belum ada goals.</p>
            )}
          </div>
        </div>

        {/* Kolom kanan */}
        <div className="w-full md:w-2/3 space-y-4">
          {/* Filter */}
          <div className="pt-6 pl-6 bg-white">
            <MonthFilter
              value={selectedMonth}
              onChange={(month) => setSelectedMonth(month)}
            />
          </div>

          {/* Summary */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <QuickSummary
              totalIncome={totalIncomeCurrent}
              lastMonthIncome={totalIncomePrev}
              totalExpense={totalExpenseCurrent}
              lastMonthExpense={totalExpensePrev}
              selectedMonth={selectedMonth}
              topCategory={topCategory || undefined}
              goalsAchieved={goalsAchieved}   // 👈 oper ke props
              goalsTotal={goalsTotal}         // 👈 oper ke props
              incomeCount={incomeCount}      // ✅ tambahan
              expenseCount={expenseCount}    // ✅ opsional, kalau mau dipakai di card
            />
          </div>

          {/* Charts */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <ExpenseChart expenses={filteredExpenses} month={selectedMonth} />
            </div>
            <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-x-auto">
              <Last7DaysExpenseChart expenses={filteredExpenses} month={selectedMonth} />
            </div>
          </div>

          {/* Trend */}
          <div className="p-6">
            <IncomeExpenseTrendChart incomes={incomes} expenses={expenses} />
          </div>

          {/* <GoalList
            goals={goalsWithSaved}
            onDeleted={handleDeleteGoal}
            onUpdated={handleUpdateGoal} onAdded={function (): void {
              throw new Error('Function not implemented.');
            }} /> */}

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
          <div className="mb-2 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
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
      <div className="mt-2">
        <Footer />
      </div>
    </main>
  );
}