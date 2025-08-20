import { useMemo } from 'react';
import type { Expense } from '@/types/expense';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface ExpenseComparisonProps {
  expenses: Expense[];
  selectedMonth?: string; // format "YYYY-MM"
}

export default function ExpenseComparison({ expenses, selectedMonth }: ExpenseComparisonProps) {
  const comparison = useMemo(() => {
    if (!selectedMonth) return null;

    const [year, month] = selectedMonth.split("-").map(Number);

    const currentMonthIncomes = expenses.filter((expense) => {
      const incomeDate = new Date(expense.month);
      return (
        incomeDate.getFullYear() === year &&
        incomeDate.getMonth() + 1 === month
      );
    });

    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const prevMonthIncomes = expenses.filter((expense) => {
      const incomeDate = new Date(expense.month);
      return (
        incomeDate.getFullYear() === prevYear &&
        incomeDate.getMonth() + 1 === prevMonth
      );
    });

    const currentTotal = currentMonthIncomes.reduce(
      (sum, inc) => sum + inc.amount,
      0
    );
    const prevTotal = prevMonthIncomes.reduce(
      (sum, inc) => sum + inc.amount,
      0
    );

    if (prevTotal === 0 && currentTotal === 0) {
      return { status: "same", amount: 0, percentage: 0 };
    }
    if (prevTotal === 0) {
      return { status: "increase", amount: currentTotal, percentage: 100 };
    }

    const diff = currentTotal - prevTotal;
    const percentage = (diff / prevTotal) * 100;

    if (diff > 0) {
      return { status: "increase", amount: diff, percentage };
    } else if (diff < 0) {
      return { status: "decrease", amount: Math.abs(diff), percentage: Math.abs(percentage) };
    } else {
      return { status: "same", amount: 0, percentage: 0 };
    }
  }, [expenses, selectedMonth]);

  if (!comparison) return null;

  const formatMoney = (amount: number) =>
    `Rp ${amount.toLocaleString("id-ID")}`;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      {comparison.status === "increase" && (
        <>
          <ArrowUp size={16} className="text-red-500" />
          <span className="text-red-500">
            Naik {formatMoney(comparison.amount)} ({comparison.percentage.toFixed(1)}%) dibanding bulan lalu
          </span>
        </>
      )}
      {comparison.status === "decrease" && (
        <>
          <ArrowDown size={16} className="text-green-500" />
          <span className="text-green-500">
            Turun {formatMoney(comparison.amount)} ({comparison.percentage.toFixed(1)}%) dibanding bulan lalu
          </span>
        </>
      )}
      {comparison.status === "same" && (
        <span>Tidak ada perubahan dibanding bulan lalu</span>
      )}
    </div>
  );
}
