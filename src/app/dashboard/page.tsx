'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import { Income } from '@/types/income';
import IncomeList from '@/components/IncomeList';
import DashboardHeader from '@/components/DashboardHeader';
import IncomeForm from '@/components/IncomeForm';

export default function Dashboard() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Ambil user login
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error.message);
      }
      if (user) {
        setUserId(user.id);
      }
      setUserLoading(false);
    };

    getUser();
  }, []);

  // Fetch incomes setelah userId tersedia
  useEffect(() => {
    const fetchIncomes = async () => {
      if (!userId) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching incomes:', error.message);
      } else {
        setIncomes(data as Income[]);
      }
      setLoading(false);
    };

    fetchIncomes();
  }, [userId]);

  const handleDeleteIncome = async (id: number) => {
    const { error } = await supabase.from('incomes').delete().eq('id', id);
    if (error) {
      console.error('Error deleting income:', error.message);
    } else {
      setIncomes((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleUpdateIncome = async (updatedIncome: Income) => {
    const { id, ...fields } = updatedIncome;
    const { data, error } = await supabase
      .from('incomes')
      .update(fields)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating income:', error.message);
      alert('Gagal update data!');
    } else if (data && data.length > 0) {
      setIncomes((prev) =>
        prev.map((inc) => (inc.id === id ? data[0] : inc))
      );
    }
  };

  const handleAddIncome = (newIncome: Income) => {
    setIncomes((prev) => [newIncome, ...prev]);
  };

  return (
    <>
      <head>
        <title>Dashboard | Financial Tracking</title>
        <meta
          name="description"
          content="Masuk ke aplikasi Financial Tracking untuk mengelola keuangan Anda."
        />
      </head>
      <main className="min-h-screen bg-white dark:bg-gray-600">
        <Header />

        <div>
          <DashboardHeader />
        </div>

        <div className="max-w-8xl mx-auto p-4 flex flex-col md:flex-row gap-4">
          {/* Form */}
          <div className="w-full md:w-1/3 space-y-4">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              {userLoading ? (
                <p className="text-gray-500">Memuat user...</p>
              ) : userId ? (
                <IncomeForm onAdded={handleAddIncome} userId={userId} />
              ) : (
                <p className="text-red-500">Anda belum login!</p>
              )}
            </div>
          </div>

          {/* Income List */}
          <div className="w-full md:w-2/3 space-y-4">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              {loading ? (
                <p className="text-gray-500">Memuat data...</p>
              ) : incomes.length > 0 ? (
                <IncomeList
                  incomes={incomes}
                  onUpdated={handleUpdateIncome}
                  onDeleted={handleDeleteIncome}
                />
              ) : (
                <p className="text-gray-500">Belum ada pemasukan.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
