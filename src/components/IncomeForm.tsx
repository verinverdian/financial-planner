'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Income } from '@/types/income';

interface IncomeFormProps {
  onAdded: (income: Income) => void;
}

export default function IncomeForm({ onAdded }: IncomeFormProps) {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [monthYear, setMonthYear] = useState('');
  const [notes, setNotes] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Set default bulan saat ini (format YYYY-MM) hanya di client
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7); // YYYY-MM
    setMonthYear(currentMonth);
  }, []);

  // Format angka ke format Indonesia
  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatNumber(e.target.value));
  };

  // Ambil userId otomatis dari Supabase Auth
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('Session tidak ditemukan, silakan login ulang!');
      return;
    }

    const amountValue = parseInt(amount.replace(/\./g, ''));
    if (isNaN(amountValue)) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('incomes')
      .insert([
        {
          source,
          amount: amountValue,
          month_year: monthYear,
          notes,
          user_id: userId,
        },
      ])
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error(error);
      alert('Gagal menambahkan pemasukan!');
      return;
    }

    if (data) {
      onAdded({
        id: data.id,
        source: data.source,
        amount: parseFloat(data.amount),
        month_year: data.month_year,
        notes: data.notes || undefined,
        user_id: data.user_id,
        created_at: ''
      });
    }

    // Reset form (ambil ulang default bulan saat ini)
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);

    setSource('');
    setAmount('');
    setMonthYear(currentMonth);
    setNotes('');
  };

  const isDisabled = !source || !amount || !monthYear || loading;

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 mb-4 flex flex-col gap-2">
      <label className="text-lg font-bold mb-2">Pemasukan</label>

      <input
        type="text"
        placeholder="Sumber pemasukan"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <input
        type="text"
        inputMode="numeric"
        placeholder="Jumlah"
        value={amount || ''}
        onChange={handleAmountChange}
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <input
        type="month"
        value={monthYear}
        onChange={(e) => setMonthYear(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <textarea
        placeholder="Catatan (opsional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <button
        type="submit"
        disabled={isDisabled}
        className={`text-md text-white px-4 py-2 rounded-lg transition 
          ${isDisabled ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
      >
        {loading ? 'Menyimpan...' : 'Tambah'}
      </button>
    </form>
  );
}
