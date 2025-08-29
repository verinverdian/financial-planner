'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/auth/login");
        return;
      }
      setUser(data.user);
      setFullName(data.user.user_metadata?.full_name || "");
      setAvatarUrl(data.user.user_metadata?.avatar_url || null);
    };
    loadUser();
  }, [router]);

  const handleSave = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, avatar_url: avatarUrl },
    });
    if (error) alert("Gagal update profile: " + error.message);
    else alert("Profile berhasil diperbarui");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !user) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload ke bucket "avatars"
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
    } catch (err: any) {
      alert("Upload gagal: " + err.message);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-green-700">My Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border border-gray-300"
          />
        ) : user.user_metadata?.full_name ? (
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-600 text-white text-lg font-bold">
            {user.user_metadata.full_name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200">
            <UserIcon className="w-8 h-8 text-gray-500" />
          </div>
        )}
        <div>
          <label className="cursor-pointer text-sm font-medium text-green-700">
            Ganti Avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="text"
          value={user.email}
          disabled
          className="w-full border rounded-lg p-2 bg-gray-100 dark:bg-gray-800"
        />
      </div>

      {/* Full Name */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
      >
        Simpan Perubahan
      </button>
    </div>
  );
}
