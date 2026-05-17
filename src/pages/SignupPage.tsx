import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../lib/auth';
import { useAuthStore } from '../store/authStore';
import { showToast } from '../components/Toast';

export function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        setLoading(true);
        try {
            const data = await signup(name, email, password);
            setAuth(data.user, data.token);
            showToast('Account created!', 'success');
            navigate('/analyze');
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Signup failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-dark flex items-center justify-center px-4">
            <div className="card w-full max-w-md">
                <h1 className="text-3xl font-sora font-bold text-dark dark:text-white mb-2">
                    Create Account
                </h1>
                <p className="text-muted mb-8">Start optimizing your resume today</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-dark dark:text-white mb-1 block">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Varun Panchal"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-dark dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

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
                            placeholder="Min. 6 characters"
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
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </div>

                <p className="text-center text-sm text-muted mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}