'use client';

import { useState, useMemo } from 'react';

const CATEGORIES = ['Flooring', 'Drywall/Walls', 'Ceiling', 'Cabinetry', 'Doors', 'Windows', 'Fixtures', 'Other'];

const CATEGORY_ICONS = {
  'Flooring': '🪵',
  'Drywall/Walls': '🧱',
  'Ceiling': '🔲',
  'Cabinetry': '🗄️',
  'Doors': '🚪',
  'Windows': '🪟',
  'Fixtures': '💡',
  'Other': '📦',
};

export default function ReviewScreen({ projectName, items, onBack, onGenerate }) {
  const [selected, setSelected] = useState(() => new Set(items.map((_, i) => i)));
  const [loading, setLoading] = useState(false);

  const floors = useMemo(() => {
    const s = new Set(items.map((item) => item.floor));
    return s.size;
  }, [items]);

  const toggleItem = (index) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleCategory = (catItems) => {
    const indices = catItems.map((item) => item._index);
    const allSelected = indices.every((i) => selected.has(i));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) indices.forEach((i) => next.delete(i));
      else indices.forEach((i) => next.add(i));
      return next;
    });
  };

  const grouped = useMemo(() => {
    const map = {};
    CATEGORIES.forEach((cat) => (map[cat] = []));
    items.forEach((item, i) => {
      const cat = CATEGORIES.includes(item.category) ? item.category : 'Other';
      map[cat].push({ ...item, _index: i });
    });
    return map;
  }, [items]);

  const handleGenerate = async () => {
    const selectedItems = items.filter((_, i) => selected.has(i));
    if (selectedItems.length === 0) return;
    setLoading(true);
    try {
      await onGenerate(selectedItems);
    } finally {
      setLoading(false);
    }
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
        <div style={styles.statsBar}>
          <StatPill label="Items Found" value={items.length} />
          <div style={styles.statDivider} />
          <StatPill label="Selected" value={selected.size} accent />
          <div style={styles.statDivider} />
          <StatPill label="Floors" value={floors} />
        </div>
      </header>

      <main style={styles.main}>
        {CATEGORIES.map((cat) => {
          const catItems = grouped[cat];
          if (catItems.length === 0) return null;
          const allSelected = catItems.every((item) => selected.has(item._index));
          const someSelected = catItems.some((item) => selected.has(item._index));

          return (
            <div key={cat} style={styles.categoryBlock}>
              <div style={styles.categoryHeader} onClick={() => toggleCategory(catItems)}>
                <div style={styles.categoryLeft}>
                  <span style={styles.catIcon}>{CATEGORY_ICONS[cat]}</span>
                  <span style={styles.catName}>{cat}</span>
                  <span style={styles.catCount}>{catItems.length}</span>
                </div>
                <div
                  style={{
                    ...styles.categoryCheckbox,
                    ...(allSelected ? styles.checkboxChecked : someSelected ? styles.checkboxIndeterminate : {}),
                  }}
                >
                  {allSelected ? '✓' : someSelected ? '–' : ''}
                </div>
              </div>

              <div style={styles.itemList}>
                {catItems.map((item) => {
                  const isChecked = selected.has(item._index);
                  return (
                    <div
                      key={item._index}
                      style={{
                        ...styles.itemRow,
                        ...(isChecked ? styles.itemRowChecked : styles.itemRowUnchecked),
                      }}
                      onClick={() => toggleItem(item._index)}
                    >
                      <div
                        style={{
                          ...styles.checkbox,
                          ...(isChecked ? styles.checkboxChecked : {}),
                        }}
                      >
                        {isChecked && '✓'}
                      </div>
                      <div style={styles.itemDetails}>
                        <span style={styles.itemDesc}>{item.description}</span>
                        <span style={styles.itemFloor}>Floor {item.floor}</span>
                      </div>
                      <div style={styles.itemQty}>
                        <span style={styles.qtyNum}>{item.qty}</span>
                        <span style={styles.qtyUnit}>{item.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      <footer style={styles.footer}>
        <button onClick={onBack} style={styles.backBtn}>
          ← Back
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading || selected.size === 0}
          style={{
            ...styles.generateBtn,
            ...(loading || selected.size === 0 ? styles.generateBtnDisabled : {}),
          }}
        >
          {loading ? (
            <span style={styles.btnInner}>
              <span style={styles.spinner} /> Generating SOW…
            </span>
          ) : (
            <span style={styles.btnInner}>Generate SOW →</span>
          )}
        </button>
      </footer>
    </div>
  );
}

function StatPill({ label, value, accent }) {
  return (
    <div style={styles.statPill}>
      <span style={{ ...styles.statValue, ...(accent ? styles.statValueAccent : {}) }}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '80px',
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
    marginBottom: '14px',
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
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    background: '#1f2329',
    border: '1px solid #2a2f38',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  statPill: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 12px',
    gap: '2px',
  },
  statDivider: {
    width: '1px',
    height: '36px',
    background: '#2a2f38',
    flexShrink: 0,
  },
  statValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#e8eaf0',
    lineHeight: '1',
  },
  statValueAccent: {
    color: '#E8530A',
  },
  statLabel: {
    fontSize: '11px',
    color: '#555e6e',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  main: {
    flex: 1,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '700px',
    width: '100%',
    margin: '0 auto',
  },
  categoryBlock: {
    background: '#181b20',
    border: '1px solid #2a2f38',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    cursor: 'pointer',
    background: '#1f2329',
    borderBottom: '1px solid #2a2f38',
    userSelect: 'none',
  },
  categoryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  catIcon: { fontSize: '18px' },
  catName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#e8eaf0',
  },
  catCount: {
    background: '#2a2f38',
    borderRadius: '12px',
    padding: '1px 8px',
    fontSize: '12px',
    color: '#8b95a5',
    fontWeight: '500',
  },
  categoryCheckbox: {
    width: '20px',
    height: '20px',
    border: '2px solid #404857',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#fff',
    flexShrink: 0,
  },
  checkboxChecked: {
    background: '#E8530A',
    borderColor: '#E8530A',
  },
  checkboxIndeterminate: {
    background: 'rgba(232, 83, 10, 0.3)',
    borderColor: '#E8530A',
    color: '#E8530A',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #2a2f38',
    transition: 'background 0.1s',
    userSelect: 'none',
  },
  itemRowChecked: {
    background: 'transparent',
  },
  itemRowUnchecked: {
    background: 'transparent',
    opacity: 0.5,
  },
  checkbox: {
    width: '18px',
    height: '18px',
    border: '2px solid #404857',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    color: '#fff',
    flexShrink: 0,
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  itemDesc: {
    color: '#e8eaf0',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemFloor: {
    color: '#555e6e',
    fontSize: '12px',
  },
  itemQty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  qtyNum: {
    color: '#e8eaf0',
    fontSize: '15px',
    fontWeight: '600',
  },
  qtyUnit: {
    color: '#555e6e',
    fontSize: '11px',
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
  backBtn: {
    background: '#1f2329',
    border: '1px solid #2a2f38',
    borderRadius: '8px',
    color: '#8b95a5',
    fontSize: '14px',
    fontWeight: '500',
    padding: '10px 20px',
    cursor: 'pointer',
  },
  generateBtn: {
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
  generateBtnDisabled: {
    background: '#3a3f47',
    color: '#555e6e',
    cursor: 'not-allowed',
  },
  btnInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },
};
