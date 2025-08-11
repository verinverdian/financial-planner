'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS: Record<string, string> = {
  Makanan: '#60a5fa',       // biru pastel
  Transportasi: '#34d399',  // hijau pastel
  Hiburan: '#fcd34d',       // kuning pastel
  Tagihan: '#fb923c',       // oranye pastel
  Lainnya: '#f87171',       // merah pastel
};

export default function ExpenseChart({
  expenses,
}: {
  expenses: { name: string; amount: number; category: string }[];
}) {
  // Gabungkan pengeluaran berdasarkan kategori
  const groupedData = Object.values(
    expenses.reduce((acc: any, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = { name: curr.category, amount: 0, category: curr.category };
      }
      acc[curr.category].amount += curr.amount;
      return acc;
    }, {})
  );

  const totalAmount = groupedData.reduce((sum: number, item: any) => sum + item.amount, 0);

  return (
    <div className="bg-white dark:bg-gray-800 min-h-64">
      <h2 className="text-lg font-bold mb-2">Distribusi Pengeluaran per Kategori</h2>

      {totalAmount > 0 ? (
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={groupedData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, amount }) => {
                  const percent = ((amount / totalAmount) * 100).toFixed(1);
                  return `${name} (${percent}%)`;
                }}
              >
                {groupedData.map((entry: any, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.category] || '#ccc'}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props) => {
                  const percent = ((value / totalAmount) * 100).toFixed(1);
                  const label = props.payload?.name || ''; // ambil nama kategori
                  return [`${label} Rp ${value.toLocaleString('id-ID')} (${percent}%)`];
                }}
              />

            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-56">
          <p className="text-gray-500 text-sm">Belum ada data untuk bulan ini.</p>
        </div>
      )}
    </div>
  );
}
