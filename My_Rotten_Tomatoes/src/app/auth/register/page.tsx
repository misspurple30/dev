import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Inscription</h1>
      <div className="max-w-md mx-auto">
        <RegisterForm />
      </div>
    </div>
  );
}