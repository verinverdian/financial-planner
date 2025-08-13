'use client';
import { useState } from 'react';
import type { Income } from '@/types/income';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import ConfirmModal from "./ConfirmModal"; // path disesuaikan

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

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // --- State untuk Load More ---
  const [visibleCount, setVisibleCount] = useState(3);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
    }
    setShowConfirm(false);
    setDeleteId(null);
  };

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

  const saveEditLogic = () => {
    if (!editSource || !editAmount || !editMonth) {
      alert('Harap isi semua data yang wajib diisi.')
      return;
    }
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

  const saveEdit = () => {
    setShowSaveConfirm(true);
  };

  if (incomes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800">
        <h2 className="text-lg font-bold mb-2">Daftar Pemasukan</h2>
        <p className="text-gray-500 text-sm">Belum ada pemasukan untuk bulan ini.</p>
      </div>
    );
  }

  const formatMonthYear = (monthStr: string) => {
    const date = new Date(monthStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month.toString().padStart(2, '0')}-${year}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <h2 className="text-lg font-bold mb-2">Daftar Pemasukan</h2>
      <ul className="divide-y">
        {incomes.slice(0, visibleCount).map((income) => (
          <li key={income.id} className="py-2 flex items-center justify-between">
            {editingId === income.id ? (
              <div className="flex flex-col gap-2 w-full">
                <p className="font-semibold">Edit Data</p>
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
                    {income.note && ` • Note: ${income.note.length > 30
                      ? income.note.substring(0, 30) + '...'
                      : income.note}`}
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
                    onClick={() => confirmDelete(income.id)}
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

      {/* Tombol Load More */}
      {visibleCount < incomes.length && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setVisibleCount(prev => prev + 3)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Load More
          </button>
        </div>
      )}

      {/* Modal Konfirmasi */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Hapus Data Pemasukan"
        message="Yakin ingin menghapus pemasukan ini?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
      />
      <ConfirmModal
        isOpen={showSaveConfirm}
        title="Konfirmasi Simpan"
        message={`Yakin ingin menyimpan perubahan untuk "${editSource}"?`}
        onConfirm={() => {
          saveEditLogic();
          setShowSaveConfirm(false);
        }}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </div>
  );
}
