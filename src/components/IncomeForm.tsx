'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Income } from '@/types/income';

interface IncomeFormProps {
  onAdded: (income: Income) => void;
  userId: string; // dari Dashboard
}

export default function IncomeForm({ onAdded, userId }: IncomeFormProps) {
  const supabase = createClientComponentClient();

  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [monthYear, setMonthYear] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setAmount(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !amount || !monthYear) return;

    try {
      setLoading(true);

      const formattedMonthYear = monthYear.slice(0, 7);
      const numericAmount = parseFloat(amount.replace(/\./g, ''));

      const { data, error } = await supabase
        .from('incomes')
        .insert([
          {
            user_id: userId,
            source,
            amount: numericAmount,
            month_year: formattedMonthYear,
            notes: notes || null,
          },
        ])
        .select('*')
        .single();

      if (error) throw error;

      onAdded(data as Income);

      setSource('');
      setAmount('');
      setMonthYear('');
      setNotes('');
    } catch (err: any) {
      console.error('Error adding income:', err.message);
      alert('Gagal menambahkan pemasukan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 mb-4 flex flex-col gap-2"
    >
      <label className="text-lg font-bold mb-2">Pemasukan</label>

      <input
        type="text"
        placeholder="Sumber pemasukan"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />

      <input
        type="text"
        inputMode="numeric"
        placeholder="Jumlah"
        value={amount}
        onChange={handleAmountChange}
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />

      <input
        type="month"
        value={monthYear}
        onChange={(e) => setMonthYear(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />

      <textarea
        placeholder="Catatan (opsional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <button
        type="submit"
        disabled={!source || !amount || amount === '0' || !monthYear || loading}
        className={`text-md text-white px-4 py-2 rounded-lg transition ${
          !source || !amount || amount === '0' || !monthYear || loading
            ? 'bg-gray-400'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Menyimpan...' : 'Tambah'}
      </button>
    </form>
  );
}
