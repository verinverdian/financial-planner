'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Expense {
  expense_date: string;
  amount: number;
  category: string;
}

interface Last7DaysExpenseChartProps {
  expenses: Expense[];
  month: string; // format: "YYYY-MM"
}

export default function Last7DaysExpenseChart({ expenses, month }: Last7DaysExpenseChartProps) {
  const [last7DaysData, setLast7DaysData] = useState<
    { date: string; nominal: number; details: { category: string; amount: number }[] }[]
  >([]);

  useEffect(() => {
    if (!expenses || expenses.length === 0 || !month) {
      setLast7DaysData([]);
      return;
    }

    const today = new Date();
    const [year, monthStr] = month.split('-').map(Number);
    const selectedYear = year;
    const selectedMonth = monthStr;

    const isCurrentMonth =
      today.getFullYear() === selectedYear && today.getMonth() + 1 === selectedMonth;

    const lastDay = isCurrentMonth
      ? today
      : new Date(selectedYear, selectedMonth, 0);

    const chartData: { date: string; nominal: number; details: { category: string; amount: number }[] }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(lastDay);
      d.setDate(lastDay.getDate() - i);

      const key = d.toISOString().split('T')[0]; // YYYY-MM-DD

      const dayExpenses = expenses.filter((e) => e.expense_date.startsWith(key));

      const nominal = dayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

      chartData.push({
        date: key.slice(5), // MM-DD
        nominal,
        details: dayExpenses.map((e) => ({ category: e.category, amount: e.amount })),
      });
    }

    setLast7DaysData(chartData);
  }, [expenses, month]);

  if (!last7DaysData || last7DaysData.length === 0)
    return <p className="text-gray-500">Belum ada pengeluaran 7 hari terakhir.</p>;

  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-4">Pengeluaran 7 Hari Terakhir</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={last7DaysData}
          margin={{ top: 20, right: 10, left: 10, bottom: 20 }} // kasih margin lebih
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(v) => `Rp ${v.toLocaleString('id-ID')}`}
            width={100} // kasih lebar lebih biar angka muat
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length > 0) {
                const data = payload[0].payload as {
                  nominal: number;
                  details: { category: string; amount: number }[];
                };
                return (
                  <div className="bg-white p-2 border rounded shadow text-sm">
                    <p className="font-semibold">{label}</p>
                    {data.details.length > 0 ? (
                      data.details.map((d, i) => (
                        <p key={i}>
                          {d.category}: Rp {d.amount.toLocaleString('id-ID')}
                        </p>
                      ))
                    ) : (
                      <p>Tidak ada pengeluaran</p>
                    )}
                    <hr className="my-1" />
                    <p className="font-semibold">
                      Total: Rp {data.nominal.toLocaleString('id-ID')}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="nominal" fill="#60A5FA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
