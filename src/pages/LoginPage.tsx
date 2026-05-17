import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../lib/auth';
import { useAuthStore } from '../store/authStore';
import { showToast } from '../components/Toast';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(email, password);
            setAuth(data.user, data.token);
            showToast('Welcome back!', 'success');
            navigate('/analyze');
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Login failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-dark flex items-center justify-center px-4">
            <div className="card w-full max-w-md">
                <h1 className="text-3xl font-sora font-bold text-dark dark:text-white mb-2">
                    Welcome Back
                </h1>
                <p className="text-muted mb-8">Log in to your ResumeIQ account</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-dark dark:text-white mb-1 block">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-dark dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-dark dark:text-white mb-1 block">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-dark dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="pill-btn-primary w-full"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </div>

                <p className="text-center text-sm text-muted mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}