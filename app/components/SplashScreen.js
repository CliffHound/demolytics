'use client';

import { useState } from 'react';

const FEATURES = [
  {
    icon: '📐',
    title: 'Upload Any Blueprint',
    desc: 'Drag and drop floor plans as images or PDFs — we handle the rest.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Analysis',
    desc: 'Claude instantly identifies every demolition item organized by floor and category.',
  },
  {
    icon: '✅',
    title: 'Review & Customize',
    desc: 'Toggle line items on or off before generating your final document.',
  },
  {
    icon: '📄',
    title: 'Professional SOW',
    desc: 'Download a contractor-ready Statement of Work in seconds.',
  },
];

const STATS = [
  { value: '< 60s', label: 'From blueprint to SOW' },
  { value: '8', label: 'Demolition categories' },
  { value: '100%', label: 'Blueprints never stored' },
];

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
        setError('Invalid demo code. Contact us to request access.');
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
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.badge}>Private Beta</div>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚒</span>
          <span style={styles.logoText}>Demolytics</span>
        </div>
        <h1 style={styles.headline}>
          Turn blueprints into<br />
          <span style={styles.headlineAccent}>demolition scopes of work</span><br />
          in under a minute.
        </h1>
        <p style={styles.subheadline}>
          Upload a commercial floor plan, review AI-extracted line items by floor and category,
          and download a professional Statement of Work ready to send to clients.
        </p>

        {/* Stats */}
        <div style={styles.statsRow}>
          {STATS.map((s) => (
            <div key={s.label} style={styles.statItem}>
              <span style={styles.statValue}>{s.value}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={styles.features}>
        {FEATURES.map((f) => (
          <div key={f.title} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <div>
              <p style={styles.featureTitle}>{f.title}</p>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={styles.howSection}>
        <h2 style={styles.sectionTitle}>How it works</h2>
        <div style={styles.steps}>
          {[
            { n: '1', t: 'Upload', d: 'Drop in a blueprint image or PDF' },
            { n: '2', t: 'Analyze', d: 'AI extracts every demolition item' },
            { n: '3', t: 'Review', d: 'Toggle items on or off by category' },
            { n: '4', t: 'Download', d: 'Get a professional SOW instantly' },
          ].map((s, i) => (
            <div key={s.n} style={styles.step}>
              <div style={styles.stepNum}>{s.n}</div>
              {i < 3 && <div style={styles.stepLine} />}
              <p style={styles.stepTitle}>{s.t}</p>
              <p style={styles.stepDesc}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Access gate */}
      <div style={styles.gateCard}>
        <div style={styles.gateHeader}>
          <span style={styles.lockIcon}>🔒</span>
          <div>
            <p style={styles.gateTitle}>Demo Access Required</p>
            <p style={styles.gateSubtitle}>This tool is currently in private demo. Enter your access code to continue.</p>
          </div>
        </div>

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
            {loading ? 'Verifying…' : 'Get Started →'}
          </button>
        </form>

        <p style={styles.contact}>
          Don&apos;t have a code? <span style={styles.contactAccent}>Contact us to request demo access.</span>
        </p>
      </div>

      <footer style={styles.footer}>
        <p>© 2026 Demolytics · Built for demolition & junk removal contractors · Blueprints are never stored</p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 16px 32px',
    maxWidth: '680px',
    margin: '0 auto',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '48px',
    width: '100%',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(232, 83, 10, 0.15)',
    border: '1px solid rgba(232, 83, 10, 0.4)',
    borderRadius: '20px',
    padding: '4px 14px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#E8530A',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '20px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  logoIcon: { fontSize: '36px' },
  logoText: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#E8530A',
    letterSpacing: '-1px',
  },
  headline: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#e8eaf0',
    lineHeight: '1.25',
    marginBottom: '16px',
    letterSpacing: '-0.5px',
  },
  headlineAccent: {
    color: '#E8530A',
  },
  subheadline: {
    color: '#8b95a5',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '32px',
    maxWidth: '520px',
    margin: '0 auto 32px',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0',
    background: '#181b20',
    border: '1px solid #2a2f38',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 12px',
    borderRight: '1px solid #2a2f38',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#E8530A',
    lineHeight: '1',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '11px',
    color: '#555e6e',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    textAlign: 'center',
  },
  features: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '40px',
  },
  featureCard: {
    background: '#181b20',
    border: '1px solid #2a2f38',
    borderRadius: '10px',
    padding: '18px',
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: '24px',
    flexShrink: 0,
    marginTop: '2px',
  },
  featureTitle: {
    color: '#e8eaf0',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  featureDesc: {
    color: '#8b95a5',
    fontSize: '13px',
    lineHeight: '1.5',
  },
  howSection: {
    width: '100%',
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#e8eaf0',
    marginBottom: '20px',
    textAlign: 'center',
  },
  steps: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
    gap: '8px',
  },
  step: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative',
  },
  stepNum: {
    width: '36px',
    height: '36px',
    background: '#E8530A',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '10px',
    zIndex: 1,
    flexShrink: 0,
  },
  stepLine: {
    position: 'absolute',
    top: '18px',
    left: '68%',
    right: '-32%',
    height: '2px',
    background: '#2a2f38',
    zIndex: 0,
  },
  stepTitle: {
    color: '#e8eaf0',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  stepDesc: {
    color: '#555e6e',
    fontSize: '12px',
    lineHeight: '1.4',
  },
  gateCard: {
    width: '100%',
    background: '#181b20',
    border: '1px solid #2a2f38',
    borderRadius: '14px',
    padding: '28px',
    marginBottom: '32px',
  },
  gateHeader: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  lockIcon: {
    fontSize: '28px',
    flexShrink: 0,
  },
  gateTitle: {
    color: '#e8eaf0',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  gateSubtitle: {
    color: '#8b95a5',
    fontSize: '13px',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  input: {
    background: '#1f2329',
    border: '1px solid #2a2f38',
    borderRadius: '8px',
    color: '#e8eaf0',
    fontSize: '15px',
    padding: '12px 14px',
    outline: 'none',
    letterSpacing: '2px',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '13px',
    padding: '10px 14px',
    background: 'rgba(255, 107, 107, 0.08)',
    borderRadius: '6px',
    border: '1px solid rgba(255, 107, 107, 0.2)',
    margin: '0',
    textAlign: 'center',
  },
  btn: {
    background: '#E8530A',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    padding: '13px',
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
    textAlign: 'center',
  },
  contactAccent: {
    color: '#E8530A',
  },
  footer: {
    color: '#555e6e',
    fontSize: '12px',
    textAlign: 'center',
    lineHeight: '1.6',
  },
};
