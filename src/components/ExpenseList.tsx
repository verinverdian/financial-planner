export default function ExpenseList({
    expenses,
}: {
    expenses: { name: string; amount: number }[];
}) {
    return (
        <div className="bg-white">
            <h2 className="text-lg font-bold mb-2">Expense List</h2>
            <ul className="divide-y">
                {expenses.map((expense, index) => (
                    <li key={index} className="py-2 flex justify-between">
                        <span>{expense.name}</span>
                        <span className="font-semibold">
                            Rp {expense.amount.toLocaleString('id-ID')}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
