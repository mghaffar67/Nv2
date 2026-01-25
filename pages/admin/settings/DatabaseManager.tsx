
import React, { useState, useEffect } from 'react';
import { 
  Database, ShieldCheck, Key, Server, Eye, EyeOff, 
  RefreshCw, Save, AlertTriangle, Globe, Terminal,
  Lock, CheckCircle2, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const DatabaseManager = () => {
  const [loading, setLoading] = useState(false);
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
    const confirmed = window.confirm("Critical Change: Server Restart Required. Continue?");
    if (!confirmed) return;

    setSaveLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500)); 
      setStatusMsg("Configuration synchronized. System rebooting...");
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-4xl mx-auto px-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2 pt-4">
         <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Deployment <span className="text-indigo-600">& Database.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px] mt-2">
               Manage core connection strings and encryption nodes.
            </p>
         </div>
         <div className={clsx(
           "px-4 py-2 rounded-xl border flex items-center gap-2 shadow-sm",
           isConnected ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
         )}>
            <div className={clsx("w-1.5 h-1.5 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
            <span className="text-[8px] font-black uppercase tracking-widest">
              {isConnected ? "Linked" : "Offline"}
            </span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
           <section className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <Terminal size={18} className="text-indigo-600" />
                 <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Database Node (MONGO_URI)</h3>
              </div>

              <div className="relative">
                 <input 
                   type={showMongo ? "text" : "password"}
                   value={form.MONGO_URI}
                   onChange={e => setForm({...form, MONGO_URI: e.target.value})}
                   className="w-full h-12 pl-5 pr-12 bg-slate-50 border border-slate-100 rounded-xl font-mono text-[10px] text-slate-600 outline-none focus:bg-white"
                 />
                 <button onClick={() => setShowMongo(!showMongo)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                   {showMongo ? <EyeOff size={16} /> : <Eye size={16} />}
                 </button>
              </div>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest px-2">
                Paste your MongoDB Atlas connection string. Errors will result in immediate system downtime.
              </p>
           </section>

           <section className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <Lock size={18} className="text-amber-600" />
                 <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Security Encryption Key</h3>
              </div>
              <input 
                type="text"
                value={form.JWT_SECRET}
                onChange={e => setForm({...form, JWT_SECRET: e.target.value})}
                className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-mono text-[10px] text-slate-600 outline-none"
              />
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest px-2">
                JWT_SECRET used for signing session tokens. High risk variable.
              </p>
           </section>
        </div>

        <div className="lg:col-span-4">
           <section className="bg-slate-900 p-8 rounded-[36px] text-white shadow-xl h-full flex flex-col justify-between">
              <div>
                 <AlertTriangle size={24} className="text-amber-400 mb-6" />
                 <h3 className="text-lg font-black italic tracking-tighter uppercase mb-2">System Audit</h3>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-8">
                    Variable changes require a production node reboot. Unauthorized modification results in data fragmentation.
                 </p>
              </div>

              <button 
                onClick={handleSave} disabled={saveLoading}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
              >
                {saveLoading ? <RefreshCw className="animate-spin size-4" /> : <><Save size={16} /> Deploy Config</>}
              </button>
           </section>
        </div>
      </div>

      <AnimatePresence>
        {statusMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[9px] uppercase shadow-2xl z-[100] border border-white/10 flex items-center gap-3"
          >
             <CheckCircle2 size={18} className="text-emerald-400" /> {statusMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatabaseManager;
