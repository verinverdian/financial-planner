'use client';

import { useState } from 'react';
import type { Expense } from '@/types/expense';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import ConfirmModal from "./ConfirmModal";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleted: (id: number) => void;
  onUpdated: (expense: Expense) => void;
}

const categoryColors: Record<string, string> = {
  Tagihan: 'bg-orange-100 text-orange-700',
  Transportasi: 'bg-green-100 text-green-700',
  Hiburan: 'bg-yellow-100 text-yellow-700',
  Makanan: 'bg-red-100 text-red-700',
};

export default function ExpenseList({ expenses, onDeleted, onUpdated }: ExpenseListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ✅ Filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditData({ ...expense });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleSave = async () => {
    if (!editData) return;
    try {
      setLoading(true);
      const { id, ...fields } = editData;

      const { data, error } = await supabase
        .from('expenses')
        .update(fields)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating expense:', error);
        alert('Gagal update data!');
        return;
      }

      if (data && data.length > 0) {
        onUpdated(data[0]);
      }

      setEditingId(null);
      setEditData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const confirmDelete = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      onDeleted(selectedId);
      setSelectedId(null);
      setShowConfirm(false);
    }
  };

  // ✅ Filter pengeluaran
  const filteredExpenses = expenses.filter((exp) => {
    const matchesCategory = category ? exp.category === category : true;
    const matchesSearch = exp.description?.toLowerCase().includes(search.toLowerCase()) ?? true;

    const expDate = new Date(exp.expense_date);
    const matchesStart = startDate ? expDate >= new Date(startDate) : true;
    const matchesEnd = endDate ? expDate <= new Date(endDate) : true;

    return matchesCategory && matchesSearch && matchesStart && matchesEnd;
  });

  // ✅ Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  if (expenses.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-bold mb-3">Daftar Pengeluaran</h2>
        <p className="text-gray-500 mt-4">Belum ada pengeluaran untuk bulan ini.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white">
      <h2 className="text-lg font-bold mb-3">Daftar Pengeluaran</h2>

      {/* ✅ Filter UI */}
      <div className="flex flex-wrap items-center gap-2 mb-3 dark:text-gray-800">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari..."
          className="px-2 py-1.5 text-sm border rounded-lg flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <select
          value={category ?? ""}
          onChange={(e) => setCategory(e.target.value || null)}
          className="px-2 py-1.5 text-sm border rounded-lg w-[140px] focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Semua Kategori</option>
          <option value="Makanan">Makanan</option>
          <option value="Transportasi">Transportasi</option>
          <option value="Hiburan">Hiburan</option>
          <option value="Tagihan">Tagihan</option>
          <option value="Lainnya">Lainnya</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-2 py-1.5 text-sm border rounded-lg w-[140px] focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-2 py-1.5 text-sm border rounded-lg w-[140px] focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <ul className="divide-y divide-gray-200">
        {visibleExpenses.map((expense) => {
          const badgeClass = categoryColors[expense.category] || 'bg-gray-100 text-gray-700';
          return (
            <li key={expense.id} className="py-3 flex items-center justify-between">
              {editingId === expense.id && editData ? (
                <div className="w-full space-y-2">
                  {/* Form Edit */}
                  <p className="font-semibold">Edit Data</p>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full border rounded px-2 py-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option>Makanan</option>
                    <option>Transportasi</option>
                    <option>Hiburan</option>
                    <option>Tagihan</option>
                    <option>Lainnya</option>
                  </select>
                  <input
                    type="text"
                    value={editData.description ?? ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full border rounded px-2 py-1 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Deskripsi"
                  />
                <input
                  type="text"
                  value={
                    editData.amount
                      ? editData.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                      : ""
                  }
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\./g, ""); // hapus titik
                    if (/^\d*$/.test(raw)) {
                      setEditData({ ...editData, amount: raw === "" ? 0 : Number(raw) });
                    }
                  }}
                  className="w-full border rounded px-2 py-1 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                  <input
                    type="date"
                    value={editData.expense_date}
                    onChange={(e) => setEditData({ ...editData, expense_date: e.target.value })}
                    className="w-full border rounded px-2 py-1 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <input
                    type="text"
                    value={editData.notes ?? ''}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    className="w-full border rounded px-2 py-1 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Catatan (opsional)"
                  />

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleSave}
                      className={`text-green-600 hover:text-green-700 ${loading ? 'opacity-50' : ''}`}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : <Check size={18} />}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-500 hover:text-gray-600"
                      disabled={loading}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-medium capitalize">{expense.description}</p>
                    <div className="flex items-center text-sm text-gray-500 gap-2 mt-1">
                      <span>Tgl. {formatDate(expense.expense_date)}</span>
                      <span>
                        {expense.notes &&
                          ` •  Note: ${
                            expense.notes.length > 30
                              ? expense.notes.substring(0, 30).trim() + '...'
                              : expense.notes
                          } •`}
                      </span>
                      {expense.category && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-medium ${badgeClass}`}
                        >
                          {expense.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-red-500 font-semibold">
                      Rp {Number(expense.amount).toLocaleString('id-ID')}
                    </span>
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => confirmDelete(expense.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 space-x-2 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-2 py-1 border rounded-lg ${
                currentPage === page ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Hapus Pengeluaran"
        message="Apakah Anda yakin ingin menghapus data ini?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
}
