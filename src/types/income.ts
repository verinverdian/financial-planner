export type Income = {
    id: string;             // ID unik untuk edit/hapus
    source: string;         // Sumber pemasukan (Gaji, Bonus, Freelance, dll)
    amount: number;         // Jumlah pemasukan
    month: string;          // Bulan dalam format YYYY-MM
    note?: string;          // Catatan tambahan (opsional)
  };