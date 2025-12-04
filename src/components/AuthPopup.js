import React from 'react';
import { X } from 'lucide-react';
import styles from '../styles/AuthPopup.module.css';

export default function AuthPopup({ isOpen, onClose, onLogin }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(false);
    const [mode, setMode] = React.useState('login'); // 'login' or 'signup'

    // Form fields
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
            const body = mode === 'signup'
                ? { fullName, email, password }
                : { email, password };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.status === 'success') {
                setSuccess(true);

                // Show success animation briefly before closing
                setTimeout(() => {
                    onLogin('email', data.data);
                    setSuccess(false);
                    setIsLoading(false);
                    // Reset form
                    setFullName('');
                    setEmail('');
                    setPassword('');
                }, 1000);
            } else {
                setError(data.message || 'Authentication failed');
                setIsLoading(false);
            }
        } catch (err) {
            setError('Network error. Please try again.');
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setError(null);
        setFullName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose} disabled={isLoading}>
                    <X size={20} />
                </button>

                <h2 className={styles.title}>
                    {success ? 'Welcome!' : mode === 'login' ? 'Login' : 'Sign Up'}
                </h2>
                <p className={styles.subtitle}>
                    {success
                        ? 'Successfully authenticated'
                        : mode === 'login'
                            ? 'Login to access your resume builder'
                            : 'Create an account to get started'}
                </p>

                {error && (
                    <div style={{
                        color: '#ef4444',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        backgroundColor: '#fee2e2',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #fecaca'
                    }}>
                        {error}
                    </div>
                )}

                {success ? (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: '#dcfce7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#16a34a'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                        {mode === 'signup' && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    Full Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    disabled={isLoading}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>
                        )}

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                color: '#374151'
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                            {mode === 'signup' && (
                                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                    Minimum 6 characters
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={styles.authButton}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                        >
                            {isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
                        </button>

                        <div style={{
                            marginTop: '1.5rem',
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            color: '#6b7280'
                        }}>
                            {mode === 'login' ? (
                                <>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={toggleMode}
                                        disabled={isLoading}
                                        style={{
                                            color: '#3b82f6',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                            fontWeight: '500',
                                        }}
                                    >
                                        Sign up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={toggleMode}
                                        disabled={isLoading}
                                        style={{
                                            color: '#3b82f6',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                            fontWeight: '500',
                                        }}
                                    >
                                        Login
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
