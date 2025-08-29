import { useState } from "react";
import { ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";

interface SummaryCardProps {
    totalIncome: number;
    lastMonthIncome: number;
    totalExpense: number;
    lastMonthExpense: number;
    selectedMonth: string; // format "YYYY-MM"
}

export default function SummaryCard({
    totalIncome,
    lastMonthIncome,
    totalExpense,
    lastMonthExpense,
    selectedMonth,
}: SummaryCardProps) {
    const [showAmount, setShowAmount] = useState(true);
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const formatMonthYear = (selectedMonth: string) => {
        const [year, month] = selectedMonth.split("-").map(Number);
        return `${monthNames[month - 1]} ${year}`;
    };

    const formatMoney = (amount: number) =>
        `Rp ${amount.toLocaleString("id-ID")}`;

    // Hitung sisa saldo
    const remaining = totalIncome - totalExpense;

    // Hitung progress bar (pengeluaran vs pemasukan)
    const expensePercentage =
        totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

    // Hitung perubahan pemasukan
    const incomeDiff = totalIncome - lastMonthIncome;
    const incomeStatus =
        incomeDiff > 0 ? "increase" : incomeDiff < 0 ? "decrease" : "same";
    const incomePercentage =
        lastMonthIncome === 0
            ? 100
            : (Math.abs(incomeDiff) / lastMonthIncome) * 100;

    // Hitung perubahan pengeluaran
    const expenseDiff = totalExpense - lastMonthExpense;
    const expenseStatus =
        expenseDiff > 0 ? "increase" : expenseDiff < 0 ? "decrease" : "same";
    const expenseChangePercentage =
        lastMonthExpense === 0
            ? 100
            : (Math.abs(expenseDiff) / lastMonthExpense) * 100;

    // Tentukan warna progress bar berdasarkan persentase
    const getProgressColor = (percentage: number) => {
        if (percentage <= 70) return "bg-green-500";
        if (percentage <= 100) return "bg-yellow-500";
        return "bg-red-500";
    };

    const statusLabel = remaining >= 0 ? "Sisa Uang" : "Kekurangan";
    const displayAmount = Math.abs(remaining);

    return (
        <div className="bg-white">
            <div className="flex justify-between">
                <h2 className="text-lg font-bold mb-3">
                    Ringkasan ({formatMonthYear(selectedMonth)})
                </h2>
                <div className="flex items-center gap-2">
                    <p className="italic text-gray-600 text-xs">Tampilkan/sembunyikan saldo</p>
                    <button onClick={() => setShowAmount(!showAmount)}>
                        {showAmount ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>
            </div>
            <hr className="mb-4" />

            {/* Income Row */}
            <div className="mb-4">
                <div className="flex justify-between">
                    <h3 className="font-bold text-green-600">Total Pemasukan</h3>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">
                            {showAmount ? formatMoney(totalIncome) : "•••••••"}
                        </span>
                    </div>
                </div>
                <p className="text-sm flex items-center gap-1 mt-1">
                    {incomeStatus === "increase" && (
                        <span className="text-green-600 flex items-center gap-1">
                            <ArrowUp size={14} /> Naik {formatMoney(Math.abs(incomeDiff))} ({incomePercentage.toFixed(1)}%) dibanding bulan lalu
                        </span>
                    )}
                    {incomeStatus === "decrease" && (
                        <span className="text-red-600 flex items-center gap-1">
                            <ArrowDown size={14} /> Turun {formatMoney(Math.abs(incomeDiff))} ({incomePercentage.toFixed(1)}%) dibanding bulan lalu
                        </span>
                    )}
                    {incomeStatus === "same" && (
                        <span className="text-gray-500">Tidak ada perubahan dibanding bulan lalu</span>
                    )}
                </p>
            </div>

            {/* Expense Row */}
            <div className="mb-4">
                <div className="flex justify-between">
                    <h3 className="font-bold text-red-600">Total Pengeluaran</h3>
                    <span className="font-bold text-red-600">
                        {showAmount ? formatMoney(totalExpense) : "•••••••"}
                    </span>
                </div>
                <p className="text-sm flex items-center gap-1 mt-1">
                    {expenseStatus === "increase" && (
                        <span className="text-red-600 flex items-center gap-1">
                            <ArrowUp size={14} /> Naik {formatMoney(Math.abs(expenseDiff))} ({expenseChangePercentage.toFixed(1)}%) dibanding bulan lalu
                        </span>
                    )}
                    {expenseStatus === "decrease" && (
                        <span className="text-green-600 flex items-center gap-1">
                            <ArrowDown size={14} /> Turun {formatMoney(Math.abs(expenseDiff))} ({expenseChangePercentage.toFixed(1)}%) dibanding bulan lalu
                        </span>
                    )}
                    {expenseStatus === "same" && (
                        <span className="text-gray-500">Tidak ada perubahan dibanding bulan lalu</span>
                    )}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div
                        className={`${getProgressColor(expensePercentage)} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(expensePercentage, 100)}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">
                    {expensePercentage.toFixed(1)}% dari pemasukan
                </p>
            </div>

            {/* Remaining Balance */}
            <div className="flex justify-between mt-3">
                <h4 className={`font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {statusLabel}
                </h4>
                <span className={`font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {showAmount ? formatMoney(displayAmount) : "•••••••"}
                </span>
            </div>
        </div>
    );
}
