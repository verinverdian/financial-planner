import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Income } from '@/types/income';
import AllocationModal from './AllocationModal';
import { AlertCircle } from 'lucide-react';

interface IncomeFormProps {
  onAdded: (income: Income) => void;
  onGoalUpdated?: (goalId: string, amount: number) => void; // ✅ tambahan
}

export default function IncomeForm({ onAdded, onGoalUpdated }: IncomeFormProps) {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [monthYear, setMonthYear] = useState('');
  const [notes, setNotes] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempIncome, setTempIncome] = useState<any>(null);

  const [goals, setGoals] = useState<{ id: string; goal_name: string }[]>([]);

  const isDisabled = !source || !amount || !monthYear || loading;

  // ✅ Set default bulan saat ini
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    setMonthYear(currentMonth);
  }, []);

  // ✅ Ambil userId otomatis
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    getUser();
  }, []);

  // ✅ Fetch goals
  const fetchGoals = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('goal_savings')
      .select('id, goal_name, is_archived') // tambahin is_archived
      .eq('user_id', userId);

    if (!error && data) {
      setGoals(
        data
          .filter((g) => !g.is_archived) // filter langsung goal aktif
          .map((g) => ({ id: String(g.id), goal_name: g.goal_name }))
      );
    }
  };

  useEffect(() => {
    if (userId) fetchGoals();
  }, [userId]);

  useEffect(() => {
    if (showModal) fetchGoals();
  }, [showModal]);

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatNumber(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('Session tidak ditemukan, silakan login ulang!');
      return;
    }

    const amountValue = parseInt(amount.replace(/\./g, ''));
    if (isNaN(amountValue)) return;

    setTempIncome({
      source,
      amount: amountValue,
      month_year: monthYear,
      notes,
      user_id: userId,
    });

    setShowModal(true);
  };

  // ✅ Setelah user pilih alokasi
  const handleAllocation = async (allocation: any) => {
    setLoading(true);

    try {
      if (allocation.type === 'saldo') {
        // langsung simpan ke incomes
        const { data, error } = await supabase
          .from('incomes')
          .insert([tempIncome])
          .select()
          .single();

        if (!error && data) {
          onAdded(data); // update IncomeList
        }
      }

      if (allocation.type === 'goal') {
        const { data: goal } = await supabase
          .from('goal_savings')
          .select('saved_amount')
          .eq('id', allocation.goalId)
          .single();

        if (goal) {
          const newSaved = Number(goal.saved_amount || 0) + tempIncome.amount;
          await supabase
            .from('goal_savings')
            .update({ saved_amount: newSaved })
            .eq('id', allocation.goalId);

          // ✅ update state goals di parent
          onGoalUpdated?.(allocation.goalId, tempIncome.amount);
        }

        const { data, error } = await supabase
          .from('incomes')
          .insert([{ ...tempIncome, notes: `Dialokasikan ke goal` }])
          .select()
          .single();

        if (!error && data) {
          onAdded(data);
        }
      }

      if (allocation.type === 'split') {
        const { goalAmount, saldoAmount, goalId } = allocation;

        if (saldoAmount > 0) {
          const { data, error } = await supabase
            .from('incomes')
            .insert([{ ...tempIncome, amount: saldoAmount, notes: 'Split: ke saldo' }])
            .select()
            .single();

          if (!error && data) {
            onAdded(data);
          }
        }

        if (goalAmount > 0) {
          const { data: goal } = await supabase
            .from('goal_savings')
            .select('saved_amount')
            .eq('id', goalId)
            .single();

          if (goal) {
            const newSaved = Number(goal.saved_amount || 0) + goalAmount;
            await supabase
              .from('goal_savings')
              .update({ saved_amount: newSaved })
              .eq('id', goalId);

            // ✅ update state goals di parent
            onGoalUpdated?.(goalId, goalAmount);
          }

          const { data, error } = await supabase
            .from('incomes')
            .insert([{ ...tempIncome, amount: goalAmount, notes: 'Split: ke goal' }])
            .select()
            .single();

          if (!error && data) {
            onAdded(data);
          }
        }
      }
    } finally {
      setLoading(false);
      setShowModal(false);

      setSource('');
      setAmount('');
      setNotes('');
      setMonthYear(new Date().toISOString().slice(0, 7));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 mb-4 flex flex-col gap-2">
        <label className="text-lg font-bold mb-2">Pemasukan</label>

        {/* ✅ Alert info untuk tambah goal */}
        <div className="flex items-center gap-2 p-3 mb-2 text-sm text-blue-800 bg-blue-100 border border-blue-300 rounded-lg">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          <span>Punya tujuan? Tambahkan <b>Goal</b> di bawah.</span>
        </div>

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
          value={amount || 0}
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
          ${isDisabled
              ? 'bg-gray-400'
              : 'bg-green-500 hover:bg-green-600'
            }`}
        >
          {loading ? 'Menyimpan...' : 'Tambah'}
        </button>
      </form>

      <AllocationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAllocation}
        goals={goals}
      />
    </>
  );
}