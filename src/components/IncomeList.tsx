'use client';

import { useState } from 'react';
import type { Income } from '@/types/income';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import ConfirmModal from "./ConfirmModal";

interface IncomeListProps {
  incomes: Income[];
  onDeleted: (id: number) => void;
  onUpdated: (income: Income) => void;
}

export default function IncomeList({ incomes, onDeleted, onUpdated }: IncomeListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Income | null>(null);
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // ✅ State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ State untuk Filter (hanya search)
  const [search, setSearch] = useState("");

  const handleEdit = (income: Income) => {
    setEditingId(income.id);
    setEditData({ ...income });
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
        .from('incomes')
        .update(fields)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating income:', error);
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

  const formatMonthYear = (monthStr: string) => {
    const date = new Date(monthStr);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month.toString().padStart(2, '0')}-${year}`;
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

  // ✅ Terapkan filter search saja
  const filteredIncomes = incomes.filter((income) =>
    income.source.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Pagination: hitung total halaman
  const totalPages = Math.ceil(filteredIncomes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleIncomes = filteredIncomes.slice(startIndex, startIndex + itemsPerPage);

  if (filteredIncomes.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-bold mb-2">Daftar Pemasukan</h2>
        <input
          type="text"
          placeholder="Cari sumber..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-xl w-full mb-3"
        />
        <p className="text-gray-500 mt-4">Belum ada pemasukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white">
      <h2 className="text-lg font-bold mb-2">Daftar Pemasukan</h2>

      {/* ✅ Filter Input (search only) */}
      <div className="dark:text-gray-800">
        <input
          type="text"
          placeholder="Cari sumber..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="dark:text-gray-800 px-2 py-1.5 text-sm border rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <ul className="divide-y">
        {visibleIncomes.map((income) => (
          <li
            key={income.id}
            className="py-2 flex items-center justify-between"
          >
            {editingId === income.id && editData ? (
              <div className="w-full space-y-2">
                <p className="font-semibold">Edit Data</p>
                <input
                  type="text"
                  value={editData.source}
                  onChange={(e) => setEditData({ ...editData, source: e.target.value })}
                  className="w-full border rounded px-2 py-1 border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
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
                  type="month"
                  value={editData.month_year}
                  onChange={(e) => setEditData({ ...editData, month_year: e.target.value })}
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
                  <p className="font-semibold capitalize">{income.source}</p>
                  <p className="text-sm text-gray-500">
                    Rp {Number(income.amount).toLocaleString('id-ID')} • {formatMonthYear(income.month_year)}
                    {income.notes && ` • Note: ${income.notes.length > 30
                      ? income.notes.substring(0, 30).trim() + '...'
                      : income.notes
                      }`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(income)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => confirmDelete(income.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
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
              className={`px-2 py-1 border rounded-lg ${currentPage === page ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
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
        title="Hapus Pemasukan"
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