'use client';
import { useState } from 'react';
import type { Income } from '@/types/income';
import { Pencil, Trash2, Check, X } from 'lucide-react';

export default function IncomeList({
  incomes,
  onEdit,
  onDelete,
}: {
  incomes: Income[];
  onEdit: (updatedIncome: Income) => void;
  onDelete: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSource, setEditSource] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editMonth, setEditMonth] = useState('');
  const [editNote, setEditNote] = useState('');

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setEditAmount(formatted);
  };

  const startEdit = (income: Income) => {
    setEditingId(income.id);
    setEditSource(income.source);
    setEditAmount(income.amount.toLocaleString('id-ID'));
    setEditMonth(income.month);
    setEditNote(income.note || '');
  };

  const saveEdit = () => {
    if (!editSource || !editAmount || !editMonth) return;
    const numericAmount = parseFloat(editAmount.replace(/\./g, ''));
    onEdit({
      id: editingId!,
      source: editSource,
      amount: numericAmount,
      month: editMonth,
      note: editNote || undefined,
    });
    setEditingId(null);
  };

  if (incomes.length === 0) {
    return (
        <div className="bg-white">
            <h2 className="text-lg font-bold mb-2">Daftar Pemasukan</h2>
            <p className="text-gray-500 text-sm">Belum ada pemasukan untuk bulan ini.</p>
        </div>
    );
}

const formatMonthYear = (monthStr: string) => {
  const date = new Date(monthStr);
  const month = date.getMonth() + 1; // getMonth() 0-based, jadi +1
  const year = date.getFullYear();
  return `${month.toString().padStart(2, '0')}-${year}`;
};


  return (
    <div className="bg-white">
      <h2 className="text-lg font-bold mb-2">Daftar Pemasukan</h2>
      <ul className="divide-y">
        {incomes.map((income) => (
          <li key={income.id} className="py-2 flex items-center justify-between">
            {editingId === income.id ? (
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="text"
                  value={editSource}
                  onChange={(e) => setEditSource(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={editAmount}
                  onChange={handleAmountChange}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="month"
                  value={editMonth}
                  onChange={(e) => setEditMonth(e.target.value)}
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
                  <p className="font-semibold">{income.source}</p>
                  <p className="text-sm text-gray-500">
                    Rp {income.amount.toLocaleString('id-ID')} • {formatMonthYear(income.month)}
                    {income.note && ` • ${income.note}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(income)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(income.id)}
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
