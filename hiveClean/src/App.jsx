import { useState } from "react";

// ─── CONSTANTS ────────────────────────────────────────────
const CATEGORY_COLORS = {
  Image: "bg-blue-100 text-blue-700",
  Video: "bg-pink-100 text-pink-700",
  Audio: "bg-purple-100 text-purple-700",
  PDF: "bg-red-100 text-red-700",
  Document: "bg-yellow-100 text-yellow-700",
  Archive: "bg-orange-100 text-orange-700",
  Code: "bg-green-100 text-green-700",
  Installer: "bg-indigo-100 text-indigo-700",
  Other: "bg-gray-100 text-gray-600",
};

const CATEGORY_ICONS = {
  Image: "🖼",
  Video: "🎬",
  Audio: "🎵",
  PDF: "📄",
  Document: "📝",
  Archive: "🗜",
  Code: "💻",
  Installer: "⚙",
  Other: "📦",
};
// ──────────────────────────────────────────────────────────

// ─── SMALL COMPONENTS ─────────────────────────────────────
function CategoryBadge({ category }) {
  // here we use the category to determine the badge color and the icon. we have mapping objects for both colors and icons, and we default to 'other' is the category is not recognized.
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors}`}
    >
      {CATEGORY_ICONS[category]} {category}
    </span>
  );
}

function StatCard({ label, value, sub, accent }) {
  //this is reusable component for the statics cards at the top, it takes a label, a value, an optional subtext and
  //an accent color for the card background. it renders a simple card with the label, value and subtext styled accordingly.

  return (
    <div className={`rounded-xl p-4 flex flex-col gap-1 ${accent}`}>
      <span className="text-xs font-medium uppercase tracking-wide opacity-70">
        {label}
      </span>
      <span className="text-2xl font-bold">{value}</span>
      {sub && <span className="text-xs opacity-60">{sub}</span>}
    </div>
  );
}
// ──────────────────────────────────────────────────────────

export default function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [scanned, setScanned] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  // ─── SCAN ───────────────────────────────────────────────
  async function handleScan() {
    setLoading(true);
    const result = await window.electronAPI.scanDownloads();
    setFiles(result);
    setScanned(true);
    setLoading(false);
  }

  async function handleDelete() {
    const result = await window.electronAPI.deleteFiles(selectedFile);

    // If success
    if (result.success) {
      setDeletedFiles([
        ...deletedFiles,
        ...files.filter((f) => selectedFile.includes(f.path)),
      ]);
      setFiles(files.filter((f) => !selectedFile.includes(f.path)));
      setSelectedFile([]);
      setShowModal(false);

      console.log(`${result.deleted} files deleted`);
    } else {
      console.error(result.error);
    }
  }

  function handleCheckboxClick(filePath) {
    if (selectedFile.includes(filePath)) {
      setSelectedFile(selectedFile.filter((f) => f !== filePath));
    } else {
      setSelectedFile([...selectedFile, filePath]);
    }
  }

  // ─── DERIVED DATA ────────────────────────────────────────
  const categories = ["All", ...new Set(files.map((f) => f.category))];

  const displayed =
    filter === "All" ? files : files.filter((f) => f.category === filter);

  const totalMB = files.reduce((sum, f) => sum + f.sizeInMB, 0);
  const largeFiles = files.filter((f) => f.isLarge);
  const largestFile = files[0]; // already sorted largest first from Day 3
  const buttonShow = selectedFile.length > 0;
  const selectAll =
    displayed.length > 0 &&
    displayed.every((f) => selectedFile.includes(f.path));

  // ─── RENDER ──────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-amber-50 text-gray-800 font-sans">
      {/* ── SIDEBAR ── */}
      <aside className="w-56 bg-gray border-r border-gray-200 flex flex-col py-6 px-4 gap-6 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2">
          <span className="text-2xl">🐝</span>
          <span className="font-bold text-lg tracking-tight">HiveClean</span>
        </div>

        {/* Scan button */}
        <button
          onClick={handleScan}
          disabled={loading} // button unclickable while scanning
          className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 
                     text-white font-bold py-4 px-2 rounded-lg transition-colors"
        >
          {loading ? "Scanning..." : "⚡ Scan Downloads"}{" "}
          {/* the button  text xhanges to indicate loading state*/}
        </button>

        {/* Category filter list */}
        {scanned && !showRecycleBin && (
          <nav className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-widest text-gray-400 px-2 mb-1">
              Filter
            </p>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors
                  ${
                    filter === cat
                      ? "bg-amber-50 text-amber-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {CATEGORY_ICONS[cat] ?? "📂"} {cat}
                <span className="float-right text-xs text-gray-400">
                  {cat === "All"
                    ? files.length
                    : files.filter((f) => f.category === cat).length}
                </span>
              </button>
            ))}
          </nav>
        )}
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex gap-5 ">
          <div>
            <h1 className="text-xl font-bold">Downloads Cleaner</h1>
            <p className="text-sm text-gray-500">
              {scanned
                ? `${files.length} files found in your Downloads folder`
                : 'Click "Scan Downloads" to get started'}
            </p>
          </div>
          <button
            className=" px-2 py-4 text-amber-50 cursor-pointer rounded-2xl bg-amber-500 hover:bg-amber-300"
            onClick={() => setShowRecycleBin(!showRecycleBin)}
          >
            {showRecycleBin ? "← Back" : "🗑 Recycle Bin"}
          </button>
        </div>
        {showRecycleBin && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">
                🗑 Recycle Bin — {deletedFiles.length} files
              </span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Category</th>
                  <th className="text-left px-4 py-2">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {deletedFiles.map((file) => (
                  <tr key={file.path}>
                    {/* your <td> cells here */}
                    <td className="px-4 py-2.5 max-w-xs">
                      <span className="block truncate font-medium text-gray-700">
                        {file.name}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 max-w-xs">
                      <span className="block truncate font-medium text-gray-700">
                        {file.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 max-w-xs">
                      <span className="block truncate font-medium text-gray-700">
                        {file.sizeInMB}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── STAT CARDS ── */}
        {scanned && !showRecycleBin && (
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Total Files"
              value={files.length}
              sub="in Downloads folder"
              accent="bg-white border border-gray-200"
            />
            <StatCard
              label="Total Size"
              value={`${totalMB.toFixed(1)} MB`}
              sub="across all files"
              accent="bg-white border border-gray-200"
            />
            <StatCard
              label="Large Files"
              value={largeFiles.length}
              sub={
                largeFiles.length > 0
                  ? `Largest: ${largestFile?.sizeInMB} MB`
                  : "Nothing over 50MB"
              }
              accent={
                largeFiles.length > 0
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-white border border-gray-200"
              }
            />
          </div>
        )}

        {/* ── FILE TABLE ── */}
        {scanned && !showRecycleBin && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden ">
            {/* Table header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {filter === "All" ? "All Files" : filter} —{" "}
                <span className="font-normal text-gray-400">
                  {displayed.length} items
                </span>
              </span>
              {buttonShow && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  onClick={() => setShowModal(true)}
                >
                  🗑 Delete ({selectedFile.length})
                </button>
              )}
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Category</th>
                  <th className="text-left px-4 py-2">Size</th>
                  <th className="text-left px-1.5 py-2">Created</th>
                  <th className="text-left px-1 py-2 w-12">
                    <div className="flex items-center gap-1">
                      <span>All</span>
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={() => {
                          if (selectAll) {
                            setSelectedFile([]);
                          } else {
                            setSelectedFile(displayed.map((f) => f.path));
                          }
                        }}
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayed.map((file) => (
                  <tr
                    key={file.path}
                    className={`hover:bg-gray-50 transition-colors
                      ${file.isLarge ? "bg-red-50 hover:bg-red-100" : ""}`}
                  >
                    {/* Name */}
                    <td className="px-4 py-2.5 max-w-xs">
                      <span className="block truncate font-medium text-gray-700">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {file.extension || "no ext"}
                      </span>
                      {file.isDuplicate && (
                        <div className="text-red-600 text-xs">
                          ⚠️ Duplicate of: {file.duplicateOf}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-2.5">
                      <CategoryBadge category={file.category} />
                    </td>

                    {/* Size */}
                    <td
                      className={`px-4 py-2.5 font-medium
                      ${file.isLarge ? "text-red-600" : "text-gray-600"}`}
                    >
                      {file.sizeInMB} MB
                      {file.isLarge && (
                        <span className="ml-1 text-xs text-red-400">
                          ⚠ large
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-2.5 text-gray-400">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </td>
                    {/*selcted file*/}
                    <td className="px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={selectedFile.includes(file.path)}
                        onChange={() => handleCheckboxClick(file.path)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty state */}
            {displayed.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No files in this category
              </div>
            )}
          </div>
        )}

        {/* Empty state before scan */}
        {!scanned && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-3">
            <span className="text-6xl">🐝</span>
            <p className="text-lg font-medium">Ready to clean your Downloads</p>
            <p className="text-sm">
              Hit the scan button to see what's in there
            </p>
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Delete files?</h2>
              <p className="text-sm text-gray-600 mb-4">
                You are about to delete {selectedFile.length} files
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 "
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDelete()}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
