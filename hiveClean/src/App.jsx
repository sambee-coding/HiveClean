import { useState } from 'react'

// color for each category badge
const CATEGORY_COLORS = {
  Image:     { bg: '#e0f2fe', text: '#0369a1' },
  Video:     { bg: '#fce7f3', text: '#9d174d' },
  Audio:     { bg: '#f3e8ff', text: '#7e22ce' },
  PDF:       { bg: '#fee2e2', text: '#991b1b' },
  Document:  { bg: '#fef9c3', text: '#854d0e' },
  Archive:   { bg: '#ffedd5', text: '#9a3412' },
  Code:      { bg: '#d1fae5', text: '#065f46' },
  Installer: { bg: '#e0e7ff', text: '#3730a3' },
  Other:     { bg: '#f1f5f9', text: '#475569' },
}

function CategoryBadge({ category }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other
  return (
    <span style={{
      background: colors.bg,
      color: colors.text,
      padding: '2px 8px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
    }}>
      {category}
    </span>
  )
}

function App() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleScan() {
    setLoading(true)
    const result = await window.electronAPI.scanDownloads()
    setFiles(result)
    setLoading(false)
  }

  const totalMB = files.reduce((sum, f) => sum + f.sizeInMB, 0).toFixed(1)
  const largeCount = files.filter(f => f.isLarge).length

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '900px' }}>
      <h1>🐝 HiveClean</h1>

      <button
        onClick={handleScan}
        disabled={loading}
        style={{ padding: '8px 20px', cursor: 'pointer', marginBottom: '1rem' }}
      >
        {loading ? 'Scanning...' : 'Scan Downloads'}
      </button>

      {/* summary strip */}
      {files.length > 0 && (
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', color: '#555' }}>
          <span>{files.length} files</span>
          <span>{totalMB} MB total</span>
          {largeCount > 0 && (
            <span style={{ color: '#dc2626', fontWeight: 600 }}>
              ⚠ {largeCount} large file{largeCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {files.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Size</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file.path}
                style={{
                  borderBottom: '1px solid #f3f4f6',
                  // highlight large files with a subtle red background
                  background: file.isLarge ? '#fff1f2' : 'transparent',
                }}
              >
                <td style={{ padding: '8px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </td>
                <td style={{ padding: '8px' }}>
                  <CategoryBadge category={file.category} />
                </td>
                <td style={{ padding: '8px', color: file.isLarge ? '#dc2626' : 'inherit', fontWeight: file.isLarge ? 600 : 400 }}>
                  {file.sizeInMB} MB
                </td>
                <td style={{ padding: '8px', color: '#6b7280' }}>
                  {new Date(file.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App