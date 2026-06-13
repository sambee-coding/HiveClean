import {useState} from 'react';


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

        </aside>
       </div>
    )
}
