
import React from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { 
  Monitor, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ArrowRight,
  MonitorOff
} from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const { config, updateConfig } = useConfig();

  const handleSlideUpdate = (index: number, key: string, value: string) => {
    const newSlides = [...config.appearance.heroSlides];
    (newSlides[index] as any)[key] = value;
    updateConfig({ appearance: { ...config.appearance, heroSlides: newSlides } });
  };

  const addSlide = () => {
    updateConfig({ 
      appearance: { 
        ...config.appearance, 
        heroSlides: [...config.appearance.heroSlides, { image: '', title: 'New Catchy Title', subtitle: 'Add descriptive subtext here' }] 
      } 
    });
  };

  const removeSlide = (index: number) => {
    const newSlides = config.appearance.heroSlides.filter((_, i) => i !== index);
    updateConfig({ appearance: { ...config.appearance, heroSlides: newSlides } });
  };

  return (
    <div className="space-y-8 pb-20">
      <section className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-2">
              <Monitor size={18} /> Hero Engine CMS
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management for Landing Page Experience</p>
          </div>
          <button 
            onClick={addSlide}
            className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center shadow-lg shadow-sky-50"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-8">
          {config.appearance.heroSlides.length > 0 ? config.appearance.heroSlides.map((slide, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={idx} 
              className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 relative group"
            >
              <button 
                onClick={() => removeSlide(idx)}
                className="absolute -top-3 -right-3 w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:rotate-90"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <div className="aspect-[16/10] bg-white rounded-[32px] border-2 border-dashed border-slate-200 overflow-hidden relative mb-4">
                     {slide.image ? (
                       <img src={slide.image} alt="Preview" className="w-full h-full object-cover" />
                     ) : (
                       <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-3">
                          <ImageIcon size={32} />
                          <span className="text-[9px] font-black uppercase">No Image Set</span>
                       </div>
                     )}
                  </div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Background URL</label>
                  <input 
                    type="url" 
                    value={slide.image}
                    onChange={(e) => handleSlideUpdate(idx, 'image', e.target.value)}
                    className="w-full p-4 bg-white border border-slate-100 rounded-2xl font-mono text-[10px] outline-none"
                    placeholder="https://images.unsplash..."
                  />
                </div>
                <div className="lg:col-span-8 space-y-6">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Headline (Large Bold)</label>
                    <input 
                      type="text" 
                      value={slide.title}
                      onChange={(e) => handleSlideUpdate(idx, 'title', e.target.value)}
                      className="w-full p-5 bg-white border border-slate-100 rounded-[24px] font-black text-lg outline-none focus:ring-4 focus:ring-sky-50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Subtext / Description</label>
                    <textarea 
                      rows={3}
                      value={slide.subtitle}
                      onChange={(e) => handleSlideUpdate(idx, 'subtitle', e.target.value)}
                      className="w-full p-5 bg-white border border-slate-100 rounded-[24px] font-bold text-xs text-slate-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="py-24 text-center border-4 border-dashed border-slate-100 rounded-[44px]">
               <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                 <MonitorOff size={40} />
               </div>
               <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-xs">No Slider Content Found</p>
               <button onClick={addSlide} className="mt-6 text-sky-500 font-black text-[10px] uppercase tracking-widest hover:underline">Click to add first slide</button>
            </div>
          )}
        </div>
      </section>

      <div className="p-8 bg-sky-900 rounded-[44px] text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150"><ImageIcon size={64} /></div>
         <div className="relative z-10">
            <h3 className="text-xl font-black mb-1">Visual Preview Engine</h3>
            <p className="text-sky-400 text-[10px] font-bold uppercase tracking-widest">Changes sync instantly to home page cache</p>
         </div>
         <button className="h-14 px-8 bg-white text-slate-900 rounded-[24px] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl active:scale-95 transition-all">
           Go to Home <ArrowRight size={16} />
         </button>
      </div>
    </div>
  );
};

export default HeroSection;
