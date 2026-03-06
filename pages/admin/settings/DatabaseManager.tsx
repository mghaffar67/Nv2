
import React, { useState } from 'react';
import { 
  Database, ShieldCheck, Key, Server, Eye, EyeOff, 
  RefreshCw, Save, AlertTriangle, Globe, Terminal,
  Lock, CheckCircle2, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
         <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Deployment & <span className="text-indigo-600">Database</span></h2>
            <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
               <Server size={16} className="text-indigo-500" /> Manage core connection strings and encryption nodes.
            </p>
         </div>
         <div className={clsx(
           "px-4 py-2 rounded-lg border flex items-center gap-2 shadow-sm",
           isConnected ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"
         )}>
            <div className={clsx("w-2 h-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isConnected ? "Linked" : "Offline"}
            </span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
           <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                   <Terminal size={20} />
                 </div>
                 <div>
                   <h3 className="text-base font-bold text-slate-900">Database Node</h3>
                   <p className="text-xs text-slate-500">MongoDB Atlas connection string (MONGO_URI)</p>
                 </div>
              </div>

              <div className="relative">
                 <input 
                   type={showMongo ? "text" : "password"}
                   value={form.MONGO_URI}
                   onChange={e => setForm({...form, MONGO_URI: e.target.value})}
                   className="w-full h-12 pl-4 pr-12 bg-white border border-slate-200 rounded-lg font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                 />
                 <button onClick={() => setShowMongo(!showMongo)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                   {showMongo ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-500" /> Errors will result in immediate system downtime.
              </p>
           </section>

           <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                   <Lock size={20} />
                 </div>
                 <div>
                   <h3 className="text-base font-bold text-slate-900">Security Encryption Key</h3>
                   <p className="text-xs text-slate-500">JWT_SECRET used for signing session tokens</p>
                 </div>
              </div>
              <input 
                type="text"
                value={form.JWT_SECRET}
                onChange={e => setForm({...form, JWT_SECRET: e.target.value})}
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg font-mono text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" /> High risk variable. Keep this secure.
              </p>
           </section>
        </div>

        <div className="lg:col-span-4">
           <section className="bg-slate-900 p-6 md:p-8 rounded-2xl text-white shadow-lg h-full flex flex-col justify-between border border-slate-800">
              <div>
                 <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-6">
                   <AlertTriangle size={24} />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">System Audit</h3>
                 <p className="text-sm text-slate-400 leading-relaxed mb-8">
                    Variable changes require a production node reboot. Unauthorized modification results in data fragmentation.
                 </p>
              </div>

              <button 
                onClick={handleSave} disabled={saveLoading}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {saveLoading ? <RefreshCw className="animate-spin" size={18} /> : <><Save size={18} /> Deploy Config</>}
              </button>
           </section>
        </div>
      </div>

      <AnimatePresence>
        {statusMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium text-sm shadow-xl z-[100] border border-slate-700 flex items-center gap-3"
          >
             <CheckCircle2 size={18} className="text-emerald-400" /> {statusMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatabaseManager;
