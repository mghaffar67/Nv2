
import React from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { 
  Palette, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Monitor,
  Upload,
  Zap,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const WebAppearance = () => {
  const { config, updateConfig } = useConfig();

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newSlides = [...config.appearance.heroSlides];
        newSlides[index].image = reader.result as string;
        updateConfig({ appearance: { ...config.appearance, heroSlides: newSlides } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSlideUpdate = (index: number, key: string, value: string) => {
    const newSlides = [...config.appearance.heroSlides];
    (newSlides[index] as any)[key] = value;
    updateConfig({ appearance: { ...config.appearance, heroSlides: newSlides } });
  };

  const addSlide = () => {
    updateConfig({ 
      appearance: { 
        ...config.appearance, 
        heroSlides: [...config.appearance.heroSlides, { image: '', title: 'New Slide', subtitle: 'Add subtext here' }] 
      } 
    });
  };

  const removeSlide = (index: number) => {
    const newSlides = config.appearance.heroSlides.filter((_, i) => i !== index);
    updateConfig({ appearance: { ...config.appearance, heroSlides: newSlides } });
  };

  return (
    <div className="space-y-4 md:space-y-8 pb-20 px-1 md:px-0">
      <div className="bg-slate-950 p-6 md:p-8 rounded-[32px] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12"><Monitor size={64} /></div>
        <h2 className="text-xl font-black mb-1 uppercase italic tracking-tighter">Hero CMS.</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Manage visual landing assets.</p>
      </div>

      <div className="flex justify-between items-center px-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Carousel Nodes</h2>
        <button onClick={addSlide} className="h-9 px-5 bg-sky-500 text-white rounded-xl text-[9px] font-black uppercase flex items-center gap-2 active:scale-95 shadow-lg shadow-sky-100"><Plus size={14}/> Add Frame</button>
      </div>

      <div className="space-y-4">
        {config.appearance.heroSlides.map((slide, idx) => (
          <div key={idx} className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm space-y-4 relative group">
            <button onClick={() => removeSlide(idx)} className="absolute -top-1 -right-1 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:rotate-90 transition-all"><Trash2 size={14}/></button>
            
            <div className="relative h-44 bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center gap-3">
               {slide.image ? (
                 <img src={slide.image} className="w-full h-full object-cover" />
               ) : (
                 <>
                   <ImageIcon size={32} className="text-slate-200" />
                   <span className="text-[8px] font-black uppercase text-slate-300">No Media Node</span>
                 </>
               )}
               <input type="file" onChange={(e) => handleFileUpload(idx, e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
               <div className="absolute bottom-4 bg-slate-900/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-[8px] font-black uppercase flex items-center gap-2 border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"><Upload size={10}/> Change Image</div>
            </div>

            <div className="space-y-3 px-1">
               <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Primary Headline</label>
                  <input type="text" value={slide.title} onChange={e => handleSlideUpdate(idx, 'title', e.target.value)} className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs text-slate-800 outline-none" />
               </div>
               <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Description Sub-Text</label>
                  <input type="text" value={slide.subtitle} onChange={e => handleSlideUpdate(idx, 'subtitle', e.target.value)} className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-[10px] text-slate-500 outline-none" />
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 px-1">
         <button onClick={() => alert('CMS Synchronized')} className="w-full h-14 bg-slate-950 text-white rounded-[22px] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"><Save size={18}/> Deploy to Production</button>
      </div>
    </div>
  );
};

export default WebAppearance;
