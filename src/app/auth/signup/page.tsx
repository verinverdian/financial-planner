import AuthForm from '@/components/AuthForm';

export default function SignupPage() {
  return (
    <>
      {/* <head>
        <title>Sign Up | Financial Tracking</title>
        <meta
          name="description"
          content="Daftar ke aplikasi Financial Tracking untuk mengelola keuangan Anda."
        />
      </head> */}
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg space-y-6">
          <AuthForm type="signup" />
        </div>
      </div>
    </>
  );
}
