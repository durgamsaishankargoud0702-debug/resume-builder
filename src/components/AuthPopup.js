import React from 'react';
import { X } from 'lucide-react';
import { signIn } from 'next-auth/react';
import styles from '../styles/AuthPopup.module.css';

export default function AuthPopup({ isOpen, onClose, onLogin }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(false);
    const [mode, setMode] = React.useState('login'); // 'login', 'signup', 'forgot', or 'reset'

    // Form fields
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [otp, setOtp] = React.useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === 'forgot') {
                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    setMode('reset');
                    setIsLoading(false);
                    return;
                } else {
                    setError(data.message || 'Failed to request reset link');
                    setIsLoading(false);
                    return;
                }
            }

            if (mode === 'reset') {
                const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp, newPassword: password }),
                });

                const data = await response.json();

                if (data.status === 'success') {
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                        setMode('login');
                        setIsLoading(false);
                        setPassword('');
                        setOtp('');
                    }, 2500);
                    return;
                } else {
                    setError(data.message || 'Failed to reset password');
                    setIsLoading(false);
                    return;
                }
            }

            if (mode === 'signup') {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await response.json();

                if (data.status !== 'success') {
                    setError(data.message || 'Authentication failed');
                    setIsLoading(false);
                    return;
                }
            }

            // Always login via NextAuth after signup or if mode is login
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError(result.error);
                setIsLoading(false);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    onLogin('credentials', { email, name }); 
                    setSuccess(false);
                    setIsLoading(false);
                    setName('');
                    setEmail('');
                    setPassword('');
                }, 1000);
            }
        } catch (err) {
            setError('Network error. Please try again.');
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setError(null);
        setName('');
        setEmail('');
        setPassword('');
        setOtp('');
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose} disabled={isLoading}>
                    <X size={20} />
                </button>

                <h2 className={styles.title}>
                    {success ? (mode === 'reset' ? 'Password Reset!' : 'Welcome!') : mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : mode === 'reset' ? 'Enter OTP' : 'Reset Password'}
                </h2>
                <p className={styles.subtitle}>
                    {success
                        ? (mode === 'reset' ? 'Your password has been successfully updated.' : 'Successfully authenticated')
                        : mode === 'login'
                            ? 'Login to access your resume builder'
                            : mode === 'signup'
                                ? 'Create an account to get started'
                                : mode === 'reset'
                                    ? 'Check your email for the 6-digit code'
                                    : 'Enter your email to receive a reset link'}
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
                    <>
                        {mode === 'login' && (
                            <div style={{
                                backgroundColor: '#f0f9ff',
                                border: '1px solid #bae6fd',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.85rem',
                                color: '#0369a1',
                                marginBottom: '1rem'
                            }}>
                                <strong>Tip:</strong> Don't have credentials? Switch to <strong>Sign Up</strong> to create your account!
                            </div>
                        )}
                        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
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
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                                disabled={isLoading || mode === 'reset'}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    backgroundColor: mode === 'reset' ? '#f3f4f6' : 'white',
                                    color: mode === 'reset' ? '#6b7280' : 'inherit'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>

                        {mode === 'reset' && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    6-Digit OTP
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="123456"
                                    required
                                    disabled={isLoading}
                                    maxLength={6}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.5rem',
                                        fontSize: '1.25rem',
                                        letterSpacing: '0.25rem',
                                        textAlign: 'center',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>
                        )}

                        {mode !== 'forgot' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label style={{
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}>
                                        {mode === 'reset' ? 'New Password' : 'Password'}
                                    </label>
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setMode('forgot')}
                                            tabIndex="-1"
                                            style={{
                                                fontSize: '0.8rem',
                                                color: '#3b82f6',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0,
                                                fontWeight: '500'
                                            }}
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
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
                        )}

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
                            {isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : mode === 'reset' ? 'Reset Password' : 'Send Reset Link'}
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
                            
                            {(mode === 'forgot' || mode === 'reset') && (
                                <button
                                    type="button"
                                    onClick={() => setMode('login')}
                                    disabled={isLoading}
                                    style={{
                                        color: '#3b82f6',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        display: 'block',
                                        margin: '0 auto'
                                    }}
                                >
                                    Back to Login
                                </button>
                            )}
                        </div>
                    </form>
                </>
                )}
            </div>
        </div>
    );
}
