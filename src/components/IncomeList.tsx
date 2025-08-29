'use client';

import { useEffect, useState } from 'react';
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

  // ✅ State untuk kontrol Load More
  const [visibleCount, setVisibleCount] = useState(3);

  // ✅ State untuk Filter
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState<string>("");


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

  // ✅ Terapkan filter pada data incomes
  const filteredIncomes = incomes.filter((income) => {
    const matchSearch = income.source.toLowerCase().includes(search.toLowerCase());
    const matchMonth = month ? income.month_year.startsWith(month) : true;
    return matchSearch && matchMonth;
  });

  if (filteredIncomes.length === 0) {
    return (
      <div>
        {/* Filter tetap ditampilkan walau kosong */}
        <h2 className="text-lg font-bold mb-2">Daftar Pemasukan</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari sumber..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-xl w-full"
          />
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-3 py-2 rounded-xl"
          />
          <button
            onClick={() => {
              setSearch("");
              setMonth("");
            }}
            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
        <p className="text-gray-500 mt-4">Belum ada pemasukan untuk bulan ini.</p>
      </div>
    );
  }

  // ✅ Potong data sesuai visibleCount
  const visibleIncomes = filteredIncomes.slice(0, visibleCount);

  return (
    <div className="bg-white dark:bg-gray-800">
      <h2 className="text-lg font-bold mb-2">Daftar Pemasukan</h2>

      {/* ✅ Filter Input + Reset */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari sumber..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-xl w-full"
        />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-3 py-2 rounded-xl"
        />
        <button
          onClick={() => {
            setSearch("");
            setMonth("");
          }}
          className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
        >
          Reset
        </button>
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
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="number"
                  value={editData.amount}
                  onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })}
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="month"
                  value={editData.month_year}
                  onChange={(e) => setEditData({ ...editData, month_year: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={editData.notes ?? ''}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  className="w-full border rounded px-2 py-1"
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
                      }`
                    }
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

      {/* ✅ Tombol Load More */}
      {visibleCount < filteredIncomes.length && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="bg-white hover:text-green-600 text-sm text-green-500"
          >
            Lihat lainnya...
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
