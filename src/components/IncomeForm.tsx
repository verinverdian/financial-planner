'use client';
import { useState } from 'react';
import type { Income } from '@/types/income';

export default function IncomeForm({
  onAdd,
  onMonthChange, // ➜ tambahkan prop baru untuk sinkron ke parent
}: {
  onAdd: (income: Income) => void;
  onMonthChange?: (month: string) => void;
}) {
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState<string>(currentMonth); // default bulan ini
  const [note, setNote] = useState('');

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setAmount(formatted);
  };

  const handleMonthChange = (value: string) => {
    setMonth(value);
    if (onMonthChange) {
      onMonthChange(value); // sinkronkan ke parent
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !amount || !month) return;

    const numericAmount = parseFloat(amount.replace(/\./g, ''));
    const newIncome: Income = {
      id: crypto.randomUUID(),
      source,
      amount: numericAmount,
      month,
      note: note || undefined,
    };

    onAdd(newIncome);
    setSource('');
    setAmount('');
    setMonth(currentMonth);
    setNote('');
    if (onMonthChange) onMonthChange(currentMonth);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 mb-4 flex flex-col gap-2">
      <label className="text-lg font-bold mb-2">Pemasukan</label>

      <input
        type="text"
        value={source}
        onChange={e => setSource(e.target.value)}
        placeholder="Sumber pemasukan"
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <input
        type="text"
        value={amount || '0'}
        onChange={handleAmountChange}
        placeholder="Jumlah"
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <input
        type="month"
        value={month}
        onChange={e => handleMonthChange(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Catatan (opsional)"
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <button
        type="submit"
        disabled={!source || !amount || amount === '0' || !month}
        className={`text-lg text-white px-4 py-2 rounded-lg transition 
          ${!source || !amount || amount === '0' || !month
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600'
          }`}
      >
        Tambah
      </button>
    </form>
  );
}