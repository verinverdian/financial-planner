'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// 1️⃣ Definisikan tipe transaksi
type Transaction = {
    id: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    note?: string;
    date: string; // format: YYYY-MM-DD
};

export default function TransactionList({ month }: { month: string }) {
    // 2️⃣ Tentukan tipe di useState
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    async function fetchTransactions() {
        if (!month) return;

        const [year, monthNum] = month.split('-');
        const startDate = `${year}-${monthNum}-01`;
        const endDate = `${year}-${monthNum}-31`;

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            // 3️⃣ Pastikan casting ke tipe Transaction[]
            setTransactions(data as Transaction[]);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, [month]);

    return (
        <ul className="mt-4 space-y-2">
            {transactions.length === 0 && (
                <li className="text-gray-500 text-sm">Tidak ada transaksi bulan ini</li>
            )}
            {transactions.map((t) => (
                <li key={t.id} className="border p-2 rounded">
                    <span className="font-medium">{t.date}</span> -
                    <span className={t.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {t.category}
                    </span> - Rp {t.amount.toLocaleString('id-ID')}
                    {t.note && ` (${t.note})`}
                </li>
            ))}
        </ul>
    );
    console.log(transactions.length)
}
