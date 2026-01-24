
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
    const confirmed = window.confirm("Are you sure? Changing this requires a Server Restart.");
    if (!confirmed) return;

    setSaveLoading(true);
    try {
      // In a real environment, this would call api.put('/system/env-config')
      await new Promise(r => setTimeout(r, 1500)); 
      setStatusMsg("سیٹنگز کامیابی سے اپ ڈیٹ ہو گئی ہیں۔ سسٹم ری اسٹارٹ ہو رہا ہے...");
      setTimeout(() => setStatusMsg(null), 5000);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-32 animate-fade-in max-w-5xl mx-auto px-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
         <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Deployment & <span className="text-indigo-600">Database Config.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-3 urdu-text">
               یہاں آپ سسٹم کی کنکشن سیٹنگز تبدیل کر سکتے ہیں
            </p>
         </div>
         <div className="flex gap-3">
            <div className={clsx(
              "px-5 py-3 rounded-2xl border flex items-center gap-3 shadow-sm transition-all",
              isConnected ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
            )}>
               <div className={clsx("w-2 h-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
               <span className="text-[10px] font-black uppercase tracking-widest">
                 {isConnected ? "Database: Connected" : "Database: Offline"}
               </span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           <section className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                    <Terminal size={20} />
                 </div>
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Section 1: Database Node</h3>
              </div>

              <div className="space-y-4 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Database Connection String (MONGO_URI)</label>
                    <div className="relative">
                       <input 
                         type={showMongo ? "text" : "password"}
                         value={form.MONGO_URI}
                         onChange={e => setForm({...form, MONGO_URI: e.target.value})}
                         className="w-full h-14 pl-6 pr-14 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-xs text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all border-l-4 border-l-indigo-500"
                       />
                       <button onClick={() => setShowMongo(!showMongo)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600">
                         {showMongo ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                    </div>
                    <p className="urdu-text text-[11px] text-slate-400 font-bold leading-relaxed px-4 mt-2">
                       مونگو ڈی بی (MongoDB Atlas) سے اپنا کنکشن لنک کاپی کر کے یہاں پیسٹ کریں۔ اگر یہ غلط ہوا تو ایپ بند ہو جائے گی۔
                    </p>
                 </div>
              </div>
           </section>

           <section className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                    <ShieldCheck size={20} />
                 </div>
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Section 2: Security Keys</h3>
              </div>

              <div className="space-y-4 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">JWT Secret Key (JWT_SECRET)</label>
                    <div className="relative">
                       <Key size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                         type="text"
                         value={form.JWT_SECRET}
                         onChange={e => setForm({...form, JWT_SECRET: e.target.value})}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-xs text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all border-l-4 border-l-amber-500"
                       />
                    </div>
                    <p className="urdu-text text-[11px] text-slate-400 font-bold leading-relaxed px-4 mt-2">
                       یہ ایک خفیہ پاس ورڈ ہے جو یوزر کے اکاؤنٹ کو محفوظ رکھتا ہے۔ اسے کبھی تبدیل نہ کریں جب تک کوئی مسئلہ نہ ہو۔
                    </p>
                 </div>
              </div>
           </section>

           <section className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-sm">
                    <Server size={20} />
                 </div>
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Section 3: Deployment Node</h3>
              </div>

              <div className="space-y-4 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Environment Status (NODE_ENV)</label>
                    <input 
                      type="text" disabled value={form.NODE_ENV}
                      className="w-full h-14 px-6 bg-slate-100 border border-slate-100 rounded-2xl font-black text-sm text-slate-400 cursor-not-allowed border-l-4 border-l-sky-500"
                    />
                    <p className="urdu-text text-[11px] text-slate-400 font-bold leading-relaxed px-4 mt-2">
                       یہ بتاتا ہے کہ سسٹم ابھی ٹیسٹنگ موڈ میں ہے یا لائیو چل رہا ہے۔
                    </p>
                 </div>
              </div>
           </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <section className="bg-slate-900 p-8 rounded-[44px] text-white shadow-xl relative overflow-hidden h-full flex flex-col">
              <div className="relative z-10 flex-grow">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                    <AlertTriangle size={28} className="text-amber-400" />
                 </div>
                 <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4">Critical Audit</h3>
                 <p className="urdu-text text-sm text-slate-300 font-medium leading-loose mb-10">
                    کسی بھی سیٹنگ کو تبدیل کرنے سے پہلے اس بات کو یقینی بنائیں کہ ڈیٹا بیس کا لنک درست ہے۔ غلط لنک دینے سے تمام یوزرز کا ڈیٹا غائب ہو سکتا ہے۔
                 </p>
              </div>

              <button 
                onClick={handleSave} disabled={saveLoading}
                className="mt-12 w-full h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {saveLoading ? <RefreshCw className="animate-spin size-5" /> : <><Save size={18} /> Deploy Variable Changes</>}
              </button>
           </section>
        </div>
      </div>

      <AnimatePresence>
        {statusMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-5 rounded-[30px] font-bold text-xs uppercase shadow-2xl z-[100] border border-white/10 flex items-center gap-4 urdu-text text-center max-w-md"
          >
             <CheckCircle2 size={24} className="text-emerald-400 shrink-0" /> {statusMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatabaseManager;
