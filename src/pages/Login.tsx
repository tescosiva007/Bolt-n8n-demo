import { FormEvent } from 'react';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

export default function Login({ onLoginSuccess, onSwitchToRegister }: LoginProps) {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const defaultUserId = '550e8400-e29b-41d4-a716-446655440000';

      localStorage.setItem('demo_user_session', JSON.stringify({
        userId: defaultUserId,
        userEmail: 'demo@example.com',
        userName: 'Demo User',
      }));

      onLoginSuccess();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Demo</h1>
          <p className="text-gray-600 mt-2">Welcome to the Message System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-center text-gray-600 text-sm">
            Click the button below to start managing messages
          </p>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Enter System
          </button>
        </form>
      </div>
    </div>
  );
}
