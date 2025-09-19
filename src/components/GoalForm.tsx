import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { GoalSaving } from "@/types/goal_savings";

interface GoalFormProps {
  onAdded: (newGoal?: GoalSaving) => void; // callback buat update state goals
}

export default function GoalForm({ onAdded }: GoalFormProps) {
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState(""); // tampilan formatted
  const [rawAmount, setRawAmount] = useState<number>(0); // angka asli
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, ""); // ambil hanya angka
    const number = numericValue ? parseInt(numericValue, 10) : 0;

    setRawAmount(number); // simpan angka asli
    setTargetAmount(number ? number.toLocaleString("id-ID") : ""); // simpan tampilan format
  };

  const isDisabled = !goalName || rawAmount <= 0 || loading;

  // ambil userId
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
      alert("Session tidak ditemukan, silakan login ulang!");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("goal_savings")
      .insert([
        {
          user_id: userId,
          goal_name: goalName,
          target_amount: rawAmount, // angka asli masuk DB
          saved_amount: 0, // default awal
        },
      ])
      .select()
      .single(); // ⬅️ ambil row yang baru dibuat

    setLoading(false);

    if (error) {
      console.error("❌ Error insert goal:", error.message);
      alert("Gagal menyimpan goal!");
    } else {
      setGoalName("");
      setTargetAmount("");
      setRawAmount(0);
      onAdded(data as GoalSaving); // ⬅️ kirim goal baru ke parent
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-gray-800">
      <form
        onSubmit={handleSubmit}
        className="dark:bg-gray-800 mb-4 flex flex-col gap-2"
      >
        <label className="text-lg font-bold">Goal</label>

        <input
          type="text"
          placeholder="Nama Goal (misal: Tabungan Liburan)"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="text"
          inputMode="numeric"
          placeholder="Target (Rp)"
          value={targetAmount || ""}
          onChange={setTargetAmountChange}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          disabled={isDisabled}
          className={`text-md text-white px-4 py-2 rounded-lg transition 
          ${isDisabled
              ? "bg-gray-400"
              : "bg-green-500 hover:bg-green-600"
            }`}
        >
          {loading ? "Menyimpan..." : "Tambah Goal"}
        </button>
      </form>
    </div>
  );
}