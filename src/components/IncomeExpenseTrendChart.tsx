'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Income } from '@/types/income';
import type { Expense } from '@/types/expense';

interface Props {
  incomes: Income[];
  expenses: Expense[];
}

export default function IncomeExpenseTrendChart({ incomes, expenses }: Props) {
  (val: number) => val.toLocaleString("id-ID")

  // Group data per bulan
  const dataMap: Record<string, { month: string; income: number; expense: number }> = {};

  incomes.forEach((i) => {
    if (!i.month_year) return;
    if (!dataMap[i.month_year]) {
      dataMap[i.month_year] = { month: i.month_year, income: 0, expense: 0 };
    }
    dataMap[i.month_year].income += Number(i.amount);
  });

  expenses.forEach((e) => {
    const ym = e.expense_date.slice(0, 7);
    if (!dataMap[ym]) {
      dataMap[ym] = { month: ym, income: 0, expense: 0 };
    }
    dataMap[ym].expense += Number(e.amount);
  });

  const chartData = Object.values(dataMap).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="">
      {chartData.length > 0 ? (
        <div style={{ width: "100%", height: 400 }}>
          <h2 className="text-lg font-semibold mb-4">Tren Pemasukan vs Pengeluaran</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 40, left: 40, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(val) => val.toLocaleString("id-ID")} />
              <Tooltip formatter={(val: number) => val.toLocaleString("id-ID")} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10B981" name="Pemasukan" dot />
              <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Pengeluaran" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-gray-500">
          Belum ada tren pemasukan dan pengeluaran.
        </div>
      )}
    </div>
  );
}
