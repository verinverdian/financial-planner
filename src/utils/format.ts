export function formatMoney(amount: number) {
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    });
  }
  
  export function formatMonthYear(month: string) {
    const [year, monthNumber] = month.split('-');
    const date = new Date(Number(year), Number(monthNumber) - 1);
    return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  }
  