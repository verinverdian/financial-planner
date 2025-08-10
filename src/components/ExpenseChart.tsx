'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#60a5fa', // biru pastel (blue-400)
    '#34d399', // hijau pastel (emerald-400)
    '#fcd34d', // kuning pastel (yellow-300)
    '#fb923c', // oranye pastel (orange-400)
    '#f87171'  // merah pastel (red-400)
]

export default function ExpenseChart({
    expenses,
}: {
    expenses: { name: string; amount: number; category: string }[];
}) {
    const groupedData = Object.values(
        expenses.reduce((acc: any, curr) => {
            if (!acc[curr.category]) {
                acc[curr.category] = { name: curr.category, amount: 0 };
            }
            acc[curr.category].amount += curr.amount;
            return acc;
        }, {})
    );

    const totalAmount = groupedData.reduce((sum: number, item: any) => sum + item.amount, 0);

    return (
        <div className="bg-white">
            <h2 className="text-lg font-bold mb-2">Expense Distribution by Category</h2>
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
                            {groupedData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(value: number) => {
                                const percent = ((value / totalAmount) * 100).toFixed(1);
                                return [`Rp ${value.toLocaleString('id-ID')} (${percent}%)`, 'Jumlah'];
                            }}
                            labelFormatter={(label) => `Kategori: ${label}`}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
