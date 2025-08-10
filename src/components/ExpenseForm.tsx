'use client';
import { useState } from 'react';
import type { Expense } from '@/types/expense';

export default function ExpenseForm({ onAdd }: { onAdd: (expense: Expense) => void }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Makanan');

    const formatNumber = (value: string) => {
        // Hapus semua karakter non angka
        const numericValue = value.replace(/\D/g, '');
        // Format jadi ribuan Indonesia
        return numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumber(e.target.value);
        setAmount(formatted);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !amount) return;
        // Ubah kembali ke angka asli sebelum kirim
        const numericAmount = parseFloat(amount.replace(/\./g, ''));
        onAdd({ name, amount: numericAmount, category });
        setName('');
        setAmount('');
        setCategory('Makanan');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white mb-4 flex flex-col gap-2">
            <label className="block mb-1 font-medium text-lg">Pengeluaran</label>

            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nama pengeluaran"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <input
                type="text"
                value={amount ? amount : '0'}
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
