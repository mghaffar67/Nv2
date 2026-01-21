
import React, { useState, useEffect } from 'react';
import { 
  Database, Download, Upload, RefreshCcw, 
  History, ShieldCheck, AlertTriangle, FileJson, 
  CheckCircle2, Trash2, Globe, Save, Copy, Server, Cpu,
  ShieldAlert, RotateCcw, Loader2, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbRegistry } from '../../../backend_core/utils/db';
import { clsx } from 'clsx';

const DatabaseManager = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [remoteConfig, setRemoteConfig] = useState({ provider: 'MongoDB Atlas', connectionString: '', apiKey: '' });

  useEffect(() => {
    const exports = dbRegistry.getExportHistory();
    setHistory(exports);
    const saved = localStorage.getItem('noor_remote_db_config');
    if (saved) setRemoteConfig(JSON.parse(saved));
  }, []);

  const handleFactoryReset = () => {
    const pass = window.prompt("CRIITICAL WARNING: Kya aap waqai system ko factory reset karna chahte hain? Is se tamam users, history, aur balance delete ho jayen gay. Confirm karne ke liye 'FACTORY-RESET' likhen:");
    if (pass !== 'FACTORY-RESET') return;

    setLoading(true);
    const success = dbRegistry.factoryReset();
    
    setTimeout(() => {
      setLoading(false);
      if (success) {
        setStatus('System Wiped! Registry Synchronized.');
        setTimeout(() => window.location.reload(), 1500);
      }
    }, 1500);
  };

  const handleExport = () => {
    setLoading(true);
    const data = {
      users: dbRegistry.getUsers(),
      tasks: JSON.parse(localStorage.getItem('noor_tasks_db') || '[]'),
      settings: JSON.parse(localStorage.getItem('noor_config') || '{}')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Noor_V3_Registry_${Date.now()}.json`;
    link.click();
    
    dbRegistry.addExportRecord({ name: link.download, version: 'V3', size: (blob.size / 1024).toFixed(2) + ' KB', data });
    setHistory(dbRegistry.getExportHistory());
    setLoading(false);
    setStatus('Registry Exported Locally!');
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="space-y-8 pb-32 animate-fade-in max-w-6xl mx-auto px-1">
      <div className="bg-slate-950 p-8 md:p-12 rounded-[50px] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-5 scale-[3] rotate-12"><Database size={64} /></div>
         <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-3 uppercase italic">Database <span className="text-sky-400">Hub.</span></h2>
            <p className="text-slate-400 text-xs font-medium max-w-xl">Master terminal for system purification and registry synchronization.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 space-y-8">
           {/* FACTORY RESET SECTION */}
           <section className="bg-rose-50 p-8 md:p-10 rounded-[44px] border border-rose-100 space-y-8 shadow-sm">
              <div className="flex items-start gap-6">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm shrink-0 border border-rose-100">
                    <Trash2 size={32} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-rose-900 uppercase tracking-tight mb-2">Registry Purification Protocol</h3>
                    <p className="text-[11px] text-rose-700 leading-relaxed font-medium mb-6">
                       Agar login issues aa rahe hain ya data corrupt ho gaya hai, toh Factory Reset daben. Ye tamaam local storage (sessions, tokens, users) ko clean kar ke fresh build load kar dega.
                    </p>
                    <button 
                      onClick={handleFactoryReset}
                      disabled={loading}
                      className="h-14 px-8 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-100 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <RotateCcw size={18} />} 
                      Run Factory Reset
                    </button>
                 </div>
              </div>
           </section>

           <section className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Globe size={18} className="text-indigo-600" /> Remote Cluster (Cloud)</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">MongoDB Connection URI</label>
                    <input type="password" readOnly placeholder="Locked until production build..." className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-xs outline-none" />
                 </div>
                 <div className="flex gap-3">
                    <button onClick={() => setStatus('Sync logic coming in build v3.5')} className="flex-1 h-14 bg-slate-950 text-white rounded-[22px] font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                       <Cpu size={18} /> Migrate to Cloud
                    </button>
                 </div>
              </div>
           </section>
        </div>

        <div className="xl:col-span-5 space-y-8">
           <section className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Download size={18} className="text-sky-500" /> Export / Restore</h3>
              <div className="space-y-3">
                 <button onClick={handleExport} className="w-full h-14 bg-sky-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-sky-100 flex items-center justify-center gap-3 active:scale-95 transition-all"><Download size={18} /> Save Registry JSON</button>
                 <div className="h-14 w-full bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase border border-slate-100 flex items-center justify-center gap-2 italic">Restoration Restricted</div>
              </div>
              
              <div className="pt-6 border-t border-slate-50">
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4 italic">Registry Audit Logs</p>
                 <div className="space-y-2">
                    {history.length > 0 ? history.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                         <div className="flex items-center gap-3">
                            <FileJson size={14} className="text-indigo-400" />
                            <span className="text-[8px] font-bold text-slate-600 truncate max-w-[120px]">{h.name}</span>
                         </div>
                         <span className="text-[8px] font-black text-slate-400">{h.size}</span>
                      </div>
                    )) : (
                      <p className="text-[8px] font-bold text-slate-300 text-center py-4 uppercase">No recent exports</p>
                    )}
                 </div>
              </div>
           </section>
        </div>
      </div>

      <AnimatePresence>
        {status && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase shadow-2xl z-[100] border border-white/10 flex items-center gap-3"
          >
             <Sparkles size={16} className="text-sky-400" /> {status}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatabaseManager;
