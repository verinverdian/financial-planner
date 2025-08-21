'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Warna kategori
const COLORS: Record<string, string> = {
  Makanan: '#60a5fa',       // biru pastel
  Transportasi: '#34d399',  // hijau pastel
  Hiburan: '#fcd34d',       // kuning pastel
  Tagihan: '#fb923c',       // oranye pastel
  Lainnya: '#f87171',       // merah pastel
};

// Tipe data pengeluaran
interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

// Tipe untuk data Pie Chart
interface GroupedData {
  name: string;
  amount: number;
  category: string;
}

// Tipe untuk data Bar Chart
interface DailyData {
  date: string;
  amount: number;
}

export default function ExpenseChart({ expenses }: { expenses: Expense[] }) {
  // ======== PIE CHART DATA ========
  const groupedData: GroupedData[] = Object.values(
    expenses.reduce<Record<string, GroupedData>>((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = {
          name: curr.category,
          amount: 0,
          category: curr.category,
        };
      }
      acc[curr.category].amount += curr.amount;
      return acc;
    }, {})
  );

  const totalAmount = groupedData.reduce((sum, item) => sum + item.amount, 0);

  // ======== LAST 7 DAYS BAR CHART DATA ========
  const now = new Date();
  const last7DaysData: DailyData[] = [...Array(7)].map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i)); // urut dari hari terlama ke terbaru
    const dateStr = d.toISOString().split('T')[0];
    const totalForDay = expenses
      .filter((exp) => exp.date.startsWith(dateStr))
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      date: format(d, 'dd MMM', { locale: id }),
      amount: totalForDay,
    };
  });

  return (
    <div className="bg-white dark:bg-gray-800 min-h-64 p-4 rounded-lg shadow-sm">
      {/* ===== PIE CHART ===== */}
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
                {groupedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.category] || '#ccc'}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name, props: any) => {
                  const percent = ((value / totalAmount) * 100).toFixed(1);
                  const label = props.payload?.name || '';
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

      {/* ===== BAR CHART 7 HARI ===== */}
      <div className="mt-8">
        <h3 className="text-md font-bold mb-2">Tren Pengeluaran 7 Hari Terakhir</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  `Rp ${value.toLocaleString('id-ID')}`
                }
              />
              <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
