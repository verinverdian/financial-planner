'use client';
import { useState, useMemo } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import type { Expense } from '@/types/expense';

const COLORS = {
    Makanan: '#60a5fa',       // biru pastel
    Transportasi: '#34d399',  // hijau pastel
    Hiburan: '#fcd34d',       // kuning pastel
    Tagihan: '#fb923c',       // oranye pastel
    Lainnya: '#f87171',       // merah pastel
};

export default function ExpenseList({
    expenses,
    onEdit,
    onDelete,
    month,
    filter,
}: {
    expenses: Expense[];
    onEdit: (updatedExpense: Expense) => void;
    onDelete: (id: string) => void;
    month: string;
    filter: string | null;
}) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editNote, setEditNote] = useState('');

    const formatNumber = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        return numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumber(e.target.value);
        setEditAmount(formatted);
    };

    const startEdit = (expense: Expense) => {
        setEditingId(expense.id);
        setEditName(expense.name);
        setEditAmount(expense.amount.toLocaleString('id-ID'));
        setEditCategory(expense.category);
        setEditDate(expense.date);
        setEditNote(expense.note || '');
    };

    const saveEdit = () => {
        if (!editName || !editAmount || !editDate) return;
        const numericAmount = parseFloat(editAmount.replace(/\./g, ''));
        onEdit({
            id: editingId!,
            name: editName,
            amount: numericAmount,
            category: editCategory,
            date: editDate,
            month, // tetap ikut month filter supaya tidak hilang
            note: editNote || undefined,
        });
        setEditingId(null);
    };

    const displayedExpenses = useMemo(() => {
        return expenses.filter(
            exp =>
                exp.month === month &&
                (filter ? exp.category === filter : true)
        );
    }, [expenses, filter, month]);

    if (displayedExpenses.length === 0) {
        return (
            <div className="bg-white">
                <h2 className="text-lg font-bold mb-2">Daftar Pengeluaran</h2>
                <p className="text-gray-500 text-sm">Belum ada pengeluaran untuk bulan ini.</p>
            </div>
        );
    }

    const formatDateToDayMonthYear = (dateStr: string) => {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');        // DD
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // MM
        const year = date.getFullYear();                                // YYYY
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="bg-white">
            <h2 className="text-lg font-bold mb-2">Daftar Pengeluaran</h2>
            <ul className="divide-y">
                {displayedExpenses.map((expense) => (
                    <li key={expense.id} className="py-2 flex items-center justify-between">
                        {editingId === expense.id ? (
                            <div className="flex flex-col gap-2 w-full">
                                <p className="font-semibold">Edit Data</p>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="border rounded px-2 py-1"
                                />
                                <input
                                    type="text"
                                    value={editAmount}
                                    onChange={handleAmountChange}
                                    className="border rounded px-2 py-1"
                                />
                                <select
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
                                    className="border rounded px-2 py-1"
                                >
                                    <option>Makanan</option>
                                    <option>Transportasi</option>
                                    <option>Hiburan</option>
                                    <option>Tagihan</option>
                                    <option>Lainnya</option>
                                </select>

                                <input
                                    type="date"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    className="border rounded px-2 py-1"
                                />
                                <textarea
                                    value={editNote}
                                    onChange={(e) => setEditNote(e.target.value)}
                                    className="border rounded px-2 py-1"
                                    placeholder="Catatan (opsional)"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={saveEdit}
                                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1"
                                    >
                                        <Check size={16} /> Simpan
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded flex items-center gap-1"
                                    >
                                        <X size={16} /> Batal
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <p className="font-semibold">{expense.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Tgl. {formatDateToDayMonthYear(expense.date)}
                                        {expense.note &&
                                            ` • Note: ${expense.note.length > 30
                                                ? expense.note.substring(0, 30) + '...'
                                                : expense.note
                                            }`} {" • "}
                                        <span
                                            className="p-1 leading-normal rounded border-2"
                                            style={{
                                                backgroundColor: `${COLORS[expense.category]}20`, // warna pastel transparan
                                                borderColor: COLORS[expense.category],
                                            }}
                                        >
                                            {expense.category}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="font-semibold text-red-500">
                                        Rp {expense.amount.toLocaleString('id-ID')}
                                    </div>
                                    <button
                                        onClick={() => startEdit(expense)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(expense.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
