import { TrendingUp, TrendingDown } from "lucide-react";

type IncomeTrendProps = {
  percent: number; // persen perubahan pemasukan
};

export default function IncomeTrend({ percent }: IncomeTrendProps) {
  const isUp = percent > 0;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium mt-2
        ${isUp ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}
      `}
    >
      {isUp ? (
        <TrendingUp className="w-4 h-4" />
      ) : (
        <TrendingDown className="w-4 h-4" />
      )}
      <span>
        Pemasukan {isUp ? "naik" : "turun"}{" "}
        <b>{Math.abs(percent).toFixed(1)}%</b> dibanding bulan lalu.
      </span>
    </div>
  );
}
