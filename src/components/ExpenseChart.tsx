'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExpenseChartProps {
  userId?: string | null;
  month: string;
  expenses?: { category: string; amount: number }[];
}

const categoryColors: Record<string, string> = {
  Tagihan: '#c2410c',
  Makanan: '#b91c1c',
  Transportasi: '#15803d',
  Hiburan: '#a16207',
  Lainnya: '#334155',
};

export default function ExpenseChart({ userId, month, expenses }: ExpenseChartProps) {
  const supabase = createClientComponentClient();
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateCategoryData = (list: { category: string; amount: number }[]) => {
      if (!list || list.length === 0) {
        setCategoryData([{ name: 'Belum ada data', value: 1 }]);
        return;
      }
      const grouped: Record<string, number> = {};
      list.forEach((item) => {
        grouped[item.category] = (grouped[item.category] || 0) + Number(item.amount);
      });
      setCategoryData(Object.entries(grouped).map(([name, value]) => ({ name, value })));
    };

    const fetchExpenses = async () => {
      try {
        setLoading(true);
        if (expenses) {
          generateCategoryData(expenses);
        } else if (userId) {
          const startDate = `${month}-01`;
          const endDate = `${month}-31`;
          const { data: fetchedExpenses, error } = await supabase
            .from('expenses')
            .select('category, amount')
            .eq('user_id', userId)
            .gte('expense_date', startDate)
            .lte('expense_date', endDate);
          if (error) throw error;

          const list = fetchedExpenses.map((e: any) => ({
            category: e.category,
            amount: Number(e.amount),
          }));
          generateCategoryData(list);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId, month, expenses, supabase]);

  if (loading) return <p className="text-blue-500">Loading data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Hitung total untuk persen
  const total = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-4">Pengeluaran per Kategori</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}  // lingkaran luar (ubah ini untuk besar kecil chart)
            label={({ name, value }) =>
              name
                ? `${value && total ? Math.round((value / total) * 100) : 0}%`
                : ''
            }
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || '#CBD5E1'} />
            ))}
          </Pie>

          <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
