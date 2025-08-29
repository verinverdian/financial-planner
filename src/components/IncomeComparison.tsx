import { useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface Income {
  amount: number;
  month_year: string; // format: YYYY-MM
}

interface IncomeComparisonProps {
  incomes: Income[];
  selectedMonth: string; // format: YYYY-MM
}

export default function IncomeComparison({
  incomes,
  selectedMonth,
}: IncomeComparisonProps) {
  const comparison = useMemo(() => {
    if (!selectedMonth) return null;

    const [year, month] = selectedMonth.split("-").map(Number);

    // data bulan ini
    const currentMonthIncomes = incomes.filter(
      (income) => income.month_year === selectedMonth
    );

    // bulan sebelumnya
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}`;

    const prevMonthIncomes = incomes.filter(
      (income) => income.month_year === prevMonthStr
    );

    const currentTotal = currentMonthIncomes.reduce(
      (sum, inc) => sum + Number(inc.amount),
      0
    );
    const prevTotal = prevMonthIncomes.reduce(
      (sum, inc) => sum + Number(inc.amount),
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
      return {
        status: "decrease",
        amount: Math.abs(diff),
        percentage: Math.abs(percentage),
      };
    } else {
      return { status: "same", amount: 0, percentage: 0 };
    }
  }, [incomes, selectedMonth]);

  if (!comparison) return null;

  const formatMoney = (amount: number) =>
    `Rp ${amount.toLocaleString("id-ID")}`;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      {comparison.status === "increase" && (
        <>
          <ArrowUp size={16} className="text-green-500" />
          <span className="text-green-500">
            Naik {formatMoney(comparison.amount)} (
            {comparison.percentage.toFixed(1)}%) dibanding bulan lalu
          </span>
        </>
      )}
      {comparison.status === "decrease" && (
        <>
          <ArrowDown size={16} className="text-red-500" />
          <span className="text-red-500">
            Turun {formatMoney(comparison.amount)} (
            {comparison.percentage.toFixed(1)}%) dibanding bulan lalu
          </span>
        </>
      )}
      {comparison.status === "same" && (
        <span>Tidak ada perubahan dibanding bulan lalu</span>
      )}
    </div>
  );
}
