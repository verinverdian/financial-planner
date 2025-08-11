export type Expense = {
  // month: string;
  id: string;             // ID unik untuk edit/hapus
  name: string;           // Nama pengeluaran
  amount: number;         // Jumlah pengeluaran
  category: string;       // Kategori (Makanan, Transportasi, Tagihan, dll)
  date: string;           // Tanggal pengeluaran (format ISO: YYYY-MM-DD)
  note?: string;          // Catatan tambahan (opsional)
  month: string; 
  // category: Category;
};

// export type Category =
//   | 'Makanan'
//   | 'Transportasi'
//   | 'Hiburan'
//   | 'Tagihan'
//   | 'Lainnya';