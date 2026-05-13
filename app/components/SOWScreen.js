'use client';

export default function SOWScreen({ projectName, sow, onEditItems }) {
  const handleDownload = () => {
    const blob = new Blob([sow], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(projectName)}-SOW.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⚒</span>
            <span style={styles.logoText}>Demolytics</span>
          </div>
          <div style={styles.projectBadge}>{projectName}</div>
        </div>
        <div style={styles.sowLabel}>
          <span style={styles.sowBadge}>Statement of Work</span>
          <span style={styles.sowReady}>✓ Ready</span>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.sowCard}>
          <div style={styles.sowCardHeader}>
            <span style={styles.sowCardTitle}>Generated Document</span>
            <span style={styles.charCount}>{sow.length.toLocaleString()} chars</span>
          </div>
          <textarea
            readOnly
            value={sow}
            style={styles.sowTextarea}
            spellCheck={false}
          />
        </div>
      </main>

      <footer style={styles.footer}>
        <button onClick={onEditItems} style={styles.editBtn}>
          ← Edit Items
        </button>
        <button onClick={handleDownload} style={styles.downloadBtn}>
          ↓ Download SOW
        </button>
      </footer>
    </div>
  );
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'sow';
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '72px',
  },
  header: {
    background: '#181b20',
    borderBottom: '1px solid #2a2f38',
    padding: '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: { fontSize: '20px' },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#E8530A',
  },
  projectBadge: {
    background: '#1f2329',
    border: '1px solid #2a2f38',
    borderRadius: '20px',
    padding: '4px 12px',
    fontSize: '13px',
    color: '#8b95a5',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  sowLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sowBadge: {
    background: 'rgba(232, 83, 10, 0.15)',
    border: '1px solid rgba(232, 83, 10, 0.4)',
    borderRadius: '20px',
    padding: '3px 12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#E8530A',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sowReady: {
    fontSize: '13px',
    color: '#2ecc71',
    fontWeight: '500',
  },
  main: {
    flex: 1,
    padding: '16px',
    maxWidth: '800px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  sowCard: {
    flex: 1,
    background: '#181b20',
    border: '1px solid #2a2f38',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 200px)',
  },
  sowCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: '#1f2329',
    borderBottom: '1px solid #2a2f38',
  },
  sowCardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#8b95a5',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  charCount: {
    fontSize: '12px',
    color: '#555e6e',
  },
  sowTextarea: {
    flex: 1,
    background: '#181b20',
    border: 'none',
    color: '#e8eaf0',
    fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace',
    fontSize: '13px',
    lineHeight: '1.7',
    padding: '20px',
    resize: 'none',
    outline: 'none',
    width: '100%',
    minHeight: '500px',
    whiteSpace: 'pre-wrap',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#181b20',
    borderTop: '1px solid #2a2f38',
    padding: '12px 16px',
    display: 'flex',
    gap: '12px',
    zIndex: 10,
  },
  editBtn: {
    background: '#1f2329',
    border: '1px solid #2a2f38',
    borderRadius: '8px',
    color: '#8b95a5',
    fontSize: '14px',
    fontWeight: '500',
    padding: '10px 20px',
    cursor: 'pointer',
  },
  downloadBtn: {
    flex: 1,
    background: '#E8530A',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
};
