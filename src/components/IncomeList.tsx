'use client';

import { Income } from '@/types/income';

interface IncomeListProps {
  incomes: Income[];
  onDeleted: (id: number) => void;
}

export default function IncomeList({ incomes, onDeleted }: IncomeListProps) {
  if (incomes.length === 0) {
    return <p className="text-gray-500 mt-4">Belum ada pemasukan untuk bulan ini.</p>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Daftar Pemasukan</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">Sumber</th>
            <th className="border border-gray-300 px-3 py-2 text-right">Jumlah</th>
            <th className="border border-gray-300 px-3 py-2 text-left">Catatan</th>
            <th className="border border-gray-300 px-3 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-3 py-2">{income.source}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">
                Rp {Number(income.amount).toLocaleString('id-ID')}
              </td>
              <td className="border border-gray-300 px-3 py-2">{income.notes || '-'}</td>
              <td className="border border-gray-300 px-3 py-2 text-center">
                <button
                  onClick={() => onDeleted(income.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
