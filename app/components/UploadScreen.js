'use client';

import { useState, useRef, useCallback } from 'react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
const ACCEPTED_EXT = '.jpg,.jpeg,.png,.gif,.webp,.pdf';

export default function UploadScreen({ onAnalyze }) {
  const [projectName, setProjectName] = useState('Commercial Demo Project');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('Unsupported file type. Please upload an image (JPG, PNG, GIF, WebP) or PDF.');
      return;
    }
    setError('');
    setFile(f);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      handleFile(dropped);
    },
    [handleFile]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleInputChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a blueprint file.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const base64Data = await readFileAsBase64(file);
      await onAnalyze({ projectName, file, base64Data, mediaType: file.type });
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isImage = file && file.type.startsWith('image/');
  const isPdf = file && file.type === 'application/pdf';

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚒</span>
          <span style={styles.logoText}>Demolytics</span>
        </div>
        <p style={styles.tagline}>Blueprint → Statement of Work</p>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>New Project</h2>

          <label style={styles.label}>Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={styles.input}
            placeholder="Commercial Demo Project"
          />

          <label style={styles.label}>Blueprint File</label>
          <div
            style={{
              ...styles.dropzone,
              ...(dragging ? styles.dropzoneDragging : {}),
              ...(file ? styles.dropzoneHasFile : {}),
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXT}
              onChange={handleInputChange}
              style={{ display: 'none' }}
            />

            {!file ? (
              <div style={styles.dropzoneEmpty}>
                <div style={styles.dropzoneIcon}>📐</div>
                <p style={styles.dropzoneText}>
                  <strong>Drag & drop</strong> your blueprint here
                </p>
                <p style={styles.dropzoneSubtext}>or click to browse</p>
                <p style={styles.dropzoneTypes}>JPG, PNG, GIF, WebP, PDF</p>
              </div>
            ) : (
              <div style={styles.filePreview}>
                {isImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Blueprint preview"
                    style={styles.imageThumb}
                  />
                )}
                {isPdf && <div style={styles.pdfIcon}>📄</div>}
                <div style={styles.fileInfo}>
                  <p style={styles.fileName}>{file.name}</p>
                  <p style={styles.fileSize}>{formatBytes(file.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  style={styles.removeBtn}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            style={{
              ...styles.analyzeBtn,
              ...(loading || !file ? styles.analyzeBtnDisabled : {}),
            }}
          >
            {loading ? (
              <span style={styles.btnInner}>
                <span style={styles.spinner} /> Analyzing Blueprint…
              </span>
            ) : (
              <span style={styles.btnInner}>⚒ Analyze Blueprint</span>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px 16px 48px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    marginTop: '24px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '6px',
  },
  logoIcon: {
    fontSize: '28px',
  },
  logoText: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#E8530A',
    letterSpacing: '-0.5px',
  },
  tagline: {
    color: '#8b95a5',
    fontSize: '14px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  main: {
    width: '100%',
    maxWidth: '520px',
  },
  card: {
    background: '#181b20',
    border: '1px solid #2a2f38',
    borderRadius: '14px',
    padding: '32px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#e8eaf0',
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#8b95a5',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    background: '#1f2329',
    border: '1px solid #2a2f38',
    borderRadius: '8px',
    color: '#e8eaf0',
    fontSize: '15px',
    padding: '10px 14px',
    outline: 'none',
    marginBottom: '24px',
    transition: 'border-color 0.15s',
  },
  dropzone: {
    border: '2px dashed #2a2f38',
    borderRadius: '10px',
    padding: '32px 16px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
    marginBottom: '20px',
    background: '#1f2329',
  },
  dropzoneDragging: {
    borderColor: '#E8530A',
    background: 'rgba(232, 83, 10, 0.06)',
  },
  dropzoneHasFile: {
    cursor: 'default',
    border: '1px solid #2a2f38',
    padding: '16px',
  },
  dropzoneEmpty: {
    textAlign: 'center',
  },
  dropzoneIcon: {
    fontSize: '36px',
    marginBottom: '12px',
  },
  dropzoneText: {
    color: '#8b95a5',
    fontSize: '15px',
    marginBottom: '4px',
  },
  dropzoneSubtext: {
    color: '#555e6e',
    fontSize: '13px',
    marginBottom: '10px',
  },
  dropzoneTypes: {
    color: '#555e6e',
    fontSize: '12px',
    background: '#252a31',
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
  },
  filePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  imageThumb: {
    width: '64px',
    height: '64px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #2a2f38',
    flexShrink: 0,
  },
  pdfIcon: {
    fontSize: '40px',
    width: '64px',
    textAlign: 'center',
    flexShrink: 0,
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    color: '#e8eaf0',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  fileSize: {
    color: '#555e6e',
    fontSize: '13px',
    marginTop: '2px',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#555e6e',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px 8px',
    borderRadius: '4px',
    flexShrink: 0,
    transition: 'color 0.15s',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '13px',
    marginBottom: '16px',
    padding: '10px 14px',
    background: 'rgba(255, 107, 107, 0.08)',
    borderRadius: '6px',
    border: '1px solid rgba(255, 107, 107, 0.2)',
  },
  analyzeBtn: {
    width: '100%',
    background: '#E8530A',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  analyzeBtnDisabled: {
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
