type ConfirmModalProps = {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string; // tambahan
    confirmColor?: string; // tambahan (class tailwind)
};

export default function ConfirmModal({
    isOpen,
    title = "Konfirmasi",
    message,
    onConfirm,
    onCancel,
    confirmText = "Ya", // default
    confirmColor = "bg-red-500 hover:bg-red-600", // default
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4">{title}</h3>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded text-white ${confirmColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
