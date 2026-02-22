import React, { useState } from 'react';
import { 
  Database, ShieldCheck, Key, Server, Eye, EyeOff, 
  RefreshCw, Save, AlertTriangle, Terminal,
  Lock, CheckCircle2, Sliders, Box, Cpu, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const DatabaseManager = () => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [showMongo, setShowMongo] = useState(false);
  const [isConnected, setIsConnected] = useState(true); 
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    MONGO_URI: 'mongodb+srv://noor_admin:v3_secure_node@cluster0.pkr.mongodb.net/noor_production',
    JWT_SECRET: 'NOOR_CORE_STRICT_V3_ENCRYPTION_KEY',
    NODE_ENV: 'Production'
  });

  const handleSave = async () => {
    const confirmed = window.confirm("Security Warning: Changing these settings will restart the server. Proceed?");
    if (!confirmed) return;

    setSaveLoading(true);
    try {
      await new Promise(r => setTimeout(r, 2000)); 
      setStatusMsg("Database synchronized. Restarting services...");
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err: any) {
      alert("Error saving settings.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div>
           <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3 leading-none">
             <Database size={28} className="text-indigo-600" /> Database Settings.
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px] mt-2 italic">Core Database Connection & Encryption Settings</p>
        </div>
        <div className={clsx(
           "px-5 py-3 rounded-2xl border flex items-center gap-3 shadow-lg",
           isConnected ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
        )}>
           <div className={clsx("w-2 h-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
           <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isConnected ? "Database Online" : "Disconnected"}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Connection Form */}
        <div className="xl:col-span-8">
           <section className="bg-slate-950 p-1.5 rounded-[48px] shadow-2xl relative overflow-hidden">
              <div className="bg-white rounded-[44px] p-8 md:p-12 space-y-10">
                 <div className="flex items-center justify-between border-b border-slate-50 pb-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-widest flex items-center gap-3">
                       <Terminal size={18} className="text-indigo-600" /> Core Connection Links
                    </h3>
                 </div>

                 <div className="space-y-10">
                    <div className="space-y-3">
                       <div className="flex justify-between items-center px-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">MongoDB Link (MONGO_URI)</label>
                          <button onClick={() => setShowMongo(!showMongo)} className="text-indigo-500 hover:text-indigo-700 transition-all">
                             {showMongo ? <EyeOff size={16}/> : <Eye size={16}/>}
                          </button>
                       </div>
                       <input 
                         type={showMongo ? "text" : "password"}
                         value={form.MONGO_URI}
                         onChange={e => setForm({...form, MONGO_URI: e.target.value})}
                         className="w-full h-14 px-7 bg-slate-50 border border-slate-200 rounded-[22px] font-mono text-[10px] text-slate-500 outline-none focus:ring-8 focus:ring-indigo-50/50 shadow-inner"
                       />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Security Key (JWT_SECRET)</label>
                       <div className="relative">
                          <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input 
                            type="text"
                            value={form.JWT_SECRET}
                            onChange={e => setForm({...form, JWT_SECRET: e.target.value})}
                            className="w-full h-14 pl-14 pr-7 bg-slate-50 border border-slate-200 rounded-[22px] font-mono text-[10px] text-slate-500 outline-none focus:ring-8 focus:ring-indigo-50/50 shadow-inner"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Environment</label>
                          <select className="w-full h-14 px-6 bg-slate-50 border border-slate-200 rounded-[22px] font-black text-[10px] uppercase outline-none appearance-none">
                             <option>Production Server</option>
                             <option>Staging Test</option>
                             <option>Local Dev</option>
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">System Version</label>
                          <div className="w-full h-14 px-8 bg-slate-50 border border-slate-200 rounded-[22px] flex items-center font-black text-[10px] text-indigo-400 shadow-inner">v3.2.0-STABLE</div>
                       </div>
                    </div>
                 </div>
              </div>
           </section>
        </div>

        {/* Warning Card */}
        <div className="xl:col-span-4 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[48px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
              <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150"><Cpu size={120}/></div>
              <div className="relative z-10 space-y-8">
                 <div className="w-16 h-16 bg-amber-500 rounded-[24px] flex items-center justify-center text-white shadow-2xl animate-pulse"><AlertTriangle size={32}/></div>
                 <div>
                    <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-4 text-amber-400 leading-none">Security <br/> Warning.</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed italic opacity-90">
                       Changes to these settings will instantly affect the server. Errors can cause the website to stop working. Only make changes if you are sure.
                    </p>
                 </div>
              </div>

              <button 
                onClick={handleSave} disabled={saveLoading}
                className="relative z-10 w-full h-18 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                {saveLoading ? <Loader2 className="animate-spin" size={24}/> : <><ShieldCheck size={26} className="text-sky-400" /> Save Connection</>}
              </button>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {statusMsg && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white px-10 py-5 rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] z-[100] flex items-center gap-4 border border-white/10">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {statusMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatabaseManager;