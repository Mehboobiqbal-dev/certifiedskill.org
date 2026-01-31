
import { useState, useEffect } from 'react';
import { Play, RefreshCw, Smartphone, Monitor } from 'lucide-react';

export default function CodeEditor({ initialCode = '', language = 'html' }) {
  const [code, setCode] = useState(initialCode);
  const [srcDoc, setSrcDoc] = useState('');
  const [viewMode, setViewMode] = useState('desktop'); // desktop, mobile

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${code}</body>
        </html>
      `);
    }, 500);

    return () => clearTimeout(timeout);
  }, [code]);

  const isWebLanguage = ['html', 'css', 'javascript'].includes(language.toLowerCase());

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white mt-8 mb-12">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="ml-3 text-sm font-semibold text-gray-600">
            {isWebLanguage ? 'Try it Yourself' : `${language.charAt(0).toUpperCase() + language.slice(1)} Example`}
          </span>
        </div>
        {isWebLanguage && (
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
              className="p-1.5 text-gray-500 hover:text-indigo-600 transition-colors rounded-md hover:bg-white"
              title="Toggle View"
            >
              {viewMode === 'desktop' ? <Smartphone size={18} /> : <Monitor size={18} />}
            </button>
            <button 
              onClick={() => setCode(initialCode)}
              className="p-1.5 text-gray-500 hover:text-indigo-600 transition-colors rounded-md hover:bg-white"
              title="Reset"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Editor & Preview Area */}
      <div className="flex-1 flex flex-col md:flex-row h-full">
        {/* Input */}
        <div className={`flex-1 border-b md:border-b-0 ${isWebLanguage ? 'md:border-r' : ''} border-gray-200 bg-[#1e1e1e] relative group`}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm bg-transparent text-gray-100 resize-none focus:outline-none leading-relaxed"
            spellCheck="false"
            readOnly={!isWebLanguage} // Read-only for non-web langs for now
          />
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
                {isWebLanguage ? 'Editable' : 'Read Only'}
            </span>
          </div>
        </div>

        {/* Output - Only for Web Languages */}
        {isWebLanguage && (
            <div className={`flex-1 bg-white relative ${viewMode === 'mobile' ? 'flex justify-center bg-gray-100 p-4' : ''}`}>
               <div className={`${viewMode === 'mobile' ? 'w-[375px] h-[667px] shadow-2xl rounded-3xl border-8 border-gray-800 bg-white overflow-hidden' : 'w-full h-full'}`}>
                 <iframe
                   srcDoc={srcDoc}
                   title="output"
                   sandbox="allow-scripts"
                   width="100%"
                   height="100%"
                   className="border-none"
                 />
               </div>
            </div>
        )}
      </div>
    </div>
  );
}
