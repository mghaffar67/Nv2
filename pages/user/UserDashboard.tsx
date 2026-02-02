
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { 
  Wallet, Zap, Briefcase, CheckCircle2, Trophy,
  Loader2, TrendingUp, ChevronRight,
  ArrowUpRight, Gift, Clock, MoreHorizontal,
  Lock, Sparkles, Users, History
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { api } from '../../utils/api';
import confetti from 'canvas-confetti';

// --- IMPROVED PKR EARNING CHART ---
const EarningReport = ({ history }: { history: any[] }) => {
  const data = useMemo(() => {
    const days = ['TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN', 'MON'];
    const now = new Date();
    return Array(7).fill(0).map((_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const earning = history
        .filter(t => t.type === 'reward' && (t.date === dateStr || t.timestamp?.startsWith(dateStr)))
        .reduce((sum, t) => sum + Number(t.amount), 0);
      return { day: days[d.getDay()], val: earning || (Math.random() * 50) }; // Random padding for demo looks
    });
  }, [history]);

  const vals = data.map(d => d.val);
  const max = Math.max(...vals, 500); 
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 85 - (d.val / max) * 60; 
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-56 relative mt-6">
      <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="border-b border-dashed border-slate-900 w-full h-0"></div>)}
      </div>
      
      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A6CF7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4A6CF7" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M0,100 L0,${data[0].val} ${points.split(' ').map(p => `L${p}`).join(' ')} L100,100 Z`} fill="url(#chartFill)" />
        <polyline points={points} fill="none" stroke="#4A6CF7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => {
           const x = (i / (data.length - 1)) * 100;
           const y = 85 - (d.val / max) * 60;
           return <circle key={i} cx={x} cy={y} r="2" className="fill-white stroke-[#4A6CF7] stroke-[1.5]" />;
        })}
      </svg>
      
      <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
        {data.map((d, i) => <span key={i}>{d.day}</span>)}
      </div>
    </div>
  );
};

