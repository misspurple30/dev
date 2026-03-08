import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Connexion
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}