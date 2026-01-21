
import React, { useState, useEffect } from 'react';
import { 
  Database, Download, Upload, RefreshCcw, 
  History, ShieldCheck, AlertTriangle, FileJson, 
  CheckCircle2, Trash2, Search, Filter, Globe, 
  Key, Server, Copy, ExternalLink, Cpu,
  // Added missing Save icon import
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbRegistry } from '../../../backend_core/utils/db';
import { clsx } from 'clsx';

const DatabaseManager = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [selection, setSelection] = useState({ users: true, tasks: true, settings: true });
  
  // Remote DB States
  const [remoteConfig, setRemoteConfig] = useState({
    provider: 'MongoDB Atlas',
    connectionString: '',
    apiKey: '',
    projectId: ''
  });

  useEffect(() => {
    setHistory(dbRegistry.getExportHistory());
    // Load saved remote config if exists
    const saved = localStorage.getItem('noor_remote_db_config');
    if (saved) setRemoteConfig(JSON.parse(saved));
  }, []);

  // Added handleImport to fix the missing function error and provide restore functionality
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        if (data.users) dbRegistry.saveUsers(data.users);
        if (data.tasks) localStorage.setItem('noor_tasks_db', JSON.stringify(data.tasks));
        if (data.settings) localStorage.setItem('noor_config', JSON.stringify(data.settings));
        
        setStatus('Database Nodes Synchronized!');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        alert("Integrity Violation: Invalid backup packet.");
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      const data: any = {};
      if (selection.users) data.users = dbRegistry.getUsers();
      if (selection.tasks) data.tasks = JSON.parse(localStorage.getItem('noor_tasks_db') || '[]');
      if (selection.settings) data.settings = JSON.parse(localStorage.getItem('noor_config') || '{}');

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const version = `V3.${history.length + 1}`;
      const filename = `Noor_Backup_${version}_${new Date().toISOString().split('T')[0]}.json`;
      link.href = url;
      link.download = filename;
      link.click();

      dbRegistry.addExportRecord({ 
        name: filename, 
        version: version,
        size: (blob.size / 1024).toFixed(2) + ' KB',
        data: data // Store for history download simulation
      });
      
      setHistory(dbRegistry.getExportHistory());
      setLoading(false);
      setStatus('Backup Version Created!');
      setTimeout(() => setStatus(null), 3000);
    }, 1000);
  };

  const saveRemoteConfig = () => {
    localStorage.setItem('noor_remote_db_config', JSON.stringify(remoteConfig));
    setStatus('Remote Config Synced!');
    setTimeout(() => setStatus(null), 3000);
  };

  const copyVercelEnv = () => {
    const text = `DATABASE_URL="${remoteConfig.connectionString}"\nDB_PROVIDER="${remoteConfig.provider}"\nAPI_KEY="${remoteConfig.apiKey}"`;
    navigator.clipboard.writeText(text);
    alert("Vercel format copy ho gaya! Ab isay Vercel Dashboard mein paste kar dain.");
  };

  return (
    <div className="space-y-8 pb-32 animate-fade-in max-w-6xl mx-auto px-1">
      
      {/* Header with Hero UI */}
      <div className="bg-slate-950 p-8 md:p-12 rounded-[50px] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-5 scale-[3] rotate-12"><Database size={64} /></div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-400/30 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-sky-400 mb-6">
               <ShieldCheck size={12} /> Markazi Data Control Lab
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-3 uppercase tracking-tighter italic italic">Database <span className="text-sky-400">Lab.</span></h2>
            <p className="text-slate-400 text-xs font-medium max-w-xl leading-relaxed">System ke tamam data points ko yahan se control karain. Remote database ko connect karain ya local backup generate karain.</p>
            
            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md">
               <p className="text-[12px] leading-relaxed text-slate-300 font-medium text-right" dir="rtl">
                 <b>ضروری ہدایت:</b> اگر آپ ویب سائٹ کو Vercel پر چلا رہے ہیں تو نیچے دیے گئے "Remote Connection" سیکشن میں اپنا ڈیٹا بیس لنک لازمی ڈالیں تاکہ آپ کا ڈیٹا ہمیشہ محفوظ رہے۔
               </p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Remote DB & Vercel */}
        <div className="xl:col-span-7 space-y-8">
           
           {/* REMOTE DATABASE CONFIG */}
           <section className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Globe size={18} className="text-indigo-600" /> Remote Connection
                 </h3>
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[8px] font-black uppercase border border-indigo-100">Live Sync</span>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Database Provider</label>
                    <select 
                      value={remoteConfig.provider}
                      onChange={(e) => setRemoteConfig({...remoteConfig, provider: e.target.value})}
                      className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                    >
                       <option>MongoDB Atlas (Recommended)</option>
                       <option>Supabase (PostgreSQL)</option>
                       <option>Firebase Realtime</option>
                       <option>Custom SQL/NoSQL</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center px-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connection URI / Link</label>
                       <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest italic" dir="rtl">یہ لنک آپ کو ڈیٹا بیس کی ویب سائٹ سے ملے گا</span>
                    </div>
                    <div className="relative">
                       <Server size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                         type="password"
                         value={remoteConfig.connectionString}
                         onChange={(e) => setRemoteConfig({...remoteConfig, connectionString: e.target.value})}
                         placeholder="mongodb+srv://admin:password@cluster0..."
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-xs outline-none focus:bg-white transition-all"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">API Key / Secret</label>
                       <div className="relative">
                          <Key size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input 
                            type="text"
                            value={remoteConfig.apiKey}
                            onChange={(e) => setRemoteConfig({...remoteConfig, apiKey: e.target.value})}
                            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[10px] outline-none"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Project ID / Name</label>
                       <input 
                         type="text"
                         value={remoteConfig.projectId}
                         onChange={(e) => setRemoteConfig({...remoteConfig, projectId: e.target.value})}
                         className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[10px] outline-none"
                       />
                    </div>
                 </div>
              </div>

              <div className="flex gap-3 pt-4">
                 <button 
                   onClick={saveRemoteConfig}
                   className="flex-1 h-14 bg-slate-950 text-white rounded-[22px] font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                 >
                    {/* Fixed: Added missing Save icon from lucide-react */}
                    <Save size={18} /> Connect Remote DB
                 </button>
                 <button 
                   onClick={copyVercelEnv}
                   className="px-8 h-14 bg-indigo-50 text-indigo-600 rounded-[22px] font-black text-[10px] uppercase tracking-widest border border-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all"
                 >
                    <Copy size={16} /> Vercel Setup
                 </button>
              </div>
           </section>

           {/* HELP BOX */}
           <div className="bg-amber-50 p-8 rounded-[40px] border border-amber-100 flex items-start gap-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                 <Cpu size={28} />
              </div>
              <div>
                 <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight mb-2">Vercel Deployment Guideline</h4>
                 <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                    Agar aap Noor V3 ko Vercel par live chalana chahtay hain, toh aap ko apna data MongoDB Atlas mein rakhna hoga. Yahan settings save karne ke baad "Vercel Setup" par click karain aur keys ko Vercel Dashboard ke "Environment Variables" mein daal dain.
                 </p>
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: Backup & History */}
        <div className="xl:col-span-5 space-y-8">
           
           {/* SELECTION & EXPORT */}
           <section className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                 <Filter size={18} className="text-sky-500" /> Export Logic
              </h3>

              <div className="space-y-3">
                 {[
                   { id: 'users', label: 'Associate Accounts', desc: 'Balances & Profiles' },
                   { id: 'tasks', label: 'Task Stations', desc: 'Active Earning Nodes' },
                   { id: 'settings', label: 'Platform Config', desc: 'Gateways & Aesthetics' }
                 ].map(item => (
                   <button 
                    key={item.id} 
                    onClick={() => setSelection({...selection, [item.id]: !(selection as any)[item.id]})}
                    className={clsx(
                      "w-full p-5 rounded-3xl border-2 text-left transition-all flex items-center justify-between group",
                      (selection as any)[item.id] ? "border-slate-900 bg-slate-50" : "border-slate-50 bg-white"
                    )}
                   >
                     <div className="overflow-hidden">
                        <h4 className="text-xs font-black text-slate-900 uppercase">{item.label}</h4>
                        <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-1">{item.desc}</p>
                     </div>
                     <div className={clsx(
                       "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                       (selection as any)[item.id] ? "bg-slate-900 border-slate-900 text-white" : "border-slate-200"
                     )}>
                        {(selection as any)[item.id] && <CheckCircle2 size={12} strokeWidth={4} />}
                     </div>
                   </button>
                 ))}
              </div>

              <div className="pt-4 space-y-3">
                 <button 
                  onClick={handleExport}
                  disabled={loading}
                  className="w-full h-14 bg-sky-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                 >
                   {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Download size={18} />}
                   {loading ? 'Processing Version...' : 'Create Local Backup'}
                 </button>
                 
                 <div className="relative w-full">
                    {/* Fixed: Implemented handleImport to resolve the missing function error */}
                    <input type="file" onChange={handleImport} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="h-14 w-full bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 flex items-center justify-center gap-2 transition-all hover:bg-slate-100">
                       <Upload size={18} /> Restore Database
                    </div>
                 </div>
              </div>
           </section>

           {/* VERSION HISTORY */}
           <section className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-sm h-full">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                 <History size={18} className="text-indigo-600" /> Version Records
              </h3>

              <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                 {history.length > 0 ? history.map((item) => (
                   <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-indigo-200 transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300 shadow-sm border border-slate-100 group-hover:text-indigo-500 group-hover:border-indigo-100 transition-all">
                            <FileJson size={20} />
                         </div>
                         <div className="overflow-hidden">
                            <p className="text-[10px] font-black text-slate-800 uppercase truncate">Ver: {item.version || 'V3.X'}</p>
                            <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase truncate max-w-[150px]">{new Date(item.timestamp).toLocaleString()}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                         <button 
                           onClick={() => {
                             const blob = new Blob([JSON.stringify(item.data || {}, null, 2)], { type: 'application/json' });
                             const url = URL.createObjectURL(blob);
                             const link = document.createElement('a');
                             link.href = url;
                             link.download = item.name;
                             link.click();
                           }}
                           className="p-2 bg-white text-indigo-600 rounded-lg shadow-sm border border-slate-100 hover:bg-indigo-600 hover:text-white transition-all"
                         >
                            <Download size={14} />
                         </button>
                      </div>
                   </div>
                 )) : (
                   <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200"><Database size={24}/></div>
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Logs Detected</p>
                   </div>
                 )}
              </div>
           </section>
        </div>

      </div>

      <AnimatePresence>
        {status && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl z-[100] border border-white/10 flex items-center gap-3">
             <ShieldCheck size={16} className="text-sky-400" /> {status}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatabaseManager;