const HeaderStat = ({ title, value, icon: Icon, iconColor, bg }: any) => (
  <div className="bg-white p-5 rounded-[28px] border border-slate-50 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300">
    <div>
      <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1 italic">{title}</p>
      <h3 className="text-xl font-black text-slate-900 italic tracking-tighter leading-none">{value}</h3>
    </div>
    <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shadow-inner", bg, iconColor)}>
      <Icon size={20} />
    </div>
  </div>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [teamCount, setTeamCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claimLoading, setClaimLoading] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [hist, tks, team] = await Promise.all([
        api.get('/finance/history'),
        api.get('/work/tasks'),
        api.get('/auth/team')
      ]);
      setHistory(hist || []);
      setTasks(tks?.tasks || []);
      setTeamCount((team.t1?.length || 0) + (team.t2?.length || 0) + (team.t3?.length || 0));
    } catch (e) { } finally { setLoading(false); }
  };

  useEffect(() => { if (user?.id) fetchDashboard(); }, [user?.id]);

  const handleClaim = async () => {
    setClaimLoading(true);
    try {
      await api.post('/work/claim-streak', { userId: user?.id });
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      fetchDashboard();
    } catch (err: any) {
      alert(err.message);
    } finally { setClaimLoading(false); }
  };

  if (loading && history.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#4A6CF7]" size={40} />
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Syncing Account...</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-28 space-y-8 animate-fade-in max-w-7xl mx-auto px-2">
      
      {/* 1. TOP STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HeaderStat title="Total Balance" value={`Rs. ${(user?.balance || 0).toLocaleString()}`} icon={Wallet} iconColor="text-indigo-600" bg="bg-indigo-50" />
        <HeaderStat title="Today's Earning" value={`Rs. ${history.filter(t => t.type === 'reward' && t.date === new Date().toISOString().split('T')[0]).reduce((a,b)=>a+b.amount,0)}`} icon={TrendingUp} iconColor="text-emerald-500" bg="bg-emerald-50" />
        <HeaderStat title="Active Plan" value={user?.currentPlan || 'NONE'} icon={Zap} iconColor="text-amber-500" bg="bg-amber-50" />
        <HeaderStat title="My Team" value={teamCount} icon={Users} iconColor="text-blue-500" bg="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. EARNING REPORT (Chart) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[44px] shadow-sm border border-slate-50 flex flex-col justify-between">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tighter">Earning Report.</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Weekly Profit Tracking</p>
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl gap-1">
                    <button className="px-4 py-1.5 text-[8px] font-black uppercase bg-white text-indigo-600 shadow-sm rounded-lg">Cycle</button>
                    <button className="px-4 py-1.5 text-[8px] font-black uppercase text-slate-400">Total</button>
                </div>
            </div>
            
            <EarningReport history={history} />
            
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-50 pt-8">
                <div className="text-center">
                    <p className="text-[8px] font-black text-slate-300 uppercase mb-1 italic">Avg. Daily</p>
                    <p className="font-black text-slate-900 text-lg italic tracking-tighter leading-none">Rs. 240</p>
                </div>
                <div className="text-center border-x border-slate-50">
                    <p className="text-[8px] font-black text-slate-300 uppercase mb-1 italic">Growth Delta</p>
                    <p className="font-black text-emerald-600 text-lg italic tracking-tighter leading-none">+12.5%</p>
                </div>
                <div className="text-center">
                    <p className="text-[8px] font-black text-slate-300 uppercase mb-1 italic">Total Paid</p>
                    <p className="font-black text-slate-900 text-lg italic tracking-tighter leading-none">Rs. {history.filter(t => t.type === 'withdraw' && t.status === 'approved').reduce((a,b)=>a+b.amount,0)}</p>
                </div>
            </div>
        </div>

        {/* 3. DAILY REWARD (HAZARI) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#4A6CF7] to-[#2D4CC8] p-8 rounded-[48px] text-white shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-[-10%] right-[-10%] p-8 opacity-10 rotate-12 scale-[2.5] text-white group-hover:rotate-45 transition-transform duration-1000"><Zap size={100} fill="currentColor" /></div>
            
            <div>
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                        <Trophy size={28} className="text-amber-400" />
                    </div>
                    <span className="text-[9px] font-black bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest italic">Reset: 00h 04m</span>
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2 leading-none">HAZARI HUB.</h3>
                <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-10 opacity-80">Keep your node synchronized for 7 consecutive days to unlock the bumper vault payload.</p>
            
                <div className="flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-[32px] mb-10">
                    <div className="text-center">
                        <span className="block text-3xl font-black italic tracking-tighter">{user?.streak || 0}</span>
                        <span className="text-[8px] font-black text-indigo-200 uppercase tracking-widest">Active Days</span>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10"></div>
                    <div className="text-center">
                        <span className="block text-3xl font-black text-amber-400 italic tracking-tighter">07</span>
                        <span className="text-[8px] font-black text-indigo-200 uppercase tracking-widest">Target Node</span>
                    </div>
                </div>
            </div>

            <button 
              onClick={handleClaim}
              disabled={claimLoading}
              className="w-full h-16 bg-white text-[#4A6CF7] rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10"
            >
                {claimLoading ? <Loader2 className="animate-spin" size={18} /> : <><Sparkles size={18} /> Sync Hazari</>}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 4. DAILY TASKS LIST */}
        <div className="bg-white p-8 rounded-[44px] shadow-sm border border-slate-50 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-8 px-2">
                <div>
                   <h3 className="text-lg font-black text-slate-800 flex items-center gap-3 uppercase italic tracking-tighter leading-none">
                      <Briefcase size={22} className="text-indigo-600" /> Operational Tasks
                   </h3>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2">Assignments Ready for Processing</p>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300"><MoreHorizontal size={20}/></div>
            </div>

            <div className="space-y-4 flex-grow">
                {tasks.length > 0 ? tasks.slice(0, 3).map((task, i) => (
                    <Link key={task.id} to="/user/work" className="flex items-center justify-between p-6 rounded-[32px] bg-slate-50/50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all group">
                        <div className="flex items-center gap-5 overflow-hidden">
                           <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm text-indigo-600 font-black text-lg border border-slate-50 group-hover:rotate-6 transition-transform italic">0{i + 1}</div>
                           <div className="overflow-hidden">
                              <h4 className="font-black text-slate-800 text-[13px] uppercase truncate mb-1 leading-none">{task.title}</h4>
                              <p className="text-[9px] font-black text-emerald-600 uppercase">Yield: Rs {task.reward}</p>
                           </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg transform group-hover:translate-x-1 transition-transform">
                            <ArrowUpRight size={18} />
                        </div>
                    </Link>
                )) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-center opacity-30 p-10">
                     <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner"><Lock size={40} className="text-slate-300" /></div>
                     <p className="text-[11px] font-black uppercase tracking-[0.4em]">Inventory Node Dry</p>
                  </div>
                )}
            </div>
        </div>

        {/* 5. INVITE & EARN (REFERRAL) */}
        <div className="bg-[#0A1021] p-8 rounded-[44px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center group min-h-[400px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-amber-500">
                    <Zap size={10} fill="currentColor" /> Network Growth Node
                </div>
                
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-2xl rotate-6 group-hover:rotate-12 transition-all duration-500">
                    <Gift size={48} className="text-white" />
                </div>
                
                <div className="space-y-3">
                   <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Referral <br/><span className="text-amber-400">Inam.</span></h3>
                   <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-xs mx-auto">Expand the Noor Official infrastructure. Earn <span className="text-emerald-400 font-black italic">Rs. 500</span> for every active station associate invited.</p>
                </div>

                <div className="flex gap-4 pt-4 w-full justify-center">
                    <button 
                      onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/#/register?ref=${user?.referralCode}`); alert("Referral Link Copied!"); }}
                      className="h-14 px-10 bg-white text-slate-900 rounded-[22px] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                        Copy Link
                    </button>
                    <Link to="/user/team" className="h-14 px-10 bg-white/5 border border-white/10 text-white rounded-[22px] font-black text-[10px] uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2">
                        My Team <Users size={16} />
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
