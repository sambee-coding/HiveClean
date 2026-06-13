import {useState} from 'react';

const CATEGORY_COLORS = {
  Image:     'bg-blue-100 text-blue-700',
  Video:     'bg-pink-100 text-pink-700',
  Audio:     'bg-purple-100 text-purple-700',
  PDF:       'bg-red-100 text-red-700',
  Document:  'bg-yellow-100 text-yellow-700',
  Archive:   'bg-orange-100 text-orange-700',
  Code:      'bg-green-100 text-green-700',
  Installer: 'bg-indigo-100 text-indigo-700',
  Other:     'bg-gray-100 text-gray-600',
}

const CATEGORY_ICONS = {
  Image:     '🖼',
  Video:     '🎬',
  Audio:     '🎵',
  PDF:       '📄',
  Document:  '📝',
  Archive:   '🗜',
  Code:      '💻',
  Installer: '⚙',
  Other:     '📦',
}
export default function App(){

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('All');
    const [scanned, setScanned] = useState(false);

   async function handleScan() {
       setLoading(true);
       const result = await window.electronAPI.scanDownloads();
       setFiles(result);
       setScanned(true);
       setLoading(false);
    }


    const categories = ['All', ...new Set(files.map(f => f.category))]
    return(

       <div className="flex h-screen bg-amber-50 text-gray-800 font-sans">
        <aside className="w-56 bg-gray border-r border-gray-200 flex flex-col py-6 px-4 gap-6 shrink-0">
            {/* logo */}
            <div className='flex items-center gap-2'>
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
          {loading ? 'Scanning...' : '⚡ Scan Downloads'} {/* the button  text xhanges to indicate loading state*/}
        </button>

         {/* Category filter list */}
        {scanned && (
          <nav className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-widest text-gray-400 px-2 mb-1">
              Filter
            </p>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)} 
                className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors
                  ${filter === cat
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {CATEGORY_ICONS[cat] ?? '📂'} {cat}
                <span className="float-right text-xs text-gray-400">
                  {cat === 'All'
                    ? files.length
                    : files.filter(f => f.category === cat).length}
                </span>
              </button>
            ))}
          </nav>
        )}

        </aside>
       </div>
    )
}
