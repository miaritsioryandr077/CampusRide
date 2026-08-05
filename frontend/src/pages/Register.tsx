import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import { UserPlus, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', formData);
      const { token, ...user } = response.data;
      setAuth(user, token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
      
      <div className="glass w-full max-w-md p-8 rounded-2xl relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="text-primary-400 w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-white">Join CampusRide</h2>
          <p className="text-gray-400 mt-2">Create an account to get started</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
              <input name="firstName" type="text" required onChange={handleChange}
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
              <input name="lastName" type="text" required onChange={handleChange}
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white transition-all outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">University Email</label>
            <input name="email" type="email" required onChange={handleChange}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white transition-all outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input name="password" type="password" required onChange={handleChange}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white transition-all outline-none" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-all flex justify-center items-center gap-2 group mt-2">
            {isLoading ? 'Creating Account...' : 'Sign Up'}
            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
