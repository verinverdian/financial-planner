'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Expense } from '@/types/expense';

interface ExpenseFormProps {
    onAdd: (expense: Expense) => void;
}

export default function ExpenseForm({ onAdd }: ExpenseFormProps) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Makanan');
    const [note, setNote] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // format: "YYYY-MM-DD"
      });
      
    const formatNumber = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        return numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(formatNumber(e.target.value));
    };

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user) setUserId(data.user.id);
        };
        getUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            alert('User belum login!');
            return;
        }

        const amountValue = parseInt(amount.replace(/\./g, '')); // ubah jadi angka asli
        if (isNaN(amountValue)) return;

        setLoading(true);

        const { data, error } = await supabase
            .from('expenses')
            .insert([
                {
                    user_id: userId,
                    description,
                    amount: amountValue,
                    category,
                    expense_date: date,
                    notes: note,
                },
            ])
            .select()
            .single();

        setLoading(false);

        if (error) {
            console.error(error);
            alert('Gagal menyimpan data!');
            return;
        }

        if (data) {
            onAdd({
                id: data.id,
                description: data.description,
                amount: parseFloat(data.amount),
                category: data.category,
                expense_date: data.expense_date,
                notes: data.notes || undefined,
                month: data.expense_date.slice(0, 7),
                user_id: ''
            });
        }

        // Reset form
        setDescription('');
        setAmount('');
        setCategory('');
        setDate(new Date().toISOString().split('T')[0]);
        setNote('');
    };

    const isDisabled = !description || !amount || !category || !date || loading;

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 mb-4 flex flex-col gap-2">
            <label className="text-lg font-bold mb-2">Pengeluaran</label>
            <input
                type="text"
                placeholder="Deskripsi"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
                type="text"
                inputMode="numeric"
                value={amount ? amount : 0}
                onChange={handleAmountChange}
                placeholder="Jumlah"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
                <option value="Makanan">Makanan</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Hiburan">Hiburan</option>
                <option value="Tagihan">Tagihan</option>
                <option value="Lainnya">Lainnya</option>
            </select>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <textarea
                placeholder="Catatan (opsional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
                type="submit"
                disabled={isDisabled}
                className={`text-md text-white px-4 py-2 rounded-lg transition 
                ${isDisabled
                  ? 'bg-gray-400'
                  : 'bg-green-500 hover:bg-green-600'
                }`}
            >
                {loading ? 'Menyimpan...' : 'Tambah'}
            </button>
        </form>
    );
}
