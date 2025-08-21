import { useEffect } from "react";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  confirmColor?: string;
  cancelText?: string;
  cancelColor?: string;
};

export default function ConfirmModal({
  isOpen,
  title = "Konfirmasi",
  message,
  onConfirm,
  onCancel,
  confirmText = "Ya",
  confirmColor = "bg-red-500 hover:bg-red-600",
  cancelText = "Batal",
  cancelColor = "bg-gray-300 hover:bg-gray-400",
}: ConfirmModalProps) {
  // Tutup modal kalau tekan ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 transition-opacity"
      onClick={onCancel} // klik luar modal = cancel
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full transform transition-all scale-95 animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // biar klik dalam modal gak close
      >
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded ${cancelColor}`}
          >
            {cancelText}
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
