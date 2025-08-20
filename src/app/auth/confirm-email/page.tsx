"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function ConfirmEmailPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white px-4">
      <div className="max-w-md w-full text-center bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-green-100">
        {/* Logo / Brand */}
        <Link href="/" className="inline-block mb-2">
          <div className="text-3xl font-extrabold text-green-700 tracking-tight">
            FinanceTrack Co.
          </div>
        </Link>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-green-100 rounded-full">
            <Mail className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-green-700">Konfirmasi Email</h1>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          Kami telah mengirimkan link verifikasi ke email kamu.
          <br />
          Silakan cek kotak masuk atau folder <span className="font-medium">spam</span>.
          <br />
          Setelah verifikasi, kamu bisa login dan mulai menggunakan aplikasi.
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push("/auth/login")}
          className="w-full py-3 mt-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl shadow-md transition"
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}
