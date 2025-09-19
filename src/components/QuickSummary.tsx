'use client';

import { useState } from "react";
import React from "react";
import {
  Eye,
  EyeOff,
  Utensils,
  Car,
  Film,
  Receipt,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import BudgetsTracker from "@/components/BudgetsTracker";

interface SummaryCardProps {
  totalIncome: number;
  lastMonthIncome: number;
  totalExpense: number;
  lastMonthExpense: number;
  selectedMonth: string;
  topCategory?: { name: string; percentage: number };

  // ✅ tambahan props untuk goals
  goalsAchieved?: number;
  goalsTotal?: number;

  // ✅ tambahan props untuk jumlah transaksi
  incomeCount?: number;
  expenseCount?: number;
}

const categoryStyles: Record<string, { color: string; icon: React.ReactNode }> = {
  Tagihan: {
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: <Receipt className="w-4 h-4" />,
  },
  Transportasi: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: <Car className="w-4 h-4" />,
  },
  Hiburan: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: <Film className="w-4 h-4" />,
  },
  Makanan: {
    color: "bg-red-100 text-red-700 border-red-200",
    icon: <Utensils className="w-4 h-4" />,
  },
};

export default function SummaryCard({
  totalIncome,
  lastMonthIncome,
  totalExpense,
  lastMonthExpense,
  selectedMonth,
  topCategory,
  goalsAchieved = 0,
  goalsTotal = 0,
  incomeCount = 0,
  expenseCount = 0,
}: SummaryCardProps) {
  const [showAmount, setShowAmount] = useState(true);

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const formatMonthYear = (selectedMonth: string) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    return `${monthNames[month - 1]} ${year}`;
  };

  const formatMoney = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`;

  const balance = totalIncome - totalExpense;
  const safeBalance = balance < 0 ? 0 : balance;

  const expensePercentage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  const getProgressColor = (percentage: number) => {
    if (percentage <= 70) return "bg-green-500";
    if (percentage <= 100) return "bg-yellow-500";
    return "bg-red-500";
  };

  const expenseDiff = totalExpense - lastMonthExpense;
  const expenseChangePct = lastMonthExpense === 0 ? 100 : (expenseDiff / lastMonthExpense) * 100;

  return (
    <div className="bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Ringkasan {formatMonthYear(selectedMonth)}
        </h2>
        <div className="flex items-center gap-2">
          <p className="italic text-gray-500 text-xs">Tampilkan/sembunyikan saldo</p>
          <button
            onClick={() => setShowAmount(!showAmount)}
            className="text-gray-600 hover:text-gray-800"
          >
            {showAmount ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom 1: Budget Tracker + Goals */}
        <div className="">
          <BudgetsTracker totalExpense={totalExpense} />

          {/* Goal Tercapai */}
          <div className="mt-2 p-3 rounded-lg bg-gray-50 col-span-2">
            <p className="text-sm text-gray-500">🎯 Goals Tercapai</p>
            <h3 className="text-lg font-bold text-green-600 mt-1">
              {goalsAchieved}/{goalsTotal}
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: goalsTotal > 0 ? `${(goalsAchieved / goalsTotal) * 100}%` : "0%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 italic">
              {goalsTotal > 0
                ? `${Math.round((goalsAchieved / goalsTotal) * 100)}% dari total goals`
                : "Belum ada goals"}
            </p>
          </div>
        </div>

        {/* Kolom 2: Summary Cards */}
        <div className="grid grid-cols-2 gap-4 items-stretch">
          {/* Saldo Akhir */}
          <div className="p-4 rounded-lg bg-gray-50 h-full flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500">💰 Saldo Akhir</p>
              <h3 className="text-xl font-bold text-blue-600 mt-2">
                {showAmount ? formatMoney(safeBalance) : "•••••••"}
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              {totalIncome > 0
                ? `${((safeBalance / totalIncome) * 100).toFixed(1)}% dari pemasukan`
                : "Belum ada pemasukan"}
            </p>
          </div>

          {/* Total Pemasukan */}
          <div className="p-4 rounded-lg bg-gray-50 h-full flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500">📈 Total Pemasukan</p>
              <h3 className="text-xl font-bold text-green-600 mt-2">
                {showAmount ? formatMoney(totalIncome) : "•••••••"}
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              {incomeCount} transaksi bulan ini
            </p>
          </div>

          {/* Total Pengeluaran */}
          <div className="p-4 rounded-lg bg-gray-50 col-span-2 sm:col-span-1 h-full flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500">📉 Total Pengeluaran</p>
              <h3 className="text-xl font-bold text-red-600 mt-2">
                {showAmount ? formatMoney(totalExpense) : "•••••••"}
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3 relative">
                <div
                  className={`${getProgressColor(expensePercentage)} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(expensePercentage, 100)}%` }}
                ></div>
                <p className="text-xs text-gray-500 mt-2 italic"> {expensePercentage.toFixed(1)}% dari pemasukan </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
              {expenseCount} transaksi bulan ini
            </p>
          </div>

          {/* Sisa Uang */}
          <div className="p-4 rounded-lg bg-gray-50 h-full flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {balance >= 0 ? "💵 Sisa Uang" : "💵 Kekurangan"}
              </p>
              <h3
                className={`text-xl font-bold mt-2 ${balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
                {showAmount ? formatMoney(Math.abs(balance)) : "•••••••"}
              </h3>
            </div>
            <p
              className={`text-xs mt-3 italic ${balance >= 0 ? "text-green-600" : "text-red-500"
                }`}
            >
              {balance >= 0
                ? "Keuangan sehat 👍"
                : "Catat pada pengeluaran bulan berikutnya"}
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Perubahan pengeluaran */}
        <div
          className={`p-3 rounded-lg border text-sm flex items-center gap-2 ${expenseChangePct >= 0
            ? "bg-red-100 border-red-200 text-red-700"
            : "bg-green-50 border-green-200 text-green-700"
            }`}
        >
          {expenseChangePct >= 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>
            Pengeluaran{" "}
            {expenseChangePct >= 0
              ? `naik ${expenseChangePct.toFixed(1)}%`
              : `turun ${Math.abs(expenseChangePct).toFixed(1)}%`}{" "}
            dibanding bulan lalu.
          </span>
        </div>

        {/* Kategori terbesar */}
        <div
          className={`p-3 rounded-lg border text-sm flex items-center gap-2 ${topCategory
            ? categoryStyles[topCategory.name]?.color || "bg-gray-100 text-gray-700"
            : "bg-gray-50 border-gray-200 text-gray-500 italic"
            }`}
        >
          {topCategory ? (
            <>
              {categoryStyles[topCategory.name]?.icon}
              <span>
                Kategori{" "}
                <span className="font-semibold">{topCategory.name}</span>{" "}
                paling besar: {topCategory.percentage.toFixed(1)}% dari total pengeluaran.
              </span>
            </>
          ) : (
            "Belum ada kategori terbesar."
          )}
        </div>
      </div>
    </div>
  );
}
