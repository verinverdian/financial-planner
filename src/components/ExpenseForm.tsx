'use client';
import { useState } from 'react';
import type { Expense } from '@/types/expense';

export default function ExpenseForm({ onAdd }: { onAdd: (expense: Expense) => void }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Makanan');
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10)); // default hari ini
    const [note, setNote] = useState('');

    const formatNumber = (value: string) => {
        const numericValue = value.replace(/\D/g, '');
        return numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumber(e.target.value);
        setAmount(formatted);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !amount) return;

        const numericAmount = parseFloat(amount.replace(/\./g, ''));

        onAdd({
            id: crypto.randomUUID(),
            name,
            amount: numericAmount,
            category,
            date,
            note: note.trim() || undefined,
            month: ''
        });

        // Reset form
        setName('');
        setAmount('');
        setCategory('Makanan');
        setDate(new Date().toISOString().slice(0, 10));
        setNote('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 mb-4 flex flex-col gap-2">
            <label className="text-lg font-bold mb-2">Pengeluaran</label>

            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nama pengeluaran"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <input
                type="text"
                value={amount || '0'}
                onChange={handleAmountChange}
                placeholder="Jumlah"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
                <option>Makanan</option>
                <option>Transportasi</option>
                <option>Hiburan</option>
                <option>Tagihan</option>
                <option>Lainnya</option>
            </select>

            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Catatan (opsional)"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <button
                type="submit"
                disabled={!name || !amount || amount === '0'}
                className={`text-lg text-white px-4 py-2 rounded-lg transition 
                    ${!name || !amount || amount === '0'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}           
            >
                Tambah
            </button>
        </form>
    );
}
