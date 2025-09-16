'use client';

import { useState, useEffect } from 'react';
import type { GoalSaving } from '@/types/goal_savings';
import { Pencil, Trash2, Check, X, Archive, PlusCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import ConfirmModal from "./ConfirmModal";
import GoalForm from "./GoalForm";

interface GoalListProps {
  goals: GoalSaving[];
  onDeleted: (id: number) => void;
  onUpdated: (goal_savings: GoalSaving) => void;
  onAdded: () => void; // untuk refresh setelah tambah
}

interface EditGoal {
  id: number;
  goal_name: string;
  target_amount: string;
  saved_amount: string;
  deadline: string;
  notes: string;
}

const idToNumber = (id: unknown): number => {
  if (id === null || id === undefined) return NaN;
  if (typeof id === 'number') return id;
  if (typeof id === 'string') {
    const n = parseInt(id, 10);
    return Number.isNaN(n) ? NaN : n;
  }
  return NaN;
};

export default function GoalList({ goals, onDeleted, onUpdated, onAdded }: GoalListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<EditGoal | null>(null);
  const [loading, setLoading] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [visibleCount, setVisibleCount] = useState(3);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const handleEdit = (goal: GoalSaving) => {
    const idNum = idToNumber((goal as any).id);
    if (Number.isNaN(idNum)) return;

    setEditingId(idNum);
    setEditData({
      id: idNum,
      goal_name: goal.goal_name ?? "",
      target_amount: goal.target_amount != null ? String(goal.target_amount) : "",
      saved_amount: goal.saved_amount != null ? String(goal.saved_amount) : "",
      deadline: goal.deadline ?? "",
      notes: goal.notes ?? "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleSave = async () => {
    if (!editData) return;
    try {
      setLoading(true);
      const id = editData.id;

      const payload: Partial<GoalSaving> = {
        goal_name: editData.goal_name,
        target_amount: editData.target_amount === "" ? null : Number(editData.target_amount),
        saved_amount: editData.saved_amount === "" ? 0 : Number(editData.saved_amount),
        deadline: editData.deadline === "" ? null : editData.deadline,
        notes: editData.notes === "" ? null : editData.notes,
      };

      const { data, error } = await supabase
        .from('goal_savings')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating goal:', error);
        alert('Gagal update data!');
        return;
      }

      if (data) {
        onUpdated(data as GoalSaving);
      }

      setEditingId(null);
      setEditData(null);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId != null) {
      onDeleted(selectedId);
      setSelectedId(null);
      setShowConfirm(false);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('goal_savings')
        .update({ is_archived: true })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error archiving goal:', error);
        alert('Gagal arsipkan goal!');
        return;
      }

      if (data) {
        onUpdated(data as GoalSaving);
      }
    } finally {
      setLoading(false);
    }
  };

  // filter goals sesuai toggle
  const filteredGoals = goals
    .filter((goal) => (showArchived ? goal.is_archived : !goal.is_archived))
    .filter((goal) =>
      (goal.goal_name ?? '').toLowerCase().includes(search.toLowerCase())
    );

  useEffect(() => {
    setVisibleCount(3);
  }, [search, showArchived]);

  const visibleGoals = filteredGoals.slice(0, visibleCount);

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold">
          {showArchived ? "Goals Arsip" : "Daftar Goals"}
        </h2>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="text-sm text-blue-500 hover:underline"
        >
          {showArchived ? "← Kembali ke Goals Aktif" : "Lihat Goals Arsip"}
        </button>
      </div>

      {/* Collapsible tambah goal */}
      {!showArchived && (
        <details className="mb-3">
          <summary className="cursor-pointer px-3 py-2 bg-green-100 rounded-lg text-sm font-medium hover:bg-green-200 flex items-center gap-2">
            <PlusCircle size={16} /> Tambah Goal Baru
          </summary>
          <div className="mt-3">
            <GoalForm onAdded={onAdded} />
          </div>
        </details>
      )}

      {/* Collapsible search */}
      <details className="mb-3">
        <summary className="cursor-pointer px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">
          🔍 Cari / Filter Goals
        </summary>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Cari goal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1.5 text-sm border rounded-lg flex-1 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={() => setSearch("")}
            className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </details>

      {filteredGoals.length === 0 ? (
        <p className="text-gray-500">Belum ada goals.</p>
      ) : (
        <ul className="divide-y">
          {visibleGoals.map((goal) => {
            const idNum = idToNumber((goal as any).id);
            const target = Number(goal.target_amount ?? 0);
            const saved = Number(goal.saved_amount ?? 0);
            const finished = target > 0 && saved >= target;

            return (
              <li key={String(goal.id)} className="py-2 flex items-center justify-between">
                {editingId === idNum && editData ? (
                  <div className="w-full space-y-2">
                    <p className="font-semibold">Edit Goal</p>
                    <input
                      type="text"
                      value={editData.goal_name}
                      onChange={(e) =>
                        setEditData({ ...editData, goal_name: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    <input
                      type="number"
                      value={editData.target_amount}
                      onChange={(e) =>
                        setEditData({ ...editData, target_amount: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    <input
                      type="number"
                      value={editData.saved_amount}
                      onChange={(e) =>
                        setEditData({ ...editData, saved_amount: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    <input
                      type="date"
                      value={editData.deadline}
                      onChange={(e) =>
                        setEditData({ ...editData, deadline: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                    <textarea
                      value={editData.notes}
                      onChange={(e) =>
                        setEditData({ ...editData, notes: e.target.value })
                      }
                      className="w-full border rounded px-2 py-1"
                      placeholder="Catatan (opsional)"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleSave}
                        className={`text-green-600 hover:text-green-700 ${loading ? "opacity-50" : ""
                          }`}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : <Check size={18} />}
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
                    <div className="capitalize">
                      <p className="font-semibold flex items-center gap-2">
                        {goal.goal_name}
                        {finished && !showArchived && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            🎉 Hore, tercapai!
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        Target: Rp {target.toLocaleString("id-ID")} •
                        Saved: Rp {saved.toLocaleString("id-ID")}
                        {goal.notes && ` • ${goal.notes}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!showArchived && (
                        <>
                          <button
                            onClick={() => handleEdit(goal)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => confirmDelete(idNum)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                          {finished && !goal.is_archived && (
                            <button
                              onClick={() => handleArchive(idNum)}
                              className="text-yellow-500 hover:text-yellow-600"
                              title="Arsipkan goal ini"
                            >
                              <Archive size={18} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {visibleCount < filteredGoals.length && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="bg-white hover:text-green-600 text-sm text-green-500"
          >
            Lihat lainnya...
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirm}
        title="Hapus Goal"
        message="Apakah Anda yakin ingin menghapus goal ini?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
}