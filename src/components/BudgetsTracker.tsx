import { useState } from "react";

interface BudgetProps {
  totalExpense: number;
}

export default function BudgetsTracker({ totalExpense }: BudgetProps) {
  const [target, setTarget] = useState<number>(5000000); // default Rp 5jt
  const [targetInput, setTargetInput] = useState<string>("5.000.000");

  const progress = target > 0 ? (totalExpense / target) * 100 : 0;

  const getProgressColor = () => {
    if (progress >= 100) return "bg-red-500"; // over budget
    if (progress >= 80) return "bg-yellow-500"; // warning
    return "bg-green-500"; // safe
  };

  const getStatusText = () => {
    if (progress >= 100) return { text: "❌ Over Budget!", color: "text-red-600" };
    if (progress >= 80) return { text: "⚠️ Mendekati Limit", color: "text-yellow-600" };
    return { text: "✅ Aman", color: "text-green-600" };
  };

  const status = getStatusText();

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue ? parseInt(numericValue, 10).toLocaleString("id-ID") : "";
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
    setTarget(numericValue);
    setTargetInput(formatNumber(e.target.value));
  };

  const resetTarget = () => {
    setTarget(5000000);
    setTargetInput("5.000.000");
  };

  return (
    <div className="p-2 space-y-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">🎯 Target & Budget</h2>

      {/* Input Target */}
      <div>
        <label className="block text-sm mb-1 font-medium text-gray-600 dark:text-gray-300">
          Set Target (Rp)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={targetInput}
            onChange={handleAmountChange}
            className="flex-1 p-3 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <button
            onClick={resetTarget}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400">
          <span>{progress.toFixed(0)}%</span>
          <span>Limit: Rp {target.toLocaleString("id-ID")}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 ${getProgressColor()} transition-all duration-300`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Status */}
      <p className={`text-sm font-medium ${status.color}`}>{status.text}</p>

      {/* Detail angka */}
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Total Pengeluaran: <strong>Rp {totalExpense.toLocaleString("id-ID")}</strong>
      </div>
    </div>
  );
}
