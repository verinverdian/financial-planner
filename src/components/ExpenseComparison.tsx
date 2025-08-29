import { useMemo, useState } from "react";
import type { Expense } from "@/types/expense";
import { ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";

interface ExpenseComparisonProps {
  expenses: Expense[];
  selectedMonth?: string; // format "YYYY-MM"
  totalIncome: number; // pemasukan bulan ini
  lastMonthIncome?: number; // untuk perbandingan pemasukan
}

export default function ExpenseComparison({
  expenses,
  selectedMonth,
  totalIncome,
  lastMonthIncome = 0,
}: ExpenseComparisonProps) {
  const [showAmount, setShowAmount] = useState(true);
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const formatMonthYear = (selectedMonth?: string) => {
    if (!selectedMonth) return "";
    const [year, month] = selectedMonth.split("-").map(Number);
    return `${monthNames[month - 1]} ${year}`;
  };

  const comparison = useMemo(() => {
    if (!selectedMonth) return null;

    const [year, month] = selectedMonth.split("-").map(Number);

    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.expense_date);
      return (
        expenseDate.getFullYear() === year &&
        expenseDate.getMonth() + 1 === month
      );
    });

    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const prevMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.expense_date);
      return (
        expenseDate.getFullYear() === prevYear &&
        expenseDate.getMonth() + 1 === prevMonth
      );
    });

    const currentTotal = currentMonthExpenses.reduce(
      (sum, e) => sum + e.amount,
      0
    );
    const prevTotal = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    if (prevTotal === 0 && currentTotal === 0) {
      return { status: "same", amount: 0, percentage: 0, currentTotal, prevTotal };
    }
    if (prevTotal === 0) {
      return {
        status: "increase",
        amount: currentTotal,
        percentage: 100,
        currentTotal,
        prevTotal,
      };
    }

    const diff = currentTotal - prevTotal;
    const percentage = (diff / prevTotal) * 100;

    if (diff > 0) {
      return {
        status: "increase",
        amount: diff,
        percentage,
        currentTotal,
        prevTotal,
      };
    } else if (diff < 0) {
      return {
        status: "decrease",
        amount: Math.abs(diff),
        percentage: Math.abs(percentage),
        currentTotal,
        prevTotal,
      };
    } else {
      return { status: "same", amount: 0, percentage: 0, currentTotal, prevTotal };
    }
  }, [expenses, selectedMonth]);

  if (!comparison) return null;

  const formatMoney = (amount: number) =>
    `Rp ${amount.toLocaleString("id-ID")}`;

  const percentageFromIncome =
    totalIncome > 0 ? (comparison.currentTotal / totalIncome) * 100 : 0;

  const remaining = totalIncome - comparison.currentTotal;

  return (
    <div className="bg-white dark:bg-gray-800">
      {/* Ringkasam */}
      <h1 className="pb-2 text-lg font-bold text-gray-800 dark:text-gray-100">Ringkasan ({formatMonthYear(selectedMonth)})</h1>
      
      <hr />

      {/* Total Pemasukan */}
      <div className="flex justify-between items-start border-b py-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Total Pemasukan
          </h2>
          <p
            className={`text-sm pt-2 mt-1 flex items-center gap-1 ${lastMonthIncome <= totalIncome
              ? "text-green-600"
              : "text-red-600"
              }`}
          >
            {lastMonthIncome <= totalIncome ? (
              <ArrowUp size={14} />
            ) : (
              <ArrowDown size={14} />
            )}
            {lastMonthIncome <= totalIncome ? "Naik" : "Turun"}{" "}
            {formatMoney(Math.abs(totalIncome - lastMonthIncome))} (
            {lastMonthIncome === 0
              ? "100"
              : (
                ((totalIncome - lastMonthIncome) / lastMonthIncome) *
                100
              ).toFixed(1)}
            %) dibanding bulan lalu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {showAmount ? formatMoney(totalIncome) : "•••••••"}
          </span>
          <button
            onClick={() => setShowAmount(!showAmount)}
            className="text-gray-500 hover:text-gray-700"
          >
            {showAmount ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
      </div>

      {/* Total Pengeluaran */}
      <div className="space-y-3 border-b pt-2 pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-red-600">Total Pengeluaran</h3>
          <p className="text-xl font-bold text-red-600">
            {showAmount ? formatMoney(comparison.currentTotal) : "•••••••"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {comparison.status === "increase" && (
            <>
              <ArrowUp size={16} className="text-red-500" />
              <span className="text-red-500">
                Naik {formatMoney(comparison.amount)} (
                {comparison.percentage.toFixed(1)}%) dibanding bulan lalu
              </span>
            </>
          )}
          {comparison.status === "decrease" && (
            <>
              <ArrowDown size={16} className="text-green-500" />
              <span className="text-green-500">
                Turun {formatMoney(comparison.amount)} (
                {comparison.percentage.toFixed(1)}%) dibanding bulan lalu
              </span>
            </>
          )}
          {comparison.status === "same" && (
            <span className="text-gray-500">
              Tidak ada perubahan dibanding bulan lalu
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentageFromIncome}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {percentageFromIncome.toFixed(1)}% dari pemasukan
          </p>
        </div>
      </div>

      {/* Saldo Bersih */}
      <div className="flex justify-between items-center pt-2">
        <h4 className="text-lg font-bold text-green-600 dark:text-gray-100">
          Sisa Uang / Saldo Bersih
        </h4>
        <span className="text-lg font-bold text-green-600">
          {showAmount ? formatMoney(remaining) : "•••••••"}
        </span>
      </div>
    </div>

  );
}
