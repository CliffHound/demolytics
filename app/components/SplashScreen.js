'use client';

import { useState } from 'react';

export default function SplashScreen({ onUnlock }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        onUnlock();
      } else {
        setError('Invalid demo code. Please contact us to get access.');
        setCode('');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚒</span>
          <span style={styles.logoText}>Demolytics</span>
        </div>

        <p style={styles.tagline}>Blueprint → Statement of Work</p>

        <div style={styles.divider} />

        <p style={styles.description}>
          This tool is currently in private demo. Enter your access code below to continue.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter demo code"
            style={styles.input}
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !code.trim()}
            style={{
              ...styles.btn,
              ...(loading || !code.trim() ? styles.btnDisabled : {}),
            }}
          >
            {loading ? 'Verifying…' : 'Enter →'}
          </button>
        </form>

        <p style={styles.contact}>
          Need access? Contact us to request a demo code.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
  },
  card: {
    background: '#181b20',
    border: '1px solid #2a2f38',
    borderRadius: '16px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  logoIcon: { fontSize: '32px' },
  logoText: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#E8530A',
    letterSpacing: '-0.5px',
  },
  tagline: {
    color: '#555e6e',
    fontSize: '13px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: '24px',
  },
  divider: {
    height: '1px',
    background: '#2a2f38',
    marginBottom: '24px',
  },
  description: {
    color: '#8b95a5',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  input: {
    background: '#1f2329',
    border: '1px solid #2a2f38',
    borderRadius: '8px',
    color: '#e8eaf0',
    fontSize: '15px',
    padding: '12px 14px',
    outline: 'none',
    textAlign: 'center',
    letterSpacing: '2px',
    fontFamily: 'monospace',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '13px',
    padding: '10px 14px',
    background: 'rgba(255, 107, 107, 0.08)',
    borderRadius: '6px',
    border: '1px solid rgba(255, 107, 107, 0.2)',
    margin: '0',
  },
  btn: {
    background: '#E8530A',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    padding: '12px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  btnDisabled: {
    background: '#3a3f47',
    color: '#555e6e',
    cursor: 'not-allowed',
  },
  contact: {
    color: '#555e6e',
    fontSize: '13px',
  },
};
