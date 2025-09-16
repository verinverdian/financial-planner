import { useState, useEffect } from "react";

interface Goal {
  id: string;          // bigint dari Supabase dikirim sebagai string
  goal_name: string;
  is_archived?: boolean; // tambahan field untuk menandai goal tercapai
}

type AllocationResult =
  | { type: "saldo"; amount: number | null }
  | { type: "goal"; goalId: string; amount: number | null }
  | { type: "split"; goalId: string; goalAmount: number; saldoAmount: number };

interface AllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AllocationResult) => void;
  goals?: Goal[];
}

export default function AllocationModal({
  isOpen,
  onClose,
  onSubmit,
  goals = [],
}: AllocationModalProps) {
  const [option, setOption] = useState<"saldo" | "goal" | "split">("saldo");
  const [goalId, setGoalId] = useState<string>(goals[0]?.id || "");
  const [splitGoalId, setSplitGoalId] = useState<string>(goals[0]?.id || "");
  const [splitAmount, setSplitAmount] = useState({ goal: "", saldo: "" });

  // Sync goalId dan splitGoalId setiap kali goals berubah
  useEffect(() => {
    if (goals.length > 0) {
      setGoalId(goals[0].id);
      setSplitGoalId(goals[0].id);
    }
  }, [goals]);

  // Helper untuk format angka dengan titik pemisah ribuan
  const formatNumber = (value: string) => {
    const numeric = value.replace(/\D/g, ""); // ambil angka saja
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // kasih titik setiap ribuan
  };

  // Helper untuk parse kembali string "1.000.000" jadi number
  const parseNumber = (value: string) => {
    return Number(value.replace(/\./g, "")) || 0;
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (option === "goal") {
      onSubmit({
        type: "goal",
        goalId,
        amount: Number(splitAmount.goal) || null,
      });
    } else if (option === "saldo") {
      onSubmit({
        type: "saldo",
        amount: Number(splitAmount.saldo) || null,
      });
    } else if (option === "split") {
      onSubmit({
        type: "split",
        goalId: splitGoalId,
        goalAmount: parseNumber(splitAmount.goal),
        saldoAmount: parseNumber(splitAmount.saldo),        
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
            disabled={goals.length === 0}
          />
          <span className={goals.length === 0 ? "text-gray-400" : ""}>
            Masuk ke Goal Saving
          </span>
        </label>
        {option === "goal" && (
          goals.length > 0 ? (
            <select
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              className="w-full p-2 mb-3 capitalize border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {goals
                .filter((g) => !g.is_archived) // hanya tampilkan goal aktif
                .map((g) => (
                  <option key={g.id} value={g.id} className="capitalize">
                    {g.goal_name}
                  </option>
                ))}

            </select>
          ) : (
            <p className="text-sm text-gray-500 mb-3">
              Belum ada goal yang tersedia.
            </p>
          )
        )}

        {/* Split */}
        <label className="flex items-center mb-3 space-x-2">
          <input
            type="radio"
            checked={option === "split"}
            onChange={() => setOption("split")}
            disabled={goals.length === 0}
          />
          <span className={goals.length === 0 ? "text-gray-400" : ""}>
            Split
          </span>
        </label>
        {option === "split" && (
          goals.length > 0 ? (
            <>
              <select
                value={splitGoalId}
                onChange={(e) => setSplitGoalId(e.target.value)}
                className="w-full p-2 mb-3 capitalize border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                {goals.map((g) => (
                  <option
                    key={g.id}
                    value={g.id}
                    disabled={g.is_archived}
                    className="capitalize"
                  >
                    {g.goal_name} {g.is_archived ? "(Tercapai)" : ""}
                  </option>
                ))}
              </select>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ke Goal"
                  value={splitAmount.goal}
                  onChange={(e) =>
                    setSplitAmount({
                      ...splitAmount,
                      goal: formatNumber(e.target.value),
                    })
                  }                  
                  className="w-1/2 border rounded-lg p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ke Saldo"
                  value={splitAmount.saldo}
                  onChange={(e) =>
                    setSplitAmount({
                      ...splitAmount,
                      saldo: formatNumber(e.target.value),
                    })
                  }                  
                  className="w-1/2 border rounded-lg p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 mb-3">
              Belum ada goal untuk split.
            </p>
          )
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