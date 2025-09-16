import { useState, useEffect } from "react";
import type { GoalSaving } from "@/types/goal_savings";

type AllocationResult =
  | { type: "saldo" }
  | { type: "goal"; goalId: string }
  | { type: "split"; goalId: string; goalAmount: number; saldoAmount: number };

interface AllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AllocationResult) => void;
  goals?: GoalSaving[];
  incomeAmount: number; // ✅ total income dari IncomeForm
}

export default function AllocationModal({
  isOpen,
  onClose,
  onSubmit,
  goals = [],
  incomeAmount,
}: AllocationModalProps) {
  const [option, setOption] = useState<"saldo" | "goal" | "split">("saldo");
  const [goalId, setGoalId] = useState<string>(goals[0]?.id ?? "");
  const [splitGoalId, setSplitGoalId] = useState<string>(goals[0]?.id ?? "");
  const [splitAmount, setSplitAmount] = useState({ goal: "", saldo: "" });
  const [error, setError] = useState(""); // ✅ simpan error di state

  const formatNumber = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    if (!numeric) return "";
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (value: string) => {
    const cleaned = value.replace(/\./g, "");
    const n = Number(cleaned);
    return Number.isNaN(n) ? 0 : n;
  };

  useEffect(() => {
    if (!goals || goals.length === 0) {
      setGoalId("");
      setSplitGoalId("");
      return;
    }
    const firstActive = goals.find(
      (g) =>
        !g.is_archived &&
        Number(g.saved_amount ?? 0) < Number(g.target_amount ?? 0)
    );
    const pickId = firstActive?.id ?? goals[0]?.id ?? "";
    if (pickId) {
      setGoalId(pickId);
      setSplitGoalId(pickId);
    }
  }, [goals]);

  if (!isOpen) return null;

  const activeGoals = goals.filter(
    (g) =>
      !g.is_archived &&
      Number(g.saved_amount ?? 0) < Number(g.target_amount ?? 0)
  );

  const handleChange = (key: "goal" | "saldo", value: string) => {
    const raw = value.replace(/\D/g, "");
    setSplitAmount((prev) => ({ ...prev, [key]: formatNumber(raw) }));
    setError(""); // ✅ reset error
  };

  const handleSubmit = () => {
    if (option === "goal") {
      onSubmit({ type: "goal", goalId });
    } else if (option === "saldo") {
      onSubmit({ type: "saldo" });
    } else if (option === "split") {
      const g = parseNumber(splitAmount.goal);
      const s = parseNumber(splitAmount.saldo);
      const total = g + s;

      // ✅ Validasi: jangan lebih besar dari income
      if (total > incomeAmount) {
        setError("Jumlah split melebihi total pemasukan!"); // ✅ tampilkan error di UI
        return;
      }

      onSubmit({
        type: "split",
        goalId: splitGoalId,
        goalAmount: g,
        saldoAmount: s,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Pilih Alokasi</h2>

        {/* Saldo Umum */}
        <label className="flex items-center mb-3 space-x-2">
          <input
            type="radio"
            checked={option === "saldo"}
            onChange={() => setOption("saldo")}
          />
          <span>Masuk ke Saldo Umum</span>
        </label>

        {/* Goal Saving */}
        <label className="flex items-center mb-3 space-x-2">
          <input
            type="radio"
            checked={option === "goal"}
            onChange={() => setOption("goal")}
            disabled={activeGoals.length === 0}
          />
          <span className={activeGoals.length === 0 ? "text-gray-400" : ""}>
            Masuk ke Goal Saving
          </span>
        </label>
        {option === "goal" && activeGoals.length > 0 && (
          <select
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            className="w-full p-2 mb-3 capitalize border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {activeGoals.map((g) => (
              <option key={g.id} value={g.id} className="capitalize">
                {g.goal_name}
              </option>
            ))}
          </select>
        )}

        {/* Split */}
        <label className="flex items-center mb-3 space-x-2">
          <input
            type="radio"
            checked={option === "split"}
            onChange={() => setOption("split")}
            disabled={activeGoals.length === 0}
          />
          <span className={activeGoals.length === 0 ? "text-gray-400" : ""}>
            Split
          </span>
        </label>
        {option === "split" && activeGoals.length > 0 && (
          <>
            <select
              value={splitGoalId}
              onChange={(e) => setSplitGoalId(e.target.value)}
              className="w-full p-2 mb-3 capitalize border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {activeGoals.map((g) => (
                <option key={g.id} value={g.id} className="capitalize">
                  {g.goal_name}
                </option>
              ))}
            </select>

            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ke Goal"
                value={splitAmount.goal}
                onChange={(e) => handleChange("goal", e.target.value)}
                className="w-1/2 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ke Saldo"
                value={splitAmount.saldo}
                onChange={(e) => handleChange("saldo", e.target.value)}
                className="w-1/2 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <p className="text-xs text-gray-500">
              Note: Total split tidak boleh lebih dari{" "}
              <b>{incomeAmount.toLocaleString("id-ID")}</b>
            </p>
            {error && (
              <div className="mt-2 flex items-center gap-2 p-2 text-xs text-red-800 bg-red-100 border border-red-300 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-600 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 5.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" />
                </svg>
                <span>{error}</span>
              </div>
            )}


          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-green-600 text-white"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}