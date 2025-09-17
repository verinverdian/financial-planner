import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

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

  const getStatus = () => {
    if (progress >= 100)
      return {
        text: "Over Budget",
        color: "text-red-600",
        icon: <XCircle className="w-4 h-4 text-red-600" />,
      };
    if (progress >= 80)
      return {
        text: "Mendekati Limit",
        color: "text-yellow-600",
        icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
      };
    return {
      text: "Aman",
      color: "text-green-600",
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    };
  };

  const status = getStatus();

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
    <div className="p-4 rounded-xl bg-white shadow-sm border space-y-4">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        🎯 Target & Budget
      </h2>

      {/* Input Target */}
      <div className="">
        <label className="block text-sm mb-2 font-medium text-gray-600">
          Set Target
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={targetInput}
            onChange={handleAmountChange}
            className="flex-1 p-2.5 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={resetTarget}
            className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs mb-1 text-gray-500">
          <span>{progress.toFixed(0)}%</span>
          <span>Limit: Rp {target.toLocaleString("id-ID")}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 ${getProgressColor()} transition-all duration-300`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Status */}
      <div className={`flex items-center gap-2 text-sm font-medium ${status.color}`}>
        {status.icon}
        {status.text}
      </div>

      {/* Detail angka */}
      {/* <div className="text-sm text-gray-600">
        Total Pengeluaran:{" "}
        <span className="font-semibold">
          Rp {totalExpense.toLocaleString("id-ID")}
        </span>
      </div> */}
    </div>
  );
}
