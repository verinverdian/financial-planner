'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Income } from '@/types/income';
import IncomeList from '@/components/IncomeList';

export default function Dashboard() {
  const [incomes, setIncomes] = useState<Income[]>([]);

  useEffect(() => {
    const fetchIncomes = async () => {
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching incomes:', error);
      } else {
        console.log('Data dari tabel incomes:', data); // <<-- Console.log hasil fetch
        setIncomes(data as Income[]);
      }
    };

    fetchIncomes();
  }, []);

  const handleDeleteIncome = async (id: number) => {
    const { error } = await supabase.from('incomes').delete().eq('id', id);

    if (error) {
      console.error('Error deleting income:', error);
    } else {
      setIncomes((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <IncomeList incomes={incomes} onDeleted={handleDeleteIncome} />
    </div>
  );
}
